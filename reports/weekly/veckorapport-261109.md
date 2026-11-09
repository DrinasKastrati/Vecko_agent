# Veckorapport: Nordisk Rotation
**Vecka:** v 46 | **Datum:** 2026-11-09
**Marknadsklimat:** OMXS30 (`^OMX`) stängde fredag på **3 267,884** (`state/prices.json`, source "Yahoo Finance (chart API)", marketTime 2026-11-06T16:35:00Z), alltså **−0,11 %** mot förra rotationens bas (fredag 2026-10-30: 3 271,396). **Regimfiltret är PÅ:** 3 267,88 ligger **+3,26 %** över MA200 **3 164,76** (200 daterade stängningar ur `state/price_history.json`, serien bär 250 punkter), mot +3,61 % vid v45-rotationen. **Riksbanken höjde styrräntan 0,25 procentenheter till 2,00 %** den 4/11, med verkan från 11/11. Skälen var starkare konjunktur, kostnadsökningar kopplade till kriget i Mellanöstern och en svagare krona (Riksbankens beslutsdokument "Penningpolitiskt beslut november 2026"). Nästa besked kommer 16/12. **Nordisk medvind:** fastigheter trots räntehöjningen (SAGA-B.ST **+12,03 %**, BALD-B.ST +10,43 %), förnybart (ORSTED.CO +12,74 %, VWS.CO +10,91 %), guld (LUG.ST +12,90 % efter Q3) och konsument/e-handel efter Q3 (BOOZT.ST +7,02 %, THULE.ST +11,07 %). **Nordisk motvind:** olja och tankers (AKRBP.OL **−19,25 %**, FRO.OL −18,01 %, TRMD-A.CO −18,40 %, EQNR.OL −11,75 %, HAFNI.OL −12,72 %), frakt (MAERSK-B.CO −12,01 %) och försvar (SAAB-B.ST −10,40 %, KOG.OL stoppad).

**DATAFÄRSKHET.**
- `state/prices.json`: `generatedAt` **2026-11-07T00:55:35Z**, `schemaVersion` "2026-08-02-prevclose", `wideAt` 2026-11-07T00:55:35Z (bred körning, 308 symboler). Fredagens stängningar är senaste handelsdagens stängning och godkänns före öppning. **Måndagens förbörskörningar har inte nått `main`.** Kontrollerat mot `origin/main` cirka 06:45 UTC: senaste kurscommit är från 2026-11-07.
- `state/news_feed.json`: `generatedAt` 2026-11-07T00:57:38Z, alltså äldre än 24 timmar (helg). Websök har använts som komplement. Fönstret bär **10 av 10 handelsdagar** (2026-10-26 → 2026-11-06, `missingDays` tomt).
- `state/alerts.json`: `checkedAt` 2026-11-06T20:41:39Z och `active` är tom.
- `state/movers.json`: `asOf` **2026-11-06**, alltså förra fredagens stängning. 107 av 110 symboler är OK.
- `state/earnings_calendar.json`: `generatedAt` 2026-11-07T00:53:57Z, 215 av 231 symboler lösta, `failed` 0.

---

## 0. Facit: Förra veckans val
| Aktie | Entry | Exit | Utfall | Stop/Mål träffad? |
|---|---|---|---|---|
| KOG.OL | 351,90 (viktat, ben 1 355,80 + ben 2 348,00) | 339,40 | −3,55 % | Stop @ 342,00 (stängning 339,40 2026-11-05) |
| XACT-OMXS30.ST | 494,60 | 487,35 (öppen) | −1,47 % | Nej (sleeven har varken stop eller mål) |

**Veckans portföljutfall (viktat):** **≈ −0,6 % brutto.** KOG.OL-affären bidrog med cirka −0,9 pp: ben 1 (12,5 %, 355,80 → 339,40) och ben 2 (12,5 % från onsdag, 348,00 → 339,40). Sleeven bar 75–100 % av boken och gick 485,55 → **487,35** (+0,37 %) (`state/price_history.json`). `^OMX` gick −0,11 % över samma period. Talet är en approximation ur dagliga stängningar och vikter. Dashboardens nettosiffra drar dessutom rundturskostnaden för KOG-affären.
**Ackumulerad avkastning sedan strategistart:** **−3,70 %** (fyra stängda affärer, alla 25 %: ASSA-B.ST −3,26 %, SALM.OL −5,48 %, SAAB-B.ST −2,70 %, KOG.OL −3,55 %). Sleevens orealiserade rörelse ingår inte i fältet.
**Portföljallokering denna vecka:** **12,5 % BOOZT.ST (ben 1) + 87,5 % indexsleeve (XACT-OMXS30.ST) + 0 % kassa.**
- Ben 2 (12,5 %) ligger som limit ≤ 165,00 SEK i Pending. Fylls det blir allokeringen 25,0 % BOOZT.ST och 75,0 % sleeve.
- Tre platser står tomma eftersom inget annat case klarade alla fem grindar. Kapitalet ligger i index, aldrig på konto.
- Vikten är platt 25 % per fylld position.

**Lärdom:** Fyra stängda affärer sedan skarp start, fyra stop, ingen på mål. KOG.OL var en bekräftad rapportöverraskning med stoppen under en stängningsbekräftad dagslägsta. Ändå föll den på ett sektorbrett ras (SAAB-B.ST −4,22 % samma session) utan bolagsnyhet, alltså samma mönster som SAAB i v44. Stoppbredden trimmas inte på detta (punkt 1). Lärdomen är i stället att **sektorrisk syns i rörelsegenomgången** (L-7). Veckans case väljs därför ur en sektor med egen medvind (e-handel/konsument efter Q3) och inte ur försvar eller olja, där de största rörelserna var nedåt. Underlaget är fortsatt brus. `state/decision_eval.json` bär inget urvalstal som klarar `MIN_CLUSTERS`, så inget tal citeras.

Tillämpade lärdomar:
- **L-1** och **L-5:** rapportkalendern står i radarn, med täckning.
- **L-2:** varje bubblare har en rad i watchlisten.
- **L-3:** datadefekterna eskaleras, och samtliga är redan öppna i `state/action_items.json`.
- **L-4:** ingen nordisk kandidat har `status: "new"`.
- **L-6:** ingen kandidat är struken på en universumregel.
- **L-7:** rörelsegenomgången är rangordnad ur prishistoriken.
- **L-8:** inga indexöversyner hittades.

### Bred scanning – varifrån bruttolistan kom

**Bruttolistan omfattar 22 kandidater:**
- **8 ur nyhetsflödet** (punkt g0): NORBT.OL, LUMI.ST, LUG.ST, NOBI.ST, HSHP.OL, AUTO.OL, BIOA-B.ST, EGTX.ST.
- **4 bubblare från v45**: SOBI.ST, KCC.OL, GMAB.CO, HNSA.ST.
- **10 ur egen scanning** av veckans rörelser och rapportreaktioner: BOOZT.ST, MORLD.OL, SAGA-B.ST, ORSTED.CO, THULE.ST, VWS.CO, MIPS.ST, CHEMM.CO, CLAS-B.ST, LATO-B.ST.

Nyhetsfönstret bar **10 av 10 handelsdagar** (`window.tradingDaysCovered`).

**Veckans rörelser (punkt g1, enligt L-7).** Rangordningen bygger på `state/price_history.json`. Den omfattar **169 nordiska symboler** (.ST/.OL/.CO/.HE) som har daterad stängning både på basdagen **2026-10-30** och på mätdagen **2026-11-06**, av 174 nordiska serier. `state/movers.json` (`asOf` 2026-11-06) används som komplement. Dess 20 rader finns alla med i prishistorikens rangordning.
- **Störst uppåt:** HEALTH.HE +42,35 %, CHEMM.CO +15,55 %, KABE-B.ST +15,38 %, MORLD.OL +13,73 %, LUG.ST +12,90 %, ORSTED.CO +12,74 %, OSSD.ST +12,15 %, SAGA-B.ST +12,03 %, THULE.ST +11,07 %, VWS.CO +10,91 %, EGTX.ST +10,54 %, BALD-B.ST +10,43 %.
- **Störst nedåt:** AKRBP.OL −19,25 %, TRMD-A.CO −18,40 %, FRO.OL −18,01 %, FLEXQ.ST −14,29 %, BWE.OL −13,97 %, HAFNI.OL −12,72 %, HAYPP.ST −12,72 %, MAERSK-B.CO −12,01 %, EQNR.OL −11,75 %, CHECK.ST −11,48 %, SAAB-B.ST −10,40 %.

Följande togs inte upp i bruttolistan: HEALTH.HE (likviditet 0,3 MEUR/dag och RSI 85,4), KABE-B.ST (1,3 MSEK/dag), OSSD.ST (0,7 MSEK/dag) och BALD-B.ST (volymkvot 1,14×). Var och en faller på ett grind 2-kriterium som går att se direkt ur siffrorna. Nedgångarna i olja, tankers och frakt saknar turnaround-katalysator och har RSI under 40.

**Nyhetsflödets nordiska poster i femdagarsfönstret (2026-11-02 – 2026-11-06):**
- **Norbit:** kontrakt värt 185 MNOK (MFN 2026-11-02T21:11Z).
- **AutoStore:** transaktioner i återköpsprogrammet (MFN 2026-11-02T21:13Z).
- **BioArctic:** samarbetspartnern Novartis avslutar avtalet (MFN 2026-11-02T20:30Z). Beskedet är negativt.
- **Nobia:** kostnadsbesparingar på 150 MSEK (MFN 2026-11-03T19:45Z).
- **Himalaya Shipping:** nya tidsbefraktningsavtal för två fartyg (MFN 2026-11-03T21:05Z).
- **Lundin Mining:** Q3-rapport och ordinarie utdelning (MFN 2026-11-04T22:30Z).
- **Lundin Gold:** kvartalsutdelning på 1,14 USD per aktie (MFN 2026-11-04T23:59Z).
- **Egetis Therapeutics:** ingen egen post i flödet. ANI Pharmaceuticals rekommenderade bud på 11,25 SEK per aktie den 5/11 är verifierat via SEC (ANI:s 8-K, exhibit 99.1).
- **Övrigt, ej kandidater:**
  - Emissioner: Orexo (cirka 253 MSEK) och BioInvent (cirka 430 MSEK, fullt garanterad).
  - Insiderhandel: Bakkafrost, Sparebanken Norge och RING.
  - Flaggning: Boozt och Vicore.
  - Övrigt: Citycons ändrade rapporttidplan, Framerys återköp, Techstep, Otovo, Inissions Q3 och Maximum Entertainment, som går över till halvårsrapportering.
- **Saknas i flödet:** Boozts och Moreld:s Q3-rapporter (3/11 respektive 5/11, båda under handelssessionen). Det är samma dygnstaksdefekt som förut, och de har därför verifierats via websök.

**⚠️ ÅTGÄRDSPUNKT TILL DREN (L-3) – ÅTERKOMMANDE: måndagens schemalagda kurs- och nyhetskörningar har inte startat.**
- **Fil och fält:** `state/prices.json` `generatedAt` 2026-11-07T00:55:35Z och `state/news_feed.json` `generatedAt` 2026-11-07T00:57:38Z. Ingen commit från `prices.yml` eller `news.yml` syns på `main` före cirka 06:45 UTC.
- **Omfång:** 2 av 2 förbörskörningar i `prices.yml` och 1 av 1 i `news.yml`. Det är fjärde måndagen i rad.
- **Ersättningskälla:** fredagens stängningar, som är giltiga före öppning, samt websök.
- **Status:** redan öppen i `state/action_items.json` som `scheduled-actions-not-firing` (`weeksOpen` 10).

**⚠️ ÅTGÄRDSPUNKT TILL DREN (L-3) – ÅTERKOMMANDE: nyhetsflödena `globenewswire` och `globenewswire-earnings` svarar fortfarande HTTP 403.**
- **Fil och fält:** `state/news_feed.json` `feeds.globenewswire` = "HTTP 403 – båda försöken (0.0 s)". `feeds.globenewswire-earnings` har samma status.
- **Omfång:** 2 av 6 flöden, sjätte veckan i rad.
- **Status:** redan öppen som `news-feed-globenewswire-http-403`.

**⚠️ ÅTGÄRDSPUNKT TILL DREN (L-3) – ÅTERKOMMANDE: MFN-flödets dygnstak tar bort handelssessionen.**
- **Fil och fält:** alla `src: "mfn"`-poster 2026-11-02 – 2026-11-06 ligger mellan **17:45 och 23:59 UTC**.
- **Konsekvens:** veckans två bästa nordiska rapportkatalysatorer (Boozt och Moreld) finns inte i flödet.
- **Status:** öppen som `news-window-daily-cap-drops-morning-posts`.

**⚠️ OBSERVATION: mfn.se gick inte att nå från körmiljön** (DNS-uppslaget misslyckas), så MFN-sidor kunde inte öppnas direkt. Rapporterna har i stället verifierats via Inderes/Modular Finance-återpubliceringar och Finwire. Det berör körmiljöns nätpolicy och inget fält i en state-fil, och förs därför inte upp som datadefekt.

**Likviditetsgolvet** räknas som 20-dagarssnittet av volymen ur `state/volume_history.json` gånger verifierad kurs. För `.OL`/`.CO`/`.HE` anges talet i lokal valuta, eftersom växelkurser saknas (`fx-rates-missing-eur-dkk-nok`).

---

## Case 1: Boozt (BOOZT.ST / Nasdaq Stockholm)

### 1. Katalysatorn
**Q3-rapport 2026-11-03 med höjd helårsprognos.**
- **Nettoomsättning:** 1 951 MSEK (1 673), +16 % i fast valuta och +17 % i SEK.
- **Justerad EBIT:** 107 MSEK (67), marginal **5,5 %** (4,0 %).
- **Prognos 2026:** tillväxten höjd till **9–12 %** i fast valuta (7–11 %), justerad EBIT-marginal till **6,5–7,0 %** (6,0–6,8 %). Utfallet väntas i övre delen av båda intervallen.
- **Engångskostnad:** en kommersiell omorganisation kostar cirka 40 MSEK i Q4, motsvarande cirka 0,3 procentenheter av helårets marginal.
- **Källor:** Boozts pressmeddelande "Boozt upgrades full year outlook following strong third quarter" (återpublicerat av Inderes och TradingView/Modular Finance, 2026-11-03) och Finwire "Boozt shares jump 7% after retailer raises 2026 sales, margin outlook" (2026-11-03). Den preliminära prognoshöjningen kom redan 28/9. Rapporten 3/11 lade till de slutliga siffrorna och den högre nivån i intervallen.
- **Reaktion:** aktien gick 152,50 → **164,70** (+8,00 %) dagen efter rapporten (4/11) och har sedan stängt 169,40 och 169,20 (`state/price_history.json`). Volymen låg på 155 000–298 000 aktier per dag mot ett 20-dagarssnitt kring 133 000 (`state/volume_history.json`).
- **`catalystType`:** earnings.

### 2. Investerings-tes (The Bull Case)
* Q3 slog på både tillväxt och marginal, och prognosen pekar mot övre delen av ett redan höjt intervall. Det är en bekräftad överraskning av den typ post-earnings drift bygger på, och horisonten är 3–6 veckor, eftersom PEAD är långsam.
* **Rörelsen höll.** Efter gapet 4/11 gav aktien inte tillbaka något. Fredagen prövade ned till 164,70 och stängde på 169,20, nära dagshögsta 169,30, på **2,24×** 20-dagarssnittets volym. Köpare fanns alltså kvar tre dagar efter rapporten.
* **Lång trend bakom rörelsen (punkt 0a):** +42,3 % på sex månader och en hel EMA-stack (EMA20 158,53 > EMA50 154,19 > EMA200 136,72). Det är inte en tvåveckors spik utan trend: +9,4 % på två veckor ovanpå sexmånadersrörelsen.
* **Säsong:** Q4 bär Black Friday-veckan, som Boozt rapporterat rekord för två år i rad. Det är ett datum att bevaka, inte en köpregel.

### 3. Motargument & Risker (The Bear Case)
* **Prognoshöjningen var delvis känd.** Den preliminära höjningen 28/9 gör att en del av överraskningen redan var prisad. Reaktionen 4/11 (+8 %) visar att rapporten tillförde något, men nästa steg kräver mer än att intervallet håller.
* **Makromotvind:** Riksbanken höjde räntan 4/11 och signalerar fler höjningar. Högre räntor pressar nordisk hushållskonsumtion, som är Boozts marknad.
* **Inget motstånd att ankra målet i:** aktien står på 250-dagarshögsta (169,40, 2026-11-05). Målet sätts därför ur katalysatorbandet och nåbarhetstaket, inte ur ett daterat motstånd (`target-anchor-vs-cost-threshold-conflict`, öppen).
* **Flaggning:** Finansinspektionens flaggningsmeddelande i Boozt (MFN 2026-11-02T23:03Z) anger varken vem eller i vilken riktning i rubriken. Det har inte gått att verifiera i körningen.

### 4. Fundamental snapshot
* **Börsvärde:** ej verifierat i körningen | **P/E / EV/EBITDA:** ej verifierat i körningen | **Tillväxt:** +16 % i fast valuta i Q3; helårsprognos 9–12 % | **Snittomsättning/dag:** **22,5 MSEK** (20-dagarssnitt × 169,20; `state/volume_history.json`), alltså över likviditetsgolvet och i lägsta kostnadsnivån (≥ 20 MSEK/dag, 0,25 %)

### 5. Teknisk setup
* **RSI(14):** 66,0 | **MACD:** histogrammet positivt och stigande, 0,740 → 1,023 | **Kurs vs EMA20/50/200:** över alla tre (158,53 / 154,19 / 136,72; hel stack) | **Volym vs 20d-snitt:** **2,24×** (298 116, 2026-11-06) | **Stöd:** 164,70 (stängning 2026-11-04 och dagslägsta 2026-11-06) och 159,10 (stängning 2026-11-02) | **Motstånd:** inget i serien – 169,40 (2026-11-05) är 250-dagarshögsta.

### 6. Handelsplan
| Entry | Stop-loss | Målkurs | Risk/Reward |
|---|---|---|---|
| 169,20 (ben 1, verifierad stängning 2026-11-06T16:29:46Z) / ≤ 165,00 (ben 2, limit) | 163,00 (−3,66 %) | 189,50 (+12,00 %) | 1:3,27 (ben 1), 1:12,25 (ben 2) |

* **Stopp:** 163,00 ligger strax under stödet 164,70, inom bandet 3–5 %, och sätts tekniskt.
* **Mål:** 189,50 ligger i earnings-bandet 12–15 %. Det är ≥ 2× stoppavståndet (6,20 kr → minst 181,60).
* **Kostnadströskel:** entry → mål är **+12,00 %**, vilket är ≥ 6 % och cirka 48× rundturskostnaden 0,25 %.
* **Nåbarhet (punkt 6):** genomsnittlig absolut dagsrörelse över 60 dagar är **1,73 %**. Taket blir 2 × 1,73 % × √20 = **15,5 %** ≥ 12,00 %, så målet ryms vid 20 handelsdagars horisont.
* **Horisont:** 20 handelsdagar (`earnings`, 3–6 veckor) utan tidsstopp.
* **Binära händelser:** ingen inom 2 handelsdagar. BOOZT.ST saknas bland `upcoming` i `state/earnings_calendar.json`, eftersom rapporten nyss passerats.
* **Totalpoäng 7,2:** katalysator 7 (35 %), teknik 8 (30 %), makro 5 (15 %), R/R 8 (20 %).

**Planerad vikt:** **25 %, delad entry enligt punkt 4a.**
- **Ben 1 (12,5 %)** köps direkt vid rotationen till verifierad marknadskurs.
- **Ben 2 (12,5 %)** läggs som limit ≤ 165,00 i Pending. Det avförs om det inte triggat inom 5 handelsdagar (t.o.m. 2026-11-13).
- Inget undantag för hel limit gäller. Gapet (+8,0 %) var 4/11, inte i dag, och fredagen var −0,12 %. Ingen binär händelse infaller inom 2 handelsdagar.

---

## Övriga kandidater – varför de föll

**1 av 22 bruttokandidater passerade alla fem grindar.** Grinden som loggas är den första som fäller kandidaten i ordningen 1 → 5 (se `gate-assignment-ambiguous`). Spärr 2e (binär händelse inom 2 handelsdagar) är namngiven där den gäller.

| Grind | Fäller (primärt) | Andel |
|---|---|---|
| 1 – verifierad kurs med källa + tidsstämpel | 4 | 18 % |
| 2 – teknisk filtrering (RSI/MACD/EMA/volym/likviditet), inkl. spärr 2e | 14 | 64 % |
| 3 – namngiven, bekräftad och daterad katalysator | 3 | 14 % |
| 4 – R/R ≥ 2:1 och kostnadströskel ≥ 6 % | 0 | – |
| 5 – nåbarhetstak | 0 | – |
| **Valda** | **1 (BOOZT.ST)** | 5 % |
| **Jämförelse v45** | grind 1: 3, grind 2: 15 av 20, valda 1 | – |

### Föll på grind 1 – kurs saknas eller inte handelsbar (4 st)
NOBI.ST, AUTO.OL och BIOA-B.ST har ingen rad i `state/prices.json` och ingen serie i `state/price_history.json`. Alla tre läggs i `config/watchlist.txt` i denna körning (punkt 6b).

| Ticker | Bolag | Händelse (datum, källa) | `catalystType` |
|---|---|---|---|
| NOBI.ST | Nobia | Kostnadsbesparingar på 150 MSEK (MFN 2026-11-03T19:45Z) | turnaround |
| AUTO.OL | AutoStore | Transaktioner i återköpsprogrammet (MFN 2026-11-02T21:13Z) | buyback |
| BIOA-B.ST | BioArctic | Novartis avslutar samarbetsavtalet (MFN 2026-11-02T20:30Z), negativt besked | other |
| MORLD.OL | Moreld | **Q3 2026-11-05:** intäkter 2,2 mdr NOK, justerad EBITDA 376 MNOK (17 %), helårsprognosen för EBITDA höjd från 0,7–0,9 till **0,85–1,0 mdr NOK**, orderstock 8,1 mdr NOK och ett nytt återköp på upp till 5 miljoner aktier (Moreld-pressmeddelande via Inderes 2026-11-05). | earnings |

**MORLD.OL är den enda kandidat utöver BOOZT.ST som i övrigt höll teknik och katalysator:** RSI 69,8, volymkvot **5,15×**, hel EMA-stack (24,11 > 23,57 > 21,10), stigande MACD och likviditet 6,1 MNOK/dag. **Den fälls på att den verifierade kursen inte är handelsbar i dag.** Fredagens stängning 26,50 NOK (marketTime 2026-11-06T15:29:00Z) är cum-utdelning, och **ex-dagen för utdelningen på 0,50 NOK är 2026-11-09**, alltså i dag (avstämning 10/11, utbetalning omkring 17/11; Moreld "Key information relating to cash dividend", 2026-11-05). Ett ben 1 till "verifierad marknadskurs" skulle köpas ex-utdelning till en kurs som ingen fil ännu bär, och nivåer satta mot 26,50 vore förskjutna med 1,9 %. **Saknad verifierad ex-kurs är det enda skälet.** LÄGE B-regelns villkor (1) gäller därmed MORLD.OL från i morgon. Två invändningar kvarstår till den prövningen: oljesektorns ras (makro 4 av 10) och att +15,7 % på två veckor ligger nära punkt 0a:s varning, även om sexmånaderstrenden (+33,8 %) bär rörelsen.

### Föll på grind 2 (14 st)
| Ticker | Kurs (marketTime 2026-11-06) | Veckan | Spärr |
|---|---|---|---|
| LUMI.ST | 204,20 SEK | −5,33 % | **RSI 35,5**, kurs under EMA20, EMA50 och EMA200, MACD fallande. Q3 4/11. |
| HSHP.OL | 143,20 NOK | −5,17 % | **RSI 33,0**, kurs under EMA20 och EMA50. Spärr 2e: Q3 11/11. |
| NORBT.OL | 161,50 NOK | −1,34 % | **RSI 48,5**, kurs under EMA200, MACD-histogrammet vänder ned (0,176 → −0,003). Kontraktet på 185 MNOK gav ingen reaktion. Spärr 2e: Q3 12/11. |
| KCC.OL | 103,20 NOK | −9,95 % | **RSI 44,0**, MACD-histogrammet negativt och fallande. Bubblare v45, stryks. |
| GMAB.CO | 3 527,00 DKK | −9,84 % | **MACD-histogrammet fallande** (65,6 → 39,6), volymkvot 1,20×. Rekylen efter Q3 5/11 pågår. Bubblare v45, stryks. |
| HNSA.ST | 39,46 SEK | +0,31 % | **Volymkvot 1,43×.** Spärr 2e: Q3 11/11 (`isEstimate: false`). Bubblare v45, rankad under. |
| LUG.ST | 670,60 SEK | +12,90 % | **Volymkvot 1,24×.** Q3 4/11 och utdelning 1,14 USD (MFN 2026-11-04T23:59Z), MACD stigande, kurs över alla EMA. EMA20 och EMA50 ligger dock under EMA200 641,35. Bubblare. |
| ORSTED.CO | 148,70 DKK | +12,74 % | **Volymkvot 1,35×**, EMA50 under EMA200, sexmånadersmomentum −8,4 %. Q3 5/11. Bubblare. |
| THULE.ST | 216,80 SEK | +11,07 % | **Volymkvot 1,06×.** Ingen daterad händelse hittad i fönstret. |
| MIPS.ST | 458,20 SEK | +8,68 % | **Volymkvot 1,16×.** Ingen daterad händelse hittad i fönstret. |
| CHEMM.CO | 706,00 DKK | +15,55 % | **RSI 79,1 > 75.** |
| CLAS-B.ST | 538,50 SEK | +8,57 % | **RSI 81,2 > 75** efter +5,59 % på fredagen. |
| LATO-B.ST | 234,60 SEK | +8,46 % | **RSI 77,9 > 75.** Q3 3/11. |
| VWS.CO | 209,90 DKK | +10,91 % | **Spärr 2e: Q3 11/11** inom 2 handelsdagar (`isEstimate: false`). Volymkvot 1,41×. |

### Föll på grind 3 (3 st)
| Ticker | Kurs (marketTime 2026-11-06) | Spärr |
|---|---|---|
| SOBI.ST | 498,20 SEK | Tekniken håller (RSI 71,3, volymkvot **1,59×**, hel EMA-stack, MACD stigande), men **ingen daterad katalysator finns i femdagarsfönstret.** Q3 27/10 och ordförandeförslaget 29/10 ligger utanför, och websök gav ingen Sobi-nyhet daterad 2/11–6/11. Bubblare v45, rankad under. |
| SAGA-B.ST | 185,30 SEK | +12,03 % på veckan på volymkvot 2,24×, men websök gav ingen daterad bolagshändelse. Rörelsen sammanföll med Riksbankens **höjning** 4/11, som inte är medvind för fastigheter, så den kan inte heller bära caset som makrokatalysator. RSI 73,7 och EMA50 under EMA200. Bubblare. |
| EGTX.ST | 11,12 SEK | ANI Pharmaceuticals rekommenderade bud **11,25 SEK** per aktie (2026-11-05; acceptfrist cirka 20/11–18/12) gör att kursen nu ligger på budet (dagsintervall 11,10–11,16). Det är en strukturaffär och ingen köpkatalysator: uppsidan till budet är 1,2 % < 6 %. |

### Grind 4/5
BOOZT.ST är den enda kandidat som nådde grind 4. Den klarar både R/R (3,27:1, kostnadströskel 12,00 %) och nåbarhetstaket (15,5 %), se handelsplanen. Bokens beslutsstatistik citeras inte i veckan: `state/decision_eval.json` bär inget tal som klarar `MIN_CLUSTERS`, och ett tal utan `effectiveN` vore ofärdigt. **L-4:** `state/scout_candidates.json` bär noll nordiska poster med `status: "new"`, vilket är normalt för den nordiska boken. De två `new`-posterna är `book: "us"` (ABNB, VST).

---

## Bubblare (watchlist inför nästa vecka)
1. **MORLD.OL** – Q3 5/11 med höjd EBITDA-prognos och återköp, volymkvot 5,15× och hel EMA-stack. Enda spärren är **saknad verifierad kurs efter ex-utdelningsdagen 9/11**. Rad finns i watchlisten.
2. **SOBI.ST** – tekniken håller (volymkvot 1,59×, hel stack), men den saknar färsk katalysator. Rad finns i watchlisten.
3. **LUG.ST** – Q3 4/11, utdelning och +12,90 % på veckan, fälld på volymkvoten 1,24×. Rad finns i watchlisten.
4. **ORSTED.CO** – Q3 5/11 och +12,74 % på veckan, fälld på volymkvoten 1,35× och EMA50 under EMA200. Rad finns i watchlisten.
5. **SAGA-B.ST** – +12,03 % på volymkvot 2,24× utan daterad händelse. Rad finns i watchlisten.

Samtliga fem har **verifierad kurs med källa och `marketTime` i `state/prices.json`**. MORLD.OL:s kurs är verifierad men cum-utdelning, och den är den enda bubblare där kursen är skälet.

**Förra veckans bubblare:**
- **SOBI.ST** – RANKAD UNDER (grind 3: ingen katalysator i fönstret), kvar som bubblare.
- **KCC.OL** – STRUKEN (grind 2: RSI 44,0, MACD negativt och fallande, −9,95 % på veckan).
- **GMAB.CO** – STRUKEN (grind 2: MACD-histogrammet fallande efter Q3 5/11, volymkvot 1,20×).
- **HNSA.ST** – RANKAD UNDER (grind 2: volymkvot 1,43×; spärr 2e inför Q3 11/11).

**Villkorade bubblar-planer:** **Inga.** Pending-raden BOOZT.ST ≤ 165,00 är ben 2 av veckans valda case och ingen bubblar-plan. MORLD.OL kan inte få fullständiga nivåer mot en verifierad ex-kurs i dag (punkt 4b kräver det). SOBI.ST och SAGA-B.ST faller på grind 3, LUG.ST och ORSTED.CO på grind 2.

## Veckans radar (kommande 5 handelsdagar)
* **Måndag 9/11** – **BOOZT.ST ben 1** köps i dag. **MORLD.OL** handlas ex-utdelning (0,50 NOK).
* **Tisdag 10/11** – inga nordiska rapporter i `state/earnings_calendar.json`.
* **Onsdag 11/11** – **BICO (BICO.ST)**, **DFDS (DFDS.CO)**, **Embracer (EMBRAC-B.ST)**, **Hansa Biopharma (HNSA.ST)**, **Höegh Autoliners (HSHP.OL)** och **Vestas (VWS.CO)** Q3 (`isEstimate: false`). Riksbankens nya styrränta 2,00 % börjar gälla.
* **Torsdag 12/11** – **Karnov (KAR.ST)**, **Norbit (NORBT.OL)** och **Zealand Pharma (ZEAL.CO)** Q3 (`isEstimate: false`).
* **Fredag 13/11** – **Bavarian Nordic (BAVA.CO)** Q3 (`isEstimate: false`). **Sista dagen för BOOZT.ST:s ben 2-limit.**
* **Inom 10 handelsdagar:** NIBE (NIBE-B.ST) 17/11, Hafnia (HAFNI.OL) 18/11, Implantica (IMP-A-SDB.ST) och Subsea 7 (SUBC.OL) 19/11, Frontline (FRO.OL) 20/11 (samtliga `isEstimate: false`).

**⚠️ TÄCKNINGSANGIVELSE ENLIGT L-1 OCH L-5.**
- **Källa:** rapportuppräkningen ovan vilar på `state/earnings_calendar.json` (`generatedAt` 2026-11-07T00:53:57Z, `counts.resolved` **215 av 231 symboler**, `failed` 0, `noCoverage` 14).
- **Täckning:** kalendern begär inte symbolerna i moversuniversumet (`earnings-calendar-excludes-movers-universe`, öppen). **Nordiska Large/Mid Cap-bolag utanför kalenderns symboler är därför OKONTROLLERADE.**
- **L-8:** ingen indexöversyn med beslut och ikraftträdande inom fönstret hittades. `state/news_feed.json` gav inga index-träffar bland fönstrets nordiska MFN-poster. Indexleverantörernas primärkällor täcks inte av någon fil i repot och är därmed **OKONTROLLERADE**.

---

## Bruttolista – samtliga 22 kandidater i `state/decisions.json`
- **KÖP:** BOOZT.ST (ben 1, 12,5 %).
- **Grind 1 (AVVAKTA):** NOBI.ST, AUTO.OL, BIOA-B.ST, MORLD.OL.
- **Grind 2 (AVVAKTA):** LUMI.ST, HSHP.OL, NORBT.OL, KCC.OL, GMAB.CO, HNSA.ST, LUG.ST, ORSTED.CO, THULE.ST, MIPS.ST, CHEMM.CO, CLAS-B.ST, LATO-B.ST, VWS.CO.
- **Grind 3 (AVVAKTA):** SOBI.ST, SAGA-B.ST, EGTX.ST.
- **Indexsleeven:** XACT-OMXS30.ST BEHÅLL, vikten minskad 100,0 % → 87,5 %.

**Watchlist (punkt 6/6b, L-2):**
- **Tillagda, tre rader:** NOBI.ST, AUTO.OL och BIOA-B.ST (beslut utan kurs).
- **Borttagna: inga.** Listan skyddas enligt `prompts/gemensam_korning.md` av ännu omogna beslut (20 handelsdagars utvärderingsfönster), och riktmärket 25 är underordnat mätbarheten (`watchlist-cap-vs-measurability-conflict`).

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
