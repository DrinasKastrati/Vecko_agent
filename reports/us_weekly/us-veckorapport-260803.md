# Veckorapport: US-rotation
**Vecka:** v 32 | **Datum:** 2026-08-03
**Marknadsklimat:** Riskaptiten är positiv in i veckan: S&P 500-terminer +0,5–0,6 % och Dow-terminer +547 punkter (+1 %) i pre-market måndag, samtidigt som oljan faller sedan Trump ställt in de "massiva" attackerna mot Iran och nya samtal inleds idag (TheStreet/Benzinga/CNBC, 2026-08-03). S&P 500 stängde fredag **7 489,72** och Nasdaq Composite **25 373,85** (prices.json/Yahoo chart API, marketTime 2026-07-31T21:22:12Z resp. 21:15:59Z). Marknadens tema är en skarp **tudelning inom megacap** efter rapportveckan: bevisad AI-monetisering belönas (MSFT +3,0 % fre efter Azure +43 %, AMZN +15,3 % efter AWS +37 %, GOOGL +6,7 %) medan capex-utan-payoff och svag guidning straffas (META −17,8 % på 120 dagar, AAPL −7,4 % fre). Energin fick rekordvinster (XOM+CVX 26,5 md USD i Q2, 31/7) men oljepremien tappar just nu sitt bränsle på Iran-samtalen. Veckan är makrotung: ISM Services onsdag 5/8, jobless claims torsdag 6/8 och **NFP fredag 7/8** (väntat +91k, arbetslöshet 4,3 %), plus ~20 % av S&P 500 som rapporterar (PLTR ikväll, AMD tisdag).

**Marknadsregim (promptens punkt 2b):** S&P 500 **7 489,72** ligger **över** sitt 200-dagars glidande medel **7 024,11** (beräknat ur 249 daterade stängningar i `state/price_history.json`, exkl. dagens ännu ej uppdaterade snapshot). Regimen är alltså **PÅ** → normalt urval tillåts. Till referens: MA100 7 208,51, MA50 7 471,51, MA20 7 481,15 – kursen ligger över samtliga.

---

## 0. Facit: Förra veckans val
Förra veckan (v31, `us-veckorapport-260727.md`) valdes **JPM** som enda case (45 % vikt, 55 % kassa). Positionen stoppades ut torsdag 2026-07-30 efter hökaktig Fed-hold 29/7. XOM-planen var redan avförd 27/7.

| Aktie | Entry | Exit | Utfall | Stop/Mål träffad? |
|---|---|---|---|---|
| JPM | 338,00 USD (2026-07-21) | 344,71 USD (2026-07-30) | +1,99 % | Ja – Stop @ 345,00 (bruten, verifierad stängning 344,71, dayLow 343,78) |
| XOM | – (villkor ≤142,00 aldrig triggat, planen avförd 2026-07-27) | – | – | – |

**Veckans portföljutfall (viktat):** +0,90 % (JPM +1,99 % × 45 % vikt; resterande 55 % låg i kassa och bidrog med 0 %)
**Ackumulerad avkastning sedan strategistart:** +0,89 % (en stängd affär, USD, exkl. USD/SEK-effekt)
**Portföljallokering denna vecka:** **12,5 % AMZN (ben 1) + 87,5 % indexsleeve (SPY) + 0 % kassa.** Avvikelsen från 4 × 25 % är medveten och tredelad: (1) endast ETT case klarar samtliga hårda krav (se urvalet nedan) – prompten förbjuder uttryckligen att case tvingas fram för att fylla platser; (2) AMZN köps enligt punkt 4a i två ben, så bara halva den planerade vikten (12,5 av 25 %) ligger ute i dag; (3) allt oallokerat kapital migreras till sleeven i denna körning enligt punkt 4c – boken har stått i 100 % kassa sedan 2026-07-30, vilket är precis det läge sleeven finns för att undvika.
**Lärdom:** Stoppen på JPM gjorde jobbet (+1,99 % i stället för att ta hela Fed-riskoffen), men **kassan efteråt var den dyra delen** – fyra handelsdagar utanför marknaden medan S&P steg. Det bekräftar punkt 0c: tom tid är inte neutral, den är en garanterad kostnad mot index. Veckans tillämpade lärdom är därför att sleeven fylls FÖRST och case:t sedan får ta plats ur sleeven, inte tvärtom. Tillämpade lärdomar ur `state/lessons.md`: **L-2** (varje bubblare finns i `config/watchlist_us.txt` och har verifierad kurs – JPM lades till i denna körning) och **L-3** (datadefekter förs upp som namngivna åtgärdspunkter med omfång, se sista avsnittet).

---

## Case 1: Amazon.com (AMZN / NASDAQ)

### 1. Katalysatorn
Q2-rapporten **torsdag 2026-07-30 efter stängning** krossade estimaten: koncernintäkt **200,61 md USD (+19,6 % å/å**, mot väntade 196,47), EPS 5,75, och framför allt **AWS 42,2 md USD med +37 % tillväxt – den snabbaste på 18 kvartal** – med rörelsemarginal **39,4 %** (rörelsevinst 16,6 md mot 10,2 md). AI- och chipaffärerna nådde vardera ~25 md USD i årstakt (CNBC/Amazon IR, 2026-07-30/31). Aktien steg **+15,3 % fredag 31/7**. Katalysatorn är **bekräftad och verifierad – inget rykte**. Bekräftelsen kom sedan från säljsidan: **åtta analyshus höjde riktkursen** – Goldman Sachs 335→**375**, JPMorgan 330→**365**, Benchmark 370→**400**, Rosenblatt 332→345, RBC 320→330 (Investing.com/Benzinga/TheStreet, 2026-07-31).

### 2. Investerings-tes (The Bull Case)
* AWS-återaccelerationen är veckans renaste bevis för att AI-capex omsätts i **både** molntillväxt och marginal – motsatsen till Metas capex-utan-payoff. Marknaden betalar just nu premie exakt för det beviset (jfr MSFT Azure +43 %), och AMZN är det bolag där beviset kom med störst överraskningsmoment.
* Tre ben drar samtidigt (moln, rekordannonsintäkter, detaljhandel) medan run rate på AI/chip >25 md USD vardera ger flerårig intäktssynlighet – det förlänger katalysatorns livslängd bortom en enskild rapportreaktion och gör post-earnings-drift (3–6 veckor) till en rimlig horisont.
* Tekniskt är läget rent: kursen bröt ut över hela EMA-stapeln (EMA20 245,4 / EMA50 245,4 / EMA200 236,4) med RSI 64 – stark, men **inte** överköpt (<70), och med en positiv 3–6-månaders trend bakom sig (+30,1 % på 120 dagar) enligt promptens punkt 1b.

### 3. Motargument & Risker (The Bear Case)
* **Gap-risken är den primära:** +15,3 % på en dag inbjuder till "sell the print" och gapfyllnad efter helgen. Det är hela skälet till att positionen delas i två ben (punkt 4a) i stället för att köpas fullt vid öppning.
* Rubrik-EPS blåstes upp av engångsposter – kvaliteten i vinstbeaten är lägre än den ser ut. Går fokus från AWS-driften till koncern-EPS kan multipeln komma under press.
* **NFP fredag 7/8** (väntat +91k mot 57k, arbetslöshet 4,3 %) är veckans bredmarknadsbinära: en het siffra lyfter räntorna och pressar värderingskänslig tillväxt oavsett bolagets kvartal. AWS-tillväxt på hög bas är dessutom svår att accelerera vidare, och capex-kuvertet kan återuppväcka marginaloro nästa kvartal.

### 4. Fundamental snapshot
* **Börsvärde:** ~2 921 md USD (companiesmarketcap, aug 2026) | **P/E / EV/EBITDA:** P/E ~21,8 (framåtblickande ~29,5) | **Tillväxt:** koncern +19,6 % å/å, AWS +37 % å/å, AWS-marginal 39,4 % | **Snittomsättning/dag:** ~10 md USD (~40 M aktier × ~272 USD) – långt över likviditetsgolvet 20 MUSD/dag

### 5. Teknisk setup
* **RSI(14):** 64 | **MACD:** histogram +2,86 och **stigande** (bullish) | **Kurs vs EMA20/50/200:** 271,58 över samtliga (EMA20 245,4 / EMA50 245,4 / EMA200 236,4) | **Volym vs 20d-snitt:** ej mätbar ur `price_history.json` (serien innehåller endast daterade stängningar, ingen volym) – rapportdagens rörelse +15,3 % indikerar dock kraftigt förhöjd omsättning | **Stöd:** 262,06 (fredagens dagslägsta, gapets nedre test) och 245 (EMA20/50-klustret) | **Motstånd:** 273,23 (fredagens dagshögsta / allmän ATH-zon)
* Momentum enligt punkt 1b: 20 dagar +11,2 %, 60 dagar −1,2 %, **120 dagar +30,1 %**, 60d med de 20 senaste dagarna överhoppade +10,4 % → uppgången har en längre trend bakom sig, det är alltså inte en isolerad brant vecka.

### 6. Handelsplan
| Entry | Stop-loss | Målkurs | Risk/Reward |
|---|---|---|---|
| 271,58 USD | 256,50 USD (−5,55 %) | 310,00 USD (+14,15 %) | 1:2,5 |

**Planerad vikt:** 25 % totalt, köps i två ben enligt punkt 4a – **ben 1 = 12,5 % till verifierad marknadskurs i dag**, ben 2 = 12,5 % som villkorad limit ≤ 262,00 USD (fredagens dagslägsta = testet av om gapet håller), giltig 5 handelsdagar t.o.m. 2026-08-10, därefter avförs den delen. Avvikelsen från full 25 % i dag motiveras av gap-risken efter +15,3 %: vi vill äga caset men inte betala hela positionen på rapportdagens topp.

**Krav som kontrollerats (skrivs ut enligt prompten):**
* **catalystType:** `earnings` → horisont **3–6 veckor (25 handelsdagar)**, målband 14–18 %, stop 5–6 %, inget tidsstopp. Planen ligger inom samtliga band.
* **Kostnadströskeln (punkt 2):** entry → mål = **14,15 %**, mot kravet ≥ 8 % (≈ 19× rundturskostnaden 0,75 % inkl. växlingspåslag). Uppfyllt.
* **Nåbart mål (punkt 6):** genomsnittlig dagsrörelse 60 dagar = **1,74 %** (ur `price_history.json`) → tak = 2 × 1,74 % × √25 = **17,4 %**. Målet 14,15 % ligger under taket. Uppfyllt.
* **Risk/Reward:** 14,15 / 5,55 = **2,55** ≥ 2:1. Uppfyllt.
* **Binärt event inom 2 handelsdagar:** nej – bolaget rapporterade 30/7 och nästa rapport ligger i oktober. NFP 7/8 är ett bredmarknadsevent, inte ett bolagsbinärt.
* **Ben 2 vid fyllnad:** viktat snitt blir 266,79 USD. **Stoppen lämnas då kvar på 256,50 USD och flyttas INTE ned** – promptens punkt 4a talar om proportionell justering, men LÄGE B punkt 6 förbjuder att en stop flyttas ned, och den strängare regeln vinner. Målet 310,00 ligger kvar; R/R förbättras då till ~4:1.

---

## Bubblare (watchlist inför nästa vecka)
1. **MSFT** – Näst högsta totalpoäng (7,1) och veckans starkaste fundamenta: Azure +43 % (>100 md USD för helåret, RPO +84 %) och riktkurshöjningar till 550–650 (Citi/Wells Fargo/Bernstein/Piper, 2026-07-30). Köps ändå **inte** till marknadskurs: **RSI 78 (>75 kräver exceptionell katalysator)** OCH punkt 1b:s varningsflagga – 20-dagarsuppgången (+20,2 %) är större än hela 120-dagarsrörelsen (+12,4 %), dvs. brant uppgång utan längre trend bakom sig. Kursen ligger dessutom 14 % över EMA20. Läggs som **villkorad plan** (se nedan).
2. **JPM** – Totalpoäng 6,7. Rotationen till finans är intakt och tekniken hyfsad (RSI 59, över EMA20/50/200, 60d +11,7 %), men katalysatorn (Q2-rekordet 14/7) är tre veckor gammal och inget nytt har tillkommit på fem handelsdagar. Avgörande invändning: vi stoppades ut 2026-07-30 på 344,71 och kursen står nu **högre** (351,79) – att köpa tillbaka dyrare utan ny katalysator är dålig disciplin. Läggs som **villkorad plan** på rekyl (se nedan).
3. **GOOGL** – Totalpoäng 6,2. Steg 6,7 % fredag, men drivkraften var en **konkurrent-avläsning** (Reddit −23 % när Google-hänvisningar beskrevs som "choppy") snarare än en egen katalysator; egna Q2-rapporten 22/7 sänkte aktien på capex-höjning till 205 md USD. Molnet växer 82 % med 514 md USD i backlog – bevaka en egen katalysator som ankrar caset.
4. **WFC** – Totalpoäng 5,5. Samma finansrotation som JPM men svagare bas: RSI 54, kursen bara marginellt över EMA20/50/200 och 120-dagarstrenden är negativ (−8,6 %). Naturlig ersättare om JPM-planen avförs.
5. **NVDA** – Ingen egen katalysator före rapporten sent i augusti, RSI 40 och kursen under EMA20/EMA50. Men både Azure +43 % och AWS +37 % är direkta avläsningar på AI-infrastrukturens efterfrågan – bevaka en teknisk vändning (MACD-kors + återtag av EMA20) som köpsignal.

**Förra veckans bubblare:** **HCA** – STRUKEN: kursen ligger 7 % under EMA200 med 120-dagarstrend −19,1 % och 60d-skip20 −17,4 %; ingen trendvändning har inträffat, och punkt 1b gör en nedtrend utan längre stigande bas till en varning, inte ett läge. **NOC** – STRUKEN: samma mönster (under EMA200, 120d −22,3 %, MACD-histogram fallande) och försvarssentimentet försvagas ytterligare av att Iran-samtalen återupptas idag. **WFC** – RANKAD UNDER (5,5 poäng): kvar på bubblarlistan, se punkt 4 ovan. **MS** – STRUKEN: RSI 32 och kursen under EMA20 – den svagaste av de tre bankerna, och boken behöver inte tre exponeringar mot samma riskprofil. **INTC** – STRUKEN: −26,2 % på 20 dagar och 9 % under EMA50 mitt i en pågående halvledarkorrektion; rekylen som bubblaren väntade på blev en nedtrend. **CVX** – STRUKEN: RSI 75 efter +17,1 % på 20 dagar och rekordvinsten i Q2 (31/7) är redan känd, samtidigt som oljan faller på att Iran-samtalen återupptas i dag – katalysatorn arbetar nu emot caset. Samma bedömning gäller **XOM** (RSI 73, EPS-miss trots rekordvinst, aktien −2 % i pre-market på rapportdagen).

**Scout-inflöde:** **AMZN** (rapport 260731/260801/260802/260803, tes INTAKT) – **VALD**, se Case 1. **MSFT** (rapport 260730, tes INTAKT) – RANKAD UNDER, köps inte till marknadskurs (RSI 78 + punkt 1b), lagd som villkorad plan. **AAPL** (rapport 260731/260801, tes INTAKT men negativ) – STRUKEN: scouten själv rekommenderar AVVAKTA; Services-decelerationen och marginalguidningen 47–48 % är strukturella, MACD-histogrammet är fallande och kursen ligger under EMA20. **META** (rapport 260730, tes INTAKT men negativ) – STRUKEN: RSI 21, kursen 13 % under EMA20 och 120d −17,8 %; en fallande kniv utan bekräftad botten. **COIN** (rapport 260801/260802/260803, tes bevakning) – STRUKEN: scouten kräver själv verifierad BTC/ETH-vändning före positionering, aktien ligger 33 % under EMA200 och kryptoexponering hör dessutom hemma i scouten, inte i den handlade boken. Kryptocase (BTC-USD, ETH-USD) är per fokusfilen uteslutna ur denna bok och poängsätts inte.

**Villkorade bubblar-planer:** **(1) MSFT** – köp ENDAST vid rekyl till verifierad kurs ≤ **445,00 USD**, stop **420,00** (−5,62 %), mål **500,00** (+12,36 %), R/R **1:2,2**, vikt **25 %**. Målavstånd 12,36 % ≥ 8 % (kostnadströskeln) och under taket 19,0 % (2 × 1,90 % × √25). **(2) JPM** – köp ENDAST vid rekyl till verifierad kurs ≤ **340,00 USD** (dvs. under vår utstoppningsnivå, inte över), stop **321,00** (−5,59 %), mål **378,00** (+11,18 %), R/R **1:2,0**, vikt **25 %**. Målavstånd 11,18 % ≥ 8 % och precis under taket 11,7 % (2 × 1,17 % × √25) – marginalen är tunn och planen avförs hellre än förlängs om den inte triggar inom 5 handelsdagar. Båda är fler än så inte tillåtna (max 2), båda har explicita nivåer, och monitorn larmar utan tokenkostnad när en nivå korsas.

## Veckans radar (kommande 5 handelsdagar)
* **Mån 3/8 – Palantir (PLTR) rapporterar efter stängning** – dagens binära event och första temperaturmätaren på om AI-mjukvaruvärderingar håller efter megacap-rapporterna; läses som sentimentindikator för AMZN/MSFT-benet, ingen position tas in i eventet.
* **Tis 4/8 – AMD rapporterar efter stängning (även SanDisk)** – direkt avläsning på halvledar-/AI-cykeln efter MU −16,4 % och AMD −13,7 % på 20 dagar; ett beat kan vända semis-korrektionen och aktivera bubblaren NVDA, en miss förlänger den.
* **Ons 5/8 – ISM Services PMI kl 10:00 ET (föregående 54)** – tjänsteinflationen är Feds känsligaste punkt just nu; en het siffra lyfter räntorna och pressar värderingskänslig tillväxt, dvs. direkt motvind för AMZN-benet.
* **Tors 6/8 – Initial jobless claims kl 08:30 ET (föregående 197k)** – förhandsindikator inför fredagens NFP; stigande claims skulle stötta räntesänkningsspåret och därmed AMZN.
* **Fre 7/8 – Nonfarm payrolls kl 08:30 ET (väntat +91k mot 57k, arbetslöshet 4,3 %, timlöner +0,3 %)** – veckans viktigaste makrohändelse och den enskilt största risken mot både AMZN-benet och de två villkorade planerna; en het siffra kan utlösa bredmarknads-riskoff oavsett bolagsnyheter.
* **Löpande – Iran-samtalen som inleds i dag (3/8)** – fortsatt de-eskalering håller oljan nedpressad (motvind för energi, medvind för bred riskaptit); ett sammanbrott i samtalen vänder båda och skulle återaktivera XOM/CVX som kandidater.

---

## Datakvalitet & monitor-hälsa (åtgärdspunkter till Dren, enligt L-3)

**1. LÖST sedan 2026-08-02: `state/alerts.json` har nu fältet `checkedAt`.** Värdet är `2026-08-03T10:42:04Z`, dvs. ~2,6 timmar gammalt vid körningen och därmed långt inom sextimmarsgränsen i punkt 2c2. Fältet `watched` finns också (`["SAAB-B.ST"]`) och `active` är tom. Intradagsskyddet behandlas som **närvarande**. Defekten som rapporterades 2026-08-02 är alltså åtgärdad och kräver ingen ytterligare insats.

**2. LÖST: `state/news_feed.json`, flödet `prnewswire`.** Statusfältet visar nu `"20 poster"` (filens `generatedAt` 2026-08-03T12:37:40Z) – 404:an 2026-07-31 var transient och URL:en i `config/news_feeds.txt` ska INTE bytas. Samtliga sex flöden är gröna: globenewswire 20, globenewswire-earnings 20, prnewswire 20, mfn 48, sec-8k 40, fed-press 20.

**3. NY ÅTGÄRDSPUNKT: `state/news_feed.json` har ingen historik – LÄGE A:s femdagarskrav kan inte uppfyllas ur filen.** Promptens punkt 1 g0 kräver att nyhetsflödet gås igenom för **de senaste 5 handelsdagarna**. Filen är dock ett rullande fönster: **samtliga 300 poster är från i dag**, med äldsta post `2026-08-03T06:00:00Z` och nyaste `2026-08-03T12:35:06Z` – alltså **6,5 timmars täckning, 0 poster äldre än i dag**. **Omfång:** 1 tillståndsfil, 300 av 300 poster; berör den obligatoriska nyhetsdrivna kandidatgenereringen i BÅDA böckernas LÄGE A varje måndag. **Ersättningskälla i dag:** dagens fönster användes fullt ut (kandidaterna nedan) och kompletterades med websök över de senaste fem handelsdagarna enligt punkt 6b, med publiceringsdatum kontrollerat per artikel. **Förslag till åtgärd:** låt `fetch-news.mjs` slå ihop nya poster med befintliga och gallra på ålder (t.ex. 10 handelsdagar) i stället för att skriva om filen, alternativt skriv ett dygnsarkiv. Detta är **första** gången defekten rapporteras – den är ännu inte ÅTERKOMMANDE.

**4. NY ÅTGÄRDSPUNKT (ingen åtgärd krävs, men bör vara känd): pre-/after-hours går inte att verifiera i körmiljön.** Promptens punkt 2 kräver verifierad pre-market-nivå med källa. Både `https://finance.yahoo.com/quote/<TICKER>` och `https://stockanalysis.com/stocks/<ticker>/` svarar **HTTP 403** från routinens miljö (testat på PLTR i denna körning) – exakt den nätspärr som beskrivs i CLAUDE.md avsnitt 6, vilket är själva skälet till att `prices.json` finns. **Omfång:** samtliga tickers, varje körning; påverkar enbart pre-/after-hours-fältet, inte de reguljära kurserna. **Konsekvens i dag:** de pre-market-nivåer som nämns i rapporten (S&P-terminer +0,5–0,6 %, MSFT +2,0 %) kommer från nyhetssammanfattningar och är **uttryckligen INTE prisverifierade** – inget köp-, sälj- eller stop-beslut vilar på dem. Boken hade dessutom noll öppna positioner in i körningen, så inga nivåer kunde korsas utanför reguljär session. **Förslag till åtgärd:** låt `fetch-prices.mjs` (som kör på GitHubs runner med fri nätåtkomst) även spara `preMarketPrice`/`postMarketPrice` från Yahoos chart-API.

## Bruttolista, urval och poängsättning

**Nyhetsdriven kandidatgenerering (punkt 1 g0 – gjord först, ur `state/news_feed.json`, 300 poster):** minst 5 kandidater lyftes in därifrån – **MSFT** (ArcelorMittal bygger om sin digitala ryggrad på Microsoft Cloud & AI, GlobeNewswire 2026-08-03 06:30Z → `catalystType: order`), **PLTR** (Mercury ingår partnerskap med Palantir för fabriksautomation, GlobeNewswire 2026-08-03 12:30Z → `order`; rapport samma kväll = binärt event, struken som köp), **TSN** (8-K, SEC 2026-08-03 11:37Z → `earnings`; Q3 EPS 0,99 slog nätt men omsättningen 13,868 md missade och nötköttssegmentet förlorade 138 MUSD – struken), **CHTR**, **GWW**, **AGCO**, **BAM**, **NWSA** (samtliga 8-K, SEC 2026-08-03 → `earnings`/`other` – strukna: ingen av dem finns i `state/prices.json`, så ingen verifierad kurs kan ankra ett beslut i dag), **MSTR/Strategy Inc** (8-K, SEC 2026-08-03 12:00Z → `other`; kryptoproxy, utesluten per fokusfilen), **CME** (E-nano-terminer lanseras 24/8, PR Newswire 2026-08-03 12:30Z → `other` – för långt fram och ingen verifierad kurs). **Fördelning:** 10 kandidater ur nyhetsflödet, 12 ur egen scanning/scout/bubblare = 22 i bruttolistan.

**Hård gallring – varför bara ett case:** en kandidat måste passera fem grindar (verifierbar kurs i `state/prices.json` · katalysator senaste 5 handelsdagarna · RSI ≤ 75 eller exceptionell katalysator · målavstånd ≥ 8 % OCH ≤ nåbarhetstaket · R/R ≥ 2:1). Sex av nyhetskandidaterna föll redan på grind 1 (ingen verifierad kurs går att hämta i körmiljön, se åtgärdspunkt 4), och av de kursverifierade megacaps föll MSFT på grind 3, XOM/CVX på grind 3, och AAPL/META/COIN/HCA/NOC/MS/INTC/TSLA/MU/AMD/TSM/AVGO/NVDA på teknik eller avsaknad av färsk katalysator.

| Kandidat | Katalysator (35 %) | Teknik (30 %) | Makro (15 %) | R/R (20 %) | **Totalt** | Utfall |
|---|---|---|---|---|---|---|
| AMZN | 9,0 | 8,0 | 8,0 | 8,5 | **8,45** | **VALD (25 %, ben 1 idag)** |
| MSFT | 9,0 | 5,0 | 8,0 | 6,0 | **7,05** | Villkorad plan ≤ 445,00 |
| JPM | 6,0 | 7,0 | 7,5 | 7,0 | **6,73** | Villkorad plan ≤ 340,00 |
| GOOGL | 5,0 | 6,0 | 8,0 | 7,0 | **6,15** | Bubblare |
| WFC | 5,0 | 5,0 | 7,0 | 6,0 | **5,50** | Bubblare |

Tre av fyra platser lämnas alltså tomma och kapitalet ligger i **SPY-sleeven**. Det är ett aktivt val enligt punkt 0c och 3 – i den här boken kostar en rundtur ~0,75 % (courtage + växlingspåslag, tre gånger den nordiska), så ett halvbra case är dyrare än att äga index. Regimen är PÅ, så spärren i punkt 2b är inte skälet; skälet är att kandidaterna inte höll måttet.

**Sleeve-migrering (punkt 4c):** rubriken "Kassa" stod på **100 %** när rotationen började (så sedan 2026-07-30). **87,5 % av kapitalet migrerades till SPY** i denna körning till verifierad kurs **747,03 USD** (marketTime 2026-07-31T20:00:00Z, prices.json/Yahoo chart API) och resterande 12,5 % gick till AMZN-benet. **Kassan står nu på 0 %.** Sleeve-köpet är loggat i `state/decisions.json` med `catalystType: "index"` så att det filtreras bort ur urvalsstatistiken.

**Watchlist-hygien (punkt 6 + L-2):** `config/watchlist_us.txt` gick från 31 till 29 symboler, dvs. från 26 till **24 faktiskt bevakade** exkl. infrastrukturen `^GSPC`/`^IXIC`/`^OMX`/`SPY`/`USDSEK=X` – därmed under riktmärket 25 (den låg över det förra veckan). **Tillagd:** `JPM` (ny villkorad plan – utan rad i filen kan monitorn inte larma på 340,00-nivån). **Borttagna:** `HCA`, `NOC`, `MS` – strukna som bubblare i denna rapport och varken innehav, pending eller bubblare längre. Samtliga fem bubblare i listan ovan (MSFT, JPM, GOOGL, WFC, NVDA) finns i filen och har verifierad kurs i `state/prices.json`, vilket är vad L-2 kräver.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
