# Daglig Scout: USA & Krypto
**Datum:** 2026-11-10
**Marknadsklimat:** Måndagen gav den största uppgången på månader: S&P 500 +2,35 % och Nasdaq +2,74 %, drivet av fallande olja på fredshopp kring Iran och en bred halvledarstudsning där Nvidia var undantaget. Krypto följde inte med; BTC och ETH backade svagt, och ETH ligger nu under sin MA200. Dagens KPI kl. 14:30 CET (sista före Fed-mötet i december) är dygnets binära händelse. **Aktiva lärdomar tillämpade:** L-3 (åtgärdspunkter sist), L-4 (kandidatkön kontrollerad), L-5 (kalenderns och flödets täckning) och L-6 (inga klasser utesluts). L-2 är uppfylld: `ABNB`, `RKLB`, `OXY`, `CRWV`, `RGTI`, `CSCO` och `NBIS` har nu kurs och 250 daterade stängningar. L-1, L-7 och L-8 gäller inte scouten.

## Marknadsöversikt

`git pull` kördes 2026-11-10 05:48 UTC (06:48 CET): HEAD = `origin/main` = `eb6259e`. Källan är `state/prices.json` med `generatedAt` 2026-11-10T03:31:52Z, `schemaVersion` 2026-08-02-prevclose, `tickerCount` 273 och `okCount` 271 (Yahoo Finance chart API via GitHub Actions). `wideAt` 2026-11-10T00:29:18Z visar att dygnets breda hämtning har kört. Nyhetsflödet (`state/news_feed.json`) har `generatedAt` 2026-11-09T23:47:28Z och täcker 10 av 10 handelsdagar (2026-10-27 – 2026-11-09, `missingDays` tomt).

| Symbol | Nivå | Rörelse | marketTime |
|---|---|---|---|
| `^GSPC` | 7 549,94 | **+2,35 %** (7 376,86 → 7 549,94); dagsintervall 7 422,24–7 577,39 | 2026-11-09T22:12:50Z |
| `^IXIC` | 25 253,14 | **+2,74 %** (24 579,42 → 25 253,14) | 2026-11-09T22:15:59Z |
| `BTC-USD` | 74 584,99 | −0,20 % mot daterad punkt 2026-11-09 (74 733,74); −1,60 % sedan 75 796,22 (7/11) | 2026-11-10T03:30:35Z |
| `ETH-USD` | 2 114,78 | −0,43 % mot daterad punkt 2026-11-09 (2 123,88); −5,50 % sedan 2 237,84 (7/11) | 2026-11-10T03:30:48Z |
| `SPY` (sleeve) | 752,69 | +2,37 % (735,29 → 752,69) | 2026-11-09T21:00:00Z |

Dagsrörelserna för krypto är räknade mot daterade stängningar i `state/price_history.json`, eftersom `previousClose` för båda mynten är fel (åtgärdspunkt 3).

**Teknik** (räknad på råserien i `state/price_history.json`, sista aktiepunkt 2026-11-09):
- `^GSPC` ligger **3,03 % över MA200** (7 328,20) men under MA50 (7 676,21), med RSI 45,8 och MACD-histogrammet negativt men stigande (−34,5 → −25,6). ⇒ **Regimfiltret för US-boken är PÅ**, och marginalen har vidgats från 0,71 % i går.
- `^IXIC` ligger 0,58 % över MA200 (25 107,00) igen, efter att ha legat 2,07 % under.
- `BTC-USD` ligger 2,69 % över MA200 (72 631,99) men 7,6 % under MA50 (80 721,25), med RSI 36,1. **`ETH-USD` ligger 1,03 % under MA200** (2 136,85), med RSI 33,5.

## Ekonomiska siffror & kalender

**Senaste utfall:**
- **NFP oktober (2026-11-06):** +165 000 jobb mot ~59 000 väntat. Arbetslösheten var 4,1 % och timlönen steg 0,4 % m/m (BLS och CNBC 2026-11-06; se rapport-261107). Inga nya amerikanska makrodata har publicerats sedan dess.

**Kommande (nästa 1–5 handelsdagar):**
- **I dag tis 2026-11-10, 08:30 ET (14:30 CET): KPI oktober – DYGNETS MEST MARKNADSRÖRANDE.** Konsensus enligt Dow Jones och Bloomberg är +0,3 % m/m för totalen och +0,2 % för kärnan, mot 0,6 % och 0,3 % i september. FactSet ligger på 0,24 % m/m (CNBC och Yahoo Finance 2026-11-09). **BLS publicerar ingen årstakt för oktober**, eftersom prisdata för oktober 2025 aldrig samlades in under förra årets nedstängning (Quartz 2026-11-09). FactSets median motsvarar ~4 % å/å för totalen och ~2,8 % för kärnan, men det är imputerade tal, inte officiella. Det är sista KPI före Fed-mötet 8–9 december. NFIB publiceras samma dag.
- **Ons 2026-11-11:** Veterans Day. Obligationsmarknaden är stängd, aktiemarknaden öppen (CNBC 2026-11-06).
- **Tor 2026-11-12:** Jobless claims.
- **Fre 2026-11-13:** PPI oktober (Schaeffer's 2026-11-05).

**Rapporter nästa 10 handelsdagar** ur `state/earnings_calendar.json` (`generatedAt` 2026-11-10T00:27:27Z), US-symboler:
- **11-10:** `CRWV` och `RGTI`.
- **11-12:** `AMAT`, `CSCO` och `NBIS`.
- **11-17:** `NVDA` och `HD`. **11-18:** `TGT` och `LOW`. **11-19:** `WMT` och `ROST`. **11-23:** `HPE`. **11-24:** `CLSK` (gissat datum, `isEstimate`).

**L-5:** Kalendern ser bara de 273 symboler som `prices.yml` hämtar. Resten av det amerikanska universumet är **OKONTROLLERAT**. Samtliga datum är bevakningsposter enligt punkt 8, aldrig köpförslag. Inga tillägg i watchlistan i dag: varje bolag ovan finns redan där.

## Aktuella händelser & katalysatorer

- **Börsrallyt 2026-11-09:** S&P 500 hade sin bästa session sedan 8 april. Drivkrafterna var fallande olja på förhoppningar om fred med Iran, och en återkomst för halvledarna efter förra veckans fall på oro för hårdare AI-reglering (TheStreet, Yahoo Finance och Motley Fool, 2026-11-09).
- **AMD (`AMD`), 2026-11-09:** AMD meddelade att femte generationens EPYC-processorer blir värdprocessorer i Google Clouds TPU 8tx. Det är det första TPU-systemet med hårdvarubaserad confidential computing. Samma dag höjde Oppenheimer (Rick Schafer) betyget till Outperform med riktkurs 600 USD. Aktien stängde **+13,26 %** (Motley Fool och Yahoo Finance 2026-11-09). → **Case 1.**
- **Constellation Energy (`CEG`), Q3 2026, 2026-11-09 före öppning:** Justerat rörelseresultat per aktie 5,06 USD mot 3,04 USD i fjol. Konsensus var ~3,90 (Earnings Whispers före rapporten). Intäkterna var 9,55 mdr USD (+45 %) och nettoresultatet 1,84 mdr USD. Mittpunkten i guiden för 2026 höjdes för andra gången i år (SEC 8-K ex. 99.1 och 10-Q, 2026-11-09). Aktien stängde **+10,46 %**. → **Case 2.**
- **Rocket Lab (`RKLB`), Q3 2026, 2026-11-09 efter stängning:** Rekordintäkter på 268 MUSD (+73 %, mot väntade ~257 MUSD) och en orderstock på ~3,6 mdr USD (+52 % mot Q2). Förlusten blev −0,12 USD/aktie mot väntade −0,07, och Neutrons första flygning är fortsatt försenad (SEC 8-K 2026-11-09; Investing.com 2026-11-09). Aktien steg +10,9 % i den reguljära sessionen till 58,86 och föll därefter ~6,5 % efter stängning, till ~55,02 enligt Investing.com. Efterbörskursen är **inte** verifierad i `prices.json`. Inget case: kursen ligger 25,2 % under MA200 (78,72).
- **Nvidia (`NVDA`), 2026-11-09:** Aktien föll −4,27 % till 178,67 på rapporter om en utredning som rör vd Jensen Huang (Yahoo Finance och Motley Fool 2026-11-09). **Arten av utredningen är inte entydigt verifierad.** Det som går att belägga är att tre ordförande i representanthusets utskott har begärt en sluten genomgång med Huang den 18/11 om hans kontakter med en Megaspeed-chef. Svarsfristen går ut 11/11 (TheNextWeb, november 2026). Ingen anklagelse om brott riktas mot Huang. Rapport 11-17 är en bevakningspost.
- **Krypto:** Ingen ny bekräftad ETF-, regulatorisk eller protokollkatalysator har hittats. Flöden för spot-bitcoin-ETF:erna för 2026-11-09 gick inte att verifiera; det senaste daterade är ~1,28 mdr USD i utflöde veckan 11-02 – 11-06 (SoSoValue via mlq.ai, 2026-11-07). **Negativt påstående (L-5):** Det gäller bara de källor som genomsöktes (websök, `news_feed.json`); övriga flöden är **OKONTROLLERADE**.

## Uppföljning av tidigare case

Rapport-261109 innehöll inga nya case. Uppföljningen avser därför de två case som fortfarande är öppna från rapport-261107.
- **`ABNB` (rapport-261107): KURS EJ VERIFIERAD → 190,29** (marketTime 2026-11-09T21:00:01Z, prices.json/Yahoo chart API). Rörelsen sedan rapporten är ej mätbar, eftersom kurs saknades då; måndagen gav +0,16 % mot 189,99. **Tes INTAKT** (Q3: intäkter +19 %, EPS 3,16, återköp 12 mdr USD). Kursen ligger 28,5 % över MA200 med RSI 66,4. Posten `261107-ABNB` är `rejected` på "kurs ej verifierbar". Det är en tillfällig dataspärr, och **enligt L-4 ska US-boken pröva om den i dag** (`expiresAt` 2026-11-13), nu när en kvalificerad kurs finns.
- **`VST` (rapport-261107): 124,80 → 133,92** (+7,31 %, marketTime 2026-11-09T21:00:02Z, prices.json). **Tes INTAKT men fortsatt blockerad:** kursen ligger 12,19 % under MA200 (152,51). Avvisad av US-rotationen 2026-11-09 på grind 2.

**Kandidatkön (`state/scout_candidates.json`):** 115 poster före dagens tillägg, varav 106 `rejected`, 9 `promoted` och 0 `new`. I dag läggs två nya till: `261110-AMD` och `261110-CEG`, båda `confirmed: true` med `expiresAt` 2026-11-17. Dagens US-rotation (LÄGE B, 15:00 CET) ska avgöra båda.

**US-boken:** `CBOE` 352,78 (dagsintervall 350,92–361,91) ligger över den uppflyttade stoppen 334,00. `U`-planen ≤ 49,00 är **EJ TRIGGAD** (dagslägsta 51,15, stängning 51,43; marketTime 2026-11-09T21:00:02Z, prices.json).

## Dagens case

### Case 1: Advanced Micro Devices (AMD / NASDAQ)
**Katalysator:** Bekräftad kundvinst 2026-11-09. Google Cloud har valt AMD:s femte generations EPYC som värdprocessor för TPU 8tx, Googles första TPU-system med hårdvarubaserad confidential computing. Samma dag höjde Oppenheimer betyget till Outperform med riktkurs 600 USD och en prognos om ~135 % tillväxt i datacenterintäkterna 2027 (Motley Fool, Yahoo Finance och Newsbytes, 2026-11-09). Inget rykte.
**Bull case:** Ett designval hos en av de tre största molnleverantörerna, i Googles egen AI-acceleratorplattform, gör AMD:s CPU till en del av den TPU-baserade infrastruktur som annars konkurrerar med GPU-ekosystemet. AMD får därmed exponering mot AI-capex oavsett vilken acceleratorarkitektur som vinner. Volymen var 1,87× 20-dagarssnittet (50,9 M mot 27,2 M), alltså ett brett deltagande och inte en tunn rörelse.
**Bear case:** Aktien har redan gått från 404,40 till 508,58 på två sessioner (+25,8 %), så det är lätt att jaga en gapuppgång. Kursen ligger fortfarande under EMA20 (516,51), EMA50 (532,12) och MA50 (547,67), och MACD-histogrammet är negativt (−7,60, stigande från −12,76). Halvledarsektorn testas av `AMAT`/`CSCO` (11-12) och `NVDA` (11-17), och dagens KPI kan slå mot långdurationstillväxt. Ett "Outperform" är en åsikt, inte ett utfall – bara Google-valet är bekräftat.
**Setup:** Kurs **508,58 USD** (marketTime 2026-11-09T21:00:01Z, prices.json/Yahoo chart API; dagsrörelse +13,26 % mot previousClose 449,04). Kursen ligger 21,9 % över MA200 (417,22), med RSI 47,7. 52-veckorsspannet är 190,95–649,42. Närmaste motstånd är EMA20/EMA50 (516–532), och stödet ligger vid gapets undersida ~449. Kursen är post-katalysator (reguljär stängning samma dag som beskedet). Inga P/E-tal är verifierade i dag.

### Case 2: Constellation Energy (CEG / NASDAQ)
**Katalysator:** Bekräftad Q3 2026-rapport 2026-11-09 före öppning (SEC 8-K ex. 99.1 och 10-Q). Justerat rörelseresultat per aktie var 5,06 USD (3,04 i fjol, konsensus ~3,90 enligt Earnings Whispers). Intäkterna var 9,55 mdr USD mot 6,57 mdr i fjol, och nettoresultatet 1,84 mdr mot 0,93 mdr. CFO höjde mittpunkten i guiden för 2026 för andra gången i år. Vd lyfte fram avtal om mer än 1 000 MW ny utsläppsfri kapacitet och det nya erbjudandet Peak+ för storkunder.
**Bull case:** En överraskning på ~30 % mot konsensus och en andra guidehöjning, i en aktie som enligt Tikr föll ~9 % på mellanårsvalet och halkade efter sin egen höjda guide. Rapporten svarar direkt på den trovärdighetsfråga som tyngde aktien (Finviz, före rapporten). Efterfrågan på kärnkraftsel från datacenter är strukturell. Volymen var 1,88× 20-dagarssnittet.
**Bear case:** **Kursen 276,09 ligger 0,91 % under MA200 (278,63), och enligt `prompts/gemensam_korning.md` blockerar "kurs ≤ MA200" nya aktiepositioner.** Caset är alltså inte köpbart i dag, och en ny stängning över 278,63 krävs först. Sektorn är politiskt känslig efter valet, och en het KPI som låser en decemberhöjning slår mot räntekänsliga kraftbolag.
**Setup:** Kurs **276,09 USD** (marketTime 2026-11-09T21:00:01Z, prices.json/Yahoo chart API; +10,46 % mot previousClose 249,95; dagsintervall 247,00–277,66). Kursen ligger över EMA20 (261,68), EMA50 (266,74) och MA50 (270,01), med RSI 55,7. MACD-histogrammet har just korsat positivt (−1,76 → +0,25). 52-veckorsspannet är 236,50–378,60. Motståndet ligger vid MA200 278,63, och stödet vid gapets undersida ~250. Kursen är post-katalysator.

## Makro- & sektorfaktorer att bevaka

- **KPI i dag avgör tonen.** Marknaden prisar enligt CME FedWatch ~77 % sannolikhet för en höjning i december (per 2026-11-06, ej uppdaterat). Ett kärnutfall på ≥ 0,3 % m/m låser höjningen och är motvind för båda casen. Ett utfall på 0,1–0,2 % ger medvind. Utan officiell årstakt kommer marknaden att reagera på m/m-talen.
- **Regimen har fått luft:** `^GSPC` ligger +3,03 % över MA200, mot +0,71 % i går. Ett nytt fall på ~3 % krävs för att slå av filtret.
- **Rotation inom AI-hårdvaran:** Kapitalet flyttade från `NVDA` (−4,27 %) till `AMD` (+13,26 %), `AMAT` (+11,37 %), `AVGO` (+8,78 %), `NBIS` (+9,24 %) och `MU` (+6,25 %), men samtliga utom `AMD` ligger under sin MA200. Rallyt var en studs i en nedtrend, inte en trendvändning för sektorn.
- **Olja:** Oljepriset föll på förhoppningar om fred med Iran (TheStreet 2026-11-09). `XOM` −0,69 % och `CVX` −0,86 %. Oljepriset självt är inte verifierat i `prices.json` (åtgärdspunkt 5).
- **Krypto är frikopplat från aktierna:** BTC och ETH backade på en dag då Nasdaq steg 2,7 %, och ETH har brutit ned under MA200. ETF-utflödena har varit de största sedan juni. Utan egen katalysator finns inget kryptocase.

**Watchlist-hygien:** `config/watchlist_us.txt` innehåller långt fler symboler än riktmärket 25, men ingen rensning görs i dag. Följande skyddas enligt `prompts/gemensam_korning.md`: innehavet (`CBOE`), `U`-planen, de giltiga kandidaterna (`ABNB`, `AMD`, `CEG`), rapportbolagen inom 10 handelsdagar och besluten inom utvärderingens 20-dagarsfönster. Inga tillägg i dag.

### Åtgärdspunkter till Dren (L-3)

1. **`scheduled-actions-not-firing`: löst för i dag, ingen åtgärd.** `prices.yml` har kört, och `generatedAt` 03:31Z och `wideAt` 00:29Z visar att även den breda körningen gått. US-rotationens LÄGE A kördes 2026-11-09: `reports/us_weekly/us-veckorapport-261109.md` finns, och 21 `book: "us"`, `mode: "A"`-rader finns i `decisions.json`. Ingen åtgärd krävs.
2. **`crypto-previousclose-misdated` – ÅTERKOMMANDE.** `quotes["BTC-USD"].previousClose` (74 584,65) stämmer inte med den daterade punkten 2026-11-09 (74 733,74), och ligger i stället nästan exakt på `price`. Samma gäller `ETH-USD`: 2 120,98 mot 2 123,88. **Omfång:** 2 av 2 mynt. **Ersättningskälla:** `state/price_history.json`.
3. **`news-feed-globenewswire-http-403` – ÅTERKOMMANDE.** `feeds.globenewswire` och `feeds.globenewswire-earnings` ger fortfarande `"HTTP 403 – båda försöken (0.0 s)"`. **Omfång:** 2 av 6 flöden. **Ersättningskälla:** websök och SEC 8-K.
4. **Ingen helgkälla för kryptokurser – ÅTERKOMMANDE.** `prices.yml` kör bara vardagar. **Omfång:** 2 av 2 mynt under helger. **Föreslagen fix:** en helgcron i `prices.yml` som bara hämtar `*-USD`-symbolerna.
5. **`macro-calendar-not-verifiable-from-state` – ÅTERKOMMANDE.** KPI-konsensus, FedWatch-odds, räntor och oljepris kommer ur websök, eftersom `^TNX`, `^VIX`, `DX-Y.NYB`, `CL=F` och `^SOX` saknas i `state/prices.json`. **Omfång:** samtliga makrovärden.
6. **Webbhämtning är spärrad i scoutens körmiljö (ny).** WebFetch mot `cnbc.com` och `stocktitan.net` gav `getaddrinfo ENOTFOUND`, eftersom domänerna inte är tillåtna i sessionens nätverksinställningar. Bara sökresultatens sammanfattningar kunde användas, inga artikeltexter. **Omfång:** samtliga artikelhämtningar i dag. **Åtgärd:** lägg till nyhetsdomänerna i miljöns tillåtna nätverk, eller acceptera att källor verifieras via sökträffar.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
