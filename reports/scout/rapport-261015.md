# Daglig Scout: USA & Krypto
**Datum:** 2026-10-15
**Marknadsklimat:** KPI för september blev varmare än väntat i kärnan (+0,3 % m/m mot +0,2 %, 2,6 % å/å mot 2,5 %), och marknaden prisade in risken för ännu en höjning. `^GSPC` föll 1,11 % och `^IXIC` 1,88 %. Försäljningen slog hårdast mot det räntekänsliga och skuldfinansierade AI-infrasegmentet (ORCL −8,83 %, CIEN −10,19 %, IREN −12,18 %) och mot kryptominers. Defensiva bolag och energi steg (UNH +4,73 %, WMT +3,46 %, XOM +1,68 %). BTC föll 1,91 % och ETH 3,23 %. **Aktiva lärdomar tillämpade:** L-3 (åtgärdspunkter sist), L-4 (kontroll av vilande kandidater, se uppföljningen), L-5 (rapportkalenderns källa och täckning anges) och L-6 (inga klasser utesluts). L-1, L-2, L-7 och L-8 gäller inte scouten.

## Marknadsöversikt

Samtliga kurser kommer ur `state/prices.json` (källa `Yahoo Finance (chart API)` via GitHub Actions). Filen har `generatedAt` **2026-10-14T23:55:13.572Z**, `schemaVersion` **2026-08-02-prevclose**, `tickerCount` 220 och `okCount` 217. `wideAt` står på 2026-10-14T00:18:42Z, så dagens breda körning hade inte gått när rapporten skrevs. Arbetskopian var i fas med `origin/main` (`64b0001 Nyheter: 2026-10-14 23:57 UTC`) efter `git pull` 2026-10-15 05:47 UTC.

| Symbol | Nivå | Rörelse | marketTime |
|---|---|---|---|
| `^GSPC` | 7 718,94 | −1,11 % (7 805,45 → 7 718,94, onsdag 2026-10-14) | 2026-10-14T20:36:08Z |
| `^IXIC` | 26 692,87 | −1,88 % (27 204,38 → 26 692,87) | 2026-10-14T21:15:59Z |
| `BTC-USD` | 81 507,61 | −1,91 % mot `previousClose` 83 095,13 | 2026-10-14T23:53:58Z |
| `ETH-USD` | 2 416,02 | −3,23 % mot `previousClose` 2 496,63 | 2026-10-14T23:54:11Z |
| `SPY` (sleeve) | 769,60 | −1,08 % | 2026-10-14T20:00:00Z |

Kryptots `previousClose` stämmer fortfarande inte med den daterade punkten 2026-10-13 i `state/price_history.json` (BTC 83 354,89, ETH 2 508,64). Mot de punkterna blir rörelsen −2,22 % respektive −3,69 %. Ingen av punkterna är ett dygnsslut, se åtgärdspunkt 3.

**Teknik (räknad på råserien i `state/price_history.json`, 250 punkter):** `^GSPC` ligger 6,3 % över MA200 (7 263,40), så regimfiltret för US-boken är fortsatt **PÅ**. Indexet föll dock under EMA20 (7 738,09), RSI sjönk till 49,5 och MACD-histogrammet krymper (9,45 → 2,42) mot en korsning. `^IXIC` ligger under EMA20 (27 001,63) men över EMA50 (26 638,44), med RSI 45,8 och ett MACD-histogram som fördjupas (−1,16 → −46,68). `BTC-USD` har RSI 49,2 och ligger under EMA20 (82 453) men över EMA50 (78 880) och MA200 (71 541). MACD-histogrammet är negativt och fördjupas. `ETH-USD` har RSI 40,0 och ligger under EMA20 (2 549) och EMA50 (2 444) men över MA200 (2 114).

**Kryptoflöden:** inga verifierade ETF-flödessiffror för 2026-10-14 hittades (websök 2026-10-15). Gårdagens inflöde (~175,6 MUSD BTC, rapport-261014) kan alltså inte bekräftas ha hållit i sig efter KPI.

## Ekonomiska siffror & kalender

**Senaste utfall – KPI september (BLS 2026-10-14, 08:30 ET):** totalt **+0,6 % m/m** (väntat +0,6 %) och **3,7 % å/å** (väntat 3,6 %, augusti 3,4 %). **Kärn-KPI +0,3 % m/m mot väntat +0,2 %, 2,6 % å/å mot väntat 2,5 %** (augusti 2,4 %). Bensinindex +9,1 % stod för över hälften av månadsökningen (BLS CPI-release 2026-10-14; CNBC 2026-10-14; Advisor Perspectives 2026-10-14). Det är den sista KPI-siffran före FOMC 27–28 oktober. Det varma kärnutfallet höjde förväntningarna på en höjning och lyfte statsobligationsräntorna (Yahoo Finance 2026-10-14; Crypto Briefing 2026-10-14).

**Kommande** (källa: websök, ingen fil i repot – se åtgärdspunkt 2):
- **I DAG, torsdag 2026-10-15, 08:30 ET / 14:30 CEST: PPI september – dagens mest marknadsrörande siffra efter gårdagens kärn-KPI.** Väntat +0,5 % m/m totalt (förra +0,4 %) och +0,3 % i kärnan (förra +0,2 %). Samtidigt kommer detaljhandelns försäljning för september (väntat +0,3 % m/m efter +1,1 %), Empire State-index för oktober (förra 7,6) och initiala arbetslöshetsanspråk (förra 197 000) (investinglive, TD Economics 2026-10-09). Fed-talare: Hammack 16:30 ET och ordförande Warsh i samtal med IMF-chefen Georgieva sent på kvällen (TD Economics, ej verifierat mot Fed). Bolagsrapporter: `TSM`, `PNC` och `USB` (`state/earnings_calendar.json`, `isEstimate: false`).
- **Fredag 2026-10-16:** industriproduktion september (väntat +0,4 %) och import-/exportpriser (TD Economics 2026-10-09).
- **2026-10-19 `AGNC`**, **2026-10-20 `NFLX`**, **2026-10-21 `META`, `TSLA`, `ABT`**, **2026-10-22 `BE`**, **2026-10-23 `ITW` (gissat datum)**, **2026-10-26 `PECO`**, **2026-10-27 `BA` och `SKHY` (gissat)**, **2026-10-28 `GOOGL`, `MSFT`, `BIIB`, `AWK`, `AXGN` och `UTHR` (gissat)** (`state/earnings_calendar.json`, `generatedAt` 2026-10-14T00:17:07Z, `errors` tomt).
- **L-5:** `state/earnings_calendar.json` ser bara de symboler som `prices.yml` hämtar. Resten av det amerikanska universumet är **OKONTROLLERAT**. Samtliga rapportbolag ovan finns redan i `config/watchlist_us.txt`, så inga rader läggs till i dag. Alla omfattas av rapportförbudet i punkt 8 och är bevakningsposter, aldrig köpförslag.

## Aktuella händelser & katalysatorer

- **KPI-reaktionen, 2026-10-14:** räntekänslig och skuldtung AI-infrastruktur sålde av. `ORCL` föll 8,83 % till 130,55 på 1,80× volym (marketTime 2026-10-14T20:04:20Z). Medierna kopplar fallet till stigande räntor ovanpå bolagets skuld kring 167 mdr USD och kreditbetyget BBB− (Yahoo Finance 2026-10-14; Crypto Briefing 2026-10-14). Samma rörelse syntes i `CIEN` −10,19 %, `HPE` −8,28 %, `SMCI` −8,42 % och `NET` −6,72 %. Kryptominers och AI-datacenter föll tillsammans: `IREN` −12,18 %, `MARA` −9,66 %, `RIOT` −9,42 % och `CLSK` −9,11 %. Cipher Digital prissatte samtidigt en konvertibel på 850 MUSD (24/7 Wall St. 2026-10-14; CoinTurk 2026-10-14). Samtliga kurser är ur `state/prices.json`, marketTime ~2026-10-14T20:00Z.
- **Bankrapporterna, 2026-10-14 (bekräftade utfall):** `BAC` fick 0,91 USD per aktie mot väntade 1,10, belastat av 1,2 mdr USD i böter för brister i penningtvättsskyddet. Exklusive böterna blev resultatet 1,08 USD per aktie, och intäkterna på ~30 mdr USD missade (CNBC 2026-10-14). Aktien stängde på 51,39 (−4,76 %) på 3,09× volym, under MA200 (55,23). `MS` slog med 3,03 USD per aktie mot 2,91 och intäkter på 20,34 mdr USD, med aktiehandeln +41 % och rekord i Wealth Management (CNBC 2026-10-14). Aktien föll ändå till 181,51 (−2,75 %, RSI 25,3, under MA200). `BLK` slog med justerat 15,93 USD per aktie och rekord-AUM på 15,5 biljoner USD (Il Sole 24 Ore 2026-10-14), men gav bort en förbörsuppgång på ~4 % och stängde på 1 073,79 (+0,72 %). Se Case 2. `JPM` steg 1,16 % till 335,28. **Läsning:** marknaden fortsätter att sälja banker på bra siffror.
- **`UNH` +4,73 % till 395,62 (marketTime 2026-10-14T20:00:02Z) på 1,41× volym.** Q3-rapporten 2026-10-13 slog estimaten, och helårsguidningen höjdes till minst 20,50 USD per aktie (UnitedHealth Group 8-K 2026-10-13). Se Case 1.
- **Defensiv rotation:** `WMT` +3,46 %, `COST` +2,87 %, `TGT` +2,18 %, `ROST` +2,17 % och `JNJ` +2,13 % (efter −5,73 % på rapporten dagen innan). Energin fortsatte upp: `XOM` +1,68 % och `CVX` +1,98 % stängde båda på 250-dagarshögsta med RSI 74,9 respektive 71,2. Ingen bolagsspecifik katalysator finns, så det blir inget case.
- **`state/news_feed.json`** (`generatedAt` 2026-10-14T23:57:16Z) bär 10 av 10 handelsdagar (2026-10-01 – 2026-10-14, `missingDays` tomt), med 90 poster för 2026-10-14. Rubrikerna efter stängning innehåller inga bekräftade amerikanska bolagskatalysatorer inom fokus: 8-K utan rubrik, gruppstämningsannonser och datumbesked. **`globenewswire` och `globenewswire-earnings` svarar fortfarande HTTP 403** (åtgärdspunkt 1), så den delen av pressmeddelandeflödet är **OKONTROLLERAD**.
- Inga rykten används i dag.

## Uppföljning av tidigare case

- **`META` (rapport-261014): 762,50 → 737,54 (−3,27 %, `state/prices.json`, marketTime 2026-10-14T20:00:01Z) – tes FÖRSVAGAD.** Muse Wonder-katalysatorn står kvar, men aktien föll med Nasdaq på KPI. Kursen ligger kvar över EMA20 (718,88), men MACD-histogrammet fördjupas (−2,98 → −3,53) och volymen var 0,74×. US-rotationen avvisade kandidaten `261014-META` 2026-10-14 på grind 2 (`reports/us_daily/us-daglig-261014.md`). Rapporten 2026-10-21 ligger nu 4 handelsdagar bort, och rapportförbudet gäller.

**Kandidatkön (`state/scout_candidates.json`, före dagens tillägg 77 poster: 72 `rejected`, 5 `promoted`, 0 `new`):** inga poster väntar på avgörande.

**L-4-kontroll:** `261014-META` avvisades av omdömesskäl (teknik/volym), inte på en datalucka, och omfattas inte. Inga andra avvisade poster inom sin `expiresAt` vilar på en datalucka. L-4 är uppfylld.

**Innehav:** US-boken har inga aktieinnehav. `MRVL` såldes på stop 2026-10-14 (`state/portfolj_us.md`, −5,45 %), och indexsleeven `SPY` ligger på 100 %. MRVL stängde 2026-10-14 på 245,28 (−8,73 %), alltså 5,7 % under stoppnivån 260,00. `state/alerts.json` (`checkedAt` 2026-10-14T21:19:03Z) har inga aktiva signaler.

## Dagens case

### Case 1: UnitedHealth Group (UNH / NYSE)
**Katalysator:** **Bekräftat utfall 2026-10-13, före börsöppning:** Q3 gav justerat 4,69 USD per aktie mot väntade 4,12 och intäkter på 112,7 mdr USD mot väntade 111,3 mdr. Medical cost ratio blev 88,4 % mot 89,9 % året innan. Helårsguidningen för 2026 höjdes till minst 20,50 USD per aktie i justerat resultat, från 19,50–20,00 i juli (UnitedHealth Group newsroom och SEC 8-K 2026-10-13; Investing.com 2026-10-13).
**Bull case:** Kostnadskvoten, som var bolagets stora problem, förbättrades med 1,5 procentenheter på ett år, och guidningen höjs för andra kvartalet i rad. Aktien är defensiv och ränteokänslig, vilket är en fördel i en marknad som just fått ett varmt kärn-KPI. Pengarna roterade dit 2026-10-14 medan tech och krypto föll.
**Bear case:** Den reaktionen kom först dag två: rapportdagen stängde −0,20 % (378,52 → 377,76). Volymen var 1,41× 20-dagarssnittet, alltså **under grind 2:s 1,5×**. Kursen ligger 9,3 % under 250-dagarshögsta (436,35). Politisk risk kring Medicare Advantage-ersättningarna kvarstår.
**Setup:** Kursen var 395,62 USD (`state/prices.json`, marketTime 2026-10-14T20:00:02Z, Yahoo Finance chart API). Det är en reguljär stängning dagen efter katalysatorn. Kursen ligger över EMA20 (379,30), EMA50 (385,77) och MA200 (358,36). RSI 62,2, och MACD-histogrammet är positivt och stiger (1,58 → 2,70). Volymkvoten är 1,41× (`state/volume_history.json`). Närmaste motstånd är 250-dagarshögsta 436,35 (+10,3 %), och stödet är EMA50 ~386 (−2,5 %). P/E på den nya guidningen är ungefär 19 (395,62 / 20,50). Kandidaten är skriven till `state/scout_candidates.json` som `261015-UNH` (`confirmed: true`, `catalystType: earnings`, `expiresAt` 2026-10-22).

### Case 2: BlackRock (BLK / NYSE)
**Katalysator:** **Bekräftat utfall 2026-10-14, före börsöppning:** justerat resultat 15,93 USD per aktie mot väntade ~14,15–14,32. Förvaltat kapital nådde rekordet 15,5 biljoner USD (+15 % å/å) på starka nettoinflöden (Il Sole 24 Ore 2026-10-14; Yahoo Finance earnings live 2026-10-14; Newsquawk 2026-10-14).
**Bull case:** Ett tydligt resultatslag och rekordinflöden. Bolaget gynnas direkt av höga börsnivåer och ETF-flöden, även i krypto via IBIT. Volymen på 2,07× visar att rapporten väckte verkligt intresse.
**Bear case:** **Prisåtgärden underkänner rapporten.** Förbörsuppgången på ~4 % gavs bort, dagshögsta var 1 106, och aktien stängde på 1 073,79 under både EMA20 och EMA50. Ett varmt KPI som pressar börsen slår direkt mot avgiftsbasen. Kursen ligger 9,2 % under 250-dagarshögsta.
**Setup:** Kursen var 1 073,79 USD (`state/prices.json`, marketTime 2026-10-14T20:00:02Z, Yahoo Finance chart API). Det är en reguljär stängning efter rapporten, som släpptes före öppning samma dag. Kursen ligger under EMA20 (1 075,46) och EMA50 (1 083,26) men över MA200 (1 060,75). RSI 48,3, och MACD-histogrammet är positivt men platt (2,79 → 2,70). Volymkvoten är 2,07×. Närmaste stöd är MA200 ~1 061 (−1,2 %), och motståndet är dagshögsta 1 106. Den tekniska bilden är svag, och caset är främst en bevakningspost för ansvarig bok. Nyckeltal utöver EPS saknas i repots filer och anges inte. Kandidaten är skriven till `state/scout_candidates.json` som `261015-BLK` (`confirmed: true`, `catalystType: earnings`, `expiresAt` 2026-10-22).

**Inga fler case.** `MS` slog estimaten men ligger under MA200 med RSI 25,3. `BAC` missade. ORCL och AI-infrastrukturen saknar positiv katalysator och ligger under EMA20. XOM och CVX har ingen bolagsspecifik katalysator och RSI över 70. Kryptot har ingen kryptospecifik katalysator, och både BTC och ETH ligger under EMA20 efter KPI.

## Makro- & sektorfaktorer att bevaka

**Räntorna styr igen.** Kärn-KPI på +0,3 % m/m efter Feds höjning i september gör FOMC 27–28 oktober till ett levande höjningsmöte. Dagens PPI och detaljhandel avgör om bilden bekräftas: kärn-PPI på +0,3 % eller mer och stark detaljhandel förstärker höjningsrisken. Det är motvind för fokusfilens tema "tillväxtbolag som gynnas av fallande/stabila räntor" och för krypto via realräntorna.

**Sektorrotation:** pengarna lämnar räntekänslig, skuldfinansierad AI-infrastruktur och kryptominers och söker sig till defensivt (hälsovård, dagligvaror) och energi. Nasdaqs MACD-histogram fördjupas och `^GSPC` har fallit under EMA20. **TSM i dag** är nästa test för AI-hårdvaran efter AMAT:s, MU:s och nu ORCL:s svaghet.

**Energi och geopolitik:** XOM och CVX på 250-dagarshögsta, och bensinindexets +9,1 % i KPI visar att oljepriset slår igenom i inflationen. Ingen oljenivå kan verifieras ur repots filer.

**Krypto:** BTC föll under EMA20 men ligger kvar över EMA50 och MA200. Utan bekräftade ETF-inflöden efter KPI finns ingen kryptospecifik drivkraft. Ett varmt PPI är den största risken på kort sikt.

### Åtgärdspunkter till Dren (L-3)

1. **`news-feed-globenewswire-http-403` – kvarstår, ÅTERKOMMANDE.** I `state/news_feed.json` är `feeds.globenewswire` = `"HTTP 403 – båda försöken (0.0 s)"` och `feeds.globenewswire-earnings` = `"HTTP 403 – båda försöken (0.0 s)"` vid körningen 2026-10-14T23:57:16Z. **Omfång:** 2 av 6 flöden, varav ett är den enda källan som är dedikerad åt rapportöverraskningar. **Ersättningskälla:** websök och SEC 8-K.
2. **`macro-calendar-not-verifiable-from-state` – ÅTERKOMMANDE.** KPI-utfallet, konsensus för PPI och detaljhandel samt Fed-talarnas tider kommer ur websök (BLS, CNBC, TD Economics, investinglive). Talartiderna är inte verifierade mot Fed. **Omfång:** samtliga makrodatum och -värden i rapporten.
3. **`crypto-previousclose-misdated` – ÅTERKOMMANDE.** I `state/prices.json` är `quotes["BTC-USD"].previousClose` = 83 095,13, medan punkten 2026-10-13 i `state/price_history.json` är 83 354,89. För `ETH-USD` är `previousClose` 2 496,63 och punkten 2 508,64. Ingen av punkterna är ett dygnsslut, eftersom punkterna skrivs av nattkörningarna. **Omfång:** 2 av 2 mynt, skillnad 0,31 respektive 0,46 procentenheter i dagsrörelsen. **Ersättningskälla:** `previousClose` i tabellen, med båda måtten redovisade.
4. **`watchlist-cap-vs-measurability-conflict` – ÅTERKOMMANDE.** `config/watchlist_us.txt` har 106 symbolrader mot riktmärket 25. Inga rader stryks, eftersom skydden i `prompts/gemensam_korning.md` går före riktmärket: giltiga kandidater, 20-dagarsutvärdering och rapportbevakning. `BK` saknar fortfarande kurs i `state/prices.json`. Det är en av 3 symboler utan `price` i den smala körningen, tillsammans med `AI-USD` och `NRS.OL`.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
