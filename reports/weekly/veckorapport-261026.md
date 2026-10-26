# Veckorapport: Nordisk Rotation
**Vecka:** v 44 | **Datum:** 2026-10-26
**Marknadsklimat:** OMXS30 (`^OMX`) stängde fredag på **3 175,698** (`state/prices.json`, source "Yahoo Finance (chart API)", marketTime 2026-10-23T15:35:00Z). Det är **−3,67 %** mot förra rotationens bas (fredag 2026-10-16: 3 296,8425). Det tyngsta tappet kom torsdag 22/10, då indexet föll från 3 244,07 till 3 162,78 (−2,51 %). **Regimfiltret är PÅ, men med minsta marginal sedan den skarpa starten:** 3 175,698 ligger **+0,79 %** över MA200 **3 150,9561** (200 daterade stängningar ur `state/price_history.json`, serien bär 250 punkter). Spärren binder vid ett fall till 3 150,96, och därefter öppnas inga nya positioner. Veckan dominerades av Q3-rapporter med stora reaktioner åt båda håll. **Nordisk medvind:** försvar, där Saab slog förväntningarna på orderingång och resultat 23/10 (Placera och Affärsvärlden 2026-10-23); dansk logistik (DSV.CO +11,23 %, Q3 21/10); Vitrolife (VITR.ST +10,85 %, Q3 22/10); Logistea (LOGI-B.ST +12,10 %, Q3 22/10). **Nordisk motvind:** fordon (VOLCAR-B.ST **−24,63 %**, varav −24,23 % på fredagen); verkstad (ATCO-A.ST −12,14 %, LIFCO-B.ST −14,76 %, HMS.ST −14,12 %); Nokia (NOKIA.HE −12,49 % efter Q3 22/10); aluminium (NHY.OL −12,41 %); spel (SF.ST −24,82 %). Makro: ECB:s räntebesked är 29/10 och Riksbankens 4/11 enligt websök i v43 (Morningstar, EFN). Inget av datumen kan verifieras ur repots egna filer (`macro-calendar-not-verifiable-from-state`).

**DATAFÄRSKHET.**
- `state/prices.json`: `generatedAt` **2026-10-23T23:51:52Z**, `schemaVersion` "2026-08-02-prevclose", `wideAt` 2026-10-23T10:01:55Z. **Måndagens förbörskörningar har inte nått `main`.** Det är kontrollerat mot `origin/main` cirka 06:50 UTC; senaste commit är scoutens 06:20 UTC och ingen kurscommit finns sedan fredag. Det påverkar inte beslutsunderlaget: börserna har inte öppnat, och fredagens stängningar (marketTime 2026-10-23 14:25–15:35 UTC) är senaste handelsdagens stängning. Därmed är de godkända enligt datakraven.
- `state/news_feed.json`: `generatedAt` 2026-10-23T23:52:21Z, alltså **äldre än 24 timmar** (helg och ingen måndagskörning ännu). Websök har använts som komplement. Fönstret bär **10 av 10 handelsdagar** (2026-10-12 → 2026-10-23, `missingDays` tomt).
- `state/alerts.json`: `checkedAt` 2026-10-23T21:02:47Z och `active` är tom. Det är fredagskvällens körning.
- **Fantompunktskontroll:** 4 av 287 serier i `state/price_history.json` upprepar sin föregående stängning (1,4 %), vilket är normal nivå. RSI/MACD/EMA är räknade på råserien, med EMA som startar på ett enkelt medelvärde och RSI med Wilder-utjämning.

---

## 0. Facit: Förra veckans val
| Aktie | Entry | Exit | Utfall | Stop/Mål träffad? |
|---|---|---|---|---|
| XACT-OMXS30.ST | 494,60 | 471,60 (öppen) | −4,65 % | Nej (sleeven har varken stop eller mål) |

**Veckans portföljutfall (viktat):** **−3,82 %.** Boken låg 100,0 % i indexsleeven hela perioden. XACT-OMXS30.ST gick från 490,35 (2026-10-16) till **471,60** (`state/prices.json`, source "Yahoo Finance (chart API)", marketTime 2026-10-23T15:24:56Z). `^OMX` föll −3,67 % under samma period, och skillnaden är fondens spårning. Siffrorna är brutto; dashboardens nettosiffra drar rundturskostnaden, men inga affärer gjordes. LÄGE B prövade ERIC-B.ST fyra gånger (20–23/10) och lade ingen plan. Skälen var först grind 2 och sedan villkor (3). ERIC-B.ST stängde fredag på 105,05 SEK, +1,8 % över måndagens 103,15.
**Ackumulerad avkastning sedan strategistart:** **−2,17 %**, oförändrad. Två affärer har stängts sedan skarp start 2026-08-10: ASSA-B.ST −3,26 % (vikt 25 %) och SALM.OL −5,48 % (vikt 25 %). Kedjat ger det 0,991856 × 0,986291 = 0,978258. Sleevens orealiserade rörelse ingår inte i fältet.
**Portföljallokering denna vecka:** **12,5 % SAAB-B.ST (ben 1) + 87,5 % indexsleeve (XACT-OMXS30.ST) + 0 % kassa.** Ben 2 (12,5 %) ligger som limit ≤ 632,00 i Pending. Fylls det blir allokeringen 25,0 % SAAB-B.ST + 75,0 % sleeve. Tre platser står tomma eftersom inget annat case klarade alla fem grindar; kapitalet ligger i index, aldrig på konto. Vikten är platt 25 % per fylld position.
**Lärdom:** För första gången sedan SALM.OL (v36) klarade en kandidat alla fem grindar. Det var en **rapportreaktion i ett tidigare bevakat namn**: SAAB-B.ST har haft rad i watchlisten sedan 2026-08-17. Volymkvoten som fällde aktien i v43 (1,47×) var 1,77× på rapportdagen. Bevakningen i förväg gjorde att kurs, serie och volym fanns på plats när katalysatorn kom (**L-2**). Motsatsen syns i ARJO-B.ST, LIFCO-B.ST och DSV.CO, tre av veckans största rörelser som fälldes på grind 1 eftersom de bara hämtas i den breda körningen. Tillämpade lärdomar:
- **L-1** och **L-5:** rapportkalendern i radarn, med täckning.
- **L-2:** varje bubblare har en rad i watchlisten.
- **L-3:** fem datadefekter eskaleras, samtliga redan öppna.
- **L-4:** ingen nordisk kandidat har `status: "new"`.
- **L-6:** ingen kandidat är struken på universumregel.
- **L-7:** rörelsegenomgången är rangordnad ur prishistoriken.
- **L-8:** inga indexöversyner hittades.

### Bred scanning – varifrån bruttolistan kom

**Bruttolistan omfattar 22 kandidater:**
- **7 ur nyhetsflödet** (punkt g0): HNSA.ST, VOW.OL, SF.ST, NEL.OL, THULE.ST, UPM.HE, NOKIA.HE.
- **5 bubblare från v43**: ERIC-B.ST, TRUE-B.ST, ELUX-B.ST, SAAB-B.ST, KOG.OL.
- **10 ur egen scanning** av veckans rörelser och rapportreaktioner: ARJO-B.ST, DSV.CO, LIFCO-B.ST, VITR.ST, LOGI-B.ST, CADLR.OL, SCST.ST, VOLCAR-B.ST, HMS.ST, NNIT.CO.

Nyhetsfönstret bar **10 av 10 handelsdagar** (`window.tradingDaysCovered`).

**Veckans rörelser (punkt g1, enligt L-7).** Rangordningen bygger på `state/price_history.json`. Den omfattar **167 nordiska symboler** (.ST/.OL/.CO/.HE) med daterad stängning både på basdagen **2026-10-16** och på mätdagen **2026-10-23**, av 170 nordiska serier. `state/movers.json` har `asOf` **2026-10-23** och används som komplement. Dess topprader (SF.ST, VOLCAR-B.ST, ARJO-B.ST, LIFCO-B.ST, CTM.ST, ATCO-A.ST, SBB-B.ST, NOKIA.HE, NHY.OL, ATCO-B.ST, DSV.CO) finns alla med i prishistorikens rangordning.
- **Störst uppåt:** ARJO-B.ST +18,89 %, NNIT.CO +17,37 %, CADLR.OL +13,70 %, SBB-B.ST +12,70 %, LOGI-B.ST +12,10 %, DSV.CO +11,23 %, VITR.ST +10,85 %, SCST.ST +9,20 %.
- **Störst nedåt:** SF.ST −24,82 %, VOLCAR-B.ST −24,63 %, LIFCO-B.ST −14,76 %, HMS.ST −14,12 %, CTM.ST −12,87 %, NOKIA.HE −12,49 %, NHY.OL −12,41 %, ATCO-A.ST −12,14 %.

**Förbehåll:** för symbolerna utan rad i `prices.json` (bland dem ARJO-B.ST, DSV.CO, LIFCO-B.ST och ATCO-A.ST) är mätdagens punkt den breda körningens intradagsvärde från cirka 10:01 UTC, inte en stängning. `movers.json` anger ARJO-B.ST till +20,24 % mot prishistorikens +18,89 % av just det skälet. Nordiska namn utanför prishistoriken är **OKONTROLLERADE** (L-5).

**Nyhetsflödets nordiska poster i femdagarsfönstret (2026-10-19 – 2026-10-23):**
- **Hansa Biopharma:** positiva Idefirix PAES-resultat presenterade i High-Impact Clinical Trials-sessionen vid ASN Kidney Week (MFN 2026-10-23T17:30Z). Toplinedatat publicerades redan 2026-05-27 (cision): ettårig transplantatfri överlevnad cirka 90 %. Ansökan till EMA om fullt godkännande planeras till Q4 2026 (Redeye via Börsvärlden). Presentationen kom efter stängning, så reaktionen syns först i dag.
- **Vow:** kontrakt på 7,7 MEUR för utrustning till två kryssningsfartyg, plus tre optioner (MFN 2026-10-23T19:04Z).
- **Nokia:** partnerskap med ICEYE och Ukrainas försvarsministerium om satellitkommunikation (MFN 2026-10-22T17:52Z). Nokia föll ändå −12,49 % på veckan efter Q3.
- **UPM-Kymmene:** har ansökt om notering av WISA Group på Nasdaq Helsinki (MFN 2026-10-22T19:30Z).
- **Stillfront:** utser Marcus Jacobs till ny vd (MFN 2026-10-22T17:35Z). Aktien föll −24,82 % på veckan.
- **Nel ASA:** Morten Holum utsedd till ny vd (MFN 2026-10-21T19:00Z).
- **Thule Group:** har mottagit begäran om extra bolagsstämma för styrelseval, och ordföranden avgår (MFN 2026-10-20T21:40Z).
- **Övrigt, ej kandidater:**
  - Emissioner: Minesto (cirka 130 MSEK), Gapwaves (cirka 62,5 MSEK), Otovo, Aira, Jæren Sparebank, Soltech och Scandinavian Enviro Systems.
  - VD-byte: Elopak.
  - Strukturaffär: Cadelers utbyteserbjudande (förlängt).
  - Bolagsstämmor: Tessin och Checkin.com.
  - Övriga meddelanden: flaggningar i SmartCraft och MIPS, Biosergens fusion och Nitro Games utvecklingsavtal.

**⚠️ ÅTGÄRDSPUNKT TILL DREN (L-3) – ÅTERKOMMANDE: måndagens schemalagda kurs- och nyhetskörningar har inte startat.**
- **Fil och fält:** `state/prices.json` `generatedAt` 2026-10-23T23:51:52Z och `state/news_feed.json` `generatedAt` 2026-10-23T23:52:21Z. Ingen commit från `prices.yml` (cron `9 5` och `9 6` UTC) eller `news.yml` (`17 5-21/2`) syns på `main` före cirka 06:50 UTC.
- **Omfång:** 2 av 2 förbörskörningar i `prices.yml` och 1 av 1 i `news.yml`. Det är samma mönster som 2026-10-19.
- **Ersättningskälla:** fredagens stängningar, som är giltiga före öppning, samt websök.
- **Status:** redan öppen i `state/action_items.json` som `scheduled-actions-not-firing` (`weeksOpen` 8).

**⚠️ ÅTGÄRDSPUNKT TILL DREN (L-3) – ÅTERKOMMANDE: moversuniversumets symboler saknas i `state/prices.json` efter de smala körningarna.**
- **Fil och fält:** `state/prices.json` `quotes`.
- **Omfång:** **55 av 170** nordiska serier i `state/price_history.json` saknar rad i den aktuella filen.
- **Konsekvens i veckan:** 5 av 22 bruttokandidater föll på grind 1, däribland veckans största uppgång (ARJO-B.ST) och tredje största nedgång (LIFCO-B.ST). DSV.CO lades i watchlisten av retron 24/10, men ingen kurskörning har gått sedan dess.
- **Status:** redan öppen som `wide-fetch-not-last-run-of-day`, `history-point-not-a-close-for-wide-symbols` och `volume-point-is-half-session-for-wide-symbols`.

**⚠️ ÅTGÄRDSPUNKT TILL DREN (L-3) – ÅTERKOMMANDE: nyhetsflödena `globenewswire` och `globenewswire-earnings` svarar fortfarande HTTP 403.**
- **Fil och fält:** `state/news_feed.json` `feeds.globenewswire` = "HTTP 403 – båda försöken (0.1 s)". `feeds.globenewswire-earnings` har samma status.
- **Omfång:** 2 av 6 flöden, fjärde veckan i rad.
- **Ersättningskälla:** MFN och websök.
- **Status:** redan öppen som `news-feed-globenewswire-http-403`.

**⚠️ ÅTGÄRDSPUNKT TILL DREN (L-3): MFN-flödets dygnstak och stängningsauktionen.**
- **Dygnstaket:** de tidigaste `src: "mfn"`-posterna 2026-10-19 – 2026-10-23 ligger mellan **16:00 och 19:20 UTC**. Handelssessionens meddelanden saknas alltså, och det gäller även Saabs Q3-rapport (07:00 lokal tid), som har verifierats via websök. Status: öppen som `news-window-daily-cap-drops-morning-posts`.
- **Stängningsauktionen:** CADLR.OL har `price` 59,35 NOK över `dayHigh` 58,70, 1 symbol. Status: öppen som `intraday-range-excludes-closing-auction`.

**Likviditetsgolvet** räknas som 20-dagarssnittet av volymen ur `state/volume_history.json` gånger verifierad kurs. För `.OL`/`.CO`/`.HE` anges talet i lokal valuta, eftersom växelkurser saknas (`fx-rates-missing-eur-dkk-nok`). Utom för NNIT.CO (1,3 MDKK/dag) ligger alla kandidater så långt från golvet att växelkursen inte avgör.

---

## Case 1: Saab B (SAAB-B.ST / Nasdaq Stockholm)

### 1. Katalysatorn
**Q3-rapport 2026-10-23, klart över förväntan.**
- **Orderingång:** 65 825 MSEK (20 861), mot cirka 56 mdr i Inderes förhandsbedömning (Inderes 2026-10-19). Ordrarna inkluderar Gripen E till Ukraina (24,6 mdr), GlobalEye (10,1 mdr) och system till tyska fregatter (8,7 mdr).
- **Rörelseresultat:** 1 945 MSEK mot Infront-konsensus 1 882 MSEK.
- **Försäljning:** 20 553 MSEK (15 871), organiskt +30,6 %.
- **Orderstock:** 364 223 MSEK (202 408). Nettolikviditeten är 8 679 MSEK, och målen för 2023–2027 upprepas.
- **Källor:** Placera "Saab slår förväntningarna" 2026-10-23, Affärsvärlden 2026-10-23, Privata Affärer 2026-10-23 och Saabs pressmeddelande "Saab Q3 results 2026" via PR Newswire 2026-10-23.
- **`catalystType`:** earnings.

### 2. Investerings-tes (The Bull Case)
* Rapporten slog på båda de rader marknaden mäter (order och EBIT). Orderstocken växte med 80 % på ett år, vilket ger leveranssynlighet flera år framåt. Det är precis den typ av bekräftad överraskning som post-earnings drift bygger på. Horisonten är 3–6 veckor, och PEAD är långsam.
* Aktien tog rapporten utan att tappa strukturen. Dagslägsta 624,00 köptes upp till stängning 646,50 (+1,83 %) på 1,77× normal volym. Kursen ligger över EMA20 > EMA50 > EMA200 och har stigit +13,9 % på sex månader, vilket är ett plus enligt punkt 0a (lång trend bakom rörelsen, inte en isolerad tvåveckorsspurt).
* Försvarssektorn har strukturell medvind från europeiska upprustningsbudgetar. Ukraina-ordern och den tyska fregattordern bekräftar att efterfrågan omsätts i bokade kontrakt.

### 3. Motargument & Risker (The Bear Case)
* **Regimen är knapp.** OMXS30 ligger bara +0,79 % över MA200 efter en vecka med −3,67 %. Spärren gäller nyöppning och inte befintliga positioner, men en bredare nedgång drar även starka namn. Stoppet är den enda skyddsmekanismen och flyttas aldrig ned.
* **"Sell the news":** aktien handlades upp +8,42 % veckan före rapporten (v42), och mycket av orderingången (cirka 47,5 mdr) var redan kommunicerad före kvartalsslutet. Överraskningen ligger i resultatet och flödet av mindre ordrar, inte i de stora kontrakten.
* **Värdering och politik:** försvarsaktier är känsliga för fredsförhandlingar (Ukraina) och för förändrade budgetsignaler. 250-dagarshögsta 729,80 (2026-01-20) är ett tydligt motstånd strax ovanför målet.

### 4. Fundamental snapshot
* **Börsvärde:** cirka 350 mdr SEK (indikativt, ej verifierat ur state) | **P/E / EV/EBITDA:** ej verifierat i körningen | **Tillväxt:** organisk försäljning +30,6 % i Q3 | **Snittomsättning/dag:** **722 MSEK** (20-dagarssnitt 1 116 795 aktier × 646,50; `state/volume_history.json`).

### 5. Teknisk setup
* **RSI(14):** 59,7 | **MACD:** histogrammet positivt och stabilt, 3,713 → 3,723 | **Kurs vs EMA20/50/200:** över alla tre (624,53 / 615,06 / 596,24, stigande ordning) | **Volym vs 20d-snitt:** **1,77×** (1 975 114 mot 1 116 795) | **Stöd:** 624,00 (rapportdagens dagslägsta) och 631,60 (stängning 15/10, rapportgapets bas) | **Motstånd:** 692,70 (60-dagarshögsta) och 729,80 (250-dagarshögsta).

### 6. Handelsplan
| Entry | Stop-loss | Målkurs | Risk/Reward |
|---|---|---|---|
| 646,50 (ben 1, verifierad stängning 2026-10-23T15:29:32Z) / ≤ 632,00 (ben 2, limit) | 622,00 (−3,79 %) | 725,00 (+12,14 %) | 1:3,2 (ben 1), 1:9,3 (ben 2) |

* **Stopp:** 622,00 ligger strax under dagslägsta 624,00, inom bandet 3–5 %, och sätts tekniskt.
* **Mål:** 725,00 ligger inom earnings-bandet 12–15 % och under 250-dagarshögsta 729,80.
* **Kostnadströskel:** entry → mål är **+12,14 %**, vilket är ≥ 6 % och cirka 49× rundturskostnaden 0,25 %.
* **Nåbarhet (punkt 6):** genomsnittlig absolut dagsrörelse över 60 dagar är **1,44 %**, och taket blir 2 × 1,44 % × √20 = **12,9 %** ≥ 12,14 %. Målet ryms vid 20 handelsdagars horisont.
* **Horisont:** 20 handelsdagar (`earnings`, 3–6 veckor) utan tidsstopp.
* **Binära händelser:** ingen inom 2 handelsdagar. Nästa rapport ligger i januari, och `state/earnings_calendar.json` bär ingen ny Saab-rad.
* **Totalpoäng 7,4:** katalysator 8 (35 %), teknik 7 (30 %), makro 6 (15 %), R/R 8 (20 %).

**Planerad vikt:** **25 %, delad entry enligt punkt 4a.** Ben 1 (**12,5 %**) köps direkt vid rotationen till verifierad marknadskurs. Ben 2 (**12,5 %**) läggs som limit ≤ 632,00 i Pending och avförs om det inte triggat inom 5 handelsdagar (t.o.m. 2026-10-30). Inget undantag för hel limit gäller: aktien gapade inte upp > 3 % (+1,83 %), och ingen binär händelse infaller inom 2 handelsdagar.

---

## Övriga kandidater – varför de föll

**1 av 22 bruttokandidater passerade alla fem grindar.** Grinden som loggas är den första som fäller kandidaten i ordningen 1 → 5 (se `gate-assignment-ambiguous`).

| Grind | Fäller (primärt) | Andel |
|---|---|---|
| 1 – verifierad kurs med källa + tidsstämpel | 5 | 23 % |
| 2 – teknisk filtrering (RSI/MACD/EMA/volym/likviditet) | 16 | 73 % |
| 3 – namngiven, bekräftad och daterad katalysator | 0 | – |
| 4 – R/R ≥ 2:1 och kostnadströskel ≥ 6 % | 0 | – |
| 5 – nåbarhetstak | 0 | – |
| **Valda** | **1 (SAAB-B.ST)** | 5 % |
| **Jämförelse v43** | grind 1: 5, grind 2: 14, grind 3: 3 av 22, valda 0 | – |

### Föll på grind 1 – kurs saknas (5 st)
Ingen av dem har en rad i `state/prices.json`. ARJO-B.ST, LIFCO-B.ST, THULE.ST och NEL.OL läggs i `config/watchlist.txt` i denna körning (punkt 6b). DSV.CO har haft en rad sedan 24/10.

| Ticker | Bolag | Händelse (datum, källa) | `catalystType` |
|---|---|---|---|
| ARJO-B.ST | Arjo | +18,89 % på veckan, RSI 84,8 på den breda intradagspunkten, alltså en redan gjord rörelse | earnings |
| DSV.CO | DSV | Q3-rapport 2026-10-21 (Placera/Inderes via retro-261024), +11,23 % på veckan | earnings |
| LIFCO-B.ST | Lifco | −14,76 % på veckan, varav −12,05 % 23/10 (`state/movers.json`) | earnings |
| THULE.ST | Thule Group | Begäran om extra bolagsstämma, ordföranden avgår (MFN 2026-10-20T21:40Z) | other |
| NEL.OL | Nel ASA | Ny vd (MFN 2026-10-21T19:00Z), ingen historik i repot | other |

### Föll på grind 2 (16 st)
| Ticker | Kurs (marketTime 2026-10-23) | Veckan | Spärr |
|---|---|---|---|
| HNSA.ST | 36,80 SEK | +2,51 % | **Volymkvot 0,72×**, EMA20 36,20 < EMA50 36,77 och MACD-histogrammet avtar (0,616 → 0,530). PAES-presentationen 23/10 kom efter stängning. Toplinedatat var känt sedan maj, så dagens reaktion är omätt. Bubblare. |
| VOW.OL | 2,75 NOK | −6,14 % | **RSI 42,9**, negativt och fallande MACD, kurs under EMA20 och EMA50. Kontraktet på 7,7 MEUR är för litet för att bära ett case. |
| SF.ST | 5,62 SEK | −24,82 % | **RSI 25,6**, kurs under EMA20 och EMA50, MACD negativt. Vd-bytet är ingen köpkatalysator. |
| UPM.HE | 24,44 EUR | −2,98 % | Kurs under EMA20, MACD negativt, **volymkvot 0,88×**. Spärr 2e oberoende av detta: Q3 28/10. |
| NOKIA.HE | 7,37 EUR | −12,49 % | **RSI 29,3**, kurs under alla tre EMA. |
| ERIC-B.ST | 105,05 SEK | +0,53 % | **Volymkvot 1,34×**, EMA50 98,60 < EMA200 100,03. Q3 15/10 ligger dessutom utanför femdagarsfönstret. |
| TRUE-B.ST | 25,35 SEK | +3,98 % | **Volymkvot 0,39×.** Hel EMA-stack men ingen ny katalysator. Q3 3/11. |
| ELUX-B.ST | 26,37 SEK | −4,46 % | Kurs **under EMA50** 26,89 och långt under EMA200 42,18, MACD-histogrammet avtar (0,199 → 0,162), sexmånadersmomentum −44,8 %. Q3 23/10 gav volym 2,48× och dagshögsta 28,97, men stängningen var bara +1,54 %. Bubblare. |
| KOG.OL | 301,00 NOK | −4,54 % | Kurs under alla tre EMA, **volymkvot 0,92×**. Spärr 2e: Q3 29/10. |
| VITR.ST | 108,80 SEK | +10,85 % | **RSI 75,7** över 75 och **volymkvot 1,49×** under 1,5×. EMA50 94,93 < EMA200 103,20. Q3 22/10. Bubblare. |
| LOGI-B.ST | 14,08 SEK | +12,10 % | **Volymkvot 0,94×**, EMA50 12,75 < EMA200 13,56, RSI 73,3. Q3 22/10. Bubblare. |
| CADLR.OL | 59,35 NOK | +13,70 % | **Volymkvot 0,61×**, EMA20 54,62 < EMA50 55,35. Utbyteserbjudandet är en strukturaffär och ingen köpkatalysator. |
| SCST.ST | 178,00 SEK | +9,20 % | **Volymkvot 0,61×** och avtagande MACD (1,691 → 1,596). Q3 20/10. |
| VOLCAR-B.ST | 10,695 SEK | −24,63 % | **RSI 20,5**, långt under alla EMA, sexmånadersmomentum −52 %. Ingen turnaround-katalysator. |
| HMS.ST | 478,80 SEK | −14,12 % | **RSI 28,4**, MACD-histogram −11,29 och fallande. Q3 21/10. |
| NNIT.CO | 44,60 DKK | +17,37 % | **Likviditetsgolvet: 1,3 MDKK/dag.** Ingen daterad händelse hittad. |

### Grind 4/5
SAAB-B.ST är den enda kandidat som nådde grind 4. Den klarar både R/R (3,2:1, kostnadströskel 12,14 %) och nåbarhetstaket (12,9 %), se handelsplanen. Bokens beslutsstatistik citeras inte i veckan: `state/decision_eval.json` bär inget tal som klarar `MIN_CLUSTERS`, och ett tal utan `effectiveN` vore ofärdigt. **L-4:** `state/scout_candidates.json` bär noll nordiska poster med `status: "new"`, vilket är normalt för den nordiska boken. De två `new`-posterna är `book: "us"` (ROP, RHI).

---

## Bubblare (watchlist inför nästa vecka)
1. **VITR.ST** – Q3 22/10 gav +10,85 % på veckan, och volymkvoten 1,49× missar kravet med en hundradel. Fälld på RSI 75,7 och EMA50 under EMA200. Kan prövas som rekyl-setup när RSI svalnat. Rad finns i watchlisten.
2. **HNSA.ST** – PAES-data presenterades 23/10 efter stängning, och EMA-ansökan väntas Q4. Reaktionen är omätt till i dag. Fälld på grind 2 (volym 0,72×, EMA20 under EMA50). Rad finns i watchlisten.
3. **LOGI-B.ST** – Q3 22/10 gav +12,10 %, men volymkvoten 0,94× och EMA50 under EMA200 fäller den. Rad finns i watchlisten.
4. **ELUX-B.ST** – Q3 23/10 med volym 2,48×, men kursen ligger under EMA50, och den långa trenden (−44,8 % på sex månader) är en varning. Rad finns i watchlisten.

Samtliga fyra har **verifierad kurs med källa och `marketTime` i `state/prices.json`**. Ingen är fälld på saknad kurs.

**Förra veckans bubblare:**
- **ERIC-B.ST** – STRUKEN (grind 2: volymkvot 1,34×, EMA50 under EMA200; Q3 15/10 utanför fönstret).
- **TRUE-B.ST** – STRUKEN (grind 2: volymkvot 0,39×; ingen ny katalysator).
- **ELUX-B.ST** – RANKAD UNDER (grind 2: kurs under EMA50 och avtagande MACD efter Q3), kvar som bubblare.
- **SAAB-B.ST** – **VALD** (Q3 23/10 slog förväntningarna, och volymkvoten nådde 1,77×).
- **KOG.OL** – STRUKEN (grind 2: kurs under alla EMA; spärr 2e före Q3 29/10).

**Villkorade bubblar-planer:** **Inga.** Pending-raden SAAB-B.ST ≤ 632,00 är ben 2 av veckans valda case och ingen bubblar-plan. VITR.ST, HNSA.ST, LOGI-B.ST och ELUX-B.ST faller på grind 2 av omdömesskäl. Punkt 4b kräver en bubblare som i övrigt håller.

## Veckans radar (kommande 5 handelsdagar)
* **Måndag 26/10** – **SAAB-B.ST ben 1** köps i dag. **HNSA.ST** får sin första session efter PAES-presentationen.
* **Tisdag 27/10** – **Sobi (SOBI.ST)**, **Gränges (GRK.HE)** och **KCC (KCC.OL)** Q3 (`state/earnings_calendar.json`, `isEstimate: false`).
* **Onsdag 28/10** – **Equinor (EQNR.OL)**, **Fortum (FORTUM.HE)** och **UPM (UPM.HE)** Q3 (`isEstimate: false`).
* **Torsdag 29/10** – **Kongsberg (KOG.OL)**, **BW Energy (BWE.OL)**, **Neste (NESTE.HE)** och **Paradox (PDX.ST)** Q3 (`isEstimate: false`). **ECB:s räntebesked** samma dag enligt websök i v43 (Morningstar, EFN), inte verifierbart ur state.
* **Fredag 30/10** – **AstraZeneca (AZN.ST)** och **Loomis (LOOMIS.ST)** Q3 (`isEstimate: false`). **Sista dagen för SAAB-B.ST:s ben 2-limit.**
* **Inom 10 handelsdagar:**
  * **Måndag 2/11:** Bakkafrost (BAKKA.OL).
  * **Tisdag 3/11:** Boozt (BOOZT.ST), Coloplast (COLO-B.CO), Latour (LATO-B.ST), SalMar (SALM.OL) och Truecaller (TRUE-B.ST).
  * **Onsdag 4/11:** Lundin Gold (LUG.ST), Lundin Mining (LUMI.ST), Mowi (MOWI.OL), Novo Nordisk (NOVO-B.CO), Odfjell (ODF.OL) och TORM (TRMD-A.CO). **Riksbankens besked** samma dag enligt websök.
  * **Torsdag 5/11:** Genmab (GMAB.CO), Maersk (MAERSK-B.CO), Ørsted (ORSTED.CO), Sinch (SINCH.ST), Skanska (SKA-B.ST), NNIT (NNIT.CO), Check (CHECK.ST) och Oma Säästöpankki (OMASP.HE).

**⚠️ TÄCKNINGSANGIVELSE ENLIGT L-1 OCH L-5.**
- **Källa:** rapportuppräkningen ovan vilar på `state/earnings_calendar.json` (`generatedAt` 2026-10-23T10:00:01Z, `counts.resolved` **191 symboler**, `failed` 0, `noCoverage` 11).
- **Täckning:** kalendern begär inte symbolerna i moversuniversumet (`earnings-calendar-excludes-movers-universe`, öppen). **Nordiska Large/Mid Cap-bolag utanför kalenderns symboler är därför OKONTROLLERADE.** Det gäller bland andra Volvo, Atlas Copco, Sandvik och storbankerna, vars datum inte kan verifieras ur källor körningen når.
- **L-8:** ingen indexöversyn med beslut och ikraftträdande inom fönstret hittades. `state/news_feed.json` gav inga index-träffar bland fönstrets nordiska poster. Indexleverantörernas primärkällor täcks inte av någon fil i repot och är därmed **OKONTROLLERADE**.

---

## Bruttolista – samtliga 22 kandidater i `state/decisions.json`
- **KÖP:** SAAB-B.ST (ben 1, 12,5 %).
- **Grind 1 (AVVAKTA):** ARJO-B.ST, DSV.CO, LIFCO-B.ST, THULE.ST, NEL.OL.
- **Grind 2 (AVVAKTA):** HNSA.ST, VOW.OL, SF.ST, UPM.HE, NOKIA.HE, ERIC-B.ST, TRUE-B.ST, ELUX-B.ST, KOG.OL, VITR.ST, LOGI-B.ST, CADLR.OL, SCST.ST, VOLCAR-B.ST, HMS.ST, NNIT.CO.
- **Indexsleeven:** XACT-OMXS30.ST BEHÅLL, vikten minskad 100,0 % → 87,5 %.

**Watchlist (punkt 6/6b, L-2):**
- **Tillagda, fyra rader:** ARJO-B.ST, LIFCO-B.ST, THULE.ST och NEL.OL (beslut utan kurs).
- **Borttagna: inga.** Listan skyddas enligt `prompts/gemensam_korning.md` av ännu omogna beslut (20 handelsdagars utvärderingsfönster), och riktmärket 25 är underordnat mätbarheten (`watchlist-cap-vs-measurability-conflict`).

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
