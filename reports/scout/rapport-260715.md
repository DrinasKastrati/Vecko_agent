# Daglig Scout: USA & Krypto
**Datum:** 2026-07-15
**Marknadsklimat:** Riskaptiten vände upp när gårdagens juni-CPI kom in klart mjukare än väntat (−0,4 % m/m, kärna oförändrad) → höjningsrisken för juli prisas i praktiken bort och "goldilocks"-tonen är tillbaka i USA. Bankerna öppnade Q2-säsongen starkt (GS +9 %) och chip-/AI-namnen ledde upp. Krypto studsade i takt – BTC tillbaka över 64k och ETH +6–7 % på dagen – från "Extreme Fear"-läget. Oljan svalnade något men Hormuz-premien ligger kvar som svansrisk.

> ⚠️ **DATANOT:** `state/prices.json` (generatedAt **2026-07-14T22:10 UTC**) bär färska US-stängningskurser
> (marketTime 20:00 UTC = tisdagens close) och en färsk BTC-post (marketTime 22:10 UTC) – dessa används nedan.
> **ETH-USD saknas i feeden** → ETH-nivån tas från reservkälla med angiven tidsstämpel enligt scoutprompt-reglerna.
> BTC-USD och ETH-USD har lagts till i `config/watchlist_us.txt` så att båda hämtas till nästa körning.

## Marknadsöversikt
Tisdagens stängning (14 juli), nivåer ur `state/prices.json` (marketTime 20:00 UTC om ej annat anges):

- **S&P 500 (^GSPC):** **7 543,59** (marketTime 20:56 UTC), **+0,53 %** mot prevClose 7 503,85 (media anger +0,38 %). Fjärde raka veckans styrka bekräftas av CPI-lättnaden. Källa: prices.json + CNBC/TheStreet "Stock market today July 14, 2026".
- **Nasdaq Composite (^IXIC):** **26 107,01** (marketTime 21:15 UTC), **+1,12 %** mot prevClose 25 818,69 (media +0,9 %) – tech ledde återhämtningen efter måndagens selloff. Källa: prices.json + TheStreet (2026-07-14). Dow +0,02 % till 52 508,27 (CNBC 2026-07-14, ej i prices.json).
- **BTC-USD:** **64 528,78 USD** (marketTime **22:10 UTC**), **~+4,3 % 24h** enligt reservdata (Fortune "Price of Bitcoin 07-14-2026"). prices.json:s prevClose 64 127 → +0,6 % intradag; det större dygnslyftet speglar studsen från måndagens ~62k. Källa: prices.json + Fortune (2026-07-14).
- **ETH-USD:** **~1 868 USD, ~+6,7 % 24h** (reservkälla: Yahoo/Fortune "Bitcoin and ethereum prices today, Tuesday July 14, 2026"). **Ej i prices.json** → reservkälla; tillagd i watchlist. ETH ledde uppgången i krypto på dovish CPI + fortsatta staking-ETF-flöden.

Övriga tisdagsrörelser ur prices.json (marketTime 20:00 UTC) som färgar dagen: **GS +9,3 %** (1 140,00) och storbankslyftet på Q2-beat; chip/AI upp brett: **NVDA +7,6 %** (211,80), **AMD +6,2 %** (548,13), **AVGO +4,9 %** (389,11), **MU +4,8 %** (983,12, minnesåterhämtning), **SKHY +14,1 %** (193,92); **META +7,4 %** (661,04). Eftersläntrare trots rallyt: **TSM −2,8 %** (420,39, avvaktan inför torsdagens rapport), **GOOGL −2,0 %** (359,51), **TSLA −1,7 %** (396,18); kryptoaktier blandat: **MSTR +0,2 %** (97,58), **COIN −1,2 %** (161,50), **RIOT −4,6 %** (20,19), **MARA +0,9 %** (12,16). Energi gav tillbaka en del: **XOM 145,09** (+2,4 % mot prevClose), **CVX 181,76** (+4,5 %).

## Ekonomiska siffror & kalender
**Senaste utfall – juni-CPI (publicerad tis 14/7 08:30 ET), ⭐ dagens marknadsdrivare:**
- **Headline CPI −0,4 % m/m** (väntat ~−0,1 %) – *största månadsfallet sedan april 2020* – efter +0,5 % i maj. **Årstakt +3,5 %** (ned från maj). Draget av **energi −5,7 % m/m** när Mellanöstern-vapenvilan tryckte ned bensin. Källa: BLS "CPI June 2026" + CNBC/Fox Business (2026-07-14).
- **Kärn-CPI oförändrad m/m (0,0 %)**, årstakt **2,6 %** – klart svalare än de ~+0,2 %/2,9 % marknaden fruktade. Mjuk kärna = det viktigaste, då den tar bort den akuta höjningsrisken (måndagens FedWatch prisade 33 % juli / 69 % sep). Källa: BLS + CNBC (2026-07-14).

**Kommande releaser (1–5 dagar), tider ET:**
- **Idag ons 15/7 08:30 – PPI (juni);** ~14:00 – **Fed Beige Book.** Rapporter före/efter öppning: **ASML, MS, BLK, JNJ.** PPI bekräftar/dementerar CPI-lättnaden på producentledet (Schwab-kalendern 2026-07-13).
- **Tors 16/7 – Detaljhandel (juni)** + **TSM (full Q2-rapport), NFLX, GE, UNH.** ⭐ TSM/NFLX är veckans tyngsta enskilda rapporter (Netflix Q2 kl 13:01 PT; TSM före öppning). Källor: StockTitan/Netflix IR (2026-07-11), Yahoo/TechTimes TSM-preview (2026-07-11).
- **Fre 17/7 –** husbyggnadsstart/bygglov + industriproduktion (Schwab 2026-07-13).
- **Nyans:** juni-CPI är bakåtblickande och gynnas av det *gamla* energifallet. Skulle Hormuz-läget åter eskalera höjs inflationsrisken *framåt*, så den mjuka siffran kan "dateras" – men just nu ger den Fed andrum.

## Aktuella händelser & katalysatorer
- **Dovish CPI vänder höjningsberättelsen (14 juli):** Den svala kärnsiffran (0,0 % m/m) tog effektivt bort juli-höjningsrisken som marknaden prisat in – relief-rally i tech, chip och krypto. Källa: BLS + CNBC/Fox Business (2026-07-14).
- **Storbankerna slår – GS "blockbuster" (14 juli):** Goldman Sachs **+9 %** efter EPS **20,98 USD** (vs 14,48 väntat) och intäkter **20,34 mdr USD** (vs 16,13 väntat). JPMorgan **+2,8 %** på **16,9 mdr USD** kvartalsvinst, med aktiehandeln lyft av volatiliteten kring Iran-kriget. BAC ~+2 %. Källa: CNBC/TheStreet "Stock market today July 14, 2026".
- **Minnes-/AI-chip rekylerar upp (14 juli):** NVDA, INTC, AMD, MU och SNDK studsade när sektorn skakade av sig krigsoron; MU +4,8 %, SKHY +14 %. Berättelsen "Micron & Nvidia driver en 700 mdr USD vinstboom" fick nytt bränsle av dovish CPI. Källor: Yahoo Finance "Nvidia, Intel and Micron Rebound…" (2026-07-14), Rollingout (2026-07-14).
- **TSM-avvaktan inför torsdag (14 juli):** TSM −2,8 % dagen före full Q2-rapport (16 juli); guidning $39,0–40,2 mdr intäkt, bruttomarginal 65,5–67,5 %, med **CoWoS-kapaciteten** som nyckelsignal för AI-taket. Källor: Yahoo/TechTimes TSM Q2-preview (2026-07-11), Forbes (2026-07-09).
- **Krypto studsar ur "Extreme Fear" (14 juli):** BTC tillbaka >64k (+4,3 % 24h), ETH +6,7 %; spot-BTC-ETF:er noterade flera raka dagar av inflöden ledda av BlackRocks IBIT, och den nya staked-ETH-fonden (ETHB) drog ~100 MUSD dag ett. Källor: Fortune/Yahoo (2026-07-14), InvestingNews "Bitcoin ETFs End 10-Day Outflow Streak" (2026-07), crypto.news (2026-07).

## Dagens case
### Case 1: Taiwan Semiconductor (TSM / NYSE, ADR)
**Katalysator:** **Full Q2-rapport imorgon torsdag 16 juli** (före öppning) – veckans tyngsta AI-efterfrågedata. Efter förra veckans förhandsbesked (Q2-intäkter +36 % YoY) ligger fokus på **CoWoS-utbyggnaden**, som nu är flaskhalsen i hela AI-chipkedjan, samt guidning för H2. Bolagets egen guidning: intäkt $39,0–40,2 mdr, bruttomarginal 65,5–67,5 %, helårstillväxt >30 % i USD. Källor: Yahoo/TechTimes TSM-preview (2026-07-11), Forbes (2026-07-09).
**Bull case:** TSM är den obestridda flaskhalsen i AI-utbyggnaden med prissättningsmakt i ledande noder; "extremt robust" efterfrågan i övergången från generativ till agentisk AI. Ett starkt CoWoS-besked kan bekräfta att hyperscaler-capex accelererar och återtända hela SOX efter minnessvackan – med NVDA/AMD/AVGO redan i uppåtrörelse (14 juli) finns momentum i ryggen.
**Bear case:** Förhandsbeskedet (+36 %) är redan känt → klassisk "sell the news"-risk om marginal-/guidningsdetaljer inte överträffar den höga ribban (info-tech bär >60 % vinsttillväxt-förväntan för Q2). Geopolitisk dubbelexponering (Taiwan + Hormuz), stark TWD och att aktien redan föll −2,8 % i avvaktan visar nervositet. Ett dovish makroläge hjälper inte om siffrorna bara "möter".
**Setup:** **TSM 420,39 USD** (prices.json, marketTime **2026-07-14T20:00 UTC**), −2,8 % mot prevClose 432,57; dagsintervall 418,86–430,87. P/E-multipeln vilar på >30 % helårstillväxt. Trigger: full rapport tors 16/7 före öppning; CoWoS-kapacitet + H2-guidning avgör riktningen. Utfall syns i fredagens feed.

### Case 2: Micron Technology (MU / NASDAQ)
**Katalysator:** Minnescykeln vände upp (14 juli, MU +4,8 %) när dovish CPI och avtagande krigsoro lyfte hela halvledarledet; narrativet "Micron & Nvidia driver en 700 mdr USD vinstboom" fick förnyad kraft. Micron projiceras tjäna ~**83 mdr USD i räkenskapsåret 2026** och ~176 mdr FY2027 (från ~9 mdr FY2025), draget av AI:s omättliga behov av avancerat HBM-minne. Källor: Yahoo "Nvidia, Intel and Micron Rebound…" (2026-07-14), Rollingout "Nvidia & Micron chip profit boom" (2026-07-14).
**Bull case:** HBM-minne är det verkliga bottleneck-komplementet till GPU:er; TSM:s och hyperscalers capex-signaler drar Micron direkt. Aktien har varit en eftersläntrare (−4–5 % senaste månaden) trots den branta vinstbanan → utrymme att komma ikapp om torsdagens TSM-besked bekräftar AI-efterfrågan. Dovish Fed = medvind för högtillväxt/lång-duration-namn.
**Bear case:** Minnescykeln är notoriskt volatil och stämningskänslig – SK Hynix-debutens (SKHY) hackiga handel och tidigare månadens −4–5 % visar hur snabbt sentimentet vänder. Hög absolut kurs (~983 USD) och en rejält uppskruvad vinstförväntan (FY27) lämnar liten felmarginal; ett svagt TSM-guidningsbesked eller förnyad Hormuz-eskalering (riskoff) kan slå hårt mot de mest cykliska AI-namnen.
**Setup:** **MU 983,12 USD** (prices.json, marketTime **2026-07-14T20:00 UTC**), +4,8 % mot prevClose 938,38; dagsintervall 950,07–994,80. Trigger: TSM-rapport tors 16/7 som barometer för minnesefterfrågan; PPI idag för kostnadsbilden. Bevaka om MU håller >950-nivån (dagslägsta) som stöd.

### Case 3: Ethereum (ETH-USD / krypto) – relief-rally med staking-ETF-medvind
**Katalysator:** Den mjuka juni-CPI:n (kärna 0,0 % m/m) tog bort den akuta Fed-höjningsrisken → snabb relief-studs i den mest nedpressade risktillgången; **ETH +6,7 % 24h**, klart starkare än BTC:s +4,3 %. Strukturell medvind: staked-ETH-ETF:er (BlackRocks ETHB) drar inflöden efter att SEC/CFTC i mars klassade staking-belöningar som icke-värdepapper. Källor: Fortune/Yahoo (2026-07-14), crypto.news "BlackRock, Coinbase ETH ETF staking" (2026-07), The Block "Crypto ETFs 2026" (2026).
**Bull case:** ETH bär en unik dubbelmotor – makrolättnad (dovish Fed, svagare DXY-bias) OCH en egen katalysator i staking-ETF:erna som ger institutionell avkastning ovanpå prisexponering. Efter månader av "Extreme Fear" och urspolad hävstång finns kapitulationsstuds-potential; ETH ledde uppgången (14 juli) vilket historiskt signalerar riskaptit i hela alt-komplexet.
**Bear case:** Citi sänkte nyligen 12-månaderstarget för ETH från 3 175 till 2 240 USD med hänvisning till svaga/ojämna ETF-flöden och begränsat regulatoriskt momentum – återhämtningen är bräcklig. ETH ligger fortfarande långt under 2024 års ETF-optimism. Skulle PPI idag komma in hett eller Hormuz åter eskalera vänder riskoff snabbt tillbaka mot icke-avkastande tillgångar. En "sell the CPI-relief"-rekyl är fullt möjlig.
**Setup:** **ETH ~1 868 USD** (reservkälla Yahoo/Fortune, tidsstämpel **2026-07-14**, ~+6,7 % 24h) – **KURS EJ VERIFIERAD via prices.json** (ETH saknas i feeden; tillagd i watchlist inför nästa körning). Referens-BTC: 64 528,78 (prices.json 22:10 UTC). Trigger: PPI idag 08:30 ET, ETF-flödesdata, DXY-riktning. Nivåer: ~1 770–1 780 (måndagens intervall) som första stöd, återtaget 1 900 vore styrkebesked.

## Makro- & sektorfaktorer att bevaka
- **Ränte-/inflationsläge – lättnad, men villkorad:** Kärn-CPI 0,0 % m/m (2,6 % YoY) tog bort juli-höjningsrisken och gav Fed andrum inför FOMC 29/7; dagens **PPI** (08:30 ET) + **Beige Book** (14:00 ET) är nästa test. En mjuk PPI cementerar "no hike"; en het siffra väcker oron igen. Bevaka 10-åringen – faller yields med CPI bekräftas lättnaden.
- **Geopolitik / energi:** Hormuz-premien ligger kvar men oljan svalnade från en-månadshögsta; XOM/CVX gav tillbaka en del av måndagsspiken. Består lugnet på energisidan förstärks CPI-lättnaden (energi var −5,7 % i juni). Förnyad Iran-eskalering är den främsta svansrisken som kan vända hela relief-rallyt.
- **Sektorrotation:** Tisdag = tillbaka in i risk – chip/AI (NVDA, AMD, MU, AVGO), banker (GS) och Meta ledde; defensiva namn och delar av energi gav tillbaka. Men bredden testas av att TSM/GOOGL/TSLA föll trots rallyt → marknaden är selektiv inför TSM/NFLX imorgon. Q2-vinstbredden är fortsatt smal (info-tech >60 %, flera sektorer <10 %).
- **Krypto:** Drivs av makrolättnaden (dovish CPI, DXY-riktning) PLUS en egen positiv katalysator i staking-ETF-flödena – ovanligt att både makro och mikro pekar åt samma håll. "Extreme Fear"→studs är kontraindikatorn som spelade ut; frågan är om inflödena håller eller om det blir "sell the relief". ETH:s relativa styrka mot BTC är signalen att följa.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
