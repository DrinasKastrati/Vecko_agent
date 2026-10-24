# Daglig Scout: USA & Krypto
**Datum:** 2026-10-24
**Marknadsklimat:** Det är lördag och de amerikanska börserna är stängda, så rapporten bygger på fredagens session 2026-10-23. Fredagen var risk-av med rotation inom tekniken. `^GSPC` föll −0,52 % och `^IXIC` −0,21 %, medan Dow föll −1,23 % när de defensiva vinnarna från torsdagen gav tillbaka. Cybersäkerhet och moln steg kraftigt (`ZS` +7,31 %, `NET` +7,29 %, `S` +6,67 %). Brent steg 3,14 % till 116,72 USD/fat, och krypto rörde sig knappt (BTC −0,30 %, ETH −0,13 %). **Aktiva lärdomar tillämpade:** L-3 (åtgärdspunkter sist), L-4 (kontroll av vilande kandidater), L-5 (rapportkalenderns källa och täckning; `ROP` och `RHI` läggs i watchlist) och L-6 (inga klasser utesluts). L-1, L-2, L-7 och L-8 gäller inte scouten.

## Marknadsöversikt

`git pull` 2026-10-24 05:48 UTC (07:48 CEST) gav `origin/main` = `4273f58` (`Nyheter: 2026-10-23 23:52 UTC`). `state/prices.json` har `generatedAt` **2026-10-23T23:51:52Z**, `schemaVersion` **2026-08-02-prevclose**, `tickerCount` 231 och `okCount` 229. Det är en smal körning; `wideAt` står på 2026-10-23T10:01:55Z. Källa: `Yahoo Finance chart API via GitHub Actions`.

| Symbol | Nivå | Rörelse fredag | Vecka (mot 2026-10-16) | marketTime |
|---|---|---|---|---|
| `^GSPC` | 7 623,68 | −0,52 % (7 663,43 → 7 623,68) | −0,47 % | 2026-10-23T20:38:20Z |
| `^IXIC` | 25 955,34 | −0,21 % (26 008,86 → 25 955,34) | −0,71 % | 2026-10-23T21:15:59Z |
| `BTC-USD` | 81 058,34 | −0,30 % mot daterad punkt 2026-10-22 (81 301,68) | −0,58 % | 2026-10-23T23:50:44Z |
| `ETH-USD` | 2 382,85 | −0,13 % mot daterad punkt 2026-10-22 (2 385,94) | −1,51 % | 2026-10-23T23:50:55Z |
| `SPY` (sleeve) | 759,97 | −0,52 % (763,96 → 759,97) | −0,43 % | 2026-10-23T20:00:00Z |

Stängningarna för S&P 500 och Nasdaq bekräftas av Reuters via Lufkin Daily News 2026-10-23. Dow föll 652,82 punkter eller 1,23 % till 52 215,16, men steg 0,4 % på veckan, sin tredje veckouppgång i rad (samma källa; `^DJI` hämtas inte). Veckokolumnen är räknad ur daterade stängningar i `state/price_history.json`. Kryptots `previousClose` (BTC 81 311,89, ETH 2 386,19) stämmer fortfarande inte med de daterade punkterna, se åtgärdspunkt 3.

**Teknik** (räknad på råserien i `state/price_history.json`, 250 punkter till och med 2026-10-23):
- **`^GSPC`:** 4,6 % över MA200 (7 291,29) ⇒ **regimfiltret för US-boken är fortsatt PÅ**. Kursen ligger under EMA20 (7 713,20) och EMA50 (7 681,77). RSI 42,2, och MACD-histogrammet fördjupas för andra dagen (−11,24 → −15,66). Volymen var 0,92× 20-dagarssnittet.
- **`^IXIC`:** under EMA20 (26 651,21) och EMA50 (26 562,23), 3,9 % över MA200 (24 991,95). RSI 38,0. Histogrammet fördjupas (−135,44 → −147,67).
- **`BTC-USD`:** under EMA20 (82 268,21), över EMA50 (79 667,96) och MA200 (71 967,12). RSI 47,0. Histogrammet fördjupas (−379,4 → −426,2).
- **`ETH-USD`:** under EMA20 (2 483,55) och EMA50 (2 438,29), över MA200 (2 124,11). RSI 39,8. Histogrammet förbättras marginellt (−21,75 → −20,83).

**Kryptoflöden:** de senaste verifierbara flödena gäller bitcoin-ETF:er, med netto ~+527 MUSD 2026-10-19, varav `IBIT` +665 MUSD, det största dagsinflödet sedan oktober 2025 (The Block 2026-10-20, SoSoValue). För 2026-10-21 skiljer sig uppgifterna om `IBIT` (+29,9 MUSD respektive +235 MUSD, TipRanks mot Benzinga/Farside). Ether-ETF:erna har fortsatt utflöden (Benzinga 2026-10). **Inga flöden för 2026-10-22–23 hittades.**

## Ekonomiska siffror & kalender

**Senaste utfall, fredag 2026-10-23:**
- **S&P Global flash-PMI oktober:** tillverkning **56,0 mot väntat 55,5** (förra 55,9), tjänster **57,9 mot väntat 58,0** (förra 58,8), sammanvägt 57,6 (förra 58,4). Tillverkningen överraskade positivt och tjänsterna låg i linje. Ingen av dem gav något räntebesked (Reuters via Lufkin Daily News 2026-10-23).
- **UMich-sentimentet, slutligt oktober: 48,0 mot väntat 46,3** (preliminärt 46,3, september 48,1). **Ettårs inflationsförväntan blev 4,7 %**, i linje med det väntade (samma källa; preliminär nivå enligt Trading Economics 2026-10). Ett starkare sentiment med oförändrade inflationsförväntningar tar inte bort räntemotvinden.
- Torsdagens arbetslöshetsanspråk (194 000 mot väntat 200 000) står i rapport-261023.

**Kommande** (källa: websök, ingen fil i repot – se åtgärdspunkt 2):
- **FOMC 27–28 oktober, beslut onsdag 2026-10-28. Det är veckans mest marknadsrörande punkt.** Fed är i tystnadsperiod. Den 16/10 handlades sannolikheten för en höjning till ~17 % (CNBC 2026-10-16); inget nyare mått är verifierat. Oljan över 116 USD/fat talar emot en duvaktig signal.
- De datum och konsensusvärden som gäller veckans övriga releaser (Conference Board-förtroende, BNP Q3 preliminärt, PCE) kunde inte verifieras i dag och anges därför inte.

**Rapporter nästa 5 handelsdagar** (`state/earnings_calendar.json`, `generatedAt` 2026-10-23T10:00:01Z, `errors` tomt), US-symboler:
- 10-26: `PECO`
- 10-27: `BA`, `ITW` och `SKHY`
- 10-28: `MSFT`, `GOOGL`, `BIIB`, `AWK`, `AXGN` och `VNDA`
- 10-29: `AMZN`, `COIN`, `MSTR`, `INTC`, `HII`, `ILMN`, `RDDT` och `SPXC`
- 10-30: `XOM` och `CVX`

**L-5:** kalendern ser bara de symboler `prices.yml` hämtar. Resten av det amerikanska universumet är **OKONTROLLERAT**. `ROP`, `RHI`, `RNG`, `AXP` och `GNTX` rapporterade 2026-10-22–23 utan att finnas i filen eller i `state/prices.json`. Samtliga bolag i listan ovan finns redan i `config/watchlist_us.txt`, så inga rader läggs till av kalenderskäl. Alla rapportdatum är bevakningsposter enligt punkt 8, aldrig köpförslag. **`MSFT`/`GOOGL` rapporterar samma dag som FOMC-beskedet (28/10), och `AMZN` dagen efter. Det blir veckans test av om capex prissätts som kostnad eller som efterfrågan.**

## Aktuella händelser & katalysatorer

- **Cybersäkerhet och moln steg mot marknaden 2026-10-23 (bekräftat, flera källor).** En kanalundersökning från Evercore pekade på starkare säkerhetsbudgetar. Deutsche Bank skrev att säkerhetsbolagen kan gynnas av ökad AI-tokenanvändning, och en allvarlig PHP-sårbarhet som störde europeiska myndighetssajter lade till köptryck (Yahoo Finance; TradingKey; 24/7 Wall St. 2026-10-23). Bevakade namn (`state/prices.json`, marketTime ~2026-10-23T20:00Z): **`ZS` 255,15 (+7,31 %, 1,38× volym)**, `NET` 325,73 (+7,29 %, 1,41×) och `S` 24,00 (+6,67 %, 1,60×). `CRWD` och `PANW` steg 6–7 % enligt nyhetskällorna, men de hämtas inte och är därför **inte** kursverifierade. **Inget case:** rörelsen är sektorbred och bygger på en enkät, inte på ett bolagsspecifikt utfall. `ZS`:s senaste bolagsbesked är investerardagen 2026-10-06 (SEC 8-K, bekräftad Q1/FY27-guide, ARR-mål > 8 mdr USD till FY31), alltså 13 handelsdagar gammal. `ZS` har dessutom RSI 72,0 och +23,0 % på veckan, 53,7 % över MA200.
- **`ROP` (Roper Technologies): Q3 2026 2026-10-22 före öppning (bekräftat, 8-K / bolagets pressmeddelande).** Justerad EPS blev 5,89 mot väntat 5,79, och intäkten 2,17 mdr USD (i linje, organiskt +7 %). Helårsguiden för justerad EPS höjdes till 22,35–22,40 från 22,15–22,30. Aktien steg 9–10 % medan Nasdaq-100 föll mer än 2 % (Seeking Alpha; TIKR 2026-10-22). Se Case 1.
- **`RHI` (Robert Half): Q3 2026 2026-10-22 efter stängning (bekräftat, SEC 8-K ex. 99.1 / PR Newswire).** Intäkten blev 1,359 mdr USD (konsensus 1,371), EPS 0,49 mot väntat ~0,47. Talent Solutions växte 2 % justerat, den första årstillväxten sedan 2022. Q4-guiden är intäkt 1,285–1,385 mdr och EPS 0,36–0,46. Aktien steg enligt GuruFocus ~22 % till 45,87 på fredagen 2026-10-23; TheStreet angav +13,2 % intradag. Uppgifterna skiljer sig och används inte som kurs. Se Case 2.
- **`RNG` (RingCentral):** Q3 slog förväntan och helårsguiden höjdes. Aktien steg 6,64 % (TheStreet 2026-10-23). Inget case, eftersom `RNG` inte hämtas och rörelsen halverades från förbörs (+14,95 %).
- **`BE` (Bloom Energy):** föll −11,24 % till 193,30 på 2,54× volym (`state/prices.json`, 2026-10-23T20:00Z) trots rekordkvartal och höjd guide, på oro för kassaflöde och capex (TheStreet 2026-10-23). Kursen ligger nu 11,9 % under MA200. Starka siffror säljs fortsatt i AI-kraftkedjan.
- **Olja:** Brent stängde på 116,72 USD/fat (+3,14 %) på oro för kriget med Iran (Reuters via Lufkin Daily News 2026-10-23). Oljenivån kan inte verifieras ur repots filer. `XOM` steg till 183,21 (+2,79 %, RSI 76,1), `CVX` +2,88 %, `DVN` +4,49 % och `RIG` +5,43 % (`state/prices.json`). `XOM`/`CVX` rapporterar 30/10 och `RIG` 2/11, så de är bevakningsposter enligt punkt 8.
- **`state/news_feed.json`** (`generatedAt` 2026-10-23T23:52:21Z) täcker **10 av 10 handelsdagar** (2026-10-12 – 2026-10-23, `missingDays` tomt). Det finns 90 poster för 2026-10-23. Ingen av de bekräftade katalysatorerna ovan (`ROP`, `RHI`, `RNG`) finns i feeden; de hittades via websök. **`globenewswire` och `globenewswire-earnings` svarar fortfarande HTTP 403** (åtgärdspunkt 1), så den delen av pressmeddelandeflödet är **OKONTROLLERAD**.
- Inga rykten används i dag.

## Uppföljning av tidigare case

Den senaste tidigare scout-rapporten (rapport-261023) hade två case. Båda avgjordes av US-boken i `us-daglig-261023.md`:
- **`PG` (rapport-261023): KURS EJ VERIFIERAD då → 161,02 (−2,76 % mot torsdagens stängning 165,59, `state/prices.json`, marketTime 2026-10-23T20:01:38Z) – tes INTAKT.** Watchlist-raden fungerade: `PG` har nu 250 punkter i `state/price_history.json`. Rapportrörelsen var +5,58 % (156,84 → 165,59), och fredagen gav tillbaka ungefär hälften på normal volym (0,99×) när de defensiva namnen föll med Dow. Kursen ligger över EMA20 (154,54), EMA50 (150,48) och MA200 (148,51). RSI 63,6, och histogrammet är positivt men planar ut (1,18 → 1,01). Avvisningen på grind 5 (`261023-PG`, nåbarhetstaket 10,3 % under målbandet 14–18 %) är ett omdömesskäl och håller.
- **`BX` (rapport-261023): KURS EJ VERIFIERAD då → 117,97 (−0,66 % mot 118,75, `state/prices.json`, marketTime 2026-10-23T20:02:45Z) – tes INTAKT.** Rapportrörelsen var +8,38 % (109,57 → 118,75), och den höll på fredagen på 1,22× volym. Kursen ligger över EMA20 (114,10) men under EMA50 (120,12) och **5,7 % under MA200 (125,10)**. RSI 53,5, och histogrammet stiger (1,15 → 1,52). Avvisningen på grind 2 (`261023-BX`, kurs under MA200) håller.

**Kandidatkön (`state/scout_candidates.json`):** 88 poster före körningen (83 `rejected`, 5 `promoted`, **inga `new`**). I dag läggs två nya `new`-poster till (se Dagens case).

**L-4-kontroll:** ingen avvisad post inom sin `expiresAt` vilar på en tillfällig datalucka. `261023-PG` (grind 5, nåbarhet), `261023-BX` (grind 2, teknik), `261022-QGEN` (grind 5) och `261022-META` (grind 2) avvisades alla av omdömesskäl. L-4 är uppfylld.

**Innehav:** US-boken har inga aktieinnehav. `SPY` ligger på 100 % (`state/portfolj_us.md`), 759,97 (−1,72 % mot entry 773,26). `state/alerts.json` har inga aktiva signaler (`checkedAt` 2026-10-23T21:02:47Z).

## Dagens case

### Case 1: Roper Technologies (ROP / NASDAQ)
**Katalysator:** Rapport för tredje kvartalet 2026, publicerad **2026-10-22 före öppning** (8-K och pressmeddelande "Roper Technologies Announces Third Quarter Financial Results", 2026-10-22). Justerad EPS blev 5,89 USD mot väntat 5,79, och intäkten 2,17 mdr USD i linje med förväntan (+8 %, organiskt +7 %). **Helårsguiden för justerad EPS höjdes till 22,35–22,40 USD från 22,15–22,30.** Aktien steg 9–10 % på en dag då Nasdaq-100 föll mer än 2 % (Seeking Alpha 2026-10-22; TIKR 2026-10-22). **Bekräftat utfall (`confirmed: true`), inget rykte.**
**Bull case:** Roper är en samling vertikala mjukvarubolag med hög andel återkommande intäkter, och marknaden har straffat mjukvara som AI-förlorare. En höjd guide och "AI momentum" i samtalet (Yahoo Finance/GuruFocus 2026-10-22) motsäger den tesen för just det här bolaget. Rörelsen skedde mot en kraftigt fallande Nasdaq, vilket tyder på en bolagsspecifik omvärdering snarare än betaflöde.
**Bear case:** Kvaliteten i överraskningen är tunn. Intäkten låg bara i linje, och justerat nettoresultat växte 5 % medan justerad EPS växte 15 % – skillnaden kommer ur ett mindre aktieantal, alltså återköp (Chartmill 2026-10-22). Guidehöjningen är 0,6 % i mitten. Källorna är oeniga om rörelsen; Chartmill beskrev en svag reaktion före öppning. En storbolagsaktie med låg volatilitet når svårt målbandet för `earnings` inom horisonten (grind 5).
**Setup:** **KURS EJ VERIFIERAD.** `ROP` saknas i `state/prices.json` (`generatedAt` 2026-10-23T23:51:52Z) och i `state/price_history.json`. Rörelsen på 9–10 % kommer ur nyhetskällor och används inte som kurs. **`ROP` läggs i `config/watchlist_us.txt` i dag** så att kurs och serie hämtas. Kandidaten skrivs med `price: null` och kan avfärdas men aldrig köpas utan verifierad kurs. Teknik, volym och nyckeltal (P/E, EV/EBITDA) kan inte beräknas eller verifieras förrän serien finns.

### Case 2: Robert Half (RHI / NYSE)
**Katalysator:** Rapport för tredje kvartalet 2026, publicerad **2026-10-22 efter stängning** (SEC 8-K ex. 99.1; PR Newswire "Robert Half Reports Third-Quarter Financial Results", 2026-10-22). Intäkten blev 1,359 mdr USD mot konsensus 1,371 mdr, och EPS 0,49 USD mot väntat ~0,47. **Talent Solutions växte 2 % justerat, den första årstillväxten sedan 2022**, medan Protiviti föll 3 %. Q4-guiden är intäkt 1,285–1,385 mdr USD och EPS 0,36–0,46, vilket i mitten motsvarar +3 % i justerad intäktstillväxt och +30 % i EPS-tillväxt (Yahoo Finance; Benzinga-transkript; StockTitan 2026-10-22). **Bekräftat utfall (`confirmed: true`).**
**Bull case:** Bemanning är en tidig cyklisk indikator, och en vändning till tillväxt efter tre års nedgång i kärnsegmentet är en möjlig bottensignal. Arbetslöshetsanspråken på en tremånaderslägsta (194 000) och tillverknings-PMI 56,0 stöder en starkare efterfrågan på arbetskraft. En rörelse på 13–22 % på en dag då Dow föll −1,23 % tyder på att marknaden var positionerad för fortsatt nedgång och tvingades täcka.
**Bear case:** Intäkten missade konsensus, och Protiviti krymper fortfarande. AI hotar strukturellt efterfrågan på tillfällig kontorspersonal, vilket är skälet till att aktien varit svag. Bolaget lyfte själv fram att utdelningen är hållbar (GuruFocus 2026-10-22), vilket marknaden kan läsa som en signal om att den har varit ifrågasatt. En rörelse av den storleken på en blandad rapport kan vara blankningstäckning som ebbar ut. Källorna är oeniga om storleken (+13,2 % intradag enligt TheStreet, +22 % i stängningen enligt GuruFocus).
**Setup:** **KURS EJ VERIFIERAD.** `RHI` saknas i `state/prices.json` (`generatedAt` 2026-10-23T23:51:52Z) och i `state/price_history.json`. Stängningen 45,87 är en nyhetskälla och används inte som kurs. **`RHI` läggs i `config/watchlist_us.txt` i dag.** Kandidaten skrivs med `price: null` och kan avfärdas men aldrig köpas utan verifierad kurs. Teknik, volym och nyckeltal kan inte beräknas eller verifieras förrän serien finns.

## Makro- & sektorfaktorer att bevaka

**Rotation inom tekniken:** fredagen var inte en återhämtning utan en omfördelning. Mjukvara och säkerhet (`ZS`, `NET`, `S`) steg medan AI-kraft och kryptominers fortsatte ned (`BE` −11,24 %, `APLD` −4,40 %, `CLSK` −3,31 %, `MARA` −3,17 %). Halvledarna stabiliserades (`MU` +2,46 %, `MRVL` +2,26 %, `SKHY` +4,05 %). Marknaden belönar för närvarande bolag som tjänar på AI utan att bära dess capex. Det är medvind för Case 1, men rotationen har pågått i två dagar och är inte belagd som trend. **`MSFT`/`GOOGL` (28/10) och `AMZN` (29/10) avgör om den håller.**

**Räntor och olja:** Brent på 116,72 USD/fat är veckans tydligaste makrorisk. Den höjer inflationsrisken inför FOMC 28/10 samtidigt som UMich-förväntningarna ligger på 4,7 %. En starkare tillverknings-PMI (56,0) och låga arbetslöshetsanspråk ger Fed inget skäl att lätta. Det är motvind för tillväxtaktier och medvind för energi. Energinamnen rapporterar dock in i fönstret och kan inte köpas in i rapporten (punkt 8). `XOM` har RSI 76,1, vilket är överköpt.

**Krypto:** BTC och ETH rörde sig knappt på fredagen och ligger under EMA20, men över MA200, med fördjupat histogram för BTC. Bitcoin-ETF:erna hade inflöde tidigt i veckan, men inga flöden för 22–23/10 hittades. `COIN` och `MSTR` rapporterar 29/10, vilket är bevakning och aldrig ett köp in i rapporten (punkt 8). **Krypto saknar en egen bekräftad katalysator, så det blir inget kryptocase i dag.**

### Åtgärdspunkter till Dren (L-3)

1. **`news-feed-globenewswire-http-403` – kvarstår, ÅTERKOMMANDE.** `feeds.globenewswire` = `"HTTP 403 – båda försöken (0.1 s)"` och `feeds.globenewswire-earnings` = `"HTTP 403 – båda försöken (0.1 s)"` (`state/news_feed.json`, 2026-10-23T23:52:21Z). **Omfång:** 2 av 6 flöden. Dagens tre bekräftade bolagshändelser (`ROP`, `RHI`, `RNG`) saknades i feeden. **Ersättningskälla:** websök/SEC EDGAR.
2. **`macro-calendar-not-verifiable-from-state` – ÅTERKOMMANDE.** Makroutfallen, konsensus, kryptoflöden och oljepriset kommer ur websök. Datum och konsensus för nästa veckas övriga releaser (förtroende, BNP, PCE) kunde inte verifieras och utelämnas. Kryptoflödena för 21/10 är motsägelsefulla mellan två källor. Bolagsutfallen (`ROP`, `RHI`) är verifierade via sökresultatens återgivning av 8-K, inte via direktläsning. **Omfång:** samtliga makrodatum och -värden samt två bolagsutfall.
3. **`crypto-previousclose-misdated` – ÅTERKOMMANDE.** `quotes["BTC-USD"].previousClose` är 81 311,89, medan den daterade punkten 2026-10-22 i `state/price_history.json` är 81 301,68. För `ETH-USD` är det 2 386,19 mot 2 385,94. **Omfång:** 2 av 2 mynt. **Ersättningskälla:** den daterade punkten, som används i tabellen.
4. **`watchlist-cap-vs-measurability-conflict` – ÅTERKOMMANDE.** `config/watchlist_us.txt` har 115 symbolrader före dagens tillägg, långt fler än riktmärket 25. Inga rader stryks, eftersom skydden i `prompts/gemensam_korning.md` går före riktmärket. Två rader (`ROP`, `RHI`) läggs till. 2 av 231 symboler i `state/prices.json` saknar `price` (`BK`, `NRS.OL`); `BK` är den enda US-symbolen.
5. **`us-earnings-movers-not-priced` – ÅTERKOMMANDE (fjärde dagen).** Fem symboler som rapporterade 2026-10-22–23 (`ROP`, `RHI`, `RNG`, `AXP`, `GNTX`) saknas i `state/prices.json` och `state/earnings_calendar.json`, och detsamma gäller `CRWD` och `PANW` i dagens sektorrörelse. Båda dagens case fick därför `price: null`. Gårdagens watchlist-rader (`PG`, `BX`) gav fulla serier inom ett dygn, så mekanismen fungerar men är reaktiv. **Omfång:** 5 rapportsymboler 2026-10-22–23 (8 symboler 2026-10-22, 3 symboler 2026-10-21, 4 symboler 2026-10-20).
6. **`^VIX` hämtas inte – kvarstår.** Volatilitetsmåttet saknas helt inför FOMC-veckan. **Omfång:** 1 symbol.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
