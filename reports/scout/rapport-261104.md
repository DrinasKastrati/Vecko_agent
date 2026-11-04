# Daglig Scout: USA & Krypto
**Datum:** 2026-11-04
**Marknadsklimat:** Det är onsdag före öppning, dagen efter mellanårsvalet. Demokraterna är enligt CBS News, CNN och MS NOW projicerade att ta både representanthuset och senaten. Några lopp var fortfarande oavgjorda. Tisdagen bröt tre raka nedgångsdagar: `^GSPC` +0,36 % och `^IXIC` +0,82 %, med halvledare +2,6 %. Bredden var dock svag, 189 stigande mot 313 fallande i S&P 500 (CNBC, Bloomberg via Swissinfo 2026-11-03). Efter stängning levererade AI-hårdvaran: `AMD`, `ANET` och `SMCI` slog alla förväntningarna och steg 7–10 % efterbörs. Krypto handlas kring 77 000 och har backat något över natten. **Aktiva lärdomar tillämpade:** L-3 (åtgärdspunkter sist), L-4 (FN-avvisningen var vilande och dataluckan är nu fylld, se uppföljningen), L-5 (kalenderns täckning) och L-6 (inga klasser utesluts). L-1, L-2, L-7 och L-8 gäller inte scouten.

## Marknadsöversikt

`git pull` kördes 2026-11-04 05:48 UTC (06:48 CET): HEAD = `origin/main` = `6ac325c`. Källan är `state/prices.json` med `generatedAt` 2026-11-04T01:21:41Z, `schemaVersion` 2026-08-02-prevclose, `tickerCount` 306 och `okCount` 301 (Yahoo Finance chart API via GitHub Actions). Hämtningen var bred (`wideAt` = `generatedAt`). Nyhetsflödet (`state/news_feed.json`) har `generatedAt` 2026-11-04T01:26:34Z.

| Symbol | Senaste verifierade nivå | Rörelse | marketTime |
|---|---|---|---|
| `^GSPC` | 7 568,92 | +0,36 % (7 541,40 → 7 568,92) | 2026-11-03T21:30:13Z |
| `^IXIC` | 25 372,01 | +0,82 % (25 164,36 → 25 372,01) | 2026-11-03T22:15:59Z |
| `BTC-USD` | 76 794,98 | −1,29 % mot daterad punkt 2026-11-03 (77 797,46) | 2026-11-04T01:19:48Z |
| `ETH-USD` | 2 260,61 | −1,38 % mot daterad punkt 2026-11-03 (2 292,33) | 2026-11-04T01:20:08Z |
| `SPY` (sleeve) | 754,35 | +0,30 % (752,10 → 754,35) | 2026-11-03T21:00:00Z |

Kryptorörelserna är räknade mot den daterade punkten i `state/price_history.json`, inte mot `previousClose`. Fältet ger fel tecken i dag (åtgärdspunkt 2).

**Tisdagens bredd bland de hämtade US-symbolerna:** 123 symboler hade marketTime 2026-11-03 i `state/prices.json`. Resten av marknaden är OKONTROLLERAD enligt L-5.
- **Bäst:** `RIOT` +18,41 %, `FN` +15,45 %, `CLSK` +13,99 %, `MARA` +11,35 %, `IREN` +11,08 %, `APLD` +9,80 %, `BE` +9,05 % och `ORCL` +5,85 %.
- **Sämst:** `RIG` −5,30 %, `KMB` −3,50 %, `CRGY` −3,41 %, `VNDA` −3,35 %, `EVCM` −3,13 %, `CCL` −2,83 %, `TGT` −2,51 % och `ACN` −2,45 %.

Måndagens rotation vände. AI-infrastruktur och miners/AI-hostingbolag studsade, medan konsument och resor gav tillbaka.

**Teknik** (räknad på råserien i `state/price_history.json`, sista punkt 2026-11-03):
- `^GSPC` ligger 3,46 % över MA200 (7 315,86) ⇒ **regimfiltret för US-boken är fortsatt PÅ**. Kursen ligger fortfarande under MA50 (7 692,74), med RSI 40,4.
- `^IXIC` ligger 1,19 % över MA200 (25 073,16), upp från 0,40 % i går. RSI är 36,0.

## Ekonomiska siffror & kalender

**Senaste utfall:**
- **JOLTS september (2026-11-03): 7,52 mn lediga jobb mot ~7,15 mn väntat och 7,19 mn föregående.** Arbetsmarknaden är starkare än väntat, och det stöder höjningsdiskussionen (BLS jolts.nr0 och Investing.com via websök 2026-11-03; bls.gov nås inte härifrån).
- ISM tillverkning oktober (2026-11-02): 55,5 mot ~54,6, med prices paid 75,2 (oförändrat från rapport-261103).
- Oförändrat från tidigare: kärn-PCE september 3,1 % å/å och BNP Q3 +3,4 %.

**Kommande:**
- **I dag 2026-11-04:** ADP oktober kl. 08:15 ET (14:15 CET), med TE-prognos ~80 000 mot 90 000 föregående. Därefter **ISM tjänster oktober kl. 10:00 ET (16:00 CET)**. Konsensus för ISM tjänster gick inte att belägga (Kiplinger och Trading Economics via websök). Dessutom kommer valresultatets slutliga sammanräkning, och marknaden prissätter en splittrad kongress mot en enpartikongress.
- **Torsdag 2026-11-05:** jobless claims.
- **Fredag 2026-11-06, 08:30 ET (14:30 CET): NFP oktober – VECKANS MEST MARKNADSRÖRANDE.** Konsensus ~65 000 (Reuters via Kitco 2026-10-30). JOLTS-överraskningen höjer insatsen.

**Rapporter nästa 5 handelsdagar** ur `state/earnings_calendar.json` (`generatedAt` 2026-11-04T01:19:28Z, `errors` tomt), US-symboler:
- 11-04: `NVO`, `PAYC`, `PTC`, `QGEN`, `UTHR`, `KHC`, `BKH`, `CXW` och `RIOT`
- 11-05: `AKAM`, `DVN`, `EVCM`, `IREN`, `KMB`, `NET`, `TEAM` och `U`, samt `SYNA` och `WBD` (båda `isEstimate: true`)
- 11-06: `VST`
- 11-09: `ACHR`, `CEG`, `KKR` och `MARA`

Flera av dessa (`AKAM`, `PTC`, `UTHR`, `NET`, `TEAM` m.fl.) bär redan efterbörsnoteringar från 2026-11-03/04 i `prices.json`. Kalenderns datum gäller oförändrat.

**L-5:** kalendern ser bara de symboler som `prices.yml` hämtar, så resten av det amerikanska universumet är **OKONTROLLERAT**. Ett exempel är Hut 8, som enligt 24/7 Wall St. 2026-11-03 rapporterar i veckan men inte finns i någon av repots filer. Alla datum är bevakningsposter enligt punkt 8, aldrig köpförslag. Det gäller särskilt `RIOT` i kväll efter tisdagens +18 %.

## Aktuella händelser & katalysatorer

- **Mellanårsvalet 2026-11-03:** CBS News, CNN och MS NOW projicerar demokratisk majoritet i båda kamrarna. CNN utropade senaten 23:35 ET, med minst 51 platser. Representanthuset utropades strax före 22:00 ET. Platsantal och enskilda lopp skiljer sig mellan källorna (CBS News, Washington Post och MS NOW live 2026-11-03/04). Någon terminsreaktion gick inte att verifiera ur repots filer.
- **AMD Q3 2026 (2026-11-03 efter stängning, bekräftat):** intäkter 13,4 mdr USD med data center ~+97 % och non-GAAP EPS 2,09. Q4-guiden är ~17 mdr ±3 % mot konsensus ~16,2–16,4 mdr, med bruttomarginal ~55 %. Aktien steg ~+8 % efterbörs (AMD Newsroom, CNBC och Investing.com 2026-11-03).
- **Arista Q3 2026 (2026-11-03 efter stängning, bekräftat):** intäkter ~3,66 mdr USD (+58,5 %) mot egen guide ~3,3 mdr. Justerat EPS 1,20 mot ~1,08, och Q4-guiden ligger över konsensus. Aktien steg +7–9 % efterbörs, enligt olika källor (Arista-pressmeddelande via Yahoo Finance och MarketScreener, GuruFocus 2026-11-03).
- **Supermicro Q1 FY27 (2026-11-03 efter stängning, bekräftat):** intäkter 19,95 mdr USD mot ~16,3–17,5 och justerat EPS 1,81 mot ~1,23. Bruttomarginalen var 12,8 % mot 9,5 % för ett år sedan, och helårsguiden höjs till 72–82 mdr. Aktien steg +7–10 % efterbörs (Supermicro-pressmeddelande via Yahoo Finance, Benzinga och Seeking Alpha 2026-11-03).
- **Fabrinet Q1 FY27 (2026-11-02, nu verifierat):** intäkter 1 474,5 MUSD mot 978,1 för ett år sedan och konsensus ~1,40 mdr. Justerat EPS 4,34 mot ~4,19, och data center +78 % till 777 MUSD. Q2-guiden är 1,60–1,65 mdr (Fabrinet-pressmeddelande via GlobeNewswire/StockTitan, Investing.com 2026-11-02). Reguljär stängning 2026-11-03 +15,45 % (prices.json).
- **Miners/AI-hosting studsade (2026-11-03):** `RIOT` +18,41 %, `CLSK` +13,99 %, `MARA` +11,35 % och `IREN` +11,08 % (prices.json). CleanSpark offentliggjorde ett 20-årigt hyresavtal för datacenter i Sandersville om 6,6 mdr USD (Benzinga och Finviz-rubriker 2026-11-03). I övrigt beskrivs rörelsen som en återhämtning efter måndagens ras. **Avtalet är inte verifierat ur primärkälla.** `CLSK` ligger 33,7 % under MA200 ⇒ inget case.

## Uppföljning av tidigare case

Kurserna "då" är reguljära stängningar 2026-11-02 i `state/price_history.json`. Kurserna "nu" är reguljära stängningar ur `state/prices.json`.
- **`PLTR` (rapport-261103): 178,34 → 175,40** (−1,65 %; marketTime 2026-11-03T21:00:00Z, dagslägsta 165,25). **Tes FÖRSVAGAD.** "Sell the news" höll i sig, och kursen ligger under MA50 (186,86) med RSI 35,8. US-boken avvisade kandidaten 2026-11-03 på grind 2.
- **`AAPL` (rapport-261103): 338,32 → 331,90** (−1,90 %; marketTime 2026-11-03T21:00:01Z). **Tes FÖRSVAGAD.** Marginalguiden väger tyngre än iPhone-volymen, och kursen ligger nu under MA50 (334,05). Kandidaten avvisades 2026-11-03 på grind 2.
- **`FN` (rapport-261103): 314,70 → 363,33** (+15,45 %; marketTime 2026-11-03T21:00:03Z, intervall 329,99–371,63). **Tes INTAKT** fundamentalt, och siffrorna är nu belagda (se ovan). **L-4:** `261103-FN` avvisades som *vilande* på omätbar grind 2 (1 historikpunkt). Serien bär nu **250 punkter**, och en kvalificerad post-event-kurs finns ⇒ US-boken ska ta ett nytt avgörande inom `expiresAt` 2026-11-10. Scouten noterar att kursen ligger **30,52 % under MA200** (522,91). Enligt `prompts/gemensam_korning.md` blockerar "kurs ≤ MA200" nya aktiepositioner.

**Kandidatkön (`state/scout_candidates.json`) före dagens tillägg:** 106 poster, varav 98 `rejected`, 8 `promoted` och 0 `new`. Utöver FN finns ingen vilande avvisning vars dataspärr har fyllts.

**Pending i US-boken (sessionen 2026-11-03, `state/prices.json`):**
- `NUE` ≤ 262,00: dagslägsta 271,615. **EJ TRIGGAD**, och planen går ut i dag 2026-11-04.
- `AXGN` ≤ 46,00: dagslägsta 49,18. **EJ TRIGGAD**, giltig t.o.m. 2026-11-05.
- `CBOE` ben 2 ≤ 325,00: dagslägsta 335,00. **EJ TRIGGAD**.

## Dagens case

### Case 1: Advanced Micro Devices (AMD / NASDAQ)
**Katalysator:** Q3 2026, släppt 2026-11-03 efter stängning (bekräftat). Intäkterna var 13,4 mdr USD, med data center nästan fördubblat på årsbasis. Non-GAAP EPS var 2,09, bruttomarginalen 54 % och rörelseresultatet 2,8 mdr. Q4-guiden är ~17 mdr ±3 % (+66 % å/å, +27 % kv/kv) mot konsensus ~16,2 mdr (LSEG) eller ~16,4 mdr, med non-GAAP bruttomarginal ~55 %. Data center väntas växa ~50 % sekventiellt (AMD Newsroom och SEC 8-K ex. 99.1 via websök; CNBC och Chartmill 2026-11-03).
**Bull case:** Guiden visar att Helios-racken och "Venice" skalar upp. En sekventiell acceleration på +27 % i ett bolag med 13 mdr i kvartalsintäkt är ovanligt. AMD tar andelar i AI-acceleratorer samtidigt som marginalen stiger.
**Bear case:** Q3-intäkterna var i linje snarare än ett klart slag. Klient och gaming väntas falla >20 % i Q4. Aktien har rasat från 649 till 484 på sex veckor, och sektorn är skör: måndagens SOX föll −3,35 %. AMD föll också efter beatet i augusti.
**Setup:** Senaste verifierade kurs **483,90** (reguljär stängning, marketTime 2026-11-03T21:00:02Z, `state/prices.json`). Den är **PRE-event**, och någon efterbörskurs finns inte i filen ⇒ `price: null` i kandidatkön. Kursen ligger 17,18 % över MA200 (412,94) men 11,8 % under MA50 (548,70). RSI är 38,4, och 250d-högsta 649,42 ligger 34 % ovanför. Kandidaten heter `261104-AMD` (`confirmed: true`).

### Case 2: Arista Networks (ANET / NYSE)
**Katalysator:** Q3 2026, släppt 2026-11-03 efter stängning (bekräftat). Intäkterna var ~3,66 mdr USD (+58,5 % å/å, +20,5 % kv/kv) mot egen guide ~3,3 mdr. Nettoresultatet blev 1,56 mdr, justerat EPS 1,20 mot ~1,08 och GAAP-EPS 1,22. Guiden för innevarande kvartal ligger över konsensus (Arista-pressmeddelande via Yahoo Finance och MarketScreener; GuruFocus och tradersagency 2026-11-03).
**Bull case:** Ett slag på 10 % mot egen guide visar att AI-backend-nätverken (Ethernet för GPU-kluster) växer snabbare än bolaget självt räknat med. Samma kväll levererade både AMD och SMCI, vilket bekräftar efterfrågan över hela kedjan.
**Bear case:** Efter augustirapporten (+3–4 % reaktion) föll aktien från 216 till 164, så marknaden har tidigare sålt på styrka. Kursen ligger bara 2,6 % över MA200, och kunden är koncentrerad till ett fåtal hyperscalers. Reaktionen är osäker: källorna anger +7 % respektive +9 %.
**Setup:** Senaste verifierade kurs **169,91** (reguljär stängning, marketTime 2026-11-03T21:00:03Z, `state/prices.json`). Den är **PRE-event** ⇒ `price: null`. Kursen ligger 2,64 % över MA200 (165,54) och 12,6 % under MA50 (194,36), med RSI 38,5. 250d-högsta är 216,74. Kandidaten heter `261104-ANET` (`confirmed: true`).

### Case 3: Super Micro Computer (SMCI / NASDAQ)
**Katalysator:** Q1 FY27, släppt 2026-11-03 efter stängning (bekräftat). Intäkterna var 19,95 mdr USD mot konsensus ~16,3–17,5 mdr, och justerat EPS 1,81 mot ~1,23. Non-GAAP bruttomarginal 12,8 % mot 9,5 %, och AI-andelen ~71 %. Kvartalsguiden är 19,5–21,5 mdr, och FY27-guiden höjs till 72–82 mdr mot ~69,2 mdr väntat (Supermicro-pressmeddelande via Yahoo Finance; Benzinga, Seeking Alpha och BigGo 2026-11-03).
**Bull case:** Intäkterna nästan fyrdubblades, och bruttomarginalen steg 3,3 punkter, vilket möter den största invändningen mot bolaget (låga marginaler). Guidehöjningen är kraftig.
**Bear case:** Det spretiga guideintervallet (72–82 mdr) visar osäkerhet. Bolaget har haft redovisnings- och styrningsproblem tidigare, och marginalen är fortfarande tunn. **Kursen ligger 3,91 % UNDER MA200**, och enligt `prompts/gemensam_korning.md` blockerar "kurs ≤ MA200" nya aktiepositioner, om inte reaktionen lyfter kursen över 32,67.
**Setup:** Senaste verifierade kurs **31,39** (reguljär stängning, marketTime 2026-11-03T21:00:01Z, `state/prices.json`). Den är **PRE-event** ⇒ `price: null`. Benzinga anger en efterbörskurs på ~34,46, men den kommer ur en artikel och används inte. MA200 är 32,67 och MA50 38,02, med RSI 38,5. 250d-högsta är 50,17. Kandidaten heter `261104-SMCI` (`confirmed: true`).

## Makro- & sektorfaktorer att bevaka

**Räntor:** Tre siffror stärker höjningsdiskussionen inför december: JOLTS 7,52 mn över väntat, ISM tillverkning 55,5 med prices paid 75,2 och kärn-PCE 3,1 %. Det är motvind för långduration-tillväxt och krypto. ADP och ISM tjänster i dag samt NFP på fredag avgör. DXY och statsobligationsräntorna gick inte att verifiera (åtgärdspunkt 4).

**Politik:** Med en demokratisk kongress blir den finanspolitiska vägen fram till 2028 en förhandling. Marknaden har historiskt mottagit delad makt väl, eftersom den minskar lagstiftningsrisken. För sektorer med regleringsexponering (läkemedelspriser, krypto, försvar) ökar dock osäkerheten. Utfallet är inte slutligt räknat.

**Regim:** `^GSPC` ligger 3,46 % över MA200 och regimen är PÅ. `^IXIC` återhämtade sig till 1,19 % över MA200 men är fortfarande under MA50. Marginalen är tunn.

**Sektorrotation:** Tisdagen vände måndagens flykt från AI-hårdvara (SOX +2,6 %), men bredden var negativ. Det var ett fåtal tunga namn som bar indexet. Om kvällens tre AI-hårdvarurapporter håller i den reguljära sessionen bekräftas efterfrågesidan. Kapitalintensitetsfrågan, med Oracles och Marvells utspädning i måndags, kvarstår däremot.

**Binära händelser:** `RIOT` och `NVO` m.fl. rapporterar i kväll, ADP och ISM tjänster i dag och NFP på fredag. Inget av dagens case får köpas *in i* en händelse (punkt 8). Alla tre bygger på redan släppta rapporter, men kursen måste vara post-event och verifierad innan en bok kan pröva dem.

**Krypto:** BTC ligger 6,00 % över MA200 och ETH 5,92 %, båda med RSI ~37–38 och under MA50. Valutfallet och höjningsrisken ger inget kryptocase i dag. Minersrörelsen är AI-hostingdriven, inte kryptodriven.

**Watchlist-hygien:** `config/watchlist_us.txt` bär långt fler symboler än riktmärket 25, men ingen rensning görs i dag. Följande skyddas enligt `prompts/gemensam_korning.md`: veckans rapportbolag, CBOE-innehavet, de tre pending-planerna, de giltiga kandidaterna (`261103-*`, `261104-*`) och besluten inom utvärderingens 20-dagarsfönster. `AMD`, `ANET` och `SMCI` finns redan, så inga tillägg behövs.

### Åtgärdspunkter till Dren (L-3)

1. **`us-rotation-lage-a-missed` (öppen, `weeksOpen` 4) och `scheduled-actions-not-firing` (öppen, 9) – ÅTERKOMMANDE, i dag utan effekt för scouten.** Kurser (`generatedAt` 01:21Z) och nyheter (01:26Z) var färska. Punkterna noteras eftersom de står öppna i `state/action_items.json`.
2. **`crypto-previousclose-misdated` – ÅTERKOMMANDE.** `quotes["BTC-USD"].previousClose` är 76 677,30 mot daterad punkt 2026-11-03 77 797,46, och `ETH-USD` 2 248,89 mot 2 292,33. Fältet ger **+0,15 % respektive +0,52 %** i stället för korrekta **−1,29 % respektive −1,38 %**, alltså **fel tecken**. **Omfång:** 2 av 2 mynt. **Ersättningskälla:** `state/price_history.json`.
3. **`news-feed-globenewswire-http-403` – ÅTERKOMMANDE.** `feeds.globenewswire` och `feeds.globenewswire-earnings` ger `"HTTP 403 – båda försöken (0.1 s)"`. Fabrinets rapport låg på just GlobeNewswire och nådde aldrig `news_feed.json`. **Omfång:** 2 av 6 flöden. **Ersättningskälla:** websök.
4. **`macro-calendar-not-verifiable-from-state` – ÅTERKOMMANDE.** JOLTS-utfallet, ADP- och ISM-datumen, NFP-konsensus och valresultatet kommer alla ur websök. `www.sec.gov` gav DNS-fel i tunneln (`ENOTFOUND`) i dag också, så 8-K-exhibits gick inte att läsa direkt. **Omfång:** samtliga makrovärden plus olja, DXY och 10-årsränta (`CL=F`, `DX-Y.NYB`, `^TNX` saknas i `state/prices.json`). **Föreslagen fix:** som tidigare – lägg till symbolerna i `config/watchlist_us.txt` och tillåt `sec.gov`/`bls.gov` i miljöns nätverksinställningar.
5. **Efterbörskurser saknas för kvällens rapportbolag (ny observation).** `state/prices.json` (`extendedCount` 37) bär efterbörspunkter för t.ex. `AKAM`, `NET`, `TEAM` och `UTHR`, men **inte** för `AMD`, `ANET` eller `SMCI`, som rapporterade 2026-11-03 efter stängning. **Omfång:** 3 av 3 av dagens case, och därmed `price: null` på alla tre kandidater. `refresh-candidate-prices.mjs` fyller i kursen först vid nästa kvalificerade notering (förbörs eller reguljär 2026-11-04).

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
