# Daglig bevakning – US-rotation
**Datum:** 2026-10-23 | **Läge:** Daglig bevakning (USD)
**Marknadsläget i korthet:** Torsdagen 22/10 var risk-av. S&P 500 föll **−1,21 % till 7 663,43** (intervall 7 637,36–7 702,94) och Nasdaq Composite **−2,60 % till 26 008,86**, när META vände från efterbörsuppgång till kraftig nedgång och halvledarna föll brett. Kapitalet roterade till defensiva namn (`state/prices.json`, marketTime 2026-10-22T20:31Z resp. 21:15Z, `generatedAt` 2026-10-23T12:36Z, `schemaVersion` 2026-08-02-prevclose; scout-rapport-261023). Regimfiltret är **PÅ**: ^GSPC ligger +5,15 % över MA200 7 287,77 (`state/price_history.json`, 250 punkter, råserien), men har fallit under EMA20 7 722,62 och EMA50 7 684,14, RSI 45,2, MACD-histogrammet vänt ned igen (−7,55 → −11,24). USD/SEK står på 9,9344 (2026-10-23T12:36Z).
**Pre-/after-hours:** SPY saknar utökad kurs i `state/prices.json`. Websök 2026-10-23 ("stock market futures October 23 2026") gav inget daterat terminsläge för dagen, så sleevens förbörsläge är **EJ VERIFIERAT**. Inga aktieinnehav finns som kan ha rapporterat. Två kandidater har förbörskurser i `state/prices.json`: **`PG` 163,20 (förbörs 2026-10-23 12:30 UTC)**, −1,44 % mot stängningen 165,59, och **`BX` 117,00 (förbörs 2026-10-23 12:04 UTC)**, −1,47 % mot stängningen 118,75.
**Portföljvikt & kassa:** 100 % indexsleeve (SPY), 0 % kassa. Läget är oförändrat sedan 2026-10-14, och alla fyra aktieplatser är tomma.

---

## Innehav 1: Indexsleeve (SPY) (SPY / NYSE Arca)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| $763,96 – prices.json/Yahoo chart API, 2026-10-22 20:00 UTC, reguljär stängning | −1,20 % | – | – | **BEHÅLL** |

**Pre-/after-hours:** – (ingen utökad kurs i filen, och sleeven har inga nivåer)
**Nyheter senaste 24h:** 2026-10-22: bred nedgång med tech och halvledare i botten (S&P 500 −1,21 %, Nasdaq −2,60 %; scout-rapport-261023, bekräftat mot `state/prices.json`). Defensiv rotation lyfte dagligvaror och hälsovård; `PG` rapporterade FQ1 FY27 före öppning (SEC 8-K 2026-10-22) och `BX` Q3 2026 (SEC 8-K 2026-10-22), båda omkring +6 % på dagen. Efter stängning föll `BE` −7,01 % efterbörs (`state/prices.json`, 2026-10-22 23:58 UTC). SPY:s dagsintervall var 761,17–767,71, och dagsrörelsen −1,18 % mot `previousClose` 773,09.
**Motivering:** Sleeven har varken stop eller mål och säljs aldrig på nedgång. Inget aktieköp eller aktiesälj krävde en omviktning i dag, så den ligger kvar på 100 %. Läget har försvagats sedan i går: kursen 763,96 ligger åter under både EMA20 769,76 och EMA50 766,07, RSI 45,2 och MACD-histogrammet har fördjupats (−0,70 → −1,07). Kursen ligger fortsatt klart över MA200 726,65.

---

## Pending-planer
Inga pending-planer. Samtliga rader i `state/portfolj_us.md`:s Pending-sektioner är redan överstrukna (TRIGGADE eller AVFÖRDA). Veckorotationen v43 (`us-veckorapport-261019`) lade inga nya.

**Intradag-signaler (2c/2c2):** `state/alerts.json` har `checkedAt` 2026-10-23T12:26:01Z, alltså färskt, och `active` är tom. Monitorn lever och har inga signaler.

**Scout-kandidater (punkt 2d):** två nya poster med `book: "us"`, båda avgjorda i dag och båda **AVVISADE**:
- **`261023-PG` (Procter & Gamble):** spärrarna a–e passerade. Katalysatorn är bekräftad (SEC 8-K 2026-10-22: nettoförsäljning 23,3 mdr USD +4 %, organisk +4 %, core EPS 2,00, helårsguide oförändrad). Kursen är verifierad förbörs, **163,20 USD (2026-10-23 12:30 UTC, `state/prices.json`)**, som ersätter kandidatens äldre notering 163,73 (09:59 UTC). Regimen är PÅ, ingen rapport inom 2 handelsdagar (`state/earnings_calendar.json`) och boken har fyra lediga platser. Tekniken håller i sig (kurs över EMA20 153,86 > EMA50 150,05 > EMA200 148,39, MACD-histogram stigande 0,85 → 1,18, volym 2,42×, ~1 630 MUSD/dag), men RSI 74,5 ligger precis under taket 75. **Faller på grind 5 (nåbart mål):** `earnings`-bandet kräver 14–18 % mål, och nåbarhetstaket är 2 × 0,94 % × √30 = **10,3 %** även vid bandets längsta horisont (6 veckor). Målet går inte att sänka under bandet, och 250-dagarshögsta 167,20 ligger bara 2,5 % över förbörskursen. En lugn defensiv megacap gör inte 14 % på sex veckor på en rapport i linje med guiden – det är korrekt att den stryks.
- **`261023-BX` (Blackstone):** spärrarna a–e passerade. Katalysatorn är bekräftad (SEC 8-K 2026-10-22: segment-DE ~1,9 mdr USD, realiseringar 7,0 mdr, torrt krut 228,9 mdr). Kursen är verifierad förbörs, **117,00 USD (2026-10-23 12:04 UTC, `state/prices.json`)**, som ersätter kandidatens äldre notering 118,00 (08:19 UTC). Regimen är PÅ, ingen rapport inom 2 handelsdagar och det finns plats. **Faller på grind 2 (teknik):** kursen ligger under MA200 125,28, under EMA50 120,21 och EMA200 128,04 (endast över EMA20 113,69), och aktien är −8,7 % på tre månader. Kurs ≤ MA200 blockerar nya aktiepositioner (`prompts/gemensam_korning.md`), och rapportreaktionen har inte brutit den fallande trenden. RSI 54,8, histogram vändande uppåt (0,45 → 1,15), volym 2,12× och ~700 MUSD/dag avgör inte utfallet.

Båda avgörandena är loggade i `state/scout_candidates.json` (`decidedBy` = denna rapport) och som `AVVAKTA`-rader i `state/decisions.json`. Ingen kandidat promotades.

**Villkorad bubblar-plan (LÄGE B):** ej tillämplig. Ingen av bubblarna i `us-veckorapport-261019` (BLK, CVX, UNH, CRGY) föll på saknad verifierad kurs. Alla fyra rankades under av omdömesskäl.

## Åtgärder i portfolj_us.md
- Inga affärer. Endast tidsstämpeln och sleevens kursnotering är uppdaterade, och SPY ligger kvar på 100 %.
- Ackumulerad avkastning är oförändrad på **−5,13 %**, eftersom ingen affär stängdes.
- `state/decisions.json`: 3 nya rader (`book: "us"`, `mode: "B"`): BEHÅLL SPY, AVVAKTA PG och AVVAKTA BX. Raderna är validerade med `--base`.

## Bevakning inför imorgon
* **Nästa körning är måndag 2026-10-26 = LÄGE A v44.** Bubblar-fönstren från v43 löper ut; bruttolistan ska byggas om från nyhetsflödet och scouten.
* **Rapporter nästa vecka (`state/earnings_calendar.json`):** `BA`, `ITW` 27/10; `GOOGL`, `MSFT`, `BIIB`, `AWK` 28/10. Köp före rapport är spärrat (punkt 2e). Bekräftade överraskningar prövas efteråt som vanliga kandidater.
* **Makro:** FOMC 27–28/10. Regimen har 5,2 % marginal till MA200, men ^GSPC ligger under EMA20 och EMA50 – bevakas.
* **BX:** prövas på nytt först om kursen återtar MA200 (~125).
* **Åtgärdspunkt till Dren (L-3), ÅTERKOMMANDE:** i `state/news_feed.json` (`generatedAt` 2026-10-23T10:09:50Z) står `feeds.globenewswire` och `feeds.globenewswire-earnings` fortfarande på "HTTP 403 – båda försöken". Omfång: 2 av 6 flöden, inklusive den enda källan som är dedikerad åt rapportöverraskningar. Övriga fyra flöden levererar, och fönstret täcker 10 av 10 handelsdagar.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
