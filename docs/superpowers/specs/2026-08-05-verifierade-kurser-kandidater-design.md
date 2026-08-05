# Verifierade kurser för kandidater med rapportkatalysator

**Datum:** 2026-08-05 · **Ägare:** Dren · **Status:** godkänd design, ej byggd

Löser att kandidater med en bekräftad rapportkatalysator avvisas med "kurs ej verifierbar"
trots att katalysatorn är den starkaste signal systemet har. Kravet på verifierad kurs
sänks INTE någonstans i den här designen — den lägger till en kurskälla som är bättre
tidsstämplad än dagens, eftersom den ligger efter händelsen i stället för före.

---

## 1. Problemet, mätt

Tre kandidater i `state/scout_candidates.json` 2026-08-05:

| Ticker | `price` | Kurs i `prices.json` | `marketTime` | Katalysator |
|---|---|---|---|---|
| ANET | `null` | 190,51 | 2026-08-04T20:00:03Z | Q2 4/8 **AMC** |
| AMD | `null` | 518,58 | 2026-08-04T20:00:01Z | Q2 4/8 **AMC** |
| AVGO | 418,16 | 418,16 | 2026-08-04T20:00:01Z | tema, ej event |

Båda `null`-fallen har en kurs i `prices.json`. Båda kurserna är den reguljära
stängningen 2026-08-04, alltså **före** rapporten som släpptes efter stängning samma dag.
Scouten avvisade dem korrekt — AMD:s egen tes säger det rakt ut: *"Prices.json 518,58 är
FÖRE rapporten; post-kurs ej verifierad."*

Det här är samma fel som kostade **PLTR +27,6 %** den 2026-08-04: flaggad tre dagar i rad,
aldrig köpbar, eftersom den enda kurs som fanns var från före rapporten.

### Tidsfönstret som är den egentliga orsaken

För en AMC-rapport dag D:

```
D   20:00 UTC  reguljär stängning  -> enda kursen som finns, PRE-event
D   20:00 UTC  rapporten släpps
D   20:00-00:00 efterbörs          -> post-event kurs finns, hämtas inte
D+1 08:00 UTC  förbörs öppnar      -> post-event kurs finns, hämtas inte
D+1 13:00 UTC  US-ROTATIONEN KÖR   -> ser bara D:s pre-event stängning
D+1 13:30 UTC  reguljär öppning    -> post-event kurs, 30 min FÖR SENT
```

US-rotationen ligger 15:00 CEST = 13:00 UTC, medvetet före öppning. Den kan därför
**aldrig** se en post-AMC reguljär kurs dagen efter rapporten. Förbörshandeln har en
giltig, tidsstämplad kurs från 08:00 UTC — fem timmar innan rotationen kör.

### Verifierat mot skarpt API (2026-08-05)

`https://query1.finance.yahoo.com/v8/finance/chart/AMD?range=2d&interval=1m&includePrePost=true`
ger HTTP 200, 1404 intradagspunkter och explicita sessionsgränser:

```
pre     2026-08-05T08:00:00Z -> 13:30:00Z
regular 2026-08-05T13:30:00Z -> 20:00:00Z
post    2026-08-05T20:00:00Z -> 2026-08-06T00:00:00Z
```

Standardanropet (`range=5d&interval=1d`) har `hasPrePostMarketData: true` men exponerar
INGET `postMarketPrice` i `meta`. Utökad kurs kräver alltså `interval=1m` + explicit
sessionsgräns ur `currentTradingPeriod` — inte ett extra metafält.

---

## 2. Vad som INTE är problemet

Hypotesen "nya namn saknar kurs" mättes och håller inte som huvudorsak:

- `collectTickers()` ger 23 nordiska symboler, **0 utan kurs**.
- `fetch-prices.mjs` skrapar redan senaste veckorapporten (`extractTickers` +
  `extractCaseTickers`), så ett namn som nämns i prosa fångas vid nästa hämtning.
- De 13 kandidater som föll på saknad kurs 2026-08-03 har alla kurs i dag.

Kallstart för nya namn kostar **en hämtningscykel**, inte ett beslut. En separat
`price_requests.json` med egen utgångslogik byggs därför INTE — repot har redan två
listor med utgångssemantik (`scout_candidates.expiresAt`, `earnings_calendar.upcoming`),
och en tredje hygienregel har dålig historik här: `config/watchlist.txt` bär regeln
"nämns de inte på 14 handelsdagar ska de rensas" och har aldrig rensats.

Den enda verkliga luckan i den kategorin är smal och åtgärdas i Del 3.

---

## 3. Design

### Del 1 — utökad session i `fetch-prices.mjs`

Ny exporterad funktion `extendedScope(calendar, candidates, today)` returnerar
symbolmängden som ska få ett extra anrop:

- poster i `state/earnings_calendar.json` → `upcoming` med `tradingDaysAway <= 2`.
  Fältet finns redan. `isEstimate: true` räknas MED här — CLAUDE.md fastslår att ett
  gissat datum duger för att säkra en kurs i förväg, men aldrig som bekräftad binär
  händelse. Den här funktionen avgör bara HÄMTNING, aldrig beslut.
- poster i `state/scout_candidates.json` med `status: "new"`, `confirmed: true` och
  `expiresAt >= today`.

För enbart dessa symboler görs ett andra anrop
`range=2d&interval=1m&includePrePost=true`. Sista punkten med `close != null` som ligger
UTANFÖR `meta.currentTradingPeriod.regular` skrivs till noteringen som **separata fält**:

```json
"extendedPrice": 471.02,
"extendedTime": "2026-08-05T12:58:00.000Z",
"extendedSession": "pre"
```

`extendedSession` är `"pre"` eller `"post"`, härledd ur vilket intervall punkten faller i.

**Hårda krav:**
- `price`, `marketTime`, `previousClose` och `schemaVersion` rörs ALDRIG. Utökad kurs är
  ett tillägg, inte en ersättning.
- Finns ingen punkt utanför reguljär session utelämnas fälten helt — inte `null`.
  Ett `null` skulle inte gå att skilja från "hämtningen misslyckades".
- Faller det extra anropet (timeout, 403, tomt svar) påverkas den vanliga noteringen inte.
  Symbolen får bara sin reguljära kurs, som i dag.
- Ingen `schemaVersion`-bump: inget befintligt fälts BETYDELSE ändras.

### Del 2 — `refresh-candidate-prices.mjs`

Nytt nyckellöst, LLM-fritt skript. Körs i `prices.yml` direkt efter hämtningen, i samma
jobb (samma mönster som `decision_eval.mjs`).

För varje kandidat med `status: "new"` och `price: null`, fyll i **endast från en
bevisligen post-katalysatorisk kurs**:

1. Finns `extendedPrice` och `extendedTime` ligger efter **katalysatordagens reguljära
   stängning för symbolens egen börs** → använd den. Sätt `price`,
   `priceAsOf` = `extendedTime`, `priceSession` = `extendedSession`.
2. Annars, om den reguljära `marketTime` infaller en kalenderdag **strikt efter**
   `catalystDate` → använd `price`/`marketTime`, `priceSession: "regular"`.
3. Annars lämna `price: null`. Kursen som finns är pre-event och duger inte.

**Stängningstiden får INTE hårdkodas till 20:00 UTC.** Det är US-stängning; OSSD.ST
stänger 15:30 UTC och NVO handlas som ADR. Gränsen tas ur `meta.currentTradingPeriod.regular.end`
i samma svar som gav den utökade kursen — börsen definierar sin egen stängning, och
sommartid flyttar den.

**Kalendern skiljer inte på AMC och BMO.** `earnings_calendar.json` har bara ett datum.
Regel 2 antar därför det strängare AMC-fallet: en rapport dag D anses inte vara prissatt
förrän D+1. För en BMO-rapport är det onödigt strängt — D:s stängning är i själva verket
post-event — och kostar en extra cykel. Det är avsiktligt: fel åt det hållet ger ett
uteblivet köp, fel åt andra hållet ger ett köp på en pre-event-kurs. Luckra inte upp det
utan att kalendern först får ett tillförlitligt AMC/BMO-fält.

Regel 3 är hela poängen. Ett skript som fyllde i vilken kurs som helst hade skrivit
190,51 på ANET — den pre-event-kurs scouten redan hade avvisat med rätta — och därmed
förvandlat ett korrekt avstående till ett felaktigt köpunderlag.

**Skriver bara vid FAKTISK ändring.** `generatedAt` jämförs inte. Utan den regeln ger
`prices.yml` ~48 tomma commits per dygn; det är exakt vad `decision_eval.mjs` redan
råkade ut för.

Kandidater med `price` satt rörs aldrig — scoutens och böckernas omdöme skrivs inte över.

### Del 3 — kandidatfilen som tickerkälla

`collectTickers()` och `collectUsTickers()` i `fetch-prices.mjs` tar med tickers ur
`state/scout_candidates.json` för poster med `status: "new"` och `expiresAt >= today`.
`book` avgör vilken samlare som tar symbolen (`nordic` → `collectTickers`, `us` →
`collectUsTickers`).

I dag är filen inte en tickerkälla. ANET hamnade i `prices.json` bara för att scouten
också handskrev in den i `config/watchlist_us.txt`. Den handpåläggningen ska bort.

Ingen ny utgångslogik: kandidatens egen `expiresAt` ÄR utgången. Saknas eller är filen
trasig returneras tom lista — prisbevakningen ska aldrig falla för att kandidatfilen
gjort det (samma regel som `collectEarningsTickers` redan följer).

### Del 4 — watchdog

Ny kontroll i `.github/scripts/watchdog.mjs`: larma när en kandidat har `status: "new"`,
`price: null`, och det finns en **post-katalysatorisk** kurs tillgänglig enligt Del 2:s
regler. Det betyder att uppdateringen inte körde eller inte fungerade.

Tyst fel i dag: ingenting går sönder, rapporten ser normal ut, kandidaten avvisas bara
på fel grund. Bakåtkompatibel — saknas fälten är kontrollen tyst.

---

## 4. Beslutsregeln i prompterna

Berör `prompts/dagligprompt.md`, `prompts/us_dagligprompt.md`, `prompts/scoutprompt.md`
(punkt 2d respektive kursverifieringsavsnitten).

En kandidat vars `priceSession` är `"pre"` eller `"post"`:

- **duger för BEDÖMNING** — tesen lever/punkterad, gapets storlek, R/R mot verifierade
  nivåer. Den är inte längre "kurs ej verifierbar".
- **får INTE bli ett direktköp.** Ett KÖP på en utökad kurs läggs som **villkorad plan i
  Pending-sektionen** i `state/portfolj.md`, med entry-villkor mot **reguljär** session.
  Monitorn (`monitor.yml`) larmar när nivån korsas — mekaniken finns redan och kostar
  noll tokens.

Skälet: förbörs- och efterbörshandel är tunn. En kurs där är verifierad och tidsstämplad,
men inte alltid möjlig att handla på. Att bedöma på den är rätt; att anta att man fått den
är fel.

Rapporten ska ange session och tidsstämpel explicit, t.ex.
"471,02 USD (förbörs 2026-08-05 12:58 UTC)". En utökad kurs som redovisas utan
sessionsmärkning ska behandlas som overifierad.

Varje avgörande loggas som i dag i `state/decisions.json` (`KÖP`/`AVVAKTA`), så
`decision_eval.mjs` får kontrafaktiskt underlag.

---

## 5. Tester (`tests/run.mjs`, rena funktioner, ingen nätåtkomst)

**Del 1**
- `extendedScope` tar med `tradingDaysAway <= 2` och utesluter 3+
- `extendedScope` tar med `isEstimate: true` (hämtning, inte beslut)
- `extendedScope` tar med `confirmed: true`-kandidater och utesluter `confirmed: false`
- `extendedScope` utesluter kandidater som passerat `expiresAt`
- sessionsklassning: punkt före `regular.start` → `"pre"`, efter `regular.end` → `"post"`
- punkt inuti reguljär session ger INGA extended-fält
- tomt/trasigt 1m-svar lämnar den reguljära noteringen orörd

**Del 2**
- fyller från `extendedPrice` när `extendedTime` ligger efter katalysatordagens
  reguljära stängning för symbolens börs
- använder symbolens EGEN stängning, inte 20:00 UTC (nordisk symbol, stängning 15:30 UTC)
- BMO-fallet: rapport dag D med kurs från D:s stängning lämnas `null` (avsiktligt strängt)
- fyller från reguljär kurs när `marketTime` är en dag strikt efter `catalystDate`
- **lämnar `null` när enda kursen är pre-event** (ANET/AMD-fallet — regressionsvakt)
- rör aldrig en kandidat som redan har `price`
- rör aldrig en kandidat med annan status än `"new"`
- returnerar "oförändrad" när inget ändrats (tomma commits)
- resultatet passerar `validate-scout-candidates.mjs` (`price > 0` + `priceAsOf` krävs)

**Del 3**
- öppna kandidater hamnar i rätt samlare enligt `book`
- utgångna kandidater hamnar inte i någon
- trasig kandidatfil ger tom lista, inte kastat fel

**Del 4**
- watchdogen larmar på `new` + `price: null` + post-event-kurs tillgänglig
- watchdogen är tyst när fälten saknas

---

## 6. Fällor som designen medvetet undviker

- **Skriv aldrig över `price` med `extendedPrice` i `prices.json`.** Dashboarden, monitorn,
  `decision_eval.mjs`, `movers.mjs` och `backtest.mjs` läser alla `price` som reguljär
  kurs. En tyst omdefiniering skulle förgifta samtliga.
- **Fyll aldrig en kandidat med en pre-event-kurs.** Se Del 2 regel 3.
- **`isEstimate` styr hämtning, aldrig beslut.** Samma gräns som `earnings_calendar.mjs`
  redan drar.
- **Kör aldrig `fetch-prices.mjs` lokalt** samtidigt som actionen skriver — `pull --rebase`
  fastnar i konflikt. Gäller även det nya skriptet; `state/scout_candidates.json` bör
  märkas `-merge` i `.gitattributes` av samma skäl som `decision_eval.json`, eftersom den
  nu får två skrivare (routinen och actionen).
- **`tests/data.mjs` har ≤ 30 hämtningar i budget och ligger på 29.** Ingen del av den här
  designen lägger till en hämtning i webbappen — kandidatfilen läses redan.

---

## 7. Utanför scope

- Bredare prisuniversum (115 movers-namn). Mätningen visar att tratten inte dör där.
- Egen begäranfil med egen utgångslogik. Se avsnitt 2.
- Att flytta US-rotationen till efter öppning. Designen löser problemet utan schemaändring.
- Post-earnings drift som egen köpregel — mätt och underkänd 2026-08-04
  (`reports/backtest/earnings-260804-*.md`). En bekräftad rapportöverraskning förblir en
  vanlig kandidat som ska passera samma fem grindar som allt annat.
