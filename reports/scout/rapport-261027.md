# Daglig Scout: USA & Krypto
**Datum:** 2026-10-27
**Marknadsklimat:** Måndagen (2026-10-26) var en återhämtningsdag inför FOMC-veckan: `^GSPC` +0,70 % och `^IXIC` +0,82 %, men båda ligger fortfarande under EMA20. Krypto stabiliserades efter helgens försäljning (`BTC-USD` 80 095,77, `ETH-USD` 2 323,94), men `ETH-USD` har RSI 36,8 och ligger under EMA20 och EMA50. Rapportsäsongen har börjat ge bekräftade utfall: Cadence, Nucor och Verizon rapporterade 26/10. **Aktiva lärdomar tillämpade:** L-3 (åtgärdspunkter sist), L-4 (kontroll av vilande kandidater), L-5 (rapportkalenderns källa och täckning) och L-6 (inga klasser utesluts). L-1, L-2, L-7 och L-8 gäller inte scouten.

## Marknadsöversikt

`git pull` 2026-10-27 05:48 UTC (06:48 CET) gav `origin/main` = `34cab37`. Källan är `state/prices.json` med `generatedAt` 2026-10-27T00:25:13Z, `schemaVersion` 2026-08-02-prevclose, `tickerCount` 245, `okCount` 243 och `wideAt` 2026-10-27T00:06:36Z (Yahoo Finance chart API via GitHub Actions). Filen är färsk, så måndagens problem med körningar som inte landade (åtgärdspunkt 6 i rapport-261026) har självläkt.

| Symbol | Nivå | Rörelse sedan föregående session | Vecka (mot 2026-10-19) | marketTime |
|---|---|---|---|---|
| `^GSPC` | 7 676,77 | +0,70 % (7 623,68 → 7 676,77) | −0,18 % | 2026-10-26T20:43:43Z |
| `^IXIC` | 26 169,38 | +0,82 % (25 955,34 → 26 169,38) | −0,99 % | 2026-10-26T21:15:59Z |
| `BTC-USD` | 80 095,77 | +0,32 % mot daterad punkt 2026-10-26 (79 841,07) | −2,17 % | 2026-10-27T00:23:54Z |
| `ETH-USD` | 2 323,94 | +0,84 % mot daterad punkt 2026-10-26 (2 304,65) | −3,38 % | 2026-10-27T00:24:09Z |
| `SPY` (sleeve) | 765,37 | +0,71 % (759,97 → 765,37) | −0,14 % | 2026-10-26T20:00:00Z |

**Kryptots dagsrörelse** räknas mot den daterade punkten i `state/price_history.json`, inte mot `previousClose`, eftersom fältet fortfarande inte stämmer med serien (åtgärdspunkt 3). Punkten 2026-10-27 för båda mynten är en intradagspunkt från 00:23–00:24 UTC.

**Teknik** (räknad på råserien i `state/price_history.json`, 250 punkter):
- **`^GSPC`:** 5,2 % över MA200 (7 295,06) ⇒ **regimfiltret för US-boken är fortsatt PÅ**. Kursen ligger under EMA20 (7 709,73) och strax under EMA50 (7 681,58). RSI 47,2.
- **`^IXIC`:** under EMA20 (26 605,32) och EMA50 (26 546,83), 4,7 % över MA200 (25 005,40). RSI 42,2.
- **`BTC-USD`:** under EMA20 (81 852,17), strax över EMA50 (79 690,68) och klart över MA200 (72 066,29). RSI 44,3.
- **`ETH-USD`:** under EMA20 (2 452,93) och EMA50 (2 428,75), över MA200 (2 126,11). RSI 36,8, det svagaste av de fyra.

**Måndagens bredd** bland de 121 US-symbolerna i `state/prices.json` (`price / previousClose − 1`, reguljär session 2026-10-26):
- **Starkast:** `S` +6,25 %, `BE` +5,49 %, `AKAM` +5,31 %, `TSLA` +5,21 %, `CIEN` +4,89 %, `SKHY` +4,09 % och `INTC` +4,04 %.
- **Svagast:** `MSTR` −4,24 %, `RDDT` −4,02 %, `NFLX` −2,96 %, `COIN` −2,95 % och `MARA` −2,56 %.

Kryptoproxyerna föll alltså medan AI- och hårdvarunamnen steg. Ingen orsak till rörelserna i `S` eller `TSLA` gick att belägga via websök, så de är rörelser utan namngiven katalysator och används inte som case. **Efterbörs** (`extendedSession` post, ~23:59 UTC) sticker `VRT` ut med +2,4 % (204,50 mot 199,78). Ett 8-K från Vertiv 2026-10-26 finns noterat i `config/watchlist_us.txt`, men innehållet är inte verifierat och bolaget rapporterar 2026-10-28 enligt kalendern. Det är bevakning, inte case.

## Ekonomiska siffror & kalender

**Senaste utfall** (inga amerikanska makroreleaser 2026-10-26 hittades):
- **S&P Global flash-PMI oktober (2026-10-23):** tillverkning 56,0 mot väntat 55,5, tjänster 57,9 mot väntat 58,0 (Reuters via Lufkin Daily News 2026-10-23, se rapport-261026).
- **UMich-sentimentet, slutligt oktober (2026-10-23): 48,0 mot väntat 46,3.** Ettårs inflationsförväntan 4,7 % (samma källa).
- **Arbetslöshetsanspråk (2026-10-22): 194 000 mot väntat 200 000** (rapport-261023).

**Kommande** (källa: websök enligt rapport-261026; ingen fil i repot – se åtgärdspunkt 2):
- **I dag, tisdag 2026-10-27, 10:00 ET: Conference Board-förtroendet för oktober.** Konsensus 80,0–80,5 mot föregående 81,9 (Babypips 2026-10-26).
- **Onsdag 2026-10-28, 14:00 ET: FOMC-beslutet, med presskonferens 14:30 ET. Det är veckans mest marknadsrörande punkt.** Marknaden prisade ~90 % för oförändrad ränta (CME FedWatch 22/10 via Seeking Alpha och Reuters-baserad bevakning), med en svans för en ny höjning.
- **Torsdag 2026-10-29, 08:30 ET: BNP Q3 (förhandsskattning)**, konsensus 3,1–3,2 % mot föregående 2,2 %. **PCE för september**: releasedagen är inte säkert verifierad (Babypips och FXEmpire).
- **ECB torsdag 2026-10-29** och **BoJ fredag 2026-10-30** (Babypips 2026-10-26).

**Rapporter nästa 5 handelsdagar** (`state/earnings_calendar.json`, `generatedAt` 2026-10-27T00:04:58Z, `errors` tomt), US-symboler:
- 10-27: `BA`, `ITW` och `SKHY`
- 10-28: `MSFT`, `GOOGL`, `VRT`, `BIIB`, `AWK`, `AXGN` och `VNDA`
- 10-29: `AMZN`, `COIN`, `MSTR`, `INTC`, `HII`, `ILMN`, `RDDT` och `SPXC`
- 10-30: `XOM`, `CVX` och `CBOE`
- 11-02: `AAPL`, `PLTR`, `RIG`, `RHP`, `CRGY` och `AESI`
- 11-03: `AMD`, `ANET`, `SMCI`, `TEVA`, `AMRX` och `PCVX` (`PCVX` har `isEstimate: true`, gissat datum)

**L-5:** kalendern ser bara de symboler `prices.yml` hämtar. Resten av det amerikanska universumet är **OKONTROLLERAT**. Cadence, Nucor och Verizon rapporterade 26/10 och fanns **inte** i kalendern; de hittades via ett websökt kalenderutdrag (stockti.com, vecka 26–30/10). Där listades även Electronic Arts, men något utfall från EA gick inte att hitta. Fler bolag som saknas i filen och rapporterar i fönstret, till exempel `HOOD` och `LLY` (Stocktwits 2026-10-25, se rapport-261026), är också **OKONTROLLERADE**. Alla rapportdatum är bevakningsposter enligt punkt 8, aldrig köpförslag.

## Aktuella händelser & katalysatorer

- **Cadence Design Systems (`CDNS`), Q3 2026, 2026-10-26 efter stängning (SEC 8-K ex. 99.1, via websök):** intäkterna blev 1,633 mdr USD mot bolagets egen guide på 1,595–1,625 mdr. Non-GAAP EPS blev 2,11 mot guiden 2,01–2,07. Backloggen var rekordhöga 8,2 mdr USD. Helårsguiden höjdes till +21 % intäktstillväxt och non-GAAP EPS 8,40, och återköpsmandatet utökades med 2,5 mdr USD. **Bekräftat utfall.** Kursreaktionen efter börsen är inte verifierad.
- **Nucor (`NUE`), Q3 2026, 2026-10-26 (SEC 8-K ex. 99.1, via websök):** EPS 5,80 mot bolagets egen guide 5,55–5,65 (Q3 2025: 2,63). Nettoförsäljningen blev 11,25 mdr USD och EBITDA 2,28 mdr. Det fria kassaflödet var ~2,7 mdr hittills i år. **Bekräftat utfall.** Någon jämförelse mot analytikerkonsensus är inte verifierad.
- **Verizon (`VZ`), Q3 2026, 2026-10-26 före öppning (SEC 8-K ex. 99, via websök):** justerat EPS blev 1,31 mot en konsensus på ~1,28 (Hudson Labs-preview, tredjepartsuppgift). Intäkterna var ~34,3 mdr USD (+1,5 %), och justerat EBITDA blev rekordhöga 13,8 mdr (+8 %). Utrustningsintäkterna föll 9 %. **Bekräftat utfall.**
- **Perpetua Resources:** tilldelas upp till 40 MUSD från US Army för inhemsk volframförsörjning (prnewswire 2026-10-26T21:45Z, plus 8-K samma kväll i `state/news_feed.json`). Det är litet i förhållande till bolaget och dess kurs är inte bevakad, så det blir inget case.
- **Krypto:** ingen ny kryptospecifik katalysator. Kryptoproxyerna (`MSTR` −4,24 %, `COIN` −2,95 %, `MARA` −2,56 %) föll inför sina rapporter 29/10 medan BTC låg stilla.
- **`state/news_feed.json`** (`generatedAt` 2026-10-26T23:09:46Z) täcker **10 av 10 handelsdagar** (2026-10-13 – 2026-10-26, `missingDays` tomt). **Ingen av rapporterna från CDNS, NUE eller VZ finns i flödet**: alla poster från prnewswire och sec-8k för 2026-10-26 ligger efter 17:00 UTC, eftersom taket på 30 poster per källa och dygn fylls av kvällens poster. `globenewswire` och `globenewswire-earnings` svarar fortfarande HTTP 403 (åtgärdspunkt 1). Länkarna till 8-K-filerna går inte att öppna från körmiljön (sec.gov kan inte nås), så siffrorna ovan är bolagens egna enligt websökets återgivning av exhibit-filerna.
- **Inga rykten används i dag.**

## Uppföljning av tidigare case

Den senaste tidigare scout-rapporten (rapport-261026) hade inga case, och inte heller rapport-261025. Den senaste rapporten med case är rapport-261024:
- **`ROP` (rapport-261024): KURS EJ VERIFIERAD då → 441,65 nu** (`state/prices.json`, 2026-10-26T20:00:01Z). Det är +0,80 % mot den första verifierade kursen 438,14 (2026-10-23). US-boken avvisade kandidaten 2026-10-26 på grind 2 (RSI 80,4 > 75; volym 1,49× < 1,5×). RSI ligger nu på 81,1, och kursen ligger 12,4 % över EMA20. **Tes INTAKT** (fundamentalt), men den tekniska spärren består.
- **`RHI` (rapport-261024): KURS EJ VERIFIERAD då → 44,98 nu** (`state/prices.json`, 2026-10-26T20:00:02Z). Det är −1,94 % mot 45,87 (2026-10-23). US-boken avvisade kandidaten 2026-10-26 på grind 2 (RSI 76,1) och grind 4. Uppgångsdagens nivå håller ungefär (stängningen före rapporten var 37,68). **Tes INTAKT**, med en svag rekyl.

**Kandidatkön (`state/scout_candidates.json`):** före dagens körning fanns 90 poster, varav 85 `rejected`, 5 `promoted` och **0 `new`**. Båda kandidaterna från rapport-261024 avgjordes i `us-veckorapport-261026.md`. Inga poster är försenade.

**L-4-kontroll:** båda avgörandena från 26/10 (`261024-ROP` och `261024-RHI`) avvisades av omdömesskäl (teknik, grind 2/4), inte på grund av en datalucka. Inga andra avvisade poster inom sin `expiresAt` vilar på en tillfällig datalucka, så L-4 är uppfylld.

**Innehav:** US-boken har inga aktieinnehav, och `SPY` ligger på 100 % (`state/portfolj_us.md`). `SPY` står på 765,37 (2026-10-26T20:00:00Z), vilket är −1,02 % mot entry 773,26.

## Dagens case

### Case 1: Cadence Design Systems (CDNS / NASDAQ)
**Katalysator:** Bekräftad Q3-rapport 2026-10-26 efter stängning (SEC 8-K ex. 99.1). Intäkter (1,633 mdr USD) och non-GAAP EPS (2,11) slog båda den övre änden av bolagets egen guide. Backloggen är rekordhöga 8,2 mdr USD, varav 4,2 mdr väntas intäktsföras inom 12 månader. Helårsguiden höjdes (+21 % intäkt, EPS 8,40), och återköpsmandatet utökades med 2,5 mdr USD. Bolaget har ingen rapportrisk i fönstret, eftersom rapporten redan har kommit.
**Bull case:** EDA och IP-verktyg är en "plockar och spadar"-exponering mot AI-chipdesignen som inte är beroende av vem som vinner GPU-racet. Backloggen ger synlighet för 2027, och en guidehöjning i en rapport där bolaget redan låg högt tyder på att efterfrågan inte har toppat.
**Bear case:** Rörelsemarginalen sjönk mot året innan (non-GAAP 44,1 % mot 47,6 %), vilket kan bli fokus i stället för intäkterna. Värderingen är traditionellt hög. Efter Q3 2025 föll aktien trots en stark rapport (Benzinga 2025-10), så det finns ett mönster av "sell the news". Hela AI-kedjan står dessutom inför binära capex-besked från `MSFT` och `GOOGL` (28/10).
**Setup:** **KURS EJ VERIFIERAD.** `CDNS` saknas i `state/prices.json` (`generatedAt` 2026-10-27T00:25:13Z), och det finns ingen serie i `state/price_history.json`, så det går inte att bedöma trend, MA200 eller RSI. Raden är lagd i `config/watchlist_us.txt`. `backfill-history.mjs` (`--missing`) bör fylla historiken vid nästa dygnskörning. Kandidat **`261027-CDNS`** har `price: null`, så den kan bedömas av US-boken men inte köpas förrän en kvalificerad kurs efter katalysatorn finns.

### Case 2: Nucor (NUE / NYSE)
**Katalysator:** Bekräftad Q3-rapport 2026-10-26 (SEC 8-K ex. 99.1). EPS blev 5,80 mot bolagets egen guide 5,55–5,65 från september och mer än dubbelt så mycket som Q3 2025 (2,63). Nettoförsäljningen var 11,25 mdr USD och EBITDA 2,28 mdr. Det fria kassaflödet hittills i år är ~2,7 mdr, varav ~1,4 mdr har återförts till aktieägarna.
**Bull case:** Ett utfall över den egna guiden visar att stålpriser och volymer höll bättre än bolaget själv räknade med i september. Med Brent över 117 USD/fat och höga infrastruktur-/försvarsbudgetar är ett inhemskt stål- och materialbolag en av få sektorer med medvind av inflationsmiljön.
**Bear case:** Septemberguiden föll under förväntningarna enligt tysk finanspress (Börse Express, Goldesel, 2026-09), så att slå den egna guiden behöver inte innebära att konsensus slogs. Konsensusjämförelsen är inte verifierad. Stål är cykliskt, och en hökaktig FOMC som bromsar byggandet slår direkt mot volymerna.
**Setup:** **KURS EJ VERIFIERAD.** `NUE` saknas i `state/prices.json` (`generatedAt` 2026-10-27T00:25:13Z) och i `state/price_history.json`. Raden är lagd i `config/watchlist_us.txt`. Kandidat **`261027-NUE`** har `price: null`.

**Utan fullt case, men skriven som kandidat:** **`261027-VZ`** (Verizon, NYSE) har ett bekräftat Q3-utfall 26/10 före öppning: justerat EPS 1,31 mot ~1,28 och rekordhögt justerat EBITDA. Det är en defensiv profil i en vecka med binär makrorisk. `VZ` saknas i `state/prices.json`, så kandidaten har `price: null`. Raden är lagd i `config/watchlist_us.txt`.

**Kandidatkön:** tre nya poster skrivs med `status: "new"`, `confirmed: true`, `catalystDate` 2026-10-26 och `expiresAt` 2026-11-03: `261027-CDNS`, `261027-NUE` och `261027-VZ`. `validate-scout-candidates.mjs` gav OK (93 kandidater). US-boken avgör dem i dag kl. 15:00 CET. `refresh-candidate-prices.mjs` fyller i kursen när `prices.yml` har hämtat en kurs efter katalysatorn. **Krypto:** inget case, eftersom ingen positiv kryptospecifik katalysator finns och `ETH-USD` är tekniskt svag.

## Makro- & sektorfaktorer att bevaka

**Räntor och inflation:** Fed väntas ligga still på onsdag efter höjningen i september. Med oljan över 117 USD/fat, UMich-förväntningarna på 4,7 % och en tillverknings-PMI på 56,0 finns inget utrymme för en duvaktig signal. BNP och PCE kommer dagen efter. Det är motvind för långduration-tillväxt och krypto, och relativ medvind för material och energi (`NUE`). Energibolagen `XOM` och `CVX` rapporterar 30/10 och får inte köpas in i rapporten (punkt 8).

**AI-kedjan:** måndagens studs i `^IXIC` (+0,82 %) tog inte tillbaka EMA20. Hyperscalerbeskeden 28–29/10 (`MSFT`, `GOOGL`, `AMZN`) avgör om capex-oron består. `CDNS` är det minst capex-känsliga sättet att exponeras, men en svag capexsignal drar troligen med hela sektorn.

**Krypto:** BTC ligger kvar strax över EMA50 och klart över MA200. ETH är svagare (RSI 36,8). Proxyerna `MSTR` och `COIN` sålde av inför rapporterna 29/10. **DXY och ETF-flöden** för 2026-10-26 gick inte att verifiera (websöket gav bara data till och med början av oktober).

**Geopolitik:** Iran-kriget håller oljan uppe (Investing.com 2026-10-25), vilket är den största enskilda inflationsrisken inför FOMC.

### Åtgärdspunkter till Dren (L-3)

1. **`news-feed-globenewswire-http-403` – kvarstår, ÅTERKOMMANDE.** `feeds.globenewswire` och `feeds.globenewswire-earnings` är båda `"HTTP 403 – båda försöken (0.1 s)"` (`state/news_feed.json`, 2026-10-26T23:09:46Z). **Omfång:** 2 av 6 flöden, varav ett är den enda källan som är dedikerad åt rapportöverraskningar. **Ersättningskälla:** websök.
2. **`macro-calendar-not-verifiable-from-state` – ÅTERKOMMANDE.** Följande kommer ur websök: FOMC-tiden och sannolikheterna, konsensus för Conference Board, BNP och PCE, ECB/BoJ, samt alla siffror från CDNS, NUE och VZ (sec.gov kan inte nås från körmiljön). **Omfång:** samtliga makrodatum och -värden och 3 av 3 kandidattester.
3. **`crypto-previousclose-misdated` – ÅTERKOMMANDE.** `quotes["BTC-USD"].previousClose` är 80 024,01 medan punkten 2026-10-26 i `state/price_history.json` är 79 841,07. För `ETH-USD` är det 2 326,92 mot 2 304,65. **Omfång:** 2 av 2 mynt. **Ersättningskälla:** den daterade punkten, som används i tabellen.
4. **`watchlist-cap-vs-measurability-conflict` – ÅTERKOMMANDE.** `config/watchlist_us.txt` har 124 symbolrader efter dagens tre tillägg, mot riktmärket 25. Inga rader stryks, eftersom skydden i `prompts/gemensam_korning.md` går före riktmärket. 2 av 245 symboler i `state/prices.json` saknar `price` (`BK`, `NRS.OL`); `BK` är den enda US-symbolen.
5. **`news-feed-daily-cap-drops-us-morning` – NY.** Taket på 30 poster per källa och dygn fylldes 2026-10-26 av prnewswire- och sec-8k-poster efter 17:00 UTC. Hela dagens tidigare flöde saknas därför i `state/news_feed.json`, inklusive Verizons rapport före öppning och Cadence/Nucor. **Omfång:** 3 av 3 av dagens bekräftade US-rapportkatalysatorer missades av den primära källan. **Ersättningskälla:** websök. Detta är samma kadens-/takfråga som CLAUDE.md beskriver för `globenewswire`, men nu för prnewswire och sec-8k.
6. **`earnings-calendar-coverage` – L-5.** `CDNS`, `NUE`, `VZ` och EA rapporterade 26/10 utan att finnas i `state/earnings_calendar.json`, eftersom de inte prisbevakades. **Omfång:** minst 4 storbolag den här veckan. De tre förstnämnda är tillagda i `config/watchlist_us.txt` i dag.
7. **`^VIX` hämtas inte – kvarstår.** Volatilitetsmåttet saknas inför FOMC-veckan. **Omfång:** 1 symbol.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
