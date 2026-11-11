# Daglig Scout: USA & Krypto
**Datum:** 2026-11-11
**Marknadsklimat:** Ett varmt KPI-utfall bröt måndagens rally. Kärnan steg +0,3 % m/m mot väntade +0,2 %, och marknaden prisar nu en räntehöjning i december. S&P 500 föll −0,38 %, Nasdaq −0,74 % och Nvidia −5,47 %. Krypto fortsätter vara svagare än aktierna: BTC ligger nära tremånaderslägsta, och ETH ligger 4,4 % under MA200. **Aktiva lärdomar tillämpade:** L-2 (case utan kurs dokumenteras med `price: null`), L-3 (åtgärdspunkter sist), L-4 (kandidatkön kontrollerad), L-5 (kalenderns och flödets täckning) och L-6 (inga klasser utesluts). L-1, L-7 och L-8 gäller inte scouten.

## Marknadsöversikt

`git pull` kördes 2026-11-11 05:48 UTC (06:48 CET): HEAD = `origin/main` = `ec425d6`. Källan är `state/prices.json` med `generatedAt` 2026-11-11T01:16:48Z, `schemaVersion` 2026-08-02-prevclose, `tickerCount` 323 och `okCount` 318 (Yahoo Finance chart API via GitHub Actions). `wideAt` 2026-11-11T01:16:48Z visar att dygnets breda hämtning har kört. Nyhetsflödet (`state/news_feed.json`) har `generatedAt` 2026-11-10T21:19:49Z och täcker 10 av 10 handelsdagar (2026-10-28 – 2026-11-10, `missingDays` tomt).

| Symbol | Nivå | Rörelse | marketTime |
|---|---|---|---|
| `^GSPC` | 7 520,93 | **−0,38 %** (7 549,94 → 7 520,93); dagsintervall 7 470,43–7 543,92 | 2026-11-10T22:00:31Z |
| `^IXIC` | 25 065,88 | **−0,74 %** (25 253,14 → 25 065,88) | 2026-11-10T22:15:59Z |
| `BTC-USD` | 73 308,57 | −0,62 % mot daterad punkt 2026-11-10 (73 768,41); −3,28 % sedan 75 796,22 (7/11) | 2026-11-11T01:14:59Z |
| `ETH-USD` | 2 042,55 | −0,59 % mot daterad punkt 2026-11-10 (2 054,69); −8,73 % sedan 2 237,84 (7/11) | 2026-11-11T01:15:18Z |
| `SPY` (sleeve) | 749,92 | −0,37 % (752,69 → 749,92) | 2026-11-10T21:00:00Z |

Dagsrörelserna för krypto är räknade mot daterade punkter i `state/price_history.json`. `previousClose` för BTC (75 223,15) och ETH (2 131,50) stämmer inte med någon daterad punkt (åtgärdspunkt 3).

**Teknik** (räknad på råserien i `state/price_history.json`, sista aktiepunkt 2026-11-10):
- `^GSPC` ligger **2,59 % över MA200** (7 331,05) men under MA50 (7 672,91) och EMA20 (7 604,75). RSI är 44,5 och MACD-histogrammet negativt (−20,3). ⇒ **Regimfiltret för US-boken är PÅ**, men marginalen har krympt från +3,03 % i går.
- `^IXIC` ligger **0,19 % under MA200** (25 114,33) igen.
- `BTC-USD` ligger bara 0,92 % över MA200 (72 638,84), med RSI 33,4. **`ETH-USD` ligger 4,37 % under MA200** (2 135,81), med RSI 30,4.

## Ekonomiska siffror & kalender

**Senaste utfall:**
- **KPI oktober (2026-11-10) – VARMARE ÄN VÄNTAT.** Totalen steg +0,4 % m/m mot väntade +0,3 % (september +0,6 %). Kärnan steg +0,3 % mot väntade +0,2 %, vilket är tredje månaden i rad på +0,3 %. Fritid, sjukvård, bilförsäkringar och flygpriser drev uppgången; begagnade bilar och kommunikation drog ned. BLS publicerade **ingen officiell årstakt**, eftersom oktoberpriserna 2025 aldrig samlades in. Uppskattningen ~4 % å/å är en extrapolering (Axios, Marketplace och CNBC 2026-11-10; Stock Titan 2026-11-10). Fed-ledamoten Waller hade angett ≥ 0,3 % i kärnan som tröskel för att överväga en höjning med en halv procentenhet. Den tröskeln nåddes (Stock Titan och Kiplinger 2026-11-10; tolkningen är analytikernas, inte Feds).
- **NFP oktober (2026-11-06):** +165 000 jobb mot ~59 000 väntat, och arbetslösheten var 4,1 % (BLS och CNBC 2026-11-06; se rapport-261107).

**Kommande (nästa 1–5 handelsdagar):**
- **I dag ons 2026-11-11:** Veterans Day. Obligationsmarknaden är stängd, aktiemarknaden öppen (CNBC 2026-11-06).
- **Tor 2026-11-12: Jobless claims.** Samma dag rapporterar `AMAT`, `CSCO` och `NBIS`.
- **Fre 2026-11-13: PPI oktober – VECKANS MEST MARKNADSRÖRANDE återstående siffra**, efter ett varmt KPI (Schaeffer's 2026-11-05).
- **Tis 2026-11-17:** Nvidia rapporterar.

**Rapporter nästa 10 handelsdagar** ur `state/earnings_calendar.json` (`generatedAt` 2026-11-11T01:14:37Z), US-symboler:
- **11-12:** `AMAT`, `CSCO` och `NBIS`.
- **11-17:** `NVDA` och `HD`. **11-18:** `TGT` och `LOW`. **11-19:** `WMT` och `ROST`. **11-23:** `HPE`. **11-24:** `CLSK` (gissat datum, `isEstimate`). **11-25:** `DE`.

**L-5:** Kalendern ser bara de 323 symboler som `prices.yml` hämtar. Resten av det amerikanska universumet är **OKONTROLLERAT**. Samtliga datum är bevakningsposter enligt punkt 8, aldrig köpförslag. Inga tillägg i watchlistan i dag: varje bolag ovan finns redan där.

## Aktuella händelser & katalysatorer

- **Börsfallet 2026-11-10:** Dow −0,30 % (52 231,89), S&P 500 −0,38 % och Nasdaq −0,74 %. KPI-utfallet drev upp de långa räntorna, och Nvidia var det största enskilda draget i tekniksektorn. WTI föll −0,93 % till 86,04 USD (TheStreet, Motley Fool och Stock Titan 2026-11-10; Washington Post 2026-11-10). Oljepriset är inte verifierat i `prices.json`.
- **Nvidia (`NVDA`), 2026-11-10:** De oberoende styrelseledamöterna har anlitat förre tillförordnade federala åklagaren Joon H. Kim och Wachtell, Lipton, Rosen & Katz för att leda utredningen av vd Jensen Huang (NVIDIA Newsroom / mfn 2026-11-10 19:07 UTC; posten ligger i `news_feed.json`). Styrelsen skrev 2026-11-08 att den saknar skäl att tro att nationell säkerhet eller bolagshemligheter har röjts, och att den har förtroende för Huang (CNBC 2026-11-08). Aktien föll −5,47 % till 168,89. Den ligger nu 17,4 % under MA200 och har RSI 23,9. Rapport 11-17 är en bevakningspost, och caset är blockerat (kurs ≤ MA200).
- **Costco (`COST`), 2026-11-10 21:15 UTC (efter stängning):** Styrelsen beslutade om en extrautdelning på **30 USD per aktie** (~13,3 mdr USD), med avstämning 2026-11-24 och utbetalning 2026-12-04. Samtidigt godkändes ett nytt återköpsprogram på upp till 4 mdr USD t.o.m. november 2030, som ersätter 2023 års program (SEC 8-K ex. 99.1 2026-11-10; Costco IR 2026-11-10; mfn i `news_feed.json`). Det är bolagets största extrautdelning, dubbelt så stor som 15 USD i januari 2024 (Investing.com och investingLive 2026-11-10). → **Case 1.**
- **CoreWeave (`CRWV`), Q3 2026, 2026-11-10 efter stängning:** Intäkterna blev 3 661 MUSD (+168 % mot 1 365 MUSD). Orderstocken var ~132,5 mdr USD (+138 %), justerat resultat per aktie −1,27 USD mot väntade −1,55, och helårsguiden för 2026 höjdes till 13,0–13,3 mdr USD. GAAP-förlusten vidgades till 709 MUSD, och capex var 14,5 mdr USD i kvartalet (CoreWeave IR 2026-11-10; Investing.com och TradingKey 2026-11-10). Efterbörskursen svängde mellan +5,7 % (51,51) och +1,8 % (49,60) enligt Investing.com och TradingKey. Den är **inte** verifierad i `prices.json`. → **Case 2 (blockerat).**
- **Krypto:** BTC föll ~1,25 % till ~73 800 USD efter KPI, nära tremånaderslägsta (TechFlow 2026-11-11). Ingen ny bekräftad ETF-, regulatorisk eller protokollkatalysator har hittats. **Negativt påstående (L-5):** Det gäller bara de källor som genomsöktes (websök och `news_feed.json`); övriga flöden är **OKONTROLLERADE**.

## Uppföljning av tidigare case

- **`AMD` (rapport-261110): 508,58 → 515,21** (+1,30 %, marketTime 2026-11-10T21:00:01Z, prices.json/Yahoo chart API). Dagsintervallet var 495,00–539,25. **Tes INTAKT:** gapet höll en dag då Nasdaq föll −0,74 %, och kursen ligger 23,1 % över MA200 (418,54). Den stängde dock precis under EMA20 (516,39), och MACD-histogrammet är fortfarande negativt (−3,37).
- **`CEG` (rapport-261110): 276,09 → 267,76** (−3,02 %, marketTime 2026-11-10T21:00:00Z, prices.json). **Tes FÖRSVAGAD:** kursen ligger nu 3,87 % under MA200 (278,54), så spärren "kurs ≤ MA200" blockerar ännu tydligare än i går. Räntekänsligheten slog till på KPI-utfallet.

**Kandidatkön (`state/scout_candidates.json`):** 117 poster före dagens tillägg, varav 106 `rejected`, 9 `promoted` och **2 `new`**. **`261110-AMD` och `261110-CEG` står fortfarande som `new`**, eftersom US-rotationens LÄGE B 2026-11-10 inte har körts (se åtgärdspunkt 1). Båda ska avgöras av nästa US-körning (`expiresAt` 2026-11-17). I dag läggs två nya till: `261111-COST` och `261111-CRWV`, båda `confirmed: true` och `price: null` (kursen ligger före katalysatorn), med `expiresAt` 2026-11-18. `prices.yml` fyller i en kvalificerad post-eventkurs automatiskt.

**US-boken:** `CBOE` steg till 364,81 (+3,41 %; dagsintervall 352,00–364,95), över stoppen 334,00 och 4,8 % från målet 382,50. **`U`-planen ≤ 49,00 TRIGGADES INTRADAG 2026-11-10:** dagslägsta var 48,945 och stängningen 50,34 (marketTime 2026-11-10T21:00:02Z, prices.json). Monitorn flaggade KÖP i `state/alerts.json` (`basis: "intraday"`, `hitPrice` 48,945, `checkedAt` 2026-11-10T21:39Z). Fyllnaden är inte bokförd i `state/portfolj_us.md`, eftersom ingen US-körning har gjorts sedan dess. Det ska nästa US-rotation göra; scouten ändrar inte portföljen.

## Dagens case

### Case 1: Costco Wholesale (COST / NASDAQ)
**Katalysator:** Bekräftat styrelsebeslut 2026-11-10 21:15 UTC (efter stängning): extrautdelning 30 USD per aktie (~13,3 mdr USD, avstämning 2026-11-24, utbetalning 2026-12-04) och ett nytt återköpsprogram på 4 mdr USD t.o.m. november 2030. Under 2023 års program återköptes 3,1 mdr USD (SEC 8-K ex. 99.1; Costco IR 2026-11-10). Inget rykte.
**Bull case:** Extrautdelningen är bolagets största någonsin och ligger över de ~24 USD som analytiker räknat fram som "samma avkastning som 2024" (investingLive 2026-11-10). Den signalerar en stark kassagenerering efter Q4 FY26 (jämförbar försäljning +9,4 %, digitala jämförbara +19,5 %, se rapport-260925). Trenden är tydlig: kursen ligger 9,5 % över MA200 (973,67) och över EMA20 (1 016,83), och MACD-histogrammet är positivt (+4,41). Defensiv konsumtionskvalitet kan dessutom attrahera kapital när räntehöjningsrisken stiger.
**Bear case:** En extrautdelning är **kapitalåterföring, inte tillväxt**. Kursen sjunker med ~30 USD (~2,8 %) på x-dagen, och ett kortsiktigt köp ger ingen mekanisk vinst. RSI är 69,6, nära överköpt, och kursen ligger 2,6 % under 250-dagarshögsta 1 094,32. Värderingen är historiskt hög (P/E inte verifierat i dag). Volymen 2026-11-10 var bara 0,64× 20-dagarssnittet, vilket inte ger något stöd från köpintresse före beskedet. En utdelning på 13,3 mdr USD är dessutom finansierad, inte förtjänad, i det enskilda kvartalet.
**Setup:** Senaste verifierade kurs är **1 066,14 USD** (marketTime 2026-11-10T21:00:01Z, prices.json/Yahoo chart API; oförändrad mot previousClose 1 066,18). Det är en **PRE-eventkurs**, eftersom beskedet kom efter stängning, och därför är kandidaten skriven med `price: null`. Teknik: MA50 957,27, MA200 973,67, EMA20 1 016,83 och RSI 69,6. Motståndet ligger vid 1 094,32 (250-dagarshögsta), och stödet vid EMA20 ~1 017. En förbörs- eller efterbörskurs får bara bedömas och blir i så fall en villkorad plan mot reguljär session.

### Case 2: CoreWeave (CRWV / NASDAQ)
**Katalysator:** Bekräftad Q3 2026-rapport 2026-11-10 efter stängning (CoreWeave IR 2026-11-10). Intäkterna var 3 661 MUSD (+168 %), orderstocken ~132,5 mdr USD (+138 % mot 55,6 mdr) och justerat resultat per aktie −1,27 USD mot väntade −1,55. Helårsguiden höjdes till 13,0–13,3 mdr USD, med en annualiserad intäktstakt vid årsskiftet på 20–21 mdr USD (Investing.com 2026-11-10). Inget rykte.
**Bull case:** Orderstocken på 132,5 mdr USD är tio gånger årsintäkten, vilket ger exceptionell intäktssynlighet i AI-infrastruktur. Både slaget mot konsensus och den höjda guiden svarar på den guidesänkning som fällde aktien efter förra årets Q3. Kursen ligger 45,7 % under MA200 efter ett långt fall, så positioneringen är lätt.
**Bear case:** **Kursen 48,73 ligger 45,68 % under MA200 (89,71), och enligt `prompts/gemensam_korning.md` blockerar "kurs ≤ MA200" nya aktiepositioner.** Caset är alltså inte köpbart. GAAP-förlusten (709 MUSD) och capex (14,5 mdr USD i kvartalet) visar en skuldfinansierad expansion, och räntekostnaden var redan högre än rörelseresultatet (TIKR 2026-11-06). Ett varmt KPI som pressar upp räntorna slår hårdast mot just den balansräkningen. Efterbörsreaktionen var splittrad (+5,7 % → +1,8 %).
**Setup:** Senaste verifierade kurs är **48,73 USD** (marketTime 2026-11-10T21:00:01Z, prices.json/Yahoo chart API; −0,51 % mot previousClose 48,98). Det är en **PRE-eventkurs**, och därför är kandidaten skriven med `price: null`. Teknik: MA50 74,13, MA200 89,71, EMA20 57,41, RSI 35,8 och MACD-histogram −0,18. Volymen var 1,25× 20-dagarssnittet. Motståndet ligger vid EMA20 ~57, och stöd saknas inom synhåll. Registreras som bevakning; en ny stängning över MA200 är långt borta.

## Makro- & sektorfaktorer att bevaka

- **Räntehöjningsrisken är huvudmotvinden.** Tredje månaden i rad med en kärna på +0,3 % gör en höjning i december till marknadens basfall (Kiplinger 2026-11-10). FedWatch-odds efter utfallet är inte verifierade. PPI på fredag kan cementera bilden. Det är motvind för långdurationstillväxt (`CRWV`) och räntekänsliga kraftbolag (`CEG`), men mindre för `COST`.
- **Regimen:** `^GSPC` ligger +2,59 % över MA200, mot +3,03 % i går. Ett fall på ~2,5 % slår av filtret. Nasdaq ligger redan under sin MA200.
- **AI-hårdvaran splittras:** `NVDA` −5,47 % (styrelseutredning) och `NBIS` −5,27 %, medan `AVGO` +3,91 % och `AMD` +1,30 %. Halvledarsektorn testas av `AMAT` och `CSCO` (11-12) och `NVDA` (11-17). Samtliga utom `AMD` ligger under MA200.
- **Olja:** WTI föll −0,93 % till 86,04 (TheStreet 2026-11-10, ej i `prices.json`). `XOM` −0,16 % och `CVX` +0,21 %.
- **Krypto saknar egen katalysator:** BTC ligger 0,9 % över MA200 och ETH 4,4 % under, och kryptoaktierna `COIN` (−2,92 %) och `MSTR` (−3,60 %) följer med nedåt. En stigande dollar och stigande realräntor efter KPI är motvind. Det finns därför inget kryptocase i dag.

**Watchlist-hygien:** `config/watchlist_us.txt` innehåller långt fler symboler än riktmärket 25, men ingen rensning görs i dag. Följande skyddas enligt `prompts/gemensam_korning.md`: innehavet (`CBOE`), den triggade `U`-planen, de giltiga kandidaterna (`AMD`, `CEG`, `ABNB`, `COST`, `CRWV`), rapportbolagen inom 10 handelsdagar och besluten inom utvärderingens 20-dagarsfönster. Inga tillägg i dag: `COST` och `CRWV` har redan rad och kurs.

### Åtgärdspunkter till Dren (L-3)

1. **`us-rotation-lage-b-missed-261110` (ny): US-rotationens LÄGE B 2026-11-10 har inte körts.** `reports/us_daily/` slutar på `us-daglig-261106.md`, `decisions.json` har noll `book: "us"`-rader daterade 2026-11-10, och inga andra commits än kurser, monitor och nyheter har landat på main efter 2026-11-10 10:00 UTC. **Följder:** (a) `261110-AMD` och `261110-CEG` ligger kvar som `new` utan avgörande, (b) `U`-planens intradagsfyllnad (48,945 ≤ 49,00) är inte bokförd i `state/portfolj_us.md`. **Åtgärd:** kontrollera att 15:00-rutinen för `prompts/us_dagligprompt.md` kör i dag, eller kör den för hand.
2. **`scheduled-actions-not-firing`: ingen åtgärd i dag.** `prices.yml` har kört (`generatedAt` 01:16Z, `wideAt` 01:16Z), och nyhetsflödet täcker 10 av 10 handelsdagar.
3. **`crypto-previousclose-misdated` – ÅTERKOMMANDE.** `quotes["BTC-USD"].previousClose` (75 223,15) och `quotes["ETH-USD"].previousClose` (2 131,50) motsvarar ingen daterad punkt i `state/price_history.json` (2026-11-10: 73 768,41 respektive 2 054,69). **Omfång:** 2 av 2 mynt. **Ersättningskälla:** `state/price_history.json`.
4. **`news-feed-globenewswire-http-403` – ÅTERKOMMANDE.** `feeds.globenewswire` och `feeds.globenewswire-earnings` ger fortfarande `"HTTP 403 – båda försöken (0.1 s)"`. **Omfång:** 2 av 6 flöden. **Ersättningskälla:** websök, mfn och SEC 8-K. NVIDIA-styrelsens uttalande nådde flödet via mfn, inte via GlobeNewswire.
5. **`macro-calendar-not-verifiable-from-state` – ÅTERKOMMANDE.** KPI-utfall, FedWatch-odds, räntor och oljepris kommer ur websök, eftersom `^TNX`, `^VIX`, `DX-Y.NYB`, `CL=F` och `^SOX` saknas i `state/prices.json`. **Omfång:** samtliga makrovärden.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
