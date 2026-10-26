# Veckorapport: US-rotation
**Vecka:** v 44 | **Datum:** 2026-10-26
**Marknadsklimat:** Avvaktande inför en tung vecka. `^GSPC` stängde fredagen på **7 623,68 (−0,52 %, vecka −0,47 %)** och `^IXIC` på **25 955,34 (−0,21 %, vecka −0,71 %)** (prices.json/Yahoo chart API, marketTime 2026-10-23T20:38:21Z resp. 21:15:59Z). Båda ligger under EMA20 och EMA50. `^GSPC` har RSI 42,2 och ett fallande MACD-histogram (−7,6 → −15,7). Veckan avgörs av FOMC onsdag 28/10, BNP Q3 och PCE torsdag 29/10, samt rapporterna från `MSFT`, `GOOGL` (28/10) och `AMZN` (29/10). Brent ligger över 117 USD/fat med Iran-kriget som drivkraft (Investing.com 2026-10-25, via scout-261026). Det talar emot en duvaktig Fed. DXY och VIX finns inte i `state/prices.json` och anges därför inte med siffra. **Regimfiltret är PÅ:** ^GSPC 7 623,68 ligger **+4,56 %** över MA200 7 291,29 (200 daterade stängningar ur `state/price_history.json`, serien bär 250 punkter). Marginalen har krympt för tredje veckan i rad (+7,61 % → +5,34 % → +4,56 %).

---

## 0. Facit: Förra veckans val
| Aktie | Entry | Exit | Utfall | Stop/Mål träffad? |
|---|---|---|---|---|
| SPY (sleeve) | $773,26 | – (behålls) | −1,72 % mot entry (759,97, 2026-10-23T20:00:00Z) | Ingen stop/mål – sleeven |

**Veckans portföljutfall (viktat):** **−0,43 %**. SPY gick 763,25 (2026-10-16) → 759,97 (2026-10-23) med 100 % vikt. Inga aktieinnehav under veckan.
**Ackumulerad avkastning sedan strategistart:** **−5,13 %**, oförändrad. Inga stängda affärer sedan MRVL 2026-10-14; fem stängda affärer i skarp drift. Siffran är exklusive USD/SEK-effekten (`USDSEK=X` 9,9455, 2026-10-26T12:48:45Z).
**Portföljallokering denna vecka:** **100 % SPY-sleeve.** Alla fyra aktieplatser står tomma. Ingen viktavvikelse att motivera.
**Lärdom:** Två scoutkandidater (`ROP`, `RHI`) fick kurs först efter rapportreaktionen och föll båda på RSI över 75. Det är grind 2:s överköptkrav som fäller, inte data. Det mönster som kom fram i v43 håller i sig: de lugna storbolagen (`BLK`, `UNH`, `PG`) saknar volym eller når inte earnings-golvet 14 %, och veckans största rörelser (`ZS`, `S`, `DVN`) saknar daterad katalysator. Sleeven slår ett framtvingat case (punkt 0c). Tillämpade lärdomar: **L-2** (`CBOE`, `VRT`, `KKR`, `DHR` lagda i `config/watchlist_us.txt`), **L-3** (åtgärdspunkter nedan), **L-4** (inga vilande dataspärrar, se nedan), **L-5** (radarns källa och täckning), **L-6** (ingen klass struken med hänvisning till fokusfilen), **L-7** (rörelsegenomgång ur price_history) och **L-8** (indexöversyner, se radarn).

---

## Case: INGA VALDA DENNA VECKA

Ingen av de 19 aktiekandidaterna i bruttolistan passerade alla fem grindar. De fyra tomma platserna stannar därför i SPY-sleeven. Enligt punkt 0 och 0c i "NIVÅER & OMSÄTTNING" är det ett giltigt utfall: US-boken ska vara mer selektiv än den nordiska, och sleeven slår ett halvbra case.

**Bred scanning – varifrån bruttolistan kom (19 kandidater, samtliga loggade i `state/decisions.json` med `mode: "A"`, plus en BEHÅLL-rad för sleeven):**
* **Ur nyhetsflödet (g0): 6.** `RIG` (SEC 8-K 2026-10-23), `HII` (8-K 2026-10-20), `CBOE` (PR Newswire 2026-10-22: utökat återköpsmandat och utdelning för Q4), `VRT` och `KKR` (8-K 2026-10-26) samt `DHR` (8-K 2026-10-20). `state/news_feed.json` (`generatedAt` 2026-10-26T11:11:41Z) täcker **10 av 10 handelsdagar** (`tradingDaysCovered` 10, `missingDays` tomt, äldsta 2026-10-13). **Tre av sex flöden levererar inte:** `globenewswire` och `globenewswire-earnings` svarar HTTP 403, och `prnewswire` gav timeout (20,0 s) i den senaste körningen (äldre PR Newswire-poster ligger kvar i fönstret). Den delen av pressmeddelandeflödet är **OKONTROLLERAD**. Innehållet i 8-K-rubrikerna för `VRT`, `KKR` och `DHR` är inte verifierat.
* **Ur scout (g): 6.** `META` och `QGEN` (rapport-261022), `PG` och `BX` (rapport-261023) samt `ROP` och `RHI` (rapport-261024). Rapport-261025 och -261026 hade inga case.
* **Förra veckans bubblare (h): 4.** `BLK`, `CVX`, `UNH` och `CRGY`.
* **Rörelsegenomgången (L-7): 2.** `ZS` och `S`. Övriga topp-namn (`RHI`, `ROP`, `RIG`) räknas redan ovan.
* **Egen scanning: 1.** `DVN`, en av två US-symboler med volymkvot ≥ 1,5× och kurs över EMA20/50.

**Funneln:** Grind 1 (verifierad kurs) fäller 4: `CBOE`, `VRT`, `KKR` och `DHR`. De loggas med `price: null` och läggs i watchlisten (punkt 6b). Grind 2 (teknik) fäller 11:
* på **RSI > 75 utan exceptionell katalysator:** `ROP` 80,4, `RHI` 76,1 och `CVX` 76,9;
* på **volymkvot < 1,5×:** `PG` 0,99×, `BLK` 1,25×, `UNH` 0,64×, `CRGY` 0,76× och `RIG` 1,16×;
* på **trend/momentum:** `META` (under EMA20/50, fallande histogram), `BX` (under MA200 125,10) och `HII` (under MA200 338,23).

Grind 3 (katalysator) fäller 3: `ZS`, `S` och `DVN`. Ingen daterad katalysator inom fem handelsdagar hittades i nyhetsflödet eller via websök. Grind 5 (nåbarhet) fäller `QGEN`, vars uppsida är taklagd av EQT:s kontantbud. Volymkvoten är räknad ur `state/volume_history.json` som senaste punkten (2026-10-23) delad med snittet av de 20 föregående. Nåbarhetstaket är räknat som 2 × genomsnittlig absolut daglig förändring (20 dagar, ur `state/price_history.json`) × √horisont.

### De fyra som kom längst – och exakt varför de föll
1. **`RHI` – 45,87 USD** (marketTime 2026-10-23T20:00:02Z, prices.json/Yahoo chart API). Scoutkandidat `261024-RHI`, Q3 2026-10-22 efter stängning (SEC 8-K ex. 99.1; PR Newswire 2026-10-22). Veckan +37,71 % på **3,81× volym**, över EMA20/50/200 och MA200 31,85, MACD-histogrammet stiger (0,12 → 0,38 → 1,05). Omsättningen är 83 MUSD/dag. Nåbarheten räcker: 2 × 3,10 % × √25 = 31,0 %. **Fällt av grind 2:** RSI 76,1 > 75, och katalysatorn är inte exceptionell. Intäkten 1,359 mdr USD låg under konsensus 1,371, och EPS 0,49 slog bara med ~0,02. **Andra spärr, grind 4:** kursen står på 250-dagarshögsta, så målet saknar motstånd att ankras i.
2. **`ROP` – 438,14 USD** (2026-10-23T20:00Z). Scoutkandidat `261024-ROP`, Q3 2026-10-22 före öppning: justerad EPS 5,89 mot 5,79 och höjd helårsguide (scout-261024). Kursen ligger över EMA20/50/200, histogrammet stiger (5,22 → 8,83) och nåbarheten räcker (2 × 1,68 % × √25 = 16,8 %). **Fällt av grind 2:** RSI 80,4 > 75 utan exceptionell katalysator (intäkten var i linje), och volymkvoten 1,49× ligger strax under 1,5×.
3. **`S` – 24,00 USD** (2026-10-23T20:00:03Z). Veckan +11,21 % på 1,60× volym, över EMA20 23,33, EMA50 22,49 och MA200 17,36, RSI 54,2, 3 mån +32 %, 6 mån +69 %. **Fällt av grind 3:** ingen daterad katalysator inom fem handelsdagar hittades. Websök gav bara analytikeråtgärder 6/10 och 13/10 och en VD-försäljning enligt 10b5-1 (5/10). **Andra spärr, grind 2:** MACD-histogrammet är fortfarande negativt (−0,44 → −0,26), alltså ingen bullish korsning.
4. **`DVN` – 51,39 USD** (2026-10-23T20:00:03Z). Volym 1,53×, full EMA-stack, RSI 61,5 och 447 MUSD/dag. **Fällt av grind 3:** ingen daterad katalysator inom fem handelsdagar hittades; websöket gav inget dokument från veckan. Oljan som makromedvind räcker inte som bolagskatalysator. Rapporten kommer 5/11.

**Scout-kandidater i `state/scout_candidates.json`:** `261024-ROP` → **rejected** (grind 2) och `261024-RHI` → **rejected** (grind 2 + grind 4). Båda har `decidedBy` satt till denna rapport. Inga poster med `book: "us"` står kvar som `new`. **L-4:** ingen US-kandidat inom `expiresAt` vilar på en tillfällig datalucka. ROP och RHI var `price: null` i scoutrapporten men har nu kurs, och de avgörs här på omdömesskäl.

---

## Bubblare (watchlist inför nästa vecka)
1. **RHI** – 45,87 USD (2026-10-23T20:00:02Z). Den starkaste flödesbekräftelsen i universumet (3,81×). Prövbar efter en rekyl som tar RSI under 75, så länge Q3-katalysatorn (22/10) fortfarande är inom fönstret. Tyngsta invändningen är intäktsmissen.
2. **ROP** – 438,14 USD (2026-10-23T20:00Z). Slog och höjde. Faller bara på överköpt RSI och en volym strax under kravet. 250-dagarshögsta 463,73 ger ett motstånd att ankra ett mål i.
3. **S** – 24,00 USD (2026-10-23T20:00:03Z). Trend och volym är på plats. Behöver en daterad katalysator och ett positivt MACD-histogram.
4. **DVN** – 51,39 USD (2026-10-23T20:00:03Z). Teknisk setup med volymbekräftelse och energimedvind. Saknar en daterad katalysator; rapporten 5/11 är ett binärt event (punkt 2e).

Samtliga fyra finns i `config/watchlist_us.txt` och har kurs i `state/prices.json` (L-2).

**Förra veckans bubblare:** **BLK** – STRUKEN (grind 2: volym 1,25×; grind 3: Q3 14/10 ligger 8 handelsdagar bak; grind 5: 11,1 % < 14 %). **CVX** – STRUKEN (grind 2: RSI 76,9, volym 1,12×; kurs = 250-dagarshögsta; rapport 30/10, punkt 2e). **UNH** – STRUKEN (grind 2: volym 0,64×; grind 3: Q3 13/10 ligger 9 handelsdagar bak). **CRGY** – STRUKEN (grind 2: volym 0,76×; grind 3: ingen ny daterad katalysator; rapport 2/11).
**Scout-inflöde:** (de 5 senaste: rapport-261022 till -261026; de två sista hade inga case). **META** (261022) – STRUKEN (grind 2: under EMA20/50, fallande histogram, RSI 35,7, veckan −9,4 %). **QGEN** (261022) – STRUKEN (grind 5: kontantbudet 46,50 EUR taklägger uppsidan). **PG** (261023) – STRUKEN (grind 2: volym 0,99×; nåbarheten 14,3 % ligger på golvet utan marginal). **BX** (261023) – STRUKEN (grind 2: under MA200 125,10). **ROP** (261024) – RANKAD UNDER, bubblare 2. **RHI** (261024) – RANKAD UNDER, bubblare 1.
**Villkorade bubblar-planer:** **Inga.** Ingen bubblare klarar samtliga grindar, och en pending-rad på ett case som underkänts på en grind vore att kringgå grinden.

**Rörelsegenomgång (L-7):** rangordnad ur `state/price_history.json` över **108 amerikanska symboler** (exklusive sleeven SPY) med daterad stängning både 2026-10-16 (bas) och 2026-10-23 (mätdag). Topp: `RHI` +37,71 %, `ZS` +23,04 %, `ROP` +14,48 %, `RIG` +14,06 %, `S` +11,21 %, `BX` +10,66 %, `UTHR` +10,20 %, `AXGN` +9,94 %, `NET` +9,93 % och `TEAM` +9,52 %. Botten: `TLX` −14,41 %, `BE` −12,66 %, `AESI` −11,99 %, `META` −9,40 %, `NG` −8,94 %, `RIOT` −8,67 %, `AMAT` −7,83 % och `VST` −7,80 %. De fem största finns i bruttolistan. `UTHR`, `AXGN`, `NET` och `TEAM` togs inte in:
* `UTHR` och `TEAM` har volym 0,69× resp. 0,81×.
* `NET` har ett negativt MACD-histogram.
* `AXGN` ligger under EMA50 och MA200 och rapporterar 28/10.

`state/movers.json` har `asOf` **2026-10-23** men täcker bara nordiska symboler, så den bär inget urvalspåstående här. Resten av den amerikanska marknaden är **OKONTROLLERAD**.

## Veckans radar (kommande 5 handelsdagar)
* **Måndag 26/10** – `PECO` Q3 (`state/earnings_calendar.json`, `isEstimate: false`). Inga innehav berörs.
* **Tisdag 27/10** – `BA`, `ITW` Q3. Conference Board-förtroendet för oktober, konsensus 80,0–80,5 (websök via scout-261026).
* **Onsdag 28/10** – **FOMC-beslut 14:00 ET** med presskonferens 14:30 ET; marknaden prisar ~90 % för oförändrad ränta (CME FedWatch 22/10, via scout-261026). Samma dag rapporterar `MSFT`, `GOOGL`, `BIIB`, `AWK`, `AXGN` och `VNDA`. Hyperscalernas capex-besked avgör om AI-oron fortsätter.
* **Torsdag 29/10** – BNP Q3 (förhandsskattning, konsensus 3,1–3,2 %) och PCE för september; PCE-dagen är inte säkert verifierad. Samma dag rapporterar `AMZN`, `INTC`, `COIN`, `MSTR`, `HII`, `ILMN`, `RDDT` och `SPXC`.
* **Fredag 30/10** – `XOM` och `CVX` Q3.
* **Måndag 2/11 (utanför fönstret)** – `AAPL`, `PLTR`, `RIG`, `CRGY`, `RHP` och `AESI`.
* **Källa och täckning (L-5):** rapportdatumen kommer ur `state/earnings_calendar.json` (`generatedAt` 2026-10-26T11:01:04Z), som bara ser symboler som `prices.yml` hämtar. Resten av US-universumet är **OKONTROLLERAT**. Makrodatumen kommer ur websök, inte ur repot (`macro-calendar-not-verifiable-from-state`). Rapportförbudet (punkt 2e) gäller samtliga namn ovan.
* **Indexöversyner (L-8):** den enda träffen i `state/news_feed.json` (titlar 2026-10-19–26) är rubriken "Howard Hughes Holdings Set to Join S&P SmallCap 600" (prnewswire 2026-10-23T21:45Z). Ikraftträdandedag och källa kunde inte beläggas (scout-261026), så inget `index`-case. Ingen fil i repot räknar upp S&P-förändringar, och den otäckta delen är **OKONTROLLERAD**.
* **Sektorer:**
  * **Medvind:** energi (Brent över 117 USD, `CVX`/`XOM`/`DVN` vid eller nära 250-dagarshögsta, men rapporter i fönstret), mjukvara och cybersäkerhet (`ZS`, `S`, `NET`, `TEAM` +9–23 % på veckan) samt bemanning efter `RHI`.
  * **Motvind:** AI-kraft och halvledarutrustning (`BE`, `VST`, `AMAT` −8 till −13 %), räntekänslig tillväxt inför en hökaktig FOMC, samt kryptonära aktier (`RIOT` −8,7 %).

## Åtgärdspunkter till Dren (L-3)
1. **`alerts-checkedat-heartbeat-lag` / `scheduled-actions-not-firing` – ÅTERKOMMANDE.** Fält: `state/alerts.json` `checkedAt` = 2026-10-23T21:02:47Z vid körningen 2026-10-26 ~13:30 UTC. `monitor.yml` går varje timme 07–20 UTC mån–fre, så **dagens 6–7 schemalagda körningar syns inte**. **Omfång:** intradagsskyddet för båda böckerna. US-boken har inga aktieinnehav och inga pending-planer, så ingen nivå är obevakad. Sleeven saknar stop. Skyddet behandlas som FRÅNVARANDE denna körning.
2. **`news-feed-globenewswire-http-403` – ÅTERKOMMANDE, plus ny defekt i `prnewswire`.** Fält: `state/news_feed.json` `feeds` (`generatedAt` 2026-10-26T11:11:41Z):
   * `globenewswire` = "HTTP 403 – båda försöken (0.0 s)"
   * `globenewswire-earnings` = "HTTP 403 – båda försöken (0.0 s)"
   * `prnewswire` = "fel: This operation was aborted – båda försöken (20.0 s)" (vår egen timeout, se CLAUDE.md om UA-tarpitting)

   **Omfång:** 3 av 6 flöden levererade inget nytt i senaste körningen; bara `sec-8k`, `mfn` och `fed-press` svarar. **Ersättningskälla:** websök och SEC 8-K.
3. **Watchlist-taket – `watchlist-cap-vs-measurability-conflict`.** `config/watchlist_us.txt` bär ~121 symbolrader mot riktmärket 25. Ingen rensning görs, eftersom punkt 6b och `prompts/gemensam_korning.md` (20 handelsdagars utvärderingsfönster) skyddar de flesta. Fyra nya symboler är tillagda (`CBOE`, `VRT`, `KKR`, `DHR`).

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
