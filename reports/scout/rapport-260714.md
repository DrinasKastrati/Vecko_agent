# Daglig Scout: USA & Krypto
**Datum:** 2026-07-14
<<<<<<< HEAD
**Marknadsklimat:** Nervös avvaktan inför dagens "dubbelsmäll" kl 08:30 ET: juni-CPI och fem storbankers Q2-rapporter landar samtidigt, med Fed-chefen Warsh i kongressförhör en timme senare. Geopolitiken fortsätter dominera – Hormuz-blockaden (20 % tull) träder formellt i kraft kl 16:00 ET idag och oljan steg vidare till en-månadshögsta. Krypto handlas i "Extreme Fear" med BTC strax över 62k inför CPI.

> ⚠️ **DATANOT:** `state/prices.json` (generatedAt **2026-07-13T23:56 UTC**) har färska US-stängningskurser
> (marketTime 20:00 UTC = måndagens close) – dessa används nedan. MEN kryptoposterna (BTC-USD,
> ETH-USD, SOL-USD) bär en gammal marketTime (**2026-07-13T02:11 UTC**, >24h) och interna
> inkonsistenser (price under dayLow) → kryptonivåer tas i stället från reservkällor med angiven
> tidsstämpel, enligt scoutprompt-reglerna. JPM/GS/TSM (dagens case) saknas i feeden → tillagda i
> `config/watchlist_us.txt` och hämtas till nästa körning.

## Marknadsöversikt
Måndagens stängning (13 juli), nivåer ur `state/prices.json` där de finns:

- **S&P 500 (^GSPC):** **7 515,34** (marketTime 21:19 UTC). Dagsfall **−0,79 %** enligt media; prices.json:s prevClose-referens ger −0,29 %. Källa: prices.json + CNBC "Stock market news for July 13, 2026" (2026-07-13).
- **Nasdaq Composite (^IXIC):** **25 873,18**, **−1,55 %** (marketTime 21:15 UTC) – tech ledde nedgången för andra dagen. Källa: prices.json + CNBC (2026-07-13). Dow stängde −0,26 % på 52 498,64 (CNBC, ej i prices.json).
- **BTC-USD:** ca **62 475 USD, −2,0 % senaste 24h** (Coingabbar 2026-07-14); Schwab noterade 62 700 (−2,16 %) måndag 09:11 ET. prices.json-posten är föråldrad (02:11 UTC 13/7) → reservkälla används. BTC är nu ned ~50 % från oktober-toppen (~1,2 biljon USD i börsvärde raderat; Schwab 2026-07-13).
- **ETH-USD:** ca **1 737 USD, −2,9 % senaste 24h** (Coingabbar/InvestingNews 2026-07-14). prices.json-posten (1 799; 02:11 UTC 13/7) föråldrad → reservkälla. Sentimentet: "Extreme Fear"; global kryptomcap 2,23 biljoner USD, −1,5 % 24h (Coingabbar 2026-07-14).

Övriga måndagsrörelser ur prices.json (marketTime 20:00 UTC) som färgar dagen: **XOM +5,9 %** (144,51) och **CVX +8,4 %** (182,20) på oljespiken; **META +9,4 %** (656,73) på Meta Compute-pivoten; **NVDA +4,1 %** (203,53); minne fortsatt svagt: **MU −4,9 %** (937,00), **SKHY −10,4 %** (152,35, dag två efter debuten); kryptoaktier pressade: **MSTR −8,6 %** (92,10), **COIN −6,8 %** (157,37), **RIOT −11,7 %** (20,19), **MARA −5,9 %** (12,19); **TSLA −6,0 %** (394,76), **GOOGL −3,8 %** (352,51).

## Ekonomiska siffror & kalender
**Senaste utfall:** NY Fed:s inflationsförväntningar (survey, publ. juni-data): 1-årsförväntan **3,7 %** – högsta sedan september 2023; 3-årsförväntan 3,3 % (Kiplinger/IndexBox 2026-07). TSM lämnade i går ett förhandsbesked: Q2-intäkter **+36 % YoY**, varav juni **+68 % YoY** (Schwab Market Update 2026-07-13) – stark AI-efterfrågesignal.

**Kommande releaser (1–5 dagar), tider ET:**
- **Idag tis 14/7 08:30 – CPI & Kärn-CPI (juni).** ⭐ **MEST MARKNADSRÖRANDE.** Konsensus: headline **−0,1 % m/m** (ned från +0,5 %) → **~3,9 % YoY** (från 4,2 %), draget av junis ~10 %-fall i bensinpriset. **Kärn-CPI +0,2 % m/m, ~2,9 % YoY** – tjänste-/bostadsinflationen fortsatt sticky. Fed-hökvarning: CME FedWatch prisade i går **33 % sannolikhet för HÖJNING 25 bp i juli (FOMC 29/7) och 69 % i september** – en het kärnsiffra idag kan cementera det (Schwab/SCFR 2026-07-13; Investing.com 2026-07-14).
- **Idag tis 14/7 ~09:30 – Fed-chef Kevin Warsh, halvårsförhör** i representanthusets finansutskott – första kommentarerna EFTER CPI (Schwab 2026-07-13).
- **Idag tis 14/7 före öppning – Q2-rapporter: JPM, BAC, GS, WFC, C** (se Dagens case 1).
- **Ons 15/7 – PPI (juni) + Fed Beige Book;** rapporter: ASML, MS, BLK, JNJ (Schwab-kalendern 2026-07-13).
- **Tors 16/7 – Detaljhandel (juni);** rapporter: **TSM (full Q2)**, NFLX, GE, UNH. **Fre 17/7 –** husbyggnadsstart/bygglov + industriproduktion (Schwab 2026-07-13).
- **Nyans (upprepas från i går):** juni-CPI är bakåtblickande och gynnas av det *gamla* bensinfallet – medan Hormuz-eskaleringen höjer inflationsrisken *framåt*. En mjuk headline idag kan alltså snabbt "dateras".

## Aktuella händelser & katalysatorer
- **Hormuz-blockaden träder i kraft idag 16:00 ET (14 juli):** Efter helgens eskalering – Iran attackerade US-anläggningar i flera Gulfländer och förklarade sundet stängt; USA slog mot 140 mål i Iran – återinför Trump blockaden med **20 % tull på all last**. Vapenvilan från 17 juni är över. Källor: Schwab Market Update (2026-07-13), CNBC (2026-07-14), Axios (2026-07-13).
- **Oljan på en-månadshögsta (14 juli):** WTI aug **79,57 USD/fat (+1,8 %)**, Brent sep **84,72 (+1,7 %)** i tisdagshandeln, efter måndagens Brent-spik ~+9,5 % över 83 USD. Källor: CNBC "Oil extends gains…" (2026-07-14), Al Jazeera (2026-07-14).
- **Q2-säsongen sparkar igång idag (14 juli):** JPM, BAC, GS, WFC och C rapporterar samtliga före öppning, samtidigt som CPI släpps – ovanlig "double print". FactSet väntar **+24 % YoY** vinsttillväxt för S&P 500, men >60 % för info-tech och under 10 % i sex av elva sektorer → smal vinstbredd. Källor: TechTimes (2026-07-13), Schwab (2026-07-13).
- **TSM-förhandsbesked (13 juli):** Q2-intäkter +36 % YoY (juni +68 %) före full rapport på torsdag – barometer för hyperscaler-AI-efterfrågan tillsammans med ASML på onsdag. Källa: Schwab Market Update (2026-07-13).
- **SK Hynix-debuten vacklar (10–13 juli):** Nasdaq-noteringen (SKHY, tillfälligt SKHYV; ~1 biljon USD mcap) steg +13 % på fredagen men föll −10,4 % i måndags (prices.json 20:00 UTC) när Seoul-handeln vek; minnesnamn (MU, SNDK) drogs med. Källor: Schwab (2026-07-13), prices.json.
- **Krypto i "Extreme Fear" inför CPI (14 juli):** BTC −50 % från oktobertoppen; proxyaktierna (MSTR, COIN, RIOT, MARA) föll 6–12 % i måndags. Källor: Schwab "Has bitcoin's bear market passed the pain test?" (2026-07-13), Coingabbar (2026-07-14), prices.json.

## Dagens case
### Case 1: Storbanker – JPMorgan & Goldman Sachs (JPM, GS / NYSE)
**Katalysator:** Q2-rapporter IDAG före öppning (14 juli), i en ovanlig kollision med CPI 08:30 ET. Konsensus: JPM EPS ~5,44–5,61 USD (**~+10 % YoY**) på starka tradingintäkter och återhämtad IB-aktivitet; GS EPS ~**14,47 USD (+32 % YoY)** på "blockbuster" trading/advisory. Optionsmarknaden prisar ±6,0 % rörelse i GS och ±4,4 % i JPM. Källor: TipRanks earnings preview (2026-07-13), Intellectia/StocksAnalyzer Q2-preview (2026-07-13), American Bazaar (2026-07-13).
**Bull case:** Dealmaking- och tradingcykeln har vänt upp samtidigt som räntenettot hålls uppe av högre-längre-räntor; JPM levererade ROTCE 23 % redan i Q1 (EPS 5,94, +8 % över estimat). Slår bankerna även denna gång och guidar stabilt om kreditkvalitet blir det ett kvitto på att konsument/ekonomi tål räntetrycket – bränsle för hela finanssektorn, en av årets eftersläntrare relativt tech.
**Bear case:** Volatil makrodag: en het kärn-CPI eller hökaktig Warsh kan dränka även fina siffror ("sälj på guidance"). Eskalerande Hormuz-läge → oljedriven inflation → höjningsrisk (33 %/69 % juli/sep) pressar kreditutsikter och deal-pipeline. Buy-side "whisper numbers" ligger över konsensus – att bara "slå estimaten" räcker inte alltid (Schwab/Sonders 2026-07-13).
**Setup:** **KURS EJ VERIFIERAD** – JPM/GS saknas i dagens `prices.json` (tillagda i watchlist inför nästa körning; hämtas även automatiskt ur denna rapport). Nyckeltal ovan ur previews. Trigger: rapporterna + CPI 08:30 ET idag; utfall syns i morgondagens feed. Bevaka om GS infriar +32 %-ribban och JPM:s NII-guidning.

### Case 2: Taiwan Semiconductor (TSM / NYSE, ADR)
**Katalysator:** Eget förhandsbesked (13 juli): Q2-intäkter **+36 % YoY**, med juni ensamt **+68 % YoY** – publicerat före full rapport **torsdag 16 juli**. Tillsammans med ASML (ons) veckans viktigaste AI-efterfrågedata. Källa: Schwab Market Update (2026-07-13).
**Bull case:** Siffrorna indikerar att hyperscaler-capex (inkl. Metas 14 GW-"Meta Compute"-satsning och Iris-chips, som TSM sannolikt tillverkar) fortsatt accelererar. TSM är flaskhalsen i hela AI-kedjan med prissättningsmakt i ledande noder; ett starkt torsdagsbesked kan återtända halvledarsektorn efter minnes-svackan (SOX ~10 % under junitopparna → utrymme upp).
**Bear case:** Förhandsbeskedet är redan känt → "sell the news"-risk på torsdag om marginal-/guidningsdetaljer inte imponerar (info-tech bär >60 % vinsttillväxt-förväntan = hög ribba). Geopolitisk dubbelexponering: Taiwan-risk + Hormuz-driven riskoff. Stark TWD och minnescykelns svaghet (SK Hynix/MU-signalerna) kan smitta sentimentet.
**Setup:** **KURS EJ VERIFIERAD** – TSM saknas i dagens `prices.json` (tillagd i watchlist; hämtas till nästa körning). Referens: SOX stängde över 50-dagarssnittet två dagar i rad men ligger ~10 % under junitoppen (Schwab 2026-07-13). Trigger: ASML ons → TSM full rapport tors 16/7.

### Case 3: Bitcoin (BTC-USD / krypto) – CPI-dagen avgör studs eller nytt ben ned
**Katalysator:** IDAG är själva eventdagen som gårdagens BTC-case pekade mot: juni-CPI 08:30 ET. BTC handlas ~**62 475 USD (−2,0 % 24h;** Coingabbar 2026-07-14), i "Extreme Fear", −50 % från oktobertoppen med ~1,2 biljon USD mcap raderat (Schwab 2026-07-13). Fed-hike-odds 33 % (juli)/69 % (sep) är den omedelbara motorn åt båda håll.
**Bull case:** Mjuk headline (~3,9 % väntat, negativ m/m) + lugnande Warsh kan lätta höjningsförväntningarna → snabb relief-studs i den mest nedpressade risktillgången. Kapitulationssignaler finns (proxyaktier −6–12 % i måndags, hävstång urspolad); historiskt har BTC-björnar bottnat nära −50/−60 %-nivåer (Schwab-analysen 2026-07-13). ETH höll sig relativt bättre (+1,0 % i måndags per gårdagens feed).
**Bear case:** Het kärn-CPI (≥0,3 % m/m) eller hökaktig Warsh cementerar september-höjningen → nytt ben ned; nästa stödzon under måndagslägstat ~61,8k (gårdagens feed). Hormuz-oljan bygger *framåtblickande* inflationsrisk även vid mjuk juni-siffra. NY Fed-förväntningarna (3,7 %) visar att inflationspsykologin redan glider – strukturell motvind för icke-avkastande tillgångar.
**Setup:** prices.json-krypto föråldrad idag → reservkällor: **BTC ~62 475 USD** (Coingabbar 2026-07-14, −2,0 % 24h), 62 700 måndag 09:11 ET (Schwab). **ETH ~1 737 USD** (−2,9 % 24h; Coingabbar 2026-07-14). Trigger: CPI 08:30 ET + Warsh ~09:30 ET idag. Nivåer: ~61,8k första stöd (måndagslägsta), därunder luft; uppsida mot 64k-området (måndagens högsta) vid mjukt utfall.

## Makro- & sektorfaktorer att bevaka
- **Ränte-/inflationsläge – dagens allt:** CPI (08:30 ET) + Warsh (09:30 ET) styr. Marknaden prisar reell HÖJNINGSRISK (33 % juli, 69 % sep; CME FedWatch via Schwab 2026-07-13) – ovanligt läge där en *mjuk* siffra är konsensus men en *het* kärna är den asymmetriska risken. 10-åringen 4,58 %, nära årshögsta – stigande yields även vid starka vinster är en varningssignal (Schwab 2026-07-13).
- **Geopolitik:** Blockaden aktiveras 16:00 ET idag; olja på en-månadshögsta (WTI 79,57; CNBC 2026-07-14). Notera dock: CME-terminskurvan prisar crude kring ~70 USD till våren (Schwab 2026-07-13) → marknaden tror på deeskalering på sikt; består tullen längre än väntat är energi (XOM/CVX, gårdagens case) fortsatt hedgen mot allt annat.
- **Sektorrotation:** Måndag = defensivt (staples, hälsovård) + energi upp; tech/minne/krypto ned; guld/silver föll (−1/−2 %) på Fed-höjningsoro. VIX +9 % till 16,4 – stigande men ingen panik. Vinstbredden smal (6/11 sektorer <10 % tillväxt) → bifurkationen fortsätter tills CPI/bankerna ger ny riktning.
- **Krypto:** Drivs helt av makro (CPI, Fed, DXY 100,92) – inga egna positiva katalysatorer i flödet; "Extreme Fear" + ev. kapitulation är kontraindikatorn att bevaka. Dagens CPI-reaktion avgör om 60k-nivån håller.
=======
**Marknadsklimat:** Avvaktande riskoff inför en sällsynt "dubbelsmäll" – junis CPI (08:30 ET) landar samtidigt som de fem storbankerna inleder Q2-rapportsäsongen före öppning. Ovanpå det extends oljan till en månadshögsta när USA:s Hormuz-avgift träder i kraft 16:00 ET idag. Futures pekar svagt ned (S&P −0,2 %, Nasdaq −0,3 %) efter måndagens breda nedgång; krypto pressat under 62k och backar mot 60k inför inflationssiffran. Marknaden håller andan.

> ⚠️ **DATAKÄLLA – DELVIS VERIFIERAD:** `state/prices.json` (generatedAt **2026-07-13T23:56 UTC**)
> innehåller alla US-/index-symboler med marketTime = måndagens stängning (20:00 UTC / 16:00 ET) –
> dessa nivåer är verifierade. **OBS: kryptokurserna i prices.json har marketTime 02:11 UTC 13 juli
> (>24h gamla) och används INTE som tvärsäkra nivåer** – för BTC/ETH anges i stället Yahoo Finance-läsning
> för 14 juli med tidsstämpel. Idag (14 juli) är CPI (08:30 ET) och bankrapporterna (före öppning) ännu
> inte utfall vid denna körning → de redovisas som dagens imminenta katalysatorer, inte som resultat.

## Marknadsöversikt
Indexnivåer och rörelse mot föregående stängning **ur `state/prices.json`** (verifierad tidsstämpel inom parentes); krypto ur Yahoo Finance-reservkälla då prices.json-tidsstämpeln är inaktuell:

- **S&P 500 (^GSPC):** **7 515,34**, **−0,29 %** (vs prev close 7 537,43; marketTime 2026-07-13 21:19 UTC). Media rapporterar måndagens dagsfall som −0,79 %. Källa: prices.json + Yahoo Finance (2026-07-14).
- **Nasdaq Composite (^IXIC):** **25 873,18**, **−0,95 %** (vs 26 121,16; marketTime 2026-07-13 21:15 UTC). Media: måndag −1,55 %, tech ledde ned. Källa: prices.json + Yahoo Finance (2026-07-14).
- **BTC-USD:** **~61 893 USD**, **−3,5 %** på dygnet (Yahoo Finance, läsning 2026-07-14; intradag ~58 100–61 800 om inte 62k återtas). *prices.json-nivån 63 228 är daterad 02:11 UTC 13 juli → ej använd som färsk.* Källa: Yahoo Finance / Cryptonomist (2026-07-14).
- **ETH-USD:** **~1 776 USD**, **−2,7 %** (Yahoo Finance, 2026-07-14; veckospann ~1 718–1 801). Källa: Yahoo Finance (2026-07-14).

Övriga verifierade rörelser ur feeden (måndagens stängning, marketTime 20:00 UTC 13 juli) som färgar bilden in i idag: **XOM 144,51 (+5,9 %** vs 136,44) och **CVX 182,20 (+8,4 %** vs 168,10) på oljespiken; **META 656,73 (+9,4 %** vs 600,29); **NVDA 203,53 (+4,1 %**); minne svagt: **MU 937 (−4,9 %)**, **SKHY 152,35 (−10,4 %)**, **AMD 534,39 (−3,2 %)**; kryptoaktier hårt pressade: **MSTR 92,10 (−8,6 %)**, **COIN 157,37 (−6,8 %)**, **RIOT 20,19 (−11,7 %)**, **MARA 12,19 (−5,9 %)**; **TSLA 394,76 (−6,0 %)**, **GOOGL 352,51 (−3,8 %)**. Källa: prices.json.

## Ekonomiska siffror & kalender
**Senaste utfall:** Inga nya förstklassiga USA-siffror har bekräftats vid denna körning (CPI släpps 08:30 ET idag). Bakgrund: bensinpriserna föll ~10 % i juni (fjärde största månadsfallet på ett decennium) efter Hormuz-vapenvilan i juni – vilket väntas ge en mjuk CPI-headline. Källa: Kiplinger / IndexBox / Morningstar (2026-07).

**Kommande releaser (1–5 dagar), tider ET:**
- **Tis 14 juli 08:30 ET – KPI/CPI & Kärn-CPI (juni).** ⭐ **MEST MARKNADSRÖRANDE.** Cleveland Feds nowcast: **headline ~−0,1 % m/m → ~3,9 % YoY** (ned från 4,2 % i maj; FactSet ~3,8 %), driven av junis bensinfall. **Kärn-CPI väntas ~+0,2 % m/m → ~2,85–2,9 % YoY** – underliggande tjänsteinflation fortsatt sticky. Sista stora inflationsavläsningen före FOMC 29 juli. *Nyans:* juni-CPI är bakåtblickande och gynnas av det gamla oljefallet, MEDAN dagens Hormuz-avgift åter höjer den framåtblickande inflationsrisken. En het kärnsiffra kan reprisa Fed-förväntningar (dollar upp, growth/krypto ned) på sekunder. Källor: Morningstar / Kiplinger / IG / Cleveland Fed nowcast (2026-07-13/14).
- **Ons 15 juli 08:30 ET – PPI (juni).** Producentprisindex följer dagen efter CPI; bekräftar/nyanserar inflationsbilden inför FOMC. Källa: Cryptobriefing / CryptoTimes (2026-07-14).
- **Ons 29 juli – FOMC-räntebesked** (utan uppdaterade SEP → statement/presser väger tyngre). Marknaden prisar hold; junimötets dot-median ~3,8 % (hökaktig). Fed-guvernör Waller har varnat att högre inflation kan tvinga fram stramare politik. Källor: Federal Reserve / Cryptobriefing (2026-06/07).

## Aktuella händelser & katalysatorer
- **Storbankerna inleder Q2-säsongen idag (14 juli, före öppning):** JPMorgan, Goldman Sachs, Bank of America, Wells Fargo och Citigroup rapporterar samtidigt. JPM-konsensus: **EPS 5,59 USD (+6,7 % YoY), intäkter 51,09 mdr USD (+13 % YoY)**; fokus på räntenetto (NII, helårsguide ~103 mdr USD) och kapitalåterföring/återköp. Optionsmarknaden prisar in rörelser på rapportdagen: GS 6,0 %, C 5,5 %, WFC 5,5 %, BAC 4,5 %, JPM 4,4 %. Analytiker höjer JPM-riktkurser (snitt ~354 USD). Källor: StockTitan / TipRanks / Intellectia / FX Leaders / Bitget (2026-07-13/14).
- **Hormuz-avgiften träder i kraft idag 16:00 ET (14 juli):** US Central Command bekräftade att USA:s 20 %-avgift/"blockad" på last genom sundet startar kl 16:00 ET idag. **WTI (aug) ~79,57 USD/fat (+1,83 %)**, **Brent (sep) ~84,72 USD (+1,7 %)** – en månadshögsta efter måndagens +9,6 %. USA och Iran utväxlade nya missilangrepp över helgen. Källor: CNBC "Oil extends gains… Hormuz toll" / BNN Bloomberg / Yahoo Finance / Al Jazeera (2026-07-13/14).
- **Måndagens selloff (13 juli):** S&P −0,79 % (7 515,34), Nasdaq −1,55 % (25 873,18), Dow −0,26 % (52 498,64) sedan Trump aviserat Hormuz-blockaden – kapital roterade ut ur tech/krypto in i energi. Källa: Yahoo Finance / CNBC (2026-07-13).
- **Meta "Meta Compute" – AI-molnpivot (fortsatt tema):** Meta positionerar sig som en fjärde hyperskalare som säljer AI-beräkningskraft, med egna "Iris"-chips i produktion i september. Bästa veckan sedan tidigt 2024; BofA Köp, riktkurs 835 USD. Bröt +9,4 % även under måndagens riskoff → relativ styrka. Källor: CNBC / Yahoo Finance (2026-07-13).
- **Kryptoaktier och mynt pressade inför CPI (13–14 juli):** BTC under 62k mot 60k, hävstångsproxys föll tvåsiffrigt måndag (RIOT −11,7 %, MSTR −8,6 %). En het CPI kan enligt XYO:s Markus Levin trycka BTC under 60k; en mjuk siffra ger relief. Källor: Yahoo Personal Finance / Cryptonomist / CryptoTimes (2026-07-13/14).

## Dagens case
### Case 1: Storbankerna (JPM / GS / C – NYSE) – Q2-rapportkatalysator idag
**Katalysator:** Fem megabanker rapporterar Q2 före öppning idag (14 juli). JPM väntas visa EPS 5,59 USD (+6,7 %) och intäkter 51,09 mdr USD (+13 % YoY), med räntenetto och kapitalmarknads-/rådgivningsintäkter i fokus efter ett starkt Q1 (record markets-intäkter, rådgivning +82 %). Analytiker pekar på ~25 % vinsttillväxt för sektorn när kapitalmarknaderna accelererar. *Ej ryktesdrivet – bygger på bolagens rapportdatum och publik konsensus.* Källor: StockTitan / TipRanks / Intellectia / 24/7 Wall St. (2026-07-13/14).
**Bull case:** Brant räntekurva + återhämtning i investment banking/trading kan lyfta både NII och avgiftsintäkter; starka återköp/utdelningar ger direktavkastning till aktieägarna. Banker är ett relativt defensivt sätt att vara exponerad mot en ekonomi som håller, och gynnas om CPI kommer mjuk (lägre långräntor → högre värderingar på finanssektorn utan att skada NII nämnvärt på kort sikt).
**Bear case:** Optionsmarknaden prisar redan in stora rörelser (GS 6,0 %, C 5,5 %) → "buy the rumor, sell the news"-risk även vid beat. Aktierna har gått starkt in i rapporten (JPM nära riktkurs) → hög ribba. En het kärn-CPI som höjer långräntor och recessionsoro kan slå mot kreditförluster och kapitalmarknadsvolymer. Ren event-trade kring rapport + CPI samma dag = förhöjd tvåvägsrisk.
**Setup:** **KURS EJ VERIFIERAD** – JPM/GS/C fanns inte i prices.json vid denna körning (nu tillagda i `config/watchlist_us.txt` → hämtas nästa körning). Analytikersnitt för JPM ~354 USD implicerar ~5 % uppsida från förhandsnivå (~335 USD, ej verifierad tidsstämpel). Trigger: utfall vs konsensus 07:00–08:00 ET + reaktionen genom CPI 08:30 ET. Undvik tvärsäkra prisnivåer tills feeden bekräftar. Källa: TipRanks (2026-07-13).

### Case 2: Integrerad energi (XOM / CVX – NYSE) – Hormuz-avgiften startar idag
**Katalysator:** USA:s 20 %-avgift/blockad på Hormuz-last träder i kraft **16:00 ET idag (14 juli)**; oljan extends till en månadshögsta (WTI ~79,57, Brent ~84,72) efter måndagens +9,6 %. Detta är gårdagens event-case, idag bekräftat och förstärkt av att avgiften faktiskt aktiveras samt av nya USA–Iran-missilangrepp. Källor: CNBC / BNN Bloomberg / Yahoo Finance (2026-07-14); prices.json.
**Bull case:** ~20–30 % av globalt sjöburet olja passerar Hormuz; en aktiverad avgift/störning kan hålla Brent/WTI förhöjt och ge omedelbar marginal-/kassaflödeshävstång i integrerade bolag. Energi har varit en eftersläntrare 2026 → utrymme för rotation; XOM/CVX är likvida, utdelningsstarka uttryck för oljeprisrisken utan enskild operationell risk. Fungerar även som hedge mot att bankerna/tech faller på en het CPI.
**Bear case:** Marknaden har upprepat "sett förbi" Mellanöstern-spänningar och Hormuz-störningar är historiskt svåra att upprätthålla → oljespikar ebbar ofta ut ("sell the news"). En bestående oljespik höjer dessutom inflationen → hökaktig Fed och bredare riskoff, som kan slå tillbaka. Ren makro-/event-trade, inte fundamental omvärdering.
**Setup (ur prices.json, marketTime 2026-07-13 ~20:03 UTC):** **XOM 144,51 USD (+5,9 %** vs prev close 136,44; dayHigh 145,23) och **CVX 182,20 USD (+8,4 %** vs 168,10; dayHigh 182,38) – båda stängde nära dagshögsta (styrka in i stängning). Trigger framåt: om avgiften aktiveras 16:00 ET som aviserat och oljan håller ovan gårdagens nivå. Nyckelnivå/stöd om oljan deeskalerar: föregående stängning (136,44 / 168,10).

### Case 3: Bitcoin (BTC-USD / krypto) – makro-swing på CPI
**Katalysator:** BTC har pressats mot 60k inför CPI; de hävstångade proxyaktierna föll tvåsiffrigt måndag (RIOT −11,7 %, MSTR −8,6 %). CPI 08:30 ET är den omedelbara swing-faktorn: en mjuk siffra ger relief, en het kärnsiffra riskerar att trycka BTC under 60k (XYO/Markus Levin). Källor: CryptoTimes / Cryptonomist / Yahoo Personal Finance (2026-07-14).
**Bull case:** En mjuk CPI-headline (~3,9 %) kan lätta hökförväntningarna och ge en snabb studs i krypto, som fallit oproportionerligt mot geopolitiken. BTC har hållit sig relativt stabilt kring 60–62k trots stress → "digital guld"-narrativet lever. Miners/proxys som fallit tvåsiffrigt erbjuder hävstång vid en vändning.
**Bear case:** Oljedriven inflationsrisk framåt (Hormuz-avgiften) + Wallers hökvarning talar för fortsatt stram Fed → strukturell motvind för högriskaktier och krypto. Momentum är svagt; en het kärn-CPI (sticky tjänster) kan utlösa nästa ben ned mot 58k. Hävstångsproxys (MSTR) förstärker nedsidan.
**Setup:** **BTC ~61 893 USD (−3,5 %)**, **ETH ~1 776 USD (−2,7 %)** – Yahoo Finance-läsning 2026-07-14 (prices.json-kurserna är daterade 02:11 UTC 13 juli → ej färska). Intradag-spann BTC ~58 100–61 800 om inte 62k återtas; motstånd 62–65,6k. Trigger: CPI-utfallet 08:30 ET + oljans riktning. Nyckelnivå: 60k som psykologiskt stöd; brott därunder öppnar mot 58k.

## Makro- & sektorfaktorer att bevaka
- **"Dubbelsmällen" 14 juli = dagens joker:** CPI (08:30 ET) och fem bankrapporter före öppning kolliderar samma morgon → ovanligt hög tvåvägsrisk och volatilitet. Utfallen var ännu inte kända vid denna körning; följ upp nästa körning. Källa: TechTimes / Intellectia (2026-07-13).
- **Ränte-/inflationsläge:** CPI är veckans nyckel, PPI följer 15 juli. Paradoxen kvarstår: headline väntas mjuk (~3,9 %) tack vare junis *gamla* oljefall, medan *dagens* Hormuz-avgift höjer den framåtblickande inflationsrisken. Kärn-CPI (~2,9 %, sticky tjänster) väger tyngst för Fed. FOMC 29 juli utan SEP → statement tolkas hårdare; dot ~3,8 % signalerar fortsatt hök.
- **Geopolitik/energi:** Hormuz-avgiften aktiveras 16:00 ET idag; oljan på månadshögsta är medvind för energi men motvind för index/krypto (riskoff + inflationsrisk). En snabb deeskalering vänder bilden lika snabbt.
- **Sektorrotation & krypto:** Fortsatt ut ur minne/krypto/growth (MU, SKHY, MSTR, TSLA), in i energi (XOM/CVX) och selektiv AI-infra (META, NVDA). Bredden är smal. Krypto drivs just nu av makro (CPI, Fed, olja/DXY) mer än egna katalysatorer – håll koll på DXY och realräntor vid en hökaktig Fed.
>>>>>>> 3664b7c3ef27dfc0af5ba70410212a9fef262ae8

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
