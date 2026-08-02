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
import { readFileSync, existsSync } from "node:fs";
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
    // settings.js laddas i <head> direkt efter theme.js och delegerar tema/läge
    // dit – ordningen måste vara densamma här.
    dom.window.eval(readFileSync(join(root, "assets/settings.js"), "utf8"));
    // Båda väntar på DOMContentLoaded innan de renderar (rätt i webbläsaren);
    // i jsdom har den händelsen inte hunnit fyra än.
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

  // ================= Inställningar (assets/settings.js) =================
  const S = w.VSettings;
  ok("inställningar: VSettings exponerad", !!S && Array.isArray(S.schema));
  ok("inställningar: standardvärden gäller utan sparat val",
    S.get("textsize") === "md" && S.get("density") === "normal" && S.get("motion") === "on");
  ok("inställningar: attributen sitter på <html>",
    doc.documentElement.getAttribute("data-textsize") === "md" &&
    doc.documentElement.getAttribute("data-density") === "normal");
  ok("inställningar: vyn renderad ur schemat",
    doc.querySelectorAll("#settingsBody [data-set]").length >= 10);

  S.set("density", "compact");
  ok("inställningar: val skrivs till <html>", doc.documentElement.getAttribute("data-density") === "compact");
  ok("inställningar: val sparas i localStorage",
    JSON.parse(w.localStorage.getItem("vr_settings") || "{}").density === "compact");
  ok("inställningar: knappen markeras",
    !!doc.querySelector('#settingsBody [data-set="density"][data-val="compact"].on'));

  S.set("density", "hittepå");
  ok("inställningar: ogiltigt värde ignoreras", S.get("density") === "compact");

  S.set("textsize", "lg");
  S.set("motion", "off");
  ok("inställningar: flera val samtidigt",
    doc.documentElement.getAttribute("data-textsize") === "lg" &&
    doc.documentElement.getAttribute("data-motion") === "off");

  // tema via inställningarna ska gå genom VTheme (en enda ägare av temat)
  S.set("theme", "nordlys");
  ok("inställningar: tema delegeras till VTheme",
    doc.documentElement.getAttribute("data-theme") === "nordlys" && S.get("theme") === "nordlys");

  // startvyn erbjuder bara vyer som finns i menyn
  const startOpts = S.options(S.schema.find(x => x.id === "startview")).map(o => o[0]);
  ok("inställningar: startvyns alternativ kommer ur menyn",
    startOpts.length === doc.querySelectorAll(".subnav a").length && startOpts.includes("hem"));

  // klick i vyn ska fungera som direktanrop (delegerad lyssnare)
  doc.querySelector('#settingsBody [data-set="textsize"][data-val="sm"]')
    .dispatchEvent(new w.MouseEvent("click", { bubbles: true }));
  ok("inställningar: klick i vyn ändrar värdet", doc.documentElement.getAttribute("data-textsize") === "sm");

  S.reset();
  ok("inställningar: återställning tömmer lagringen", !w.localStorage.getItem("vr_settings"));
  ok("inställningar: återställning ger standardvärden igen",
    doc.documentElement.getAttribute("data-textsize") === "md" &&
    doc.documentElement.getAttribute("data-density") === "normal");

  // inställningsvyn finns som vy men medvetet UTAN menylänk (kugghjul i toppraden)
  ok("inställningar: vyn finns", !!doc.querySelector('.view[data-view="installningar"]'));
  ok("inställningar: nås via kugghjulet, inte menyn",
    !!doc.getElementById("settingsBtn") && !doc.querySelector('.subnav a[data-view="installningar"]'));
}

/* Ett tema får ALDRIG bli en egen HTML-fil igen. Före 2026-08-02 fanns en
   komplett kopia av webbappen per tema (index_2/3/4.html), sedan 18-raders
   stubbar, och därefter ingenting: markupen ligger i index.html och temat väljs
   med `?theme=`. Testet nedan larmar om någon återinför mönstret. */
for (const f of ["index_2.html", "index_3.html", "index_4.html"]) {
  ok(`${f}: återinförd som egen fil`, !existsSync(join(root, f)));
}
for (const t of ["deck", "nordlys", "terminal", "enkel"]) {
  ok(`temat ${t} går att välja via ?theme=`, /\?theme=|theme=/.test(readFileSync(join(root, "assets", "theme.js"), "utf8")) &&
    readFileSync(join(root, "assets", "theme.js"), "utf8").includes(`id: "${t}"`));
}

/* Manualernas gemensamma stil ligger i assets/manual.css (utbruten 2026-08-02).
   Testet larmar om någon återinför en full kopia av stilmallen i en manual –
   det var så de två blocken glidit isär från början. */
/* Hem-vyns detaljnivå styrs av data-hemmode. Attributet måste finnas i
   settings-schemat (annars går läget inte att spara) OCH i base.css (annars
   fälls högerspalten aldrig ihop i enkelt läge). */
{
  const set = readFileSync(join(root, "assets", "settings.js"), "utf8");
  const base = readFileSync(join(root, "assets", "themes", "base.css"), "utf8");
  const idx = readFileSync(join(root, "index.html"), "utf8");
  ok("hemmode: finns i settings-schemat", /id:\s*"hemmode"/.test(set) && set.includes('attr: "data-hemmode"'));
  ok("hemmode: base.css reagerar på attributet", base.includes('[data-hemmode="enkel"]'));
  ok("hemmode: växeln finns i index.html", (idx.match(/data-hemmode-set=/g) || []).length === 2);
}

ok("assets/manual.css finns", existsSync(join(root, "assets", "manual.css")));
const manualCss = existsSync(join(root, "assets", "manual.css"))
  ? readFileSync(join(root, "assets", "manual.css"), "utf8") : "";
for (const tok of ["--ink", "--wash", ".page", ".box", ".toc", ".foot"])
  ok(`manual.css definierar ${tok}`, manualCss.includes(tok));
for (const f of ["Kom-igang.html", "Systemguide.html"]) {
  const html = readFileSync(join(root, f), "utf8");
  ok(`${f}: länkar till assets/manual.css`, html.includes('href="assets/manual.css"'));
  // egna <style>-blocket ska vara ÖVERSKRIVNINGAR, inte en ny kopia av basen
  const inline = (html.match(/<style>[\s\S]*?<\/style>/) || [""])[0];
  ok(`${f}: inline-stilen duplicerar inte färgpaletten`, !inline.includes("--ink:"));
  ok(`${f}: inline-stilen duplicerar inte body-regeln`, !/\bbody\{/.test(inline));
}

/* sw.js måste precacha varje egen modul index.html laddar – annars fungerar
   inte appen offline. `assets/settings.js` saknades här fram till 2026-08-02. */
const swSrc = readFileSync(join(root, "sw.js"), "utf8");
const indexSrc = readFileSync(join(root, "index.html"), "utf8");
for (const m of indexSrc.match(/src="(assets\/[^"]+\.js)"/g) || []) {
  const p = m.slice(5, -1);
  ok(`sw.js precachar ${p}`, swSrc.includes(`"./${p}"`));
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
