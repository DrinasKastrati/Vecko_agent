# Daglig Scout: USA & Krypto
**Datum:** 2026-11-13
**Marknadsklimat:** Ryktet från i går blev verklighet. Nvidia meddelade före öppning den 12/11 att Jensen Huang lämnar som vd med omedelbar verkan. NVDA föll som mest ~14 % och stängde −4,34 %. S&P 500 och Nasdaq tappade bara −0,35 % respektive −0,39 %, eftersom AMD (+5,86 %) och AVGO (+5,54 %) bar halvledarna. Krypto försvagas: BTC har gått under MA200 (−2,4 %) med RSI 28,9, och ETF-utflödena fortsätter. I dag kommer PPI efter förra veckans varma KPI. **Aktiva lärdomar tillämpade:** L-2 (nya kandidater utan post-eventkurs dokumenteras med `price: null`), L-3 (åtgärdspunkter sist), L-4 (kandidatkön kontrollerad), L-5 (kalenderns och flödets täckning) och L-6 (ingen klass utesluts). L-1, L-7 och L-8 gäller inte scouten.

## Marknadsöversikt

`git pull` kördes 2026-11-13 05:48 UTC (06:48 CET): HEAD = `origin/main` = `1726bb0`. Källan är `state/prices.json` med `generatedAt` 2026-11-13T01:50:40Z, `schemaVersion` 2026-08-02-prevclose, `tickerCount` 321 och `okCount` 316 (Yahoo Finance chart API via GitHub Actions). `wideAt` 2026-11-13T01:50:40Z visar att dygnets breda hämtning har kört. Nyhetsflödet (`state/news_feed.json`) har `generatedAt` 2026-11-12T21:51:04Z och täcker **10 av 10 handelsdagar** (2026-10-30 – 2026-11-12, `missingDays` tomt).

| Symbol | Nivå | Rörelse | marketTime |
|---|---|---|---|
| `^GSPC` | 7 592,40 | **−0,35 %** (7 619,38 → 7 592,40); dagsintervall 7 550,84–7 652,76 | 2026-11-12T21:58:23Z |
| `^IXIC` | 25 366,09 | **−0,39 %** (25 466,19 → 25 366,09); dagsintervall 25 068,28–25 597,23 | 2026-11-12T22:15:59Z |
| `BTC-USD` | 70 882,71 | −0,73 % mot daterad punkt 2026-11-12 (71 401,99); −4,07 % mot 2026-11-11 (73 890,50) | 2026-11-13T01:49:07Z |
| `ETH-USD` | 2 010,93 | −0,06 % mot daterad punkt 2026-11-12 (2 012,13); −2,21 % mot 2026-11-11 (2 056,31) | 2026-11-13T01:49:27Z |
| `SPY` (sleeve) | 757,12 | −0,35 % (759,81 → 757,12) | 2026-11-12T21:00:00Z |

Dagsrörelserna för krypto är räknade mot daterade punkter i `state/price_history.json`, eftersom `previousClose` för BTC (73 964,47) och ETH (2 055,88) fortfarande inte stämmer med någon daterad punkt (åtgärdspunkt 1).

**Teknik** (räknad på råserien i `state/price_history.json`, sista aktiepunkt 2026-11-12):
- `^GSPC` ligger **3,48 % över MA200** (7 337,33) och strax under EMA20 (7 604,83) och MA50 (7 671,18). RSI är 48,4 och MACD-histogrammet −3,20 (i går −9,25). ⇒ **Regimfiltret för US-boken är PÅ.**
- `^IXIC` ligger **0,94 % över MA200** (25 130,11), så marginalen har krympt från +1,37 %. Index ligger under EMA20 (25 681,57) och MA50 (26 379,03), med MACD-histogram −26,22.
- **`BTC-USD` ligger nu 2,40 % UNDER MA200** (72 629,44, i går 1,5 % över), med RSI 28,9 och MACD-histogram −694. **`ETH-USD` ligger 5,76 % under MA200** (2 133,82), med RSI 29,1.

## Ekonomiska siffror & kalender

**Senaste utfall:**
- **Jobless claims (vecka t.o.m. 2026-11-07, publicerade 2026-11-12):** **200 000** mot väntade ~195 000. Föregående vecka reviderades upp till 191 000, och fyraveckorssnittet är oförändrat på 195 250. Continuing claims föll −20 000 till 1,697 miljoner. Nivån är den högsta på en månad men fortfarande historiskt låg (FXStreet, Quartz och verifiedinvesting 2026-11-12). Marknaden reagerade inte nämnvärt.
- **KPI oktober (2026-11-10):** Totalen steg +0,4 % m/m och kärnan +0,3 %, båda 0,1 pp över förväntan (se rapport-261111). En räntehöjning i december är fortfarande marknadens basfall. FedWatch-odds är inte verifierade i dag.
- **Fed (2026-11-12):** Fed publicerade det preliminära FOMC-schemat för 2027 och en prislista för betaltjänster (`news_feed.json`, källa fed-press). Inget räntebesked.

**Kommande (nästa 1–5 handelsdagar):**
- **I dag fre 2026-11-13: PPI oktober 08:30 ET (14:30 CET) – DAGENS OCH VECKANS MEST MARKNADSRÖRANDE.** Datum och tid är bekräftade (Crypto.com market update 2026-11-12). Konsensus är inte verifierad i dag; FXEmpire angav +0,4 % m/m 2026-11-08 (se rapport-261112). Siffran kommer efter ett varmt KPI.
- **Tis 2026-11-17:** **Nvidia rapporterar** sin första rapport utan Huang (konsensus EPS 2,48, intäkter ~109,0 mdr USD). Samma dag rapporterar `HD` (EPS 3,84).
- **Ons 2026-11-18:** `TGT` och `LOW`. **Tor 2026-11-19:** `WMT` och `ROST`.

**Rapporter nästa 10 handelsdagar** ur `state/earnings_calendar.json` (`generatedAt` 2026-11-13T01:48:52Z, `errors` tomt), US-symboler:
- **11-17:** `NVDA` och `HD`. **11-18:** `TGT` och `LOW`. **11-19:** `WMT` och `ROST`.
- **11-23:** `HPE`. **11-24:** `CLSK` (gissat datum, `isEstimate`). **11-25:** `DE`.

**L-5:** Kalendern ser bara de 321 symboler som `prices.yml` hämtar. Resten av det amerikanska universumet är **OKONTROLLERAT**. Samtliga datum är bevakningsposter enligt punkt 8, aldrig köpförslag.

## Aktuella händelser & katalysatorer

- **Nvidia (`NVDA`): vd-avgången är BEKRÄFTAD, 2026-11-12 före öppning.** Bolaget meddelade att Jensen Huang lämnar posterna som president, vd och styrelseledamot med omedelbar verkan. CFO Colette Kress blir tillförordnad vd och behåller CFO-rollen. Harvey C. Jones blir bolagets första styrelseordförande. Enligt 8-K:n accepterade styrelsen avgången 2026-11-11 (NVIDIA Form 8-K, SEC, signerad 2026-11-12; TechCrunch 2026-11-12 06:10 PST; CNBC 2026-11-12). Aktien föll mer än 13 % tidigt i handeln men återhämtade sig och stängde på **166,19 (−4,34 %)**. Dagslägsta var 148,80 och volymen 4,58× 20-dagarssnittet (prices.json, marketTime 2026-11-12T21:00:01Z). Bernstein sänkte riktkursen från 400 till 200 (CNBC 2026-11-12). Yahoo Finance rapporterade under kvällen nya uppgifter om en tredje affär. Den uppgiften är **inte** verifierad mot en etablerad byrå med källhänvisning och används inte. → **Case 1.**
- **Cisco (`CSCO`), 2026-11-12 efter stängning:** Q1 FY27 gav intäkter ~18,52 mdr USD (+24 %) mot väntade ~18,12, och justerat EPS 1,40 mot väntade ~1,29–1,33. Helårsguiden för justerat EPS höjdes till 5,47–5,53, och Q2-guiden är intäkter 18,0–18,2 mdr och EPS 1,34–1,36. Ledningen talar om en "networking supercycle" (Benzinga, MarketBeat och GuruFocus 2026-11-12). Uppgifterna om efterhandeln går isär, från −0,3 % (Stocktitan 19:59 ET) till +4,9 % (GuruFocus). → **Case 2.**
- **Applied Materials (`AMAT`), 2026-11-12 efter stängning:** Q4 FY26 gav intäkter 10,41 mdr USD mot väntade 10,30, och justerat EPS 4,16 mot 4,05. Helåret FY26 blev ett rekord på 34,45 mdr (+21 %). Efterhandeln var ungefär oförändrad: källorna anger −0,33 % (Benzinga) till +1,5 % (Investing.com), med en topp kring 389 (Benzinga, Investing.com och GuruFocus 2026-11-12). Den nya intäktsguiden för Q1 har inte gått att verifiera. Kandidaten finns i kön (`261113-AMAT`), men det blir inget fullt case: kursen ligger 14,7 % under MA200, vilket blockerar.
- **Nebius (`NBIS`), 2026-11-12 före öppning:** Intäkterna slog förväntan (980,8 MUSD, +571 %), och FY27-guiden ligger över konsensus. Men bolaget sänkte FY26 till den nedre delen av spannet 3,0–3,4 mdr USD. Aktien stängde på **128,64 (−16,84 %)** med 2,65× volym (prices.json, marketTime 2026-11-12T21:00:00Z; Yahoo Finance "Stock Market Today, Nov. 12" och Benzinga 2026-11-12). Det är en negativ katalysator och inget köpcase.
- **Halvledarrotationen höll trots Nvidia:** `AMD` steg till 585,30 (+5,86 %, 1,75× volym) och `AVGO` till 364,36 (+5,54 %, 1,69× volym). `CRWV` föll −6,86 % till 56,60 (prices.json, alla stängningar med marketTime 2026-11-12T21:00Z). Ingen ny bolagsspecifik katalysator är verifierad för AMD eller AVGO i dag, så de får ingen ny post (se makrodelen).
- **Krypto:** BTC föll till ~71 000 efter Nvidia-beskedet och har tappat ~15 % på en månad (Crypto.com market update 2026-11-12). Spot-bitcoin-ETF:erna hade nettoutflöden för femte dagen i rad 2026-11-11 (−299,9 MUSD, ~1,44 mdr för hela sviten; news.bitcoin.com 2026-11-11/12). Ingen ny bekräftad ETF-, regulatorisk eller protokollkatalysator har hittats. **Negativt påstående (L-5):** Det gäller bara de källor som genomsöktes (websök och `news_feed.json`); övriga flöden är **OKONTROLLERADE**.
- **`news_feed.json`, de senaste 24 h:** `sec-8k` har åter poster daterade 2026-11-12, så observationen från i går (åtgärdspunkt 4, Veterans Day) är löst. `TARGET CORP` lämnade in en 8-K 2026-11-12 21:35 UTC. Innehållet är **inte** granskat och därför **OKONTROLLERAT**; TGT rapporterar 2026-11-18. Övriga poster gäller mindre US-bolag utan handlingsbar katalysator i watchlistan.

## Uppföljning av tidigare case

- **`NVDA` (rapport-261112): 173,73 → 166,19** (−4,34 %, marketTime 2026-11-12T21:00:01Z, prices.json/Yahoo chart API). **Tes FÖRSVAGAD:** Ryktet är bekräftat och vd-skiftet blev av, men något ordnat skifte med en utsedd efterträdare blev det inte. En tillförordnad vd sitter nu fem dagar före rapporten. Kursen ligger 18,7 % under MA200 och RSI är 26,0. Kandidaten `261112-NVDA` avvisades (obekräftad katalysator) av `us-daglig-261112`. Den bekräftade händelsen är ny och får en ny post, `261113-NVDA`.
- **`AMAT` (rapport-261112): 395,08 → 380,95** (−3,58 %, marketTime 2026-11-12T21:00:01Z, prices.json/Yahoo chart API). **Tes INTAKT:** Rapporten slog konsensus på både intäkter och EPS, precis det scenario caset bevakade. Efterhandeln var dock ungefär oförändrad, och MA200-blockeringen gäller (−14,7 %). `261112-AMAT` är avgjord (väntat event). Utfallet får en ny post, `261113-AMAT`, med `price: null` (pre-event).

**Kandidatkön (`state/scout_candidates.json`):** 121 poster före dagens tillägg, varav 112 `rejected`, 9 `promoted` och **0 `new`**. US-rotationen `us-daglig-261112` avgjorde båda kandidaterna från 12/11. Ingen avvisning på ett tillfälligt datavillkor väntar på omprövning (L-4): båda avvisades på obekräftad katalysator, vilket är ett omdömesskäl. I dag läggs tre nya poster till, alla `confirmed: true` och med `expiresAt` 2026-11-20:
- `261113-NVDA`: kurs 166,19 (post-event, eftersom beskedet kom före öppning).
- `261113-CSCO`: `price: null`, eftersom stängningen ligger före rapporten.
- `261113-AMAT`: `price: null`, av samma skäl.

**US-boken (läses, ändras inte):** `CBOE` 368,89 (−0,08 %; dagsintervall 368,14–378,35; marketTime 2026-11-12T21:00:00Z). Dagshögsta 378,35 ligger 1,1 % under målet 382,50, och kursen är över stoppen 345,00. RSI är 72,7. Sleeven är 87,5 % (SPY), och ingen pending-plan finns.

## Dagens case

### Case 1: NVIDIA (NVDA / NASDAQ) – bekräftat vd-skifte, bevakning
**Katalysator:** Bekräftat 2026-11-12 före öppning (NVIDIA Form 8-K, SEC; TechCrunch och CNBC 2026-11-12). Jensen Huang avgår omedelbart som vd och lämnar styrelsen. CFO Colette Kress blir tillförordnad vd, och Harvey C. Jones (tidigare vd för Synopsys) blir första styrelseordförande. Styrelsen söker en permanent efterträdare. Det är inte längre ett rykte.
**Bull case:** Beskedet är nu ute, och den osäkerhet som präglade 11/11 har förvandlats till ett känt läge. Intradagsfallet på −14 % återhämtades till −4,34 %, och 4,58× volym tyder på kapitulationsliknande omsättning. Rapporten 2026-11-17 flyttar fokus till Blackwell/Rubin och datacenterefterfrågan, som inte påverkas direkt av ett ledarskifte. Halvledarna steg samma dag (AMD +5,86 %, AVGO +5,54 %), så sektorns efterfrågebild ser inte skadad ut.
**Bear case:** Det är ett grundarlöst bolag med en tillförordnad vd som presenterar rapporten om två handelsdagar. Det är en binär händelse inom ≤ 2 handelsdagar och spärrar ett köp, och enligt punkt 8 föreslås inget köp inför en rapport. Huangs koppling till en misstänkt kinesisk underrättelseagent kan väcka export- och regulatoriska frågor, och Bernstein halverade riktkursen till 200. Tekniskt ligger kursen **18,7 % under MA200**, och enligt `prompts/gemensam_korning.md` blockerar "kurs ≤ MA200" nya aktiepositioner. **Caset är inte köpbart.** Det registreras för att ansvarig bok ska ta ställning och för det kontrafaktiska underlaget. NVDA är dessutom indexets största vikt, och Nasdaqs marginal mot MA200 har krympt till 0,94 %.
**Setup:** Verifierad kurs är **166,19 USD** (marketTime 2026-11-12T21:00:01Z, prices.json/Yahoo chart API; −4,34 % mot previousClose 173,73). Dagsintervallet var 148,80–167,14 och stängningen nära dagshögsta. Det är en post-eventkurs. Teknik: MA50 215,96, MA200 204,34, EMA20 196,47, RSI 26,0 och MACD-histogram −4,16. Volymen var 4,58× 20-dagarssnittet, och 250-dagarshögsta är 239,24 (−30,5 %). Stödet ligger vid dagslägsta 148,80 och motståndet vid EMA20 ~196. Värderingsmultiplar är inte verifierade i dag.

### Case 2: Cisco Systems (CSCO / NASDAQ) – bekräftad rapportöverraskning
**Katalysator:** Bekräftad Q1 FY27, rapporterad 2026-11-12 efter stängning (Benzinga, MarketBeat och GuruFocus 2026-11-12). Intäkterna var ~18,52 mdr USD (+24 % å/å) mot väntade ~18,12. Justerat EPS var 1,40 mot väntade ~1,29–1,33, alltså ett slag med 0,07 mot MarketBeats konsensus. Helårsguiden för justerat EPS höjdes till 5,47–5,53, och Q2-guiden är intäkter 18,0–18,2 mdr och EPS 1,34–1,36. Bolagets eget pressmeddelande har inte lästs direkt; uppgifterna stämmer överens i tre oberoende sammanställningar. Inget rykte.
**Bull case:** Intäktstillväxten på +24 % är exceptionell för Cisco och visar att AI-nätverk (datacenter-switchar och optik) har blivit en egen tillväxtmotor. Ledningen kallar det en flerårig "networking supercycle". Den höjda helårsguiden gör att överraskningen inte bara är kvartalsspecifik. En bekräftad rapportöverraskning är enligt bokens regler en vanlig kandidat som ska passera de fem grindarna, och den kan avgöras på en post-eventkurs.
**Bear case:** Reaktionen i efterhandeln är otydlig, och källorna spänner från −0,3 % till +4,9 %. "Sell the news" är därför en verklig risk efter uppgången +1,24 % in i rapporten. Kursen ligger **0,25 % under MA200** (102,26), och "kurs ≤ MA200" blockerar tills en kvalificerad kurs stänger över. Guiden för Q2 ligger under Q1-utfallet, vilket kan läsas som en avmattning. Aktien ligger 21,5 % under 250-dagarshögsta (130,00), och MACD-histogrammet är svagt negativt.
**Setup:** Senaste verifierade kurs är **102,01 USD** (marketTime 2026-11-12T21:00:01Z, prices.json/Yahoo chart API; +1,24 % mot previousClose 100,76; dagsintervall 99,41–103,18). Det är en **pre-eventkurs**, och kandidaten står därför på `price: null`. `prices.yml` fyller i en kvalificerad post-eventkurs automatiskt. Teknik: MA50 108,02, MA200 102,26, EMA20 103,56, RSI 45,2 och MACD-histogram −0,35. Volymen var 1,33× 20-dagarssnittet, alltså under bokens krav på 1,5× den dagen. Närmaste motstånd är MA200 ~102,3 och EMA20 ~103,6, därefter MA50 ~108; stödet ligger vid dagslägsta 99,41. Värderingsmultiplar är inte verifierade i dag. **Enligt punkt 8 är detta inget köpförslag före ansvarig boks avgörande.** En för- eller efterbörskurs får bara bedömas, och ett köp blir i så fall en villkorad plan mot reguljär session.

## Makro- & sektorfaktorer att bevaka

- **Inflation och räntor:** PPI i dag avgör om KPI-värmen sprider sig. Ett nytt varmt utfall stärker basfallet om en höjning i december och är motvind för långdurationstillväxt (`CRWV`, `NBIS`) och krypto. Jobless claims på 200 000 visar en fortsatt stark arbetsmarknad och ger ingen lättnad på räntefronten.
- **Regimen:** `^GSPC` ligger +3,48 % över MA200, så regimen är PÅ. Nasdaq ligger bara +0,94 % över MA200, och NVDA-rapporten 17/11 kan ensam avgöra var index hamnar.
- **AI-hårdvaran:** Marknaden skiljer på bolagsrisk i NVDA och sektorefterfrågan. AMD (585,30, 38,8 % över MA200) och AVGO (364,36, 0,81 % under MA200 367,34) steg kraftigt på samma dag. Cisco och AMAT bekräftade efterfrågan i sina rapporter. **AMD:** kandidaten `261110-AMD` avvisades på grind 2 av omdömesskäl och omfattas inte av L-4. Den har `expiresAt` 2026-11-17, och omprövningen hör till nästa veckorotation. Ingen ny bolagsspecifik katalysator är verifierad, så ingen ny post skapas. **AVGO** står nära MA200, men inte heller där finns någon ny bolagsspecifik katalysator i dag.
- **Krypto i nedtrend:** BTC är under MA200 för första gången i denna serie av rapporter, ETH ligger under sedan tidigare, och ETF-utflödena pågår femte dagen i rad. `COIN` (130,67, −4,11 %) och `MSTR` (114,41, −6,49 %) ligger 25,1 % respektive 13,9 % under MA200. Det finns inget kryptocase i dag; marknaden är avvaktande tills utflödena vänder och dollarn/realräntorna slutar stiga.
- **Olja och geopolitik:** inga nya verifierade värden i dag (WTI saknas i `prices.json`).

**Watchlist-hygien:** `config/watchlist_us.txt` innehåller långt fler symboler än riktmärket 25, men ingen rensning görs i dag. Följande skyddas enligt `prompts/gemensam_korning.md`: innehavet (`CBOE`), de giltiga kandidaterna (`NVDA`, `CSCO` och `AMAT` nya i dag; `AMD`, `CEG`, `COST` och `CRWV` inom `expiresAt`), rapportbolagen inom 10 handelsdagar och besluten inom utvärderingens 20-dagarsfönster. Inga tillägg behövs i dag: `NVDA`, `CSCO` och `AMAT` har redan rad och kurs.

### Åtgärdspunkter till Dren (L-3)

1. **`crypto-previousclose-misdated` – ÅTERKOMMANDE.** `quotes["BTC-USD"].previousClose` (73 964,47) och `quotes["ETH-USD"].previousClose` (2 055,88) motsvarar ingen daterad punkt i `state/price_history.json` (2026-11-12: 71 401,99 respektive 2 012,13). Den naiva dagsrörelsen för BTC blir därför −4,17 % i stället för −0,73 %. **Omfång:** 2 av 2 mynt. **Ersättningskälla:** `state/price_history.json`.
2. **`news-feed-globenewswire-http-403` – ÅTERKOMMANDE.** `feeds.globenewswire` och `feeds.globenewswire-earnings` ger fortfarande `"HTTP 403 – båda försöken (0.1 s)"`. **Omfång:** 2 av 6 flöden. **Ersättningskälla:** websök, mfn och SEC 8-K.
3. **`sec-8k` efter Veterans Day: LÖST.** Flödet har poster daterade 2026-11-12, som förväntat. Ingen åtgärd behövs.
4. **`macro-calendar-not-verifiable-from-state` – ÅTERKOMMANDE.** Jobless claims, PPI-förväntan, FedWatch-odds, räntor och oljepris kommer ur websök, eftersom `^TNX`, `^VIX`, `DX-Y.NYB`, `CL=F` och `^SOX` saknas i `state/prices.json`. **Omfång:** samtliga makrovärden.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
