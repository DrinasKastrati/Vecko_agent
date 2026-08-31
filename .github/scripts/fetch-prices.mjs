#!/usr/bin/env node
/* ============================================================
   Hämtar nordiska aktiekurser och skriver state/prices.json.
   Körs av GitHub Actions (fri nätåtkomst) – INTE av routinen.
   Routinen läser sedan bara den committade filen.
   ============================================================ */
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "node:fs";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/124.0 Safari/537.36";
// Basen kräver minst 2 tecken: annars plockas skräp som "B.ST" ur text skriven
// med mellanslag ("BAHN B.ST") – klassaktier ska skrivas med bindestreck (BAHN-B.ST).
// Efterledet tillåter upp till 6 tecken så att ETF:er som XACT-OMXS30.ST
// (indexsleeven) fångas, inte bara klassbokstäver som SAAB-B.ST.
//
// Bindestrecksgruppen upprepas (`*`, inte `?`, sedan 2026-08-23). Med `?`
// tilläts exakt ETT led, och en symbol med två – IMP-A-SDB.ST – matchade då
// från `\b` framför SISTA ledet och gav `SDB.ST`, en ticker som inte finns.
// Ingen kurs gick förlorad (den riktiga raden kom från watchlisten), men varje
// hämtning la en död symbol i prices.json:s `errors`, och det är just det
// fältet watchdogen larmar på.
const TICKER_RE = /\b[A-Z0-9]{2,6}(?:-[A-Z0-9]{1,6})*\.(?:ST|OL|CO|HE)\b/gi;

/* SYMBOLER SOM BEVISLIGEN INTE FINNS HOS NÅGON KÄLLA.

   Prosan är en tickerkälla: `collectTickers` kör `extractTickers` över
   portfolj.md och de tre senaste veckorapporterna. Följden är att en död ticker
   ÅTERUPPSTÅR så fort någon skriver om den. SAAB.ST togs bort ur watchlisten
   2026-08-02 just för att den inte existerar (bolaget handlas som SAAB-B.ST) –
   och låg ändå i prices.json 2026-08-21 med fel, eftersom veckorapport-260817
   NÄMNER den i en varning om att den inte finns. Varningen återskapade
   symbolen.

   Listan är avsiktligt minimal och får bara innehålla symboler som är
   OBSERVERADE med fel i prices.json och vars riktiga motsvarighet är känd.
   Lägg ALDRIG hit en symbol som bara misslyckats tillfälligt (BIOT.ST,
   DOMETIC.ST och ICA.ST failar i movers-hämtningen men är riktiga bolag) –
   då döljer listan ett hämtningsfel i stället för att avslöja det. */
export const KNOWN_MISSING = new Set([
  "SAAB.ST",   // Saab AB handlas som SAAB-B.ST. Felskriven i analyskön 2026-07-14.
  "SDB.ST"     // Trunkerad svans av IMP-A-SDB.ST, se TICKER_RE ovan.
]);

export function dropKnownMissing(tickers){
  return tickers.filter(t => !KNOWN_MISSING.has(t));
}

// ---- pure helpers (testbara) ------------------------------------------
export function extractTickers(text){
  if (!text) return [];
  const clean = text.replace(/[~`*]/g, " ");
  const out = new Set();
  for (const m of clean.matchAll(TICKER_RE)) out.add(m[0].toUpperCase());
  return [...out];
}

// Fångar korta tickers ur "(TICKER / Börs)" och bygger Yahoo-symbol via börsen,
// t.ex. "(KOG / Oslo Børs)" -> KOG.OL, "(SAAB B / Nasdaq Stockholm)" -> SAAB-B.ST.
export function extractCaseTickers(text){
  if (!text) return [];
  const clean = text.replace(/[~`*]/g, " ");
  const out = new Set();
  const re = /\(\s*([A-Za-z0-9][A-Za-z0-9 .\-]{0,9}?)\s*\/\s*([^)]{2,40})\)/g;
  for (const m of clean.matchAll(re)){
    let base = m[1].trim().toUpperCase();
    if (base.includes(".")) continue;            // redan full ticker – tas av extractTickers
    base = base.replace(/\s+/g, "-");
    const ex = m[2].toLowerCase();
    let suf = null;
    if (/stockholm|first north|spotlight/.test(ex)) suf = "ST";
    else if (/oslo/.test(ex)) suf = "OL";
    else if (/copenhagen|k[oö]penham|k[oø]benhav/.test(ex)) suf = "CO";
    else if (/helsink/.test(ex)) suf = "HE";
    if (!suf) continue;
    if (!/^[A-Z0-9-]{1,10}$/.test(base)) continue;
    out.add(base + "." + suf);
  }
  return [...out];
}

export function readFirst(paths){
  for (const p of paths){ if (existsSync(p)) { try { return readFileSync(p, "utf8"); } catch {} } }
  return "";
}

// Parsad JSON ur första filen som finns. null vid saknad eller trasig fil –
// en hjälpfil får aldrig fälla kursbevakningen.
export function readJsonFirst(paths){
  const raw = readFirst(paths);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

/* De N NYASTE rapporterna i en katalog, som en enda text.

   VARFÖR N OCH INTE BARA DEN SENASTE (fix 2026-08-17, åtgärdspunkt 2 i
   veckorapport-260817): tickerkällan var EN fil. När v33-rapporten ersatte
   v32:an den 2026-08-10 slutade elva symboler hämtas – SAAB-B.ST,
   EMBRAC-B.ST, MIPS.ST, ELUX-B.ST, VOLCAR-B.ST, GRK.HE, PREC.ST, NAS.OL,
   HSHP.OL, MORLD.OL och ALLEI.ST – trots att SAMTLIGA hade 250 stängningar i
   price_history.json. De var inte ofullständiga, de var övergivna. Två av dem
   flaggades av movers.json samma vecka (SAAB-B.ST +8,12 %, EMBRAC-B.ST
   +10,41 % på en Q2-rapport som slog konsensus) och föll ändå på grind 1 –
   systemet kastade bort de symboler som var färdiga samtidigt som det väntade
   på de som inte var det, och båda felen tystades av att rapporten såg normal ut.

   N = 3 är valt, och medvetet INTE "behåll varje symbol som redan har en
   serie": tre veckorapporter täcker en bubblares livslängd (watchlist.txt bär
   regeln 14 handelsdagar) och mängden är BEGRÄNSAD. Den obegränsade varianten
   växer för alltid, och Yahoo svarar 403 när listan blir för lång – repot har
   dessutom redan två listor med utgångssemantik och ingen av dem har någonsin
   rensats. Höj N hellre än att ta bort taket. */
export function recentReports(dirs, re, n = 3){
  const found = [];
  for (const d of dirs){
    let files = [];
    try { files = readdirSync(d); } catch { continue; }
    for (const f of files){
      const m = f.match(re);
      if (m) found.push({ key: m[1], path: d + "/" + f });
    }
  }
  found.sort((a, b) => a.key < b.key ? 1 : a.key > b.key ? -1 : 0);
  const seen = new Set(), out = [];
  for (const f of found){
    if (seen.has(f.key)) continue;      // samma datum i två kataloger – ta den först funna
    seen.add(f.key);
    out.push(readFirst([f.path]));
    if (out.length >= n) break;
  }
  return out.join("\n");
}

const WEEKLY_DIRS = ["reports/weekly", "."];
const WEEKLY_RE   = /^veckorapport-(\d{6})(?:_\d+)?\.md$/i;

// Kvar för anropare som verkligen vill ha EN rapport. Prisinsamlingen ska
// använda recentWeeklies() – se motiveringen i recentReports.
export function newestWeekly(){ return recentReports(WEEKLY_DIRS, WEEKLY_RE, 1); }
export function recentWeeklies(n = 3){ return recentReports(WEEKLY_DIRS, WEEKLY_RE, n); }

export function collectTickers(){
  const tickers = new Set();
  const portf   = readFirst(["state/portfolj.md", "portfolj.md"]);
  const watch   = readFirst(["config/watchlist.txt", "watchlist.txt"]);
  const weekly  = recentWeeklies(3);
  for (const t of extractTickers(portf))  tickers.add(t);
  for (const t of extractTickers(weekly)) tickers.add(t);
  for (const t of extractCaseTickers(weekly)) tickers.add(t);
  for (const t of extractCaseTickers(portf))  tickers.add(t);
  for (const line of watch.split("\n")){
    const t = line.trim().toUpperCase();
    if (t && !t.startsWith("#") && /^[A-Z0-9-]{1,14}\.(ST|OL|CO|HE)$/.test(t)) tickers.add(t);
  }
  for (const t of collectCandidateTickers("nordic")) tickers.add(t);
  return dropKnownMissing([...tickers].sort());
}

/* MOVERS-UNIVERSUMET SOM KURSKÄLLA (2026-08-31).

   config/universe_nordic_movers.txt bär 110 nordiska symboler och hämtades i sin
   helhet av movers.mjs varje lördag – men INGEN av dem nådde state/prices.json.
   Följden var att grind 1 ("verifierad kurs med källa + tidsstämpel") per
   konstruktion fällde varje mover som inte råkat handkopieras till
   config/watchlist.txt i efterhand. Mätt över v34–v36: 25 av 82 nordiska
   bruttokandidater föll på grind 1, och i v36 var de tio fällda veckans FEM
   största rörelser plus veckans FEM starkaste bekräftade katalysatorer. Systemet
   såg alltså rörelsen, kunde namnge katalysatorn – och kunde inte poängsätta
   någon av dem.

   VARFÖR DEN INTE LIGGER I collectTickers: prices.yml kör var 30:e minut, och
   110 extra Yahoo-anrop per halvtimme är varken gratis eller ofarligt (Yahoo
   svarar 403 när listan blir för lång). Universumet hämtas därför bara på dagens
   FÖRSTA körning – se needsDailyRun och prices.yml.

   VARFÖR DEN INTE STÄMPLAR lastSeen: gjorde den det skulle varje symbol få 30
   dygns nådetid i collectLiveHistoryTickers och fylla dess tak på 30, alltså
   trycka ut precis de övergivna symboler den mekanismen byggdes för att rädda.
   Universumet går in i hämtlistan direkt i run() och passerar aldrig
   updateLastSeen. En symbol som är genuint intressant lyfts in i watchlist.txt
   av en rotation och blir källsymbol den vägen. */
export function collectMoversUniverse(readFile = readFirst){
  const txt = readFile(["config/universe_nordic_movers.txt"]);
  const out = new Set();
  for (const line of txt.split("\n")){
    const t = line.trim().toUpperCase();
    if (!t || t.startsWith("#")) continue;
    if (/^[A-Z0-9-]{1,14}\.(ST|OL|CO|HE)$/.test(t)) out.add(t);
  }
  return dropKnownMissing([...out].sort());
}

/* DAGENS FÖRSTA KÖRNING (2026-08-31).

   Stegen som bara hör hemma en gång per dygn – rapportkalendern, backfillen och
   det breda movers-universumet – var grindade på den exakta cron-strängen
   `github.event.schedule == '0 5 * * 1-5'`. GitHub deprioriterar schemalagda
   körningar vid hög last och startar dem då INTE ALLS: 2026-08-31 uteblev både
   05:00- och 06:00-cronen, och stegen kördes därför inte en enda gång den dagen
   trots att fjorton senare körningar passerade. Samtliga STARTADE körningar hade
   conclusion success – det var alltså inget kodfel att leta efter.

   Grinden ligger nu i DATAT i stället för i schemat: har dygnets markör redan
   skrivits eller inte. En utebliven 05:00-körning tas då igen av 07:00-körningen
   av sig själv. Vid saknad eller oläsbar markör körs steget – hellre en extra
   körning än ett steg som tyst hoppas över ett helt dygn, vilket är exakt det
   fel mekanismen finns för. */
export function needsDailyRun(markerIso, todayIso){
  if (!markerIso) return true;
  const d = String(markerIso).slice(0, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(d)) return true;
  return d < todayIso;
}

/* Symboler som RAPPORTERAR SNART, ur state/earnings_calendar.json.

   Varför de måste med: fram till 2026-08-04 fylldes watchlistan i efterhand, av
   en människa som läst en rapport. Palantir flaggades av scouten tre dagar i rad
   inför sin rapport 3/8, saknade rad i watchlisten, fick därför ingen kurs i
   prices.json, föll på grind 1 (verifierbar kurs) och kunde inte utvärderas –
   och lades till DAGEN EFTER att aktien gått +27,6 %. Kalendern gör tillägget
   automatiskt och i FÖRVÄG.

   Posterna faller ur av sig själv när rapportdatumet passerat (kalendern skriver
   bara `upcoming`), så listan växer inte obegränsat. Saknas eller är filen
   trasig returneras en tom lista – kursbevakningen ska aldrig falla för att
   kalendern gjort det. */
export function collectEarningsTickers(readFile = readFirst){
  const raw = readFile(["state/earnings_calendar.json"]);
  if (!raw) return [];
  try {
    const j = JSON.parse(raw);
    const up = Array.isArray(j.upcoming) ? j.upcoming : [];
    return up.map(u => u && u.symbol).filter(s => typeof s === "string" && s).sort();
  } catch { return []; }
}

/* Öppna kandidater ur state/scout_candidates.json som tickerkälla.

   Fram till 2026-08-05 var filen INTE en källa: ANET hamnade i prices.json
   bara för att scouten också handskrev in den i config/watchlist_us.txt. Den
   handpåläggningen är precis vad kandidatfilen skulle göra överflödig.

   Ingen egen utgångslogik: kandidatens `expiresAt` ÄR utgången. Repot har redan
   två listor med utgångssemantik, och en tredje hygienregel har dålig historik
   här – watchlist.txt bär "rensas efter 14 handelsdagar" och har aldrig rensats. */
export function collectCandidateTickers(book, readFile = readFirst,
                                        today = new Date().toISOString().slice(0, 10)){
  const raw = readFile(["state/scout_candidates.json"]);
  if (!raw) return [];
  try {
    const j = JSON.parse(raw);
    const cs = Array.isArray(j.candidates) ? j.candidates : [];
    return cs
      .filter(c => c && c.status === "new" && c.book === book &&
                   typeof c.ticker === "string" && c.ticker &&
                   (!c.expiresAt || String(c.expiresAt) >= today))
      .map(c => c.ticker)
      .sort();
  } catch { return []; }
}

/* Symboler som ska få ett EXTRA anrop med förbörs-/efterbörsdata.

   Varför mängden är smal: det extra anropet är `interval=1m` och ger ~1400
   punkter per symbol. Att göra det för alla ~54 symboler var 30:e minut är
   onödig last mot ett API som redan svarar 403 när det tycker att det är för
   mycket. Varje MÄTT miss (PLTR 2026-08-04, ANET och AMD 2026-08-05) är en
   rapporthändelse, så mängden begränsas till dem.

   `isEstimate: true` räknas MED här. CLAUDE.md drar gränsen så: ett gissat
   datum duger för att säkra en kurs i förväg, men aldrig som bekräftad binär
   händelse. Den här funktionen avgör bara HÄMTNING – aldrig ett beslut. */
export function extendedScope(calendar, candidates, today){
  const out = new Set();
  const up = (calendar && Array.isArray(calendar.upcoming)) ? calendar.upcoming : [];
  for (const u of up){
    if (!u || typeof u.symbol !== "string" || !u.symbol) continue;
    if (typeof u.tradingDaysAway !== "number") continue;
    if (u.tradingDaysAway < 0 || u.tradingDaysAway > 2) continue;
    out.add(u.symbol);
  }
  const cs = (candidates && Array.isArray(candidates.candidates)) ? candidates.candidates : [];
  for (const c of cs){
    if (!c || c.status !== "new" || c.confirmed !== true) continue;
    if (typeof c.ticker !== "string" || !c.ticker) continue;
    if (today && c.expiresAt && String(c.expiresAt) < today) continue;
    out.add(c.ticker);
  }
  return [...out].sort();
}

// ---- USA + krypto (scout-routinen) ------------------------------------
const SCOUT_DIRS = ["reports/scout", "."];
const SCOUT_RE   = /^rapport-(\d{6})(?:_\d+)?\.md$/i;
export function newestScout(){ return recentReports(SCOUT_DIRS, SCOUT_RE, 1); }
export function recentScouts(n = 3){ return recentReports(SCOUT_DIRS, SCOUT_RE, n); }

// Fångar (TICKER / Börs) ur scout-case: NYSE/NASDAQ -> vanlig symbol,
// kryptonätverk -> <MYNT>-USD.
export function extractUsCaseTickers(text){
  if (!text) return [];
  const clean = text.replace(/[~`*]/g, " ");
  const out = new Set();
  const re = /\(\s*([A-Za-z0-9][A-Za-z0-9 .\-]{0,9}?)\s*\/\s*([^)]{2,40})\)/g;
  for (const m of clean.matchAll(re)){
    const base = m[1].trim().toUpperCase().replace(/\s+/g, "-");
    const ex = m[2].toLowerCase();
    if (/bitcoin|ethereum|solana|crypto|krypto|on-chain|\bnetwork\b|nätverk|\bchain\b|kedja/.test(ex)){
      if (/^[A-Z0-9]{2,6}(-USD)?$/.test(base)) out.add(base.endsWith("-USD") ? base : base + "-USD");
    } else if (/nasdaq|nyse|cboe|amex|arca/.test(ex)){
      if (/^[A-Z]{1,6}(\.[A-Z]{1,2})?$/.test(base)) out.add(base);
    }
  }
  return [...out];
}

// US-veckorapporternas case – samma N-regel som den nordiska boken. US-boken
// tappar symboler på exakt samma sätt när us-veckorapporten byts.
const US_WEEKLY_DIRS = ["reports/us_weekly", "."];
const US_WEEKLY_RE   = /^us-veckorapport-(\d{6})(?:_\d+)?\.md$/i;
export function newestUsWeekly(){ return recentReports(US_WEEKLY_DIRS, US_WEEKLY_RE, 1); }
export function recentUsWeeklies(n = 3){ return recentReports(US_WEEKLY_DIRS, US_WEEKLY_RE, n); }

// Plockar US-symboler ur portfolj_us.md:s tabeller (Yahoo-ticker-kolumnen).
export function extractUsPortfolioTickers(md){
  if (!md) return [];
  const out = new Set();
  const lines = md.split("\n");
  let tkCol = -1;
  for (const ln of lines){
    if (!/^\s*\|.*\|\s*$/.test(ln)) { tkCol = -1; continue; }
    const cells = ln.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map(c => c.trim());
    if (tkCol < 0){ // headerrad
      tkCol = cells.findIndex(c => /yahoo|ticker/i.test(c));
      continue;
    }
    if (tkCol >= 0 && cells[tkCol]){
      const t = cells[tkCol].toUpperCase();
      if (/^\^?[A-Z]{1,6}(-[A-Z]{1,3})?$/.test(t) && !/^-+$/.test(t)) out.add(t);
    }
  }
  return [...out];
}

// Läser config/watchlist_us.txt (US-symbol, <MYNT>-USD, ^INDEX, klass-aktie) + senaste
// scout-rapportens case.
export function collectUsTickers(){
  const set = new Set();
  const watch = readFirst(["config/watchlist_us.txt", "watchlist_us.txt"]);
  for (const line of watch.split("\n")){
    const t = line.trim().toUpperCase();
    if (!t || t.startsWith("#")) continue;
    // Sista mönstret = valutapar i Yahoo-format (USDSEK=X) – us-boken är
    // USD-denominerad och dashboardens Total-vy visar kursen.
    if (/^\^?[A-Z]{1,6}$/.test(t) || /^[A-Z0-9]{2,6}-USD$/.test(t) || /^[A-Z]{1,5}\.[A-Z]{1,2}$/.test(t) ||
        /^[A-Z]{6}=X$/.test(t)) set.add(t);
  }
  for (const t of extractUsCaseTickers(recentScouts(3))) set.add(t);
  // US-rotationens egna innehav/case (så deras kurser garanterat hämtas):
  for (const t of extractUsPortfolioTickers(readFirst(["state/portfolj_us.md", "portfolj_us.md"]))) set.add(t);
  for (const t of extractUsCaseTickers(recentUsWeeklies(3))) set.add(t);
  for (const t of collectCandidateTickers("us")) set.add(t);
  return dropKnownMissing([...set]);
}

// FÖREGÅENDE STÄNGNING – hämtas ur SERIEN, inte ur chartPreviousClose.
//
// Yahoos chart-meta har ett fält som HETER som det vi vill ha men inte är det:
// `chartPreviousClose` är stängningen före HELA det begärda fönstret, och vi
// begär range=5d – alltså ~en vecka bakåt. Fältet `previousClose` finns inte i
// chart-API:ts meta (kontrollerat live 2026-08-02: null för SAAB-B.ST, MSFT och
// XACT-OMXS30.ST). Att läsa chartPreviousClose som dagsrörelse gav veckorörelser
// presenterade som dagsrörelser – MSFT chartPrev 381,70 mot faktisk föregående
// stängning 451,10 blir "+21,7 %" i stället för +3,0 %, exakt den falska siffra
// scouten flaggade i fyra rapporter.
//
// Rätt nivå är den sista stängningen DATERAD FÖRE den session kursen kommer
// ifrån. Att bara ta näst sista giltiga stängningen räcker inte: när dagens bar
// ännu inte konsoliderats (close = null, sett på ELUX-B.ST 2026-07-31) skulle
// det ge en tvåsessionersrörelse. Därför jämförs mot regularMarketTime.
export function prevCloseFrom(res){
  const meta = (res && res.meta) || null;
  if (meta && meta.previousClose != null) return meta.previousClose;
  const ts = (res && res.timestamp) || [];
  const q = res && res.indicators && res.indicators.quote && res.indicators.quote[0];
  const closes = (q && q.close) || [];
  const day = sec => new Date(sec * 1000).toISOString().slice(0, 10);
  const cur = meta && meta.regularMarketTime ? day(meta.regularMarketTime) : null;

  let prev = null;
  for (let i = 0; i < ts.length; i++){
    const c = closes[i];
    if (c == null || isNaN(c)) continue;
    if (cur && day(ts[i]) >= cur) continue;   // hoppa dagens bar (och allt senare)
    prev = c;
  }
  if (prev != null) return prev;

  // Ingen användbar tidsstämpel att jämföra mot: näst sista giltiga stängningen.
  const valid = closes.filter(v => v != null && !isNaN(v));
  if (!cur && valid.length >= 2) return valid[valid.length - 2];
  return (meta && meta.chartPreviousClose != null) ? meta.chartPreviousClose : null;
}

export function parseChart(json, sym){
  const res = json && json.chart && json.chart.result && json.chart.result[0];
  const meta = res && res.meta;
  if (!meta || meta.regularMarketPrice == null) return { symbol: sym, error: "ingen kursdata" };
  const t = meta.regularMarketTime ? new Date(meta.regularMarketTime * 1000).toISOString() : null;
  return {
    symbol: meta.symbol || sym,
    price: meta.regularMarketPrice,
    currency: meta.currency || null,
    exchange: meta.fullExchangeName || meta.exchangeName || null,
    marketTime: t,
    marketState: meta.marketState || null,
    previousClose: prevCloseFrom(res),
    dayHigh: meta.regularMarketDayHigh ?? null,
    dayLow: meta.regularMarketDayLow ?? null,
    // VOLYM (nytt 2026-08-17, åtgärdspunkt 4 i veckorapport-260817): delkriteriet
    // "Volym > 1,5× 20-dagarssnittet" i grind 2 var omätbart för SAMTLIGA 62
    // tickers, tredje veckan i rad, och likviditetsgolvet 3 MSEK/dag bedömdes på
    // storleksklass i stället för att räknas. Fältet låg i samma svar hela tiden.
    // Faller tillbaka på volymserien när meta saknar det: `meta.regularMarketVolume`
    // finns inte för alla instrument (index rapporterar ingen volym alls).
    volume: meta.regularMarketVolume ?? lastVolumeFrom(res),
    source: "Yahoo Finance (chart API)"
  };
}

// Sista icke-tomma volymbaren i chart-svaret. Används bara som reserv när
// meta.regularMarketVolume saknas – returnerar null i stället för 0, eftersom
// "ingen volymdata" och "noll omsatta aktier" är olika saker och det senare
// hade fått ett instrument att se illikvitt ut i grind 2.
export function lastVolumeFrom(res){
  const q = res && res.indicators && res.indicators.quote && res.indicators.quote[0];
  const vols = (q && Array.isArray(q.volume)) ? q.volume : [];
  for (let i = vols.length - 1; i >= 0; i--){
    const v = vols[i];
    if (v != null && !isNaN(Number(v)) && Number(v) > 0) return Number(v);
  }
  return null;
}

/* Förbörs-/efterbörskurs ur ett `interval=1m&includePrePost=true`-svar.

   Yahoos 1d-svar har `hasPrePostMarketData: true` men INGET postMarketPrice i
   meta (kontrollerat live 2026-08-05) – utökad kurs finns bara i 1m-seriens
   punkter, och sessionen avgörs av meta.currentTradingPeriod.regular.

   Returnerar SENASTE punkten utanför reguljär session, eller null. Aldrig ett
   objekt med null-fält: anroparen ska kunna skilja "ingen utökad kurs" från
   "hämtningen föll", och det gör den på att fälten saknas helt. */
export function parseExtended(json){
  const res  = json && json.chart && json.chart.result && json.chart.result[0];
  const reg  = res && res.meta && res.meta.currentTradingPeriod && res.meta.currentTradingPeriod.regular;
  if (!reg || typeof reg.start !== "number" || typeof reg.end !== "number") return null;
  const ts = Array.isArray(res.timestamp) ? res.timestamp : [];
  const q  = res.indicators && res.indicators.quote && res.indicators.quote[0];
  const close = (q && Array.isArray(q.close)) ? q.close : [];
  let best = null;
  for (let i = 0; i < ts.length; i++){
    const t = ts[i], c = close[i];
    if (typeof t !== "number" || c == null || isNaN(Number(c))) continue;
    if (t >= reg.start && t < reg.end) continue;      // reguljär session – inte utökad
    if (!best || t > best[0]) best = [t, Number(c)];
  }
  if (!best) return null;
  return {
    extendedPrice: Math.round(best[1] * 1e6) / 1e6,
    extendedTime: new Date(best[0] * 1000).toISOString(),
    extendedSession: best[0] < reg.start ? "pre" : "post"
  };
}

// ---- network ----------------------------------------------------------
const sleep = ms => new Promise(r => setTimeout(r, ms));

// Reservkälla när Yahoo fallerar: stooq CSV (USA + krypto främst).
export async function fetchStooq(sym, fetchImpl = globalThis.fetch){
  let s = null;
  if (/^[A-Z]{1,6}$/.test(sym)) s = sym.toLowerCase() + ".us";
  else if (/^[A-Z0-9]{2,6}-USD$/.test(sym)) s = sym.replace("-", "").toLowerCase();
  else if (/^[A-Z]{6}=X$/.test(sym)) s = sym.slice(0, 6).toLowerCase();   // USDSEK=X -> usdsek
  else if (/\.ST$/.test(sym)) s = sym.toLowerCase();
  if (!s) return null;
  const url = `https://stooq.com/q/l/?s=${encodeURIComponent(s)}&f=sd2t2ohlcv&h&e=csv`;
  try {
    const r = await fetchImpl(url, { headers: { "User-Agent": UA } });
    if (!r.ok) return null;
    const txt = await r.text();
    const lines = txt.trim().split("\n");
    if (lines.length < 2) return null;
    const c = lines[1].split(",");            // Symbol,Date,Time,Open,High,Low,Close,Volume
    const close = parseFloat(c[6]);
    if (isNaN(close) || c[1] === "N/D") return null;
    const mt = (c[1] && c[2]) ? new Date(c[1] + "T" + c[2] + "Z").toISOString() : null;
    const vol = parseFloat(c[7]);
    return { symbol: sym, price: close, currency: null, exchange: "stooq",
      marketTime: mt, marketState: null, previousClose: null,
      dayHigh: parseFloat(c[4]) || null, dayLow: parseFloat(c[5]) || null,
      // Volymen ligger i kolumn 8 (`f=sd2t2ohlcv` begär den redan). > 0 av
      // samma skäl som i lastVolumeFrom: 0 betyder saknad data hos stooq.
      volume: (!isNaN(vol) && vol > 0) ? vol : null,
      source: "stooq.com (CSV)" };
  } catch { return null; }
}

export async function fetchQuote(sym, fetchImpl = globalThis.fetch){
  const hosts = ["query1.finance.yahoo.com", "query2.finance.yahoo.com"];
  for (const host of hosts){
    const url = `https://${host}/v8/finance/chart/${encodeURIComponent(sym)}?range=5d&interval=1d`;
    try {
      const r = await fetchImpl(url, { headers: { "User-Agent": UA, "Accept": "application/json", "Accept-Language": "en-US,en;q=0.9" } });
      if (!r.ok) continue;
      const j = await r.json();
      const q = parseChart(j, sym);
      if (!q.error) return q;
    } catch { /* try next host */ }
  }
  const st = await fetchStooq(sym, fetchImpl);
  if (st && !st.error) return st;
  return { symbol: sym, error: "kunde inte hämtas (alla källor gav fel)" };
}

/* Extra anrop för förbörs-/efterbörskurs. Faller det ska den vanliga
   noteringen INTE påverkas – därför null i stället för kastat fel, och därför
   ingen stooq-reserv: stooq har ingen utökad session att ge. */
export async function fetchExtended(sym, fetchImpl = globalThis.fetch){
  const hosts = ["query1.finance.yahoo.com", "query2.finance.yahoo.com"];
  for (const host of hosts){
    const url = `https://${host}/v8/finance/chart/${encodeURIComponent(sym)}` +
                `?range=2d&interval=1m&includePrePost=true`;
    try {
      const r = await fetchImpl(url, { headers: { "User-Agent": UA, "Accept": "application/json",
        "Accept-Language": "en-US,en;q=0.9" } });
      if (!r.ok) continue;
      const ext = parseExtended(await r.json());
      if (ext) return ext;
    } catch { /* prova nästa host */ }
  }
  return null;
}

/* ---- ÖVERGIVNA SYMBOLER (fix 2026-08-26) ------------------------------

   `recentWeeklies(3)` (2026-08-17) breddade fönstret från en veckorapport till
   tre, men botade bara symptomet: en symbol som faller ur ALLA källor slutar
   fortfarande hämtas i samma sekund, mitt i en 250-punktsserie. 2026-08-26 låg
   8 symboler med levande historik utanför `prices.json` – de hade allt underlag
   grind 2 kräver och föll ändå på grind 1, vilket är exakt det förvirrande
   symptomet fällan i CLAUDE.md avsnitt 7 beskriver.

   MEKANISMEN: `lastSeen[sym]` är datumet symbolen senast fanns i en KÄLLA
   (portfölj, watchlist, de tre senaste rapporterna, kandidatkön, rapport-
   kalendern). En symbol fortsätter hämtas i 30 dygn efter det, och åldras sedan
   ut av sig själv.

   VARFÖR INTE "behåll varje symbol som har en färsk historikpunkt": den regeln
   är cirkulär. Att hämta symbolen SKAPAR en färsk punkt, så villkoret uppfyller
   sig självt och listan växer monotont för alltid – precis den throttling-risk
   `config/watchlist.txt` varnar för. `lastSeen` uppdateras BARA av källor,
   aldrig av en hämtning, och det är hela skillnaden.

   MIGRERING: en symbol utan `lastSeen` seedas ur sin sista historikpunkt, inte
   ur dagens datum. De övergivna får därmed sin verkliga ålder och rätt kvarvarande
   nådetid i stället för 30 nya dygn.

   `cap` gäller ENBART tillskottet, alltså symboler som INTE redan ligger i en
   källa. Ett tak på hela mängden hade varit meningslöst i praktiken och farligt i
   det enda fall som räknas: källsymbolerna är ~106 och stämplas med dagens datum,
   så de fyller varje rimligt tak och trycker ut exakt de övergivna som fixen finns
   för. Sorteringen är nyast först, så det som faller bort är det som ändå var på
   väg att åldras ut. */
export function updateLastSeen(hist, sourceTickers, today){
  const seen = hist.lastSeen || {};
  for (const [sym, arr] of Object.entries(hist.series || {}))
    if (!seen[sym] && Array.isArray(arr) && arr.length) seen[sym] = arr[arr.length - 1][0];
  for (const t of sourceTickers || []) seen[t] = today;
  hist.lastSeen = seen;
  return seen;
}

export function collectLiveHistoryTickers(lastSeen, today, days = 30, cap = 30, exclude = []){
  const t = Date.parse(today);
  if (isNaN(t)) return [];
  const skip = new Set(exclude || []);
  return Object.entries(lastSeen || {})
    .filter(([sym, d]) => {
      if (skip.has(sym)) return false;          // hämtas ändå – ska inte äta taket
      const p = Date.parse(d);
      return !isNaN(p) && (t - p) / 86400000 <= days;
    })
    .sort((a, b) => (a[1] < b[1] ? 1 : a[1] > b[1] ? -1 : (a[0] < b[0] ? -1 : 1)))
    .slice(0, cap)
    .map(r => r[0]);
}

/* HÄMTLISTAN (2026-08-31).

   Tre mängder går ihop till en: källsymbolerna (portfölj, watchlists, de tre
   senaste rapporterna, kandidatkön, rapportkalendern), nådetidssymbolerna som
   nyligen VAR i en källa, och – bara på dagens första körning – hela det breda
   movers-universumet. Den tredje ligger utanför de två andra av kostnadsskäl:
   prices.yml kör var 30:e minut och 110 extra anrop där är varken gratis eller
   ofarligt. */
export function fetchList(sourceTickers = [], liveTickers = [], wideTickers = [], wide = false){
  const alla = [...(sourceTickers || []), ...(liveTickers || [])];
  if (wide) alla.push(...(wideTickers || []));
  return [...new Set(alla)].sort();
}

/* MARKÖREN DYGNSGRINDEN LÄSER (2026-08-31).

   `wideAt` är tidsstämpeln för senaste BREDA hämtningen, alltså den som tog med
   hela movers-universumet. prices.yml läser den via needsDailyRun för att avgöra
   om dagens första körning återstår.

   VARFÖR JUST DEN OCH INTE earnings_calendar.json:s generatedAt: kalendersteget
   har continue-on-error, och en dag då Yahoos quoteSummary är nere hade markören
   då stått kvar på gårdagen HELA dygnet – varje halvtimmeskörning hade blivit
   bred, alltså 110 extra anrop var 30:e minut. Markören måste sättas av det steg
   den beskriver.

   VARFÖR DEN SMALA KÖRNINGEN BEVARAR DEN: run() skriver om hela prices.json varje
   gång. Nollställdes fältet skulle nästa körning läsa "ingen bred körning i dag"
   och bli bred igen – grinden vore verkningslös på det tystaste sätt som finns:
   allt fungerar, det kostar bara tio gånger så mycket.

   Inget schemaVersion-byte: fältet är NYTT, ingen befintlig nyckels betydelse
   ändras, och en läsare som saknar det beter sig som förut. */
export function nextWideAt(prevWideAt, wide, nowIso){
  return wide ? nowIso : (prevWideAt || null);
}

// ---- main -------------------------------------------------------------
export async function run(fetchImpl = globalThis.fetch, wide = false){
  const sourceTickers = [...new Set([...collectTickers(), ...collectUsTickers(),
                                     ...collectEarningsTickers()])].sort();
  // Symboler som nyligen VAR i en källa hämtas vidare under sin nådetid – annars
  // dör en 250-punktsserie i samma sekund rapporten den nämndes i rullar ut.
  /* Universumet läses ALLTID (en filläsning), men går in i hämtlistan bara på
     dagens första körning. Att det alltid räknas fram är avsiktligt: det måste
     uteslutas ur collectLiveHistoryTickers taket på VARJE körning, annars seedar
     updateLastSeen dem ur sin färska historikpunkt nästa gång och de äter de 30
     platser mekanismen har för genuint övergivna symboler. Universumet behöver
     ingen nådetid – det hämtas i sin helhet varje dygn ändå. */
  const prevWideAt  = (readJsonFirst(["state/prices.json"]) || {}).wideAt || null;
  const universum   = collectMoversUniverse();
  const wideTickers = wide ? universum : [];
  let liveTickers = [];
  try {
    const ph = JSON.parse(readFileSync("state/price_history.json", "utf8"));
    const idag = new Date().toISOString().slice(0, 10);
    const seen = updateLastSeen(ph, sourceTickers, idag);
    liveTickers = collectLiveHistoryTickers(seen, idag, 30, 30,
                    [...sourceTickers, ...universum]);
    mkdirSync("state", { recursive: true });
    writeFileSync("state/price_history.json", JSON.stringify(ph) + "\n");
  } catch { /* saknas filen är det första körningen – källorna räcker */ }
  const tickers = fetchList(sourceTickers, liveTickers, wideTickers, wide);
  // Utökad session hämtas bara för symboler med en rapport inom räckhåll.
  const today = new Date().toISOString().slice(0, 10);
  const scope = new Set(extendedScope(
    readJsonFirst(["state/earnings_calendar.json"]),
    readJsonFirst(["state/scout_candidates.json"]),
    today));
  const quotes = {};
  let okCount = 0, extCount = 0;
  for (const t of tickers){
    const q = await fetchQuote(t, fetchImpl);
    quotes[t] = q;
    if (!q.error) okCount++;
    await sleep(250); // var snäll mot API:t
    if (!q.error && scope.has(t)){
      const ext = await fetchExtended(t, fetchImpl);
      if (ext){ Object.assign(q, ext); extCount++; }
      await sleep(250);
    }
  }
  const out = {
    generatedAt: new Date().toISOString(),
    source: "Yahoo Finance chart API via GitHub Actions",
    // VARFÖR schemaVersion finns: 2026-08-02 rättades previousClose (läste tidigare
    // chartPreviousClose ≈ en vecka bakåt). Samma dag "verifierade" en routine fixen mot en
    // prices.json som skrivits FÖRE rättelsen – det gamla värdet såg rimligt ut för en nordisk
    // ticker (601,00 mot korrekta 599,60) och slutsatsen blev fel. Filen kunde inte tala om
    // vilken kod som skrivit den. Nu kan den. Bumpa strängen när ett fälts BETYDELSE ändras,
    // inte vid vanliga ändringar.
    schemaVersion: "2026-08-02-prevclose",
    // Tidsstämpel för senaste BREDA hämtningen (movers-universumet med). Läses av
    // prices.yml:s dygnsgrind – se nextWideAt.
    wideAt: nextWideAt(prevWideAt, wide, new Date().toISOString()),
    note: "Automatiskt hämtade kurser. 'marketTime' är kursens verifierade tidsstämpel (ISO). " +
          "Använd endast om marketTime är från idag eller senaste handelsdagens stängning. " +
          "'previousClose' är föregående SESSIONS stängning (dagsrörelse = price/previousClose − 1). " +
          "Saknas 'schemaVersion' är filen skriven före 2026-08-02 och previousClose pekar då " +
          "~en vecka bakåt – räkna INTE dagsrörelser ur en sådan fil. " +
          "'volume' är omsatta enheter i den session marketTime pekar på, null när källan inte " +
          "ger volym (index rapporterar ingen). 20-dagarssnittet att jämföra mot ligger i " +
          "state/price_history.json under toppnyckeln 'volumes'.",
    tickerCount: tickers.length,
    okCount,
    extendedCount: extCount,
    quotes
  };
  mkdirSync("state", { recursive: true });
  writeFileSync("state/prices.json", JSON.stringify(out, null, 2) + "\n");
  updatePriceHistory(quotes);
  updateVolumeHistory(quotes);
  console.log(`Skrev state/prices.json: ${okCount}/${tickers.length} tickers hämtade, ` +
              `${extCount} med utökad session.`);
  return out;
}

/* Datumet en historikpunkt ska bära: KURSENS EGEN SESSION, inte väggklockan.

   VARFÖR (fix 2026-08-17, åtgärdspunkt 3 i veckorapport-260817). Funktionen
   daterade punkten med `new Date().toISOString().slice(0,10)`, alltså UTC-dagen
   på runnern. Cronen kör från 05:00 UTC medan Stockholm öppnar 07:00 och New
   York 13:30 – FÖRE öppning är `q.price` fortfarande föregående stängning, så
   en punkt daterad "i dag" skrevs med gårdagens värde. Mätt 2026-08-17 06:34
   UTC bar 59 av 62 serier en sista punkt identisk med föregående dags; bara de
   marknader som handlas dygnet runt (BTC-USD, ETH-USD, USDSEK=X) hade genuint
   nya värden.

   En dubblerad stängning är inte neutral för glidande medelvärden – den
   förskjuter varje fönster ett steg och pressar EMA-serien mot det upprepade
   värdet. ASSA-B.ST:s MACD-histogram blev −0,676 på råserien mot −0,287 på den
   avdubblerade, och HEXA-B.ST BYTTE TECKEN, från +0,177 till −0,016: en
   påhittad bearish korsning i precis den indikator grind 2 avgörs av. Båda
   rotationerna kör före sin marknads öppning (nordisk 06:40 UTC, US 13:00 UTC),
   så de läste ALLTID den trasiga svansen.

   Med marketTime-datering blir en förbörskörning ett NO-OP: fredagens kurs
   skriver om fredagens punkt med samma värde i stället för att uppfinna en
   måndagspunkt. Punkten mognar sedan till en riktig stängning när
   stängningskörningen (16:45 UTC nordiskt, 21:10 UTC för USA) skriver sist.

   Ingen tidsstämpel ⇒ INGEN punkt. Samma regel som gäller i hela systemet
   ("verifierad källa + tidsstämpel"); serien som indikatorerna räknas ur är
   sista stället där en odaterad kurs hör hemma. Gäller i praktiken bara
   stooq-reserven, som kan svara utan datum. */
export function historyDate(q){
  const mt = q && q.marketTime;
  if (typeof mt !== "string") return null;
  const m = mt.match(/^(\d{4}-\d{2}-\d{2})/);
  return m ? m[1] : null;
}

// Rullande prishistorik (max 250 punkter/ticker ≈ 1 år, en per dag).
// Taket var 60 punkter när filen bara matade sparklines. Sedan alpha-mätningen tillkom
// används serien till att räkna benchmarkets utveckling över varje affärs EXAKTA hållperiod,
// och katalysator-horisonterna är nu upp till 6 veckor – med 60 punkter föll äldre affärer
// tyst ur mätningen (perioden utanför historiken ⇒ alpha = null). Retron läser samma fil.
// Håll i synk med MAX_POINTS i backfill-history.mjs.
export const MAX_HISTORY = 250;

/* Skriver [datum, värde] i en stigande serie och returnerar den (kapad).

   Tre fall, i ordning: samma datum som sista punkten ERSÄTTER den (dagens
   värde uppdateras under sessionen), ett nyare datum läggs till, och ett äldre
   datum uppdaterar bara en punkt som REDAN FINNS. Det sista är regeln som gör
   förbörskörningen ofarlig, och den skriver aldrig bakåt: en föråldrad kvot får
   inte stoppas in mitt i serien, för då blir avståndet mellan två punkter inte
   längre en handelsdag och varje EMA räknad på indexpositioner blir fel. */
export function appendPoint(arr, date, value, maxPoints = MAX_HISTORY){
  if (!Array.isArray(arr) || !date || value == null || isNaN(Number(value))) return arr || [];
  const v = Number(value);
  const last = arr.length ? arr[arr.length - 1] : null;
  if (!last || date > last[0]) arr.push([date, v]);
  else if (date === last[0]) arr[arr.length - 1] = [date, v];
  else {
    for (let i = arr.length - 2; i >= 0; i--){
      if (arr[i][0] === date){ arr[i] = [date, v]; break; }
      if (arr[i][0] < date) break;          // datumet finns inte – lämna serien orörd
    }
  }
  return arr.length > maxPoints ? arr.slice(-maxPoints) : arr;
}

export function updatePriceHistory(quotes){
  const path = "state/price_history.json";
  let hist = { series: {} };
  if (existsSync(path)) { try { hist = JSON.parse(readFileSync(path, "utf8")); } catch {} }
  hist.series = hist.series || {};
  let noTime = 0;
  for (const [sym, q] of Object.entries(quotes)){
    if (!q || q.error || q.price == null) continue;
    const d = historyDate(q);
    if (!d){ noTime++; continue; }
    hist.series[sym] = appendPoint(hist.series[sym] || [], d, q.price);
  }
  hist.generatedAt = new Date().toISOString();
  if (noTime) console.log(`  ${noTime} kvot(er) utan marketTime – ingen historikpunkt skriven.`);
  mkdirSync("state", { recursive: true });
  writeFileSync(path, JSON.stringify(hist) + "\n");
  return hist;
}

/* Rullande VOLYMHISTORIK i en EGEN fil, inte som en nyckel i price_history.json.

   Två skäl, båda mätta. (1) `price_history.json` är 470 kB och hämtas DIREKT av
   app.js vid varje sidladdning – volymerna hade lagt på ungefär lika mycket
   igen, och dashboarden använder inte en enda av dem. Det är samma avvägning
   som fick tredjepartsbiblioteken att laddas lat: startvyn ska inte betala för
   data den inte läser. (2) Formen `series[sym] = [[datum, stängning], …]` är ett
   parsningskontrakt som vparse.js, vrender.js, app.js, decision_eval.mjs,
   movers.mjs och watchdog.mjs alla läser – en punkt som växer till tre element
   hade krävt en ändring i sex filer.

   Läsaren är grind 2 i rotationsprompterna, som kör mot ett git-checkout och
   alltså inte betalar någon nätkostnad för filen. Samma form som price_history,
   så samma hjälpfunktioner fungerar på båda. */
export function updateVolumeHistory(quotes){
  const path = "state/volume_history.json";
  let hist = { series: {} };
  if (existsSync(path)) { try { hist = JSON.parse(readFileSync(path, "utf8")); } catch {} }
  hist.series = hist.series || {};
  for (const [sym, q] of Object.entries(quotes)){
    if (!q || q.error) continue;
    // 0 ÄR INTE VOLYMDATA (fix 2026-08-26). Filtret fanns i stooq-grenen
    // (`vol > 0 ? vol : null`) men INTE i Yahoo-grenen, som är den primära:
    // `meta.regularMarketVolume ?? lastVolumeFrom(res)` släppte igenom nollan
    // rakt in i serien. En nolla i ett 20-dagarssnitt drar snittet nedåt så att
    // NÄSTA dag ser ut som ett volymutbrott den inte är – och det är exakt
    // delkriteriet "volym > 1,5× 20-dagarssnittet" i grind 2 som läser serien.
    // Mätt 2026-08-26: `^OMX` och `USDSEK=X` bar 8 av 8 nollpunkter, alltså
    // instrument som strukturellt saknar volym. Ingen AKTIE var drabbad ännu,
    // så felet hade inte hunnit ändra ett beslut – men en handelsstoppad dag
    // eller en tunn session hade räckt. Saknad volym ska bli INGEN PUNKT, inte
    // en nolla: en lucka är ärlig, en nolla är ett påstående om att inget
    // omsattes.
    if (!(Number(q.volume) > 0)) continue;
    const d = historyDate(q);
    if (!d) continue;
    hist.series[sym] = appendPoint(hist.series[sym] || [], d, q.volume);
  }
  hist.generatedAt = new Date().toISOString();
  hist.note = "Omsatta enheter per handelsdag, [datum, volym]. Samma form som " +
              "price_history.json. Ligger i EGEN fil därför att dashboarden hämtar " +
              "price_history.json vid varje sidladdning och inte läser volym. " +
              "Läsare: delkriteriet 'volym > 1,5× 20-dagarssnittet' i grind 2.";
  mkdirSync("state", { recursive: true });
  writeFileSync(path, JSON.stringify(hist) + "\n");
  return hist;
}

// kör bara när scriptet startas direkt (inte vid import i test)
const invokedDirectly = process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("fetch-prices.mjs");
if (invokedDirectly) {
  // --wide = dagens första körning, se needsDailyRun och prices.yml.
  run(globalThis.fetch, process.argv.includes("--wide")).catch(e => { console.error("Fel:", e); process.exit(1); });
}
