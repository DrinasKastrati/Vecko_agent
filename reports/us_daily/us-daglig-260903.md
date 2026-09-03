# Daglig bevakning – US-rotation
**Datum:** 2026-09-03 | **Läge:** Daglig bevakning (USD)
**Marknadsläget i korthet:** Torsdag före US-öppning, efter en rekyl uppåt i onsdagens session. S&P 500 (`^GSPC`) stängde **7 666,60 (+0,46 %)** och Nasdaq Composite (`^IXIC`) **26 217,83 (+0,45 %)** (`state/prices.json`, source "Yahoo Finance (chart API)", marketTime 2026-09-02T20:42:34Z resp. 21:15:59Z; dagsrörelsen räknad ur `previousClose` i en fil som bär `schemaVersion` "2026-08-02-prevclose"). Uppgången kom brett över kohorterna – bland veckorapportens fem bubblare bar **DE +3,30 %, NVDA +3,21 %, MU +2,43 %** medan **PLTR gav tillbaka −5,81 %** och TSLA stod stilla på **+0,26 %** (samma prices.json). USD/SEK **9,5725** (marketTime 2026-09-03T12:04:51Z), **−0,44 %** på dagen. **Kvällens tyngsta enskilda signal var Broadcoms Q3 efter stängning 2026-09-02**, men reaktionen är **INTE verifierbar ur repots källor** i denna körning: `state/prices.json` bär `extendedCount: 0` och inget `extendedPrice`-fält för AVGO, `state/news_feed.json`:s sec-8k-flöde saknar en Broadcom-8-K i fönstret 20:00 UTC 2/9 → 09:54 UTC 3/9, och prompten pekar ut Yahoo Finance som reservkälla – den är otillgänglig ur körmiljön (åtgärdspunkt 4 nedan). AVGO reguljär stängning 2/9 var **367,24 USD (−0,66 %)**, alltså i praktiken oförändrad in i rapporten. **Boken äger inte AVGO och köper aldrig in i den (punkt 2e)** – utfallet är relevant för hela AI-kohortens grind 2 i nästa rotation, inte för dagens beslut.
**Pre-/after-hours:** **Inget innehav berört – boken har noll aktiepositioner.** Indexsleeven **SPY saknar `extendedPrice`-fält** i `state/prices.json` (`extendedCount: 0` för hela filen, mot 1 i går och 3 i förrgår), så ingen rörelse utanför reguljär session går att verifiera för den, och sleeven har varken stop, mål eller tidsstopp som kunde korsas. Broadcoms after-hours-reaktion på Q3-rapporten går inte att verifiera ur repots källor och citeras inte här – **åtgärdspunkt 4 återkommande** (se nedan).
**Portföljvikt & kassa:** **100 % indexsleeve (SPY)**, kassa 0 %. Fyra tomma aktieplatser, noll öppna pending-planer. Oförändrat efter dagens beslut.

---

## Innehav 1: Indexsleeve (SPY / NYSE Arca)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| 765,16 USD – `state/prices.json`, source "Yahoo Finance (chart API)", marketTime 2026-09-02T20:00:00Z, marketState `null` (reguljär stängning; US-börserna öppnar först 13:30 UTC i dag) | **−1,05 %** (entry 773,26, 2026-08-10) | – | – | **BEHÅLL** |

**Pre-/after-hours:** – (inget `extendedPrice`-fält för SPY i `state/prices.json`; `extendedCount: 0` i hela filen, ingen utökad notering går att verifiera för någon symbol i dag)
**Nyheter senaste 24h:** 2026-09-02, `state/news_feed.json` (1 151 poster, sex svarande flöden): **ingen bekräftad stor amerikansk bolagskatalysator inom fönstret 2/9 20:00 UTC → 3/9 09:54 UTC** som rör sleeven som instrument – trafiken domineras av små-bolags-PR, form-8.5-flaggningar och regionala förvärvsnotiser. **Ingen SEC 8-K från Broadcom i fönstret** (avlämnas sannolikt efter `news.yml`:s nästa körning), och veckans radar (`us-veckorapport-260901.md`) namngav AVGO Q3 som kvällens tyngsta signal – reaktionen läggs som bevakning inför imorgon i stället för att gissas fram (åtgärdspunkt 4). 2026-09-03 morgon, Trading Economics/CNBC (websök): Brent i botten av det senaste intervallet efter Iran/Oman-signaler kring Hormuz, S&P-terminer svagt positiva; **nyhetskontext, inte beslutsunderlag** (datakrav punkt 4). Ingen av dessa poster rör sleeven som instrument.
**Motivering:** Dagsrörelsen är **+0,44 %** mot `previousClose` 761,78, räknad ur en fil som bär `schemaVersion` "2026-08-02-prevclose" – det är alltså en dagsrörelse och inte en veckorörelse förklädd till en, och den stämmer mot de daterade stängningarna i `state/price_history.json` (tis 1/9 761,78 → ons 2/9 765,16). Sleeven har varken stop-loss eller målkurs och **säljs aldrig på nedgång**; den är kapitalparkering, inte ett case, och en enskild sessions rörelse i endera riktningen är därför inget beslutsunderlag. Med noll köp och noll sälj i dagens körning kräver ingen aktievikt någon förändring, och de fyra tomma platserna ligger kvar i index enligt punkt 0c – att parkera i SPY när inget case håller måttet är en aktiv handling, inte ett uteblivet beslut. Loggas i `state/decisions.json` med `catalystType: "index"` så att raden filtreras bort ur urvalsstatistiken.

---

## Pending-planer

**Inga öppna pending-planer.** Samtliga fem rader i `state/portfolj_us.md`:s Pending-sektion är strukna och avgjorda sedan tidigare: XOM (ben 2) och TGT avförda 2026-08-26 på sin femte handelsdag utan trigger, MU triggad 2026-08-18, NVDA triggad 2026-08-10, PLTR avförd 2026-08-17. Raderna raderas aldrig. Ingen nivå finns alltså att pröva mot dagens kurser, och monitorn kan inte larma på en redan avförd nivå.

## Åtgärder i portfolj_us.md

**Inga ändringar i innehav, vikter eller historik – endast "Senast uppdaterad" är uppdaterad.** Noll köp, noll sälj, noll flyttar till Historik. Ackumulerad avkastning står oförändrad på **−2,87 %** (tre stängda affärer: NVDA −4,30 % på 25,0 %, MU −5,79 % på 25,0 %, XOM −2,97 % på 12,5 %) – fältet räknas om direkt vid varje SÄLJ enligt LÄGE B punkt 8, och utan SÄLJ finns inget att räkna om.

## Punkt 2d – Scout-kandidater (`state/scout_candidates.json`)

**Filen bär noll poster med `status: "new"`** (23 poster totalt, samtliga `rejected`, `promoted` eller utlöpta). Ingen kandidat ska alltså avgöras i dag och ingen lämnas kvar – kravet är uppfyllt genom att kön är tom, inte genom att den förbigås. Dagens scout-körning har inte skrivit någon ny kandidat i fönstret som föregår denna körning; om `reports/scout/rapport-260903.md` senare bär case skrivs de in vid nästa körning.

**L-4-kontroll (avvisad på TILLFÄLLIGT datavillkor?): ingen post kvalificerar.** De två kandidater som fortfarande ligger inom sin `expiresAt` avvisades båda på **omdömesgrindar** med verifierad kurs, inte på "kurs ej verifierbar". Posten `260827-NVDA` **löper ut i dag** (`expiresAt` 2026-09-03) och prövas i övrigt inte om – den är redan avgjord.

| Kandidat | `expiresAt` | Spärr vid avvisningen | L-4 tillämplig? |
|---|---|---|---|
| `260827-NVDA` | 2026-09-03 (löper ut i dag) | Tekniska filtret punkt 2 (under EMA20 **och** EMA50, MACD-hist −1,538, RSI 45,8) – med verifierad kurs | **Nej** – kursen fanns |
| `260901-CVX` | 2026-09-08 | Grind 2 (MACD-linjen 3,909 under signallinjen 4,198); andra ledet grind 4 | **Nej** – kursen fanns |
| `260901-DE` | 2026-09-08 | Grind 3 (analytikeruppgradering är stödsignal per punkt 1c, inte katalysator per 1a); andra ledet grind 4 | **Nej** – kursen fanns |

L-4 omfattar uttryckligen **endast** spärrar vars orsak är data som hunnit ikapp, och slår fast att en kandidat som avvisats av omdömesskäl "omfattas ALDRIG" och prövas om först vid nästa veckorotation. Ingen omprövning görs alltså i dag, och ingen ny rad skrivs för de tre – ett andra avgörande utan ny data vore en uppmjukning, inte ett beslut. **Att `260901-CVX` och `260901-DE` båda steg vidare i går (CVX +0,35 % till 211,78, DE +3,30 % till 698,37) ändrar ingenting – utan ny fundamental print är fortsatt uppgång facit-bias, inte ny information.**

## Punkt 4 (a), (b) och (c) – ersättningsköp och triggade planer

**Ej tillämpliga.** (a) förutsätter att en position sålts i förtid och ska ersättas – boken har noll aktiepositioner och sålde inget i dag. (b) förutsätter ett triggat entry-villkor ur veckorapporten – `us-veckorapport-260901.md` lade **inga** villkorade planer och det finns därför ingen "BEN 2"-rad som kan fyllas. (c) förutsätter en villkorad BUBBLAR-plan i Pending som triggats – Pending-sektionen har noll öppna rader. **(d)** täcks av punkt 2d ovan: tom kandidatkö.

## Punkt 4 – villkorad plan för en prissatt bubblare (tillägget 2026-08-06)

**Prövad en gång, faller på villkor 1 för samtliga fem bubblare – samma utfall som i går.** Regeln kräver att den senaste us-veckorapporten uttryckligen angav **saknad verifierad kurs** som skälet att bubblaren inte fick en pending-rad. `us-veckorapport-260901.md` säger motsatsen ordagrant: *"Villkorade bubblar-planer: **Inga.** … ingen av de fem gör det: TSLA och DE faller på grind 3, MU, NVDA och PLTR på grind 2."* Samtliga fem föll alltså på **omdömesskäl**, och veckans mätning är dessutom att **grind 1 fällde noll av 32 kandidater** – ingen bubblare stoppades av kursförsörjning, och därmed finns ingen bubblare som villkoret kan gälla. Punkt 4 är kategorisk: *"en bubblare som rankades under av OMDÖMESSKÄL … omfattas ALDRIG"*. Villkor 2 (verifierad kurs), 5 (regimen PÅ) och 6 (fyra lediga platser, noll planer mot taket två) håller alla i dag – det ändrar ingenting, eftersom villkoren är kumulativa och villkor 1 är den som faller.

| Bubblare | Kurs 2026-09-02 (marketTime 20:00Z) | Dag | RSI(14) | Veckorapportens spärr | Villkor 1 |
|---|---|---|---|---|---|
| TSLA | 357,01 | +0,26 % | 53,4 | Grind 3 (SpaceX-beskedet är hype enligt punkt 1c) | **Faller** |
| DE | 698,37 | +3,30 % | 70,2 | Grind 3 (uppgradering ≠ katalysator per punkt 1a) | **Faller** |
| MU | 956,08 | +2,43 % | 53,2 | Grind 2 (volymkvot 0,74× mot 1,5×) | **Faller** |
| NVDA | 224,41 | +3,21 % | 56,7 | Grind 2 (MACD under signalen, volymkvot 0,97×) | **Faller** |
| PLTR | 169,46 | −5,81 % | 52,2 | Grind 2 (volymkvot 0,56× mot 1,5×) | **Faller** |

Avgörandet loggas i `state/decisions.json` oavsett utfall, enligt regelns eget krav: **fem AVVAKTA-rader med den namngivna spärren** (TSLA, DE, MU, NVDA, PLTR). **Att DE, NVDA och MU steg brant i går utan att ha ny fundamental print ändrar inte veckorapportens grind** – uppgången kom brett över AI-kohorten och Deere-namnen samtidigt, vilket är regimlyft och inte ny bolagsspecifik information. Facit-bias vore att skriva om spärren för de tre som steg och lämna spärren för TSLA och PLTR intakt.

### Regimfilter och datastatus

| Kontroll | Utfall |
|---|---|
| **Regimfilter (punkt 2b)** | **PÅ.** ^GSPC 7 666,60 > MA200 **7 131,44**, marginal **+7,50 %** (mot +7,08 % i går), räknat på 250 daterade stängningar i `state/price_history.json`. Nya positioner är tillåtna; regimen är inte dagens spärr. |
| **`state/prices.json`** | **Färsk.** `generatedAt` **2026-09-03T12:04:56Z** (~1,4 h gammal), `schemaVersion` "2026-08-02-prevclose", `tickerCount` **118**, `okCount` **116**, `extendedCount` **0**. `wideAt` **2026-09-03T09:43:02Z** – dygnsgrindens breda hämtning HAR körts i dag; de 118 symbolerna kommer alltså ur en smal körning senare på förmiddagen, inte ur att den breda uteblivit. |
| **Intradag-monitorn (punkt 2c2)** | **Frisk.** `state/alerts.json` bär `checkedAt` **2026-09-03T11:57:07Z**, alltså ~1,5 h gammalt och långt under 6-timmarsgränsen. `active` är **tom** – den tomma listan får därför läsas som "lugnt", inte som "monitorn är död". `watched` innehåller SPY, så sleeven bevakas trots att den saknar nivåer att korsa. Ingen aktiv signal rör US-boken. |
| **`state/news_feed.json`** | **Frisk.** `generatedAt` 2026-09-03T09:54:45Z, fönstret täcker **10 av 10 handelsdagar** med `missingDays` **tom**, 1 151 poster. Samtliga sex flöden svarar: globenewswire 20, globenewswire-earnings 20, prnewswire 20, mfn 48, sec-8k 40, fed-press 20. **Fönstret sträcker sig från 20 augusti till 3 september 09:54 UTC** – Broadcoms 8-K från gårdagens Q3-rapport (efter 20:00 UTC) ligger utanför sec-8k-flödets fönster och saknas därför i filen. |
| **`state/earnings_calendar.json`** | **Frisk.** `generatedAt` 2026-09-03T09:41:44Z, `errors` **tomt objekt**, `upcoming` **tom** – AVGO 2026-09-02 har passerat och nästa post ligger utanför 10-dagarshorisonten. |
| **`state/decision_eval.json`** | `generatedAt` 2026-09-03T12:04:56Z, `missingSymbols` **tom** – varje symbol med en rad i beslutsloggen går att mäta. Punkt 6b kräver därför inget tillägg i `config/watchlist_us.txt` i dag; SPY, TSLA, DE, MU, NVDA och PLTR ligger alla redan där. Inget tal ur filen citeras i dag, så `effectiveN`-kravet aktualiseras inte. |
| **Watchlist-hygien (punkt 6)** | Genomgången, **inga tillägg och inga rensningar**. Listan bär medvetet över riktmärket ≤ 25 symboler: index `^GSPC`/`^IXIC`/`^OMX` och sleeven SPY är skyddade av punkt 6, och varje övrig rad är antingen nämnd inom 14 handelsdagar eller skyddad av punkt 6b (en symbol med rad i `decisions.json` måste gå att prissätta) respektive L-2/L-5. Dagens fem bubblare och dagens kandidatnamn ligger alla redan i filen. |

**Tillämpade lärdomar:** **L-3** (fyra öppna åtgärdspunkter förs vidare med fil, fält och kvantifierat omfång; punkt 4 – reservkällan onåbar – är dessutom **ÅTERKOMMANDE** eftersom den beskrevs i `us-daglig-260902.md` utan att vara åtgärdad), **L-4** (varje icke-utlöpt `rejected`-kandidat kontrollerad mot regelns avgränsning till TILLFÄLLIGA dataspärrar; ingen kvalificerar, och det redovisas per post i stället för att tigas), **L-5** (varje "inga fler …"-formulering nedan bär källa och täckningsangivelse, och den otäckta delen märks OKONTROLLERAD), **L-6** (ingen kandidat eller kandidatklass utesluts ur poängsättningen med hänvisning till en fokus- eller universumfil; de spärrar som avgör i dag citeras ordagrant ur `prompts/us_dagligprompt.md` och ur `us-veckorapport-260901.md`).

### Åtgärdspunkter till Dren (L-3 – namngiven defekt, fil/fält och kvantifierat omfång)

**1. ÖPPEN sedan 2026-09-01 (ej återkommande i dag – ingen kandidat avgjordes på grind): `prompts/us_dagligprompt.md` definierar "de fem grindarna" på två oförenliga sätt.**
*Fil/fält:* punkt 2d (f) mot LÄGE A punkt 2 och 3 i samma fil.
*Omfång:* varje scout-kandidat som avgörs i LÄGE B – 20 av 23 poster i `state/scout_candidates.json` har avgjorts den vägen. Parentesen i 2d (f) räknar upp fem kriterier **utan** MACD-, EMA-, volym- och likviditetskraven, medan LÄGE A:s grind 2 bär hela det tekniska filtret.
*Status i dag:* **inte utlöst** – kandidatkön var tom, så ingen grindtilldelning gjordes. Punkten kvarstår oåtgärdad och märks inte ÅTERKOMMANDE, eftersom den inte påverkade ett beslut i denna körning.

**2. ÖPPEN sedan 2026-09-01: kostnadströskeln och kravet på ett motstånd att ankra målet i kan vara ömsesidigt uteslutande.**
*Fil/fält:* `prompts/us_dagligprompt.md`, NIVÅER punkt 2 (mål ≥ 8 %) och punkt 5:s katalysatortabell, mot LÄGE A punkt 2 ("närmaste … motstånd (bas för mål)").
*Omfång:* 3 av 34 bedömda US-kandidater 31/8–1/9 (CVX, DE, NVDA) – samtliga stora, likvida bolag nära egna toppar.
*Status i dag:* **inte utlöst** – inga nivåer sattes. Kvarstår oåtgärdad.

**3. ÖPPEN sedan 2026-09-02: två rapporter i repot anger olika datum för augusti-NFP, och ingetdera går att verifiera ur state.**
*Fil/fält:* `reports/scout/rapport-260902.md` ("augusti-NFP (5/9)") mot `reports/us_daily/us-daglig-260901.md` ("Fredag 2026-09-04 – amerikansk sysselsättningsstatistik (NFP)").
*Omfång:* 1 av 1 makrodatum i utsikterna; **2026-09-05 är en lördag** (2026-09-04 är veckans fredag), så minst en av de två uppgifterna är fel, och båda är hämtade ur allmänt känd kalender utan stöd i repots källor. `state/news_feed.json`:s `fed-press`-flöde bär inga poster om vare sig NFP eller FOMC i fönstret, och `state/earnings_calendar.json` känner bara bolagsrapporter.
*Varför det spelar roll:* rapportförbudet i punkt 2e och binärhändelse-spärren i punkt 2d (d) räknas i **handelsdagar från ett datum**. Ett datum som skiljer en dag mellan två routiner kan flytta en händelse in i eller ut ur tvådagarsfönstret, och skillnaden syns inte i någon fil.
*Förslag:* samma åtgärd som scoutens stående datanotis 2 – ett makro-/kalenderflöde i news-actionen, så att BLS- och FOMC-datum kan citeras ur state i stället för ur minnet. Till dess ska varje makrodatum i båda rotationerna märkas som ej verifierat ur repots källor (L-5), vilket görs nedan.

**4. ÖPPEN sedan 2026-09-02, ÅTERKOMMANDE: reservkällan som datakrav punkt 2 pekar ut är onåbar från routinens körmiljö, och blockerar i dag verifieringen av kvällens tyngsta signal.**
*Fil/fält:* `prompts/us_dagligprompt.md`, KRAV PÅ FÄRSK DATA punkt 2 ("Reservkälla: Yahoo Finance https://finance.yahoo.com/quote/<TICKER> (visar Pre-Market/After-Hours)") och punkt 3 (samma reservkälla för inaktuell kurs).
*Omfång:* i dag **1 av 1** namngiven binär händelse med reaktion utanför reguljär session (AVGO Q3 efter stängning 2026-09-02) – reaktionen är veckans viktigaste enskilda signal för hela AI-kohorten enligt `us-veckorapport-260901.md`, och **den går inte att verifiera** ur repots källor: `state/prices.json` bär `extendedCount: 0` (inget `extendedPrice` för AVGO trots att bolaget rapporterade), `state/news_feed.json`:s sec-8k-flöde slutar 09:54 UTC 2026-09-03 utan Broadcom-8-K, och prompten pekar ut `finance.yahoo.com` som reservkälla. Dessutom är åtgärdspunkten från i går även generell: **4 av 4 försökta värdar** i tidigare körningar svarade `EGRESS_BLOCKED` vid direkthämtning – `finance.yahoo.com`, `www.cnbc.com`, `tradingeconomics.com` och `www.schwab.com`.
*Varför det spelar roll:* i dag är den **bindande** – veckorapportens `us-veckorapport-260901.md` namnger AVGO-reaktionen som avgörande för om AI-kohortens grind 2 öppnar i v37, och en icke-verifierbar signal är sämre än en obekväm sådan, eftersom nästa rotation då fattar beslut ur allmänt känt sentiment i stället för mätt data. `extendedCount` föll dessutom från **3 (1/9) → 1 (2/9) → 0 (3/9)** över tre dagar utan tekniskt fel, vilket tyder på att Yahoos svar innehåller ett `preMarketPrice`/`postMarketPrice`-fält bara när sessionen är öppen – aldrig retroaktivt i mellandagsfönstret.
*Förslag:* antingen skriv ut i prompten att `extendedPrice`/`extendedSession` i `state/prices.json` ÄR reservkällan i denna miljö (och att avsaknad av fältet ska redovisas som "ej verifierbar" snarare än sökas upp manuellt), eller låt `fetch-prices.mjs` hämta utökade noteringar för samtliga innehav och pending-tickers i en dedikerad körning direkt efter kända rapporttider, inte bara de värden Yahoo råkar leverera i den vanliga cronen.

## Bevakning inför imorgon

* **AVGO-reaktionen efter Q3-rapporten 2/9 AMC** – ovan citerade veckorapport pekade ut kvällen som veckans viktigaste enskilda signal för hela AI-kohorten (NVDA, AMD, TSM, MRVL, MU, AMAT). Reaktionen är i skrivande stund **inte verifierbar ur repots källor** (åtgärdspunkt 4). Efter Q2-rapporten 3/6 föll aktien −12,6 % på en beat, enbart för att FY27-målet ">100 mdr USD AI" inte höjdes; om samma mönster upprepas i dag håller AI-kohortens grind 2 stängd in i v37, och om reaktionen är positiv öppnar den. **Boken agerar inte förrän tesen kan avläsas i verifierad reguljär stängning** – ett direktbeslut i pre-market vore rakt igenom åtgärdspunkt 4:s spärr.
* **Fredag 2026-09-04 – amerikansk sysselsättningsstatistik (augusti-NFP).** Veckans tyngsta makroavläsning. **Datumet är INTE verifierat ur repots källor** – se åtgärdspunkt 3; `reports/scout/rapport-260902.md` anger 5/9, vilket är en lördag.
* **Löpande – Hormuz.** Brent handlades i går kring 95 USD/fat efter fartygsträffen 1/9; scenariovägen för olje- och räntekomplexet är oförändrad. En varaktigt högre olja är samtidigt en inflationsrisk som trycker upp räntan – samma kraft som drog ned index i tisdags och som backade lite i onsdags. Nyhetskontext, inte beslutsunderlag.
* **Onsdag 2026-09-16 (utanför fönstret) – FOMC-besked.** Ingen position tas med horisont förbi det utan explicit motivering. Datumet är hämtat ur allmänt känd kalender och **inte verifierat ur repots egna källor** (åtgärdspunkt 3).
* **Torsdag 2026-09-24 (utanför fönstret, för planering)** – **Teslas Semi-event**, annonserat 2026-08-27. Nämns här enligt L-1 så att en reaktion blir mätbar, inte som köpskäl.

**L-5-markering – vad uppräkningen ovan täcker.** Rapportuppräkningen är gjord ur `state/earnings_calendar.json`, som **endast känner de symboler `prices.yml` hämtar** och som i dag bär noll poster i `upcoming`. Katalysatoruppräkningen är gjord ur `state/news_feed.json`, vars amerikanska täckning är `sec-8k`, `prnewswire`, `globenewswire` och `fed-press` med ett tak på 30 poster per källa och dygn. **Amerikanska bolag som varken prisbevakas eller ryms inom dygnskvoten är därmed OKONTROLLERADE** – påståendet ovan är "ingen bekräftad stor bolagskatalysator bland de poster fönstret kan se", inte "inga katalysatorer i USA". NFP 4/9, FOMC 16/9 och Semi-event 24/9 är hämtade ur allmänt känd kalender och **inte verifierade ur repots källor**; `fed-press` bär inga poster om dem i fönstret. Brent- och räntenivåerna i marknadsläget kommer ur namngivna externa medier via websök och är **nyhetskontext, inte beslutsunderlag** – inget kursbaserat beslut i denna rapport vilar på dem, i enlighet med datakrav punkt 4.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
