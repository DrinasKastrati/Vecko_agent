#!/usr/bin/env node
/* ============================================================
   Enkel testsvit för de rena funktionerna i webbappen + pris-
   hämtaren. Kör: node tests/run.mjs   (kräver ingen nätåtkomst)
   ============================================================ */
import { readFileSync } from "node:fs";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
globalThis.window = {};
const load = f => new Function("window", readFileSync(resolve(root, "assets", f), "utf8"))(globalThis.window);
// Windows: dynamisk import kräver file://-URL, inte "C:\..." (Node ≥ 22 vägrar absolut sökväg)
const mod = p => import(pathToFileURL(resolve(root, p)).href);
load("vparse.js"); load("vrender.js");
const VP = globalThis.window.VParse, VR = globalThis.window.VRender;
const FP = await mod(".github/scripts/fetch-prices.mjs");

let pass = 0, fail = 0;
const ok = (name, cond) => { if (cond) pass++; else { fail++; console.log("  FAIL:", name); } };

// ---- parseFilename ----
ok("parseFilename daily", VP.parseFilename("daglig-260710.md").type === "daily");
ok("parseFilename weekly", VP.parseFilename("veckorapport-260706.md").type === "weekly");
ok("parseFilename scout", VP.parseFilename("rapport-260710.md").type === "scout");
const an = VP.parseFilename("analys-BTC-USD-260711.md");
ok("parseFilename analysis", an && an.type === "analysis" && an.ticker === "BTC-USD" && an.dateISO === "2026-07-11");

// ---- parsePortfolio + computeTradeStats ----
const portf = [
  "# Portfölj",
  "**Ackumulerad avkastning sedan start:** 5 %",
  "## Aktuellt innehav",
  "| Aktie | Yahoo-ticker |", "|---|---|", "| – | – |",
  "## Kassa", "100 %",
  "## Historik",
  "| Stängd | Aktie | Entry-datum | Entry | Exit | Utfall % | Skäl |",
  "|---|---|---|---|---|---|---|",
  "| 2026-06-20 | Volvo B | 2026-06-10 | 100 | 105 | +5.0 % | målkurs |",
  "| 2026-06-27 | Novo B | 2026-06-20 | 200 | 190 | -5.0 % | stop-loss |"
].join("\n");
const p = VP.parsePortfolio(portf);
ok("parsePortfolio history", p.history.length === 2);
const ts = VP.computeTradeStats(p.history);
ok("tradeStats trades", ts.trades === 2);
ok("tradeStats winRate", ts.winRate === 0.5);
ok("tradeStats best/worst", ts.best === 5 && ts.worst === -5);
ok("tradeStats reasons", ts.byReason.target === 1 && ts.byReason.stop === 1);
ok("tradeStats holdDays", Math.abs(ts.avgHoldDays - 8.5) < 0.01);

// ---- renderers ----
ok("renderTradeStats", VR.renderTradeStats(ts).includes("Profit factor"));
ok("renderTradeStats empty", VR.renderTradeStats({ trades: 0 }).includes("Inga stängda"));
ok("sparkline svg", VR.sparkline([["a", 1], ["b", 2], ["c", 1.5]]).includes("<svg"));
ok("sparkline short=empty", VR.sparkline([["a", 1]]) === "");
ok("renderPrices+spark", VR.renderPrices(
  { generatedAt: new Date().toISOString(), quotes: { AAPL: { symbol: "AAPL", price: 200, currency: "USD", marketTime: new Date().toISOString() } } },
  { series: { AAPL: [["2026-07-09", 198], ["2026-07-10", 200]] } }).includes("spark"));
ok("renderAnalysisIndex stale", VR.renderAnalysisIndex([{ ticker: "NVDA", dateISO: "2020-01-01", sortKey: 1 }], []).includes("gammal"));
ok("renderScout empty", VR.renderScout(null).includes("Ingen scout"));

// ---- klamp + interaktivitet (ersätter hård trunkering) ----
ok("clamp renders full text", VR.clamp("abc def ghi", 2).includes("abc def ghi") && VR.clamp("x", 2).includes('--cl:2'));
ok("clamp empty", VR.clamp("", 3) === "" && VR.clamp(null, 3) === "");
ok("clamp has toggle", VR.clamp("text", 3).includes("clamp-more"));
ok("tickerPill", VR.tickerPill("NVDA").includes('data-goto-ticker="NVDA"'));

/* ---- enkel vy (renderSimple) ---------------------------------------------
   Vyns hela poäng är att svara på OM användaren måste göra något. Systemet
   lägger inga ordrar, så KÖP/SÄLJ i dagens rapport är en uppgift för Dren –
   testerna nedan låser just den skillnaden. */
const svHold = { name: "Volvo B", ticker: "VOLV-B.ST", decision: "BEHÅLL", since: "+3,2 %" };
ok("renderSimple: inget att göra", (() => {
  const h = VR.renderSimple({ books: [{ label: "Nordiska aktier", accum: 2.5, holdings: [svHold] }], actions: [] });
  return h.includes("Behöver du göra något") && h.includes(">Nej.<") &&
         h.includes("sv-verdict--ok") && !h.includes("sv-verdict--act");
})());
ok("renderSimple: köp blir en uppgift", (() => {
  const h = VR.renderSimple({
    books: [{ label: "Nordiska aktier", accum: 0, holdings: [svHold] }],
    actions: [{ decision: "KÖP", ticker: "ERIC-B.ST", name: "Ericsson B", why: "Orderrekyl efter rapport" }] });
  return h.includes("sv-verdict--act") && h.includes("1 affär att lägga") &&
         h.includes("Köp Ericsson B") && h.includes("Orderrekyl");
})());
ok("renderSimple: flera affärer böjs rätt", VR.renderSimple({ actions: [
  { decision: "KÖP", name: "A" }, { decision: "SÄLJ", name: "B" }] }).includes("2 affärer att lägga"));
ok("renderSimple: BEHÅLL skapar ingen uppgift men syns i loggen", (() => {
  const h = VR.renderSimple({ actions: [{ decision: "BEHÅLL", name: "Volvo B" }] });
  return h.includes(">Nej.<") && h.includes("behöll</b> Volvo B");
})());
ok("renderSimple: avvakta förklaras i klartext", VR.renderSimple({
  actions: [{ decision: "AVVAKTA", name: "SKF B", why: "kursen inte gick att bekräfta" }] })
    .includes("kursen inte gick att bekräfta"));
/* AVVAKTA får sex olika orsaker sedan köpväg (d) (2026-08-04). Vyn ska visa den
   VERKLIGA motiveringen, och när den saknas inte påstå någon alls – den gamla
   hårdkodade meningen ("eftersom kursen inte gick att bekräfta") var fel i de
   flesta nya fall. */
ok("hem/enkel: AVVAKTA visar sin faktiska orsak", VR.renderSimple({
  actions: [{ decision: "AVVAKTA", name: "AMD", why: "binär händelse inom 2 handelsdagar" }] })
    .includes("binär händelse inom 2 handelsdagar"));
ok("hem/enkel: AVVAKTA utan motivering påstår ingen orsak", (() => {
  const h = VR.renderSimple({ actions: [{ decision: "AVVAKTA", name: "AMD" }] });
  return h.includes("avstod från att agera") && !h.includes("kursen inte gick att bekräfta");
})());
ok("renderSimple: indexdelen förklaras", VR.renderSimple({ books: [{ label: "N", holdings: [
  { name: "XACT OMXS30", ticker: "XACT-OMXS30.ST", isSleeve: true }] }] }).includes("indexfond"));
ok("renderSimple: tomt innehav", VR.renderSimple({ books: [{ label: "N", holdings: [] }] }).includes("äger inget"));
ok("renderSimple: blockerad datakälla varnar", VR.renderSimple({ blocked: true }).includes("kunde inte bekräfta alla kurser"));
ok("renderSimple: avkastning saknas ger inte NaN", (() => {
  const h = VR.renderSimple({ totalAccum: null });
  return !/NaN/.test(h) && h.includes("minst en avslutad affär");
})());
ok("renderSimple: negativ avkastning märks", VR.renderSimple({ totalAccum: -4.2 }).includes('sv-big neg'));
ok("plainPct: svenskt decimaltecken", VR.plainPct(2.04) === "+2,0 %" && VR.plainPct(-4.25) === "−4,3 %"
  && VR.plainPct(0) === "0,0 %" && VR.plainPct(null) === "–" && VR.plainPct(NaN) === "–");
ok("renderSimple: procent skrivs med komma, inte punkt", (() => {
  const h = VR.renderSimple({ totalAccum: 2.04, books: [{ label: "Nordiska aktier", accum: 3.19, holdings: [] }] });
  return h.includes("+2,0 %") && h.includes("+3,2 %") && !/\d\.\d+ %/.test(h);
})());
ok("signPct rörs inte av enkla vyn", VR.signPct(2.04) === "+2.04 %");
ok("renderSimple: escapar rapporttext", (() => {
  const h = VR.renderSimple({ actions: [{ decision: "KÖP", name: "<img src=x onerror=alert(1)>", why: "<b>x</b>" }] });
  return !h.includes("<img") && !h.includes("<b>x</b>") && h.includes("&lt;img");
})());
ok("renderSimple: tål tomt anrop", (() => {
  const h = VR.renderSimple();
  return h.includes("sv-verdict") && !/undefined|NaN/.test(h);
})());
ok("renderSimple: ordlistan finns", VR.renderSimple({}).includes("Vad betyder orden?"));

/* ---- gemensam vy: kostnad och index PER AFFÄR ------------------------------
   Böckerna har olika rundturskostnad (~0,25 % nordiskt, ~0,75 % i USD med
   växlingspåslag) och olika benchmark. I den gemensamma vyn måste därför varje
   rad bära sin egen – ett snitt hade gjort nettot fel åt båda håll och mätt
   alpha mot fel marknad. */
const bok = (namn, bok_, utfall, from, to) => ({
  Bok: bok_, "Stängd": to, "Aktie": namn, "Entry-datum": from, "Utfall %": utfall, "Vikt": "50 %"
});
const blandad = [bok("Alleima", "Nordisk", "+6,39 %", "2026-01-05", "2026-01-09"),
                 bok("JPMorgan", "US", "+1,99 %", "2026-01-05", "2026-01-09")];
ok("computeTradeStats: costPct får vara en funktion", (() => {
  const fast = VP.computeTradeStats(blandad, 0.25);
  const per  = VP.computeTradeStats(blandad, o => o.Bok === "US" ? 0.75 : 0.25);
  // samma bruttotal, men nettot skiljer eftersom US-raden bär högre kostnad
  return fast.trades === 2 && per.trades === 2 &&
         Math.abs(fast.chainedPct - per.chainedPct) < 1e-9 &&
         per.netChainedPct < fast.netChainedPct;
})());
ok("computeTradeStats: talform oförändrad", (() => {
  const a = VP.computeTradeStats(blandad, 0.25);
  return a.costPct === 0.25 && VP.computeTradeStats(blandad, o => 0.25).costPct === null;
})());
ok("computeTradeStats: funktion som ger samma värde = samma resultat", (() => {
  const a = VP.computeTradeStats(blandad, 0.5), b = VP.computeTradeStats(blandad, () => 0.5);
  return Math.abs(a.netChainedPct - b.netChainedPct) < 1e-12 && a.netWinRate === b.netWinRate;
})());
ok("computeAlpha: benchSym får vara en funktion", (() => {
  // priceHistory har en .series-wrapper, precis som state/price_history.json
  const ph = { series: { "^OMX": [["2026-01-05", 100], ["2026-01-09", 102]],
                         "^GSPC": [["2026-01-05", 100], ["2026-01-09", 110]] } };
  const perBok = VP.computeAlpha(blandad, ph, o => o.Bok === "US" ? "^GSPC" : "^OMX");
  const v = Object.values(perBok).map(x => x.benchPct);
  // nordiska raden mäts mot +2 %, den amerikanska mot +10 %
  return v.some(x => Math.abs(x - 2) < 1e-9) && v.some(x => Math.abs(x - 10) < 1e-9);
})());
ok("computeAlphaStats: funktionsformen räknar alla affärer", (() => {
  // priceHistory har en .series-wrapper, precis som state/price_history.json
  const ph = { series: { "^OMX": [["2026-01-05", 100], ["2026-01-09", 102]],
                         "^GSPC": [["2026-01-05", 100], ["2026-01-09", 110]] } };
  const s = VP.computeAlphaStats(blandad, ph, o => o.Bok === "US" ? "^GSPC" : "^OMX");
  // Alleima +6,39 mot +2 = slår index; JPM +1,99 mot +10 = slår inte
  return s.trades === 2 && s.beat === 1;
})());
ok("tickerPill empty", VR.tickerPill("") === "");
ok("renderHistory sortable", VR.renderHistory(p).includes("tbl--sort"));
ok("renderPrices toolbar", VR.renderPrices({ generatedAt: new Date().toISOString(), quotes: { AAPL: { symbol: "AAPL", price: 200, marketTime: new Date().toISOString() } } }, null).includes("pxSearch"));
ok("renderPrices data-tk", VR.renderPrices({ generatedAt: new Date().toISOString(), quotes: { AAPL: { symbol: "AAPL", price: 200 } } }, null).includes('data-tk="AAPL"'));
ok("holdings motivation clamped not cut", VR.renderHoldings(
  { dateISO: "2026-07-10", holdings: [{ name: "A", ticker: "AAPL", exchange: "N", price: "", since: "", stop: "", target: "", decision: "BEHÅLL", news: "", motivation: "M".repeat(400) }] },
  { pending: [] }, {}, {}
).includes("M".repeat(400)));
ok("scout sections collapsible", VR.renderScout({ dateISO: "2026-07-14", climate: "", recap: "En rad text.", econ: "", events: "", macro: "", cases: [] }).includes("<details"));
const wkFull = VP.parseWeekly([
  "# V", "## Case 1: Foo (FOO.ST/Nasdaq)", "### 1. Katalysatorn",
  "Mening ett. Mening två. Mening tre är kvar.", "### 6. Handelsplan",
  "| Entry | Stop | Mål | R/R |", "|---|---|---|---|", "| 1 | 2 | 3 | 4 |"
].join("\n"), { dateISO: "2026-07-13", sortKey: 1 });
ok("weekly catalyst keeps full text", wkFull.cases[0].catalyst.includes("Mening tre"));
ok("weekly catalyst no table bleed", !wkFull.cases[0].catalyst.includes("Entry"));

// ---- dagsdiff (Ändrat idag-remsan) ----
const dToday = { holdings: [
  { ticker: "AAPL", decision: "SÄLJ", stop: "96,00 kr", target: "120" },
  { ticker: "NVO",  decision: "BEHÅLL", stop: "700", target: "820" },
  { ticker: "SAAB-B.ST", decision: "KÖP", stop: "400", target: "500" }
] };
const dYest = { holdings: [
  { ticker: "AAPL", decision: "BEHÅLL", stop: "94,05 kr", target: "120" },
  { ticker: "NVO",  decision: "BEHÅLL", stop: "700", target: "820" }
] };
const dd = VP.diffDailies(dToday, dYest);
ok("diff decision", dd.AAPL && dd.AAPL.changes.some(c => c.field === "beslut" && c.to === "SÄLJ"));
ok("diff stop up", dd.AAPL.changes.some(c => c.field === "stopp" && c.from === 94.05 && c.to === 96 && c.up === true));
ok("diff unchanged skipped", !dd.NVO);
ok("diff new ticker", dd["SAAB-B.ST"] && dd["SAAB-B.ST"].isNew === true);
ok("diff null-safe", Object.keys(VP.diffDailies(dToday, null)).length === 0);
ok("diffStrip renders", VR.diffStrip(dd.AAPL).includes("hold-diff") && VR.diffStrip(dd.AAPL).includes("SÄLJ"));
ok("diffStrip new", VR.diffStrip({ isNew: true, changes: [] }).includes("NY IDAG"));
ok("holdings diff strip", VR.renderHoldings(
  { dateISO: "2026-07-16", holdings: [{ name: "Apple", ticker: "AAPL", exchange: "NASDAQ", price: "", since: "", stop: "96", target: "120", decision: "SÄLJ", news: "", motivation: "" }] },
  { pending: [] }, {}, {}, { AAPL: { isNew: false, changes: [{ field: "beslut", from: "BEHÅLL", to: "SÄLJ" }] } }
).includes("hold-diff"));

// ---- scout-uppföljning ----
const sc = VP.parseScout([
  "# Daglig Scout", "**Marknadsklimat:** risk-on",
  "## Uppföljning av tidigare case", "- NVDA (rapport-260715): 170 → 175 (+2,9 %) – tes INTAKT",
  "## Dagens case", "### Case 1: Nvidia (NVDA / NASDAQ)", "**Katalysator:** x"
].join("\n"), { dateISO: "2026-07-16" });
ok("scout followup parsed", sc.followup.includes("NVDA") && sc.followup.includes("INTAKT"));
ok("scout followup rendered", VR.renderScout(sc).includes("Uppföljning av tidigare case"));

// ---- fulltextsökning ----
const sdocs = [
  { meta: { name: "daglig-260715.md", type: "daily", dateISO: "2026-07-15", label: "15 jul", sortKey: 20260715 },
    text: "# Rapport\n**Motivering:** Alleima steg på stark rapport.\nAlleima nämns igen." },
  { meta: { name: "rapport-260716.md", type: "scout", dateISO: "2026-07-16", label: "16 jul", sortKey: 20260716 },
    text: "Inget relevant här." }
];
const srch = VP.searchDocs(sdocs, "alleima");
ok("searchDocs hits", srch.length === 1 && srch[0].count === 2 && srch[0].snippets.length === 2);
ok("searchDocs minlength", VP.searchDocs(sdocs, "a").length === 0);
ok("searchDocs meta", srch[0].meta.name === "daglig-260715.md");
const srHtml = VR.renderSearchResults(srch, "alleima");
ok("searchResults mark+open", srHtml.includes("<mark>Alleima</mark>") && srHtml.includes('data-open-report="daglig-260715.md"'));
ok("searchResults empty", VR.renderSearchResults([], "xyz").includes("Inga träffar"));

// ---- alert-historik ----
const AL = await mod(".github/scripts/alerts.mjs");
const hist = AL.mergeHistory(
  { active: [{ ticker: "ALLEI.ST", type: "KÖP", reason: "entry-villkor uppfyllt", level: 97 }], history: [] },
  [], "2026-07-16T10:00:00Z");
ok("mergeHistory expires", hist.length === 1 && hist[0].expiredAt === "2026-07-16T10:00:00Z" && hist[0].ticker === "ALLEI.ST");
ok("mergeHistory keeps active", AL.mergeHistory({ active: [{ ticker: "X", type: "SÄLJ" }] }, [{ ticker: "X", type: "SÄLJ" }], "t").length === 0);
ok("mergeHistory cap", AL.mergeHistory({ active: [], history: Array.from({ length: 60 }, (_, i) => ({ ticker: "T" + i, type: "KÖP" })) }, [], "t").length === 50);
ok("renderAlerts history", VR.renderAlerts({ active: [], history: hist }).includes("Tidigare signaler"));
ok("renderAlerts empty still empty", VR.renderAlerts({ active: [], history: [] }) === "");

// ---- digest + watchdog (rena funktioner) ----
const DG = await mod(".github/scripts/digest.mjs");
const dmd = ["# Daglig bevakning", "**Datum:** 2026-07-17 | **Läge:** Daglig bevakning",
  "**Marknadsläget i korthet:** Lugnt.", "",
  "## Innehav 1: Alleima (ALLEI.ST / Nasdaq Stockholm)", "",
  "| Aktuell kurs | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |", "|---|---|---|---|---|",
  "| 98 kr | +1 % | 94 | 103 | **BEHÅLL** |", "",
  "**Motivering:** Tes intakt.", "",
  "## Pending-planer", "MORLD.OL: villkor ≤ 19,20 – EJ TRIGGAD (20,00)."].join("\n");
const dg = DG.buildDigest(dmd, "2026-07-17", false);
ok("digest title", dg.title.includes("2026-07-17"));
ok("digest decision", dg.body.includes("Alleima") && dg.body.includes("BEHÅLL"));
ok("digest pending", dg.body.includes("Pending-planer") && dg.body.includes("EJ TRIGGAD"));
ok("digest market", dg.body.includes("Lugnt"));
const WD = await mod(".github/scripts/watchdog.mjs");
ok("watchdog latest date", WD.latestReportDate(["daglig-260715.md", "daglig-260716.md", "x.md"], "daglig") === "260716");
const probs = WD.checkStale({ now: "2026-07-17T10:30:00Z", pricesGeneratedAt: "2026-07-15T05:00:00Z", latestDaily: "260716", latestWeekly: "260713", latestScout: "260717" });
ok("watchdog stale prices", probs.some(p => p.key === "prices"));
ok("watchdog missing daily", probs.some(p => p.key === "daily"));
ok("watchdog scout ok", !probs.some(p => p.key === "scout"));
const probs2 = WD.checkStale({ now: "2026-07-18T10:30:00Z", pricesGeneratedAt: "2026-07-10T05:00:00Z", latestDaily: "260710", latestWeekly: null, latestScout: null });
ok("watchdog weekend quiet", probs2.length === 0);
// nya kontroller: beslutslogg + nyhetsflöde (valfria fält – utelämnade = tyst)
const wdBase = { now: "2026-07-17T10:30:00Z", pricesGeneratedAt: "2026-07-17T05:00:00Z",
                 latestDaily: "260717", latestWeekly: "260713", latestScout: "260717" };
ok("watchdog utan nya fält = oförändrat tyst", WD.checkStale(wdBase).length === 0);
ok("watchdog larmar när beslutsloggen saknar dagens rader",
  WD.checkStale({ ...wdBase, latestDecisionDate: "260716" }).some(p => p.key === "decisions"));
ok("watchdog tyst när beslutsloggen är i fas",
  !WD.checkStale({ ...wdBase, latestDecisionDate: "260717" }).some(p => p.key === "decisions"));
ok("watchdog larmar inte om beslut när rapporten ändå saknas",
  !WD.checkStale({ ...wdBase, latestDaily: "260716", latestWeekly: null, latestDecisionDate: "260716" })
    .some(p => p.key === "decisions"));
ok("watchdog larmar på gammalt nyhetsflöde",
  WD.checkStale({ ...wdBase, newsGeneratedAt: "2026-07-17T02:00:00Z" }).some(p => p.key === "news"));
ok("watchdog tyst på färskt nyhetsflöde",
  !WD.checkStale({ ...wdBase, newsGeneratedAt: "2026-07-17T09:00:00Z" }).some(p => p.key === "news"));
ok("watchdog larmar när news_feed.json saknas helt",
  WD.checkStale({ ...wdBase, newsGeneratedAt: null }).some(p => p.key === "news"));
ok("latestDecisionYmd", WD.latestDecisionYmd({ decisions: [{ date: "2026-07-14" }, { date: "2026-07-30" }] }) === "260730"
  && WD.latestDecisionYmd({ decisions: [] }) === null && WD.latestDecisionYmd(null) === null);
// monitor-hjärtslag: en tyst död monitor ska larmas, en frisk utan signaler inte
ok("watchdog larmar på gammalt monitor-hjärtslag",
  WD.checkStale({ ...wdBase, alertsCheckedAt: "2026-07-17T02:00:00Z" }).some(p => p.key === "alerts"));
ok("watchdog tyst på färskt hjärtslag",
  !WD.checkStale({ ...wdBase, alertsCheckedAt: "2026-07-17T07:00:00Z" }).some(p => p.key === "alerts"));
ok("watchdog larmar när checkedAt saknas helt (gammal alerts.mjs)",
  WD.checkStale({ ...wdBase, alertsCheckedAt: null }).some(p => p.key === "alerts"));

// veckans rörelser: en död lördagsaction får inte tysta retrons breddsökning
ok("watchdog larmar på gammal movers.json",
  WD.checkStale({ ...wdBase, moversGeneratedAt: "2026-07-01T06:00:00Z" }).some(p => p.key === "movers"));
ok("watchdog tyst när movers.json är från senaste lördagen",
  !WD.checkStale({ ...wdBase, moversGeneratedAt: "2026-07-11T06:00:00Z" }).some(p => p.key === "movers"));
ok("watchdog larmar när movers.json saknas",
  WD.checkStale({ ...wdBase, moversGeneratedAt: null }).some(p => p.key === "movers"));

// REGIMFILTRET (2026-08-03): en indexserie under 200 punkter tystar hela bokens
// nyöppning, och rapporten kan inte skilja det från en svag marknad.
ok("watchdog larmar när ^OMX inte räcker till MA200",
  WD.checkStale({ ...wdBase, regimeSeries: { "^OMX": 16, "^GSPC": 250 } })
    .some(p => p.key === "regime-^OMX"));
ok("watchdog larmar per index, inte generellt",
  (() => {
    const p = WD.checkStale({ ...wdBase, regimeSeries: { "^OMX": 250, "^GSPC": 3 } });
    return p.some(x => x.key === "regime-^GSPC") && !p.some(x => x.key === "regime-^OMX");
  })());
ok("watchdog tyst när båda serierna räcker",
  !WD.checkStale({ ...wdBase, regimeSeries: { "^OMX": 200, "^GSPC": 250 } })
    .some(p => String(p.key).startsWith("regime-")));
ok("watchdog larmar när indexet saknas helt ur price_history",
  WD.checkStale({ ...wdBase, regimeSeries: { "^OMX": 0, "^GSPC": 0 } })
    .filter(p => String(p.key).startsWith("regime-")).length === 2);
ok("watchdog utan regimeSeries = tyst (bakåtkompatibelt)",
  !WD.checkStale(wdBase).some(p => String(p.key).startsWith("regime-")));

// NYHETSFÖNSTRET: färsk fil och tunn fil är TVÅ olika fel. Den gamla kontrollen
// mätte bara generatedAt, så 47 minuters fönster passerade som friskt.
ok("watchdog larmar på för tunt nyhetsfönster",
  WD.checkStale({ ...wdBase, newsWindow: { tradingDays: 10, tradingDaysCovered: 1, missingDays: ["2026-07-16"] } })
    .some(p => p.key === "news-window"));
ok("watchdog tyst när fönstret bär 5 handelsdagar",
  !WD.checkStale({ ...wdBase, newsWindow: { tradingDays: 10, tradingDaysCovered: 5, missingDays: [] } })
    .some(p => p.key === "news-window"));
ok("färsk men tunn fil larmar ändå",
  (() => {
    const p = WD.checkStale({ ...wdBase, newsGeneratedAt: "2026-07-17T10:00:00Z",
      newsWindow: { tradingDays: 10, tradingDaysCovered: 1, missingDays: [] } });
    return p.some(x => x.key === "news-window") && !p.some(x => x.key === "news");
  })());
ok("watchdog utan newsWindow = tyst (filer före 2026-08-03)",
  !WD.checkStale({ ...wdBase, newsGeneratedAt: "2026-07-17T09:00:00Z" }).some(p => p.key === "news-window"));

// ---- monitorns hjärtslag (alerts.mjs) ----
ok("heartbeat förfaller när stämpeln är gammal",
  AL.heartbeatDue({ checkedAt: "2026-07-17T05:00:00Z" }, "2026-07-17T10:00:00Z"));
ok("heartbeat väntar när stämpeln är färsk",
  !AL.heartbeatDue({ checkedAt: "2026-07-17T09:00:00Z" }, "2026-07-17T10:00:00Z"));
ok("heartbeat faller tillbaka på generatedAt för filer utan checkedAt",
  !AL.heartbeatDue({ generatedAt: "2026-07-17T09:30:00Z" }, "2026-07-17T10:00:00Z"));
ok("heartbeat alltid due utan tidsstämpel", AL.heartbeatDue({}, "2026-07-17T10:00:00Z")
  && AL.heartbeatDue(null, "2026-07-17T10:00:00Z"));

// ---- statusrad, positionsmätare, besluts-historik ----
const g = VP.computeGauge(100, 90, 120, 110);
ok("gauge pcts", g && Math.abs(g.nowPct - 66.7) < 0.11 && Math.abs(g.entryPct - 33.3) < 0.11);
ok("gauge clamp", VP.computeGauge(100, 90, 120, 200).nowPct === 100);
ok("gauge invalid span", VP.computeGauge(100, 120, 90, 110) === null);
ok("gauge null input", VP.computeGauge(null, 90, 120, 110) === null);
const live2 = VP.computeHoldingLive({ "Yahoo-ticker": "AAPL", "Entry": "100", "Stop-loss": "90", "Målkurs": "120" }, { AAPL: { price: 110 } });
ok("holdingLive gauge", live2 && live2.gauge && Math.abs(live2.gauge.entryPct - 33.3) < 0.11);
const dh = VP.buildDecisionHistory([
  { dateISO: "2026-07-10", holdings: [{ ticker: "AAPL", decision: "BEHÅLL" }] },
  { dateISO: "2026-07-09", holdings: [{ ticker: "AAPL", decision: "KÖP" }] }
], "aapl");
ok("decisionHistory order", dh.length === 2 && dh[0].date === "2026-07-09" && dh[1].decision === "BEHÅLL");
ok("decisionHistory missing", VP.buildDecisionHistory([], "X").length === 0);
const nr = VP.nextRoutineRun(new Date(2026, 6, 11, 12, 0)); // lördag 11 jul 12:00
ok("nextRun weekend->scout", nr && nr.label === "scout" && nr.when === "sön 07:47");
const nr2 = VP.nextRoutineRun(new Date(2026, 6, 13, 8, 0)); // måndag 08:00
ok("nextRun monday->rotation", nr2 && nr2.label === "rotation" && nr2.when === "mån 08:40");
// allokering (måndag 15:30, efter båda veckorotationerna) + retro (lördag 10:00)
const nr3 = VP.nextRoutineRun(new Date(2026, 6, 13, 15, 10)); // måndag 15:10
ok("nextRun monday 15:10 -> allokering", nr3 && nr3.label === "allokering" && nr3.when === "mån 15:30");
const nr4 = VP.nextRoutineRun(new Date(2026, 6, 13, 14, 50)); // måndag 14:50 – us-rotation först
ok("nextRun us-rotation före allokering", nr4 && nr4.label === "us-rotation" && nr4.when === "mån 15:00");
const nr5 = VP.nextRoutineRun(new Date(2026, 6, 11, 8, 0));   // lördag 08:00
ok("nextRun saturday -> retro", nr5 && nr5.label === "retro" && nr5.when === "lör 10:00");
const nr6 = VP.nextRoutineRun(new Date(2026, 6, 14, 15, 10)); // tisdag 15:10 – ingen allokering
ok("nextRun ingen allokering på tisdag", nr6 && nr6.label === "scout" && nr6.when === "ons 07:47");
ok("renderStatusRow chips", VR.renderStatusRow(
  { dateISO: "2026-07-10", mode: "LÄGE B – bevakning", market: "x", holdings: [{ decision: "BEHÅLL" }, { decision: "BEHÅLL" }] },
  { label: "scout", when: "sön 07:47", rel: "om 19 tim" }
).includes("2× BEHÅLL"));
ok("renderStatusRow empty", VR.renderStatusRow(null, null) === "");
ok("holdingCard dots", VR.renderHoldings(
  { dateISO: "2026-07-10", holdings: [{ name: "A", ticker: "AAPL", exchange: "N", price: "", since: "", stop: "", target: "", decision: "BEHÅLL", news: "", motivation: "" }] },
  { pending: [] }, {}, { AAPL: [{ date: "2026-07-09", decision: "KÖP" }, { date: "2026-07-10", decision: "BEHÅLL" }] }
).includes("ddot--kop"));
ok("holdingCard live strip", VR.renderHoldings(
  { dateISO: "2026-07-10", holdings: [{ name: "Apple", ticker: "AAPL", exchange: "NASDAQ", price: "", since: "", stop: "", target: "", decision: "BEHÅLL", news: "", motivation: "" }] },
  { pending: [] }, { AAPL: { ticker: "AAPL", price: 110, currency: "USD", pnlPct: 10, toStopPct: -5, toTargetPct: 9 } }
).includes("hold-live"));

// ---- benchmark-overlay + live-P/L ----
const bh = VP.buildBenchmarkSeries({ series: { "^OMX": [["2026-07-01", 100], ["2026-07-02", 103]] } }, "^OMX");
ok("benchmarkSeries pct", bh && bh.length === 2 && bh[0].value === 0 && bh[1].value === 3);
ok("benchmarkSeries null", VP.buildBenchmarkSeries(null, "^OMX") === null);
ok("benchmarkSeries <2pts", VP.buildBenchmarkSeries({ series: { "^OMX": [["2026-07-01", 100]] } }, "^OMX") === null);

/* `fromDate` finns för att benchmarken annars normaliseras mot första punkten i
   HELA price_history.json. Efter backfillen 2026-08-03 (ett år bakåt) mätte
   overlayen ett år index mot fyra veckor strategi i samma diagram: OMXS30 visades
   som +29,8 % mot strategins +3,2 %, medan sanningen över strategins EGEN period
   var +3,0 % mot +3,2 %. Grafen vände alltså på slutsatsen. */
const bhHist = { series: { "^OMX": [["2026-06-01", 50], ["2026-07-01", 100], ["2026-07-02", 103]] } };
const bhClip = VP.buildBenchmarkSeries(bhHist, "^OMX", "2026-07-01");
ok("benchmarkSeries fromDate klipper äldre punkter", bhClip && bhClip.length === 2);
ok("benchmarkSeries fromDate normaliserar vid startdatumet",
  bhClip && bhClip[0].value === 0 && bhClip[1].value === 3);
ok("benchmarkSeries fromDate före historikens start ger hela serien",
  (VP.buildBenchmarkSeries(bhHist, "^OMX", "2026-01-01") || []).length === 3);
ok("benchmarkSeries fromDate som lämnar <2 punkter ger null",
  VP.buildBenchmarkSeries(bhHist, "^OMX", "2026-07-02") === null);
ok("benchmarkSeries utan fromDate är oförändrad",
  (VP.buildBenchmarkSeries(bhHist, "^OMX") || [])[0].value === 0 &&
  VP.buildBenchmarkSeries(bhHist, "^OMX").length === 3);

ok("seriesOnLabels carry", JSON.stringify(VP.seriesOnLabels(["a","b","c"], [{ date:"a", value:1 }, { date:"c", value:2 }])) === "[1,1,2]");
ok("seriesOnLabels leading null", VP.seriesOnLabels(["a","b"], [{ date:"b", value:5 }])[0] === null);
ok("numFrom", VP.numFrom("299,50 NOK") === 299.5 && VP.numFrom("–") === null);
const live = VP.computeHoldingLive({ "Yahoo-ticker": "AAPL", "Entry": "100", "Stop-loss": "90", "Målkurs": "120" }, { AAPL: { price: 110, currency: "USD" } });
ok("holdingLive pnl", live && Math.abs(live.pnlPct - 10) < 1e-9);
ok("holdingLive toStop", live && Math.abs(live.toStopPct - (90/110 - 1) * 100) < 1e-9);
ok("holdingLive toTarget", live && Math.abs(live.toTargetPct - (120/110 - 1) * 100) < 1e-9);
ok("holdingLive missing quote", VP.computeHoldingLive({ "Yahoo-ticker": "X", "Entry": "1" }, {}) === null);
ok("holdingLive error quote", VP.computeHoldingLive({ "Yahoo-ticker": "X" }, { X: { error: "fel" } }) === null);
ok("pxAge export", typeof VR.pxAge === "function" && VR.pxAge(new Date().toISOString()).cls === "px-fresh");

// ---- fetch-prices pure fns ----
ok("extractTickers", FP.extractTickers("köp ALLEI.ST och KOG.OL").length === 2);
ok("extractTickers hyphen class", FP.extractTickers("Saab (SAAB-B.ST) steg").includes("SAAB-B.ST"));
ok("extractTickers no junk B.ST", FP.extractTickers("Bahnhof (BAHN B.ST) fick bud").length === 0);
ok("extractTickers 2char ok", FP.extractTickers("4C.ST rapporterar").includes("4C.ST"));
ok("extractUsCaseTickers nasdaq", FP.extractUsCaseTickers("Case 1: NVIDIA (NVDA / NASDAQ)").includes("NVDA"));
ok("parseChart price", FP.parseChart({ chart: { result: [{ meta: { regularMarketPrice: 10, currency: "USD", regularMarketTime: 1700000000 } }] } }, "X").price === 10);
ok("updatePriceHistory export", typeof FP.updatePriceHistory === "function");
ok("fetchStooq export", typeof FP.fetchStooq === "function");
ok("collectUsTickers plockar upp valutaparet", FP.collectUsTickers().includes("USDSEK=X"));
ok("collectUsTickers plockar upp US-sleeven", FP.collectUsTickers().includes("SPY"));
ok("collectTickers plockar upp nordiska sleeven", FP.collectTickers().includes("XACT-OMXS30.ST"));
ok("extractTickers fångar ETF med långt efterled",
  FP.extractTickers("Indexsleeve (XACT-OMXS30.ST) 40 %").includes("XACT-OMXS30.ST"));
ok("extractTickers plockar fortfarande inte skräp ur 'BAHN B.ST'",
  !FP.extractTickers("BAHN B.ST").includes("B.ST"));
// previousClose: chartPreviousClose ligger före HELA range=5d-fönstret och gav
// veckorörelser presenterade som dagsrörelser. previousClose måste vinna.
ok("prevCloseFrom föredrar previousClose framför chartPreviousClose",
  FP.prevCloseFrom({ meta: { previousClose: 99, chartPreviousClose: 80 } }) === 99);
ok("prevCloseFrom härleder ur serien när meta-fältet saknas",
  FP.prevCloseFrom({ meta: { chartPreviousClose: 80 },
    indicators: { quote: [{ close: [80, 85, null, 90, 95] }] } }) === 90);
// dagens bar räknas bort via regularMarketTime (1785542400 = 2026-08-01)
ok("prevCloseFrom hoppar över dagens bar", FP.prevCloseFrom({
  meta: { chartPreviousClose: 80, regularMarketTime: 1785542400 },
  timestamp: [1785283200, 1785369600, 1785542400],   // 2026-07-29, -07-30, -08-01
  indicators: { quote: [{ close: [90, 95, 99] }] } }) === 95);
// okonsoliderad dagsbar (close = null) får INTE ge en tvåsessionersrörelse
ok("prevCloseFrom klarar okonsoliderad dagsbar", FP.prevCloseFrom({
  meta: { chartPreviousClose: 80, regularMarketTime: 1785542400 },
  timestamp: [1785283200, 1785369600, 1785542400],
  indicators: { quote: [{ close: [90, 95, null] }] } }) === 95);
ok("prevCloseFrom faller tillbaka på chartPreviousClose sist",
  FP.prevCloseFrom({ meta: { chartPreviousClose: 80 }, indicators: { quote: [{ close: [95] }] } }) === 80);
ok("prevCloseFrom null när inget finns", FP.prevCloseFrom({ meta: {} }) === null && FP.prevCloseFrom(null) === null);
ok("prices.json märks med schemaVersion så läsaren kan se om previousClose är rättad", (() => {
  const src = readFileSync(resolve(root, ".github/scripts/fetch-prices.mjs"), "utf8");
  return /schemaVersion:\s*"2026-08-02-prevclose"/.test(src);
})());
ok("parseChart använder rätt previousClose",
  FP.parseChart({ chart: { result: [{ meta: { regularMarketPrice: 100, previousClose: 99, chartPreviousClose: 80 } }] } }, "X")
    .previousClose === 99);

// ---- US-rotation (egen USD-bok) ----
ok("parseFilename us_daily", VP.parseFilename("us-daglig-260717.md").type === "us_daily");
ok("parseFilename us_weekly", VP.parseFilename("us-veckorapport-260717.md").type === "us_weekly");
ok("parseFilename nordic unaffected", VP.parseFilename("daglig-260717.md").type === "daily" && VP.parseFilename("veckorapport-260717.md").type === "weekly");
ok("extractUsPortfolioTickers", (() => {
  const md = ["| Aktie | Yahoo-ticker | Börs |", "|---|---|---|", "| Nvidia | NVDA | NASDAQ |", "| Apple | AAPL | NASDAQ |"].join("\n");
  const t = FP.extractUsPortfolioTickers(md);
  return t.includes("NVDA") && t.includes("AAPL") && !t.includes("AKTIE");
})());
ok("extractUsPortfolioTickers dash-skip", FP.extractUsPortfolioTickers("| Aktie | Yahoo-ticker |\n|---|---|\n| – | – |").length === 0);
const usPf = [
  "# Portfölj – US-rotation (USD)",
  "**Ackumulerad avkastning sedan start:** 0 %",
  "## Aktuellt innehav",
  "| Aktie | Yahoo-ticker | Börs | Entry-datum | Entry | Stop-loss | Målkurs | Anteckning |",
  "|---|---|---|---|---|---|---|---|",
  "| Nvidia | NVDA | NASDAQ | 2026-07-17 | 180 | 170 | 200 | vikt 50 % |",
  "## Kassa", "50 %"
].join("\n");
const usP = VP.parsePortfolio(usPf);
ok("US parsePortfolio holdings", usP.holdings.length === 1 && usP.holdings[0]["Yahoo-ticker"] === "NVDA");
ok("US collectTargets (monitor)", (() => {
  const t = AL.collectTargets(usPf);
  return t.held.length === 1 && t.held[0].ticker === "NVDA" && t.held[0].stop === 170 && t.held[0].target === 200;
})());
ok("US renderHoldings USD live", VR.renderHoldings(
  { dateISO: "2026-07-17", holdings: [{ name: "Nvidia", ticker: "NVDA", exchange: "NASDAQ", price: "", since: "", stop: "170", target: "200", decision: "BEHÅLL", news: "", motivation: "" }] },
  { pending: [] }, { NVDA: { ticker: "NVDA", price: 185, currency: "USD", pnlPct: 2.8, toStopPct: -8, toTargetPct: 8 } }, {}
).includes("185 USD"));
ok("US KPIs render", VR.renderKPIs(usP, null).includes("Ackumulerad avkastning"));

// ---- conviction-viktad sizing (ersätter fast 50/50) ----
ok("weightFrac reads Vikt", VP.weightFrac({ "Vikt": "60 %" }) === 0.6 && VP.weightFrac({ "Vikt": "40 %" }) === 0.4);
ok("weightFrac default 50", VP.weightFrac({ "Aktie": "X" }) === 0.5 && VP.weightFrac({}) === 0.5);
ok("weightFrac clamps invalid", VP.weightFrac({ "Vikt": "0 %" }) === 0.5 && VP.weightFrac({ "Vikt": "150 %" }) === 0.5);
const wHist = [{ "Aktie": "A", "Utfall %": "+10 %", "Vikt": "60 %" }, { "Aktie": "B", "Utfall %": "-10 %", "Vikt": "40 %" }];
const wStats = VP.computeTradeStats(wHist);
ok("weighted chain", Math.abs(wStats.chainedPct - ((1 + 0.6 * 0.1) * (1 - 0.4 * 0.1) - 1) * 100) < 1e-9);
const eqStats = VP.computeTradeStats([{ "Aktie": "A", "Utfall %": "+10 %" }, { "Aktie": "B", "Utfall %": "-10 %" }]);
ok("default 50/50 chain back-compat", Math.abs(eqStats.chainedPct - ((1 + 0.5 * 0.1) * (1 - 0.5 * 0.1) - 1) * 100) < 1e-9);
ok("heldCard shows weight pill", VR.renderHoldings(null,
  { holdings: [{ "Aktie": "Nvidia", "Yahoo-ticker": "NVDA", "Börs": "NASDAQ", "Entry": "180", "Stop-loss": "170", "Målkurs": "200", "Vikt": "60 %" }], pending: [] }, {}, {}
).includes("wt-pill") === true);

// ---- combinedReturn + Total-vyn ----
ok("combinedReturn 50/50", VP.combinedReturn({ accum: 10 }, { accum: 4 }, 0.5) === 7);
ok("combinedReturn weighted", Math.abs(VP.combinedReturn({ accum: 10 }, { accum: 0 }, 0.7) - 7) < 1e-9);
ok("combinedReturn one book", VP.combinedReturn({ accum: 8 }, null, 0.5) === 4);
ok("combinedReturn null both", VP.combinedReturn(null, null, 0.5) === null);
const totBooks = [
  { label: "Nordisk", portfolio: { accum: 5, holdings: [{ "Aktie": "Alleima", "Yahoo-ticker": "ALLEI.ST", "Entry": "97", "Vikt": "50 %" }] }, live: { "ALLEI.ST": { price: 99, currency: "SEK", pnlPct: 2.1 } } },
  { label: "US", portfolio: { accum: 3, holdings: [{ "Aktie": "Nvidia", "Yahoo-ticker": "NVDA", "Entry": "180", "Vikt": "60 %" }] }, live: { "NVDA": { price: 185, currency: "USD", pnlPct: 2.8 } } }
];
const totHtml = VR.renderTotal(totBooks, 0.5);
ok("renderTotal blended KPI", totHtml.includes("Blended avkastning") && totHtml.includes("+4.00 %"));
ok("renderTotal both books in table", totHtml.includes("Alleima") && totHtml.includes("Nvidia") && totHtml.includes("book-badge--0") && totHtml.includes("book-badge--1"));
ok("renderTotal alloc bar", totHtml.includes("alloc-seg") && totHtml.includes("Nordisk 50 %") && totHtml.includes("US 50 %"));
ok("renderTotal live P/L", totHtml.includes("185 USD") && totHtml.includes("99 SEK"));
ok("renderTotal empty books", VR.renderTotal([{ label: "Nordisk", portfolio: { accum: null, holdings: [] } }, { label: "US", portfolio: { accum: null, holdings: [] } }], 0.5).includes("Inga öppna positioner"));

// ---- dynamisk kapitalvikt (allocation.json) ----
ok("renderTotal dynamic split 70/30", (() => {
  const h = VR.renderTotal(totBooks, 0.7, { dynamic: true, rationale: "Starkare nordiska case denna vecka.", updatedAt: "2026-07-20T13:30:00Z", week: "v30" });
  return h.includes("Nordisk 70 %") && h.includes("US 30 %") && h.includes("Starkare nordiska case") && h.includes("satt av allokerings") && h.includes("v30");
})());
ok("renderTotal blended uses split", VR.renderTotal(totBooks, 0.7).includes(VR.signPct(5 * 0.7 + 3 * 0.3)));
ok("renderTotal baseline meta note", VR.renderTotal(totBooks, 0.5, { dynamic: false }).includes("baslinje 50/50"));
ok("renderTotal no meta = no rationale row", !VR.renderTotal(totBooks, 0.5).includes("alloc-meta"));

// ---- miss-retro: filnamn, lessons.md, Retro-fliken ----
ok("parseFilename retro", VP.parseFilename("retro-260731.md").type === "retro" && VP.parseFilename("retro-260731.md").dateISO === "2026-07-31");
ok("parseFilename retro no scout-clash", VP.parseFilename("rapport-260731.md").type === "scout");
const lessonsMd = [
  "# Lärdomar", "> Max 10 aktiva.",
  "## Aktiva lärdomar",
  "| ID | Datum | Källa (retro) | Regel | Gäller |", "|---|---|---|---|---|",
  "| L-1 | 2026-07-31 | retro-260731 | Väg in after-hours-rapporter i scanningen | US, Scout |",
  "## Arkiv (append-only)",
  "| ID | Datum | Arkiverad | Skäl | Regel |", "|---|---|---|---|---|",
  "| L-0 | 2026-07-24 | 2026-07-31 | motbevisad | Gammal regel |"
].join("\n");
const ls = VP.parseLessons(lessonsMd);
ok("parseLessons active", ls.active.length === 1 && ls.active[0]["ID"] === "L-1" && ls.active[0]["Gäller"] === "US, Scout");
ok("parseLessons archive", ls.archived.length === 1 && ls.archived[0]["ID"] === "L-0");
ok("parseLessons empty", VP.parseLessons("").active.length === 0 && VP.parseLessons(null).active.length === 0);
const lsHtml = VR.renderLessons(ls);
ok("renderLessons card", lsHtml.includes("L-1") && lsHtml.includes("after-hours") && lsHtml.includes("lesson-id"));
ok("renderLessons archive note", lsHtml.includes("1 arkiverad"));
ok("renderLessons empty", VR.renderLessons(null).includes("Inga lärdomar"));
ok("searchResults retro type", VR.renderSearchResults(
  [{ meta: { name: "retro-260731.md", type: "retro", dateISO: "2026-07-31", label: "31 jul", sortKey: 20260731 }, count: 1, snippets: ["x"] }], "x"
).includes("Retro"));

// ---- equity-kurva per affär + månadsheatmap ----
const eqHist = [
  { "Stängd": "2026-07-17", "Aktie": "Alleima", "Utfall %": "+6,39 %", "Vikt": "50 %" },
  { "Stängd": "2026-08-05", "Aktie": "Saab", "Utfall %": "-2,0 %", "Vikt": "60 %" },
  { "Stängd": "2026-08-12", "Aktie": "Volvo", "Utfall %": "+4,0 %", "Vikt": "50 %" }
];
const eq = VP.buildTradeSeries(eqHist);
ok("tradeSeries count+order", eq.length === 3 && eq[0].date === "2026-07-17" && eq[2].date === "2026-08-12");
ok("tradeSeries chained", Math.abs(eq[1].value - ((1 + 0.5 * 0.0639) * (1 - 0.6 * 0.02) - 1) * 100) < 0.011);
ok("tradeSeries meta", eq[0].name === "Alleima" && Math.abs(eq[0].pct - 6.39) < 1e-9);
ok("tradeSeries empty", VP.buildTradeSeries([]).length === 0 && VP.buildTradeSeries(null).length === 0);
ok("tradeSeries skips undated", VP.buildTradeSeries([{ "Aktie": "X", "Utfall %": "+1 %" }]).length === 0);
const mo = VP.buildMonthlyStats(eqHist);
ok("monthly groups", mo.length === 2 && mo[0].month === "2026-07" && mo[1].month === "2026-08");
ok("monthly chain in month", Math.abs(mo[1].pct - ((1 - 0.6 * 0.02) * (1 + 0.5 * 0.04) - 1) * 100) < 0.011);
ok("monthly trades/wins", mo[1].trades === 2 && mo[1].wins === 1);
const hmHtml = VR.renderMonthlyHeatmap(mo);
ok("heatmap cells", hmHtml.includes("hm-cell") && hmHtml.includes("jul 2026") && hmHtml.includes("aug 2026"));
ok("heatmap empty", VR.renderMonthlyHeatmap([]).includes("Inget månadsutfall"));

// ---- riskmått (max drawdown, sviter, volatilitet, payoff) ----
const riskHist = [
  { "Stängd": "2026-01-05", "Aktie": "A", "Utfall %": "+10 %", "Vikt": "50 %" },
  { "Stängd": "2026-01-12", "Aktie": "B", "Utfall %": "-4 %", "Vikt": "50 %" },
  { "Stängd": "2026-01-19", "Aktie": "C", "Utfall %": "-6 %", "Vikt": "50 %" },
  { "Stängd": "2026-01-26", "Aktie": "D", "Utfall %": "+8 %", "Vikt": "50 %" }
];
const rs = VP.computeRiskStats(riskHist);
ok("risk maxDrawdown", rs.maxDrawdownPct != null && Math.abs(rs.maxDrawdownPct - 4.94) < 0.02);
ok("risk streaks", rs.lossStreak === 2 && rs.winStreak === 1);
ok("risk stdev", Math.abs(rs.stdevPct - 7.07) < 0.01);
ok("risk payoff", Math.abs(rs.payoff - 1.8) < 1e-9);
const rsEmpty = VP.computeRiskStats([]);
ok("risk empty", rsEmpty.trades === 0 && rsEmpty.maxDrawdownPct === null && VP.computeRiskStats(null).trades === 0);
ok("risk only wins no payoff", VP.computeRiskStats([{ "Stängd": "2026-01-05", "Aktie": "A", "Utfall %": "+5 %" }]).payoff === null);
const rsHtml = VR.renderRiskStats(rs);
ok("renderRiskStats cells", rsHtml.includes("Max drawdown") && rsHtml.includes("Payoff ratio") && rsHtml.includes("−4.94 %"));
ok("renderRiskStats tooltip", rsHtml.includes('title="Största tappet'));
ok("renderRiskStats empty", VR.renderRiskStats(rsEmpty).includes("Inga stängda affärer"));

// ---- UI-polish: tooltips + färgkodad historik ----
ok("tradeStats tooltip", VR.renderTradeStats(ts).includes('title="Summa vinster'));
ok("history utfall colored", VR.renderHistory(p).includes('class="pos"') && VR.renderHistory(p).includes('class="neg"'));

// ---- alpha mot benchmark (punkt 3) ----
const phAlpha = { series: { "^OMX": [
  ["2026-01-05", 100], ["2026-01-06", 101], ["2026-01-07", 102],
  ["2026-01-08", 104], ["2026-01-09", 105], ["2026-01-12", 110]
] } };
ok("benchReturnPct rak period", Math.abs(VP.benchReturnPct(phAlpha, "^OMX", "2026-01-05", "2026-01-09") - 5) < 1e-9);
ok("benchReturnPct carry-forward över helg",
  Math.abs(VP.benchReturnPct(phAlpha, "^OMX", "2026-01-05", "2026-01-11") - 5) < 1e-9);
ok("benchReturnPct före historikens start = null",
  VP.benchReturnPct(phAlpha, "^OMX", "2025-12-01", "2026-01-09") === null);
ok("benchReturnPct okänd ticker = null", VP.benchReturnPct(phAlpha, "^GSPC", "2026-01-05", "2026-01-09") === null);
ok("benchReturnPct utan historik = null", VP.benchReturnPct(null, "^OMX", "2026-01-05", "2026-01-09") === null);
const alphaHist = [
  { "Stängd": "2026-01-09", "Aktie": "Vinnare (A.ST)", "Entry-datum": "2026-01-05", "Utfall %": "+8 %", "Vikt": "50 %" },
  { "Stängd": "2026-01-09", "Aktie": "Eftersläntrare (B.ST)", "Entry-datum": "2026-01-05", "Utfall %": "+2 %", "Vikt": "50 %" },
  { "Stängd": "2026-01-09", "Aktie": "Utanför historiken (C.ST)", "Entry-datum": "2025-11-01", "Utfall %": "+30 %", "Vikt": "50 %" }
];
const am = VP.computeAlpha(alphaHist, phAlpha, "^OMX");
ok("computeAlpha positiv alpha", Math.abs(am[VP.alphaKey(alphaHist[0])].alphaPct - 3) < 1e-9);
ok("computeAlpha negativ alpha när index slog affären",
  Math.abs(am[VP.alphaKey(alphaHist[1])].alphaPct + 3) < 1e-9);
ok("computeAlpha okänd period ger null, inte 0",
  am[VP.alphaKey(alphaHist[2])].alphaPct === null && am[VP.alphaKey(alphaHist[2])].benchPct === null);
const as = VP.computeAlphaStats(alphaHist, phAlpha, "^OMX");
ok("computeAlphaStats räknar bara mätbara affärer", as.trades === 2 && as.beat === 1);
ok("computeAlphaStats snitt", Math.abs(as.avgAlphaPct) < 1e-9 && Math.abs(as.sumAlphaPct) < 1e-9);
ok("computeAlphaStats tom historik", VP.computeAlphaStats([], phAlpha, "^OMX").trades === 0);
const histHtml = VR.renderHistory({ history: alphaHist }, am, "OMXS30");
ok("renderHistory alpha-kolumner", histHtml.includes("OMXS30") && histHtml.includes("Alpha"));
ok("renderHistory omätbar affär visar streck", histHtml.includes('class="faint">–'));
ok("renderHistory utan alphaMap oförändrad",
  !VR.renderHistory({ history: alphaHist }).includes("Alpha"));
ok("renderAlphaStats kort", VR.renderAlphaStats(as, "OMXS30").includes("Snitt-alpha") && VR.renderAlphaStats(as, "OMXS30").includes("Slog index"));
ok("renderAlphaStats tomläge", VR.renderAlphaStats({ trades: 0 }, "OMXS30").includes("Ingen alpha-mätning"));

// ---- transaktionskostnader + valuta ----
const costHist = [
  { "Stängd": "2026-01-05", "Aktie": "A", "Utfall %": "+6 %", "Vikt": "50 %" },
  { "Stängd": "2026-01-12", "Aktie": "B", "Utfall %": "-4 %", "Vikt": "50 %" }
];
ok("costFor läser nordic ur config", VP.costFor("nordic", { nordic: { roundTripPct: 0.3 } }) === 0.3);
ok("costFor adderar växlingspåslag för us",
  Math.abs(VP.costFor("us", { us: { roundTripPct: 0.25, fxSpreadPct: 0.5 } }) - 0.75) < 1e-9);
ok("costFor faller tillbaka på default", VP.costFor("nordic", null) === VP.DEFAULT_COSTS.nordic.roundTripPct);
ok("costFor okänd bok = nordic", VP.costFor("xyz", null) === VP.costFor("nordic", null));
ok("netPct drar kostnaden", Math.abs(VP.netPct(6, 0.25) - 5.75) < 1e-9 && VP.netPct(null, 0.25) === null);
ok("netPct utan kostnad = brutto", VP.netPct(6) === 6);
const tsGross = VP.computeTradeStats(costHist);
const tsNet = VP.computeTradeStats(costHist, 0.25);
ok("computeTradeStats brutto oförändrad", Math.abs(tsGross.chainedPct - tsNet.chainedPct) < 1e-9);
ok("computeTradeStats netto lägre än brutto", tsNet.netChainedPct < tsNet.chainedPct);
ok("computeTradeStats kostnadsdrag redovisas",
  Math.abs(tsNet.costDragPct - (tsNet.chainedPct - tsNet.netChainedPct)) < 1e-9 && tsNet.costPct === 0.25);
ok("computeTradeStats utan kostnad = netto lika brutto",
  Math.abs(tsGross.netChainedPct - tsGross.chainedPct) < 1e-9 && tsGross.costPct === 0);
ok("computeTradeStats netto vänder vinnare till förlorare vid hög kostnad",
  VP.computeTradeStats([{ "Stängd": "2026-01-05", "Aktie": "A", "Utfall %": "+0,2 %", "Vikt": "50 %" }], 0.5).netWinRate === 0);
const seriesNet = VP.buildTradeSeries(costHist, 0.25);
ok("buildTradeSeries netto + brutto per punkt",
  Math.abs(seriesNet[0].pct - 5.75) < 1e-9 && Math.abs(seriesNet[0].grossPct - 6) < 1e-9);
ok("buildTradeSeries utan kostnad oförändrad",
  Math.abs(VP.buildTradeSeries(costHist)[0].pct - 6) < 1e-9);
const fxq = { quotes: { "USDSEK=X": { price: 9.5, previousClose: 9.4, marketTime: "2026-07-31T15:00:00Z" } } };
ok("fxRate läser paret", (() => { const f = VP.fxRate(fxq); return f.rate === 9.5 && Math.abs(f.changePct - 1.0638) < 0.001; })());
ok("fxRate saknat par = null", VP.fxRate({ quotes: {} }) === null && VP.fxRate(null) === null);
ok("renderTradeStats visar netto", VR.renderTradeStats(tsNet).includes("Netto efter kostnad"));
ok("renderTradeStats visar kostnaden per affär", VR.renderTradeStats(tsNet).includes("0.25 % per affär"));
const totalFx = VR.renderTotal(
  [{ label: "Nordisk", portfolio: { accum: 3.19, holdings: [] } }, { label: "US", portfolio: { accum: 0.89, holdings: [] } }],
  0.5, { dynamic: false, fx: VP.fxRate(fxq) });
ok("renderTotal visar valutaupplysning", totalFx.includes("exkl. valutaeffekt") && totalFx.includes("9.50"));
ok("renderTotal utan fx ber om USDSEK",
  VR.renderTotal([{ label: "Nordisk", portfolio: { accum: 1, holdings: [] } }], 0.5, { dynamic: false }).includes("USDSEK=X"));
ok("config/kostnader.json finns och är giltig", (() => {
  const c = JSON.parse(readFileSync(resolve(root, "config/kostnader.json"), "utf8"));
  return c.nordic.roundTripPct > 0 && c.us.roundTripPct > 0 && c.us.fxSpreadPct > 0;
})());
ok("watchlist_us innehåller USDSEK=X",
  /^USDSEK=X$/m.test(readFileSync(resolve(root, "config/watchlist_us.txt"), "utf8")));

// ---- beslutsdatabasen (state/decisions.json) ----
const decRaw = readFileSync(resolve(root, "state/decisions.json"), "utf8");
const dec = JSON.parse(decRaw);
ok("decisions.json parsar + schema", dec.version === 1 && Array.isArray(dec.decisions));

// ---- validering av beslutsdatabasen (validate-decisions.mjs) ----
const VD = await mod(".github/scripts/validate-decisions.mjs");
ok("validateDb: repots egen fil är giltig", VD.validateDb(dec).errors.length === 0);
ok("validateDb: filen är backfylld, inte tom", VD.validateDb(dec).count >= 5);
const goodRow = {
  date: "2026-07-30", book: "nordic", mode: "B", ticker: "SAAB-B.ST", action: "KÖP",
  price: 585, currency: "SEK", weight: 0.5, entry: 585, stop: 560, target: 635, rr: 2,
  catalystType: "order", sector: "Försvar", rsi: null, reason: "Triggad plan.", lessonIds: []
};
ok("validateDecision godkänner giltig rad", VD.validateDecision(goodRow, 0).length === 0);
ok("validateDecision fångar okänd catalystType",
  VD.validateDecision({ ...goodRow, catalystType: "hype" }, 0).some(e => /catalystType/.test(e)));
ok("validateDecision fångar vikt i procent",
  VD.validateDecision({ ...goodRow, weight: 50 }, 0).some(e => /andel 0–1/.test(e)));
ok("validateDecision fångar ogiltigt datum",
  VD.validateDecision({ ...goodRow, date: "30/7 2026" }, 0).some(e => /åååå-mm-dd/.test(e)));
ok("validateDecision fångar okänd action",
  VD.validateDecision({ ...goodRow, action: "HÅLL" }, 0).some(e => /action/.test(e)));
ok("validateDecision kräver outcomePct+holdDays vid SÄLJ", (() => {
  const e = VD.validateDecision({ ...goodRow, action: "SÄLJ" }, 0);
  return e.some(x => /outcomePct/.test(x)) && e.some(x => /holdDays/.test(x));
})());
ok("validateDecision fångar för lång reason",
  VD.validateDecision({ ...goodRow, reason: "x".repeat(201) }, 0).some(e => /max 200/.test(e)));
ok("isAppendOnly: tillägg sist är OK",
  VD.isAppendOnly([goodRow], [goodRow, { ...goodRow, ticker: "VOLV-B.ST" }]));
ok("isAppendOnly: ändrad historisk rad fångas",
  !VD.isAppendOnly([goodRow], [{ ...goodRow, price: 999 }]));
ok("isAppendOnly: raderad rad fångas", !VD.isAppendOnly([goodRow, goodRow], [goodRow]));
// VARFÖR assertionen ser ut så här: den kontrollerade tidigare att SAMTLIGA rader var
// backfyllda, vilket bara stämde så länge filen enbart innehöll rekonstruktionen från
// 2026-07-31. Första gången en routine appendade en riktig beslutsrad (v32-rotationen
// 2026-08-03) föll testet – trots att det var precis vad som skulle hända. Testet mäter
// nu det namnet lovar: de sex rekonstruerade raderna är kvar och märkta, och ingen rad
// bär en annan source-stämpel. Livrader saknar fältet helt och är alltså tillåtna.
ok("alla backfyllda rader är märkta med source",
  dec.decisions.filter(r => "source" in r).every(r => r.source === "backfill-260731") &&
  dec.decisions.filter(r => r.source === "backfill-260731").length === 6);

// Bruttolistan loggas i sin helhet sedan 2026-08-03, inklusive kandidater som föll
// på att kursen inte kunde verifieras. En sådan rad har price: null och MÅSTE vara
// giltig – annars kan prompten inte följa sin egen instruktion.
ok("AVVAKTA med price null är en giltig rad", (() => {
  const row = { date: "2026-08-03", book: "nordic", mode: "A", ticker: "HNSA.ST",
    action: "AVVAKTA", price: null, currency: "SEK", weight: 0, entry: null, stop: null,
    target: null, rr: null, catalystType: "earnings", sector: "Bioteknik", rsi: null,
    reason: "Kurs ej verifierad – ingen post i prices.json och reservkällan svarade 403.",
    lessonIds: [] };
  return VD.validateDecision(row, 0).length === 0;
})());
ok("statistiken tål rader utan verifierad kurs", (() => {
  const s = VP.decisionStats({ decisions: [
    { date: "2026-08-03", book: "nordic", mode: "A", ticker: "X.ST", action: "AVVAKTA",
      price: null, catalystType: "order", reason: "r", lessonIds: [] }
  ] });
  return s && s.rows === 1;
})());

// ---- beslutsutvärdering (decision_eval.mjs) ----
// Mätningen som gör urvalet mätbart UTAN stängda affärer: varje beslut, även de
// avvisade, poängsätts mot efterföljande kurs och mot sin boks index.
const DE = await mod(".github/scripts/decision_eval.mjs");
const serie = (start, closes) => closes.map((c, i) => {
  const d = new Date(Date.UTC(2026, 6, start + i));
  return [d.toISOString().slice(0, 10), c];
});
// 2026-07-01 och framåt, ett värde per rad (helgdagar spelar ingen roll – serien
// är redan en lista över handelsdagar i verkligheten).
const upp = serie(1, [100, 101, 102, 103, 104, 110]);
ok("forwardReturn 5 steg framåt", (() => {
  const r = DE.forwardReturn(upp, "2026-07-01", 5);
  return r && Math.abs(r.pct - 10) < 1e-9 && r.toDate === "2026-07-06";
})());
ok("forwardReturn null när serien inte räcker",
  DE.forwardReturn(upp, "2026-07-04", 5) === null);
ok("forwardReturn startar på FÖRSTA stängningen >= beslutsdatum", (() => {
  const r = DE.forwardReturn(upp, "2026-06-20", 1);   // före seriens start
  return r && r.fromDate === "2026-07-01";
})());
ok("forwardReturn tål trasiga värden",
  DE.forwardReturn([["2026-07-01", 0], ["2026-07-02", 5]], "2026-07-01", 1) === null &&
  DE.forwardReturn(null, "2026-07-01", 1) === null &&
  DE.forwardReturn(upp, null, 1) === null);
// Ett omoget beslut får ALDRIG räknas som noll – det drar medelvärdet mot mitten.
ok("omoget beslut ger tom fwd, inte nolla", (() => {
  const r = DE.evalRow({ date: "2026-07-04", ticker: "X.ST", book: "nordic", action: "KÖP" },
    s => (s === "X.ST" ? upp : null), [5]);
  return Object.keys(r.fwd).length === 0 && !r.missing;
})());
ok("evalRow räknar alpha mot rätt boks index", (() => {
  const bench = serie(1, [100, 100, 100, 100, 100, 105]);   // index +5 %
  const r = DE.evalRow({ date: "2026-07-01", ticker: "X.ST", book: "nordic", action: "KÖP" },
    s => (s === "X.ST" ? upp : s === "^OMX" ? bench : null), [5]);
  return Math.abs(r.fwd[5].pct - 10) < 1e-9 && Math.abs(r.fwd[5].benchPct - 5) < 1e-9 &&
         Math.abs(r.fwd[5].alphaPct - 5) < 1e-9;
})());
ok("evalRow US-bok mäts mot ^GSPC", (() => {
  const bench = serie(1, [100, 100, 100, 100, 100, 120]);
  const r = DE.evalRow({ date: "2026-07-01", ticker: "JPM", book: "us", action: "KÖP" },
    s => (s === "JPM" ? upp : s === "^GSPC" ? bench : null), [5]);
  return r.fwd[5].benchPct === 20 && r.fwd[5].alphaPct === -10;
})());
ok("evalRow flaggar saknad kurshistorik", (() => {
  const r = DE.evalRow({ date: "2026-07-01", ticker: "OKÄND.ST", book: "nordic", action: "AVVAKTA" },
    () => null, [5]);
  return r.missing === true;
})());
// Uttalar sig aldrig på för lite data.
const fake = n => Array.from({ length: n }, (_, i) => ({ action: "KÖP", fwd: { 5: { pct: 1, benchPct: 0, alphaPct: i % 2 ? 2 : -1 } } }));
ok("summarize under minN är insufficient med need", (() => {
  const s = DE.summarize(fake(3), 5, 8);
  return s.insufficient === true && s.need === 5 && s.n === 3;
})());
ok("summarize över minN uttalar sig", (() => {
  const s = DE.summarize(fake(8), 5, 8);
  return !s.insufficient && s.n === 8 && s.beatIndexPct === 50;
})());
ok("summarize hoppar över rader utan alpha",
  DE.summarize([{ fwd: {} }, { fwd: { 5: { pct: 1, benchPct: null, alphaPct: null } } }], 5, 1).n === 0);
// KÄRNFRÅGAN: köpta mot avvisade.
const mkRows = (action, alpha, n) => Array.from({ length: n }, () =>
  ({ action, fwd: { 5: { pct: alpha, benchPct: 0, alphaPct: alpha } } }));
ok("selectionEdge kräver minN i BÅDA grupperna", (() => {
  const e = DE.selectionEdge([...mkRows("KÖP", 5, 8), ...mkRows("AVVAKTA", 1, 2)], 5, 8);
  return e.insufficient === true && e.need.passed === 6 && e.need.bought === 0 && e.edgePct === null;
})());
ok("selectionEdge positiv edge", (() => {
  const e = DE.selectionEdge([...mkRows("KÖP", 5, 8), ...mkRows("AVVAKTA", 1, 8)], 5, 8);
  return e.edgePct === 4 && /rätt riktning/.test(e.verdict);
})());
ok("selectionEdge fångar för strängt filter", (() => {
  const e = DE.selectionEdge([...mkRows("KÖP", 0, 8), ...mkRows("AVVAKTA", 6, 8)], 5, 8);
  return e.edgePct === -6 && /för strängt/.test(e.verdict);
})());
ok("selectionEdge kallar små skillnader brus", (() => {
  const e = DE.selectionEdge([...mkRows("KÖP", 2, 8), ...mkRows("AVVAKTA", 1.5, 8)], 5, 8);
  return /brus/.test(e.verdict);
})());
// Hela körningen: indexsleeven ska bort, saknade tickers ska bli en åtgärdslista.
ok("evaluate filtrerar bort indexsleeven", (() => {
  const db = { decisions: [
    { date: "2026-07-01", ticker: "X.ST", book: "nordic", action: "KÖP", catalystType: "order" },
    { date: "2026-07-01", ticker: "XACT-OMXS30.ST", book: "nordic", action: "KÖP", catalystType: "index" }
  ] };
  const r = DE.evaluate(db, { series: { "X.ST": upp, "^OMX": upp } }, { horizons: [5], minN: 8 });
  return r.counts.decisions === 1 && !r.rows.some(x => x.ticker === "XACT-OMXS30.ST");
})());
ok("evaluate listar omätbara tickers", (() => {
  const db = { decisions: [{ date: "2026-07-01", ticker: "SAKNAS.ST", book: "nordic", action: "AVVAKTA", catalystType: "order" }] };
  const r = DE.evaluate(db, { series: {} }, { horizons: [5], minN: 8 });
  return r.missingSymbols.length === 1 && r.missingSymbols[0] === "SAKNAS.ST" && r.counts.missing === 1;
})());
ok("evaluate räknar omogna beslut separat", (() => {
  const db = { decisions: [{ date: "2026-07-05", ticker: "X.ST", book: "nordic", action: "KÖP", catalystType: "order" }] };
  const r = DE.evaluate(db, { series: { "X.ST": upp, "^OMX": upp } }, { horizons: [5], minN: 8 });
  return r.counts.pending === 1 && r.counts.measurable === 1;
})());
ok("evaluate tål tom beslutslogg", (() => {
  const r = DE.evaluate({ decisions: [] }, { series: {} }, { horizons: [5], minN: 8 });
  return r.counts.decisions === 0 && r.byHorizon[5].selectionEdge.insufficient === true;
})());
// Den riktiga filen ska gå att utvärdera utan att kasta, och aldrig uttala sig i dag.
ok("evaluate mot repots faktiska filer", (() => {
  const db = JSON.parse(readFileSync(resolve(root, "state/decisions.json"), "utf8"));
  const ph = JSON.parse(readFileSync(resolve(root, "state/price_history.json"), "utf8"));
  const r = DE.evaluate(db, ph);
  return r.counts.decisions > 0 && r.byHorizon[5].selectionEdge.insufficient === true &&
         r.missingSymbols.length === 0;
})());

// renderDecisionEval: ren funktion, ingen DOM. Får ALDRIG visa en siffra som ser
// ut som ett svar när underlaget är för tunt.
ok("renderDecisionEval tom data ger tomtillstånd",
  /Ingen beslutsutvärdering/.test(VR.renderDecisionEval(null)));
ok("renderDecisionEval visar 'för tidigt' under minN", (() => {
  const db = { decisions: [
    { date: "2026-07-01", ticker: "X.ST", book: "nordic", action: "KÖP", catalystType: "order" },
    { date: "2026-07-01", ticker: "Y.ST", book: "nordic", action: "AVVAKTA", catalystType: "order" }
  ] };
  const ev = DE.evaluate(db, { series: { "X.ST": upp, "Y.ST": upp, "^OMX": upp } }, { horizons: [5, 20], minN: 8 });
  const html = VR.renderDecisionEval(ev);
  return /för tidigt/.test(html) && /brus/.test(html) && /fler avvisade/.test(html);
})());
ok("renderDecisionEval visar edge när underlaget räcker", (() => {
  const ev = { counts: { decisions: 20, measurable: 20, missing: 0, pending: 0 }, minN: 2,
    horizons: [5, 20], missingSymbols: [],
    byHorizon: { 5: {
      byAction: { "KÖP": { n: 8, meanAlphaPct: 4, beatIndexPct: 75 },
                  "AVVAKTA": { n: 8, meanAlphaPct: -1, beatIndexPct: 25 } },
      selectionEdge: { edgePct: 5, verdict: "urvalet skiljer köpta från avvisade i rätt riktning" }
    }, 20: { byAction: {} } } };
  const html = VR.renderDecisionEval(ev);
  return /\+5\.00 %/.test(html) && /rätt riktning/.test(html) && /Avvisade/.test(html) &&
         /75 %/.test(html) && !/brus/.test(html.slice(0, html.indexOf("Raderna med")));
})());
ok("renderDecisionEval listar omätbara tickers som åtgärd", (() => {
  const ev = { counts: { decisions: 1, measurable: 0, missing: 1, pending: 0 }, minN: 8,
    horizons: [5, 20], missingSymbols: ["SAKNAS.ST"], byHorizon: { 5: {}, 20: {} } };
  const html = VR.renderDecisionEval(ev);
  return /SAKNAS\.ST/.test(html) && /watchlist\.txt/.test(html);
})());

// ---- nyhetsingestion (fetch-news.mjs, rena funktioner) ----
const NW = await mod(".github/scripts/fetch-news.mjs");
const rssXml = [
  "<rss><channel>",
  "<item><title><![CDATA[Bolag AB: Q2 &amp; rapport]]></title><link>https://x.se/a</link><pubDate>Fri, 31 Jul 2026 10:00:00 GMT</pubDate></item>",
  "<item><title>Andra nyheten</title><link>https://x.se/b</link><pubDate>Fri, 31 Jul 2026 09:00:00 GMT</pubDate></item>",
  "</channel></rss>"
].join("");
const rssItems = NW.parseRss(rssXml, "test");
ok("parseRss rss items", rssItems.length === 2 && rssItems[0].t === "Bolag AB: Q2 & rapport" && rssItems[0].u === "https://x.se/a");
ok("parseRss rss date", rssItems[0].d && rssItems[0].d.startsWith("2026-07-31"));
const atomItems = NW.parseRss('<feed><entry><title>Atom-nyhet</title><link href="https://a.com/x"/><updated>2026-07-31T08:00:00Z</updated></entry></feed>', "atom");
ok("parseRss atom link href", atomItems.length === 1 && atomItems[0].u === "https://a.com/x");
ok("parseRss trasig xml", NW.parseRss("inte xml alls", "x").length === 0 && NW.parseRss(null, "x").length === 0);
const nowIso = "2026-07-31T12:00:00Z";
const mergedNews = NW.mergeNews(
  [{ t: "Gammal titel", u: "https://x.se/a", d: "2026-07-31T06:00:00Z", src: "old" },
   { t: "För gammal", u: "https://x.se/old", d: "2026-07-28T06:00:00Z", src: "old" }],
  rssItems, nowIso, 48, 300);
ok("mergeNews dedupe på url", mergedNews.filter(i => i.u === "https://x.se/a").length === 1 && mergedNews[0].src !== "old");
ok("mergeNews åldersrensning", !mergedNews.some(i => i.u === "https://x.se/old"));
ok("mergeNews tak", NW.mergeNews([], rssItems, nowIso, 48, 1).length === 1);

// Fönstret i HANDELSDAGAR (2026-08-03): 48 timmar kollapsade över helgen och gav
// veckorotationen ett fönster på 47 minuter. Måndag måste fredagens poster leva kvar.
ok("ageHoursForTradingDays måndag 5 dgr = tisdag 00:00 UTC",
  NW.ageHoursForTradingDays("2026-08-03T08:00:00Z", 5) === 152);
ok("ageHoursForTradingDays hoppar över helgen",
  NW.ageHoursForTradingDays("2026-08-03T08:00:00Z", 1) === 8 &&
  NW.ageHoursForTradingDays("2026-08-03T08:00:00Z", 2) === 8 + 72);
ok("ageHoursForTradingDays lördag räknar bakåt till fredag",
  NW.ageHoursForTradingDays("2026-08-01T12:00:00Z", 1) === 36);
ok("ageHoursForTradingDays trasigt datum ger reserv",
  NW.ageHoursForTradingDays("inte ett datum", 5) === 48);
// Regressionen som fällde v32-rotationen: fredagsposter måndag morgon.
const fridayItem = { t: "Fredagsnyhet", u: "https://x.se/fre", d: "2026-07-31T20:00:00Z", src: "mfn" };
ok("48h-fönstret tappade fredagen på måndagen",
  NW.mergeNews([fridayItem], [], "2026-08-03T05:58:00Z", 48, 300).length === 0);
ok("handelsdagsfönstret behåller fredagen på måndagen",
  NW.mergeNews([fridayItem], [], "2026-08-03T05:58:00Z",
    NW.ageHoursForTradingDays("2026-08-03T05:58:00Z", 5), 300).length === 1);

// Tak per källa och dygn: ett pratigt flöde får inte tränga ut de andra.
const chatty = [
  { t: "a", u: "https://m.se/1", d: "2026-08-03T10:00:00Z", src: "mfn" },
  { t: "b", u: "https://m.se/2", d: "2026-08-03T09:00:00Z", src: "mfn" },
  { t: "c", u: "https://m.se/3", d: "2026-08-03T08:00:00Z", src: "mfn" },
  { t: "d", u: "https://g.se/1", d: "2026-08-03T07:00:00Z", src: "globenewswire" }
];
const capped = NW.mergeNews([], chatty, "2026-08-03T12:00:00Z", 48, 300, 2);
ok("mergeNews tak per källa och dygn",
  capped.filter(i => i.src === "mfn").length === 2 &&
  capped.some(i => i.src === "globenewswire"));
ok("mergeNews taket behåller de NYASTE i dygnet",
  capped.filter(i => i.src === "mfn").every(i => i.t !== "c"));
ok("mergeNews tak 0 = avstängt",
  NW.mergeNews([], chatty, "2026-08-03T12:00:00Z", 48, 300, 0).length === 4);
// Det globala taket får ALDRIG bli den bindande gränsen – då äter de nyaste dagarna
// platsen och fönstret kollapsar igen, bara långsammare. Invarianten skyddar det.
ok("globalt tak ligger över vad per-dygn-taket kan producera", (() => {
  const src = readFileSync(resolve(root, ".github/scripts/fetch-news.mjs"), "utf8");
  const num = re => { const m = src.match(re); return m ? Number(m[1]) : NaN; };
  const feeds = NW.parseFeedList(readFileSync(resolve(root, "config/news_feeds.txt"), "utf8")).length;
  const maxItems = num(/MAX_ITEMS\s*=\s*(\d+)/);
  const perDay = num(/MAX_PER_SOURCE_DAY\s*=\s*(\d+)/);
  const days = num(/WINDOW_TRADING_DAYS\s*=\s*(\d+)/);
  return feeds > 0 && maxItems >= feeds * perDay * days;
})());
// Och per-dygn-taket måste faktiskt bevara en äldre dag när en nyare är full.
ok("äldre dag överlever ett fullt nyare dygn", (() => {
  const many = [];
  for (let i = 0; i < 50; i++)
    many.push({ t: "ny" + i, u: "https://m.se/n" + i, d: "2026-08-03T10:00:00Z", src: "mfn" });
  many.push({ t: "gammal", u: "https://m.se/old", d: "2026-07-30T10:00:00Z", src: "mfn" });
  const r = NW.mergeNews([], many, "2026-08-03T12:00:00Z",
    NW.ageHoursForTradingDays("2026-08-03T12:00:00Z", 10), 40, 30);
  return r.some(i => i.t === "gammal");
})());

// Täckningen ska gå att KONTROLLERA, inte antas.
const cov = NW.newsCoverage(
  [{ t: "x", d: "2026-08-03T10:00:00Z", src: "mfn" },
   { t: "y", d: "2026-07-31T10:00:00Z", src: "mfn" },
   { t: "z", d: "2026-07-31T09:00:00Z", src: "sec-8k" }],
  "2026-08-03T12:00:00Z", 5);
ok("newsCoverage räknar handelsdagar", cov.tradingDaysCovered === 2 && cov.distinctDays === 2);
ok("newsCoverage listar saknade dagar",
  cov.missingDays.includes("2026-07-30") && cov.missingDays.includes("2026-07-29") &&
  !cov.missingDays.includes("2026-08-01") && !cov.missingDays.includes("2026-07-31"));
ok("newsCoverage per källa", cov.perSource.mfn === 2 && cov.perSource["sec-8k"] === 1);
ok("newsCoverage tom lista kraschar inte",
  NW.newsCoverage([], "2026-08-03T12:00:00Z", 5).tradingDaysCovered === 0);
ok("parseFeedList", (() => { const f = NW.parseFeedList("# kommentar\nmfn|https://mfn.se/rss\nrad-utan-pipe\n"); return f.length === 1 && f[0].name === "mfn"; })());
ok("uaFor sec.gov får kontakt-UA", /kastratidrinas@gmail\.com/.test(NW.uaFor("https://www.sec.gov/cgi-bin/browse-edgar?output=atom")));
ok("uaFor övriga får browser-UA", /Mozilla/.test(NW.uaFor("https://mfn.se/all/s.rss")) && /Mozilla/.test(NW.uaFor("https://notsec.gov.example.com/x")));
ok("news_feeds.txt: döda flöden borta, nya på plats", (() => {
  const t = readFileSync(resolve(root, "config/news_feeds.txt"), "utf8");
  const live = NW.parseFeedList(t);
  const names = live.map(f => f.name);
  return !names.includes("cision-se") && !names.includes("businesswire-tech") &&
         names.includes("sec-8k") && names.includes("fed-press") && live.length >= 5;
})());

// omförsök: ett transient 404 får inte läsas som ett dött flöde
const noSleep = () => Promise.resolve();
ok("fetchFeedText lyckas på första försöket", await (async () => {
  const r = await NW.fetchFeedText("https://x/rss", { sleep: noSleep,
    fetchImpl: async () => ({ ok: true, status: 200, text: async () => "<rss/>" }) });
  return r.ok && r.attempts === 1 && r.text === "<rss/>";
})());
ok("fetchFeedText gör om ett transient fel och lyckas", await (async () => {
  let n = 0;
  const r = await NW.fetchFeedText("https://x/rss", { sleep: noSleep, fetchImpl: async () => {
    n++;
    return n === 1 ? { ok: false, status: 404 } : { ok: true, status: 200, text: async () => "<rss/>" };
  } });
  return r.ok && r.attempts === 2 && n === 2;
})());
ok("fetchFeedText ger upp efter båda försöken", await (async () => {
  const r = await NW.fetchFeedText("https://x/rss", { sleep: noSleep,
    fetchImpl: async () => ({ ok: false, status: 404 }) });
  return !r.ok && r.attempts === 2 && r.status === "HTTP 404";
})());
ok("fetchFeedText fångar kastade fel", await (async () => {
  const r = await NW.fetchFeedText("https://x/rss", { sleep: noSleep,
    fetchImpl: async () => { throw new Error("timeout"); } });
  return !r.ok && /timeout/.test(r.status);
})());

// ---- tickerroller i Kurser-vyn ----
const rolePortf = { holdings: [{ ticker: "SAAB-B.ST" }], pending: [{ ticker: "MORLD.OL" }] };
const roleUs = { holdings: [{ ticker: "SPY" }], pending: [] };
const roleWeekly = { bubblare: ["Hansa Biopharma (HNSA.ST) – nära men rankad under", "Boozt (BOOZT.ST) stark"] };
const roleUsWeekly = { bubblare: ["HCA Healthcare (HCA / NYSE) – bankrotation"] };
const roles = VP.tickerRoles({
  portfolio: rolePortf, portfolioUs: roleUs, weekly: roleWeekly, usWeekly: roleUsWeekly,
  watchlist: "# kommentar\nXACT-OMXS30.ST\nSCA-B.ST\nSAAB-B.ST\n^OMX\n",
  watchlistUs: "AAPL\nUSDSEK=X\n^GSPC\n"
});
ok("roll: innehav", roles["SAAB-B.ST"].role === "innehav" && roles["SAAB-B.ST"].book === "nordic");
ok("roll: innehav vinner över watchlist", roles["SAAB-B.ST"].role !== "bevakad");
ok("roll: pending blir plan", roles["MORLD.OL"].role === "plan");
ok("roll: bubblare ur fritext", roles["HNSA.ST"].role === "bubblare" && roles["BOOZT.ST"].role === "bubblare");
ok("roll: US-bubblare inom parentes", roles["HCA"].role === "bubblare" && roles["HCA"].book === "us");
ok("roll: sleeve känns igen", roles["XACT-OMXS30.ST"].role === "sleeve" && VP.roleFor(roles, "SPY").role === "innehav");
ok("roll: index och valuta", roles["^OMX"].role === "index" && roles["USDSEK=X"].role === "valuta");
ok("roll: watchlist-ticker utan annan roll", roles["AAPL"].role === "bevakad" && roles["SCA-B.ST"].role === "bevakad");
ok("roleFor faller tillbaka på mönster", VP.roleFor({}, "^GSPC").role === "index"
  && VP.roleFor(null, "EURSEK=X").role === "valuta" && VP.roleFor({}, "NVDA").role === "bevakad");
ok("parseWatchlist hoppar kommentarer", VP.parseWatchlist("# x\n\nabc.st\n").length === 1);
ok("tickersInText plockar inte versaler mitt i mening",
  VP.tickersInText("VD:n i USA sålde aktier").length === 0);
// dagsrörelse får INTE räknas ur en fil skriven före previousClose-rättelsen
const pxNew = { schemaVersion: "2026-08-02-prevclose", quotes: { X: { price: 110, previousClose: 100 } } };
const pxOld = { quotes: { X: { price: 110, previousClose: 100 } } };
ok("dayChangePct räknar med schemaVersion", Math.abs(VP.dayChangePct(pxNew, "X") - 10) < 1e-9);
ok("dayChangePct vägrar utan schemaVersion", VP.dayChangePct(pxOld, "X") === null);
ok("renderPrices visar roll-chip och dagsrörelse", (() => {
  const h = VR.renderPrices({ schemaVersion: "v", generatedAt: new Date().toISOString(),
    quotes: { "SAAB-B.ST": { price: 110, previousClose: 100, currency: "SEK", marketTime: new Date().toISOString() } } },
    null, { "SAAB-B.ST": { role: "innehav", label: "Innehav" } });
  return h.includes("px-role--innehav") && h.includes("Innehav") && h.includes("+10") && h.includes("px-chips");
})());
ok("renderPrices varnar när schemaVersion saknas", (() => {
  const h = VR.renderPrices({ generatedAt: new Date().toISOString(),
    quotes: { X: { price: 110, previousClose: 100, marketTime: new Date().toISOString() } } }, null, {});
  return h.includes("px-warn") && h.includes("px-chg--na");
})());
ok("renderPrices utan roller fungerar som förut",
  VR.renderPrices({ quotes: {}, generatedAt: new Date().toISOString() }).includes("Inga tickers"));

// ---- monitorns hjärtslag i dashboarden ----
ok("monitorStatus null utan fil", VP.monitorStatus(null) === null);
ok("monitorStatus okänd när checkedAt saknas", (() => {
  const m = VP.monitorStatus({ active: [] }, "2026-07-31T12:00:00Z");
  return m.state === "unknown" && /saknas/.test(m.label);
})());
ok("monitorStatus färsk", (() => {
  const m = VP.monitorStatus({ checkedAt: "2026-07-31T10:00:00Z", active: [] }, "2026-07-31T12:00:00Z");
  return m.state === "fresh" && /10:00 UTC/.test(m.label);
})());
ok("monitorStatus larmar på tystnad (vardag)", (() => {
  const m = VP.monitorStatus({ checkedAt: "2026-07-30T09:30:00Z" }, "2026-07-31T12:00:00Z");
  return m.state === "stale" && /tystnat/.test(m.label) && /2026-07-30/.test(m.label);
})());
ok("monitorStatus tyst på helgen", (() => {
  // 2026-08-01 är en lördag – ingen körning schemalagd, inget larm
  const m = VP.monitorStatus({ checkedAt: "2026-07-31T20:00:00Z" }, "2026-08-01T12:00:00Z");
  return m.state === "fresh";
})());
ok("monitorStatus räknar bevakade tickers",
  VP.monitorStatus({ checkedAt: "2026-07-31T10:00:00Z", watched: ["A", "B"] }, "2026-07-31T12:00:00Z").watched === 2);
ok("renderAlerts visar hjärtslag utan signaler", (() => {
  const html = VR.renderAlerts({ active: [], history: [] },
    { state: "fresh", label: "Monitorn kontrollerad 10:00 UTC", watched: 2 });
  return html.includes("Monitorn kontrollerad") && html.includes("al-mon--fresh") && html.includes("2 bevakade");
})());
ok("renderAlerts utan mon beter sig som förut",
  VR.renderAlerts({ active: [], history: [] }) === "");

// ---- beslutsloggen i dashboarden ----
const decDb = { decisions: [
  { date: "2026-07-14", book: "nordic", ticker: "ALLEI.ST", action: "KÖP", catalystType: "earnings" },
  { date: "2026-07-17", book: "nordic", ticker: "ALLEI.ST", action: "SÄLJ", catalystType: "earnings", outcomePct: 6.39, alphaPct: 6.89, source: "backfill-260731" },
  { date: "2026-07-30", book: "us", ticker: "JPM", action: "SÄLJ", catalystType: "macro", outcomePct: -1.5 },
  { date: "2026-07-31", book: "nordic", ticker: "XACT-OMXS30.ST", action: "SÄLJ", catalystType: "index", outcomePct: 40 },
  { date: "2026-07-31", book: "nordic", ticker: "SAAB-B.ST", action: "BEHÅLL", catalystType: "order" }
] };
const ds = VP.decisionStats(decDb);
ok("decisionStats räknar alla rader", ds.rows === 5);
ok("decisionStats räknar bara utvärderbara SÄLJ", ds.closedCount === 2);
ok("decisionStats exkluderar indexsleeven ur urvalsstatistiken",
  !ds.byCatalyst.some(c => c.type === "index"));
ok("decisionStats vet hur många som fattas till kalibrering",
  ds.needed === 13 && ds.calibratable === false);
ok("decisionStats flaggar tunna kategorier som brus", ds.byCatalyst.every(c => c.reliable === false));
ok("decisionStats räknar backfyllda rader", ds.backfilled === 1);
ok("decisionStats snittutfall per katalysatortyp", (() => {
  const e = ds.byCatalyst.find(c => c.type === "earnings");
  return Math.abs(e.avgPct - 6.39) < 1e-9 && e.winRate === 1 && Math.abs(e.avgAlphaPct - 6.89) < 1e-9;
})());
ok("decisionStats fördelning per bok", ds.byBook.nordic === 4 && ds.byBook.us === 1);
ok("decisionStats tål tom logg", (() => { const z = VP.decisionStats(null); return z.rows === 0 && z.closedCount === 0; })());
ok("renderDecisionStats tomläge", VR.renderDecisionStats(VP.decisionStats(null)).includes("Beslutsloggen är tom"));
ok("renderDecisionStats visar tabell och brus-flagga", (() => {
  const h = VR.renderDecisionStats(ds);
  return h.includes("Rapport") && h.includes("brus") && h.includes("13 kvar till kalibrering") && !h.includes("Indexändring</td>");
})());

// ---- breddad rörelsedetektion (movers.mjs, rena funktioner) ----
const MV = await mod(".github/scripts/movers.mjs");
ok("parseUniverse hoppar kommentarer och tomrader",
  (() => { const u = MV.parseUniverse("# rubrik\n\nELUX-B.ST\n  MIPS.ST  \n#SKIP.ST\n");
    return u.length === 2 && u[0] === "ELUX-B.ST" && u[1] === "MIPS.ST"; })());
ok("closesFrom plockar stängningar och hoppar hål", (() => {
  const j = { chart: { result: [{ timestamp: [1753912800, 1753999200, 1754085600],
    indicators: { quote: [{ close: [100, null, 110] }] } }] } };
  const c = MV.closesFrom(j);
  return c.length === 2 && c[0].c === 100 && c[1].c === 110 && /^\d{4}-\d{2}-\d{2}$/.test(c[0].d);
})());
ok("closesFrom tål trasig json", MV.closesFrom(null).length === 0 && MV.closesFrom({}).length === 0);
const mk = arr => arr.map((c, i) => ({ d: "2026-07-" + String(20 + i).padStart(2, "0"), c }));
ok("moveOver dagsrörelse", Math.abs(MV.moveOver(mk([100, 110]), 1) - 10) < 1e-9);
ok("moveOver veckorörelse", Math.abs(MV.moveOver(mk([100, 101, 102, 103, 104, 120]), 5) - 20) < 1e-9);
ok("moveOver null vid för kort historik – aldrig 0", MV.moveOver(mk([100]), 1) === null);
const ranked = MV.rankMovers({
  "ELUX-B.ST": mk([100, 100, 100, 100, 100, 122]),   // +22 % dag och vecka
  "SCST.ST":   mk([100, 101, 102, 103, 104, 114]),   // +9,6 % dag, +14 % vecka
  "VOLV-B.ST": mk([100, 100, 101, 101, 100, 101])    // lugnt – ska filtreras bort
}, { weekPct: 8, dayPct: 6 });
ok("rankMovers filtrerar bort lugna namn", !ranked.some(r => r.symbol === "VOLV-B.ST"));
ok("rankMovers fångar båda rörelserna", ranked.length === 2);
ok("rankMovers sorterar störst veckorörelse först", ranked[0].symbol === "ELUX-B.ST");
ok("rankMovers redovisar utlösande villkor", ranked.every(r => r.trigger === "dag" || r.trigger === "vecka"));
ok("rankMovers tar med senaste stängning och datum",
  ranked[0].lastClose === 122 && /^2026-07-\d\d$/.test(ranked[0].lastDate));
ok("rankMovers tål tomt underlag", MV.rankMovers({}).length === 0 && MV.rankMovers(null).length === 0);
ok("movers-universumet täcker de historiska missarna", (() => {
  const u = MV.parseUniverse(readFileSync(resolve(root, "config/universe_nordic_movers.txt"), "utf8"));
  return ["ELUX-B.ST", "SCST.ST", "MIPS.ST", "EQT.ST", "GETI-B.ST"].every(s => u.includes(s)) && u.length >= 60;
})());

// ---- backtest (backtest.mjs, rena funktioner) ----
const BT = await mod(".github/scripts/backtest.mjs");
ok("parseCandles", (() => {
  const j = { chart: { result: [{ timestamp: [1753912800, 1753999200], indicators: { quote: [{ open: [10, 11], high: [12, 13], low: [9, 10], close: [11, 12] }] } }] } };
  const c = BT.parseCandles(j);
  return c.length === 2 && c[0].o === 10 && c[1].c === 12 && /^\d{4}-\d{2}-\d{2}$/.test(c[0].d);
})());
ok("parseCandles null-hål filtreras", BT.parseCandles({ chart: { result: [{ timestamp: [1, 2], indicators: { quote: [{ open: [10, null], high: [12, 13], low: [9, 10], close: [11, 12] }] } }] } }).length === 1);
const trC = [
  { d: "2026-01-05", o: 100, h: 104, l: 99, c: 103 },
  { d: "2026-01-06", o: 103, h: 111, l: 102, c: 110 },
  { d: "2026-01-07", o: 110, h: 112, l: 109, c: 111 },
  { d: "2026-01-08", o: 111, h: 112, l: 110, c: 111 },
  { d: "2026-01-09", o: 111, h: 112, l: 110, c: 111 }
];
const trTarget = BT.simulateTrade(trC, 0, 0.05, 0.10, 5);
ok("simulateTrade målträff", trTarget.reason === "mål" && Math.abs(trTarget.retPct - 10) < 1e-9 && trTarget.days === 2);
const trStop = BT.simulateTrade([{ d: "2026-01-05", o: 100, h: 101, l: 94, c: 95 }], 0, 0.05, 0.10, 5);
ok("simulateTrade stopträff", trStop.reason === "stop" && Math.abs(trStop.retPct + 5) < 1e-9);
const trGap = BT.simulateTrade([{ d: "2026-01-05", o: 100, h: 101, l: 99, c: 100 }, { d: "2026-01-06", o: 92, h: 93, l: 91, c: 92 }], 0, 0.05, 0.10, 5);
ok("simulateTrade stop-gap till gap-kurs", trGap.reason === "stop-gap" && Math.abs(trGap.retPct + 8) < 1e-9);
const flat = ["2026-01-05", "2026-01-06", "2026-01-07", "2026-01-08", "2026-01-09"].map(d => ({ d, o: 100, h: 101, l: 99.5, c: 100.5 }));
const trRot = BT.simulateTrade(flat, 0, 0.05, 0.10, 5);
ok("simulateTrade rotation efter 5 dgr", trRot.reason === "rotation" && trRot.days === 5);
ok("isWeekStart helg-gap", BT.isWeekStart([{ d: "2026-01-09" }, { d: "2026-01-12" }], 1) === true && BT.isWeekStart([{ d: "2026-01-06" }, { d: "2026-01-07" }], 1) === false);
ok("momentumAt", (() => {
  const c = [100, 102, 104, 106, 108, 110].map((v, i) => ({ d: "2026-01-0" + (i + 1), c: v }));
  return Math.abs(BT.momentumAt(c, 5, 5) - 0.08) < 1e-9 && BT.momentumAt(c, 2, 5) === null;
})());
ok("buyHoldPct",Math.abs(BT.buyHoldPct([{ c: 100 }, { c: 110 }]) - 10) < 1e-9 && BT.buyHoldPct([]) === null);

/* ---- backtest: ombyggnaden 2026-08-02 -------------------------------------
   Sex mätfel åtgärdades (sleeve, lookback-svep, out-of-sample, survivorship,
   regimfilter, hålltid). Testerna nedan låser de nya rena funktionerna och de
   två invarianter som hela equity-kurvan vilar på:
     * produkten av en affärs dagsavkastningar = exitPrice/entryPrice
     * sleeven får BARA avkastning på dagar då platsen står tom            */
ok("momentumAt skip hoppar över de senaste dagarna", (() => {
  // stigande serie: skip>0 ska flytta fönstret bakåt och ge ETT annat värde
  const c = [100, 102, 104, 106, 108, 110, 112].map((v, i) => ({ d: "2026-01-0" + (i + 1), c: v }));
  const noSkip = BT.momentumAt(c, 6, 3, 0);       // bas c[3]=106, nu c[5]=110
  const skipped = BT.momentumAt(c, 6, 3, 2);      // bas c[1]=102, nu c[3]=106
  return Math.abs(noSkip - (110 / 106 - 1)) < 1e-12 &&
         Math.abs(skipped - (106 / 102 - 1)) < 1e-12 &&
         BT.momentumAt(c, 2, 3, 2) === null;      // för lite historik = null, inte krasch
})());
ok("momentumAt skip=0 är oförändrat gammalt beteende", (() => {
  const c = [100, 102, 104, 106, 108, 110].map((v, i) => ({ d: "2026-01-0" + (i + 1), c: v }));
  return Math.abs(BT.momentumAt(c, 5, 5) - 0.08) < 1e-9 && BT.momentumAt(c, 5, 5) === BT.momentumAt(c, 5, 5, 0);
})());
ok("smaSeries", (() => {
  const s = BT.smaSeries([1, 2, 3, 4, 5], 3);
  return s[0] === null && s[1] === null && s[2] === 2 && s[3] === 3 && s[4] === 4 &&
         BT.smaSeries([1, 2], 0).every(v => v === null);
})());
ok("alignIndex tar senaste candle <= datum", (() => {
  const bench = [{ d: "2026-01-05" }, { d: "2026-01-07" }, { d: "2026-01-08" }];
  const a = BT.alignIndex(bench, ["2026-01-02", "2026-01-05", "2026-01-06", "2026-01-08", "2026-01-09"]);
  return a.join(",") === "-1,0,0,2,2" && BT.alignIndex([], ["2026-01-05"])[0] === -1;
})());
ok("tradeDailyReturns teleskoperar till affärens totalavkastning", (() => {
  const c = [
    { d: "2026-01-05", o: 100, h: 104, l: 99, c: 103 },
    { d: "2026-01-06", o: 103, h: 111, l: 102, c: 110 },
    { d: "2026-01-07", o: 110, h: 112, l: 109, c: 111 }
  ];
  const tr = BT.simulateTrade(c, 0, 0.05, 0.10, 5);
  const legs = BT.tradeDailyReturns(c, tr);
  const prod = legs.reduce((a, l) => a * (1 + l.ret), 1);
  return legs.length === tr.days && Math.abs(prod - tr.exitPrice / tr.entryPrice) < 1e-12 &&
         Math.abs((prod - 1) * 100 - tr.retPct) < 1e-9;
})());
ok("simulateTrade exponerar entry/exit för equity-kurvan", (() => {
  const c = [{ d: "2026-01-05", o: 100, h: 101, l: 94, c: 95 }];
  const tr = BT.simulateTrade(c, 0, 0.05, 0.10, 5);
  return tr.entryIdx === 0 && tr.exitIdx === 0 && tr.entryPrice === 100 && Math.abs(tr.exitPrice - 95) < 1e-9;
})());
ok("sliceCandles skär på datum, inklusive gränserna", (() => {
  const s = { X: ["2026-01-05", "2026-01-06", "2026-01-07"].map(d => ({ d, c: 1 })) };
  return BT.sliceCandles(s, "2026-01-06", null).X.length === 2 &&
         BT.sliceCandles(s, null, "2026-01-06").X.length === 2 &&
         BT.sliceCandles(null, null, null).X === undefined;
})());
ok("median", BT.median([3, 1, 2]) === 2 && BT.median([4, 1, 3, 2]) === 2.5 && BT.median([]) === null);
ok("sleeveNeutralPct", (() => {
  // hela tiden ledig ⇒ hela benchmarkavkastningen; ingen ledig tid ⇒ noll
  return Math.abs(BT.sleeveNeutralPct(36.33, 1) - 36.33) < 1e-9 &&
         Math.abs(BT.sleeveNeutralPct(36.33, 0)) < 1e-12 &&
         Math.abs(BT.sleeveNeutralPct(100, 0.5) - (Math.SQRT2 - 1) * 100) < 1e-9 &&
         BT.sleeveNeutralPct(null, 0.5) === null &&
         BT.sleeveNeutralPct(-100, 0.5) === null;   // total förlust: odefinierat, inte NaN
})());
ok("buyHoldBetween", (() => {
  const c = [{ d: "2026-01-05", c: 100 }, { d: "2026-01-06", c: 110 }, { d: "2026-01-07", c: 121 }];
  return Math.abs(BT.buyHoldBetween(c, "2026-01-06", null) - 10) < 1e-9 &&
         Math.abs(BT.buyHoldBetween(c, null, null) - 21) < 1e-9;
})());

// Syntetiskt universum som återanvänds av sleeve-/regim-/exponeringstesterna.
const synth = (() => {
  const dts = []; let dt = new Date("2026-01-05T12:00:00Z");
  while (dts.length < 60){ const dow = dt.getUTCDay(); if (dow >= 1 && dow <= 5) dts.push(dt.toISOString().slice(0, 10)); dt = new Date(+dt + 86400e3); }
  return dts;
})();
const synthUp = synth.map((d, i) => ({ d, o: 100 + i, h: 101.2 + i, l: 99 + i, c: 100.5 + i }));
const synthBenchUp = synth.map((d, i) => ({ d, o: 50 + i * 0.5, h: 51 + i * 0.5, l: 49 + i * 0.5, c: 50 + i * 0.5 }));

ok("backtestUniverse syntetiskt universum", (() => {
  const bt = BT.backtestUniverse({ X: synthUp.slice(0, 40) }, { lookback: 5, stopPct: 0.05, targetPct: 0.10, holdDays: 5, topN: 2 });
  return bt && bt.weeks >= 4 && bt.trades >= 4 && bt.winRate === 1 && bt.chainedPct > 0 && bt.maxDrawdownPct === 0;
})());
ok("sleeven ger tomma platser avkastning – och bara dem", (() => {
  // topN 2, ett enda bolag ⇒ minst en plats står alltid tom. Med en STIGANDE
  // bench måste equity bli högre med sleeve på än av; utan bench ska den vara
  // identisk med sleeve av (ingen tyst gratisavkastning).
  const p = { lookback: 5, stopPct: 0.05, targetPct: 0.10, maxHoldDays: 30, mode: "hold", topN: 2, weight: 0.5 };
  const off = BT.backtestUniverse({ X: synthUp }, Object.assign({}, p, { sleeve: false, benchCandles: synthBenchUp }));
  const on  = BT.backtestUniverse({ X: synthUp }, Object.assign({}, p, { sleeve: true,  benchCandles: synthBenchUp }));
  const noBench = BT.backtestUniverse({ X: synthUp }, Object.assign({}, p, { sleeve: true, benchCandles: null }));
  return on.equityPct > off.equityPct &&
         Math.abs(noBench.equityPct - off.equityPct) < 1e-9 &&
         Math.abs(on.chainedPct - off.chainedPct) < 1e-9;   // gamla måttet får INTE påverkas
})());
ok("sleeve-diagnostiken skiljer felkoppling från timing", (() => {
  const p = { lookback: 5, stopPct: 0.05, targetPct: 0.10, maxHoldDays: 30, mode: "hold", topN: 2, weight: 0.5, benchCandles: synthBenchUp };
  const off = BT.backtestUniverse({ X: synthUp }, Object.assign({}, p, { sleeve: false }));
  const on  = BT.backtestUniverse({ X: synthUp }, Object.assign({}, p, { sleeve: true }));
  const utan = BT.backtestUniverse({ X: synthUp }, { lookback: 5, stopPct: 0.05, targetPct: 0.10, maxHoldDays: 30, mode: "hold", topN: 2, weight: 0.5 });
  return off.sleeveContribPct === 0 &&              // avstängd sleeve bidrar inget
         on.sleeveContribPct > 0 &&
         off.idleBenchPct != null && on.idleDays > 0 &&  // mäts även när sleeven är AV
         Math.abs(off.idleBenchPct - on.idleBenchPct) < 1e-9 &&
         utan.idleBenchPct === null;                // utan bench finns inget att mäta
})());
ok("sleeven rör inte affärsstatistiken", (() => {
  const p = { lookback: 5, stopPct: 0.05, targetPct: 0.10, maxHoldDays: 30, mode: "hold", topN: 2, weight: 0.5, benchCandles: synthBenchUp };
  const off = BT.backtestUniverse({ X: synthUp }, Object.assign({}, p, { sleeve: false }));
  const on  = BT.backtestUniverse({ X: synthUp }, Object.assign({}, p, { sleeve: true }));
  return off.trades === on.trades && off.winRate === on.winRate && off.profitFactor === on.profitFactor;
})());
ok("exposurePct mäter andel av tiden i aktier", (() => {
  const bt = BT.backtestUniverse({ X: synthUp }, { lookback: 5, stopPct: 0.05, targetPct: 0.10, maxHoldDays: 30, mode: "hold", topN: 2, weight: 0.5 });
  // ett bolag, två platser ⇒ som mest 50 % investerat
  return bt.exposurePct > 0 && bt.exposurePct <= 50 + 1e-9;
})());
ok("regimfilter stoppar nya positioner när bench ligger under sitt MA", (() => {
  const p = { lookback: 5, stopPct: 0.05, targetPct: 0.10, maxHoldDays: 30, mode: "hold", topN: 2, weight: 0.5 };
  const down = synth.map((d, i) => ({ d, o: 100 - i * 0.5, h: 101 - i * 0.5, l: 99 - i * 0.5, c: 100 - i * 0.5 }));
  const off = BT.backtestUniverse({ X: synthUp }, Object.assign({}, p, { benchCandles: down, regimeMa: 0 }));
  const on  = BT.backtestUniverse({ X: synthUp }, Object.assign({}, p, { benchCandles: down, regimeMa: 10 }));
  const up  = BT.backtestUniverse({ X: synthUp }, Object.assign({}, p, { benchCandles: synthBenchUp, regimeMa: 10 }));
  // fallande bench ⇒ färre affärer; stigande bench ⇒ filtret ska inte bita
  return on.trades < off.trades && up.trades === off.trades;
})());
ok("regimfilter blockerar inte när MA saknar underlag", (() => {
  const p = { lookback: 5, stopPct: 0.05, targetPct: 0.10, maxHoldDays: 30, mode: "hold", topN: 2, weight: 0.5 };
  const off = BT.backtestUniverse({ X: synthUp }, Object.assign({}, p, { regimeMa: 0 }));
  const huge = BT.backtestUniverse({ X: synthUp }, Object.assign({}, p, { benchCandles: synthBenchUp, regimeMa: 5000 }));
  return huge.trades === off.trades;
})());
ok("maxHoldDays styr hålltiden i BEHÅLL-läget", (() => {
  // orimligt vida nivåer ⇒ varken stop eller mål kan träffas, enda exiten är
  // horisonten. Serien måste stiga: rankAt kräver POSITIVT momentum, så en helt
  // flat serie ger noll kandidater och testet skulle mäta ingenting.
  const p = { lookback: 5, stopPct: 0.99, targetPct: 0.99, mode: "hold", topN: 1, weight: 1 };
  const kort = BT.backtestUniverse({ X: synthUp }, Object.assign({}, p, { maxHoldDays: 5 }));
  const lang = BT.backtestUniverse({ X: synthUp }, Object.assign({}, p, { maxHoldDays: 25 }));
  return kort.avgHoldDays < lang.avgHoldDays && kort.trades > lang.trades;
})());
ok("kostnaden dras både från affärsnettot och från equity", (() => {
  const p = { lookback: 5, stopPct: 0.05, targetPct: 0.10, maxHoldDays: 30, mode: "hold", topN: 2, weight: 0.5, benchCandles: synthBenchUp, sleeve: true };
  const gratis = BT.backtestUniverse({ X: synthUp }, Object.assign({}, p, { costPct: 0 }));
  const dyrt   = BT.backtestUniverse({ X: synthUp }, Object.assign({}, p, { costPct: 1 }));
  return dyrt.equityPct < gratis.equityPct && dyrt.chainedPct < gratis.chainedPct &&
         Math.abs(dyrt.costDragPctPerYear - dyrt.tradesPerYear * 1 * 0.5) < 1e-9;
})());
ok("equity = kedjan av affärernas dagsben när boken är fullinvesterad", (() => {
  /* En enda plats, vikt 1, orimligt vida nivåer ⇒ inga stop/mål-träffar. Då
     MÅSTE equity vara exakt produkten av affärernas utfall – annars tappas
     eller dubbelräknas dagar. Fångar bland annat att equity-loopen börjar på
     axis[0]: startar den på 1 försvinner entry-dagens avkastning för den
     första affären tyst. */
  const p = { lookback: 5, stopPct: 0.99, targetPct: 0.99, maxHoldDays: 3, mode: "hold", topN: 1, weight: 1, costPct: 0 };
  const bt = BT.backtestUniverse({ X: synthUp }, p);
  const chain = 1 + bt.chainedPct / 100;          // vikt 1 ⇒ ren produkt av affärerna
  return Math.abs((1 + bt.equityPct / 100) - chain) < 1e-9;
})());
ok("years/tradesPerYear räknas ur kalenderspannet", (() => {
  const bt = BT.backtestUniverse({ X: synthUp }, { lookback: 5, stopPct: 0.05, targetPct: 0.10, maxHoldDays: 30, mode: "hold", topN: 2, weight: 0.5 });
  const span = (Date.parse(bt.to) - Date.parse(bt.from)) / 86400e3 / 365.25;
  return Math.abs(bt.years - span) < 1e-9 && bt.from < bt.to;
})());
ok("backtestUniverse tål tomt/för kort underlag", (() => {
  return BT.backtestUniverse({}, { lookback: 20 }) === null &&
         BT.backtestUniverse({ X: synthUp.slice(0, 3) }, { lookback: 20 }) === null;
})());

/* ---- backfill av price_history (2026-08-03) -------------------------------
   Regimfiltret (MA100), MACD och EMA200 gick inte att beräkna live eftersom
   filen bara innehöll 16 sessioner. Backfillen fyller hålet EN gång. Testerna
   låser den enda regel som kan förstöra data: mergen får aldrig radera
   befintlig historik, och dagens egna punkt får inte skrivas över av en
   obekräftad Yahoo-bar.                                                      */
const BF = await mod(".github/scripts/backfill-history.mjs");
ok("candlesToSeries plockar datum + stängning, hoppar hål", (() => {
  const j = { chart: { result: [{ timestamp: [1753912800, 1753999200, 1754085600],
    indicators: { quote: [{ close: [10, null, 12] }] } }] } };
  const s = BF.candlesToSeries(j);
  return s.length === 2 && s[0][1] === 10 && s[1][1] === 12 && /^\d{4}-\d{2}-\d{2}$/.test(s[0][0]);
})());
ok("candlesToSeries tål skräp", BF.candlesToSeries(null).length === 0 && BF.candlesToSeries({}).length === 0 &&
   BF.candlesToSeries({ chart: { result: [{}] } }).length === 0);
ok("mergeSeries: Yahoo vinner på gamla datum", (() => {
  const m = BF.mergeSeries([["2026-01-02", 99]], [["2026-01-02", 100]], "2026-08-03");
  return m.length === 1 && m[0][1] === 100;
})());
ok("mergeSeries: dagens egna punkt rörs INTE", (() => {
  // pris-hämtaren har skrivit dagens värde; Yahoo kan mitt på dagen ge en obekräftad bar
  const m = BF.mergeSeries([["2026-08-03", 500]], [["2026-08-03", 480]], "2026-08-03");
  return m.length === 1 && m[0][1] === 500;
})());
ok("mergeSeries: dagens punkt läggs till om den saknas", (() => {
  const m = BF.mergeSeries([], [["2026-08-03", 480]], "2026-08-03");
  return m.length === 1 && m[0][1] === 480;
})());
ok("mergeSeries raderar aldrig befintliga datum", (() => {
  const gammal = [["2026-01-02", 1], ["2026-01-03", 2]];
  const m = BF.mergeSeries(gammal, [["2026-02-01", 3]], "2026-08-03");
  return m.length === 3 && m[0][0] === "2026-01-02" && m[2][0] === "2026-02-01";
})());
ok("mergeSeries sorterar och kapar till de SENASTE punkterna", (() => {
  const f = [["2026-01-05", 5], ["2026-01-01", 1], ["2026-01-03", 3]];
  const m = BF.mergeSeries([], f, "2026-08-03", 2);
  return m.length === 2 && m[0][0] === "2026-01-03" && m[1][0] === "2026-01-05";
})());
ok("collectSymbols slår ihop historik och watchlists, hoppar kommentarer", (() => {
  const s = BF.collectSymbols({ "AAA.ST": [] }, ["# kommentar\nBBB.ST\n\n  CCC.OL  \n"]);
  return s.length === 3 && s.includes("AAA.ST") && s.includes("BBB.ST") && s.includes("CCC.OL");
})());
/* REGRESSIONSVAKT: benchmarken måste ha djup nog för regimfiltret. Utan den
   här assertionen kan filen tunnas ut igen utan att någon märker det – och då
   tillämpar rotationen punkt 2b "i sin strängare riktning" utan att kunna mäta,
   vilket är exakt vad som hände 2026-08-03. 100 punkter = MA100. */
ok("price_history bär MA100 för båda benchmarken", (() => {
  const h = JSON.parse(readFileSync(resolve(root, "state/price_history.json"), "utf8")).series || {};
  return (h["^OMX"] || []).length >= 100 && (h["^GSPC"] || []).length >= 100;
})());

/* ---- backtest: kostnad per symbol (2026-08-03) ----------------------------
   Universumet breddades med småbolag. En FAST kostnad på 0,25 % beskriver en
   likvid large cap; på ett bolag med 0,5 MSEK/dag är den fel med en faktor 4–6,
   och felet gör backtestet FÖR BRA – alltså exakt det underlag som skulle få oss
   att bredda universumet på fel grunder. Testerna låser att kostnaden härleds ur
   uppmätt omsättning och att den faktiskt slår igenom i både affärsnetto och
   equity.                                                                     */
ok("parseCandles bär volym, null när den saknas", (() => {
  const j = v => ({ chart: { result: [{ timestamp: [1753912800], indicators: { quote: [{ open: [10], high: [12], low: [9], close: [11], volume: v }] } }] } });
  return BT.parseCandles(j([5000]))[0].v === 5000 && BT.parseCandles(j([null]))[0].v === null &&
         BT.parseCandles(j(undefined))[0].v === null;
})());
ok("medianTurnover är median, inte medel", (() => {
  // 24 dagar à 1000 i omsättning + en enda rapportdag på 1 000 000.
  // Medel skulle bli ~41 000, medianen ska stanna på 1000.
  const c = [];
  for (let i = 0; i < 24; i++) c.push({ d: "2026-01-" + String(i + 1).padStart(2, "0"), c: 10, v: 100 });
  c.push({ d: "2026-02-01", c: 10, v: 100000 });
  return BT.medianTurnover(c) === 1000;
})());
ok("medianTurnover null vid för tunt eller volymlöst underlag", (() => {
  const utanVolym = Array.from({ length: 30 }, (_, i) => ({ d: "d" + i, c: 10, v: null }));
  const fatal = Array.from({ length: 5 }, (_, i) => ({ d: "d" + i, c: 10, v: 100 }));
  return BT.medianTurnover(utanVolym) === null && BT.medianTurnover(fatal) === null &&
         BT.medianTurnover([]) === null && BT.medianTurnover(null) === null;
})());
ok("toSEK skalar per börssuffix", (() => {
  return BT.toSEK(100, "VOLV-B.ST") === 100 &&
         Math.abs(BT.toSEK(100, "NOKIA.HE") - 100 * BT.FX_TO_SEK[".HE"]) < 1e-9 &&
         Math.abs(BT.toSEK(100, "NOVO-B.CO") - 100 * BT.FX_TO_SEK[".CO"]) < 1e-9 &&
         BT.toSEK(null, "X.ST") === null;
})());
const TIERS = [
  { minTurnoverSEK: 20000000, roundTripPct: 0.25 },
  { minTurnoverSEK: 3000000, roundTripPct: 0.75 },
  { minTurnoverSEK: 0, roundTripPct: 1.5 }
];
ok("costForTurnover väljer rätt nivå vid gränserna", (() => {
  return BT.costForTurnover(50e6, TIERS) === 0.25 && BT.costForTurnover(20e6, TIERS) === 0.25 &&
         BT.costForTurnover(19.9e6, TIERS) === 0.75 && BT.costForTurnover(3e6, TIERS) === 0.75 &&
         BT.costForTurnover(0.5e6, TIERS) === 1.5;
})());
ok("costForTurnover: okänd omsättning ⇒ DYRASTE nivån", (() => {
  // Att gissa billigt på det vi inte kan mäta är felet modellen finns för att undvika.
  return BT.costForTurnover(null, TIERS) === 1.5 && BT.costForTurnover(undefined, TIERS) === 1.5 &&
         BT.costForTurnover(1e9, []) === 0;
})());
ok("buildCostTable ger nivå per symbol", (() => {
  const likvid = Array.from({ length: 30 }, (_, i) => ({ d: "d" + i, c: 100, v: 500000 }));   // 50 MSEK/dag
  const illikvid = Array.from({ length: 30 }, (_, i) => ({ d: "d" + i, c: 4, v: 100000 }));   // 0,4 MSEK/dag
  const t = BT.buildCostTable({ "STOR.ST": likvid, "LITEN.ST": illikvid }, TIERS);
  return t.bySym["STOR.ST"] === 0.25 && t.bySym["LITEN.ST"] === 1.5 &&
         t.turnover["STOR.ST"] === 50e6 && t.turnover["LITEN.ST"] === 4e5;
})());
ok("backtestUniverse tar costPct som FUNKTION per symbol", (() => {
  /* Två identiska serier, olika kostnad. Den dyra symbolen måste ge lägre netto,
     och avgCostPct ska landa mellan de två nivåerna – annars appliceras en enda
     kostnad på båda och hela småbolagsjämförelsen mäter fel. */
  const p = { lookback: 5, stopPct: 0.05, targetPct: 0.10, maxHoldDays: 30, mode: "hold",
              topN: 2, weight: 0.5, benchCandles: synthBenchUp, sleeve: true };
  const kandidater = { BILLIG: synthUp, DYR: synthUp.map(c => Object.assign({}, c)) };
  const fast = BT.backtestUniverse(kandidater, Object.assign({}, p, { costPct: 0 }));
  const funk = BT.backtestUniverse(kandidater, Object.assign({}, p, { costPct: s => s === "DYR" ? 2 : 0 }));
  return funk.equityPct < fast.equityPct && funk.avgCostPct > 0 && funk.avgCostPct <= 2 &&
         fast.avgCostPct === 0;
})());
ok("costPct som funktion drar rätt belopp per affär", (() => {
  // En enda symbol, vikt 1: nettot ska vara exakt brutto minus den symbolens nivå.
  const p = { lookback: 5, stopPct: 0.99, targetPct: 0.99, maxHoldDays: 3, mode: "hold",
              topN: 1, weight: 1, costPct: () => 1.25 };
  const bt = BT.backtestUniverse({ X: synthUp }, p);
  return bt.avgCostPct === 1.25 &&
         Math.abs(bt.costDragPctPerYear - bt.tradesPerYear * 1.25) < 1e-9;
})());

// ---- rapportens högerspalt: innehållsförteckning + sammanfattning ----
// Fältraden följer daglig_mall.md – parseDaily läser "Läge" som **fält**,
// inte som rubrik, så en syntetisk rapport måste ha samma form som mallen.
const RMD = [
  "# Daglig bevakning 2026-08-01",
  "**Datum:** 2026-08-01 | **Läge:** Daglig bevakning",
  "**Marknadsläget i korthet:** Lugn handel, index oförändrat.",
  "",
  "## Läge",
  "Text.",
  "## Marknadsläge & Kontext",
  "Mer text.",
  "### 1. Katalysatorn",
  "Detaljer.",
  "```",
  "## detta är en kodrad, inte en rubrik",
  "```",
  "## Läge",
  "Dubblett med samma rubriktext."
].join("\n");

const OUT = VP.reportOutline(RMD);
ok("reportOutline hittar h2 och h3", OUT.length === 4);
ok("reportOutline hoppar över rubriker i kodblock",
  !OUT.some(h => h.text.includes("kodrad")));
ok("reportOutline behåller nivån", OUT[2].level === 3 && OUT[0].level === 2);
ok("reportOutline ger unika id vid dubblettrubriker",
  new Set(OUT.map(h => h.id)).size === OUT.length && OUT[3].id !== OUT[0].id);
ok("reportOutline tål tom indata", VP.reportOutline("").length === 0 && VP.reportOutline(null).length === 0);
ok("slugify klarar svenska tecken", VP.slugify("Marknadsläge & Kontext") === "marknadsläge-kontext");
ok("slugify faller tillbaka på ett id", VP.slugify("###") === "avsnitt" && VP.slugify("") === "avsnitt");
ok("slugify matchar det outline ger", VP.slugify("1. Katalysatorn") === OUT[2].id);

const DIGD = VP.reportDigest(RMD, { type: "daily" });
ok("reportDigest daglig ger fältrader", DIGD.facts.length >= 1 && DIGD.type === "daily");
ok("reportDigest okänd typ kraschar inte",
  (() => { const z = VP.reportDigest(RMD, { type: "retro" }); return z.facts.length === 0 && z.items.length === 0; })());
ok("reportDigest tål trasig markdown",
  (() => { try { const z = VP.reportDigest(null, null); return Array.isArray(z.items); } catch (e) { return false; } })());

const RAIL = VR.renderReportRail({
  outline: OUT,
  digest: { facts: [{ k: "Läge", v: "Bevakning" }], items: [{ name: "Saab", decision: "BEHÅLL", ticker: "SAAB-B.ST" }], watch: ["Rapport onsdag"] },
  tickers: ["SAAB-B.ST"],
  prev: { name: "daglig-260731.md", label: "31 jul" },
  next: null
});
ok("renderReportRail innehållsförteckning är klickbar", RAIL.includes('data-toc="' + OUT[0].id + '"'));
ok("renderReportRail visar beslutsbadge", RAIL.includes("badge--behall"));
ok("renderReportRail visar bevakning", RAIL.includes("Rapport onsdag"));
ok("renderReportRail grannavigering", RAIL.includes('data-report="daglig-260731.md"'));
ok("renderReportRail utan beslut visar tickern",
  VR.renderReportRail({ digest: { facts: [], items: [{ name: "Novo", decision: "", ticker: "NVO" }], watch: [] } }).includes(">NVO<"));
ok("renderReportRail tomt läge ger tom sträng", VR.renderReportRail({}) === "" && VR.renderReportRail() === "");
ok("renderReportRail döljer innehållsförteckning vid en enda rubrik",
  !VR.renderReportRail({ outline: [{ level: 2, text: "En", id: "en" }], digest: {} }).includes("data-toc"));

/* ---- push-notiser -------------------------------------------------------
   Den viktigaste raden i hela filen är RFC-vektorn nedan. Ett fel i
   nyckelhärledningen ger INGET synligt fel: push-tjänsten svarar 201 (den
   läser aldrig innehållet) och telefonen kastar paketet tyst. Utan en fast
   vektor hade "inga notiser kommer fram" varit omöjligt att skilja från
   "inga signaler har inträffat".
-------------------------------------------------------------------------- */
const WP = await mod(".github/scripts/webpush.mjs");
const PN = await mod(".github/scripts/push-notify.mjs");
const PS = await mod(".github/scripts/push-sub-add.mjs");

{ // RFC 8291 §5 – officiell testvektor, byte för byte
  const uaPub = WP.unb64u("BCVxsr7N_eNgVRqvHtD0zTZsEc6-VV-JvLexhqUzORcxaOzi6-AYWXvTBHm4bjyPjs7Vd8pZGH6SRpkNtoIAiw4");
  const asPub = WP.unb64u("BP4z9KsN6nGRTbVYI_c7VJSPQTBtkgcy27mlmlMoZIIgDll6e3vCYLocInmYWAmS6TlzAC8wEqKK6PBru3jl7A8");
  const body = WP.encryptPayload(
    "When I grow up, I want to be a watermelon",
    uaPub,
    WP.unb64u("BTBZMqHH6r4Tts7J_aSIgg"),
    { salt: WP.unb64u("DGv6ra1nlYgDCS1FRnbzlw"),
      as: { privateKey: WP.privFromRaw(WP.unb64u("yfWPiYE-n46HLnH0KqZOF1fJJU3MYrct3AELtAQ-oRw"), asPub), publicRaw: asPub } });
  ok("webpush: RFC 8291 §5 testvektor", WP.b64u(body) ===
    "DGv6ra1nlYgDCS1FRnbzlwAAEABBBP4z9KsN6nGRTbVYI_c7VJSPQTBtkgcy27mlmlMoZIIgDll6e3vCYLocInmYWAmS6TlzAC8wEqKK6PBru3jl7A_yl95bQpu6cVPTpK4Mqgkf1CXztLVBSt2Ks3oZwbuwXPXLWyouBWLVWGNWQexSgSxsj_Qulcy4a-fN");
}
{ // Slumpat salt/nyckel varje gång – annars återanvänds en nonce mellan sändningar.
  const kp = WP.generateVapidKeys();
  const uaPub = WP.unb64u(kp.publicKey), auth = Buffer.alloc(16, 7);
  const a = WP.b64u(WP.encryptPayload("x", uaPub, auth));
  const b = WP.b64u(WP.encryptPayload("x", uaPub, auth));
  ok("webpush: nytt salt per kryptering", a !== b);
  const hdr = WP.vapidAuthHeader("https://fcm.googleapis.com/fcm/send/abc", kp.publicKey, kp.privateKey, "mailto:a@b.c", 1000);
  const claims = JSON.parse(Buffer.from(hdr.split(" ")[1].split(".")[1].replace(/,$/, ""), "base64").toString());
  ok("webpush: VAPID-huvudets aud är ORIGIN, inte hela endpointen", claims.aud === "https://fcm.googleapis.com");
  ok("webpush: VAPID-huvudet har giltighetstid och k=", claims.exp === 1000 + 43200 && hdr.includes(", k=" + kp.publicKey));
  // Signaturen måste vara ES256 i JOSE-format (r||s). Node ger DER som standard,
  // och DER ger 401 från FCM – ett fel som annars bara syns som "inga notiser".
  const { createVerify } = await import("node:crypto");
  const jwt = hdr.split(" ")[1].replace(/,$/, "").replace(/^t=/, "");
  const [h1, p1, s1] = jwt.split(".");
  ok("webpush: VAPID-signaturen verifierar mot den publika nyckeln",
    createVerify("SHA256").update(h1 + "." + p1).verify(
      { key: WP.pubFromRaw(WP.unb64u(kp.publicKey)), dsaEncoding: "ieee-p1363" }, WP.unb64u(s1)));
}
{ // Urvalet: bara KÖP/SÄLJ ska nå telefonen.
  const dec = { decisions: [
    { date: "2026-08-03", book: "nordic", ticker: "SAAB-B.ST", action: "KÖP", price: 500, currency: "SEK", reason: "katalysator" },
    { date: "2026-08-03", book: "us", ticker: "MSFT", action: "AVVAKTA", price: 464, reason: "RSI 78" },
    { date: "2026-08-03", book: "us", ticker: "JPM", action: "BEHÅLL", price: 351, reason: "oförändrad" },
    { date: "2026-06-01", book: "nordic", ticker: "GAMMAL.ST", action: "SÄLJ", price: 10, reason: "för gammal" }
  ] };
  const n = PN.decisionNotifications(dec, new Date("2026-08-03T12:00:00Z"));
  ok("push: bara KÖP/SÄLJ notifieras", n.length === 1 && n[0].title.includes("SAAB-B.ST"));
  ok("push: gamla rader notifieras inte", !n.some(x => x.key.includes("GAMMAL")));
  const al = PN.alertNotifications({ active: [{ ticker: "ALLEI.ST", type: "SÄLJ", reason: "stop-loss träffad", level: 74, price: 73.5, currency: "SEK" }] });
  ok("push: alerts blir notiser", al.length === 1 && al[0].body.includes("nivå 74") && al[0].url === "#hem");
  ok("push: dedupe hoppar över redan skickade", PN.pending([...al, ...n], [al[0].key]).length === 1);
  ok("push: taket per körning håller", PN.pending(Array.from({ length: 30 }, (_, i) => ({ key: "k" + i })), []).length === 5);
}
{ // Prenumerationen måste valideras – en trasig endpoint ger annars ett tyst 400 varje timme.
  const good = { endpoint: "https://fcm.googleapis.com/fcm/send/abc", keys: { p256dh: WP.b64u(Buffer.concat([Buffer.from([4]), Buffer.alloc(64, 1)])), auth: WP.b64u(Buffer.alloc(16, 2)) } };
  ok("push-sub: giltig prenumeration accepteras", PS.validate(good).endpoint === good.endpoint);
  ok("push-sub: plockas ur ett ```json-block", PS.parseSubscription("text\n```json\n" + JSON.stringify(good) + "\n```\n").endpoint === good.endpoint);
  const bad = (o, why) => { try { PS.validate(o); return false; } catch (e) { return true; } };
  ok("push-sub: http avvisas", bad(Object.assign({}, good, { endpoint: "http://x.y/z" })));
  ok("push-sub: fel nyckellängd avvisas", bad({ endpoint: good.endpoint, keys: { p256dh: "AAAA", auth: good.keys.auth } }));
  const up = PS.upsert({ subscriptions: [Object.assign({}, good, { label: "gammal" })] }, good, "ny", "2026-08-03T00:00:00Z");
  ok("push-sub: samma endpoint ersätts, dubbleras inte", up.subscriptions.length === 1 && up.subscriptions[0].label === "ny");
}

/* ---- KANDIDATKÖN OCH RAPPORTER PÅ VÄG (UI, 2026-08-04) ------------------
   Rena renderfunktioner, testas utan DOM. Poängen med kandidatrutan är att
   göra VÄNTANDE kandidater synliga – utfallet syns redan i andra vyer. */
{
  const kand = (over = {}) => Object.assign({
    id: "260804-PLTR", date: "2026-08-04", ticker: "PLTR", book: "us", source: "scout",
    catalystType: "earnings", catalystDate: "2026-08-03", confirmed: true,
    thesis: "Q2 krossade, US commercial +149 %.", sourceRef: "CNBC 2026-08-03",
    price: 160.37, priceAsOf: "2026-08-04T16:13:25Z", status: "new",
    expiresAt: "2026-08-11", decidedBy: null, decidedAt: null
  }, over);

  // Saknad fil och tom lista måste ge OLIKA besked – "filen finns inte" och
  // "inget flaggat i dag" är helt skilda tillstånd för den som läser.
  ok("kandidatruta: saknad fil förklarar vad filen är",
     VR.renderCandidates(null).includes("scout_candidates.json"));
  ok("kandidatruta: tom lista säger 'inga kandidater'",
     /Inga kandidater/.test(VR.renderCandidates({ candidates: [] })));

  const h = VR.renderCandidates({ candidates: [kand()] }, "2026-08-05");
  ok("kandidatruta: visar ticker och tes", h.includes("PLTR") && h.includes("US commercial"));
  ok("kandidatruta: väntande räknas", h.includes("1 väntar på avgörande"));
  ok("kandidatruta: ingen försening före expiresAt", !h.includes("FÖRSENAD"));

  /* Den viktigaste raden i hela rutan: en kandidat som passerat sitt datum
     utan avgörande är ett PROCESSFEL och måste synas som ett. */
  const sen = VR.renderCandidates({ candidates: [kand()] }, "2026-08-12");
  ok("kandidatruta: försenad kandidat flaggas", sen.includes("FÖRSENAD") && sen.includes("sv-warn"));

  const utanKurs = VR.renderCandidates({ candidates: [kand({ price: null, priceAsOf: null })] }, "2026-08-05");
  ok("kandidatruta: saknad kurs märks ut", utanKurs.includes("kurs saknas"));
  const obekr = VR.renderCandidates({ candidates: [kand({ confirmed: false })] }, "2026-08-05");
  ok("kandidatruta: obekräftad märks som bevakning", obekr.includes("bevakning"));
  const avvisad = VR.renderCandidates({ candidates: [kand({ status: "rejected",
    decidedBy: "r.md", decidedAt: "2026-08-05", decisionReason: "RSI 79 utan exceptionell katalysator" })] }, "2026-08-06");
  ok("kandidatruta: avvisad visar sin spärr", avvisad.includes("RSI 79") && avvisad.includes("Avvisad"));
  // Väntande ska ligga överst – det är dem rutan finns för.
  const ordn = VR.renderCandidates({ candidates: [
    kand({ id: "260801-AAA", ticker: "AAA", status: "rejected", decidedBy: "r.md", decidedAt: "2026-08-02", decisionReason: "x" }),
    kand({ id: "260804-BBB", ticker: "BBB" })
  ] }, "2026-08-05");
  ok("kandidatruta: väntande sorteras överst", ordn.indexOf("BBB") < ordn.indexOf("AAA"));
  /* En trasig post får ALDRIG släcka vyn. Filerna skrivs av LLM-routiner, så
     en null-rad är realistisk – före 2026-08-04 kastade renderaren på den och
     hela rutan försvann i stället för att visa de läsbara raderna. */
  ok("kandidatruta: null-post släcker inte vyn",
     VR.renderCandidates({ candidates: [null, kand()] }, "2026-08-05").includes("PLTR"));
  ok("kandidatruta: enbart skräp ger tomt läge, inte krasch",
     /Inga kandidater/.test(VR.renderCandidates({ candidates: [null, 42, "x"] }, "2026-08-05")));
  ok("kandidatruta: escapar html i tes",
     !VR.renderCandidates({ candidates: [kand({ thesis: "<img src=x onerror=1>" })] }, "2026-08-05").includes("<img"));
}
{
  const cal = { horizonDays: 10, upcoming: [
    { symbol: "AMD", date: "2026-08-04", tradingDaysAway: 0, isEstimate: false },
    { symbol: "NVO", date: "2026-08-05", tradingDaysAway: 1, isEstimate: true },
    { symbol: "OSSD.ST", date: "2026-08-18", tradingDaysAway: 10, isEstimate: false }
  ] };
  ok("rapportrad: saknad kalender förklaras",
     VR.renderEarningsSoon(null).includes("earnings_calendar.json"));
  ok("rapportrad: tom lista säger inga rapporter",
     /Inga rapporter/.test(VR.renderEarningsSoon({ horizonDays: 10, upcoming: [] })));
  const e = VR.renderEarningsSoon(cal, ["AMD"]);
  ok("rapportrad: i dag / i morgon i klarspråk", e.includes("i dag") && e.includes("i morgon"));
  /* INNEHAV-markeringen är hela nyttan: en rapport i ett innehav är det
     prompten kallar binär händelse och kräver ett explicit beslut. */
  ok("rapportrad: innehav markeras", e.includes("INNEHAV") && e.includes("er--held"));
  // Räkna TAGGEN, inte ordet – "INNEHAV" står också i förklaringstexten under
  // listan, så en ordräkning testar fel sak och ger falskt utslag.
  ok("rapportrad: bara ägda bolag får taggen",
     (e.match(/class="er-tag"/g) || []).length === 1);
  /* Ett GISSAT datum får aldrig läsas som bekräftat – då kunde en gissning
     blockera ett köp, eller släppa igenom ett köp dagen före en riktig rapport. */
  ok("rapportrad: gissat datum märks ut", e.includes("gissat datum"));
  ok("rapportrad: utan innehav ingen markering",
     !VR.renderEarningsSoon(cal, []).includes('class="er-tag"'));
  ok("rapportrad: null-post släcker inte vyn",
     VR.renderEarningsSoon({ upcoming: [null, cal.upcoming[0]] }, []).includes("AMD"));
  ok("rapportrad: held=null kraschar inte",
     VR.renderEarningsSoon(cal, null).length > 10);

  /* LIMMET MELLAN PARSER OCH RENDERARE (tyst bugg, 2026-08-04).
     Portföljrader är RÅA tabellrader med svenska kolumnnamn – `row["Yahoo-ticker"]`,
     inte `row.ticker`. Rutan byggde först sin innehavslista med `h.ticker`, fick
     bara `undefined`, och INNEHAV-markeringen kunde ALDRIG visas. Ingenting gick
     sönder och inget test föll: vyn såg korrekt ut och gjorde ingenting.
     Enhetstesterna missade det för att de matade renderaren med färdiga strängar –
     felet satt i limmet. Därför testas nu accessorn mot den VERKLIGA radformen. */
  const rad = { "Aktie": "Saab", "Yahoo-ticker": "SAAB-B.ST", "Börs": "Nasdaq Stockholm" };
  ok("ticker ur portföljrad: svenskt kolumnnamn", VP.tickerOfRow(rad) === "SAAB-B.ST");
  ok("ticker ur portföljrad: gemener normaliseras", VP.tickerOfRow({ ticker: "amzn" }) === "AMZN");
  ok("ticker ur portföljrad: tom rad ger tom sträng",
     VP.tickerOfRow(null) === "" && VP.tickerOfRow({}) === "");
  ok("holdingTickers: plockar alla och filtrerar tomma",
     VP.holdingTickers({ holdings: [rad, {}, { "Yahoo-ticker": "AMZN" }] }).join() === "SAAB-B.ST,AMZN");
  ok("holdingTickers: tål saknad portfölj",
     VP.holdingTickers(null).length === 0 && VP.holdingTickers({}).length === 0);
  // Änden-till-änden: rad ur portföljen -> markerad i rapportrutan.
  ok("rapportrad: portföljrad ger INNEHAV-tagg", VR.renderEarningsSoon(
     { upcoming: [{ symbol: "SAAB-B.ST", date: "2026-08-06", tradingDaysAway: 1 }] },
     VP.holdingTickers({ holdings: [rad] })).includes('class="er-tag"'));
}

/* ---- RAPPORTHANDEL: proxy, armar och grindar (2026-08-04) ----------------
   Funktionerna avgör om systemet får köpa på en rapportkatalysator. Ett fel i
   dem syns inte i drift – en felaktigt detekterad "rapportdag" ger bara en
   kandidat som ser rimlig ut. Därför testas kanterna, inte lyckofallet. */
{
  const BE = await mod(".github/scripts/backtest-earnings.mjs");
  // Syntetisk serie: platt på 100, sedan ett gap upp till 110 dag 30 med volymspik.
  const mk = n => Array.from({ length: n }, (_, i) => ({
    d: "2026-01-" + String(i + 1).padStart(2, "0"), o: 100, h: 101, l: 99, c: 100, v: 1000 }));
  const c = mk(60);
  c[30] = { d: c[30].d, o: 110, h: 112, l: 109, c: 111, v: 5000 };
  const evs = BE.detectEventDays(c, { gapMin: 0.04, volMin: 1.5, minSpacing: 40 });
  ok("earnings: gap + volymspik detekteras", evs.length === 1 && evs[0].i === 30);
  ok("earnings: gapPct räknas mot föregående stängning", Math.abs(evs[0].gapPct - 0.10) < 1e-9);

  // Volymvillkoret måste bita: samma gap utan spik är ingen rapportdag.
  const c2 = c.map(x => Object.assign({}, x));
  c2[30] = Object.assign({}, c2[30], { v: 1000 });
  ok("earnings: gap utan volymspik avvisas", BE.detectEventDays(c2, { gapMin: 0.04, volMin: 1.5 }).length === 0);

  // Saknad volymdata (index) får aldrig slinka igenom på enbart gap.
  const c3 = c.map(x => Object.assign({}, x, { v: null }));
  ok("earnings: utan volymdata detekteras ingenting", BE.detectEventDays(c3, { gapMin: 0.04, volMin: 1.5 }).length === 0);

  // gapMin 0 = riktningsblind mängd (PRE-armarnas mängd, utan look-ahead).
  ok("earnings: gapMin 0 detekterar på enbart volym",
     BE.detectEventDays(c, { gapMin: 0, volMin: 1.5, minSpacing: 40 }).length === 1);

  // minSpacing ska hålla kvartalstakt – två spikar nära varandra ger EN händelse.
  const c4 = mk(60);
  c4[30] = { d: c4[30].d, o: 110, h: 112, l: 109, c: 111, v: 5000 };
  c4[35] = { d: c4[35].d, o: 122, h: 124, l: 120, c: 123, v: 5000 };
  ok("earnings: minSpacing dedupear kvartalstakt",
     BE.detectEventDays(c4, { gapMin: 0.04, volMin: 1.5, minSpacing: 40 }).length === 1);

  // PRE: köp stängning dagen före, sälj stängning på reaktionsdagen.
  const pre = BE.preEarningsTrade(c, evs[0], 0.25);
  ok("earnings: PRE räknar c[i-1] -> c[i] netto",
     Math.abs(pre.grossPct - 11) < 1e-9 && Math.abs(pre.retPct - 10.75) < 1e-9);

  // PEAD tar bara BEKRÄFTAT POSITIVA gap – ett negativt gap får aldrig bli ett köp.
  const negEv = { i: 30, d: c[30].d, gapPct: -0.08 };
  ok("earnings: PEAD avvisar negativt gap",
     BE.peadTrade(c, negEv, { offset: 1 }) === null && BE.peadTradeAtClose(c, negEv) === null);

  /* PEAD_D0C får INTE pröva stop/mål på entry-dagens egen high/low – den dagen
     har redan inträffat när vi köper på stängningen. Serien nedan har ett djupt
     dagslägsta PÅ reaktionsdagen och lugna dagar efter: en korrekt implementation
     stoppas inte ut, en look-ahead-buggig gör det. */
  const c5 = mk(60);
  c5[30] = { d: c5[30].d, o: 110, h: 112, l: 50, c: 111, v: 5000 };
  for (let i = 31; i < 60; i++) c5[i] = { d: c5[i].d, o: 111, h: 112, l: 110, c: 111, v: 1000 };
  const d0c = BE.peadTradeAtClose(c5, { i: 30, d: c5[30].d, gapPct: 0.10 },
                                  { stopPct: 0.055, targetPct: 0.16, holdDays: 20 });
  ok("earnings: PEAD_D0C prövar inte entry-dagens egen low (look-ahead)", d0c.reason === "horisont");

  /* OMOGNA AFFÄRER FÅR ALDRIG RÄKNAS (bugg hittad 2026-08-04).
     Ligger händelsen närmare seriens slut än horisonten hinner affären aldrig
     få sitt utfall. Före rättningen returnerades en affär med `days: 0` och
     retPct = −kostnaden, vilket drog alla medelvärden mot noll – exakt det
     decision_eval.mjs förbjuder. Men en affär som HUNNIT träffa stop eller mål
     är färdig och ska räknas, hur lite serie som än återstår. */
  const cEnd = mk(40);
  cEnd[39] = { d: cEnd[39].d, o: 110, h: 112, l: 109, c: 111, v: 5000 };
  const evEnd = { i: 39, d: cEnd[39].d, gapPct: 0.10 };
  ok("earnings: omogen affär på sista candlen räknas inte (D0C)",
     BE.peadTradeAtClose(cEnd, evEnd, { stopPct: 0.055, targetPct: 0.16, holdDays: 25 }) === null);
  ok("earnings: omogen affär på sista candlen räknas inte (D0)",
     BE.peadTrade(cEnd, evEnd, { offset: 0, stopPct: 0.055, targetPct: 0.16, holdDays: 25 }) === null);
  // Stop träffad nära seriens slut = FÄRDIG affär, ska räknas.
  const cStop = mk(40);
  cStop[35] = { d: cStop[35].d, o: 110, h: 112, l: 109, c: 111, v: 5000 };
  for (let i = 36; i < 40; i++) cStop[i] = { d: cStop[i].d, o: 90, h: 91, l: 89, c: 90, v: 1000 };
  const stopped = BE.peadTradeAtClose(cStop, { i: 35, d: cStop[35].d, gapPct: 0.10 },
                                     { stopPct: 0.055, targetPct: 0.16, holdDays: 25 });
  ok("earnings: stop träffad nära seriens slut är en färdig affär", stopped && stopped.reason === "stop-gap");

  // summarize: under minN uttalar sig inte, precis som decision_eval.
  const sFew = BE.summarize(Array.from({ length: 5 }, () => ({ retPct: 1, days: 1 })), 20);
  ok("earnings: under minN säger summarize 'insufficient'", sFew.insufficient === true && sFew.missing === 15);
  /* Vänstersvansen är det som avgör hävstångsfrågan. 20 affärer ⇒ decilen är de
     2 sämsta: här −20 och −12, alltså medel −16. Andelen ≤ −10 % blir 2/20 = 10 %. */
  const sMany = BE.summarize(Array.from({ length: 20 }, (_, i) =>
    ({ retPct: i === 0 ? -20 : i === 1 ? -12 : 1, days: 1, alphaPct: 0.5 })), 20);
  ok("earnings: vänstersvansen redovisas för hävstångsfrågan",
     sMany.shareBelowMinus10 === 10 && sMany.worstDecileMeanPct === -16);

  // Regimgrinden: saknas underlag ska den vara AV (strängare vid osäkerhet).
  const bench = Array.from({ length: 10 }, (_, i) => ({ d: "2026-01-1" + i, c: 100 }));
  ok("earnings: regimgrind utan MA-underlag är AV", BE.makeRegimeGate(bench, 200)("2026-01-15") === false);
  ok("earnings: utan regimMa släpps allt igenom", BE.makeRegimeGate(bench, 0)("2026-01-15") === true);
}

/* ---- RAPPORTKALENDER (2026-08-04) --------------------------------------- */
{
  const EC = await mod(".github/scripts/earnings-calendar.mjs");
  const j = { quoteSummary: { result: [{ calendarEvents: { earnings: {
    earningsDate: [{ raw: 1793649600, fmt: "2026-11-02" }],
    isEarningsDateEstimate: true,
    earningsAverage: { raw: 0.41 }, revenueAverage: { raw: 2171235880 } } } }] } };
  const parsed = EC.parseCalendarEvents(j, "PLTR");
  ok("kalender: datum och konsensus plockas ut",
     parsed.date === "2026-11-02" && parsed.epsConsensus === 0.41);
  /* isEstimate MÅSTE överleva parsningen. Ett gissat datum duger för att säkra en
     kurs i förväg men får aldrig behandlas som en bekräftad binär händelse. */
  ok("kalender: isEstimate bevaras", parsed.isEstimate === true);
  ok("kalender: saknad modul ger null", EC.parseCalendarEvents({ quoteSummary: { result: [{}] } }, "X") === null);

  ok("kalender: handelsdagar hoppar över helgen",
     EC.tradingDaysBetween("2026-08-04", "2026-08-11") === 5);
  const up = EC.upcomingWithin([
    { symbol: "A", date: "2026-08-05" }, { symbol: "B", date: "2026-09-30" },
    { symbol: "C", date: "2026-07-01" }
  ], "2026-08-04", 10);
  ok("kalender: bara rapporter inom fönstret, passerade faller ur",
     up.length === 1 && up[0].symbol === "A" && up[0].tradingDaysAway === 1);

  // Pris-hämtaren måste tåla att kalendern saknas eller är trasig.
  ok("kalender: fetch-prices tål saknad fil", FP.collectEarningsTickers(() => "").length === 0);
  ok("kalender: fetch-prices tål trasig JSON", FP.collectEarningsTickers(() => "{trasig").length === 0);
  ok("kalender: fetch-prices plockar upcoming",
     FP.collectEarningsTickers(() => JSON.stringify({ upcoming: [{ symbol: "AMD" }, { symbol: "NVO" }] })).join() === "AMD,NVO");
}

// ---- extendedScope: vilka symboler får ett extra 1m-anrop ----
{
  const cal = { upcoming: [
    { symbol: "NVO",  tradingDaysAway: 0, isEstimate: false },
    { symbol: "RIOT", tradingDaysAway: 0, isEstimate: true  },
    { symbol: "MARA", tradingDaysAway: 2, isEstimate: false },
    { symbol: "OSSD.ST", tradingDaysAway: 9, isEstimate: false }
  ] };
  const cands = { candidates: [
    { ticker: "ANET", status: "new",      confirmed: true,  expiresAt: "2026-08-12" },
    { ticker: "AVGO", status: "new",      confirmed: false, expiresAt: "2026-08-12" },
    { ticker: "OLD",  status: "new",      confirmed: true,  expiresAt: "2026-08-01" },
    { ticker: "DONE", status: "rejected", confirmed: true,  expiresAt: "2026-08-12" }
  ] };
  const s = FP.extendedScope(cal, cands, "2026-08-05");
  ok("extendedScope tar med rapport inom 2 handelsdagar", s.includes("NVO") && s.includes("MARA"));
  ok("extendedScope tar med isEstimate (hämtning, inte beslut)", s.includes("RIOT"));
  ok("extendedScope utesluter rapport längre bort än 2 dagar", !s.includes("OSSD.ST"));
  ok("extendedScope tar med bekräftad öppen kandidat", s.includes("ANET"));
  ok("extendedScope utesluter obekräftad kandidat", !s.includes("AVGO"));
  ok("extendedScope utesluter utgången kandidat", !s.includes("OLD"));
  ok("extendedScope utesluter avgjord kandidat", !s.includes("DONE"));
  ok("extendedScope är sorterad och unik",
     JSON.stringify(s) === JSON.stringify([...new Set(s)].sort()));
  ok("extendedScope tål null-indata", FP.extendedScope(null, null, "2026-08-05").length === 0);
  ok("extendedScope tål trasiga poster",
     FP.extendedScope({ upcoming: [null, {}, { symbol: "" }] }, { candidates: [null, {}] }, "2026-08-05").length === 0);
}

// ---- parseExtended: förbörs-/efterbörspunkt ur 1m-svaret ----
{
  // reguljär session 13:30–20:00 UTC 2026-08-05 (unix-sekunder)
  const regStart = Math.floor(Date.parse("2026-08-05T13:30:00Z") / 1000);
  const regEnd   = Math.floor(Date.parse("2026-08-05T20:00:00Z") / 1000);
  const mk = (times, closes) => ({ chart: { result: [{
    meta: { currentTradingPeriod: { regular: { start: regStart, end: regEnd } } },
    timestamp: times,
    indicators: { quote: [{ close: closes }] }
  }] } });

  const preT = Math.floor(Date.parse("2026-08-05T12:58:00Z") / 1000);
  const regT = Math.floor(Date.parse("2026-08-05T14:00:00Z") / 1000);
  const postT = Math.floor(Date.parse("2026-08-05T20:30:00Z") / 1000);

  const onlyPre = FP.parseExtended(mk([preT, regT], [471.02, 480.0]));
  ok("parseExtended tar förbörspunkt när ingen efterbörs finns",
     onlyPre && onlyPre.extendedSession === "pre" && onlyPre.extendedPrice === 471.02);
  ok("parseExtended ger ISO-tidsstämpel",
     onlyPre && onlyPre.extendedTime === "2026-08-05T12:58:00.000Z");

  const withPost = FP.parseExtended(mk([preT, regT, postT], [471.02, 480.0, 492.5]));
  ok("parseExtended väljer SENASTE punkten utanför reguljär session",
     withPost && withPost.extendedSession === "post" && withPost.extendedPrice === 492.5);

  ok("parseExtended ger null när bara reguljära punkter finns",
     FP.parseExtended(mk([regT], [480.0])) === null);
  ok("parseExtended hoppar över null-close",
     FP.parseExtended(mk([preT, postT], [471.02, null])).extendedSession === "pre");
  ok("parseExtended ger null utan currentTradingPeriod",
     FP.parseExtended({ chart: { result: [{ meta: {}, timestamp: [], indicators: { quote: [{ close: [] }] } }] } }) === null);
  ok("parseExtended tål tomt svar", FP.parseExtended(null) === null);
  ok("parseExtended tål saknad indicators",
     FP.parseExtended({ chart: { result: [{ meta: { currentTradingPeriod: { regular: { start: regStart, end: regEnd } } } }] } }) === null);
}

// ---- fetchExtended: nätlagret, med injicerad fetch ----
{
  const regStart = Math.floor(Date.parse("2026-08-05T13:30:00Z") / 1000);
  const regEnd   = Math.floor(Date.parse("2026-08-05T20:00:00Z") / 1000);
  const preT     = Math.floor(Date.parse("2026-08-05T12:58:00Z") / 1000);
  const body = { chart: { result: [{
    meta: { currentTradingPeriod: { regular: { start: regStart, end: regEnd } } },
    timestamp: [preT], indicators: { quote: [{ close: [471.02] }] }
  }] } };

  let seenUrl = null;
  const okFetch = async url => { seenUrl = url; return { ok: true, json: async () => body }; };
  const ext = await FP.fetchExtended("AMD", okFetch);
  ok("fetchExtended returnerar utökad kurs", ext && ext.extendedPrice === 471.02);
  ok("fetchExtended begär 1m med includePrePost",
     /interval=1m/.test(seenUrl) && /includePrePost=true/.test(seenUrl));

  ok("fetchExtended ger null vid HTTP-fel",
     await FP.fetchExtended("AMD", async () => ({ ok: false })) === null);
  ok("fetchExtended ger null när fetch kastar",
     await FP.fetchExtended("AMD", async () => { throw new Error("nät"); }) === null);
  ok("fetchExtended ger null när svaret saknar utökad punkt",
     await FP.fetchExtended("AMD", async () => ({ ok: true, json: async () => ({
       chart: { result: [{ meta: { currentTradingPeriod: { regular: { start: regStart, end: regEnd } } },
       timestamp: [], indicators: { quote: [{ close: [] }] } }] } }) })) === null);
}

// ---- kandidatfilen som tickerkälla ----
{
  const db = JSON.stringify({ candidates: [
    { ticker: "ANET",     book: "us",     status: "new",      expiresAt: "2026-08-12" },
    { ticker: "ALLEI.ST", book: "nordic", status: "new",      expiresAt: "2026-08-12" },
    { ticker: "GAMMAL",   book: "us",     status: "new",      expiresAt: "2026-08-01" },
    { ticker: "AVGJORD",  book: "us",     status: "rejected",  expiresAt: "2026-08-12" }
  ] });
  const rf = () => db;
  const us = FP.collectCandidateTickers("us", rf, "2026-08-05");
  const no = FP.collectCandidateTickers("nordic", rf, "2026-08-05");
  ok("kandidatticker hamnar i rätt bok (us)", us.includes("ANET") && !us.includes("ALLEI.ST"));
  ok("kandidatticker hamnar i rätt bok (nordic)", no.includes("ALLEI.ST") && !no.includes("ANET"));
  ok("utgången kandidat blir ingen tickerkälla", !us.includes("GAMMAL"));
  ok("avgjord kandidat blir ingen tickerkälla", !us.includes("AVGJORD"));
  ok("saknad kandidatfil ger tom lista", FP.collectCandidateTickers("us", () => "", "2026-08-05").length === 0);
  ok("trasig kandidatfil ger tom lista, inte kastat fel",
     FP.collectCandidateTickers("us", () => "{trasig", "2026-08-05").length === 0);
}

/* ---- SCOUT -> BOK-BRYGGAN (2026-08-04) ----------------------------------
   Reglerna som INTE får luckras upp: ingen promotion utan verifierad kurs,
   ingen promotion av en obekräftad katalysator, inget avgörande utan skäl. */
{
  const SC = await mod(".github/scripts/validate-scout-candidates.mjs");
  const base = {
    id: "260804-PLTR", date: "2026-08-04", ticker: "PLTR", book: "us", source: "scout",
    catalystType: "earnings", catalystDate: "2026-08-03", confirmed: true,
    thesis: "Q2 krossade, US commercial +149 %.", sourceRef: "CNBC 2026-08-03",
    price: 160.37, priceAsOf: "2026-08-04T16:13:25Z", status: "new",
    expiresAt: "2026-08-11", decidedBy: null, decidedAt: null
  };
  ok("kandidat: giltig post accepteras", SC.validateCandidate(base, 0).length === 0);

  const bad = over => SC.validateCandidate(Object.assign({}, base, over), 0).length > 0;
  ok("kandidat: uppfunnet catalystType avvisas", bad({ catalystType: "hype" }));
  ok("kandidat: okänd status avvisas", bad({ status: "kanske" }));
  ok("kandidat: kurs utan tidsstämpel är inte verifierad", bad({ priceAsOf: null }));
  ok("kandidat: 'new' får inte ha decidedBy", bad({ decidedBy: "rapport.md" }));
  ok("kandidat: avgörande utan skäl avvisas",
     bad({ status: "rejected", decidedBy: "r.md", decidedAt: "2026-08-05" }));

  // De två hårda spärrarna.
  ok("kandidat: promotion utan verifierad kurs avvisas",
     bad({ status: "promoted", price: null, priceAsOf: null, decidedBy: "r.md",
           decidedAt: "2026-08-05", decisionReason: "alla grindar håller" }));
  ok("kandidat: promotion av obekräftad katalysator avvisas",
     bad({ status: "promoted", confirmed: false, decidedBy: "r.md",
           decidedAt: "2026-08-05", decisionReason: "alla grindar håller" }));
  ok("kandidat: korrekt promotion accepteras",
     SC.validateCandidate(Object.assign({}, base, { status: "promoted", decidedBy: "r.md",
       decidedAt: "2026-08-05", decisionReason: "alla fem grindar håller, R/R 2,4" }), 0).length === 0);

  /* Tickerformat och kursrimlighet (hittat vid fuzzning 2026-08-04).
     "BRK B" och en negativ kurs accepterades tidigare – båda ger tysta fel
     längre fram: symbolen slås upp ordagrant av pris-hämtaren, och kursen
     används för att räkna stop och mål. */
  ok("kandidat: ticker med mellanslag avvisas", bad({ ticker: "BRK B" }));
  ok("kandidat: ticker i gemener avvisas", bad({ ticker: "pltr" }));
  ok("kandidat: Yahoo-format accepteras",
     !bad({ ticker: "XACT-OMXS30.ST" }) && !bad({ ticker: "BTC-USD" }) &&
     !bad({ ticker: "^GSPC" }) && !bad({ ticker: "USDSEK=X" }));
  ok("kandidat: negativ kurs avvisas", bad({ price: -5 }));
  ok("kandidat: nollkurs avvisas", bad({ price: 0 }));
  ok("kandidat: null-kurs är fortfarande tillåten", !bad({ price: null, priceAsOf: null }));

  ok("kandidat: dubblett-id fångas",
     SC.validateFile({ candidates: [base, Object.assign({}, base)] }).some(e => /dubblett/.test(e)));

  /* Tystnadskontrollen – kärnan i hela bygget. En kandidat som passerat
     expiresAt med status 'new' betyder att en bok fick ett flaggat case och
     aldrig tog ställning. Det är buggen som lät Palantir flaggas tre dagar i
     rad utan att något hände. */
  const db = { candidates: [base] };
  ok("kandidat: 'new' före expiresAt är inte stale", SC.staleCandidates(db, "2026-08-05").length === 0);
  ok("kandidat: 'new' efter expiresAt larmar", SC.staleCandidates(db, "2026-08-12").length === 1);
  ok("kandidat: avgjord kandidat larmar aldrig",
     SC.staleCandidates({ candidates: [Object.assign({}, base, { status: "rejected", decidedBy: "r.md",
       decidedAt: "2026-08-05", decisionReason: "RSI 79" })] }, "2026-08-12").length === 0);
}

/* ---- WATCHDOG: bruttolistan och kandidattystnaden ------------------------ */
{
  const WD = await mod(".github/scripts/watchdog.mjs");
  const row = (t, book) => ({ date: "2026-08-03", book, ticker: t, action: "AVVAKTA" });
  // Exakt fallet från 2026-08-03: US-boken loggade 2 rader av 16 kandidater.
  const thin = { decisions: [row("MSFT", "us"), row("JPM", "us")] };
  const pThin = WD.checkGrossList({ isoDate: "2026-08-03", isMonday: true, decisionsDb: thin });
  ok("watchdog: tunn bruttolista i LÄGE A larmar",
     pThin.length === 1 && pThin[0].key === "grosslist-us");
  const full = { decisions: Array.from({ length: 8 }, (_, i) => row("T" + i, "us")) };
  ok("watchdog: full bruttolista larmar inte",
     WD.checkGrossList({ isoDate: "2026-08-03", isMonday: true, decisionsDb: full }).length === 0);
  ok("watchdog: bruttolistan prövas bara i LÄGE A (måndag)",
     WD.checkGrossList({ isoDate: "2026-08-03", isMonday: false, decisionsDb: thin }).length === 0);
  ok("watchdog: bok utan rader dubbelrapporteras inte",
     WD.checkGrossList({ isoDate: "2026-08-03", isMonday: true, decisionsDb: { decisions: [] } }).length === 0);

  ok("watchdog: utgången kandidat larmar",
     WD.checkScoutCandidates({ candidatesDb: { candidates: [{ id: "260801-PLTR", book: "us",
       date: "2026-08-01", expiresAt: "2026-08-08", status: "new", thesis: "t" }] },
       today: "2026-08-12",
       staleFn: (d, t) => d.candidates.filter(x => x.status === "new" && x.expiresAt < t) }).length === 1);

  // ---- watchdog: kandidat utan kurs trots att post-event-kurs finns ----
  {
    const cands = { candidates: [
      { id: "260805-ANET", ticker: "ANET", book: "us", status: "new",
        catalystDate: "2026-08-04", price: null, thesis: "Q2 AMC" }
    ] };
    const withPost = { ANET: { price: 205.0, marketTime: "2026-08-05T15:23:00.000Z" } };
    const preOnly  = { ANET: { price: 190.51, marketTime: "2026-08-04T20:00:03.000Z" } };

    ok("watchdog larmar när post-event-kurs finns men kandidaten står på null",
       WD.checkCandidatePrice({ candidatesDb: cands, quotes: withPost })
         .some(p => p.key === "candidate-price"));
    ok("watchdog tiger när bara pre-event-kurs finns",
       WD.checkCandidatePrice({ candidatesDb: cands, quotes: preOnly }).length === 0);
    ok("watchdog tiger utan kandidatfil",
       WD.checkCandidatePrice({ candidatesDb: null, quotes: withPost }).length === 0);
    ok("watchdog tiger utan noteringar",
       WD.checkCandidatePrice({ candidatesDb: cands, quotes: null }).length === 0);
    ok("watchdog tiger för kandidat som redan har kurs",
       WD.checkCandidatePrice({ candidatesDb: { candidates: [Object.assign({},
         cands.candidates[0], { price: 205.0 })] }, quotes: withPost }).length === 0);
  }

  ok("watchdog: stale kalender larmar",
     WD.checkEarningsCalendar({ now: new Date("2026-08-04T12:00:00Z"), generatedAt: "2026-08-01T05:00:00Z" }).length === 1);
  ok("watchdog: färsk kalender larmar inte",
     WD.checkEarningsCalendar({ now: new Date("2026-08-04T12:00:00Z"), generatedAt: "2026-08-04T05:00:00Z" }).length === 0);
  ok("watchdog: saknat fält är bakåtkompatibelt tyst",
     WD.checkEarningsCalendar({ now: new Date("2026-08-04T12:00:00Z"), generatedAt: null }).length === 0);
  /* Ett oläsbart generatedAt måste larma: fältet FINNS men går inte att tolka,
     alltså är kalendern oövervakad. Tegs det bort blev NaN > gräns falskt och
     kontrollen tystnade – samma sorts tysta fel den ska fånga. */
  ok("watchdog: oläsbar tidsstämpel larmar",
     WD.checkEarningsCalendar({ now: new Date("2026-08-04T12:00:00Z"), generatedAt: "inte-ett-datum" }).length === 1);
}

/* ---- RAPPORTKALENDERNS FELKLASSIFICERING (2026-08-04) -------------------
   `errors` måste vara TOM i friskt läge, annars går den inte att larma på.
   Indexsleeven (SPY, XACT-OMXS30.ST) ligger i båda böckerna och plockas alltid
   upp, så utan uppdelningen hade två permanenta 404:or dolt ett verkligt fel. */
{
  const EC = await mod(".github/scripts/earnings-calendar.mjs");
  const res = (status, body) => async () => ({ ok: status >= 200 && status < 300, status,
    json: async () => body, text: async () => JSON.stringify(body) });
  const auth = { cookie: "c", crumb: "x" };
  const r404 = await EC.fetchCalendar("SPY", auth, res(404, {}));
  ok("kalender: 404 är 'gäller inte', inte ett fel", !!r404.notApplicable && !r404.error);
  ok("kalender: 401 är ett verkligt fel", (await EC.fetchCalendar("X", auth, res(401, {}))).error === "HTTP 401");
  ok("kalender: nätfel fångas", !!(await EC.fetchCalendar("X", auth, async () => { throw new Error("ECONNRESET"); })).error);

  // getCrumb måste avvisa en HTML-felsida – annars skickas skräp som crumb och
  // varje efterföljande anrop får 401 utan att orsaken syns.
  const hdr = c => ({ getSetCookie: () => c, get: () => (c[0] || null) });
  ok("kalender: HTML som crumb avvisas",
     await EC.getCrumb(async () => ({ headers: hdr(["A=1; Path=/"]), ok: true, status: 200,
       text: async () => "<html>error</html>" })) === null);
  ok("kalender: orimligt lång crumb avvisas",
     await EC.getCrumb(async () => ({ headers: hdr(["A=1"]), ok: true, status: 200,
       text: async () => "x".repeat(200) })) === null);
  ok("kalender: utan cookie ges upp",
     await EC.getCrumb(async () => ({ headers: hdr([]) })) === null);
}

// ---- refresh-candidate-prices: kandidatkurs ur post-event-kurs ----
{
  const RC = await mod(".github/scripts/refresh-candidate-prices.mjs");

  // ANET-fallet: enda kursen är den reguljära stängningen PÅ rapportdagen (AMC)
  const preEvent = { price: 190.51, marketTime: "2026-08-04T20:00:03.000Z" };
  ok("pre-event-kurs kvalificerar INTE (ANET/AMD-regressionen)",
     RC.postCatalystQuote(preEvent, "2026-08-04") === null);

  const nextDay = { price: 205.0, marketTime: "2026-08-05T15:23:00.000Z" };
  const r1 = RC.postCatalystQuote(nextDay, "2026-08-04");
  ok("reguljär kurs dagen efter kvalificerar", r1 && r1.price === 205.0 && r1.session === "regular");

  const postSame = { price: 190.51, marketTime: "2026-08-04T20:00:03.000Z",
    extendedPrice: 209.4, extendedTime: "2026-08-04T20:31:00.000Z", extendedSession: "post" };
  const r2 = RC.postCatalystQuote(postSame, "2026-08-04");
  ok("efterbörs SAMMA dag kvalificerar", r2 && r2.price === 209.4 && r2.session === "post");

  const preSame = { price: 190.51, marketTime: "2026-08-04T20:00:03.000Z",
    extendedPrice: 188.0, extendedTime: "2026-08-04T12:00:00.000Z", extendedSession: "pre" };
  ok("förbörs SAMMA dag kvalificerar INTE (före stängning)",
     RC.postCatalystQuote(preSame, "2026-08-04") === null);

  const preNext = { price: 190.51, marketTime: "2026-08-04T20:00:03.000Z",
    extendedPrice: 207.1, extendedTime: "2026-08-05T12:58:00.000Z", extendedSession: "pre" };
  const r3 = RC.postCatalystQuote(preNext, "2026-08-04");
  ok("förbörs DAGEN EFTER kvalificerar", r3 && r3.price === 207.1 && r3.session === "pre");
  ok("utökad kurs går före reguljär när båda kvalificerar",
     RC.postCatalystQuote(Object.assign({}, nextDay, {
       extendedPrice: 207.1, extendedTime: "2026-08-05T12:58:00.000Z", extendedSession: "pre"
     }), "2026-08-04").price === 207.1);
  ok("kurs <= 0 kvalificerar inte (validatorn kräver > 0)",
     RC.postCatalystQuote({ price: 0, marketTime: "2026-08-05T15:00:00.000Z" }, "2026-08-04") === null);

  // refreshCandidates
  const mkDb = () => ({ candidates: [
    { id: "260805-ANET", ticker: "ANET", status: "new", catalystDate: "2026-08-04", price: null, priceAsOf: null },
    { id: "260805-AVGO", ticker: "AVGO", status: "new", catalystDate: "2026-08-04", price: 418.16, priceAsOf: "x" },
    { id: "260805-OLD",  ticker: "OLD",  status: "rejected", catalystDate: "2026-08-04", price: null, priceAsOf: null }
  ] });
  const quotes = { ANET: nextDay, AVGO: nextDay, OLD: nextDay };

  const res = RC.refreshCandidates(mkDb(), quotes);
  ok("refresh fyller kandidat utan kurs", res.db.candidates[0].price === 205.0);
  ok("refresh sätter priceAsOf", res.db.candidates[0].priceAsOf === "2026-08-05T15:23:00.000Z");
  ok("refresh sätter priceSession", res.db.candidates[0].priceSession === "regular");
  ok("refresh rör aldrig kandidat som redan har kurs", res.db.candidates[1].price === 418.16);
  ok("refresh rör aldrig avgjord kandidat", res.db.candidates[2].price === null);
  ok("refresh rapporterar ändring", res.changed === true && res.filled.length === 1);

  ok("refresh utan kvalificerad kurs ändrar ingenting",
     RC.refreshCandidates(mkDb(), { ANET: preEvent, AVGO: preEvent, OLD: preEvent }).changed === false);
  ok("refresh tål saknad notering",
     RC.refreshCandidates(mkDb(), {}).changed === false);
  ok("refresh tål tom databas",
     RC.refreshCandidates(null, quotes).changed === false);

  // resultatet måste passera kandidatvalidatorn
  const filled = res.db.candidates[0];
  ok("ifylld kandidat har kurs > 0 och tidsstämpel",
     filled.price > 0 && typeof filled.priceAsOf === "string" && filled.priceAsOf.length > 0);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
