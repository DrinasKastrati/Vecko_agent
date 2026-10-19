# Daglig Scout: USA & Krypto
**Datum:** 2026-10-19
**Marknadsklimat:** Måndag morgon före öppning. Terminerna studsar efter Nasdaqs sämsta vecka sedan juni: Nasdaq-terminer +0,7–1 % och S&P 500-terminer +0,4–0,6 % enligt websök (tech-insider.org och Stocktwits/Yahoo 2026-10-19). Uppgifterna skiljer sig mellan källorna och används bara som sammanhang. Krypto har legat stilla över helgen kring 81–82 000 USD för BTC, men den rörelsen är **KURS EJ VERIFIERAD**. **Veckans binära fråga är capex-signalerna från `NFLX` (tisdag) samt `META` och `TSLA` (onsdag).** **Aktiva lärdomar tillämpade:** L-3 (åtgärdspunkter sist), L-4 (kontroll av vilande kandidater), L-5 (rapportkalenderns källa och täckning) och L-6 (inga klasser utesluts). L-1, L-2, L-7 och L-8 gäller inte scouten.

## Marknadsöversikt

`git pull`/`git fetch` 2026-10-19 05:50 och 06:16 UTC gav `origin/main` = `4688c83`. `state/prices.json` är **samma fil som i rapport-261017 och -261018**: `generatedAt` 2026-10-16T23:34:06.562Z, `schemaVersion` 2026-08-02-prevclose, `tickerCount` 220, `okCount` 217 och `wideAt` 2026-10-16T09:44:28Z. Källa: `Yahoo Finance (chart API)` via GitHub Actions. **Ingen `prices.yml`-körning har startat i dag** (se åtgärdspunkt 1). Senaste körningen är run 781, 2026-10-16T23:32Z.

| Symbol | Nivå | Senaste rörelse | Vecka (mot 2026-10-09) | marketTime |
|---|---|---|---|---|
| `^GSPC` | 7 659,44 | −1,09 % fredag (7 744,06 → 7 659,44) | −1,95 % | 2026-10-16T20:42:08Z |
| `^IXIC` | 26 140,03 | −2,14 % fredag (26 713,03 → 26 140,03) | −4,48 % | 2026-10-16T21:15:59Z |
| `BTC-USD` | 81 527,51 | −0,70 % mot daterad punkt 2026-10-15 (82 105,98) | −1,17 % | 2026-10-16T23:32:59Z |
| `ETH-USD` | 2 419,36 | −0,79 % mot daterad punkt 2026-10-15 (2 438,54) | −2,51 % | 2026-10-16T23:33:08Z |
| `SPY` (sleeve) | 763,25 | −1,11 % fredag | −1,97 % | 2026-10-16T20:00:00Z |

**Krypto: helgens rörelse är KURS EJ VERIFIERAD.** Den senaste verifierade kursen är ~55 timmar gammal (fredag 23:33 UTC). Reservkällan Yahoo Finance kan inte nås från körmiljön: `WebFetch` mot `finance.yahoo.com` ger `getaddrinfo ENOTFOUND`, samma fel som mot `cnbc.com`. Enligt websök låg BTC kring 81 238 USD och ETH kring 2 386 USD den 2026-10-18 (CoinGecko via crypto.news/CryptBull 2026-10-18). Den uppgiften används bara som sammanhang, aldrig som kursnivå.

**Teknik** (oförändrad sedan rapport-261017 eftersom serien är densamma; räknad på råserien i `state/price_history.json`, 250 punkter):
- **`^GSPC`:** ligger 5,3 % över MA200 (7 271,41), så **regimfiltret för US-boken är fortsatt PÅ**. Indexet ligger under EMA20 (7 731,12) men över EMA50 (7 680,38). RSI är 44,1, och MACD-histogrammet fördjupas (−0,78 → −8,40).
- **`^IXIC`:** ligger under EMA20 och EMA50 men över MA200 (24 919,36). RSI är 37,2.
- **`BTC-USD`:** RSI 49,2, under EMA20 men över EMA50 och MA200.
- **`ETH-USD`:** RSI 40,8, under EMA20 och EMA50 men över MA200.

**Kryptoflöden** (veckan 12–16 oktober, Farside via crypto.news, CoinCentral och CryptBull 2026-10-18):
- Spot-bitcoin-ETF:erna hade nettoutflöden på ~228,4 MUSD.
- Ether-ETF:erna hade nettoutflöden på ~320,1 MUSD, varav ~299 MUSD ur BlackRocks ETHA. Det är tredje veckan i rad med utflöden.
- Krypto-ETF:er totalt hade utflöden på ~610,7 MUSD, mot ~1,29 mdr USD veckan innan. Utflödena minskar men pågår fortfarande.

## Ekonomiska siffror & kalender

**Senaste utfall** (oförändrat sedan rapport-261017):
- **Industriproduktion september +0,7 % m/m mot väntat +0,4 %** (Federal Reserve G.17, 2026-10-16).
- **Fed-ordförande Warsh gav ingen räntesignal** (2026-10-16). Sannolikheten för en höjning vid FOMC 27–28 oktober föll till ~17 % från ~30 % (CNBC 2026-10-16). Fed är i tystnadsperiod.
- **Initiala arbetslöshetsanspråk 199 000 mot väntat 200 000** (senaste utfallet enligt Schwab Weekly Trader's Outlook, 2026-10).

**Kommande** (websök: Newsquawk, eoption och Schwab; ingen fil i repot, se åtgärdspunkt 3):
- **Måndag 2026-10-19 16:00 CEST:** NAHB-index (väntat 31). `AGNC` rapporterar efter stängning.
- **Tisdag 2026-10-20:** pending home sales. **`NFLX` Q3 efter stängning**, med konsensus ~0,82 USD/aktie på ~12,87 mdr USD (CNBC 2026-10-18). Enligt veckoförhandsvisningarna rapporterar även SpaceX samma dag (riskreversal och fxempire 2026-10). Symbolen finns inte i watchlistan, och Yahoo-tickern är inte verifierad, så ingen rad läggs till.
- **Onsdag 2026-10-21 efter stängning: `META` och `TSLA` Q3**, samt `ABT`.
  - META väntas få 6,58–6,76 USD/aktie på ~63,3–63,4 mdr USD; uppgifterna skiljer sig mellan källorna.
  - TSLA väntas få 0,43–0,45 USD/aktie på ~27,9 mdr USD.
  - **Det här är veckans mest marknadsrörande punkt.** Metas capex-guidning avgör tonen för hela AI-kedjan efter veckans skuldoro.
- **Torsdag 2026-10-22 14:30 CEST:** initiala arbetslöshetsanspråk (väntat 200 000, förra 199 000). `BE` rapporterar.
- **Fredag 2026-10-23 15:45 CEST:** flash-PMI för oktober (förra: tillverkning 55,9 och tjänster 58,8) samt UMich-sentimentet. Flash-PMI är nu daterat i två källor (Newsquawk och eoption).
- **FOMC 27–28 oktober** ligger utanför 5-dagarsfönstret.

**Rapporter nästa 5 handelsdagar** (`state/earnings_calendar.json`, `generatedAt` 2026-10-16T09:43:01Z, `errors` tomt, inga `isEstimate`):
- 10-19: `AGNC`
- 10-20: `NFLX`
- 10-21: `META`, `TSLA` och `ABT`
- 10-22: `BE`

**L-5:** kalendern ser bara de symboler som `prices.yml` hämtar. Resten av det amerikanska universumet är **OKONTROLLERAT** (till exempel IBM, SpaceX och Fifth Third). Kalendern är dessutom tre dagar gammal, eftersom dagens 05:09-körning inte har startat. Samtliga uppräknade rapportbolag finns redan i `config/watchlist_us.txt`. Alla är bevakningsposter enligt punkt 8, aldrig köpförslag.

## Aktuella händelser & katalysatorer

- **Inga nya bekräftade bolagsutfall sedan fredagen** för bevakade namn. Källor: websök 2026-10-19 samt `state/news_feed.json`, som är oförändrad (`generatedAt` 2026-10-16T23:38:45Z, 10 av 10 handelsdagar 2026-10-05 – 2026-10-16, `missingDays` tomt). Dagens 05:17-körning av `news.yml` har inte heller landat. Fönstret saknar alltså helgen och morgonen, vilket inte bevisar att det saknas nyheter.
- **Terminerna studsar (2026-10-19):** investerare köper dippen i tech inför rapporterna (tech-insider.org och Stocktwits/Yahoo 2026-10-19). Det är sammanhang, inte en katalysator.
- **Ether-ETF:erna har haft utflöden tre veckor i rad (2026-10-18, crypto.news och CoinCentral).** Det är en negativ flödessignal för `ETH-USD`, och ingen positiv kryptokatalysator finns.
- **`MSTR`:** MSCI-listan över bolag utan operativ verksamhet väntas 2026-11-11, och regeln gäller efter 2026-11-30 (The Block 2026-10-15). Det är ett binärt riskdatum, och det ger inget case.
- **Bumbles uppköp (Ithaca Holdings, ~1,3 mdr USD, TechCrunch 2026-10-13)** är ett avslutat bud på ett bolag utanför watchlistan. Det är ingen handlingsbar katalysator.
- Inga rykten från godkända medier används i dag.

## Uppföljning av tidigare case

Den senaste tidigare scout-rapporten (rapport-261018) innehöll **inga case**. Uppföljningen gäller därför de senaste casen (rapport-261017 och -261016). Kurserna kommer ur samma oförändrade fil, så ingen ny session har ägt rum:
- **`CRGY` (rapport-261017): 13,77 → 13,77 (±0,00 %, `state/prices.json`, marketTime 2026-10-16T20:00:02Z) – tes INTAKT.** Inget nytt bolagsbesked har kommit.
- **`TSM` (rapport-261016): 422,25 → 412,61 (−2,28 %, samma fil, marketTime 2026-10-16T20:00:02Z) – tes FÖRSVAGAD.** Kursen ligger under EMA20 och EMA50, och RSI är 34,2.
- **`USB` (rapport-261016): 57,39 → 58,73 (+2,33 %, samma fil, marketTime 2026-10-16T20:00:02Z) – tes INTAKT.** Kursen ligger över MA200 (57,81) men under EMA50.

**Kandidatkön (`state/scout_candidates.json`):** 82 poster, varav 76 `rejected`, 5 `promoted` och **1 `new`**.
- **`261017-CRGY`** är `new` och ska avgöras av US-boken vid v43-rotationen i dag (`expiresAt` 2026-10-23). Den är inte försenad. Rotationen läser dock fredagens kurser om `prices.yml` inte har kört före 15:00 CEST, se åtgärdspunkt 1.

**L-4-kontroll:** inga avvisade poster inom sin `expiresAt` vilar på en tillfällig datalucka. `261016-USB`, `261016-TSM`, `261015-UNH` och `261015-BLK` avvisades av omdömesskäl. L-4 är uppfylld.

**Innehav:** US-boken har inga aktieinnehav, och `SPY` ligger på 100 % (`state/portfolj_us.md`). `state/alerts.json` har inga aktiva signaler.

## Dagens case

**Inga case i dag.** Enligt promptens punkt 6 ska case aldrig tvingas fram, och det finns tre skäl:

1. **Inget nytt kursunderlag.** `state/prices.json` och `state/news_feed.json` är samma filer som i två rapporter i rad. Morgonens hämtningar har inte körts.
2. **Inget bekräftat bolagsutfall har kommit sedan fredagen.** Veckans katalysatorer (AGNC, NFLX, META och TSLA) är väntade event. Enligt punkt 8 är de bevakningsposter och får aldrig bli köpförslag före rapporten.
3. **Krypto saknar verifierad kurs sedan fredag 23:33 UTC** och saknar en positiv kryptospecifik katalysator. ETF-utflödena pågår för tredje veckan.

**Inga nya kandidatposter skrivs till `state/scout_candidates.json` i dag**, eftersom det inte finns något case och ingen ny bekräftad, handlingsbar katalysator. Filen lämnas orörd med 82 poster.

## Makro- & sektorfaktorer att bevaka

**Varför marknaden är avvaktande:** terminernas studs är en rekyl inför rapporterna, inte ett nytt utfall.

**AI-kedjan:** skuldoron från förra veckan (CoreWeave och chipindexet ned åtta dagar i rad) avgörs först av Metas capex-guidning 2026-10-21 och därefter av MSFT, GOOGL och AMZN 2026-10-28/29.

**Räntorna:** marknaden prissätter paus i oktober och en höjning i december. Realräntan är fortsatt motvind för tillväxt och krypto.

**Rotation:** energi (`XOM`, `CVX`, oljan nära 100 USD), banker och defensiva sektorer har lett. Oljan bär samtidigt inflationsrisken.

**Krypto:** ETF-utflöden och MSCI-datumet 2026-11-11 ger motvind. BTC ligger fortfarande över MA200.

### Åtgärdspunkter till Dren (L-3)

1. **Ny i dag – `prices-monday-crons-not-started` (instans av `scheduled-actions-not-firing`).** `prices.yml` har **ingen körning alls 2026-10-19**. Enligt Actions-listan är senaste körningen run 781, 2026-10-16T23:32Z, alltså har både 05:09- och 06:09-cronen uteblivit. `news.yml` 05:17 har inte heller landat.
   - **Konsekvens:** dagens LÄGE A för båda böckerna (nordisk 06:40 UTC och US 13:00 UTC) läser fredagens kurser och en tre dagar gammal rapportkalender, om ingen körning startar före dem. Dygnsgrinden (`wideAt`) tar igen dygnsstegen först när en körning faktiskt startar.
   - **Omfång:** samtliga 220 symboler samt nyhetsflödet.
   - **Åtgärd:** starta "Hämta kurser" manuellt (Actions → Run workflow) före rotationerna, om ingen körning har dykt upp.
2. **`news-feed-globenewswire-http-403` – kvarstår, ÅTERKOMMANDE.** `feeds.globenewswire` och `feeds.globenewswire-earnings` är båda `"HTTP 403 – båda försöken (0.0 s)"` (2026-10-16T23:38:45Z). **Omfång:** 2 av 6 flöden. **Ersättningskälla:** websök.
3. **`macro-calendar-not-verifiable-from-state` – ÅTERKOMMANDE.** Följande kommer ur websök: terminerna, Fed-sannolikheterna, konsensus för NFLX, META och TSLA, kryptoflödena och veckans makrokalender. **Omfång:** samtliga makrodatum och -värden.
4. **`crypto-previousclose-misdated` – ÅTERKOMMANDE.**
   - `quotes["BTC-USD"].previousClose` är 82 141,46, medan den daterade punkten 2026-10-15 i `state/price_history.json` är 82 105,98.
   - För `ETH-USD` är värdena 2 440,48 mot 2 438,54.
   - **Omfång:** 2 av 2 mynt. **Ersättningskälla:** den daterade punkten, som används i tabellen.
5. **`watchlist-cap-vs-measurability-conflict` – ÅTERKOMMANDE.** `config/watchlist_us.txt` innehåller långt fler än riktmärket 25 symboler. Inga rader stryks, eftersom skydden i `prompts/gemensam_korning.md` går före riktmärket. 3 av 220 symboler saknar `price`.
6. **`crypto-weekend-price-gap` – kvarstår.** `BTC-USD` och `ETH-USD` saknar verifierad kurs varje helg. I dag är luckan ~55 timmar och växer tills punkt 1 är löst. Reservkällan Yahoo kan inte nås (`ENOTFOUND`). **Förslag:** en helgcron för `-USD`-symbolerna.
7. **`^VIX` hämtas inte – kvarstår.** **Omfång:** 1 symbol.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
