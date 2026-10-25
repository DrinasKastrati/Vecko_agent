# Daglig Scout: USA & Krypto
**Datum:** 2026-10-25
**Marknadsklimat:** Det är söndag, och de amerikanska börserna har varit stängda sedan fredagens session 2026-10-23. Den sessionen var risk-av (`^GSPC` −0,52 %, `^IXIC` −0,21 %) med rotation från AI-kraft till mjukvara och säkerhet. Krypto har enligt websök fallit under helgen, med ETH under 2 300 USD, men den rörelsen kan inte verifieras ur repot. Veckan som kommer avgörs av FOMC-beskedet 28/10 och av rapporterna från `MSFT`, `GOOGL` (28/10) och `AMZN` (29/10). **Aktiva lärdomar tillämpade:** L-3 (åtgärdspunkter sist), L-4 (kontroll av vilande kandidater), L-5 (rapportkalenderns källa och täckning) och L-6 (inga klasser utesluts). L-1, L-2, L-7 och L-8 gäller inte scouten.

## Marknadsöversikt

`git pull` 2026-10-25 05:48 UTC (06:48 CET) gav `origin/main` = `a90f3ac` (`Veckans rörelser: 2026-10-24 10:58 UTC`). `state/prices.json` är **samma fil som i rapport-261024**: `generatedAt` 2026-10-23T23:51:52Z, `schemaVersion` 2026-08-02-prevclose, `tickerCount` 231, `okCount` 229 och `wideAt` 2026-10-23T10:01:55Z. `prices.yml` kör bara vardagar, så ingen nyare fil finns. Källa: `Yahoo Finance chart API via GitHub Actions`.

| Symbol | Nivå | Senaste rörelse | Vecka (mot 2026-10-16) | marketTime |
|---|---|---|---|---|
| `^GSPC` | 7 623,68 | −0,52 % fredag (7 663,43 → 7 623,68) | −0,47 % | 2026-10-23T20:38:20Z |
| `^IXIC` | 25 955,34 | −0,21 % fredag (26 008,86 → 25 955,34) | −0,71 % | 2026-10-23T21:15:59Z |
| `BTC-USD` | 81 058,34 | −0,30 % mot daterad punkt 2026-10-22 (81 301,68) | −0,58 % | 2026-10-23T23:50:44Z |
| `ETH-USD` | 2 382,85 | −0,13 % mot daterad punkt 2026-10-22 (2 385,94) | −1,51 % | 2026-10-23T23:50:55Z |
| `SPY` (sleeve) | 759,97 | −0,52 % fredag (763,96 → 759,97) | −0,43 % | 2026-10-23T20:00:00Z |

**Krypto: helgens rörelse är KURS EJ VERIFIERAD.** Mynten handlas dygnet runt, men den senaste verifierade kursen är ~30 timmar gammal (fredag 23:50 UTC). Reservkällan Yahoo Finance kan inte nås från körmiljön: `curl` mot `query1.finance.yahoo.com` ger `CONNECT tunnel failed, response 403`. Enligt websök låg ETH kring 2 298 USD (−4,4 % på 24 timmar) och BTC kring 79 543 USD (−2,4 %) under lördagen (cryptoticker.io 2026-10-24). Det är en aggregatorsajt och inte en etablerad finanskälla, så uppgiften används bara som sammanhang, aldrig som kursnivå. Se åtgärdspunkt 5.

**Teknik** (oförändrad sedan rapport-261024 eftersom serien är densamma; räknad på råserien i `state/price_history.json`, 250 punkter till och med 2026-10-23):
- **`^GSPC`:** 4,6 % över MA200 (7 291,29) ⇒ **regimfiltret för US-boken är fortsatt PÅ**. Kursen ligger under EMA20 (7 713,20) och EMA50 (7 681,77). RSI 42,2, och MACD-histogrammet fördjupas (−11,24 → −15,66).
- **`^IXIC`:** under EMA20 och EMA50, 3,9 % över MA200 (24 991,95). RSI 38,0.
- **`BTC-USD`:** under EMA20 (82 268,21), över EMA50 (79 667,96) och MA200 (71 967,12) vid den senaste verifierade kursen. RSI 47,0. Websökens lördagsnivå (~79 500) skulle ligga under EMA50, men det är inte verifierat.
- **`ETH-USD`:** under EMA20 (2 483,55) och EMA50 (2 438,29), över MA200 (2 124,11). RSI 39,8.

**Kryptoflöden:** spot-bitcoin-ETF:erna hade utflöden på ~635,6 MUSD 2026-10-23 enligt Crypto Times (2026-10-23). Det motsäger delvis Coin Editions bild av en vecka som slutade på plus för bitcoin-ETF:erna (coinedition.com, odaterat), vilket går ihop om veckans tidiga inflöden (~+527 MUSD 2026-10-19, The Block 2026-10-20) var större. Ether-ETF:erna har fortsatt utflöden. Flödena är inte verifierade mot en primärkälla (Farside/SoSoValue).

## Ekonomiska siffror & kalender

**Senaste utfall** (oförändrade sedan rapport-261024, inga releaser under helgen):
- **S&P Global flash-PMI oktober (2026-10-23):** tillverkning 56,0 mot väntat 55,5, tjänster 57,9 mot väntat 58,0 (Reuters via Lufkin Daily News 2026-10-23).
- **UMich-sentimentet, slutligt oktober (2026-10-23): 48,0 mot väntat 46,3.** Ettårs inflationsförväntan 4,7 % (samma källa).
- **Arbetslöshetsanspråk (2026-10-22): 194 000 mot väntat 200 000** (rapport-261023).

**Kommande** (källa: websök, ingen fil i repot – se åtgärdspunkt 2):
- **Onsdag 2026-10-28, 14:00 ET: FOMC-beslutet (möte 27–28/10). Det är veckans mest marknadsrörande punkt.** Enligt en förhandsanalys väntas räntan lämnas oförändrad på 3,75–4,00 % efter höjningen i september, med fokus på ordförande Warshs presskonferens (FXEmpire, veckoförhandsvisning, oktober 2026). Uppgiften kommer från en enda källa och är inte verifierad mot Fed. Brent över 100 USD/fat (116,72 i fredags enligt Reuters via Lufkin Daily News 2026-10-23) talar emot en duvaktig signal.
- **Torsdag 2026-10-29, 08:30 ET: BNP Q3 (förhandsskattning) och personlig inkomst och konsumtion för september (PCE-inflationen)** enligt BEA:s publiceringsschema (bea.gov; fedratecalc.com). Konsensusvärden har inte kunnat verifieras och anges inte.
- Conference Board-förtroendet: datum kunde inte verifieras och anges inte.
- Samma vecka har ECB och Bank of Canada räntebesked (thriveinmarkets.com, kalender 2026-10-26); datumen är inte verifierade.

**Rapporter nästa 5 handelsdagar** (`state/earnings_calendar.json`, `generatedAt` 2026-10-23T10:00:01Z, `errors` tomt), US-symboler:
- 10-26: `PECO`
- 10-27: `BA`, `ITW` och `SKHY`
- 10-28: `MSFT`, `GOOGL`, `BIIB`, `AWK`, `AXGN` och `VNDA`
- 10-29: `AMZN`, `COIN`, `MSTR`, `INTC`, `HII`, `ILMN`, `RDDT` och `SPXC`
- 10-30: `XOM` och `CVX`
- 11-02: `AAPL`, `PLTR`, `RIG`, `RHP`, `CRGY` och `AESI`

**L-5:** kalendern ser bara de symboler `prices.yml` hämtar. Resten av det amerikanska universumet är **OKONTROLLERAT**. Enligt Reuters (via mvariety.com, "Wall Street week ahead", 2026-10) rapporterar ungefär en tredjedel av S&P 500-bolagen i veckan; de flesta av dem saknas i filen. Alla rapportdatum är bevakningsposter enligt punkt 8, aldrig köpförslag.

## Aktuella händelser & katalysatorer

- **Veckans rapportflod och FOMC (Reuters via mvariety.com, 2026-10).** Alphabet och Microsoft rapporterar onsdag och Amazon torsdag. Hyperscalernas capex väntas bli omkring 800 mdr USD i år, och rapporterna ska visa om marknaden prissätter den som efterfrågan eller som kostnad. Det är väntade event och därmed bevakning, inga case (punkt 8).
- **Krypto föll under helgen (cryptoticker.io 2026-10-24, ej etablerad finanskälla).** ETH bröt under 2 300 USD, som handlarna sett som golv, med likvidationer. Fundingräntan för ETH på OKX gick till noll, och optionsmarknaden prisade ~55 % volatilitet för ETH mot ~39 % för BTC. **KURS EJ VERIFIERAD**, se Marknadsöversikt.
- **Bitcoin-ETF:er:** ~635,6 MUSD i utflöden 2026-10-23 (Crypto Times 2026-10-23). Inte verifierat mot primärkälla.
- **`state/news_feed.json`** (`generatedAt` 2026-10-23T23:52:21Z) täcker **10 av 10 handelsdagar** (2026-10-12 – 2026-10-23, `missingDays` tomt). Filen har inte uppdaterats under helgen (`news.yml` kör vardagar). **`globenewswire` och `globenewswire-earnings` svarar fortfarande HTTP 403** (åtgärdspunkt 1), så den delen av pressmeddelandeflödet är **OKONTROLLERAD**.
- **Inga bekräftade bolagsutfall under helgen** hittades i feeden eller via websök. Inga rykten används i dag.

## Uppföljning av tidigare case

Den senaste tidigare scout-rapporten (rapport-261024) hade två case. Ingen session har ägt rum sedan dess:
- **`ROP` (rapport-261024): KURS EJ VERIFIERAD då → KURS EJ VERIFIERAD nu.** `ROP` saknas fortfarande i `state/prices.json` och `state/price_history.json`, eftersom raden i `config/watchlist_us.txt` lades till på lördagen och `prices.yml` inte kör under helgen. Den första kursen väntas på måndagens körning. Inget nytt bolagsbesked har kommit. **Tes INTAKT** (oprövad).
- **`RHI` (rapport-261024): KURS EJ VERIFIERAD då → KURS EJ VERIFIERAD nu.** Samma läge som `ROP`. **Tes INTAKT** (oprövad).

**Kandidatkön (`state/scout_candidates.json`):** 90 poster, varav 83 `rejected`, 5 `promoted` och **2 `new`**:
- **`261024-ROP`** och **`261024-RHI`** är `new` med `price: null` och väntar på US-bokens avgörande måndag 2026-10-26 (`expiresAt` 2026-10-30). De är inte försenade. `refresh-candidate-prices.mjs` kan fylla i kursen på måndagens första körning eftersom båda katalysatorerna (2026-10-22) ligger före den reguljära stängningen 2026-10-23 och därmed före varje kurs som hämtas. En kandidat med `price: null` får aldrig promotas.

**L-4-kontroll:** `261023-PG` (grind 5, nåbarhet), `261023-BX` (grind 2, teknik), `261022-QGEN` (grind 5) och `261022-META` (grind 2) avvisades alla av omdömesskäl, inte på grund av en datalucka. Inga avvisade poster inom sin `expiresAt` vilar på en tillfällig datalucka, så L-4 är uppfylld.

**Innehav:** US-boken har inga aktieinnehav. `SPY` ligger på 100 % (`state/portfolj_us.md`), 759,97 (−1,72 % mot entry 773,26). `state/alerts.json` har inga aktiva signaler (`checkedAt` 2026-10-23T21:02:47Z).

## Dagens case

**Inga case i dag.** Enligt promptens punkt 6 ska case aldrig tvingas fram, och det finns tre skäl:

1. **Inget nytt kursunderlag.** `state/prices.json` och `state/news_feed.json` är samma filer som i rapport-261024. Ett case nu skulle bygga på samma stängningar som redan gav `261024-ROP` och `261024-RHI`.
2. **Inget bekräftat bolagsutfall har kommit under helgen.** Veckans katalysatorer (`MSFT`, `GOOGL`, `AMZN`, `COIN`, `MSTR`, `XOM` och `CVX`) är väntade event. Enligt punkt 8 är de bevakningsposter och får aldrig bli köpförslag före rapporten.
3. **Krypto saknar verifierad kurs sedan fredag 23:50 UTC** och saknar en positiv kryptospecifik katalysator. Helgrörelsen är enligt websök negativ, och ETF-flödena var negativa på fredagen.

**Inga nya kandidatposter skrivs till `state/scout_candidates.json` i dag.** Det finns inga case och ingen ny bekräftad, handlingsbar bolagskatalysator, så filen lämnas orörd med 90 poster. `config/watchlist_us.txt` lämnas också orörd.

## Makro- & sektorfaktorer att bevaka

**Varför marknaden är avvaktande:** veckan avgörs av två binära frågor, och ingen av dem har ett utfall än.

**Räntor och olja:** Fed höjde i september och väntas ligga still på onsdag, men oljan över 100 USD/fat, UMich-förväntningarna på 4,7 % och en stark tillverknings-PMI ger inget utrymme för en duvaktig signal. BNP och PCE kommer dagen efter beskedet. Det är motvind för tillväxtaktier och krypto, och medvind för energi, som dock rapporterar i fönstret (`XOM`/`CVX` 30/10) och inte får köpas in i rapporten.

**AI-kedjan:** fredagens rotation (mjukvara och säkerhet upp, AI-kraft och kryptominers ned) har pågått i två dagar och är inte belagd som trend. Hyperscalernas capex-besked 28–29/10 avgör om den håller. `^IXIC` ligger under EMA20 och EMA50 med RSI 38,0, men över MA200.

**Krypto:** BTC låg i fredags över MA200 och EMA50, men helgens fall (overifierat) kan ha tagit den under EMA50. `COIN` och `MSTR` rapporterar 29/10, vilket är bevakning och inte ett köp in i rapporten (punkt 8).

Inget av detta gör ett nytt case starkare i dag än det var i går.

### Åtgärdspunkter till Dren (L-3)

1. **`news-feed-globenewswire-http-403` – kvarstår, ÅTERKOMMANDE.** `feeds.globenewswire` och `feeds.globenewswire-earnings` är båda `"HTTP 403 – båda försöken (0.1 s)"` (`state/news_feed.json`, 2026-10-23T23:52:21Z). **Omfång:** 2 av 6 flöden, varav ett är den enda källan som är dedikerad åt rapportöverraskningar. **Ersättningskälla:** websök.
2. **`macro-calendar-not-verifiable-from-state` – ÅTERKOMMANDE.** Följande kommer ur websök: FOMC-tiden och räntenivån, BNP/PCE-datumen, ECB/BoC, kryptoflödena och helgens kryptokurser. Ingen konsensus för veckans releaser kunde verifieras. Källorna om ETF-flödena är motsägelsefulla. **Omfång:** samtliga makrodatum och -värden i rapporten.
3. **`crypto-previousclose-misdated` – ÅTERKOMMANDE.** `quotes["BTC-USD"].previousClose` är 81 311,89 medan punkten 2026-10-22 i `state/price_history.json` är 81 301,68. För `ETH-USD` är det 2 386,19 mot 2 385,94. **Omfång:** 2 av 2 mynt. **Ersättningskälla:** den daterade punkten, som används i tabellen.
4. **`watchlist-cap-vs-measurability-conflict` – ÅTERKOMMANDE.** `config/watchlist_us.txt` har 117 symbolrader mot riktmärket 25. Inga rader stryks, eftersom skydden i `prompts/gemensam_korning.md` går före riktmärket. 2 av 231 symboler i `state/prices.json` saknar `price` (`BK`, `NRS.OL`); `BK` är den enda US-symbolen.
5. **`crypto-weekend-price-gap` – ÅTERKOMMANDE** (togs upp i rapport-261018). `prices.yml` kör bara vardagar, så `BTC-USD` och `ETH-USD` saknar verifierad kurs från fredag 23:50 UTC till måndagens första körning, alltså ~54 timmar. Reservkällan Yahoo kan inte nås från scoutens körmiljö (proxy 403). I helgen var det just den perioden ETH föll under 2 300 USD enligt websök. **Omfång:** 2 av 2 bevakade mynt, varje helg. **Ersättningskälla:** ingen verifierad. **Förslag:** en helgcron i `prices.yml` som bara hämtar `-USD`-symbolerna.
6. **`^VIX` hämtas inte – kvarstår.** Volatilitetsmåttet saknas inför FOMC-veckan. **Omfång:** 1 symbol.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
