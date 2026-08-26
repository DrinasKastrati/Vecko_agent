#!/usr/bin/env node
/* ============================================================
   Watchdog (LLM-FRITT, inga tokens). Flaggar TYSTA fel:
   - state/prices.json äldre än 26 h på en vardag (pris-actionen nere)
   - dagens nordiska rapport saknas (routinen/appen har inte kört,
     eller inget har pushats)
   - dagens scout-rapport saknas
   - state/alerts.json:s checkedAt äldre än 6 h på en vardag (intradag-
     monitorn nere – utan den larmar inget mellan routinekörningarna)
   Skriver problemlista till $RUNNER_TEMP/watchdog.json; watchdog.yml
   öppnar issues (med dedupe mot redan öppna).
   ============================================================ */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { staleCandidates } from "./validate-scout-candidates.mjs";
import { postCatalystQuote } from "./refresh-candidate-prices.mjs";

// Senaste rapportdatum (yymmdd) bland filnamn med givet prefix, eller null.
export function latestReportDate(files, prefix){
  let best = null;
  for (const f of files || []){
    const m = String(f).match(new RegExp("^" + prefix + "-(\\d{6})(?:_\\d+)?\\.md$", "i"));
    if (m && (!best || m[1] > best)) best = m[1];
  }
  return best;
}

// Ren funktion (testas i tests/run.mjs): avgör vilka larm som ska öppnas.
// latestDecisionDate/newsGeneratedAt är valfria – utelämnas de görs ingen
// kontroll (håller äldre anrop bakåtkompatibla).
export function checkStale(opts){
  const { now, pricesGeneratedAt, latestDaily, latestWeekly, latestScout } = opts;
  const problems = [];
  const n = now instanceof Date ? now : new Date(now);
  const dow = n.getUTCDay();
  const weekday = dow >= 1 && dow <= 5;
  if (!weekday) return problems; // helg: allt får vara tyst
  const today = String(n.getUTCFullYear()).slice(2) +
    String(n.getUTCMonth() + 1).padStart(2, "0") +
    String(n.getUTCDate()).padStart(2, "0");

  const t = pricesGeneratedAt ? Date.parse(pricesGeneratedAt) : NaN;
  if (isNaN(t) || (n.getTime() - t) > 26 * 3600 * 1000)
    problems.push({ key: "prices", title: "Watchdog: prices.json är inaktuell",
      body: "`state/prices.json` har generatedAt `" + (pricesGeneratedAt || "saknas") +
        "` (äldre än 26 h på en vardag). Kontrollera Actions → \"Hämta kurser (prices.json)\" – " +
        "utan färska kurser AVVAKTAR routinen korrekt men fattar inga kursbaserade beslut." });

  const nordic = [latestDaily, latestWeekly].filter(Boolean).sort().pop() || null;
  if (nordic !== today)
    problems.push({ key: "daily", title: "Watchdog: dagens nordiska rapport saknas",
      body: "Ingen daglig-/veckorapport för idag är pushad (senaste: " + (nordic || "ingen") + "). " +
        "Vanligaste orsakerna: Claude-appen var inte igång vid 08:40, eller rapporten är skriven " +
        "lokalt men inte pushad (kör push.bat / kontrollera auto-push-tasken)." });

  if (latestScout !== today)
    problems.push({ key: "scout", title: "Watchdog: dagens scout-rapport saknas",
      body: "Ingen scout-rapport för idag är pushad (senaste: " + (latestScout || "ingen") + "). " +
        "Var Claude-appen igång vid 07:47? Är rapporten skriven men inte pushad?" });

  // Beslutsloggen: en pushad rapport UTAN motsvarande rad i decisions.json betyder
  // att routinen hoppade över loggningen – då dör kalibreringsunderlaget tyst.
  if ("latestDecisionDate" in opts && nordic === today && opts.latestDecisionDate !== today)
    problems.push({ key: "decisions", title: "Watchdog: beslutsloggen saknar dagens rader",
      body: "Dagens rapport är pushad men `state/decisions.json` har ingen rad för idag (senaste: " +
        (opts.latestDecisionDate || "ingen") + "). Rotationsprompterna kräver en rad per beslut, " +
        "även AVVAKTA – utan dem kan retrons beslutsstatistik aldrig kalibrera poängvikterna." });

  // Intradag-monitorn: alerts.mjs stämplar checkedAt minst var 3:e timme under
  // börstid (07-20 UTC vardagar). Watchdogen kör 10:30 UTC, då är färskaste
  // tillåtna hjärtslag ~3,5 h gammalt – 6 h ger marginal och fångar ändå en
  // monitor som dött. Kontrollen finns för att en tyst död monitor annars är
  // OSYNLIG: filen ser likadan ut som "frisk monitor utan signaler".
  if ("alertsCheckedAt" in opts){
    const at = opts.alertsCheckedAt ? Date.parse(opts.alertsCheckedAt) : NaN;
    if (isNaN(at) || (n.getTime() - at) > 6 * 3600 * 1000)
      problems.push({ key: "alerts", title: "Watchdog: intradag-monitorn har tystnat",
        body: "`state/alerts.json` har checkedAt `" + (opts.alertsCheckedAt || "saknas") +
          "` (äldre än 6 h på en vardag). Kontrollera Actions → \"Intradag-monitor\". " +
          "Utan monitorn larmar ingenting när ett innehav korsar stop-loss eller mål " +
          "mellan routinekörningarna. Saknas fältet helt kör actionen en version av " +
          "`alerts.mjs` som är äldre än hjärtslags-fixen." });
  }

  // Veckans rörelser: movers.yml kör lördagar. Filen är miss-retrons PRIMÄRA missdetektion,
  // så en död action gör att retron tyst tappar hela sin breddsökning. 9 dygn = en hel
  // lördagskörning har uteblivit (7 dygn + marginal för sen körning).
  if ("moversGeneratedAt" in opts){
    const mt = opts.moversGeneratedAt ? Date.parse(opts.moversGeneratedAt) : NaN;
    if (isNaN(mt) || (n.getTime() - mt) > 9 * 24 * 3600 * 1000)
      problems.push({ key: "movers", title: "Watchdog: movers.json är inaktuell",
        body: "`state/movers.json` har generatedAt `" + (opts.moversGeneratedAt || "saknas") +
          "` (äldre än 9 dygn). Kontrollera Actions → \"Veckans rörelser\". Utan filen faller " +
          "miss-retron tillbaka på `price_history.json`, som bara täcker de ~10 bevakade " +
          "nordiska tickerna och därför per konstruktion inte kan hitta en miss utanför dem." });
  }

  // `asOf` ÄR INTE `generatedAt` (fix 2026-08-26). Kontrollen ovan mäter att KÖRNINGEN blev av;
  // den säger ingenting om vilken dags stängningar filen faktiskt bär. Lördagscronen
  // ("0 6 * * 6") har levererat i tid varje vecka OCH ändå burit torsdagens data: 2026-08-22
  // stod `generatedAt` 2026-08-22T06:34:35Z med `asOf` 2026-08-20, medan sista handelsdag var
  // fredagen 2026-08-21. Följden är att en nordisk vinnare som toppar först på fredagen per
  // konstruktion aldrig kan synas i missdetektionen. Defekten är rapporterad minst fem gånger
  // i retro-/veckorapporterna utan att något larmade – därför att ingen kontroll läste fältet.
  // Tröskeln är 2 dygn mellan `asOf` och `generatedAt`. Den är mätt, inte gissad: en
  // lördagskörning som bär FREDAGENS stängning ger 1,27 dygn, och det verkliga felfallet
  // 2026-08-22 (torsdagens stängning) gav 2,27. Ett tredje dygn hade släppt igenom precis
  // det utfall kontrollen finns för. KÄND FALSKPOSITIV: är fredagen en helgdag är torsdagens
  // stängning korrekt och larmet obefogat – texten säger därför vad som ska kontrolleras
  // i stället för att påstå att något är trasigt. Watchdogen är tyst på helger
  // (checkStale returnerar tidigt), så larmet kommer måndagen efter körningen.
  if (opts.moversAsOf && opts.moversGeneratedAt){
    const a = Date.parse(opts.moversAsOf), g = Date.parse(opts.moversGeneratedAt);
    if (!isNaN(a) && !isNaN(g) && (g - a) > 2 * 24 * 3600 * 1000)
      problems.push({ key: "movers-asof", title: "Watchdog: movers.json bär för gamla stängningar",
        body: "`state/movers.json` har `asOf` `" + opts.moversAsOf + "` men `generatedAt` `" +
          opts.moversGeneratedAt + "` – alltså mer än 3 dygn mellan datat och körningen. " +
          "Actionen kör i tid, men på en för gammal session: en rörelse som toppar på den " +
          "sista handelsdagen före körningen kan då aldrig synas i miss-retrons primära " +
          "missdetektion. Åtgärd: utöka fönstret i `movers.mjs` eller flytta lördagscronen " +
          "senare på dygnet." });
  }

  // Nyhetsflödet: news.yml kör varannan timme vardagar, så >6 h = actionen är nere.
  if ("newsGeneratedAt" in opts){
    const nt = opts.newsGeneratedAt ? Date.parse(opts.newsGeneratedAt) : NaN;
    if (isNaN(nt) || (n.getTime() - nt) > 6 * 3600 * 1000)
      problems.push({ key: "news", title: "Watchdog: news_feed.json är inaktuell",
        body: "`state/news_feed.json` har generatedAt `" + (opts.newsGeneratedAt || "saknas") +
          "` (äldre än 6 h på en vardag). Kontrollera Actions → \"Hämta nyheter\" och " +
          "`feeds`-statusen i filen – routinerna använder den som PRIMÄR nyhetsradar." });
  }

  // REGIMFILTRET: sedan 2026-08-03 öppnar rotationerna INGA nya positioner när
  // indexet ligger under sitt MA200 – och behandlar "går inte att beräkna" som AV.
  // Det gör indexserien i price_history.json till en TYST SPÄRR för hela boken:
  // faller ^OMX eller ^GSPC ur pris-hämtningen, eller trimmas serien under 200
  // punkter, slutar boken ta nya positioner utan att något går fel någonstans.
  // Ingen annan kontroll fångar det, och en rapport som skriver "regimen är AV"
  // ser exakt likadan ut oavsett om marknaden är svag eller datat saknas.
  if (opts.regimeSeries){
    for (const [sym, len] of Object.entries(opts.regimeSeries)){
      const n200 = Number(len) || 0;
      if (n200 >= 200) continue;
      problems.push({ key: "regime-" + sym, title: "Watchdog: regimfiltret kan inte mätas för " + sym,
        body: "`state/price_history.json` har " + n200 + " daterade stängningar för `" + sym +
          "` – MA200 kräver 200. Rotationsprompternas punkt 2b behandlar en oberäknelig regim " +
          "som **AV**, alltså öppnas INGA nya positioner i den boken, och rapporten kan inte " +
          "skilja det från en genuint svag marknad. Kontrollera att symbolen finns i " +
          "`config/watchlist.txt`/`watchlist_us.txt` och att `prices.yml` hämtar den; " +
          "backfilla annars serien (`fetch-prices.mjs` behåller 250 punkter)." });
    }
  }

  // NYHETSFÖNSTRET: prompterna kräver 5 handelsdagar ur news_feed.json. Fönstret var
  // tidigare 48 timmar och kollapsade över helgen till 47 minuter utan att något
  // larmade – filen såg färsk ut, för generatedAt var minuter gammal. Färskhet och
  // TÄCKNING är alltså två olika saker, och bara den första kontrollerades.
  if (opts.newsWindow){
    const w = opts.newsWindow;
    const covered = Number(w.tradingDaysCovered) || 0;
    if (covered < 5)
      problems.push({ key: "news-window", title: "Watchdog: nyhetsfönstret bär bara " + covered + " handelsdagar",
        body: "`state/news_feed.json` täcker " + covered + " av " + (w.tradingDays || "?") +
          " handelsdagar" + (w.missingDays && w.missingDays.length ? " (saknar " +
          w.missingDays.slice(0, 6).join(", ") + ")" : "") + ". Prompternas punkt 1g0 kräver 5 " +
          "handelsdagar för den nyhetsdrivna kandidatgenereringen. Filen kan vara FÄRSK och " +
          "ändå för tunn – det är två olika fel. Kontrollera `feeds`-statusen och att " +
          "`fetch-news.mjs` kör med handelsdagsfönstret (fältet `window` ska finnas)." });
  }

  return problems;
}

/* Rader per bok för ett givet datum i decisions.json. Används av
   bruttolist-spärren nedan. */
export function decisionRowsOn(db, isoDate, book){
  const rows = (db && db.decisions) || [];
  return rows.filter(r => r && r.date === isoDate && (!book || r.book === book));
}

/* BRUTTOLIST-SPÄRREN (2026-08-04).

   Regeln "logga HELA bruttolistan i LÄGE A" har stått i båda rotationsprompterna
   sedan 2026-08-03 och följdes ändå inte: us-veckorapport-260803 avvisade
   tretton namn i prosa (AAPL/META/COIN/HCA/NOC/MS/INTC/TSLA/MU/AMD/TSM/AVGO/NVDA)
   men skrev bara två AVVAKTA-rader. INTC och AMD finns därför noll gånger i
   decisions.json, och `decision_eval.mjs` kan inte mäta om urvalsfiltret var för
   strängt – vilket är precis vad filen finns till för.

   En mening till i prompten hade inte hjälpt; regeln fanns redan. Det här är
   tripwiren i stället: en LÄGE A-körning (måndag) som producerar färre än
   `minRows` rader för en bok har nästan säkert loggat de valda och struntat i de
   avvisade. Tröskeln är medvetet LÅG – prompten kräver 10–15 kandidater, så 6
   flaggar bara det uppenbara fallet och ger inga falsklarm på en vecka med få
   kandidater. */
export function checkGrossList(opts){
  const { isoDate, isMonday, decisionsDb, minRows = 6 } = opts || {};
  const problems = [];
  if (!isMonday || !isoDate || !decisionsDb) return problems;
  for (const book of ["nordic", "us"]){
    const rows = decisionRowsOn(decisionsDb, isoDate, book);
    // Ingen rad alls = boken kördes förmodligen inte; det fångas av "decisions"-
    // kontrollen ovan och ska inte dubbelrapporteras här.
    if (!rows.length) continue;
    if (rows.length < minRows)
      problems.push({ key: "grosslist-" + book, title:
        `Watchdog: ${book}-boken loggade bara ${rows.length} beslut i veckorotationen`,
        body: "LÄGE A ska logga HELA bruttolistan (10–15 kandidater), inte bara de valda – varje " +
          "bortfallen kandidat som en `AVVAKTA`-rad med den namngivna spärren i `reason`. " +
          `Bara ${rows.length} rad(er) för ${isoDate} i \`state/decisions.json\`. De avvisade är det ` +
          "KONTRAFAKTISKA underlaget i `state/decision_eval.json`: utan dem går det inte att mäta " +
          "om urvalsfiltret är för strängt. Det här hände 2026-08-03 (13 avvisade i prosa, 2 rader)." });
  }
  return problems;
}

/* SCOUT-KANDIDATER SOM ALDRIG FICK ETT AVGÖRANDE.
   Detta är samma tystnad som gjorde att Palantir kunde flaggas tre dagar i rad
   utan att någon bok tog ställning. Kandidatfilen gör den mätbar. */
export function checkScoutCandidates(opts){
  const { candidatesDb, today, staleFn } = opts || {};
  const problems = [];
  if (!candidatesDb) return problems;
  const stale = staleFn ? staleFn(candidatesDb, today) : [];
  if (stale.length)
    problems.push({ key: "scout-candidates", title:
      `Watchdog: ${stale.length} scout-kandidat(er) gick ut utan avgörande`,
      body: "Följande kandidater i `state/scout_candidates.json` passerade `expiresAt` med " +
        "status `new` – ingen bok avfärdade eller köpte dem:\n\n" +
        stale.map(c => `- **${c.id}** (${c.book}, flaggad ${c.date}, gick ut ${c.expiresAt}): ${c.thesis || ""}`).join("\n") +
        "\n\nRotationsprompternas punkt 2d kräver ett avgörande per kandidat och körning. " +
        "En kandidat som tystnar är exakt buggen filen byggdes för att göra omöjlig." });
  return problems;
}

/* ANALYSKÖN. Kön FYLLS av ett nyckellöst Action men TÖMS av en manuell
   arbetare (`prompts/analysprompt.md`, körs i Cowork). Blir en begäran
   liggande händer ingenting alls: issuet är redan kvitterat och stängt,
   `analysis_queue.json` får en ny tidsstämpel av varje annan post, dashboarden
   ser normal ut och ingen fil blir "gammal" i den mening de andra
   kontrollerna mäter. SAAB.ST låg pending från 2026-07-14 till 2026-08-07 –
   24 dygn – utan att något larmade, för ingenting mätte köns ÅLDER.

   Tröskeln är medvetet generös: arbetaren körs för hand och ska inte larma
   över en helg eller en semestervecka. Oläsbar `requestedAt` larmar INTE –
   watchdogen ska göra tysta fel hörbara, inte skapa nya av trasig indata. */
export function checkAnalysisQueue(opts){
  const { queueDb, now, maxAgeDays = 14 } = opts || {};
  const problems = [];
  const pending = (queueDb && queueDb.pending) || [];
  if (!pending.length) return problems;
  const nowMs = Date.parse(now);
  if (!Number.isFinite(nowMs)) return problems;

  /* En post som redan ligger i `done` är ett ANNAT fel än en glömd begäran, och
     har en annan åtgärd: posten ska bort, inte arbetaren köras. SAAB.ST låg så
     i 24 dygn – analysen skrevs 2026-07-14T00:06 men posten KOPIERADES till
     `done` i stället för att flyttas dit (analysprompt.md punkt 3f säger
     flytta). Matchningen sker på ticker + requestedAt: samma ticker får begäras
     om, och gör det (NVO finns tre gånger i `done` med olika requestedAt). */
  const done = (queueDb && queueDb.done) || [];
  const färdig = p => done.find(d => d && p && d.ticker === p.ticker && d.requestedAt === p.requestedAt);
  const klara = pending.map(p => ({ post: p, done: färdig(p) })).filter(x => x.done);
  if (klara.length)
    problems.push({ key: "analysis-queue-done", title:
      `Watchdog: ${klara.length} analyspost ligger kvar i pending trots att den är klar`,
      body: "Följande poster i `state/analysis_queue.json` finns i BÅDE `pending` och `done` – " +
        "analysen är alltså gjord och posten skulle ha FLYTTATS, inte kopierats:\n\n" +
        klara.map(x => `- **${x.post.ticker}** (${x.post.requestedAt}) → \`${x.done.file || "okänd fil"}\``).join("\n") +
        "\n\nÅtgärd: ta bort posten ur `pending`. Kör INTE arbetaren igen – analysen finns redan. " +
        "`prompts/analysprompt.md` punkt 3f säger *flytta* tickern från `pending` till `done`." });

  const kvar = pending.filter(p => !färdig(p));
  const gamla = kvar
    .map(p => {
      const t = Date.parse(p && p.requestedAt);
      if (!Number.isFinite(t)) return null;
      return { ticker: (p && p.ticker) || "?", issue: (p && p.issue) || "",
               days: Math.floor((nowMs - t) / 86400000) };
    })
    .filter(x => x && x.days > maxAgeDays)
    .sort((a, b) => b.days - a.days);
  if (gamla.length)
    problems.push({ key: "analysis-queue", title:
      `Watchdog: ${gamla.length} analysbegäran i kön utan svar`,
      body: "Följande poster i `state/analysis_queue.json` har status pending längre än " +
        `${maxAgeDays} dygn:\n\n` +
        gamla.map(g => `- **${g.ticker}** – ${g.days} dygn${g.issue ? ` (${g.issue})` : ""}`).join("\n") +
        "\n\nKön töms av den MANUELLA arbetaren: kör `prompts/analysprompt.md` i Cowork " +
        "(\"analysera kön\"). Ingenting går sönder av en liggande post – det är just därför " +
        "den behöver larmas om." });
  return problems;
}

/* Bubblarlistan ur en veckorapport, som tickers.

   KLIPPET VID "Förra veckans bubblare" ÄR INTE KOSMETIK. Utan det plockas de
   STRUKNA bubblarna upp ur uppföljningsstycket: veckorapport-260803 gav åtta
   tickers i stället för fem, och HNSA.ST, BOOZT.ST och SCA-B.ST var alla
   strukna. Watchdogen hade larmat på idéer rotationen medvetet dödat.

   Böckerna skriver tickern olika – nordiskt "**ASSA ABLOY (ASSA-B.ST)**",
   amerikanskt "**MSFT**" – så båda formerna måste hanteras. En extraktor som
   bara klarar den ena hittar NOLL i den andra boken, tyst.

   Fail-silent: markdown-parsning är bräcklig, och en watchdog som kraschar på
   en formulering är värre än ingen watchdog. */
export function bubblareFromWeekly(md){
  if (typeof md !== "string" || !md) return [];
  const after = md.split(/^## Bubblare/m)[1];
  if (!after) return [];
  let sec = after.split(/^## /m)[0];
  sec = sec.split(/\*\*F[oö]rra veckans bubblare/)[0];
  const out = [];
  for (const line of sec.split("\n")){
    const t = line.trim();
    if (!/^\d+\.\s/.test(t)) continue;
    const bold = t.match(/\*\*([^*]+)\*\*/);
    if (!bold) continue;
    const label = bold[1].trim();
    const paren = label.match(/\(\s*([A-Za-z0-9][A-Za-z0-9.\-]{0,13})\s*\)/);
    if (paren && /\.(ST|OL|CO|HE)$/i.test(paren[1])){ out.push(paren[1].toUpperCase()); continue; }
    if (/^[A-Z]{1,6}$/.test(label)) out.push(label);
  }
  return [...new Set(out)];
}

/* PRISSATT BUBBLARE SOM ALDRIG FICK ETT AVGÖRANDE.

   Veckorotationen 2026-08-03 kunde inte ge tre bubblare en villkorad plan
   eftersom prices.json saknade deras kurser. Kurserna kom 4–5/8. Utan en
   kontroll ligger idén död till nästa måndag utan att något syns: inget går
   sönder, rapporten ser normal ut, bubblaren bara tystnar.

   Bakåtkompatibel och fail-silent: saknas rapporttext, kurser eller
   bubblarlista returneras inga problem. */
export function checkStalePricedBubblare(opts){
  const { weeklyMd, weeklyDate, quotes, decisionsDb, book } = opts || {};
  const problems = [];
  // Saknas decisionsDb (t.ex. trasig/oläsbar decisions.json – se try/catch i main())
  // vet vi INTE om ett avgörande finns, och det får aldrig tolkas som att inget
  // gjorts. Utan den här spärren blir "okänt" till "obeslutat" och varenda
  // prissatt bubblare i BÅDA böckerna larmar falskt, precis den typen av tyst
  // fel den här kontrollen är till för att undvika att SKAPA.
  if (!weeklyDate || !quotes || !decisionsDb) return problems;
  const tickers = bubblareFromWeekly(weeklyMd);
  if (!tickers.length) return problems;
  const rows = decisionsDb.decisions || [];
  const decided = new Set(rows
    .filter(r => r && typeof r.date === "string" && r.date > weeklyDate)
    .map(r => r.ticker));
  const stuck = tickers.filter(t => {
    const q = quotes[t];
    return q && !q.error && q.price != null && !decided.has(t);
  });
  if (stuck.length)
    problems.push({ key: "bubblare-price", title:
      `Watchdog: ${stuck.length} prissatt(a) bubblare utan avgörande (${book || "?"})`,
      body: "Följande bubblare ur veckorapporten " + weeklyDate + " har nu verifierad kurs i " +
        "`state/prices.json`, men ingen körning har tagit ställning till dem sedan dess:\n\n" +
        stuck.map(t => `- **${t}** (${quotes[t].price}, ${quotes[t].marketTime || "utan tidsstämpel"})`).join("\n") +
        "\n\nEn bubblare som bara stoppades av att kursen saknades ska få en villkorad plan i " +
        "LÄGE B så snart kursen finns. Ligger den kvar utan avgörande är den död till nästa " +
        "veckorotation utan att något syns." });
  return problems;
}

/* KANDIDAT UTAN KURS TROTS ATT EN POST-EVENT-KURS FINNS.

   Fyller `refresh-candidate-prices.mjs` inte i kursen avvisas kandidaten på
   "kurs ej verifierbar" vid nästa rotation – rapporten ser normal ut, ingenting
   går sönder, och en bekräftad katalysator tystnar. Det är samma tysta felsort
   som regimfiltret och rapportkalendern redan bevakas för.

   Bakåtkompatibel: saknas kandidatfil eller noteringar är kontrollen tyst. */
export function checkCandidatePrice(opts){
  const { candidatesDb, quotes } = opts || {};
  const problems = [];
  const cs = (candidatesDb && Array.isArray(candidatesDb.candidates)) ? candidatesDb.candidates : [];
  if (!cs.length || !quotes) return problems;
  const stuck = cs.filter(c => c && c.status === "new" && c.price == null &&
                               postCatalystQuote(quotes[c.ticker], c.catalystDate));
  if (stuck.length)
    problems.push({ key: "candidate-price", title:
      `Watchdog: ${stuck.length} kandidat(er) saknar kurs trots att en post-event-kurs finns`,
      body: "Följande kandidater i `state/scout_candidates.json` har `price: null` medan " +
        "`state/prices.json` bär en kurs som ligger EFTER deras katalysator:\n\n" +
        stuck.map(c => `- **${c.id}** (${c.book}, katalysator ${c.catalystDate})`).join("\n") +
        "\n\nDet betyder att steget \"Fyll kandidatkurser ur post-event-kurs\" i `prices.yml` " +
        "inte kört eller inte fungerat. Utan kursen avvisas kandidaten på \"kurs ej " +
        "verifierbar\" vid nästa rotation, trots att kursen finns." });
  return problems;
}

/* RAPPORTKALENDERN. Faller den slutar watchlisten fyllas på i förväg, och en
   bevakad rapport hamnar återigen utan verifierad kurs på dagen den infaller –
   utan att något går sönder. Samma tysta felsort som regimfiltret. */
export function checkEarningsCalendar(opts){
  const { now, generatedAt, maxAgeHours = 30 } = opts || {};
  const problems = [];
  if (!generatedAt) return problems;          // bakåtkompatibelt: saknas fältet, var tyst
  const age = (new Date(now) - Date.parse(generatedAt)) / 3600e3;
  /* Ett OLÄSBART generatedAt får inte tystas ned. Fältet finns (så filen är inte
     från före kalendern) men går inte att tolka ⇒ åldern kan inte mätas ⇒
     kalendern är i praktiken oövervakad. Utan den här grenen blev NaN > gräns
     falskt och kontrollen teg, vilket är samma sorts tysta fel den ska fånga. */
  if (!isFinite(age))
    problems.push({ key: "earnings-calendar", title: "Watchdog: rapportkalenderns tidsstämpel går inte att läsa",
      body: "`state/earnings_calendar.json` har ett `generatedAt` som inte kan tolkas (" +
        JSON.stringify(generatedAt) + "). Åldern går därmed inte att mäta och kalendern är " +
        "oövervakad. Kontrollera att `earnings-calendar.mjs` skrev filen korrekt." });
  else if (age > maxAgeHours)
    problems.push({ key: "earnings-calendar", title: "Watchdog: rapportkalendern är inaktuell",
      body: "`state/earnings_calendar.json` är " + Math.round(age) + " timmar gammal (gräns " +
        maxAgeHours + " h). Den hämtas av `prices.yml` på 05:00-cronen. Fylls den inte på " +
        "saknar bevakade bolag verifierad kurs på sin rapportdag – det var så PLTR missades " +
        "2026-08-03. Kontrollera om Yahoo-crumbflödet svarar (401 = cookie/crumb-steget föll)." });
  return problems;
}

/* KORTA KURSSERIER – grind 2:s tysta spärr (2026-08-17).

   Backfillen fanns sedan 2026-08-03 men anropades av INGEN workflow. Följden var
   att varje nyinlagd ticker startade på EN punkt och växte en per handelsdag,
   medan grind 2 kräver 15 (RSI 14) och ~35 (MACD 12,26,9). Ingenting gick
   sönder: rapporten skrev bara "omätbar" och gick vidare, tre veckorapporter i
   rad, och 12 av 27 bruttokandidater i v34 föll på exakt det. Backfillen körs nu
   ur `prices.yml`, men steget har `continue-on-error` – faller Yahoo tystnar det
   lika ljudlöst som förut. Därför den här kontrollen.

   TVÅ FEL MED OLIKA ÅTGÄRD, alltså två meddelanden. Ett inaktuellt
   `partialBackfilledAt` betyder att STEGET inte kör (fel i workflowen). Ett
   färskt fält plus symboler som ändå är korta betyder att HÄMTNINGEN nekas
   (Yahoo 403/404) – helt olika trådar att dra i.

   Bara symboler som faktiskt hämtas räknas: en symbol som ligger kvar i
   historiken utan att vara i prices.json är övergiven, vilket är ett annat fel
   (åtgärdspunkt 2) och skulle annars räknas dubbelt. */
/* ÅTGÄRDSPUNKTER SOM LIGGER KVAR (2026-08-23). L-3 gör en datadefekt SYNLIG
   men inte ÅTGÄRDAD: punkterna staplades i prosa vecka efter vecka.
   Backfilldefekten rapporterades SJU gånger utan att något larmade – den
   självläkte av kalendertid, inte av åtgärd. Ingenting mätte hur länge en
   punkt varit öppen, för det enda spåret var ordet "ÅTERKOMMANDE" i löptext
   under sex olika rubrikvarianter.

   `state/action_items.json` gör punkten räknebar; den här checken gör den
   hörbar. Miss-retron är enda skrivaren (STEG 5), samma modell som
   lessons.md.

   ETT PROBLEM PER PUNKT, med nyckel `action-item-<id>`. Det är avgörande:
   nyckeln hamnar i issue-sync:ens HTML-kommentar, så ett issue per defekt
   öppnas vid tröskeln och STÄNGS av sig självt när retron sätter `resolved`.
   En samlad "5 punkter öppna"-titel hade återskapat exakt den dedupe-bugg
   issue-sync byggdes för att lösa – antalet i titeln ändras 5 -> 3 och läses
   som ett nytt problem.

   Tröskeln 3 speglar L-3:s eget ÅTERKOMMANDE-begrepp (två tidigare rapporter)
   plus en veckas marginal. Saknas filen eller fältet är checken TYST, som
   watchdogens övriga bakåtkompatibla kontroller. */
export function checkRecurringActionItems(opts){
  const { itemsDb, threshold = 3 } = opts || {};
  const problems = [];
  const items = itemsDb && itemsDb.items;
  if (!Array.isArray(items)) return problems;

  for (const it of items){
    if (!it || it.status !== "open") continue;
    if (!Number.isInteger(it.weeksOpen) || it.weeksOpen < threshold) continue;
    problems.push({
      key: "action-item-" + it.id,
      title: `Watchdog: åtgärdspunkt öppen ${it.weeksOpen} veckor – ${it.title}`,
      body: "Punkten `" + it.id + "` i `state/action_items.json` har varit öppen i **" +
        it.weeksOpen + " veckor** (först sedd " + it.firstSeen + ", senast bekräftad " +
        it.lastSeen + ").\n\n" +
        "**Berör:** " + (it.file ? "`" + it.file + "`" : "ingen enskild fil") +
        "\n**Omfång:** " + it.scope + "\n\n" +
        "L-3 gör defekten synlig men inte åtgärdad – en punkt som beskrivs varje vecka utan att " +
        "stängas slutar bli läst. Åtgärda den, eller sätt `status: \"resolved\"` med `resolvedBy` " +
        "i filen om den inte längre gäller; issuet stängs då av sig självt vid nästa körning."
    });
  }
  return problems;
}

export function checkShortSeries(opts){
  const { now, series, quotes, partialBackfilledAt,
          minPoints = 35, maxAgeHours = 30, tolerated = 2 } = opts || {};
  const problems = [];
  if (!series || !quotes) return problems;        // bakåtkompatibelt: var tyst utan data

  const korta = Object.keys(quotes)
    .filter(s => quotes[s] && !quotes[s].error && quotes[s].price != null)
    .filter(s => ((series[s] || []).length) < minPoints)
    .sort((a, b) => ((series[a] || []).length) - ((series[b] || []).length));

  const age = partialBackfilledAt
    ? (new Date(now) - Date.parse(partialBackfilledAt)) / 3600e3
    : Infinity;

  if (!isFinite(age) || age > maxAgeHours)
    problems.push({ key: "backfill-stale", title: "Watchdog: backfillen av korta kursserier kör inte",
      body: "`state/price_history.json` saknar ett färskt `partialBackfilledAt`" +
        (partialBackfilledAt ? " (senast " + partialBackfilledAt + ")" : " (fältet finns inte)") +
        ". Steget \"Backfilla symboler med kort historik\" i `prices.yml` körs på 05:00-cronen och " +
        "har `continue-on-error`, så det tystnar utan att jobbet blir rött. Just nu har " +
        korta.length + " hämtade symbol(er) under " + minPoints + " stängningar, vilket gör " +
        "MACD omätbart för dem i grind 2 – det var så 12 av 27 bruttokandidater föll i v34." });
  else if (korta.length > tolerated)
    problems.push({ key: "backfill-refused", title: "Watchdog: " + korta.length +
        " symbol(er) har kort kursserie trots färsk backfill",
      body: "Backfillen kördes " + partialBackfilledAt + " men " + korta.length + " hämtade " +
        "symbol(er) ligger fortfarande under " + minPoints + " stängningar: " +
        korta.slice(0, 8).map(s => "`" + s + "` (" + ((series[s] || []).length) + ")").join(", ") +
        (korta.length > 8 ? " m.fl." : "") + ". Steget kör alltså, men Yahoo levererar inte " +
        "historiken (403/404 per symbol). Nyintroducerade bolag har legitimt kort serie – " +
        "kontrollera loggen för `backfill-history.mjs` innan något ändras." });
  return problems;
}

/* BESLUTSUTVÄRDERINGEN SLUTAR TYST (ny 2026-08-26).

   Steget "Utvärdera beslutsloggen mot efterföljande kurs" i `prices.yml` har
   `continue-on-error: true` – korrekt, kursbevakningen ska inte falla med det – men
   det var det ENDA av fyra sådana steg utan en egen kontroll (rapportkalendern har
   `checkEarningsCalendar`, backfillen `checkShortSeries`, kandidatkurserna
   `checkCandidatePrice`). Slutade `decision_eval.mjs` kasta skulle filen frysa medan
   dashboarden fortsatte visa siffrorna som aktuella.

   FÄRSKHET DUGER INTE SOM SIGNAL. Skriptet skriver bara vid FAKTISK ändring
   (`generatedAt` jämförs inte, annars ~48 tomma commits per dygn), så ett gammalt
   `generatedAt` är ett normalt tillstånd. Invarianten är i stället STRUKTURELL:
   `counts.decisions` ska vara antalet rader i `decisions.json` som INTE är
   indexsleeven (`catalystType === "index"` – sleeven är kapitalparkering, inte ett
   urvalsbeslut, och följer per definition sitt eget benchmark). Verifierat 2026-08-26:
   295 rader totalt, 31 sleeve-rader, 263 kvar – och `counts.decisions` var exakt 263.

   `tolerated` är 30, alltså en hel bruttolista: en måndagsrotation lägger ~28 rader
   06:40 UTC och pris-jobbet hinner mäta dem långt före watchdogen 10:30, men taket
   ska inte kunna trippa på den normala luckan. Ett verkligt stopp passerar 30 inom
   ett par dygn. */
export function checkDecisionEval(opts){
  const { decisionsDb, evalDb, tolerated = 30 } = opts || {};
  const problems = [];
  const rows = decisionsDb && decisionsDb.decisions;
  const counts = evalDb && evalDb.counts;
  if (!Array.isArray(rows) || !counts || typeof counts.decisions !== "number") return problems;

  const matbara = rows.filter(r => r && r.catalystType !== "index").length;
  const efter = matbara - counts.decisions;
  if (efter > tolerated)
    problems.push({ key: "decision-eval-stale",
      title: "Watchdog: beslutsutvärderingen ligger " + efter + " rader efter",
      body: "`state/decisions.json` har " + matbara + " rader som inte är indexsleeven, men " +
        "`state/decision_eval.json` har mätt " + counts.decisions + " (`generatedAt` " +
        (evalDb.generatedAt || "saknas") + ").\n\n" +
        "Steget \"Utvärdera beslutsloggen mot efterföljande kurs\" i `prices.yml` har " +
        "`continue-on-error: true` och tystnar därför utan att jobbet blir rött. " +
        "Kontrollera dess logg.\n\n" +
        "**Ett gammalt `generatedAt` är i sig INGET fel** – skriptet skriver bara när " +
        "innehållet faktiskt ändrats. Det är differensen mot beslutsloggen som är signalen." });
  return problems;
}

/* DÖDA NYHETSFLÖDEN (ny 2026-08-26).

   Watchdogen läste `window` men ALDRIG `feeds`. Fönsterkontrollen larmar under 5
   handelsdagars täckning, och täckningen var 10 av 10 hela tiden — därför att de fyra
   FUNGERANDE flödena bar den. Två av sex flöden hade då varit döda i 16 dygn utan att
   något blev rött: `globenewswire` och `globenewswire-earnings` slutade svara mellan
   2026-08-10 08:52 och 20:05 UTC (daterat ur git-historiken för news_feed.json) och
   syntes bara som prosa i vecko- och retrorapporterna, fyra veckor i rad.

   Det spelar roll trots full täckning: `globenewswire-earnings` är det ENDA flöde som är
   dedikerat åt rapportöverraskningar, och retro-260822 mätte att noll av veckans tre
   missade nordiska rapportreaktioner gav en träff i nyhetsflödet.

   ETT PROBLEM PER FLÖDE, med flödesnamnet i nyckeln — aldrig en samlad titel med ett
   antal. Ett antal i titeln är exakt den dedupe-bugg `issue-sync.mjs` byggdes för att
   lösa: går 2 döda flöden till 1 läses det som ett NYTT problem och ett andra issue
   öppnas medan det första ligger kvar.

   Statussträngen sätts i `fetch-news.mjs`: "<n> poster" vid lyckad hämtning, annars
   "fel: …", "HTTP xxx – båda försöken" eller "0 poster – kontrollera URL". Allt som
   inte är ett rent antal räknas som fel. Saknas `feeds` är kontrollen tyst
   (bakåtkompatibelt mot filer skrivna före fältet fanns). */
export function checkNewsFeeds(opts){
  const { feeds } = opts || {};
  const problems = [];
  if (!feeds || typeof feeds !== "object") return problems;

  for (const [namn, status] of Object.entries(feeds)){
    const s = String(status);
    if (/^\d+\s+poster/.test(s) && !/kontrollera URL/.test(s)) continue;   // friskt
    problems.push({ key: "news-feed-" + namn,
      title: "Watchdog: nyhetsflödet `" + namn + "` levererar inte",
      body: "`state/news_feed.json` → `feeds." + namn + "` = `" + s + "`.\n\n" +
        "**Fönstrets täckning döljer det här felet.** Så länge övriga flöden bär 10 av 10 " +
        "handelsdagar larmar `news-window` aldrig, hur många källor som än dör. Ett dött " +
        "flöde är ett tappat mellansteg, inte ett tappat slutresultat — och det syns bara " +
        "här.\n\n" +
        "**`fel: … aborted`** betyder att VÅR egen timeout (20 s) löste ut, alltså att " +
        "värden hänger i stället för att avvisa — signaturen för blockering av " +
        "datacenter-IP, inte för en död URL. Testa URL:en i `config/news_feeds.txt` från " +
        "en vanlig maskin: svarar den där är det runnerns IP som blockeras och källan " +
        "måste bytas, inte timeouten höjas.\n\n" +
        "**`HTTP 404` eller `0 poster`** betyder att URL:en är utgången — byt den och " +
        "flytta den gamla till kommentarsblocket längst ned i filen." });
  }
  return problems;
}

/* VOLYMBACKFILLEN (ny 2026-08-26).

   Ingenting läste `state/volume_history.json` – varken watchdogen eller något test –
   och därför kunde urvalsbuggen i `backfill-history.mjs` ligga kvar i veckor: skriptet
   valde symboler på PRISSERIENS längd, så när prisserierna väl var fulla plockades ingen
   symbol alls och volymserien frös där den råkade stå. Mätt 2026-08-26: 59 av 111 symboler
   hade ≥ 200 kurspunkter och < 21 volympunkter. Symptomet var tyst på det sätt som är dyrast –
   rapporten skrev "omätbar" på delkriteriet och gick vidare, sex veckor i rad.

   Kontrollen mäter det som faktiskt betyder något: hur många HÄMTADE symboler som saknar
   underlag för ett 20-dagarssnitt. Index och valutapar utesluts – de har strukturellt ingen
   volym (Yahoo svarar 0) och skulle annars ligga kvar som ett permanent larm.

   `tolerated` är generöst satt: en nyintroducerad ticker har legitimt kort volymserie i
   några dygn, och taket i backfillen är 40 symboler per körning. */
export function checkVolumeBackfill(opts){
  const { volumeSeries, quotes, minPoints = 21, tolerated = 8 } = opts || {};
  const problems = [];
  if (!volumeSeries || !quotes) return problems;   // bakåtkompatibelt: var tyst utan data

  const korta = Object.keys(quotes)
    .filter(s => quotes[s] && !quotes[s].error && quotes[s].price != null)
    .filter(s => !/^\^|=X$/.test(s))
    .filter(s => ((volumeSeries[s] || []).length) < minPoints)
    .sort((a, b) => ((volumeSeries[a] || []).length) - ((volumeSeries[b] || []).length));

  if (korta.length > tolerated)
    problems.push({ key: "volume-backfill", title: "Watchdog: " + korta.length +
        " symbol(er) saknar underlag för volymsnittet",
      body: "`state/volume_history.json` har färre än " + minPoints + " punkter för " +
        korta.length + " hämtade symbol(er): " +
        korta.slice(0, 8).map(s => "`" + s + "` (" + ((volumeSeries[s] || []).length) + ")").join(", ") +
        (korta.length > 8 ? " m.fl." : "") + ". Delkriteriet \"volym > 1,5× 20-dagarssnittet\" i " +
        "grind 2 och det RÄKNADE likviditetsgolvet går därför inte att pröva för dem – de " +
        "bedöms på storleksklass i stället för att räknas. Kontrollera att steget " +
        "\"Backfilla symboler med kort historik\" i `prices.yml` kör och att " +
        "`collectShortSymbols` väljer på BÅDA serierna (fixad 2026-08-26; urvalet gick " +
        "tidigare bara på prisseriens längd, vilket gjorde 59 av 111 symboler oåtkomliga)." });
  return problems;
}

// Senaste datum i decisions.json som yymmdd, eller null.
export function latestDecisionYmd(db){
  const rows = (db && db.decisions) || [];
  let best = null;
  for (const r of rows){
    const m = String(r && r.date || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!m) continue;
    const ymd = m[1].slice(2) + m[2] + m[3];
    if (!best || ymd > best) best = ymd;
  }
  return best;
}

function main(){
  let gen = null;
  try { gen = JSON.parse(readFileSync("state/prices.json", "utf8")).generatedAt || null; } catch {}
  let newsGen = null, newsWindow = null, newsFeeds = null;
  try {
    const nf = JSON.parse(readFileSync("state/news_feed.json", "utf8"));
    newsFeeds = nf.feeds || null;   // per-flöde-status – se checkNewsFeeds
    newsGen = nf.generatedAt || null;
    newsWindow = nf.window || null;   // saknas i filer skrivna före 2026-08-03
  } catch {}
  // Regimfiltrets indexserier: nordisk bok mäts mot ^OMX, US-boken mot ^GSPC.
  let regimeSeries = null, histSeries = null, partialBackfilledAt = null;
  try {
    const ph = JSON.parse(readFileSync("state/price_history.json", "utf8"));
    const s = (ph && ph.series) || {};
    regimeSeries = { "^OMX": (s["^OMX"] || []).length, "^GSPC": (s["^GSPC"] || []).length };
    histSeries = s;
    partialBackfilledAt = ph.partialBackfilledAt || null;
  } catch {}
  let decisions = null, decisionsDb = null;
  try {
    decisionsDb = JSON.parse(readFileSync("state/decisions.json", "utf8"));
    decisions = latestDecisionYmd(decisionsDb);
  } catch {}
  let candidatesDb = null;
  try { candidatesDb = JSON.parse(readFileSync("state/scout_candidates.json", "utf8")); } catch {}
  let queueDb = null;
  try { queueDb = JSON.parse(readFileSync("state/analysis_queue.json", "utf8")); } catch {}
  // Saknas filen förblir den null och checken är tyst – mekanismen är ny (2026-08-23).
  let actionItemsDb = null;
  try { actionItemsDb = JSON.parse(readFileSync("state/action_items.json", "utf8")); } catch {}
  let priceQuotes = null;
  try { priceQuotes = JSON.parse(readFileSync("state/prices.json", "utf8")).quotes || null; } catch {}
  let earningsCalAt = null;
  try { earningsCalAt = JSON.parse(readFileSync("state/earnings_calendar.json", "utf8")).generatedAt || null; } catch {}
  let moversAt = null, moversAsOf = null;
  try {
    const mv = JSON.parse(readFileSync("state/movers.json", "utf8"));
    moversAt = mv.generatedAt || null;
    moversAsOf = mv.asOf || null;     // DATANS dag – inte körningens, se checkStale
  } catch {}
  // Volymserien ligger i en EGEN fil (se fetch-prices.mjs). Ingen kontroll läste den
  // förrän 2026-08-26, vilket är hela skälet till att urvalsbuggen kunde ligga kvar.
  let volumeSeries = null;
  try { volumeSeries = JSON.parse(readFileSync("state/volume_history.json", "utf8")).series || null; } catch {}
  let alertsAt = null;
  try {
    const a = JSON.parse(readFileSync("state/alerts.json", "utf8"));
    alertsAt = a.checkedAt || null;   // generatedAt duger INTE – se checkStale
  } catch {}
  const ls = d => { try { return readdirSync(d); } catch { return []; } };
  const readLatest = (dir, re) => {
    const files = ls(dir).filter(f => re.test(f)).sort();
    if (!files.length) return { md: null, date: null };
    const f = files[files.length - 1];
    const m = f.match(/(\d{2})(\d{2})(\d{2})\.md$/);
    const date = m ? `20${m[1]}-${m[2]}-${m[3]}` : null;
    try { return { md: readFileSync(dir + "/" + f, "utf8"), date }; } catch { return { md: null, date }; }
  };
  const now = new Date();
  const problems = checkStale({
    now,
    pricesGeneratedAt: gen,
    latestDaily: latestReportDate(ls("reports/daily"), "daglig"),
    latestWeekly: latestReportDate(ls("reports/weekly"), "veckorapport"),
    latestScout: latestReportDate(ls("reports/scout"), "rapport"),
    latestDecisionDate: decisions,
    alertsCheckedAt: alertsAt,
    moversGeneratedAt: moversAt,
    moversAsOf,
    newsGeneratedAt: newsGen,
    newsWindow,
    regimeSeries
  });

  const todayIso = now.toISOString().slice(0, 10);
  problems.push(...checkGrossList({
    isoDate: todayIso, isMonday: now.getUTCDay() === 1, decisionsDb
  }));
  problems.push(...checkScoutCandidates({
    candidatesDb, today: todayIso, staleFn: staleCandidates
  }));
  problems.push(...checkCandidatePrice({ candidatesDb, quotes: priceQuotes }));
  problems.push(...checkEarningsCalendar({ now, generatedAt: earningsCalAt }));
  problems.push(...checkAnalysisQueue({ queueDb, now: now.toISOString() }));
  problems.push(...checkShortSeries({ now, series: histSeries, quotes: priceQuotes,
    partialBackfilledAt }));
  problems.push(...checkVolumeBackfill({ volumeSeries, quotes: priceQuotes }));
  problems.push(...checkNewsFeeds({ feeds: newsFeeds }));
  let evalDb = null;
  try { evalDb = JSON.parse(readFileSync("state/decision_eval.json", "utf8")); } catch {}
  problems.push(...checkDecisionEval({ decisionsDb, evalDb }));
  problems.push(...checkRecurringActionItems({ itemsDb: actionItemsDb }));

  const wkNordic = readLatest("reports/weekly", /^veckorapport-\d{6}\.md$/);
  const wkUs     = readLatest("reports/us_weekly", /^us-veckorapport-\d{6}\.md$/);
  problems.push(...checkStalePricedBubblare({ weeklyMd: wkNordic.md, weeklyDate: wkNordic.date,
    quotes: priceQuotes, decisionsDb, book: "nordic" }));
  problems.push(...checkStalePricedBubblare({ weeklyMd: wkUs.md, weeklyDate: wkUs.date,
    quotes: priceQuotes, decisionsDb, book: "us" }));

  writeFileSync((process.env.RUNNER_TEMP || ".") + "/watchdog.json", JSON.stringify(problems, null, 2) + "\n");
  console.log(problems.length ? "Problem:\n" + problems.map(p => "- " + p.title).join("\n") : "Allt friskt.");
}

const invokedDirectly = process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("watchdog.mjs");
if (invokedDirectly) main();
