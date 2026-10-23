# Daglig Scout: USA & Krypto
**Datum:** 2026-10-23
**Marknadsklimat:** Fredag morgon före öppning. Torsdagen var tydligt risk-av. Nasdaq föll −2,60 % och S&P 500 −1,21 %, och halvledarindexet SOX föll 6,3 %, den brantaste dagsnedgången sedan början av juni. Utlösaren var att `META` vände från efterbörsuppgång till −6,98 % på oro för finansieringen av AI-capex. Kapitalet roterade till defensiva namn (`P&G`, `JNJ`, `HD`, `KHC`, `AWK`), och krypto följde risken ned (BTC −3,24 %, ETH −3,46 %). **Aktiva lärdomar tillämpade:** L-3 (åtgärdspunkter sist), L-4 (kontroll av vilande kandidater), L-5 (rapportkalenderns källa och täckning; `PG` och `BX` läggs i watchlist) och L-6 (inga klasser utesluts). L-1, L-2, L-7 och L-8 gäller inte scouten.

## Marknadsöversikt

`git pull` 2026-10-23 05:50 UTC (07:50 CEST) gav `origin/main` = `2a4b1a1`. `state/prices.json`: `generatedAt` 2026-10-22T23:59:37Z, `schemaVersion` 2026-08-02-prevclose, `tickerCount` 229, `okCount` 227 (smal körning; `wideAt` 2026-10-22T10:07:20Z). Källa: `Yahoo Finance chart API via GitHub Actions`.

| Symbol | Nivå | Senaste rörelse | marketTime |
|---|---|---|---|
| `^GSPC` | 7 663,43 | −1,21 % (7 757,17 → 7 663,43) | 2026-10-22T20:31:48Z |
| `^IXIC` | 26 008,86 | −2,60 % (26 702,86 → 26 008,86) | 2026-10-22T21:15:59Z |
| `BTC-USD` | 81 301,68 | −3,24 % mot daterad punkt 2026-10-21 (84 020,90) | 2026-10-22T23:58:17Z |
| `ETH-USD` | 2 385,94 | −3,46 % mot daterad punkt 2026-10-21 (2 471,39) | 2026-10-22T23:58:31Z |
| `SPY` (sleeve) | 763,96 | −1,18 % (773,09 → 763,96) | 2026-10-22T20:00:00Z |

Stängningarna (S&P 7 663,43 och Nasdaq 26 008,86) bekräftas av Investing.com och Yahoo Finance markets live 2026-10-22. Dow föll −0,20 % till 52 749,70 (samma källor; `^DJI` hämtas inte).

**Torsdagens största rörelser i den US-bevakade mängden** (`price / previousClose − 1`, `state/prices.json`, 105 US-symboler med marketTime 2026-10-22, 107 US-symboler totalt): upp `ACN` +7,69 %, `KHC` +6,77 %, `AWK` +6,29 %, `BIIB` +5,34 %, `COO` +4,54 %, `PAYC` +4,44 %, `HD` +4,33 %, `LOW` +3,97 %, `JNJ` +3,81 %, `UTHR` +3,78 %, `TGT` +3,76 %, `NFLX` +3,09 %, `PEP` +3,07 %; ned `CIEN` −10,71 %, `VST` −9,81 %, `APLD` −9,01 %, `BE` −8,70 %, `MRVL` −8,70 %, `AESI` −8,41 %, `IREN` −8,37 %, `AMAT` −8,16 %, `AMD` −8,10 %, `SKHY` −8,07 %, `RIOT` −8,06 %, `INTC` −8,04 %. Mönstret är en rotation mellan sektorer, inte bolagsnyheter. Hela AI-kedjan (chips, optik, kraft, AI-compute-miners) föll samtidigt, medan konsument- och hälsovårdsnamn steg. `ACN` steg på 1,04× normal volym utan någon daterad bolagshändelse (websök gav bara insiderförsäljningar under 10b5-1-planer och en äldre kursmålshöjning). `ACN` blir därför inget case, och RSI 81,4 ligger dessutom över taket. `WBD` (marketTime 2026-10-05) och `BK` (saknar `price`) ingår inte.

**Efterbörs 2026-10-22** (`extendedPrice`, `extendedSession: post`, `state/prices.json`): `BE` 202,50 (−7,01 % mot stängningen 217,77, 23:58:11Z) och `PECO` 38,23 (−0,16 %, 22:28:43Z). Endast dessa två US-symboler bär en utökad kurs. Enligt nyhetskällor föll `WDC` −7,9 %, `DECK` −8,2 %, `SSNC` −4,4 % och `VRSN` ~−5 % efter stängning (CNBC/Chartmill/Investing.com 2026-10-22). Ingen av dem hämtas, så rörelserna är **inte** kursverifierade.

**Teknik** (räknad på råserien i `state/price_history.json`, 250 punkter till och med 2026-10-22):
- **`^GSPC`:** 5,2 % över MA200 (7 287,77) ⇒ **regimfiltret för US-boken är fortsatt PÅ**. Kursen föll under EMA20 (7 722,62) och EMA50 (7 684,14). RSI 45,2. MACD-histogrammet vände ned igen (−7,55 → −11,24) efter två dagars förbättring.
- **`^IXIC`:** under EMA20 (26 724,46) och EMA50 (26 586,98), 4,1 % över MA200 (24 980,10). RSI 38,7. Histogrammet fördjupas (−110,88 → −135,44).
- **`BTC-USD`:** under EMA20 (82 395,57), över EMA50 (79 611,36) och MA200 (71 914,42). RSI 47,8. Histogrammet fördjupas (−310,5 → −379,4). Det bryter gårdagens bild av två dagar över EMA20.
- **`ETH-USD`:** under EMA20 (2 494,15) och EMA50 (2 440,56), över MA200 (2 122,97). RSI 40,0. Histogrammet är oförändrat (−21,55 → −21,75).

**Kryptoflöden:** de senaste verifierbara flödena gäller bitcoin-ETF:er, med +527 MUSD 2026-10-19 och +23 MUSD 2026-10-20. Oktober totalt ligger på ~−67 MUSD. Ether-ETF:er har −1,08 mdr USD hittills i oktober, årets största månadsutflöde (Cointelegraph 2026-10-21). **Inga flöden för 2026-10-21–22 hittades.**

## Ekonomiska siffror & kalender

**Senaste utfall:**
- **Initiala arbetslöshetsanspråk, veckan till 17 oktober: 194 000 mot väntat 200 000** (Labor Department 2026-10-22, via Reuters/UPI/Seoul Economic Daily). Det är en tremånaderslägsta. Föregående vecka reviderades till 200 000, och fyraveckorssnittet blev 197 750. Pågående anspråk steg 25 000 till 1,73 miljoner, den högsta nivån på sex veckor. Bilden är en stabil arbetsmarknad, och den syntes inte i aktiehandeln.
- **Industriproduktion september +0,7 % m/m mot väntat +0,4 %** (Federal Reserve G.17, 2026-10-16).
- Fed är i tystnadsperiod inför FOMC 27–28 oktober. Bloomberg (2026-10-22) skriver att teknikraset och risken i Mellanöstern drev investerare till obligationer, och att marknaden minskade bettingen på **ytterligare en räntehöjning** 2026.

**Kommande:**
- **I dag fredag 2026-10-23, 15:45 CEST: S&P Global flash-PMI oktober. Det är veckans mest marknadsrörande makropunkt.** Tillverkning väntas 55,5 (förra 55,9). Tjänster väntas 58,0 enligt Investing.com och 57,5 enligt Proactive (förra 58,8). **16:00 CEST:** UMich-sentimentet, med 1-årsinflationsförväntan väntad 4,7 % (Investing.com, veckoförhandsvisning). Källorna är från i onsdags och inte omverifierade i dag.
- **FOMC 27–28 oktober** ligger inom 5-dagarsfönstret räknat i handelsdagar (beslut onsdag 28/10).

**Rapporter nästa 5 handelsdagar** (`state/earnings_calendar.json`, `generatedAt` 2026-10-22T10:05:41Z, `errors` tomt), US-symboler:
- 10-26: `PECO`
- 10-27: `BA`, `ITW` och `SKHY`
- 10-28: `MSFT`, `GOOGL`, `BIIB`, `AWK`, `AXGN` och `VNDA`
- 10-29: `AMZN`, `COIN`, `MSTR`, `INTC`, `HII`, `ILMN`, `RDDT` och `SPXC`
- 10-30: `XOM` och `CVX`

**L-5:** kalendern ser bara de symboler `prices.yml` hämtar. Resten av det amerikanska universumet är **OKONTROLLERAT**. `WDC`, `SSNC`, `NEM`, `DECK`, `VRSN`, `PG`, `BX` och `LUV` rapporterade 2026-10-22 utan att finnas i filen eller i `state/prices.json`. Alla rapportdatum är bevakningsposter enligt punkt 8, aldrig köpförslag. **`MSFT`/`GOOGL` (28/10, samma dag som FOMC-beskedet) och `AMZN` (29/10) är nu den avgörande AI-capex-avläsningen.** Efter torsdagens reaktion på `META` prissätts capex-beskeden som kostnad, inte som efterfrågan.

## Aktuella händelser & katalysatorer

- **AI-handeln vände nedåt 2026-10-22 (bekräftat, Investing.com / GV Wire / StockTitan / Yahoo Finance 2026-10-22).** `META` gick från +2,12 % efterbörs till −6,98 % i den reguljära sessionen (648,85, `state/prices.json`, 2026-10-22T20:00:01Z). Volymen var 2,11× 20-dagarssnittet (40,5 M mot 19,2 M, `state/volume_history.json`). Marknaden fäste sig vid bolagets första negativa fria kassaflöde på över ett decennium och vid hur mycket finansiering AI-utbyggnaden kräver (Wells Fargo-handlare via Investing.com). SOX föll 6,3 %, och enligt StockTitan stod AI- och chipaktier för 93 % av Nasdaq-100:s värdetapp. En nedgradering av CoreWeave nämns som ytterligare press (Yahoo Finance midday, 2026-10-22).
- **`PG` (Procter & Gamble): FQ1 FY27 2026-10-22 före öppning (bekräftat, SEC 8-K ex. 99.1 + presentation 2026-10-22).** Nettoförsäljningen blev 23,3 mdr USD (+4 %), den organiska försäljningen +4 % (volym +2,4 p, mix +1,1 p, pris +0,4 p) och core EPS 2,00 USD (+1 %). Helårsguiden för organisk tillväxt och EPS är oförändrad. Aktien steg ~6 % efter att ha slagit på både intäkt och vinst (CNBC midday movers 2026-10-22). Se Case 1.
- **`BX` (Blackstone): Q3 2026 2026-10-22 (bekräftat, SEC 8-K ex. 99.1).** Segmentens utdelningsbara resultat blev ~1,9 mdr USD (LTM 8,6 mdr), och real estate-realiseringarna 7,0 mdr. Torrt krut uppgår till 228,9 mdr. Vinsten slog förväntan, och aktien steg ~6 % (CNBC midday movers 2026-10-22). Se Case 2.
- **Efterbörs 2026-10-22, AI-hårdvara (CNBC / Chartmill 2026-10-22):** `WDC` slog förväntan (justerad EPS 4,64 mot 4,09) men föll ändå −6,43 % i sessionen och ytterligare −7,9 % efterbörs. `BE` rapporterade rekordkvartal och höjde helårsguiden, men föll −7,01 % efterbörs (verifierat, se ovan). **Starka siffror säljs i AI-kedjan – inget case.**
- **`SSNC`: Q3 2026-10-22 16:05 ET (bekräftat, SEC 8-K / SS&C IR).** Justerad intäkt 1 691 MUSD (+7,8 %), justerad EPS 1,78 (+14,8 %), utdelningen höjd 11 %. En svagare organisk Q4-guide (4,0 % mot 5,2 %) gav ~−4,4 % efterbörs (Investing.com). Inget case.
- **Olja:** Brent ska ha legat över 111 USD/fat under torsdagen på oro för kriget med Iran (en källa, Investing.com 2026-10-22). Uppgiften är inte verifierad mot prices.json. `XOM` och `CVX` rapporterar 30/10.
- **`state/news_feed.json`** (`generatedAt` 2026-10-23T00:00:01Z) täcker **9 av 10 handelsdagar** (2026-10-12 – 2026-10-22). `missingDays` är bara 2026-10-23, dagen som ännu inte börjat. Feeden har 90 poster för 2026-10-22, bland annat Cboe (höjt återköp), Mueller Water (återköp + utdelning +14,3 %), Boston Beer Q3 samt 8-K från Citigroup, Brown & Brown och RingCentral. Ingen av dem gav en handlingsbar koppling. `PG`-, `BX`- och `WDC`-beskeden finns inte i feeden; de hittades via websök.

## Uppföljning av tidigare case

Den senaste tidigare scout-rapporten (rapport-261022) hade två case. Båda avgjordes av US-boken i `us-daglig-261022.md`:
- **`META` (rapport-261022): 712,31 (efterbörs, 2026-10-21T23:59:54Z) → 648,85 (−8,91 %, `state/prices.json`, marketTime 2026-10-22T20:00:01Z) – tes PUNKTERAD.** Tesen var att annonsmotorn bär capex-cykeln. Marknaden läste i stället det negativa fria kassaflödet som huvudbudskapet, och efterbörsuppgången vändes till en dagsnedgång på 2,11× normal volym. Kursen ligger under EMA20 (707,92) och EMA50 (680,01), bara 2,6 % över MA200 (632,56). RSI 36,8, och histogrammet fördjupas (−9,41 → −12,47). US-bokens avvisning på grind 2 (`261022-META`, förbörs 678,21 under EMA20) höll.
- **`QGEN` (rapport-261022): KURS EJ VERIFIERAD då → 50,22 (+0,44 % mot föregående stängning 50,00, `state/prices.json`, marketTime 2026-10-22T20:00:02Z) – tes INTAKT.** Kursen låste sig mot budet som väntat för ett arbitragecase. Volymen var 13,0× 20-dagarssnittet (40,8 M mot 3,1 M). Watchlist-raden fungerade: `QGEN` har nu 250 punkter i `state/price_history.json`. Spreaden mot budet 46,50 EUR kan inte räknas, eftersom EUR/USD inte hämtas. Avvisningen på grind 5 (`261022-QGEN`, uppsidan taklagd) håller.

**Kandidatkön (`state/scout_candidates.json`):** 86 poster före körningen (81 `rejected`, 5 `promoted`, **inga `new`**). I dag läggs två nya `new`-poster till (se Dagens case).

**L-4-kontroll:** ingen avvisad post inom sin `expiresAt` vilar på en tillfällig datalucka. `261022-META` (grind 2, teknik), `261022-QGEN` (grind 5, nåbarhet), `261021-SMCI` (grind 2), `261021-COF` (grind 5) och `261017-CRGY` (grind 3/2, löper ut i dag) avvisades alla av omdömesskäl. L-4 är uppfylld.

**Innehav:** US-boken har inga aktieinnehav. `SPY` ligger på 100 % (`state/portfolj_us.md`), 763,96 (−1,20 % mot entry 773,26). `state/alerts.json` har inga aktiva signaler (`checkedAt` 2026-10-22T21:14:01Z).

## Dagens case

### Case 1: Procter & Gamble (PG / NYSE)
**Katalysator:** Rapport för första kvartalet FY27, publicerad **2026-10-22 före öppning** (SEC 8-K ex. 99.1 och presentation 2026-10-22). Nettoförsäljningen blev 23,3 mdr USD (+4 %), och den organiska tillväxten +4 % bars av **volym (+2,4 p)**, inte pris (+0,4 p). Core EPS blev 2,00 USD (+1 %). Aktien steg ~6 % på en dag då S&P 500 föll −1,21 % (CNBC midday movers 2026-10-22). **Bekräftat utfall (`confirmed: true`), inget rykte.**
**Bull case:** Volymdriven organisk tillväxt på 4 % ligger klart över bolagets helårsguide på 1–3 %. Det tyder på att guiden är konservativ inför kommande kvartal. Ett fritt kassaflöde på 93 % och 3,9 mdr USD i återföring på ett kvartal ger stöd. I en marknad som roterar ut ur AI-capex är P&G en naturlig mottagare av kapitalet: låg beta och mekaniska utdelningsflöden.
**Bear case:** Vinsten per aktie växte bara 1 % (i fast valuta oförändrad), och **helårsguiden för EPS behölls**. Bolaget varnar dessutom för att kostnadsmotvinden ökar de närmaste kvartalen. En rörelse på 6 % i en defensiv storbolagsaktie på ett ensamt kvartal kan vara rotationsflöde snarare än omvärdering. Den riskerar att vända när AI-handeln återhämtar sig. Förvärvet av Thorne justerar intäktsguiden, och de nya siffrorna kunde inte verifieras. Ett målavstånd på 14 % inom 15–25 dagar är svårt för en aktie med låg volatilitet (grind 5).
**Setup:** **KURS EJ VERIFIERAD.** `PG` saknas i `state/prices.json` (`generatedAt` 2026-10-22T23:59:37Z) och i `state/price_history.json`. Rörelsen på ~6 % kommer ur en nyhetskälla och används inte som kurs. **`PG` läggs i `config/watchlist_us.txt` i dag** så att kurs och serie hämtas. Kandidaten skrivs med `price: null` och kan avfärdas men aldrig köpas utan verifierad kurs. Teknik, volym och nyckeltal (P/E, EV/EBITDA) kan inte beräknas eller verifieras förrän serien finns.

### Case 2: Blackstone (BX / NYSE)
**Katalysator:** Rapport för tredje kvartalet 2026, publicerad **2026-10-22** (SEC 8-K ex. 99.1). Segmentens utdelningsbara resultat blev ~1,9 mdr USD (LTM 8,6 mdr). Real estate deployerade 6,1 mdr och realiserade 7,0 mdr, och torrt krut uppgår till 228,9 mdr USD. Den resultatberättigande AUM (performance eligible) steg 8 % å/å till 662,8 mdr. Vinsten slog förväntan, och aktien steg ~6 % mot en fallande marknad (CNBC midday movers 2026-10-22). **Bekräftat utfall (`confirmed: true`).**
**Bull case:** Realiseringar på 7,0 mdr USD bara i real estate visar att exitfönstret är öppet. Det är den variabel som styr resultatavgifter och utdelningsbara resultat. Med 228,9 mdr i torrt krut kan Blackstone köpa in sig om AI-raset sprider sig till bredare tillgångsvärden. Rörelsen skedde mot marknaden, vilket tyder på en bolagsspecifik omvärdering snarare än betaflöde.
**Bear case:** Utdelningsbara resultat per aktie och konsensusjämförelsen kunde inte verifieras – "slog förväntan" kommer ur en enda nyhetskälla. Resultatavgifter är cykliska, och en räntehöjningsrisk (Bloomberg nämner den, om än minskande) slår mot fastighetsvärden och exitvolym. Private equity/credit-sektorn är känslig för kreditoro, och aktien är högbeta mot S&P.
**Setup:** **KURS EJ VERIFIERAD.** `BX` saknas i `state/prices.json` (`generatedAt` 2026-10-22T23:59:37Z) och i `state/price_history.json`. **`BX` läggs i `config/watchlist_us.txt` i dag.** Kandidaten skrivs med `price: null` och kan avfärdas men aldrig köpas utan verifierad kurs. Teknik, volym och nyckeltal kan inte beräknas eller verifieras förrän serien finns.

## Makro- & sektorfaktorer att bevaka

**Rotation ut ur AI:** torsdagens nedgång var den första riktiga motreaktionen mot capex-tesen under rapportsäsongen. `META`, `WDC` och `BE` slog alla förväntan och föll ändå kraftigt, och optik (`CIEN` −10,71 %), kraft (`VST` −9,81 %, `BE`) och AI-compute-miners (`APLD`, `IREN`) föll mer än chipsen. Det är ett mönster där goda nyheter säljs – **en dålig miljö för nya AI-case, och skälet att inget AI-namn föreslås i dag.** Pengarna gick till defensiva sektorer (`PG`, `JNJ`, `HD`, `KHC`, `AWK`, `PEP`), vilket är medvind för Case 1 men kan vända lika snabbt. `MSFT`/`GOOGL` på onsdag är nästa avgörande test.

**Räntor och makro:** arbetslöshetsanspråken på 194 000 bekräftar en stark arbetsmarknad. Flykten till obligationer drog ändå ned förväntningarna på en räntehöjning. Dagens flash-PMI och UMich-inflationsförväntningar (4,7 % väntat) avgör om räntemotvinden kommer tillbaka. FOMC-beskedet kommer 28/10. Oljan (Brent över 111 USD/fat enligt en källa, kriget med Iran) är en inflationsrisk som talar emot sänkningar och för energi.

**Krypto:** BTC föll tillbaka under EMA20, och histogrammet fördjupas. Kryptoaktierna förstärkte nedgången (`RIOT` −8,06 %, `IREN` −8,37 %, `MSTR` −5,00 %, `COIN` −4,51 %), eftersom miners också handlas som AI-compute. Ether-ETF:er har haft årets största månadsutflöde. `COIN` och `MSTR` rapporterar 29/10 (`state/earnings_calendar.json`), vilket är bevakning och aldrig ett köp in i rapporten (punkt 8). **Krypto saknar en egen bekräftad katalysator och följer just nu risken nedåt, så det blir inget kryptocase i dag.**

### Åtgärdspunkter till Dren (L-3)

1. **`news-feed-globenewswire-http-403` – kvarstår, ÅTERKOMMANDE.** `feeds.globenewswire` = `"HTTP 403 – båda försöken (0.0 s)"` och `feeds.globenewswire-earnings` = `"HTTP 403 – båda försöken (0.0 s)"` (`state/news_feed.json`, 2026-10-23T00:00:01Z). **Omfång:** 2 av 6 flöden. Dagens tre starkaste bolagshändelser (`PG`, `BX`, `WDC`) saknades i feeden. **Ersättningskälla:** websök/SEC EDGAR.
2. **`macro-calendar-not-verifiable-from-state` – ÅTERKOMMANDE.** Makrokalendern, konsensus, kryptoflöden och oljepriset kommer ur websök. Konsensus för tjänste-PMI skiljer sig (58,0 mot 57,5), och Brent-uppgiften (> 111 USD) har bara en källa. Bolagsutfallen (PG, BX, WDC, SSNC) är verifierade via sökresultatens återgivning av 8-K, inte via direktläsning (WebFetch nådde inte cnbc.com/finance.yahoo.com från körmiljön: `getaddrinfo ENOTFOUND`). **Omfång:** samtliga makrodatum och -värden samt fyra bolagsutfall.
3. **`crypto-previousclose-misdated` – ÅTERKOMMANDE.** `quotes["BTC-USD"].previousClose` är 84 011,97, medan den daterade punkten 2026-10-21 i `state/price_history.json` är 84 020,90. För `ETH-USD` är det 2 470,77 mot 2 471,39. **Omfång:** 2 av 2 mynt. **Ersättningskälla:** den daterade punkten, som används i tabellen.
4. **`watchlist-cap-vs-measurability-conflict` – ÅTERKOMMANDE.** `config/watchlist_us.txt` har 113 symbolrader före dagens tillägg, långt fler än riktmärket 25. Inga rader stryks, eftersom skydden i `prompts/gemensam_korning.md` går före riktmärket. Två rader (`PG`, `BX`) läggs till. 2 av 229 symboler i `state/prices.json` saknar `price` (`BK`, `NRS.OL`); `BK` är den enda US-symbolen. `WBD` har en inaktuell `marketTime` (2026-10-05).
5. **`us-earnings-movers-not-priced` – ÅTERKOMMANDE (tredje dagen).** Åtta symboler som rapporterade 2026-10-22 (`PG`, `BX`, `WDC`, `SSNC`, `NEM`, `DECK`, `VRSN`, `LUV`) saknas i `state/prices.json` och `state/earnings_calendar.json`. Båda dagens case fick därför `price: null`. Watchlist-raden från i går (`QGEN`) gav en full serie inom ett dygn, så mekanismen fungerar men är reaktiv. **Omfång:** 8 symboler 2026-10-22 (3 symboler 2026-10-21, 4 symboler 2026-10-20).
6. **`^VIX` hämtas inte – kvarstår.** På en dag med −2,6 % i Nasdaq saknas volatilitetsmåttet helt. **Omfång:** 1 symbol.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
