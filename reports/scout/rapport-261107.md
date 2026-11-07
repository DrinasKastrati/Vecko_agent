# Daglig Scout: USA & Krypto
**Datum:** 2026-11-07
**Marknadsklimat:** Lördag med stängd aktiemarknad, och rapporten summerar fredagens session. Efter torsdagens AI-krasch kom en studs: halvledarna återhämtade sig och oktobers jobbrapport slog förväntningarna kraftigt (+165 000 mot ~59 000). Rallyt bleknade under dagen, så `^GSPC` stängde bara +0,31 % efter att ha legat på 7 444 intradag. Starkare arbetsmarknad driver räntor och decemberhöjningsoddsen uppåt (~77 % enligt CME FedWatch), vilket är motvind för långduration. Krypto står still på ~75 800. **Aktiva lärdomar tillämpade:** L-2 (ABNB läggs i watchlistan), L-3 (åtgärdspunkter sist), L-4 (kandidatkön kontrollerad), L-5 (kalenderns och flödets täckning) och L-6 (inga klasser utesluts). L-1, L-7 och L-8 gäller inte scouten.

## Marknadsöversikt

`git pull` kördes 2026-11-07 05:48 UTC (06:48 CET): HEAD = `origin/main` = `2535d6e`. Källan är `state/prices.json` med `generatedAt` 2026-11-07T00:55:35Z, `schemaVersion` 2026-08-02-prevclose, `tickerCount` 308 och `okCount` 303 (Yahoo Finance chart API via GitHub Actions). Hämtningen var bred (`wideAt` = `generatedAt`). Nyhetsflödet (`state/news_feed.json`) har `generatedAt` 2026-11-07T00:57:38Z och täcker 10 av 10 handelsdagar (2026-10-26 – 2026-11-07, `missingDays` tomt).

| Symbol | Senaste verifierade nivå | Rörelse | marketTime |
|---|---|---|---|
| `^GSPC` | 7 376,86 | +0,31 % (7 353,73 → 7 376,86), intervall 7 369,55–7 444,20 | 2026-11-06T21:37:09Z |
| `^IXIC` | 24 579,42 | +1,09 % (24 315,00 → 24 579,42), intervall 24 507,63–24 825,55 | 2026-11-06T22:15:59Z |
| `BTC-USD` | 75 796,22 | +0,10 % mot daterad punkt 2026-11-06 (75 718,39); −0,26 % mot gårdagens rapport (75 991,80) | 2026-11-07T00:54:10Z |
| `ETH-USD` | 2 237,84 | +0,49 % mot daterad punkt 2026-11-06 (2 227,03); +0,22 % mot gårdagens rapport (2 232,93) | 2026-11-07T00:54:30Z |
| `SPY` (sleeve) | 735,29 | +0,31 % (733,00 → 735,29) | 2026-11-06T21:00:00Z |

Kryptorörelserna är räknade mot den daterade punkten i `state/price_history.json`, inte mot `previousClose` (åtgärdspunkt 2).

**Fredagens bredd bland de hämtade US-symbolerna:** 125 USD-noterade aktier hade marketTime 2026-11-06 i `state/prices.json`, och **70 av dem steg**. Resten av marknaden är OKONTROLLERAD enligt L-5.
- **Uppgångarna:** `IREN` +20,02 %, `ACHR` +14,73 %, `COHR` +13,58 %, `RIOT` +13,21 %, `FN` +11,66 %, `AMD` +11,04 %, `VST` +10,55 %, `NET` +9,91 %, `APP` +9,86 %, `APLD` +9,74 %, `CLSK` +8,45 %, `MARA` +7,99 % och `INTC` +7,71 %.
- **Sämst:** `TEAM` −16,15 %, `CNC` −5,97 %, `PAYC` −5,08 %, `CBRL` −4,58 %, `NFLX` −3,28 %, `ABT` −3,23 %, `ZS` −3,05 % och `ROP` −2,92 %.
- **Megacaps:** `TSLA` +4,23 %, `PLTR` +3,48 %, `NVDA` +2,78 %, `META` +0,84 %, `GOOGL` +0,78 %, `AVGO` +0,74 %, `AMZN` −0,35 %, `AAPL` −0,52 % och `MSFT` −0,99 %.

Det var en studs i de mest sålda AI-hårdvarunamnen (minne, optik, AI-hosting, miners), medan mjukvara med svag guide straffades (`TEAM`). Indexets svaga stängning mot intradagstoppen visar att studsen inte bar hela vägen.

**Teknik** (räknad på råserien i `state/price_history.json`, sista punkt 2026-11-06):
- `^GSPC` ligger **0,71 % över MA200** (7 325,03), upp från 0,42 % i går, med RSI 35,1 och 3,94 % under MA50 (7 679,45). ⇒ **Regimfiltret för US-boken är fortfarande PÅ, med minimal marginal.**
- `^IXIC` ligger 2,07 % under MA200 (25 098,24) och 7,10 % under MA50, med RSI 33,9.
- `BTC-USD` ligger 4,42 % över MA200 (72 589,40) men 6,32 % under MA50 (80 907,08), med RSI 38,8. `ETH-USD` ligger 4,70 % över MA200 (2 137,40) och 9,80 % under MA50, med RSI 40,0.

## Ekonomiska siffror & kalender

**Senaste utfall:**
- **NFP oktober (2026-11-06): +165 000 jobb mot ~59 000 väntat – VECKANS MEST MARKNADSRÖRANDE.** Arbetslösheten sjönk till 4,1 % (väntat 4,2 %), tidigare månader reviderades upp med totalt 84 000, och timlönen steg 0,4 % m/m (3,1 % å/å) (BLS Employment Situation och CNBC 2026-11-06).
- **Räntor och Fed efter rapporten:** Enligt CME FedWatch är sannolikheten för en höjning med 25 punkter på mötet 8–9 december 76,8 %, upp ~10 procentenheter från torsdagen. 10-åringen låg på 4,868 %, 30-åringen på 5,275 % och 2-åringen på 4,524 % (Beinsure och IBTimes 2026-11-06). Inga av nivåerna kan verifieras ur repot, eftersom `^TNX` saknas i `state/prices.json` (åtgärdspunkt 4).
- **Sedan tidigare i veckan:** jobless claims 189 000 (2026-11-05), ADP +86 000 och ISM tjänster 54,5 (2026-11-04), ISM tillverkning 55,5.

**Kommande (nästa 1–5 handelsdagar):**
- **Tis 2026-11-10, 08:30 ET (14:30 CET): KPI oktober – NÄSTA VECKAS MEST MARKNADSRÖRANDE.** Det är sista KPI före Fed-beslutet 9 december, och med en het jobbrapport är en hög siffra det som kan låsa fast höjningen (Market Daily, FedRateCalc och Schaeffer's 2026-11-05/06). Samma dag kommer NFIB.
- **Tor 2026-11-12:** jobless claims och befintliga bostadsförsäljningar.
- **Fre 2026-11-13:** PPI oktober (Schaeffer's 2026-11-05).
- **Mån 2026-11-09:** inga större US-releaser (wholesale trade). Kinas KPI/PPI för oktober kommer samma dag (Lundgreen's 2026-11).

**Rapporter nästa 5 handelsdagar** ur `state/earnings_calendar.json` (`generatedAt` 2026-11-07T00:53:57Z, `errors` tomt), US-symboler:
- 11-09: `ACHR`, `CEG`, `KKR` och `MARA`
- 11-12: `AMAT`, nästa halvledartest efter veckans SOX-ras
- Längre fram: `NVDA`/`HD` 11-17, `LOW`/`TGT` 11-18, `ROST`/`WMT` 11-19.

**L-5:** kalendern ser bara de symboler som `prices.yml` hämtar, så resten av det amerikanska universumet är **OKONTROLLERAT**. Alla datum är bevakningsposter enligt punkt 8, aldrig köpförslag.

## Aktuella händelser & katalysatorer

- **Jobbrapporten och halvledarstudsen (2026-11-06):** Nasdaq 100 steg intradag ~2 % efter torsdagens sämsta dag sedan 2020, och VanEcks halvledar-ETF steg ~3,8 % (Benzinga och Business Recorder 2026-11-06). Repot bekräftar stängningen `^IXIC` +1,09 % och `AMD` +11,04 %. Torsdagens fall förklaras av oro för AI-reglering och datacenterbygget efter mellanårsvalet (Business Recorder 2026-11-06).
- **Airbnb Q3 2026 (2026-11-05 efter stängning, bekräftat):** intäkter ~4,9 mdr USD (+19 %, snabbast på mer än tre år), EPS 3,16 mot ~2,85, bruttobokningsvärde +21 % till 27,7 mdr, höjd helårsguide och ett nytt återköpsprogram på 12 mdr USD. Aktien steg ~11 % förbörs till ~189,50 (Airbnb 8-K ex. 99.1 på SEC; news.airbnb.com; Investing.com och CNBC 2026-11-06). → Case 1.
- **Vistra Q3 2026 (2026-11-06 före öppning, bekräftat):** justerat EBITDA 2,378 mdr USD (mot 1,581 mdr), nettovinst 1,14 mdr, 2026-guiden förträngd till 7,1–7,5 mdr, en första 2027-guide på 7,7–8,5 mdr och utökat återköp med 1,5 mdr (Vistra 8-K ex. 99.1 på SEC; GuruFocus och MarketScreener 2026-11-06). Aktien stängde +10,55 %. → Case 2.
- **Atlassian (2026-11-06):** `TEAM` stängde −16,15 % (prices.json) trots en rapport över förväntan, eftersom subscription-tillväxten väntas sakta in (Investing.com och Benzinga 2026-11-06). Ingen kandidat, eftersom reaktionen var negativ.
- **IREN (2026-11-06):** +20,02 % i sessionen. Det fanns ingen ny katalysator utöver torsdagens rapport (intäkter 228 MUSD, +66 % sekventiellt) och en studs efter −31 % på en vecka (Investing.com 2026-11-06). Ingen kandidat, eftersom kursen ligger 50,31 % under MA200 (43,55).
- **Five9 och DraftKings (2026-11-06):** ~−17 % respektive >−20 % förbörs på sänkt guide respektive ett intäktsmiss (Investing.com 2026-11-06). Inga kandidater, och ingen av dem finns i `state/prices.json`.
- **Krypto:** Ingen bekräftad protokoll-, ETF- eller regulatorisk katalysator. En websöksträff om ETF-inflöden på 240 MUSD "6 november" kunde inte dateras till 2026 och används inte.
- **`news_feed.json`:** 84 icke-juridiska poster efter 2026-11-06 11:00 UTC, men varken Airbnb, Vistra eller Atlassian finns där. Samtliga 84 är från 17:45 UTC eller senare, så förmiddagens poster saknas. Det stämmer med åtgärdspunkt 3 (GlobeNewswire 403) och `news-window-daily-cap-drops-morning-posts`.

## Uppföljning av tidigare case

Kurserna "då" är reguljära stängningar 2026-11-05 (PRE-event, före rapporterna samma kväll). Kurserna "nu" är reguljära stängningar 2026-11-06 ur `state/prices.json`.
- **`NET` (rapport-261106): 244,51 → 268,75** (+9,91 %; marketTime 2026-11-06T21:02:54Z, intervall 265,01–285,83). **Tes INTAKT men FÖRSVAGAD i reaktionen** – gapet på ~+15 % förbörs (294,50 enligt kandidatposten) bleknade till +9,9 %, och stängningen ligger nära dagslägsta. Kursen ligger nu **7,39 % över MA200** (250,24), men 15,54 % under MA50 (318,21), med RSI 39,4. `261106-NET` avvisades 2026-11-06 av omdömesskäl (grind 2: under EMA20/EMA50, MACD fallande), så L-4 gäller inte. Ny bedömning görs vid veckorotationen 2026-11-09 inom `expiresAt` 2026-11-13.
- **`U` (rapport-261106): 48,80 → 51,49** (+5,51 %; marketTime 2026-11-06T21:00:02Z, intervall 49,07–52,90). **Tes INTAKT.** Kursen ligger 62,40 % över MA200 (31,70) och RSI är 72,1. `261106-U` är promotad till en villkorad plan ≤ 49,00, och dagslägsta 49,07 betyder att den är **EJ TRIGGAD**.

**Kandidatkön (`state/scout_candidates.json`) före dagens tillägg:** 113 poster, varav 104 `rejected`, 9 `promoted` och 0 `new`. Dagens tillägg är `261107-ABNB` (`price: null`) och `261107-VST` (124,80, post-event), båda `new`.

**US-boken (`state/portfolj_us.md`, sessionen 2026-11-06 i `state/prices.json`):**
- `CBOE` (innehav, ben 1): stängning 353,27 (+0,06 %), över stoppen 316,00. Ben 2 ≤ 325,00 är **EJ TRIGGAD** (dagslägsta 346,34). 2026-11-06 var planens sista giltighetsdag.
- `U` ≤ 49,00: se ovan, **EJ TRIGGAD**. Planen gäller till 2026-11-13.
- `state/alerts.json` (`checkedAt` 2026-11-06T20:41:39Z) har inga aktiva larm.

## Dagens case

### Case 1: Airbnb (ABNB / NASDAQ)
**Katalysator:** Q3 2026, släppt 2026-11-05 efter stängning (bekräftat):
- Intäkter ~4,9 mdr USD (+19 % å/å), bolagets snabbaste tillväxt på mer än tre år.
- EPS 3,16 mot ~2,85 i konsensus och 2,21 ett år tidigare.
- Bruttobokningsvärde +21 % till 27,7 mdr USD och bokade nätter +16 % till 155 mn.
- Helårsguiden höjs till "high teens" tillväxt med justerad EBITDA-marginal ~36 %, och Q4-guiden är 3,22–3,28 mdr USD (+16–18 %).
- Nytt återköpsprogram på **12 mdr USD**; 700 MUSD återköptes under kvartalet.
- Aktien steg ~11 % förbörs 2026-11-06, till ~189,50 (Airbnb 8-K ex. 99.1 på SEC; news.airbnb.com; 247wallst, Investing.com och CNBC 2026-11-05/06). Förbörsnivån kommer ur en artikel och används inte för beslut.

**Bull case:** Tillväxten accelererar i bolagets mest mogna marknader, vilket talar emot tesen om en mättad resemarknad. Återköpet motsvarar en betydande andel av börsvärdet och ger stöd vid nedgångar. Det är en kapitallätt konsumentplattform utan exponering mot AI-hårdvaran, alltså samma typ av rapportvinnare som marknaden premierat de senaste dagarna (`APP`, `U`, `NET`).
**Bear case:** Enligt en analys förskönades EPS-överraskningen av en skattekostnad som var 135 MUSD lägre, motsvarande ~0,23 av de 0,31 i överraskningen. Konsumentcykliskt namn i ett läge där räntorna stiger på en het jobbrapport och decemberhöjningen prisas till ~77 %. Reaktionen i reguljär session och efterföljande kursutveckling går inte att verifiera ur repot.
**Setup:** **KURS EJ VERIFIERAD** – `ABNB` saknas i både `state/prices.json` och `state/price_history.json`. Kandidaten `261107-ABNB` har därför `price: null`, och ingen teknisk eller kursbaserad bedömning görs. `ABNB` läggs i `config/watchlist_us.txt` (L-2), så att `prices.yml` hämtar kursen före måndagens veckorotation, och `backfill-history.mjs` bör ge en full serie inom ett dygn. Värderingsmått kunde inte verifieras ur repot.

### Case 2: Vistra (VST / NYSE)
**Katalysator:** Q3 2026, släppt 2026-11-06 före öppning (bekräftat):
- Justerat EBITDA för Ongoing Operations **2,378 mdr USD** mot 1,581 mdr ett år tidigare (+50 %), och nettovinst 1,14 mdr mot 652 MUSD.
- 2026-guiden förträngs till 7,1–7,5 mdr USD i justerat EBITDA (mitten över den ursprungliga), och en första 2027-guide ges på 7,7–8,5 mdr.
- Styrelsen utökar återköpet med 1,5 mdr USD (totalt ~2,5 mdr kvar), och bolaget har ett 20-årsavtal för Odessa-anläggningen med New Era (Vistra 8-K ex. 99.1 på SEC; GuruFocus och MarketScreener 2026-11-06).

**Bull case:** Ett rekordkvartal och en 2027-guide ~10 % över 2026-mitten, med ~98 % av 2027 års produktion säkrad. Det gör intäktsbanan ovanligt förutsägbar för ett kraftbolag. Aktien har fallit från ~152 (2026-10-16) på oron för datacenterbygget, och en rapport som visar att efterfrågan håller kan vara början på en ompris.
**Bear case:** Kursen ligger **18,24 % under MA200**, vilket blockerar nya aktiepositioner enligt `prompts/gemensam_korning.md`. Den politiska risken mot datacenter (byggmoratorium i Texas) slår direkt mot Vistras ERCOT-exponering. Konsensus på intäkter och EPS kunde inte jämföras mot utfallet, så "överraskningen" är bara belagd på EBITDA mot fjolåret. Stigande räntor är motvind för kraftbolagens värdering.
**Setup:** Reguljär stängning **124,80** (marketTime 2026-11-06T21:00:02Z, prices.json/Yahoo chart API, intervall 118,90–125,80, +10,55 % mot 112,89). Rapporten kom före öppning samma dag, så det är en **post-event-kurs**, och `261107-VST` har `price` 124,80. Tekniken på råserien (250 punkter): 18,24 % under MA200 (152,65), 13,27 % under MA50 (143,90) och RSI 39,7. Stängningen ligger nära dagshögsta. Värderingsmått kunde inte verifieras ur repot. `VST` finns redan i `config/watchlist_us.txt`.

## Makro- & sektorfaktorer att bevaka

**Regim:** `^GSPC` ligger 0,71 % över MA200 (7 325,03), alltså fortfarande på gränsen. Bryter indexet MA200 slår regimfiltret av, och då får US-boken inte ta nya aktiepositioner. `^IXIC` ligger 2,07 % under sin MA200.

**Räntor/Fed:** Jobbrapporten (+165 000, 4,1 %, lön +0,4 % m/m) stärker fallet för en decemberhöjning (~77 %). Med 10-åringen ~4,87 % blir tisdagens KPI veckans binära makrohändelse: en het siffra är motvind för hela långdurationssegmentet (mjukvara, tillväxt, krypto).

**AI-handeln:** Fredagens studs var störst i de mest sålda namnen (`IREN`, `COHR`, `AMD`, `FN`), men indexet bleknade från dagshögsta. Det ser mer ut som en teknisk rekyl än som en vändning så länge den regulatoriska risken mot datacenterbygget kvarstår. Det marknaden fortsatt premierar är rapportvinnare med kapitallätt tillväxt. `AMAT` 11-12 och `NVDA` 11-17 är nästa tester för hårdvarukedjan.

**Krypto:** BTC och ETH ligger 4–5 % över MA200 men 6–10 % under MA50, med RSI ~39–40, och utan egen katalysator. Kryptoaktierna studsade med AI-hostingnamnen (`RIOT` +13,21 %, `MARA` +7,99 %), medan `COIN` (−1,51 %) och `MSTR` (−0,29 %) inte följde med. `MARA` rapporterar 2026-11-09, en bevakningspost. Inget kryptocase i dag.

**Binära händelser:** `ACHR`/`CEG`/`KKR`/`MARA` 11-09, KPI 11-10, `AMAT` 11-12 och PPI 11-13. Inget får köpas *in i* en rapport (punkt 8).

**Watchlist-hygien:** `config/watchlist_us.txt` bär långt fler symboler än riktmärket 25, men ingen rensning görs i dag. Följande skyddas enligt `prompts/gemensam_korning.md`: innehavet (`CBOE`), U-planen, de giltiga kandidaterna (`261103-*` – `261107-*`), veckans rapportbolag och besluten inom utvärderingens 20-dagarsfönster. Ett tillägg: `ABNB`.

### Åtgärdspunkter till Dren (L-3)

1. **`us-rotation-lage-a-missed` och `scheduled-actions-not-firing` – ÅTERKOMMANDE, i dag utan effekt för scouten.** Kurser (`generatedAt` 00:55Z) och nyheter (00:57Z) var färska. Måndag 2026-11-09 är veckorotation för US-boken; kontrollera att LÄGE A faktiskt körs.
2. **`crypto-previousclose-misdated` – ÅTERKOMMANDE.** `quotes["BTC-USD"].previousClose` är 75 942,13 mot daterad punkt 2026-11-06 75 718,39, och `ETH-USD` 2 234,48 mot 2 227,03. Fältet ger **−0,19 % respektive +0,15 %** i stället för korrekta **+0,10 % respektive +0,49 %**. Avvikelsen är liten i dag eftersom marknaden stod still, men fältet mäter fortfarande mot fel tidpunkt. **Omfång:** 2 av 2 mynt. **Ersättningskälla:** `state/price_history.json`.
3. **`news-feed-globenewswire-http-403` / `news-window-daily-cap-drops-morning-posts` – ÅTERKOMMANDE.** `feeds.globenewswire` och `feeds.globenewswire-earnings` ger `"HTTP 403 – båda försöken (0.0 s)"`. Av fredagens 84 icke-juridiska poster efter 11:00 UTC är samtliga från 17:45 UTC eller senare, och ingen av dagens tre stora rapporter (Airbnb, Vistra, Atlassian) finns i flödet. **Omfång:** 2 av 6 flöden döda, och förmiddagen saknas i resten. **Ersättningskälla:** websök och SEC 8-K.
4. **`macro-calendar-not-verifiable-from-state` – ÅTERKOMMANDE.** NFP, FedWatch-odds, statsobligationsräntor och KPI-datum kommer alla ur websök. **Omfång:** samtliga makrovärden plus `^VIX`, `^TNX`, `DX-Y.NYB`, `CL=F` och `^SOX`, som saknas i `state/prices.json`. **Föreslagen fix:** som tidigare – lägg till symbolerna i `config/watchlist_us.txt`.
5. **Nätåtkomst i scoutens körmiljö (information).** WebFetch mot `finance.yahoo.com` och `news.futunn.com` gav `ENOTFOUND` (värdarna ligger utanför sessionens tillåtna nätverksdomäner). Reservkällan "Yahoo Finance quote" i promptens punkt 2 går därmed inte att använda härifrån. Det påverkar inte i dag, eftersom alla kurser kommer ur `state/prices.json`.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
