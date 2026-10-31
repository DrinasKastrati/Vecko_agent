# Daglig Scout: USA & Krypto
**Datum:** 2026-10-31
**Marknadsklimat:** Det är lördag och de amerikanska börserna är stängda, så rapporten bygger på fredagens session 2026-10-30. Teknikutförsäljningen fördjupades: `^IXIC` föll −2,86 % och `^GSPC` −1,82 %, Nasdaqs sämsta dag sedan juni. `INTC` föll −28,58 % efter en svag Q4-guide, och `AMD`, `AVGO` och `NVDA` drogs med. Kryptot stod still på sina låga nivåer: `BTC-USD` 77 273,34 och `ETH-USD` 2 245,92 ligger fortfarande under EMA20 och EMA50. **Aktiva lärdomar tillämpade:** L-3 (åtgärdspunkter sist), L-4 (inga vilande avvisningar att pröva om – `HII` och `AMZN` avvisades 2026-10-30 på teknik, alltså av omdömesskäl), L-5 (kalenderns täckning) och L-6 (inga klasser utesluts; `CBOE` och `CVX` står inte bland fokussektorerna, men `config/fokus_scout.md` prioriterar "**Earnings surprises:** bolag som krossat förväntningarna i senaste rapporten" och marknaden "USA (NYSE & NASDAQ)"). L-1, L-2, L-7 och L-8 gäller inte scouten.

## Marknadsöversikt

`git pull` 2026-10-31 05:48 UTC (06:48 CET) gav `origin/main` = `7a77435` (`Kurser: 2026-10-31 00:47 UTC`). Källan är `state/prices.json` med `generatedAt` 2026-10-31T00:47:18Z, `schemaVersion` 2026-08-02-prevclose, `tickerCount` 298, `okCount` 293 och `wideAt` 2026-10-31T00:47:18Z (Yahoo Finance chart API via GitHub Actions).

| Symbol | Nivå | Rörelse fredag | Vecka (mot 2026-10-23) | marketTime |
|---|---|---|---|---|
| `^GSPC` | 7 580,07 | −1,82 % (7 720,39 → 7 580,07) | −0,57 % | 2026-10-30T20:47:43Z |
| `^IXIC` | 25 437,00 | −2,86 % (26 184,72 → 25 437,00) | −2,00 % | 2026-10-30T21:15:59Z |
| `BTC-USD` | 77 273,34 | +0,41 % mot daterad punkt 2026-10-30 (76 955,32) | −3,22 % mot 2026-10-26 (79 841,07) | 2026-10-31T00:45:34Z |
| `ETH-USD` | 2 245,92 | +0,47 % mot daterad punkt 2026-10-30 (2 235,48) | −2,55 % mot 2026-10-26 (2 304,65) | 2026-10-31T00:45:51Z |
| `SPY` (sleeve) | 755,72 | −1,77 % (769,36 → 755,72) | −0,56 % | 2026-10-30T20:00:00Z |

Indexfallen bekräftas av nyhetsbyråerna: Nasdaq hade sin sämsta dag sedan juni, S&P 500 föll ~1,8 % och Dow 579 punkter (−1,1 %), och oktober blev Nasdaqs sämsta månad sedan mars 2025 med −5,3 % (ABC News/AP 2026-10-31; yournews.com 2026-10-30, med hänvisning till CNBC). Källorna anger Nasdaqs fall till 2,8–3,4 %; tabellen ovan använder den verifierade stängningen. **Kryptots dagsrörelse** är räknad mot de daterade punkterna i `state/price_history.json`, inte mot `previousClose` (åtgärdspunkt 3). Nivåerna är intradagspunkter från 00:45 UTC.

**Teknik** (räknad på råserien i `state/price_history.json`, 250 punkter):
- **`^GSPC`:** 3,70 % över MA200 (7 309,73) ⇒ **regimfiltret för US-boken är fortsatt PÅ**, men marginalen har krympt från 5,67 % i går. Under EMA20 (7 701,88) och EMA50 (7 682,74), RSI 40,1, och MACD-histogrammet fördjupas (−3,70 → −11,49). Volymen var 1,43× 20-dagarssnittet.
- **`^IXIC`:** under EMA20 (26 444,49) och EMA50 (26 487,38), bara **1,52 % över MA200 (25 055,71)**. RSI 34,7. Histogrammet fördjupas (−65,59 → −108,64).
- **`BTC-USD`:** under EMA20 (80 683,23) och EMA50 (79 503,31), 6,86 % över MA200 (72 309,78). RSI 37,9.
- **`ETH-USD`:** under EMA20 (2 392,99) och EMA50 (2 405,94), 5,36 % över MA200 (2 131,69). RSI 34,0. Histogrammet förbättras marginellt (−23,68 → −22,32).

**Fredagens bredd** bland de 118 US-aktier med kurs, `previousClose` och marketTime 2026-10-30 i `state/prices.json` (`price / previousClose − 1`, reguljär session):
- **Starkast:** `CBOE` +6,77 %, `ACN` +4,46 %, `ROP` +3,77 %, `RIG` +3,74 %, `CRGY` +3,27 %, `PEP` +2,65 %, `VZ` +2,45 %, `DE` +2,35 %, `NVO` +2,20 % och `RHI` +2,17 %. `XOM` +2,16 % och `CVX` +1,75 % steg på sina egna rapporter.
- **Svagast:** `RDDT` −29,22 %, `INTC` −28,58 %, `ILMN` −18,64 %, `AMD` −10,88 %, `COIN` −10,62 %, `MRVL` −10,05 %, `NET` −9,54 %, `IREN` −8,76 %, `BE` −8,61 % och `ANET` −8,34 %.

Pengarna gick ur halvledare, AI-infrastruktur och krypto-aktier till defensiva sektorer (`PEP`, `VZ`), energi och finansiell infrastruktur (`CBOE`). Två av de tre starkaste rörelserna hade en egen bekräftad rapport samma dag (`CBOE`, och `XOM`/`CVX` i energin). **Efterbörs** finns i `state/prices.json` för måndagens och tisdagens rapportörer (bl.a. `AAPL` 345,10, `PLTR` 184,78, `AMD` 508,22, `ANET` 169,82; post, 23:57–23:59Z) – alla FÖRE respektive rapport.

## Ekonomiska siffror & kalender

**Senaste utfall:**
- **PCE september (publicerad 2026-10-29, inte 30/10 eller 4/11):** kärn-PCE **+0,3 % m/m och 3,1 % å/å**, i linje med konsensus och upp från 3,0 % i augusti – den högsta årstakten sedan maj. Totalt PCE **+0,5 % m/m och 3,6 % å/å**, 0,1 procentenhet under konsensus (CNBC 2026-10-29; StockTitan 2026-10-29). **Datumfrågan från rapport-261029 och -261030 är därmed löst:** siffran kom i torsdags.
- **Employment Cost Index Q3 2026 (2026-10-30): +0,8 % k/k**, i linje med konsensus 0,8 % och ned från 0,9 % i Q2; 3,4 % å/å, samma takt som i juni (BLS ECI-release 2026-10-30; Marketplace och Idaho Business Review/Reuters 2026-10-30). Lönetrycket avtar inte, men det accelererar inte heller.
- **BNP Q3 (2026-10-29): +3,4 % annualiserat** mot 3,2 %, och **jobless claims 194 000** mot 199 000 (rapport-261030).
- **Chicago-PMI och UMich-sentimentet (slutligt oktober) gick inte att verifiera** ur websök 2026-10-31.

**Kommande:**
- **Måndag 2026-11-02:** ISM tillverkning (oktober). **Mest marknadsrörande under veckan är NFP oktober fredag 2026-11-06** (inget av datumen är verifierat ur primärkälla – bea.gov och bls.gov-schemat kunde inte läsas, åtgärdspunkt 2). Nästa claims 2026-11-05.

**Rapporter nästa 5 handelsdagar** (`state/earnings_calendar.json`, `generatedAt` 2026-10-31T00:45:17Z, `errors` tomt), US-symboler:
- 11-02: `AAPL`, `PLTR`, `RIG`, `RHP`, `CRGY` och `AESI`
- 11-03: `AMD`, `ANET`, `SMCI`, `TEVA` och `AMRX`, samt `PCVX` (`isEstimate: true`)
- 11-04: `NVO`, `PAYC`, `PTC`, `QGEN`, `UTHR`, `KHC`, `BKH`, `CXW` och `RIOT`, samt `MARA` (`isEstimate: true`)
- 11-05: `AKAM`, `DVN`, `EVCM`, `IREN`, `NET`, `TEAM` och `U`, samt `SYNA` och `WBD` (båda `isEstimate: true`)
- 11-06: `VST`

**L-5:** kalendern ser bara de symboler `prices.yml` hämtar, så resten av det amerikanska universumet är **OKONTROLLERAT**. Samtliga symboler ovan finns redan i `config/watchlist_us.txt`, så inga rader läggs till. Alla datum är bevakningsposter enligt punkt 8, aldrig köpförslag – **`AAPL`/`PLTR` på måndag och `AMD`/`ANET` på tisdag får inte köpas in i rapporten**, hur mycket de än fallit i veckan.

## Aktuella händelser & katalysatorer

- **Intel (`INTC`) −28,58 % till 65,76** (2026-10-30T20:00:01Z) – aktiens sämsta dag sedan 1974, på den svaga Q4-guiden (15,0–16,0 mdr USD, EPS 0,25) som dels beror på en driftstörning i Israel (Fab 28), dels på fortsatt svag PC-marknad, trots att Q3-vinsten slog förväntningarna (CNBC 2026-10-30; ABC News/AP 2026-10-31). **Negativ katalysator** – inget case.
- **Halvledarsmittan:** `AMD` −10,88 %, `MRVL` −10,05 %, `ANET` −8,34 %, `AVGO` −5,48 % och `NVDA` −4,22 % (`state/prices.json`, 2026-10-30). AP anger samma storleksordning för AMD (−11 %), Broadcom (−5 %) och Nvidia (−4 %) och knyter det till oro för AI-investeringarna efter Alphabets och Amazons rapporter (ABC News/AP 2026-10-31). `AMD` och `ANET` rapporterar på tisdag.
- **Cboe Global Markets (`CBOE`), Q3 2026, 2026-10-30 före öppning:** se Case 1. +6,77 % på 2,0× volym.
- **Chevron (`CVX`), Q3 2026, 2026-10-30 före öppning:** se Case 2.
- **ExxonMobil (`XOM`), Q3 2026, 2026-10-30:** GAAP EPS 3,72, justerat **4,23** (17,5 mdr USD), upp 0,71 USD mot Q2; återköp på **20 mdr USD för 2027** och fortsatt höjd utdelning (SEC 8-K ex. 99.1 livef8k3q26991, 2026-10-30). Aktien steg +2,16 % till 187,25, ny 250-dagarshögsta. **Konsensus för kvartalet gick inte att belägga** (källorna spretar), så ett beat kan inte påstås – **ingen kandidat**. Boken stängde `XOM` på punkterad tes 2026-08-26.
- **Reddit (`RDDT`) −29,22 % till 91,73** på 6,8× volym efter rapporten 2026-10-29 efter stängning. Rapportens innehåll och guide gick inte att verifiera ur websök (bara 8-K-hänvisningen hittades). RSI 17,5, långt under MA200 (159,37). **Negativ katalysator** – inget case.
- **Illumina (`ILMN`) −18,64 % till 235,99** på 2,3× volym. **Orsaken är inte verifierad** (ingen träff i websök eller i `state/news_feed.json`); noteras bara som rörelse.
- **Binance-hacket (bekräftat 2026-10-29 enligt rapport-261030):** ingen ny verifierad uppgift hittades i dag – websök gav inget från CoinDesk eller The Block för 2026-10-30. Nästa reservögonblicksbild från Binance är 1/11.
- **`state/news_feed.json`** (`generatedAt` 2026-10-30T23:00:03Z) täcker **10 av 10 handelsdagar** (2026-10-19 – 2026-10-30, `missingDays` tomt). **Alla 90 posterna för 2026-10-30 ligger mellan 18:08 och 22:56 UTC**, så varken `CBOE`:s, `CVX`:s eller `XOM`:s morgonrapporter, ECI eller fredagens öppning finns i flödet – femte dagen i rad (åtgärdspunkt 5). Inget av kvällens poster ändrar urvalet.

## Uppföljning av tidigare case

- **`HII` (rapport-261030): 316,21 → 316,88** (+0,21 %; `state/prices.json` 2026-10-30T20:00:03Z), dagsintervall 313,54–322,56. Höll hela torsdagsuppgången på en dag då S&P föll −1,82 %. **Tes INTAKT** – men kursen ligger kvar 5,59 % under MA200 (335,65) och RSI är 75,9. Kandidaten avvisades 2026-10-30 (grind 2).
- **`AMZN` (rapport-261030): KURS EJ VERIFIERAD efter katalysatorn då (pre-event 243,79, 2026-10-29T20:00:01Z) → 240,35 nu** (−1,41 %; 2026-10-30T20:00:01Z). Dagslägsta 229,36 (−5,92 %) på 2,8× volym, så aktien återhämtade det mesta av efterbörsfallet. **Tes FÖRSVAGAD** – stängningen ligger 1,25 % under MA200 (243,40) och under EMA20/EMA50. Kandidaten avvisades 2026-10-30 (grind 2).

**Kandidatkön (`state/scout_candidates.json`):** före dagens körning fanns 101 poster, varav 94 `rejected`, 7 `promoted` och **0 `new`**. Inga poster är försenade. Avgörandena 2026-10-30 (`HII` och `AMZN`, båda grind 2: kurs under MA200) är tekniska omdömesspärrar, inte tillfälliga dataspärrar ⇒ **L-4 ger ingen omprövning i dag.**

**Innehav och pending:** US-boken har inga aktieinnehav, och `SPY` ligger på 100 % (`state/portfolj_us.md`). `SPY` står på 755,72 (2026-10-30T20:00:00Z), −2,27 % mot entry 773,26. **Pending `NUE` ≤ 262,00 EJ TRIGGAD:** dagslägsta 2026-10-30 var 268,75 (2,58 % över villkoret), stängning 273,87. **Pending `AXGN` ≤ 46,00 EJ TRIGGAD:** dagslägsta 48,08 (4,52 % över villkoret), stängning 49,37 (båda 2026-10-30T20:00Z).

## Dagens case

### Case 1: Cboe Global Markets (CBOE / Cboe US)
**Katalysator:** Bekräftad Q3-rapport 2026-10-30 före öppning (Cboe IR och SEC 8-K ex. 99.1 cboe-20261030xex991). Nettointäkterna steg 18 % till 712,2 MUSD, över snittestimatet 707,7 MUSD. Justerat EPS blev **3,63** (+36 % från 2,67) mot konsensus 3,29 (en källa) respektive 3,43 (Visible Alpha). GAAP EPS var rekordhöga 4,08, med hjälp av en reavinst på 71,5 MUSD från avyttringen av Cboe Australia. Bolaget **höjde guiden för 2026 års organiska intäktstillväxt till "high teens"** från "mid to high teens" och sänkte kostnadsguiden till 830–845 MUSD (GuruFocus, TradingView/Seeking Alpha, Motley Fool-transkript 2026-10-30).
**Bull case:** Ett tydligt beat på kärnvinsten (+6 % till +10 % mot konsensus), en höjd intäktsguide och en sänkt kostnadsguide samtidigt – alltså operativ hävstång. Börsoperatörer gynnas strukturellt av hög volatilitet och handel i optioner, och fredagens utförsäljning är just den sortens marknad. Rörelsen +6,77 % kom mot ett fallande index på 2,0× normal volym och ligger väl över MA200, så den har både katalysator och trend.
**Bear case:** Reavinsten från Australien blåser upp GAAP-siffran, och konsensus är inte entydig (3,29 eller 3,43). Kursen hade fallit fyra dagar i rad före rapporten (340,42 → 314,25), så en del av uppgången är återhämtning. 250-dagarshögsta 366,70 ligger 9,3 % ovanför. Om volatiliteten lägger sig minskar optionsvolymerna, och då försvinner medvinden.
**Setup:** **335,53** (reguljär stängning 2026-10-30T20:00:00Z, `state/prices.json`, efter katalysatorn), dagsintervall 320,12–342,86. Över EMA20 (311,84), EMA50 (298,99) och MA200 (292,51; +14,71 %). RSI 63,9, MACD-histogrammet positivt och stigande (+1,01 → +1,34). Volym 2,46 mn aktier, 2,01× 20-dagarssnittet; snittomsättning ~410 MUSD/dag, klart över likviditetsgolvet 20 MUSD. Kandidat **`261031-CBOE`**.

### Case 2: Chevron (CVX / NYSE)
**Katalysator:** Bekräftad Q3-rapport 2026-10-30 före öppning (SEC 8-K ex. 99.1 a09302026ex9918-k; chevron.com 2026-10-30). Resultatet blev 9,9 mdr USD (5,06 per aktie) och justerat **10,4 mdr USD eller 5,28 per aktie**, mot konsensus ~4,73 (Zacks) till 4,89 (24/7 Wall St. 2026-10-26). Produktionen var ~2 043 tusen fat oljeekvivalenter per dag, något upp mot Q2 på högre volymer i Mexikanska golfen.
**Bull case:** Ett beat på 8–12 % mot konsensus trots lägre realiserade priser, och rekordhög produktion efter Hess-förvärvet. Energin är en av få sektorer med medvind just nu (`XOM` och `CVX` på nya 250-dagarshögsta samma dag som Nasdaq föll −2,86 %), och sektorn ger en motvikt till bokens tekniktunga historik.
**Bear case:** Det justerade resultatet **föll 1,6 mdr USD mot Q2** på lägre priser och negativa tidseffekter – beatet är mot låga förväntningar, inte en förbättring. Reaktionen var svag (+1,75 %) för ett beat av den storleken. **RSI 72,9 ligger nära grind 3:s tak på 75**, och kursen ligger 21,8 % över MA200, alltså sträckt. Ingen ny återköpsplan hittades i källorna. Oljepriset styr allt.
**Setup:** **235,52** (reguljär stängning 2026-10-30T20:02:24Z, `state/prices.json`, efter katalysatorn), dagsintervall 233,22–236,46, ny 250-dagarshögsta. Över EMA20 (223,61), EMA50 (214,06) och MA200 (193,34). MACD-histogrammet positivt (+0,73 → +0,81). Volym 11,0 mn aktier, 1,53× 20-dagarssnittet; snittomsättning ~1,7 mdr USD/dag. Kandidat **`261031-CVX`**. Nåbarhet och R/R mot närmaste motstånd avgörs av US-boken; ett sträckt läge talar för en villkorad entry snarare än marknadsköp.

**Kandidatkön:** två nya poster skrivs med `status: "new"`, `confirmed: true`, `catalystDate` 2026-10-30 och `expiresAt` 2026-11-06: `261031-CBOE` (335,53, 2026-10-30T20:00:00Z, regular) och `261031-CVX` (235,52, 2026-10-30T20:02:24Z, regular). Båda kurserna är reguljära stängningar EFTER morgonrapporterna. `validate-scout-candidates.mjs` gav OK (103 kandidater). US-boken avgör dem vid nästa körning, måndag 2026-11-02 kl. 15:00 CET. **Krypto: inget case.** Båda mynten ligger under EMA20 och EMA50, inga nya flöden eller regulatoriska besked kunde verifieras, och krypto-aktierna föll brett (`COIN` −10,62 %, `MSTR` −7,84 %, `IREN` −8,76 %).

## Makro- & sektorfaktorer att bevaka

**Räntor och inflation:** kärn-PCE 3,1 % (högsta sedan maj) och ECI 3,4 % å/å ger ingen lättnad för en Fed där två ledamöter röstade för höjning 28/10. Stark tillväxt (BNP +3,4 %) och stram arbetsmarknad (claims 194 000) håller räntorna uppe. Motvind för långduration-tillväxt och krypto; NFP fredag 6/11 är veckans test. Avkastningen på amerikanska statsobligationer och **DXY** för 2026-10-30 gick inte att verifiera.

**AI-kedjan:** marknaden straffar nu hela kedjan för capex utan kassaflöde – från hyperscalers (`GOOGL`, `AMZN`) till chip (`INTC` −28,58 %, `AMD` −10,88 %) och nätverk (`ANET`, `MRVL`, `CIEN`). `^IXIC` ligger bara 1,52 % över MA200. **Bryter `^GSPC` sin MA200 (3,70 % under nuvarande nivå) slår regimfiltret av och US-boken får inga nya positioner.** Veckans rapporter från `AAPL`/`PLTR` (2/11) och `AMD`/`ANET`/`SMCI` (3/11) avgör om utförsäljningen fortsätter.

**Sektorrotation:** från teknik till energi (`XOM`, `CVX`, `RIG`, `CRGY`), defensiva (`PEP`, `VZ`, `WMT`) och finansiell infrastruktur (`CBOE`). Mönstret från torsdagen (hem, industri, försvar) håller i sig.

**Krypto:** BTC och ETH stabiliserade sig på fredagen efter Binance-fallet men har inte återtagit EMA20/EMA50. Båda ligger fortfarande 5–7 % över MA200. Frågan om de stulna BTC säljs står kvar, och 1/11 visar Binances reserver.

**Geopolitik:** inget i de verifierade källorna rörde marknaden 30/10.

### Åtgärdspunkter till Dren (L-3)

1. **`news-feed-globenewswire-http-403` – kvarstår, ÅTERKOMMANDE.** `feeds.globenewswire` och `feeds.globenewswire-earnings` är båda `"HTTP 403 – båda försöken (0.0 s)"` (`state/news_feed.json`, 2026-10-30T23:00:03Z). **Omfång:** 2 av 6 flöden. **Ersättningskälla:** websök.
2. **`macro-calendar-not-verifiable-from-state` – ÅTERKOMMANDE.** PCE, ECI och samtliga bolagssiffror (`CBOE`, `CVX`, `XOM`, `INTC`) kommer ur websök. **Nytt i dag:** `WebFetch` når varken bea.gov, finance.yahoo.com eller cnbc.com (`getaddrinfo ENOTFOUND` – värdarna ligger utanför sessionens tillåtna nätdomäner), så primärkällor och schemat för ISM/NFP går inte att läsa direkt. **Omfång:** samtliga makrovärden och 2 av 2 kandidattester. Vill du ha primärkällor: lägg till `bea.gov`, `bls.gov`, `sec.gov` och `finance.yahoo.com` i miljöns nätverksinställningar.
3. **`crypto-previousclose-misdated` – ÅTERKOMMANDE.** `quotes["BTC-USD"].previousClose` är 77 775,11 medan punkten 2026-10-30 i `state/price_history.json` är 76 955,32; för `ETH-USD` 2 249,50 mot 2 235,48. Fältet räknat rakt av hade gett −0,65 % resp. −0,16 % som "dagsrörelse" mot korrekta +0,41 % resp. +0,47 % – **fel tecken** för båda. **Omfång:** 2 av 2 mynt. **Ersättningskälla:** den daterade punkten, som används i tabellen.
4. **`watchlist-cap-vs-measurability-conflict` – ÅTERKOMMANDE.** `config/watchlist_us.txt` har 126 symbolrader mot riktmärket 25. Inga rader läggs till eller stryks i dag (`CBOE` och `CVX` finns redan), eftersom skydden i `prompts/gemensam_korning.md` går före riktmärket. 5 av 298 symboler i `state/prices.json` saknar `price` (`BK`, `BIOT.ST`, `DOMETIC.ST`, `ICA.ST`, `NRS.OL`); `BK` är den enda US-symbolen.
5. **`news-feed-daily-cap-drops-us-morning` – ÅTERKOMMANDE (femte dagen).** Alla 90 poster för 2026-10-30 ligger mellan 18:08 och 22:56 UTC (`perDay` 90 – taket per källa och dygn binder). Morgonens rapportflöde saknas därmed helt igen. **Omfång:** 3 av 3 bekräftade morgonrapporter som används här (`CBOE`, `CVX`, `XOM`); 1 av 1 den 2026-10-29, 4 av 4 den 2026-10-28, 5 av 5 den 2026-10-27 och 3 av 3 den 2026-10-26. **Ersättningskälla:** websök.
6. **`earnings-calendar-coverage` – L-5.** Kalendern täcker bara hämtade symboler; orsaken till `ILMN`:s −18,64 % kunde inte verifieras och resten av universumet är OKONTROLLERAT. **Omfång:** okänt antal rapportörer 2026-10-29–30 utanför watchlistan.
7. **`extended-scope-drops-same-evening-reporters` – ÅTERKOMMANDE (kvarstår).** I går saknade `state/prices.json` efterbörskurs för samtliga fem efterbörsrapportörer 2026-10-29 (`AMZN`, `INTC`, `COIN`, `MSTR`, `RDDT`). I dag finns efterbörs bara för kommande rapportörer (`tradingDaysAway` 1–2), vilket visar samma begränsning i `fetch-prices.mjs:extendedScope()`. **Omfång:** 5 av 5 efterbörsrapportörer 2026-10-29. Föreslagen fix: ta med `tradingDaysAway` −1.
8. **`^VIX` hämtas inte – kvarstår.** Volatilitetsmåttet saknas på Nasdaqs sämsta dag sedan juni – och just volatiliteten är kärnan i dagens `CBOE`-case. **Omfång:** 1 symbol.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
