# Veckorapport: US-rotation
**Vecka:** v 45 | **Datum:** 2026-11-02
**Marknadsklimat:** Svag riskaptit efter fredagens AI-ras. `^GSPC` stängde på **7 580,07 (−1,82 % fredag, vecka −0,57 %)** och `^IXIC` på **25 437,00 (−2,86 % fredag, vecka −2,00 %)** (prices.json/Yahoo chart API, marketTime 2026-10-30T20:47:43Z resp. 21:15:59Z). Båda ligger under EMA20 och EMA50. `^GSPC` har RSI 40,1 och ett fallande MACD-histogram (−3,7 → −11,5). Kärn-PCE 3,1 % å/å, ECI 3,4 % och BNP Q3 3,4 % gör att marknaden diskuterar en räntehöjning i december (CNBC/BLS 2026-10-29–30, via scout-261102). Söndagens futures steg (S&P 500 +0,5 %, CNBC 2026-11-01). Det är en reaktion på fredagen och används inte som kurs. Veckan staplar binära händelser: mellanårsvalet tisdag 3/11 och NFP fredag 6/11. DXY och VIX finns inte i `state/prices.json` och anges därför inte med siffra. **Regimfiltret är PÅ:** ^GSPC 7 580,07 ligger **+3,70 %** över MA200 7 309,73 (200 daterade stängningar ur `state/price_history.json`, serien bär 250 punkter). Marginalen har krympt för fjärde veckan i rad (+7,61 % → +5,34 % → +4,56 % → +3,70 %).

---

## 0. Facit: Förra veckans val
| Aktie | Entry | Exit | Utfall | Stop/Mål träffad? |
|---|---|---|---|---|
| SPY (sleeve) | $773,26 | – (behålls) | −2,27 % mot entry (755,72, 2026-10-30T20:00:00Z) | Ingen stop/mål – sleeven |

**Veckans portföljutfall (viktat):** **−0,56 %**. SPY gick 759,97 (2026-10-23) → 755,72 (2026-10-30) med 100 % vikt. Inga aktieinnehav och inga fyllnader under veckan. NUE ≤ 262,00 och AXGN ≤ 46,00 triggade inte.
**Ackumulerad avkastning sedan strategistart:** **−5,13 %**, oförändrad. Inga stängda affärer sedan MRVL 2026-10-14; fem stängda affärer i skarp drift. Siffran är exklusive USD/SEK-effekten (`USDSEK=X` 9,7676, 2026-11-02T13:28:14Z).
**Portföljallokering denna vecka:** **12,5 % CBOE (ben 1) / 87,5 % SPY-sleeve.** Ben 2 i CBOE (12,5 %) ligger som villkorad limit. Två villkorade scoutplaner står kvar: NUE och AXGN, 25 % vardera. Fylls alla tre blir boken 75 % aktier / 25 % sleeve. Vikten är platt 25 % per position, delad i två ben enligt punkt 4a.
**Lärdom:** Ett case passerar för första gången sedan v41. Det skedde för att en scoutkandidat hade verifierad kurs efter katalysatorn och kunde poängsättas samma dag (`CBOE` föll på grind 1 i v44 och kom in via watchlisten, **L-2**). Bortfallet i övrigt följer v43–v44: 11 av 24 kandidater ligger under MA200 eller har RSI över 75, och de lugna storbolagen (`CVX`) når inte earnings-golvet 14 %. Tillämpade lärdomar: **L-2** (`AMGN`, `KMB`, `BKR`, `CNC` lagda i `config/watchlist_us.txt`), **L-3** (åtgärdspunkter nedan), **L-4** (inga vilande dataspärrar, se nedan), **L-5** (radarns källa och täckning), **L-6** (ingen klass struken med hänvisning till fokusfilen), **L-7** (rörelsegenomgång ur price_history) och **L-8** (indexöversyner, se radarn).

---

## Case 1: Cboe Global Markets (CBOE / Cboe BZX)

### 1. Katalysatorn
Q3 2026, rapporterad **2026-10-30 före öppning**. Justerat EPS var **3,63 USD (+36 %)** mot konsensus 3,29–3,43, med rekordhögt GAAP-EPS 4,08. Nettointäkterna var **712,2 MUSD (+18 %)**, varav optioner 469,5 MUSD (+23 %). Kostnadsguiden för helåret sänktes till 830–845 MUSD, från 838–853 (SEC 8-K ex. 99.1 `cboe-20261030xex991`; PR Newswire via Finviz 2026-10-30; RTTNews 2026-10-30). Höjningen av den organiska intäktsguiden till "high teens" kommer ur scout-261031 (Cboe IR via websök). Den är inte omverifierad här. Reaktionen var **+6,77 %** till 335,53 (från 314,25; intervall 320,12–342,86) på **2,01× volym** (marketTime 2026-10-30T20:00:00Z, prices.json/Yahoo chart API). Katalysatorn kom före öppning, inte i efterhandeln, och kursen ligger efter den. Scoutkandidat `261031-CBOE` → **promoted**.

### 2. Investerings-tes (The Bull Case)
* Slog och höjde på ett hel-beat: intäkter, EPS och kostnader pekar åt samma håll. Optionsvolymerna är bolagets kärna, och en vecka med val och NFP är en volatilitetsvecka. Det är medvind för en börsoperatör, inte motvind.
* Trenden bär: kursen gick 253,26 (28/9) → 335,53 och ligger över EMA20 311,84 > EMA50 298,99 > EMA200 287,52, med +12,7 % på tre månader. Sektorrotationen går mot finansiell infrastruktur och bort från AI-halvledare (scout-261102). Det gör caset okorrelerat med fredagens ras.

### 3. Motargument & Risker (The Bear Case)
* Uppgången är brant: +32 % på fem veckor, medan sexmånadersrörelsen bara är +2,6 %. Punkt 1b varnar för en brant kortsiktig uppgång utan lång trend bakom. Aktien föll också fyra dagar i rad före rapporten (340,44 → 314,25).
* Målet 382,50 ligger ovanför 250-dagarshögsta 366,70 (+9,3 %), som är det närmaste motståndet. En reaktion där blir trolig. Förbörskursen i dag gick inte att verifiera (Yahoo-reservkällan gav 403 genom proxyn), så ben 1 bokförs på fredagens reguljära stängning.

### 4. Fundamental snapshot
* **Börsvärde:** ej verifierat i repot | **P/E / EV/EBITDA:** ej verifierat | **Tillväxt:** nettointäkt +18 %, justerat EPS +36 % (Q3 2026) | **Snittomsättning/dag:** **410 MUSD** (20 dagars snittvolym ur `state/volume_history.json` × kurs)

### 5. Teknisk setup
* **RSI(14):** 63,9 | **MACD:** histogrammet positivt och stigande sista dagen (2,42 → 1,01 → 1,34) | **Kurs vs EMA20/50/200:** över alla tre, full stack; över MA200 292,51 | **Volym vs 20d-snitt:** 2,01× (2 458 367 st 30/10) | **Stöd:** 320,12 (30/10-lägsta), 314,34 (29/10-stängning) | **Motstånd:** 342,86 (30/10-högsta), 366,70 (250d-högsta)

### 6. Handelsplan
| Entry | Stop-loss | Målkurs | Risk/Reward |
|---|---|---|---|
| $335,53 (ben 1) / ≤ $325,00 (ben 2) | $316,00 (−5,82 %) | $382,50 (+14,00 %) | 1:2,41 (ben 1), 1:6,39 (ben 2) |

**Planerad vikt:** 25 %, platt enligt positionsregeln, i två ben. **Ben 1** är 12,5 % och köps direkt till verifierad kurs 335,53. **Ben 2** är 12,5 % som villkorad limit ≤ 325,00 i reguljär session. Triggar den inte inom 5 handelsdagar avförs den och stannar i sleeven. Inget undantag för hel limit: aktien gapade inte upp i dag, och ingen bolagsspecifik binär händelse infaller inom 2 handelsdagar. Valet 3/11 är makro, inte ett besked om bolaget.
* `catalystType: "earnings"` ⇒ horisont 3–6 veckor, här **25 handelsdagar**, mål 14–18 %, stop 5–6 %, inget tidsstopp.
* **Kostnadströskel:** entry → mål +14,00 % ≥ 8 % (≥ 10× rundtur 0,75 %).
* **Nåbarhet (punkt 6):** 2 × 2,56 % (snittlig absolut dagsrörelse, 20 dagar) × √25 = **25,6 %** ≥ 14,00 %.
* **Poäng:** katalysator 8, teknik 7, makro 6, R/R 6 ⇒ **7,0**. Poängen styr urval, inte vikt.

---

## Case: INGA FLER VALDA DENNA VECKA

Ingen av de övriga 23 aktiekandidaterna passerade alla fem grindar. Tre platser är tomma; två av dem är reserverade av de villkorade planerna NUE och AXGN. De står kvar i SPY-sleeven tills en plan triggar (punkt 0 och 0c).

**Bred scanning – varifrån bruttolistan kom (24 aktiekandidater, samtliga loggade i `state/decisions.json` med `mode: "A"`, plus en BEHÅLL-rad för sleeven):**
* **Ur nyhetsflödet (g0): 8.**
  * `MRVL` (SEC 8-K 2026-11-02 ×2), `META` (8-K 2026-10-29), `BX` (8-K 2026-10-27) och `TEVA` (8-K 2026-10-29).
  * Utan kurs: `AMGN` (8-K 2026-10-26), `KMB` (8-K 2026-10-29), `BKR` (8-K 2026-10-27) och `CNC` (8-K 2026-10-26).
  * Innehållet i 8-K-rubrikerna är **inte verifierat**.
  * `state/news_feed.json` (`generatedAt` 2026-11-02T13:35:23Z) täcker **10 av 10 handelsdagar** (`tradingDaysCovered` 10, `missingDays` tomt, äldsta 2026-10-19).
* **Ur scout (g): 6.** `MSFT` och `VRT` (rapport-261029), `HII` och `AMZN` (rapport-261030) samt `CBOE` och `CVX` (rapport-261031). `AXGN` (rapport-261029) är redan en aktiv villkorad plan och poängsätts inte om. Rapport-261101 och -261102 hade inga case.
* **Förra veckans bubblare (h): 4.** `RHI`, `ROP`, `S` och `DVN`.
* **Rörelsegenomgången (L-7): 6.** `PNR`, `SOFI`, `CCL`, `RIG`, `FIVE` och `SKHY`.

**Funneln:**
* **Grind 1 (verifierad kurs) fäller 4:** `AMGN`, `KMB`, `BKR` och `CNC`. De loggas med `price: null` och läggs i watchlisten (punkt 6b).
* **Grind 2 (teknik) fäller 16.**
  * Kurs ≤ MA200 eller MA200 ej beräkningsbar: `VRT`, `HII`, `AMZN`, `META`, `BX`, `PNR`, `SOFI` och `SKHY` (80 punkter).
  * RSI > 75: `ROP` 82,2 och `RIG` 77,5.
  * Fallande eller negativt MACD-histogram under EMA20: `MSFT` och `MRVL`.
  * Volym < 1,5×: `S` 0,80×, `DVN` 1,10×, `CCL` 1,04× och `FIVE` 0,94×.
  * `TEVA` har negativt histogram, volym 1,21× och rapport 3/11.
* **Grind 3 (katalysator):** `RHI` faller här: Q3 22/10 ligger 7 handelsdagar bak, och histogrammet faller.
* **Grind 5 (nåbarhet):** `CVX` faller här, se nedan.

Volymkvoten är räknad ur `state/volume_history.json` som senaste punkten (2026-10-30) delad med snittet av de 20 föregående. Nåbarhetstaket är räknat som 2 × genomsnittlig absolut daglig förändring (20 dagar, ur `state/price_history.json`) × √horisont.

### De som kom längst – och exakt varför de föll
1. **`CVX` – 235,52 USD** (marketTime 2026-10-30T20:02:24Z, prices.json/Yahoo chart API). Scoutkandidat `261031-CVX` är bekräftad: Q3 30/10 med justerat EPS 5,28 mot ~4,73–4,89. Tekniken håller: RSI 72,9, full EMA-stack, volym 1,53×, 1 693 MUSD/dag och stigande histogram (0,73 → 0,81). **Fällt av grind 5:** 2 × 1,16 % × √30 = **12,7 %**, vilket ligger under earnings-golvet 14 % även vid sex veckors horisont. **Andra spärr, grind 4:** kursen står på 250-dagarshögsta, så målet saknar motstånd att ankras i. → **rejected**.
2. **`RHI` – 43,73 USD** (2026-10-30T20:00Z). Rekylen tog RSI från 76,1 till **65,2**, så v44:s spärr är borta. **Fällt av grind 3:** katalysatorn (Q3 22/10) ligger nu 7 handelsdagar bak. Histogrammet faller (1,21 → 1,09) och volymen är 1,48×.
3. **`DVN` – 52,15 USD** (2026-10-30T20:00Z). Har full EMA-stack och RSI 63,7, men volymen är 1,10× och ingen daterad katalysator finns. Rapporten kommer 5/11 (`isEstimate: false`), alltså ett binärt event (punkt 2e).

**Scout-kandidater i `state/scout_candidates.json`:** `261031-CBOE` → **promoted** och `261031-CVX` → **rejected** (grind 5). Båda har `decidedBy` satt till denna rapport. Inga poster med `book: "us"` står kvar som `new`. **L-4:** ingen US-kandidat inom `expiresAt` vilar på en tillfällig datalucka.

**Villkorade scoutplaner (oförändrade, prövade mot verifierad kurs):**
* **`NUE` ≤ 262,00** – **EJ TRIGGAD.** Fredagens dagslägsta var 268,75 (marketTime 2026-10-30T20:00:03Z), 2,57 % över villkoret. Det här är handelsdag 3 av 5. Regim PÅ och kurs över MA200 223,99; tesen är intakt.
* **`AXGN` ≤ 46,00** – **EJ TRIGGAD.** Fredagens dagslägsta var 48,08 (2026-10-30T20:00:01Z), 4,52 % över villkoret. Det här är handelsdag 2 av 5. Kurs över MA200 39,57; tesen är intakt.
* Förbörskurser för planerna gick inte att verifiera. Planerna gäller mot reguljär session.

---

## Bubblare (watchlist inför nästa vecka)
1. **CVX** – 235,52 USD (2026-10-30T20:02:24Z). Den renaste tekniska bilden i universumet efter CBOE. Faller enbart på nåbarheten, eftersom en lugn megacap inte gör 14 % på sex veckor.
2. **DVN** – 52,15 USD (2026-10-30T20:00Z). Har trend och energimedvind. Blir prövbar efter rapporten 5/11 om en bekräftad överraskning ger en daterad katalysator och volym.
3. **S** – 25,15 USD (2026-10-30T20:00Z). Trend och positivt histogram (0,14 → 0,17) finns nu. Saknar volym och en daterad katalysator.
4. **RHI** – 43,73 USD (2026-10-30T20:00Z). RSI är tillbaka under 75. Behöver en ny katalysator, eftersom Q3 har åldrats ur fönstret.

Samtliga fyra finns i `config/watchlist_us.txt` och har kurs i `state/prices.json` (L-2).

**Förra veckans bubblare:** **RHI** – STRUKEN (grind 3: Q3 22/10 7 handelsdagar bak; grind 2: fallande histogram, volym 1,48×). **ROP** – STRUKEN (grind 2: RSI 82,2; grind 3: katalysatorn åldrad). **S** – STRUKEN (grind 2: volym 0,80×; grind 3: ingen katalysator). **DVN** – STRUKEN (grind 2: volym 1,10×; grind 3: ingen katalysator; rapport 5/11).
**Scout-inflöde:** (de 5 senaste: rapport-261029 till -261102; de två sista hade inga case.) **MSFT** (261029) – STRUKEN (grind 2: under EMA20, fallande histogram). **AXGN** (261029) – redan promotad 2026-10-29, villkorad plan ≤ 46,00 aktiv. **VRT** (261029) – STRUKEN (grind 2: under MA200 270,53). **HII** (261030) – STRUKEN (grind 2: under MA200 335,65, RSI 75,9). **AMZN** (261030) – STRUKEN (grind 2: under MA200 243,40). **CBOE** (261031) – **VALD**, case 1. **CVX** (261031) – RANKAD UNDER (grind 5), bubblare 1.
**Villkorade bubblar-planer:** **Inga.** Ingen bubblare klarar samtliga grindar. De aktiva villkorade planerna är scoutpromotioner (`NUE`, `AXGN`) och CBOE ben 2, inte bubblar-planer.

**Rörelsegenomgång (L-7):** rangordningen är gjord ur `state/price_history.json` över **117 amerikanska symboler** (exklusive sleeven SPY) med daterad stängning både 2026-10-23 (bas) och 2026-10-30 (mätdag).
* **Topp:** `AXGN` +29,72 %, `PNR` +19,82 %, `VRT` +19,65 %, `HII` +15,62 %, `SOFI` +14,68 %, `CCL` +10,42 %, `SKHY` +8,90 %, `RIG` +8,27 %, `FIVE` +7,94 %, `ACHR` +7,42 % och `TSLA` +7,41 %.
* **Botten:** `RDDT` −36,41 %, `INTC` −24,38 %, `TEAM` −15,77 %, `MRVL` −14,05 %, `NET` −13,82 %, `COIN` −12,72 %, `GOOGL` −12,61 % och `ILMN` −12,41 %.

De nio största finns i bruttolistan eller som aktiv plan. `ACHR` och `TSLA` togs inte in, eftersom ingen daterad bolagskatalysator inom fem handelsdagar hittades i nyhetsflödet. `state/movers.json` täcker bara nordiska symboler och bär inget urvalspåstående här. Resten av den amerikanska marknaden är **OKONTROLLERAD**.

## Veckans radar (kommande 5 handelsdagar)
* **Måndag 2/11** – ISM tillverkning 10:00 ET. Datumet är motsägelsefullt i källorna och inte verifierat (scout-261102). `AAPL`, `PLTR`, `RIG`, `RHP`, `CRGY` och `AESI` rapporterar efter stängning. Inga innehav berörs.
* **Tisdag 3/11** – **mellanårsvalet i USA**, med börserna öppna. Tillsynen över banker, krypto och AI står på spel (Reuters via Kitco 2026-10-30). Valet är en volatilitetshändelse för CBOE:s optionsvolymer, inte en bolagsrapport. Samma dag rapporterar `AMD`, `ANET`, `SMCI`, `TEVA` och `AMRX`, samt `PCVX` (`isEstimate: true`).
* **Onsdag 4/11** – `NVO`, `PAYC`, `PTC`, `QGEN`, `UTHR`, `KHC`, `BKH`, `CXW` och `RIOT`, samt `MARA` (`isEstimate: true`).
* **Torsdag 5/11** – jobless claims. `AKAM`, `DVN`, `EVCM`, `IREN`, `NET`, `TEAM` och `U` rapporterar, samt `SYNA` och `WBD` (`isEstimate: true`).
* **Fredag 6/11** – **NFP oktober 08:30 ET**, konsensus ~65 000. Ett starkt utfall stärker förväntningarna på en höjning i december (Reuters via Kitco 2026-10-30). `VST` rapporterar. Ingen rapport för `CBOE`, `NUE` eller `AXGN` finns i fönstret.
* **Källa och täckning (L-5):**
  * Rapportdatumen kommer ur `state/earnings_calendar.json` (`generatedAt` 2026-11-02T13:26:33Z, `errors` tomt). Den ser bara symboler som `prices.yml` hämtar, så resten av US-universumet är **OKONTROLLERAT**.
  * Makrodatumen kommer ur websök via scout-261102, inte ur repot.
  * Rapportförbudet (punkt 2e) gäller samtliga namn ovan.
* **Indexöversyner (L-8):** `state/news_feed.json` gav ingen träff på "S&P 500/MidCap/SmallCap", "Nasdaq-100" eller "join the" i titlarna 2026-10-26 – 2026-11-02, och därför inget `index`-case. Ingen fil i repot räknar upp S&P-förändringar, så den otäckta delen är **OKONTROLLERAD**.
* **Sektorer:**
  * **Medvind:** finansiell infrastruktur och börser (`CBOE`), energi (`CVX`, `DVN` vid eller nära 250-dagarshögsta) samt defensiva sektorer.
  * **Motvind:** AI-halvledare och nätverk (`INTC` −24 %, `MRVL` −14 %, `NET` −14 %), sociala medier (`RDDT` −36 %, `META` under MA200), kryptonära aktier (`COIN` −12,7 %) och räntekänslig tillväxt inför en möjlig höjning i december.

## Åtgärdspunkter till Dren (L-3)
1. **`news-feed-globenewswire-http-403` – ÅTERKOMMANDE.** Fält: `state/news_feed.json` `feeds` (`generatedAt` 2026-11-02T13:35:23Z):
   * `globenewswire` = "HTTP 403 – båda försöken (0.0 s)"
   * `globenewswire-earnings` = "HTTP 403 – båda försöken (0.1 s)"

   **Omfång:** 2 av 6 flöden. `prnewswire` svarar igen (20 poster) och v44:s timeout är borta. **Ersättningskälla:** websök och SEC 8-K.
2. **`alerts-checkedat-heartbeat-lag`.** Fält: `state/alerts.json` `checkedAt` = 2026-10-30T22:55:04Z vid körningen 2026-11-02 14:00 UTC. Ingen monitor-körning syns i dag ännu. Före US-öppningen är det inte avgörande, men det har nu ett innehav att bevaka (CBOE, stop 316,00). **Omfång:** intradagsskyddet för CBOE och de tre villkorade planerna. Kontrollera att `monitor.yml` kör under börstid i dag.
3. **Förbörskurs ej verifierbar från rutinens körmiljö.** `query1.finance.yahoo.com` nekas genom proxyn, och websök gav inga daterade förbörsnivåer för 2026-11-02. **Omfång:** CBOE ben 1 bokförs på reguljär stängning 2026-10-30. Avviker öppningen kraftigt, särskilt vid ett gap under 316,00, ska LÄGE B i morgon pröva stoppen mot sessionens dagslägsta.
4. **Watchlist-taket – `watchlist-cap-vs-measurability-conflict`.** `config/watchlist_us.txt` bär 130 symbolrader mot riktmärket 25. Ingen rensning görs, eftersom punkt 6b och `prompts/gemensam_korning.md` (20 handelsdagars utvärderingsfönster) skyddar de flesta. Fyra nya symboler är tillagda (`AMGN`, `KMB`, `BKR`, `CNC`).

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
