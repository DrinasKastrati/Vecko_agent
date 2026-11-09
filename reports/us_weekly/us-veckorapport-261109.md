# Veckorapport: US-rotation
**Vecka:** v 46 | **Datum:** 2026-11-09
**Marknadsklimat:** Svag riskaptit och en regim på knivseggen. `^GSPC` stängde fredagen på **7 376,86 (+0,31 % fredag, vecka −2,68 %)** och `^IXIC` på **24 579,42 (+1,09 % fredag, vecka −3,37 %)** (prices.json/Yahoo chart API, marketTime 2026-11-06T21:37:09Z resp. 22:15:59Z). Torsdagen 5/11 föll S&P 500 −4,36 % i en AI-/chiputförsäljning. `^GSPC` ligger under EMA20 7 620,27 och EMA50 7 649,88, med RSI 35,1 och fallande MACD-histogram (−11,94 → −27,69 → −34,47). NFP för oktober blev +165 000 mot ~59 000 väntat, och CME FedWatch prisar en decemberhöjning till ~77 % (BLS/CNBC 2026-11-06, via scout-261109). Veckans binära makrohändelse är **KPI oktober tisdag 10/11 08:30 ET** (FactSet-konsensus 3,9 % å/å, CNBC 2026-11-06 via scout-261109). DXY och VIX finns inte i `state/prices.json` och anges därför inte med siffra. Förbörsnivåer för i dag gick inte att verifiera: websök gav inga daterade träffar för 2026-11-09. **Regimfiltret är PÅ, med minimal marginal:** ^GSPC 7 376,86 ligger **+0,71 %** över MA200 7 325,03 (200 daterade stängningar ur `state/price_history.json`, serien bär 250 punkter). Marginalen har krympt för femte veckan i rad (+7,61 % → +5,34 % → +4,56 % → +3,70 % → +0,71 %). Ett fall på ~0,7 % slår av regimen.

---

## 0. Facit: Förra veckans val
| Aktie | Entry | Exit | Utfall | Stop/Mål träffad? |
|---|---|---|---|---|
| CBOE (ben 1, 12,5 %) | $335,53 | – (behålls) | +5,29 % (353,27, 2026-11-06T21:00:00Z) | Nej – dagslägsta 346,34 > stop 316,00 |
| NUE (25 %) | $262,00 | $247,00 | −5,73 % | Stop @ $247,00 (2026-11-05, dagslägsta 245,14) |
| SPY (sleeve) | $773,26 | – (behålls) | −2,70 % i veckan (755,72 → 735,29); −4,91 % mot entry | Ingen stop/mål – sleeven |

**Veckans portföljutfall (viktat):** **−2,42 %**. Det är en daglig kedja ur `state/price_history.json` med faktiska vikter: SPY 87,5 % (62,5 % 4–5/11), CBOE 12,5 % och NUE 25 % från fyllnaden 262,00 (4/11) till exit 247,00 (5/11). Boken slog `^GSPC` (−2,68 %) med 0,26 pp. NUE-förlusten (−1,43 pp på boken) åts upp av CBOE (+0,66 pp) och av att sleeven var 25 pp mindre på torsdagens −4,41 %-dag.
**Ackumulerad avkastning sedan strategistart:** **−6,49 %**, oförändrad sedan NUE-försäljningen 2026-11-06. Sex stängda affärer i skarp drift, samtliga på stop eller punkterad tes. Siffran är exklusive USD/SEK-effekten (`USDSEK=X` 9,8912, 2026-11-07T00:06:04Z).
**Portföljallokering denna vecka:** **12,5 % CBOE / 87,5 % SPY-sleeve.** CBOE ben 2 ≤ 325,00 avförs (ej triggat inom 5 handelsdagar), så positionen förblir 12,5 %. Det är inte ett fel (punkt 4a). Den villkorade planen **U ≤ 49,00 (25 %)** står kvar till och med 2026-11-13. Fylls den blir boken 37,5 % aktier / 62,5 % sleeve. Vikten är platt 25 % per position.
**Lärdom:** Ingen ny position, och det är korrekt beteende. 12 av 19 kandidater föll på grind 2, varav 8 ligger under MA200. Marknadens bredd har kollapsat: bara rapportvinnare med kapitallätta modeller (`U`, `APP`) och defensiva/konsumentnamn steg. Veckans enda förlust (NUE) var ett case som triggade samma dag som marknaden föll 4 %. Med regimen +0,71 % över MA200 är sleeven den aktiva handlingen (punkt 0c). Tillämpade lärdomar: **L-2** (fem nya symboler i watchlistan), **L-3** (åtgärdspunkter nedan, främst att `prices.yml` inte kört i dag), **L-4** (`ABNB` vilande, se nedan), **L-5** (radarns källa och täckning), **L-6** (ingen kandidatklass struken med hänvisning till fokusfilen), **L-7** (rörelsegenomgång ur price_history) och **L-8** (`JHX` S&P MidCap 400 i bruttolistan).

---

## Case: INGA NYA VALDA DENNA VECKA

Ingen av de 19 aktiekandidaterna passerade alla fem grindar. Tre aktieplatser är tomma, och en av dem är reserverad av den villkorade planen `U`. De står kvar i SPY-sleeven tills en plan triggar (punkt 0, 0b och 0c). Det befintliga innehavet `CBOE` poängsätts inte om (punkt 0b). Tesen är intakt, och varken stop eller mål har träffats.

**CBOE – BEHÅLL, stop flyttad UPP.** Kursen är 353,27 (+5,29 % mot entry 335,53; dagsintervall 346,34–357,66; marketTime 2026-11-06T21:00:00Z, prices.json/Yahoo chart API). RSI 68,1, full EMA-stack (EMA20 326,61 > EMA50 308,08 > EMA200 291,51), MACD-histogram positivt (2,15 → 2,33 → 2,22), volym 0,68× på fredagen. Ingen rapport inom fönstret i `state/earnings_calendar.json`. Ben 2 har löpt ut, och därmed är motivet borta för att hålla stoppen under 325,00. **Stop flyttas 316,00 → 334,00** (punkt 6: upp, aldrig ned). Nivån ligger under swinglägsta 334,67 (2/11) och 335,00 (3/11), −5,45 % från kursen och därmed inom bokens 5–6 %-band. Mot entry är den −0,46 %. Målet 382,50 är oförändrat (+8,28 % från kursen).

**Bred scanning – varifrån bruttolistan kom (19 aktiekandidater, samtliga loggade i `state/decisions.json` med `mode: "A"`, plus BEHÅLL-rader för CBOE och sleeven):**
* **Ur nyhetsflödet (g0): 5.**
  * `JHX` – "James Hardie Industries Set to Join S&P MidCap 400" (PR Newswire 2026-11-06). Det är en `index`-katalysator enligt L-8, men ikraftträdandedatumet är inte verifierat.
  * `KVUE` (8-K 2026-11-04), `AVTR` (8-K 2026-11-03), `WAB` (8-K 2026-11-03) och `ASTS` (8-K 2026-11-06). Innehållet i 8-K-rubrikerna är **inte verifierat**.
  * Samtliga fem saknar kurs i `state/prices.json` och läggs i `config/watchlist_us.txt` (punkt 6b, L-2).
  * Flödets övriga 8-K-rubriker 2–6/11 gällde nästan uteslutande småbolag utanför likviditetsgolvet. PR Newswire-flödet bestod till största delen av stämningsannonser och pressreleaser utan börsnotering.
  * `state/news_feed.json` (`generatedAt` 2026-11-07T00:57:38Z) täcker **10 av 10 handelsdagar** (`tradingDaysCovered` 10, `missingDays` tomt, äldsta 2026-10-26). Filen är **äldre än 24 timmar**, eftersom `news.yml` inte har kört i dag (åtgärdspunkt 1). Websök gav inga daterade bolagsnyheter för helgen 7–8/11.
* **Ur scout (g): 5.** `APP` och `COHR` (rapport-261105), `NET` (rapport-261106) samt `ABNB` och `VST` (rapport-261107). `U` (rapport-261106) är redan en aktiv villkorad plan och poängsätts inte om. Rapport-261108 och -261109 hade inga case.
* **Förra veckans bubblare (h): 4.** `CVX`, `DVN`, `S` och `RHI`.
* **Rörelsegenomgången (L-7): 5.** `RIOT`, `NG`, `DAL`, `AMZN` och `LOW`.

**Funneln:**
* **Grind 1 (verifierad kurs) fäller 6:** `ABNB`, `JHX`, `KVUE`, `AVTR`, `WAB` och `ASTS`. De loggas med `price: null`.
* **Grind 2 (teknik) fäller 12.**
  * Kurs ≤ MA200: `APP` (391,22 mot 409,30, dessutom RSI 76,3), `COHR` (192,81 mot 296,42), `VST` (124,80 mot 152,65), `DVN` (42,21 mot 46,17), `RIOT` (16,71 mot 19,33), `NG` (6,40 mot 8,14) och `LOW` (224,55 mot 224,64).
  * Under EMA20 med fallande eller negativt histogram: `NET` (268,75 mot EMA20 297,02, histogram −6,15), `CVX` (212,61 mot 221,51; −2,03 → −2,50) och `S` (21,77 mot 23,52).
  * Volym < 1,5×: `RHI` 0,62× med fallande histogram, och `AMZN` 0,87×. `AMZN`:s Q3 ligger dessutom mer än 5 handelsdagar bak (grind 3).
* **Grind 3 (katalysator) / grind 2:** `DAL` faller här, se nedan.

Volymkvoten är räknad ur `state/volume_history.json` som senaste punkten (2026-11-06) delad med snittet av de 20 föregående. Teknik och MA200 är räknade på råserien i `state/price_history.json` (250 punkter per symbol, sista punkt 2026-11-06).

### De som kom längst – och exakt varför de föll
1. **`DAL` – 87,20 USD** (marketTime 2026-11-06T21:00:02Z, prices.json/Yahoo chart API). Den renaste trendbilden i listan: EMA20 82,20 > EMA50 81,82 > EMA200 77,65, kurs över MA200 77,10, RSI 60,5, histogram positivt (1,08 → 1,03 → 1,06), veckan +8,80 % och 6 månader +18,9 %. **Fällt av grind 3:** ingen daterad bolagskatalysator inom 5 handelsdagar hittades i nyhetsflödet eller i websök. **Grind 2 delvis:** volym 0,88×, 605 MUSD/dag.
2. **`AMZN` – 259,30 USD** (2026-11-06T21:00:01Z). Har tagit sig tillbaka över MA200 243,94, EMA20 254,09 och EMA50 254,07, med stigande histogram (0,38 → 0,83 → 1,02) och RSI 54,2. **Fällt av grind 2:** volym 0,87×. **Grind 3:** Q3-rapporten (scout-261030) ligger nu mer än 5 handelsdagar bak.
3. **`NET` – 268,75 USD** (2026-11-06T21:02:54Z). Den ligger över MA200 250,24 efter Q3-överraskningen 5/11 (intäkt +39 %, guide höjd), med volym 2,63×. **Fällt av grind 2:** under EMA20 297,02 och EMA50 306,68, MACD-histogram negativt (−6,17 → −7,40 → −6,15), RSI 39,4. Gapet bleknade från ~+15 % förbörs till +9,9 % i stängning, så reaktionen bekräftade inte.

**Scout-kandidater i `state/scout_candidates.json`:** `261107-ABNB` → **rejected** ("kurs ej verifierbar"). `261107-VST` → **rejected** (grind 2: kurs ≤ MA200). Båda har `decidedBy` satt till denna rapport. Inga poster med `book: "us"` står kvar som `new`. **L-4:** `ABNB` avvisas på ett TILLFÄLLIGT datavillkor: symbolen ligger i watchlistan sedan 2026-11-08, men `prices.yml` har inte kört sedan dess. Avvisningen är därför **vilande**, och nästa US-körning ska pröva om den mot alla grindar så snart kursen och serien finns, inom `expiresAt` 2026-11-13. Utan kurs görs ingen bedömning av kursen eller tekniken. `VST` är slutligt avvisad.

**Villkorade planer, prövade mot verifierad kurs:**
* **`U` ≤ 49,00 (25 %)** – **EJ TRIGGAD.** Fredagens dagslägsta var **49,07**, 0,14 % över villkoret, med stängning 51,49 (marketTime 2026-11-06T21:00:02Z, prices.json/Yahoo chart API). Planen gäller till och med 2026-11-13. Filtren håller fortfarande: regim PÅ, kurs 62 % över MA200 31,70, EMA20 > EMA50 > EMA200, histogram stigande (0,57 → 1,07), volym 2,05×, 593 MUSD/dag och ingen rapport i fönstret. RSI 72,1 ligger under spärren 75. Faller ^GSPC under MA200 innan planen triggar gäller regimspärren och planen avförs. Planen ligger kvar i den första Pending-tabellen så att `alerts.mjs` bevakar den.
* **`CBOE` ben 2 ≤ 325,00** – **AVFÖRD.** Den triggade inte inom sina 5 handelsdagar (sista session 2026-11-06, dagslägsta 346,34, 6,57 % över villkoret). Delen stannar i sleeven.
* Förbörskurser kunde inte verifieras för något av namnen. Planerna gäller mot reguljär session.

---

## Bubblare (watchlist inför nästa vecka)
1. **DAL** – 87,20 USD (2026-11-06T21:00:02Z). Full EMA-stack och lång trend, men saknar både katalysator och volym. Blir prövbar om en daterad bolagsnyhet kommer med volym ≥ 1,5×.
2. **AMZN** – 259,30 USD (2026-11-06T21:00:01Z). Tillbaka över MA200 och EMA50 med stigande histogram. Behöver volym och en färsk katalysator.
3. **NET** – 268,75 USD (2026-11-06T21:02:54Z). Bekräftad rapportöverraskning och kurs över MA200. Blir prövbar om kursen återtar EMA20 (~297) och histogrammet vänder upp.
4. **ABNB** – **KURS EJ VERIFIERAD.** Bekräftad Q3 (5/11 AMC, EPS 3,16 mot ~2,85, återköp 12 mdr USD; scout-261107). Prövas om enligt L-4 när `prices.yml` levererat kurs och serie, senast 2026-11-13.

Samtliga fyra finns i `config/watchlist_us.txt` (L-2). DAL, AMZN och NET har kurs i `state/prices.json`; ABNB saknar den, se åtgärdspunkt 1.

**Förra veckans bubblare:** **CVX** – STRUKEN (grind 2: under EMA20, histogram fallande, veckan −9,73 %). **DVN** – STRUKEN (grind 2: under MA200 efter rapporten 5/11, veckan −19,06 %, RSI 27,8). **S** – STRUKEN (grind 2: under EMA20, volym 0,71×; grind 3: ingen katalysator). **RHI** – STRUKEN (grind 2: volym 0,62×, histogram fallande; grind 3: ingen katalysator).
**Scout-inflöde:** (de 5 senaste: rapport-261105 till -261109; de två sista hade inga case.) **APP** (261105) – STRUKEN (grind 2: under MA200 409,30, RSI 76,3). **COHR** (261105) – STRUKEN (grind 2: under MA200 296,42). **NET** (261106) – RANKAD UNDER (grind 2: under EMA20/EMA50), bubblare 3. **U** (261106) – redan promotad 2026-11-06, villkorad plan ≤ 49,00 aktiv. **ABNB** (261107) – RANKAD UNDER (grind 1, vilande enligt L-4), bubblare 4. **VST** (261107) – STRUKEN (grind 2: 18,2 % under MA200).
**Villkorade bubblar-planer:** **Inga.** Ingen bubblare klarar samtliga grindar. Den aktiva villkorade planen (`U`) är en scoutpromotion, inte en bubblar-plan.

**Rörelsegenomgång (L-7):** rangordningen är gjord ur `state/price_history.json` över **124 amerikanska symboler** (exklusive sleeven SPY; `WBD` saknar daterad basstängning) med daterad stängning både 2026-10-30 (bas) och 2026-11-06 (mätdag). `state/movers.json` täcker bara nordiska symboler och används inte här.
* **Topp:** `APP` +71,21 %, `U` +36,58 %, `RIOT` +30,44 %, `NG` +10,15 %, `DAL` +8,80 %, `AMZN` +7,88 %, `LOW` +7,40 %, `TLX` +5,82 %, `ACHR` +5,71 % och `CBOE` +5,29 %.
* **Botten:** `AESI` −41,32 %, `MRVL` −28,11 %, `RIG` −24,50 %, `CIEN` −24,11 %, `MU` −22,01 %, `VRT` −21,35 %, `CRGY` −20,99 %, `TEAM` −19,84 %, `CLSK` −19,69 % och `DVN` −19,06 %.

De sju största finns i bruttolistan, är en aktiv plan eller är innehavet. `TLX` togs inte in: 3,3 MUSD/dag ligger under likviditetsgolvet 20 MUSD. `ACHR` rapporterar i dag (binärt event, punkt 2e) och ligger under MA200 5,70. Resten av den amerikanska marknaden är **OKONTROLLERAD**.

## Veckans radar (kommande 5 handelsdagar)
* **Måndag 9/11** – Inga större US-makrodata. `ACHR`, `CEG`, `KKR` och `MARA` rapporterar enligt `state/earnings_calendar.json`. Enligt CNBC 2026-11-06 (via scout-261109) rapporterar även `RKLB` och `OXY`. Inga innehav berörs.
* **Tisdag 10/11** – **KPI oktober 08:30 ET (14:30 CET), konsensus 3,9 % å/å mot föregående 3,7 %.** Det är sista KPI före Fed-mötet 8–9 december. Ett hett utfall låser fast den prisade decemberhöjningen och kan ensamt slå av regimfiltret (+0,71 % marginal). Samma dag NFIB samt `CRWV` och `RGTI` (CNBC 2026-11-06 via scout-261109).
* **Onsdag 11/11** – Veterans Day. Obligationsmarknaden är stängd och aktiemarknaden öppen.
* **Torsdag 12/11** – jobless claims. `AMAT` rapporterar (`state/earnings_calendar.json`), liksom `CSCO` och `NBIS` (CNBC 2026-11-06). Det är AI-hårdvarans nästa test, och `NVDA` följer 17/11.
* **Fredag 13/11** – PPI oktober (Schaeffer's 2026-11-05 via scout-261109). Sista dagen för `U`-planen och för `ABNB`-kandidatens `expiresAt`. Ingen rapport för `CBOE` eller `U` finns i fönstret.
* **Källa och täckning (L-5):**
  * Rapportdatumen kommer ur `state/earnings_calendar.json` (`generatedAt` 2026-11-07T00:53:57Z, `errors` tomt). Den ser bara symboler som `prices.yml` hämtar, så resten av US-universumet är **OKONTROLLERAT**. Kalendern har inte uppdaterats i dag.
  * Makrodatumen kommer ur websök via scout-261109, inte ur repot.
  * Rapportförbudet (punkt 2e) gäller samtliga namn ovan.
* **Indexöversyner (L-8):** `state/news_feed.json` gav en träff 2026-11-02 – 2026-11-07: "James Hardie Industries Set to Join S&P MidCap 400" (PR Newswire 2026-11-06). Den finns i bruttolistan som `JHX` (`catalystType: "index"`), men faller på grind 1 och har inget verifierat ikraftträdandedatum. Ingen fil i repot räknar upp S&P-förändringar, så den otäckta delen är **OKONTROLLERAD**.
* **Sektorer:**
  * **Medvind:** kapitallätta rapportvinnare (`U`, `APP`), finansiell infrastruktur (`CBOE`) samt konsument/detaljhandel och flyg (`LOW`, `HD`, `COST` och `DAL` i topp).
  * **Motvind:** AI-halvledare och nätverk (`MRVL` −28 %, `CIEN` −24 %, `MU` −22 %, `VRT` −21 %), energi och oljeservice (`AESI`, `RIG`, `CRGY`, `DVN`), kryptomining (`CLSK`) samt räntekänslig tillväxt inför KPI och en möjlig decemberhöjning.

## Åtgärdspunkter till Dren (L-3)
1. **`scheduled-actions-not-firing` – ÅTERKOMMANDE, nu ett helt dygn.**
   * Fält: `state/prices.json` `generatedAt` = 2026-11-07T00:55:35Z och `state/news_feed.json` `generatedAt` = 2026-11-07T00:57:38Z vid körningen 2026-11-09 13:50 UTC.
   * Senaste `prices.yml`-körning är run 881, 2026-11-07 00:52 UTC (GitHub Actions API). **Ingen schemalagd körning har startat på måndagen**, varken 05:09-, 06:09- eller halvtimmescronen. `news.yml` och `monitor.yml` har inte heller committat något i dag.
   * **Omfång:**
     * Samtliga 308 symboler står på fredagens stängning.
     * `ABNB` (scoutkandidat) och fem L-5-tillägg från 2026-11-08 har ingen kurs.
     * Rapportkalendern, nyhetsflödet och intradagsskyddet för `CBOE` (stop 334,00) och `U`-planen saknas tills Actions kör.
   * **Ersättningskälla:** fredagens reguljära stängning (senaste handelsdagen) för alla beslut. Inget kursbaserat beslut på `ABNB`.
   * **Åtgärd:** kör "Hämta kurser" via `workflow_dispatch` och kontrollera att `monitor.yml` startar under börstid.
2. **`news-feed-globenewswire-http-403` – ÅTERKOMMANDE.** Fält: `state/news_feed.json` `feeds`:
   * `globenewswire` = "HTTP 403 – båda försöken (0.0 s)"
   * `globenewswire-earnings` = "HTTP 403 – båda försöken (0.0 s)"

   **Omfång:** 2 av 6 flöden, inklusive den enda dedikerade källan för rapportöverraskningar. **Ersättningskälla:** scout-rapporternas websök och SEC 8-K.
3. **`alerts-checkedat-heartbeat-lag`.** Fält: `state/alerts.json` `checkedAt` = 2026-11-06T20:41:39Z. Inget hjärtslag sedan fredag kväll. Före US-öppningen är det inte avgörande, men samma orsak som punkt 1 gör att monitorn sannolikt inte kör i dag heller. **Omfång:** intradagsskyddet för CBOE (stop 334,00) och U-planen (≤ 49,00). Stop och villkor är kontrollerade manuellt mot fredagens dagsintervall.
4. **Förbörskurs ej verifierbar från rutinens körmiljö.** `prices.json` saknar utökade kurser för i dag, och websök gav inga daterade förbörsnivåer för 2026-11-09. **Omfång:** CBOE och U-planen. LÄGE B i morgon ska pröva stoppen och villkoret mot måndagens dagsintervall.
5. **Watchlist-taket – `watchlist-cap-vs-measurability-conflict`.** `config/watchlist_us.txt` bär långt fler symbolrader än riktmärket 25. Ingen rensning görs, eftersom punkt 6b och `prompts/gemensam_korning.md` (20 handelsdagars utvärderingsfönster) skyddar de flesta. Fem nya symboler är tillagda (`JHX`, `KVUE`, `AVTR`, `WAB`, `ASTS`).

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
