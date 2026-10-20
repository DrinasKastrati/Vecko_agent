# Daglig Scout: USA & Krypto
**Datum:** 2026-10-20
**Marknadsklimat:** Tisdag morgon före öppning, efter en måndag där Nasdaq tog tillbaka drygt hälften av fredagens fall (+1,11 %) medan S&P 500 steg måttligare (+0,41 %). Studsen leddes av AI-/nätverksnamn och `TSLA` inför onsdagens rapport. Krypto står still under sina EMA20 (BTC −0,41 %, ETH −0,53 % mot daterad punkt 2026-10-19). **Veckans binära fråga är fortfarande capex-signalerna från `NFLX` (i kväll) samt `META` och `TSLA` (onsdag).** **Aktiva lärdomar tillämpade:** L-3 (åtgärdspunkter sist), L-4 (kontroll av vilande kandidater), L-5 (rapportkalenderns källa och täckning) och L-6 (inga klasser utesluts). L-1, L-2, L-7 och L-8 gäller inte scouten.

## Marknadsöversikt

`git pull`/`git fetch` 2026-10-20 05:50 UTC gav `origin/main` = `929ad3b`. `state/prices.json`: `generatedAt` 2026-10-20T00:20:25.465Z, `schemaVersion` 2026-08-02-prevclose, `tickerCount` 283, `okCount` 278 och `wideAt` 2026-10-20T00:20:25Z. Källa: `Yahoo Finance (chart API)` via GitHub Actions (run 788). **Måndagens session är nu inläst** – gårdagens åtgärdspunkt om uteblivna måndagscroner är löst (`prices.yml` körde 14:38, 20:34, 21:16, 23:57 och 00:20 UTC).

| Symbol | Nivå | Senaste rörelse | marketTime |
|---|---|---|---|
| `^GSPC` | 7 690,73 | +0,41 % (7 659,44 → 7 690,73) | 2026-10-19T20:44:14Z |
| `^IXIC` | 26 430,89 | +1,11 % (26 140,03 → 26 430,89) | 2026-10-19T21:15:59Z |
| `BTC-USD` | 81 539,23 | −0,41 % mot daterad punkt 2026-10-19 (81 875,51) | 2026-10-20T00:18:58Z |
| `ETH-USD` | 2 392,45 | −0,53 % mot daterad punkt 2026-10-19 (2 405,17) | 2026-10-20T00:19:14Z |
| `SPY` (sleeve) | 766,48 | +0,42 % (763,25 → 766,48) | 2026-10-19T20:00:00Z |

**Måndagens största rörelser i den US-bevakade mängden** (`price / previousClose − 1`, `state/prices.json`): upp `APLD` +6,65 %, `AMZN` +4,98 %, `RIG` +4,80 %, `SKHY` +4,67 %, `PLTR` +4,36 %, `MRVL` +4,06 %, `TSLA` +3,76 %; ned `AGNC` −3,21 %, `CEG` −3,01 %, `COIN` −2,72 %, `JEF` −2,68 %. Ingen av uppgångarna har en daterad bolagskatalysator som gick att verifiera (websök gav ingen täckning av måndagens session) – de behandlas som rekyl efter förra veckans tech-försäljning, inte som case.

**Teknik** (räknad på råserien i `state/price_history.json`, 250 punkter):
- **`^GSPC`:** 5,7 % över MA200 (7 275,63) ⇒ **regimfiltret för US-boken är fortsatt PÅ**. Under EMA20 (7 727,27) men över EMA50 (7 680,79). RSI 47,3. MACD-histogrammet fördjupas fortfarande (−8,40 → −10,99) – studsen har inte vänt momentum.
- **`^IXIC`:** under EMA20 (26 850,53) och EMA50 (26 614,23), över MA200 (24 935,31). RSI 43,3.
- **`BTC-USD`:** RSI 49,2, under EMA20 (82 219,71), över EMA50 (79 305,19) och MA200 (71 774,67). Histogrammet krymper (−577,7 → −554,0).
- **`ETH-USD`:** RSI 38,9, under EMA20 (2 503,95) och EMA50 (2 439,49), över MA200 (2 119,44).

**Kryptoflöden:** inga verifierbara siffror för 2026-10-19 hittades (websök gav bara äldre aggregat). Senast kända vecka (12–16 oktober) gav nettoutflöden i både BTC- och ETH-ETF:er enligt rapport-261019. **Ingen ny flödessiffra används i dag.**

## Ekonomiska siffror & kalender

**Senaste utfall** (oförändrat sedan rapport-261019, inga nya amerikanska makroutfall på måndagen utöver NAHB):
- **Industriproduktion september +0,7 % m/m mot väntat +0,4 %** (Federal Reserve G.17, 2026-10-16).
- **Fed-ordförande Warsh gav ingen räntesignal** (2026-10-16); höjningssannolikheten vid FOMC 27–28 oktober ~17 % (CNBC 2026-10-16). Fed är i tystnadsperiod.
- NAHB-index 2026-10-19: utfallet kunde inte verifieras från körmiljön.

**Kommande:**
- **Tisdag 2026-10-20 (i dag):** pending home sales. **`NFLX` Q3 efter stängning** – bolagets egen guidning är intäktstillväxt +12 % (+11 % valutajusterat) och rörelsemarginal 33,2 % (Netflix Q2-brev, SEC 8-K ex. 99.1); konsensus ~0,82 USD/aktie på ~12,88 mdr USD (Benzinga, hämtat 2026-10-20). `NFLX` stängde 69,85 (marketTime 2026-10-19T20:00:01Z), under EMA20/EMA50 och 15,6 % under MA200 (82,76).
- **Onsdag 2026-10-21 efter stängning: `META`, `TSLA` och `ABT`.** **Veckans mest marknadsrörande punkt** – Metas capex-guidning avgör tonen för AI-kedjan.
- **Torsdag 2026-10-22 14:30 CEST:** initiala arbetslöshetsanspråk (väntat 200 000, förra 199 000). `BE` rapporterar.
- **Fredag 2026-10-23 15:45 CEST:** flash-PMI oktober samt UMich-sentimentet.
- **FOMC 27–28 oktober** ligger utanför 5-dagarsfönstret.

**Rapporter nästa 5 handelsdagar** (`state/earnings_calendar.json`, `generatedAt` 2026-10-20T00:18:46Z, `errors` tomt; US-delen utan `isEstimate` i fönstret):
- 10-20: `NFLX`
- 10-21: `META`, `TSLA`, `ABT`
- 10-22: `BE`
- 10-26: `PECO`
- Strax utanför fönstret, 10-27: `BA`, `ITW` (samt `SKHY` med **gissat datum**, `isEstimate`)

**L-5:** kalendern ser bara de symboler `prices.yml` hämtar. Resten av det amerikanska universumet är **OKONTROLLERAT** (t.ex. IBM, SpaceX, Fifth Third, Steel Dynamics). Samtliga uppräknade US-rapportbolag finns redan i `config/watchlist_us.txt`. Alla är bevakningsposter enligt punkt 8, aldrig köpförslag.

## Aktuella händelser & katalysatorer

- **`AGNC` Q3 (2026-10-19 efter stängning, bekräftat – SEC 8-K ex. 99.1):** tangible net book value **7,13 USD/aktie, −16,9 %** från 8,58; ekonomisk avkastning **−12,7 %** för kvartalet; "at risk"-belåning upp till 7,9x (7,4x); 97,6 M nya aktier via ATM-program (nettolikvid 992 MUSD). Stängning 8,44 (marketTime 2026-10-19T20:00:01Z, pre-event) motsvarar ~1,18x det nya TNBV. **Negativt bekräftat utfall** – ingen köpkatalysator, och aktien ligger under MA200 (10,60) med RSI 26,5.
- **Steel Dynamics (STLD) rapporterade Q3 2026-10-19 efter stängning** (bolagets guidning 5,34–5,38 USD/aktie, SEC 8-K 2026-09). Utfallet kunde inte verifieras från körmiljön och symbolen hämtas inte – **OKONTROLLERAT**, inget case.
- **`state/news_feed.json`** (`generatedAt` 2026-10-19T22:55:08Z, 10 av 10 handelsdagar 2026-10-06 – 2026-10-19, `missingDays` tomt): 90 poster 2026-10-19, inga bolagsutfall för bevakade US-namn utöver ovanstående. 8-K från bl.a. 3M, AES, Wintrust och Allegiant (2026-10-19) saknar handlingsbar koppling till bevakade namn.
- **Tech-studs 2026-10-19:** `AMZN` +4,98 %, `PLTR` +4,36 %, `MRVL` +4,06 %, `TSLA` +3,76 % (`state/prices.json`). Ingen daterad katalysator verifierad – sammanhang, inte case.
- **`MSTR`:** MSCI-beskedet om bolag utan operativ verksamhet väntas 2026-11-11 (The Block 2026-10-15). Binärt riskdatum, inget case.
- Inga rykten från godkända medier används i dag.

## Uppföljning av tidigare case

Den senaste tidigare scout-rapporten (rapport-261019) innehöll **inga case**. Uppföljningen gäller därför de senaste casen (rapport-261017 och -261016), nu mot måndagens session:
- **`CRGY` (rapport-261017): 13,77 → 13,70 (−0,51 %, `state/prices.json`, marketTime 2026-10-19T20:00:02Z) – tes INTAKT.** Över EMA20 (13,27), EMA50 (13,08) och MA200 (11,76), RSI 55,4, MACD-histogrammet har vänt positivt (−0,016 → +0,029). US-boken avvisade kandidaten 2026-10-19 på grind 3 (katalysatorn 8/10 utanför femdagarsfönstret) – ett omdömesskäl.
- **`TSM` (rapport-261016): 422,25 → 420,22 (−0,48 %, samma fil, marketTime 2026-10-19T20:00:02Z) – tes FÖRSVAGAD.** Fortsatt under EMA20 (441,82) och EMA50 (436,53), RSI 39,0.
- **`USB` (rapport-261016): 57,39 → 57,85 (+0,80 %, samma fil, marketTime 2026-10-19T20:00:02Z) – tes FÖRSVAGAD.** Kursen ligger bara 0,03 % över MA200 (57,83) och under EMA20/EMA50.

**Kandidatkön (`state/scout_candidates.json`):** 82 poster, varav 77 `rejected` och 5 `promoted`; **inga `new`**. `261017-CRGY` avgjordes av US-boken 2026-10-19 (us-veckorapport-261019) – kön är tom på väntande poster.

**L-4-kontroll:** inga avvisade poster inom sin `expiresAt` vilar på en tillfällig datalucka. `261014-META`, `261015-UNH`, `261015-BLK`, `261016-TSM`, `261016-USB` och `261017-CRGY` avvisades samtliga av omdömesskäl (teknik, nåbarhet, katalysatorfönster). L-4 är uppfylld.

**Innehav:** US-boken har inga aktieinnehav; `SPY` ligger på 100 % (`state/portfolj_us.md`). `state/alerts.json` har inga aktiva signaler (`checkedAt` 2026-10-19T20:22:53Z).

## Dagens case

**Inga case i dag.** Enligt promptens punkt 6 ska case aldrig tvingas fram:

1. **Det enda bekräftade bolagsutfallet för ett bevakat namn är negativt** (`AGNC`, TNBV −16,9 %). Det är inget köpcase.
2. **Veckans stora katalysatorer är väntade event** (`NFLX` i kväll, `META`/`TSLA` onsdag). Enligt punkt 8 är de bevakningsposter och får aldrig bli köpförslag före rapporten. Måndagens uppgång i `TSLA` (+3,76 %) är precis den "trend in i rapporten" som PRE_MOM-armen mätte och underkände.
3. **Måndagens uppgångar saknar verifierad daterad katalysator**, och indexets MACD-histogram fördjupas fortfarande.
4. **Krypto saknar positiv kryptospecifik katalysator**; både BTC och ETH ligger under EMA20, ETH med RSI 38,9.

**Inga nya kandidatposter skrivs till `state/scout_candidates.json` i dag**, eftersom det inte finns något case och ingen ny bekräftad, handlingsbar positiv katalysator. Filen lämnas orörd med 82 poster. **`NFLX` (efter stängning i dag) och `META`/`TSLA` (onsdag) är de namn morgondagens och torsdagens scout ska pröva som post-event-kandidater** – med kurs först efter katalysatorn.

## Makro- & sektorfaktorer att bevaka

**Varför marknaden är avvaktande:** måndagens studs är en rekyl inför rapporterna, inte ett nytt utfall; momentum i både S&P 500 och Nasdaq är fortfarande negativt.

**AI-kedjan:** avgörs av Metas capex-guidning 2026-10-21 och därefter MSFT, GOOGL (2026-10-28) och AMZN (2026-10-29) enligt `state/earnings_calendar.json`.

**Räntorna:** marknaden prissätter paus i oktober; realräntan är fortsatt motvind för tillväxt och krypto.

**Finans:** `AGNC`:s bokvärdesfall (−16,9 %) och högre belåning signalerar att bolånespreadarna vidgades kraftigt under Q3 – motvind för räntekänsliga REITs; `USB` och `WFC` (−2,47 % i går) är svaga.

**Krypto:** inga verifierade nya ETF-flöden; MSCI-datumet 2026-11-11 ger motvind för `MSTR`. BTC ligger fortfarande 13,6 % över MA200.

### Åtgärdspunkter till Dren (L-3)

1. **Löst sedan i går – `prices-monday-crons-not-started`.** `prices.yml` körde fem gånger 2026-10-19/20 (senast run 788, 00:20 UTC) och måndagens session finns i `state/prices.json`. 05:09-cronen i dag hade inte landat vid körningen (05:50 UTC), men underlaget är komplett för gårdagens session.
2. **`news-feed-globenewswire-http-403` – kvarstår, ÅTERKOMMANDE.** `feeds.globenewswire` och `feeds.globenewswire-earnings` är båda `"HTTP 403 – båda försöken (0.0 s)"` (`state/news_feed.json`, 2026-10-19T22:55:08Z). **Omfång:** 2 av 6 flöden. **Ersättningskälla:** websök/SEC EDGAR.
3. **`macro-calendar-not-verifiable-from-state` – ÅTERKOMMANDE.** Makrokalendern, NFLX-konsensus och kryptoflöden kommer ur websök; NAHB-utfallet 2026-10-19 gick inte att verifiera alls. **Omfång:** samtliga makrodatum och -värden.
4. **`crypto-previousclose-misdated` – ÅTERKOMMANDE.** `quotes["BTC-USD"].previousClose` är 82 017,60 medan den daterade punkten 2026-10-19 i `state/price_history.json` är 81 875,51; för `ETH-USD` 2 408,74 mot 2 405,17. **Omfång:** 2 av 2 mynt. **Ersättningskälla:** den daterade punkten, som används i tabellen.
5. **`watchlist-cap-vs-measurability-conflict` – ÅTERKOMMANDE.** `config/watchlist_us.txt` innehåller långt fler än riktmärket 25 symboler. Inga rader stryks, eftersom skydden i `prompts/gemensam_korning.md` (beslut som behöver kurser 20 handelsdagar, rapportbolag) går före riktmärket. 5 av 283 symboler i `state/prices.json` saknar `price` (`BK`, `BIOT.ST`, `DOMETIC.ST`, `ICA.ST`, `NRS.OL`) – `BK` är den enda US-symbolen.
6. **`^VIX` hämtas inte – kvarstår.** **Omfång:** 1 symbol.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
