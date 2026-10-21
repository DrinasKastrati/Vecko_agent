# Daglig Scout: USA & Krypto
**Datum:** 2026-10-21
**Marknadsklimat:** Onsdag morgon före öppning. Tisdagen var en rotationsdag: S&P 500 steg +0,28 % och Dow +1,02 %, medan Nasdaq stod still (−0,02 %). Krypto tog tillbaka (BTC +1,28 %, ETH +1,74 % mot daterad punkt 2026-10-19). Efter stängning kom två bekräftade positiva överraskningar, `SMCI` (preliminär Q1) och `COF` (Q3). `NFLX` föll ~6 % efterbörs på sänkt annonsprognos. **Dagens binära punkt är `META` och `TSLA` efter stängning.** **Aktiva lärdomar tillämpade:** L-3 (åtgärdspunkter sist), L-4 (kontroll av vilande kandidater), L-5 (rapportkalenderns källa och täckning; `COF` läggs i watchlist) och L-6 (inga klasser utesluts). L-1, L-2, L-7 och L-8 gäller inte scouten.

## Marknadsöversikt

`git fetch` 2026-10-21 05:49 UTC (07:49 CEST) gav `origin/main` = `89b1ce4`. `state/prices.json`: `generatedAt` 2026-10-20T23:51:43.627Z, `schemaVersion` 2026-08-02-prevclose, `tickerCount` 227, `okCount` 225 (smal körning; `wideAt` 2026-10-20T00:20:25Z, dagens breda körning hade ännu inte landat). Källa: `Yahoo Finance chart API via GitHub Actions`.

| Symbol | Nivå | Senaste rörelse | marketTime |
|---|---|---|---|
| `^GSPC` | 7 712,57 | +0,28 % (7 690,73 → 7 712,57) | 2026-10-20T20:45:45Z |
| `^IXIC` | 26 424,82 | −0,02 % (26 430,89 → 26 424,82) | 2026-10-20T21:15:59Z |
| `BTC-USD` | 82 925,62 | +1,28 % mot daterad punkt 2026-10-19 (81 875,51) | 2026-10-20T23:50:27Z |
| `ETH-USD` | 2 446,90 | +1,74 % mot daterad punkt 2026-10-19 (2 405,17) | 2026-10-20T23:50:33Z |
| `SPY` (sleeve) | 769,05 | +0,34 % (766,48 → 769,05) | 2026-10-20T20:00:00Z |

S&P-stängningen 7 712,57 bekräftas av FRED-serien SP500 och av Yahoo Finance markets news 2026-10-20. Dow +529,85 till 52 495,88 (samma källa). Åtta av elva sektorer steg, med hälsovård, fastigheter och kraftbolag i täten. Oljan föll på förhoppningar om diplomati i Mellanöstern.

**Tisdagens största rörelser i den US-bevakade mängden** (`price / previousClose − 1`, `state/prices.json`, 109 US-symboler med marketTime 2026-10-20): upp `MSTR` +4,93 %, `AGNC` +4,27 %, `BIIB` +4,12 %, `PCVX` +4,00 %, `TLX` +3,91 %, `FITB` +3,76 %, `PAYC` +3,68 %, `JEF` +3,23 %, `UNH` +3,04 %; ned `IREN` −4,00 %, `EVCM` −3,68 %, `CBRL` −3,38 %, `AESI` −2,70 %, `SKHY` −2,16 %, `AMAT` −1,97 %. `FITB` och `JEF` följer upp sina Q3-utfall 2026-10-19 (redan avgjorda av US-boken i us-veckorapport-261019). Övriga saknar verifierad daterad katalysator och är inga case.

**Efterbörs 2026-10-20** (`extendedPrice`, `extendedSession: post`, `state/prices.json`): `NFLX` 64,67 (−5,85 % mot stängning, 23:50:59Z), `BE` 233,50 (+4,87 %, 23:49:47Z), `TSLA` 379,99 (+1,68 %), `META` 695,94 (+0,24 %), `ABT` 102,26 (−0,18 %). Endast fem US-symboler bär en utökad kurs. Övriga efterbörsrörelser nedan kommer ur nyhetskällor och är **inte** kursverifierade.

**Teknik** (räknad på råserien i `state/price_history.json`, 250 punkter):
- **`^GSPC`:** 5,9 % över MA200 (7 279,90) ⇒ **regimfiltret för US-boken är fortsatt PÅ**. Strax under EMA20 (7 725,87), över EMA50 (7 682,03). RSI 49,4. MACD-histogrammet har slutat fördjupas (−10,99 → −10,86), första förbättringen sedan förra veckans fall.
- **`^IXIC`:** under EMA20 (26 809,99) och EMA50 (26 606,79), över MA200 (24 951,25). RSI 43,2. Histogrammet är oförändrat negativt (−134,08 → −134,39).
- **`BTC-USD`:** RSI 54,2, åter över EMA20 (82 351,75), över EMA50 (79 359,56) och MA200 (71 781,60). Histogrammet krymper (−577,7 → −465,5).
- **`ETH-USD`:** RSI 44,2, under EMA20 (2 509,13), strax över EMA50 (2 441,63), över MA200 (2 119,71). Histogrammet krymper (−33,7 → −28,1).

**Kryptoflöden:** inga verifierbara ETF-flöden för 2026-10-16 – 2026-10-20 hittades. Senaste dagssiffran är +5,1 MUSD netto 2026-10-15 (Farside via AlphaMaven). **Ingen ny flödessiffra används i dag.**

## Ekonomiska siffror & kalender

**Senaste utfall:**
- **Industriproduktion september +0,7 % m/m mot väntat +0,4 %** (Federal Reserve G.17, 2026-10-16). Fortfarande det senaste större makroutfallet.
- 2026-10-20: husbyggstarter, bygglov och pending home sales för september låg i kalendern (investrade.com veckokalender 2026-10-16). **Utfallen kunde inte verifieras** från körmiljön.
- Fed-ordförande Warsh gav ingen räntesignal (2026-10-16). Fed är i tystnadsperiod inför FOMC 27–28 oktober.

**Kommande:**
- **Onsdag 2026-10-21 (i dag):** 20-årig statsobligationsauktion, 13 mdr USD (investrade.com). **`META`, `TSLA` och `ABT` efter stängning. Det är veckans mest marknadsrörande punkt:** Metas capex-guidning avgör tonen för AI-kedjan efter förra veckans oro kring lånefinansierad AI-utbyggnad.
- **Torsdag 2026-10-22 14:30 CEST:** initiala arbetslöshetsanspråk, väntat 200 000 mot förra 199 000 (TD Economics/investrade, 2026-10-16). `BE` rapporterar.
- **Fredag 2026-10-23 15:45 CEST:** S&P Global flash-PMI oktober. Tillverkning väntas 55,5 (förra 55,9) och tjänster 57,9 (förra 58,8) enligt samma källa. Samma dag UMich-sentimentet.
- **FOMC 27–28 oktober** ligger utanför 5-dagarsfönstret.

**Rapporter nästa 5 handelsdagar** (`state/earnings_calendar.json`, `generatedAt` 2026-10-20T00:18:46Z, `errors` tomt):
- 10-21: `META`, `TSLA`, `ABT`
- 10-22: `BE`
- 10-26: `PECO`
- 10-27: `BA`, `ITW` och `SKHY` (**gissat datum**, `isEstimate`)
- 10-28: `MSFT`, `GOOGL`, `BIIB`, `AWK`, `AXGN` och `UTHR` (**gissat**)

**L-5:** kalendern ser bara de symboler `prices.yml` hämtar. Resten av det amerikanska universumet är **OKONTROLLERAT**: `COF`, `ISRG`, `SPCX` och `ALK` rapporterade 2026-10-20 utan att finnas i filen. Samtliga uppräknade rapportbolag finns redan i `config/watchlist_us.txt`. `COF` läggs till i dag (se nedan). Alla rapportdatum är bevakningsposter enligt punkt 8, aldrig köpförslag.

## Aktuella händelser & katalysatorer

- **`SMCI`: preliminär Q1 FY2027, 2026-10-20 efter stängning (bekräftat, Supermicro IR + SEC 8-K).** Intäkten uppskattas till **18,5–19,5 mdr USD mot tidigare guidning 14,5–15,5 mdr**. Bruttomarginalen uppskattas till **12,0–12,5 % mot 10,4–10,8 %**. Bolaget anger AI-plattformsefterfrågan som orsak. Siffrorna är oreviderade, och fullständig rapport kommer 2026-11-03. Aktien steg ~10–11 % efterbörs (Futu News / CNBC 2026-10-20). Det finns ingen kursverifiering i `state/prices.json`.
- **`COF`: Q3 2026-10-20 efter stängning (bekräftat, SEC 8-K ex. 99.1).** Nettovinsten blev **3,5 mdr USD, 5,61 USD/aktie**, och **justerat 6,69 USD/aktie**. Konsensus före rapporten var ~5,32–5,45 enligt olika aggregatorer (källorna skiljer sig, jämför på samma bas). +4,83 % efterbörs till 211,30 (Chartmill 2026-10-20). Symbolen hämtas inte, så **KURS EJ VERIFIERAD**.
- **`NFLX`: Q3 2026-10-20 efter stängning (bekräftat, SEC 8-K ex. 99.1 / Variety / Deadline).** Intäkten blev 12,87 mdr USD (+11,8 %, i linje med förväntan). EPS 0,87 mot ~0,82, och rörelsemarginal 34,6 %. **Helårsprognosen för annonsintäkter sänktes till ~2,7 mdr från 3 mdr USD**, med en svagare Q4-prognos. Bolaget har dessutom sagt upp ~1 000 anställda (Variety). Efterbörs 64,67 (−5,85 %, `state/prices.json`, 2026-10-20T23:50:59Z). Kursen ligger 16,9 % under MA200 (82,65). **Negativt utfall – inget case.**
- **`ISRG`: Q3 2026-10-20 efter stängning,** −7 till −11 % efterbörs (CNBC/Chartmill 2026-10-20). Symbolen hämtas inte, så den är OKONTROLLERAD. Negativ reaktion, inget case.
- **`SPCX` (SpaceX): Q3 2026-10-20 efter stängning,** +6–8 % efterbörs (CNBC / Investing.com 2026-10-20). **Utfallssiffrorna kunde inte verifieras** (sökningen gav bara Q2-materialet). Symbolen hämtas inte. Inget case förrän utfallet är verifierat.
- **`state/news_feed.json`** (`generatedAt` 2026-10-20T23:56:15Z) täcker **10 av 10 handelsdagar** (2026-10-06 – 2026-10-20) och har tom `missingDays`. Feeden har 90 poster för 2026-10-20: Alaska Air Q3 (PR Newswire 22:39 UTC), samt 8-K från Jefferies, Chubb, CBRE och Huntington Ingalls (21:04–21:25 UTC) och MoonPay–Dunamu-samarbete (23:00 UTC). Inget av detta gav en handlingsbar koppling till bevakade namn utöver ovanstående.
- Inga rykten från godkända medier används i dag.

## Uppföljning av tidigare case

Den senaste tidigare scout-rapporten (rapport-261020) innehöll **inga case**. Uppföljningen gäller därför de senaste casen (rapport-261017 och -261016), nu mot tisdagens session:
- **`CRGY` (rapport-261017): 13,77 → 13,51 (−1,89 %, `state/prices.json`, marketTime 2026-10-20T20:00:02Z) – tes INTAKT.** Kursen ligger över EMA20 (13,29), EMA50 (13,10) och MA200 (11,79). RSI 52,8, och MACD-histogrammet är positivt och stiger (+0,029 → +0,044). Kandidaten avvisad 2026-10-19 på grind 3 (omdömesskäl).
- **`TSM` (rapport-261016): 422,25 → 425,08 (+0,67 %, samma fil, marketTime 2026-10-20T20:00:03Z) – tes FÖRSVAGAD.** Kursen ligger fortfarande under EMA20 (440,23) och EMA50 (436,08). RSI 41,9, och histogrammet krymper (−6,79 → −6,14).
- **`USB` (rapport-261016): 57,39 → 59,09 (+2,96 %, samma fil, marketTime 2026-10-20T20:00:02Z) – tes INTAKT.** +2,14 % i går, nu 2,1 % över MA200 (57,86) och över EMA20 (58,21), men strax under EMA50 (59,54). Histogrammet är positivt (+0,25 → +0,34). Kandidaten är redan avvisad. Bedömningen gäller tesen, inte ett nytt beslut.

**Kandidatkön (`state/scout_candidates.json`):** 82 poster före körningen (77 `rejected`, 5 `promoted`, **inga `new`**). I dag läggs två nya `new`-poster till (se Dagens case).

**L-4-kontroll:** inga avvisade poster inom sin `expiresAt` vilar på en tillfällig datalucka. `261016-TSM`, `261016-USB` och `261017-CRGY` avvisades av omdömesskäl (teknik, nåbarhet, katalysatorfönster). L-4 är uppfylld.

**Innehav:** US-boken har inga aktieinnehav. `SPY` ligger på 100 % (`state/portfolj_us.md`). `state/alerts.json` har inga aktiva signaler (`checkedAt` 2026-10-20T21:17:59Z).

## Dagens case

### Case 1: Super Micro Computer (SMCI / NASDAQ)
**Katalysator:** Preliminär affärsuppdatering för Q1 FY2027 (kvartalet till 2026-09-30), publicerad **2026-10-20 efter stängning** via pressmeddelande och SEC 8-K. Intäkten uppskattas till **18,5–19,5 mdr USD mot tidigare guidning 14,5–15,5 mdr**, ~27 % över mittpunkten. Bruttomarginalen uppskattas till **12,0–12,5 % mot 10,4–10,8 %**, tack vare kund- och produktmix. Bolaget anger efterfrågan på AI-plattformar som huvudorsak. **Bekräftat utfall (`confirmed: true`), inget rykte.** Källor: Supermicro IR och SEC 8-K 2026-10-20, TradingView/RTTNews 2026-10-20.
**Bull case:** Både volym och marginal höjs samtidigt. Det motsäger den gängse bilden att SMCI köper volym med marginal, och en marginal över 12 % på ~19 mdr USD ger en kraftig vinstrevision. Uppdateringen kommer mitt i oron kring AI-capex och är en hård datapunkt för att efterfrågan på serverplattformar håller.
**Bear case:** Siffrorna är **oreviderade** och kan ändras i bokslutet (8-K:ns egen reservation). Bolaget har en historik av redovisningsproblem, vilket ger högre risk för diskontering. En bruttomarginal på 12 % är fortfarande låg för hårdvara. Fullständig rapport och guidning kommer 2026-11-03, alltså en andra binär händelse inom horisonten. Gapet efterbörs (~+10 %) gör en jakt på reaktionen dyr, med risk för "sell the news" om `META`:s capex i kväll besviker.
**Setup:** Senaste reguljära kurs **32,47 USD** (`state/prices.json`, marketTime 2026-10-20T20:00:00Z, Yahoo Finance chart API). **Det är en PRE-event-kurs**, eftersom 8-K:n kom efter stängning. Kandidaten skrivs därför med `price: null`, och `prices.yml` fyller i en kvalificerad post-event-kurs. Teknik på pre-event-serien (250 punkter): kursen ligger på MA200 (32,49, −0,1 %) och klart under EMA20 (37,99) och EMA50 (37,63). RSI 33,2 och MACD-histogram −1,41. Aktien har alltså fallit kraftigt in i beskedet. Volymen 2026-10-20 var 37,0 M mot 20-dagarssnittet 33,1 M (1,12×, `state/volume_history.json`). Ett +10 %-gap tar kursen till ~35,7, över MA200 men fortfarande under EMA20/EMA50. Grind 2 är därför inte given, och det avgör US-boken. Nyckeltal (P/E, EV/EBITDA) kunde inte verifieras från körmiljön.

### Case 2: Capital One Financial (COF / NYSE)
**Katalysator:** Q3 2026, publicerad **2026-10-20 efter stängning** (SEC 8-K ex. 99.1). Nettovinsten blev **3,5 mdr USD, 5,61 USD per utspädd aktie**, och **justerat 6,69 USD**. Pre-rapportkonsensus var ~5,32 resp. 5,45 USD enligt två aggregatorer (Hudson Labs / Benzinga). Källorna skiljer sig, men justerat utfall ligger över båda. Aktien steg **+4,83 % efterbörs till 211,30** (Chartmill S&P 500 after-hours movers 2026-10-20). **Bekräftat utfall (`confirmed: true`).**
**Bull case:** Ett klart vinstslag i den största kortutgivaren efter Discover-integrationen tyder på att synergierna och kreditkvaliteten håller bättre än väntat. Samtidigt sorterar marknaden hårt bland banker (`FITB` +3,76 % och `USB` +2,14 % i går på sina utfall). Rotationen från tech till värde (Dow +1,02 % mot Nasdaq −0,02 %) är medvind.
**Bear case:** Vinsten är **justerad**. Avståndet mellan GAAP 5,61 och justerat 6,69 är stort, och integrationskostnaderna kan dölja svagare underliggande trend. Konsumentkreditförluster är cykliska, och förra veckans finansoro (`AGNC` TNBV −16,9 %) visar att räntekänsliga namn kan vända snabbt. Konsensus är inte entydig, så överraskningens storlek är osäker.
**Setup:** **KURS EJ VERIFIERAD.** `COF` saknas i `state/prices.json` (`generatedAt` 2026-10-20T23:51:43Z) och i `state/price_history.json`. Efterbörskursen 211,30 kommer från en nyhetskälla och används inte som underlag. **`COF` läggs i `config/watchlist_us.txt` i dag** så att kurs och serie hämtas. Kandidaten skrivs med `price: null` och kan avfärdas men aldrig köpas utan verifierad kurs. Teknik och nyckeltal kan inte beräknas förrän serien finns. Grind 2 (RSI/MACD) kräver backfill av historiken, och `backfill-history.mjs --missing=200` fyller korta serier på dygnskörningen.

## Makro- & sektorfaktorer att bevaka

**Rotation från tech till värde:** tisdagen bar tydliga tecken på rotation. Dow +1,02 %, Nasdaq −0,02 %, och halvledare var svaga (`AMAT` −1,97 %, `SKHY` −2,16 %). S&P-histogrammet har slutat fördjupas men är fortfarande negativt, och Nasdaq ligger kvar under EMA20/EMA50. **Med- och motvind för dagens case:** för `COF` är rotationen medvind. För `SMCI` är den motvind, och dess beskedsreaktion hänger direkt på `META`:s capex-besked i kväll.

**AI-kedjan:** avgörs av `META` i kväll och därefter `MSFT`/`GOOGL` (2026-10-28) enligt `state/earnings_calendar.json`. SMCI:s höjning är en datapunkt *för* efterfrågan. Förra veckans oro gällde finansieringen av utbyggnaden, inte efterfrågan.

**Räntor och olja:** marknaden prissätter paus vid FOMC 27–28 oktober. Oljan föll i går på förhoppningar om diplomati i Mellanöstern (Yahoo Finance 2026-10-20), vilket är medvind för inflationsbilden men motvind för energinamn (`CRGY` −1,39 %).

**Streaming/annonser:** `NFLX`:s sänkta annonsprognos (~2,7 mdr mot 3 mdr USD) är en negativ läsning för annonsmarknaden inför `META` i kväll.

**Krypto:** BTC har återtagit EMA20 och histogrammet krymper. `MSTR` +4,93 % följer med. Inga verifierade ETF-flöden, och MSCI-beslutet om `MSTR` väntas 2026-11-11 (The Block 2026-10-15). Krypto saknar fortfarande en egen positiv katalysator, så det blir inget kryptocase i dag.

### Åtgärdspunkter till Dren (L-3)

1. **`news-feed-globenewswire-http-403` – kvarstår, ÅTERKOMMANDE.** `feeds.globenewswire` = `"HTTP 403 – båda försöken (0.1 s)"` och `feeds.globenewswire-earnings` = `"HTTP 403 – båda försöken (0.0 s)"` (`state/news_feed.json`, 2026-10-20T23:56:15Z). **Omfång:** 2 av 6 flöden. **Ersättningskälla:** websök/SEC EDGAR.
2. **`macro-calendar-not-verifiable-from-state` – ÅTERKOMMANDE.** Makrokalendern, konsensus och kryptoflöden kommer ur websök. Husbyggstarter och pending home sales 2026-10-20 gick inte att verifiera alls. WebFetch mot sec.gov och finance.yahoo.com gav dessutom `ENOTFOUND` i dag, så 8-K-siffrorna ovan är verifierade via sökresultatens återgivning av filingarna, inte via direktläsning. **Omfång:** samtliga makrodatum och -värden samt fyra bolagsutfall (SMCI, COF, NFLX, ISRG).
3. **`crypto-previousclose-misdated` – ÅTERKOMMANDE.** `quotes["BTC-USD"].previousClose` är 81 853,54, medan den daterade punkten 2026-10-19 i `state/price_history.json` är 81 875,51. För `ETH-USD` är det 2 404,82 mot 2 405,17. **Omfång:** 2 av 2 mynt. **Ersättningskälla:** den daterade punkten, som används i tabellen.
4. **`watchlist-cap-vs-measurability-conflict` – ÅTERKOMMANDE.** `config/watchlist_us.txt` har långt fler än riktmärket 25 symboler. Inga rader stryks, eftersom skydden i `prompts/gemensam_korning.md` går före riktmärket. En rad (`COF`) läggs till. 2 av 227 symboler i `state/prices.json` saknar `price` (`BK`, `NRS.OL`); `BK` är den enda US-symbolen.
5. **`us-earnings-movers-not-priced` – NY.** Fyra S&P 500-bolag som rapporterade 2026-10-20 med efterbörsrörelser på 5–11 % (`COF`, `ISRG`, `SPCX`, `ALK`) saknas i `state/prices.json` och `state/earnings_calendar.json`. Bara `SMCI` och `NFLX` av gårdagens stora efterbörsrörelser var prisbevakade. **Omfång:** 4 symboler; `COF` åtgärdad i dag via watchlist.
6. **`^VIX` hämtas inte – kvarstår.** **Omfång:** 1 symbol.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
