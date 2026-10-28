# Daglig Scout: USA & Krypto
**Datum:** 2026-10-28
**Marknadsklimat:** Det var en avvaktande riskaptit på FOMC-dagen. Tisdagen (2026-10-27) gav `^GSPC` +0,60 % och `^IXIC` +1,18 %, där chipnamnen ledde och S&P 500 tog tillbaka EMA20. Boeing föll −10,69 % och höll tillbaka Dow. Kryptot låg stilla (`BTC-USD` 80 666,82, `ETH-USD` 2 343,34) under EMA20, och `ETH-USD` är fortsatt svagast med RSI 38,9. **Aktiva lärdomar tillämpade:** L-3 (åtgärdspunkter sist), L-4 (de vilande kandidaterna från igår har nu full historik), L-5 (rapportkalenderns källa och täckning) och L-6 (inga klasser utesluts). L-1, L-2, L-7 och L-8 gäller inte scouten.

## Marknadsöversikt

`git pull` 2026-10-28 05:48 UTC (06:48 CET) gav `origin/main` = `5330356`. Källan är `state/prices.json` med `generatedAt` 2026-10-28T00:31:45Z, `schemaVersion` 2026-08-02-prevclose, `tickerCount` 296, `okCount` 291 och `wideAt` 2026-10-28T00:31:45Z (Yahoo Finance chart API via GitHub Actions).

| Symbol | Nivå | Rörelse sedan föregående session | Vecka (mot 2026-10-19/20) | marketTime |
|---|---|---|---|---|
| `^GSPC` | 7 722,60 | +0,60 % (7 676,77 → 7 722,60) | +0,41 % | 2026-10-27T20:48:15Z |
| `^IXIC` | 26 477,81 | +1,18 % (26 169,38 → 26 477,81) | +0,18 % | 2026-10-27T21:15:59Z |
| `BTC-USD` | 80 666,82 | −0,06 % mot daterad punkt 2026-10-27 (80 713,92) | −2,72 % | 2026-10-28T00:30:13Z |
| `ETH-USD` | 2 343,34 | −0,05 % mot daterad punkt 2026-10-27 (2 344,42) | −4,23 % | 2026-10-28T00:30:26Z |
| `SPY` (sleeve) | 769,66 | +0,56 % (765,37 → 769,66) | +0,41 % | 2026-10-27T20:00:00Z |

**Kryptots dagsrörelse** räknas mot den daterade punkten i `state/price_history.json`, inte mot `previousClose`, eftersom fältet fortfarande avviker från serien (åtgärdspunkt 3). Dagens nivåer för båda mynten är intradagspunkter från 00:30 UTC.

**Teknik** (räknad på råserien i `state/price_history.json`, 250 punkter):
- **`^GSPC`:** 5,8 % över MA200 (7 298,85) ⇒ **regimfiltret för US-boken är fortsatt PÅ**. Kursen ligger strax över EMA20 (7 710,95) och EMA50 (7 683,18). RSI 51,2.
- **`^IXIC`:** fortfarande strax under EMA20 (26 593,18) och EMA50 (26 544,13), 5,8 % över MA200 (25 019,43). RSI 47,7.
- **`BTC-USD`:** under EMA20 (81 792,55), strax över EMA50 (79 752,61) och 11,8 % över MA200 (72 141,03). RSI 46,4.
- **`ETH-USD`:** under EMA20 (2 444,26) och EMA50 (2 426,19), 10,1 % över MA200 (2 127,97). RSI 38,9.

**Tisdagens bredd** bland de 116 US-aktierna med kurs och `previousClose` i `state/prices.json` (`price / previousClose − 1`, reguljär session 2026-10-27):
- **Starkast:** `APLD` +9,42 %, `IREN` +7,90 %, `RIOT` +7,70 %, `ACHR` +7,36 %, `SMCI` +7,34 %, `BE` +7,15 %, `CDNS` +6,49 % och `NG` +6,02 %.
- **Svagast:** `BA` −10,69 %, `RHI` −6,71 %, `ACN` −4,88 %, `CBOE` −3,15 %, `EVCM` −3,09 % och `KHC` −2,71 %.

Minerna och AI-compute-namnen (`IREN`, `RIOT`, `APLD`) steg trots att BTC låg stilla. Det är en AI-hostingrörelse och inget kryptosignal. `BE` steg +7,15 % utan någon ny daterad katalysator: Q3-rapporten kom 2026-10-22 (Bloom Energy IR), och aktien ligger fortfarande under MA200 (−0,7 %) och under EMA20/EMA50, så det blir inget case. **Efterbörs** (`extendedSession` post, ~23:59 UTC) inför kvällens rapporter: `GOOGL` +0,93 % (323,57), `VRT` +1,20 % (211,06), `MSFT` +0,25 % (532,65) och `COIN` −1,59 % (158,53).

## Ekonomiska siffror & kalender

**Senaste utfall:**
- **Conference Board-förtroendet oktober (2026-10-27): 91,7 mot väntat ~81** och reviderat 84,2 i september. Det var den första uppgången på fyra månader och slog alla prognoser i Bloombergs enkät. Present Situation-indexet låg på 120,4 och Expectations-indexet på 72,6 (Conference Board via PR Newswire och Bloomberg 2026-10-27). Bensinpriserna lättade enligt Conference Board. **Starkare än väntat inför FOMC, vilket är hökaktigt.**
- **UMich slutligt oktober (2026-10-23): 48,0 mot väntat 46,3**, med ettårs inflationsförväntan på 4,7 % (rapport-261026).
- **Flash-PMI oktober (2026-10-23):** tillverkning 56,0 mot 55,5 och tjänster 57,9 mot 58,0 (rapport-261026).

**Kommande:**
- **I DAG onsdag 2026-10-28, 14:00 ET (19:00 CET): FOMC-beslutet, med presskonferens 14:30 ET. Det är veckans mest marknadsrörande punkt.** Marknaden prisar mycket låg sannolikhet för en ändring i dag men ~83 % för en höjning i december (CME FedWatch via Yahoo Finance/Motley Fool 2026-10-27). Källorna är oeniga om nuvarande målintervall (3,50–3,75 % mot 3,75–4,00 % efter septemberhöjningen), så nivån är inte verifierad och fokus ligger på signalen inför december.
- **Torsdag 2026-10-29, 08:30 ET: BNP Q3 (förhandsskattning)**, konsensus 3,1–3,2 % (rapport-261027). Samma dag fattar **ECB** beslut. **BoJ** fattar beslut fredag 2026-10-30. Releasedagen för **PCE september** är inte verifierad.

**Rapporter nästa 5 handelsdagar** (`state/earnings_calendar.json`, `generatedAt` 2026-10-28T00:29:58Z, `errors` tomt), US-symboler:
- 10-28 (i kväll): `MSFT`, `GOOGL`, `VRT`, `BIIB`, `AWK`, `AXGN` och `VNDA`
- 10-29: `AMZN`, `COIN`, `MSTR`, `INTC`, `HII`, `ILMN`, `RDDT` och `SPXC`
- 10-30: `XOM`, `CVX` och `CBOE`
- 11-02: `AAPL`, `PLTR`, `RIG`, `RHP`, `CRGY` och `AESI`
- 11-03: `AMD`, `ANET`, `SMCI`, `TEVA`, `AMRX` och `PCVX` (`PCVX` har `isEstimate: true`, gissat datum)
- 11-04: `NVO`, `PAYC`, `PTC`, `QGEN`, `UTHR`, `KHC`, `BKH`, `CXW`, `RIOT` och `MARA` (`MARA` har `isEstimate: true`)

**L-5:** kalendern ser bara de symboler `prices.yml` hämtar, så resten av det amerikanska universumet är **OKONTROLLERAT**. 2026-10-27 rapporterade SoFi, Pentair, Robinhood, NXP, Royal Caribbean, UPS, PPG och Boeing. Av dem fanns bara `BA` i kalendern; övriga hittades via websök (Motley Fool, Chartmill, CNBC 2026-10-27). Alla rapportdatum ovan är bevakningsposter enligt punkt 8, aldrig köpförslag. `MSFT` och `GOOGL` rapporterar i kväll, samma dag som FOMC, vilket gör kvällen dubbelt binär.

## Aktuella händelser & katalysatorer

- **SoFi (`SOFI`), Q3 2026, 2026-10-27 före öppning (SEC 8-K, via websök):** justerade nettointäkter ~1,4 mdr USD (+44 %), justerat EBITDA 470 MUSD (+70 %), 17,1 mn medlemmar (+35 %). Helårsguiden 2026 höjdes till 5,04 mdr (från 4,75–4,85), och en preliminär guide för 2027 på 6,4 mdr presenterades. Aktien steg ~13 % (Motley Fool 2026-10-27). **Bekräftat utfall.**
- **Pentair (`PNR`), Q3 2026, 2026-10-27 före öppning (SEC 8-K, via websök):** justerat EPS 1,18 mot konsensus 1,08 och den egna guiden 1,05–1,08. Kärnförsäljningen föll dock 5 % (Pool −18 %), och GAAP-guiden för helåret sänktes till ~3,76. Det var dagens största uppgång i S&P 500, +12,8 % (Chartmill 2026-10-27). **Bekräftat utfall.**
- **Boeing (`BA`), Q3 2026, 2026-10-27:** intäkterna blev 24,19 mdr USD mot konsensus 23,84 och GAAP-förlusten −0,26 USD/aktie. Bolaget missar däremot leveransmålen, och takthöjningen till 47 737:or per månad skjuts till nästa år (CNBC, BigGo Finance 2026-10-27). Aktien föll −10,69 % till 168,18 (`state/prices.json`, 2026-10-27T20:00:03Z) på 6,2× normal volym. **Negativ katalysator, inget case.**
- **Robinhood (`HOOD`), Q3 2026, 2026-10-27 efter stängning (mfn 20:05 UTC, i `state/news_feed.json`):** rekordintäkter ~1,42 mdr USD (+12 %) och justerat EPS 0,60 mot 0,55. Kryptointäkterna låg dock 55 % under fjolårets, och aktien föll 4–7 % efterbörs (CNBC och Investing.com 2026-10-27). **En kryptosvag signal.**
- **NXP (`NXPI`), Q3 2026, 2026-10-27 efter stängning (mfn 20:10 UTC):** intäkter 3,79 mdr USD (+19 %) och non-GAAP EPS 4,20 mot 4,11, samt ett nytt återköpsmandat på 5 mdr. Q4-guiden (3,85 mdr ± 0,1) låg i linje med konsensus, och aktien föll ~8 % efterbörs (Benzinga och GuruFocus 2026-10-27). **"Sell the news" inom halvledare.**
- **Royal Caribbean (`RCL`), Q3 2026, 2026-10-27:** justerat EPS 6,57 mot FactSet 6,38, och helårsguiden höjdes till 17,85–17,95 (SEC 8-K via websök). Kursreaktionen är oenig mellan källorna (+4 till +7,6 %), så det blir ingen kandidat i dag.
- **`state/news_feed.json`** (`generatedAt` 2026-10-27T21:21:56Z) täcker **10 av 10 handelsdagar** (2026-10-14 – 2026-10-27, `missingDays` tomt). Alla 90 posterna för 2026-10-27 ligger efter 16:23 UTC, så **ingen av morgonens rapporter (SOFI, PNR, BA, RCL, UPS) finns i flödet** (åtgärdspunkt 5). `globenewswire` och `globenewswire-earnings` svarar fortfarande HTTP 403 (åtgärdspunkt 1).
- **Inga rykten används i dag.**

## Uppföljning av tidigare case

Kursen "då" är den sista verifierade stängningen före katalysatorn, eftersom rapport-261027 saknade kurs för alla tre:
- **`CDNS` (rapport-261027): KURS EJ VERIFIERAD då (stängning före rapporten 322,17, 2026-10-26) → 343,08 nu** (+6,49 %, `state/prices.json` 2026-10-27T20:00:01Z) på 2,0× normal volym. Kursen ligger 4,8 % över MA200 (327,28) och över EMA20/EMA50, med RSI 58,1. **Tes INTAKT**, och reaktionen bekräftar rapporten.
- **`NUE` (rapport-261027): KURS EJ VERIFIERAD då (257,35, 2026-10-26) → 270,79 nu** (+5,22 %, 2026-10-27T20:00:02Z) på 2,0× volym. Kursen ligger 21,7 % över MA200 (222,43) och strax under 250-dagarshögsta (274,74), med RSI 65,9. **Tes INTAKT.**
- **`VZ` (rapport-261027, utan fullt case): 43,10 då (post-event, 2026-10-26) → 43,93 nu** (+1,93 %, 2026-10-27T20:00:02Z). Kursen ligger 6,0 % **under** MA200 (46,75) och under EMA20/EMA50, med RSI 43,5. **Tes FÖRSVAGAD** som köpcase: den tekniska spärren (kurs ≤ MA200) består.

**Kandidatkön (`state/scout_candidates.json`):** före dagens körning fanns 93 poster, varav 88 `rejected`, 5 `promoted` och **0 `new`**. Inga poster är försenade.

**L-4-kontroll:** `261027-CDNS`, `261027-NUE` och `261027-VZ` avvisades 2026-10-27 av US-boken (`us-daglig-261027.md`) på **"Grind 2 OMÄTBAR … VILANDE enligt L-4"**. Det var en tillfällig datalucka, eftersom serierna bar 1 punkt. **Luckan är nu fylld:** alla tre bär 250 daterade stängningar i `state/price_history.json` och har kvalificerade post-katalysatorkurser i `state/prices.json` (reguljär stängning 2026-10-27, en dag efter katalysatorn). Alla tre ligger inom `expiresAt` 2026-11-03. **Enligt L-4 ska US-rotationen kl. 15:00 i dag ta nya, fullständiga avgöranden mot de fem grindarna och logga dem i `state/decisions.json`.** Scouten avgör dem inte själv.

**Innehav:** US-boken har inga aktieinnehav, och `SPY` ligger på 100 % (`state/portfolj_us.md`). `SPY` står på 769,66 (2026-10-27T20:00:00Z), vilket är −0,47 % mot entry 773,26.

## Dagens case

### Case 1: SoFi Technologies (SOFI / NASDAQ)
**Katalysator:** Bekräftad Q3-rapport 2026-10-27 före öppning (SEC 8-K). Rekordhöga justerade nettointäkter (~1,4 mdr USD, +44 %, mot förväntade ~1,25 mdr), justerat EBITDA +70 % till 470 MUSD och 17,1 mn medlemmar (+35 %). Helårsguiden 2026 höjdes till 5,04 mdr (från 4,75–4,85 mdr), och en första guide för 2027 gavs: 6,4 mdr i intäkter och EPS 0,90. Det är en fintech/kryptoinfrastrukturprofil inom scoutens fokus (`config/fokus_scout.md`).
**Bull case:** Både intäktsbeatet och guidehöjningen är stora, och 2027-guiden ger synlighet ett år framåt. Aktien har fallit ~45 % under 2026 (FX Leaders 2026-10-27), så det finns ett omvärderingsutrymme om tillväxttakten håller. Medlems- och produkttillväxten på 35–44 % visar att plattformen breddas bortom utlåning.
**Bear case:** Ett analysföretag bedömer guidehöjningen som bara marginellt över förväntan (Chartmill 2026-10-27). Aktien är i en etablerad nedtrend, och FX Leaders pekar på 20 USD som nivån som måste brytas för att trenden ska vända. En hökaktig Fed (en höjning i december prisas ~83 %) slår direkt mot ett utlåningsbolags finansieringskostnad och kreditkvalitet. Robinhoods svaga kryptointäkter samma kväll visar att kryptokopplad fintechintäkt är cyklisk.
**Setup:** **KURS EJ VERIFIERAD.** `SOFI` saknas i `state/prices.json` (`generatedAt` 2026-10-28T00:31:45Z) och i `state/price_history.json`, så trend, MA200 och RSI kan inte bedömas härifrån. Raden är lagd i `config/watchlist_us.txt`. Kandidat **`261028-SOFI`** har `price: null` och kan avfärdas men inte köpas förrän `refresh-candidate-prices.mjs` har fyllt i en kvalificerad kurs efter katalysatorn.

### Case 2: Pentair (PNR / NYSE)
**Katalysator:** Bekräftad Q3-rapport 2026-10-27 före öppning (SEC 8-K). Justerat EPS 1,18 mot konsensus 1,08 och den egna guiden ~1,05–1,08. Justerad rörelsemarginal (ROS) 24,8 %, och mittpunkten i helårsguiden för justerat EPS (~4,70) bekräftades. Det var dagens största uppgång i S&P 500 (+12,8 %, Chartmill 2026-10-27).
**Bull case:** Marginalen håller trots att volymerna faller, vilket visar att prissättningen och kostnadsprogrammet fungerar. Pool, som föll 18 %, gick bättre än befarat. Flow växte 4 %. Om poolcykeln har bottnat finns hävstång i marginalen när volymerna vänder.
**Bear case:** Kärnförsäljningen föll 5 % och GAAP-guiden för helåret sänktes (från 3,86–4,06 till ~3,76). Beatet är alltså ett kostnads- och marginalbeat, inte efterfrågan. Rörelsen på 10–13 % kan redan ha prisat in lättnaden ("relief rally"). En hökaktig FOMC dämpar bostads- och renoveringsrelaterad efterfrågan.
**Setup:** **KURS EJ VERIFIERAD.** `PNR` saknas i `state/prices.json` (`generatedAt` 2026-10-28T00:31:45Z) och i `state/price_history.json`. Raden är lagd i `config/watchlist_us.txt`. Kandidat **`261028-PNR`** har `price: null`.

**Kandidatkön:** två nya poster skrivs med `status: "new"`, `confirmed: true`, `catalystDate` 2026-10-27 och `expiresAt` 2026-11-04: `261028-SOFI` och `261028-PNR`. `validate-scout-candidates.mjs` gav OK (95 kandidater). US-boken avgör dem i dag kl. 15:00 CET. **Krypto:** inget case. Det finns ingen positiv kryptospecifik katalysator, `ETH-USD` är tekniskt svag och Robinhoods kryptointäkter (−55 % å/å) bekräftar en svag handelsaktivitet. `COIN` och `MSTR` rapporterar i morgon 29/10 och får inte köpas in i rapporten (punkt 8).

## Makro- & sektorfaktorer att bevaka

**Räntor och inflation:** FOMC beslutar i kväll. Ett oväntat starkt konsumentförtroende (91,7) och en tillverknings-PMI på 56 ger inget stöd för en duvaktig signal, och marknaden prisar redan en höjning i december. BNP kommer i morgon. Det är motvind för långduration-tillväxt, utlåningsbolag (`SOFI`) och krypto.

**AI-kedjan:** chipnamnen ledde tisdagen (`SMCI` +7,34 %, `AMD` +5,45 %, `ANET` +5,51 %), men NXP:s fall efterbörs (~−8 % trots beat) visar att en guide som bara ligger i linje med förväntningarna straffas. `MSFT` och `GOOGL` i kväll och `AMZN` i morgon avgör capex-tesen. Efterbörsrörelserna före rapporterna är små (+0,25 % respektive +0,93 %).

**Industri:** Boeings produktionsbesked (−10,69 %) är en sektorspecifik motvind för flygleverantörerna, men inget makrotecken. `PNR` och `NUE` visar att marginalbeats belönas i industrin.

**Krypto:** BTC ligger kvar strax över EMA50 och klart över MA200. ETH har RSI 38,9 och ligger under EMA20/EMA50. **DXY och ETF-flöden** för 2026-10-27 gick inte att verifiera. Svag kryptoaktivitet hos mäklarna (HOOD) är en motvind inför `COIN`:s rapport.

**Geopolitik:** Iran-kriget och oljan över 117 USD/fat (rapport-261027) är fortsatt den största inflationsrisken. Det är inte uppdaterat i dag.

### Åtgärdspunkter till Dren (L-3)

1. **`news-feed-globenewswire-http-403` – kvarstår, ÅTERKOMMANDE.** `feeds.globenewswire` och `feeds.globenewswire-earnings` är båda `"HTTP 403 – båda försöken (0.1 s)"` (`state/news_feed.json`, 2026-10-27T21:21:56Z). **Omfång:** 2 av 6 flöden. **Ersättningskälla:** websök.
2. **`macro-calendar-not-verifiable-from-state` – ÅTERKOMMANDE.** Conference Board-utfallet, FOMC-tid och -prissättning, BNP-konsensus samt alla siffror för SOFI, PNR, BA, HOOD, NXPI och RCL kommer ur websök. sec.gov kan inte nås från körmiljön (`getaddrinfo ENOTFOUND www.sec.gov`). **Omfång:** samtliga makrodatum och -värden och 2 av 2 kandidattester. Det aktuella Fed-målintervallet är motsägelsefullt mellan källorna och därför inte verifierat.
3. **`crypto-previousclose-misdated` – ÅTERKOMMANDE.** `quotes["BTC-USD"].previousClose` är 80 006,66 medan punkten 2026-10-27 i `state/price_history.json` är 80 713,92. För `ETH-USD` är det 2 320,28 mot 2 344,42. **Omfång:** 2 av 2 mynt. **Ersättningskälla:** den daterade punkten, som används i tabellen.
4. **`watchlist-cap-vs-measurability-conflict` – ÅTERKOMMANDE.** `config/watchlist_us.txt` har 126 symbolrader efter dagens två tillägg (`SOFI`, `PNR`), mot riktmärket 25. Inga rader stryks, eftersom skydden i `prompts/gemensam_korning.md` går före riktmärket. 5 av 296 symboler i `state/prices.json` saknar `price` (`BK`, `BIOT.ST`, `DOMETIC.ST`, `ICA.ST`, `NRS.OL`); `BK` är den enda US-symbolen.
5. **`news-feed-daily-cap-drops-us-morning` – ÅTERKOMMANDE (andra dagen).** Alla 90 poster för 2026-10-27 ligger efter 16:23 UTC. Morgonens rapportflöde saknas därför helt i `state/news_feed.json`. **Omfång:** 5 av 5 bekräftade rapporter före öppning som nämns här (SOFI, PNR, BA, RCL, UPS); 2026-10-26 var det 3 av 3. **Ersättningskälla:** websök.
6. **`earnings-calendar-coverage` – L-5.** SOFI, PNR, HOOD, NXPI, RCL, UPS och PPG rapporterade 2026-10-27 utan att finnas i `state/earnings_calendar.json`, eftersom de inte prisbevakas. **Omfång:** minst 7 bolag på en enda dag. `SOFI` och `PNR` är tillagda i `config/watchlist_us.txt` i dag.
7. **`^VIX` hämtas inte – kvarstår.** Volatilitetsmåttet saknas på FOMC-dagen. **Omfång:** 1 symbol.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
