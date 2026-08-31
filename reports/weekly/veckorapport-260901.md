# Veckorapport: Nordisk Rotation
**Vecka:** v 36 (EXTRA rotation, tisdag) | **Datum:** 2026-09-01
**Marknadsklimat:** OMXS30 (`^OMX`) stängde måndag **3 309,1782** (`state/prices.json`, source "Yahoo Finance (chart API)", marketTime 2026-08-31T15:35:00Z), **−0,66 %** mot föregående stängning 3 331,4400 – Stockholm gav tillbaka en del av förra veckans uppgång på veckans första session. **Regimfiltret är PÅ:** 3 309,1782 ligger **8,06 %** över MA200 **3 062,45**, räknat på 250 daterade stängningar i `state/price_history.json` (ned från 8,88 % vid gårdagens rotation, enbart därför att kursen föll). Nya positioner är alltså tillåtna enligt punkt 2b, och regimen är inte spärren. USD/SEK **9,5811** (marketTime 2026-08-31T23:03:25Z), alltså en aning starkare krona än gårdagens 9,5940 – marginell motvind för exportledet. Laxpriserna är den sektorspecifika motvinden denna vecka: SalMars egen Q2-rapport 2026-08-25 anger uttryckligen "lower market prices throughout the quarter" trots rekordvolymer, vilket är den viktigaste enskilda invändningen mot veckans enda case. Bitcoin och de amerikanska indexen är oförändrat utanför denna boks universum och behandlas här bara som riskaptitmätare.

**VARFÖR DENNA RAPPORT FINNS (läs innan facit-sektionen jämförs bakåt).** Detta är en EXTRA veckorotation, körd på en tisdag på uttrycklig begäran av Dren, en handelsdag efter `veckorapport-260831.md`. Skälet är inte att gårdagens omdöme var fel utan att gårdagens URVAL var datablockerat: grind 1 ("verifierad kurs med källa + tidsstämpel") fällde då **10 av 28** kandidater, och de tio var veckans fyra största nordiska rörelser plus veckans fem starkaste bekräftade katalysatorer. Ingen av dem fanns i `state/prices.json`. Den defekten (`movers-universe-not-priced` i `state/action_items.json`) åtgärdades i kod 2026-08-31 och den breda hämtningen kördes samma kväll: `state/prices.json` bär nu `wideAt` 2026-08-31T23:05:52Z och **198 symboler mot 123**, varav **107 av 110** ur `config/universe_nordic_movers.txt`. Facit-sektionen nedan mäter därför **en handelsdag**, inte en vecka – läs den så.

---

## 0. Facit: Förra veckans val
| Aktie | Entry | Exit | Utfall | Stop/Mål träffad? |
|---|---|---|---|---|
| XACT-OMXS30.ST (sleeve) | 494,60 | – (öppen) | **−0,37 %** | Nej – sleeven har varken stop eller mål |

**Veckans portföljutfall (viktat):** **−0,66 %** – men perioden är EN handelsdag (2026-08-31), inte en vecka, och talet ska inte kedjas ihop med v36:s +1,23 % som om det vore en ny vecka. Boken låg på 100,0 % indexsleeve utan omviktning, så utfallet är sleevens rena kursutveckling: 496,00 → **492,75 SEK** (`state/prices.json`, marketTime 2026-08-31T15:24:25Z). ^OMX över samma session **−0,66 %** ⇒ boken följde index exakt, vilket den ska när den ÄR index.

**Ackumulerad avkastning sedan strategistart:** **−0,81 %** – oförändrad. En enda stängd affär sedan den skarpa starten 2026-08-10 (`state/live_start.json`): ASSA-B.ST −3,26 % på vikt 25,0 %, `realizedRr` −1,01. Ingen affär stängdes i dag. Talet kedjar endast STÄNGDA positioner; sleevens −0,37 % mot entry är orealiserat och räknas medvetet inte in.

**Portföljallokering denna vecka:** **12,5 % SALM.OL + 87,5 % indexsleeve (XACT-OMXS30.ST) + 0 % kassa**, med ett villkorat ben 2 om 12,5 % liggande i Pending. Fylls ben 2 blir fördelningen 25 % SALM.OL + 75 % sleeve. **Tre av fyra platser står fortfarande tomma** och ligger i sleeven. Kapitalet är kvar i marknaden, aldrig på konto.

**Lärdom:** Veckans mätning är att **grind 1 föll från 10 av 28 till NOLL av 31, och att funneln därmed för första gången sedan v33 stoppar på omdöme i stället för på datatillgång.** Samtliga elva symboler som gårdagens rapport tvingades lämna opoängsatta har i dag verifierad kurs OCH fullständig kursserie: BWE.OL, CADLR.OL, ASA.OL, NNIT.CO, PARKEN.CO, SALM.OL, TRUE-B.ST, NIBE-B.ST, KINV-B.ST, SINCH.ST och GRK.HE bär alla 250 daterade stängningar och ≥ 21 volympunkter. **Effekten var inte kosmetisk:** SALM.OL, som gårdagens rapport fällde på grind 1 utan att kunna säga ett ord om bolaget, klarar i dag samtliga fem grindar och är veckans enda case. **Den andra halvan av lärdomen är obekvämare:** de tio övriga föll ändå – sju på grind 2 och tre på grind 3 – vilket bekräftar gårdagens egen bedömning att spärr (i) i punkt g1 sannolikt hade fällt movers-raderna även med kurs. Att veta det är dock inte samma sak som att gissa det, och skillnaden är precis vad `state/decision_eval.json` mäter. **En ny datadefekt hittades och åtgärdades under körningen** (åtgärdspunkt 1): de elva nyinlagda symbolerna saknade 2026-08-28 i både `price_history.json` och `volume_history.json`. Det var inte kosmetiskt heller – SALM.OL:s RSI gick 69,0 → **66,6** och mom6m −1,5 % → **+0,4 %** när luckan fylldes, alltså två värden som grind 2 avgörs av. Tillämpade lärdomar: **L-1** (radarn namnger rapporter med datum och källa, och det som inte går att räkna upp märks OKONTROLLERAT), **L-2** (veckans bubblare har verifierad kurs och ligger i `config/watchlist.txt`), **L-3** (sex datadefekter eskaleras som namngivna åtgärdspunkter med kvantifierat omfång), **L-5** (varje "inga fler …" bär källa och täckningsangivelse), **L-6** (ingen kandidat stryks med hänvisning till en fokus- eller universumfil).

---

### Bred scanning – varifrån bruttolistan kom
**31 kandidater** poängsattes: **10 ur `state/news_feed.json`** (punkt g0 – kravet är minst 5), **3 ur `state/movers.json`** (punkt g1; SALM.OL räknas under g0 där den har sin egen katalysator), **5 ur gårdagens bubblarlista** (punkt g, obligatoriskt återbruk) och **13 ur bevakningsrader och egen teknisk scanning**. Samtliga 31 är loggade i `state/decisions.json` med den NAMNGIVNA spärren i `reason`, plus en KÖP-rad för SALM.OL och en BEHÅLL-rad för indexsleeven – **32 rader totalt**.

**Nyhetsfönstrets faktiska täckning:** `window.tradingDaysCovered` = **10 av 10 handelsdagar** (`oldest` 2026-08-17, `newest` 2026-08-31, `missingDays` tomt, 1 097 poster). Filen är **3,7 timmar gammal** (`generatedAt` 2026-08-31T19:31:22Z) och alltså väl inom g0:s 24-timmarsgräns – till skillnad från gårdagens körning, där den var 52 timmar gammal. **Samtliga sex flöden svarar normalt**, och `prnewswire`, som var dött med HTTP 404 i gårdagens rapport, bär nu "20 poster". Den defekten har alltså självläkt inom ett dygn och förs inte upp som åtgärdspunkt igen; skulle den återkomma är det tredje gången ett GlobeNewswire-/PR Newswire-flöde faller, och då är mönstret värt en egen utredning.

**Dygnstaket gör fortfarande varje förmiddagspost overifierbar (ÅTERKOMMANDE, tredje veckan).** Taket på 30 poster per källa och dygn binder för SAMTLIGA fem dagar i fönstret, och `mfn`-posterna börjar först 15:32–18:55 UTC per dag. Stockholm stänger 15:30 UTC. **Följden är att fönstret systematiskt bara innehåller efterbörsposter**, alltså att varje pressmeddelande som släpps före eller under den nordiska sessionen är osynligt för punkt g0 – och det är de som är mest handlingsbara. Att veckans enda case ändå hittades berodde på att SalMars Q2 kunde beläggas EXTERNT (GlobeNewswire 2026-08-25), inte på att flödet bar den. Åtgärdspunkt 3.

**`state/movers.json`:** `asOf` **2026-08-28** medan senaste handelsdag var **2026-08-31** – filen är en handelsdag för gammal, och det är fjärde rapporten i rad som konstaterar samma sak. **Ett nytt mätvärde motsäger dock den förklaring som gavs i går:** gårdagens rapport tillskrev eftersläpningen "första lördagskörningen efter `period1`/`period2`-fixen". Denna körning gjordes **måndag 23:04 UTC**, alltså inte på en helg, och eftersläpningen är oförändrad en handelsdag. Helgförklaringen håller därmed inte – defekten är systematisk. Åtgärdspunkt 4, ÅTERKOMMANDE. Listans tre rader (TRUE-B.ST +17,7 %, SALM.OL +9,88 %, KINV-B.ST +9,72 %) gicks igenom och samtliga tre finns i bruttolistan nedan; **samtliga tre har numera verifierad kurs**, vilket ingen av dem hade i går.

**`state/scout_candidates.json`:** 21 poster, samtliga `book: "us"`, och **noll med `status: "new"`**. Inget avgörande åligger den nordiska boken denna körning, och L-4-kontrollen är tom: ingen nordisk post ligger avvisad på ett tillfälligt datavillkor inom sin `expiresAt`. Det är normalt och inget fel – nordisk kandidatgenerering sker direkt ur `news_feed.json` i punkt g0, vilket den gjort med 10 kandidater.

**`state/earnings_calendar.json`:** `generatedAt` 2026-08-31T23:04:28Z, alltså färsk. `upcoming` bär tre poster: **ASA.OL 2026-08-31** (`isEstimate: false`, `tradingDaysAway` 0), **BAKKA.OL 2026-08-31** (`isEstimate: false`, `tradingDaysAway` 0, konsensus EPS 3,672 NOK) och **AVGO 2026-09-02** (amerikansk). Båda de nordiska rapporterade alltså i går; punkt 2e fäller dem som binära händelser och de är avvisade på det i bruttolistan. `errors` bär **fyra poster** (KABE-B.ST, MGN.OL, PARKEN.CO, STAR-B.ST), upp från tre i går. Åtgärdspunkt 5.

**`state/alerts.json`:** `active` är tom och `checkedAt` är **2026-08-31T20:40:08Z**, alltså ~2,5 timmar gammalt. Det är väl inom punkt 2c2:s ~6-timmarsgräns, så **intradagsskyddet är NÄRVARANDE denna körning** – till skillnad från i går, då det behandlades som frånvarande. Boken har noll positioner med nivåer och noll öppna pending-rader vid körningens början, så konsekvensen är ändå noll; det spelar däremot roll från och med i dag, eftersom veckans case lägger både en stop och en pending-rad.

**Teknisk filtrering – vad som faktiskt gick att mäta.** RSI(14), MACD(12,26,9), EMA20/50/200 samt 5-dagars- och sexmånadersmomentum är räknade med FAKTISKA värden ur `state/price_history.json` för **samtliga 31 bruttokandidater** – för första gången sedan mätningen började är antalet opoängsatta kandidater noll. Serierna bär 250 punkter var utom KOG.OL. Värdena är räknade på RÅSERIEN utan avdubblering, vilket är korrekt: 1 av 112 serier upprepar sin föregående stängning och den är en äkta oförändrad stängning. **Volymen är helt mätbar:** `state/volume_history.json` har ≥ 21 punkter för samtliga 31. Växelkurser: EUR/SEK, DKK/SEK och NOK/SEK finns fortfarande INTE i `state/prices.json` (endast `USDSEK=X` 9,5811), så omräkningar till MSEK är gjorda med medvetet KONSERVATIVA UNDRE gränser (11,30 SEK/EUR, 1,52 SEK/DKK, 0,94 SEK/NOK). Riktningen är vald efter vad talen ska bära: veckans case (SALM.OL, 104,3 MSEK/dag) PASSERAR likviditetsgolvet med 35× marginal även vid undre gräns, och de två kandidater som FÄLLS på golvet (NNIT.CO 0,6 och PARKEN.CO 0,7 MSEK/dag) fälls med sådan marginal att en övre gräns inte hade räddat dem. Åtgärdspunkt 6, ÅTERKOMMANDE.

---

## Case 1: SalMar ASA (SALM.OL / Oslo Børs)

### 1. Katalysatorn
Q2 2026-rapporten, publicerad **2026-08-25** (GlobeNewswire, "SalMar – Record-strong biological performance", verifierad mot bolagets pressmeddelande samt Undercurrent News och Investing.com samma datum). Två konkreta tal bär caset: skördevolymen blev **81 800 ton** i Q2, ett andrakvartalsrekord och **+27 % mot 64 500 ton** ett år tidigare, och bolaget **höjde helårsguidningen för 2026 med 20 000 ton till 350 000 ton** inklusive andelen av Scottish Sea Farms, vilket motsvarar **+16 % volymtillväxt mot 2025**. Operationell EBIT/kg låg på NOK 15,1 för koncernen och NOK 17,2 i Norge. Katalysatorn ligger **5 handelsdagar bak** (25, 26, 27, 28, 31 augusti) och är därmed på gränsen till fönstret i punkt 1a, men inom det. `catalystType`: **earnings**.

En andra, mindre signal samma dag som körningen: **styrelseledamoten Martin Bech Holte köpte 1 200 aktier à NOK 566,50 den 2026-08-31** (GlobeNewswire, "SalMar – Mandatory notification of trade", 11:42 UTC). Beloppet är ~680 000 NOK och är alltså **inte** ett "stort insiderköp" enligt punkt 1a – det redovisas som stödsignal, inte som katalysator, och påverkar inte poängsättningen.

### 2. Investerings-tes (The Bull Case)
* **Guidningshöjningen är volym, inte pris, och volym är det bolaget styr över.** 20 000 ton på en bas om 330 000 är ~6 % mer såld kvantitet under andra halvåret, med en kostnadsbas som redan är lagd. Det biologiska utfallet – som är den historiskt svåraste variabeln i norsk lax – beskrivs som rekordstarkt, vilket gör höjningen mer trovärdig än en ren prognosjustering.
* **Marknaden har ännu inte prisat in hela höjningen.** Kursen står 569,00 NOK mot 250-dagarshögsta 622,00, alltså 8,5 % under toppen, trots att guidningen just höjdes. Den tekniska strukturen (kurs över EMA20 > EMA50 > EMA200, MACD-linjen över signallinjen, volym 2,62× 20-dagarssnittet) säger att institutionellt kapital deltagit i rörelsen, och volymen den 31/8 (511 723 aktier) var den högsta på tio sessioner.

### 3. Motargument & Risker (The Bear Case)
* **Laxpriset är motvind, och det står i bolagets egen rapport.** Q2 beskrivs som påverkat av "an unfavourable harvest profile and lower market prices". Rekordvolym till lägre pris är en sämre kombination än den ser ut, och marknadsreaktionen var enligt ad-hoc-news.de dämpad ("stock holds steady as salmon sector digests mixed Q2 earnings"). Detta är veckans starkaste invändning och skälet till att makrokomponenten poängsätts 4 av 10.
* **Rörelsen har redan inträffat.** SALM.OL ligger i `state/movers.json` med +9,88 % på veckan, och punkt g1 spärr (i) säger uttryckligen att en sådan rad aldrig får jagas. Caset accepteras därför ENBART som rekyl-setup: kursen föll −1,64 % den 31/8 (578,50 → 569,00, dagshögsta 574,00, dagslägsta 562,00), entry ligger alltså under fredagens stängning, och halva positionen läggs som villkorad limit ännu lägre. Hade kursen stått på 578,50 hade caset inte tagits.
* **Sexmånadersmomentum är +0,4 %, alltså platt.** Punkt 0a är explicit om att skelettet bär sig med LÅNG momentum-horisont och att en brant uppgång de senaste två veckorna utan längre trend bakom sig är en VARNING. SALM.OL uppfyller varningsmönstret: +7,4 % på fem dagar mot +0,4 % på sex månader. Motvikten är att uppgången är katalysatordriven och sker ur en bas, inte i slutet av en lång trend – men invändningen står kvar och är oreducerad.
* **MACD-histogrammet vek senaste sessionen** (4,36 → 5,47 → 6,27 → **5,75**). Linjen ligger fortfarande över signalen, men momentet i momentet avtar.
* **R/R ligger exakt på golvet 2,00:1.** Det finns ingen marginal till kravet, och målet 619,00 ligger 0,5 % under 250-dagarshögsta – zonen 594–619 är tunt handlad.

### 4. Fundamental snapshot
* **Börsvärde:** ~NOK 74 mdr (≈ 70 mdr SEK vid 0,94) | **P/E / EV/EBITDA:** ej verifierbart ur repots egna källor och därför INTE angivet – ingen fil i repot bär multiplar, och ett tal ur minnet vore ett påstående utan källa | **Tillväxt:** helårsguidning höjd till 350 000 ton, **+16 % volym** mot 2025 (bolagets eget tal, 2026-08-25) | **Snittomsättning/dag:** **104,3 MSEK** (20-dagarssnitt 195 984 aktier × 569,00 NOK × 0,94 SEK/NOK), alltså **35× likviditetsgolvet** på 3 MSEK och väl inne i den billigaste kostnadsnivån (≥ 20 MSEK/dag ⇒ 0,25 % rundtur enligt `config/kostnader.json`)

### 5. Teknisk setup
* **RSI(14):** **66,6** (inom bandet 50–70) | **MACD:** bullish, linjen över signalen, histogram +5,75 men vikande från 6,27 | **Kurs vs EMA20/50/200:** **över alla tre** i ordningen kurs 569,00 > EMA20 > EMA50 > EMA200 | **Volym vs 20d-snitt:** **2,62×** (511 723 mot 195 984) | **Stöd:** 552,50 (−2,90 %) och **544,00 (−4,39 %)** | **Motstånd:** 578,00 (+1,58 %), 594,00 (+4,39 %), 597,50 (+5,01 %), 612,00 (+7,56 %), **619,00 (+8,79 %)**, 250-dagarshögsta 622,00

### 6. Handelsplan
| Entry | Stop-loss | Målkurs | Risk/Reward |
|---|---|---|---|
| 569,00 NOK | 544,00 (−4,39 %) | 619,00 (+8,79 %) | 1:2,00 |

**Planerad vikt:** **25 %** enligt punkt 3b (platt vikt, poängen styr urval och rangordning men aldrig vikt), delad i två ben enligt punkt 4a:
* **Ben 1 – 12,5 %, köps direkt** till verifierad marknadskurs **569,00 NOK** (`state/prices.json`, source "Yahoo Finance (chart API)", marketTime 2026-08-31T14:25:14Z).
* **Ben 2 – 12,5 %, villkorad limit** vid verifierad kurs **≤ 552,50 NOK** (stödnivån −2,90 %), skriven som rad i Pending-sektionen. Triggar den inte inom 5 handelsdagar avförs benet och delen stannar i sleeven.

**Stop och mål gäller båda benen.** Stoppet 544,00 är satt TEKNISKT strax under stödklustret 552,50/544,00 och ligger inom bandet 3–5 % (−4,39 %); det närmast tightare stödet 552,50 ligger på −2,90 % och alltså UTANFÖR bandet åt andra hållet. **Kostnadströskeln:** entry → mål är **+8,79 %**, alltså över kravet 6 % och 35× rundturskostnaden 0,25 %. **Nåbarhetstaket (punkt 6):** genomsnittlig dagsrörelse över 60 sessioner är **1,46 %**; taket är 2 × 1,46 × √20 = **13,06 %** vid en horisont på 20 handelsdagar. Målavståndet 8,79 % ryms med marginal.

**En avvikelse från katalysatortabellen som ska skrivas ut, inte döljas.** Tabellen i "NIVÅER & OMSÄTTNING" punkt 5 anger målavstånd **12–15 %** för `earnings`. Ett mål på 12 % vore 637,28 NOK, vilket ligger **över hela 250-dagarsserien** (högsta 622,00) och därmed saknar strukturell referens. Punkt 6 är överordnad här: "ett mål satt från analytikerintervall är ett påstående, inte en mätning." Jag har därför valt det högsta STRUKTURELLA motståndet under 250-dagarshögsta (619,00) framför tabellens intervall, och redovisar valet i stället för att tysta det. De två hårda kraven – R/R ≥ 2:1 och entry → mål ≥ 6 % – är båda uppfyllda. `horizonDays` sätts till **20** (mitt i tabellens 3–6 veckor); inget tidsstopp gäller för `earnings`.

**Poängsättning (punkt 3):** katalysator **7** (bekräftad, daterad, materiell guidningshöjning – men bolagets egen rapport anger prismotvind), teknisk setup **7** (RSI 66,6, full EMA-stack, volym 2,62×, djup likviditet – minus för vikande MACD-histogram och platt mom6m), makromedvind **4** (fallande laxpriser är motvind, inte medvind), risk/reward **5** (exakt 2,00:1, mål strax under 250-dagarshögsta). **Totalpoäng 6,15 av 10.** Det är ingen stark poäng, och den redovisas som den är: caset väljs för att det är det ENDA som klarar samtliga fem grindar, inte för att det är exceptionellt.

---

## Bubblare (watchlist inför nästa vecka)
1. **BW Energy (BWE.OL)** – 56,00 NOK (`state/prices.json`, marketTime 2026-08-31T14:29:18Z). **Veckans starkaste katalysator men fälld på teknik.** Ramavtal om strategiskt inträde i Angola via andelar i de producerande blocken 14 och 14K (MFN 2026-08-28 18:25 UTC, verifierad mot bolagets pressmeddelande): ekonomisk exponering mot ~8 kbopd och ~19 mmbbl netto 2P-reserver. Volymkvoten var **6,76×**, högst i hela bruttolistan, och kursen ligger över alla tre EMA. Blir köpbar när MACD-linjen korsar över signallinjen. **Två varningar:** affären är villkorad av "applicable approvals, consents and contractual requirements" och något köpeskillingsbelopp anges INTE i pressmeddelandet – gårdagens rapport angav "USD 97,5 mn", vilket inte går att belägga ur källan och därför inte upprepas här. Dessutom ligger likviditeten på **3,5 MSEK/dag**, alltså i 0,75-procentsnivån i `config/kostnader.json` (se åtgärdspunkt 2).
2. **Cadeler (CADLR.OL)** – 58,40 NOK (marketTime 2026-08-31T14:27:08Z). Teknik och likviditet håller (RSI 58,9, full EMA-stack, volym 1,88×, 24,3 MSEK/dag). **Fälld på grind 3 av ett skäl som rättar gårdagens rapport:** F-4-inlämningen till SEC 2026-08-27 avser enligt källan "a potential redomiciliation of Cadeler from Denmark to the United Kingdom" – ett byte av hemvist, inte en bolagskombination. Gårdagens rapport klassade den som `ma_rumor` med formuleringen "pekar mot en möjlig bolagskombination"; det stöds inte av pressmeddelandet. En redomiciliering tillhör ingen av punkt 1a:s kategorier. Blir aktuell vid en riktig katalysator.
3. **Skanska B (SKA-B.ST)** – 272,40 SEK (marketTime 2026-08-31T15:29:xx Z). Kvar från gårdagens lista. Datacenterordern i Prag (CZK 2,1 mdr, 2026-08-24) ligger nu **6 handelsdagar bak** och är därmed ute ur fönstret, så caset faller på grind 3 i stället för på grind 2. Volymkvoten har dessutom förbättrats till 1,26× utan att nå 1,5×. **Varning:** kostnadströskelns 6 % kräver 288,74 SEK, vilket ligger över hela 250-dagarsserien (högsta 279,40) – caset behöver ett utbrott, inte bara en katalysator.
4. **Kinnevik B (KINV-B.ST)** – 61,38 SEK (marketTime 2026-08-31T15:29:38Z). Ny på listan, ur `state/movers.json` (+9,72 % på veckan). RSI 64,8, volym 1,33×, likviditet 59,1 MSEK/dag. **Fälld på grind 3:** noll träffar i nyhetsfönstrets 1 097 poster, alltså en rörelse utan namngiven katalysator. Kursen ligger dessutom under EMA200 och närmaste stöd är −6,94 %, alltså utanför stoppbandet. Blir prövbar om en katalysator namnges.
5. **Bavarian Nordic (BAVA.CO)** – 217,60 DKK (marketTime 2026-08-31T14:59:xx Z). Kvar för femte veckan på styrkan i den ursprungliga katalysatorn (höjd helårsprognos + återköp 750 MDKK, 2026-08-21) och en trend som håller. **Fälld på grind 2:** RSI **77,2** ligger över taket 75 och katalysatorn är inte längre exceptionell – den är två veckor gammal. Grind 4 saknar dessutom stop i bandet (212,60 = −2,30 %, nästa 188,30 = −13,47 %). Blir köpbar vid en rekyl in mot 195–205 med bevarad trend.

**Förra veckans bubblare:** **SKA-B.ST** – **RANKAD UNDER** (kvar som bubblare 3; katalysatorn 24/8 föll ur femdagarsfönstret, grind 3). **HNSA.ST** – **STRUKEN** (grind 3 för andra veckan: den enda posten i fönstret är fortsatt deltagande i Pareto Securities healthcare-konferens 27/8, vilket inte är en katalysator ur punkt 1a, och SEC-utkastet 2026-08-21 ligger nu 7 handelsdagar bak. Volymkvoten är 0,54× och närmaste stöd −5,93 %, alltså inget stop i bandet. Kvar i watchlisten för mätbarhet inför den extra bolagsstämman 2026-09-22, men inte längre som idé). **DFDS.CO** – **STRUKEN** (grind 3: noll träffar i 1 097 poster, andra veckan i rad, och Q2-rapporten 2026-08-14 ligger 11 handelsdagar bak. Kostnadströskelns 6 % kräver 159,21 DKK mot 250-dagarshögsta 157,10 – målet finns inte i serien. MACD-histogrammet viker femte sessionen). **KAR.ST** – **RANKAD UNDER, sista veckan** (grind 3: den strategiska översynen 2026-08-20 ligger 8 handelsdagar bak och `ma_rumor`-horisonten löper ut omkring 2026-09-10. Inget stop i bandet: 80,40 = −1,11 %, nästa 72,50 = −10,82 %. Stryks nästa rotation om inget bud eller processbesked kommer). **BAVA.CO** – **RANKAD UNDER** (kvar som bubblare 5, se ovan).

**Villkorade bubblar-planer:** **Inga.** Punkt 4b kräver fullständiga nivåer OCH ett entry-villkor för en bubblare som **i övrigt håller**, och ingen av de fem gör det: BWE.OL och BAVA.CO faller på grind 2, CADLR.OL, SKA-B.ST och KINV-B.ST på grind 3. Att lägga en pending-rad på ett case som underkänts på en grind vore att kringgå grinden. **Taket på två planer är därmed oanvänt åttonde veckan i rad** – men Pending-sektionen är INTE tom denna gång: den bär ben 2 av SALM.OL enligt punkt 4a, vilket är en annan mekanism. Noteringen från gårdagens rapport står kvar: att 4b aldrig använts sedan den byggdes 2026-08-06 bör prövas i sak, eftersom det kan bero lika mycket på att villkoren är omöjliga att uppfylla samtidigt som på urvalet.

## Veckans radar (kommande 5 handelsdagar)
* **Onsdag 2026-09-02** – **Broadcom (AVGO) Q3 FY2026** (`state/earnings_calendar.json` `upcoming`, `isEstimate: false`, `tradingDaysAway` 2, konsensus EPS 3,238 USD). Amerikanskt bolag och inget nordiskt case, men den bästa halvledarbarometern för nordiska underleverantörer i veckan (punkt 1e, värdekedjeanalys).
* **Fredag 2026-09-04** – **amerikansk sysselsättningsstatistik** (första fredagen i månaden). Makrohändelse som driver riskaptit och USD/SEK, och därmed hela den nordiska exportsektorn.
* **Löpande – laxpriset på spotmarknaden.** Veckans case är direkt exponerat: SalMars egen rapport anger lägre marknadspriser som den dämpande faktorn i Q2. En fortsatt prisnedgång punkterar tesen snabbare än något tekniskt villkor, och är det som ska bevakas i LÄGE B.
* **Uppföljning – Karnov Group (KAR.ST)** når sin `ma_rumor`-horisont omkring **2026-09-10**; ett bud eller en processuppdatering under fönstret gör caset prövbart igen, annars stryks bubblaren.
* **Redan inträffat, för bevakning i LÄGE B:** **ASA.OL** och **BAKKA.OL** rapporterade båda **2026-08-31** (`isEstimate: false`). Punkt 2e förbjöd köp in i dem och båda är avvisade på det. En kraftig reaktion blir mätbar som möjlig rekyl-setup i v37 – båda ligger i `config/watchlist.txt` och har verifierad kurs.

**L-5-markering – vad uppräkningen ovan faktiskt täcker.** Uppräkningen är gjord ur **två** källor: `state/earnings_calendar.json`, som endast känner de symboler `prices.yml` hämtar och som denna vecka bär exakt tre poster varav en amerikansk, samt `state/news_feed.json`, vars nordiska täckning är MFN-flödet med ett tak på 30 poster per källa och dygn – och som enligt åtgärdspunkt 3 systematiskt saknar varje post före 15:32 UTC. **Nordiska bolag som varken hämtas av `prices.yml` eller råkar ligga i MFN-takets efterbörskvot är därför OKONTROLLERADE**, och det gäller hela Norden utanför de 198 symboler `prices.json` nu bär. Påståendet ovan är alltså "inga fler rapporter **bland de symboler kalendern kan se**", inte "inga fler rapporter i Norden". **Samma markering gäller centralbankerna:** inget räntebesked från Riksbanken, Norges Bank eller ECB kunde beläggas i fönstret ur repots egna källor – `fed-press` bär 2 poster i femdagarsfönstret och är amerikanskt, och ingen fil i repot räknar upp de europeiska centralbankernas mötesdatum. De är därför **OKONTROLLERADE**, inte "inga".

---

## Bruttolista – samtliga 31 kandidater med namngiven spärr

| # | Ticker | Källa | catalystType | Kurs | RSI(14) | Vol× | Föll på | Namngiven spärr |
|---|---|---|---|---|---|---|---|---|
| 1 | SALM.OL | g0 news + g1 movers | earnings | 569,00 NOK | 66,6 | 2,62 | **VALD** | Klarade samtliga fem grindar – veckans enda case |
| 2 | BWE.OL | g0 news_feed (28/8) | order | 56,00 NOK | 57,3 | 6,76 | **Grind 2** | MACD-linjen under signallinjen (hist −0,19); likviditet 3,5 MSEK/dag = 0,75-procentsnivån |
| 3 | CADLR.OL | g0 news_feed (27/8) | other | 58,40 NOK | 58,9 | 1,88 | **Grind 3** | F-4 avser redomiciliering DK→UK, inte bolagskombination – ingen kategori i punkt 1a |
| 4 | PDX.ST | g0 news_feed (31/8) | buyback | 144,30 SEK | 59,8 | 0,96 | Grind 2 | Volymkvot 0,96× mot 1,5×; katalysatorn kom 18:45 UTC, efter stängning |
| 5 | TRUE-B.ST | g1 movers | other | 24,64 SEK | 81,2 | 1,21 | Grind 2 | RSI 81,2 över taket 75; drivkraften är höjda riktkurser = hype enligt punkt 1c |
| 6 | KINV-B.ST | g1 movers | other | 61,38 SEK | 64,8 | 1,33 | Grind 3 | Noll träffar i 1 097 poster; under EMA200; närmaste stöd −6,94 % |
| 7 | NIBE-B.ST | egen scanning | other | 42,75 SEK | 72,4 | 0,99 | Grind 2 | Volymkvot 0,99× mot 1,5×; RSI 72,4 över bandet |
| 8 | SINCH.ST | egen scanning | other | 46,57 SEK | 66,3 | 0,97 | Grind 2 | Volymkvot 0,97× mot 1,5× |
| 9 | NNIT.CO | g0 news_feed (27/8) | earnings | 40,70 DKK | 64,8 | 1,92 | Grind 2 | Likviditet 0,6 MSEK/dag mot golvet 3; under EMA200 |
| 10 | PARKEN.CO | g0 news_feed (28/8) | ma_rumor | 218,00 DKK | 61,7 | 0,93 | Grind 2 | Likviditet 0,7 MSEK/dag mot golvet 3 (⚠️ RYKTE, Inside Business 28/8) |
| 11 | ASA.OL | g0 news_feed (28/8) | ma_rumor | 0,76 NOK | 37,6 | 0,24 | Grind 2 | Likviditet 0,1 MSEK/dag; RSI 37,6; under alla tre EMA; budet låser uppsidan |
| 12 | BAKKA.OL | L-5 radar 260831 | earnings | 456,00 NOK | 44,7 | 5,36 | Grind 2 | RSI 44,7 under bandet, under alla tre EMA; rapport 31/8 = binär händelse (2e) |
| 13 | SKA-B.ST | g bubblare 260831 | order | 272,40 SEK | 59,1 | 1,26 | Grind 3 | Ordern 24/8 ligger 6 handelsdagar bak, utanför femdagarsfönstret |
| 14 | HNSA.ST | g bubblare 260831 | other | 43,20 SEK | 62,2 | 0,54 | Grind 3 | Konferensdeltagande 27/8 är ingen katalysator; SEC-utkastet 21/8 är 7 dagar bak |
| 15 | DFDS.CO | g bubblare 260831 | earnings | 150,20 DKK | 61,1 | 1,07 | Grind 3 | Noll träffar i 1 097 poster; Q2 14/8 är 11 handelsdagar bak |
| 16 | KAR.ST | g bubblare 260831 | ma_rumor | 81,30 SEK | 62,9 | 0,98 | Grind 3 | Strategisk översyn 20/8 är 8 handelsdagar bak; inget stop i bandet |
| 17 | BAVA.CO | g bubblare 260831 | insider | 217,60 DKK | 77,2 | 1,13 | Grind 2 | RSI 77,2 över taket 75, katalysatorn 21/8 inte längre exceptionell |
| 18 | SCA-B.ST | egen scanning | other | 114,30 SEK | 71,7 | 3,39 | Grind 3 | Ingen namngiven katalysator i fönstret trots volymkvot 3,39×; mom6m −7,0 % |
| 19 | MAERSK-B.CO | egen scanning | macro | 21 540 DKK | 65,9 | 2,14 | Grind 3 | Ingen katalysator i fönstret; kostnadströskelns 6 % ligger över 250d-högsta |
| 20 | EVO.ST | egen scanning | other | 832,60 SEK | 73,8 | 2,34 | Grind 3 | Ingen katalysator i fönstret; RSI 73,8; mål +6 % ligger över hela 250d-serien |
| 21 | VWS.CO | egen scanning | earnings | 213,80 DKK | 64,4 | 2,58 | Grind 3 | Q2 12/8 är 13 handelsdagar bak; mål +6 % ligger över 250d-högsta 216,70 |
| 22 | GRK.HE | egen scanning | other | 21,45 EUR | 60,6 | 1,92 | Grind 3 | Volymkvot 1,92× utan en enda namngiven nyhet = hype enligt punkt 1c |
| 23 | IMP-A-SDB.ST | egen scanning | regulatory | 60,20 SEK | 55,5 | 0,45 | Grind 2 | Volymkvot 0,45×, lägst i listan; FDA 20/8 är 8 handelsdagar bak |
| 24 | SUBC.OL | egen scanning | ma_rumor | 344,80 NOK | 58,2 | 1,12 | Grind 3 | Ingen ny Saipem7-händelse, nionde veckan; volymkvot 1,12× |
| 25 | NAPA.OL | g0 news_feed (25/8) | other | 43,30 NOK | 55,4 | 0,56 | Grind 3 | Teckning av optioner 25/8 är utspädning, ingen katalysator ur punkt 1a |
| 26 | BOOZT.ST | egen scanning | other | 150,00 SEK | 45,4 | 1,88 | Grind 2 | RSI 45,4 under bandet; under EMA20; MACD-histogram negativt |
| 27 | ZEAL.CO | egen scanning | insider | 300,00 DKK | 43,3 | 2,51 | Grind 2 | RSI 43,3; under alla tre EMA; MACD-histogram −2,80 och fördjupas |
| 28 | NOKIA.HE | egen scanning | buyback | 8,73 EUR | 46,3 | 1,76 | Grind 2 | RSI 46,3 under bandet; under EMA20 och EMA50 |
| 29 | MGN.OL | egen scanning | order | 22,60 NOK | 46,4 | 2,52 | Grind 2 | RSI 46,4 under bandet; under alla tre EMA |
| 30 | HAYPP.ST | egen scanning | other | 142,20 SEK | 52,4 | 0,47 | Grind 2 | Volymkvot 0,47×; MACD-histogram vänt negativt |
| 31 | KOG.OL | g0 news_feed (31/8) | other | 317,50 NOK | 54,2 | 2,22 | Grind 2 | MACD-linjen under signallinjen; mom6m −16,3 %; teckningsperiod för personalprogram är ingen katalysator |

**Så här föll de 31, per grind:**

| Grind | Antal | Andel |
|---|---|---|
| 1 – ingen verifierbar kurs | **0** | 0 % |
| 2 – teknik / volym / likviditetsgolv | **17** | 55 % |
| 3 – ingen färsk namngiven katalysator | **13** | 42 % |
| 4 – R/R under 2:1 eller ingen teknisk stop i bandet | **0** | 0 % |
| 5 – nåbarhetstaket | **0** | 0 % |
| **Vald** | **1** | 3 % |

**Jämförelsen bakåt är veckans viktigaste mätning.** v34: 9 / 12 / 6 / 0 / 0 av 27. v35: 6 / 11 / 6 / 3 / 0 av 27. v36 (i går): 10 / 8 / 10 / 0 / 0 av 28. v36-extra (i dag): **0** / 17 / 13 / 0 / 0 av 31, plus ett valt case. **Grind 1 har gått från 36 % till noll på en handelsdag**, och det är enbart en effekt av att `config/universe_nordic_movers.txt` numera är kurskälla – ingen grind, tröskel eller regel har ändrats. Att grind 2 samtidigt växer från 8 till 17 är väntat och inte en försämring: de elva symboler som i går föll på grind 1 kunde inte fällas på något annat, och sju av dem fälls nu på teknik som var omätbar i går. **Att grind 4 och 5 fortfarande fäller noll betyder inte att de är verkningslösa** – de nås bara av kandidater som passerat 1–3, och i dag var det en enda, som klarade båda.

**Kandidater som medvetet INTE poängsattes, och varför (L-6):** Finansinspektionens flaggningsmeddelanden i **Precise Biometrics** (27/8) och **Boozt** (27/8) samt korrigeringarna i **Prisma Properties** (26/8) – ett flaggningsmeddelande är en ägarförändring hos tredje part, inte en bolagshändelse, och tillhör ingen av punkt 1a:s kategorier. BOOZT.ST poängsattes ändå som teknisk kandidat och ligger i tabellen. **PREC.ST** strykes på ett sakligt skäl som skrivs ut: likviditetsgolvet, tidigare räknat till 0,78 MSEK/dag mot golvet 3. Ingen fokus- eller universumfil åberopas för någon strykning, och ingen kandidat har uteslutits med hänvisning till en formulering som inte går att citera.

**Ryktesdrivna val:** 0 av 1 (taket är 2 av 4). **Sektorkoncentration:** en position, ej tillämplig.

**Watchlist-hygien (punkt 6 och 6b):** listan går från 219 till **219 rader** – inga tillskott behövs, eftersom samtliga 31 bruttokandidater redan hämtas: elva lades in av gårdagens rotation och resten täcks av `config/universe_nordic_movers.txt`, som sedan 2026-08-31 är kurskälla. **Noll strykningar:** samtliga rader har en nordisk beslutsrad daterad högst 5 handelsdagar bakåt, och regeln rensar först vid 14. **`state/decision_eval.json`:** `missingSymbols` är **tomt** – varje tidigare loggat beslut har en kursserie att mätas mot.

**Urvalsmätningen (punkt 0 i BESLUTSDATABASEN):** `state/decision_eval.json` byggdes om efter att dagens rader lagts (`generatedAt` 2026-08-31T23:36:11Z) och bär nu **351 loggade beslut, samtliga mätbara** (`counts.missing` = 0), varav 108 fortfarande `pending`. `selectionEdge` på 5 dagars horisont är **+0,79 pp** till de köptas fördel (köpta n = 10, medelalpha +1,22 pp, slår index 60 % av gångerna; avvisade n = 208, +0,43 pp, 55,3 %) – **men talet vilar på 6 av 8 oberoende mätfönster**, bär `clusterCaveat`, och skriptets eget omdöme är "ingen skillnad utöver brus mellan köpta och avvisade". Det är alltså en RIKTNING, inte ett svar. **Radantalet 351 är inte stickprovsstorleken:** rader från samma dag delar marknadsrörelse, och dagens 32 rader landar alla på 2026-09-01, alltså ETT enda mätfönster – de gör underlaget bredare men inte mer oberoende. `poolAlpha`, `clustered` och `holdRule` säger fortfarande uttryckligen "för tidigt", och konvergenströskeln står på **5 av 20** KÖP-fönster.

---

## Beslut om det befintliga innehavet

### Indexsleeve (XACT-OMXS30.ST) – BEHÅLL, 100,0 % → 87,5 %
**Kurs:** **492,75 SEK** (`state/prices.json`, source "Yahoo Finance (chart API)", marketTime **2026-08-31T15:24:25Z** – måndagens stängning; Stockholm har inte öppnat när rotationen körs). Dagsrörelse **−0,66 %** mot `previousClose` 496,00 (`schemaVersion` "2026-08-02-prevclose" finns, så dagsrörelsen är räknad korrekt ur filen).

**Beslut och skäl:** BEHÅLL, men vikten minskas **100,0 % → 87,5 %** för att finansiera ben 1 i SALM.OL enligt punkt 4a. Fylls ben 2 minskar sleeven vidare till 75,0 %. Sleeven balanseras om vid rotationen så att summan blir 100 %; den har varken stop eller målkurs och säljs aldrig på nedgång.

**Utfall:** **−0,37 %** mot entry 494,60 (mot +0,28 % vid gårdagens rotation – hela skillnaden är måndagens indexnedgång). Loggas i `state/decisions.json` med `catalystType: "index"` så att raden filtreras bort ur urvalsstatistiken.

**Aktiepositioner:** **en ny, SALM.OL 12,5 %** (ben 1 av 2). Boken har därmed brutit nio handelsdagars ren indexexponering sedan ASSA-B.ST stoppades ut 2026-08-18.

**Pending-planer:** **en öppen rad** – ben 2 i SALM.OL, verifierad kurs ≤ 552,50 NOK, planerad vikt 12,5 %. Avförs om den inte triggat inom 5 handelsdagar.

**Brutto mot netto (punkt 4):** talen ovan är BRUTTO. Dashboardens nettosiffra drar rundturskostnaden 0,25 % per affär enligt `config/kostnader.json`. SALM.OL ligger på 104,3 MSEK/dag och därmed i den billigaste nivån, så 0,25 % är rätt tal för detta case.

---

## Åtgärdspunkter till Dren (L-3 – namngiven defekt, fil/fält och kvantifierat omfång)

**1. NY, och åtgärdad i denna körning: elva nyinlagda symboler saknade 2026-08-28 i historiken, permanent.**
*Fil/fält:* `state/price_history.json` och `state/volume_history.json`, `series[SYMBOL]`.
*Omfång:* **11 av 192 symboler** med > 200 punkter saknade 2026-08-28 – exakt de elva som hämtades för första gången i den breda körningen 2026-08-31T23:05Z (ASA.OL, BAKKA.OL, BWE.OL, CADLR.OL, KINV-B.ST, NIBE-B.ST, NNIT.CO, PARKEN.CO, SALM.OL, SINCH.ST, TRUE-B.ST). Samtliga låg på 249 punkter i stället för 250.
*Orsak, mätt:* Yahoos `range=1y` returnerar 250 staplar där den SISTA (2026-08-31) har `close: null` men en volym. `candlesToSeries` filtrerar bort null-stängningar. Vid backfill-tillfället 23:06 UTC hade uppenbarligen även 2026-08-28 en null-stängning, som därefter satts – en omkörning av `mergeSeries` mot dagens svar ger 250 punkter med 08-28 på plats. **Det farliga är inte luckan utan att den är SJÄLVLÅSANDE:** `backfill-history.mjs --missing=200` väljer bara symboler under 200 punkter, och 249 ligger över. Ingen framtida körning hade fyllt luckan.
*Effekt:* inte kosmetisk. SALM.OL:s **RSI gick 69,0 → 66,6** och **mom6m −1,5 % → +0,4 %** när luckan fylldes, alltså två av de värden grind 2 avgörs av. Med det gapade värdet hade RSI legat närmare bandtaket och mom6m varit negativt.
*Åtgärd i denna körning:* `node .github/scripts/backfill-history.mjs 1y <de elva>` kördes, +11 kurspunkter och +11 volympunkter skrevs, och samtliga elva bär nu 2026-08-28. **Kvar för Dren:** överväg att låta `--missing`-läget även plocka symboler vars serie har en LUCKA mot handelsdagskalendern, inte bara symboler som är för korta. Utan det återkommer felet vid varje ny symbol som introduceras en dag då Yahoo levererar en null-stängning.

**2. NY: kostnadströskeln 6 % är hårdkodad mot den billigaste likviditetsnivån, medan likviditetsgolvet släpper in den dyraste.**
*Fil/fält:* `prompts/dagligprompt.md` punkt 2 ("minst 6 %, dvs. ≥ 20× rundturskostnaden") mot `config/kostnader.json` → `nordic.liquidityTiers`.
*Omfång:* hela kandidatuniversumet under 20 MSEK/dag. Tröskeln 6 % är 20 × **0,25 %**, vilket enligt filens egen kommentar bara beskriver "en LIKVID large cap". Ett bolag mellan 3 och 20 MSEK/dag ligger på **0,75 %**, där 20× vore **15 %**. Konkret i dag: **BWE.OL** (3,5 MSEK/dag) hade ett strukturellt mål på +6,07 %, vilket formellt klarar tröskeln men i praktiken bara är ~8× dess faktiska rundturskostnad. Caset fälldes på grind 2 av andra skäl, så inget beslut hänger på detta i dag – men nästa gång en kandidat i den nivån når grind 4 gör det det.
*Förslag:* låt tröskeln räknas ur symbolens uppmätta medianomsättning på samma nivåer som `backtest.mjs` redan gör, i stället för att vara en konstant. Detta är samma klass av intern motsägelse som nivåtabellen kontra nåbarhetstaket, vilken rättades 2026-08-08 – och den ska inte ändras i en rapport utan i prompten.

**3. ÅTERKOMMANDE (tredje veckan): nyhetsfönstrets dygnstak tar bort varje post före den nordiska stängningen.**
*Fil/fält:* `state/news_feed.json`, taket på 30 poster per källa och dygn (`window.perSource`).
*Omfång:* taket binder för **samtliga fem dagar** i femdagarsfönstret, och `mfn`-posterna börjar tidigast **15:32–18:55 UTC** per dag (24/8 16:00, 25/8 17:08, 26/8 18:55, 27/8 16:45, 28/8 15:32, 31/8 16:30). Stockholm stänger 15:30 UTC. Punkt g0 kan alltså per konstruktion inte se ett enda nordiskt pressmeddelande som släppts före eller under handelsdagen. Veckans case räddades av en EXTERN källa (GlobeNewswire direkt), inte av flödet.
*Förslag:* låt takgallringen behålla dygnets FÖRSTA n poster lika väl som de sista (t.ex. 15 + 15), eller höj taket för `mfn` specifikt. Detta är den enskilt största kvarvarande begränsningen i kandidatgenereringen nu när grind 1 är löst.

**4. ÅTERKOMMANDE (femte veckan) och med en förklaring som nu är motbevisad: `state/movers.json` ligger en handelsdag efter.**
*Fil/fält:* `state/movers.json`, `asOf` = **2026-08-28** medan senaste handelsdag var 2026-08-31. `generatedAt` 2026-08-31T23:04:31Z, `okCount` 107 av 110.
*Omfång:* hela filen, 3 rader. **Det nya i dag:** körningen gjordes **måndag kväll**, inte på en lördag. Gårdagens rapport förklarade den kvarvarande eftersläpningen med att det var "första lördagskörningen efter `period1`/`period2`-fixen"; den förklaringen är därmed motbevisad. Eftersläpningen är systematisk och oberoende av veckodag.
*Förslag:* mät `chartUrl` med `period2` satt till körningstidpunkten mot samma symboler som i fixens verifiering och jämför sista stapeln med `prices.json`. Kvarstår luckan är felet i hur sista stapeln väljs, inte i `period`-parametrarna.

**5. ÅTERKOMMANDE (tredje veckan) och växande: symboler saknar rapportdatum i `state/earnings_calendar.json`.**
*Fil/fält:* `errors` = KABE-B.ST, MGN.OL, **PARKEN.CO** (ny), STAR-B.ST.
*Omfång:* **4 symboler, upp från 3 i går och 2 i v35.** Ingen är innehav. Fältet ska vara TOMT i friskt läge enligt kontraktet och går inte längre att larma på när det stadigt växer. Bör antingen flyttas till `notApplicable` eller accepteras som ett känt undantag med en namngiven lista.

**6. ÅTERKOMMANDE (tredje veckan): inga växelkurser för EUR, DKK och NOK.**
*Fil/fält:* `state/prices.json` bär endast `USDSEK=X` (9,5811, marketTime 2026-08-31T23:03:25Z).
*Omfång:* **17 av 31** prissatta bruttokandidater handlas i EUR, DKK eller NOK – inklusive veckans case. Likviditetsgolvet ska enligt punkt 2 räknas, inte uppskattas. Denna vecka löstes det med konservativa UNDRE gränser (11,30 SEK/EUR, 1,52 SEK/DKK, 0,94 SEK/NOK), vilket gör varje godkännande robust men lämnar varje gränsfall oavgjort. SALM.OL passerar med 35× marginal och påverkas inte.
*Förslag:* lägg `EURSEK=X`, `DKKSEK=X` och `NOKSEK=X` i `config/watchlist_us.txt` – samma hämtare, valutafiltret finns redan för `USDSEK=X`. Tre extra anrop.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
