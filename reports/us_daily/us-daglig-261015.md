# Daglig bevakning – US-rotation
**Datum:** 2026-10-15 | **Läge:** Daglig bevakning (USD)
**Marknadsläget i korthet:** KPI-dagen gav en bred nedgång. S&P 500 stängde **7 718,94** den 14/10, −1,11 % mot `previousClose` 7 805,45 (intervall 7 693,31–7 789,15). Nasdaq Composite stängde **26 692,87**, −1,88 %. Källa: `state/prices.json`, marketTime 2026-10-14T20:36Z resp. 21:15Z, `generatedAt` 2026-10-15T12:38Z. Kärn-KPI blev +0,3 % m/m mot väntade +0,2 % (BLS/CNBC 2026-10-14 enligt scout-rapport-261015). Räntekänslig AI-infrastruktur sålde av, medan defensiva namn steg. **PPI för september publicerades i dag 08:30 ET.** Utfallet kunde inte verifieras: websök 2026-10-15 gav inga träffar på siffrorna. Regimfiltret är **PÅ**: ^GSPC ligger +6,27 % över MA200 7 263,40 (`state/price_history.json`, 250 punkter). Indexet har dock fallit under EMA20 7 738,09, RSI är 49,5 och MACD-histogrammet krymper (9,45 → 2,42). USD/SEK står på 9,9669 (2026-10-15T12:38Z).
**Pre-/after-hours:** SPY saknar utökad kurs i `state/prices.json`, så sleevens förbörsläge är **EJ VERIFIERAT**. Ingen after-hours-rapport har kommit från något innehav. I sektorn ligger `TSM` på förbörs **416,75** (prices.json `extendedSession: "pre"`, 2026-10-15T12:38Z), −3,08 % mot stängningen 430,00, efter dagens Q3-rapport. Kandidaten `UNH` står på förbörs 397,24 (12:37Z) och `BLK` på 1 072,40 (efterbörs 14/10 23:30Z).
**Portföljvikt & kassa:** 100 % indexsleeve (SPY), 0 % kassa. Läget är oförändrat sedan 2026-10-14, och alla fyra aktieplatser är tomma.

---

## Innehav 1: Indexsleeve (SPY) (SPY / NYSE Arca)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| $769,60 – prices.json/Yahoo chart API, 2026-10-14 20:00 UTC, reguljär stängning | −0,48 % | – | – | **BEHÅLL** |

**Pre-/after-hours:** – (ingen utökad kurs i filen, och sleeven har inga nivåer)
**Nyheter senaste 24h:** 2026-10-14: den varma kärn-KPI:n gav en bred försäljning (scout-rapport-261015). Dagsintervall 766,71–776,30, dagsrörelse −1,08 % mot `previousClose` 778,01. PPI kom i dag 08:30 ET men är ej verifierad.
**Motivering:** Sleeven har varken stop eller mål och säljs aldrig på nedgång. Inget aktieköp eller aktiesälj krävde en omviktning i dag, så den ligger kvar på 100 %. Läget har försvagats något sedan i går: indexet ligger under EMA20 men klart över MA200.

---

## Pending-planer
Inga pending-planer. Samtliga rader i `state/portfolj_us.md`:s Pending-sektioner är redan överstrukna (TRIGGADE eller AVFÖRDA).

**Intradag-signaler (2c/2c2):** `state/alerts.json` har `checkedAt` 2026-10-15T12:28:17Z, alltså färskt, och `active` är tom. Monitorn lever och har inga signaler.

**Scout-kandidater (punkt 2d):** två poster med `book: "us"` och `status: "new"`. Båda blir **rejected**.
- `261015-UNH` – Q3 2026-10-13, just. EPS 4,69 mot väntade 4,12, höjd helårsguide (UnitedHealth 8-K 2026-10-13).
  - (a) Katalysatorn är bekräftad.
  - (b) Kurs finns: 395,62, marketTime 2026-10-14T20:00:02Z, reguljär session.
  - (c) Regimen är PÅ.
  - (d) Ingen binär händelse finns inom 2 handelsdagar.
  - (e) Ledig plats finns.
  - (f) **Faller på grind 2.** Volymkvoten är **1,41×** mot kravet 1,5× (`state/volume_history.json`: 7,76 M mot 20-dagarssnittet), och EMA20 379,30 ligger under EMA50 385,77. Det som håller är RSI 62,2, kurs över EMA20/50/200, ett stigande MACD-histogram (1,58 → 2,71) och likviditet ~2,2 mdr USD/dag.
  - **Faller dessutom på grind 5 (nåbarhet).** `earnings` kräver ett mål på 14–18 %. Taket är 2 × 1,02 % × √30 = **11,2 %** även vid horisontens längsta 30 handelsdagar.
- `261015-BLK` – Q3 2026-10-14, just. EPS 15,93 mot väntade ~14,2, rekord-AUM.
  - (a)–(e) håller.
  - (f) **Faller på grind 2.** Kursen 1 073,79 ligger under EMA20 1 075,46 och EMA50 1 083,27, och RSI är **48,3** (< 50). Volymen 2,07× håller, men aktien gav bort förbörsuppgången.
  - **Faller dessutom på grind 5.** Taket är 2 × 1,05 % × √30 = **11,5 %**, under 14 %.

Båda avgörandena är loggade som `AVVAKTA` i `state/decisions.json`.

**Villkorad bubblar-plan (LÄGE B):** ej tillämplig. Ingen bubblare i `us-veckorapport-261013` saknade pending-rad på grund av saknad kurs. TEVA, CVX, XOM och ZS rankades alla under på grind 2, alltså av omdömesskäl.

## Åtgärder i portfolj_us.md
- Inga affärer. Endast tidsstämpeln och sleevens kursnotering är uppdaterade, och SPY ligger kvar på 100 %.
- Ackumulerad avkastning är oförändrad på **−5,13 %**, eftersom ingen affär stängdes.
- `state/scout_candidates.json`: `261015-UNH` och `261015-BLK` sätts till `rejected`.
- `state/decisions.json`: 3 nya rader (`book: "us"`, `mode: "B"`): BEHÅLL SPY, AVVAKTA UNH och AVVAKTA BLK.

## Bevakning inför imorgon
* **PPI-utfallet (i dag 08:30 ET)** och detaljhandelns försäljning ska verifieras i nästa körning. En varm siffra efter kärn-KPI förstärker räntemotvinden. Fredag 16/10 kommer industriproduktion och import-/exportpriser.
* **TSM −3,08 % i förbörs** efter Q3. Det håller AI-halvledartemat svagt efter MRVL-stoppen. Ett nytt case kräver en ny rotation och de fulla grindarna.
* **Regimen:** ^GSPC ligger under EMA20 och MACD närmar sig en bearish korsning, men marginalen till MA200 är 6,3 %. Regimen är inte hotad på kort sikt.
* **META** rapporterar 21/10, och köp före rapporten är spärrat (punkt 2e).
* **Åtgärdspunkt till Dren (L-3), ÅTERKOMMANDE:** i `state/news_feed.json` står `feeds.globenewswire` och `feeds.globenewswire-earnings` på "HTTP 403 – båda försöken (0.0 s)" (`generatedAt` 2026-10-15T10:00:20Z). Omfång: 2 av 6 flöden. Fönstret täcker 10 av 10 handelsdagar via de övriga flödena.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
