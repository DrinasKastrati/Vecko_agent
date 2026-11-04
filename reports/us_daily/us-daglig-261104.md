# Daglig bevakning – US-rotation
**Datum:** 2026-11-04 | **Läge:** Daglig bevakning (USD)
**Marknadsläget i korthet:** Valdagen tisdag 3/11 gav en lugn, positiv session. S&P 500 steg **+0,36 % till 7 568,92** (intervall 7 545,39–7 594,61) och Nasdaq Composite steg **+0,82 % till 25 372,01** (`state/prices.json`, marketTime 2026-11-03T21:30Z resp. 22:15Z, `generatedAt` 2026-11-04T12:57Z, `schemaVersion` 2026-08-02-prevclose). Regimfiltret är **PÅ**: ^GSPC ligger +3,46 % över MA200 7 315,86 (`state/price_history.json`, 250 punkter, råserien). Kortsiktigt är läget fortsatt svagt: indexet ligger under EMA20 7 675,39 och EMA50 7 672,95, RSI är 40,4 och MACD-histogrammet faller (−18,25 → −19,75). USD/SEK står på 9,7391 (2026-11-04T12:57Z). Mellanårsvalets utfall och terminsläget i dag är **EJ VERIFIERADE**: websök gav bara träffar om valen 2018 och 2022, ingen daterad 2026-källa. Efter stängning 3/11 rapporterade `AMD`, `ANET` och `SMCI` (scout-rapport-261104).
**Pre-/after-hours:** Varken SPY eller CBOE har utökad kurs i `state/prices.json`, och websök gav ingen daterad förbörsnivå för 2026-11-04. Förbörsläget för innehaven är därför **EJ VERIFIERAT**. CBOE:s stop 316,00 ligger 8,21 % under stängningen, så ett gap dit skulle kräva en extrem rörelse. Kandidaternas förbörskurser i `state/prices.json`: **`AMD` 479,19 (förbörs 2026-11-04 12:56 UTC)**, −0,97 % mot stängningen 483,90; **`ANET` 178,25 (förbörs 12:56 UTC)**, +4,91 % mot 169,91; **`SMCI` 31,55 (förbörs 12:57 UTC)**, +0,51 % mot 31,39.
**Portföljvikt & kassa:** 87,5 % indexsleeve (SPY) / 12,5 % CBOE (ben 1), 0 % kassa. En av fyra aktieplatser är upptagen. Tre villkorade planer är öppna: CBOE ben 2 ≤ 325,00 (12,5 %), NUE ≤ 262,00 (25 %, sista dag i dag) och AXGN ≤ 46,00 (25 %).

---

## Innehav 1: Indexsleeve (SPY) (SPY / NYSE Arca)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| $754,35 – prices.json/Yahoo chart API, 2026-11-03 21:00 UTC, reguljär stängning | −2,45 % | – | – | **BEHÅLL** |

**Pre-/after-hours:** – (ingen utökad kurs i filen, och sleeven har inga nivåer)
**Nyheter senaste 24h:** 2026-11-03: S&P 500 +0,36 %, Nasdaq +0,82 % (`state/prices.json`). SPY:s dagsintervall var 752,41–757,07 och dagsrörelsen +0,30 % mot `previousClose` 752,10. Mellanårsvalet hölls 3/11; utfallet är ej verifierat. `state/news_feed.json` gav inga sleeve-relevanta poster för 2026-11-03 – 2026-11-04.
**Motivering:** Sleeven har varken stop eller mål och säljs aldrig på nedgång. Ingen plan fylldes och inget aktiesälj krävde omviktning, så den ligger kvar på 87,5 %. Läget är i stort oförändrat sedan i går: 754,35 ligger under EMA20 765,11 och EMA50 764,95, RSI är 40,2 och MACD-histogrammet faller svagt (−1,77 → −1,94). Långtrenden är intakt, med kursen 3,41 % över MA200 729,47.

---

## Innehav 2: Cboe Global Markets (CBOE / Cboe BZX)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| $344,28 – prices.json/Yahoo chart API, 2026-11-03 21:00 UTC, reguljär stängning | +2,61 % | $316,00 (avstånd −8,21 %) | $382,50 (avstånd +11,10 %) | **BEHÅLL** |

**Pre-/after-hours:** EJ VERIFIERAT (ingen utökad kurs i `state/prices.json`, ingen daterad förbörsnivå via websök).
**Nyheter senaste 24h:** 2026-11-03: CBOE −1,41 % till 344,28 (intervall 335,00–350,75) mot ett stigande S&P 500, efter två starka dagar på Q3-rapporten 30/10 (`state/prices.json`). Websök "Cboe Global Markets CBOE stock November 4 2026" gav inga daterade bolagsnyheter för perioden, och `state/news_feed.json` saknar CBOE-poster.
**Motivering:** Tesen är intakt: Q3 30/10 med justerat EPS 3,63 (+36 %) och sänkt opex-guide (SEC 8-K ex. 99.1). Läget har **försvagats något** sedan i går, men bara som en rekyl efter två uppdagar. RSI är 65,1, MACD-histogrammet stiger fortfarande (2,25 → 2,29) och kursen ligger över EMA20 318,15 och EMA50 302,66. Dagslägsta 335,00 låg 6,0 % över stoppen. Stoppen ligger kvar på 316,00 eftersom +5 %-nivån inte nåtts. Ingen rapport för CBOE finns inom 2 handelsdagar (`state/earnings_calendar.json`).

---

## Pending-planer
- **CBOE ben 2: villkor ≤ 325,00 USD (reguljär session) – EJ TRIGGAD** (dagslägsta 335,00, stängning 344,28; prices.json/Yahoo chart API, 2026-11-03 21:00 UTC). Kursen ligger 3,08 % över villkoret → ingen åtgärd. Planen gäller t.o.m. 2026-11-06.
- **NUE: villkor ≤ 262,00 USD (reguljär session) – EJ TRIGGAD** (dagslägsta 271,615, stängning 273,53; prices.json/Yahoo chart API, 2026-11-03 21:00 UTC). Kursen ligger 3,67 % över villkoret → ingen åtgärd. Dagens session är planens femte och sista. Triggar den inte avförs planen i nästa körning. Nivån höjs inte.
- **AXGN: villkor ≤ 46,00 USD (reguljär session) – EJ TRIGGAD** (dagslägsta 49,18, stängning 49,50; prices.json/Yahoo chart API, 2026-11-03 21:00 UTC). Kursen ligger 6,91 % över villkoret → ingen åtgärd. Planen gäller t.o.m. 2026-11-05.
- Övriga rader i `state/portfolj_us.md`:s Pending-sektioner är redan överstrukna (TRIGGADE eller AVFÖRDA).

**Intradag-signaler (2c/2c2):** `state/alerts.json` har `checkedAt` **2026-11-03T20:47:08Z**, alltså ~16,5 timmar gammalt vid körningen (13:15 UTC). Monitorns cron täcker 07–20 UTC och borde ha kört flera gånger i dag. `active` är tom, men enligt punkt 2c2 räknas intradagsskyddet som **FRÅNVARANDE** den här körningen. Jag har därför prövat CBOE:s stop och mål samt alla tre planernas villkor manuellt mot verifierad kurs ovan. Ingen nivå är korsad.

**Scout-kandidater (punkt 2d) – tre nya poster, alla AVVISADE, plus en L-4-omprövning.** Alla tre nya har bekräftad katalysator (rapporter 3/11 efter stängning) och verifierad förbörskurs efter katalysatorn (`priceSession: "pre"`). Regimen är PÅ, ingen rapporterar inom 2 handelsdagar och boken har tre lediga platser. Spärrarna (a)–(e) håller alltså. Alla faller i det fullständiga filtret. Indikatorerna är räknade på råserien t.o.m. 2026-11-03.
- **`261104-AMD` (AMD) – AVVISAD, grind 2 (teknik).** Q3 2026: intäkt 13,4 mdr USD, data center ca +97 %, Q4-guide ca 17 mdr mot konsensus ca 16,2–16,4 (scout-rapport-261104). Förbörskursen 479,19 ligger **under EMA20 542,28 och EMA50 544,07**. RSI är 38,4 och MACD-histogrammet faller (−8,75 → −9,49). Förbörsreaktionen är −0,97 % mot stängningen, alltså ingen bekräftad positiv reaktion. Kursen ligger över MA200 412,94. Likviditet 10 489 MUSD/dag.
- **`261104-ANET` (Arista Networks) – AVVISAD, grind 2 (teknik).** Q3 2026: intäkt ca 3,66 mdr (+58,5 %) och justerat EPS 1,20 mot ca 1,08 (scout-rapport-261104). Förbörskursen 178,25 (+4,91 %) ligger fortfarande **under EMA20 183,60 och EMA50 188,88**. RSI är 38,5 och MACD-histogrammet negativt, men stigande (−2,01 → −1,83). Kursen ligger 7,7 % över MA200 165,54. Volymkvot 1,97×, likviditet 1 097 MUSD/dag.
- **`261104-SMCI` (Super Micro Computer) – AVVISAD, kurs under MA200.** Q1 FY27: intäkt 19,95 mdr mot ca 16,3–17,5 och höjd FY27-guide (scout-rapport-261104). Förbörskursen 31,55 ligger **under MA200 32,67**, och kurs ≤ MA200 blockerar nya aktiepositioner (`prompts/gemensam_korning.md`). Kursen ligger dessutom under EMA20 34,97 och EMA50 36,23 (grind 2).
- **`261103-FN` (Fabrinet) – L-4-OMPRÖVNING, AVVISAD, kurs under MA200.** Dataluckan från 2026-11-03 är fylld: `state/price_history.json` bär nu 250 punkter. Ett nytt fullständigt avgörande ger att stängningen 363,33 (3/11 21:00 UTC, efter katalysatorn, +15,45 % på 2,31× volym) ligger **30,5 % under MA200 522,91**, vilket blockerar. Kursen ligger också under EMA50 405,46, och 120-dagarstrenden är −47,8 % (punkt 1b). Avgörandet ersätter den vilande avvisningen (`decidedAt` 2026-11-04) och är av omdömesskäl, så L-4 är uppfylld.

Avgörandena är loggade i `state/scout_candidates.json` (`decidedBy` = denna rapport) och som `AVVAKTA`-rader i `state/decisions.json`.

**Villkorad bubblar-plan (LÄGE B):** ej tillämplig. Ingen av bubblarna i `us-veckorapport-261102` (CVX, DVN, S, RHI) föll på saknad verifierad kurs.

## Åtgärder i portfolj_us.md
- Inga affärer. CBOE (12,5 %) och SPY (87,5 %) ligger kvar, och ackumulerad avkastning är oförändrad på **−5,13 %**.
- Planerna för CBOE ben 2, NUE och AXGN fick statusraden "EJ TRIGGAD per 2026-11-04", och "Senast uppdaterad" är ändrad.
- `state/decisions.json`: 6 nya rader (`book: "us"`, `mode: "B"`): BEHÅLL SPY, BEHÅLL CBOE, AVVAKTA AMD, AVVAKTA ANET, AVVAKTA SMCI och AVVAKTA FN (L-4). Raderna är validerade med `--base`.

## Bevakning inför imorgon
* **NUE-planen ≤ 262,00 avförs i morgondagens körning** om dagens session inte triggar den. **AXGN-planen ≤ 46,00** har sin sista dag 2026-11-05.
* **Rapporter (`state/earnings_calendar.json`, `generatedAt` 2026-11-04T01:19Z, täcker bara prisbevakade symboler – övriga OKONTROLLERAD, L-5):**
  * 4/11: `NVO`, `PAYC`, `PTC`, `QGEN`, `UTHR`, `KHC`, `BKH`, `CXW` och `RIOT`.
  * 5/11: `DVN` (bubblare), `NET`, `TEAM`, `AKAM`, `IREN`, `KMB`, `U` och `EVCM`, samt `SYNA` och `WBD` (`isEstimate: true`).
  * 6/11: `VST`.
  * Ingen rapport för `CBOE`, `NUE` eller `AXGN`. Köp före rapport är spärrat (punkt 2e).
* **Åtgärdspunkt till Dren (L-3), ÅTERKOMMANDE:** fältet `checkedAt` i `state/alerts.json` är 2026-11-03T20:47Z vid körningen 13:15 UTC, och ingen monitorkörning syns i dag. Samma defekt beskrevs i us-daglig-261030, us-veckorapport-261102 och us-daglig-261103. **Omfång:** intradagsskyddet för CBOE (stop 316,00, mål 382,50) och tre villkorade planer. **Åtgärd:** kontrollera att `monitor.yml` kör, och flytta dess cron från minut 0 (`scheduled-actions-not-firing`).
* **Åtgärdspunkt till Dren (L-3), ÅTERKOMMANDE:** i `state/news_feed.json` (`generatedAt` 2026-11-04T13:02Z) står `feeds.globenewswire` och `feeds.globenewswire-earnings` fortfarande på "HTTP 403 – båda försöken". **Omfång:** 2 av 6 flöden. Övriga fyra levererar, och fönstret täcker 10 av 10 handelsdagar. **Ersättningskälla:** websök och SEC 8-K.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
