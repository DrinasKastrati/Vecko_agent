#!/usr/bin/env node
/* ============================================================
   EARNINGS-KALENDER – rapportdatum FÖRE rapporten, inte efter.

   Buggen som utlöste filen (2026-08-04): Palantir rapporterade 3/8 AMC. Scouten
   flaggade rapporten tre dagar i rad (rapport-260801, -260802, -260803) men kunde
   inte prissätta caset, eftersom PLTR inte låg i `config/watchlist_us.txt` och
   därför saknade kurs i `state/prices.json`. Grind 1 (verifierbar kurs) föll, och
   kandidaten kunde inte ens utvärderas. PLTR lades till i watchlisten 2026-08-04
   – DAGEN EFTER att aktien gått +27,6 %. Watchlisten fylldes alltså i efterhand,
   av en människa som läst en rapport, vilket är precis den fördröjning som gör
   att ett bevakat event inte går att agera på.

   Vad filen gör: hämtar kommande rapportdatum för de symboler systemet redan
   bryr sig om och skriver `state/earnings_calendar.json`. `fetch-prices.mjs`
   läser den och tar med varje symbol som rapporterar inom `horizonDays`, så att
   en VERIFIERAD kurs finns i prices.json innan rapporten släpps. Ingen symbol
   läggs till permanent i watchlisten – posten faller ur av sig själv när
   rapporten passerat, vilket håller listan kort utan manuell hygien.

   VIKTIGT OM YAHOO: `quoteSummary` kräver cookie + crumb sedan 2024 (utan dem
   401 "Invalid Crumb"). Flödet är: GET fc.yahoo.com -> plocka Set-Cookie ->
   GET /v1/test/getcrumb med cookien -> använd crumben som query-parameter.
   Crumben är kortlivad; den hämtas en gång per körning och återanvänds.

   `isEarningsDateEstimate: true` betyder att Yahoo GISSAR datumet ur förra årets
   kadens. Det fältet får ALDRIG tappas bort: ett gissat datum duger för att
   säkra en kurs i förväg, men det duger inte som "binär händelse inom 2
   handelsdagar" i en prompt – då hade en gissning kunnat blockera ett köp eller,
   värre, låtit ett köp gå igenom dagen före en riktig rapport.

   Kör:  node .github/scripts/earnings-calendar.mjs
   Skriver state/earnings_calendar.json. Kräver nätåtkomst (körs i prices.yml).
   ============================================================ */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/124.0 Safari/537.36";

export const SCHEMA_VERSION = "2026-08-04-earnings";
// Hur långt fram en rapport ska ligga för att symbolen ska prisbevakas.
// 10 handelsdagar ≈ två veckor: tillräckligt för att veckorotationen (måndag)
// ska hinna se den minst en gång innan den infaller.
export const DEFAULT_HORIZON_DAYS = 10;

// ---- rena funktioner (testbara, ingen nätåtkomst) -----------------------

/* Plockar ut ISO-datum + metadata ur quoteSummary-svaret. Returnerar null när
   modulen saknas eller inte innehåller ett datum – aldrig ett gissat fältvärde. */
export function parseCalendarEvents(json, symbol){
  const r = json && json.quoteSummary && json.quoteSummary.result;
  const ce = r && r[0] && r[0].calendarEvents;
  const e = ce && ce.earnings;
  if (!e) return null;
  const list = Array.isArray(e.earningsDate) ? e.earningsDate : [];
  const first = list.find(x => x && (x.raw != null || x.fmt));
  if (!first) return null;
  const iso = first.fmt || (first.raw != null
    ? new Date(first.raw * 1000).toISOString().slice(0, 10) : null);
  if (!iso) return null;
  const num = v => (v && v.raw != null && isFinite(v.raw)) ? v.raw : null;
  return {
    symbol,
    date: iso,
    // Yahoo gissar datumet ur förra årets kadens när bolaget inte bekräftat.
    // Fältet styr om prompten får behandla datumet som en BINÄR händelse.
    isEstimate: e.isEarningsDateEstimate === true,
    // Konsensus finns med för att en rapport ska kunna utvärderas mot förväntan
    // i efterhand – utan den går "beat" inte att avgöra utan en websökning.
    epsConsensus: num(e.earningsAverage),
    epsLow: num(e.earningsLow),
    epsHigh: num(e.earningsHigh),
    revenueConsensus: num(e.revenueAverage)
  };
}

/* Antal HANDELSDAGAR (mån–fre, helgdagar ignoreras) mellan två ISO-datum.
   Helgdagar spelar ingen roll här: felet blir som mest ett par dagar på ett
   fönster om tio, och riktningen är att fönstret blir något för brett – vilket
   är rätt håll att fela åt när syftet är att SÄKRA en kurs i förväg. */
export function tradingDaysBetween(fromIso, toIso){
  const a = Date.parse(fromIso + "T00:00:00Z"), b = Date.parse(toIso + "T00:00:00Z");
  if (!isFinite(a) || !isFinite(b)) return null;
  const sign = b >= a ? 1 : -1;
  let n = 0;
  for (let t = Math.min(a, b); t < Math.max(a, b); t += 86400e3){
    const dow = new Date(t + 86400e3).getUTCDay();
    if (dow !== 0 && dow !== 6) n++;
  }
  return n * sign;
}

/* Symboler som ska prisbevakas: rapport inom [0, horizonDays] handelsdagar.
   Redan passerade datum faller ur automatiskt – det är därför listan inte
   behöver städas för hand. */
export function upcomingWithin(entries, todayIso, horizonDays = DEFAULT_HORIZON_DAYS){
  const out = [];
  for (const e of entries || []){
    if (!e || !e.date) continue;
    const d = tradingDaysBetween(todayIso, e.date);
    if (d == null || d < 0 || d > horizonDays) continue;
    out.push(Object.assign({ tradingDaysAway: d }, e));
  }
  return out.sort((x, y) => x.tradingDaysAway - y.tradingDaysAway ||
                            String(x.symbol).localeCompare(String(y.symbol)));
}

/* Symbolerna kalendern ska täcka. Watchlistorna + böckernas innehav; alltså
   exakt de namn systemet redan bryr sig om. Universumfilerna utelämnas med
   flit – de är 30 + 30 namn som bara backtestet läser, och att fråga Yahoo om
   dem varje halvtimme vore onödig last utan mottagare. */
export function collectSymbols(readFile = p => existsSync(p) ? readFileSync(p, "utf8") : ""){
  const set = new Set();
  const addLines = txt => {
    for (const raw of String(txt || "").split("\n")){
      const t = raw.trim();
      if (!t || t.startsWith("#")) continue;
      // Index, valutapar och krypto rapporterar inte – hoppa över dem direkt.
      if (t.startsWith("^") || t.endsWith("=X") || t.endsWith("-USD")) continue;
      if (/^[A-Z0-9][A-Z0-9.\-]{0,13}$/.test(t)) set.add(t);
    }
  };
  addLines(readFile("config/watchlist.txt"));
  addLines(readFile("config/watchlist_us.txt"));
  // Innehav ur båda böckerna – ett innehav som rapporterar är precis det
  // prompten kallar "binär händelse inom 2 handelsdagar".
  for (const f of ["state/portfolj.md", "state/portfolj_us.md"]){
    const md = readFile(f);
    for (const m of String(md || "").matchAll(/\|\s*([A-Z][A-Z0-9]{0,5}(?:-[A-Z])?(?:\.(?:ST|OL|CO|HE))?)\s*\|/g)){
      const t = m[1];
      if (t.startsWith("^") || t.endsWith("-USD")) continue;
      set.add(t);
    }
  }
  return [...set].sort();
}

// ---- nät ---------------------------------------------------------------

/* Cookie + crumb. Returnerar { cookie, crumb } eller null.
   Misslyckas det är hela kalendern otillgänglig – filen skrivs då INTE över,
   så en tillfällig 401 inte raderar gårdagens giltiga datum. */
export async function getCrumb(fetchImpl = globalThis.fetch){
  try {
    const r1 = await fetchImpl("https://fc.yahoo.com", { headers: { "User-Agent": UA } });
    const raw = typeof r1.headers.getSetCookie === "function"
      ? r1.headers.getSetCookie() : [r1.headers.get("set-cookie")];
    const cookie = (raw || []).filter(Boolean).map(s => String(s).split(";")[0]).join("; ");
    if (!cookie) return null;
    const r2 = await fetchImpl("https://query2.finance.yahoo.com/v1/test/getcrumb",
      { headers: { "User-Agent": UA, "Cookie": cookie } });
    if (!r2.ok) return null;
    const crumb = (await r2.text()).trim();
    if (!crumb || crumb.length > 32 || /[<{]/.test(crumb)) return null;  // felsida, inte crumb
    return { cookie, crumb };
  } catch { return null; }
}

export async function fetchCalendar(symbol, auth, fetchImpl = globalThis.fetch){
  const url = "https://query2.finance.yahoo.com/v10/finance/quoteSummary/" +
    encodeURIComponent(symbol) + "?modules=calendarEvents&crumb=" + encodeURIComponent(auth.crumb);
  try {
    const r = await fetchImpl(url, { headers: { "User-Agent": UA, "Cookie": auth.cookie, "Accept": "application/json" } });
    /* 404 = instrumentet HAR ingen calendarEvents-modul. Det gäller ETF:er,
       index och valutapar – de rapporterar inte, så svaret är korrekt och inte
       ett fel. Skillnaden spelar roll: indexsleeven (SPY, XACT-OMXS30.ST) ligger
       i båda böckerna och plockas alltid upp av collectSymbols, så utan den här
       uppdelningen är `errors` ALDRIG tom och går därmed inte att larma på – ett
       verkligt fel (401 från crumb-flödet, 500, nätavbrott) skulle drunkna bland
       två permanenta 404:or. */
    if (r.status === 404) return { symbol, notApplicable: "instrumentet har inga rapporter (ETF/index/valuta)" };
    if (!r.ok) return { symbol, error: "HTTP " + r.status };
    const parsed = parseCalendarEvents(await r.json(), symbol);
    /* 200 med giltig JSON men UTAN rapportdatum ar en TACKNINGSLUCKA hos Yahoo,
       inte ett fel i var kedja. Nordiska sma- och medelbolag saknas ofta helt i
       calendarEvents. Klassades det som error fastnade det permanent i faltet:
       KABE-B.ST och STAR-B.ST fran v35, plus MGN.OL och PARKEN.CO, alltsa fyra
       symboler rapporterade som ATERKOMMANDE atgardspunkt tre veckor i rad – och
       da gick  inte langre att larma pa. Exakt samma slutsats som
       404-uppdelningen ovan drog. Tva utfall, tva hinkar. */
    return parsed || { symbol, noCoverage: "Yahoo har ingen rapportkalender for symbolen" };
  } catch (e) { return { symbol, error: String(e && e.message || e) }; }
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

export async function run(fetchImpl = globalThis.fetch){
  const symbols = collectSymbols();
  const auth = await getCrumb(fetchImpl);
  if (!auth){
    // Skriv INTE över filen. En tom kalender skulle tolkas som "inga rapporter
    // på väg", vilket är farligare än en dagsgammal kalender.
    console.error("Kunde inte hämta Yahoo-crumb – kalendern lämnas orörd.");
    process.exitCode = 1;
    return null;
  }
  console.log(`Hämtar rapportdatum för ${symbols.length} symboler…`);
  const entries = [], errors = {}, notApplicable = {}, noCoverage = {};
  for (const s of symbols){
    const r = await fetchCalendar(s, auth, fetchImpl);
    if (r && r.notApplicable) notApplicable[s] = r.notApplicable;
    else if (r && r.noCoverage) noCoverage[s] = r.noCoverage;
    else if (r && r.error) errors[s] = r.error;
    else if (r) entries.push(r);
    await sleep(250);
  }
  const today = new Date().toISOString().slice(0, 10);
  const upcoming = upcomingWithin(entries, today, DEFAULT_HORIZON_DAYS);
  const out = {
    generatedAt: new Date().toISOString(),
    schemaVersion: SCHEMA_VERSION,
    source: "Yahoo Finance quoteSummary/calendarEvents",
    horizonDays: DEFAULT_HORIZON_DAYS,
    note: "Rapportdatum för kommande rapporter. 'isEstimate: true' = Yahoo GISSAR datumet " +
          "ur förra årets kadens och det får INTE behandlas som en bekräftad binär händelse. " +
          "'upcoming' är de symboler som ska prisbevakas nu; fetch-prices.mjs läser den listan.",
    counts: { requested: symbols.length, resolved: entries.length,
              failed: Object.keys(errors).length,
              notApplicable: Object.keys(notApplicable).length,
              noCoverage: Object.keys(noCoverage).length,
              upcoming: upcoming.length },
    upcoming,
    all: entries.sort((a, b) => String(a.date).localeCompare(String(b.date))),
    // `errors` ska vara TOM i friskt läge – det är vad man larmar på.
    // Instrument utan rapporter (ETF/index/valuta) ligger separat.
    errors,
    notApplicable,
    noCoverage
  };
  writeFileSync("state/earnings_calendar.json", JSON.stringify(out, null, 2) + "\n");
  console.log(`Skrev state/earnings_calendar.json: ${entries.length}/${symbols.length} lösta, ` +
              `${Object.keys(notApplicable).length} utan rapporter (ETF/index), ` +
              `${Object.keys(errors).length} fel, ` +
              `${upcoming.length} rapporterar inom ${DEFAULT_HORIZON_DAYS} handelsdagar.`);
  if (Object.keys(errors).length)
    for (const [s2, e2] of Object.entries(errors)) console.log(`  FEL ${s2}: ${e2}`);
  for (const u of upcoming)
    console.log(`  ${u.symbol.padEnd(12)} ${u.date} (${u.tradingDaysAway} hd)${u.isEstimate ? " [gissat]" : ""}`);
  return out;
}

const isMain = process.argv[1] && import.meta.url.endsWith(process.argv[1].replace(/\\/g, "/").split("/").pop());
if (isMain) run().catch(e => { console.error(e); process.exit(1); });
