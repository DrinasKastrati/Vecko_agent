#!/usr/bin/env node
/* ============================================================
   Enkel testsvit för de rena funktionerna i webbappen + pris-
   hämtaren. Kör: node tests/run.mjs   (kräver ingen nätåtkomst)
   ============================================================ */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
globalThis.window = {};
const load = f => new Function("window", readFileSync(resolve(root, "assets", f), "utf8"))(globalThis.window);
load("vparse.js"); load("vrender.js");
const VP = globalThis.window.VParse, VR = globalThis.window.VRender;
const FP = await import(resolve(root, ".github/scripts/fetch-prices.mjs"));

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
const AL = await import(resolve(root, ".github/scripts/alerts.mjs"));
const hist = AL.mergeHistory(
  { active: [{ ticker: "ALLEI.ST", type: "KÖP", reason: "entry-villkor uppfyllt", level: 97 }], history: [] },
  [], "2026-07-16T10:00:00Z");
ok("mergeHistory expires", hist.length === 1 && hist[0].expiredAt === "2026-07-16T10:00:00Z" && hist[0].ticker === "ALLEI.ST");
ok("mergeHistory keeps active", AL.mergeHistory({ active: [{ ticker: "X", type: "SÄLJ" }] }, [{ ticker: "X", type: "SÄLJ" }], "t").length === 0);
ok("mergeHistory cap", AL.mergeHistory({ active: [], history: Array.from({ length: 60 }, (_, i) => ({ ticker: "T" + i, type: "KÖP" })) }, [], "t").length === 50);
ok("renderAlerts history", VR.renderAlerts({ active: [], history: hist }).includes("Tidigare signaler"));
ok("renderAlerts empty still empty", VR.renderAlerts({ active: [], history: [] }) === "");

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

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
