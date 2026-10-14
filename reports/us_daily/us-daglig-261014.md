# Daglig bevakning – US-rotation
**Datum:** 2026-10-14 | **Läge:** Daglig bevakning (USD)
**Marknadsläget i korthet:** S&P 500 stängde **7 805,45** den 13/10 (−0,02 % mot `previousClose` 7 807,24, intervall 7 786,11–7 814,15), Nasdaq Composite **27 204,38** (−0,15 %) – `state/prices.json`, marketTime 2026-10-13T20:33Z resp. 21:15Z. **KPI för september kom varmare än väntat i dag 12:30 UTC:** +0,6 % m/m och 3,7 % å/å mot väntade 3,6 %, kärn-KPI också över prognos. Terminerna vände nedåt, Nasdaq-100 svagast (−0,5 till −0,65 %), och 10-årsräntan stod kring 5,28–5,31 % (TipRanks / CoinDesk / CNBC 2026-10-14; uppgifterna skiljer sig något mellan källorna). Regimfiltret **PÅ**: ^GSPC +7,52 % över MA200 7 259,46 (`state/price_history.json`, 250 punkter). USD/SEK 10,0222 (2026-10-14T12:51Z).
**Pre-/after-hours:** MRVL och SPY har ingen utökad kurs i `state/prices.json`, och Yahoo går inte att nå från körmiljön (proxyn nekar anslutningen). Förbörsläget för båda är därför **EJ VERIFIERAT**. Ingen after-hours-rapport från något innehav. MRVL saknar post i `state/earnings_calendar.json` inom fönstret. Bland kandidaterna: META förbörs **756,96** (prices.json `extendedSession: "pre"`, 2026-10-14T12:50Z, −0,72 % mot stängningen 762,50).
**Portföljvikt & kassa:** **Efter dagens beslut: 100 % indexsleeve (SPY), 0 % kassa.** MRVL (25 %) säljs, och kapitalet går tillbaka till sleeven. Före körningen: 25 % MRVL + 75 % SPY.

---

## Innehav 1: Indexsleeve (SPY) (SPY / NYSE Arca)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| $778,01 – prices.json/Yahoo chart API, 2026-10-13 20:00 UTC, reguljär stängning | +0,61 % | – | – | **BEHÅLL** |

**Pre-/after-hours:** – (ingen utökad kurs i filen; sleeven har inga nivåer)
**Nyheter senaste 24h:** KPI september varmare än väntat (se ovan). Dagsintervall 775,95–778,75, dagsrörelse −0,01 % mot `previousClose` 778,10.
**Motivering:** Sleeven har varken stop eller mål och säljs aldrig på nedgång. Den **ökas 75 % → 100 %** med kapitalet från MRVL-försäljningen. Omviktning efter ett aktiesälj är det enda tillåtna skälet att röra sleeven i LÄGE B. Läget är oförändrat sedan i går.

---

## Innehav 2: Marvell Technology (MRVL / NASDAQ)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| $268,725 – prices.json/Yahoo chart API, 2026-10-13 20:00 UTC, reguljär stängning | −2,28 % (exit vid stop: −5,45 %) | $260,00 (**BRUTEN intradag 13/10**, dagslägsta 248,45) | $313,50 (+16,66 %) | **SÄLJ** |

**Pre-/after-hours:** EJ VERIFIERAT (ingen utökad kurs i `state/prices.json`, Yahoo ej nåbart från körmiljön).
**Nyheter senaste 24h:** 2026-10-13 – MRVL föll i förbörs och på morgonen (−2 % till ~261) och förlängde därmed måndagens −3,42 %. Rörelsen var en bred försäljning av halvledare och teknik. Den drevs av oro för konkurrens i minnessegmentet sedan kinesiska CXMT rapporterat framsteg med en ny chiparkitektur. Det kom alltså inget bolagsspecifikt besked, och samma dag lanserade Marvell andra generationens Structera X CXL-minnesexpanders (TipRanks 2026-10-13). En rapport om föregående session nämner också insidersälj i registreringar (TradingKey 2026-10-12). Även `state/alerts.json` bär en aktiv **SÄLJ**-signal: `type: "SÄLJ"`, `reason: "stop-loss träffad"`, `basis: "intraday"`, `hitPrice: 248,45`, `checkedAt` 2026-10-14T12:39:45Z. Ingen MRVL-rubrik finns i `state/news_feed.json`.
**Motivering:** Stoppen 260,00 bröts i den reguljära sessionen 2026-10-13. Dagsintervallet var 248,45–269,14 (prices.json, marketTime 2026-10-13T20:00:01Z), alltså 4,44 % under nivån. LÄGE B punkt 2 prövar uttryckligen intradag, och att stängningen 268,725 återhämtade sig över stoppen ändrar inget – samma hantering som MU 2026-08-25. **Exit bokförs till stoppnivån 260,00** enligt bokens konvention (NVDA, MU, ACN). Sessionen öppnade inte under nivån: föregående stängning var 265,86, och morgonkursen ~261 låg ovanför. En stop-order hade alltså fyllts vid nivån. Utfall **−5,45 %**, `realizedRr` −1,00, hållperiod 3 handelsdagar. ^GSPC rörde sig +0,52 % över exakt samma period (7 765,36 → 7 805,45), vilket ger **alpha −5,97 pp**. Tesen (investerardagen 6/10, `other`) är inte formellt punkterad; stoppen avgör ensam. Stoppen flyttas aldrig ned (punkt 6).

---

## Pending-planer
Inga pending-planer. Samtliga rader i `state/portfolj_us.md`:s Pending-sektioner är redan överstrukna, alltså TRIGGADE eller AVFÖRDA tidigare.

**Scout-kandidater (punkt 2d):** `261014-META` (`book: "us"`, `status: "new"`) prövas och blir **rejected**.
- (a) Katalysatorn är bekräftad: Meta lanserade Muse Wonder 2026-10-12 (Meta Newsroom).
- (b) Kurs finns: 762,50 (2026-10-13T20:00:01Z), förbörs 756,96.
- (c) Regimen är PÅ.
- (d) Rapporten 2026-10-21 (`isEstimate: false`) ligger 5 handelsdagar bort, alltså inte inom 2.
- (e) Ledig plats finns.
- (f) **Faller på grind 2.** Volymkvoten är **1,04×** mot kravet 1,5× (`state/volume_history.json`: 22,63 M mot 20-dagarssnittet), och MACD-histogrammet är negativt (−5,78 → −4,82 → −2,98). Det stiger, men det har inte korsat. Det som håller: RSI 66,0, kurs över EMA20 716,92 > EMA50 672,85 > EMA200 643,19, likviditet ~16,6 mdr USD/dag. Noterat utöver grinden: `other`-horisonten 2–4 veckor skulle ha hållit positionen genom Q3-rapporten 21/10, alltså en binär händelse mitt i planen.

Avgörandet är loggat som `AVVAKTA` i `state/decisions.json`.

**Villkorad bubblar-plan (LÄGE B):** ej tillämplig. Ingen bubblare i `us-veckorapport-261013` saknade pending-rad på grund av saknad kurs. Samtliga fyra (TEVA, CVX, XOM, ZS) har kurs och rankades under på grind 2 (volym), alltså av omdömesskäl.

## Åtgärder i portfolj_us.md
- **SÄLJ MRVL @ $260,00** (stoppnivå, bruten intradag 2026-10-13) → flyttad till Historik. Utfall −5,45 % på vikt 25 %, skäl: stopp.
- **Indexsleeven (SPY) ökas 75 % → 100 %.** Fyra av fyra aktieplatser står nu tomma.
- **Ackumulerad avkastning omräknad direkt:** 0,96182 × (1 + 0,25 × −0,054545) = 0,96182 × 0,98636 = **0,94870**, alltså **−5,13 %** (förut −3,82 %).
- `state/scout_candidates.json`: `261014-META` sätts till `rejected` (grind 2).
- `state/decisions.json`: 3 nya rader (`book: "us"`, `mode: "B"`): SÄLJ MRVL, BEHÅLL SPY (sleeven ökas till 100 %, `catalystType: "index"`) och AVVAKTA META (scout, grind 2).

## Bevakning inför imorgon
* **Torsdag 15/10:** PPI plus Q3 från `TSM`, `PNC` och `USB` (`state/earnings_calendar.json`). TSM är den direkta prövningen av AI-halvledartemat efter två dagars CXMT-driven försäljning. Den avgör om MRVL eller sektorn kan bli aktuella igen, men först via en ny rotation och de fulla grindarna.
* **Räntan:** den varma KPI-siffran lyfter 10-årsräntan mot 5,3 %, vilket är motvind för räntekänslig tillväxt. Regimmarginalen är 7,5 %, så regimen är inte hotad.
* **`261014-META`:** rapporterar 21/10. Ett köp före rapporten är spärrat (punkt 2e). Efter rapporten krävs en ny, bekräftad kandidat.
* **Åtgärdspunkt till Dren (L-3), ÅTERKOMMANDE:** `state/news_feed.json` `feeds.globenewswire` och `feeds.globenewswire-earnings` = "HTTP 403 – båda försöken (0.0 s)" (`generatedAt` 2026-10-14T10:17:24Z). Omfång: 2 av 6 flöden. Fönstret täcker 10 av 10 handelsdagar via de övriga flödena.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
