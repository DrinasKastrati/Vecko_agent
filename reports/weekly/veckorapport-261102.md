# Veckorapport: Nordisk Rotation
**Vecka:** v 45 | **Datum:** 2026-11-02
**Marknadsklimat:** OMXS30 (`^OMX`) stängde fredag på **3 271,396** (`state/prices.json`, source "Yahoo Finance (chart API)", marketTime 2026-10-30T16:35:00Z; sessionen var halvdag före Alla helgons dag, stängning 13:00 lokal tid). Det är **+3,01 %** mot förra rotationens bas (fredag 2026-10-23: 3 175,698). **Regimfiltret är PÅ** med bredare marginal än förra veckan: 3 271,40 ligger **+3,61 %** över MA200 **3 157,3252** (200 daterade stängningar ur `state/price_history.json`, serien bär 250 punkter), mot +0,79 % vid v44-rotationen. Veckan dominerades av fortsatta Q3-rapporter och två stora biotekbesked. **Nordisk medvind:** dansk bioteknik (Genmab **+47,96 %** på fas 3-data, Bloomberg 2026-10-26 och 2026-10-28); norskt försvar (Kongsberg **+18,21 %** efter Q3 29/10, NTB och E24 2026-10-29); norsk shipping (KCC.OL +14,14 %, TRMD-A.CO +7,72 %); Sobi +7,93 % efter Q3 27/10. **Nordisk motvind:** stål och metaller (ALLEI.ST **−20,01 %**, GRK.HE **−19,67 %** efter Q3 27/10); olja (BWE.OL −17,70 % efter Q3 29/10, NESTE.HE −9,40 %); fastigheter (SBB-B.ST −12,50 %); skog (UPM.HE −6,96 %). Makro: Riksbankens besked 4/11 enligt websök i v43 (Morningstar, EFN). Datumet går inte att verifiera ur repots egna filer (`macro-calendar-not-verifiable-from-state`, öppen).

**DATAFÄRSKHET.**
- `state/prices.json`: `generatedAt` **2026-10-31T00:47:18Z**, `schemaVersion` "2026-08-02-prevclose", `wideAt` 2026-10-31T00:47:18Z (bred körning, 298 symboler). **Måndagens förbörskörningar har inte nått `main`.** Det är kontrollerat mot `origin/main` cirka 06:45 UTC: senaste kurscommit är 2026-10-31 00:47 UTC. Det påverkar inte beslutsunderlaget, eftersom börserna inte har öppnat. Fredagens stängningar är senaste handelsdagens stängning och godkänns därför enligt datakraven. **Stockholmskurserna bär marketTime ~11:59Z.** Det är halvdagens stängning, inte en intradagsnotering: 99 av 172 nordiska symboler ligger där, Oslo ligger på ~15:25–15:29Z och Köpenhamn/Helsingfors på ~15:59/16:29Z.
- `state/news_feed.json`: `generatedAt` 2026-10-30T23:00:03Z, alltså **äldre än 24 timmar** (helg). Websök har använts som komplement. Fönstret bär **10 av 10 handelsdagar** (2026-10-19 → 2026-10-30, `missingDays` tomt).
- `state/alerts.json`: `checkedAt` 2026-10-30T22:55:04Z och `active` är tom.
- `state/movers.json`: `asOf` **2026-10-30**, alltså förra fredagens stängning. 107 av 110 symboler är OK.

---

## 0. Facit: Förra veckans val
| Aktie | Entry | Exit | Utfall | Stop/Mål träffad? |
|---|---|---|---|---|
| SAAB-B.ST | 639,25 (viktat, ben 1 646,50 + ben 2 632,00) | 622,00 | −2,70 % | Stop @ 622,00 (intradag 2026-10-26, `dayLow` 618,90) |
| XACT-OMXS30.ST | 494,60 | 485,55 (öppen) | −1,83 % | Nej (sleeven har varken stop eller mål) |

**Veckans portföljutfall (viktat):** **≈ +2,1 % brutto.** SAAB-B.ST stoppades samma session som den köptes och bidrog med −2,70 % × 25 % = −0,68 pp. Sleeven bar 87,5 % på måndagen och 100,0 % från tisdag. XACT-OMXS30.ST gick 471,60 → 478,85 (+1,54 %) på måndagen och 478,85 → **485,55** (+1,40 %) tisdag–fredag (`state/prices.json`, marketTime 2026-10-30T11:51:09Z). `^OMX` steg +3,01 % över samma period. Talet är en approximation ur sleevens dagliga stängningar. Dashboardens nettosiffra drar dessutom rundturskostnaden för SAAB-affären.
**Ackumulerad avkastning sedan strategistart:** **−2,83 %**, oförändrad sedan 2026-10-26. Tre affärer har stängts sedan skarp start: ASSA-B.ST −3,26 %, SALM.OL −5,48 % och SAAB-B.ST −2,70 %, alla med vikt 25 %. Sleevens orealiserade rörelse ingår inte i fältet.
**Portföljallokering denna vecka:** **12,5 % KOG.OL (ben 1) + 87,5 % indexsleeve (XACT-OMXS30.ST) + 0 % kassa.**
- Ben 2 (12,5 %) ligger som limit ≤ 348,00 NOK i Pending. Fylls det blir allokeringen 25,0 % KOG.OL och 75,0 % sleeve.
- Tre platser står tomma eftersom inget annat case klarade alla fem grindar. Kapitalet ligger i index, aldrig på konto.
- Vikten är platt 25 % per fylld position.

**Lärdom:** Förra veckans enda case (SAAB-B.ST) var en rapportreaktion som stoppades redan första sessionen. Stoppet låg 0,4 % under rapportdagens dagslägsta, och kursen steg sedan +8,55 % på fyra dagar (retro-261031, bedömt som ACCEPTABELT UTFALL). Lärdomen gäller inte stoppbredden, som inte får trimmas på ett enskilt utfall (out-of-sample håller ingen nivå, punkt 1). Den gäller ankringen: veckans stopp för KOG.OL sätts under en **stängningsbekräftad** dagslägsta (fredag 345,00, när kursen stängde på dagshögsta) och inte under rapportdagens gap-lägsta. KOG.OL var bubblare 5 i v43 och stod i v44:s radar (Q3 29/10). Bevakningen i förväg gav kurs, serie och volym på eventdagen (**L-2**).

Tillämpade lärdomar:
- **L-1** och **L-5:** rapportkalendern står i radarn, med täckning.
- **L-2:** varje bubblare har en rad i watchlisten.
- **L-3:** datadefekterna eskaleras, och samtliga är redan öppna.
- **L-4:** ingen nordisk kandidat har `status: "new"`.
- **L-6:** ingen kandidat är struken på en universumregel.
- **L-7:** rörelsegenomgången är rangordnad ur prishistoriken.
- **L-8:** inga indexöversyner hittades.

### Bred scanning – varifrån bruttolistan kom

**Bruttolistan omfattar 20 kandidater:**
- **6 ur nyhetsflödet** (punkt g0): LUG.ST, SOBI.ST, ATCO-A.ST, GJF.OL, HEALTH.HE, GGEO.ST.
- **4 bubblare från v44**: VITR.ST, HNSA.ST, LOGI-B.ST, ELUX-B.ST.
- **10 ur egen scanning** av veckans rörelser och rapportreaktioner: GMAB.CO, KOG.OL, CADLR.OL, KCC.OL, TRMD-A.CO, ORNBV.HE, ALLEI.ST, GRK.HE, BWE.OL, XBRANE.ST.

Nyhetsfönstret bar **10 av 10 handelsdagar** (`window.tradingDaysCovered`).

**Veckans rörelser (punkt g1, enligt L-7).** Rangordningen bygger på `state/price_history.json`. Den omfattar **167 nordiska symboler** (.ST/.OL/.CO/.HE) som har daterad stängning både på basdagen **2026-10-23** och på mätdagen **2026-10-30**, av 171 nordiska serier. `state/movers.json` (`asOf` 2026-10-30) används som komplement. Dess tio rader (GMAB.CO, ALLEI.ST, KOG.OL, CTM.ST, SBB-B.ST, SF.ST, NESTE.HE, ELUX-B.ST, ORNBV.HE, NOKIA.HE) finns alla med i prishistorikens rangordning.
- **Störst uppåt:** GMAB.CO +47,96 %, KOG.OL +18,21 %, XBRANE.ST +17,92 %, KCC.OL +14,14 %, CTM.ST +12,61 %, EGTX.ST +11,04 %, IMP-A-SDB.ST +10,16 %, SF.ST +9,79 %, ELUX-B.ST +9,25 %, CADLR.OL +9,01 %.
- **Störst nedåt:** ALLEI.ST −20,01 %, GRK.HE −19,67 %, BWE.OL −17,70 %, SBB-B.ST −12,50 %, NESTE.HE −9,40 %, UPM.HE −6,96 %, SINCH.ST −6,50 %, WRT1V.HE −6,29 %.

CTM.ST (likviditet 0,6 MSEK/dag), EGTX.ST (volymkvot 0,42×, Q3 6/11), IMP-A-SDB.ST (0,29×) och SF.ST (RSI 39,3) togs inte upp i bruttolistan. Var och en faller på ett grind 2-kriterium som går att se direkt ur siffrorna, och ingen har en daterad händelse i fönstret.

**Nyhetsflödets nordiska poster i femdagarsfönstret (2026-10-26 – 2026-10-30):**
- **Lundin Gold:** höghaltiga borrresultat vid FDNS (MFN 2026-10-26T21:00Z).
- **Gjensidige:** återköp av egna aktier och primärinsiderhandel (MFN 2026-10-27T18:45Z).
- **Guideline Geo:** order på 1,7 MUSD från en strategisk partner inom försvar (MFN 2026-10-27T17:30Z).
- **Nightingale Health:** protokollavtal på 1 MUSD med Alzheimer's Research UK (MFN 2026-10-28T19:15Z).
- **Atlas Copco:** investering i tillverkning i Voorheesville, New York (MFN 2026-10-28T19:33Z) och en "Expansion Week" i USA (MFN 2026-10-30T18:58Z).
- **Sobi:** Börje Ekholm föreslås som ny styrelseordförande (MFN 2026-10-29T18:45Z).
- **Övrigt, ej kandidater:**
  - Tulikivi sänker prognosen (MFN 2026-10-28T20:30Z).
  - Emissioner: Miris (cirka 20 MSEK) och Techstep (preliminärt utfall).
  - Rapporter: B3 Consulting (Q3) och Konsolidator (justerad prognos).
  - VD-byte: AlzeCure.
  - Övrigt: Kaldvíks förlängda waiver, Creturners konkursansökan och Enoramas hävda avtal.
- **Saknas i flödet:** Kongsbergs, Sobis och Genmabs egna meddelanden från handelssessionen. Det är samma dygnstaksdefekt som förut (se åtgärdspunkt nedan), och de har därför verifierats via websök.

**⚠️ ÅTGÄRDSPUNKT TILL DREN (L-3) – ÅTERKOMMANDE: måndagens schemalagda kurs- och nyhetskörningar har inte startat.**
- **Fil och fält:** `state/prices.json` `generatedAt` 2026-10-31T00:47:18Z och `state/news_feed.json` `generatedAt` 2026-10-30T23:00:03Z. Ingen commit från `prices.yml` (cron `9 5`/`9 6` UTC) eller `news.yml` syns på `main` före cirka 06:45 UTC.
- **Omfång:** 2 av 2 förbörskörningar i `prices.yml` och 1 av 1 i `news.yml`. Det är tredje måndagen i rad (2026-10-19, 2026-10-26, 2026-11-02).
- **Ersättningskälla:** fredagens stängningar, som är giltiga före öppning, samt websök.
- **Status:** redan öppen i `state/action_items.json` som `scheduled-actions-not-firing` (`weeksOpen` 9).

**⚠️ ÅTGÄRDSPUNKT TILL DREN (L-3) – NY OBSERVATION: volymkvoten mäts på en halv session efter en svensk halvdag.**
- **Fil och fält:** `state/volume_history.json`, punkten 2026-10-30 för alla `.ST`-symboler. Stockholm stängde 13:00 lokal tid, så punkten bär cirka halva normal omsättning.
- **Konsekvens:** volymkvoten (senaste punkten mot 20-dagarssnittet) blir mekaniskt låg för **samtliga** svenska kandidater denna rotation. Exempel: SOBI.ST 0,49× på halvdagen mot 1,34× på heldagen 29/10, HNSA.ST 0,57× mot 1,54×, ELUX-B.ST 0,74× mot 1,73× och VITR.ST 0,39× mot 1,53×.
- **Hantering:** grinden har tillämpats som skriven, på senaste punkten. **Inget beslut i veckan avgörs dock av det.** HNSA.ST, ELUX-B.ST och VITR.ST fälls även med heldagsmåttet, på grind 3 respektive RSI > 75 (se tabellen). Veckans enda valda case är norskt (full session).
- **Relaterat:** `volume-point-is-half-session-for-wide-symbols` och `grind2-volume-threshold-uncalibrated` (båda öppna). Ingen prompt anger hur en halvdag ska hanteras.

**⚠️ ÅTGÄRDSPUNKT TILL DREN (L-3) – ÅTERKOMMANDE: nyhetsflödena `globenewswire` och `globenewswire-earnings` svarar fortfarande HTTP 403.**
- **Fil och fält:** `state/news_feed.json` `feeds.globenewswire` = "HTTP 403 – båda försöken (0.0 s)". `feeds.globenewswire-earnings` har samma status.
- **Omfång:** 2 av 6 flöden, femte veckan i rad.
- **Status:** redan öppen som `news-feed-globenewswire-http-403`.

**⚠️ ÅTGÄRDSPUNKT TILL DREN (L-3) – ÅTERKOMMANDE: MFN-flödets dygnstak tar bort handelssessionen.**
- **Fil och fält:** alla `src: "mfn"`-poster 2026-10-26 – 2026-10-30 ligger mellan **17:15 och 22:51 UTC** (150 poster).
- **Konsekvens:** veckans tre största nordiska bolagsbesked (Kongsberg Q3, Sobi Q3 och Genmabs fas 3-data) finns inte i flödet.
- **Status:** öppen som `news-window-daily-cap-drops-morning-posts`.

**Likviditetsgolvet** räknas som 20-dagarssnittet av volymen ur `state/volume_history.json` gånger verifierad kurs. För `.OL`/`.CO`/`.HE` anges talet i lokal valuta, eftersom växelkurser saknas (`fx-rates-missing-eur-dkk-nok`). Utom för XBRANE.ST (2,8 MSEK/dag) och GRK.HE (1,5 MEUR/dag, över golvet även i SEK) ligger alla kandidater långt från golvet.

---

## Case 1: Kongsberg Gruppen (KOG.OL / Oslo Børs)

### 1. Katalysatorn
**Q3-rapport 2026-10-29 med rekordhög orderstock.**
- **Orderstock:** 174,2 mdr NOK, +16,7 mdr under kvartalet.
- **Orderingång:** 23,3 mdr NOK (9,5).
- **Intäkter:** cirka 11,3 mdr NOK, cirka +50 %.
- **Rörelseresultat (EBIT):** cirka 1,9 mdr NOK, +66 %.
- **Källor:** NTB-pressmelding "Q3 2026: KONGSBERG leverer et sterkt tredje kvartal med en rekordhøy ordrereserve" 2026-10-29, E24 "Kongsberg Gruppen løftes etter tallslipp" 2026-10-29 och EFN "Styrkebesked från norska försvarsjätten" 2026-10-29.
- **Reaktion:** aktien gick 312,10 → **352,70** (+13,01 %) på rapportdagen på **5,07 miljoner** aktier, cirka 5× normal volym (`state/price_history.json`, `state/volume_history.json`).
- **`catalystType`:** earnings.

### 2. Investerings-tes (The Bull Case)
* Rapporten slog på orderingång, intäkter och resultat. Orderingången är 2,5 gånger fjolårets, och orderstocken ger leveranssynlighet flera år framåt. Det är en bekräftad överraskning av den typ post-earnings drift bygger på. Horisonten är 3–6 veckor, eftersom PEAD är långsam.
* **Fredagen bekräftade rörelsen i stället för att ge tillbaka den.** Aktien prövade ned till 345,00 och stängde på dagshögsta **355,80** (+0,88 %) på 1,90 miljoner aktier, 1,53× 20-dagarssnittet. Köpare fanns alltså kvar dagen efter gapet. MACD-histogrammet stiger (3,800 → 5,468), och aktien har stigit +13,9 % på sex månader, vilket är lång trend bakom rörelsen enligt punkt 0a.
* **Strukturell medvind:** europeiska upprustningsbudgetar och missil- och luftvärnsefterfrågan. Bokade ordrar på 23,3 mdr på ett kvartal visar att efterfrågan omsätts i kontrakt.

### 3. Motargument & Risker (The Bear Case)
* **Gapet är redan stort.** +13 % på en dag och +12,8 % på två veckor gör att RSI 73,6 ligger nära gränsen 75. Rörelsen jagas inte (punkt g1): entry sker på den bekräftade nivån efter gapet, och ben 2 ligger på rekyl.
* **Förra veckans analogi:** SAAB-B.ST, ett annat nordiskt försvarsbolag med stark Q3, stoppades redan första sessionen efter rapporten. Försvarssektorn svänger brett på fredssignaler (Ukraina) och budgetbesked. Stoppet är det enda skyddet och flyttas aldrig ned.
* **Trenden är inte ren:** EMA50 311,69 ligger strax under EMA200 313,45, så den långa stacken är ännu inte i ordning. 250-dagarshögsta 423,50 (2026-04-09) visar att aktien handlats betydligt högre och att det finns säljare på vägen upp.

### 4. Fundamental snapshot
* **Börsvärde:** ej verifierat i körningen | **P/E / EV/EBITDA:** ej verifierat i körningen | **Tillväxt:** intäkter cirka +50 % i Q3 (NTB 2026-10-29) | **Snittomsättning/dag:** **443 MNOK** (20-dagarssnitt 1 245 419 aktier × 355,80; `state/volume_history.json`)

### 5. Teknisk setup
* **RSI(14):** 73,6 | **MACD:** histogrammet positivt och stigande, 3,800 → 5,468 | **Kurs vs EMA20/50/200:** över alla tre (315,73 / 311,69 / 313,45; EMA50 strax under EMA200) | **Volym vs 20d-snitt:** **1,53×** (1 900 959, full session) | **Stöd:** 345,00 (fredagens dagslägsta, stängning på dagshögsta) och 336,70 (stängning 2026-08-14) | **Motstånd:** 423,50 (250-dagarshögsta 2026-04-09). Inget daterat motstånd finns mellan 355,80 och 400 i den 120-dagars serien.

### 6. Handelsplan
| Entry | Stop-loss | Målkurs | Risk/Reward |
|---|---|---|---|
| 355,80 (ben 1, verifierad stängning 2026-10-30T15:29:18Z) / ≤ 348,00 (ben 2, limit) | 342,00 (−3,88 %) | 399,00 (+12,14 %) | 1:3,1 (ben 1), 1:8,5 (ben 2) |

* **Stopp:** 342,00 ligger strax under fredagens dagslägsta 345,00, inom bandet 3–5 %, och sätts tekniskt.
* **Mål:** 399,00 ligger inom earnings-bandet 12–15 % och under 250-dagarshögsta 423,50.
* **Kostnadströskel:** entry → mål är **+12,14 %**, vilket är ≥ 6 % och cirka 49× rundturskostnaden 0,25 %.
* **Nåbarhet (punkt 6):** genomsnittlig absolut dagsrörelse över 60 dagar är **1,66 %**. Taket blir 2 × 1,66 % × √20 = **14,8 %** ≥ 12,14 %, så målet ryms vid 20 handelsdagars horisont.
* **Horisont:** 20 handelsdagar (`earnings`, 3–6 veckor) utan tidsstopp.
* **Binära händelser:** ingen inom 2 handelsdagar, eftersom rapporten nyss passerats. KOG.OL saknas bland `upcoming` i `state/earnings_calendar.json`.
* **Totalpoäng 7,4:** katalysator 8 (35 %), teknik 7 (30 %), makro 6 (15 %), R/R 8 (20 %).

**Planerad vikt:** **25 %, delad entry enligt punkt 4a.**
- **Ben 1 (12,5 %)** köps direkt vid rotationen till verifierad marknadskurs.
- **Ben 2 (12,5 %)** läggs som limit ≤ 348,00 i Pending. Det avförs om det inte triggat inom 5 handelsdagar (t.o.m. 2026-11-06).
- Inget undantag för hel limit gäller. Gapet (+13,0 %) var 29/10, inte i dag, och fredagen steg +0,88 %. Ingen binär händelse infaller inom 2 handelsdagar.

---

## Övriga kandidater – varför de föll

**1 av 20 bruttokandidater passerade alla fem grindar.** Grinden som loggas är den första som fäller kandidaten i ordningen 1 → 5 (se `gate-assignment-ambiguous`).

| Grind | Fäller (primärt) | Andel |
|---|---|---|
| 1 – verifierad kurs med källa + tidsstämpel | 3 | 15 % |
| 2 – teknisk filtrering (RSI/MACD/EMA/volym/likviditet) | 15 | 75 % |
| 3 – namngiven, bekräftad och daterad katalysator | 1 | 5 % |
| 4 – R/R ≥ 2:1 och kostnadströskel ≥ 6 % | 0 | – |
| 5 – nåbarhetstak | 0 | – |
| **Valda** | **1 (KOG.OL)** | 5 % |
| **Jämförelse v44** | grind 1: 5, grind 2: 16 av 22, valda 1 | – |

### Föll på grind 1 – kurs saknas (3 st)
Ingen av dem har en rad i `state/prices.json` eller en serie i `state/price_history.json`. Alla tre läggs i `config/watchlist.txt` i denna körning (punkt 6b).

| Ticker | Bolag | Händelse (datum, källa) | `catalystType` |
|---|---|---|---|
| GJF.OL | Gjensidige Forsikring | Återköp av egna aktier och primärinsiderhandel (MFN 2026-10-27T18:45Z) | buyback |
| HEALTH.HE | Nightingale Health | Protokollavtal på 1 MUSD med Alzheimer's Research UK (MFN 2026-10-28T19:15Z) | order |
| GGEO.ST | Guideline Geo | Försvarsorder på 1,7 MUSD (MFN 2026-10-27T17:30Z) | order |

### Föll på grind 2 (15 st)
| Ticker | Kurs (marketTime 2026-10-30) | Veckan | Spärr |
|---|---|---|---|
| LUG.ST | 594,00 SEK | −1,62 % | **RSI 38,7**, kurs under EMA20, EMA50 och EMA200, MACD-histogrammet fallande (−4,05 → −4,52). Spärr 2e oberoende av detta: Q3 4/11. |
| SOBI.ST | 490,20 SEK | +7,93 % | **Volymkvot 0,49×** (halvdag; 1,34× på heldagen 29/10, alltså under 1,5× även så). Q3 27/10 och ordförandeförslaget 29/10 är bekräftade. Hel EMA-stack, RSI 73,5. Bubblare. |
| ATCO-A.ST | 183,90 SEK | +3,52 % | **RSI 37,6**, kurs under EMA20, EMA50 och EMA200. USA-investeringen är ingen köpkatalysator. |
| VITR.ST | 115,50 SEK | +6,16 % | **RSI 81,7 > 75**, volymkvot 0,39×. Q3 22/10 ligger utanför femdagarsfönstret. Bubblare v44, stryks. |
| HNSA.ST | 39,34 SEK | +6,90 % | **Volymkvot 0,57×** (1,54× på 29/10), EMA20 37,01 < EMA50 37,02. Grind 3 med heldagsmåttet: PAES-presentationen 23/10 gav ingen reaktion 26/10 (−0,4 %), och uppgången 28/10 saknar daterad händelse. Bubblare. |
| LOGI-B.ST | 13,68 SEK | −2,84 % | **Volymkvot 0,17×**, EMA50 under EMA200. Q3 22/10 ligger utanför fönstret. Bubblare v44, stryks. |
| ELUX-B.ST | 28,81 SEK | +9,25 % | **Volymkvot 0,74×** (1,73× på 29/10), EMA20 under EMA50, sexmånadersmomentum −45,5 % (varning enligt punkt 0a). Q3 23/10 ligger utanför fönstret (grind 3). Bubblare v44, stryks. |
| GMAB.CO | 3 912,00 DKK | +47,96 % | **RSI 88,6** och **volymkvot 1,15×.** Fas 3-data för Rina-S och petosemtamab (Bloomberg 2026-10-26 och 2026-10-28) är exceptionella, men rörelsen är gjord, och punkt g1 förbjuder att jaga den. Q3 5/11. Bubblare för en rekyl-setup. |
| KCC.OL | 114,60 NOK | +14,14 % | **Volymkvot 1,10×.** Q3 27/10, hel EMA-stack, RSI 67,4, stigande MACD. Bubblare. |
| TRMD-A.CO | 284,80 DKK | +7,72 % | **Volymkvot 0,72×.** Spärr 2e: Q3 4/11. |
| ORNBV.HE | 100,00 EUR | +8,34 % | **RSI 83,6 > 75**, volymkvot 0,93×. Ingen daterad händelse i fönstret. |
| ALLEI.ST | 89,35 SEK | −20,01 % | **RSI 17,5**, kurs under alla tre EMA. Ingen turnaround-katalysator. |
| GRK.HE | 19,52 EUR | −19,67 % | **RSI 28,3**, kurs under EMA20 och EMA50, efter Q3 27/10. |
| BWE.OL | 54,40 NOK | −17,70 % | **RSI 30,1**, kurs under EMA20 och EMA50, MACD fallande, efter Q3 29/10. |
| XBRANE.ST | 14,15 SEK | +17,92 % | **Likviditetsgolvet: 2,8 MSEK/dag** < 3 MSEK. Ingen ny daterad händelse. |

### Föll på grind 3 (1 st)
| Ticker | Kurs | Spärr |
|---|---|---|
| CADLR.OL | 64,70 NOK (marketTime 2026-10-30T15:25:07Z) | Uppgången +9,7 % på fredagen följer av utbyteserbjudandet till Cadeler plc. Preliminär anslutning är 92,02 %, och handeln i Oslo väntas upphöra omkring 5/11, följd av tvångsinlösen (boerse-express 2026-10-30). Det är en strukturaffär och ingen köpkatalysator, och instrumentet slutar handlas inom planens horisont. |

### Grind 4/5
KOG.OL är den enda kandidat som nådde grind 4. Den klarar både R/R (3,1:1, kostnadströskel 12,14 %) och nåbarhetstaket (14,8 %), se handelsplanen. Bokens beslutsstatistik citeras inte i veckan: `state/decision_eval.json` bär inget tal som klarar `MIN_CLUSTERS`, och ett tal utan `effectiveN` vore ofärdigt. **L-4:** `state/scout_candidates.json` bär noll nordiska poster med `status: "new"`, vilket är normalt för den nordiska boken. De två `new`-posterna är `book: "us"` (CBOE, CVX).

---

## Bubblare (watchlist inför nästa vecka)
1. **SOBI.ST** – Q3 27/10 och ordförandeförslaget 29/10, hel EMA-stack, +7,93 % på veckan. Fälld på volymkvoten (0,49× på halvdagen, 1,34× på heldagen). Rad finns i watchlisten.
2. **KCC.OL** – Q3 27/10 gav +14,14 % med hel EMA-stack och stigande MACD. Fälld på volymkvoten 1,10×. Rad finns i watchlisten.
3. **GMAB.CO** – två fas 3-besked på en vecka. Fälld på RSI 88,6 och volym 1,15×. Prövas som rekyl-setup efter Q3 5/11, när RSI svalnat. Rad finns i watchlisten.
4. **HNSA.ST** – heldagsvolymen 1,54× (29/10) och stigande MACD, men ingen daterad händelse bär uppgången. Inför Q3 11/11 gäller spärr 2e från 9/11. Rad finns i watchlisten.

Samtliga fyra har **verifierad kurs med källa och `marketTime` i `state/prices.json`**. Ingen är fälld på saknad kurs.

**Förra veckans bubblare:**
- **VITR.ST** – STRUKEN (grind 2: RSI 81,7 och volymkvot 0,39×; Q3 22/10 ligger utanför fönstret).
- **HNSA.ST** – RANKAD UNDER (grind 2: volymkvot 0,57×, EMA20 under EMA50), kvar som bubblare.
- **LOGI-B.ST** – STRUKEN (grind 2: volymkvot 0,17×, EMA50 under EMA200; katalysatorn ligger utanför fönstret).
- **ELUX-B.ST** – STRUKEN (grind 2: volymkvot 0,74×, EMA20 under EMA50; sexmånaderstrenden −45,5 %; Q3 23/10 ligger utanför fönstret).

**Villkorade bubblar-planer:** **Inga.** Pending-raden KOG.OL ≤ 348,00 är ben 2 av veckans valda case och ingen bubblar-plan. SOBI.ST, KCC.OL, GMAB.CO och HNSA.ST faller på grind 2 av omdömesskäl. Punkt 4b kräver en bubblare som i övrigt håller.

## Veckans radar (kommande 5 handelsdagar)
* **Måndag 2/11** – **KOG.OL ben 1** köps i dag. **Bakkafrost (BAKKA.OL)** Q3 (`state/earnings_calendar.json`, `isEstimate: false`).
* **Tisdag 3/11** – **Boozt (BOOZT.ST)**, **Coloplast (COLO-B.CO)**, **Latour (LATO-B.ST)**, **SalMar (SALM.OL)** och **Truecaller (TRUE-B.ST)** Q3 (`isEstimate: false`).
* **Onsdag 4/11** – **Lundin Gold (LUG.ST)**, **Lundin Mining (LUMI.ST)**, **Mowi (MOWI.OL)**, **Novo Nordisk (NOVO-B.CO)**, **Odfjell (ODF.OL)** och **TORM (TRMD-A.CO)** Q3 (`isEstimate: false`). **Riksbankens besked** samma dag enligt websök i v43, inte verifierbart ur state.
* **Torsdag 5/11** – **Check (CHECK.ST)**, **Genmab (GMAB.CO)**, **Maersk (MAERSK-B.CO)**, **NNIT (NNIT.CO)**, **Oma Säästöpankki (OMASP.HE)**, **Ørsted (ORSTED.CO)**, **Sinch (SINCH.ST)** och **Skanska (SKA-B.ST)** Q3 (`isEstimate: false`). Cadelers Oslo-handel väntas upphöra omkring detta datum.
* **Fredag 6/11** – **AKVA (AKVA.OL)**, **Egetis (EGTX.ST)**, **Haypp (HAYPP.ST)** och **Orkla (ORK.OL)** Q3 (`isEstimate: false`). **Sista dagen för KOG.OL:s ben 2-limit.**
* **Inom 10 handelsdagar:**
  * **Onsdag 11/11:** BICO (BICO.ST), DFDS (DFDS.CO, *gissat datum*), Embracer (EMBRAC-B.ST), Hansa Biopharma (HNSA.ST), Höegh Autoliners (HSHP.OL) och Vestas (VWS.CO).
  * **Torsdag 12/11:** Karnov (KAR.ST), Norbit (NORBT.OL) och Zealand (ZEAL.CO).
  * **Fredag 13/11:** Bavarian Nordic (BAVA.CO).

**⚠️ TÄCKNINGSANGIVELSE ENLIGT L-1 OCH L-5.**
- **Källa:** rapportuppräkningen ovan vilar på `state/earnings_calendar.json` (`generatedAt` 2026-10-31T00:45:17Z, `counts.resolved` **207 symboler**, `failed` 0, `noCoverage` 11).
- **Täckning:** kalendern begär inte symbolerna i moversuniversumet (`earnings-calendar-excludes-movers-universe`, öppen). **Nordiska Large/Mid Cap-bolag utanför kalenderns symboler är därför OKONTROLLERADE.**
- **L-8:** ingen indexöversyn med beslut och ikraftträdande inom fönstret hittades. `state/news_feed.json` gav inga index-träffar bland fönstrets 150 nordiska MFN-poster. Indexleverantörernas primärkällor täcks inte av någon fil i repot och är därmed **OKONTROLLERADE**.

---

## Bruttolista – samtliga 20 kandidater i `state/decisions.json`
- **KÖP:** KOG.OL (ben 1, 12,5 %).
- **Grind 1 (AVVAKTA):** GJF.OL, HEALTH.HE, GGEO.ST.
- **Grind 2 (AVVAKTA):** LUG.ST, SOBI.ST, ATCO-A.ST, VITR.ST, HNSA.ST, LOGI-B.ST, ELUX-B.ST, GMAB.CO, KCC.OL, TRMD-A.CO, ORNBV.HE, ALLEI.ST, GRK.HE, BWE.OL, XBRANE.ST.
- **Grind 3 (AVVAKTA):** CADLR.OL.
- **Indexsleeven:** XACT-OMXS30.ST BEHÅLL, vikten minskad 100,0 % → 87,5 %.

**Watchlist (punkt 6/6b, L-2):**
- **Tillagda, tre rader:** GJF.OL, HEALTH.HE och GGEO.ST (beslut utan kurs).
- **Borttagna: inga.** Listan skyddas enligt `prompts/gemensam_korning.md` av ännu omogna beslut (20 handelsdagars utvärderingsfönster), och riktmärket 25 är underordnat mätbarheten (`watchlist-cap-vs-measurability-conflict`).

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
