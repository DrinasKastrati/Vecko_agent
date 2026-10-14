# Daglig Scout: USA & Krypto
**Datum:** 2026-10-14
**Marknadsklimat:** Bankrapporterna gav en avvaktande tisdag. Storbankerna slog i stort sett vinstestimaten men föll ändå (C −5,60 %, WFC −3,10 %), och JNJ föll 5,73 % trots en höjd helårsprognos. `^GSPC` stängde oförändrat (−0,02 %) och `^IXIC` föll 0,15 %. Halvledarutrustning sålde av efter Applied Materials investerardag (AMAT −6,69 %). Kryptomarknaden har återhämtat sig efter att ETF-utflödena bröts, men KPI kl. 14:30 svensk tid i dag avgör riktningen. **Aktiva lärdomar tillämpade:** L-3 (åtgärdspunkter sist), L-4 (kontroll av vilande kandidater, se uppföljningen), L-5 (rapportkalenderns källa och täckning anges) och L-6 (inga klasser utesluts). L-1, L-2, L-7 och L-8 gäller inte scouten.

## Marknadsöversikt

Samtliga kurser kommer ur `state/prices.json` (källa `Yahoo Finance (chart API)` via GitHub Actions). Filen har `generatedAt` **2026-10-14T00:18:42.582Z**, `schemaVersion` **2026-08-02-prevclose**, `tickerCount` 276 och `okCount` 270. Arbetskopian var i fas med `origin/main` (`70ef274 Nyheter: 2026-10-14 00:20 UTC`) efter `git pull` 2026-10-14 05:48 UTC.

| Symbol | Nivå | Rörelse | marketTime |
|---|---|---|---|
| `^GSPC` | 7 805,45 | −0,02 % (7 807,24 → 7 805,45, tisdag 2026-10-13) | 2026-10-13T20:33:02Z |
| `^IXIC` | 27 204,38 | −0,15 % (27 245,90 → 27 204,38) | 2026-10-13T21:15:59Z |
| `BTC-USD` | 83 375,99 | +1,89 % mot den daterade punkten 2026-10-12 (81 826,13) i `state/price_history.json` | 2026-10-14T00:17:22Z |
| `ETH-USD` | 2 506,85 | +2,32 % mot den daterade punkten 2026-10-12 (2 450,01) | 2026-10-14T00:17:36Z |
| `SPY` (sleeve) | 778,01 | −0,01 % | 2026-10-13T20:00:00Z |

Kryptorörelserna räknas mot den daterade punkten 2026-10-12, inte mot `previousClose` eller punkten 2026-10-13. Den senare punkten (BTC 83 354,89) skrevs av förra nattens körning och är en löpande notering, inte ett dygnsslut (se åtgärdspunkt 3).

**Teknik (räknad på råserien i `state/price_history.json`, 250 punkter):** `^GSPC` ligger 7,5 % över MA200 (7 259,46), så regimfiltret för US-boken är **PÅ**. RSI 59,2, kursen ligger över EMA20 (7 740,11), och MACD-histogrammet är positivt men avtar (10,65 → 9,45). `^IXIC` har RSI 56,4, och MACD-histogrammet har just vänt till negativt (15,89 → −1,16), en första svaghetssignal för tech. `BTC-USD` har RSI 55,9 och ligger över EMA20 (82 631) och MA200 (71 551). MACD-histogrammet är negativt men stiger. `ETH-USD` har RSI 46,5 och ligger fortfarande under EMA20 (2 558) men över MA200 (2 114).

**Kryptoflöden:** de amerikanska spot-ETF:erna för bitcoin vände till nettoinflöden 2026-10-13, med ~175,6 MUSD ledda av Fidelitys FBTC, och ether-fonderna fick ~24,8 MUSD (Crypto Briefing 2026-10-13). Dagen innan var flödet −65,4 MUSD (The Market Periodical 2026-10-13). Fear & Greed-index ligger på 56 inför KPI (Analytics Insight 2026-10-13). Flödessiffrorna kommer från enskilda medier och är inte verifierade mot en primärkälla.

## Ekonomiska siffror & kalender

**Senaste utfall:** inga nya amerikanska makrosiffror i går. Fed publicerade protokollen från diskontoräntemötena 17 augusti, 9 september och 16 september (`state/news_feed.json` fed-press 2026-10-13T18:00Z). Fed höjde räntan till 3,75–4,00 % den 2026-09-16 (se rapport-261013).

**Kommande** (källa: websök, ingen fil i repot – se åtgärdspunkt 2):
- **I DAG, onsdag 2026-10-14, 08:30 ET / 14:30 CEST: KPI september – veckans mest marknadsrörande siffra.** Dow Jones-konsensus är +0,6 % m/m och 3,6 % å/å (från 3,4 %), med kärn-KPI på +0,2 % m/m och 2,5 % å/å (CNBC 2026-10-13). Andra förhandsbedömningar ligger på 3,7 % å/å och kärn-KPI 2,4 % (Kiplinger, Morningstar 2026-10). Energipriserna driver uppgången. Det är sista KPI-siffran före FOMC 27–28 oktober, och ett högt utfall kan väcka liv i tankarna på en ny höjning (Quartz 2026-10-13). Samma dag rapporterar `BAC`, `MS` och `BLK` (`state/earnings_calendar.json`, `isEstimate: false`).
- **Torsdag 2026-10-15:** PPI, samt `TSM`, `PNC` och `USB` (`state/earnings_calendar.json`).
- **2026-10-20 `NFLX`**, **2026-10-21 `META`, `TSLA`, `ABT`**, **2026-10-22 `BE`** (`state/earnings_calendar.json`, samtliga `isEstimate: false`). För META anger rapport-261013 och en del medier i stället 2026-10-27. Kalenderfilen säger 2026-10-21 utan att vara märkt som gissning, och den behandlas som gällande.
- **L-5:** `state/earnings_calendar.json` ser bara de 276 symboler som `prices.yml` hämtar. Resten av det amerikanska universumet är **OKONTROLLERAT**. Inga nya rapportbolag har lagts till i `config/watchlist_us.txt` i dag. Samtliga rapportbolag ovan omfattas av rapportförbudet i punkt 8 och är bevakningsposter, aldrig köpförslag.

## Aktuella händelser & katalysatorer

- **Storbankerna, Q3, 2026-10-13 (bekräftat utfall):** `JPM` gav 5,57 USD per aktie mot väntade 5,90 och höjde guidningen för räntenettot 2026 till 106,2 mdr USD (Alphastreet 2026-10-13). Aktien stängde på 331,43 (−0,86 %). `C` slog estimaten med 2,85 USD per aktie mot väntade 2,66 och höjde ROTCE-målet till >11 % (AP/WTOP, Quartz 2026-10-13), men stängde på 124,53 (−5,60 %, under MA200 126,32). `WFC` gav 1,87 USD per aktie, behöll guidningen för räntenettot och hade intäkter strax under väntan (Wells Fargo 8-K 2026-10-13; Minichart 2026-10-13). Aktien stängde på 80,74 (−3,10 %). `GS` stängde på 891,91 (−0,23 %) efter att ha handlats upp till 930,88 under dagen. Alla kurser är ur `state/prices.json` med marketTime ~2026-10-13T20:00Z. **Läsning:** marknaden säljer banker på bra siffror, så positioneringen var redan fullt prisad.
- **`JNJ` Q3, 2026-10-13:** justerad vinst per aktie 2,59 USD mot väntade 2,53, försäljning 25,4 mdr USD och höjd helårsprognos (mittpunkt 11,10 USD). En engångskostnad för talkförlikningen pressade dock den rapporterade vinsten per aktie till 0,09 USD, och MedTech var svagt (JNJ 8-K Ex 99.1 2026-10-13; Investing.com 2026-10-13). Aktien stängde på 248,61 (−5,73 %) på 2,42× volym, nära MA200 (243,41).
- **`AMAT` −6,69 % till 464,24 (`state/prices.json`, marketTime 2026-10-13T20:00:01Z) på 1,80× volym.** Investerardagen under SEMICON West gav ett osäkert 2030-mål, och SOX föll ~2 % med KLA, Lam och ASML (AOL/Motley Fool 2026-10-13; MarketBeat 2026-10-13). Evercore behöll Outperform med riktkurs 700 USD. Det var sjätte nedgångsdagen i rad, och kursen ligger under EMA20 och EMA50. `MU` −3,62 % och `SKHY` −3,19 % följde samma mönster.
- **`META` +2,63 % till 762,50 (`state/prices.json`, marketTime 2026-10-13T20:00:01Z)** efter +3,38 % på måndagen. **Bekräftad bolagskatalysator:** Meta lanserade 2026-10-12 sina första frontier-modeller, Muse Wonder och Muse Wonder Full, med betald API (4/20 USD per miljon token) och abonnemang på 20 respektive 100 USD i månaden (Meta Newsroom 2026-10-12; TechCrunch 2026-10-12). Pivotal Research höjde riktkursen från 790 till 930 USD (Investing.com 2026-10-13). Se Case 1.
- **`ORCL` +4,23 % till 143,20 (marketTime 2026-10-13T20:04:40Z)** på ett föreslaget elavtal med El Paso Electric för AI-datacentret Project Jupiter (Invezz 2026-10-13; Benzinga 2026-10-13). Kursen ligger under EMA50 (145,01) och MA200 (161,18), 54 % under 250-dagarshögsta. Det finns ingen verkställd katalysator och inget case.
- **`state/news_feed.json`** (`generatedAt` 2026-10-14T00:19:56Z) bär 10 av 10 handelsdagar (2026-10-01 – 2026-10-14, `missingDays` tomt), med 91 poster för 2026-10-13. Rubrikerna efter stängning innehåller inga bekräftade amerikanska bolagskatalysatorer inom fokus: 8-K utan rubrik, gruppstämningsannonser, datumbesked (Cabot, Pilgrim's Pride, Targa) och ett AUKUS-kontrakt till HII. **`globenewswire` och `globenewswire-earnings` svarar fortfarande HTTP 403** (åtgärdspunkt 1), så den delen av pressmeddelandeflödet är **OKONTROLLERAD**.
- Inga rykten används i dag.

## Uppföljning av tidigare case

Föregående scout-rapport är `reports/scout/rapport-261013.md`, och den hade inga case. **Inga tidigare case att följa upp.**

**Kandidatkön (`state/scout_candidates.json`, före dagens tillägg 76 poster: 71 `rejected`, 5 `promoted`, 0 `new`):** US-rotationens LÄGE A togs igen 2026-10-13 (`reports/us_weekly/us-veckorapport-261013.md`, 24 `book: "us"`-rader med `mode: "A"` i `state/decisions.json`). Den avgjorde `261010-TEVA` och `261010-ZS` (båda avvisade på grind 2, volym) samt `261008-VST`, `261008-COST` och `261009-ACN`. Åtgärdspunkt 4 i rapport-261013 är därmed löst för US-boken. Nordiska LÄGE A finns också (`reports/weekly/veckorapport-261013.md`).

**L-4-kontroll:** `261009-DVN` fick sin omprövning 2026-10-13 med en ny rad (AVVAKTA, "L-4-omprovning … dataluckan fylld"). Inga andra avvisade poster inom sin `expiresAt` vilar på en datalucka. L-4 är uppfylld.

**Innehav:** `MRVL` 268,73 (+1,08 %, marketTime 2026-10-13T20:00:01Z). Dagens lägsta var 248,45, alltså **under stop 260,00**. Stopnivån korsades intradag (`dayLow` i `state/prices.json`). Monitorn har flaggat det: `state/alerts.json` (`checkedAt` 2026-10-13T20:30:23Z) bär en aktiv signal **SÄLJ – "stop-loss träffad"**, nivå 260, `basis: "intraday"`, `hitPrice` 248,45. Stängningen ligger 3,4 % över stop. Det avgörandet ägs av US-rotationen (LÄGE B 15:00 CEST i dag), inte av scouten.

## Dagens case

### Case 1: Meta Platforms (META / NASDAQ)
**Katalysator:** **Bekräftat utfall 2026-10-12:** Meta lanserade Muse Wonder och Muse Wonder Full, bolagets första frontier-modeller. Muse Wonder säljs via Meta Model API och Muse Code för 4 USD per miljon input-token och 20 USD per miljon output-token. Wonder Full är reserverad för Muse Code-abonnenter, och konsumentnivåerna kostar 20 och 100 USD i månaden (Meta Newsroom, about.fb.com 2026-10-12; TechCrunch 2026-10-12; Seoul Economic Daily 2026-10-13). Det är första gången Meta tar betalt direkt för sin AI. Artificial Analysis placerar Wonder Full på 56 i sitt intelligensindex, två poäng efter ledaren (sekundärt återgivet, Fello AI 2026-10). Dessutom höjde Pivotal Research riktkursen till 930 USD (Investing.com 2026-10-13). Muse-appen hade 5 miljoner nedladdningar på 22 dagar (tredjepartsdata, se rapport-261013).
**Bull case:** Lanseringen ger Meta en direkt intäktsström från AI utöver annonserna. Det är svaret på frågan om capex-cykeln kan betala sig. Marknaden belönar AI med tydlig monetisering: META steg två dagar i rad medan Nasdaq och halvledarna föll.
**Bear case:** **Rapporten 2026-10-21 (`state/earnings_calendar.json`, `isEstimate: false`) ligger 5 handelsdagar bort.** Rapportförbudet i punkt 8 gäller, så **ett köp inför rapporten är uteslutet**, och caset är en bevakningspost för ansvarig bok. Källorna är oeniga om datumet (vissa anger 2026-10-27). Oberoende benchmarks är motstridiga (52 eller 56 poäng), modellerna har inga öppna vikter, och capex-frågan kan väcka oro i rapporten. Volymen är 1,04× 20-dagarssnittet, under grind 2:s 1,5×.
**Setup:** Kursen var 762,50 USD (`state/prices.json`, marketTime 2026-10-13T20:00:01Z, Yahoo Finance chart API). Den ligger efter katalysatorn (lansering 12/10, två hela sessioner efter). Full EMA-stack: kursen ligger över EMA20 (716,92), som ligger över EMA50 (672,85), som ligger över MA200 (631,00). RSI 66,0. MACD-histogrammet är negativt men stiger (−4,82 → −2,98) och har inte korsat. Kursen ligger 1,9 % under 250-dagarshögsta på 777,59, som är närmaste motstånd. Stödet är EMA20 ~717 (−6,0 %). Volymkvoten är 1,04× (`state/volume_history.json`). Nyckeltal saknas i repots filer och anges inte. Kandidaten är skriven till `state/scout_candidates.json` som `261014-META` (`confirmed: true`, `catalystType: other`, `expiresAt` 2026-10-21).

**Inga fler case.** Bankerna och JNJ har bekräftade utfall, men reaktionen var negativ och kurserna ligger under EMA20/EMA50, så de ger ingen köpsetup. ORCL saknar verkställd katalysator och ligger under MA200. Kryptot har ingen kryptospecifik katalysator: ETF-flödesvändningen är en dags data, och ETH ligger kvar under EMA20.

## Makro- & sektorfaktorer att bevaka

**KPI i dag är binär.** En siffra på 3,6–3,7 % å/å med energi som drivkraft är väntad. Det som rör marknaden är kärn-KPI: +0,3 % m/m eller mer väcker talet om en höjning till i oktober, efter Feds höjning i september. Det är motvind för fokusfilens tema "tillväxtbolag som gynnas av fallande/stabila räntor" och för krypto via realräntorna.

**Sektorrotation:** bankerna säljs på bra siffror, och halvledarutrustning ger tillbaka (AMAT, MU, SKHY). Nasdaqs MACD-histogram har vänt negativt. Pengarna söker sig till AI med tydlig monetisering (META) och till energi och kraft (`DVN` +2,55 %, `VST` +2,68 %, `XOM` +1,12 %, `CVX` +1,27 %). TSM på torsdag blir nästa test för AI-hårdvaran.

**Energi och geopolitik:** produktionen i Mexikanska golfen återstartas efter orkanen Isaias (se rapport-261013). Mellanöstern håller Brent kring 100 USD/fat, vilket driver KPI-energin. Ingen oljenivå kan verifieras ur repots filer.

**Krypto:** BTC ligger över EMA20 och MA200 med RSI 55,9 och vände upp på ETF-inflöden. Ett trendbrott uppåt kräver att inflödena håller i sig efter KPI. Ett varmt utfall är den största risken.

### Åtgärdspunkter till Dren (L-3)

1. **`news-feed-globenewswire-http-403` – kvarstår, ÅTERKOMMANDE.** I `state/news_feed.json` är `feeds.globenewswire` = `"HTTP 403 – båda försöken (0.0 s)"` och `feeds.globenewswire-earnings` = `"HTTP 403 – båda försöken (0.0 s)"` vid körningen 2026-10-14T00:19:56Z. **Omfång:** 2 av 6 flöden, varav ett är den enda källan som är dedikerad åt rapportöverraskningar. **Ersättningskälla:** websök och SEC 8-K.
2. **`macro-calendar-not-verifiable-from-state` – ÅTERKOMMANDE (öppen 5 veckor).** KPI- och PPI-datum och KPI-konsensus kommer ur websök, och källorna skiljer sig åt (3,6 % mot 3,7 % å/å, kärn-KPI 2,4 % mot 2,5 %). **Omfång:** samtliga makrodatum i rapporten. Metas rapportdatum skiljer sig dessutom mellan `state/earnings_calendar.json` (2026-10-21) och rapport-261013 och medier (2026-10-27).
3. **`crypto-previousclose-misdated` – ÅTERKOMMANDE (öppen 7 veckor).** I `state/prices.json` är `quotes["BTC-USD"].previousClose` = 81 762,56. Det ger +1,97 %, alltså en tvådygnsrörelse, eftersom punkten 2026-10-13 i `state/price_history.json` (83 354,89) skrevs vid förra nattens körning och inte är ett dygnsslut. `ETH-USD`: `previousClose` 2 444,36 mot punkten 2026-10-12 på 2 450,01. **Omfång:** 2 av 2 mynt. **Ersättningskälla:** den daterade punkten 2026-10-12 i marknadsöversikten, med rörelsen uttryckligen angiven som sedan måndag.
4. **`watchlist-cap-vs-measurability-conflict` – ÅTERKOMMANDE.** `config/watchlist_us.txt` har 106 symbolrader mot riktmärket 25. Inga rader stryks, eftersom skydden i `prompts/gemensam_korning.md` går före riktmärket: giltiga kandidater, 20-dagarsutvärdering och rapportbevakning. `BK` saknar fortfarande kurs i `state/prices.json`. Det är en av 6 symboler utan `price`, tillsammans med `AI-USD`, `BIOT.ST`, `DOMETIC.ST`, `ICA.ST` och `NRS.OL`.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
