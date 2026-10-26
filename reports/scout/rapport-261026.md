# Daglig Scout: USA & Krypto
**Datum:** 2026-10-26
**Marknadsklimat:** Måndag före FOMC-veckan. Senaste amerikanska session (fredag 2026-10-23) var risk-av (`^GSPC` −0,52 %, `^IXIC` −0,21 %). Krypto sålde av under helgen: BTC var nere på 79 146 USD på lördagen, den lägsta nivån på över en månad, med likvidationer på över 810 MUSD (Investing.com 2026-10-25, Coinglass-data). Det är inte verifierat ur repot. Veckan avgörs av FOMC 28/10, BNP/PCE 29/10 och rapporterna från `MSFT`, `GOOGL` (28/10) och `AMZN` (29/10). **Aktiva lärdomar tillämpade:** L-3 (åtgärdspunkter sist), L-4 (kontroll av vilande kandidater), L-5 (rapportkalenderns källa och täckning) och L-6 (inga klasser utesluts). L-1, L-2, L-7 och L-8 gäller inte scouten.

## Marknadsöversikt

`git pull` 2026-10-26 05:48 UTC (06:48 CET) gav `origin/main` = `592c1e1`. **Måndagens första kurskörning (`prices.yml`, cron `9 5 * * 1-5`) hade inte landat på main vid körningen** (kontrollerat med `git fetch` var 45:e sekund fram till 2026-10-26 06:20 UTC; varken 05:09- eller 06:09-körningen hade committat). `state/prices.json` är därför **samma fil som i rapport-261024 och -261025**: `generatedAt` 2026-10-23T23:51:52Z, `schemaVersion` 2026-08-02-prevclose, `tickerCount` 231, `okCount` 229 och `wideAt` 2026-10-23T10:01:55Z. Källa: `Yahoo Finance chart API via GitHub Actions`. Se åtgärdspunkt 6.

| Symbol | Nivå | Senaste rörelse | Vecka (mot 2026-10-16) | marketTime |
|---|---|---|---|---|
| `^GSPC` | 7 623,68 | −0,52 % fredag (7 663,43 → 7 623,68) | −0,47 % | 2026-10-23T20:38:20Z |
| `^IXIC` | 25 955,34 | −0,21 % fredag (26 008,86 → 25 955,34) | −0,71 % | 2026-10-23T21:15:59Z |
| `BTC-USD` | 81 058,34 | −0,30 % mot daterad punkt 2026-10-22 (81 301,68) | −0,58 % | 2026-10-23T23:50:44Z |
| `ETH-USD` | 2 382,85 | −0,13 % mot daterad punkt 2026-10-22 (2 385,94) | −1,51 % | 2026-10-23T23:50:55Z |
| `SPY` (sleeve) | 759,97 | −0,52 % fredag (763,96 → 759,97) | −0,43 % | 2026-10-23T20:00:00Z |

**Krypto: helgens rörelse är KURS EJ VERIFIERAD.** Den senaste verifierade kursen är ~54 timmar gammal (fredag 23:50 UTC). Reservkällan Yahoo Finance går inte att nå från körmiljön (proxy 403 i rapport-261025, och WebFetch når inte finanssajter i dag). Enligt Investing.com (2026-10-25) föll BTC till 79 146 USD på lördagen och låg kring 80 400–80 800 USD på söndagen. ETH låg kring 2 306–2 332 USD (Investing.com och CoinDesk, 2026-10-25). Det används bara som sammanhang, aldrig som kursnivå.

**Teknik** (räknad på råserien i `state/price_history.json`, 250 punkter till och med 2026-10-23; oförändrad sedan rapport-261024):
- **`^GSPC`:** 4,6 % över MA200 (7 291,29) ⇒ **regimfiltret för US-boken är fortsatt PÅ**. Kursen ligger under EMA20 (7 713,20) och EMA50 (7 681,77). RSI 42,2.
- **`^IXIC`:** under EMA20 (26 651,21) och EMA50 (26 562,23), 3,9 % över MA200 (24 991,95). RSI 38,0.
- **`BTC-USD`:** under EMA20 (82 268,21), över EMA50 (79 667,96) och MA200 (71 967,12) vid den senaste verifierade kursen. RSI 47,0. Helgens lägsta nivå enligt Investing.com (79 146) låg under EMA50, men det är inte verifierat.
- **`ETH-USD`:** under EMA20 (2 483,55) och EMA50 (2 438,29), över MA200 (2 124,11). RSI 39,8.

**Kryptoflöden:** Investing.com (2026-10-25) anger likvidationer på över 810 MUSD på 24 timmar, varav ~689 MUSD i långa positioner (Coinglass-data). Uppgiften om spot-ETF-utflöden på ~635,6 MUSD 2026-10-23 (Crypto Times, rapport-261025) är inte verifierad mot en primärkälla, och inga helgflöden finns.

## Ekonomiska siffror & kalender

**Senaste utfall** (inga releaser under helgen):
- **S&P Global flash-PMI oktober (2026-10-23):** tillverkning 56,0 mot väntat 55,5, tjänster 57,9 mot väntat 58,0 (Reuters via Lufkin Daily News 2026-10-23).
- **UMich-sentimentet, slutligt oktober (2026-10-23): 48,0 mot väntat 46,3.** Ettårs inflationsförväntan 4,7 % (samma källa).
- **Arbetslöshetsanspråk (2026-10-22): 194 000 mot väntat 200 000** (rapport-261023).

**Kommande** (källa: websök, ingen fil i repot – se åtgärdspunkt 2):
- **Tisdag 2026-10-27: Conference Board-förtroendet för oktober.** Konsensus 80,0–80,5 mot föregående 81,9 (Babypips "Fundies Cheat Sheet" 2026-10-26; övriga kalendrar visar 80,5).
- **Onsdag 2026-10-28, 14:00 ET: FOMC-beslutet, med ordförande Warshs presskonferens 14:30 ET. Det är veckans mest marknadsrörande punkt.** Enligt CME FedWatch låg sannolikheten för oförändrad ränta på ~90,6 % den 22/10, och terminerna prisar ~10 % för en ny höjning med 25 punkter (Seeking Alpha och Reuters-baserad bevakning, veckoförhandsvisning). Brent över 117 USD/fat (Investing.com 2026-10-25) talar emot en duvaktig signal.
- **Torsdag 2026-10-29, 08:30 ET: BNP Q3 (förhandsskattning)**, konsensus 3,1–3,2 % mot föregående 2,2 % (Babypips; FXEmpire; Rio Times). **PCE-inflationen för september**: kärn-PCE väntas +0,2–0,3 % m/m mot föregående +0,2 % (Babypips och FXEmpire är oense). Releasedagen för PCE är inte säkert verifierad.
- **ECB torsdag 2026-10-29** (väntas lämna 2,50 % oförändrat) och **BoJ fredag 2026-10-30** (väntas lämna 1,25 %), enligt Babypips 2026-10-26.

**Rapporter nästa 5 handelsdagar** (`state/earnings_calendar.json`, `generatedAt` 2026-10-23T10:00:01Z, `errors` tomt), US-symboler:
- 10-26: `PECO`
- 10-27: `BA`, `ITW` och `SKHY`
- 10-28: `MSFT`, `GOOGL`, `BIIB`, `AWK`, `AXGN` och `VNDA`
- 10-29: `AMZN`, `COIN`, `MSTR`, `INTC`, `HII`, `ILMN`, `RDDT` och `SPXC`
- 10-30: `XOM` och `CVX`
- 11-02: `AAPL`, `PLTR`, `RIG`, `RHP`, `CRGY` och `AESI`

**L-5:** kalendern ser bara de symboler `prices.yml` hämtar. Resten av det amerikanska universumet är **OKONTROLLERAT**. Ungefär en tredjedel av S&P 500-bolagen rapporterar i veckan (Reuters "Wall Street Week Ahead" via Business Recorder och The Globe and Mail, 2026-10); enligt Stocktwits (2026-10-25) finns bland dem även `HOOD` och `LLY`, som saknas i filen. Alla rapportdatum är bevakningsposter enligt punkt 8, aldrig köpförslag.

## Aktuella händelser & katalysatorer

- **Kryptoförsäljning under helgen (Investing.com 2026-10-25).** BTC föll till 79 146 USD på lördagen, den lägsta nivån på över en månad, och var på väg mot sin fjärde raka nedgångsdag och sin första månadsnedgång sedan juni. Likvidationerna översteg 810 MUSD på 24 timmar. Tunn helglikviditet förstärkte försäljningen. **KURS EJ VERIFIERAD**, se Marknadsöversikt.
- **Rapportfloden och FOMC (Reuters "Wall Street Week Ahead", via Business Recorder 2026-10).** Hyperscalernas capex väntas bli omkring 800 mdr USD i år, och investerarna är oroliga för hur hållbar den är när finansieringskostnaderna stiger. Rapporterna från `GOOGL` och `MSFT` (28/10) och `AMZN` (29/10) är väntade event och därmed bevakning, inga case (punkt 8).
- **Olja och geopolitik:** Brent över 117 USD/fat med Iran-kriget som drivkraft (Investing.com 2026-10-25). Det ökar inflationsoron inför FOMC.
- **`Howard Hughes Holdings Set to Join S&P SmallCap 600`** – rubrik i `state/news_feed.json` (prnewswire, 2026-10-23T21:45Z). **EJ VERIFIERAD:** länken går inte att öppna från körmiljön, så ikraftträdandedag, vem bolaget ersätter och avsändare kunde inte kontrolleras, och websök gav ingen bekräftelse. Därför inget case och ingen kandidatpost (se Dagens case).
- **`state/news_feed.json`** (`generatedAt` 2026-10-23T23:52:21Z) täcker **10 av 10 handelsdagar** (2026-10-12 – 2026-10-23, `missingDays` tomt), men har inte uppdaterats sedan fredag kväll. Måndagens första `news.yml`-körning (05:17 UTC) hade inte landat vid körningen. **`globenewswire` och `globenewswire-earnings` svarar fortfarande HTTP 403** (åtgärdspunkt 1), så den delen av pressmeddelandeflödet är **OKONTROLLERAD**.
- **Inga bekräftade bolagsutfall under helgen** hittades i feeden eller via websök. Inga rykten används i dag.

## Uppföljning av tidigare case

Den senaste tidigare scout-rapporten (rapport-261025) hade inga case. Den senaste med case är rapport-261024:
- **`ROP` (rapport-261024): KURS EJ VERIFIERAD då → KURS EJ VERIFIERAD nu.** `ROP` saknas fortfarande i `state/prices.json`, eftersom ingen kurskörning har gått sedan raden lades i `config/watchlist_us.txt` på lördagen (åtgärdspunkt 6). Inget nytt bolagsbesked har kommit. **Tes INTAKT** (oprövad).
- **`RHI` (rapport-261024): KURS EJ VERIFIERAD då → KURS EJ VERIFIERAD nu.** Samma läge som `ROP`. Inget nytt bolagsbesked har kommit. **Tes INTAKT** (oprövad).

**Kandidatkön (`state/scout_candidates.json`):** 90 poster, varav 83 `rejected`, 5 `promoted` och **2 `new`**:
- **`261024-ROP`** och **`261024-RHI`** är `new` med `price: null` och väntar på US-bokens avgörande i dag (US-rotationen 15:00 CET, `expiresAt` 2026-10-30). De är inte försenade. `refresh-candidate-prices.mjs` fyller i kursen när `prices.yml` har hämtat en kurs efter katalysatorn (2026-10-22). En kandidat med `price: null` får aldrig promotas.

**L-4-kontroll:** `261023-PG` (grind 5, nåbarhet), `261023-BX` (grind 2, MA200), `261022-QGEN` (grind 5) och `261022-META` (grind 2) avvisades alla av omdömesskäl, inte på grund av en datalucka. Inga avvisade poster inom sin `expiresAt` vilar på en tillfällig datalucka, så L-4 är uppfylld.

**Innehav:** US-boken har inga aktieinnehav. `SPY` ligger på 100 % (`state/portfolj_us.md`), 759,97 (−1,72 % mot entry 773,26). `state/alerts.json` har inga aktiva signaler (`checkedAt` 2026-10-23T21:02:47Z).

## Dagens case

**Inga case i dag.** Enligt promptens punkt 6 ska case aldrig tvingas fram, och det finns tre skäl:

1. **Inget nytt verifierat underlag.** `state/prices.json` och `state/news_feed.json` är fortfarande fredagens filer. Ett case nu skulle bygga på samma stängningar som redan gav `261024-ROP` och `261024-RHI`.
2. **Inget bekräftat bolagsutfall har kommit under helgen.** Veckans katalysatorer (`MSFT`, `GOOGL`, `AMZN`, `COIN`, `MSTR`, `XOM` och `CVX`) är väntade event. Enligt punkt 8 är de bevakningsposter och får aldrig bli köpförslag före rapporten. Den enda nya händelsen, `HHH` till S&P SmallCap 600, kan inte verifieras via länken (krav 4 i KRAV PÅ FÄRSK DATA).
3. **Krypto saknar verifierad kurs sedan fredag 23:50 UTC** och har ingen positiv kryptospecifik katalysator. Helgrörelsen var enligt Investing.com negativ, med tunga likvidationer av långa positioner.

**Inga nya kandidatposter skrivs till `state/scout_candidates.json` i dag.** Det finns inga case och ingen ny bekräftad, handlingsbar bolagskatalysator, så filen lämnas orörd med 90 poster. `config/watchlist_us.txt` lämnas också orörd.

## Makro- & sektorfaktorer att bevaka

**Varför marknaden är avvaktande:** veckan avgörs av två binära frågor – Fed-signalen och hyperscalernas capex – och ingen av dem har ett utfall än.

**Räntor och olja:** Fed höjde i september och väntas ligga still på onsdag. Men oljan över 117 USD/fat, UMich-förväntningarna på 4,7 % och en stark tillverknings-PMI ger inget utrymme för en duvaktig signal. BNP och PCE kommer dagen efter beskedet. Det är motvind för tillväxtaktier och krypto, och medvind för energi, som dock rapporterar i fönstret (`XOM`/`CVX` 30/10) och inte får köpas in i rapporten.

**AI-kedjan:** `^IXIC` ligger under EMA20 och EMA50 med RSI 38,0, men över MA200. Reuters beskriver rallyt som "rickety" inför rapporterna. Om capex-beskeden 28–29/10 håller avgör de om fredagens rotation från AI-kraft till mjukvara fortsätter.

**Krypto:** BTC låg i fredags över MA200 och EMA50, men helgens lägsta nivå (overifierad) låg under EMA50. Månaden är på väg att bli den första negativa sedan juni. `COIN` och `MSTR` rapporterar 29/10, vilket är bevakning och inte ett köp in i rapporten (punkt 8).

Inget av detta gör ett nytt case starkare i dag än det var i går.

### Åtgärdspunkter till Dren (L-3)

1. **`news-feed-globenewswire-http-403` – kvarstår, ÅTERKOMMANDE.** `feeds.globenewswire` och `feeds.globenewswire-earnings` är båda `"HTTP 403 – båda försöken (0.1 s)"` (`state/news_feed.json`, 2026-10-23T23:52:21Z). **Omfång:** 2 av 6 flöden, varav ett är den enda källan som är dedikerad åt rapportöverraskningar. **Ersättningskälla:** websök.
2. **`macro-calendar-not-verifiable-from-state` – ÅTERKOMMANDE.** Följande kommer ur websök: FOMC-tiden och sannolikheterna, konsensus för Conference Board, BNP och PCE, ECB/BoJ och helgens kryptokurser. Konsensusvärdena skiljer sig mellan källorna, och PCE-dagen är inte säkert verifierad. **Omfång:** samtliga makrodatum och -värden i rapporten.
3. **`crypto-previousclose-misdated` – ÅTERKOMMANDE.** `quotes["BTC-USD"].previousClose` är 81 311,89 medan punkten 2026-10-22 i `state/price_history.json` är 81 301,68. För `ETH-USD` är det 2 386,19 mot 2 385,94. **Omfång:** 2 av 2 mynt. **Ersättningskälla:** den daterade punkten, som används i tabellen.
4. **`watchlist-cap-vs-measurability-conflict` – ÅTERKOMMANDE.** `config/watchlist_us.txt` har 117 symbolrader mot riktmärket 25. Inga rader stryks, eftersom skydden i `prompts/gemensam_korning.md` går före riktmärket. 2 av 231 symboler i `state/prices.json` saknar `price` (`BK`, `NRS.OL`); `BK` är den enda US-symbolen.
5. **`crypto-weekend-price-gap` – ÅTERKOMMANDE.** `prices.yml` kör bara vardagar, så `BTC-USD` och `ETH-USD` saknade verifierad kurs från fredag 23:50 UTC till måndagens första körning. Det är just den perioden BTC föll under 80 000 USD med likvidationer över 810 MUSD. **Omfång:** 2 av 2 bevakade mynt, varje helg. **Ersättningskälla:** ingen verifierad. **Förslag:** en helgcron i `prices.yml` som bara hämtar `-USD`-symbolerna.
6. **`scheduled-actions-not-firing` – måndagens 05:09-körning av `prices.yml` (och 05:17-körningen av `news.yml`) hade inte landat på main vid 06:20 UTC, 71 minuter efter den schemalagda tiden; inte heller 06:09-säkerhetskörningen hade landat.** **Omfång:** samtliga 231 symboler i `state/prices.json` och hela nyhetsflödet. Den nordiska rotationen 08:40 CET och US-rotationens avgörande av `261024-ROP`/`261024-RHI` behöver en färsk fil; kör gärna "Hämta kurser" för hand (workflow_dispatch) om ingen körning landat. **Ersättningskälla:** fredagens verifierade stängningar.
7. **`^VIX` hämtas inte – kvarstår.** Volatilitetsmåttet saknas inför FOMC-veckan. **Omfång:** 1 symbol.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
