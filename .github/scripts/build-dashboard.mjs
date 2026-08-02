#!/usr/bin/env node
/* ============================================================================
   build-dashboard.mjs — förbygger dashboardens data. NYCKELLÖS och LLM-FRI.

   VARFÖR: webbappen gjorde ~60 nätanrop vid varje laddning (1 GitHub-API-anrop
   för filträdet + upp till 56 råhämtningar av markdown + 6 JSON-filer) och
   parsade allt i webbläsaren. Sökningen hämtade SAMTLIGA rapporter. Antalet
   rapporter växer med 4–5 filer per dag, så kostnaden var linjärt växande.

   Det här skriptet kör i repo-utcheckningen (ingen nätåtkomst behövs), läser
   filerna från disk och parsar dem med EXAKT samma `assets/vparse.js` som
   webbappen använder – samma kod, samma 308 tester, ingen ny parsningslogik.

   Skriver två filer:
     state/dashboard.json     – allt markdown-härlett (metas, portföljer,
                                rapporter, lärdomar). Ersätter ~56 hämtningar.
     state/search-index.json  – rå markdown per rapport, för fulltextsökning.
                                Hämtas LAT, först när användaren söker.

   Volatil JSON (prices/alerts/allocation/decisions/kostnader/analysis_queue)
   bakas medvetet INTE in: de skrivs var 30:e minut av andra actions, och att
   baka in dem skulle tvinga fram en ombyggnad lika ofta. De är små och hämtas
   som i dag.

   Kör lokalt:  node .github/scripts/build-dashboard.mjs
   ========================================================================== */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join, relative } from "node:path";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..", "..");

// vparse.js är en IIFE som exporterar via module.exports ELLER window.VParse.
// Ladda den på samma sätt som tests/run.mjs gör.
const win = {};
new Function("window", readFileSync(join(ROOT, "assets", "vparse.js"), "utf8"))(win);
const P = win.VParse;
if (!P || typeof P.parseFilename !== "function") throw new Error("kunde inte ladda assets/vparse.js");

// ---- filträd (samma upptäckt som webbappen gör via GitHub-API:t) ----------
function walk(dir, out = []) {
  for (const name of readdirSync(dir)) {
    if (name === ".git" || name === "node_modules") continue;
    const p = join(dir, name);
    let st; try { st = statSync(p); } catch { continue; }
    if (st.isDirectory()) walk(p, out);
    else out.push(relative(ROOT, p).replace(/\\/g, "/"));
  }
  return out;
}
const paths = walk(ROOT);

// ---- metas i samma form som app.js metasFromTree() ger --------------------
const metas = [];
for (const p of paths) {
  if (!p.endsWith(".md")) continue;
  const name = p.split("/").pop();
  const meta = P.parseFilename(name);
  if (!meta || !meta.type) continue;
  metas.push({ ...meta, name, path: p });
}
// Nyast först – EXAKT samma jämförelse som app.js metasFromTree() gör, så att
// ordningen (inklusive hur dubbletter på samma datum hamnar) blir identisk.
metas.sort((a, b) => b.sortKey - a.sortKey);

const read = p => { try { return readFileSync(join(ROOT, p), "utf8"); } catch { return null; } };
const find = re => paths.find(p => re.test(p)) || null;

const byType = (t, n) => metas.filter(m => m.type === t).slice(0, n);
const parseSet = (list, fn) => list.map(m => {
  const md = read(m.path);
  return md ? fn(md, m) : null;
}).filter(Boolean);

/* Taken är satta efter vad webbappen FAKTISKT läser, inte efter vad den hämtar.
   Legacy-vägen hämtade 12 scout-rapporter men renderar bara `scouts[0]` – de
   övriga elva stod för 132 av 144 kB. Höj taket här om en vy börjar läsa längre
   bak i någon lista, annars blir posten tyst tom:
     dailies   10  buildDecisionHistory() går igenom de tio senaste
     weeklies  12  buildReturnSeries() + buildFeed() använder hela listan
     scouts     2  renderScout() läser [0]; extra marginal
     usDailies  3  renderUs() läser [0] och [1]
     usWeeklies 2  parsas men används inte i dag – marginal om det ändras */
const dMetas = byType("daily", 10), wMetas = byType("weekly", 12), sMetas = byType("scout", 2);
const udMetas = byType("us_daily", 3), uwMetas = byType("us_weekly", 2);

const portfPath = find(/(^|\/)portfolj\.md$/i);
const portfUsPath = find(/(^|\/)portfolj_us\.md$/i);
const lessonsPath = find(/(^|\/)lessons\.md$/i);
const wlPath = find(/(^|\/)watchlist\.txt$/i);
const wlUsPath = find(/(^|\/)watchlist_us\.txt$/i);

const pMd = portfPath ? read(portfPath) : null;
const pUsMd = portfUsPath ? read(portfUsPath) : null;
const lessonsMd = lessonsPath ? read(lessonsPath) : null;

const dashboard = {
  version: 1,
  generatedAt: new Date().toISOString(),
  commit: process.env.GITHUB_SHA || null,
  counts: { metas: metas.length, reports: metas.length },
  metas,
  portfolio: pMd ? P.parsePortfolio(pMd) : null,
  portfolioUs: pUsMd ? P.parsePortfolio(pUsMd) : null,
  dailies: parseSet(dMetas, P.parseDaily),
  weeklies: parseSet(wMetas, P.parseWeekly),
  scouts: parseSet(sMetas, P.parseScout),
  usDailies: parseSet(udMetas, P.parseDaily),
  usWeeklies: parseSet(uwMetas, P.parseWeekly),
  lessons: lessonsMd ? P.parseLessons(lessonsMd) : null,
  watchlist: wlPath ? read(wlPath) : null,
  watchlistUs: wlUsPath ? read(wlUsPath) : null
};

// ---- sökindex: rå markdown per rapport, laddas lat ------------------------
const searchIndex = {
  version: 1,
  generatedAt: dashboard.generatedAt,
  docs: metas.map(m => ({ meta: m, text: read(m.path) || "" })).filter(d => d.text)
};

const out1 = join(ROOT, "state", "dashboard.json");
const out2 = join(ROOT, "state", "search-index.json");
writeFileSync(out1, JSON.stringify(dashboard) + "\n", "utf8");
writeFileSync(out2, JSON.stringify(searchIndex) + "\n", "utf8");

// Verifiera att det vi skrev går att läsa tillbaka – en trasig dashboard.json
// får aldrig committas (webbappen faller då tillbaka, men tyst).
JSON.parse(readFileSync(out1, "utf8"));
JSON.parse(readFileSync(out2, "utf8"));

const kb = f => Math.round(statSync(f).size / 1024);
console.log(`dashboard.json    ${String(kb(out1)).padStart(4)} kB  ` +
  `${metas.length} rapporter · ${dashboard.dailies.length} dagliga · ${dashboard.weeklies.length} vecko · ` +
  `${dashboard.scouts.length} scout · ${dashboard.usDailies.length}+${dashboard.usWeeklies.length} US`);
console.log(`search-index.json ${String(kb(out2)).padStart(4)} kB  ${searchIndex.docs.length} dokument`);
console.log(`portfölj: ${dashboard.portfolio ? dashboard.portfolio.holdings.length + " innehav" : "SAKNAS"} · ` +
  `US: ${dashboard.portfolioUs ? dashboard.portfolioUs.holdings.length + " innehav" : "saknas"} · ` +
  `lärdomar: ${dashboard.lessons ? (dashboard.lessons.active || []).length : 0}`);

export { walk };
