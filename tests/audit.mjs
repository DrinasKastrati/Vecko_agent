#!/usr/bin/env node
// Regression tests for repository audit: real writers in an isolated directory,
// production DOM methods, and failures at external-service boundaries.
import assert from "node:assert/strict";
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, readdirSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { resolve, join } from "node:path";
import { createRequire } from "node:module";
import { runInNewContext } from "node:vm";
import { readJSON, writeAtomic, hasSeries } from "../.github/scripts/state-io.mjs";
import { updatePriceHistory, updateVolumeHistory, appendPoint, prevCloseFrom } from "../.github/scripts/fetch-prices.mjs";
import { enqueue } from "../.github/scripts/queue-add.mjs";
import { run as notify } from "../.github/scripts/push-notify.mjs";
import { registerSubscription } from "../.github/scripts/push-sub-add.mjs";
import { fetchFeedText } from "../.github/scripts/fetch-news.mjs";
import { validateDecision, isAppendOnly } from "../.github/scripts/validate-decisions.mjs";
import { validateItem } from "../.github/scripts/validate-action-items.mjs";
import { evalRow, forwardReturn, withClusterCaveat } from "../.github/scripts/decision_eval.mjs";
import { latestRotationDate, checkStalePricedBubblare } from "../.github/scripts/watchdog.mjs";
import { planIssues } from "../.github/scripts/issue-sync.mjs";
import { backtestUniverse } from "../.github/scripts/backtest.mjs";
import { makeRegimeGate, runEarningsArms } from "../.github/scripts/backtest-earnings.mjs";
import { upcomingWithin, retainFailedEntries } from "../.github/scripts/earnings-calendar.mjs";
import { run as monitor } from "../.github/scripts/alerts.mjs";

const originalCwd = process.cwd();
const dir = mkdtempSync(join(tmpdir(), "vecko-audit-tests-"));
const env = { ...process.env };
let passed = 0;
async function test(name, fn){ await fn(); passed++; console.log("OK " + name); }
const save = (path, value) => writeFileSync(path, JSON.stringify(value));
try {
  process.chdir(dir);
  mkdirSync("state"); mkdirSync("config");
  await test("persisted corruption is preserved; missing files alone use defaults", () => {
    assert.deepEqual(readJSON("missing.json", []), []);
    writeFileSync("state/price_history.json", "{broken");
    assert.throws(() => updatePriceHistory({}));
    assert.equal(readFileSync("state/price_history.json", "utf8"), "{broken");
    save("state/volume_history.json", { series: [] });
    assert.throws(() => updateVolumeHistory({}));
    assert.equal(hasSeries({ series: { ABC: {} } }), false);
  });
  await test("history writers replace complete files and retain earlier observations", () => {
    save("state/price_history.json", { series: { ABC: [["2026-09-10", 10]] } });
    updatePriceHistory({ ABC: { price: 12, marketTime: "2026-09-11T15:00:00Z" } });
    assert.deepEqual(readJSON("state/price_history.json").series.ABC, [["2026-09-10", 10], ["2026-09-11", 12]]);
    assert.deepEqual(appendPoint([], "2026-09-11", Infinity), []);
    assert.equal(readdirSync("state").some(p => p.endsWith(".tmp")), false);
    mkdirSync("blocked");
    assert.throws(() => writeAtomic("blocked", "replacement"));
    assert.equal(readdirSync(".").some(p => p.endsWith(".tmp")), false);
  });
  await test("queue rejects corruption before watchlist mutation; reruns are idempotent", () => {
    writeFileSync("config/watchlist.txt", "OLD.ST\n");
    writeFileSync("state/analysis_queue.json", "{broken");
    assert.throws(() => enqueue("ABC.ST"));
    assert.equal(readFileSync("config/watchlist.txt", "utf8"), "OLD.ST\n");
    save("state/analysis_queue.json", { pending: [], done: [{ ticker: "OLD.ST" }] });
    assert.throws(() => enqueue("ABC<script>"));
    enqueue("XACT-OMXS30.ST", "123"); enqueue("XACT-OMXS30.ST", "123");
    const q = readJSON("state/analysis_queue.json");
    assert.equal(q.pending.length, 1); assert.equal(q.done.length, 1);
  });
  await test("subscription registration preserves corrupt state and deduplicates reruns", () => {
    const body = JSON.stringify({ endpoint: "https://example.com/device", keys: {
      p256dh: Buffer.alloc(65).toString("base64url"), auth: Buffer.alloc(16).toString("base64url") } });
    save("state/push_subs.json", {});
    assert.throws(() => registerSubscription(body));
    assert.equal(readFileSync("state/push_subs.json", "utf8"), "{}");
    save("state/push_subs.json", { subscriptions: [] });
    registerSubscription(body); registerSubscription(body);
    assert.equal(readJSON("state/push_subs.json").subscriptions.length, 1);
  });
  await test("push retries failed devices without repeating successful deliveries", async () => {
    process.env.VAPID_PRIVATE_KEY = "test-only";
    process.env.VAPID_PUBLIC_KEY = "test-only";
    delete process.env.PUSH_SUBSCRIPTIONS;
    save("state/push_subs.json", { subscriptions: ["a", "b"].map(id => ({ endpoint: "https://example.com/" + id, keys: { p256dh: "test", auth: "test" } })) });
    save("state/push_sent.json", { keys: [] });
    save("state/alerts.json", { active: [{ ticker: "ABC", type: "KÖP", reason: "entry", level: 10 }] });
    save("state/decisions.json", { decisions: [] });
    const calls = [];
    const first = await notify([], async sub => { calls.push(sub.endpoint); return { ok: sub.endpoint.endsWith("a"), status: 503 }; });
    assert.equal(first.failed, 1); assert.equal(readJSON("state/push_sent.json").keys.length, 0);
    const second = await notify([], async sub => { calls.push(sub.endpoint); return { ok: true }; });
    assert.equal(second.sent, 1); assert.equal(calls.filter(x => x.endsWith("a")).length, 1);
    assert.equal(readJSON("state/push_sent.json").keys.length, 1);
    await notify([], async () => { throw Error("must not repeat"); });
    rmSync("state/push_sent.json");
    assert.equal((await notify([], async () => { throw Error("must seed only"); })).firstRun, true);
  });
  await test("RSS deadline includes a body that stalls after successful headers", async () => {
    const res = await fetchFeedText("https://example.com/feed", { retries: 0, timeoutMs: 20,
      fetchImpl: async (_, { signal }) => ({ ok: true, text: () => new Promise((_, reject) => {
        signal.addEventListener("abort", () => reject(Error("body aborted")), { once: true });
      }) }) });
    assert.equal(res.ok, false); assert.match(res.status, /body aborted/);
  });
  await test("quote outages cannot expire active monitor signals", async () => {
    const previous = readFileSync("state/alerts.json", "utf8");
    writeFileSync("state/portfolj.md", "## Aktuellt innehav\n| Aktie | Yahoo-ticker | Entry | Stop-loss | Målkurs |\n|---|---|---|---|---|\n| ABC | ABC | 10 | 9 | 12 |\n");
    await assert.rejects(monitor(async () => ({ ok: false, status: 503 })), /previous signals retained/);
    assert.equal(readFileSync("state/alerts.json", "utf8"), previous);
  });
  await test("decision validation enforces price and calendar contracts", () => {
    const row = { date: "2026-09-14", book: "us", mode: "A", ticker: "ABC", action: "KÖP", price: 10,
      weight: null, entry: null, stop: null, target: null, rr: null, rsi: null, reason: "test" };
    assert.deepEqual(validateDecision(row, 0), []);
    for (const price of [null, 0, -1]) assert.ok(validateDecision({ ...row, price }, 0).length);
    assert.ok(validateDecision({ ...row, date: "2026-02-30" }, 0).length);
    const action = { id: "date-check", title: "Check dates", file: null, scope: "1 validator",
      firstSeen: "2026-09-01", lastSeen: "2026-09-14", weeksOpen: 2, status: "open", resolvedAt: null, resolvedBy: null };
    assert.deepEqual(validateItem(action, 0), []);
    assert.ok(validateItem({ ...action, firstSeen: "2026-02-30" }, 0).some(e => /firstSeen/.test(e)));
    assert.equal(isAppendOnly([{ a: 1, b: 2 }], [{ b: 2, a: 1 }]), true);
    assert.equal(isAppendOnly(undefined, []), false);
  });
  await test("alpha uses identical endpoints and never reanchors expired history", () => {
    const stock = [["2026-09-07", 100], ["2026-09-08", 110], ["2026-09-10", 120]];
    const bench = [["2026-09-07", 100], ["2026-09-08", 101], ["2026-09-09", 102], ["2026-09-10", 103]];
    const row = { date: "2026-09-07", ticker: "ABC", book: "us", action: "KÖP" };
    assert.equal(evalRow(row, t => t === "ABC" ? stock : bench, [2]).fwd[2].alphaPct, 17);
    assert.equal(evalRow(row, t => t === "ABC" ? stock : bench.slice(0, 3), [2]).fwd[2].alphaPct, null);
    assert.equal(forwardReturn(stock, "2026-08-01", 1), null);
    assert.equal(prevCloseFrom({ meta: { chartPreviousClose: 80 } }), null);
    assert.equal(prevCloseFrom({ indicators: { quote: [{ close: [100, Infinity, 110] }] } }), 100);
    const rows = ["KÖP", "AVVAKTA", "BEHÅLL"].flatMap(action => Array.from({ length: 8 }, (_, i) => ({ action,
      date: action === "KÖP" ? "2026-01-01" : `2026-${String(i + 1).padStart(2, "0")}-01`, fwd: { 5: { alphaPct: 1 } } })));
    assert.equal(withClusterCaveat({}, rows, 5, null).effectiveN, 1);
  });
  await test("watchdog checks after the US deadline and preserves outstanding Monday failures", () => {
    assert.equal(latestRotationDate(new Date("2026-09-14T10:30:00Z")), "2026-09-07");
    assert.equal(latestRotationDate(new Date("2026-09-14T14:30:00Z")), "2026-09-14");
    assert.equal(latestRotationDate(new Date("2026-09-15T10:30:00Z")), "2026-09-14");
    assert.equal(planIssues([], [{ key: "x" }, { key: "x" }], "watchdog").open.length, 1);
    const result = checkStalePricedBubblare({ weeklyMd: "## Bubblare\n1. **ABC (ABC.ST)** – test", weeklyDate: "2026-09-07",
      book: "nordic", quotes: { "ABC.ST": { price: 10 } }, decisionsDb: { decisions: [{ date: "2026-09-08", ticker: "ABC.ST", book: "us" }] } });
    assert.equal(result[0].key, "bubblare-price-nordic");
  });
  await test("backtests require historical MA data and cannot see the entry-day close", () => {
    const stock = Array.from({ length: 22 }, (_, i) => ({ d: new Date(Date.UTC(2026, 7, 3 + i)).toISOString().slice(0, 10),
      o: 100 + i, h: 101 + i, l: 99 + i, c: 100 + i }));
    const bench = stock.map((c, i) => ({ ...c, o: 100, h: 200, l: 99, c: i === 21 ? 200 : 100 }));
    const options = { lookback: 5, topN: 1, weight: 1, regimeMa: 3, benchCandles: bench };
    assert.equal(backtestUniverse({ ABC: stock }, options).trades, 0);
    assert.equal(backtestUniverse({ ABC: stock }, { ...options, benchCandles: null }).trades, 0);
    assert.equal(makeRegimeGate([], 200)("2026-09-14"), false);
    const candles = Array.from({ length: 80 }, (_, i) => ({ d: new Date(Date.UTC(2026, 0, 1 + i)).toISOString().slice(0, 10),
      o: 100, h: 101, l: 99, c: 100, v: 100 }));
    Object.assign(candles[45], { o: 110, h: 113, l: 109, c: 112, v: 1000 });
    const mid = candles[45].d;
    assert.equal(runEarningsArms({ ABC: candles }).events, 1);
    assert.equal(runEarningsArms({ ABC: candles }, { before: mid }).events, 0);
    assert.equal(runEarningsArms({ ABC: candles }, { from: mid }).events, 1);
    const regimeBench = candles.map((c, i) => ({ ...c, c: i === 45 ? 200 : 100 }));
    const gated = runEarningsArms({ ABC: candles }, { regimeMa: 3, benchCandles: regimeBench });
    assert.equal(gated.arms.PRE_ALL.length, 0);
    assert.equal(gated.arms.PEAD_D0.length, 0);
    assert.equal(gated.arms.PEAD_D0C.length, 1);
    assert.equal(gated.arms.PEAD_D1.length, 1);
  });
  await test("earnings failures retain known dates; weekend filtering and countdowns stay current", () => {
    const previous = { generatedAt: "2026-09-10T08:00:00Z", all: [{ symbol: "ABC", date: "2026-09-15", isEstimate: true, tradingDaysAway: 5 }] };
    const kept = retainFailedEntries(previous, { ABC: "HTTP 503" }, "2026-09-14");
    assert.equal(kept[0].isEstimate, true); assert.equal(kept[0].lastVerifiedAt, previous.generatedAt);
    assert.equal(upcomingWithin(kept, "2026-09-14")[0].tradingDaysAway, 1);
    assert.equal(upcomingWithin([{ date: "2026-09-11", symbol: "OLD" }], "2026-09-12").length, 0);
  });
  process.chdir(originalCwd);
  await test("all main writers share a durable queue and check out current main", () => {
    for (const name of ["analys_queue", "auto_merge", "dashboard", "monitor", "movers", "news", "prices", "push_subscribe"]) {
      const workflow = readFileSync(resolve(originalCwd, ".github/workflows", name + ".yml"), "utf8");
      assert.match(workflow, /concurrency:\s+group: state-main-writer\s+queue: max\s+cancel-in-progress: false/, name);
      assert.match(workflow, /uses: actions\/checkout@v4\s+with:\s+ref: main/, name);
      assert.ok(!workflow.includes("-X theirs"), name);
    }
  });
  await test("service worker registers cache lifetime during dispatch and retains other caches", async () => {
    const handlers = {}, deleted = [];
    let finishWrite, response, lifetime, dispatching = false;
    const worker = {
      self: { addEventListener: (name, fn) => { handlers[name] = fn; }, clients: { claim: async () => {} } },
      URL, Promise,
      caches: {
        keys: async () => ["other-app-v1", "vecko-agent-v7", "vecko-agent-v8"],
        delete: async key => { deleted.push(key); },
        match: async () => undefined,
        open: async () => ({ put: () => new Promise(resolve => { finishWrite = resolve; }) })
      },
      fetch: async () => ({ ok: true, clone: () => ({}) })
    };
    runInNewContext(readFileSync(resolve(originalCwd, "sw.js"), "utf8"), worker);
    handlers.activate({ waitUntil: p => { lifetime = p; } });
    await lifetime;
    assert.deepEqual(deleted, ["vecko-agent-v7"]);
    for (const url of ["https://example.com/assets/app.js", "https://cdn.jsdelivr.net/npm/chart.js@4.4.3"]) {
      response = lifetime = undefined;
      dispatching = true;
      handlers.fetch({ request: { url, method: "GET" }, respondWith: p => { response = p; },
        waitUntil: p => { assert.equal(dispatching, true); lifetime = p; } });
      dispatching = false;
      assert.ok(lifetime);
      await response;
      let settled = false;
      lifetime.then(() => { settled = true; });
      await Promise.resolve();
      assert.equal(settled, false);
      finishWrite(); await lifetime;
    }
  });
  await test("production DOM, local fills, current decisions and report request ordering", async () => {
    const req = createRequire(process.env.SIM_DEPS ? join(process.env.SIM_DEPS, "package.json") : import.meta.url);
    const { JSDOM } = req("jsdom");
    const dom = new JSDOM('<div class="view" data-view="hem"></div><div id="reportBody"></div><a id="ghLink"></a><input id="rawToggle"><div id="reportRail"></div>', { url: "https://example.com/#%22", runScripts: "outside-only" });
    const w = dom.window;
    Object.defineProperty(w.document, "readyState", { value: "loading" });
    for (const f of ["fills.js", "vparse.js", "vrender.js", "app.js"]) w.eval(readFileSync(resolve(originalCwd, "assets", f), "utf8"));
    // Prevent auto-boot while exercising the real methods directly.
    w.dashboard.boot = () => {};
    const clean = w.dashboard.sanitize('<a href="java&#10;script:alert(1)">x</a><svg><a href="javascript:x">x</a></svg><base href="https://evil.example"><p id="app" onclick="x" style="color:red">safe</p><a href="https://example.com">link</a><img src="data:text/html,x">');
    const t = w.document.createElement("template"); t.innerHTML = clean;
    assert.equal(t.content.querySelector("svg,base,[onclick],[id],[style]"), null);
    assert.equal(t.content.querySelector("a").hasAttribute("href"), false);
    assert.equal(t.content.querySelector("img").hasAttribute("src"), false);
    assert.equal(t.content.querySelector("a[href]").rel, "noopener noreferrer");
    assert.doesNotThrow(() => w.dashboard.initNav());
    assert.ok(!w.VRender.renderSimple({ actions: [{ decision: "AVVAKTA", why: '<img src=x onerror="x">' }] }).includes("<img"));
    assert.equal(w.VParse.firstNumberPct("−1,5 %"), -1.5);
    assert.equal(w.VParse.parsePortfolio("### Pending\nInga planer.\n## Historik\n| Aktie | Entry |\n|---|---|\n| OLD | 10 |\n").pending.length, 0);
    const series = w.VParse.buildReturnSeries([
      { meta: { sortKey: 1 }, dateISO: "2026-07-01", facit: { accum: 6 } },
      { meta: { sortKey: 2 }, dateISO: "2026-09-01", facit: { accum: null } }
    ], null, "2026-08-10");
    assert.equal(series.length, 0);
    const F = w.VFills;
    w.localStorage.setItem(F.KEY, "{broken");
    assert.throws(() => F.setKop("ABC|2026-09-01", { kurs: 10, antal: 10 }));
    assert.equal(w.localStorage.getItem(F.KEY), "{broken");
    w.localStorage.removeItem(F.KEY);
    F.setTrade("ABC|2026-09-01", { kop: { kurs: 10, antal: 10 }, salj: { kurs: 12, antal: 5 } });
    assert.equal(F.computeMyStats(F.all(), [{ "Aktie": "ABC (ABC)", "Entry-datum": "2026-09-01" }], "us", 0).avkastningPct, null);
    const saved = w.localStorage.getItem(F.KEY);
    w.Storage.prototype.setItem = () => { throw Error("quota exceeded"); };
    assert.throws(() => F.setTrade("NEW|2026-09-14", {}));
    assert.equal(w.localStorage.getItem(F.KEY), saved);
    const S = w.dashboard.state;
    S.portfolio = { accum: 10, holdings: [] }; S.portfolioUs = { accum: 0, holdings: [] };
    S.allocation = { nordic: 0.7 };
    S.dailies = [{ dateISO: "2026-09-11", holdings: [{ ticker: "OLD", decision: "KÖP" }] }];
    S.decisions = { decisions: [{ book: "nordic", ticker: "NEW", date: "2026-09-14", action: "KÖP", reason: "Monday rotation" }] };
    const model = w.dashboard.simpleModel(new Date("2026-09-14T14:00:00Z"));
    assert.equal(model.actions.length, 1); assert.equal(model.actions[0].ticker, "NEW");
    assert.equal(model.totalAccum, 7); assert.equal(model.stale, true);
    S.metas = [{ name: "old", path: "old.md", type: "daily" }, { name: "new", path: "new.md", type: "daily" }];
    const pending = {};
    w.dashboard.getMd = path => new Promise(resolve => { pending[path] = resolve; });
    w.dashboard.ensureMarked = async () => {};
    w.dashboard.buildReportRail = () => {};
    const oldRequest = w.dashboard.showReport("old"), newRequest = w.dashboard.showReport("new");
    pending["new.md"]("NEW"); await newRequest;
    pending["old.md"]("OLD"); await oldRequest;
    assert.equal(w.document.getElementById("reportBody").dataset.raw, "NEW");
    assert.match(w.document.getElementById("reportBody").textContent, /NEW/);
    const select = w.document.createElement("select"); select.id = "reportSelect"; w.document.body.append(select);
    const outdated = w.dashboard.showReport("old");
    S.reportType = "scout";
    w.dashboard.setupReportPicker();
    pending["old.md"]("OLD"); await outdated;
    assert.match(w.document.getElementById("reportBody").textContent, /Inga rapporter/);
    assert.equal(w.document.getElementById("reportBody").dataset.raw, undefined);
    dom.window.close();
  });
} finally {
  process.chdir(originalCwd);
  for (const k of Object.keys(process.env)) if (!(k in env)) delete process.env[k];
  Object.assign(process.env, env);
  rmSync(dir, { recursive: true, force: true });
}
console.log(`${passed} audit regression groups passed.`);
