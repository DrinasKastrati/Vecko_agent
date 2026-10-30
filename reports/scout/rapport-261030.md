# Daglig Scout: USA & Krypto
**Datum:** 2026-10-30
**Marknadsklimat:** Torsdagens rapportkväll gav risk-off i tillväxt: `^IXIC` föll −1,38 % och `^GSPC` −0,30 % när `GOOGL` (−12,64 %) och `MRVL` (−13,24 %) drog ned AI-kedjan, och efter stängning föll `INTC` ~20 % efterbörs på en svag Q4-guide medan `AMZN` gav tillbaka trots AWS +39 %. Kryptot bröt nedåt på Binance-hacket (bekräftat av CoinDesk): `BTC-USD` 77 097,27 och `ETH-USD` 2 216,64 ligger nu under både EMA20 och EMA50. **Aktiva lärdomar tillämpade:** L-3 (åtgärdspunkter sist), L-4 (inga vilande avvisningar att pröva om i dag – samtliga avgöranden 2026-10-29 är omdömes- eller tekniska spärrar), L-5 (kalenderns täckning) och L-6 (`HII` poängsätts trots att försvar inte står bland fokussektorerna, eftersom `config/fokus_scout.md` prioriterar "**Earnings surprises:** bolag som krossat förväntningarna i senaste rapporten" och marknaden "USA (NYSE & NASDAQ)"). L-1, L-2, L-7 och L-8 gäller inte scouten.

## Marknadsöversikt

`git pull` 2026-10-30 05:48 UTC (06:48 CET) gav `origin/main` = `2b74ec8`. Källan är `state/prices.json` med `generatedAt` 2026-10-30T00:58:27Z, `schemaVersion` 2026-08-02-prevclose, `tickerCount` 298, `okCount` 293 och `wideAt` 2026-10-30T00:58:27Z (Yahoo Finance chart API via GitHub Actions).

| Symbol | Nivå | Rörelse sedan föregående session | 5 sessioner (mot 2026-10-22) | marketTime |
|---|---|---|---|---|
| `^GSPC` | 7 720,39 | −0,30 % (7 743,98 → 7 720,39) | +0,74 % | 2026-10-29T20:32:46Z |
| `^IXIC` | 26 184,73 | −1,38 % (26 549,85 → 26 184,73) | +0,68 % | 2026-10-29T21:15:59Z |
| `BTC-USD` | 77 097,27 | −1,02 % mot daterad punkt 2026-10-29 (77 894,56); −5,12 % mot 2026-10-28 (81 259,33) | −5,17 % | 2026-10-30T00:56:55Z |
| `ETH-USD` | 2 216,64 | −1,31 % mot daterad punkt 2026-10-29 (2 245,95); −6,02 % mot 2026-10-28 (2 358,56) | −7,10 % | 2026-10-30T00:57:12Z |
| `SPY` (sleeve) | 769,36 | −0,38 % (772,31 → 769,36) | +0,71 % | 2026-10-29T20:00:00Z |

**Kryptots dagsrörelse** räknas mot de daterade punkterna i `state/price_history.json`, inte mot `previousClose` (åtgärdspunkt 3: `previousClose` står kvar på 2026-10-28-nivå för båda mynten). Dagens nivåer är intradagspunkter från 00:56–00:57 UTC.

**Teknik** (råserien i `state/price_history.json`, 250 punkter):
- **`^GSPC`:** 5,67 % över MA200 (7 306,46) ⇒ **regimfiltret för US-boken är fortsatt PÅ**. Kursen ligger strax över EMA20 (7 714,70) och EMA50 (7 686,93), RSI 50,8.
- **`^IXIC`:** under EMA20 (26 550,54) och EMA50 (26 530,24), 4,55 % över MA200 (25 045,88). RSI 43,4.
- **`BTC-USD`:** under EMA20 (81 055,69) och – nytt sedan i går – även under EMA50 (79 599,91); 6,70 % över MA200 (72 257,58). RSI 36,9.
- **`ETH-USD`:** under EMA20 (2 406,68) och EMA50 (2 411,73), bara 4,04 % över MA200 (2 130,49). RSI 31,8.

**Torsdagens bredd** bland de 118 US-aktier med kurs, `previousClose` och marketTime 2026-10-29 i `state/prices.json` (`price / previousClose − 1`, reguljär session):
- **Starkast:** `HII` +13,23 %, `FIVE` +4,70 %, `LOW` +4,48 %, `TEVA` +3,75 %, `HD` +3,60 %, `JEF` +3,45 %, `NKE` +3,42 %, `BA` +3,30 %, `BX` +3,02 % och `DE` +3,02 %.
- **Svagast:** `MRVL` −13,24 %, `GOOGL` −12,64 %, `IREN` −8,98 %, `TEAM` −7,28 %, `MU` −4,98 %, `RIOT` −4,91 %, `APLD` −4,81 %, `CLSK` −4,43 %, `AMZN` −4,25 % och `SMCI` −3,85 %.

Rotationen gick från AI-infrastruktur och kryptominers (`MRVL`, `MU`, `IREN`, `RIOT`, `CLSK`) till hem/detaljhandel och industri (`LOW`, `HD`, `DE`, `BA`). Enda rörelsen med egen bekräftad rapport bland de starkaste var `HII`. **`AMZN`:s −4,25 % kom FÖRE rapporten** (reguljär session, stängning 20:00:01Z) – en spridningseffekt från `GOOGL`:s FCF-besked, inte en reaktion på det egna utfallet. **Efterbörs** saknas i `state/prices.json` för samtliga gårdagens efterbörsrapportörer (`AMZN`, `INTC`, `COIN`, `MSTR`, `RDDT`) – andra dagen i rad (åtgärdspunkt 7). Efterbörs finns för kvällens rapportörer: `XOM` 184,717 (post, 23:59:57Z) och `CVX` 234,29 (post, 23:47:34Z) – båda FÖRE dagens rapporter.

## Ekonomiska siffror & kalender

**Senaste utfall:**
- **BNP Q3 2026, förhandsskattning (2026-10-29): +3,4 % annualiserat** mot konsensus 3,2 % (FXStreet; ActionForex 3,0 %) och 2,2 % i Q2. Prisindex för inhemska köp **3,0 %** mot 5,6 % i Q2 (BEA, "GDP (Advance Estimate), 3rd Quarter 2026", 2026-10-29; Advisor Perspectives och StockTitan 2026-10-29). **Starkare tillväxt men lägre prisökningstakt** – blandat för decemberhöjningen.
- **Jobless claims (vecka t.o.m. 2026-10-24): 194 000** mot konsensus 199 000, föregående reviderad 194 000 → 195 000; 4-veckorssnitt 196 750; fortsatta ansökningar 1,701 mn (FXStreet och fxtribune 2026-10-29, U.S. Department of Labor). Arbetsmarknaden är fortsatt stram.
- **FOMC 2026-10-28:** oförändrat 3,75–4,00 %, 10–2 med två röster för höjning (rapport-261029).

**Kommande:**
- **PCE september – DATUM EJ VERIFIERAT.** Rapport-261029 angav fredag 30/10. En BEA-sida listar "Personal Income and Outlays, September 2026" till 2026-10-29 08:30, och BEA:s releaseschema tycks ange 2026-11-04; källorna är oeniga och schemat gick inte att läsa ut (websök 2026-10-30). **Detta är dagens största oklarhet** – kontrollera bea.gov före handel.
- **I dag fredag 2026-10-30:** `XOM`, `CVX` och `CBOE` rapporterar (före öppning enligt kalendern). BoJ-beslut (ej verifierat ur primärkälla).
- **Måndag 2026-11-02:** ISM tillverkning (oktober, ej verifierad tid).
- **Fredag 2026-11-06:** NFP oktober (ej verifierad ur primärkälla). Nästa claims 2026-11-05.

**Rapporter nästa 5 handelsdagar** (`state/earnings_calendar.json`, `generatedAt` 2026-10-30T00:56:39Z, `errors` tomt), US-symboler:
- 10-30 (i dag): `XOM`, `CVX` och `CBOE`
- 11-02: `AAPL`, `PLTR`, `RIG`, `RHP`, `CRGY` och `AESI`
- 11-03: `AMD`, `ANET`, `SMCI`, `TEVA`, `AMRX` och `PCVX` (`PCVX` har `isEstimate: true`)
- 11-04: `NVO`, `PAYC`, `PTC`, `QGEN`, `UTHR`, `KHC`, `BKH`, `CXW`, `RIOT` och `MARA` (`MARA` har `isEstimate: true`)
- 11-05: `AKAM`, `DVN`, `EVCM`, `IREN`, `NET`, `TEAM` och `U`, samt `SYNA` och `WBD` (båda `isEstimate: true`)
- 11-06: `VST`

**L-5:** kalendern ser bara de symboler `prices.yml` hämtar, så resten av det amerikanska universumet är **OKONTROLLERAT**. Gårdagens rapporter från bl.a. Crocs, Carvana och Insmed (nämnda bland torsdagens vinnare av Benzinga 2026-10-29) prisbevakas inte och kan inte bedömas här. Alla datum ovan är bevakningsposter enligt punkt 8, aldrig köpförslag. **`XOM`/`CVX` i dag och `AAPL`/`PLTR` på måndag får inte köpas in i rapporten.**

## Aktuella händelser & katalysatorer

- **Amazon (`AMZN`), Q3 2026, 2026-10-29 efter stängning:** intäkter 201,9 mdr USD (i linje), **AWS +39 % till ~46 mdr** (snabbaste tillväxten på nästan fem år) med rörelseresultat 17,8 mdr, koncernens rörelsemarginal 13,9 % (rekord). **EPS 1,89 mot ~1,97**, capex 75,9 mdr i kvartalet (~220 mdr för 2026) och fritt kassaflöde −42,4 mdr på rullande 12 månader. Ledningen ser AWS-tillväxt över 40 % 2027 och 2028 (Amazon IR, Motley Fool, Yahoo Finance live, MarketBeat 2026-10-29). Aktien föll efterbörs; källorna är oeniga om storleken (~4–9 %, flera anger ~6 %). **Bekräftat utfall, blandat.**
- **Intel (`INTC`), Q3 2026, 2026-10-29 efter stängning:** intäkter 16,5 mdr USD (+21 %, marginellt under 16,54), non-GAAP EPS 0,52 mot ~0,41. **Q4-guiden 15,0–16,0 mdr med EPS 0,25** var svag, inklusive ~300 MUSD intäktseffekt från en incident i Fab 28; CFO ser PC-nedgången fortsätta "at least through the first half of next year". Aktien föll **20–21 % efterbörs** efter ~150 % uppgång i år (CNBC, Investing.com, MarketBeat 2026-10-29; SEC 8-K q326earningsrelease). **Negativ katalysator** – inget case.
- **Coinbase (`COIN`), Q3 2026, 2026-10-29 efter stängning:** transaktionsintäkter 590 MUSD mot väntat ~527 (−44 % å/å), totala intäkter 1,216 mdr (−35 % å/å), nettovinst 719 MUSD varav 715 MUSD orealiserade kryptovinster; justerat 77,7 MUSD. Prediktionsmarknader passerade 200 MUSD i årstakt (Motley Fool, Investing.com, Yahoo Finance live 2026-10-29). Efterbörsreaktionen var liten, källorna spretar mellan −2,2 % och +0,4 %. **Inget case:** kursen ligger 10,2 % under MA200 och vinstkvaliteten är låg.
- **Strategy (`MSTR`), Q3 2026, 2026-10-29:** 848 517 BTC per 2026-10-25, orealiserad vinst 20,91 mdr USD, nettovinst 19,53 mdr; CFO lämnar (SEC 8-K mstr-20261029 ex. 99.1; Bitcoin Magazine, Quartz 2026-10-29). Vinsten är en ren funktion av BTC-kursen – inget case.
- **Huntington Ingalls (`HII`), Q3 2026, 2026-10-29 före öppning:** se Case 1. +13,23 % till 316,21 på 3,2× volym.
- **Marvell (`MRVL`) −13,24 % till 218,34** efter att Bloomberg 2026-10-28 efter stängning rapporterat långt framskridna förvärvssamtal med Lumentum (börsvärde ~83 mdr USD, sannolikt aktiebetalning ⇒ utspädning). ⚠️ RYKTE – EJ BEKRÄFTAT (Bloomberg, 2026-10-28). Ingen kommentar från bolagen (Yahoo Finance, 24/7 Wall St., Motley Fool 2026-10-29). Negativt för `MRVL` – inget case.
- **Binance-hacket 2026-10-29: bekräftat.** En hot wallet tömdes på ~2,5–3,5 mdr USD i 64 tokens; ~2,3–2,8 mdr i stablecoins frystes av emittenterna. Binance bekräftade, lovar att täcka förlusterna och pausade tillfälligt in- och uttag. CoinDesk 2026-10-30: de tömda plånböckerna är samma som Binance redovisar som proof-of-reserves, och 18 270 BTC ligger orörda i 19 plånböcker som ingen kan frysa (CoinDesk 2026-10-30; Yahoo Finance 2026-10-29). Nästa reservögonblicksbild är 1/11. **Negativ kryptokatalysator** och en överhängsrisk: om de stulna BTC säljs blir det ett utbudstryck.
- **`state/news_feed.json`** (`generatedAt` 2026-10-29T23:19:55Z) täcker **10 av 10 handelsdagar** (2026-10-16 – 2026-10-29, `missingDays` tomt). **Alla 91 posterna för 2026-10-29 ligger efter 17:00 UTC**, så varken `HII`:s rapport (före öppning), BNP eller claims finns i flödet – fjärde dagen i rad (åtgärdspunkt 5). Flödet fångade 8-K från Meta, Teva och Kimberly-Clark efter 21:00 UTC men inget av det ändrar dagens urval. `globenewswire` och `globenewswire-earnings` svarar fortfarande HTTP 403 (åtgärdspunkt 1).

## Uppföljning av tidigare case

- **`MSFT` (rapport-261029): KURS EJ VERIFIERAD efter katalysatorn då (pre-event 531,01, 2026-10-28T20:00:01Z) → 530,14 nu** (−0,16 %; `state/prices.json` 2026-10-29T20:00:01Z). Förbörs 540,95 (29/10 12:50Z enligt US-bokens avgörande) gav alltså tillbaka hela uppgången under sessionen, dagslägsta 519,56. **Tes FÖRSVAGAD** – fundamenten står kvar men marknaden "sålde nyheten" i en svag tech-dag. Kandidaten avvisades 2026-10-29 (grind 5).
- **`AXGN` (rapport-261029): 49,25 → 49,63** (+0,77 %; 2026-10-29T20:00:01Z), dagsintervall 48,43–51,16. **Tes INTAKT.** Pending ≤ 46,00 **EJ TRIGGAD** (dagslägsta 48,43, 5,28 % över villkoret). RSI 74,9.
- **`VRT` (rapport-261029): 242,94 → 245,92** (+1,23 %; 2026-10-29T20:00:03Z) trots −1,38 % i Nasdaq. **Tes INTAKT** fundamentalt, men kursen ligger 8,99 % under MA200 (270,22) – fortsatt blockerad.
- **`ORCL` (rapport-261029): 144,54 → 139,56** (−3,45 %; 2026-10-29T20:04:43Z), 11,27 % under MA200 (157,28). **Tes FÖRSVAGAD** – halva investerardagsrörelsen kvar efter en dag.

**Kandidatkön (`state/scout_candidates.json`):** före dagens körning fanns 99 poster, varav 92 `rejected`, 7 `promoted` och **0 `new`**. Inga poster är försenade. Inga avvisningar från 2026-10-29 vilar på en tillfällig dataspärr (MSFT grind 5, VRT/ORCL grind 2 under MA200, SOFI/PNR slutligt avgjorda) ⇒ **L-4 ger ingen omprövning i dag.**

**Innehav och pending:** US-boken har inga aktieinnehav, och `SPY` ligger på 100 % (`state/portfolj_us.md`). `SPY` står på 769,36 (2026-10-29T20:00:00Z), −0,51 % mot entry 773,26. **Pending `NUE` ≤ 262,00 EJ TRIGGAD:** dagslägsta 2026-10-29 var 271,30 och stängningen 275,29 – ny 250-dagarshögsta (2026-10-29T20:00:03Z). **Pending `AXGN` ≤ 46,00 EJ TRIGGAD** (se ovan).

## Dagens case

### Case 1: Huntington Ingalls Industries (HII / NYSE)
**Katalysator:** Bekräftad Q3-rapport 2026-10-29 före öppning (SEC 8-K hii2026q3earningsrelease). Intäkterna steg 10,8 % till 3,5 mdr USD och utspätt EPS blev 5,48 mot konsensus ~4,36–4,43 (3,68 för ett år sedan). Nya order 32,4 mdr USD i kvartalet (43,1 mdr hittills i år), och varvsintäktsguiden för 2026 höjdes till 10,5–10,7 mdr från 10,2–10,4. VD Chris Kastner: ordern säkrar "approximately 90 percent" av förväntade varvsintäkter till 2030 (Investing.com, TIKR, Chartmill, Maritime Executive 2026-10-29).
**Bull case:** Ett tydligt beat på vinsten (~+25 % mot konsensus), guidehöjning och en orderbok som ger ovanligt lång synlighet. Marginalerna förbättras efter flera år av problem med arbetskraft och leveranser, vilket var bolagets huvudsakliga rabattskäl. Rörelsen var bolagsspecifik (marknaden föll) och kom på 3,2× normal volym.
**Bear case:** Kursen ligger fortfarande **5,93 % under MA200 (336,14)** och långt under 250-dagarshögsta 453,73 – den långa trenden är nedåt. **RSI 75,7 är över grind 3:s tak på 75.** Försvarsbudgeten är politisk, och en enda kvartalsmarginal bevisar inte att produktionsproblemen är lösta. Rapporter om rörelsens storlek spretar (+8,6 % förbörs, +9,6–13 % under dagen).
**Setup:** **316,21** (reguljär stängning 2026-10-29T20:00:02Z, `state/prices.json`, efter katalysatorn), dagsintervall 296,51–327,75. Över EMA20 (277,32) och EMA50 (280,04), under MA200 (336,14). Volym 1,71 mn aktier, 3,22× 20-dagarssnittet; snittomsättning ~167 MUSD/dag, klart över likviditetsgolvet 20 MUSD. **Enligt bokens regel blockerar kurs ≤ MA200 en ny aktieposition**, så kandidaten loggas för mätbarhet och väntas bli avvisad på grind 2 tills kursen tagit MA200 – vilket ligger 6,3 % ovanför och inom räckhåll inom fönstret. Kandidat **`261030-HII`**.

### Case 2: Amazon (AMZN / NASDAQ)
**Katalysator:** Bekräftad Q3-rapport 2026-10-29 efter stängning. AWS växte 39 % till ~46 mdr USD (snabbast på nästan fem år) med 17,8 mdr i rörelseresultat, och koncernens rörelsemarginal blev rekordhöga 13,9 %. Men EPS 1,89 missade ~1,97, och capex på 75,9 mdr i kvartalet gav ett fritt kassaflöde på −42,4 mdr över 12 månader (Amazon IR, Motley Fool, Yahoo Finance live, MarketBeat 2026-10-29).
**Bull case:** AWS accelererar för andra kvartalet i rad och ledningen ser över 40 % tillväxt 2027–2028 – den starkaste molnsignalen i veckans hyperscaler-rapporter efter Microsofts Azure +48 %. Marginalrekordet visar att detaljhandeln bär sin del. Aktien hade redan fallit −4,25 % FÖRE rapporten på `GOOGL`-smitta och ligger nu precis på MA200, så en del av besvikelsen kan redan vara prisad.
**Bear case:** Samma mönster som straffade `GOOGL` (−12,64 %): enorm capex och negativt fritt kassaflöde. EPS-missen och en försiktig julkvartalsguide (källorna är oeniga: ~243,5 mdr eller 240–247 mdr) gav ~4–9 % ned efterbörs. Efter en sådan reaktion hamnar kursen sannolikt **under MA200**, vilket blockerar ett köp.
**Setup:** Senaste verifierade kurs **243,79** (reguljär stängning 2026-10-29T20:00:01Z) är en **PRE-event-kurs**. Efterbörskursen saknas i `state/prices.json` (åtgärdspunkt 7), så **KURS EJ VERIFIERAD efter katalysatorn.** Tekniken före rapporten: 0,17 % över MA200 (243,38), under EMA20 (253,40) och EMA50 (254,04), RSI 40,7, volym 2,28× snittet. Kandidat **`261030-AMZN`** har `price: null`; `refresh-candidate-prices.mjs` fyller i kursen när förbörs eller dagens reguljära session finns. Ett MA200-brott på reaktionen är det troliga utfallet – kandidaten loggas för att avgörandet ska bli mätbart, inte för att den är ett trolig köp.

**Kandidatkön:** två nya poster skrivs med `status: "new"`, `confirmed: true`, `catalystDate` 2026-10-29 och `expiresAt` 2026-11-06: `261030-HII` (316,21, 2026-10-29T20:00:02Z, regular) och `261030-AMZN` (`price: null`, pre-event). `validate-scout-candidates.mjs` gav OK (101 kandidater). US-boken avgör dem i dag kl. 15:00 CET. **Krypto: inget case.** Binance-hacket är en bekräftad negativ katalysator, båda mynten har brutit under EMA50 och ETH närmar sig MA200 (4,0 % ovanför). `COIN` och `MSTR` gav inga handlingsbara utfall (se ovan), och minerkomplexet (`IREN` −8,98 %, `RIOT` −4,91 %, `CLSK` −4,43 %) föll brett.

## Makro- & sektorfaktorer att bevaka

**Räntor och inflation:** BNP +3,4 % och claims 194 000 bekräftar en stark ekonomi, medan prisindexet för inhemska köp sjönk till 3,0 % från 5,6 %. Med en hökaktig Fed (två röster för höjning 28/10) är det september-PCE som avgör decemberprissättningen – och dess datum är **inte verifierat** (30/10 eller 4/11). Motvind för långduration-tillväxt och krypto.

**AI-kedjan:** marknaden straffar nu hårt capex utan kassaflöde (`GOOGL` −12,64 %, `AMZN` efterbörs) och förvärv med utspädning (`MRVL` −13,24 %), medan `MSFT` – som förblir FCF-positivt – höll ställningen men inte efterbörsuppgången. Minnes- och utrustningsledet (`MU` −4,98 %, `SMCI` −3,85 %) gav tillbaka onsdagens uppgång. `INTC`:s −20 % efterbörs träffar halvledarsentimentet i dag. Nästa test: `AAPL`/`PLTR` (2/11) och `AMD`/`ANET`/`SMCI` (3/11).

**Sektorrotation:** pengar söker sig till hem/detaljhandel (`LOW` +4,48 %, `HD` +3,60 %), industri (`DE`, `BA`) och försvar (`HII`). Energi ligger nära 250-dagarshögsta inför dagens rapporter (`XOM` 0,7 % under, `CVX` 0,8 % under; RSI ~69).

**Krypto:** Binance-hacket och ~350–958 MUSD i likvidationer (sifferuppgifterna spretar och kommer från ej godkända källor) tog BTC under 78 000. Volatiliteten har vaknat efter rekordlåga nivåer. 18 270 stulna BTC som inte kan frysas är ett utbudsöverhäng; reservögonblicksbilden 1/11 visar om Binance fyllt på. **DXY** för 2026-10-29 gick inte att verifiera.

**Geopolitik:** inte uppdaterad i dag; inget i de verifierade källorna rörde marknaden 29/10.

### Åtgärdspunkter till Dren (L-3)

1. **`news-feed-globenewswire-http-403` – kvarstår, ÅTERKOMMANDE.** `feeds.globenewswire` och `feeds.globenewswire-earnings` är båda `"HTTP 403 – båda försöken (0.0 s)"` (`state/news_feed.json`, 2026-10-29T23:19:55Z). **Omfång:** 2 av 6 flöden. **Ersättningskälla:** websök.
2. **`macro-calendar-not-verifiable-from-state` – ÅTERKOMMANDE.** BNP, claims och samtliga bolagssiffror (AMZN, INTC, COIN, MSTR, HII, MRVL) och Binance-hacket kommer ur websök. **PCE-datumet går inte att fastställa** – BEA-källorna anger 29/10 respektive 4/11. **Omfång:** samtliga makrovärden och 2 av 2 kandidattester.
3. **`crypto-previousclose-misdated` – ÅTERKOMMANDE.** `quotes["BTC-USD"].previousClose` är 81 267,59 medan punkten 2026-10-29 i `state/price_history.json` är 77 894,56; för `ETH-USD` 2 357,62 mot 2 245,95. Fältet räknat rakt av hade gett −5,13 % resp. −5,98 % som "dagsrörelse" mot korrekta −1,02 % resp. −1,31 %. **Omfång:** 2 av 2 mynt. **Ersättningskälla:** den daterade punkten, som används i tabellen.
4. **`watchlist-cap-vs-measurability-conflict` – ÅTERKOMMANDE.** `config/watchlist_us.txt` har 126 symbolrader mot riktmärket 25. Inga rader läggs till eller stryks i dag (`HII` och `AMZN` finns redan), eftersom skydden i `prompts/gemensam_korning.md` går före riktmärket. 5 av 298 symboler i `state/prices.json` saknar `price` (`BK`, `BIOT.ST`, `DOMETIC.ST`, `ICA.ST`, `NRS.OL`); `BK` är den enda US-symbolen.
5. **`news-feed-daily-cap-drops-us-morning` – ÅTERKOMMANDE (fjärde dagen).** Alla 91 poster för 2026-10-29 ligger mellan 17:00 och 23:59 UTC (`perDay` 91 – taket per källa och dygn binder). Morgonens rapportflöde saknas därmed helt igen. **Omfång:** 1 av 1 bekräftad dagtidsrapport som används här (`HII`); 4 av 4 den 2026-10-28, 5 av 5 den 2026-10-27 och 3 av 3 den 2026-10-26. **Ersättningskälla:** websök.
6. **`earnings-calendar-coverage` – L-5.** Rapporter från Crocs, Carvana och Insmed (Benzinga 2026-10-29) och Fortinet/SK Hynix (28/10) syns inte i `state/earnings_calendar.json`, eftersom kalendern bara täcker hämtade symboler. **Omfång:** minst 3 bolag den 29/10.
7. **`extended-scope-drops-same-evening-reporters` – ÅTERKOMMANDE (andra dagen).** `state/prices.json` (00:58 UTC) saknar `extendedPrice` för samtliga fem efterbörsrapportörer 2026-10-29 i kalendern: **`AMZN`, `INTC`, `COIN`, `MSTR` och `RDDT`**, medan `XOM` och `CVX` (rapporterar i dag) har det. Orsaken är densamma som i går: `fetch-prices.mjs:extendedScope()` tar bara `tradingDaysAway` 0–2, räknat från den nya UTC-dagen. **Omfång:** 5 av 5 efterbörsrapportörer. **Ersättningskälla:** websök (procentsatser, ingen kurs) – Intels −20 % och Amazons −4 till −9 % kan därför inte anges med verifierad kurs. Föreslagen fix: ta med `tradingDaysAway` −1.
8. **`^VIX` hämtas inte – kvarstår.** Volatilitetsmåttet saknas på en dag med −1,38 % i Nasdaq och bred kryptolikvidation. **Omfång:** 1 symbol.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
