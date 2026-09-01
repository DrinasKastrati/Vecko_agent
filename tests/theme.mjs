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
import { readFileSync, existsSync, readdirSync } from "node:fs";
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

/* Tredjepartsbiblioteken (405 kB) laddas LAT av app.js:lib(). Ligger de som
   fasta <script> i index.html hämtas de vid varje sidladdning trots att
   startvyn inte använder en rad av dem – det var orsaken till den sega
   inladdningen 2026-08-03. */
{
  const idx = readFileSync(join(root, "index.html"), "utf8");
  const app = readFileSync(join(root, "assets", "app.js"), "utf8");
  const sw = readFileSync(join(root, "sw.js"), "utf8");
  ok("index.html laddar inga CDN-skript direkt", !/<script[^>]+src="https:\/\/cdn\./.test(idx));
  for (const lib of ["marked", "chart.js", "lightweight-charts"])
    ok(`${lib} hämtas via lib() i app.js`, app.includes(lib));
  ok("lib() har tidsgräns så löftet alltid settlar", /setTimeout\(\(\) => finish\(false\), \d+\)/.test(app));
  ok("sw.js cachar oföränderlig tredjepart först", sw.includes("cdn.jsdelivr.net") && sw.includes("fonts.gstatic.com"));
  /* View Transitions API får INTE återinföras. Det låg i koden 2026-08-02 15:49
     (`e6bd08e`) till 2026-08-03 och gjorde flikbyten tröga: webbläsarens
     standard-crossfade av root-lagret var aldrig avstängd, så hela ramen –
     inklusive menyn – tonades vid varje klick. Bisect av dagens 28 commits
     pekade ut just den commiten. Kommentarer som FÖRKLARAR borttagningen är
     tillåtna; testet letar efter faktiska anrop och CSS-regler. */
  const kod = app.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
  const css = readFileSync(join(root, "assets", "themes", "base.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  ok("app.js anropar inte startViewTransition", !kod.includes("startViewTransition"));
  ok("base.css sätter inga view-transition-name", !/view-transition-name\s*:/.test(css));
  ok("base.css har inga ::view-transition-regler", !/::view-transition/.test(css));
}

/* Google Fonts-anropet: en familj med TVÅ axlar (opsz,wght) kräver att VARJE
   värdepar anger båda. Kortformen "8..60,400;600;700" fick Google att svara 400
   med en text/html-felsida på HELA anropet – alltså noll webbtypsnitt och en
   ERR_BLOCKED_BY_ORB i konsolen. Testet räknar komponenterna per par, så samma
   fel inte kan smyga tillbaka. (Nätverkskontroll görs inte här; sviten är
   avsiktligt offline.) */
{
  const idx = readFileSync(join(root, "index.html"), "utf8");
  const m = idx.match(/fonts\.googleapis\.com\/css2\?([^"]+)/);
  ok("index.html har ett Google Fonts-anrop", !!m);
  if (m) {
    let trasig = null;
    for (const fam of m[1].split("&").filter(s => s.startsWith("family="))) {
      const spec = fam.slice(7);
      const [namn, värden] = spec.split(":");
      if (!värden) continue;
      const axlar = värden.split("@")[0].split(",").length;   // t.ex. "opsz,wght" = 2
      const par = (värden.split("@")[1] || "").split(";");
      for (const p of par) if (p.split(",").length !== axlar) trasig = namn + " -> " + p;
    }
    ok("varje vikt anger alla axlar i typsnitts-URL:en", trasig === null,
      trasig ? "trasigt par: " + trasig : "");
    ok("typsnitten byter inte mitt i sidan", /display=(optional|block)/.test(m[1]));
  }
}

/* TECKENKODNING. index.html blev dubbelkodad 2026-08-03 av ett PowerShell-steg
   som läste filen med `Get-Content -Raw` (utan -Encoding, dvs. som ANSI) och
   skrev tillbaka den med `-Encoding UTF8`. Resultat: varje "ä" blev bytesekvensen
   C3 83 C2 A4 ("Ã¤") och filen fick en BOM. Rubriker och meny såg trasiga ut.
   Testet gäller ALLA textfiler appen läser – felet är osynligt i en diff om man
   inte tittar på bytes. */
for (const f of ["index.html", "assets/app.js", "assets/vparse.js", "assets/vrender.js",
                 "assets/theme.js", "assets/settings.js", "assets/fills.js", "assets/themes/base.css",
                 "assets/manual.css", "sw.js", "manifest.json"]) {
  const buf = readFileSync(join(root, f));
  ok(`${f}: ingen BOM`, !(buf[0] === 0xEF && buf[1] === 0xBB && buf[2] === 0xBF));
  ok(`${f}: inte dubbelkodad UTF-8`, !buf.includes(Buffer.from([0xC3, 0x83, 0xC2])));
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

/* GITHUB_TOKEN-FÄLLAN, spärr för hela klassen (2026-08-07).

   GitHub startar MEDVETET inga workflows för pushar gjorda med den inbyggda
   GITHUB_TOKEN (skydd mot rekursion). Allt systemet självt producerar når main
   via auto_merge.yml med just den token, så en workflow som BARA lyssnar på
   `push: branches: [main]` går aldrig igång för robotens egna commits – utan
   att något blir rött någonstans.

   Fällan har slagit till tre gånger: test.yml och dashboard.yml (åtgärdat
   2026-08-03 genom att auto_merge kör dem själv) och digest.yml, som aldrig
   körde en enda gång mellan 2026-07-31 och 2026-08-07.

   Regeln: en workflow som triggar på push mot main MÅSTE dessutom ha antingen
   en `schedule` eller anropas inifrån auto_merge.yml. Annars är den tyst död
   för allt utom Drens manuella pushar. */
{
  const wfDir = join(root, ".github", "workflows");
  const am = readFileSync(join(wfDir, "auto_merge.yml"), "utf8");
  for (const f of readdirSync(wfDir).filter(n => n.endsWith(".yml"))) {
    const src = readFileSync(join(wfDir, f), "utf8");
    if (!/^\s*branches:\s*\[main\]/m.test(src)) continue;
    const harCron = /^\s*schedule:/m.test(src);
    // Anropas den inifrån grinden? Leta på skriptnamnen den kör.
    const körsAvGrinden = (src.match(/node \.github\/scripts\/[\w.-]+\.mjs/g) || [])
      .some(cmd => am.includes(cmd));
    ok(`${f}: push-mot-main-triggern är inte ensam (GITHUB_TOKEN-fällan)`, harCron || körsAvGrinden);
  }

  /* KONFLIKTUPPLÖSNINGEN I GRINDEN (2026-08-26).

     En fil markt `-merge` i .gitattributes kan per definition aldrig auto-mergas –
     markningen finns just for att slippa konfliktmarkorer mitt i JSON:en. Foljden
     var att varje claude-branch som rort en sadan fil blockerade HELA mergen:
     korning 32909555257 (2026-08-25T23:10) foll pa
     "CONFLICT (content): Merge conflict in state/decision_eval.json" och lamnade
     branchen kvar tills nagon kort om den for hand.

     Grinden loser numera konflikter i GENERERADE filer med mains version och bygger
     om dem. Tva invarianter maste halla, och bada ar sakerhetsregler:
       1. scout_candidates.json far ALDRIG sta i listan – den ar inte genererad utan
          bar routinens egna avgoranden (promoted/rejected med skal). Att ta mains
          version dar kastar bort precis det arbete branchen gjorde.
       2. Varje fil i listan MASTE vara markt -merge i .gitattributes. En fil som
          auto-mergas textuellt ska aldrig tas fran en sida. */
  const safeMatch = am.match(/SAFE="([^"]+)"/);
  ok("auto_merge: konfliktupplösningen har en namngiven fillista", !!safeMatch);
  if (safeMatch) {
    const safe = safeMatch[1].split(/\s+/).filter(Boolean);
    ok("auto_merge: scout_candidates.json löses ALDRIG automatiskt",
      !safe.some(f => f.includes("scout_candidates")));
    ok("auto_merge: beslutsloggen och portföljerna löses ALDRIG automatiskt",
      !safe.some(f => /decisions\.json|portfolj|reports\//.test(f)));
    const attrs = readFileSync(join(root, ".gitattributes"), "utf8");
    for (const f of safe)
      ok(`auto_merge: ${f} är markerad -merge i .gitattributes`,
        new RegExp("^" + f.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s+.*-merge", "m").test(attrs));
    ok("auto_merge: bygger om beslutsutvärderingen efter mergen",
      /node \.github\/scripts\/decision_eval\.mjs/.test(am));
  }
}

/* fills.js håller Drens lokala affärsdata och måste laddas i <head>, som
   settings.js: renderarna i vrender.js frågar window.VFills direkt när ett
   innehavskort byggs. Laddas den sist blir raden tom vid första renderingen
   utan att något fel syns. */
ok("index.html laddar fills.js i <head>", (() => {
  const head = indexSrc.slice(0, indexSrc.indexOf("</head>"));
  return head.includes('src="assets/fills.js"');
})());

/* PUSH-NOTISER. Två saker som annars går sönder TYST:
   (1) `new Notification(...)` kastar "Illegal constructor" på Android – felet
       låg i app.js till 2026-08-03 bakom ett tomt catch, så 🔔-knappen såg ut
       att fungera men gjorde ingenting på telefonen. Gå via
       registration.showNotification().
   (2) utan push-hanterare i sw.js kommer ingenting fram när appen är stängd,
       och vissa webbläsare avregistrerar en prenumeration vars push-event
       inte resulterar i en synlig notis. */
const appSrc = readFileSync(join(root, "assets/app.js"), "utf8");
// Kommentarerna FÅR nämna konstruktorn (de förklarar varför den är förbjuden) –
// testet gäller koden, så block- och radkommentarer stryks först.
const appCode = appSrc.replace(/\/\*[\s\S]*?\*\//g, "").replace(/^\s*\/\/.*$/gm, "");
ok("app.js använder inte new Notification (illegal constructor på Android)", !/new\s+Notification\s*\(/.test(appCode));
ok("app.js går via showNotification", appSrc.includes("showNotification("));
ok("sw.js har en push-hanterare", /addEventListener\(\s*"push"/.test(swSrc));
ok("sw.js visar alltid en notis vid push", /"push"[\s\S]{0,600}showNotification/.test(swSrc));
ok("sw.js hanterar klick på notisen", /addEventListener\(\s*"notificationclick"/.test(swSrc));
ok("sw.js fångar roterad prenumeration", /addEventListener\(\s*"pushsubscriptionchange"/.test(swSrc));
// Notisikonen måste vara raster. En svg här ger en notis UTAN ikon på Android,
// helt tyst – inget felmeddelande, den ser bara tom ut.
for (const [namn, src] of [["sw.js", swSrc], ["app.js", appCode]])
  ok(`${namn}: notisikonen är png, inte svg`, !/\b(icon|badge)\s*:\s*"[^"]*\.svg"/.test(src));
ok("ikonfilerna finns", ["assets/icon-192.png", "assets/icon-512.png", "assets/badge-96.png"]
  .every(p => readFileSync(join(root, p)).subarray(1, 4).toString() === "PNG"));
ok("sw.js precachar notisikonerna",
  swSrc.includes('"./assets/icon-192.png"') && swSrc.includes('"./assets/badge-96.png"'));
ok("manifest.json har png-ikoner för startskärmen",
  (() => { const m = JSON.parse(readFileSync(join(root, "manifest.json"), "utf8"));
           return ["192x192", "512x512"].every(s => m.icons.some(i => i.sizes === s && i.type === "image/png")); })());
ok("config/push.json finns och saknar privat nyckel",
  (() => { const c = JSON.parse(readFileSync(join(root, "config/push.json"), "utf8"));
           return "vapidPublicKey" in c && !JSON.stringify(c).match(/privateKey/i); })());


/* ---- ÅTGÄRDSPUNKTERNA FRÅN 2026-08-31 ÄR FAKTISKT INKOPPLADE -------------

   Alla tre defekterna nedan var TYSTA: ingen fil såg konstig ut, ingen körning
   blev röd, och de rapporterades i prosa i vecka efter vecka utan att något
   larmade. En ren funktion som ingen anropar hade varit samma klass av fel en
   gång till – det var precis så backfill-history.mjs kunde ligga oanropad i
   fjorton dagar (KVAR punkt 3, avsnitt 5b). Därför vaktas KOPPLINGEN här, inte
   bara logiken i tests/run.mjs. */
{
  const wd = readFileSync(join(root, ".github", "scripts", "watchdog.mjs"), "utf8");
  ok("watchdog: checkUsRotation anropas av main (en ren funktion ingen kör är ingen kontroll)",
     /problems\.push\(\.\.\.checkUsRotation\(/.test(wd));
  ok("watchdog: checkUsRotation matas med us-veckorapportens datum",
     /checkUsRotation\(\{[\s\S]{0,200}latestUsWeeklyDate/.test(wd));

  const fp = readFileSync(join(root, ".github", "scripts", "fetch-prices.mjs"), "utf8");
  ok("fetch-prices: movers-universumet går in i hämtlistan",
     /collectMoversUniverse\(\)/.test(fp) && /fetchList\(/.test(fp));
  ok("fetch-prices: universumet passerar ALDRIG updateLastSeen (skulle äta live-taket)",
     !/updateLastSeen\([^)]*(wide|movers|Movers)/.test(fp));

  const yml = readFileSync(join(root, ".github", "workflows", "prices.yml"), "utf8");
  ok("prices.yml: dagens första körning hämtar det breda universumet",
     /fetch-prices\.mjs\s+--wide/.test(yml));
  /* Grinden får inte ligga på en exakt cron-sträng: uteblir just den körningen
     hoppas steget över hela dygnet, vilket är felet som mättes 2026-08-31
     (0 av 2 rotationskritiska crons startade, alla startade körningar success).
     Prövas på `if:`-raderna och inte på hela filen – kommentarerna CITERAR den
     gamla grinden med flit, och ett test som läser prosa mäter prosan. */
  const ifRader = [...yml.matchAll(/^\s*if:\s*(.+)$/gm)].map(m => m[1]);
  ok("prices.yml: dygnsstegen grindas inte på en exakt cron-sträng",
     ifRader.length > 0 && !ifRader.some(r => /github\.event\.schedule\s*==/.test(r)));
  ok("prices.yml: dygnsgrinden har ett eget steg med utdata",
     /needs-daily|dygnsgrind|daily-gate/.test(yml));

  /* GitHub deprioriterar schemalagda körningar på hela timmar – minut 0 är den
     mest översökta minuten som finns. Rotationskritiska crons ska ligga bredvid. */
  for (const f of ["prices.yml", "news.yml", "movers.yml"]) {
    const src = readFileSync(join(root, ".github", "workflows", f), "utf8");
    const minuter = [...src.matchAll(/^\s*-\s*cron:\s*"(\S+)\s/gm)].map(m => m[1]);
    ok(`${f}: ingen cron ligger på minut 0 (GitHubs mest belastade minut)`,
       minuter.length > 0 && !minuter.some(m => m === "0" || m.split(",").includes("0")));
  }
}


/* ---- ÅTGÄRDERNA FRÅN 2026-09-01 ÄR FAKTISKT INKOPPLADE -------------------

   Hela poängen med dagens genomgång var att en ren funktion som ingen anropar
   upprepar precis det fel den finns för. backfill-history.mjs låg oanropad i
   fjorton dagar 2026-08; checkSeriesGaps och gap-urvalet får inte gå samma väg. */
{
  const bh = readFileSync(join(root, ".github", "scripts", "backfill-history.mjs"), "utf8");
  ok("backfill: urvalet tar med serier som har HÅL, inte bara korta",
     /symbolsWithGaps\(hist\.series/.test(bh) && /symbolsWithGaps\(vol\.series/.test(bh));
  ok("backfill: hålen läggs FÖRE de korta i urvalet (de självläker aldrig)",
     /\[\.\.\.new Set\(\[\.\.\.hål, \.\.\.korta\]\)\]/.test(bh));
  ok("backfill: backfilledAt sätts bara av en FULL körning",
     /isFullRun\(minPoints, only\)\s*\)\s*hist\.backfilledAt/.test(bh));
  ok("backfill: en delkörning rör aldrig backfilledAt",
     !/else\s+hist\.backfilledAt/.test(bh) && /partialBackfilledAt\s*=/.test(bh));

  const wd = readFileSync(join(root, ".github", "scripts", "watchdog.mjs"), "utf8");
  ok("watchdog: checkSeriesGaps anropas av main",
     /problems\.push\(\.\.\.checkSeriesGaps\(\{ gaps \}\)\)/.test(wd));
  ok("watchdog: luckorna räknas ur BÅDA serierna",
     /symbolsWithGaps\(histSeries/.test(wd) && /symbolsWithGaps\(volumeSeries/.test(wd));

  const yml = readFileSync(join(root, ".github", "workflows", "prices.yml"), "utf8");
  ok("prices.yml: backfillen körs med --missing (annars nås varken korta eller hål)",
     /backfill-history\.mjs\s+--missing=200/.test(yml));
}


/* ---- METATEST: EN KONTROLL SOM INGEN ANROPAR ÄR INGEN KONTROLL -----------

   Detta är repots mest återkommande feltyp, och den har slagit till minst fyra
   gånger:
     * backfill-history.mjs skrevs 2026-08-03 och anropades av INGEN workflow –
       upptäckt 2026-08-17, fjorton dagar senare.
     * digest.yml triggade bara på push mot main, som GITHUB_TOKEN aldrig startar –
       noll körningar på en vecka.
     * theme.mjs DEL B, data.mjs och sim.mjs hoppade tyst över sig själva i CI
       eftersom jsdom aldrig installerades – 227 påståenden var dekoration.
     * checkSeriesGaps hade inte funnits alls om luckorna inte mätts för hand
       2026-09-01; ingen kontroll läste serie-KONTINUITET, bara längd.

   Gemensamt: koden fanns, den var riktig, och ingenting körde den. En ny
   watchdog-kontroll som inte kopplas in i main upprepar exakt det felet, och
   det syns inte i någon diff. Därför prövas KOPPLINGEN här, inte bara logiken.

   Regeln: varje `export function check…` i watchdog.mjs MÅSTE (a) anropas inne
   i main() och (b) ha minst ett test i tests/run.mjs. */
{
  const wdSrc = readFileSync(join(root, ".github", "scripts", "watchdog.mjs"), "utf8");
  const mainIdx = wdSrc.indexOf("\nfunction main()");
  ok("watchdog: main() går att hitta (annars mäter metatestet ingenting)", mainIdx > 0);
  const mainBody = mainIdx > 0 ? wdSrc.slice(mainIdx) : "";
  const körSrc = readFileSync(join(root, "tests", "run.mjs"), "utf8");
  const checkar = [...wdSrc.matchAll(/export function (check\w+)/g)].map(m => m[1]);

  ok("watchdog: metatestet hittar kontrollerna", checkar.length >= 14);
  const okopplade = checkar.filter(n => !mainBody.includes(n + "("));
  ok("watchdog: VARJE check-funktion anropas av main" +
     (okopplade.length ? " – okopplade: " + okopplade.join(", ") : ""), okopplade.length === 0);
  const otestade = checkar.filter(n => !körSrc.includes(n));
  ok("watchdog: VARJE check-funktion har ett test i run.mjs" +
     (otestade.length ? " – otestade: " + otestade.join(", ") : ""), otestade.length === 0);

  /* Nycklarna styr dedupen i issue-sync.mjs och ligger i en HTML-kommentar i
     brödtexten, aldrig i titeln. En nyckel som råkar delas av två OLIKA problem
     gör att det ena stänger det andras issue. Undantaget är en och samma
     kontroll med två ömsesidigt uteslutande grenar (earnings-calendar), där
     samma nyckel är avsikten. */
  const nycklar = [...wdSrc.matchAll(/key:\s*"([a-z0-9-]+)"/g)].map(m => m[1]);
  const räkning = {};
  for (const k of nycklar) räkning[k] = (räkning[k] || 0) + 1;
  const oväntade = Object.entries(räkning).filter(([k, n]) => n > 1 && k !== "earnings-calendar");
  ok("watchdog: inga OAVSIKTLIGA dubblettnycklar" +
     (oväntade.length ? " – " + oväntade.map(([k, n]) => k + "×" + n).join(", ") : ""),
     oväntade.length === 0);
}


/* ---- RAPPORTKALENDERN: TRE HINKAR, TRE BETYDELSER (2026-09-01) -----------
   `errors` ska kunna bli TOM – det är fältet man larmar på. Två gånger har ett
   normalt utfall hamnat där och gjort fältet verkningslöst: 404 för ETF/index
   (åtgärdat med `notApplicable`) och 200-utan-rapportdatum för nordiska
   små-/medelbolag Yahoo inte täcker (åtgärdat med `noCoverage`, efter att fyra
   symboler legat kvar och rapporterats som ÅTERKOMMANDE tre veckor i rad). */
{
  const ec = readFileSync(join(root, ".github", "scripts", "earnings-calendar.mjs"), "utf8");
  ok("kalender: täckningslucka har en EGEN hink, inte errors",
     /noCoverage:\s*"/.test(ec) && !/error:\s*"inget rapportdatum/.test(ec));
  ok("kalender: noCoverage bucketas i run()",
     /else if \(r && r\.noCoverage\) noCoverage\[s\]/.test(ec));
  ok("kalender: noCoverage skrivs till filen",
     /^\s*noCoverage\s*$/m.test(ec) || /noCoverage\s*[,}]/.test(ec));
  ok("kalender: 404 ligger kvar som notApplicable",
     /notApplicable:\s*"instrumentet har inga rapporter/.test(ec));
  ok("kalender: ett HTTP-fel är fortfarande ett fel", /error:\s*"HTTP "\s*\+\s*r\.status/.test(ec));
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
