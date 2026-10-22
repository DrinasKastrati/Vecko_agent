# Daglig Scout: USA & Krypto
**Datum:** 2026-10-22
**Marknadsklimat:** Torsdag morgon före öppning. Onsdagen var en bred uppgång med tech i täten: S&P 500 +0,58 % och Nasdaq +1,05 %. Krypto fortsatte upp (BTC +1,32 %, ETH +1,00 % mot daterad punkt 2026-10-20). Efter stängning gav `META` det AI-capexbesked marknaden väntat på: intäktsslag, höjd Q4-guide och smalare capex-intervall. Aktien stod +2,12 % efterbörs, medan `TSLA` vände ned (−3,32 %) på sänkt capex och en senare Optimus-tidsplan. Utanför bevakningen kom ett bekräftat kontantbud från EQT på `QGEN`. **Aktiva lärdomar tillämpade:** L-3 (åtgärdspunkter sist), L-4 (kontroll av vilande kandidater), L-5 (rapportkalenderns källa och täckning; `QGEN` läggs i watchlist) och L-6 (inga klasser utesluts). L-1, L-2, L-7 och L-8 gäller inte scouten.

## Marknadsöversikt

`git pull` 2026-10-22 05:49 UTC (07:49 CEST) gav `origin/main` = `a91f5b8`. `state/prices.json`: `generatedAt` 2026-10-22T00:00:39.793Z, `schemaVersion` 2026-08-02-prevclose, `tickerCount` 228, `okCount` 226 (smal körning; `wideAt` 2026-10-21T10:05:50Z). Källa: `Yahoo Finance chart API via GitHub Actions`.

| Symbol | Nivå | Senaste rörelse | marketTime |
|---|---|---|---|
| `^GSPC` | 7 757,17 | +0,58 % (7 712,57 → 7 757,17) | 2026-10-21T20:31:21Z |
| `^IXIC` | 26 702,86 | +1,05 % (26 424,82 → 26 702,86) | 2026-10-21T21:15:59Z |
| `BTC-USD` | 84 020,90 | +1,32 % mot daterad punkt 2026-10-20 (82 925,62) | 2026-10-21T23:59:21Z |
| `ETH-USD` | 2 471,39 | +1,00 % mot daterad punkt 2026-10-20 (2 446,90) | 2026-10-21T23:59:37Z |
| `SPY` (sleeve) | 773,09 | +0,53 % (769,05 → 773,09) | 2026-10-21T20:00:00Z |

Indexstängningarna (S&P 7 757,17 och Nasdaq 26 702,86) bekräftas av Yahoo Finance markets live 2026-10-21. Rapportsäsongen bar uppgången, och SpaceX (`SPCX`) steg ~8 % efter sin Q3 (samma källa). `SPCX` hämtas inte och är OKONTROLLERAD.

**Onsdagens största rörelser i den US-bevakade mängden** (`price / previousClose − 1`, `state/prices.json`, 109 US-symboler med marketTime 2026-10-21): upp `SMCI` +9,55 %, `APLD` +8,54 %, `ZS` +7,84 %, `MSTR` +7,54 %, `BE` +7,13 %, `CIEN` +5,67 %, `ILMN` +5,57 %, `NET` +5,32 %, `PLTR` +4,74 %, `CEG` +4,60 %, `IREN` +4,58 %, `MARA` +4,14 %; ned `TLX` −10,13 %, `NFLX` −5,31 %, `PCVX` −4,53 %, `VNDA` −3,84 %, `ACHR` −2,76 %, `CXW` −2,70 %, `PECO` −2,28 %, `ABT` −1,89 %, `GOOGL` −1,62 %. `SMCI` följer upp sin bekräftade preliminära Q1 (case i går, se uppföljning). `NFLX` följer upp den sänkta annonsprognosen. Kryptonamnen (`MSTR`, `IREN`, `MARA`) följer BTC. För `ZS`, `APLD`, `CIEN` och `TLX` hittades ingen daterad bolagshändelse 2026-10-21 (websök gav bara äldre träffar). De är därför inga case.

**Efterbörs 2026-10-21** (`extendedPrice`, `extendedSession: post`, `state/prices.json`): `META` 712,31 (+2,12 % mot stängningen 697,52, 23:59:54Z), `TSLA` 373,63 (−3,32 % mot 386,47, 23:59:57Z), `BE` 234,00 (−1,90 % mot 238,53, 23:59:21Z) och `ABT` 100,50 (−0,01 %, 23:02:29Z). Endast dessa fyra US-symboler bär en utökad kurs. Övriga efterbörsrörelser nedan kommer ur nyhetskällor och är **inte** kursverifierade.

**Teknik** (räknad på råserien i `state/price_history.json`, 250 punkter):
- **`^GSPC`:** 6,5 % över MA200 (7 284,18) ⇒ **regimfiltret för US-boken är fortsatt PÅ**. Åter över EMA20 (7 728,85) och EMA50 (7 684,98). RSI 53,6. MACD-histogrammet krymper tydligt (−10,86 → −7,55), andra förbättringen i rad.
- **`^IXIC`:** strax under EMA20 (26 799,78), över EMA50 (26 610,57) och MA200 (24 967,79). RSI 48,6. Histogrammet krymper (−134,39 → −110,88).
- **`BTC-USD`:** RSI 57,7, över EMA20 (82 510,72), EMA50 (79 542,28) och MA200 (71 862,48). Histogrammet krymper (−465,5 → −310,5).
- **`ETH-USD`:** RSI 46,7, under EMA20 (2 505,54), strax över EMA50 (2 442,79), över MA200 (2 121,80). Histogrammet krymper (−28,1 → −21,6).

**Kryptoflöden:** inga verifierbara ETF-flöden för 2026-10-16 – 2026-10-21 hittades (websök 2026-10-22). **Ingen ny flödessiffra används i dag.**

## Ekonomiska siffror & kalender

**Senaste utfall:**
- **Industriproduktion september +0,7 % m/m mot väntat +0,4 %** (Federal Reserve G.17, 2026-10-16). Fortfarande det senaste större makroutfallet. Veckan saknar KPI, sysselsättningsrapport och FOMC-beslut (Investing.com, veckoförhandsvisning 19–23 oktober).
- 2026-10-21: 20-årsauktionen (13 mdr USD) låg i kalendern. **Utfallet kunde inte verifieras** från körmiljön.
- Fed är i tystnadsperiod inför FOMC 27–28 oktober (Proactive Investors, veckoförhandsvisning).

**Kommande:**
- **Torsdag 2026-10-22 (i dag) 14:30 CEST: initiala arbetslöshetsanspråk.** Investing.com och Trading Economics väntar 200 000, Proactive Investors 206 000. Förra veckan låg på 199 000. `BE` rapporterar (`state/earnings_calendar.json`).
- **Fredag 2026-10-23 15:45 CEST: S&P Global flash-PMI oktober. Det är veckans mest marknadsrörande makropunkt.** Tillverkning väntas 55,5 (förra 55,9). Tjänster väntas 58,0 enligt Investing.com och 57,5 enligt Proactive (förra 58,8). **16:00 CEST** kommer UMich-sentimentet med 1-årsinflationsförväntan väntad 4,7 % (oförändrad, Investing.com). Macrobullseye anger i stället torsdag för UMich, så datumet är inte entydigt.
- **FOMC 27–28 oktober** ligger utanför 5-dagarsfönstret.

**Rapporter nästa 5 handelsdagar** (`state/earnings_calendar.json`, `generatedAt` 2026-10-21T10:04:11Z, `errors` tomt), US-symboler:
- 10-22: `BE`
- 10-26: `PECO`
- 10-27: `BA`, `ITW` och `SKHY` (**gissat datum**, `isEstimate`)
- 10-28: `MSFT`, `GOOGL`, `BIIB`, `AWK`, `AXGN` och `UTHR` (**gissat**)
- 10-29: `AMZN`, `COIN`, `MSTR`, `INTC`, `HII`, `ILMN`, `RDDT` och `SPXC`

**L-5:** kalendern ser bara de symboler `prices.yml` hämtar. Resten av det amerikanska universumet är **OKONTROLLERAT**. `IBM`, `LRCX` och `SPCX` rapporterade 2026-10-21 utan att finnas i filen eller i `state/prices.json`. Alla rapportdatum är bevakningsposter enligt punkt 8, aldrig köpförslag. **`MSFT`/`GOOGL` (28/10) och `AMZN` (29/10) är nästa AI-capex-avläsning.**

## Aktuella händelser & katalysatorer

- **`META`: Q3 2026-10-21 efter stängning (bekräftat, SEC 8-K ex. 99.1 / CNBC / Fortune 2026-10-21).** Intäkten blev **64,6 mdr USD (+26 %) mot väntat 63,3 mdr**. **Q4-guiden är 73–76 mdr USD**, och flera källor anger att den ligger över förväntan. Helårs-capex smalnades till **135–145 mdr USD (från 130–145)**, mot analytikernas ~138 mdr (CNBC). Q3-capex blev 34,9 mdr. Kvartalet bär en **rättslig engångskostnad på 9,89 mdr USD**: rörelsemarginalen blev 20 % (35 % exklusive kostnaden), GAAP-EPS 3,83 USD, och fritt kassaflöde −2,12 mdr USD (Fortune). Kostnadsguiden höjdes till 175–179 mdr, främst för rättskostnader. Bolaget aviserade samtidigt en ny röstlös aktieklass C (StockTitan). Efterbörs 712,31 (+2,12 %, `state/prices.json`, 2026-10-21T23:59:54Z).
- **`TSLA`: Q3 2026-10-21 efter stängning (bekräftat, Electrek / Investing.com / CNBC 2026-10-21).** Justerad EPS blev 0,48 USD mot ~0,45, och intäkten ~28,05 mdr USD (oförändrad å/å). Rörelseresultatet föll 56 % till 718 MUSD, eftersom AI- och robotkostnaderna steg 39 %. Fritt kassaflöde blev +1,53 mdr mot väntat underskott. Capex-guiden för helåret sänktes till ~20 mdr USD, och Optimus-tidsplanen sköts fram. Efterbörs 373,63 (−3,32 %, `state/prices.json`, 2026-10-21T23:59:57Z). Stängningen 386,47 ligger på MA200 (386,94). **Negativ reaktion och ett binärt besked – inget case.**
- **`QGEN` (QIAGEN, NYSE): rekommenderat kontantbud från EQT, 2026-10-21 (bekräftat, pressmeddelande via PR Newswire 22:46 UTC, posten ligger i `state/news_feed.json`; Business Wire / StockTitan / Investing.com 2026-10-21).** Budet är **46,50 EUR per aktie kontant**, en premie på 40,3 % mot den opåverkade XETRA-kursen 33,15 EUR (2026-07-08). Företagsvärdet är ~10,8 mdr EUR. Båda styrelserna stöder enhälligt. Budgivare är Crown NL Bidco med ADIA och CPP Investments som saminvesterare. Villkoren är minst 50 % + 1 aktie accepterat, extrastämma och regulatoriska godkännanden, och acceptfristen öppnar först efter BaFin-godkännande. Stängning väntas mitten av 2027. Se Case 2.
  ⚠️ RYKTE – EJ BEKRÄFTAT (Bloomberg via Reuters, 2026-10-20): KKR ska också ha lagt ett bud. Den uppgiften används inte som underlag.
- **`IBM`: Q3 2026-10-21 efter stängning (bekräftat, IBM Newsroom + SEC 8-K 2026-10-21).** Intäkten blev 17,1 mdr USD (+5 %, +6 % i fast valuta) mot väntat 16,82 mdr. Mjukvaran växte +8 % (+9 % i fast valuta) och Red Hat +11 %. Operativ EPS blev 2,95 mot 2,86. Helårsguiden för intäkter behölls, och FCF-guiden höjdes. **Efterbörsreaktionen rapporteras motsägelsefullt** (+6 % enligt en källa, −5,1 % till 238,60 enligt Investing.com). `IBM` hämtas inte, så reaktionen är **KURS EJ VERIFIERAD**. Inget case utan entydig reaktion.
- **`state/news_feed.json`** (`generatedAt` 2026-10-22T00:01:28Z) täcker **9 av 10 handelsdagar** (2026-10-08 – 2026-10-21). `missingDays` är bara 2026-10-22, dagen som ännu inte börjat. Feeden har 90 poster för 2026-10-21, bland annat EQT/QIAGEN (ovan), Cognizant–DyFlex-förvärv (23:25 UTC), Bose–Skullcandy (20:30 UTC), Wyndham Q3 (20:30 UTC) samt 8-K från Bank of America, FMC och Liberty Energy (20:46–21:30 UTC). Utöver `QGEN` gav inget av detta en handlingsbar koppling.

## Uppföljning av tidigare case

Den senaste tidigare scout-rapporten (rapport-261021) hade två case. Båda avgjordes av US-boken i `us-daglig-261021.md`:
- **`SMCI` (rapport-261021): 32,47 (pre-event-stängning 2026-10-20) → 35,57 (+9,55 %, `state/prices.json`, marketTime 2026-10-21T20:00:00Z) – tes INTAKT.** Beskedet bar en reaktion på 2,45× 20-dagarsvolymen (81,9 M mot 33,4 M, `state/volume_history.json`). Kursen ligger nu 9,4 % över MA200 (32,52) men fortfarande under EMA20 (37,76) och EMA50 (37,55). RSI 43,4, och histogrammet krymper (−1,41 → −1,12). Kandidaten `261021-SMCI` avvisades på grind 2 (teknik, omdömesskäl), vilket kursläget fortfarande stöder.
- **`COF` (rapport-261021): KURS EJ VERIFIERAD då (pre-event-stängning 201,56, marketTime 2026-10-20) → 206,66 (+2,53 %, `state/prices.json`, marketTime 2026-10-21T20:00:02Z) – tes INTAKT.** Volymen var 1,74× snittet, och kursen ligger över EMA20 (200,42), EMA50 (203,22) och MA200 (202,64). RSI 58,6, och histogrammet stiger (+1,10 → +1,45). Watchlist-raden från i går fungerade: `COF` har nu 250 punkter i `state/price_history.json`. Kandidaten `261021-COF` avvisades på grind 5 (nåbarhet, omdömesskäl).

**Kandidatkön (`state/scout_candidates.json`):** 84 poster före körningen (79 `rejected`, 5 `promoted`, **inga `new`**). I dag läggs två nya `new`-poster till (se Dagens case).

**L-4-kontroll:** inga avvisade poster inom sin `expiresAt` vilar på en tillfällig datalucka. `261021-SMCI` (grind 2, teknik), `261021-COF` (grind 5, nåbarhet), `261016-USB` och `261017-CRGY` avvisades alla av omdömesskäl. L-4 är uppfylld.

**Innehav:** US-boken har inga aktieinnehav. `SPY` ligger på 100 % (`state/portfolj_us.md`). `state/alerts.json` har inga aktiva signaler (`checkedAt` 2026-10-21T21:17:48Z).

## Dagens case

### Case 1: Meta Platforms (META / NASDAQ)
**Katalysator:** Q3 2026, publicerad **2026-10-21 efter stängning** (SEC 8-K ex. 99.1, CNBC och Fortune 2026-10-21). Intäkten blev **64,6 mdr USD (+26 %) mot väntat 63,3 mdr**, och **Q4-guiden är 73–76 mdr USD**. Capex-intervallet för helåret smalnades till 135–145 mdr USD med höjd nederkant. Efter förra veckans oro kring finansieringen av AI-utbyggnaden var det här det mest väntade beskedet i AI-kedjan. **Bekräftat utfall (`confirmed: true`), inget rykte.**
**Bull case:** En intäktstillväxt på 26 % på den här skalan, plus en Q4-guide över förväntan, visar att annonsmotorn bär capex-cykeln. Rörelsemarginalen exklusive rättskostnaden var 35 %. Ett smalare capex-intervall, mot oron för obegränsad utbyggnad, minskar osäkerheten i värderingen. Det är dessutom en positiv läsning för AI-kedjan inför `MSFT`/`GOOGL` 28/10 och `AMZN` 29/10.
**Bear case:** Det fria kassaflödet var **negativt (−2,12 mdr USD)**, och kostnadsguiden höjdes till 175–179 mdr. Rättskostnaden på 9,89 mdr kan följas av fler. GAAP-EPS 3,83 USD är inte jämförbar med konsensus 5,75 enligt CNBC. Den nya röstlösa aktieklassen C kan läsas negativt ur ett styrningsperspektiv. Efterbörsrörelsen krympte från ~+6 % till ~+2 %, ett tecken på att marknaden är kluven. Kursen ligger kvar strax under EMA20.
**Setup:** Post-event-kurs **712,31 USD** (`state/prices.json`, `extendedSession: post`, extendedTime 2026-10-21T23:59:54Z, Yahoo Finance chart API). Kursen är en efterbörskurs, så ett eventuellt köp kan bara bli en villkorad plan mot reguljär session. Reguljär stängning före rapporten var 697,52 (marketTime 2026-10-21T20:00:01Z). Teknik på serien (250 punkter, till och med 2026-10-21): stängningen ligger 10,3 % över MA200 (632,62) och över EMA50 (681,28), men under EMA20 (714,14). Efterbörskursen ligger 0,3 % under EMA20. RSI 47,4, och MACD-histogrammet är fortfarande negativt (−8,99 → −9,41). Volymen 2026-10-21 var 26,5 M mot 20-dagarssnittet 19,4 M (1,37×, `state/volume_history.json`). Grind 2 är därför inte given, och det avgör US-boken. Nyckeltal (P/E, EV/EBITDA) kunde inte verifieras från körmiljön.

### Case 2: QIAGEN (QGEN / NYSE)
**Katalysator:** Rekommenderat, offentligt kontantbud från EQT Private Equity på **46,50 EUR per aktie**, annonserat **2026-10-21 kl. 22:46 UTC** (efter stängning i både Frankfurt och New York). Källor: QIAGEN/EQT-pressmeddelande via PR Newswire och Business Wire 2026-10-21, StockTitan och Investing.com 2026-10-21. Premien är 40,3 % mot den opåverkade kursen, och företagsvärdet ~10,8 mdr EUR. Båda styrelserna rekommenderar enhälligt budet. **Bekräftat avtal (`confirmed: true`).** Bloomberg rapporterade 2026-10-20 att även KKR har lagt ett bud. ⚠️ RYKTE – EJ BEKRÄFTAT (Bloomberg via Reuters, 2026-10-20). Uppgiften ingår inte i tesen.
**Bull case:** Budet är bindande och styrelsestött, så nedsidan begränsas av ett kontantgolv. En dokumenterad konkurrerande budgivare (om KKR-uppgiften stämmer) ger en möjlig höjning. Aktien har legat på rykten sedan juli, så det mesta av premien kan redan vara prisad, men spreaden mot budet ger en avkastning som är okorrelerad med AI-handeln.
**Bear case:** Uppsidan är **taklagd** till budet, i **EUR**. En USD-investerare bär valutarisken mot en fast EUR-likvid. Stängningen väntas först **mitten av 2027**, alltså långt bortom katalysatorhorisonten på 10–15 handelsdagar. Avtalet kräver 50 % + 1 accept, extrastämma, BaFin och konkurrensgodkännanden. Bryts avtalet faller kursen tillbaka mot den opåverkade nivån. **Det här är en arbitrageposition, inte ett tillväxtcase.** Det är skälet att posten främst ska avgöras och mätas, inte köpas.
**Setup:** **KURS EJ VERIFIERAD.** `QGEN` saknas i `state/prices.json` (`generatedAt` 2026-10-22T00:00:39Z) och i `state/price_history.json`. Den senaste kurs som funnits är dessutom från före beskedet. **`QGEN` läggs i `config/watchlist_us.txt` i dag** så att kurs och serie hämtas. Kandidaten skrivs med `price: null` och kan avfärdas men aldrig köpas utan verifierad kurs. Teknik, volym och spread mot budet kan inte beräknas förrän serien finns, så nyckeltal och prisåtgärd saknas.

## Makro- & sektorfaktorer att bevaka

**AI-handeln tillbaka i täten:** onsdagen vände tisdagens rotation från tech till värde. Nasdaq +1,05 %, halvledare och AI-infrastruktur steg (`SMCI`, `NVDA` +2,54 %, `APLD`, `CIEN`, `CEG`), medan `GOOGL` föll −1,62 %. S&P har återtagit EMA20 och histogrammet krymper för andra dagen. **För `META`-caset är det medvind,** men efterbörsrörelsen krympte, och `MSFT`/`GOOGL`/`AMZN` nästa vecka avgör om capex-beskeden tas emot som efterfrågan eller som kostnad. `TSLA`:s sänkta capex är en motsatt signal från ett enskilt bolag.

**Räntor och makro:** fredagens flash-PMI och UMich-inflationsförväntningar (4,7 % väntat) är veckans makrotest. Tjänste-PMI väntas sjunka från 58,8. Marknaden prissätter paus vid FOMC 27–28 oktober. **För `QGEN`:** ränteläget påverkar finansieringen av EQT:s bud marginellt, men stängningsrisken är regulatorisk, inte makro.

**Krypto:** BTC har nu legat över EMA20 två dagar i rad, och histogrammet krymper. Kryptoaktier förstärker (`MSTR` +7,54 %, `IREN` +4,58 %, `MARA` +4,14 %). Inga verifierade ETF-flöden. `COIN` och `MSTR` rapporterar 29/10 (`state/earnings_calendar.json`), vilket är bevakning och aldrig ett köp in i rapporten (punkt 8). MSCI-beslutet om `MSTR` väntas 2026-11-11 (The Block 2026-10-15). Krypto saknar fortfarande en egen bekräftad katalysator, så det blir inget kryptocase i dag.

### Åtgärdspunkter till Dren (L-3)

1. **`news-feed-globenewswire-http-403` – kvarstår, ÅTERKOMMANDE.** `feeds.globenewswire` = `"HTTP 403 – båda försöken (0.1 s)"` och `feeds.globenewswire-earnings` = `"HTTP 403 – båda försöken (0.0 s)"` (`state/news_feed.json`, 2026-10-22T00:01:28Z). **Omfång:** 2 av 6 flöden. **Ersättningskälla:** websök/SEC EDGAR.
2. **`macro-calendar-not-verifiable-from-state` – ÅTERKOMMANDE.** Makrokalendern, konsensus och kryptoflöden kommer ur websök. Konsensus för arbetslöshetsanspråk (200 000 mot 206 000) och tjänste-PMI (58,0 mot 57,5) skiljer sig mellan källorna, och UMich-datumet är inte entydigt. 20-årsauktionen 2026-10-21 gick inte att verifiera. Bolagsutfallen (META, TSLA, IBM, QGEN) är verifierade via sökresultatens återgivning av 8-K och pressmeddelanden, inte via direktläsning. **Omfång:** samtliga makrodatum och -värden samt fyra bolagsutfall.
3. **`crypto-previousclose-misdated` – ÅTERKOMMANDE.** `quotes["BTC-USD"].previousClose` är 82 941,00, medan den daterade punkten 2026-10-20 i `state/price_history.json` är 82 925,62. För `ETH-USD` är det 2 446,73 mot 2 446,90. **Omfång:** 2 av 2 mynt. **Ersättningskälla:** den daterade punkten, som används i tabellen.
4. **`watchlist-cap-vs-measurability-conflict` – ÅTERKOMMANDE.** `config/watchlist_us.txt` har 112 symbolrader före dagens tillägg, långt fler än riktmärket 25. Inga rader stryks, eftersom skydden i `prompts/gemensam_korning.md` går före riktmärket. En rad (`QGEN`) läggs till. 2 av 228 symboler i `state/prices.json` saknar `price` (`BK`, `NRS.OL`); `BK` är den enda US-symbolen.
5. **`us-earnings-movers-not-priced` – ÅTERKOMMANDE (andra dagen).** `IBM`, `LRCX` och `SPCX` rapporterade 2026-10-21 och saknas i `state/prices.json` och `state/earnings_calendar.json`. IBM:s efterbörsreaktion kunde därför inte avgöras (+6 % mot −5,1 % i olika källor). Gårdagens åtgärd (`COF` i watchlist) gav en full serie inom ett dygn, så mekanismen fungerar men är reaktiv. **Omfång:** 3 symboler 2026-10-21 (4 symboler 2026-10-20).
6. **`^VIX` hämtas inte – kvarstår.** **Omfång:** 1 symbol.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
