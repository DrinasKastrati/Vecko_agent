# Daglig bevakning – US-rotation
**Datum:** 2026-10-21 | **Läge:** Daglig bevakning (USD)
**Marknadsläget i korthet:** S&P 500 stängde tisdagen 20/10 på **7 712,57**, +0,28 % mot `previousClose` 7 690,73 (intervall 7 668,03–7 748,42). Nasdaq Composite stod still på **26 424,82** (−0,02 %), så dagen var en rotation från tech till värde (`state/prices.json`, marketTime 2026-10-20T20:45Z resp. 21:15Z, `generatedAt` 2026-10-21T12:55Z). Regimfiltret är **PÅ**: ^GSPC ligger +5,94 % över MA200 7 279,90 (`state/price_history.json`, 250 punkter, råserien). MACD-histogrammet har slutat fördjupas (−10,99 → −10,86) men är fortfarande negativt. USD/SEK står på 9,8743 (2026-10-21T12:54Z). **I dag:** `META`, `TSLA` och `ABT` rapporterar (`state/earnings_calendar.json`, `isEstimate: false`).
**Pre-/after-hours:** SPY saknar utökad kurs i `state/prices.json`. Websök 2026-10-21 ("stock market futures October 21 2026 premarket") gav inget daterat terminsläge för dagen. Sleevens förbörsläge är därför **EJ VERIFIERAT**. Inga aktieinnehav finns som kan ha rapporterat efter stängning. Gårdagens efterbörsrapporter rör kandidater, inte innehav: `SMCI` 36,50 förbörs (2026-10-21T12:54Z) och `COF` 209,35 förbörs (2026-10-21T12:39Z), båda från `state/prices.json`.
**Portföljvikt & kassa:** 100 % indexsleeve (SPY), 0 % kassa. Läget är oförändrat sedan 2026-10-14, och alla fyra aktieplatser är tomma.

---

## Innehav 1: Indexsleeve (SPY) (SPY / NYSE Arca)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| $769,05 – prices.json/Yahoo chart API, 2026-10-20 20:00 UTC, reguljär stängning | −0,54 % | – | – | **BEHÅLL** |

**Pre-/after-hours:** – (ingen utökad kurs i filen, och sleeven har inga nivåer)
**Nyheter senaste 24h:** 2026-10-20: rotationsdag med Dow upp och Nasdaq oförändrat. Efter stängning kom två bekräftade positiva överraskningar (`SMCI` preliminär Q1 FY27, `COF` Q3) och en negativ (`NFLX` sänkt annonsprognos, ~−6 % efterbörs), enligt SEC 8-K och scout-rapport-261021. SPY:s dagsintervall var 764,26–772,28, och dagsrörelsen +0,34 % mot `previousClose` 766,48.
**Motivering:** Sleeven har varken stop eller mål och säljs aldrig på nedgång. Inget aktieköp eller aktiesälj krävde en omviktning i dag, så den ligger kvar på 100 %. Läget är marginellt starkare än i går (+0,34 %, RSI 49,7, histogrammet −1,06 → −1,02), men kursen ligger fortfarande strax under EMA20 770,08.

---

## Pending-planer
Inga pending-planer. Samtliga rader i `state/portfolj_us.md`:s Pending-sektioner är redan överstrukna (TRIGGADE eller AVFÖRDA). Veckorotationen v43 (`us-veckorapport-261019`) lade inga nya.

**Intradag-signaler (2c/2c2):** `state/alerts.json` har `checkedAt` 2026-10-21T12:43:50Z, alltså färskt, och `active` är tom. Monitorn lever och har inga signaler.

**Scout-kandidater (punkt 2d):** två nya poster med `book: "us"`, båda avgjorda i dag och båda **AVVISADE**:
- **`261021-SMCI` (Super Micro Computer):** spärrarna a–e passerade. Katalysatorn är bekräftad (8-K 2026-10-20). Kursen är förbörs **36,50 USD (2026-10-21 12:54 UTC, `state/prices.json`)**, regimen är PÅ, ingen rapport väntas inom 2 handelsdagar och boken har fyra lediga platser. **Faller på grind 2 (teknik):** även med förbörskursen inräknad ligger aktien under EMA20 37,85 och EMA50 37,59, med MACD-histogram −1,06 och RSI 45,9. Aktien föll från 44,94 till 32,47 på tio sessioner in i beskedet, och gapet tar den inte tillbaka över trendlinjerna. Den fullständiga rapporten 2026-11-03 är dessutom en andra binär händelse inom horisonten.
- **`261021-COF` (Capital One):** spärrarna a–e passerade. Förbörskursen är **209,35 USD (2026-10-21 12:39 UTC, `state/prices.json`)**. Tekniken håller: kursen ligger över EMA20 200,67, EMA50 203,32 och EMA200 205,59, RSI är 61,6 och MACD-histogrammet stiger (1,10 → 1,62). Likviditeten är ~763 MUSD/dag. **Faller på grind 5 (nåbarhetstaket):** snittet av den absoluta dagsrörelsen över 20 dagar är 1,06 %, vilket ger 2 × 1,06 % × √30 = **11,6 %**, under `earnings`-bandets golv 14 %. Målet får inte sänkas under bandet, och horisonten är redan på hållregelns tak (30 handelsdagar). Volymkravet (> 1,5×) kan inte prövas förrän reaktionssessionen handlats, men det avgör inte utfallet. Dessutom är 3–6-månadersmomentum platt (−0,5 % på 126 dagar).

Båda avgörandena är loggade i `state/scout_candidates.json` (`decidedBy` = denna rapport) och som `AVVAKTA`-rader i `state/decisions.json`.

**Villkorad bubblar-plan (LÄGE B):** ej tillämplig. Ingen av bubblarna i `us-veckorapport-261019` (BLK, CVX, UNH, CRGY) föll på saknad verifierad kurs. Alla fyra rankades under av omdömesskäl.

## Åtgärder i portfolj_us.md
- Inga affärer. Endast tidsstämpeln och sleevens kursnotering är uppdaterade, och SPY ligger kvar på 100 %.
- Ackumulerad avkastning är oförändrad på **−5,13 %**, eftersom ingen affär stängdes.
- `state/decisions.json`: 3 nya rader (`book: "us"`, `mode: "B"`): BEHÅLL SPY, AVVAKTA SMCI och AVVAKTA COF. Raderna är validerade med `--base`.

## Bevakning inför imorgon
* **META och TSLA i kväll:** capex-besked och marginaler avgör AI-kedjans riktning. Köp före rapport är spärrat (punkt 2e). En bekräftad överraskning prövas från torsdag som vanlig kandidat mot de fem grindarna.
* **BE torsdag 22/10** (bekräftat datum). Prövas som kandidat på samma sätt, efter utfallet.
* **SMCI:** bevakas. Tar aktien sig över EMA20/EMA50 i reguljär handel med volym, och utan att vänta in rapporten 3/11, kan scouten lägga en ny kandidat.
* **Bubblarna:** `CVX` behöver volymbekräftelse (≥ 1,5×) före fönstret som stänger 28/10, inför rapporten 30/10.
* **Regimen:** ^GSPC har 5,9 % marginal till MA200. Den är inte hotad på kort sikt.
* **Åtgärdspunkt till Dren (L-3), ÅTERKOMMANDE:** i `state/news_feed.json` (`generatedAt` 2026-10-21T10:15:04Z) står `feeds.globenewswire` och `feeds.globenewswire-earnings` fortfarande på "HTTP 403 – båda försöken (0.0 s)". Omfång: 2 av 6 flöden, inklusive den enda källan som är dedikerad åt rapportöverraskningar. Övriga fyra flöden levererar, och fönstret täcker 10 av 10 handelsdagar.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
