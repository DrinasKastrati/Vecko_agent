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
ok("alla backfyllda rader är märkta med source",
  dec.decisions.filter(r => r.source === "backfill-260731").length === dec.decisions.length);

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
ok("backtestUniverse syntetiskt universum", (() => {
  const dts = []; let dt = new Date("2026-01-05T12:00:00Z");
  while (dts.length < 40){ const dow = dt.getUTCDay(); if (dow >= 1 && dow <= 5) dts.push(dt.toISOString().slice(0, 10)); dt = new Date(+dt + 86400e3); }
  const up = dts.map((dd, i) => ({ d: dd, o: 100 + i, h: 101.2 + i, l: 99 + i, c: 100.5 + i }));
  const bt = BT.backtestUniverse({ X: up }, { lookback: 5, stopPct: 0.05, targetPct: 0.10, holdDays: 5, topN: 2 });
  return bt && bt.weeks >= 4 && bt.trades >= 4 && bt.winRate === 1 && bt.chainedPct > 0 && bt.maxDrawdownPct === 0;
})());
ok("buyHoldPct", Math.abs(BT.buyHoldPct([{ c: 100 }, { c: 110 }]) - 10) < 1e-9 && BT.buyHoldPct([]) === null);

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
