#!/usr/bin/env node
/* ============================================================
   Kontroll av datalagret: bevisar att webbappen tar den FÖRBYGGDA
   vägen (state/dashboard.json) och att fallbacken till live-hämtning
   fortfarande fungerar när filen saknas.

   Testet finns för att skillnaden är osynlig i tests/sim.mjs: den
   renderar likadant oavsett väg, så en trasig förbyggd väg skulle
   passera obemärkt och bara visa sig som 60 nätanrop i produktion.

   Mäter också antalet hämtningar per väg – det är hela poängen med
   ändringen, så det är värt att regressionstesta.

   Kör:  SIM_DEPS=<mapp med node_modules som har jsdom> node tests/data.mjs
   (kräver jsdom, som tests/sim.mjs – hoppas över när den saknas)
   ============================================================ */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join, relative } from "node:path";
import { createRequire } from "node:module";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
let JSDOM = null;
try {
  const req = createRequire(process.env.SIM_DEPS ? join(process.env.SIM_DEPS, "package.json") : import.meta.url);
  JSDOM = req("jsdom").JSDOM;
} catch { console.log("  (hoppar över – jsdom saknas)"); process.exit(0); }

let pass = 0, fail = 0;
const ok = (name, cond) => { if (cond) pass++; else { fail++; console.log("  FAIL:", name); } };

function walk(dir, out = []) {
  for (const n of readdirSync(dir)) {
    if (n === ".git" || n === "node_modules") continue;
    const p = join(dir, n);
    if (statSync(p).isDirectory()) walk(p, out);
    else out.push(relative(root, p).replace(/\\/g, "/"));
  }
  return out;
}
const allPaths = walk(root);

const html = readFileSync(resolve(root, "index.html"), "utf8")
  .replace(/<script src="https:[^"]*"><\/script>/g, "")
  .replace(/<script src="assets\/[^"]*"><\/script>/g, "");

/* Bootar appen med mockad fetch. `hide` är en lista med sökvägar som ska
   svara 404, så vi kan simulera "dashboard.json finns inte än". */
async function boot(hide = []) {
  const dom = new JSDOM(html, {
    url: "https://drinaskastrati.github.io/Vecko_agent/",
    pretendToBeVisual: true, runScripts: "outside-only"
  });
  const { window } = dom;
  const req = { total: 0, tree: 0, raw: [], md: 0 };
  window.fetch = async (url) => {
    req.total++;
    url = String(url);
    if (url.includes("api.github.com")) {
      req.tree++;
      return { ok: true, status: 200, json: async () => ({ tree: allPaths.map(p => ({ path: p, type: "blob" })) }), text: async () => "" };
    }
    const m = url.match(/raw\.githubusercontent\.com\/[^/]+\/[^/]+\/[^/]+\/(.+)$/);
    if (!m) return { ok: false, status: 404, text: async () => "", json: async () => ({}) };
    const rel = decodeURIComponent(m[1]);
    req.raw.push(rel);
    if (rel.endsWith(".md")) req.md++;
    if (hide.includes(rel)) return { ok: false, status: 404, text: async () => "", json: async () => ({}) };
    const p = resolve(root, rel);
    if (!existsSync(p)) return { ok: false, status: 404, text: async () => "", json: async () => ({}) };
    const body = readFileSync(p, "utf8");
    return { ok: true, status: 200, text: async () => body, json: async () => JSON.parse(body) };
  };
  window.matchMedia = window.matchMedia || (() => ({ matches: false, addEventListener() {}, removeEventListener() {} }));
  for (const f of ["vparse.js", "vrender.js", "app.js"])
    window.eval(readFileSync(resolve(root, "assets", f), "utf8"));
  const dash = window.dashboard;
  await dash.load(true);
  return { window, dash, req };
}

// ================= 1. förbyggda vägen =================
const A = await boot();
ok("förbyggd: statusen blir Live", A.window.document.getElementById("statusTxt").textContent === "Live");
ok("förbyggd: vägen togs (_prebuiltAt satt)", !!A.dash._prebuiltAt);
ok("förbyggd: INGET filträd hämtades", A.req.tree === 0);
/* Några markdown-hämtningar sker ändå, och de är avsiktliga: rapportväljarna
   i Rapporter/US/Retro visar en vald rapport direkt, och själva rapporttexten
   ligger inte i dashboard.json (den skulle fyrdubbla filen). Det som SKA vara
   borta är MASSHÄMTNINGEN av alla rapporter för att bygga upp vyerna. */
ok(`förbyggd: ingen masshämtning av markdown (blev ${A.req.md}, fallback ~84)`, A.req.md < 10);
ok(`förbyggd: högst 30 hämtningar totalt (blev ${A.req.total})`, A.req.total <= 30);
ok("förbyggd: dashboard.json hämtades", A.req.raw.includes("state/dashboard.json"));

const S = A.dash.state;
ok("förbyggd: metas fyllda", S.metas.length > 20);
ok("förbyggd: portföljen parsad", !!S.portfolio && Array.isArray(S.portfolio.holdings));
ok("förbyggd: dagliga rapporter parsade", S.dailies.length > 0 && !!S.dailies[0].dateISO);
ok("förbyggd: veckorapporter parsade", S.weeklies.length > 0);
ok("förbyggd: scout parsad", S.scouts.length > 0);
ok("förbyggd: lärdomar parsade", !!S.lessons);
ok("förbyggd: kurser hämtade live", !!S.prices);
ok("förbyggd: nyhetsflödet byggt", !!S.feed);
/* Kandidatkön och rapportkalendern hämtas DIREKT (inte ur dashboard.json) och
   måste därför fungera i BÅDA laddningsvägarna. Det är hela poängen med den här
   filen: fallback-vägen används i fönstret mellan att en routine pushat och att
   dashboard.yml kört, och en fil som bara kopplats i den ena vägen blir tom
   precis då utan att något går sönder. */
ok("förbyggd: kandidatkön hämtad", A.req.raw.includes("state/scout_candidates.json"));
ok("förbyggd: rapportkalendern hämtad", A.req.raw.includes("state/earnings_calendar.json"));
ok("förbyggd: kandidatrutan renderad",
   A.window.document.getElementById("candidates").innerHTML.length > 40);
ok("förbyggd: rapportrutan renderad",
   A.window.document.getElementById("earningsSoon").innerHTML.length > 40);
const dHem = A.window.document.getElementById("hemMain").innerHTML;
ok("förbyggd: Hem-vyn renderad med innehåll", dHem.length > 500);

// sökindexet: EN hämtning, inte en per rapport
const before = A.req.raw.length;
const docs = await A.dash.searchDocs();
/* Indexet är medvetet TAKAT till de senaste rapporterna (SEARCH_LIMIT i
   build-dashboard.mjs) – annars växer en halvmegabytesfil in i git-historiken
   varje dag. Testet kräver därför inte full täckning, men däremot att taket
   redovisas: en tyst lucka i sökningen är värre än en synlig gräns. */
ok("sök: indexet gav dokument", Array.isArray(docs) && docs.length > 0);
ok(`sök: taket redovisas (${docs.length} av ${S.metas.length})`,
  !!A.dash._searchMeta && A.dash._searchMeta.covered === docs.length && A.dash._searchMeta.total >= docs.length);
ok("sök: täckningen är högst antalet rapporter", docs.length <= S.metas.length);
ok(`sök: kostade 1 hämtning (blev ${A.req.raw.length - before})`, A.req.raw.length - before === 1);
ok("sök: träffar hittas i indexet", A.dash.P.searchDocs(docs, "portfölj").length > 0);
const cached = A.req.raw.length;
await A.dash.searchDocs();
ok("sök: indexet cachas för sessionen", A.req.raw.length === cached);

// ================= 2. fallback när dashboard.json saknas =================
const B = await boot(["state/dashboard.json"]);
ok("fallback: statusen blir Live ändå", B.window.document.getElementById("statusTxt").textContent === "Live");
ok("fallback: förbyggd väg INTE tagen", !B.dash._prebuiltAt);
/* ≥ 1: app.js självbootar vid inladdning (load(false)) och testet kör dessutom
   load(true), så filträdet kan hämtas två gånger – cachen gäller bara utan force. */
ok("fallback: filträdet hämtades", B.req.tree >= 1);
ok("fallback: markdown hämtades per fil", B.req.md > 10);
ok("fallback: portföljen parsad ändå", !!B.dash.state.portfolio && B.dash.state.portfolio.holdings.length >= 0);
ok("fallback: Hem-vyn renderad ändå", B.window.document.getElementById("hemMain").innerHTML.length > 500);
ok(`fallback: kostar väsentligt fler anrop (${B.req.total} mot ${A.req.total})`, B.req.total > A.req.total * 3);
ok("fallback: kandidatrutan renderad ändå",
   B.window.document.getElementById("candidates").innerHTML.length > 40);
ok("fallback: rapportrutan renderad ändå",
   B.window.document.getElementById("earningsSoon").innerHTML.length > 40);

// sökningen faller också tillbaka
const C = await boot(["state/dashboard.json", "state/search-index.json"]);
const cBefore = C.req.raw.length;
const cDocs = await C.dash.searchDocs();
ok("sök-fallback: dokument hämtas en och en", Array.isArray(cDocs) && C.req.raw.length - cBefore > 5);
ok("sök-fallback: ger fortfarande träffar", C.dash.P.searchDocs(cDocs, "portfölj").length > 0);

console.log(`\nHämtningar: förbyggd ${A.req.total} · fallback ${B.req.total} (${A.req.md} respektive ${B.req.md} markdown)`);
console.log(`${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
