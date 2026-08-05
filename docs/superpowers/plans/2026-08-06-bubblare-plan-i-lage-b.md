# Villkorad bubblar-plan i LÄGE B — implementationsplan

> **För agentiska arbetare:** OBLIGATORISK SUB-SKILL: använd superpowers:subagent-driven-development (rekommenderas) eller superpowers:executing-plans för att genomföra planen uppgift för uppgift. Stegen använder checkbox-syntax (`- [ ]`) för spårning.

**Mål:** Låta en bubblare som veckorotationen bara stoppades från att prissätta — därför att kursen saknades — få sin villkorade plan under veckan i stället för att ligga död till nästa måndag.

**Arkitektur:** Två prompter får en ny, snävt villkorad regel i LÄGE B. En ny watchdog-kontroll larmar när en bubblare fått kurs men ingen körning tagit ställning. Ingen ny fil, inget nytt tillstånd — mekaniken (punkt 4b, taket på två planer, de fem grindarna, monitorn) finns redan.

**Teknikstack:** Node 20 ESM, bara `node:*`. Tester i `tests/run.mjs`.

**Spec:** `docs/superpowers/specs/2026-08-06-bubblare-plan-i-lage-b-design.md`

## Globala villkor

- **Ingen `npm install`.** Bara `node:*`.
- **Kursverifieringskravet sänks ALDRIG.** Regeln som läggs till är en SPÄRRAD väg, inte en uppmjukning: den kräver verifierad kurs, full poängsättning, regimfilter på och ledig plats.
- **Watchdogen ska fail-silent.** Markdown-parsning är bräcklig; saknas sektion, rader eller tickers returneras inga problem. En watchdog som kraschar på en formulering är värre än ingen.
- **Rör inget under `state/`.** Levande data.
- **Använd Edit/Write-verktygen på prompt- och md-filer — ALDRIG PowerShell.** `Get-Content -Raw` läser UTF-8 som ANSI och förstör å ä ö. Det kostade 81 tecken i `index.html` 2026-08-03.
- Datum jämförs som ISO-strängar. Ingen `Date`-aritmetik.
- Testkommando: `node tests/run.mjs`. Baslinje: **596** passerande. Även `node tests/theme.mjs` (133) ska förbli grön.
- Commit-meddelanden på svenska, avslutade med `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` efter en tom rad.

## Filstruktur

| Fil | Ansvar | Uppgift |
|---|---|---|
| `.github/scripts/watchdog.mjs` | extraktor + kontroll + inkoppling | 1, 2 |
| `tests/run.mjs` | tester | 1, 2 |
| `prompts/dagligprompt.md`, `prompts/us_dagligprompt.md` | regeln | 3 |
| `CLAUDE.md` | dokumentation | 3 |

---

### Uppgift 1: `bubblareFromWeekly()` — läs bubblarlistan ur en veckorapport

**Filer:**
- Modifiera: `.github/scripts/watchdog.mjs` (ny export, lägg före `checkCandidatePrice`)
- Test: `tests/run.mjs`

**Gränssnitt:**
- Producerar: `bubblareFromWeekly(md) -> string[]` (unik, i rapportens ordning). Används av uppgift 2.

**Bakgrund som avgör implementationen — mätt 2026-08-06 mot båda böckernas 260803-rapporter:**
- Sektionen börjar på `## Bubblare` och slutar vid nästa `## `.
- **Den MÅSTE klippas vid `**Förra veckans bubblare`.** Utan klippet plockades åtta tickers ur veckorapport-260803, varav HNSA.ST, BOOZT.ST och SCA-B.ST alla var STRUKNA. Watchdogen hade larmat på idéer rotationen medvetet dödat.
- Bubblarna ligger som numrerade rader (`1.` … `5.`) med namnet i fetstil.
- **Böckerna skriver tickern olika:** nordiskt `**ASSA ABLOY (ASSA-B.ST)**`, amerikanskt `**MSFT**`. En extraktor som bara klarar den ena hittar noll i den andra boken.

- [ ] **Steg 1: Skriv de failande testerna**

Lägg i `tests/run.mjs` intill de andra watchdog-testerna (sök på `checkCandidatePrice`):

```js
// ---- bubblareFromWeekly: läs bubblarlistan ur en veckorapport ----
{
  const nordic = [
    "## Bubblare (watchlist inför nästa vecka)",
    "1. **ASSA ABLOY (ASSA-B.ST)** – förvärv av Gunnebo Entrance Control. KURS EJ VERIFIERAD.",
    "2. **Betsson (BETS-B.ST)** – förvärvet slutfört.",
    "3. **Kongsberg (KOG.OL)** – 296,20 NOK. Rankad under på sektorkoncentration.",
    "",
    "**Förra veckans bubblare:** **HNSA.ST** – STRUKEN. **BOOZT.ST** – STRUKEN.",
    "",
    "## Veckans radar",
    "1. **SCA-B.ST** – ska inte plockas upp, fel sektion."
  ].join("\n");
  const n = WD.bubblareFromWeekly(nordic);
  ok("bubblare: nordisk form (ticker i parentes)",
     n.includes("ASSA-B.ST") && n.includes("BETS-B.ST") && n.includes("KOG.OL"));
  ok("bubblare: STRUKNA i 'Förra veckans bubblare' plockas INTE upp",
     !n.includes("HNSA.ST") && !n.includes("BOOZT.ST"));
  ok("bubblare: nästa ## avslutar sektionen", !n.includes("SCA-B.ST"));
  ok("bubblare: exakt tre ur nordiska listan", n.length === 3);

  const us = [
    "## Bubblare (watchlist inför nästa vecka)",
    "1. **MSFT** – näst högsta totalpoäng.",
    "2. **JPM** – rotationen till finans är intakt.",
    "",
    "**Förra veckans bubblare:** **HCA** – STRUKEN."
  ].join("\n");
  const u = WD.bubblareFromWeekly(us);
  ok("bubblare: amerikansk form (naken symbol)", u.includes("MSFT") && u.includes("JPM"));
  ok("bubblare: struken US-bubblare plockas inte upp", !u.includes("HCA"));

  ok("bubblare: saknad sektion ger tom lista", WD.bubblareFromWeekly("# rapport\ningen sektion").length === 0);
  ok("bubblare: icke-sträng ger tom lista", WD.bubblareFromWeekly(null).length === 0);
  ok("bubblare: rader utan numrering ignoreras",
     WD.bubblareFromWeekly("## Bubblare\n- **AAPL** – inte numrerad").length === 0);
}
```

- [ ] **Steg 2: Kör testerna och se dem falla**

Kör: `node tests/run.mjs`
Förväntat: 9 FAIL, `TypeError: WD.bubblareFromWeekly is not a function`.

- [ ] **Steg 3: Skriv den minimala implementationen**

Lägg i `.github/scripts/watchdog.mjs`, före `checkCandidatePrice`:

```js
/* Bubblarlistan ur en veckorapport, som tickers.

   KLIPPET VID "Förra veckans bubblare" ÄR INTE KOSMETIK. Utan det plockas de
   STRUKNA bubblarna upp ur uppföljningsstycket: veckorapport-260803 gav åtta
   tickers i stället för fem, och HNSA.ST, BOOZT.ST och SCA-B.ST var alla
   strukna. Watchdogen hade larmat på idéer rotationen medvetet dödat.

   Böckerna skriver tickern olika – nordiskt "**ASSA ABLOY (ASSA-B.ST)**",
   amerikanskt "**MSFT**" – så båda formerna måste hanteras. En extraktor som
   bara klarar den ena hittar NOLL i den andra boken, tyst.

   Fail-silent: markdown-parsning är bräcklig, och en watchdog som kraschar på
   en formulering är värre än ingen watchdog. */
export function bubblareFromWeekly(md){
  if (typeof md !== "string" || !md) return [];
  const after = md.split(/^## Bubblare/m)[1];
  if (!after) return [];
  let sec = after.split(/^## /m)[0];
  sec = sec.split(/\*\*F[oö]rra veckans bubblare/)[0];
  const out = [];
  for (const line of sec.split("\n")){
    const t = line.trim();
    if (!/^\d+\.\s/.test(t)) continue;
    const bold = t.match(/\*\*([^*]+)\*\*/);
    if (!bold) continue;
    const label = bold[1].trim();
    const paren = label.match(/\(\s*([A-Za-z0-9][A-Za-z0-9.\-]{0,13})\s*\)/);
    if (paren && /\.(ST|OL|CO|HE)$/i.test(paren[1])){ out.push(paren[1].toUpperCase()); continue; }
    if (/^[A-Z]{1,6}$/.test(label)) out.push(label);
  }
  return [...new Set(out)];
}
```

- [ ] **Steg 4: Kör testerna och se dem passera**

Kör: `node tests/run.mjs`
Förväntat: `605 passed, 0 failed`.

- [ ] **Steg 5: Committa**

```bash
git add .github/scripts/watchdog.mjs tests/run.mjs
git commit -m "bubblareFromWeekly: läs bubblarlistan ur en veckorapport"
```

---

### Uppgift 2: `checkStalePricedBubblare()` + inkoppling

**Filer:**
- Modifiera: `.github/scripts/watchdog.mjs` (ny export efter `bubblareFromWeekly`; inkoppling i `main()`)
- Test: `tests/run.mjs`

**Gränssnitt:**
- Konsumerar: `bubblareFromWeekly` (uppgift 1).
- Producerar: `checkStalePricedBubblare(opts) -> problems[]` med `key: "bubblare-price"`.

**Varför:** att en prissatt bubblare aldrig får ett avgörande är ett TYST fel — inget går sönder, rapporten ser normal ut, idén tystnar bara. Samma mönster som `checkCandidatePrice` fångar för scout-kandidater.

- [ ] **Steg 1: Skriv de failande testerna**

```js
// ---- watchdog: prissatt bubblare utan avgörande ----
{
  const md = [
    "## Bubblare",
    "1. **ASSA ABLOY (ASSA-B.ST)** – KURS EJ VERIFIERAD.",
    "2. **Betsson (BETS-B.ST)** – KURS EJ VERIFIERAD."
  ].join("\n");
  const quotes = {
    "ASSA-B.ST": { price: 365.3, marketTime: "2026-08-05T09:29:54.000Z" },
    "BETS-B.ST": { price: 92.15, marketTime: "2026-08-05T09:30:07.000Z" }
  };
  const base = { weeklyMd: md, weeklyDate: "2026-08-03", quotes, book: "nordic" };

  ok("watchdog larmar på prissatt bubblare utan avgörande",
     WD.checkStalePricedBubblare(Object.assign({}, base, { decisionsDb: { decisions: [] } }))
       .some(p => p.key === "bubblare-price"));
  ok("watchdog tiger när bubblaren fått ett avgörande efter veckorapporten",
     WD.checkStalePricedBubblare(Object.assign({}, base, { decisionsDb: { decisions: [
       { date: "2026-08-05", ticker: "ASSA-B.ST", action: "AVVAKTA" },
       { date: "2026-08-05", ticker: "BETS-B.ST", action: "AVVAKTA" }
     ] } })).length === 0);
  ok("watchdog räknar INTE ett avgörande från före veckorapporten",
     WD.checkStalePricedBubblare(Object.assign({}, base, { decisionsDb: { decisions: [
       { date: "2026-08-01", ticker: "ASSA-B.ST", action: "AVVAKTA" },
       { date: "2026-08-01", ticker: "BETS-B.ST", action: "AVVAKTA" }
     ] } })).some(p => p.key === "bubblare-price"));
  ok("watchdog tiger för bubblare utan verifierad kurs",
     WD.checkStalePricedBubblare(Object.assign({}, base, {
       quotes: { "ASSA-B.ST": { error: "kunde inte hämtas" }, "BETS-B.ST": { price: null } },
       decisionsDb: { decisions: [] } })).length === 0);
  ok("watchdog tiger utan indata",
     WD.checkStalePricedBubblare({ weeklyMd: md, weeklyDate: "2026-08-03",
       quotes: null, decisionsDb: null }).length === 0);
}
```

- [ ] **Steg 2: Kör testerna och se dem falla**

Kör: `node tests/run.mjs`
Förväntat: 5 FAIL, `TypeError: WD.checkStalePricedBubblare is not a function`.

- [ ] **Steg 3: Skriv den minimala implementationen**

```js
/* PRISSATT BUBBLARE SOM ALDRIG FICK ETT AVGÖRANDE.

   Veckorotationen 2026-08-03 kunde inte ge tre bubblare en villkorad plan
   eftersom prices.json saknade deras kurser. Kurserna kom 4–5/8. Utan en
   kontroll ligger idén död till nästa måndag utan att något syns: inget går
   sönder, rapporten ser normal ut, bubblaren bara tystnar.

   Bakåtkompatibel och fail-silent: saknas rapporttext, kurser eller
   bubblarlista returneras inga problem. */
export function checkStalePricedBubblare(opts){
  const { weeklyMd, weeklyDate, quotes, decisionsDb, book } = opts || {};
  const problems = [];
  // decisionsDb MÅSTE vaktas separat: utan den vakten blir "vi vet inte om ett
  // beslut fattats" (filen oläsbar eller trasig – ett dokumenterat felläge, se
  // main():s bara try/catch) samma sak som "inget beslut fattades", och varje
  // prissatt bubblare i boken larmar falskt. `checkGrossList` gör redan rätt.
  if (!weeklyDate || !quotes || !decisionsDb) return problems;
  const tickers = bubblareFromWeekly(weeklyMd);
  if (!tickers.length) return problems;
  const rows = decisionsDb.decisions || [];
  const decided = new Set(rows
    .filter(r => r && typeof r.date === "string" && r.date > weeklyDate)
    .map(r => r.ticker));
  const stuck = tickers.filter(t => {
    const q = quotes[t];
    return q && !q.error && q.price != null && !decided.has(t);
  });
  if (stuck.length)
    problems.push({ key: "bubblare-price", title:
      `Watchdog: ${stuck.length} prissatt(a) bubblare utan avgörande (${book || "?"})`,
      body: "Följande bubblare ur veckorapporten " + weeklyDate + " har nu verifierad kurs i " +
        "`state/prices.json`, men ingen körning har tagit ställning till dem sedan dess:\n\n" +
        stuck.map(t => `- **${t}** (${quotes[t].price}, ${quotes[t].marketTime || "utan tidsstämpel"})`).join("\n") +
        "\n\nEn bubblare som bara stoppades av att kursen saknades ska få en villkorad plan i " +
        "LÄGE B så snart kursen finns. Ligger den kvar utan avgörande är den död till nästa " +
        "veckorotation utan att något syns." });
  return problems;
}
```

Koppla in i `main()`. `main()` listar redan `reports/weekly` men läser inte innehållet — lägg läsningarna intill de andra, i samma defensiva stil, och anropa kontrollen en gång per bok:

```js
  const readLatest = (dir, re) => {
    const files = ls(dir).filter(f => re.test(f)).sort();
    if (!files.length) return { md: null, date: null };
    const f = files[files.length - 1];
    const m = f.match(/(\d{2})(\d{2})(\d{2})\.md$/);
    const date = m ? `20${m[1]}-${m[2]}-${m[3]}` : null;
    try { return { md: readFileSync(dir + "/" + f, "utf8"), date }; } catch { return { md: null, date }; }
  };
  const wkNordic = readLatest("reports/weekly", /^veckorapport-\d{6}\.md$/);
  const wkUs     = readLatest("reports/us_weekly", /^us-veckorapport-\d{6}\.md$/);
  problems.push(...checkStalePricedBubblare({ weeklyMd: wkNordic.md, weeklyDate: wkNordic.date,
    quotes: priceQuotes, decisionsDb, book: "nordic" }));
  problems.push(...checkStalePricedBubblare({ weeklyMd: wkUs.md, weeklyDate: wkUs.date,
    quotes: priceQuotes, decisionsDb, book: "us" }));
```

`priceQuotes` och `decisionsDb` finns redan i `main()` — återanvänd dem, deklarera inte om dem. `ls` och `readFileSync` finns också redan.

- [ ] **Steg 4: Kör testerna och se dem passera**

```bash
node tests/run.mjs        # 610 passed, 0 failed
node .github/scripts/watchdog.mjs
```
Watchdogen ska köra utan att kasta. Den kommer sannolikt LARMA på de fem nordiska bubblarna — det är korrekt beteende just nu och bekräftar att kontrollen fungerar mot skarp data. Skriv in vad den sa i rapporten.

- [ ] **Steg 5: Committa**

```bash
git add .github/scripts/watchdog.mjs tests/run.mjs
git commit -m "Watchdog: larma på prissatt bubblare som aldrig fick ett avgörande"
```

---

### Uppgift 3: Regeln i prompterna + CLAUDE.md

**Filer:**
- Modifiera: `prompts/dagligprompt.md` (LÄGE B punkt 4), `prompts/us_dagligprompt.md` (motsvarande), `CLAUDE.md`

**KRITISKT:** detta sänker inte kursverifieringskravet. Regeln som läggs till är en SPÄRRAD väg med sex villkor. Formulera den så — inget du skriver får kunna läsas som en uppmjukning.

- [ ] **Steg 1: Lägg regeln i båda rotationsprompterna**

I punkt 4 i LÄGE B, direkt efter listan "KÖP endast i fyra fall", lägg ett eget stycke:

```markdown
   - **VILLKORAD PLAN FÖR EN PRISSATT BUBBLARE (ny 2026-08-06).** Du FÅR lägga EN villkorad
     bubblar-plan i LÄGE B, men bara när kursen var det ENDA som saknades. Samtliga sex villkor
     måste hålla: (1) senaste veckorapporten angav uttryckligen SAKNAD VERIFIERAD KURS som skälet
     att bubblaren inte fick en pending-rad – en bubblare som rankades under av OMDÖMESSKÄL
     (ingen egen katalysator, sektorkoncentration, ej beräkningsbar teknik) omfattas ALDRIG;
     (2) `state/prices.json` har nu verifierad kurs med tidsstämpel; (3) katalysatorn är fortfarande
     inom sina 5 handelsdagar och obruten; (4) bubblaren klarar FULL poängsättning mot de fem
     grindarna – den kunde inte poängsättas på måndagen eftersom kursen är det poängsättningen
     behöver; (5) regimfiltret är PÅ; (6) boken har ledig plats och taket på TVÅ villkorade planer
     spräcks inte. Högst EN sådan plan per körning. Planen läggs enligt punkt 4b i LÄGE A, med
     fullständiga nivåer och entry-villkor mot verifierad kurs, och avförs som vanligt om den inte
     triggat inom 5 handelsdagar. Faller bubblaren på något av villkoren: logga en `AVVAKTA`-rad i
     `state/decisions.json` med den NAMNGIVNA spärren. Detta är en SPÄRRAD väg, inte en uppmjukning
     – kursverifieringskravet, grindarna och taket gäller oförändrat.
```

Anpassa `punkt 4b i LÄGE A` till den beteckning US-prompten faktiskt använder — läs filen först och rapportera om strukturen skiljer sig.

- [ ] **Steg 2: Uppdatera CLAUDE.md**

I avsnitt 4, i stycket om `prompts/dagligprompt.md`, lägg till:

```markdown
  **Sedan 2026-08-06 får LÄGE B lägga EN villkorad bubblar-plan** – men bara för en bubblare
  där senaste veckorapporten angav saknad verifierad kurs som skälet att den inte fick en
  pending-rad, och bara om sex villkor håller (kurs finns nu · katalysator inom 5 handelsdagar ·
  full poängsättning mot de fem grindarna · regimfilter på · ledig plats · taket på två planer).
  **Anledningen:** veckorotationen 2026-08-03 kunde inte prissätta tre bubblare, kurserna kom
  4–5/8, och punkt 4b låg bara i LÄGE A – fyra handelsdagar där en färdigbedömd idé låg död av
  ett datafel. En bubblare som rankades under av OMDÖMESSKÄL omfattas aldrig; den bedömningen
  görs om vid rotationen. `watchdog.mjs:checkStalePricedBubblare` larmar när en bubblare fått
  kurs men ingen körning tagit ställning.
```

- [ ] **Steg 3: Verifiera**

```bash
node tests/run.mjs      # 610 passed, 0 failed
node tests/theme.mjs    # 133 passed, 0 failed
node -e "const fs=require('fs'); for (const f of ['prompts/dagligprompt.md','prompts/us_dagligprompt.md']) { const t=fs.readFileSync(f,'utf8'); if(!/PRISSATT BUBBLARE/.test(t)) throw new Error('regeln saknas i '+f); if(!/SPÄRRAD VÄG|spärrad väg/i.test(t)) throw new Error('spärr-formuleringen saknas i '+f); } console.log('prompterna OK')"
git status --short
```

Kontrollera diffen för mojibake i å ä ö.

- [ ] **Steg 4: Committa**

```bash
git add prompts/dagligprompt.md prompts/us_dagligprompt.md CLAUDE.md
git commit -m "LÄGE B får lägga en villkorad plan när kursen var det enda som saknades"
```

---

## Slutverifiering

```bash
node tests/run.mjs                                    # 610 passed, 0 failed
node tests/theme.mjs                                  # 133 passed, 0 failed
node .github/scripts/validate-decisions.mjs           # OK
node .github/scripts/validate-scout-candidates.mjs    # OK
node .github/scripts/watchdog.mjs                     # kör utan att kasta
git status --short                                    # rent träd
```

**Skarpt prov:** nästa LÄGE B-körning ska antingen lägga en plan för ASSA-B.ST, BETS-B.ST eller SUBC.OL, eller logga en `AVVAKTA`-rad per namn med den namngivna spärren. Watchdogens `bubblare-price`-larm ska tystna när avgörandena finns.
