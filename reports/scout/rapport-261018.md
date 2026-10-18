# Daglig Scout: USA & Krypto
**Datum:** 2026-10-18
**Marknadsklimat:** Det är söndag, och de amerikanska börserna har varit stängda sedan fredagens session 2026-10-16. Den sessionen var risk-av: oron för den skuldfinansierade AI-utbyggnaden gav `^IXIC` −2,14 % och dess sämsta vecka sedan juni (−4,48 %). Krypto har rört sig sidledes över helgen kring 81–82 000 USD för BTC enligt websök, men den rörelsen kan inte verifieras ur repot. Inför veckan som kommer är capex-signalerna i rapporterna från NFLX, TSLA och META den binära frågan för AI-kedjan. **Aktiva lärdomar tillämpade:** L-3 (åtgärdspunkter sist), L-4 (kontroll av vilande kandidater), L-5 (rapportkalenderns källa och täckning) och L-6 (inga klasser utesluts). L-1, L-2, L-7 och L-8 gäller inte scouten.

## Marknadsöversikt

`git pull` 2026-10-18 05:48 UTC gav `origin/main` = `b7d8d4b Veckans rörelser: 2026-10-17 10:42 UTC`. `state/prices.json` är **samma fil som i rapport-261017**: `generatedAt` 2026-10-16T23:34:06.562Z, `schemaVersion` 2026-08-02-prevclose, `tickerCount` 220, `okCount` 217 och `wideAt` 2026-10-16T09:44:28Z. `prices.yml` kör bara vardagar, så ingen nyare fil finns. Källa: `Yahoo Finance (chart API)` via GitHub Actions.

| Symbol | Nivå | Senaste rörelse | Vecka (mot 2026-10-09) | marketTime |
|---|---|---|---|---|
| `^GSPC` | 7 659,44 | −1,09 % fredag (7 744,06 → 7 659,44) | −1,95 % | 2026-10-16T20:42:08Z |
| `^IXIC` | 26 140,03 | −2,14 % fredag (26 713,03 → 26 140,03) | −4,48 % | 2026-10-16T21:15:59Z |
| `BTC-USD` | 81 527,51 | −0,70 % mot daterad punkt 2026-10-15 (82 105,98) | −1,17 % | 2026-10-16T23:32:59Z |
| `ETH-USD` | 2 419,36 | −0,79 % mot daterad punkt 2026-10-15 (2 438,54) | −2,51 % | 2026-10-16T23:33:08Z |
| `SPY` (sleeve) | 763,25 | −1,11 % fredag | −1,97 % | 2026-10-16T20:00:00Z |

**Krypto: helgens rörelse är KURS EJ VERIFIERAD.** Mynten handlas dygnet runt, men den senaste verifierade kursen är ~30 timmar gammal (fredag 23:33 UTC). Reservkällan Yahoo Finance kan inte nås från körmiljön (`curl` mot `query1.finance.yahoo.com` ger `CONNECT tunnel failed, response 403`). Enligt websök låg BTC kring 81 558 USD tidigt lördag och har handlats i ett smalt intervall med stöd nära 80 000 (Investing.com 2026-10-17/18; coin-turk 2026-10-17). Den uppgiften används bara som sammanhang, aldrig som kursnivå. Se åtgärdspunkt 5.

**Teknik** (oförändrad sedan rapport-261017 eftersom serien är densamma; räknad på råserien i `state/price_history.json`, 250 punkter):
- **`^GSPC`:** ligger 5,3 % över MA200 (7 271,41), så **regimfiltret för US-boken är fortsatt PÅ**. Indexet ligger under EMA20 (7 731,12) men över EMA50 (7 680,38). RSI är 44,1, och MACD-histogrammet fördjupas (−0,78 → −8,40).
- **`^IXIC`:** ligger under EMA20 och EMA50 men över MA200 (24 919,36). RSI är 37,2.
- **`BTC-USD`:** RSI 49,2, under EMA20 men över EMA50 och MA200.
- **`ETH-USD`:** RSI 40,8, under EMA20 och EMA50 men över MA200.

**Kryptoflöden:**
- Spot-bitcoin-ETF:erna hade ett nettoutflöde på ~82,4 MUSD 2026-10-16 (Farside via coin-turk 2026-10-17; SoSoValue via TokenPost 2026-10-17) och 261,5 MUSD 2026-10-14 (TFTC-trackern).
- Veckan 5–9 oktober hade ~681 MUSD i utflöden, den största veckan sedan juni (TokenPost; cubed.run 2026-10).
- Strategy köpte bara 250 BTC under 5–11 oktober, till snittpris 86 194 USD (KuCoin News 2026-10).

## Ekonomiska siffror & kalender

**Senaste utfall** (oförändrat sedan rapport-261017):
- **Industriproduktion september +0,7 % m/m mot väntat +0,4 %** (Federal Reserve G.17, 2026-10-16).
- **Fed-ordförande Warsh gav ingen räntesignal** (IMF, 2026-10-16). Sannolikheten för en höjning vid FOMC 27–28 oktober föll till ~17 % från ~30 % (CNBC 2026-10-16). Terminsprissättningen pekar på att majoriteten väntar sig att Fed avvaktar till december med årets andra höjning (Reuters Week Ahead via bilyonaryo/rallies.ai 2026-10-16/17). **Det var veckans mest marknadsrörande besked.** Fed är i tystnadsperiod.

**Kommande** (websök – ingen fil i repot, se åtgärdspunkt 2):
- **Måndag 2026-10-19:** NAHB-index (väntat 31). Rapporter från `AGNC` och Fifth Third (Alphastreet; Fifth Third finns inte i watchlistan).
- **Tisdag 2026-10-20 efter stängning: `NFLX` Q3.** Konsensus är ~0,82 USD/aktie på ~12,9 mdr USD i intäkter (Seeking Alpha 2026-10-17). Aktien föll ~3,6 % efter ett byte av innehållschef, men uppgiften kommer från en enda källa och har inte belagts.
- **Onsdag 2026-10-21 efter stängning: `TSLA` och `META` Q3.**
  - TSLA väntas få intäkter på 27,79 mdr USD, −1,1 % år för år.
  - En förhandsbedömning ger META 6,67 USD/aktie (−8 % år för år) (Seeking Alpha; indiaipo 2026-10-17).
  - **Det här är veckans mest marknadsrörande punkt.** Metas capex-guidning avgör tonen för hela AI-kedjan efter veckans skuldoro.
- **Torsdag 2026-10-22:** initiala arbetslöshetsanspråk (väntat 200 000). Rapport från `BE`.
- **Fredag 2026-10-23:** flashindex för inköpschefer (PMI) i oktober och UMich-sentimentet. Dagen är härledd och inte bekräftad.
- **FOMC 27–28 oktober** ligger utanför 5-dagarsfönstret.

**Rapporter nästa 10 handelsdagar** (`state/earnings_calendar.json`, `generatedAt` 2026-10-16T09:43:01Z, `errors` tomt):
- 10-19: `AGNC`
- 10-20: `NFLX`
- 10-21: `META`, `TSLA` och `ABT`
- 10-22: `BE`
- 10-26: `PECO`
- 10-27: `BA` och `ITW`; `SKHY` gissat
- 10-28: `GOOGL`, `MSFT`, `BIIB`, `AWK` och `AXGN`; `UTHR` gissat
- 10-29: `AMZN`, `COIN`, `MSTR`, `RIOT`, `RDDT`, `INTC`, `ILMN`, `HII` och `SPXC`
- 10-30: `XOM` och `CVX`

**L-5:** kalendern ser bara de symboler som `prices.yml` hämtar. Resten av det amerikanska universumet är **OKONTROLLERAT**, till exempel IBM och Fifth Third. IBM rapporterar under veckan enligt Seeking Alpha 2026-10-17, men datumet är inte belagt i en källa jag kunnat läsa, så ingen rad läggs till. Samtliga uppräknade rapportbolag finns redan i `config/watchlist_us.txt`. Alla är bevakningsposter enligt punkt 8, aldrig köpförslag.

## Aktuella händelser & katalysatorer

- **Inga nya bekräftade bolagsutfall sedan fredagen.** Börserna har varit stängda, och `state/news_feed.json` är oförändrad: `generatedAt` 2026-10-16T23:38:45Z, 10 av 10 handelsdagar (2026-10-05 – 2026-10-16), `missingDays` tomt. Flödet kör bara vardagar. Fönstret är alltså fullt men saknar helgen, vilket inte bevisar att helgen saknar nyheter.
- **AI-finansieringsoron (2026-10-16) är veckans tema.** CoreWeave, med ~50 mdr USD i skuld, föll ~12 %, och chipindexet föll för åttonde dagen i rad (Reuters Week Ahead 2026-10-16; CNN 2026-10-16). Det är en sektorrörelse utan bolagsspecifika negativa utfall, så den ger inget case.
- **⚠️ RYKTE – EJ BEKRÄFTAT (substack-inlägg, 2026-10-17):** en AI-inriktad hedgefond ska ha fått problem. Källan är **inte** ett etablerat finansmedium, och en anonym uppgift säger att fonden mår bra. **Ryktet underkänns enligt källkritikreglerna** och används inte.
- **`MSTR`:** MSCI-regeln om att utesluta bolag utan operativ verksamhet träder i kraft efter 2026-11-30, och listan över berörda bolag väntas 2026-11-11 (The Block 2026-10-15). Det är en negativ katalysator och ett binärt riskdatum, och den ger inget case.
- Inga rykten från godkända medier används i dag.

## Uppföljning av tidigare case

- **`CRGY` (rapport-261017): 13,77 → 13,77 (±0,00 %, `state/prices.json`, marketTime 2026-10-16T20:00:02Z) – tes INTAKT.** Ingen session har ägt rum sedan caset, och inget nytt bolagsbesked har kommit. Grind 3-frågan om katalysatorns ålder (2026-10-08) och om fredagens rörelse saknar en daterad egen orsak kvarstår för ansvarig bok.
- **`TSM` (rapport-261016): 422,25 → 412,61 (−2,28 %, samma fil, marketTime 2026-10-16T20:00:02Z) – tes FÖRSVAGAD.** Bedömningen är oförändrad sedan rapport-261017: kursen ligger under EMA20 och EMA50, och RSI är 34,2.
- **`USB` (rapport-261016): 57,39 → 58,73 (+2,33 %, samma fil, marketTime 2026-10-16T20:00:02Z) – tes INTAKT.** Kursen ligger över MA200 (57,81) men under EMA50.

**Kandidatkön (`state/scout_candidates.json`):** 82 poster, varav 76 `rejected`, 5 `promoted` och **1 `new`**.
- **`261017-CRGY`** är `new` och väntar på US-bokens avgörande vid veckorotationen v43 måndag 2026-10-19 (`expiresAt` 2026-10-23). Den är inte försenad.

**L-4-kontroll:** `261016-USB`, `261016-TSM`, `261015-UNH` och `261015-BLK` avvisades alla av omdömesskäl (teknik eller nåbarhet), inte på grund av en datalucka. Inga avvisade poster inom sin `expiresAt` vilar på en datalucka, så L-4 är uppfylld. USB kan omprövas vid v43-rotationen. En ny scout-post vore en dubblett.

**Innehav:** US-boken har inga aktieinnehav, och `SPY` ligger på 100 % (`state/portfolj_us.md`). `state/alerts.json` har inga aktiva signaler.

## Dagens case

**Inga case i dag.** Enligt promptens punkt 6 ska case aldrig tvingas fram, och det finns tre skäl:

1. **Inget nytt kursunderlag.** `state/prices.json` och `state/news_feed.json` är samma filer som i rapport-261017. Ett case nu skulle bygga på samma stängningar som redan prövats och gav `261017-CRGY`.
2. **Inget bekräftat bolagsutfall har kommit under helgen.** Veckans katalysatorer (NFLX, TSLA och META) är väntade event. Enligt punkt 8 är de bevakningsposter och får aldrig bli köpförslag före rapporten.
3. **Krypto saknar verifierad kurs sedan fredag 23:33 UTC** och saknar en positiv kryptospecifik katalysator. ETF-flödena är negativa och MSCI-risken hänger över treasury-bolagen.

**Inga nya kandidatposter skrivs till `state/scout_candidates.json` i dag.** Det finns inga case och ingen ny bekräftad, handlingsbar bolagskatalysator, så filen lämnas orörd med 82 poster. `261017-CRGY` står kvar som `new` för US-bokens avgörande.

## Makro- & sektorfaktorer att bevaka

**Varför marknaden är avvaktande:** veckan avgörs av två binära frågor, och ingen av dem har ett utfall än.

**Räntorna:** realräntan och höjningsrisken är den största motvinden för tillväxt och krypto. Marknaden prissätter paus i oktober och en höjning i december. Fed är tyst fram till 27–28 oktober.

**AI-kedjan:** skuldoron (CoreWeaves CDS på rekordnivå och chipindexet ned åtta dagar i rad) har gått från en sektorrotation till en omprissättning av risk. Metas och Teslas capex-signaler 2026-10-21, och därefter MSFT och GOOGL 2026-10-28, avgör om rörelsen fortsätter.

**Rotation:** kapitalet har gått till energi (`XOM` och `CVX` på 250-dagarshögsta, oljan nära 100 USD), banker och defensiva sektorer. Oljan bär samtidigt inflationsrisken.

**Krypto:** ETF-utflöden, Strategys allt mindre köp och MSCI-datumet 2026-11-11 ger motvind. BTC ligger fortfarande över MA200.

Inget av detta gör ett nytt case starkare i dag än det var i fredags.

### Åtgärdspunkter till Dren (L-3)

1. **`news-feed-globenewswire-http-403` – kvarstår, ÅTERKOMMANDE.** I `state/news_feed.json` är `feeds.globenewswire` och `feeds.globenewswire-earnings` båda `"HTTP 403 – båda försöken (0.0 s)"` (2026-10-16T23:38:45Z).
   - **Omfång:** 2 av 6 flöden, varav ett är den enda källan som är dedikerad åt rapportöverraskningar.
   - **Ersättningskälla:** websök.
2. **`macro-calendar-not-verifiable-from-state` – ÅTERKOMMANDE.** Följande kommer ur websök: Fed-sannolikheterna, rapportkonsensus för NFLX, TSLA och META, kryptoflödena och veckans makrokalender. Dagen för flash-PMI är härledd.
   - **Omfång:** samtliga makrodatum och -värden i rapporten.
3. **`crypto-previousclose-misdated` – ÅTERKOMMANDE.**
   - `quotes["BTC-USD"].previousClose` är 82 141,46 medan punkten 2026-10-15 i `state/price_history.json` är 82 105,98.
   - För `ETH-USD` är värdena 2 440,48 mot 2 438,54.
   - **Omfång:** 2 av 2 mynt.
   - **Ersättningskälla:** den daterade punkten i `state/price_history.json`, som används i tabellen ovan.
4. **`watchlist-cap-vs-measurability-conflict` – ÅTERKOMMANDE.** `config/watchlist_us.txt` har 460 icke-tomma rader, inklusive kommentarer, mot riktmärket 25 symboler. Inga rader stryks, eftersom skydden i `prompts/gemensam_korning.md` går före riktmärket. 3 av 220 symboler saknar `price` i `state/prices.json`.
5. **Ny i dag – `crypto-weekend-price-gap`.** `prices.yml` kör bara vardagar, så `BTC-USD` och `ETH-USD` saknar verifierad kurs från fredag 23:33 UTC till måndagens första körning, vilket är ~54 timmar. Reservkällan Yahoo kan inte nås från scoutens körmiljö (proxy 403).
   - **Omfång:** 2 av 2 bevakade mynt, varje helg.
   - **Ersättningskälla:** ingen verifierad; helgrörelsen är märkt KURS EJ VERIFIERAD.
   - **Förslag:** en helgcron i `prices.yml` som bara hämtar `-USD`-symbolerna.
6. **`^VIX` hämtas inte – kvarstår** (togs upp första gången i rapport-261017). Volatilitetsindexet kan bara anges ur websök. **Omfång:** 1 symbol.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
