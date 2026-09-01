# Veckorapport: US-rotation
**Vecka:** v 36 (EXTRA rotation, tisdag – tar igen två uteblivna måndagar) | **Datum:** 2026-09-01
**Marknadsklimat:** S&P 500 (`^GSPC`) stängde måndag **7 686,14** (`state/prices.json`, source "Yahoo Finance (chart API)", marketTime 2026-08-31T21:09:33Z), **−0,33 %** mot föregående stängning 7 711,76. Nasdaq (`^IXIC`) **26 370,889** (marketTime 2026-08-31T21:15:59Z), **−0,12 %**. **Regimfiltret är PÅ:** 7 686,14 ligger **7,91 %** över MA200 **7 122,89**, räknat på 250 daterade stängningar i `state/price_history.json`; Nasdaq ligger 8,39 % över sin MA200. Nya positioner är alltså tillåtna enligt punkt 2b, och regimen är inte spärren. Sektorbilden i veckan är **halvledare i konsolidering efter NVIDIA-rapporten 26/8** – NVDA själv ligger −0,3 % från fredagen och hela AI-kohorten (AMD, AVGO, TSM, MRVL, AMAT) handlas under sina EMA20. Motvind i **detaljhandel och konsument** (WMT RSI 38,7, HD 40,6, LOW 37,9, ROST 38,5 – samtliga under alla tre EMA), medvind i **energi och bank** rent tekniskt (XOM, CVX, JPM, WFC alla över sina tre EMA) men utan färska katalysatorer. Två binära händelser dominerar radarn: **Broadcoms rapport 2026-09-02** och **NFP fredag 2026-09-04**.

**VARFÖR DENNA RAPPORT FINNS OCH VAD DEN INTE ÄR.** US-rotationens LÄGE A kördes **varken 2026-08-24 eller 2026-08-31**: `reports/us_weekly/` slutade på `us-veckorapport-260817.md` och `state/decisions.json` hade noll rader med `book: "us"` för båda datumen. US-boken saknade därmed köpväg i **tio handelsdagar** utan att något larmade. Två oberoende luckor i watchdogen gjorde det strukturellt osynligt: `checkGrossList` hoppar medvetet över en bok med NOLL rader, och färskhetskontrollen grindar på den NORDISKA rapportens datum. Båda är åtgärdade 2026-08-31 (`checkUsRotation`, verifierad mot repots faktiska data). **Denna körning tar igen rotationen, men den kan inte rekonstruera de två veckor som passerade** – facit nedan mäter perioden 2026-08-17 → 2026-08-31 i klump, och de beslut som INTE fattades under tiden går inte att logga i efterhand. Det är kostnaden för defekten, och den ska stå utskriven.

---

## 0. Facit: Förra veckans val
| Aktie | Entry | Exit | Utfall | Stop/Mål träffad? |
|---|---|---|---|---|
| SPY (sleeve) | 773,26 | – (öppen) | **−0,80 %** | Nej – sleeven har varken stop eller mål |
| NVDA | 220,48 | 211,00 | **−4,30 %** | **Stop @ 211,00** (stängd 2026-08-25) |
| MU | 950,00 | 895,00 | **−5,79 %** | **Stop @ 895,00** (stängd 2026-08-25) |
| XOM | 165,56 | 160,64 | **−2,97 %** | Nej – katalysator punkterad (stängd 2026-08-26) |

**Veckans portföljutfall (viktat):** **−0,80 %** över perioden 2026-08-17 → 2026-08-31, alltså **tio handelsdagar och inte en vecka**. Boken låg i 100 % SPY-sleeve från och med 2026-08-26 och utfallet är sleevens rena kursutveckling: 773,26 → **767,05 USD** (`state/prices.json`, marketTime 2026-08-31T20:00:00Z). ^GSPC över samma period gick från 7 703,72 till 7 686,14, alltså **−0,23 %** – boken låg 0,57 procentenheter EFTER index, vilket är sleevens avvikelse mot ^GSPC plus att den köptes 2026-08-10 och alltså bär en längre period än jämförelsen.

**Ackumulerad avkastning sedan strategistart:** **−2,87 %** – oförändrad. Tre stängda affärer i skarp drift: NVDA −4,30 % på vikt 25,0 %, MU −5,79 % på vikt 25,0 % och XOM −2,97 % på vikt 12,5 %. **Två av tre stoppades ut, ingen nådde mål.** Ingen affär stängdes i denna körning.

**Portföljallokering denna vecka:** **100 % indexsleeve (SPY) + 0 % aktier + 0 % kassa**, oförändrat. **Fyra av fyra platser står tomma** och ligger i sleeven. Kapitalet är kvar i marknaden, aldrig på konto.

**Lärdom:** Veckans mätning är att **grind 1 fäller NOLL av 32 kandidater – för första gången i US-boken – och att funneln därmed stannar helt på grind 2 och 3, alltså på omdöme.** Det är samma effekt som i den nordiska boken samma dag och kommer ur samma kodfix: `state/prices.json` bär nu 198 symboler mot 123, och samtliga 32 bruttokandidater har verifierad kurs, 250 daterade stängningar och ≥ 21 volympunkter. **Den obekväma halvan:** 30 av 32 faller på grind 2, och mönstret är inte slumpmässigt. Hela AI-kohorten – NVDA, AMD, AVGO, TSM, MRVL, AMAT, ANET, SMCI – ligger med MACD-linjen UNDER signallinjen samtidigt, och volymkvoten är under 1,5× för **28 av 32** (bara CVX 1,54×, DE 1,64×, WFC 1,69× och TSLA 1,84× klarar kravet). Marknaden konsoliderar efter NVIDIA-rapporten, och en konsolidering utan volym är precis vad grind 2 är byggd för att avvisa. **Att inte köpa den här veckan är alltså inte ett datafel utan ett resultat** – till skillnad från v34, då 78 % föll på kursförsörjning. Tillämpade lärdomar: **L-2** (samtliga bubblare har verifierad kurs och ligger i `config/watchlist_us.txt`), **L-3** (fyra datadefekter eskaleras som namngivna åtgärdspunkter med kvantifierat omfång), **L-5** (varje "inga fler …" bär källa och täckningsangivelse), **L-6** (ingen kandidat stryks med hänvisning till en fokus- eller universumfil – kryptoproxyerna MSTR, COIN, MARA och RIOT är poängsatta som NASDAQ/NYSE-noterade aktier och avvisade på namngivna spärrar, precis som `us-daglig-260820` gjorde efter att `us-veckorapport-260817` läst filen strängare än den säger).

---

### Bred scanning – varifrån bruttolistan kom
**32 kandidater** poängsattes: **6 ur `state/news_feed.json`** (punkt g0 – kravet är minst 5), **5 ur förra US-veckorapportens bubblarlista** (punkt h, obligatoriskt återbruk), **0 ur scout-flödet** (punkt g – se nedan) och **21 ur egen teknisk scanning och `config/watchlist_us.txt`**. Samtliga 32 är loggade i `state/decisions.json` med den NAMNGIVNA spärren i `reason`, plus en BEHÅLL-rad för sleeven – **33 rader totalt**.

**Nyhetsfönstrets faktiska täckning:** `window.tradingDaysCovered` = **10 av 10 handelsdagar** (`oldest` 2026-08-17, `newest` 2026-08-31, `missingDays` tomt, 1 097 poster). Filen är 4,5 timmar gammal (`generatedAt` 2026-08-31T19:31:22Z) och alltså inom g0:s 24-timmarsgräns. **Samtliga sex flöden svarar normalt**; `prnewswire`, som var dött med HTTP 404 i den nordiska rapporten 260831, bär nu "20 poster".

**En observation om `globenewswire-earnings` som hör hemma här (NY).** Flödet är enligt punkt g0 det som "fångar rapportöverraskningar". Mätt i femdagarsfönstret bär det **43 poster, och i praktiken inga amerikanska rapporter alls** – innehållet är nordiska insynsanmälningar (Danske Bank, SalMar, Mowi, Zealand Pharma, Siili Solutions, SATO m.fl.). De amerikanska rapporterna i fönstret hittades i stället i `prnewswire`/`globenewswire` (NVIDIA 26/8, HP Inc 26/8, Zoom 25/8). Flödet är alltså inte dött – det bär bara något annat än namnet lovar, och punkt g0:s formulering om att det fångar rapportöverraskningar stämmer inte för US-boken. Åtgärdspunkt 2.

**Scout-inflöde (punkt g, obligatoriskt):** genomgång av de **fem senaste** scout-rapporterna (`rapport-260827` t.o.m. `-260831`). **Noll US-aktiecase med tes INTAKT.** Samtliga fem skriver uttryckligen "Inget individuellt köpcase forceras i dag" med utskrivna skäl: NVDA är den enda färska bekräftade storbolagskatalysatorn men avvisades redan som kandidat `260827-NVDA` på omdömesskäl; MRVL och IREN rapporterade 27/8 AMC men **såldes av** (−10,28 % respektive −12,53 % i fredagens reguljära session), och en bekräftad rapport med säljreaktion är ingen bull-katalysator; AVGO (2/9) och FOMC (16/9) är kommande binära event som aldrig köps in i. **Detta är ett dokumenterat och motiverat utfall, inte en tom kanal** – leta ingen bugg i en tom scoutlista.

**`state/scout_candidates.json`:** 21 poster, **noll med `status: "new"`**. Inget avgörande åligger US-boken denna körning, och L-4-kontrollen är tom: ingen post ligger avvisad på ett tillfälligt datavillkor inom sin `expiresAt`.

**`state/earnings_calendar.json`:** `generatedAt` 2026-09-01T00:0x, alltså färsk och omgenererad i denna körning. `upcoming` bär **en enda post: AVGO 2026-09-02** (`isEstimate: false`, konsensus EPS 3,238 USD, omsättning 29,43 mdr USD) – en bekräftad binär händelse **1 handelsdag bort**, vilket punkt 2e förbjuder köp in i. **`errors` är TOM för första gången sedan v34** (åtgärdspunkt 5 i den nordiska rapporten 260901 är därmed löst: de fyra symbolerna KABE-B.ST, MGN.OL, PARKEN.CO och STAR-B.ST är flyttade till den nya hinken `noCoverage`, som skiljer Yahoos täckningslucka från ett verkligt hämtningsfel).

**`state/alerts.json`:** `active` är tom och `checkedAt` är **2026-08-31T20:40:08Z**, alltså ~3,5 timmar gammalt och inom punkt 2c2:s ~6-timmarsgräns. **Intradagsskyddet är NÄRVARANDE.** Boken har noll positioner med nivåer och noll öppna pending-rader, så konsekvensen är ändå noll denna körning.

**Teknisk filtrering – vad som faktiskt gick att mäta.** RSI(14), MACD(12,26,9), EMA20/50/200 samt 5-dagars- och sexmånadersmomentum är räknade med FAKTISKA värden ur `state/price_history.json` för **samtliga 30 bruttokandidater**; serierna bär 250 punkter var. **Volymen är helt mätbar:** `state/volume_history.json` har ≥ 21 punkter för samtliga 32, och omsättningen i MUSD/dag är RÄKNAD (20-dagarssnittet av volym × kurs / 1 000 000), inte bedömd på storleksklass. **En datadefekt hittades och åtgärdades i samma session:** 17 kursserier och 18 volymserier bar hål mitt i sitt eget spann – dagar som saknades i en serie som ändå var 250 punkter lång, och därmed permanent utom räckhåll för `--missing=200`, som bara plockar symboler som är för KORTA. PAYC saknade 2026-08-11 och ligger i denna bruttolista. Luckorna är fyllda och `watchdog.mjs:checkSeriesGaps` gör dem hörbara framöver. Se åtgärdspunkt 1.

---

## Case: INGA VALDA DENNA VECKA

**Ingen av de 32 bruttokandidaterna klarade samtliga fem grindar, och därför öppnas ingen ny position.** Det är ett korrekt utfall enligt punkt 3 ("Tvinga ALDRIG fram case: färre än 4 godkända ⇒ fyll de platser som håller och lägg resten i indexsleeven") och enligt punkt 0 i NIVÅER & OMSÄTTNING, som är hårdare i US-boken än i den nordiska: **rundturskostnaden är 0,75 % med växlingspåslaget, alltså tre gånger den nordiska, och varje undviken affär är därför värd tre gånger så mycket här.** Regimfiltret var **inte** spärren – det är PÅ med 7,91 % marginal, och boken hade fyra lediga platser.

**Så här föll de 32, per grind:**

| Grind | Vad den prövar | Antal | Andel |
|---|---|---|---|
| 1 – ingen verifierbar kurs | **0** | 0 % |
| 2 – teknik / volym / likviditetsgolv | **30** | 94 % |
| 3 – ingen färsk namngiven katalysator | **2** | 6 % |
| 4 – R/R under 2:1 eller mål under kostnadströskeln 8 % | **0** | 0 % |
| 5 – nåbarhetstaket | **0** | 0 % |

**Jämförelsen bakåt, och en varning om hur den ska läsas.** v34 (260817): 6 / 12 / 6 / 2 / 1 av 27. v36-extra (i dag): **0** / 30 / 2 / 0 / 0 av 32. **Grind 1 har gått från 6 till noll**, vilket är robust – en kandidat har antingen verifierad kurs eller inte, och klassificeringen kan inte glida. **Fördelningen mellan grind 2 och 3 är däremot INTE jämförbar mellan rapporter**, eftersom tilldelningsregeln skiljer sig: v34 angav ibland den grind kandidaten primärt föll på ("Grind 3+2"), medan denna rapport konsekvent anger den FÖRSTA grinden i ordning 1→2→3→4→5. Att grind 2 växer från 12 till 30 är därför till en del min strängare tilldelning och inte enbart en förändring i marknaden. Samma anmärkning gäller den nordiska rapporten samma dag, och tilldelningsregeln bör fastställas i prompten så att talen blir jämförbara framåt. Åtgärdspunkt 4.

### De två som kom längst – och exakt varför de föll

**1. Tesla (TSLA) – enda kandidaten som klarar HELA teknikfiltret, fälld på att katalysatorn inte är en katalysator.**
Tekniken är listans enda kompletta: **RSI 58,7** mitt i bandet, MACD-linjen över signallinjen, kursen **367,95 > EMA20 > EMA50** (under EMA200, vilket punkt 2 tillåter – "helst EMA20>EMA50>EMA200"), **volymkvot 1,84×** mot kravet 1,5× och omsättning **12 203 MUSD/dag**, alltså 610× likviditetsgolvet. Nivåerna finns: stöd 345,82 (−6,01 %) och motstånd upp till 405,05 (+10,08 %), och nåbarhetstaket är 23,44 % vid 20 handelsdagar – gott om marginal.
**Den föll på grind 3, och skälet ska skrivas ut noggrant.** Aktien steg **+5,4 % på fem dagar**, men drivkraften är enligt marknadsrapporteringen 2026-08-31 ett besked från **Elon Musk om SpaceX egen tillverkning av gasturbiner** – SpaceX är ett annat, privat bolag som Tesla inte äger. Övriga poster i fönstret är att **Optimus gått i produktion i Fremont (27/8)**, en produktionsmilstolpe som inte tillhör någon av punkt 1a:s kategorier, samt ett **annonserat Semi-event 24/9**, alltså ett framtida schemalagt event och inte en inträffad händelse. Åt andra hållet ligger **FSD-säkerhetskritik (28/8)**. En kursrörelse driven av ett systerbolags besked är precis den "hype utan fundamental katalysator" punkt 1c diskvalificerar. **Andra ledet:** sexmånadersmomentum är **−8,8 %**, alltså en brant uppgång på fem dagar utan längre trend bakom sig – exakt varningsmönstret i punkt 1b.

**2. Deere (DE) – näst bäst teknik, fälld på att målet inte finns i serien.**
**RSI 61,6**, MACD-linjen över signalen, kursen **654,91 > EMA20 > EMA50 > EMA200** i ideal ordning, **volymkvot 1,64×** och omsättning 710 MUSD/dag. Den är listans enda kandidat utöver TSLA med full EMA-stack OCH volym över kravet.
**Den föll på grind 3:** noll träffar för Deere i nyhetsfönstrets 1 097 poster under de fem senaste handelsdagarna. **Grind 4 hade fällt den i andra ledet, och det är den hårdare spärren:** kostnadströskeln i US-boken är **8 %** (≥ 10× rundturskostnaden 0,75 %), vilket kräver ett mål på **707,30 USD**. Det ligger över hela 250-dagarsserien (högsta **662,49**), och det enda motståndet ovanför kursen är 662,49 på **+1,16 %**. Ett case vars kostnadströskel inte ryms inom aktiens egen prövade struktur går inte att sätta nivåer på.

---

## Bubblare (watchlist inför nästa vecka)
1. **Tesla (TSLA)** – 367,95 USD (`state/prices.json`, marketTime 2026-08-31T20:00:00Z). **Kom närmast av alla 32.** Enda kandidaten med komplett teknikfilter: RSI 58,7, MACD bullish, volymkvot 1,84×, 12 203 MUSD/dag. Blir köpbar vid en katalysator ur punkt 1a – en bekräftad leveranssiffra, ett större kontrakt eller ett regulatoriskt besked om FSD/robotaxi. **Varning:** mom6m −8,8 %, och den nuvarande uppgången vilar på ett SpaceX-besked, inte på Tesla.
2. **Deere (DE)** – 654,91 USD (marketTime 2026-08-31T20:00:00Z). Näst bäst teknik med full EMA-stack och volymkvot 1,64×. Blir aktuell först om kursen bryter 662,49 och därmed öppnar strukturell plats för kostnadströskelns 8 % – i dag finns målet inte i 250-dagarsserien. Rapport väntas inte i fönstret.
3. **Micron (MU)** – 958,73 USD (marketTime 2026-08-31T20:00:00Z). Full EMA-stack, RSI 53,8, MACD bullish och **29 045 MUSD/dag** i omsättning, men **volymkvot 0,74×**. Bolaget har bekräftat att **Q4 rapporteras 2026-09-30** (GlobeNewswire 2026-08-26) – utanför fönstret, alltså varken katalysator eller binär spärr just nu. Stoppades ut ur boken 2026-08-25 på −5,79 %; ett återinträde kräver ny katalysator OCH volym, inte bara att kursen kommit tillbaka.
4. **NVIDIA (NVDA)** – 220,78 USD (marketTime 2026-08-31T20:00:00Z). Bär veckans starkaste bekräftade katalysator: **AWS och NVIDIA ska leverera 2 miljoner ytterligare GPU:er** (GlobeNewswire/PR Newswire 2026-08-26 21:05 UTC), utöver Q2 FY2027-rapporten 26/8. Full EMA-stack. **Fälld på grind 2:** MACD-linjen ligger under signallinjen och volymkvoten är 0,97×. **Andra ledet är hårdare:** kostnadströskelns 8 % kräver 238,44 USD mot 250-dagarshögsta **235,74** – målet finns inte i serien. Stoppades ut 2026-08-25 på −4,30 %.
5. **Palantir (PLTR)** – 186,38 USD (marketTime 2026-08-31T20:00:00Z). Kvar från 260817-listan. Full EMA-stack, RSI 69,3 i bandets övre del, mom6m +28,4 %, och kostnadströskeln ryms (mål +8 % = 201,29 mot 250d-högsta 207,18). **Fälld på grind 2: volymkvot 0,56×**, alltså en uppgång utan volymbekräftelse. Blir köpbar vid en namngiven katalysator PÅ volym.

**Förra veckans bubblare:** **AMD** – **STRUKEN** (grind 2: RSI 46,3 under bandet, MACD-linjen under signalen, kursen under EMA20 och EMA50, volymkvot 0,55×. Tekniken som var "bäst i hela materialet" 260817 har vänt fullständigt; mom6m +137,0 % står kvar men den korta bilden är bruten). **AMAT** – **STRUKEN** (grind 2: RSI **37,0**, lägst bland halvledarna, under EMA20/50, MACD bear, mom5d −5,3 %. Q3-rapporten 13/8 ligger nu 13 handelsdagar bak och styrelseutnämningen 27/8 är ingen katalysator ur punkt 1a). **PLTR** – **RANKAD UNDER** (kvar som bubblare 5; grind 2 på volymkvot 0,56×). **PAYC** – **STRUKEN** (grind 2: **RSI 81,0** långt över taket 75 utan exceptionell katalysator, och MACD-linjen under signalen trots att kursen står på 250-dagarshögsta – en negativ divergens. Dessutom bara 219 MUSD/dag, vilket är över golvet men lågt för boken). **U** – **STRUKEN** (grind 2: kursen under EMA20, MACD bear, volymkvot 0,99×, mom5d −8,8 %. Uppgraderingsskuren har runnit ut och omsättningen 550 MUSD/dag är den lägsta bland de fem).

**Scout-inflöde:** **Inga INTAKT-case i scout-flödet.** Samtliga fem senaste scout-rapporter (260827–260831) avstår uttryckligen från case med utskrivna skäl – se avsnittet ovan. Noll case att poängsätta, och det är ett motiverat utfall.

**Villkorade bubblar-planer:** **Inga.** Punkt 4b kräver fullständiga nivåer OCH ett entry-villkor för en bubblare som **i övrigt håller**, och ingen av de fem gör det: TSLA och DE faller på grind 3, MU, NVDA och PLTR på grind 2. Att lägga en pending-rad på ett case som underkänts på en grind vore att kringgå grinden. Taket på två planer är oanvänt, och Pending-sektionen i `state/portfolj_us.md` har noll öppna rader – de fem befintliga är alla strukna och avförda/triggade.

## Veckans radar (kommande 5 handelsdagar)
* **Onsdag 2026-09-02** – **Broadcom (AVGO) Q3 FY2026** (`state/earnings_calendar.json` `upcoming`, `isEstimate: false`, konsensus EPS 3,238 USD, omsättning 29,43 mdr USD). **Binär händelse 1 handelsdag bort – punkt 2e förbjuder köp in i den**, och AVGO är avvisad på det i bruttolistan. Utfallet är veckans viktigaste enskilda signal för hela AI-kohorten (NVDA, AMD, TSM, MRVL, MU) och kan göra kohorten prövbar igen i v37 – eller bekräfta konsolideringen.
* **Fredag 2026-09-04** – **amerikansk sysselsättningsstatistik (NFP)**, första fredagen i månaden. Makrohändelse som sätter räntebanan in mot FOMC och driver hela riskaptiten.
* **Torsdag 2026-09-24 (utanför fönstret, för planering)** – **Teslas Semi-event**, annonserat 2026-08-27. Nämns här enligt L-1 så att en reaktion blir mätbar, inte som köpskäl.
* **Onsdag 2026-09-16 (utanför fönstret)** – **FOMC-besked**. Ingen position tas med horisont som passerar det utan att det motiveras explicit.

**L-5-markering – vad uppräkningen ovan faktiskt täcker.** Uppräkningen är gjord ur **två** källor: `state/earnings_calendar.json`, som endast känner de symboler `prices.yml` hämtar och som denna vecka bär **exakt en post**, samt `state/news_feed.json`, vars amerikanska täckning är `sec-8k`, `prnewswire`, `globenewswire` och `fed-press` med ett tak på 30 poster per källa och dygn. **Amerikanska bolag som varken hämtas av `prices.yml` eller ligger inom takets dygnskvot är därmed OKONTROLLERADE**, och det gäller hela marknaden utanför de 51 US-symboler `prices.json` bär. Påståendet ovan är alltså "inga fler rapporter **bland de symboler kalendern kan se**", inte "inga fler rapporter i USA". **Samma markering gäller makrokalendern:** `fed-press` bär 2 poster i femdagarsfönstret och ingen fil i repot räknar upp BLS:s eller Feds mötesdatum. NFP 4/9 och FOMC 16/9 är hämtade ur allmänt känd kalender och **inte verifierade ur repots egna källor** – de är märkta som sådana i stället för att presenteras som belagda.

---

## Bruttolista – samtliga 32 kandidater med namngiven spärr

| # | Ticker | Källa | catalystType | Kurs (USD) | RSI(14) | Vol× | MUSD/d | Föll på | Namngiven spärr |
|---|---|---|---|---|---|---|---|---|---|
| 1 | TSLA | egen scanning | other | 367,95 | 58,7 | 1,84 | 12 203 | **Grind 3** | SpaceX-turbinbesked 31/8 ar hype enligt 1c; Optimus-produktion 27/8 ingen 1a-kategori; mom6m −8,8 % |
| 2 | DE | egen scanning | other | 654,91 | 61,6 | 1,64 | 710 | **Grind 3** | Noll traffar i 1 097 poster; grind 4 i andra ledet – mal +8 % kraver 707,30 mot 250d-hogsta 662,49 |
| 3 | NVDA | g0 news_feed (26/8) | order | 220,78 | 54,6 | 0,97 | 28 163 | **Grind 2** | MACD-linjen under signalen; volymkvot 0,97×. Mal +8 % = 238,44 over 250d-hogsta 235,74 |
| 4 | MU | g0 news_feed (26/8) | earnings | 958,73 | 53,8 | 0,74 | 29 045 | Grind 2 | Volymkvot 0,74× mot 1,5×. Rapportdatum 30/9 ar en schemanotis, ingen katalysator |
| 5 | PLTR | h bubblare 260817 | other | 186,38 | 69,3 | 0,56 | 8 531 | Grind 2 | Volymkvot 0,56× – uppgang utan volymbekraftelse |
| 6 | AMD | h bubblare 260817 | other | 470,72 | 46,3 | 0,55 | 10 545 | Grind 2 | RSI 46,3 under bandet; under EMA20 och EMA50; MACD bear; volymkvot 0,55× |
| 7 | AMAT | h bubblare 260817 | earnings | 458,39 | 37,0 | 0,86 | 3 268 | Grind 2 | RSI 37,0 lagst bland halvledarna; under EMA20/50; Q3 13/8 ar 13 handelsdagar bak |
| 8 | PAYC | h bubblare 260817 | other | 239,10 | 81,0 | 0,82 | 219 | Grind 2 | RSI 81,0 over taket 75 utan exceptionell katalysator; MACD bear pa 250d-hogsta = divergens |
| 9 | U | h bubblare 260817 | other | 42,10 | 54,3 | 0,99 | 550 | Grind 2 | Under EMA20; MACD bear; volymkvot 0,99×; mom5d −8,8 % |
| 10 | AVGO | g0 news_feed | earnings | 370,34 | 43,6 | 1,12 | 7 172 | Grind 2 | RSI 43,6 under bandet; under EMA20/50. Rapport 2/9 = binar handelse 1 handelsdag bort (2e) |
| 11 | AMZN | g0 news_feed (26/8) | order | 259,77 | 50,1 | 1,19 | 9 919 | Grind 2 | Under EMA20; MACD bear; volymkvot 1,19× mot 1,5×. AWS-GPU-avtalet 26/8 ar bekraftat |
| 12 | TSM | egen scanning | other | 415,32 | 48,4 | 0,65 | 4 209 | Grind 2 | RSI 48,4 under bandet; under EMA20 och EMA50; volymkvot 0,65× |
| 13 | MRVL | g0 news_feed (27/8) | earnings | 211,66 | 45,6 | 0,96 | 5 170 | Grind 2 | RSI 45,6; under EMA20/50; MACD bear. Rapport 27/8 gav SALJreaktion −10,28 %, ingen bull-katalysator |
| 14 | IREN | g0 news_feed (27/8) | earnings | 37,12 | 43,6 | 0,88 | 1 661 | Grind 2 | RSI 43,6; under alla tre EMA; rapport 27/8 gav saljreaktion −12,53 % |
| 15 | ANET | egen scanning | other | 195,69 | 54,8 | 0,68 | 1 447 | Grind 2 | MACD bear; volymkvot 0,68×. Mal +8 % = 211,35 over 250d-hogsta 210,50 |
| 16 | META | egen scanning | other | 572,34 | 47,5 | 0,83 | 9 163 | Grind 2 | RSI 47,5 under bandet; under alla tre EMA; mom6m −12,4 % |
| 17 | MSFT | egen scanning | other | 507,29 | 68,3 | 0,94 | 14 427 | Grind 2 | MACD bear; volymkvot 0,94×. Mal +8 % = 547,87 over 250d-hogsta 542,07 |
| 18 | GOOGL | egen scanning | other | 339,35 | 44,1 | 1,37 | 8 272 | Grind 2 | RSI 44,1 under bandet; under EMA20 och EMA50; MACD bear |
| 19 | AAPL | egen scanning | other | 316,85 | 54,1 | 0,95 | 13 630 | Grind 2 | Volymkvot 0,95×. Mal +8 % = 342,20 over 250d-hogsta 340,08 |
| 20 | SMCI | egen scanning | other | 37,28 | 57,3 | 0,42 | 2 040 | Grind 2 | Volymkvot 0,42×; MACD bear |
| 21 | NET | egen scanning | other | 305,11 | 56,2 | 0,92 | 1 223 | Grind 2 | MACD bear; volymkvot 0,92× trots mom5d +8,8 % |
| 22 | TEAM | egen scanning | other | 194,17 | 80,1 | 0,92 | 1 071 | Grind 2 | RSI 80,1 over taket 75 utan exceptionell katalysator; star pa 250d-hogsta |
| 23 | COIN | egen scanning | other | 188,12 | 60,9 | 1,11 | 1 787 | Grind 2 | Volymkvot 1,11× mot 1,5×; under EMA200 |
| 24 | MSTR | egen scanning | other | 132,94 | 65,8 | 0,95 | 3 341 | Grind 2 | Volymkvot 0,95×; under EMA200; mom6m −3,4 % |
| 25 | INTC | egen scanning | turnaround | 89,51 | 41,6 | 0,63 | 9 110 | Grind 2 | RSI 41,6 under bandet utan fardsk katalysator; MACD bear; volymkvot 0,63× |
| 26 | XOM | egen scanning | macro | 160,95 | 56,3 | 1,28 | 2 262 | Grind 2 | MACD bear; volymkvot 1,28×. Mal +8 % = 173,83 over 250d-hogsta 171,47 |
| 27 | CVX | egen scanning | macro | 206,14 | 65,7 | 1,54 | 1 612 | Grind 2 | MACD-linjen under signalen. Mal +8 % = 222,63 over 250d-hogsta 211,15 |
| 28 | JPM | egen scanning | macro | 356,02 | 52,9 | 1,40 | 1 974 | Grind 2 | MACD bear; volymkvot 1,40×. Mal +8 % = 384,50 over 250d-hogsta 365,18 |
| 29 | WFC | egen scanning | macro | 86,39 | 51,1 | 1,69 | 975 | Grind 2 | MACD-linjen under signalen trots volymkvot 1,69× och full EMA-stack |
| 30 | WMT | egen scanning | earnings | 104,87 | 38,7 | 1,25 | 2 840 | Grind 2 | RSI 38,7 under bandet; under alla tre EMA; mom6m −17,5 % |
| 31 | MARA | egen scanning | other | 10,77 | 48,6 | 0,49 | 523 | Grind 2 | RSI 48,6 under bandet; under alla tre EMA; volymkvot 0,49× |
| 32 | RIOT | egen scanning | other | 19,00 | 43,5 | 0,49 | 423 | Grind 2 | RSI 43,5 under bandet; under alla tre EMA; volymkvot 0,49× |

**Kandidater som medvetet INTE poängsattes, och varför (L-6):** inga. Kryptoproxyerna **MSTR** och **COIN** är poängsatta som NASDAQ/NYSE-noterade aktier (rad 23–24) och avvisade på namngivna tekniska spärrar. `config/fokus_us_rotation.md` säger ordagrant "Krypto – UTESLUTS ur den handlade rotationen (scout genererar kryptoidéer separat)" och beskriver universumet som "USA: NYSE & NASDAQ … Alla bolagsstorlekar tillåtna" – ordet "kryptoproxies" förekommer inte i filen, och `us-veckorapport-260817` läste den strängare än den säger. Det är exakt fallet bakom L-6, och läsningen rättas här. **MARA** och **RIOT** är poängsatta på samma sätt (rad 31–32): MACD-linjen ligger visserligen över signalen för båda, men kursen är under alla tre EMA och volymkvoten 0,49×.

**Ryktesdrivna val:** 0 av 0 (taket är 2 av 4). **Sektorkoncentration:** ej tillämplig utan positioner.

**Watchlist-hygien (punkt 6 och 6b):** `config/watchlist_us.txt` är oförändrad – samtliga 32 bruttokandidater hämtas redan, och `^GSPC`/`^IXIC` ligger kvar (regimfiltrets serie enligt punkt 6). **Noll strykningar** denna körning: samtliga symboler har en US-beslutsrad daterad i dag. **`state/decision_eval.json`:** `missingSymbols` är **tomt** – varje tidigare loggat beslut har en kursserie att mätas mot.

**Urvalsmätningen (punkt 0 i BESLUTSDATABASEN):** `state/decision_eval.json` bär efter denna körning **382 loggade beslut**, samtliga mätbara (`counts.missing` = 0). `selectionEdge` på 5 dagars horisont låg vid senaste ombyggnaden på **+0,79 pp** till de köptas fördel (köpta n = 10, avvisade n = 208) – **men talet vilar på 6 av 8 oberoende mätfönster**, bär `clusterCaveat`, och skriptets eget omdöme är "ingen skillnad utöver brus mellan köpta och avvisade". Det är en RIKTNING, inte ett svar. **Radantalet är inte stickprovsstorleken:** dagens 33 US-rader landar alla på 2026-09-01 och utgör tillsammans med den nordiska rotationens 32 rader **ett enda mätfönster**. Konvergenströskeln står på 5 av 20 KÖP-fönster.

---

## Beslut om det befintliga innehavet

### Indexsleeve (SPY) – BEHÅLL, 100 % oförändrat
**Kurs:** **767,05 USD** (`state/prices.json`, source "Yahoo Finance (chart API)", marketTime **2026-08-31T20:00:00Z** – måndagens stängning; US-börserna har inte öppnat när rotationen körs). Dagsrörelse **−0,30 %** mot `previousClose` 769,35 (`schemaVersion` "2026-08-02-prevclose" finns, så dagsrörelsen är räknad korrekt ur filen).

**Beslut och skäl:** BEHÅLL, vikten oförändrad **100 %**. Med noll köp och noll sälj kräver ingen aktievikt någon förändring – de fyra tomma platserna ligger kvar i sleeven, aldrig på konto. Sleeven har varken stop eller målkurs och säljs aldrig på nedgång. Loggas i `state/decisions.json` med `catalystType: "index"` så att raden filtreras bort ur urvalsstatistiken.

**Utfall:** **−0,80 %** mot entry 773,26 (2026-08-10). Punkt 0c gäller: att parkera i SPY när inget case håller måttet är en aktiv och lönsam handling jämfört med kassa, och elva procentenheter av backtestets "avkastning" låg i just det oallokerade kapitalet.

**Aktiepositioner:** **inga.** Boken har stått helt i index sedan XOM såldes 2026-08-26, alltså fyra handelsdagar.

**Pending-planer:** **noll öppna rader.** Samtliga fem rader i sektionen är strukna (XOM och TGT avförda 2026-08-26, MU triggad 2026-08-18, NVDA triggad 2026-08-10, PLTR avförd 2026-08-17) och raderas aldrig.

**Brutto mot netto (punkt 4 och punkt 2):** talen ovan är BRUTTO. US-boken betalar **~0,75 % rundtur** enligt `config/kostnader.json` (0,25 % courtage + 0,5 % växlingspåslag), tre gånger den nordiska. Med noll affärer denna vecka är skillnaden noll. **Boken redovisas i USD och är därmed EXKLUSIVE USD/SEK-effekten** – USD/SEK står i 9,5811 (marketTime 2026-08-31T23:03:25Z) och den ackumulerade avkastningen −2,87 % motsvarar alltså inte avkastningen i en svensk depå.

---

## Åtgärdspunkter till Dren (L-3 – namngiven defekt, fil/fält och kvantifierat omfång)

**1. ÅTGÄRDAD I SAMMA SESSION – serieluckor som backfillen aldrig kunde nå.**
*Fil/fält:* `state/price_history.json` och `state/volume_history.json`, `series[SYMBOL]`.
*Omfång:* **17 kursserier och 18 volymserier** saknade dagar INOM sitt eget spann. Femton saknade samma dag (2026-07-31); PAYC saknade 2026-08-11 och ligger i denna bruttolista. Samtliga hade ≥ 200 punkter och var därmed **permanent** utom räckhåll för `backfill-history.mjs --missing=200`, som bara väljer symboler som är för KORTA. Felet var självlåsande och hade legat en månad.
*Varför det inte är kosmetiskt:* EMA/RSI/MACD räknas på indexpositioner och antar en handelsdag mellan två punkter. Ett hål förskjuter varje glidande fönster – samma klass av distorsion som fantompunkten 2026-08-17.
*Åtgärd:* `marketOf`/`buildCalendars`/`symbolsWithGaps` i `backfill-history.mjs` (kalendern byggs ur datat självt, ingen helgdagslista att underhålla), urvalet tar nu hål FÖRE korta serier, och `watchdog.mjs:checkSeriesGaps` gör dem hörbara. Samtliga luckor fyllda: 0 kvar. **Kvar för Dren:** inget – men kontrollera att `checkSeriesGaps` är tyst i watchdog-körningarna den närmaste veckan.

**2. NY: `globenewswire-earnings` bär inga amerikanska rapporter.**
*Fil/fält:* `state/news_feed.json`, `feeds["globenewswire-earnings"]`, och punkt g0 i `prompts/us_dagligprompt.md` som beskriver flödet som det som "fångar rapportöverraskningar".
*Omfång:* **43 poster i femdagarsfönstret, i praktiken noll amerikanska rapporter.** Innehållet är nordiska insynsanmälningar (Danske Bank, SalMar, Mowi, Zealand Pharma, Siili Solutions, SATO, Trifork). De amerikanska rapporterna i fönstret – NVIDIA 26/8, HP Inc 26/8, Zoom 25/8 – hittades i `prnewswire` och `globenewswire`.
*Varför det spelar roll:* flödet är inte dött och blir därför inte flaggat av `checkNewsFeeds`, men promptens beskrivning av vad g0 kan förvänta sig av det stämmer inte för US-boken. En rotation som litar på formuleringen letar rapportöverraskningar i fel flöde.
*Förslag:* kontrollera URL:en i `config/news_feeds.txt` mot GlobeNewswires ämneskatalog – sannolikt pekar den på en nordisk delkatalog. Alternativt: skriv om punkt g0 så att den beskriver flödet som det faktiskt är.

**3. ÅTERKOMMANDE (tredje veckan): nyhetsfönstrets dygnstak.**
*Fil/fält:* `state/news_feed.json`, taket på 30 poster per källa och dygn (`window.perSource`).
*Omfång:* taket binder för samtliga fem dagar. För US-boken är effekten mindre allvarlig än för den nordiska (amerikanska pressmeddelanden släpps ofta efter stängning och hamnar därför inom kvoten), men `sec-8k` – som punkt g0 kallar "särskilt värdefullt" – kapas vid 30 poster per dygn och domineras då av SPAC-registreringar. Av 26 katalysatorträffar i fönstret var **13 tomma SPAC-8K:er**.
*Förslag:* samma som i den nordiska rapporten (behåll dygnets första n lika väl som de sista), plus ett filter som nedprioriterar `Acquisition Corp`-registreringar i `sec-8k`.

**4. NY: grindtilldelningen skiljer sig mellan rapporter och gör talen ojämförbara.**
*Fil/fält:* `prompts/dagligprompt.md` och `prompts/us_dagligprompt.md` – ingen av dem säger hur en kandidat som faller på FLERA grindar ska klassificeras.
*Omfång:* hela grindstatistiken, alltså den mätning båda rapporterna bygger sin viktigaste slutsats på. `us-veckorapport-260817` använde "Grind 3+2" för dubbelfall, `veckorapport-260831` gav DFDS.CO grind 3 med volymkvot 1,28× (under 1,5×) men HAYPP.ST grind 2 med 1,02×, och denna rapport använder konsekvent den FÖRSTA grinden i ordning. Jämförelsen "grind 2 gick 12 → 28" bär därför både en verklig förändring och min tilldelningsregel, utan att gå att skilja åt.
*Förslag:* fastställ i båda prompterna att den FÖRSTA grinden i ordning 1→2→3→4→5 är den som loggas, och att övriga fällda kriterier nämns i `reason` som "andra ledet". Först då är serien jämförbar bakåt. **Grind 1-talet är opåverkat** – en kandidat har antingen verifierad kurs eller inte – och det är också det tal veckans slutsats vilar på.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
