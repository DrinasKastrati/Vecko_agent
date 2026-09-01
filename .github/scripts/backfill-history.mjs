#!/usr/bin/env node
/* ============================================================
   ENGÅNGS-BACKFILL av state/price_history.json.

   VARFÖR DEN FINNS (2026-08-03):
   `fetch-prices.mjs` skriver EN punkt per ticker och dag och har taket 250
   punkter. Taket var alltså aldrig problemet – filen var bara ny. Den 3 augusti
   2026 innehöll den 16 sessioner, och det räckte inte för de regler systemet
   faktiskt kör på:
     * regimfiltret (punkt 2b i prompterna) kräver MA100 för ^OMX  -> 100 punkter
     * MACD(12,26,9) kräver ~35 stängningar
     * EMA200 kräver 200
   Rotationen 2026-08-03 kunde därför inte mäta 3 av 5 indikatorer i sitt egna
   tekniska filter, och tillämpade regimfiltret "i sin strängare riktning" utan
   att ha data. Backtestet visade samtidigt att regimfiltret är den ENDA parameter
   som förbättrar både avkastning och drawdown i BÅDA marknaderna – alltså kördes
   systemet blint på sin bästa regel. Det här skriptet fyller hålet en gång.
   Därefter räcker den löpande hämtningen.

   Kör:  node .github/scripts/backfill-history.mjs          (1 år, alla symboler)
         node .github/scripts/backfill-history.mjs 2y       (annat spann)
         node .github/scripts/backfill-history.mjs 1y ^OMX  (bara vissa symboler)
         node .github/scripts/backfill-history.mjs --missing=200 1y
                                            (bara symboler med kort serie)

   --missing-LÄGET (2026-08-17, åtgärdspunkt 1 i veckorapport-260817):
   Sista raden i huvudet ovan – "Därefter räcker den löpande hämtningen" – höll
   inte. Skriptet anropades av INGEN workflow, så det som skrevs som en
   engångsåtgärd blev en engångsåtgärd: `backfilledAt` stod kvar på
   2026-08-03T11:05:07Z i fjorton dagar medan varje NY ticker startade på EN
   punkt och växte en per handelsdag. Grind 2 kräver 15 punkter (RSI 14) och
   ~35 (MACD 12,26,9), alltså tre veckor innan en färsk kandidat ens går att
   poängsätta – och 12 av 27 bruttokandidater i v34 föll på exakt det, däribland
   veckans näst starkaste katalysator. Att lägga en ticker i watchlisten i
   förväg löser grind 1 men INTE grind 2.

   Läget körs nu dagligen ur prices.yml (05:00-cronen). Det väljer symbolerna
   med KORTAST serie först, eftersom en serie på 1 punkt blockerar allt medan
   en på 190 bara blockerar EMA200, och det har ett tak per körning så att en
   bred watchlist-utökning inte kan förvandla hämtningen till hundratals
   Yahoo-anrop.

   Läget skriver `partialBackfilledAt`, ALDRIG `backfilledAt`. Det senare är
   signalen "hela universumet är fyllt en gång" och läses av rapporterna som
   färskhetsmått; låter man en delkörning röra det maskeras att en full backfill
   aldrig gjorts. Två fält, två betydelser.

   MERGE-REGEL: Yahoos STÄNGNING vinner för alla dagar utom dagens. Befintliga
   punkter är skrivna av pris-hämtaren under dagen och är alltså intradagsvärden
   för innevarande dag men stängningar för äldre dagar; en officiell stängning är
   aldrig sämre. Dagens punkt lämnas orörd om Yahoo ännu inte har en stängd bar,
   annars vore ett halvfärdigt dagsvärde att skriva över ett annat halvfärdigt.
   Symboler som INTE går att hämta lämnas exakt som de är – skriptet raderar
   aldrig historik.
   ============================================================ */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const MAX_POINTS = 250;   // samma tak som fetch-prices.mjs – håll dem i synk

/* ---- rena hjälpfunktioner (testbara, ingen nätåtkomst) ---------------- */

// Yahoo chart-json -> [[datum, stängning], …] stigande, hål bortfiltrerade.
export function candlesToSeries(json){
  const r = json && json.chart && json.chart.result && json.chart.result[0];
  if (!r || !r.timestamp || !r.indicators || !r.indicators.quote) return [];
  const close = (r.indicators.quote[0] || {}).close || [];
  const out = [];
  for (let i = 0; i < r.timestamp.length; i++){
    const c = close[i];
    if (c == null || isNaN(c)) continue;
    out.push([new Date(r.timestamp[i] * 1000).toISOString().slice(0, 10), c]);
  }
  return out;
}

/* Slår ihop befintlig serie med backfyllda punkter.
   `today` skickas in i stället för att läsas ur klockan så funktionen går att
   testa. Yahoo vinner på alla datum UTOM `today`, där en befintlig punkt
   behålls (pris-hämtaren har redan skrivit dagens värde, och Yahoo kan mitt på
   dagen leverera en obekräftad bar). Resultatet är sorterat och kapat till
   MAX_POINTS – de SENASTE punkterna behålls. */
export function mergeSeries(existing, fetched, today, maxPoints = MAX_POINTS){
  const byDate = new Map();
  for (const [d, p] of (existing || [])) if (d && p != null) byDate.set(d, p);
  for (const [d, p] of (fetched || [])){
    if (!d || p == null) continue;
    if (d === today && byDate.has(d)) continue;    // rör inte dagens egna värde
    byDate.set(d, p);
  }
  const merged = Array.from(byDate.entries()).sort((a, b) => a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0);
  return merged.length > maxPoints ? merged.slice(-maxPoints) : merged;
}

/* Yahoo chart-json -> [[datum, volym], …]. Samma form som candlesToSeries, så
   mergeSeries kan återanvändas rakt av.

   Varför volymen backfyllas och inte bara samlas framåt: delkriteriet i grind 2
   är "volym > 1,5× 20-dagarssnittet". Utan backfill finns inget snitt att
   jämföra mot förrän om tjugo handelsdagar, alltså är kriteriet omätbart lika
   länge till – och det har redan varit omätbart i tre veckorapporter.

   Nollvolymer filtreras bort. En stängd handelsdag ger 0 hos Yahoo, och en nolla
   som ingår i ett snitt drar det nedåt så att nästa dag ser ut som ett
   volymutbrott den inte är. */
export function candlesToVolumes(json){
  const r = json && json.chart && json.chart.result && json.chart.result[0];
  if (!r || !r.timestamp || !r.indicators || !r.indicators.quote) return [];
  const vol = (r.indicators.quote[0] || {}).volume || [];
  const out = [];
  for (let i = 0; i < r.timestamp.length; i++){
    const v = vol[i];
    if (v == null || isNaN(v) || Number(v) <= 0) continue;
    out.push([new Date(r.timestamp[i] * 1000).toISOString().slice(0, 10), Number(v)]);
  }
  return out;
}

/* Symboler vars serie är KORTARE än `minPoints`, kortast först.

   En symbol som saknas helt i historiken räknas som 0 punkter och hamnar därför
   först – det är precis de nyinlagda tickers läget finns för. `cap` begränsar
   en körning; resten tas nästa dag, eftersom listan sorteras om varje gång och
   de kortaste alltid går först. */
export function shortSeries(historySeries, symbols, minPoints, cap = 40){
  const rows = (symbols || []).map(s => ({ sym: s, n: ((historySeries || {})[s] || []).length }))
                              .filter(r => r.n < minPoints);
  rows.sort((a, b) => a.n - b.n || (a.sym < b.sym ? -1 : a.sym > b.sym ? 1 : 0));
  return rows.slice(0, cap).map(r => r.sym);
}

/* Instrument som STRUKTURELLT saknar volym: index (^OMX, ^GSPC, ^IXIC) och
   valutapar (USDSEK=X). Yahoo svarar 0 för dem, inte null – de får därför aldrig
   räknas som "kort volymserie", annars äter de hela dygnets tak för alltid utan
   att någonsin bli längre. Krypto (BTC-USD) har äkta volym och ingår. */
export const VOLUMELESS = /^\^|=X$/;

/* Symboler att backfylla, med hänsyn till BÅDA serierna (fix 2026-08-26).

   BUGGEN: urvalet gick uteslutande på prisseriens längd. När prisserierna väl
   var fulla plockades ingen symbol alls, och volymserien frös i det läge den
   råkade ha. Mätt 2026-08-26: **59 av 111 symboler hade ≥ 200 prispunkter och
   < 21 volympunkter** och var därmed permanent oåtkomliga för `--missing=200`.
   Följden var att delkriteriet "volym > 1,5× 20-dagarssnittet" i grind 2 och det
   RÄKNADE likviditetsgolvet var omätbara för dem – rapporterat sex gånger i
   retro-/veckorapporterna utan att något larmade, eftersom watchdogen inte läste
   volume_history.json alls.

   `minVolPoints` är 21 och inte högre därför att det är precis vad ett
   20-dagarssnitt kräver. Ett högre tak hade fått symboler vars källa bara har ett
   par veckors volym att väljas om varje dygn i all evighet. En vald symbol får
   ändå hela året i samma anrop – tröskeln styr VEM som väljs, inte hur mycket som
   hämtas.

   Prisbrist rankas alltid FÖRE volymbrist: MA200 i `price_history.json` är
   regimfiltrets spärr för hela boken, medan volymen bara är ett delkriterium. */
export function collectShortSymbols(priceSeries, volumeSeries, symbols,
                                    minPoints, minVolPoints = 21, cap = 40){
  const rows = [];
  for (const sym of symbols || []){
    const pn = ((priceSeries  || {})[sym] || []).length;
    const vn = ((volumeSeries || {})[sym] || []).length;
    const priceShort = pn < minPoints;
    const volShort   = !VOLUMELESS.test(sym) && vn < minVolPoints;
    if (!priceShort && !volShort) continue;
    rows.push({ sym, rank: priceShort ? pn : minPoints + vn });
  }
  rows.sort((a, b) => a.rank - b.rank || (a.sym < b.sym ? -1 : a.sym > b.sym ? 1 : 0));
  return rows.slice(0, cap).map(r => r.sym);
}

// Symboler att backfylla: allt filen redan känner till + båda watchlists.
export function collectSymbols(historySeries, watchlistTexts){
  const out = new Set(Object.keys(historySeries || {}));
  for (const text of watchlistTexts || []){
    for (const line of String(text).split("\n")){
      const s = line.trim();
      if (!s || s.startsWith("#")) continue;
      out.add(s);
    }
  }
  return [...out].sort();
}

/* ---- nätdel ----------------------------------------------------------- */
async function fetchSeries(sym, range){
  const url = "https://query1.finance.yahoo.com/v8/finance/chart/" +
              encodeURIComponent(sym) + "?range=" + range + "&interval=1d";
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) return { error: "HTTP " + res.status };
    const json = await res.json();
    return { series: candlesToSeries(json), volumes: candlesToVolumes(json) };
  } catch (e){ return { error: String(e && e.message || e) }; }
}

/* TAKET PER KÖRNING ÄR STÄLLBART (2026-08-31).

   Standard är 40 – oförändrat, och tillräckligt i normalläge eftersom urvalet
   bara returnerar symboler som FAKTISKT är korta. Flaggan finns för
   ikapphämtning: när movers-universumet kopplades in som kurskälla tillkom 75
   symboler på en gång, alla med EN historikpunkt, och med tak 40 tog det två
   dygn. Under de dygnen larmar watchdogens checkShortSeries (tolerated = 2)
   "backfill-refused" med orsaken "Yahoo levererar inte historiken (403/404 per
   symbol)" – vilket är FEL, och ett larm som pekar på fel sak bränner den
   uppmärksamhet nästa larm behöver.

   Ett ogiltigt, noll eller negativt värde faller tillbaka på 40 i stället för att
   accepteras: ett tak på 0 hade tystat backfillen helt, och den feltypen är
   osynlig – skriptet loggar "Inget att göra" och exitar 0. */
export function parseCap(args = [], fallback = 40){
  const a = (args || []).find(x => typeof x === "string" && x.startsWith("--cap="));
  if (!a) return fallback;
  const n = parseInt(a.split("=")[1], 10);
  return Number.isFinite(n) && n > 0 ? n : fallback;
}

/* SERIELUCKOR (2026-09-01) – den andra sortens "symbol saknas".

   Repot kände en mekanism för att data försvinner ur historiken: HELA SYMBOLER
   slutade hämtas när collectTickers läste en enda veckorapport (åtgärdat
   2026-08-17 med recentWeeklies(3) + lastSeen). Det finns en andra, som aldrig
   mättes: ENSTAKA DAGAR saknas MITT I en serie.

   MEKANISMEN: Yahoos chart-API returnerar tidvis `close: null` för en dag som i
   själva verket handlades. candlesToSeries filtrerar bort null-stängningar –
   korrekt, ett påhittat värde vore värre – men ingenting fyller dagen någonsin
   igen. `--missing=200` väljer bara symboler som är för KORTA, och en
   250-punktsserie med hål är inte kort. Felet är därför SJÄLVLÅSANDE och
   permanent.

   MÄTT 2026-09-01: 17 kursserier och 18 volymserier bar hål, samtliga med
   >= 200 punkter. Femton saknade SAMMA dag (2026-07-31) – en enda misslyckad
   hämtning som legat kvar i en månad utan att något blivit rött, eftersom ingen
   kontroll mäter KONTINUITET, bara LÄNGD.

   VARFÖR DET INTE ÄR KOSMETISKT: varje glidande medelvärde räknat på
   indexpositioner antar att två intilliggande punkter ligger EN handelsdag
   isär. Med ett hål är avståndet två dagar och fönstret förskjuts – samma klass
   av distorsion som fantompunkten 2026-08-17, fast åt andra hållet.

   KALENDERN BYGGS UR DATAT SJÄLVT, inte ur en hårdkodad helgdagslista: en dag
   räknas som handelsdag på en marknad när minst hälften av marknadens symboler
   har den. Det är självkalibrerande och kräver ingen underhållen kalender. */
export function marketOf(sym){
  if (typeof sym !== "string" || !sym) return null;
  if (sym.endsWith("-USD")) return null;          // krypto handlas dygnet runt
  if (sym.includes("=X"))   return null;          // valutapar likaså
  if (sym === "^OMX")       return ".ST";         // nordiskt index följer Stockholm
  if (sym.startsWith("^"))  return "US";          // ^GSPC/^IXIC följer New York
  if (sym.includes("."))    return sym.slice(sym.lastIndexOf("."));
  return "US";
}

/* Dygnet-runt-instrument måste undantas HELT. Buntas de med aktier hamnar
   lördagar i kalendern och varje aktie ser ut att sakna ~79 dagar – exakt det
   fel det första mätförsöket 2026-09-01 gjorde, innan bucketen rättades. */
export function buildCalendars(series, minShare = 0.5, minSymbols = 5){
  const räknare = {}, antal = {};
  for (const [sym, arr] of Object.entries(series || {})){
    const m = marketOf(sym);
    if (!m || !Array.isArray(arr) || !arr.length) continue;
    antal[m] = (antal[m] || 0) + 1;
    (räknare[m] ||= {});
    for (const rad of arr) if (rad && rad[0]) räknare[m][rad[0]] = (räknare[m][rad[0]] || 0) + 1;
  }
  const ut = {};
  for (const [m, dagar] of Object.entries(räknare)){
    const tröskel = Math.max(Math.min(minSymbols, antal[m]), Math.floor(antal[m] * minShare));
    ut[m] = new Set(Object.entries(dagar).filter(([, n]) => n >= tröskel).map(([d]) => d));
  }
  return ut;
}

/* Bara hål INOM symbolens EGET spann räknas. En serie som börjar senare än
   marknaden saknar ingenting – den är bara yngre, och att behandla det som en
   lucka hade gjort varje nyinlagd ticker permanent "trasig". */
export function symbolsWithGaps(series, calendars, minPoints = 30){
  const ut = [];
  for (const [sym, arr] of Object.entries(series || {})){
    const m = marketOf(sym);
    if (!m || !Array.isArray(arr) || arr.length < minPoints) continue;
    const kal = calendars && calendars[m];
    // Kalendern måste bära minst lika många dagar som vi kräver av en serie för
    // att den ska dömas. Ett fast tal här vore godtyckligt och stängde dessutom
    // ute varje liten marknad; kopplingen till minPoints är självkonsistent.
    if (!kal || kal.size < minPoints) continue;
    const har = new Set(arr.map(r => r && r[0]).filter(Boolean));
    const första = arr[0][0], sista = arr[arr.length - 1][0];
    const missing = [...kal].filter(d => d >= första && d <= sista && !har.has(d)).sort();
    if (missing.length) ut.push({ sym, points: arr.length, missing });
  }
  return ut.sort((a, b) => b.missing.length - a.missing.length || (a.sym < b.sym ? -1 : 1));
}

/* backfilledAt betyder "HELA universumet fyllt en gång" och läses som
   färskhetsmått av rapporterna. Villkoret var tidigare bara `!minPoints`,
   alltså sant även för en körning med NAMNGIVNA symboler – och 2026-09-01
   satte en sådan körning (elva symboler) fältet från 2026-08-03 till
   2026-08-31 och maskerade att ingen full backfill gjorts på en månad.
   Två fält, två betydelser: en körning är FULL bara när den varken filtrerar
   på serielängd eller på en symbollista. */
export function isFullRun(minPoints, only){
  return !minPoints && (!only || only.length === 0);
}

async function main(){
  const args = process.argv.slice(2).filter(Boolean);
  const missingArg = args.find(a => a === "--missing" || a.startsWith("--missing="));
  const cap = parseCap(args);
  const rest  = args.filter(a => a !== missingArg && !a.startsWith("--cap"));
  const range = rest[0] || "1y";
  const only  = rest.slice(1);
  // --missing utan värde = 200 punkter, alltså EMA200-golvet: det är den
  // längsta indikator systemet faktiskt kör (regimfiltret, MA200 i båda böckerna).
  const minPoints = missingArg
    ? (parseInt(String(missingArg).split("=")[1], 10) || 200)
    : null;
  const path = "state/price_history.json";

  const volPath = "state/volume_history.json";

  let hist = { series: {} };
  if (existsSync(path)){ try { hist = JSON.parse(readFileSync(path, "utf8")); } catch {} }
  hist.series = hist.series || {};

  // Volymerna ligger i en EGEN fil – se motiveringen i fetch-prices.mjs
  // (price_history.json hämtas av dashboarden vid varje sidladdning).
  let vol = { series: {} };
  if (existsSync(volPath)){ try { vol = JSON.parse(readFileSync(volPath, "utf8")); } catch {} }
  vol.series = vol.series || {};

  const wl = [];
  for (const f of ["config/watchlist.txt", "config/watchlist_us.txt"])
    if (existsSync(f)) wl.push(readFileSync(f, "utf8"));

  const candidates = only.length ? only : collectSymbols(hist.series, wl);
  /* URVALET TAR NUMERA BÅDE KORTA SERIER OCH SERIER MED HÅL (2026-09-01).
     Hålen ligger FÖRST i listan, före de korta, och det är avsiktligt: en kort
     serie växer en punkt per handelsdag av sig själv, medan ett hål mitt i en
     250-punktsserie ALDRIG fylls – urvalet såg bara på längd, så symbolen var
     permanent utom räckhåll. Taket gäller unionen. */
  let symbols;
  if (minPoints){
    const korta = collectShortSymbols(hist.series, vol.series, candidates, minPoints, 21, cap);
    const iUniversum = new Set(candidates);
    const hål = [...symbolsWithGaps(hist.series, buildCalendars(hist.series)),
                 ...symbolsWithGaps(vol.series, buildCalendars(vol.series))]
                .map(g => g.sym).filter(x => iUniversum.has(x));
    symbols = [...new Set([...hål, ...korta])].slice(0, cap);
    if (hål.length)
      console.log("  varav " + new Set(hål).size + " symbol(er) med HÅL i serien " +
                  "(de nås aldrig av längdkravet – se symbolsWithGaps)");
  } else symbols = candidates;
  const today = new Date().toISOString().slice(0, 10);
  if (minPoints)
    console.log(`Backfyller ${symbols.length} av ${candidates.length} symboler ` +
                `(< ${minPoints} kurspunkter ELLER < 21 volympunkter, ` +
                `kortast först, ${range})…`);
  else
    console.log(`Backfyller ${symbols.length} symboler (${range})…`);
  if (!symbols.length){ console.log("Inget att göra – alla serier är tillräckligt långa."); }

  let ok = 0, fail = 0, added = 0, volAdded = 0;
  const failed = [];
  for (const sym of symbols){
    const before = (hist.series[sym] || []).length;
    const volBefore = (vol.series[sym] || []).length;
    const r = await fetchSeries(sym, range);
    if (r.error || !r.series.length){
      fail++; failed.push(sym + " (" + (r.error || "tom serie") + ")");
      console.log(`  ${sym}: MISSLYCKADES – ${r.error || "tom serie"} (behåller ${before} befintliga)`);
    } else {
      hist.series[sym] = mergeSeries(hist.series[sym], r.series, today);
      // Volymen hämtas ur SAMMA svar – inget extra anrop. Tom volymserie
      // (index rapporterar ingen volym) lämnar nyckeln orörd i stället för att
      // skriva en tom lista som ser ut som utebliven data.
      if (r.volumes && r.volumes.length){
        vol.series[sym] = mergeSeries(vol.series[sym], r.volumes, today);
        volAdded += vol.series[sym].length - volBefore;
      }
      const after = hist.series[sym].length;
      added += after - before;
      ok++;
      console.log(`  ${sym}: ${before} → ${after} punkter` +
                  (r.volumes && r.volumes.length ? `, volym ${volBefore} → ${vol.series[sym].length}` : ""));
    }
    await new Promise(r2 => setTimeout(r2, 350));   // artigt tempo mot Yahoo
  }

  hist.generatedAt = new Date().toISOString();
  // Se huvudet: delkörningar rör ALDRIG backfilledAt, som betyder "hela
  // universumet fyllt en gång" och läses som färskhetsmått av rapporterna.
  // isFullRun (2026-09-01): villkoret var tidigare bara !minPoints, alltså sant
  // aven for en korning med NAMNGIVNA symboler - och en sadan korning satte faltet
  // 2026-09-01 och maskerade att ingen full backfill gjorts pa en manad.
  if (isFullRun(minPoints, only)) hist.backfilledAt        = new Date().toISOString();
  else                            hist.partialBackfilledAt = new Date().toISOString();
  mkdirSync("state", { recursive: true });
  writeFileSync(path, JSON.stringify(hist) + "\n");
  if (volAdded || Object.keys(vol.series).length){
    vol.generatedAt = new Date().toISOString();
    writeFileSync(volPath, JSON.stringify(vol) + "\n");
  }

  const langd = Object.values(hist.series).map(a => a.length);
  const minst = Math.min(...langd), median = langd.slice().sort((a, b) => a - b)[langd.length >> 1];
  console.log(`\nSkrev ${path}: ${ok} hämtade, ${fail} misslyckade, +${added} punkter, ` +
              `+${volAdded} volympunkter.`);
  console.log(`Serielängder: kortast ${minst}, median ${median}, längst ${Math.max(...langd)}.`);
  // Grind 2:s golv, uttryckt i symboler. Det är den siffra veckorapporten
  // rapporterar, så skriv den här i stället för att låta den räknas för hand.
  for (const [krav, vad] of [[15, "RSI(14)"], [35, "MACD(12,26,9)"], [200, "EMA200/regimfilter"]]){
    const n = langd.filter(l => l < krav).length;
    console.log(`  ${n} symbol(er) under ${krav} punkter ⇒ ${vad} omätbart för dem.`);
  }
  if (failed.length) console.log("Misslyckade symboler: " + failed.join(", "));
  // Regimfiltret är hela poängen med körningen – säg rakt ut om det går att köra nu.
  for (const b of ["^OMX", "^GSPC"]){
    const n = (hist.series[b] || []).length;
    console.log(`${b}: ${n} punkter ⇒ MA100 ${n >= 100 ? "GÅR att beräkna" : "går INTE att beräkna"}` +
                `, MA200 ${n >= 200 ? "GÅR" : "går INTE"}.`);
  }
}

const invokedDirectly = process.argv[1] && process.argv[1].replace(/\\/g, "/").endsWith("backfill-history.mjs");
if (invokedDirectly) main().catch(e => { console.error("Fel:", e); process.exit(1); });
