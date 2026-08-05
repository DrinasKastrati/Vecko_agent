# Verifierade kurser för kandidater med rapportkatalysator — implementationsplan

> **För agentiska arbetare:** OBLIGATORISK SUB-SKILL: använd superpowers:subagent-driven-development (rekommenderas) eller superpowers:executing-plans för att genomföra planen uppgift för uppgift. Stegen använder checkbox-syntax (`- [ ]`) för spårning.

**Mål:** Låta en kandidat med bekräftad rapportkatalysator få en verifierad, post-event tidsstämplad kurs innan rotationen kör — utan att sänka kursverifieringskravet.

**Arkitektur:** `fetch-prices.mjs` gör ett andra, smalt Yahoo-anrop (`interval=1m&includePrePost=true`) för symboler som rapporterar inom 2 handelsdagar och skriver förbörs-/efterbörskursen i SEPARATA fält. Ett nytt nyckellöst skript fyller kandidatfilens `price` enbart från en bevisligen post-katalysatorisk kurs. Kandidatfilen blir samtidigt tickerkälla, så handpåläggningen i `watchlist_us.txt` försvinner.

**Teknikstack:** Node 20 ESM, inga beroenden utanför `node:*`. Tester i `tests/run.mjs` (rena funktioner, ingen nätåtkomst — nätverk injiceras som `fetchImpl`).

**Spec:** `docs/superpowers/specs/2026-08-05-verifierade-kurser-kandidater-design.md`

## Globala villkor

- **Ingen `npm install`.** `prices.yml` har aldrig kört det och ska inte börja. Bara `node:*`.
- **`price`, `marketTime`, `previousClose`, `schemaVersion` i `state/prices.json` får ALDRIG röras.** Utökad kurs är tillägg, aldrig ersättning. Dashboarden, `monitor.yml`, `decision_eval.mjs`, `movers.mjs` och `backtest.mjs` läser alla `price` som reguljär kurs.
- **Ingen `schemaVersion`-bump.** Inget befintligt fälts betydelse ändras. Strängen förblir `"2026-08-02-prevclose"`.
- **Saknas utökad kurs utelämnas fälten HELT** — aldrig `null`. Ett `null` går inte att skilja från misslyckad hämtning.
- **Skriv aldrig en fil som är oförändrad.** `prices.yml` kör var 30:e minut; `decision_eval.mjs` gav ~48 tomma commits per dygn innan den regeln infördes.
- **Alla nya filläsningar måste tåla saknad/trasig fil** och returnera tomt, aldrig kasta. Prisbevakningen får aldrig falla för att en hjälpfil gjort det.
- **Datum jämförs som strängar** i ISO-format (`"2026-08-05" > "2026-08-04"`). Ingen `Date`-aritmetik för dygnsgränser, ingen tidszonskonvertering.
- **Kör aldrig `fetch-prices.mjs` lokalt** medan actionen kör — `pull --rebase` fastnar i konflikt.
- Testkommando genomgående: `node tests/run.mjs`. Antal tester som passerar i utgångsläget: **544**.
- Commit-meddelanden på svenska, i imperativ. Avsluta varje commit med raden
  `Co-Authored-By: Claude Opus 5 <noreply@anthropic.com>` (separerad med en tom rad).

## Filstruktur

| Fil | Ansvar | Uppgift |
|---|---|---|
| `.github/scripts/fetch-prices.mjs` | urvalsmängd, 1m-parsning, utökad hämtning, kandidater som tickerkälla | 1–4 |
| `.github/scripts/refresh-candidate-prices.mjs` | **ny** — fyller kandidatkurs från post-event-kurs | 5 |
| `.github/workflows/prices.yml` | kör refresh-steget efter hämtningen | 6 |
| `.gitattributes` | `-merge` på kandidatfilen (nu två skrivare) | 6 |
| `.github/scripts/watchdog.mjs` | larm när post-event-kurs finns men kandidaten står på `null` | 7 |
| `prompts/*.md`, `CLAUDE.md` | beslutsregeln för utökad kurs | 8 |
| `tests/run.mjs` | alla tester | 1–7 |

---

### Uppgift 1: `extendedScope()` — vilka symboler förtjänar ett extra anrop

**Filer:**
- Modifiera: `.github/scripts/fetch-prices.mjs` (ny export, lägg efter `collectEarningsTickers`, ~rad 106)
- Test: `tests/run.mjs`

**Gränssnitt:**
- Konsumerar: inget från tidigare uppgifter.
- Producerar: `extendedScope(calendar, candidates, today) -> string[]` (sorterad, unik). `calendar` är parsad `state/earnings_calendar.json`, `candidates` parsad `state/scout_candidates.json`, `today` en ISO-datumsträng. Används av uppgift 3.

- [ ] **Steg 1: Skriv de failande testerna**

Lägg i `tests/run.mjs` direkt efter blocket som testar `collectEarningsTickers` (sök på `collectEarningsTickers`):

```js
// ---- extendedScope: vilka symboler får ett extra 1m-anrop ----
{
  const cal = { upcoming: [
    { symbol: "NVO",  tradingDaysAway: 0, isEstimate: false },
    { symbol: "RIOT", tradingDaysAway: 0, isEstimate: true  },
    { symbol: "MARA", tradingDaysAway: 2, isEstimate: false },
    { symbol: "OSSD.ST", tradingDaysAway: 9, isEstimate: false }
  ] };
  const cands = { candidates: [
    { ticker: "ANET", status: "new",      confirmed: true,  expiresAt: "2026-08-12" },
    { ticker: "AVGO", status: "new",      confirmed: false, expiresAt: "2026-08-12" },
    { ticker: "OLD",  status: "new",      confirmed: true,  expiresAt: "2026-08-01" },
    { ticker: "DONE", status: "rejected", confirmed: true,  expiresAt: "2026-08-12" }
  ] };
  const s = FP.extendedScope(cal, cands, "2026-08-05");
  ok("extendedScope tar med rapport inom 2 handelsdagar", s.includes("NVO") && s.includes("MARA"));
  ok("extendedScope tar med isEstimate (hämtning, inte beslut)", s.includes("RIOT"));
  ok("extendedScope utesluter rapport längre bort än 2 dagar", !s.includes("OSSD.ST"));
  ok("extendedScope tar med bekräftad öppen kandidat", s.includes("ANET"));
  ok("extendedScope utesluter obekräftad kandidat", !s.includes("AVGO"));
  ok("extendedScope utesluter utgången kandidat", !s.includes("OLD"));
  ok("extendedScope utesluter avgjord kandidat", !s.includes("DONE"));
  ok("extendedScope är sorterad och unik",
     JSON.stringify(s) === JSON.stringify([...new Set(s)].sort()));
  ok("extendedScope tål null-indata", FP.extendedScope(null, null, "2026-08-05").length === 0);
  ok("extendedScope tål trasiga poster",
     FP.extendedScope({ upcoming: [null, {}, { symbol: "" }] }, { candidates: [null, {}] }, "2026-08-05").length === 0);
}
```

- [ ] **Steg 2: Kör testerna och se dem falla**

Kör: `node tests/run.mjs`
Förväntat: 10 FAIL, alla med `TypeError: FP.extendedScope is not a function`.

- [ ] **Steg 3: Skriv den minimala implementationen**

Lägg i `.github/scripts/fetch-prices.mjs` efter `collectEarningsTickers`:

```js
/* Symboler som ska få ett EXTRA anrop med förbörs-/efterbörsdata.

   Varför mängden är smal: det extra anropet är `interval=1m` och ger ~1400
   punkter per symbol. Att göra det för alla ~54 symboler var 30:e minut är
   onödig last mot ett API som redan svarar 403 när det tycker att det är för
   mycket. Varje MÄTT miss (PLTR 2026-08-04, ANET och AMD 2026-08-05) är en
   rapporthändelse, så mängden begränsas till dem.

   `isEstimate: true` räknas MED här. CLAUDE.md drar gränsen så: ett gissat
   datum duger för att säkra en kurs i förväg, men aldrig som bekräftad binär
   händelse. Den här funktionen avgör bara HÄMTNING – aldrig ett beslut. */
export function extendedScope(calendar, candidates, today){
  const out = new Set();
  const up = (calendar && Array.isArray(calendar.upcoming)) ? calendar.upcoming : [];
  for (const u of up){
    if (!u || typeof u.symbol !== "string" || !u.symbol) continue;
    if (typeof u.tradingDaysAway !== "number") continue;
    if (u.tradingDaysAway < 0 || u.tradingDaysAway > 2) continue;
    out.add(u.symbol);
  }
  const cs = (candidates && Array.isArray(candidates.candidates)) ? candidates.candidates : [];
  for (const c of cs){
    if (!c || c.status !== "new" || c.confirmed !== true) continue;
    if (typeof c.ticker !== "string" || !c.ticker) continue;
    if (today && c.expiresAt && String(c.expiresAt) < today) continue;
    out.add(c.ticker);
  }
  return [...out].sort();
}
```

- [ ] **Steg 4: Kör testerna och se dem passera**

Kör: `node tests/run.mjs`
Förväntat: `554 passed, 0 failed`.

- [ ] **Steg 5: Committa**

```bash
git add .github/scripts/fetch-prices.mjs tests/run.mjs
git commit -m "extendedScope: smal urvalsmängd för förbörs-/efterbörshämtning"
```

---

### Uppgift 2: `parseExtended()` — plocka punkten utanför reguljär session

**Filer:**
- Modifiera: `.github/scripts/fetch-prices.mjs` (lägg direkt efter `parseChart`, ~rad 254)
- Test: `tests/run.mjs`

**Gränssnitt:**
- Konsumerar: inget.
- Producerar: `parseExtended(json) -> { extendedPrice: number, extendedTime: string, extendedSession: "pre"|"post" } | null`. Används av uppgift 3.

**Bakgrund för implementeraren:** Yahoos `interval=1d`-svar har `hasPrePostMarketData: true` men exponerar INGET `postMarketPrice` i `meta` — kontrollerat live 2026-08-05. Utökad kurs finns bara i `interval=1m`-svarets tidsserie, och sessionen avgörs av `meta.currentTradingPeriod.regular.start/end` (unix-sekunder).

- [ ] **Steg 1: Skriv de failande testerna**

Lägg i `tests/run.mjs` direkt efter testerna från uppgift 1:

```js
// ---- parseExtended: förbörs-/efterbörspunkt ur 1m-svaret ----
{
  // reguljär session 13:30–20:00 UTC 2026-08-05 (unix-sekunder)
  const regStart = Math.floor(Date.parse("2026-08-05T13:30:00Z") / 1000);
  const regEnd   = Math.floor(Date.parse("2026-08-05T20:00:00Z") / 1000);
  const mk = (times, closes) => ({ chart: { result: [{
    meta: { currentTradingPeriod: { regular: { start: regStart, end: regEnd } } },
    timestamp: times,
    indicators: { quote: [{ close: closes }] }
  }] } });

  const preT = Math.floor(Date.parse("2026-08-05T12:58:00Z") / 1000);
  const regT = Math.floor(Date.parse("2026-08-05T14:00:00Z") / 1000);
  const postT = Math.floor(Date.parse("2026-08-05T20:30:00Z") / 1000);

  const onlyPre = FP.parseExtended(mk([preT, regT], [471.02, 480.0]));
  ok("parseExtended tar förbörspunkt när ingen efterbörs finns",
     onlyPre && onlyPre.extendedSession === "pre" && onlyPre.extendedPrice === 471.02);
  ok("parseExtended ger ISO-tidsstämpel",
     onlyPre && onlyPre.extendedTime === "2026-08-05T12:58:00.000Z");

  const withPost = FP.parseExtended(mk([preT, regT, postT], [471.02, 480.0, 492.5]));
  ok("parseExtended väljer SENASTE punkten utanför reguljär session",
     withPost && withPost.extendedSession === "post" && withPost.extendedPrice === 492.5);

  ok("parseExtended ger null när bara reguljära punkter finns",
     FP.parseExtended(mk([regT], [480.0])) === null);
  ok("parseExtended hoppar över null-close",
     FP.parseExtended(mk([preT, postT], [471.02, null])).extendedSession === "pre");
  ok("parseExtended ger null utan currentTradingPeriod",
     FP.parseExtended({ chart: { result: [{ meta: {}, timestamp: [], indicators: { quote: [{ close: [] }] } }] } }) === null);
  ok("parseExtended tål tomt svar", FP.parseExtended(null) === null);
  ok("parseExtended tål saknad indicators",
     FP.parseExtended({ chart: { result: [{ meta: { currentTradingPeriod: { regular: { start: regStart, end: regEnd } } } }] } }) === null);
}
```

- [ ] **Steg 2: Kör testerna och se dem falla**

Kör: `node tests/run.mjs`
Förväntat: 8 FAIL, `TypeError: FP.parseExtended is not a function`.

- [ ] **Steg 3: Skriv den minimala implementationen**

Lägg i `.github/scripts/fetch-prices.mjs` direkt efter `parseChart`:

```js
/* Förbörs-/efterbörskurs ur ett `interval=1m&includePrePost=true`-svar.

   Yahoos 1d-svar har `hasPrePostMarketData: true` men INGET postMarketPrice i
   meta (kontrollerat live 2026-08-05) – utökad kurs finns bara i 1m-seriens
   punkter, och sessionen avgörs av meta.currentTradingPeriod.regular.

   Returnerar SENASTE punkten utanför reguljär session, eller null. Aldrig ett
   objekt med null-fält: anroparen ska kunna skilja "ingen utökad kurs" från
   "hämtningen föll", och det gör den på att fälten saknas helt. */
export function parseExtended(json){
  const res  = json && json.chart && json.chart.result && json.chart.result[0];
  const reg  = res && res.meta && res.meta.currentTradingPeriod && res.meta.currentTradingPeriod.regular;
  if (!reg || typeof reg.start !== "number" || typeof reg.end !== "number") return null;
  const ts = Array.isArray(res.timestamp) ? res.timestamp : [];
  const q  = res.indicators && res.indicators.quote && res.indicators.quote[0];
  const close = (q && Array.isArray(q.close)) ? q.close : [];
  let best = null;
  for (let i = 0; i < ts.length; i++){
    const t = ts[i], c = close[i];
    if (typeof t !== "number" || c == null || isNaN(Number(c))) continue;
    if (t >= reg.start && t < reg.end) continue;      // reguljär session – inte utökad
    if (!best || t > best[0]) best = [t, Number(c)];
  }
  if (!best) return null;
  return {
    extendedPrice: Math.round(best[1] * 1e6) / 1e6,
    extendedTime: new Date(best[0] * 1000).toISOString(),
    extendedSession: best[0] < reg.start ? "pre" : "post"
  };
}
```

- [ ] **Steg 4: Kör testerna och se dem passera**

Kör: `node tests/run.mjs`
Förväntat: `562 passed, 0 failed`.

- [ ] **Steg 5: Committa**

```bash
git add .github/scripts/fetch-prices.mjs tests/run.mjs
git commit -m "parseExtended: plocka förbörs-/efterbörspunkt ur 1m-svaret"
```

---

### Uppgift 3: `fetchExtended()` + inkoppling i `run()`

**Filer:**
- Modifiera: `.github/scripts/fetch-prices.mjs` (ny funktion efter `fetchQuote` ~rad 299; ändra `run()` ~rad 302–312)
- Test: `tests/run.mjs`

**Gränssnitt:**
- Konsumerar: `extendedScope` (uppgift 1), `parseExtended` (uppgift 2).
- Producerar: `fetchExtended(sym, fetchImpl) -> Promise<object|null>` och noteringar i `state/prices.json` som kan bära `extendedPrice`/`extendedTime`/`extendedSession`. Uppgift 5 och 7 läser de fälten.

- [ ] **Steg 1: Skriv de failande testerna**

Lägg i `tests/run.mjs` efter uppgift 2:s block:

```js
// ---- fetchExtended: nätlagret, med injicerad fetch ----
{
  const regStart = Math.floor(Date.parse("2026-08-05T13:30:00Z") / 1000);
  const regEnd   = Math.floor(Date.parse("2026-08-05T20:00:00Z") / 1000);
  const preT     = Math.floor(Date.parse("2026-08-05T12:58:00Z") / 1000);
  const body = { chart: { result: [{
    meta: { currentTradingPeriod: { regular: { start: regStart, end: regEnd } } },
    timestamp: [preT], indicators: { quote: [{ close: [471.02] }] }
  }] } };

  let seenUrl = null;
  const okFetch = async url => { seenUrl = url; return { ok: true, json: async () => body }; };
  const ext = await FP.fetchExtended("AMD", okFetch);
  ok("fetchExtended returnerar utökad kurs", ext && ext.extendedPrice === 471.02);
  ok("fetchExtended begär 1m med includePrePost",
     /interval=1m/.test(seenUrl) && /includePrePost=true/.test(seenUrl));

  ok("fetchExtended ger null vid HTTP-fel",
     await FP.fetchExtended("AMD", async () => ({ ok: false })) === null);
  ok("fetchExtended ger null när fetch kastar",
     await FP.fetchExtended("AMD", async () => { throw new Error("nät"); }) === null);
  ok("fetchExtended ger null när svaret saknar utökad punkt",
     await FP.fetchExtended("AMD", async () => ({ ok: true, json: async () => ({
       chart: { result: [{ meta: { currentTradingPeriod: { regular: { start: regStart, end: regEnd } } },
       timestamp: [], indicators: { quote: [{ close: [] }] } }] } }) })) === null);
}
```

- [ ] **Steg 2: Kör testerna och se dem falla**

Kör: `node tests/run.mjs`
Förväntat: 5 FAIL, `TypeError: FP.fetchExtended is not a function`.

- [ ] **Steg 3: Skriv den minimala implementationen**

Lägg i `.github/scripts/fetch-prices.mjs` direkt efter `fetchQuote`:

```js
/* Extra anrop för förbörs-/efterbörskurs. Faller det ska den vanliga
   noteringen INTE påverkas – därför null i stället för kastat fel, och därför
   ingen stooq-reserv: stooq har ingen utökad session att ge. */
export async function fetchExtended(sym, fetchImpl = globalThis.fetch){
  const hosts = ["query1.finance.yahoo.com", "query2.finance.yahoo.com"];
  for (const host of hosts){
    const url = `https://${host}/v8/finance/chart/${encodeURIComponent(sym)}` +
                `?range=2d&interval=1m&includePrePost=true`;
    try {
      const r = await fetchImpl(url, { headers: { "User-Agent": UA, "Accept": "application/json",
        "Accept-Language": "en-US,en;q=0.9" } });
      if (!r.ok) continue;
      const ext = parseExtended(await r.json());
      if (ext) return ext;
    } catch { /* prova nästa host */ }
  }
  return null;
}
```

Lägg en JSON-läsare bredvid `readFirst` (~rad 53):

```js
// Parsad JSON ur första filen som finns. null vid saknad eller trasig fil –
// en hjälpfil får aldrig fälla kursbevakningen.
export function readJsonFirst(paths){
  const raw = readFirst(paths);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}
```

Ändra `run()` (~rad 302). Ersätt loopen:

```js
export async function run(fetchImpl = globalThis.fetch){
  const tickers = [...new Set([...collectTickers(), ...collectUsTickers(),
                               ...collectEarningsTickers()])].sort();
  // Utökad session hämtas bara för symboler med en rapport inom räckhåll.
  const today = new Date().toISOString().slice(0, 10);
  const scope = new Set(extendedScope(
    readJsonFirst(["state/earnings_calendar.json"]),
    readJsonFirst(["state/scout_candidates.json"]),
    today));
  const quotes = {};
  let okCount = 0, extCount = 0;
  for (const t of tickers){
    const q = await fetchQuote(t, fetchImpl);
    quotes[t] = q;
    if (!q.error) okCount++;
    await sleep(250); // var snäll mot API:t
    if (!q.error && scope.has(t)){
      const ext = await fetchExtended(t, fetchImpl);
      if (ext){ Object.assign(q, ext); extCount++; }
      await sleep(250);
    }
  }
```

Lägg `extCount` i utdata, efter `okCount` i objektet `out`:

```js
    okCount,
    extendedCount: extCount,
```

Och uppdatera slutraden:

```js
  console.log(`Skrev state/prices.json: ${okCount}/${tickers.length} tickers hämtade, ` +
              `${extCount} med utökad session.`);
```

- [ ] **Steg 4: Kör testerna och se dem passera**

Kör: `node tests/run.mjs`
Förväntat: `567 passed, 0 failed`.

- [ ] **Steg 5: Committa**

```bash
git add .github/scripts/fetch-prices.mjs tests/run.mjs
git commit -m "fetchExtended: hämta förbörs-/efterbörskurs för rapportnära symboler"
```

---

### Uppgift 4: Kandidatfilen som tickerkälla

**Filer:**
- Modifiera: `.github/scripts/fetch-prices.mjs` (ny export; anrop i `collectTickers` ~rad 82 och `collectUsTickers` ~rad 194)
- Test: `tests/run.mjs`

**Gränssnitt:**
- Konsumerar: inget.
- Producerar: `collectCandidateTickers(book, readFile, today) -> string[]`.

**Bakgrund:** `state/scout_candidates.json` är i dag INTE en tickerkälla. ANET hamnade i `prices.json` bara för att scouten också handskrev in den i `config/watchlist_us.txt`. Ingen ny utgångslogik byggs — kandidatens egen `expiresAt` ÄR utgången.

- [ ] **Steg 1: Skriv de failande testerna**

```js
// ---- kandidatfilen som tickerkälla ----
{
  const db = JSON.stringify({ candidates: [
    { ticker: "ANET",     book: "us",     status: "new",      expiresAt: "2026-08-12" },
    { ticker: "ALLEI.ST", book: "nordic", status: "new",      expiresAt: "2026-08-12" },
    { ticker: "GAMMAL",   book: "us",     status: "new",      expiresAt: "2026-08-01" },
    { ticker: "AVGJORD",  book: "us",     status: "rejected", expiresAt: "2026-08-12" }
  ] });
  const rf = () => db;
  const us = FP.collectCandidateTickers("us", rf, "2026-08-05");
  const no = FP.collectCandidateTickers("nordic", rf, "2026-08-05");
  ok("kandidatticker hamnar i rätt bok (us)", us.includes("ANET") && !us.includes("ALLEI.ST"));
  ok("kandidatticker hamnar i rätt bok (nordic)", no.includes("ALLEI.ST") && !no.includes("ANET"));
  ok("utgången kandidat blir ingen tickerkälla", !us.includes("GAMMAL"));
  ok("avgjord kandidat blir ingen tickerkälla", !us.includes("AVGJORD"));
  ok("saknad kandidatfil ger tom lista", FP.collectCandidateTickers("us", () => "", "2026-08-05").length === 0);
  ok("trasig kandidatfil ger tom lista, inte kastat fel",
     FP.collectCandidateTickers("us", () => "{trasig", "2026-08-05").length === 0);
}
```

- [ ] **Steg 2: Kör testerna och se dem falla**

Kör: `node tests/run.mjs`
Förväntat: 6 FAIL, `TypeError: FP.collectCandidateTickers is not a function`.

- [ ] **Steg 3: Skriv den minimala implementationen**

Lägg i `.github/scripts/fetch-prices.mjs` efter `collectEarningsTickers`:

```js
/* Öppna kandidater ur state/scout_candidates.json som tickerkälla.

   Fram till 2026-08-05 var filen INTE en källa: ANET hamnade i prices.json
   bara för att scouten också handskrev in den i config/watchlist_us.txt. Den
   handpåläggningen är precis vad kandidatfilen skulle göra överflödig.

   Ingen egen utgångslogik: kandidatens `expiresAt` ÄR utgången. Repot har redan
   två listor med utgångssemantik, och en tredje hygienregel har dålig historik
   här – watchlist.txt bär "rensas efter 14 handelsdagar" och har aldrig rensats. */
export function collectCandidateTickers(book, readFile = readFirst,
                                        today = new Date().toISOString().slice(0, 10)){
  const raw = readFile(["state/scout_candidates.json"]);
  if (!raw) return [];
  try {
    const j = JSON.parse(raw);
    const cs = Array.isArray(j.candidates) ? j.candidates : [];
    return cs
      .filter(c => c && c.status === "new" && c.book === book &&
                   typeof c.ticker === "string" && c.ticker &&
                   (!c.expiresAt || String(c.expiresAt) >= today))
      .map(c => c.ticker)
      .sort();
  } catch { return []; }
}
```

Koppla in i `collectTickers`, sista raden före `return`:

```js
  for (const t of collectCandidateTickers("nordic")) tickers.add(t);
  return [...tickers].sort();
```

Koppla in i `collectUsTickers`, sista raden före `return`:

```js
  for (const t of collectCandidateTickers("us")) set.add(t);
  return [...set];
```

- [ ] **Steg 4: Kör testerna och se dem passera**

Kör: `node tests/run.mjs`
Förväntat: `573 passed, 0 failed`.

- [ ] **Steg 5: Committa**

```bash
git add .github/scripts/fetch-prices.mjs tests/run.mjs
git commit -m "Kandidatfilen blir tickerkälla – ingen handpåläggning i watchlist"
```

---

### Uppgift 5: `refresh-candidate-prices.mjs`

**Filer:**
- Skapa: `.github/scripts/refresh-candidate-prices.mjs`
- Test: `tests/run.mjs`

**Gränssnitt:**
- Konsumerar: `extendedPrice`/`extendedTime`/`extendedSession` från uppgift 3.
- Producerar: `postCatalystQuote(quote, catalystDate) -> { price, at, session } | null` och `refreshCandidates(db, quotes) -> { db, changed: boolean, filled: string[] }`. Uppgift 7 använder `postCatalystQuote`.

**Detta är uppgiftens kärnregel.** Ett skript som fyllde i vilken kurs som helst hade skrivit 190,51 på ANET — den pre-event-kurs scouten redan avvisat med rätta — och förvandlat ett korrekt avstående till felaktigt köpunderlag.

Kvalificerad post-katalysatorisk kurs, i ordning:
1. utökad punkt vars **datum är senare än** `catalystDate` (vilken session som helst)
2. utökad punkt vars **datum är lika med** `catalystDate` **och** session är `"post"`
3. reguljär kurs vars `marketTime`-datum är **strikt efter** `catalystDate`
4. annars ingen — lämna `price: null`

Ingen tidszonsaritmetik. Att jämföra mot börsens stängningsklockslag kräver att man applicerar ett klockslag på ett annat datum, vilket går sönder vid sommartid och skiljer sig mellan Stockholm (15:30 UTC) och New York (20:00 UTC).

- [ ] **Steg 1: Skriv de failande testerna**

Lägg sist i `tests/run.mjs`, före `console.log`-raden:

```js
// ---- refresh-candidate-prices: kandidatkurs ur post-event-kurs ----
{
  const RC = await mod(".github/scripts/refresh-candidate-prices.mjs");

  // ANET-fallet: enda kursen är den reguljära stängningen PÅ rapportdagen (AMC)
  const preEvent = { price: 190.51, marketTime: "2026-08-04T20:00:03.000Z" };
  ok("pre-event-kurs kvalificerar INTE (ANET/AMD-regressionen)",
     RC.postCatalystQuote(preEvent, "2026-08-04") === null);

  const nextDay = { price: 205.0, marketTime: "2026-08-05T15:23:00.000Z" };
  const r1 = RC.postCatalystQuote(nextDay, "2026-08-04");
  ok("reguljär kurs dagen efter kvalificerar", r1 && r1.price === 205.0 && r1.session === "regular");

  const postSame = { price: 190.51, marketTime: "2026-08-04T20:00:03.000Z",
    extendedPrice: 209.4, extendedTime: "2026-08-04T20:31:00.000Z", extendedSession: "post" };
  const r2 = RC.postCatalystQuote(postSame, "2026-08-04");
  ok("efterbörs SAMMA dag kvalificerar", r2 && r2.price === 209.4 && r2.session === "post");

  const preSame = { price: 190.51, marketTime: "2026-08-04T20:00:03.000Z",
    extendedPrice: 188.0, extendedTime: "2026-08-04T12:00:00.000Z", extendedSession: "pre" };
  ok("förbörs SAMMA dag kvalificerar INTE (före stängning)",
     RC.postCatalystQuote(preSame, "2026-08-04") === null);

  const preNext = { price: 190.51, marketTime: "2026-08-04T20:00:03.000Z",
    extendedPrice: 207.1, extendedTime: "2026-08-05T12:58:00.000Z", extendedSession: "pre" };
  const r3 = RC.postCatalystQuote(preNext, "2026-08-04");
  ok("förbörs DAGEN EFTER kvalificerar", r3 && r3.price === 207.1 && r3.session === "pre");
  ok("utökad kurs går före reguljär när båda kvalificerar",
     RC.postCatalystQuote(Object.assign({}, nextDay, {
       extendedPrice: 207.1, extendedTime: "2026-08-05T12:58:00.000Z", extendedSession: "pre"
     }), "2026-08-04").price === 207.1);
  ok("kurs <= 0 kvalificerar inte (validatorn kräver > 0)",
     RC.postCatalystQuote({ price: 0, marketTime: "2026-08-05T15:00:00.000Z" }, "2026-08-04") === null);

  // refreshCandidates
  const mkDb = () => ({ candidates: [
    { id: "260805-ANET", ticker: "ANET", status: "new", catalystDate: "2026-08-04", price: null, priceAsOf: null },
    { id: "260805-AVGO", ticker: "AVGO", status: "new", catalystDate: "2026-08-04", price: 418.16, priceAsOf: "x" },
    { id: "260805-OLD",  ticker: "OLD",  status: "rejected", catalystDate: "2026-08-04", price: null, priceAsOf: null }
  ] });
  const quotes = { ANET: nextDay, AVGO: nextDay, OLD: nextDay };

  const res = RC.refreshCandidates(mkDb(), quotes);
  ok("refresh fyller kandidat utan kurs", res.db.candidates[0].price === 205.0);
  ok("refresh sätter priceAsOf", res.db.candidates[0].priceAsOf === "2026-08-05T15:23:00.000Z");
  ok("refresh sätter priceSession", res.db.candidates[0].priceSession === "regular");
  ok("refresh rör aldrig kandidat som redan har kurs", res.db.candidates[1].price === 418.16);
  ok("refresh rör aldrig avgjord kandidat", res.db.candidates[2].price === null);
  ok("refresh rapporterar ändring", res.changed === true && res.filled.length === 1);

  ok("refresh utan kvalificerad kurs ändrar ingenting",
     RC.refreshCandidates(mkDb(), { ANET: preEvent, AVGO: preEvent, OLD: preEvent }).changed === false);
  ok("refresh tål saknad notering",
     RC.refreshCandidates(mkDb(), {}).changed === false);
  ok("refresh tål tom databas",
     RC.refreshCandidates(null, quotes).changed === false);

  // resultatet måste passera kandidatvalidatorn
  const filled = res.db.candidates[0];
  ok("ifylld kandidat har kurs > 0 och tidsstämpel",
     filled.price > 0 && typeof filled.priceAsOf === "string" && filled.priceAsOf.length > 0);
}
```

- [ ] **Steg 2: Kör testerna och se dem falla**

Kör: `node tests/run.mjs`
Förväntat: FAIL vid `await mod(...)` — `ERR_MODULE_NOT_FOUND` för `refresh-candidate-prices.mjs`.

- [ ] **Steg 3: Skriv den minimala implementationen**

Skapa `.github/scripts/refresh-candidate-prices.mjs`:

```js
#!/usr/bin/env node
/* ============================================================
   Fyller `price`/`priceAsOf` på kandidater i state/scout_candidates.json –
   men BARA från en kurs som bevisligen ligger efter katalysatorn.

   VARFÖR REGELN ÄR SÅ SNÄV. 2026-08-05 låg ANET och AMD båda med price: null
   i kandidatfilen medan prices.json HADE en kurs för dem (190,51 resp. 518,58).
   Kurserna var den reguljära stängningen 2026-08-04 – och båda bolagen
   rapporterade 2026-08-04 AMC, alltså EFTER den tidpunkten. Scouten avvisade
   dem korrekt. Ett skript som fyllt i "kursen som fanns" hade skrivit en
   pre-event-kurs på en post-event-katalysator och gjort ett korrekt avstående
   till ett felaktigt köpunderlag.

   Nyckellöst, LLM-fritt, ingen nätåtkomst. Körs i prices.yml efter hämtningen.
   ============================================================ */
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const DB = "state/scout_candidates.json";

/* Kvalificerad post-katalysatorisk kurs, eller null.

   Datum + sessionsetikett, ALDRIG klockslag: att jämföra mot börsens stängning
   kräver att man applicerar ett klockslag på ett annat datum, vilket går sönder
   vid sommartid och skiljer sig mellan Stockholm (15:30 UTC) och New York
   (20:00 UTC). En förbörspunkt dag D+1 ligger per definition efter stängning
   dag D, och en efterbörspunkt dag D likaså. */
export function postCatalystQuote(quote, catalystDate){
  if (!quote || !catalystDate) return null;
  const ok = v => typeof v === "number" && isFinite(v) && v > 0;

  if (ok(quote.extendedPrice) && typeof quote.extendedTime === "string"){
    const d = quote.extendedTime.slice(0, 10);
    const later = d > catalystDate;
    const postSameDay = d === catalystDate && quote.extendedSession === "post";
    if (later || postSameDay)
      return { price: quote.extendedPrice, at: quote.extendedTime,
               session: quote.extendedSession === "post" ? "post" : "pre" };
  }
  if (ok(quote.price) && typeof quote.marketTime === "string" &&
      quote.marketTime.slice(0, 10) > catalystDate)
    return { price: quote.price, at: quote.marketTime, session: "regular" };

  return null;
}

/* Ren funktion: returnerar { db, changed, filled }. Muterar inte indata. */
export function refreshCandidates(db, quotes){
  const cs = (db && Array.isArray(db.candidates)) ? db.candidates : null;
  if (!cs) return { db, changed: false, filled: [] };
  const filled = [];
  const out = cs.map(c => {
    if (!c || c.status !== "new" || c.price != null) return c;
    const q = quotes && quotes[c.ticker];
    const hit = postCatalystQuote(q, c.catalystDate);
    if (!hit) return c;
    filled.push(c.id || c.ticker);
    return Object.assign({}, c, { price: hit.price, priceAsOf: hit.at, priceSession: hit.session });
  });
  if (!filled.length) return { db, changed: false, filled: [] };
  return { db: Object.assign({}, db, { candidates: out }), changed: true, filled };
}

// ---- CLI ---------------------------------------------------------------
const invokedDirectly = process.argv[1] &&
  process.argv[1].replace(/\\/g, "/").endsWith("refresh-candidate-prices.mjs");
if (invokedDirectly){
  if (!existsSync(DB)){
    console.log("scout_candidates.json saknas – inget att uppdatera.");
    process.exit(0);
  }
  let db = null, quotes = {};
  try { db = JSON.parse(readFileSync(DB, "utf8")); }
  catch { console.log("scout_candidates.json går inte att parsa – lämnar den orörd."); process.exit(0); }
  try { quotes = (JSON.parse(readFileSync("state/prices.json", "utf8")) || {}).quotes || {}; }
  catch { console.log("prices.json går inte att läsa – inget att uppdatera."); process.exit(0); }

  const res = refreshCandidates(db, quotes);
  // Skriv BARA vid faktisk ändring: prices.yml kör var 30:e minut, och en
  // ovillkorlig skrivning gav decision_eval.mjs ~48 tomma commits per dygn.
  if (res.changed){
    writeFileSync(DB, JSON.stringify(res.db, null, 1) + "\n");
    console.log(`Fyllde kurs på ${res.filled.length} kandidat(er): ${res.filled.join(", ")}`);
  } else {
    console.log("Inga kandidater fick ny kurs – skriver inte (undviker tom commit).");
  }
}
```

- [ ] **Steg 4: Kör testerna och se dem passera**

Kör: `node tests/run.mjs`
Förväntat: `590 passed, 0 failed`.

Kör dessutom skriptet skarpt och kontrollera att validatorn håller:
```bash
node .github/scripts/refresh-candidate-prices.mjs
node .github/scripts/validate-scout-candidates.mjs
git diff --stat state/scout_candidates.json
```
Förväntat: validatorn svarar OK. Ändras filen ska ANET/AMD **inte** ha fått en kurs daterad 2026-08-04 — deras katalysator är AMC samma dag.

- [ ] **Steg 5: Committa**

```bash
git add .github/scripts/refresh-candidate-prices.mjs tests/run.mjs
git commit -m "refresh-candidate-prices: fyll kandidatkurs bara från post-event-kurs"
```

---

### Uppgift 6: Koppla in i `prices.yml` + `.gitattributes`

**Filer:**
- Modifiera: `.github/workflows/prices.yml` (nytt steg efter "Utvärdera beslutsloggen"; `git add` i commit-steget)
- Modifiera: `.gitattributes`

**Gränssnitt:**
- Konsumerar: CLI:t från uppgift 5.
- Producerar: `state/scout_candidates.json` uppdateras av actionen.

- [ ] **Steg 1: Lägg till steget i workflowen**

I `.github/workflows/prices.yml`, direkt efter steget `Utvärdera beslutsloggen mot efterföljande kurs`:

```yaml
      # Kandidatkurserna fylls EFTER hämtningen: det är den färska prices.json
      # som avgör om en kandidats katalysator hunnit få en kurs efter sig.
      # Fyller bara från en bevisligen post-event-kurs – se skriptets huvud.
      # Faller den ska INTE kursbevakningen falla med den.
      - name: Fyll kandidatkurser ur post-event-kurs
        continue-on-error: true
        run: node .github/scripts/refresh-candidate-prices.mjs
```

- [ ] **Steg 2: Ta med filen i commit-steget**

Ändra `git add`-raden i steget `Committa prices.json om ändrad`:

```yaml
          git add state/prices.json state/price_history.json state/decision_eval.json state/earnings_calendar.json state/scout_candidates.json
```

- [ ] **Steg 3: Skydda filen mot auto-merge**

Lägg i `.gitattributes` (samma rad-stil som `state/dashboard.json`):

```
state/scout_candidates.json -merge
```

Filen har nu TVÅ skrivare — routinen och `prices.yml` — och en auto-merge lägger konfliktmarkörer mitt i JSON:en. Exakt samma skäl som `decision_eval.json` och `earnings_calendar.json` redan är märkta.

- [ ] **Steg 4: Verifiera att workflowen är giltig YAML och att grinden håller**

```bash
node -e "const y=require('fs').readFileSync('.github/workflows/prices.yml','utf8'); if(!/refresh-candidate-prices/.test(y)) throw new Error('steget saknas'); if(!/git add .*scout_candidates\.json/.test(y)) throw new Error('git add saknar filen'); console.log('prices.yml OK')"
node tests/run.mjs
node tests/theme.mjs
node .github/scripts/validate-decisions.mjs
node .github/scripts/validate-scout-candidates.mjs
```
Förväntat: `prices.yml OK`, `590 passed`, `133 passed`, båda validatorerna OK.

- [ ] **Steg 5: Committa**

```bash
git add .github/workflows/prices.yml .gitattributes
git commit -m "prices.yml: fyll kandidatkurser efter hämtningen, skydda filen mot auto-merge"
```

---

### Uppgift 7: Watchdog-kontroll

**Filer:**
- Modifiera: `.github/scripts/watchdog.mjs` (ny export efter `checkScoutCandidates` ~rad 207; inkoppling ~rad 300)
- Test: `tests/run.mjs`

**Gränssnitt:**
- Konsumerar: `postCatalystQuote` från uppgift 5.
- Producerar: `checkCandidatePrice(opts) -> problems[]` med `key: "candidate-price"`.

**Varför:** att refresh-steget slutar fungera är ett TYST fel. Kandidaten avvisas på "kurs ej verifierbar", rapporten ser normal ut, och ingenting går sönder. Samma felsort som regimfiltret och rapportkalendern redan bevakas för.

- [ ] **Steg 1: Skriv de failande testerna**

Lägg i `tests/run.mjs` intill de andra watchdog-testerna (sök på `checkScoutCandidates`):

```js
// ---- watchdog: kandidat utan kurs trots att post-event-kurs finns ----
{
  const cands = { candidates: [
    { id: "260805-ANET", ticker: "ANET", book: "us", status: "new",
      catalystDate: "2026-08-04", price: null, thesis: "Q2 AMC" }
  ] };
  const withPost = { ANET: { price: 205.0, marketTime: "2026-08-05T15:23:00.000Z" } };
  const preOnly  = { ANET: { price: 190.51, marketTime: "2026-08-04T20:00:03.000Z" } };

  ok("watchdog larmar när post-event-kurs finns men kandidaten står på null",
     WD.checkCandidatePrice({ candidatesDb: cands, quotes: withPost })
       .some(p => p.key === "candidate-price"));
  ok("watchdog tiger när bara pre-event-kurs finns",
     WD.checkCandidatePrice({ candidatesDb: cands, quotes: preOnly }).length === 0);
  ok("watchdog tiger utan kandidatfil",
     WD.checkCandidatePrice({ candidatesDb: null, quotes: withPost }).length === 0);
  ok("watchdog tiger utan noteringar",
     WD.checkCandidatePrice({ candidatesDb: cands, quotes: null }).length === 0);
  ok("watchdog tiger för kandidat som redan har kurs",
     WD.checkCandidatePrice({ candidatesDb: { candidates: [Object.assign({},
       cands.candidates[0], { price: 205.0 })] }, quotes: withPost }).length === 0);
}
```

- [ ] **Steg 2: Kör testerna och se dem falla**

Kör: `node tests/run.mjs`
Förväntat: 5 FAIL, `TypeError: WD.checkCandidatePrice is not a function`.

- [ ] **Steg 3: Skriv den minimala implementationen**

Lägg importen överst i `.github/scripts/watchdog.mjs`, bland de andra importerna:

```js
import { postCatalystQuote } from "./refresh-candidate-prices.mjs";
```

Lägg funktionen efter `checkScoutCandidates`:

```js
/* KANDIDAT UTAN KURS TROTS ATT EN POST-EVENT-KURS FINNS.

   Fyller `refresh-candidate-prices.mjs` inte i kursen avvisas kandidaten på
   "kurs ej verifierbar" vid nästa rotation – rapporten ser normal ut, ingenting
   går sönder, och en bekräftad katalysator tystnar. Det är samma tysta felsort
   som regimfiltret och rapportkalendern redan bevakas för.

   Bakåtkompatibel: saknas kandidatfil eller noteringar är kontrollen tyst. */
export function checkCandidatePrice(opts){
  const { candidatesDb, quotes } = opts || {};
  const problems = [];
  const cs = (candidatesDb && Array.isArray(candidatesDb.candidates)) ? candidatesDb.candidates : [];
  if (!cs.length || !quotes) return problems;
  const stuck = cs.filter(c => c && c.status === "new" && c.price == null &&
                               postCatalystQuote(quotes[c.ticker], c.catalystDate));
  if (stuck.length)
    problems.push({ key: "candidate-price", title:
      `Watchdog: ${stuck.length} kandidat(er) saknar kurs trots att en post-event-kurs finns`,
      body: "Följande kandidater i `state/scout_candidates.json` har `price: null` medan " +
        "`state/prices.json` bär en kurs som ligger EFTER deras katalysator:\n\n" +
        stuck.map(c => `- **${c.id}** (${c.book}, katalysator ${c.catalystDate})`).join("\n") +
        "\n\nDet betyder att steget \"Fyll kandidatkurser ur post-event-kurs\" i `prices.yml` " +
        "inte kört eller inte fungerat. Utan kursen avvisas kandidaten på \"kurs ej " +
        "verifierbar\" vid nästa rotation, trots att kursen finns." });
  return problems;
}
```

Noteringarna läses inte av `watchdog.mjs` i dag — bara `generatedAt`. Lägg därför en läsning direkt efter raden som läser `candidatesDb` (sök på `let candidatesDb = null;`):

```js
  let priceQuotes = null;
  try { priceQuotes = JSON.parse(readFileSync("state/prices.json", "utf8")).quotes || null; } catch {}
```

Koppla sedan in kontrollen direkt efter `checkScoutCandidates`-anropet:

```js
  problems.push(...checkCandidatePrice({ candidatesDb, quotes: priceQuotes }));
```

Variabelnamnet `candidatesDb` finns redan i `main()` och används av `checkScoutCandidates` — återanvänd det, deklarera inte om det.

- [ ] **Steg 4: Kör testerna och se dem passera**

```bash
node tests/run.mjs
node .github/scripts/watchdog.mjs
```
Förväntat: `595 passed, 0 failed`. Watchdogen kör utan att kasta.

- [ ] **Steg 5: Committa**

```bash
git add .github/scripts/watchdog.mjs tests/run.mjs
git commit -m "Watchdog: larma när kandidat saknar kurs trots post-event-kurs"
```

---

### Uppgift 8: Beslutsregeln i prompterna + CLAUDE.md

**Filer:**
- Modifiera: `prompts/dagligprompt.md` (punkt 2d), `prompts/us_dagligprompt.md` (punkt 2d), `prompts/scoutprompt.md` (punkt 7)
- Modifiera: `CLAUDE.md` (avsnitt 2, vid `state/scout_candidates.json`)

**Gränssnitt:**
- Konsumerar: `priceSession` som uppgift 5 skriver.
- Producerar: inget kod-gränssnitt.

**Kritiskt:** detta sänker inte verifieringskravet. Utökad kurs är BÄTTRE tidsstämplad än dagens, eftersom den ligger efter katalysatorn i stället för före. Formulera det så — skriv aldrig något som kan läsas som en uppmjukning.

- [ ] **Steg 1: Lägg regeln i båda rotationsprompterna**

I `prompts/dagligprompt.md` och `prompts/us_dagligprompt.md`, i punkt 2d, direkt efter delregeln `(b) price: null → rejected, "kurs ej verifierbar"`, lägg:

```markdown
   **Utökad session (förbörs/efterbörs).** Bär kandidaten `priceSession: "pre"` eller
   `"post"` är kursen verifierad och tidsstämplad – den ligger EFTER katalysatorn, till
   skillnad från den reguljära stängningen samma dag, och räknas därför INTE som "kurs ej
   verifierbar". Kravet är oförändrat: kurs + källa + tidsstämpel.
   **Men ett KÖP på en utökad kurs får aldrig bli ett direktköp.** Förbörs- och
   efterbörshandel är tunn, och en kurs där är inte alltid möjlig att handla på. Promota
   kandidaten och lägg köpet som en VILLKORAD PLAN i `state/portfolj.md`:s Pending-sektion
   med entry-villkor mot REGULJÄR session (punkt 4b), så larmar monitorn när nivån korsas.
   Redovisa alltid session och tidsstämpel i rapporten, t.ex. "471,02 USD (förbörs
   2026-08-05 12:58 UTC)". En utökad kurs som redovisas utan sessionsmärkning ska
   behandlas som overifierad.
```

- [ ] **Steg 2: Lägg motsvarande i scoutprompten**

I `prompts/scoutprompt.md`, i punkt 7 (där kandidater skrivs), lägg:

```markdown
   Sätt `price`/`priceAsOf` bara om kursen ligger EFTER katalysatorn. En reguljär
   stängning samma dag som en AMC-rapport är en PRE-event-kurs – lämna då `price: null`
   och skriv varför i tesen. `prices.yml` fyller i kursen automatiskt så snart en
   post-event-kurs finns (förbörs, efterbörs eller nästa dags reguljära), och märker den
   med `priceSession`. Fyll aldrig i en pre-event-kurs för att fältet ska bli ifyllt.
```

- [ ] **Steg 3: Uppdatera CLAUDE.md**

I `CLAUDE.md`, avsnitt 2, i stycket om `state/scout_candidates.json`, lägg sist:

```markdown
  **Kursen fylls i AUTOMATISKT sedan 2026-08-05** av `.github/scripts/refresh-candidate-prices.mjs`
  (körs i `prices.yml` efter hämtningen), men BARA från en kurs som bevisligen ligger efter
  katalysatorn: utökad punkt senare än `catalystDate`, utökad `post`-punkt samma dag, eller
  reguljär kurs en dag strikt efter. **Anledningen:** 2026-08-05 låg ANET och AMD båda med
  `price: null` medan `prices.json` HADE kurser för dem – kurserna var stängningen 2026-08-04,
  och båda rapporterade 2026-08-04 AMC. Ett skript som fyllt i "kursen som fanns" hade skrivit
  en pre-event-kurs på en post-event-katalysator. Regeln uttrycks med datum + sessionsetikett,
  ALDRIG med klockslag: Stockholm stänger 15:30 UTC, New York 20:00 UTC, och sommartid flyttar
  båda. Kandidatfilen är sedan samma datum också TICKERKÄLLA för `fetch-prices.mjs`
  (`collectCandidateTickers`), vilket ersätter handpåläggningen i `config/watchlist.txt`.
  En kandidat med `priceSession` `"pre"`/`"post"` får BEDÖMAS men aldrig direktköpas –
  köpet läggs som villkorad Pending-plan med entry mot reguljär session.
```

- [ ] **Steg 4: Verifiera att inget test bryts och att kontraktet står i båda prompterna**

```bash
node tests/run.mjs
node tests/theme.mjs
node -e "const fs=require('fs'); for (const f of ['prompts/dagligprompt.md','prompts/us_dagligprompt.md']) { const t=fs.readFileSync(f,'utf8'); if(!/priceSession/.test(t)) throw new Error('regeln saknas i '+f); if(!/[Vv]illkorad/.test(t)) throw new Error('Pending-kravet saknas i '+f); } console.log('prompterna OK')"
```
Förväntat: `595 passed`, `133 passed`, `prompterna OK`.

- [ ] **Steg 5: Committa**

```bash
git add prompts/dagligprompt.md prompts/us_dagligprompt.md prompts/scoutprompt.md CLAUDE.md
git commit -m "Prompter: utökad session duger för bedömning, köp bara som villkorad plan"
```

---

## Slutverifiering (kör efter uppgift 8)

```bash
node tests/run.mjs                                    # 595 passed, 0 failed
node tests/theme.mjs                                  # 133 passed, 0 failed
node .github/scripts/validate-decisions.mjs           # OK
node .github/scripts/validate-scout-candidates.mjs    # OK
node .github/scripts/watchdog.mjs                     # kör utan att kasta
git status --short                                    # rent träd
```

`tests/data.mjs` körs INTE lokalt — den hämtar ~110 filer över nätet och ligger enligt CLAUDE.md bara i `test.yml`. Ingen uppgift här lägger till en hämtning i webbappen, så budgeten på ≤ 30 (nu 29) är orörd.

**Skarpt prov efter push**, i den ordningen:
1. Actions → "Hämta kurser" → Run workflow. Loggen ska visa `N med utökad session` och steget "Fyll kandidatkurser ur post-event-kurs".
2. Kontrollera `state/prices.json`: symboler i `extendedScope` ska ha `extendedPrice`/`extendedTime`/`extendedSession`; övriga ska sakna fälten helt.
3. Kontrollera `state/scout_candidates.json`: en kandidat vars katalysator passerats ska ha fått `price` + `priceAsOf` + `priceSession`. ANET/AMD ska INTE ha fått 2026-08-04 års stängning.
4. Nästa US-rotation: kontrollera att en kandidat med `priceSession: "pre"` bedöms och hamnar som villkorad Pending-plan, inte som direktköp.
