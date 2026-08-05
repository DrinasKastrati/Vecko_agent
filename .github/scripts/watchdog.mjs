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
  let newsGen = null, newsWindow = null;
  try {
    const nf = JSON.parse(readFileSync("state/news_feed.json", "utf8"));
    newsGen = nf.generatedAt || null;
    newsWindow = nf.window || null;   // saknas i filer skrivna före 2026-08-03
  } catch {}
  // Regimfiltrets indexserier: nordisk bok mäts mot ^OMX, US-boken mot ^GSPC.
  let regimeSeries = null;
  try {
    const ph = JSON.parse(readFileSync("state/price_history.json", "utf8"));
    const s = (ph && ph.series) || {};
    regimeSeries = { "^OMX": (s["^OMX"] || []).length, "^GSPC": (s["^GSPC"] || []).length };
  } catch {}
  let decisions = null, decisionsDb = null;
  try {
    decisionsDb = JSON.parse(readFileSync("state/decisions.json", "utf8"));
    decisions = latestDecisionYmd(decisionsDb);
  } catch {}
  let candidatesDb = null;
  try { candidatesDb = JSON.parse(readFileSync("state/scout_candidates.json", "utf8")); } catch {}
  let priceQuotes = null;
  try { priceQuotes = JSON.parse(readFileSync("state/prices.json", "utf8")).quotes || null; } catch {}
  let earningsCalAt = null;
  try { earningsCalAt = JSON.parse(readFileSync("state/earnings_calendar.json", "utf8")).generatedAt || null; } catch {}
  let moversAt = null;
  try { moversAt = JSON.parse(readFileSync("state/movers.json", "utf8")).generatedAt || null; } catch {}
  let alertsAt = null;
  try {
    const a = JSON.parse(readFileSync("state/alerts.json", "utf8"));
    alertsAt = a.checkedAt || null;   // generatedAt duger INTE – se checkStale
  } catch {}
  const ls = d => { try { return readdirSync(d); } catch { return []; } };
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

  writeFileSync((process.env.RUNNER_TEMP || ".") + "/watchdog.json", JSON.stringify(problems, null, 2) + "\n");
  console.log(problems.length ? "Problem:\n" + problems.map(p => "- " + p.title).join("\n") : "Allt friskt.");
}

const invokedDirectly = process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("watchdog.mjs");
if (invokedDirectly) main();
