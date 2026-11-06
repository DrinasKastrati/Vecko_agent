# Daglig Scout: USA & Krypto
**Datum:** 2026-11-06
**Marknadsklimat:** Det är fredag före öppning, och onsdagens lättnadsrally är helt utraderad. Torsdagen gav en AI-krasch: `^GSPC` −4,36 %, `^IXIC` −5,52 % och Philadelphia-halvledarindexet −12,25 %, dess största dagsfall på över sex år. Nasdaq gick därmed in i korrektion, och VIX steg ~60 % till över 27 (StockTitan, CNBC och Yahoo Finance 2026-11-05). Krypto föll med, och BTC ligger på ~76 000. **Aktiva lärdomar tillämpade:** L-3 (åtgärdspunkter sist), L-4 (APP och COHR har nu full serie, se uppföljningen), L-5 (kalenderns och flödets täckning) och L-6 (inga klasser utesluts). L-1, L-2, L-7 och L-8 gäller inte scouten.

## Marknadsöversikt

`git pull` kördes 2026-11-06 05:48 UTC (06:48 CET): HEAD = `origin/main` = `99747ba`. Källan är `state/prices.json` med `generatedAt` 2026-11-06T01:33:16Z, `schemaVersion` 2026-08-02-prevclose, `tickerCount` 308 och `okCount` 303 (Yahoo Finance chart API via GitHub Actions). Hämtningen var bred (`wideAt` = `generatedAt`). Nyhetsflödet (`state/news_feed.json`) har `generatedAt` 2026-11-06T01:35:38Z och täcker 10 av 10 handelsdagar (2026-10-26 – 2026-11-06).

| Symbol | Senaste verifierade nivå | Rörelse | marketTime |
|---|---|---|---|
| `^GSPC` | 7 353,73 | −4,36 % (7 688,62 → 7 353,73) | 2026-11-05T21:34:08Z |
| `^IXIC` | 24 315,00 | −5,52 % (25 736,51 → 24 315,00) | 2026-11-05T22:15:59Z |
| `BTC-USD` | 75 991,80 | +0,07 % mot daterad punkt 2026-11-05 (75 936,00); −5,42 % mot gårdagens rapport (80 348,72) | 2026-11-06T01:31:40Z |
| `ETH-USD` | 2 232,93 | −0,26 % mot daterad punkt 2026-11-05 (2 238,86); −7,48 % mot gårdagens rapport (2 413,54) | 2026-11-06T01:31:58Z |
| `SPY` (sleeve) | 733,00 | −4,41 % (766,81 → 733,00) | 2026-11-05T21:00:00Z |

Kryptorörelserna är räknade mot den daterade punkten i `state/price_history.json`, inte mot `previousClose` (åtgärdspunkt 2).

**Torsdagens bredd bland de hämtade US-symbolerna:** 127 USD-noterade symboler hade marketTime 2026-11-05 i `state/prices.json`, och **bara 10 av dem steg**. Resten av marknaden är OKONTROLLERAD enligt L-5.
- **Uppgångarna:** `APP` +31,04 %, `U` +14,93 %, `CBOE` +2,28 %, `AWK` +1,86 %, `COST` +1,83 %, `KMB` +1,54 %, `BKH` +0,52 %, `ACN` +0,34 %, `PEP` +0,20 % och `QGEN` +0,06 %.
- **Sämst:** `AESI` −20,95 %, `MU` −17,46 %, `AMD` −17,26 %, `IREN` −16,95 %, `CLSK` −16,47 %, `MRVL` −16,43 %, `BE` −16,41 %, `CIEN` −15,22 %, `APLD` −14,69 %, `MARA` −14,48 %, `FN` −14,25 %, `VRT` −14,02 %, `AMAT` −13,58 % och `SKHY` −13,40 %.
- **Megacaps:** `NVDA` −9,26 %, `AVGO` −10,43 %, `TSLA` −10,77 %, `PLTR` −9,73 %, `META` −3,96 %, `MSFT` −3,58 %, `GOOGL` −2,20 %, `AMZN` −2,19 % och `AAPL` −1,53 %.

Fallet var brett, men hårdast i halvledare, minne, optik och AI-kraft. Det som höll var defensivt (vatten, dagligvaror) och två annonsplattformar med starka rapporter, plus `CBOE`, som tjänar på volatilitet.

**Teknik** (räknad på råserien i `state/price_history.json`, sista punkt 2026-11-05):
- `^GSPC` ligger **bara 0,42 % över MA200** (7 322,71), ned från 5,03 % i går, med RSI 33,5 och 4,33 % under MA50. ⇒ **Regimfiltret för US-boken är fortfarande PÅ, men med minimal marginal.** En dag till av samma slag slår av det.
- `^IXIC` ligger **3,10 % under MA200** (25 092,53) och 8,24 % under MA50, med RSI 30,1.
- `BTC-USD` ligger 4,73 % över MA200 (72 556,70) men 6,21 % under MA50, med RSI 39,2. `ETH-USD` ligger 4,50 % över MA200 (2 136,79) och 10,19 % under MA50, med RSI 39,4.

## Ekonomiska siffror & kalender

**Senaste utfall:**
- **Jobless claims, veckan till 2026-10-31 (publicerad 2026-11-05): 189 000** mot ~196 000–197 000 väntat. Det är en minskning med 6 000 och den lägsta nivån sedan juli. Fyraveckorssnittet är 194 750 och continuing claims 1,718 mn (FXStreet, InvestingLive och FXTribune 2026-11-05).
- **Sedan tidigare i veckan:** ADP oktober +86 000 mot ~69 000–75 000 och ISM tjänster 54,5 (prices 73,0), båda 2026-11-04. Före det kom ISM tillverkning 55,5, JOLTS 7,52 mn, kärn-PCE september 3,1 % och BNP Q3 +3,4 %.
- **Räntor och Fed:** Inga nya repo-verifierade nivåer finns (`^TNX` och `DX-Y.NYB` saknas i `state/prices.json`, åtgärdspunkt 4). Senast kända uppgift är från 2026-11-04: terminerna prisade ~81 % sannolikhet för en höjning i december (CNBC och EBC 2026-11-04). StockTitan noterar att obligationer och ädelmetaller steg under torsdagens ras, alltså en flykt till säkerhet.

**Kommande:**
- **I DAG 2026-11-06, 08:30 ET (14:30 CET): NFP oktober – DAGENS OCH VECKANS MEST MARKNADSRÖRANDE.** Konsensus är ~65 000 för totalen och ~64 000 privata jobb (Reuters via Investing.com 2026-11-04). ADP och claims pekar båda åt en starkare arbetsmarknad än väntat, vilket i dagens läge är ett tveeggat svärd: det minskar recessionsrisken men stärker fallet för en decemberhöjning just när långduration och AI säljs.
- **I dag före öppning: `VST` (Vistra) rapporterar**, med uppdaterad 2027-prognos, efter −13,83 % i onsdags och −6,15 % i torsdags. Efterbörskursen var 114,50 (extendedTime 2026-11-06T00:59:54Z, `post`), +1,43 % mot stängningen 112,89.

**Rapporter nästa 5 handelsdagar** ur `state/earnings_calendar.json` (`generatedAt` 2026-11-06T01:31:25Z, `errors` tomt), US-symboler:
- 11-06: `VST`
- 11-09: `ACHR`, `CEG`, `KKR` och `MARA`
- 11-12: `AMAT`. Det är nästa halvledartest efter torsdagens −13,58 %.
- Längre fram: `NVDA` 11-17, `HD` 11-17, `LOW`/`TGT` 11-18, `ROST`/`WMT` 11-19.

**L-5:** kalendern ser bara de symboler som `prices.yml` hämtar, så resten av det amerikanska universumet är **OKONTROLLERAT**. Alla datum är bevakningsposter enligt punkt 8, aldrig köpförslag.

## Aktuella händelser & katalysatorer

- **AI-kraschen (2026-11-05):** Dow −1 833 punkter (−3,44 %), S&P 500 −4,36 % och Nasdaq −5,52 %, in i korrektion. SOX föll −12,25 %, `MU` −17,46 % och SanDisk −22,26 %. Analytiker kopplar fallet till datacenterrestriktioner i minst 38 jurisdiktioner och till Texas tillträdande guvernör Gina Hinojosas krav på byggmoratorium för datacenter. Därtill kom Qualcomms svaga prognos för innevarande kvartal (StockTitan, CNBC och Yahoo Finance 2026-11-05; prices.json). VIX steg ~60 % till över 27.
- **Politik (2026-11-05):** Enligt BigGo Finance (2026-11-05) lade Trump skulden på demokraterna efter att ~2 000 mdr USD försvunnit ur Nasdaq. Uppgiften kommer från en enda källa.
- **Cloudflare Q3 2026 (2026-11-05 efter stängning, bekräftat):** intäkter 782,5 MUSD (+39 %) mot ~738, justerat EPS 0,38 mot 0,34 och höjd guide. Aktien steg ~+15–18 % efterbörs (Seeking Alpha, TipRanks, StockTitan och Motley Fool 2026-11-05/06). → Case 1.
- **Unity Q3 2026 (2026-11-05, bekräftat):** intäkter 622 MUSD (+32 %), Vector +126 % å/å och första GAAP-vinsten sedan börsnoteringen (Unity 8-K ex. 99.1 på SEC; Motley Fool och Yahoo Finance 2026-11-05). → Case 2.
- **Atlassian Q1 FY27 (2026-11-05 efter stängning, bekräftat):** slog estimaten (intäkter ~1,77 mdr USD mot ~1,71, justerat EPS 1,65 mot ~1,44) och höjde helårsguiden. Ändå föll aktien **~−17–18 % efterbörs**, eftersom subscription-ARR väntas sakta in från 22,5 % till ~18,5 % (SiliconANGLE, Seeking Alpha och Webull/Benzinga 2026-11-05). Inget case, eftersom reaktionen var negativ.
- **IREN Q1 FY27 (2026-11-05):** intäkter 228 MUSD, nettoförlust 263 MUSD och ARR-målet på >4 mdr USD skjutet till januari–februari (IREN 8-K på SEC). Aktien föll −16,95 % i sessionen. Inget case: kursen ligger 58,74 % under MA200.
- **Akamai Q3 2026 (2026-11-05 efter stängning):** intäkter 1,122 mdr USD (+6 %) och non-GAAP EPS 1,77 (−5 %), utan återköp i kvartalet (Akamai 8-K ex. 99.1 på SEC; `mfn` i `news_feed.json` 2026-11-05T21:01Z). Efterbörsreaktionen gick inte att verifiera. Inget case.
- **`news_feed.json`:** 111 poster efter 2026-11-05 13:00 UTC, men av de stora rapporterna finns bara Akamai (via `mfn`). Cloudflare, Atlassian och Unity saknas. Det stämmer med att GlobeNewswire-flödena fortfarande ger 403 (åtgärdspunkt 3).

## Uppföljning av tidigare case

Kurserna "då" är reguljära stängningar 2026-11-04 (PRE-event, före rapporterna samma kväll). Kurserna "nu" är reguljära stängningar 2026-11-05 ur `state/prices.json`.
- **`APP` (rapport-261105): 271,75 → 356,10** (+31,04 %; marketTime 2026-11-05T21:00:02Z, intervall 338,88–365,33). **Tes INTAKT** – reaktionen höll och växte på en dag då Nasdaq föll 5,5 %. Serien bär nu 250 punkter, och kursen ligger **13,14 % under MA200** (409,96) med RSI 71,8 och 22,04 % över MA50. **L-4:** `261105-APP` avvisades 2026-11-05 som vilande på omätbar grind 2. Dataluckan är fylld och en kvalificerad post-katalysatorkurs finns, så US-rotationen ska göra ett nytt avgörande. Notera att kurs under MA200 blockerar nya aktiepositioner enligt `prompts/gemensam_korning.md` ("Saknad MA200 eller kurs ≤ MA200 blockerar nya aktiepositioner").
- **`COHR` (rapport-261105): 195,09 → 169,76** (−12,98 %; marketTime 2026-11-05T21:00:02Z, intervall 160,24–188,60). **Tes PUNKTERAD** – efterbörsuppgången på ~7 % blev en dagsförlust på 13 % i halvledarraset. Kursen ligger 42,74 % under MA200 (296,47) med RSI 28,4. **L-4:** `261105-COHR` har nu full serie och ska omprövas av US-rotationen, men MA200 blockerar.

**Kandidatkön (`state/scout_candidates.json`) före dagens tillägg:** 111 poster, varav 103 `rejected`, 8 `promoted` och 0 `new`. Dagens tillägg är `261106-NET` och `261106-U`, båda `new` med `price: null`.

**US-boken (`state/portfolj_us.md`, sessionen 2026-11-05 i `state/prices.json`):**
- **`NUE`, innehav sedan 2026-11-04, entry 262,00: STOPP 247,00 BRUTEN.** Stängningen var 245,68 och dagslägsta 245,14 (marketTime 2026-11-05T21:00:02Z), −6,23 % mot entry. `state/alerts.json` (`checkedAt` 2026-11-05T21:46:31Z) bär SÄLJ-larmet "stop-loss träffad", och NUE ligger nu i `watched`. US-rotationen (15:00 CET) ska registrera säljet.
- `CBOE` (innehav, ben 1): stängning 353,07 (+2,28 %), över stoppen 316,00. Ben 2 ≤ 325,00 är **EJ TRIGGAD** (dagslägsta 345,18), och i dag 2026-11-06 är planens sista giltighetsdag.
- `AXGN` ≤ 46,00: dagslägsta 47,575, **EJ TRIGGAD**. Sista giltighetsdag var 2026-11-05, så planen avförs.

## Dagens case

### Case 1: Cloudflare (NET / NYSE)
**Katalysator:** Q3 2026, släppt 2026-11-05 efter stängning (bekräftat):
- Intäkter 782,5 MUSD (+39 % å/å) mot ~738–739 MUSD väntat.
- Justerat EPS 0,38 mot 0,34.
- Q4-guiden är ~845,5 MUSD i mitten mot konsensus 795,9 MUSD, och helårsguiden höjs.
- Aktien steg ~+15–18 % efterbörs, till omkring 281–290 USD beroende på källa och tidpunkt (Seeking Alpha, TipRanks, StockTitan, StockStory och Motley Fool 2026-11-05/06). Efterbörsnivåerna kommer ur artiklar och används inte för beslut.

**Bull case:** Tillväxten accelererar till 39 % (från ~28–30 % under 2025) i ett läge där marknaden straffar kapitalintensiv AI-hårdvara. Cloudflare säljer nätverks- och inferenskapacitet vid kanten som tjänst, en kapitallättare exponering mot AI-trafik. Q4-guiden ligger ~6 % över konsensus, vilket tyder på att accelerationen fortsätter. Att reaktionen kom på en dag då Nasdaq föll 5,5 % visar stark relativ efterfrågan, samma mönster som `APP` i torsdags (+31 %).
**Bear case:** Bruttomarginalen föll till 71,2 % från 74,0 %, FCF-marginalen till 10 % från 13 % och nettoförlusten var 34,1 MUSD (aktiebaserad ersättning 174,1 MUSD). Tillväxten köps alltså delvis med marginal. Aktien har fallit från ~320 (MA50) till 244,51 på fyra veckor. Ett gap på 15 %+ in i en marknad i korrektion med VIX över 27 kan backa, så som `COHR` gjorde i torsdags (+7 % efterbörs → −13 % i sessionen). Dagens NFP är en binär makrohändelse.
**Setup:** Reguljär stängning **244,51** (marketTime 2026-11-05T21:04:31Z, prices.json/Yahoo chart API, intervall 233,62–252,44, −8,28 % på dagen). Det är en **PRE-event-kurs** (stängning före AMC-rapporten), så kandidaten `261106-NET` har `price: null`. Tekniken på råserien (250 punkter): **2,11 % under MA200** (249,77), 23,35 % under MA50 (319,00) och RSI 29,4. Med efterbörsnivån skulle kursen ligga över MA200, men det avgörs först av en kvalificerad post-event-kurs (`prices.yml` fyller i). Värderingsmått kunde inte verifieras ur repot. `NET` finns redan i `config/watchlist_us.txt`.

### Case 2: Unity Software (U / NYSE)
**Katalysator:** Q3 2026, släppt 2026-11-05 (bekräftat):
- Intäkter 622 MUSD (+32 % å/å) och strategisk intäkt 597 MUSD (+59 %).
- Annonsplattformen **Vector +126 % å/å och +40 % sekventiellt**, ungefär dubbla bolagets egen guide på +20 %. Antalet aktiva annonsörskonton ökade 27 % kvartal mot kvartal.
- **Första GAAP-vinsten sedan börsnoteringen** (nettoresultat 122 MUSD).
- Q4-guiden för strategisk intäkt är 683–691 MUSD (+65–67 % å/å), med Vector-antagande på +21–23 % sekventiellt (Unity 8-K ex. 99.1 på SEC; Motley Fool, Yahoo Finance och 247wallst 2026-11-05).

**Bull case:** Unity går från ett mjukvarubolag i omställning till en växande annonsplattform. Vectors tillväxt och den första GAAP-vinsten bekräftar att omställningen fungerar. Samma dag som `APP` steg +31 % på sina annonssiffror steg `U` +14,93 % i en marknad som föll 4,4 %, vilket tyder på att marknaden sätter en sektorpremie på AI-driven mobilannonsering, inte på AI-hårdvara.
**Bear case:** Det är oklart hur mycket av torsdagens +14,93 % som var en sympatirörelse efter AppLovin och hur mycket som var en reaktion på Unitys egen rapport. Releasetiden har inte verifierats, och reaktionen efter releasen är okänd. Aktien har redan stigit ~54 % över MA200, och RSI är 68,2, nära grind 2:s övre kant. Unitys annonsaffär är konkurrent till `APP`, som har en marginal Unity är långt ifrån.
**Setup:** Reguljär stängning **48,80** (marketTime 2026-11-05T21:00:02Z, prices.json/Yahoo chart API, intervall 44,82–49,49, +14,93 % mot 42,46). Eftersom det inte är verifierat om releasen kom före eller efter den sessionen sätts `price: null` i `261106-U`. Det sänker inget krav, utan dokumenterar att det inte går att belägga att kursen ligger efter katalysatorn. Tekniken på råserien (250 punkter): 54,15 % över MA200 (31,66), 15,29 % över MA50 (42,33) och RSI 68,2. `U` finns redan i `config/watchlist_us.txt`.

## Makro- & sektorfaktorer att bevaka

**Regim:** `^GSPC` ligger 0,42 % över MA200, alltså på gränsen. Bryter indexet MA200 (7 322,71) slår regimfiltret av, och då får US-boken inte ta nya aktiepositioner. Det gäller båda dagens case oavsett utfall. `^IXIC` ligger redan 3,10 % under sin MA200.

**AI-handeln:** Uppdelningen från i onsdags har blivit en utförsäljning av hela AI-hårdvarukedjan (halvledare, minne, optik, kraft, miners med AI-hosting). Den drivs av politisk och regulatorisk risk mot datacenterbygget, inte av svaga rapporter: `AMD`, `SMCI` och `COHR` slog alla och föll ändå. Det som premieras är kapitallätt AI-intäkt (annonsplattformar, edge/tjänster), och dagens två case ligger där. **Ändå avråds från att jaga gap i en marknad med VIX över 27** – båda casen måste passera samtliga grindar på en kvalificerad post-event-kurs.

**Räntor/Fed:** Claims 189 000 och ADP +86 000 talar för en stark NFP i dag. En siffra klart över ~65 000 stärker decemberhöjningen (~81 % prisad per 2026-11-04) och är motvind för långduration i ett redan sårbart läge. En svag siffra kan ge lättnad för räntorna men samtidigt väcka tillväxtoro.

**Volatilitet:** `CBOE` steg +2,28 % på raset och är US-bokens enda innehav som gick upp. Det är en naturlig hedge i volatilitetsregimer.

**Krypto:** BTC och ETH föll med riskaptiten (−5,4 % respektive −7,5 % mot gårdagens rapport) och ligger nu under MA50 men 4–5 % över MA200, båda med RSI ~39. Kryptoaktierna föll hårdare (`COIN` −9,69 %, `MSTR` −9,29 %, `MARA` −14,48 %). Det finns ingen bolags- eller protokollkatalysator, så inget kryptocase i dag. `MARA` rapporterar 2026-11-09, en bevakningspost.

**Binära händelser:** NFP i dag 14:30 CET och `VST` före öppning, därefter `CEG`/`MARA`/`KKR` 11-09 och `AMAT` 11-12. Inget får köpas *in i* en rapport (punkt 8).

**Watchlist-hygien:** `config/watchlist_us.txt` bär långt fler symboler än riktmärket 25, men ingen rensning görs i dag. Följande skyddas enligt `prompts/gemensam_korning.md`: innehaven (`CBOE`, `NUE`), CBOE-planen, de giltiga kandidaterna (`261103-*` – `261106-*`), veckans rapportbolag och besluten inom utvärderingens 20-dagarsfönster. Inga tillägg behövs, eftersom `NET` och `U` redan finns.

### Åtgärdspunkter till Dren (L-3)

1. **`us-rotation-lage-a-missed` (öppen, `weeksOpen` 4) och `scheduled-actions-not-firing` (öppen, 9) – ÅTERKOMMANDE, i dag utan effekt för scouten.** Kurser (`generatedAt` 01:33Z) och nyheter (01:35Z) var färska.
2. **`crypto-previousclose-misdated` – ÅTERKOMMANDE.** `quotes["BTC-USD"].previousClose` är 80 405,29 mot daterad punkt 2026-11-05 75 936,00, och `ETH-USD` 2 422,31 mot 2 238,86. Fältet ger **−5,49 % respektive −7,82 %** i stället för korrekta **+0,07 % respektive −0,26 %**: det mäter ungefär ett dygn för mycket. **Omfång:** 2 av 2 mynt. **Ersättningskälla:** `state/price_history.json`.
3. **`news-feed-globenewswire-http-403` / `globenewswire-earnings-no-us-earnings` – ÅTERKOMMANDE.** `feeds.globenewswire` och `feeds.globenewswire-earnings` ger `"HTTP 403 – båda försöken (0.0 s)"`. Av torsdagens fyra stora efterbörsrapporter (Cloudflare, Atlassian, Unity, Akamai) finns bara Akamai bland `news_feed.json`:s 111 poster efter 2026-11-05 13:00 UTC. **Omfång:** 2 av 6 flöden. **Ersättningskälla:** websök och SEC 8-K.
4. **`macro-calendar-not-verifiable-from-state` – ÅTERKOMMANDE.** Jobless claims, NFP-konsensus, räntesannolikheter, VIX och SOX kommer alla ur websök. **Omfång:** samtliga makrovärden plus `^VIX`, `^TNX`, `DX-Y.NYB`, `CL=F` och `^SOX`, som saknas i `state/prices.json`. I dag är detta extra kännbart, eftersom VIX-hoppet och SOX-raset är dagens viktigaste marknadsdata och inget av dem kan verifieras ur repot. **Föreslagen fix:** som tidigare – lägg till symbolerna i `config/watchlist_us.txt`.
5. **L-4-omprövning väntar för `261105-APP` och `261105-COHR` (information, ingen defekt).** Båda avvisades 2026-11-05 på "1 historikpunkt". Serierna bär nu 250 punkter (backfillen fungerade), så US-rotationen ska ta ett nytt avgörande i dag inom `expiresAt` 2026-11-12. Båda ligger under MA200.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
