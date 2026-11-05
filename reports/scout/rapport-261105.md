# Daglig Scout: USA & Krypto
**Datum:** 2026-11-05
**Marknadsklimat:** Det är torsdag före öppning. Onsdagen gav en bred lättnadsrally efter att demokraterna tagit båda kamrarna i mellanårsvalet: `^GSPC` steg +1,58 % och Dow Jones +3,03 %, dess bästa dag sedan april 2025 (StockTitan och Closing Look 2026-11-04). Samtidigt splittrades AI-handeln. Hyperscalers steg (`MSFT` +6,68 %, `AMZN` +6,12 %, `AAPL` +5,31 % till rekord), medan AI-kraft och datacenteroperatörer föll kraftigt på oro för hårdare datacenterreglering (`VST` −13,83 %, `VRT` −12,89 %, `IREN` −11,24 %). Oljan föll och dollarn försvagades. Krypto har återhämtat sig till ~80 000. **Aktiva lärdomar tillämpade:** L-3 (åtgärdspunkter sist), L-4 (inga vilande avvisningar att ompröva, se uppföljningen), L-5 (kalenderns täckning) och L-6 (inga klasser utesluts). L-1, L-2, L-7 och L-8 gäller inte scouten.

## Marknadsöversikt

`git pull` kördes 2026-11-05 05:48 UTC (06:48 CET): HEAD = `origin/main` = `03a224c`. Källan är `state/prices.json` med `generatedAt` 2026-11-05T01:29:40Z, `schemaVersion` 2026-08-02-prevclose, `tickerCount` 306 och `okCount` 301 (Yahoo Finance chart API via GitHub Actions). Hämtningen var bred (`wideAt` = `generatedAt`). Nyhetsflödet (`state/news_feed.json`) har `generatedAt` 2026-11-05T01:30:00Z och täcker 10 av 10 handelsdagar.

| Symbol | Senaste verifierade nivå | Rörelse | marketTime |
|---|---|---|---|
| `^GSPC` | 7 688,62 | +1,58 % (7 568,92 → 7 688,62) | 2026-11-04T21:51:11Z |
| `^IXIC` | 25 736,51 | +1,44 % (25 372,01 → 25 736,51) | 2026-11-04T22:15:59Z |
| `BTC-USD` | 80 348,72 | −0,05 % mot daterad punkt 2026-11-04 (80 388,20); +4,63 % mot gårdagens rapport (76 794,98) | 2026-11-05T01:28:02Z |
| `ETH-USD` | 2 413,54 | −0,41 % mot daterad punkt 2026-11-04 (2 423,58); +6,77 % mot gårdagens rapport (2 260,61) | 2026-11-05T01:28:21Z |
| `SPY` (sleeve) | 766,81 | +1,65 % (754,35 → 766,81) | 2026-11-04T21:00:00Z |

Kryptorörelserna är räknade mot den daterade punkten i `state/price_history.json`, inte mot `previousClose`. Fältet ger fortfarande ett felaktigt tal i dag (åtgärdspunkt 2).

**Onsdagens bredd bland de hämtade US-symbolerna:** 123 symboler hade marketTime 2026-11-04 i `state/prices.json`. Resten av marknaden är OKONTROLLERAD enligt L-5.
- **Bäst:** `CNC` +12,64 %, `RIOT` +9,63 %, `PCVX` +8,01 %, `LOW` +7,50 %, `CCL` +7,26 %, `DAL` +7,16 %, `TLX` +7,09 %, `FIVE` +6,70 %, `MSFT` +6,68 % och `HD` +6,53 %.
- **Sämst:** `AESI` −17,32 %, `CLSK` −16,56 %, `VST` −13,83 %, `VRT` −12,89 %, `IREN` −11,24 %, `CRGY` −9,84 %, `CIEN` −9,28 %, `RIG` −7,63 %, `DVN` −7,35 % och `MRVL` −7,08 %.

Mönstret är tydligt. Konsument, resor och vård (lägre olja, lägre räntor och väntad ACA-politik) steg, och energi föll med oljan. Allt som säljer kraft eller kapacitet till AI-datacenter föll, medan de som köper kapaciteten (hyperscalers) steg.

**Teknik** (räknad på råserien i `state/price_history.json`, sista punkt 2026-11-04):
- `^GSPC` ligger 5,03 % över MA200 (7 320,32) ⇒ **regimfiltret för US-boken är fortsatt PÅ**. Kursen ligger i nivå med MA50 (7 692,97), med RSI 50,4.
- `^IXIC` ligger 2,59 % över MA200 (25 087,08), upp från 1,19 % i går, men 3,0 % under MA50 (26 533,36). RSI är 42,2.

## Ekonomiska siffror & kalender

**Senaste utfall:**
- **ADP oktober (2026-11-04): +86 000 privata jobb** mot ~69 000 (Reuters-enkäten) och ~75 000 (Dow Jones). Lönetillväxten för de som stannar på jobbet var 3,2 % å/å och för jobbbytare 7,6 % (Reuters via Investing.com och Quartz 2026-11-04).
- **ISM tjänster oktober (2026-11-04): 54,5** mot 54,9 föregående och konsensus ~54,7–54,8, alltså något svagare än väntat men 28:e expansionsmånaden i rad. New orders föll 3,9 punkter till 55,9, och prices var oförändrat på 73,0 (ISM via PR Newswire/Morningstar 2026-11-04; komponenterna ur verifiedinvesting, enkällsuppgift).
- **Räntor/valuta (2026-11-04):** 10-årsräntan föll till ~4,89–4,93 % beroende på källa och tidpunkt. DXY stängde på 101,48 (−0,38 %), ett enmånadslägsta. Terminerna prisade **~81 % sannolikhet för en höjning i december** (CNBC, EBC och Rio Times 2026-11-04; nivåerna kommer ur websök, inte ur repots filer).
- Oförändrat från tidigare rapporter: JOLTS september 7,52 mn, ISM tillverkning 55,5 (prices paid 75,2), kärn-PCE september 3,1 % och BNP Q3 +3,4 %.

**Kommande:**
- **I dag 2026-11-05:** jobless claims kl. 08:30 ET (14:30 CET).
- **Fredag 2026-11-06, 08:30 ET (14:30 CET): NFP oktober – VECKANS MEST MARKNADSRÖRANDE.** Reuters-enkäten väntar sig ~64 000 privata jobb och konsensus för totalen är ~65 000 (Reuters via Investing.com 2026-11-04, Kitco 2026-10-30). Med ADP över väntan och ISM-priserna kvar på 73 avgör den om decemberhöjningen blir ett faktum.

**Rapporter nästa 5 handelsdagar** ur `state/earnings_calendar.json` (`generatedAt` 2026-11-05T01:27:48Z, `errors` tomt), US-symboler:
- 11-05: `AKAM`, `DVN`, `EVCM`, `IREN`, `KMB`, `NET`, `TEAM` och `U`, samt `SYNA` och `WBD` (båda `isEstimate: true`)
- 11-06: `VST`. Det är veckans politiskt laddade rapport efter onsdagens ras, med en uppdaterad 2027-prognos (Investing.com 2026-11-04).
- 11-09: `ACHR`, `CEG`, `KKR` och `MARA`
- 11-12: `AMAT`

**L-5:** kalendern ser bara de symboler som `prices.yml` hämtar, så resten av det amerikanska universumet är **OKONTROLLERAT**. Ett exempel är AppLovin, Coherent, Qualcomm och Arm, som alla rapporterade 2026-11-04 utan att finnas i någon av repots kurs- eller kalenderfiler (`APP` och `COHR` läggs till i dag, se casen). Alla datum är bevakningsposter enligt punkt 8, aldrig köpförslag.

## Aktuella händelser & katalysatorer

- **Mellanårsvalet (2026-11-03/04):** Fox News Decision Desk, CBS och CNN projicerar demokratisk kontroll över båda kamrarna (EnergyNow och Rio Times 2026-11-04). I Texas valdes demokraten Gina Hinojosa till guvernör. KeyBanc pekar på det som skälet till oro för hårdare regler mot datacenter i Texas (ERCOT) och sänkte `VST` till Sector Weight (Investing.com och Yahoo Finance 2026-11-04).
- **AI-handeln splittrades (2026-11-04):** `VST` −13,83 %, `VRT` −12,89 % och `CEG` −6,71 %. Hut 8 föll ~23 %, `IREN` −11,24 % och Core Scientific ~−10 %. Samtidigt steg `MSFT` +6,68 % och `AMZN` +6,12 %, deras största dagsuppgång sedan juli enligt Reuters, och `AAPL` +5,31 % till rekord. Tolkningen i flera källor är att långsammare utbyggnad av datacenter gynnar de etablerade molnjättarna och missgynnar leverantörerna av kraft och kapacitet (Yahoo Finance, Invezz och TradingKey 2026-11-04; prices.json).
- **Oljan föll (2026-11-04):** WTI låg under 95 USD och Brent nära 102 tidigt på dagen. Dagens samlade fall anges till upp mot 8 % i vissa källor, men nivåerna skiljer sig åt. Drivkrafterna var valutfallet och förhoppningar om en lösning i Iran-konflikten (EnergyNow, Forbes och Trading Economics 2026-11-04). Energisektorn föll ~4,8 %.
- **AppLovin Q3 2026 (2026-11-04 efter stängning, bekräftat):** intäkter 2,18 mdr USD (+55 %), EPS 4,30, Q4-guide 2,37–2,40 mdr och utökat återköp. Aktien steg ~+22 % efterbörs (SEC 8-K, Chartmill och MarketBeat 2026-11-04). → Case 1.
- **Coherent Q1 FY27 (2026-11-04 efter stängning, bekräftat):** intäkter 2,37 mdr USD (+50 %) och non-GAAP EPS 2,09 mot 1,99, med datacenter +85 %. Aktien steg ~+7 % efterbörs (GuruFocus, Converge Digest och Benzinga 2026-11-04). → Case 2.
- **Qualcomm FQ4 (2026-11-04 efter stängning):** slog estimaten men föll ~6,5 % efterbörs. **Arm** slog också (justerat EPS 0,52 mot 0,47) men föll ~2 % (CNBC via websök 2026-11-04). Det fanns inget case, eftersom reaktionen var negativ. Ingen av dem finns i `prices.json`.

## Uppföljning av tidigare case

Kurserna "då" är reguljära stängningar 2026-11-03 (PRE-event, före rapporterna samma kväll). Kurserna "nu" är reguljära stängningar ur `state/prices.json`.
- **`AMD` (rapport-261104): 483,90 → 488,78** (+1,01 %; marketTime 2026-11-04T21:00:00Z, intervall 476,50–514,61). **Tes FÖRSVAGAD.** Efterbörsuppgången på ~8 % höll inte: kursen nådde 514,61 men stängde bara +1 %. Kursen ligger fortfarande under MA50 (548,90) med RSI 39,5. US-boken avvisade `261104-AMD` 2026-11-04 på grind 2.
- **`ANET` (rapport-261104): 169,91 → 178,48** (+5,04 %; marketTime 2026-11-04T21:00:03Z, intervall 177,00–188,51). **Tes INTAKT.** Kursen höll större delen av reaktionen, och avståndet till MA200 växte till 7,65 %. Den ligger dock under MA50 (194,12). Kandidaten avvisades 2026-11-04 på grind 2.
- **`SMCI` (rapport-261104): 31,39 → 29,60** (−5,70 %; marketTime 2026-11-04T21:00:01Z, intervall 29,39–32,74). **Tes PUNKTERAD.** Marknaden sålde trots ett kraftigt slag och höjd guide, och kursen ligger nu 9,36 % under MA200 (32,66). Det blockerar nya aktiepositioner enligt `prompts/gemensam_korning.md` ("Saknad MA200 eller kurs ≤ MA200 blockerar nya aktiepositioner").

**Kandidatkön (`state/scout_candidates.json`) före dagens tillägg:** 109 poster, varav 101 `rejected`, 8 `promoted` och 0 `new`. **L-4:** ingen avvisad post inom `expiresAt` har en datamässig spärr som nu fyllts. FN (`261103-FN`) omprövades redan 2026-11-04 och avvisades på MA200, som är en omdömes-/regelspärr. Dagens tillägg är `261105-APP` och `261105-COHR`, båda `new`.

**Pending i US-boken (sessionen 2026-11-04, `state/prices.json`):**
- **`NUE` ≤ 262,00: dagslägsta 260,405 (marketTime 2026-11-04T21:00:03Z, stängning 267,91) – VILLKORET NÅTT INTRADAG på planens femte och sista giltighetsdag.** US-rotationen (15:00 CET) ska avgöra fyllnaden enligt sina regler. Notera att `state/alerts.json` (`checkedAt` 2026-11-04T21:43:23Z) inte bär något larm för NUE, bara `KOG.OL` (åtgärdspunkt 5).
- `AXGN` ≤ 46,00: dagslägsta 50,08. **EJ TRIGGAD**, sista giltighetsdag i dag 2026-11-05.
- `CBOE` ben 2 ≤ 325,00: dagslägsta 336,25. **EJ TRIGGAD**, giltig t.o.m. 2026-11-06. CBOE-innehavet stängde på 345,21, över stoppen 316,00.

## Dagens case

### Case 1: AppLovin (APP / NASDAQ)
**Katalysator:** Q3 2026, släppt 2026-11-04 efter stängning (bekräftat):
- Intäkter 2,18 mdr USD (+55 % å/å), nettoresultat 1,44 mdr (+72 %) och utspätt EPS 4,30.
- Justerad EBITDA 1 842 MUSD (+59 %, 84 % marginal) och fritt kassaflöde 1,4 mdr.
- Bolaget säger att både intäkter och EBITDA landade "well above the high end of our guidance".
- Q4-guiden är 2,37–2,40 mdr USD (+43–44 % å/å), och återköpsmandatet utökas med 3,2 mdr.
- Aktien steg ~+22 % efterbörs till ~331 USD, efter +10,69 % till 271,75 under den reguljära sessionen (AppLovin 8-K ex. 99.1 på SEC 2026-11-04; Chartmill och MarketBeat 2026-11-04).

**Bull case:** Annonsplattformen växer över 40 % med en EBITDA-marginal på 84 %, och kassaflödeskonverteringen steg från 53 % till 77 % på ett kvartal. Det är kapitallätt AI-tillväxt, alltså raka motsatsen till den kapitalintensiva AI-infrastruktur som marknaden sålde i går. Det stora återköpet ger stöd.
**Bear case:** Konsensusjämförelsen är omtvistad. MarketBeat har ett slag (EPS 4,30 mot 4,03, intäkter 2,18 mot 2,07), medan GuruFocus redovisar en miss mot 4,43 respektive 2,25 mdr. Ett gap på 20 %+ efter en rally på +10,7 % samma dag är en klassisk risk för att reaktionen backar, och tillväxttakten saktar ner (+55 % → +43–44 %). Bolaget har tidigare fallit kraftigt efter starka rapporter (februari 2026).
**Setup:** **KURS EJ VERIFIERAD.** `APP` saknar rad i `state/prices.json` och har noll punkter i `state/price_history.json`, och kurserna ovan kommer ur artiklar som inte används för beslut. Varken MA200, MA50 eller RSI går att räkna. Kandidaten är `261105-APP` (`confirmed: true`, `price: null`). `APP` läggs till i `config/watchlist_us.txt` så att kurs hämtas från nästa körning (L-2). Backfillen behövs för grind 2 (L-4: vilande om den avvisas på data).

### Case 2: Coherent (COHR / NYSE)
**Katalysator:** Q1 FY27, släppt 2026-11-04 efter stängning (bekräftat):
- Intäkter 2,37 mdr USD (+50 % å/å, +56 % proforma) mot ~2,31 mdr väntat.
- Non-GAAP EPS 2,09 (+80 %) mot 1,99 (FactSet), och non-GAAP bruttomarginal 40,6 %.
- Datacenter & kommunikation 1,95 mdr (+79 %, 82 % av försäljningen), varav datacenter +85 %.
- Q2-guiden är 2,55–2,75 mdr, och för FY27 väntas >60 % proformatillväxt. Det första kvartalet över 3 mdr väntas före räkenskapsårets slut.
- Aktien steg ~+7 % efterbörs (GuruFocus, Converge Digest och Benzinga 2026-11-04; pressmeddelandet lästes inte direkt).

**Bull case:** Optisk transceiver- och lasertillverkning är en av de mest direkta AI-efterfrågeindikatorerna, och siffrorna bekräftar Fabrinets (`FN`) kvartal från 2026-11-02 samt Aristas från 2026-11-03. Guiden stiger sekventiellt med 8–16 %. Optiken sitter inne i datacentret och är därför mindre exponerad mot den kraft-/regleringsoro som fällde `VST` och `VRT`.
**Bear case:** Det är samma AI-hårdvaruklunga som visat svaga reaktioner hela veckan: `SMCI` −5,70 % och `AMD` +1,01 % trots slag, och `FN` ligger 34,58 % under MA200. Benzinga beskriver rörelsen som att aktien "rallies back", alltså efter ett tidigare fall. GuruFocus lyfter värderingsoro. Nästa kvartalsguide är bred (200 MUSD spann).
**Setup:** **KURS EJ VERIFIERAD.** `COHR` saknar rad i `state/prices.json` och har noll punkter i `state/price_history.json`. Ingen teknisk bedömning är möjlig, och ingen kurs ur artiklar används. Kandidaten är `261105-COHR` (`confirmed: true`, `price: null`). `COHR` läggs till i `config/watchlist_us.txt` (L-2).

## Makro- & sektorfaktorer att bevaka

**Räntor:** ADP över väntan, ISM-priserna kvar på 73 och terminer som prisar ~81 % för en decemberhöjning ger fortsatt motvind för långduration. 10-årsräntan föll dock i går (~4,9 %), när marknaden läste en demokratisk kongress som mindre finanspolitisk expansion. NFP på fredag är veckans test.

**Politik:** En demokratisk kongress har historiskt mottagits väl som delad makt. Den nya riskfaktorn är delstatlig: datacenterreglering och elpriser (Texas/ERCOT). Den drabbar handelsbolag inom kraft (`VST`, `CEG`), datacenterleverantörer (`VRT`) och miners som byggt om till AI-hosting (`IREN`, `CLSK`, `AESI`). Vård (ACA-subventioner, `CNC` +12,64 %) och förnybart gynnas.

**Regim:** `^GSPC` ligger 5,03 % över MA200, och regimen är PÅ. `^IXIC` ligger 2,59 % över MA200 men under MA50.

**Sektorrotation:** AI-handeln har gått från "allt AI" till en uppdelning. Kapitallätta mjukvaru- och plattformsbolag och hyperscalers (`MSFT`, `AMZN`, `APP` efterbörs) premieras, medan kapitalintensiva leverantörer av kraft och kapacitet straffas. Det talar för dagens två case i olika grad: `APP` ligger i den premierade gruppen, och `COHR` sitter mittemellan.

**Binära händelser:** I kväll rapporterar `NET`, `TEAM`, `AKAM`, `IREN`, `DVN`, `U` m.fl. På fredag kommer NFP och `VST`. Inget av dagens case får köpas *in i* en händelse (punkt 8). Båda bygger på redan släppta rapporter, men kursen måste vara verifierad och ligga efter katalysatorn innan en bok kan pröva dem.

**Krypto:** BTC ligger 10,77 % över MA200 (72 535) och ETH 12,95 % (2 137), båda med RSI ~50–51 men strax under MA50. Den svagare dollarn och lättnadsrallyt lyfte mynten med 4–7 % på ett dygn. Det finns ändå ingen bolags- eller protokollkatalysator, så inget kryptocase i dag. Minersrörelsen är fortsatt AI-hostingdriven: `RIOT` +9,63 % mot `IREN` −11,24 % och `CLSK` −16,56 % samma dag.

**Watchlist-hygien:** `config/watchlist_us.txt` bär långt fler symboler än riktmärket 25, men ingen rensning görs i dag. Följande skyddas enligt `prompts/gemensam_korning.md`: veckans rapportbolag, CBOE-innehavet, de tre pending-planerna, de giltiga kandidaterna (`261103-*`, `261104-*`, `261105-*`) och besluten inom utvärderingens 20-dagarsfönster. `APP` och `COHR` läggs till.

### Åtgärdspunkter till Dren (L-3)

1. **`us-rotation-lage-a-missed` (öppen, `weeksOpen` 4) och `scheduled-actions-not-firing` (öppen, 9) – ÅTERKOMMANDE, i dag utan effekt för scouten.** Kurser (`generatedAt` 01:29Z) och nyheter (01:30Z) var färska.
2. **`crypto-previousclose-misdated` – ÅTERKOMMANDE.** `quotes["BTC-USD"].previousClose` är 77 345,05 mot daterad punkt 2026-11-04 80 388,20, och `ETH-USD` 2 272,73 mot 2 423,58. Fältet ger **+3,88 % respektive +6,20 %** i stället för korrekta **−0,05 % respektive −0,41 %**: det mäter ungefär ett dygn för mycket. **Omfång:** 2 av 2 mynt. **Ersättningskälla:** `state/price_history.json`.
3. **`news-feed-globenewswire-http-403` – ÅTERKOMMANDE.** `feeds.globenewswire` och `feeds.globenewswire-earnings` ger `"HTTP 403 – båda försöken (0.0 s)"`. Ingen av gårdagens fyra stora efterbörsrapporter (AppLovin, Coherent, Qualcomm, Arm) finns bland `news_feed.json`:s 112 poster efter 2026-11-04 13:00 UTC. **Omfång:** 2 av 6 flöden. **Ersättningskälla:** websök.
4. **`macro-calendar-not-verifiable-from-state` – ÅTERKOMMANDE.** ADP, ISM tjänster, räntenivåer, DXY, olja, valresultatet och NFP-konsensus kommer alla ur websök. Källorna gav dessutom motstridiga oljenivåer (Brent ~95 respektive ~102 USD). WebFetch mot `thestreet.com` och `cnbc.com` gav `ENOTFOUND` (utanför sessionens tillåtna domäner). **Omfång:** samtliga makrovärden plus `CL=F`, `DX-Y.NYB` och `^TNX`, som saknas i `state/prices.json`. **Föreslagen fix:** som tidigare – lägg till symbolerna i `config/watchlist_us.txt` och tillåt `sec.gov`/`bls.gov`/`cnbc.com` i miljöns nätverksinställningar.
5. **NUE-planens villkor nåddes intradag utan larm (ny observation).** `state/prices.json` visar `NUE` dayLow **260,405** ≤ 262,00 i sessionen 2026-11-04 (planens sista giltighetsdag), men `state/alerts.json` (`checkedAt` 2026-11-04T21:43:23Z) har bara `KOG.OL` i `active`. Orsaken syns i samma fil: `watched` är `["KOG.OL","SPY","CBOE"]`. `alerts.mjs` läser visserligen `state/portfolj_us.md` (rad 130), men ingen av US-bokens tre pending-planer (`NUE`, `AXGN`, `CBOE` ben 2) tolkas som bevakad. **Omfång:** 3 av 3 US-pending-planer saknar intradaglarm, och 1 av dem nådde sitt villkor. **Åtgärd:** US-rotationen ska avgöra fyllnaden i dag, och pending-tolkningen av `portfolj_us.md` i `.github/scripts/alerts.mjs` behöver felsökas.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
