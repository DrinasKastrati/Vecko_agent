# Daglig bevakning – US-rotation
**Datum:** 2026-10-22 | **Läge:** Daglig bevakning (USD)
**Marknadsläget i korthet:** S&P 500 stängde onsdagen 21/10 på **7 757,17**, +0,58 % mot `previousClose` 7 712,57 (intervall 7 709,34–7 770,40). Nasdaq Composite steg mer, **+1,05 % till 26 702,86**, med tech i täten (`state/prices.json`, marketTime 2026-10-21T20:31Z resp. 21:15Z, `generatedAt` 2026-10-22T12:57Z, `schemaVersion` 2026-08-02-prevclose). Regimfiltret är **PÅ**: ^GSPC ligger +6,49 % över MA200 7 284,18 (`state/price_history.json`, 250 punkter, råserien). USD/SEK står på 9,9261 (2026-10-22T12:57Z). Efter stängning i går rapporterade `META` och `TSLA`, och EQT lade ett kontantbud på `QGEN`.
**Pre-/after-hours:** SPY saknar utökad kurs i `state/prices.json`. Websök 2026-10-22 ("stock market futures October 22 2026") gav inget daterat terminsläge för dagen, så sleevens förbörsläge är **EJ VERIFIERAT**. Inga aktieinnehav finns som kan ha rapporterat. Två kandidater har förbörskurser i `state/prices.json`: **`META` 678,21 (förbörs 2026-10-22 12:56 UTC)**, −2,77 % mot stängningen 697,52, efter att ha stått på 712,31 efterbörs i går (2026-10-21 23:59 UTC). **`QGEN` 50,50 (förbörs 2026-10-22 12:56 UTC)**, +1,00 % mot stängningen 50,00.
**Portföljvikt & kassa:** 100 % indexsleeve (SPY), 0 % kassa. Läget är oförändrat sedan 2026-10-14, och alla fyra aktieplatser är tomma.

---

## Innehav 1: Indexsleeve (SPY) (SPY / NYSE Arca)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| $773,09 – prices.json/Yahoo chart API, 2026-10-21 20:00 UTC, reguljär stängning | −0,02 % | – | – | **BEHÅLL** |

**Pre-/after-hours:** – (ingen utökad kurs i filen, och sleeven har inga nivåer)
**Nyheter senaste 24h:** 2026-10-21: bred uppgång med tech i täten (S&P 500 +0,58 %, Nasdaq +1,05 %). Efter stängning kom `META` Q3 (intäkt 64,6 mdr USD mot väntade 63,3, Q4-guide 73–76 mdr, smalare capex-intervall; SEC 8-K 2026-10-21) och `TSLA` (sänkt capex, senare Optimus-tidsplan; −3,32 % efterbörs enligt scout-rapport-261022). EQT lade dessutom ett rekommenderat kontantbud på QIAGEN (PR Newswire 2026-10-21 22:46 UTC). SPY:s dagsintervall var 768,40–774,43, och dagsrörelsen +0,53 % mot `previousClose` 769,05.
**Motivering:** Sleeven har varken stop eller mål och säljs aldrig på nedgång. Inget aktieköp eller aktiesälj krävde en omviktning i dag, så den ligger kvar på 100 %. Läget har stärkts sedan i går. Kursen 773,09 ligger åter över EMA20 770,37 (i går strax under), RSI är 53,5 och MACD-histogrammet krymper (−1,02 → −0,70).

---

## Pending-planer
Inga pending-planer. Samtliga rader i `state/portfolj_us.md`:s Pending-sektioner är redan överstrukna (TRIGGADE eller AVFÖRDA). Veckorotationen v43 (`us-veckorapport-261019`) lade inga nya.

**Intradag-signaler (2c/2c2):** `state/alerts.json` har `checkedAt` 2026-10-22T12:47:34Z, alltså färskt, och `active` är tom. Monitorn lever och har inga signaler.

**Scout-kandidater (punkt 2d):** två nya poster med `book: "us"`, båda avgjorda i dag och båda **AVVISADE**:
- **`261022-META` (Meta Platforms):** spärrarna a–e passerade. Katalysatorn är bekräftad (8-K 2026-10-21). Kursen är verifierad förbörs, **678,21 USD (2026-10-22 12:56 UTC, `state/prices.json`)**. Regimen är PÅ, rapporten ligger bakom oss och boken har fyra lediga platser. **Faller på grind 2 (teknik):** efterbörsuppgången till 712,31 har vänt till −2,77 % före öppning. Med förbörskursen inräknad ligger aktien under EMA20 710,72 (över EMA50 681,16 och EMA200 648,88). MACD-histogrammet fördjupas (−9,41 → −10,59) och RSI är 42,5. Likviditeten (~13 000 MUSD/dag) och volymen (1,37× i går) avgör inte utfallet. Reaktionen är inte bekräftad av kursen, och en jakt på den vore ACN-misstaget igen.
- **`261022-QGEN` (QIAGEN):** spärrarna a–e passerade. Budet är bekräftat (styrelserekommenderat, PR Newswire 2026-10-21). Kursen är verifierad förbörs, **50,50 USD (2026-10-22 12:56 UTC, `state/prices.json`)**. Raden ersätter kandidatens äldre förbörsnotering 50,63 (10:06 UTC). Regimen är PÅ, ingen rapport väntas inom 2 handelsdagar och det finns plats. Tekniken håller (kurs över EMA20 45,82, EMA50 44,24 och EMA200 43,07, RSI 73,5 under taket 75, volym 4,45×, ~157 MUSD/dag). **Faller på grind 5 (nåbart mål):** kursen är förankrad i ett kontantbud på **46,50 EUR** med stängning först i mitten av 2027. `ma_rumor`-bandet kräver 10–12 % inom 15 handelsdagar, och det går bara att nå om ett konkurrerande bud kommer. Ett sådant finns enbart som ⚠️ RYKTE – EJ BEKRÄFTAT (Bloomberg via Reuters, 2026-10-20, KKR). Budet kunde inte räknas om till USD med verifierad kurs: EUR/USD saknas i `state/prices.json`, och websök gav ingen daterad notering. Avgörandet beror inte på omräkningen, eftersom uppsidan är taklagd oavsett växelkurs. Bandets nåbarhetstak (2 × 1,76 % × √15 = 13,6 %) bygger på volatilitet från före budet och säger ingenting om en aktie under bud.

Båda avgörandena är loggade i `state/scout_candidates.json` (`decidedBy` = denna rapport) och som `AVVAKTA`-rader i `state/decisions.json`. Ingen kandidat promotades.

**Villkorad bubblar-plan (LÄGE B):** ej tillämplig. Ingen av bubblarna i `us-veckorapport-261019` (BLK, CVX, UNH, CRGY) föll på saknad verifierad kurs. Alla fyra rankades under av omdömesskäl.

## Åtgärder i portfolj_us.md
- Inga affärer. Endast tidsstämpeln och sleevens kursnotering är uppdaterade, och SPY ligger kvar på 100 %.
- Ackumulerad avkastning är oförändrad på **−5,13 %**, eftersom ingen affär stängdes.
- `state/decisions.json`: 3 nya rader (`book: "us"`, `mode: "B"`): BEHÅLL SPY, AVVAKTA META och AVVAKTA QGEN. Raderna är validerade med `--base`.

## Bevakning inför imorgon
* **BE i dag (bekräftat datum, `state/earnings_calendar.json`).** Köp före rapport är spärrat (punkt 2e). En bekräftad överraskning prövas från fredag som vanlig kandidat mot de fem grindarna.
* **META:** bevakas. Tar aktien sig tillbaka över EMA20 (~711) i reguljär handel med vändande histogram, kan scouten lägga en ny kandidat. Den gamla förlängs inte.
* **QGEN:** endast ett bekräftat konkurrerande bud ändrar bedömningen.
* **Makro fredag:** flash-PMI och UMich-inflationsförväntningar. FOMC hålls 27–28/10 (paus prissatt enligt scout-rapport-261022).
* **Bubblarna:** `CVX` behöver volymbekräftelse (≥ 1,5×) före fönstret som stänger 28/10, inför rapporten 30/10.
* **Regimen:** ^GSPC har 6,5 % marginal till MA200 och är inte hotad på kort sikt.
* **Åtgärdspunkt till Dren (L-3), ÅTERKOMMANDE:** i `state/news_feed.json` (`generatedAt` 2026-10-22T10:16:30Z) står `feeds.globenewswire` och `feeds.globenewswire-earnings` fortfarande på "HTTP 403 – båda försöken (0.1 s)". Omfång: 2 av 6 flöden, inklusive den enda källan som är dedikerad åt rapportöverraskningar. Övriga fyra flöden levererar, och fönstret täcker 10 av 10 handelsdagar.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
