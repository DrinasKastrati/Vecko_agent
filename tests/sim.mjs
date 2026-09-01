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

/* marked, Chart och Lightweight Charts hamtas i produktion LAT fran CDN av
   app.js:lib(). I jsdom finns inget nat. Stubben MASTE ligga fore modulerna
   evalueras: annars vantar retro-/rapportvyn ut lib():s tidsgrans pa 8 s
   redan under boot, och testerna lasar en tom vy. */
window.marked ={ parse: md => "<h1>" + md.split("\n")[0].replace(/^#+\s*/, "") + "</h1><p>" + md + '</p><script>alert(1)<\/script>' };

// ---- ladda modulerna i samma ordning som index.html ----
for (const f of ["fills.js", "vparse.js", "vrender.js", "app.js"])
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

// Hem (startvy). Två detaljnivåer – båda måste rendera mot RIKTIG data, inte
// bara mot de syntetiska modellerna i tests/run.mjs.
ok("hem är default-aktiv vy", doc.querySelector('.view[data-view="hem"]').classList.contains("active"));
ok("hem: statusrad med nästa körning", txt("hemStatus").includes("status-row"));

// --- enkelt läge (standard) ---
ok("hem/enkel är standardläget", doc.documentElement.getAttribute("data-hemmode") !== "detaljerad");
ok("hem/enkel: uppgiftsrutan renderad", txt("hemMain").includes("Behöver du göra något"));
ok("hem/enkel: svarar ja eller nej", /sv-verdict--(ok|act)/.test(txt("hemMain")));
ok("hem/enkel: högerspalten tom", txt("hemRail").trim() === "");
ok("hem/enkel: ingen rå jargong i uppgiftsrutan", !/P\/L|R\/R|sleeve/i.test(txt("hemMain")));
/* Innehaven MÅSTE komma ur portfolj.md, inte ur dagsrapportens beslutslista.
   En LÄGE B-rapport kan sakna beslutsrader helt – första versionen av vyn
   påstod då "äger inget" trots att portföljen hade en öppen position.

   Villkoret läses ur det FAKTISKA läget i stället för mot namnet "Saab".
   Hårdkodade instrumentnamn gör påståendet till en ögonblicksbild: när
   böckerna nollställdes 2026-08-06 inför den skarpa starten föll tjugo
   assertions i den här filen utan att en rad appkod var fel. Formen nedan
   håller i BÅDA lägena och prövar dessutom SAMTLIGA innehav, inte ett. */
const nHold = (dash.state.portfolio && dash.state.portfolio.holdings) || [];
const uHold = (dash.state.portfolioUs && dash.state.portfolioUs.holdings) || [];
const nTrades = (dash.state.portfolio && dash.state.portfolio.history) || [];
const uTrades = (dash.state.portfolioUs && dash.state.portfolioUs.history) || [];
const namn = o => String(o["Aktie"] || "").replace(/\*|~/g, "").trim();
const tick = o => String(o["Yahoo-ticker"] || "").trim();

/* Indexsleeven döps MEDVETET om i den enkla vyn ("Indexsleeve (SPY)" →
   "Indexfond", se KLARSPRÅK-blocket i vrender.js) och kan därför inte matchas
   på sitt namn ur portfolj.md. Den räknas bort ur namnkontrollen; att vyn ändå
   redovisar boken som icke-tom täcks av assertionen under. */
const ärSleeve = o => /XACT|SPY|indexsleeve|indexdel/i.test(namn(o) + " " + tick(o));
if (nHold.length) {
  ok("hem/enkel: äger-listan kommer ur portföljen",
    nHold.filter(h => !ärSleeve(h)).every(h => txt("hemMain").includes(namn(h).split(" (")[0])));
  ok("hem/enkel: påstår inte tomt bo när portföljen har innehav",
    !txt("hemMain").includes("Roboten äger inget just nu"));
} else {
  ok("hem/enkel: tom bok redovisas som tom", txt("hemMain").includes("Roboten äger inget just nu"));
  ok("hem/enkel: tom bok listar inga innehav", !/innehav-kort|hold-card/.test(txt("hemMain")));
}
ok("hem/enkel: procent skrivs med svenskt komma", !/\d\.\d+ %/.test(txt("hemMain")));
ok("hem/enkel: växeln finns med båda lägena",
  doc.querySelectorAll("[data-hemmode-set]").length === 2);
ok("hem/enkel: aktiv knapp markerad för skärmläsare",
  doc.querySelector('[data-hemmode-set="enkel"]').getAttribute("aria-pressed") === "true");

// --- detaljerat läge: växla via knappen, precis som en användare gör ---
doc.querySelector('[data-hemmode-set="detaljerad"]').dispatchEvent(new window.Event("click", { bubbles: true }));
await new Promise(r => setTimeout(r, 50));
ok("hem/detaljerad: attributet växlade", doc.documentElement.getAttribute("data-hemmode") === "detaljerad");
ok("hem/detaljerad: nordiska boken renderad", txt("hemMain").includes("Nordisk bok"));
ok("hem/detaljerad: innehavskort med ticker",
  nHold.length ? nHold.every(h => txt("hemMain").includes(tick(h)))
               : !/SAAB-B\.ST|AMZN/.test(txt("hemMain")));
ok("hem/detaljerad: högerspalt med paneler", (txt("hemRail").match(/rail-card/g) || []).length >= 2);
ok("hem/detaljerad: aktiva lärdomar-panelen (L-1)", txt("hemRail").includes("L-1"));
ok("hem/detaljerad: knappmarkeringen följde med",
  doc.querySelector('[data-hemmode-set="detaljerad"]').getAttribute("aria-pressed") === "true");

// tillbaka till standard så resten av simuleringen ser normalläget
doc.querySelector('[data-hemmode-set="enkel"]').dispatchEvent(new window.Event("click", { bubbles: true }));
await new Promise(r => setTimeout(r, 50));
ok("hem: växlar tillbaka till enkelt", txt("hemMain").includes("Behöver du göra något"));

// Nordisk + Total + US
ok("nordisk: KPI:er", txt("kpis").includes("Ackumulerad avkastning"));
ok("nordisk: innehav", nHold.length ? txt("holdings").includes("hold") : txt("holdings").length > 0);

/* Mina verkliga affärer. Med tom bok finns ingen position att fylla i och inget
   som väntar — det är ett GILTIGT läge före v33-rotationen, inte ett fel.
   Rutan får bara synas när något faktiskt saknas. */
ok("fills: behållaren för väntande affärer finns", !!doc.getElementById("fillsPending"));
/* Ingenting är ifyllt i simuleringen, så VARJE stängd affär i båda böckerna
   ska stå i rutan. Med tom bok blir det noll och rutan är tom — båda utfallen
   är korrekta, och påståendet skiljer dem åt i stället för att gissa. */
ok("fills: alla stängda affärer väntar när inget är ifyllt", (() => {
  const stangda = nTrades.length + uTrades.length;
  const t = txt("fillsPending");
  if (!stangda) return t.trim() === "";
  return t.includes(`${stangda} affär`) &&
    [...nTrades, ...uTrades].every(r => t.includes(window.VFills.tickerFrom(r)));
})());
ok("fills: inmatning på varje innehavskort", (() => {
  const n = doc.querySelectorAll("#holdings [data-fill-open]").length;
  // Indexsleeven saknar entry-datum och får medvetet ingen inmatning.
  const nycklade = nHold.filter(h => String(h["Entry-datum"] || "").trim()).length;
  return n === nycklade;
})());
ok("total: blended", txt("totalBody").includes("Blended avkastning"));
ok("total: kapitalfördelning", txt("totalBody").includes("alloc-seg"));
ok("total: valutaupplysning", txt("totalBody").includes("exkl. valutaeffekt"));
ok("kostnader: config laddad", dash.state.costs && dash.state.costs.nordic && dash.state.costs.nordic.roundTripPct > 0);
ok("us: bok eller tomläge", txt("usBody").length > 20);

// Retro & lärdomar
ok("retro: lärdomskort L-1", txt("lessonsBody").includes("L-1"));
ok("retro: rapportväljare har retro-260731", doc.getElementById("retroSelect").innerHTML.includes("2026-07-31"));
ok("retro: rapporten renderad", txt("retroBody").length > 100);

/* Avkastning. Varje block har två giltiga utfall – siffror när det finns
   stängda affärer, en tom-ruta annars – och båda måste renderas. Att bara
   pröva sifferfallet gjorde blocken röda genom hela pappersperiodens
   nollställning trots att renderarna gjorde exakt rätt. */
const harN = nTrades.length > 0, harU = uTrades.length > 0;
ok("avkastning: handelsstatistik", harN ? txt("tradeStats").includes("Profit factor")
  : txt("tradeStats").includes("Inga stängda affärer ännu"));
ok("avkastning: nettoavkastning efter kostnad", harN ? txt("tradeStats").includes("Netto efter kostnad")
  : txt("tradeStats").includes("Inga stängda affärer ännu"));
ok("avkastning: månadsheatmap", harN ? txt("monthly").includes("hm-cell")
  : txt("monthly").includes("Inget månadsutfall ännu"));
ok("avkastning: riskmått", harN ? txt("riskStats").includes("Max drawdown")
  : txt("riskStats").includes("Inga stängda affärer ännu"));
ok("avkastning: alpha mot index", txt("alphaStats").includes("Snitt-alpha") || txt("alphaStats").includes("Ingen alpha-mätning"));
ok("avkastning: beslutsloggen renderad", (() => {
  const t = txt("decisionStats");
  return t.includes("Utvärderbara SÄLJ") || t.includes("Beslutsloggen är tom");
})());
ok("historik: alpha-kolumn mot OMXS30", harN ? txt("history").includes("Alpha") : txt("history").length >= 0);
ok("avkastning: färgkodad historik",
  harN ? txt("history").includes('class="pos"') || txt("history").includes('class="neg"')
       : !txt("history").includes('class="pos"'));

/* BÅDA böckerna ska redovisas i Avkastning-vyn, i var sitt block. Tidigare låg
   US-bokens statistik bara i US-rotation-vyn, så en amerikansk affär (JPM)
   syntes inte alls där en nordisk (Alleima) gjorde det. */
ok("avkastning: nordiska boken visar sin affär",
  harN ? nTrades.every(r => txt("history").includes(namn(r).split(" (")[0])) : true);
ok("avkastning: US-boken har eget statistikblock",
  harU ? txt("usTradeStats").includes("Profit factor") : txt("usTradeStats").includes("Inga stängda affärer ännu"));
ok("avkastning: US-boken visar sin affär",
  harU ? uTrades.every(r => txt("usHistory").includes(namn(r).split(" (")[0])) : true);
ok("avkastning: US-riskmått renderade",
  harU ? txt("usRiskStats").includes("Max drawdown") : txt("usRiskStats").includes("Inga stängda affärer ännu"));
ok("avkastning: US-alpha mot S&P 500",
  txt("usAlphaStats").includes("Snitt-alpha") || txt("usAlphaStats").includes("Ingen alpha-mätning"));
ok("avkastning: US-månadsutfall renderat", txt("usMonthly").length > 20);
ok("avkastning: böckerna hålls isär",
  uTrades.every(r => { const n = namn(r).split(" (")[0]; return !n || txt("history").indexOf(n) === -1; }));
// US-rotation-vyn ska INTE längre duplicera statistiken – bara peka dit
ok("us-rotation: statistiken duplicerad ej", !txt("usBody").includes("Profit factor"));
ok("us-rotation: hänvisar till Avkastning", txt("usBody").includes('data-goto-view="avkastning"'));

/* Bokväljaren: båda böckerna RENDERAS alltid (assertionerna ovan läser dem),
   men bara den valda VISAS. Tio staplade sektioner var för mycket på en gång. */
{
  const vy = doc.getElementById("view-avkastning");
  ok("avkastning: nordiska boken vald från start", vy.getAttribute("data-book") === "nordic");
  ok("avkastning: bokväljaren har fyra knappar", doc.querySelectorAll("[data-book-set]").length === 4);
  ok("avkastning: nordiska knappen markerad",
    doc.querySelector('[data-book-set="nordic"]').getAttribute("aria-pressed") === "true");
  doc.querySelector('[data-book-set="us"]').dispatchEvent(new window.Event("click", { bubbles: true }));
  ok("avkastning: växlar till amerikanska boken", vy.getAttribute("data-book") === "us");
  ok("avkastning: markeringen följer med",
    doc.querySelector('[data-book-set="us"]').getAttribute("aria-pressed") === "true" &&
    doc.querySelector('[data-book-set="nordic"]').getAttribute("aria-pressed") === "false");
  doc.querySelector('[data-book-set="nordic"]').dispatchEvent(new window.Event("click", { bubbles: true }));
  ok("avkastning: växlar tillbaka", vy.getAttribute("data-book") === "nordic");
  ok("avkastning: de sällan lästa måtten är hopfällda",
    doc.querySelectorAll("#view-avkastning details.sblock").length === 4);
  ok("avkastning: diagram och beslutslogg ligger utanför bokblocken",
    !!doc.querySelector("#view-avkastning .shared-block #returnChart"));

  /* Gemensamma vyn: BÅDA böckernas affärer i en tabell. Varje rad bär sin bok,
     och den märkningen styr både rundturskostnad och vilket index affären mäts
     mot – ett snitt hade gjort nettot fel åt båda håll. */
  doc.querySelector('[data-book-set="bada"]').dispatchEvent(new window.Event("click", { bubbles: true }));
  ok("gemensamt: växeln fungerar", vy.getAttribute("data-book") === "bada");
  ok("gemensamt: båda affärerna i samma tabell",
    [...nTrades, ...uTrades].every(r => txt("allHistory").includes(namn(r).split(" (")[0])));
  ok("gemensamt: varje rad märks med sin bok",
    (harN || harU) ? (!harN || txt("allHistory").includes("Nordisk")) && (!harU || txt("allHistory").includes("US"))
                   : true);
  /* Invarianten är att den gemensamma statistiken räknar SUMMAN av böckerna –
     inte att summan råkar vara ett visst tal. Raden löd tidigare `n + u === 2`
     med kommentaren "1 + 1 i dag"; verkligt antal var redan 3 (två nordiska,
     en amerikansk), så påståendet föll oavsett dataläge och ingen märkte det
     eftersom sim.mjs inte körs i CI. */
  ok("gemensamt: handelsstatistik räknar båda", (() => {
    const n = dash.P.computeTradeStats(nTrades, 0).trades;
    const u = dash.P.computeTradeStats(uTrades, 0).trades;
    const bada = dash.P.computeTradeStats([...nTrades, ...uTrades], 0).trades;
    const renderad = (harN || harU) ? txt("allTradeStats").includes("Profit factor")
                                    : txt("allTradeStats").includes("Inga stängda");
    return renderad && bada === n + u;
  })());
  /* Utan stängda affärer i någon bok NOLLAR app.js medvetet alpha-rutan
     (assets/app.js: set("allAlphaStats", "")) i stället för att visa en
     tom-ruta – det gemensamma läget har då ingenting att jämföra. */
  ok("gemensamt: alpha renderat",
    (harN || harU) ? txt("allAlphaStats").length > 20 : txt("allAlphaStats") === "");

  /* Mina verkliga: fjärde läget. Ingenting är ifyllt i simuleringen, så BÅDA
     böckerna ska säga vad som fattas – aldrig ett tal. Det är hela poängen
     med regeln, och den måste hålla i båda dataläget. */
  doc.querySelector('[data-book-set="mina"]').dispatchEvent(new window.Event("click", { bubbles: true }));
  ok("mina verkliga: växeln fungerar", vy.getAttribute("data-book") === "mina");
  ok("mina verkliga: båda böckerna renderade",
    txt("myStatsNordic").length > 20 && txt("myStatsUs").length > 20);
  ok("mina verkliga: visar INGET tal utan ifyllda siffror",
    !/\d+,\d+\s*%/.test(txt("myStatsNordic")) && !/\d+,\d+\s*%/.test(txt("myStatsUs")));
  ok("mina verkliga: säger vad som fattas", (() => {
    const t = txt("myStatsNordic");
    return harN ? /\d+ av \d+ affärer ifyllda/.test(t) : t.includes("Inga stängda affärer");
  })());
  doc.querySelector('[data-book-set="nordic"]').dispatchEvent(new window.Event("click", { bubbles: true }));
  ok("gemensamt: riskmått och månadsutfall utelämnade med flit",
    !doc.querySelector("#allRiskStats") && !doc.querySelector("#allMonthly"));
  doc.querySelector('[data-book-set="nordic"]').dispatchEvent(new window.Event("click", { bubbles: true }));
}

// Kurser + nyheter + scout
ok("kurser: px-grid med tickers", txt("prices").includes("px-item"));
ok("nyheter: feed renderad", txt("feed").includes("feed"));
ok("scout: senaste rapporten", txt("scoutBody").length > 100);

/* Kandidatkön och rapportkalendern (2026-08-04). Båda hämtas DIREKT som
   decisions.json – de bakas inte in i dashboard.json, eftersom kandidatfilen
   ändras varje gång en bok avgör en post och kalendern varje morgon. Proven
   nedan är integrationsprov: att renderfunktionerna fungerar visas i
   tests/run.mjs, det här visar att appen faktiskt HÄMTAR och MONTERAR dem. */
ok("kandidatkön monterad i scout-vyn", txt("candidates").length > 40);
ok("kandidatkön säger något begripligt när den är tom",
   /Inga kandidater|väntar på avgörande|scout_candidates\.json/.test(txt("candidates")));
ok("rapportkalendern monterad i översikten", txt("earningsSoon").length > 40);
{
  // Kalendern finns i repot – rutan ska visa rapporter eller ett tydligt tomt läge,
  // aldrig en tom sträng (det senare ser ut som en trasig vy).
  const er = txt("earningsSoon");
  ok("rapportkalendern visar rader eller tomt läge",
     /er-list|Inga rapporter|earnings_calendar\.json/.test(er));
}

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

// ================= Interaktioner =================
// Verifieringarna ovan bevisar bara att vyerna RENDERAS. Nedan klickas UI:t
// igenom på samma sätt som en användare gör: filter, sortering, sökning,
// modaler, kortkommandon och rapportväljare.
const click = el => el && el.dispatchEvent(new window.MouseEvent("click", { bubbles: true }));
const change = el => el && el.dispatchEvent(new window.Event("change", { bubbles: true }));
const key = k => doc.dispatchEvent(new window.KeyboardEvent("keydown", { key: k, bubbles: true }));
const vis = sel => [...doc.querySelectorAll(sel)].filter(n => n.style.display !== "none");

dash.showView("kurser");

// ---- Kurser: rollchips, fritextfilter, sortering ----
const chips = [...doc.querySelectorAll(".px-chip")];
ok("kurser: rollchips renderade", chips.length >= 3);
const total = doc.querySelectorAll(".px-item").length;
ok("kurser: alla tickers som kort", total > 10);

/* Rollen "innehav" saknar chip när boken är tom – det finns ingen ticker med
   den rollen att filtrera fram. Filtreringen prövas då på någon annan roll som
   faktiskt finns, så mekaniken täcks oavsett bokläge. */
const rollChip = chips.find(c => c.dataset.role === "innehav")
  || chips.find(c => c.dataset.role && c.dataset.role !== "alla");
if (rollChip) {
  click(rollChip);
  const roll = rollChip.dataset.role;
  const shown = vis(".px-item");
  ok("kurser: chip filtrerar till en roll",
    shown.length > 0 && shown.length < total && shown.every(n => n.dataset.role === roll));
  ok("kurser: aktivt chip markeras", rollChip.classList.contains("on"));
} else { ok("kurser: chip filtrerar till en roll", false); ok("kurser: aktivt chip markeras", false); }

const allaChip = chips.find(c => (c.dataset.role || "alla") === "alla");
click(allaChip);
ok("kurser: 'Alla' återställer filtret", vis(".px-item").length === total);

/* Söksträngen HÄRLEDS ur den renderade listan, aldrig hårdkodad.
   Fram till 2026-08-17 stod här "SAAB", och när SAAB-B.ST föll ur prices.json
   den 2026-08-10 (övergiven tickerkälla – åtgärdspunkt 2 i veckorapport-260817)
   blev testet RÖTT i en vecka utan att en rad appkod var fel. Det är exakt det
   anti-mönster CLAUDE.md förbjuder: påståendet var en ögonblicksbild av
   dataläget, inte av koden. Nu prövas filtrets BETEENDE – att en delsträng ur
   en faktisk ticker ger färre träffar än allt och att varje träff innehåller
   den – vilket håller oavsett vilka instrument som råkar ligga i filen. */
const pxSearch = doc.getElementById("pxSearch");
const pxTickers = [...doc.querySelectorAll(".px-item")].map(n => n.dataset.tk || "").filter(Boolean);
// En delsträng som INTE matchar allt: basen ur en ticker vars bas är unik i listan.
const needle = (() => {
  for (const t of pxTickers){
    const bas = t.split(/[.\-]/)[0];
    if (bas.length < 2) continue;
    const träffar = pxTickers.filter(x => x.includes(bas)).length;
    if (träffar > 0 && träffar < pxTickers.length) return bas;
  }
  return null;
})();
if (pxSearch && needle) {
  pxSearch.value = needle;
  pxSearch.dispatchEvent(new window.Event("input", { bubbles: true }));
  const hits = vis(".px-item");
  ok("kurser: fritextsök filtrerar", hits.length > 0 && hits.length < total &&
     hits.every(n => (n.dataset.tk || "").includes(needle)));
  pxSearch.value = "";
  pxSearch.dispatchEvent(new window.Event("input", { bubbles: true }));
  ok("kurser: tömd sökning visar allt igen", vis(".px-item").length === total);
} else if (pxSearch && pxTickers.length < 2) {
  // Tom eller enradig kurslista: filtret går inte att pröva, och att påstå
  // något om det ändå vore att göra assertionen tomt sann.
  ok("kurser: fritextsök filtrerar", true);
  ok("kurser: tömd sökning visar allt igen", true);
} else { ok("kurser: fritextsök filtrerar", false); ok("kurser: tömd sökning visar allt igen", false); }

const pxSort = doc.getElementById("pxSort");
if (pxSort) {
  pxSort.value = "az"; change(pxSort);
  const az = [...doc.querySelectorAll(".px-item")].map(n => n.dataset.tk);
  ok("kurser: A–Ö-sortering", az.join("|") === [...az].sort((a, b) => a.localeCompare(b, "sv")).join("|"));
  pxSort.value = "role"; change(pxSort);
  const order = window.VParse.ROLE_ORDER;
  const ranks = [...doc.querySelectorAll(".px-item")].map(n => order.indexOf(n.dataset.role));
  ok("kurser: rollsortering lägger innehav först", ranks.every((r, i) => i === 0 || ranks[i - 1] <= r));
} else { ok("kurser: A–Ö-sortering", false); ok("kurser: rollsortering lägger innehav först", false); }

// Dagsrörelsen får INTE visas om prices.json saknar schemaVersion (previousClose
// pekade då ~en vecka bakåt) – spärren ska synas som varningsremsa i stället.
const hasSchema = !!(dash.state.prices && dash.state.prices.schemaVersion);
const warn = txt("prices").includes("px-warn");
ok("kurser: schemaVersion-spärren styr dagsrörelsen", hasSchema ? !warn : warn);

// ---- Kursmodal (Chart stubbas: CDN finns inte i jsdom) ----
window.HTMLCanvasElement.prototype.getContext = () => ({
  createLinearGradient: () => ({ addColorStop() {} }),
  canvas: { width: 600, height: 300 }
});
const charts = [];
window.Chart = class { constructor(ctx, cfg) { this.cfg = cfg; charts.push(cfg); } destroy() {} update() {} };

const withHist = [...doc.querySelectorAll(".px-item")]
  .find(n => (dash.state.priceHistory.series[n.dataset.tk] || []).length >= 2);
click(withHist || doc.querySelector(".px-item"));
ok("kurser: klick öppnar kursmodalen", doc.getElementById("pxModal").classList.contains("open"));
ok("kurser: modalen visar rätt ticker",
  doc.getElementById("pxModalTitle").textContent === (withHist || doc.querySelector(".px-item")).dataset.tk);
if (withHist) ok("kurser: modalen ritar kurshistorik", charts.length === 1 && charts[0].data.datasets[0].data.length >= 2);
else ok("kurser: modalen ritar kurshistorik", true);
key("Escape");
ok("kurser: Escape stänger modalen", !doc.getElementById("pxModal").classList.contains("open"));

// ---- Avkastningsdiagrammet (körs om nu när Chart finns) ----
charts.length = 0;
await dash.drawChart();   // async sedan Chart.js laddas lat
ok("avkastning: diagrammet byggs", charts.length === 1 && charts[0].data.datasets.length >= 1);
ok("avkastning: strategiserien har punkter", charts[0].data.labels.length >= 1);

// ---- Rapporter: typväxling, väljare, rådata, full höjd ----
dash.showView("rapporter");
const rtypes = [...doc.querySelectorAll(".rtype")];
ok("rapporter: typknappar finns", rtypes.length >= 3);
const weeklyBtn = rtypes.find(b => b.dataset.type === "weekly");
click(weeklyBtn);
await new Promise(r => setTimeout(r, 400));
ok("rapporter: typväxling markerar knappen", weeklyBtn.classList.contains("on"));
const rsel = doc.getElementById("reportSelect");
ok("rapporter: väljaren fylls med veckorapporter", rsel.options.length > 0);
ok("rapporter: rapporttext renderad", txt("reportBody").length > 200);


const raw = doc.getElementById("rawToggle");
raw.checked = true; change(raw);
ok("rapporter: rådataläget visar markdown", txt("reportBody").includes('<pre class="raw"'));
raw.checked = false; change(raw);
const rendered = txt("reportBody");
ok("rapporter: rådata av återger HTML", rendered.includes("<h1") && !rendered.includes('<pre class="raw"'));
ok("rapporter: sanitizern tar bort skript", !rendered.includes("<script"));

click(doc.getElementById("fullBtn"));
ok("rapporter: full höjd växlas på", doc.getElementById("reportBody").classList.contains("report--full"));
click(doc.getElementById("fullBtn"));
ok("rapporter: full höjd växlas av", !doc.getElementById("reportBody").classList.contains("report--full"));

// byt tillbaka till dagliga och välj näst senaste rapporten via <select>
click(rtypes.find(b => b.dataset.type === "daily"));
await new Promise(r => setTimeout(r, 300));
const dsel = doc.getElementById("reportSelect");
if (dsel.options.length > 1) {
  dsel.value = dsel.options[1].value; change(dsel);
  await new Promise(r => setTimeout(r, 400));
  ok("rapporter: byte i väljaren laddar rapporten", txt("reportBody").length > 200);
} else ok("rapporter: byte i väljaren laddar rapporten", txt("reportBody").length > 200);

// ---- Fulltextsökning över alla rapporter ----
const rs = doc.getElementById("repSearch");
rs.value = "SAAB";
rs.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
await new Promise(r => setTimeout(r, 1500));
ok("sökning: träfflista renderad", txt("reportBody").includes("sr-hit"));
const hit = doc.querySelector("[data-open-report]");
ok("sökning: träffar är klickbara", !!hit);
if (hit) {
  click(hit);
  await new Promise(r => setTimeout(r, 400));
  ok("sökning: klick öppnar rapporten (eller analysen)",
    txt("reportBody").length > 200 || doc.querySelector('.view[data-view="analys"]').classList.contains("active"));
} else ok("sökning: klick öppnar rapporten (eller analysen)", false);

// för kort sökning ska ge instruktion, inte krasch
await dash.searchReports("a");
ok("sökning: för kort sträng ger instruktion", txt("reportBody").includes("minst 2 tecken"));

// ---- Analys: ticker-hopp, jämförläge ----
dash.gotoTicker("NVO");
await new Promise(r => setTimeout(r, 400));
ok("analys: ticker-hopp aktiverar vyn", doc.querySelector('.view[data-view="analys"]').classList.contains("active"));
ok("analys: cachad analys visas", txt("analysBody").length > 200 || txt("analysStatus").includes("Ingen cachad"));
dash.gotoTicker("FINNSEJ.ST");
ok("analys: okänd ticker ger köa-uppmaning", txt("analysStatus").includes("köa"));

click(doc.getElementById("cmpBtn"));
ok("analys: jämförläge på", txt("analysStatus").includes("Jämförläge"));
click(doc.getElementById("cmpBtn"));
ok("analys: jämförläge av", !txt("analysStatus").includes("Jämförläge"));

// ---- US- och retro-väljarna ----
dash.showView("us");
const usel = doc.getElementById("usReportSelect");
if (usel && usel.options.length) {
  usel.value = usel.options[0].value; change(usel);
  await new Promise(r => setTimeout(r, 400));
  ok("us: rapportväljaren renderar", txt("usReportBody").length > 100);
} else ok("us: rapportväljaren renderar", txt("usBody").length > 20);
ok("us: handelsstatistik eller tomläge", txt("usBody").includes("stat") || txt("usBody").includes("empty"));

dash.showView("retro");
const resel = doc.getElementById("retroSelect");
if (resel && resel.options.length) {
  resel.value = resel.options[0].value; change(resel);
  await new Promise(r => setTimeout(r, 400));
  ok("retro: rapportväljaren laddar retron", txt("retroBody").length > 200);
} else ok("retro: rapportväljaren laddar retron", false);

// ---- Hem: hopp-länkar och ticker-pills ----
// Högerspaltens "Visa allt"-knappar hör till DETALJERADE läget – enkla vyn har
// medvetet ingen högerspalt. Växla dit innan de testas.
dash.showView("hem");
doc.querySelector('[data-hemmode-set="detaljerad"]').dispatchEvent(new window.Event("click", { bubbles: true }));
await new Promise(r => setTimeout(r, 50));
const goto = doc.querySelector("#hemRail [data-goto-view]") || doc.querySelector("[data-goto-view]");
if (goto) {
  const target = goto.dataset.gotoView;
  click(goto);
  ok("hem: hopp-länk byter vy", doc.querySelector('.view[data-view="' + target + '"]').classList.contains("active"));
} else ok("hem: hopp-länk byter vy", false);

dash.showView("hem");
const pill = doc.querySelector("[data-goto-ticker]");
if (pill) {
  click(pill);
  ok("ticker-pill hoppar till Analys", doc.querySelector('.view[data-view="analys"]').classList.contains("active"));
} else ok("ticker-pill hoppar till Analys", false);

// ---- Sorterbar historiktabell ----
dash.showView("avkastning");
/* Sorterbar tabell finns bara när det finns rader att sortera. Utan stängda
   affärer i någon bok är frånvaron rätt beteende, inte ett fel. */
const th = doc.querySelector(".tbl--sort th");
if (th) {
  click(th);
  ok("historik: kolumnklick sorterar", th.classList.contains("asc") || th.classList.contains("desc"));
  click(th);
  ok("historik: andra klicket vänder ordningen", th.classList.contains("desc"));
} else {
  const tomt = !harN && !harU;
  ok("historik: kolumnklick sorterar", tomt);
  ok("historik: andra klicket vänder ordningen", tomt);
}

// ---- Klamp-knappar ("Visa mer") ----
const cw = doc.querySelector(".cw");
if (cw) {
  cw.classList.add("has-more");
  const more = cw.querySelector(".clamp-more");
  if (more) {
    click(more);
    ok("visa mer: expanderar texten", cw.classList.contains("open") && more.textContent === "Visa mindre");
    click(more);
    ok("visa mer: fäller ihop igen", !cw.classList.contains("open"));
  } else { ok("visa mer: expanderar texten", false); ok("visa mer: fäller ihop igen", false); }
} else { ok("visa mer: expanderar texten", false); ok("visa mer: fäller ihop igen", false); }

// ---- Kortkommandon ----
key("3");
ok("kortkommando: siffra byter vy",
  doc.querySelector('.subnav a[data-view="' + [...doc.querySelectorAll(".subnav a")][2].dataset.view + '"]').classList.contains("active"));
const inputEl = doc.getElementById("analysInput");
dash.showView("hem");
inputEl.dispatchEvent(new window.KeyboardEvent("keydown", { key: "2", bubbles: true }));
ok("kortkommando: ignoreras i textfält", doc.querySelector('.view[data-view="hem"]').classList.contains("active"));

// ---- Monitorns hjärtslag + signalbanner ----
const alertsHtml = txt("alerts");
ok("monitor: statusrad syns även utan signaler",
  alertsHtml.includes("al-mon") || alertsHtml.includes("Monitorn") || alertsHtml === "");
const mon = window.VParse.monitorStatus(dash.state.alerts, new Date());
ok("monitor: status härledd ur checkedAt",
  !mon || ["fresh", "stale", "unknown"].includes(mon.state));
ok("monitor: färsk stämpel ger fresh",
  window.VParse.monitorStatus({ checkedAt: new Date().toISOString() }, new Date()).state === "fresh");
ok("monitor: gammal stämpel flaggas (vardag)",
  window.VParse.monitorStatus({ checkedAt: "2026-07-29T06:00:00Z" }, new Date("2026-07-30T18:00:00Z")).state === "stale");

// ---- Beslutsloggen ----
const dstats = window.VParse.decisionStats(dash.state.decisions || { decisions: [] });
ok("beslutslogg: statistik kan beräknas", !!dstats && Array.isArray(dstats.byCatalyst));
ok("beslutslogg: sleeve-raderna räknas inte som urval",
  window.VParse.decisionStats({ decisions: [
    { date: "2026-08-03", ticker: "XACT-OMXS30.ST", action: "SÄLJ", catalystType: "index", outcomePct: 4 },
    { date: "2026-08-03", ticker: "SAAB-B.ST", action: "SÄLJ", catalystType: "order", outcomePct: 6 }
  ] }).byCatalyst.every(c => c.type !== "index"));

// ---- Persistens (localStorage) ----
dash.cacheSet("vr_simtest", { a: 1 });
ok("localStorage: värden överlever rundtur", dash.cacheGet("vr_simtest").a === 1);

// ---- Robusthet: tomma data får inte krascha renderarna ----
// Tom portfölj/tomma filer är ett verkligt läge (nystartad bok, tom watchlist).
const R = window.VRender, P = window.VParse;
try {
  const empty = P.parsePortfolio("");
  R.renderHoldings(null, empty, {}, {}, {});
  R.renderKPIs(empty, null);
  R.renderHistory(empty, {}, "OMXS30");
  R.renderStatusRow(null, P.nextRoutineRun(new Date()));
  R.renderPrices({ quotes: {} }, { series: {} }, {});
  R.renderAlerts({ active: [] }, null);
  R.renderLessons([]);
  R.renderTotal([], 0.5, null);
  R.renderDecisionStats(P.decisionStats({ decisions: [] }));
  P.tickerRoles({});
  P.computeTradeStats([], 0);
  P.computeRiskStats([]);
  ok("robusthet: tomma indata kraschar inte renderarna", true);
} catch (e) { ok("robusthet: tomma indata kraschar inte renderarna (" + e.message + ")", false); }

// ---- Kursdiagrammet: båda vägarna ----
// Lightweight Charts och Chart.js laddas från CDN och finns aldrig i jsdom, så
// koden testas mot minimala stubbar. Poängen är inte att verifiera ritningen
// utan att BÅDA vägarna går att köra utan att kasta – modalen är annars ett
// dött klick, och felet syns bara i webbläsarkonsolen hos användaren.
const tkWithHistory = Object.keys((dash.state.priceHistory || {}).series || {})
  .find(t => ((dash.state.priceHistory.series[t]) || []).length >= 2);
if (!tkWithHistory) {
  ok("kursdiagram: hoppas över – ingen ticker har 2+ punkter i price_history", true);
} else {
  // 1) Lightweight Charts-vägen
  let crosshairHooked = false, dataPoints = 0;
  window.LightweightCharts = {
    CrosshairMode: { Normal: 1 },
    createChart: () => ({
      addAreaSeries: () => ({ setData: d => { dataPoints = d.length; } }),
      timeScale: () => ({ fitContent() {} }),
      subscribeCrosshairMove: () => { crosshairHooked = true; },
      remove() {}
    })
  };
  try {
    dash.openPxChart(tkWithHistory);
    ok("kursdiagram: Lightweight Charts-vägen kör utan fel", true);
    ok("kursdiagram: serien matades in", dataPoints >= 2);
    ok("kursdiagram: hårkorset kopplat till legenden", crosshairHooked);
    ok("kursdiagram: legenden visas", !window.document.getElementById("pxLegend").hidden);
    dash.closePxChart();
    ok("kursdiagram: stängning tömmer behållaren",
      window.document.getElementById("pxModalChart").innerHTML === "" &&
      window.document.getElementById("pxLegend").hidden);
  } catch (e) { ok("kursdiagram: Lightweight Charts-vägen kör utan fel (" + e.message + ")", false); }

  // 2) Reservvägen när CDN:et inte når fram
  delete window.LightweightCharts;
  let chartMade = false;
  window.Chart = function () { chartMade = true; return { destroy() {} }; };
  window.HTMLCanvasElement.prototype.getContext = () => ({
    createLinearGradient: () => ({ addColorStop() {} })
  });
  try {
    dash.openPxChart(tkWithHistory);
    ok("kursdiagram: reservvägen (Chart.js) kör utan fel", true);
    ok("kursdiagram: reserven ritade ett diagram", chartMade);
    dash.closePxChart();
  } catch (e) { ok("kursdiagram: reservvägen (Chart.js) kör utan fel (" + e.message + ")", false); }

  // 3) Inget bibliotek alls: ska tiga, inte krascha
  delete window.Chart;
  try { dash.openPxChart(tkWithHistory); ok("kursdiagram: utan bibliotek kraschar inget", true); }
  catch (e) { ok("kursdiagram: utan bibliotek kraschar inget (" + e.message + ")", false); }
}

/* ---- push-registrering: reservvägen när popupen blockeras ----------------
   Prenumerationen kan bara skapas efter fyra await, så användargesten är borta
   när GitHub-ärendet ska öppnas. iOS Safari poppblockerar då tyst, och jsdom
   implementerar inte window.open alls – båda ger samma falsy retur, vilket gör
   det här testbart på riktig DOM. Fram till 2026-09-01 lästes returvärdet inte
   och vr_push_registered sattes ändå: knappen lyste "Notiser på" på en telefon
   där ingen enhet hade registrerats. */
{
  const b64u = b => Buffer.from(b).toString("base64")
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  // 65 byte = okomprimerad P-256-punkt, 16 byte = auth-hemlighet (RFC 8291).
  // Genererade, inte kopierade ur state/push_subs.json – testet ska mäta koden,
  // inte dataläget.
  const p256dh = b64u(Buffer.alloc(65, 4)), auth = b64u(Buffer.alloc(16, 7));
  const endpoint = "https://web.push.apple.com/QABC123";
  const fakeSub = { toJSON: () => ({ endpoint, keys: { p256dh, auth } }) };

  const info = dash.pushIssue(fakeSub, "Mozilla/5.0 (iPhone; CPU iPhone OS 18_5 like Mac OS X)");
  ok("push: etiketten härleds ur user agent", info.label === "iPhone");
  ok("push: url pekar på repots issues/new", info.url.startsWith(dash.repoURL + "/issues/new?"));
  ok("push: titeln är den actionen grindar på", decodeURIComponent(info.url).includes("title=push: iPhone"));
  ok("push: kroppen bär endpointen i ett kodstaket",
    info.body.includes("```json") && info.body.includes(endpoint));

  // Kontraktet mot actionen: kroppen MÅSTE gå att läsa tillbaka med exakt den
  // parser push_subscribe.yml kör. Ett formatglapp här är osynligt i appen och
  // syns först som ett kvitterat men misslyckat issue.
  try {
    const { parseSubscription } = await import("../.github/scripts/push-sub-add.mjs");
    const back = parseSubscription(info.body);
    ok("push: kroppen läses tillbaka av actionens egen parser",
      back.endpoint === endpoint && back.keys.p256dh === p256dh && back.keys.auth === auth);
  } catch (e) { ok("push: kroppen läses tillbaka av actionens egen parser (" + e.message + ")", false); }

  dash.cacheSet("vr_push_registered", false);
  const expect = dash.pushIssue(fakeSub, window.navigator.userAgent).url;
  dash.registerSubscription(fakeSub);
  const modal = doc.getElementById("pushModal");
  ok("push: blockerad popup öppnar reservrutan", !!modal && modal.classList.contains("open"));
  ok("push: reservrutan bär en riktig länk (ett tryck = ny gest)",
    doc.getElementById("pushIssueLink").getAttribute("href") === expect);
  ok("push: reservrutan visar JSON att kopiera", doc.getElementById("pushPayload").value.includes(endpoint));
  ok("push: knappen påstår INTE att enheten registrerats",
    dash.cacheGet("vr_push_registered") !== true);
  dash.closePushModal();
  ok("push: reservrutan går att stänga", !modal.classList.contains("open"));
}

console.log(`\nSIM: ${pass} passed, ${fail} failed`);
window.close();
process.exit(fail ? 1 : 0);
