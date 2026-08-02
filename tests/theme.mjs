#!/usr/bin/env node
/* ============================================================
   Kontroll av temalagret (assets/themes/ + assets/theme.js).

   DEL A – tokentäckning. Körs ALLTID, inga beroenden, ingår i CI.
     base.css uttrycker all struktur i CSS-variabler. Saknar ett tema en enda
     av dem blir resultatet en osynlig text eller en genomskinlig ram – något
     som varken enhetstesterna eller sim.mjs upptäcker. Testet listar alla
     variabler base.css ANVÄNDER utan reservvärde men inte själv DEFINIERAR,
     och kräver att varje tema sätter dem i BÅDA lägena.

   DEL B – motorn. Kräver jsdom (som tests/sim.mjs) och hoppas över om den
     saknas, precis som sim inte körs i CI.

   Kör:  node tests/theme.mjs
         SIM_DEPS=<mapp med node_modules som har jsdom> node tests/theme.mjs
   ============================================================ */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve, join } from "node:path";
import { createRequire } from "node:module";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const THEMES = ["deck", "nordlys", "terminal", "enkel"];
let pass = 0, fail = 0;
const ok = (name, cond) => { if (cond) pass++; else { fail++; console.log("  FAIL:", name); } };
const css = f => readFileSync(join(root, "assets/themes", f + ".css"), "utf8");

// ================= DEL A: tokentäckning =================
const base = css("base");
const used = new Set();
// var(--x) UTAN reservvärde – med reserv (var(--x,y)) klarar sig basen själv
for (const m of base.matchAll(/var\(\s*(--[a-z0-9-]+)\s*([,)])/g)) if (m[2] === ")") used.add(m[1]);
const defined = new Set([...base.matchAll(/^\s*(--[a-z0-9-]+)\s*:/gm)].map(m => m[1]));
const needed = [...used].filter(t => !defined.has(t)).sort();

ok("base.css: balanserade klamrar", (base.match(/{/g) || []).length === (base.match(/}/g) || []).length);
ok("base.css: kräver minst 10 tokens av temat", needed.length >= 10);

for (const theme of THEMES) {
  const src = css(theme);
  const block = re => (src.match(re) || [""])[0];
  const shared = block(/:root\{[\s\S]*?\n\}/);
  const dark = block(/:root\[data-mode="dark"\]\{[\s\S]*?\n\}/);
  const light = block(/:root\[data-mode="light"\]\{[\s\S]*?\n\}/);
  const has = (s, t) => new RegExp("(^|[;{\\s])" + t + "\\s*:").test(s);

  ok(`${theme}: balanserade klamrar`, (src.match(/{/g) || []).length === (src.match(/}/g) || []).length);
  ok(`${theme}: har ett mörkt läge`, dark.length > 50);
  ok(`${theme}: har ett ljust läge`, light.length > 50);
  for (const [läge, blk] of [["mörkt", dark], ["ljust", light]]) {
    const miss = needed.filter(t => !has(shared, t) && !has(blk, t));
    ok(`${theme}: alla tokens satta i ${läge} läge${miss.length ? " → saknas: " + miss.join(", ") : ""}`, !miss.length);
  }
}

// varje tema i registret måste ha en fil, och tvärtom
const engine = readFileSync(join(root, "assets/theme.js"), "utf8");
const ids = [...engine.matchAll(/\{\s*id:\s*"([a-z]+)"/g)].map(m => m[1]);
ok("theme.js: registret matchar filerna i assets/themes/", ids.sort().join(",") === [...THEMES].sort().join(","));
for (const id of ids) ok(`theme.js: ${id} pekar på rätt css`, engine.includes(`assets/themes/${id}.css`));

// ================= DEL B: motorn (kräver jsdom) =================
let JSDOM = null;
try {
  const req = createRequire(process.env.SIM_DEPS ? join(process.env.SIM_DEPS, "package.json") : import.meta.url);
  JSDOM = req("jsdom").JSDOM;
} catch { /* jsdom saknas – del B hoppas över (samma villkor som sim.mjs) */ }

if (!JSDOM) {
  console.log("  (hoppar över del B – jsdom saknas)");
} else {
  const html = readFileSync(join(root, "index.html"), "utf8")
    .replace(/<script src="https:[^"]*"><\/script>/g, "")
    .replace(/<script src="assets\/(vparse|vrender|app)\.js"><\/script>/g, "");
  const boot = async (url) => {
    const dom = new JSDOM(html, { url, runScripts: "outside-only", pretendToBeVisual: true });
    dom.window.eval(engine);
    // theme.js väntar på DOMContentLoaded innan växlaren renderas (rätt i
    // webbläsaren); i jsdom har den händelsen inte hunnit fyra än.
    await new Promise(r => setTimeout(r, 0));
    return dom.window;
  };

  const w = await boot("https://x.test/index.html");
  const doc = w.document, T = w.VTheme;
  ok("motor: VTheme exponerad med 4 teman", !!T && T.themes.length === 4);
  ok("boot: data-theme satt före första målningen", doc.documentElement.getAttribute("data-theme") === "deck");
  ok("boot: data-mode = temats standardläge", doc.documentElement.getAttribute("data-mode") === "dark");
  ok("boot: themeCss pekar på rätt fil", doc.getElementById("themeCss").getAttribute("href") === "assets/themes/deck.css");
  ok("växlare: en knapp per tema + lägesknapp",
    doc.querySelectorAll("#themeCtl [data-theme-set]").length === 4 && !!doc.getElementById("modeBtn"));
  ok("växlare: aktivt tema markerat", (doc.querySelector("#themeCtl button.cur") || {}).dataset?.themeSet === "deck");

  T.setTheme("terminal");
  ok("setTheme: css-länken byts", doc.getElementById("themeCss").getAttribute("href") === "assets/themes/terminal.css");
  ok("setTheme: data-theme byts", doc.documentElement.getAttribute("data-theme") === "terminal");
  ok("setTheme: ärver temats standardläge", doc.documentElement.getAttribute("data-mode") === "dark");
  T.toggleMode();
  ok("toggleMode: mörkt → ljust", doc.documentElement.getAttribute("data-mode") === "light");
  ok("toggleMode: ikonen följer med", doc.getElementById("modeBtn").textContent === "☾");
  T.setTheme("nordlys");
  ok("setTheme: nordlys startar ljust", doc.documentElement.getAttribute("data-mode") === "light");
  T.setTheme("terminal");
  ok("läget sparas PER tema", doc.documentElement.getAttribute("data-mode") === "light");
  ok("localStorage: temavalet sparas", w.localStorage.getItem("vr_theme") === "terminal");

  doc.querySelector('[data-theme-set="enkel"]').dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  ok("klick: temaknappen byter tema", doc.documentElement.getAttribute("data-theme") === "enkel");
  doc.getElementById("modeBtn").dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  ok("klick: lägesknappen växlar läge", doc.documentElement.getAttribute("data-mode") === "dark");

  const w2 = await boot("https://x.test/index.html?theme=nordlys&mode=dark");
  ok("URL: ?theme= vinner över sparat val", w2.document.documentElement.getAttribute("data-theme") === "nordlys");
  ok("URL: ?mode= styr läget", w2.document.documentElement.getAttribute("data-mode") === "dark");
}

// stubbarna som håller de gamla adresserna vid liv
for (const [f, t] of [["index_2.html", "nordlys"], ["index_3.html", "terminal"], ["index_4.html", "enkel"]]) {
  ok(`${f}: vidarebefordrar till temat ${t}`, readFileSync(join(root, f), "utf8").includes(`index.html?theme=${t}`));
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
