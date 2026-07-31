#!/usr/bin/env node
/* ============================================================
   Simuleringstest: bootar HELA dashboarden (index.html + alla
   moduler) i jsdom med mockad fetch som serverar repots RIKTIGA
   filer (rapporter, portföljer, prices.json, lessons.md …) och
   verifierar att varje vy renderas med förväntat innehåll.

   Kör:  SIM_DEPS=<mapp med node_modules som har jsdom> node tests/sim.mjs
   (jsdom behövs inte i CI – test.yml kör bara run.mjs.)
   ============================================================ */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join, relative } from "node:path";
import { createRequire } from "node:module";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const req = createRequire(process.env.SIM_DEPS ? join(process.env.SIM_DEPS, "package.json") : import.meta.url);
const { JSDOM } = req("jsdom");

let pass = 0, fail = 0;
const ok = (name, cond) => { if (cond) pass++; else { fail++; console.log("  FAIL:", name); } };

// ---- bygg fil-trädet som GitHub-API:t skulle returnera ----
function walk(dir, out = []) {
  for (const n of readdirSync(dir)) {
    if (n === ".git" || n === "node_modules") continue;
    const p = join(dir, n);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else out.push(relative(root, p).replace(/\\/g, "/"));
  }
  return out;
}
const allPaths = walk(root);

// ---- jsdom + mockad fetch ----
const html = readFileSync(resolve(root, "index.html"), "utf8")
  .replace(/<script src="https:[^"]*"><\/script>/g, "")   // inga CDN-skript i simulering
  .replace(/<script src="assets\/[^"]*"><\/script>/g, ""); // modulerna evalueras manuellt nedan

const dom = new JSDOM(html, {
  url: "https://drinaskastrati.github.io/Vecko_agent/",
  pretendToBeVisual: true,
  runScripts: "outside-only"
});
const { window } = dom;

let fetchCount = 0;
window.fetch = async (url) => {
  fetchCount++;
  url = String(url);
  if (url.includes("api.github.com")) {
    return { ok: true, status: 200, json: async () => ({ tree: allPaths.map(p => ({ path: p, type: "blob" })) }), text: async () => "" };
  }
  const m = url.match(/raw\.githubusercontent\.com\/[^/]+\/[^/]+\/[^/]+\/(.+)$/);
  if (m) {
    const p = resolve(root, decodeURIComponent(m[1]));
    if (existsSync(p)) {
      const body = readFileSync(p, "utf8");
      return { ok: true, status: 200, text: async () => body, json: async () => JSON.parse(body) };
    }
    return { ok: false, status: 404, text: async () => "", json: async () => ({}) };
  }
  return { ok: false, status: 404, text: async () => "", json: async () => ({}) };
};

// ---- ladda modulerna i samma ordning som index.html ----
for (const f of ["vparse.js", "vrender.js", "app.js"])
  window.eval(readFileSync(resolve(root, "assets", f), "utf8"));

const doc = window.document;
const dash = window.dashboard;
const txt = id => { const el = doc.getElementById(id); return el ? el.innerHTML : ""; };

// ---- vänta tills appen laddat klart ----
const t0 = Date.now();
while (doc.getElementById("statusTxt").textContent !== "Live" && Date.now() - t0 < 20000)
  await new Promise(r => setTimeout(r, 100));
// låt efterföljande async-renderingar (rapportvisare) bli klara
await new Promise(r => setTimeout(r, 600));

// ================= Verifieringar =================
ok("appen når Live-status", doc.getElementById("statusTxt").textContent === "Live");
ok("fetch mockad och använd", fetchCount > 5);

// Hem (ny startvy)
ok("hem är default-aktiv vy", doc.querySelector('.view[data-view="hem"]').classList.contains("active"));
ok("hem: nordiska boken renderad", txt("hemMain").includes("Nordisk bok"));
ok("hem: innehavskort med ticker", txt("hemMain").includes("SAAB-B.ST"));
ok("hem: statusrad med nästa körning", txt("hemStatus").includes("status-row"));
ok("hem: högerspalt med paneler", (txt("hemRail").match(/rail-card/g) || []).length >= 2);
ok("hem: aktiva lärdomar-panelen (L-1)", txt("hemRail").includes("L-1"));

// Nordisk + Total + US
ok("nordisk: KPI:er", txt("kpis").includes("Ackumulerad avkastning"));
ok("nordisk: innehav", txt("holdings").includes("hold"));
ok("total: blended", txt("totalBody").includes("Blended avkastning"));
ok("total: kapitalfördelning", txt("totalBody").includes("alloc-seg"));
ok("total: valutaupplysning", txt("totalBody").includes("exkl. valutaeffekt"));
ok("kostnader: config laddad", dash.state.costs && dash.state.costs.nordic && dash.state.costs.nordic.roundTripPct > 0);
ok("us: bok eller tomläge", txt("usBody").length > 20);

// Retro & lärdomar
ok("retro: lärdomskort L-1", txt("lessonsBody").includes("L-1"));
ok("retro: rapportväljare har retro-260731", doc.getElementById("retroSelect").innerHTML.includes("2026-07-31"));
ok("retro: rapporten renderad", txt("retroBody").length > 100);

// Avkastning
ok("avkastning: handelsstatistik", txt("tradeStats").includes("Profit factor"));
ok("avkastning: nettoavkastning efter kostnad", txt("tradeStats").includes("Netto efter kostnad"));
ok("avkastning: månadsheatmap", txt("monthly").includes("hm-cell"));
ok("avkastning: riskmått", txt("riskStats").includes("Max drawdown"));
ok("avkastning: färgkodad historik", txt("history").includes('class="pos"'));

// Kurser + nyheter + scout
ok("kurser: px-grid med tickers", txt("prices").includes("px-item"));
ok("nyheter: feed renderad", txt("feed").includes("feed"));
ok("scout: senaste rapporten", txt("scoutBody").length > 100);

// Navigering
dash.showView("kurser");
ok("navigering: kurser aktiveras", doc.querySelector('.view[data-view="kurser"]').classList.contains("active"));
ok("navigering: sidomenyn markerar aktiv", doc.querySelector('.subnav a[data-view="kurser"]').classList.contains("active"));
dash.showView("finnsinte");
ok("navigering: okänd vy faller tillbaka till hem", doc.querySelector('.view[data-view="hem"]').classList.contains("active"));

// Sidopanelen har alla 11 vyer och matchande sektioner
const navViews = [...doc.querySelectorAll(".subnav a")].map(a => a.dataset.view);
ok("sidopanel: 11 länkar", navViews.length === 11);
ok("sidopanel: varje länk har en sektion", navViews.every(v => doc.querySelector('.view[data-view="' + v + '"]')));

console.log(`\nSIM: ${pass} passed, ${fail} failed`);
window.close();
process.exit(fail ? 1 : 0);
