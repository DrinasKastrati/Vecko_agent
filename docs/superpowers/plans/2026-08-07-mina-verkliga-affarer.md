# Mina verkliga affärer — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Låta Dren fylla i vad han faktiskt betalade och sålde för, lokalt per enhet, och se sin verkliga avkastning bredvid robotens modellerade.

**Architecture:** En ny fristående modul `assets/fills.js` (`window.VFills`) äger lagring (localStorage, nyckel `vr_fills`), nyckling och beräkning som RENA funktioner. `vrender.js` får två nya renderare som tar färdig data och returnerar HTML utan att röra DOM. `app.js` kopplar ihop dem och äger händelsehanteringen. Ingenting skrivs till repot och ingen prompt påverkas.

**Tech Stack:** Ren ES5-kompatibel JS i IIFE-form (samma som `settings.js`/`theme.js`), inga byggsteg, inga beroenden. Tester i `tests/run.mjs` (rena funktioner, ingen DOM) och `tests/sim.mjs` (vy-integration i jsdom).

**Spec:** `docs/superpowers/specs/2026-08-07-mina-verkliga-affarer-design.md`

## Global Constraints

- **Lagring:** `localStorage`, nyckel `vr_fills`. EGEN nyckel — inte `vr_settings`, vars "Återställ inställningar" gör `localStorage.removeItem(KEY)` och annars hade raderat affärsdatan.
- **Inget tal på ofullständigt underlag.** Är `klara < totalt` ska `avkastningPct` och `kronor` vara `null`. Vyn skriver vad som fattas, aldrig en siffra.
- **`totalt` räknar bara STÄNGDA affärer** (rader i robotens historiktabell). Öppna positioner får fyllas i men ingår inte i nämnaren.
- **Valutor hålls isär.** Nordiskt och amerikanskt räknas var för sig. Ingen gemensam summa.
- **Siffrorna styr inga beslut.** Rör aldrig `prompts/`, `alerts.mjs` eller någon fil i `state/`.
- **Modulen laddas i `<head>`** efter `settings.js`, och MÅSTE in i `SHELL` i `sw.js` med `CACHE`-bump — annars saknas den offline.
- **Filändringar görs med Edit/Write-verktygen**, aldrig med PowerShell 5.1 (förstör UTF-8, se CLAUDE.md avsnitt 3).
- **Alla belopp i modulen är tal**, aldrig strängar. Parsning av användarinmatning (komma som decimaltecken) sker i `app.js` innan värdet når `VFills`.

---

### Task 1: `assets/fills.js` — nyckel, lagring och beräkning

**Files:**
- Create: `assets/fills.js`
- Modify: `tests/run.mjs` (lägg testerna efter blocket som slutar med `ok("renderAlerts empty still empty", ...)`)

**Interfaces:**
- Consumes: inget.
- Produces: `window.VFills` med
  `KEY` (sträng `"vr_fills"`),
  `tickerFrom(row) -> string`,
  `keyFor(row) -> string|null`,
  `all() -> object`,
  `get(key) -> object|null`,
  `setKop(key, {bok, kurs, antal, datum}) -> void`,
  `setSalj(key, {kurs, antal, datum}) -> void`,
  `remove(key) -> void`,
  `computeMyStats(fills, closedTrades, bok, costPct) -> {klara, totalt, saknar, avkastningPct, kronor, investerat, perAffar}`.

- [ ] **Step 1: Write the failing tests**

Lägg i `tests/run.mjs` direkt efter raden `ok("renderAlerts empty still empty", VR.renderAlerts({ active: [], history: [] }) === "");`:

```js
/* ---- MINA VERKLIGA AFFÄRER (assets/fills.js) ----------------------------
   Rena funktioner, ingen DOM och ingen localStorage i testerna – lagringen
   testas inte här, den är tre rader try/catch runt localStorage precis som i
   settings.js. Det som MÅSTE testas är nyckeln (den ska överleva att roboten
   flyttar en position från innehav till historik, där tickern står i parentes
   i stället för i en egen kolumn) och regeln att ett tal aldrig visas på
   ofullständigt underlag. */
load("fills.js");
const VF = globalThis.window.VFills;

// Tickern: innehavstabellen har egen kolumn, historiktabellen har den i parentes.
ok("fills: ticker ur innehavsrad", VF.tickerFrom({ "Aktie": "Saab (SAAB-B.ST)", "Yahoo-ticker": "SAAB-B.ST" }) === "SAAB-B.ST");
ok("fills: ticker ur historikrad utan egen kolumn", VF.tickerFrom({ "Aktie": "Saab (SAAB-B.ST)" }) === "SAAB-B.ST");
ok("fills: ticker normaliseras till versaler", VF.tickerFrom({ "Yahoo-ticker": " saab-b.st " }) === "SAAB-B.ST");
ok("fills: rad utan ticker ger tom sträng", VF.tickerFrom({ "Aktie": "Indexsleeve" }) === "");

// Nyckeln binder ticker till entry-datum, så samma aktie köpt två gånger blir två affärer.
ok("fills: nyckel av ticker + entry-datum",
  VF.keyFor({ "Yahoo-ticker": "SAAB-B.ST", "Entry-datum": "2026-08-10" }) === "SAAB-B.ST|2026-08-10");
ok("fills: nyckeln fungerar på en historikrad",
  VF.keyFor({ "Aktie": "Saab (SAAB-B.ST)", "Entry-datum": "2026-08-10" }) === "SAAB-B.ST|2026-08-10");
ok("fills: rad utan datum ger ingen nyckel", VF.keyFor({ "Yahoo-ticker": "SAAB-B.ST" }) === null);
ok("fills: rad utan ticker ger ingen nyckel", VF.keyFor({ "Entry-datum": "2026-08-10" }) === null);

// Beräkningen. Courtaget är rundtur och tas på det investerade beloppet.
const stangda = [
  { "Aktie": "Saab (SAAB-B.ST)", "Entry-datum": "2026-08-10" },
  { "Aktie": "Volvo (VOLV-B.ST)", "Entry-datum": "2026-08-11" }
];
const fyllda = {
  "SAAB-B.ST|2026-08-10": { bok: "nordic", kop: { kurs: 600, antal: 10 }, salj: { kurs: 700, antal: 10 } },
  "VOLV-B.ST|2026-08-11": { bok: "nordic", kop: { kurs: 300, antal: 10 }, salj: { kurs: 330, antal: 10 } }
};
const full = VF.computeMyStats(fyllda, stangda, "nordic", 0);
ok("fills: räknar alla stängda affärer", full.klara === 2 && full.totalt === 2);
ok("fills: investerat belopp summeras", full.investerat === 9000);
ok("fills: netto i kronor", full.kronor === 1300);
ok("fills: avkastning viktas på investerat belopp",
  Math.abs(full.avkastningPct - (1300 / 9000 * 100)) < 1e-9);
ok("fills: perAffar har en rad per affär", full.perAffar.length === 2 && full.perAffar[0].ticker === "SAAB-B.ST");

// Courtaget dras av. 0,25 % rundtur på 9000 investerat = 22,50 kr.
const medCourtage = VF.computeMyStats(fyllda, stangda, "nordic", 0.25);
ok("fills: courtage dras från nettot", Math.abs(medCourtage.kronor - (1300 - 22.5)) < 1e-9);

// KÄRNREGELN: halv data ger inget tal.
const halv = { "SAAB-B.ST|2026-08-10": { bok: "nordic", kop: { kurs: 600, antal: 10 } } };
const ofull = VF.computeMyStats(halv, stangda, "nordic", 0.25);
ok("fills: ofullständigt underlag ger INGET tal", ofull.avkastningPct === null && ofull.kronor === null);
ok("fills: men säger hur många som är klara", ofull.klara === 0 && ofull.totalt === 2);
ok("fills: och namnger vad som saknas",
  ofull.saknar.length === 2 && ofull.saknar[0].ticker === "SAAB-B.ST" && ofull.saknar[0].vad === "köp och sälj");
ok("fills: saknad säljkurs pekas ut specifikt", (() => {
  const bara = { "SAAB-B.ST|2026-08-10": { bok: "nordic", kop: { kurs: 600, antal: 10 } },
                 "VOLV-B.ST|2026-08-11": { bok: "nordic", kop: { kurs: 300, antal: 10 }, salj: { kurs: 330, antal: 10 } } };
  const r = VF.computeMyStats(bara, stangda, "nordic", 0);
  return r.klara === 1 && r.saknar.length === 1 && r.saknar[0].vad === "sälj";
})());

// Böckerna hålls isär: en US-affär får aldrig räknas in i den nordiska summan.
ok("fills: fel bok räknas inte in", (() => {
  const blandat = {
    "SAAB-B.ST|2026-08-10": { bok: "nordic", kop: { kurs: 600, antal: 10 }, salj: { kurs: 700, antal: 10 } },
    "VOLV-B.ST|2026-08-11": { bok: "us", kop: { kurs: 300, antal: 10 }, salj: { kurs: 330, antal: 10 } }
  };
  const r = VF.computeMyStats(blandat, stangda, "nordic", 0);
  return r.klara === 1 && r.saknar.length === 1;
})());

// Öppna positioner ingår inte – annars hade talet aldrig kunnat visas.
ok("fills: tom lista stängda affärer ger totalt 0 och inget tal", (() => {
  const r = VF.computeMyStats(fyllda, [], "nordic", 0);
  return r.totalt === 0 && r.klara === 0 && r.avkastningPct === null;
})());

// Robusthet: trasig eller saknad indata får aldrig kasta.
ok("fills: null-indata kraschar inte", (() => {
  const r = VF.computeMyStats(null, null, "nordic", 0.25);
  return r.totalt === 0 && r.avkastningPct === null;
})());
ok("fills: antal 0 räknas som ofullständigt", (() => {
  const noll = { "SAAB-B.ST|2026-08-10": { bok: "nordic", kop: { kurs: 600, antal: 0 }, salj: { kurs: 700, antal: 0 } } };
  return VF.computeMyStats(noll, [stangda[0]], "nordic", 0).klara === 0;
})());
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node tests/run.mjs`
Expected: FAIL — kraschar på `load("fills.js")` med `ENOENT ... assets/fills.js`, eftersom filen inte finns än.

- [ ] **Step 3: Write the implementation**

Skapa `assets/fills.js`:

```js
/* ============================================================================
   fills.js — window.VFills: Drens EGNA köp- och säljkurser.

   VARFÖR FILEN FINNS: systemet lägger inga ordrar. Roboten skriver den
   VERIFIERADE kurs den såg när beslutet fattades; Dren utför affären hos
   mäklaren och betalar något annat. Under pappersperioden spelade skillnaden
   ingen roll — från den skarpa starten 2026-08-10 är felet kumulativt, och
   ingenting mätte det.

   LAGRING: localStorage, alltså PER ENHET OCH WEBBLÄSARE, precis som temat.
   Inget committas, inget delas, ingen backup finns. EGEN nyckel (`vr_fills`)
   och inte `vr_settings` — den senares "Återställ inställningar" gör
   localStorage.removeItem() och hade tagit affärsdatan med sig.

   SIFFRORNA MÄTER UTFALL, DE STYR INGA BESLUT. Prompterna kör i GitHub Actions
   och kan inte läsa localStorage; stop-loss och målkurs prövas fortsatt mot
   ROBOTENS entry. Läste besluten den här datan skulle två enheter med olika
   ifyllda siffror ge olika signaler för samma position.
   ========================================================================== */
(function (root) {
  "use strict";

  var KEY = "vr_fills";

  /* Tickern står på TVÅ ställen beroende på tabell: innehavstabellen har en
     egen kolumn "Yahoo-ticker", historiktabellen har den bara i parentes i
     "Aktie" (`Saab (SAAB-B.ST)`). Nyckeln måste bli densamma i båda, annars
     tappas affären i samma sekund roboten flyttar den till historiken. */
  function tickerFrom(row) {
    if (!row) return "";
    var direkt = String(row["Yahoo-ticker"] || "").trim();
    if (direkt) return direkt.toUpperCase();
    var m = String(row["Aktie"] || "").match(/\(([^)]+)\)/);
    return m ? m[1].trim().toUpperCase() : "";
  }

  function keyFor(row) {
    var t = tickerFrom(row);
    var d = String((row && row["Entry-datum"]) || "").trim();
    return (t && d) ? (t + "|" + d) : null;
  }

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { return {}; }
  }
  function write(o) {
    try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {}
  }

  function tal(v) { var n = typeof v === "number" ? v : parseFloat(v); return isFinite(n) ? n : 0; }
  function komplett(ben) { return !!ben && tal(ben.kurs) > 0 && tal(ben.antal) > 0; }

  /* Räknar Drens verkliga utfall för EN bok.

     `stangda` är robotens historikrader — bara stängda affärer ingår. Öppna
     positioner har per definition ingen säljkurs, och räknades de in i
     nämnaren skulle klara < totalt alltid vara sant och talet aldrig visas.

     `costPct` är rundturskostnaden i procent (config/kostnader.json), tagen på
     det investerade beloppet.

     REGELN SOM INTE FÅR LUCKRAS UPP: saknas en enda affär returneras null för
     avkastningPct och kronor. Ett halvfyllt tal ser ut att betyda något och
     inbjuder till jämförelse med robotens — hellre "för tidigt", precis som
     decision_eval gör. */
  function computeMyStats(fills, stangda, bok, costPct) {
    var db = fills || {}, rader = stangda || [];
    var perAffar = [], saknar = [];
    var netto = 0, investerat = 0;

    for (var i = 0; i < rader.length; i++) {
      var k = keyFor(rader[i]);
      var t = tickerFrom(rader[i]);
      var f = k ? db[k] : null;
      if (f && f.bok && f.bok !== bok) { saknar.push({ ticker: t, key: k, vad: "annan bok" }); continue; }
      var harKop = komplett(f && f.kop), harSalj = komplett(f && f.salj);
      if (!harKop || !harSalj) {
        saknar.push({ ticker: t, key: k, vad: (!harKop && !harSalj) ? "köp och sälj" : (harKop ? "sälj" : "köp") });
        continue;
      }
      var in_ = tal(f.kop.kurs) * tal(f.kop.antal);
      var ut = tal(f.salj.kurs) * tal(f.salj.antal);
      var avgift = in_ * (tal(costPct) / 100);
      var res = ut - in_ - avgift;
      investerat += in_; netto += res;
      perAffar.push({ ticker: t, key: k, in: in_, ut: ut, antal: tal(f.kop.antal),
        brutto: ut - in_, avgift: avgift, netto: res,
        pct: in_ > 0 ? (res / in_ * 100) : null });
    }

    var klara = perAffar.length, totalt = rader.length;
    var fullt = totalt > 0 && klara === totalt;
    return {
      klara: klara, totalt: totalt, saknar: saknar, perAffar: perAffar,
      investerat: investerat,
      kronor: fullt ? netto : null,
      avkastningPct: (fullt && investerat > 0) ? (netto / investerat * 100) : null
    };
  }

  root.VFills = {
    KEY: KEY,
    tickerFrom: tickerFrom,
    keyFor: keyFor,
    computeMyStats: computeMyStats,
    all: function () { return read(); },
    get: function (k) { return read()[k] || null; },
    setKop: function (k, v) {
      var db = read(); var post = db[k] || {};
      if (v && v.bok) post.bok = v.bok;
      post.kop = { kurs: tal(v && v.kurs), antal: tal(v && v.antal), datum: (v && v.datum) || "" };
      db[k] = post; write(db);
    },
    setSalj: function (k, v) {
      var db = read(); var post = db[k] || {};
      post.salj = { kurs: tal(v && v.kurs), antal: tal(v && v.antal), datum: (v && v.datum) || "" };
      db[k] = post; write(db);
    },
    remove: function (k) { var db = read(); delete db[k]; write(db); }
  };
  if (typeof module !== "undefined" && module.exports) module.exports = root.VFills;
})(typeof window !== "undefined" ? window : this);
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node tests/run.mjs`
Expected: PASS — antalet gröna ökar med 22 (från 687 till 709), 0 failed.

- [ ] **Step 5: Commit**

```bash
git add assets/fills.js tests/run.mjs
git commit -m "fills: modul for Drens egna kop- och saljkurser (lokal lagring)"
```

---

### Task 2: Ladda modulen och gör den offlinesäker

**Files:**
- Modify: `index.html` (skriptraden för `settings.js` i `<head>`)
- Modify: `sw.js` (`CACHE`-konstanten och `SHELL`-listan)
- Modify: `tests/theme.mjs` (SHELL-listan i kontrollen kring rad 260)

**Interfaces:**
- Consumes: `assets/fills.js` från Task 1.
- Produces: `window.VFills` finns när `app.js` körs.

- [ ] **Step 1: Write the failing test**

I `tests/theme.mjs`, hitta listan som innehåller `"assets/theme.js", "assets/settings.js", "assets/themes/base.css"` och lägg till `"assets/fills.js"` i den. Lägg dessutom denna kontroll direkt efter listan:

```js
// fills.js håller Drens lokala affärsdata och laddas i <head> som settings.js.
// Saknas den i SHELL fungerar inte inmatningen offline — samma fel som
// settings.js hade fram till 2026-08-02.
ok("index.html laddar fills.js", readFileSync(join(root, "index.html"), "utf8").includes("assets/fills.js"));
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/theme.mjs`
Expected: FAIL — `SHELL saknar assets/fills.js` och `index.html laddar fills.js`.

- [ ] **Step 3: Write the implementation**

I `index.html`, direkt efter raden som laddar `settings.js` i `<head>`:

```html
    <script src="assets/fills.js"></script>
```

I `sw.js`, lägg `"./assets/fills.js"` i `SHELL` direkt efter `"./assets/settings.js"`, och byt `CACHE`-raden samt lägg en kommentarrad överst i historiken:

```js
// v7 (2026-08-07): assets/fills.js tillkom (Drens egna köp-/säljkurser).
// SHELL innehåller en fil till, och install-steget körs bara när CACHE-namnet
// är nytt – utan bump saknar en enhet som redan installerat v6 filen offline.
const CACHE = "vecko-agent-v7";
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node tests/theme.mjs`
Expected: PASS, 0 failed.

- [ ] **Step 5: Commit**

```bash
git add index.html sw.js tests/theme.mjs
git commit -m "fills: ladda modulen i head och lagg den i service workerns SHELL"
```

---

### Task 3: Inmatningsraden på innehavskortet

**Files:**
- Modify: `assets/vrender.js` (`heldCard`, rad ~189)
- Modify: `tests/run.mjs`

**Interfaces:**
- Consumes: `VFills.keyFor` från Task 1.
- Produces: `VRender.fillRow(row, fill) -> string` (HTML), anropad inifrån `heldCard`.

- [ ] **Step 1: Write the failing test**

Lägg i `tests/run.mjs` efter Task 1:s tester:

```js
// Inmatningsraden på innehavskortet. Ren funktion, testas utan DOM.
const fr = VR.fillRow({ "Yahoo-ticker": "SAAB-B.ST", "Entry-datum": "2026-08-10", "Entry": "620,00 kr" }, null);
ok("fillRow: tom rad bjuder in till ifyllnad", fr.includes("data-fill-key=\"SAAB-B.ST|2026-08-10\"") && fr.includes("Vad betalade du?"));
ok("fillRow: tom rad är ingen varning", !/varning|fel|alert/i.test(fr));
const frFylld = VR.fillRow({ "Yahoo-ticker": "SAAB-B.ST", "Entry-datum": "2026-08-10", "Entry": "620,00 kr" },
  { kop: { kurs: 623.5, antal: 40 } });
ok("fillRow: visar din kurs", frFylld.includes("623,5") || frFylld.includes("623.5"));
ok("fillRow: visar antalet", frFylld.includes("40"));
ok("fillRow: liten avvikelse markeras inte", !frFylld.includes("fill-avvik"));
const frAvvik = VR.fillRow({ "Yahoo-ticker": "SAAB-B.ST", "Entry-datum": "2026-08-10", "Entry": "620,00 kr" },
  { kop: { kurs: 640, antal: 40 } });
ok("fillRow: avvikelse över 1 % markeras", frAvvik.includes("fill-avvik"));
ok("fillRow: rad utan nyckel renderas inte",
  VR.fillRow({ "Aktie": "Indexsleeve (XACT OMXS30)" }, null) === "");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/run.mjs`
Expected: FAIL — `VR.fillRow is not a function`.

- [ ] **Step 3: Write the implementation**

I `assets/vrender.js`, lägg funktionen direkt före `function heldCard(`:

```js
  /* Raden på innehavskortet där Dren fyller i vad han FAKTISKT betalade.
     Robotens entry och Drens ligger bredvid varandra. En avvikelse större än
     1 % markeras — informativt, inte som fel: att priset skiljer sig är
     normalt, det är bara värt att se. Ett TOMT fält är heller ingen varning;
     en nyss öppnad position är inte ett problem.
     Indexsleeven har ingen entry-datum-rad att nyckla på och får därför ingen
     inmatning, vilket är rätt — den är kapitalparkering, inte en affär. */
  function fillRow(row, fill) {
    var VF = (typeof window !== "undefined" && window.VFills) || null;
    var key = VF ? VF.keyFor(row) : null;
    if (!key) return "";
    var robot = numOf(strip(row["Entry"] || ""));
    var min = fill && fill.kop ? fill.kop.kurs : null;
    var antal = fill && fill.kop ? fill.kop.antal : null;
    if (min == null || !(min > 0)) {
      return `<div class="fill-row" data-fill-key="${esc(key)}">`
        + `<button type="button" class="fill-btn" data-fill-open="${esc(key)}">Vad betalade du?</button></div>`;
    }
    var avvik = (robot && robot > 0) ? Math.abs(min / robot - 1) * 100 : 0;
    var cls = avvik > 1 ? " fill-avvik" : "";
    return `<div class="fill-row${cls}" data-fill-key="${esc(key)}">`
      + `<span class="k">Du betalade</span>`
      + `<span class="v">${esc(nf(min))}${antal ? ` × ${esc(String(antal))}` : ""}</span>`
      + (avvik > 1 ? `<span class="fill-diff" title="Skillnad mot robotens entry">${esc(nf(avvik))} %</span>` : "")
      + `<button type="button" class="fill-btn" data-fill-open="${esc(key)}">Ändra</button></div>`;
  }
```

Om `numOf` eller `nf` inte redan finns i `vrender.js`, lägg dem bland de övriga hjälparna högst upp i filen:

```js
  function numOf(s){ var m = String(s||"").replace(/\s/g,"").replace(",",".").match(/-?\d+(?:\.\d+)?/); return m ? parseFloat(m[0]) : null; }
  function nf(n){ return (Math.round(n * 100) / 100).toString().replace(".", ","); }
```

Anropa den i `heldCard` direkt efter `</div>` som stänger `hold-grid`, alltså före `${gaugeStrip(live)}`:

```js
      ${fillRow(o, (typeof window !== "undefined" && window.VFills) ? window.VFills.get(window.VFills.keyFor(o)) : null)}
```

Exportera den i API-objektet längst ned i filen genom att lägga `fillRow` i listan efter `renderHoldings`.

- [ ] **Step 4: Run tests to verify they pass**

Run: `node tests/run.mjs`
Expected: PASS, 0 failed.

- [ ] **Step 5: Commit**

```bash
git add assets/vrender.js tests/run.mjs
git commit -m "fills: inmatningsrad pa innehavskortet med avvikelsemarkering"
```

---

### Task 4: Rutan för stängda affärer som saknar säljkurs

**Files:**
- Modify: `assets/vrender.js` (ny `renderFillsPending`)
- Modify: `index.html` (behållare i Översikt)
- Modify: `tests/run.mjs`

**Interfaces:**
- Consumes: `VFills.computeMyStats` från Task 1.
- Produces: `VRender.renderFillsPending(saknar) -> string`, renderas till `<div id="fillsPending">`.

- [ ] **Step 1: Write the failing test**

```js
// Rutan som gör en glömd säljkurs omöjlig att missa.
ok("renderFillsPending: tomt när inget saknas", VR.renderFillsPending([]) === "");
const fp = VR.renderFillsPending([
  { ticker: "SAAB-B.ST", key: "SAAB-B.ST|2026-08-10", vad: "sälj" },
  { ticker: "VOLV-B.ST", key: "VOLV-B.ST|2026-08-11", vad: "köp och sälj" }
]);
ok("renderFillsPending: rubrik i klarspråk med antal", fp.includes("2 affärer väntar på din säljkurs"));
ok("renderFillsPending: namnger tickrarna", fp.includes("SAAB-B.ST") && fp.includes("VOLV-B.ST"));
ok("renderFillsPending: knapp per affär", (fp.match(/data-fill-open=/g) || []).length === 2);
ok("renderFillsPending: singular när det är en",
  VR.renderFillsPending([{ ticker: "SAAB-B.ST", key: "k", vad: "sälj" }]).includes("1 affär väntar"));
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/run.mjs`
Expected: FAIL — `VR.renderFillsPending is not a function`.

- [ ] **Step 3: Write the implementation**

I `assets/vrender.js`, efter `fillRow`:

```js
  /* Stängda affärer som saknar Drens siffror. Rutan ligger kvar tills de är
     ifyllda — försvinner den av sig själv går säljkursen förlorad, och det är
     precis det som gör "Mina verkliga" omöjlig att lita på. Den ligger i
     Översikt under intradag-bannern: en signal är åtgärdbar NU, en saknad
     säljkurs är bokföring. */
  function renderFillsPending(saknar) {
    var lista = (saknar || []).filter(function (s) { return s && s.key; });
    if (!lista.length) return "";
    var n = lista.length;
    return `<div class="fills-pending"><div class="fp-head">`
      + `${n} affär${n === 1 ? "" : "er"} väntar på din säljkurs</div>`
      + `<div class="fp-list">` + lista.map(function (s) {
        return `<div class="fp-item"><b>${esc(s.ticker)}</b>`
          + `<span class="fp-what">saknar ${esc(s.vad)}</span>`
          + `<button type="button" class="fill-btn" data-fill-open="${esc(s.key)}">Fyll i</button></div>`;
      }).join("") + `</div></div>`;
  }
```

Exportera `renderFillsPending` i API-objektet.

I `index.html`, i Översikt-vyn direkt efter behållaren för intradag-bannern, lägg:

```html
        <div id="fillsPending"></div>
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node tests/run.mjs`
Expected: PASS, 0 failed.

- [ ] **Step 5: Commit**

```bash
git add assets/vrender.js index.html tests/run.mjs
git commit -m "fills: ruta i Oversikt for stangda affarer utan saljkurs"
```

---

### Task 5: Koppla in i appen — händelser, dialog och rendering

**Files:**
- Modify: `assets/app.js`
- Modify: `assets/themes/base.css`
- Modify: `tests/sim.mjs`

**Interfaces:**
- Consumes: `VFills` (Task 1), `VRender.fillRow` (Task 3), `VRender.renderFillsPending` (Task 4).
- Produces: klick på `[data-fill-open]` öppnar en inmatningsdialog; sparade värden renderas om direkt.

- [ ] **Step 1: Write the failing test**

Lägg i `tests/sim.mjs` efter blocket som verifierar Översikt:

```js
/* Mina verkliga affärer: rutan ska bara finnas när något faktiskt saknas, och
   inmatningen ska gå att öppna från innehavskortet. Med tom bok finns inga
   affärer alls, och då ska ingenting av detta synas — den tomma boken före
   v33-rotationen är ett giltigt läge, inte ett fel. */
dash.showView("oversikt");
if (nHold.length) {
  ok("fills: innehavskortet har en inmatningsknapp",
    doc.querySelectorAll("#holdings [data-fill-open]").length >= 1);
} else {
  ok("fills: tom bok visar ingen inmatning",
    doc.querySelectorAll("#holdings [data-fill-open]").length === 0);
}
ok("fills: behållaren för väntande affärer finns", !!doc.getElementById("fillsPending"));
ok("fills: inget väntar när inget är ifyllt", txt("fillsPending").trim() === "");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/sim.mjs`
Expected: FAIL — `fills: behållaren för väntande affärer finns` (elementet saknas tills Task 4 kört och app.js renderar dit).

- [ ] **Step 3: Write the implementation**

I `assets/app.js`, i metoden som renderar Översikt (den som sätter `holdings`), lägg efter att `holdings` satts:

```js
      /* Väntande affärer: robotens STÄNGDA rader minus det Dren fyllt i.
         Räknas per bok och slås ihop till en lista, eftersom rutan bara
         påminner – den redovisar ingen avkastning och blandar därför inga
         valutor. */
      if (root.VFills) {
        const stN = (S.portfolio && S.portfolio.history) || [];
        const stU = (S.portfolioUs && S.portfolioUs.history) || [];
        const db = root.VFills.all();
        const saknar = root.VFills.computeMyStats(db, stN, "nordic", 0).saknar
          .concat(root.VFills.computeMyStats(db, stU, "us", 0).saknar);
        const el = this.el("fillsPending");
        if (el) el.innerHTML = R.renderFillsPending(saknar);
      }
```

Lägg en delegerad klickhanterare där appens övriga `document.addEventListener("click", …)` finns:

```js
    /* Inmatningen. En prompt-dialog räcker: fälten är fyra, används sällan och
       ska inte kosta en modal med egen layout. Komma accepteras som
       decimaltecken – svensk inmatning skriver 623,50. */
    document.addEventListener("click", (e) => {
      const btn = e.target.closest && e.target.closest("[data-fill-open]");
      if (!btn || !root.VFills) return;
      const key = btn.getAttribute("data-fill-open");
      const [ticker] = key.split("|");
      const bok = (this.state.portfolioUs && (this.state.portfolioUs.history || [])
        .some(r => root.VFills.keyFor(r) === key)) ? "us" : "nordic";
      const num = (s) => { const n = parseFloat(String(s || "").replace(",", ".")); return isFinite(n) ? n : 0; };
      const nuv = root.VFills.get(key) || {};
      const kk = window.prompt(`${ticker} – vad betalade du per aktie?`, nuv.kop ? String(nuv.kop.kurs) : "");
      if (kk === null) return;
      const ka = window.prompt(`${ticker} – hur många aktier köpte du?`, nuv.kop ? String(nuv.kop.antal) : "");
      if (ka === null) return;
      root.VFills.setKop(key, { bok, kurs: num(kk), antal: num(ka) });
      const sk = window.prompt(`${ticker} – säljkurs per aktie? Lämna tomt om du inte sålt.`, nuv.salj ? String(nuv.salj.kurs) : "");
      if (sk) {
        const sa = window.prompt(`${ticker} – hur många aktier sålde du?`, nuv.salj ? String(nuv.salj.antal) : ka);
        root.VFills.setSalj(key, { kurs: num(sk), antal: num(sa) });
      }
      this.renderOversikt();
      this.renderBookStats();
    });
```

I `assets/themes/base.css`, lägg bland de övriga innehavsreglerna:

```css
/* Mina verkliga affärer. Tomt fält är en inbjudan, inte en varning – därför
   dämpad färg. Avvikelse > 1 % får accentfärg, fortfarande inte röd: att
   priset skiljer sig är normalt och ska bara vara synligt. */
.fill-row{display:flex;align-items:center;gap:.5rem;margin-top:.4rem;font-size:.86em;color:var(--muted)}
.fill-row .v{color:var(--fg);font-variant-numeric:tabular-nums}
.fill-row.fill-avvik .fill-diff{color:var(--accent);font-weight:600}
.fill-btn{background:none;border:1px solid var(--line);border-radius:var(--r-sm);
  padding:.1rem .5rem;color:inherit;font:inherit;font-size:.92em;cursor:pointer}
.fill-btn:hover{border-color:var(--accent);color:var(--accent)}
.fills-pending{border:1px solid var(--line);border-radius:var(--r-md);
  padding:.7rem .9rem;margin:0 0 1rem}
.fills-pending .fp-head{font-weight:600;margin-bottom:.4rem}
.fills-pending .fp-item{display:flex;align-items:center;gap:.6rem;padding:.2rem 0}
.fills-pending .fp-what{color:var(--muted);font-size:.9em}
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node tests/sim.mjs` och `node tests/theme.mjs`
Expected: båda PASS, 0 failed. `theme.mjs` kontrollerar att inga hårdkodade färger tillkommit i `base.css`.

- [ ] **Step 5: Commit**

```bash
git add assets/app.js assets/themes/base.css tests/sim.mjs
git commit -m "fills: inmatning, rendering och stil for egna kop-/saljkurser"
```

---

### Task 6: Läget "Mina verkliga" i Avkastning

**Files:**
- Modify: `index.html` (bokväljaren, rad ~242–244, och ett nytt `.book-block`)
- Modify: `assets/themes/base.css` (rad ~596–601)
- Modify: `assets/vrender.js` (`renderMyStats`)
- Modify: `assets/app.js` (`renderBookStats`)
- Modify: `tests/run.mjs`, `tests/sim.mjs`

**Interfaces:**
- Consumes: `VFills.computeMyStats` (Task 1).
- Produces: `VRender.renderMyStats(stats, bokLabel, valuta) -> string`.

- [ ] **Step 1: Write the failing test**

I `tests/run.mjs`:

```js
// Avkastningsblocket. KÄRNAN: det får aldrig visa ett tal som inte finns.
const msFull = VR.renderMyStats({ klara: 2, totalt: 2, saknar: [], avkastningPct: 14.44,
  kronor: 1300, investerat: 9000, perAffar: [{ ticker: "SAAB-B.ST", netto: 1000, pct: 16.7 }] }, "Nordiska", "kr");
ok("renderMyStats: visar avkastningen när allt är ifyllt", msFull.includes("14,44") || msFull.includes("14.44"));
ok("renderMyStats: visar kronorna", msFull.includes("1300") || msFull.includes("1 300"));
const msDel = VR.renderMyStats({ klara: 3, totalt: 5, saknar: [{ ticker: "X", vad: "sälj" }],
  avkastningPct: null, kronor: null, investerat: 0, perAffar: [] }, "Nordiska", "kr");
ok("renderMyStats: säger vad som fattas i stället för ett tal", msDel.includes("3 av 5"));
ok("renderMyStats: visar INGET procenttal vid halv data", !/\d+[,.]\d+\s*%/.test(msDel));
const msTom = VR.renderMyStats({ klara: 0, totalt: 0, saknar: [], avkastningPct: null,
  kronor: null, investerat: 0, perAffar: [] }, "Nordiska", "kr");
ok("renderMyStats: tom bok förklarar sig", msTom.includes("Inga stängda affärer"));
```

I `tests/sim.mjs`, i blocket med bokväljaren:

```js
ok("avkastning: bokväljaren har fyra knappar", doc.querySelectorAll("[data-book-set]").length === 4);
doc.querySelector('[data-book-set="mina"]').dispatchEvent(new window.Event("click", { bubbles: true }));
ok("mina verkliga: växeln fungerar", vy.getAttribute("data-book") === "mina");
ok("mina verkliga: blocket renderat", txt("myStatsNordic").length > 20 && txt("myStatsUs").length > 20);
doc.querySelector('[data-book-set="nordic"]').dispatchEvent(new window.Event("click", { bubbles: true }));
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `node tests/run.mjs` — FAIL: `VR.renderMyStats is not a function`.
Run: `node tests/sim.mjs` — FAIL: `avkastning: bokväljaren har fyra knappar` (den ger 3).

- [ ] **Step 3: Write the implementation**

I `assets/vrender.js`:

```js
  /* Drens verkliga utfall för EN bok. Den får ALDRIG visa ett tal som
     computeMyStats inte gav — är underlaget ofullständigt säger rutan hur
     många affärer som fattas. Samma regel som "Tillför urvalet något?": hellre
     "för tidigt" än en siffra som ser ut att betyda något. */
  function renderMyStats(s, bokLabel, valuta) {
    if (!s || !s.totalt) {
      return `<div class="empty">Inga stängda affärer i ${esc(bokLabel)} boken ännu – `
        + `dina siffror fylls i på innehavskortet i Översikt.</div>`;
    }
    if (s.avkastningPct == null) {
      return `<div class="empty">${s.klara} av ${s.totalt} affärer ifyllda – `
        + `fyll i resten för att se din avkastning.`
        + (s.saknar.length ? ` Saknas: ${s.saknar.map(function (x) { return esc(x.ticker); }).join(", ")}.` : "")
        + `</div>`;
    }
    var rader = s.perAffar.map(function (a) {
      return `<tr><td>${esc(a.ticker)}</td><td class="num">${esc(nf(a.netto))} ${esc(valuta)}</td>`
        + `<td class="num ${a.pct >= 0 ? "pos" : "neg"}">${esc(nf(a.pct))} %</td></tr>`;
    }).join("");
    return `<div class="stat-grid">`
      + `<div class="stat"><div class="stat-l">Din avkastning</div>`
      + `<div class="stat-v ${s.avkastningPct >= 0 ? "pos" : "neg"}">${esc(nf(s.avkastningPct))} %</div>`
      + `<div class="stat-s">på ${esc(nf(s.investerat))} ${esc(valuta)} investerat</div></div>`
      + `<div class="stat"><div class="stat-l">Netto</div>`
      + `<div class="stat-v ${s.kronor >= 0 ? "pos" : "neg"}">${esc(nf(s.kronor))} ${esc(valuta)}</div>`
      + `<div class="stat-s">efter courtage</div></div></div>`
      + `<table class="tbl"><thead><tr><th>Aktie</th><th class="num">Netto</th><th class="num">Utfall</th></tr></thead>`
      + `<tbody>${rader}</tbody></table>`;
  }
```

Exportera `renderMyStats` i API-objektet.

I `index.html` efter knappen `data-book-set="bada"`:

```html
            <button type="button" class="btn" data-book-set="mina" aria-pressed="false">Mina verkliga</button>
```

och ett nytt block bland de befintliga `.book-block`:

```html
          <div class="book-block" data-book="mina">
            <h3 class="sub">Mina verkliga affärer <span class="sub-date">sparas bara på den här enheten</span></h3>
            <h4 class="sub">Nordiska boken</h4>
            <div id="myStatsNordic"></div>
            <h4 class="sub">Amerikanska boken</h4>
            <div id="myStatsUs"></div>
          </div>
```

I `assets/themes/base.css`, utöka reglerna vid rad ~596:

```css
#view-avkastning .book-block[data-book="mina"]{display:none}
#view-avkastning[data-book="mina"] .book-block{display:none}
#view-avkastning[data-book="mina"] .book-block[data-book="mina"]{display:block}
```

I `assets/app.js`, i `renderBookStats()`, lägg sist:

```js
      /* Mina verkliga: en tabell per bok, aldrig en gemensam summa. Två
         separat finansierade böcker i olika valutor har ingen gemensam
         avkastning — samma skäl som gemensamt-läget utelämnar riskmått. */
      if (root.VFills) {
        const db = root.VFills.all();
        const kN = this.P.costFor("nordic", S.costs), kU = this.P.costFor("us", S.costs);
        const setEl = (id, html) => { const e = this.el(id); if (e) e.innerHTML = html; };
        setEl("myStatsNordic", R.renderMyStats(
          root.VFills.computeMyStats(db, (S.portfolio && S.portfolio.history) || [], "nordic", kN), "nordiska", "kr"));
        setEl("myStatsUs", R.renderMyStats(
          root.VFills.computeMyStats(db, (S.portfolioUs && S.portfolioUs.history) || [], "us", kU), "amerikanska", "USD"));
      }
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `node tests/run.mjs`, `node tests/sim.mjs`, `node tests/theme.mjs`
Expected: alla PASS, 0 failed.

- [ ] **Step 5: Commit**

```bash
git add index.html assets/vrender.js assets/app.js assets/themes/base.css tests/run.mjs tests/sim.mjs
git commit -m "fills: laget Mina verkliga i Avkastning, en tabell per bok"
```

---

### Task 7: Dokumentera i CLAUDE.md

**Files:**
- Modify: `CLAUDE.md` (avsnitt 3, efter stycket om `assets/settings.js`)

**Interfaces:**
- Consumes: allt ovan.
- Produces: inget kod-API.

- [ ] **Step 1: Verify the full suite is green first**

Run: `node tests/run.mjs && node tests/theme.mjs && node tests/sim.mjs`
Expected: alla PASS.

- [ ] **Step 2: Write the documentation**

Lägg i `CLAUDE.md` avsnitt 3, direkt efter stycket som börjar `- **Inställningar (sedan 2026-08-02):**`:

```markdown
- **Mina verkliga affärer (sedan 2026-08-07): `assets/fills.js` (`window.VFills`).** Systemet
  lägger inga ordrar – roboten skriver den VERIFIERADE kurs den såg när beslutet fattades, inte
  det pris Dren betalade. Skillnaden var betydelselös under pappersperioden och är kumulativ från
  den skarpa starten. Dren fyller i kurs + antal på innehavskortet i Översikt; en stängd affär
  utan säljkurs syns i rutan `#fillsPending` tills den är ifylld. **Lagring: `localStorage`,
  nyckel `vr_fills` – per enhet och webbläsare, som temat. Inget committas och det finns INGEN
  backup: rensad webbläsardata raderar allt.** Egen nyckel och inte `vr_settings`, vars
  "Återställ inställningar" gör `removeItem()` och annars hade tagit affärsdatan med sig.
  **Nyckeln är ticker + entry-datum** och fungerar i BÅDA tabellerna – innehavstabellen har en
  egen `Yahoo-ticker`-kolumn, historiktabellen bara tickern i parentes i `Aktie`. Utan den
  dubbelhanteringen tappas affären i samma sekund roboten flyttar den till historiken.
  **Två regler som inte får luckras upp:** (1) `computeMyStats` returnerar `null` för
  avkastningen när en enda affär saknas – vyn skriver "3 av 5 affärer ifyllda", aldrig ett tal,
  samma princip som `decision_eval`; (2) böckerna redovisas var för sig, ingen gemensam summa
  över SEK och USD. **`totalt` räknar bara STÄNGDA affärer** – räknades öppna positioner in i
  nämnaren skulle talet aldrig kunna visas. **Siffrorna MÄTER utfall men STYR inga beslut:**
  prompterna kör i Actions och kan inte läsa `localStorage`, så stop-loss och målkurs prövas
  fortsatt mot robotens entry. Läste besluten datan skulle två enheter med olika ifyllt ge
  olika signaler för samma position. Designen står i
  `docs/superpowers/specs/2026-08-07-mina-verkliga-affarer-design.md`.
```

- [ ] **Step 3: Commit**

```bash
git add CLAUDE.md
git commit -m "CLAUDE.md: dokumentera fills.js, nyckeln och regeln om halvt underlag"
```

---

## Self-Review

**Spec coverage:** Spec avsnitt 3 (omfattning) → Task 1–6. Avsnitt 4.1 nyckeln → Task 1 steg 3 (`tickerFrom`/`keyFor`). Avsnitt 4.2 formen → Task 1 `setKop`/`setSalj`. Avsnitt 4.3 egen nyckel → Global Constraints + Task 7. Avsnitt 5 beräkningen → Task 1. Avsnitt 5.1 ofullständigt underlag → Task 1 tester + Task 6 `renderMyStats`. Avsnitt 5.2 valutor isär → Task 1 `bok`-filtret + Task 6. Avsnitt 6.1 innehavskortet → Task 3. Avsnitt 6.2 rutan → Task 4. Avsnitt 6.3 Avkastning → Task 6. Avsnitt 7 konsekvenser → Task 7. Avsnitt 8 verifiering → tester i varje task; `sw.js`-kravet → Task 2.

**Placeholder scan:** inga TBD/TODO. Varje kodsteg har körbar kod.

**Type consistency:** `keyFor` returnerar `string|null` och används så i Task 3 (`if (!key) return ""`). `computeMyStats` returnerar `saknar[]` med `{ticker, key, vad}`, konsumerat med samma fältnamn i Task 4 och Task 6. `perAffar[]` bär `{ticker, netto, pct}`, läst med de namnen i Task 6.

**Verifierat före implementation:** `costFor(book, costs)` finns i `assets/vparse.js:696` och returnerar `roundTripPct + fxSpreadPct`. Växlingspåslaget ingår alltså automatiskt för US-boken, vilket är rätt — en USD-affär bär det åt båda håll.
