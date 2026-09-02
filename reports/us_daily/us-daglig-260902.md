# Daglig bevakning – US-rotation
**Datum:** 2026-09-02 | **Läge:** Daglig bevakning (USD)
**Marknadsläget i korthet:** Onsdag före US-öppning, efter en bred risk-off-session i tisdags. S&P 500 (`^GSPC`) stängde **7 631,47 (−0,71 %)** och Nasdaq Composite (`^IXIC`) **26 099,773 (−1,03 %)** (`state/prices.json`, source "Yahoo Finance (chart API)", marketTime 2026-09-01T20:45:36Z resp. 21:15:59Z; dagsrörelsen räknad ur `previousClose` i en fil som bär `schemaVersion` "2026-08-02-prevclose"). **Två krafter drar åt samma håll och båda är räntedrivna:** den amerikanska 10-årsräntan noterades till **4,814 %**, högsta nivån sedan november 2023 (CNBC 2026-09-01, via sökträff – artikeln kunde inte hämtas, se datanotis 2), och **Brent handlas kring 95 USD/fat**, den högsta nivån på nästan sex veckor, sedan **en handelsfartyg träffats av minst tre projektiler den 2026-09-01 vid utloppet ur Hormuzsundet, ~17 nautiska mil öster om Khasab i Oman** (GeoBit AI / UKMTO-rådgivning 2026-09-01; Trading Economics 2026-09-02). Terminerna pekar svagt ned in i öppningen (S&P 500 −0,2 %, Nasdaq 100 −0,6 %, Dow −66 punkter; Trading Economics/CNBC 2026-09-02). USD/SEK **9,6317** (marketTime 2026-09-02T12:05:58Z), +0,58 % på dagen. **Dagens enda bekräftade binära händelse är Broadcoms rapport i kväll (2/9 AMC)** – boken äger inte AVGO och köper aldrig in i den (punkt 2e).
**Pre-/after-hours:** **Inget innehav berört – boken har noll aktiepositioner.** Indexsleeven **SPY saknar `extendedPrice`-fält** i `state/prices.json`; ingen rörelse utanför reguljär session går att verifiera för den, och den har varken stop, mål eller tidsstopp som kunde korsas. Filen bär **exakt en** utökad notering (`extendedCount: 1`) och den är inte ett innehav: **AVGO 369,38 USD** (`extendedSession: "pre"`, extendedTime 2026-09-02T12:05:17Z) mot den reguljära stängningen 369,68, alltså **−0,08 %** – i praktiken oförändrad inför den egna rapporten i kväll. Ingen after-hours-rapport från gårdagens stängning berör boken.
**Portföljvikt & kassa:** **100 % indexsleeve (SPY)**, kassa 0 %. Fyra tomma aktieplatser, noll öppna pending-planer. Oförändrat efter dagens beslut.

---

## Innehav 1: Indexsleeve (SPY / NYSE Arca)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| 761,78 USD – `state/prices.json`, source "Yahoo Finance (chart API)", marketTime 2026-09-01T20:00:00Z, marketState `null` (reguljär stängning; US-börserna öppnar först 13:30 UTC i dag) | **−1,48 %** (entry 773,26, 2026-08-10) | – | – | **BEHÅLL** |

**Pre-/after-hours:** – (inget `extendedPrice`-fält för SPY i `state/prices.json`; ingen utökad notering går att verifiera)
**Nyheter senaste 24h:** 2026-09-01, GeoBit AI / UKMTO: handelsfartyg träffat av minst tre projektiler vid utloppet ur Hormuzsundet (~17 nm öster om Khasab, Oman) – Brent kring 95 USD, högsta på nästan sex veckor (Trading Economics 2026-09-02). 2026-09-01/2026-09-02, CNBC: 10-årsräntan på 4,814 %, högsta sedan november 2023, med stigande oljepris som uttalad inflationsoro; S&P 500-terminer kring nollstrecket till −0,2 %. 2026-09-02, `state/news_feed.json` (1 117 poster, sex svarande flöden): **ingen bekräftad stor amerikansk bolagskatalysator** i fönstret 1–2/9 – de 202 posterna från 1/9 och framåt är småbolags-PR, förvärv utan materiell storlek (Adecoagro/Caarapó, Kongsberg/Sonatech) och produktnyheter (ASUS/NVIDIA RTX på IFA). Ingen av nyheterna rör sleeven som instrument.
**Motivering:** Dagsrörelsen är **−0,69 %** mot `previousClose` 767,05, räknad ur en fil som bär `schemaVersion` "2026-08-02-prevclose" – det är alltså en dagsrörelse och inte en veckorörelse förklädd till en, och den stämmer mot de daterade stängningarna i `state/price_history.json` (mån 31/8 767,05 → tis 1/9 761,78). Sleeven har varken stop-loss eller målkurs och **säljs aldrig på nedgång**; den är kapitalparkering, inte ett case, och två sessioners nedgång är därför inget beslutsunderlag. Med noll köp och noll sälj i dagens körning kräver ingen aktievikt någon förändring, och de fyra tomma platserna ligger kvar i index enligt punkt 0c – att parkera i SPY när inget case håller måttet är en aktiv handling, inte ett uteblivet beslut. Loggas i `state/decisions.json` med `catalystType: "index"` så att raden filtreras bort ur urvalsstatistiken.

---

## Pending-planer

**Inga öppna pending-planer.** Samtliga fem rader i `state/portfolj_us.md`:s Pending-sektion är strukna och avgjorda sedan tidigare: XOM (ben 2) och TGT avförda 2026-08-26 på sin femte handelsdag utan trigger, MU triggad 2026-08-18, NVDA triggad 2026-08-10, PLTR avförd 2026-08-17. Raderna raderas aldrig. Ingen nivå finns alltså att pröva mot dagens kurser, och monitorn kan inte larma på en redan avförd nivå.

## Åtgärder i portfolj_us.md

**Inga ändringar i innehav, vikter eller historik – endast "Senast uppdaterad" är uppdaterad.** Noll köp, noll sälj, noll flyttar till Historik. Ackumulerad avkastning står oförändrad på **−2,87 %** (tre stängda affärer: NVDA −4,30 % på 25,0 %, MU −5,79 % på 25,0 %, XOM −2,97 % på 12,5 %) – fältet räknas om direkt vid varje SÄLJ enligt LÄGE B punkt 8, och utan SÄLJ finns inget att räkna om.

## Punkt 2d – Scout-kandidater (`state/scout_candidates.json`)

**Filen bär noll poster med `status: "new"`** (23 poster totalt, samtliga `rejected`, `promoted` eller utlöpta). Ingen kandidat ska alltså avgöras i dag och ingen lämnas kvar – kravet är uppfyllt genom att kön är tom, inte genom att den förbigås. Dagens scout-körning (`reports/scout/rapport-260902.md`, kl. 07:47 CEST) skrev **medvetet inga nya kandidater** och motiverar det i klartext: de två levande katalysatorerna (Hormuz-oljepremien och Baird-uppgraderingen av Deere) avgjordes båda av den här boken i går och ligger `rejected` med öppen `expiresAt` 2026-09-08 – att re-flagga dem dagen efter, enbart för att de steg vidare (CVX +2,38 % till 211,05, DE +3,23 % till 676,08), vore facit-bias och en dubblett inom samma kandidatposts giltighetstid.

**L-4-kontroll (avvisad på TILLFÄLLIGT datavillkor?): ingen post kvalificerar.** De tre kandidater som fortfarande ligger inom sin `expiresAt` avvisades samtliga på **omdömesgrindar**, inte på "kurs ej verifierbar":

| Kandidat | `expiresAt` | Spärr vid avvisningen | L-4 tillämplig? |
|---|---|---|---|
| `260827-NVDA` | 2026-09-03 | Tekniska filtret punkt 2 (under EMA20 **och** EMA50, MACD-hist −1,538, RSI 45,8) – med verifierad kurs | **Nej** – kursen fanns |
| `260901-CVX` | 2026-09-08 | Grind 2 (MACD-linjen 3,909 under signallinjen 4,198); andra ledet grind 4 | **Nej** – kursen fanns |
| `260901-DE` | 2026-09-08 | Grind 3 (analytikeruppgradering är stödsignal per punkt 1c, inte katalysator per 1a); andra ledet grind 4 | **Nej** – kursen fanns |

L-4 omfattar uttryckligen **endast** spärrar vars orsak är data som hunnit ikapp, och slår fast att en kandidat som avvisats av omdömesskäl "omfattas ALDRIG" och prövas om först vid nästa veckorotation. Ingen omprövning görs alltså i dag, och ingen ny rad skrivs för de tre – ett andra avgörande utan ny data vore en uppmjukning, inte ett beslut.

## Punkt 4 (a), (b) och (c) – ersättningsköp och triggade planer

**Ej tillämpliga.** (a) förutsätter att en position sålts i förtid och ska ersättas – boken har noll aktiepositioner och sålde inget i dag. (b) förutsätter ett triggat entry-villkor ur veckorapporten – `us-veckorapport-260901.md` lade **inga** villkorade planer och det finns därför ingen "BEN 2"-rad som kan fyllas. (c) förutsätter en villkorad BUBBLAR-plan i Pending som triggats – Pending-sektionen har noll öppna rader. **(d)** täcks av punkt 2d ovan: tom kandidatkö.

## Punkt 4 – villkorad plan för en prissatt bubblare (tillägget 2026-08-06)

**Prövad en gång, faller på villkor 1 för samtliga fem bubblare.** Regeln kräver att den senaste us-veckorapporten uttryckligen angav **saknad verifierad kurs** som skälet att bubblaren inte fick en pending-rad. `us-veckorapport-260901.md` säger motsatsen ordagrant: *"Villkorade bubblar-planer: **Inga.** … ingen av de fem gör det: TSLA och DE faller på grind 3, MU, NVDA och PLTR på grind 2."* Samtliga fem föll alltså på **omdömesskäl**, och veckans mätning är dessutom att **grind 1 fällde noll av 32 kandidater** – ingen bubblare stoppades av kursförsörjning, och därmed finns ingen bubblare som villkoret kan gälla. Punkt 4 är kategorisk: *"en bubblare som rankades under av OMDÖMESSKÄL … omfattas ALDRIG"*. Villkor 2 (verifierad kurs), 5 (regimen PÅ) och 6 (fyra lediga platser, noll planer mot taket två) håller alla i dag – det ändrar ingenting, eftersom villkoren är kumulativa och villkor 1 är den som faller.

| Bubblare | Kurs 2026-09-01 (marketTime 20:00Z) | Dag | RSI(14) | Veckorapportens spärr | Villkor 1 |
|---|---|---|---|---|---|
| TSLA | 356,09 | −3,22 % | 53,1 | Grind 3 (SpaceX-beskedet är hype enligt punkt 1c) | **Faller** |
| DE | 676,08 | +3,23 % | 66,2 | Grind 3 (uppgradering ≠ katalysator per punkt 1a) | **Faller** |
| MU | 933,44 | −2,64 % | 50,4 | Grind 2 (volymkvot 0,74× mot 1,5×) | **Faller** |
| NVDA | 217,44 | −1,51 % | 51,9 | Grind 2 (MACD under signalen, volymkvot 0,97×) | **Faller** |
| PLTR | 179,92 | −3,47 % | 61,9 | Grind 2 (volymkvot 0,56× mot 1,5×) | **Faller** |

Avgörandet loggas i `state/decisions.json` oavsett utfall, enligt regelns eget krav: **fem AVVAKTA-rader med den namngivna spärren** (TSLA, DE, MU, NVDA, PLTR). **DE får i dag en egen rad** – i går täcktes den av sin scout-kandidatrad, men i dag finns ingen kandidatrad att täckas av, och utan rad vore avgörandet osynligt för `decision_eval.mjs`. Fyra av fem föll tillbaka i tisdagssessionen; **DE är den enda som steg**, och en fortsatt uppgång utan ny fundamental print ändrar inte grind 3 – det är facit-bias, inte ny information.

### Regimfilter och datastatus

| Kontroll | Utfall |
|---|---|
| **Regimfilter (punkt 2b)** | **PÅ.** ^GSPC 7 631,47 > MA200 **7 126,79**, marginal **+7,08 %** (mot +7,91 % i går), räknat på 250 daterade stängningar i `state/price_history.json`. Nya positioner är tillåtna; regimen är inte dagens spärr. |
| **`state/prices.json`** | **Färsk.** `generatedAt` **2026-09-02T12:06:04Z** (~1 h gammal), `schemaVersion` "2026-08-02-prevclose", `tickerCount` **123**, `okCount` **121**, `extendedCount` **1**. `wideAt` **2026-09-02T09:33:49Z** – dygnsgrindens breda hämtning HAR körts i dag, alltså gör det lägre `tickerCount` (123 mot veckorotationens 198) att den smala körningen skrivit sist, inte att den breda uteblivit. |
| **Intradag-monitorn (punkt 2c2)** | **Frisk.** `state/alerts.json` bär `checkedAt` **2026-09-02T11:58:00Z**, alltså ~1,4 h gammalt och långt under 6-timmarsgränsen. `active` är **tom** – den tomma listan får därför läsas som "lugnt", inte som "monitorn är död". `watched` innehåller SPY, så sleeven bevakas trots att den saknar nivåer att korsa. Ingen aktiv signal rör US-boken. |
| **`state/news_feed.json`** | **Frisk.** `generatedAt` 2026-09-02T09:41:33Z, fönstret täcker **10 av 10 handelsdagar** med `missingDays` **tom** (äldsta 2026-08-20, nyaste 2026-09-02), 1 117 poster. Samtliga sex flöden svarar: globenewswire 20, globenewswire-earnings 20, prnewswire 20, mfn 48, sec-8k 40, fed-press 20. |
| **`state/earnings_calendar.json`** | **Frisk.** `generatedAt` 2026-09-02T09:32:47Z, `errors` **tomt objekt**, `upcoming` bär **exakt en** post: **AVGO 2026-09-02**, `isEstimate: false`, `tradingDaysAway: 0`, EPS-konsensus 3,238 (3,08–3,33), omsättning ~29,43 mdr USD. |
| **`state/decision_eval.json`** | `generatedAt` 2026-09-02T12:06:04Z, `missingSymbols` **tom** – varje symbol med en rad i beslutsloggen går att mäta. Punkt 6b kräver därför inget tillägg i `config/watchlist_us.txt` i dag; SPY, TSLA, DE, MU, NVDA och PLTR ligger alla redan där. Inget tal ur filen citeras i dag, så `effectiveN`-kravet aktualiseras inte. |
| **Watchlist-hygien (punkt 6)** | Genomgången, **inga tillägg och inga rensningar**. Listan bär medvetet över riktmärket ≤ 25 symboler: index `^GSPC`/`^IXIC`/`^OMX` och sleeven SPY är skyddade av punkt 6, och varje övrig rad är antingen nämnd inom 14 handelsdagar eller skyddad av punkt 6b (en symbol med rad i `decisions.json` måste gå att prissätta) respektive L-2/L-5. Dagens fem bubblare och dagens kandidatnamn ligger alla redan i filen. |

**Tillämpade lärdomar:** **L-3** (två öppna åtgärdspunkter förs vidare med fil, fält och kvantifierat omfång, plus en ny med samma uppgifter – ingen defekt avfärdas som "känd sedan tidigare"), **L-4** (varje icke-utlöpt `rejected`-kandidat kontrollerad mot regelns avgränsning till TILLFÄLLIGA dataspärrar; ingen kvalificerar, och det redovisas per post i stället för att tigas), **L-5** (varje "inga fler …"-formulering nedan bär källa och täckningsangivelse, och den otäckta delen märks OKONTROLLERAD), **L-6** (ingen kandidat eller kandidatklass utesluts ur poängsättningen med hänvisning till en fokus- eller universumfil; de spärrar som avgör i dag citeras ordagrant ur `prompts/us_dagligprompt.md` och ur `us-veckorapport-260901.md`).

### Åtgärdspunkter till Dren (L-3 – namngiven defekt, fil/fält och kvantifierat omfång)

**1. ÖPPEN sedan 2026-09-01 (ej återkommande i dag – ingen kandidat avgjordes på grind): `prompts/us_dagligprompt.md` definierar "de fem grindarna" på två oförenliga sätt.**
*Fil/fält:* punkt 2d (f) mot LÄGE A punkt 2 och 3 i samma fil.
*Omfång:* varje scout-kandidat som avgörs i LÄGE B – 20 av 23 poster i `state/scout_candidates.json` har avgjorts den vägen. Parentesen i 2d (f) räknar upp fem kriterier **utan** MACD-, EMA-, volym- och likviditetskraven, medan LÄGE A:s grind 2 bär hela det tekniska filtret.
*Status i dag:* **inte utlöst** – kandidatkön var tom, så ingen grindtilldelning gjordes. Punkten kvarstår oåtgärdad och märks inte ÅTERKOMMANDE, eftersom den inte påverkade ett beslut i denna körning.

**2. ÖPPEN sedan 2026-09-01: kostnadströskeln och kravet på ett motstånd att ankra målet i kan vara ömsesidigt uteslutande.**
*Fil/fält:* `prompts/us_dagligprompt.md`, NIVÅER punkt 2 (mål ≥ 8 %) och punkt 5:s katalysatortabell, mot LÄGE A punkt 2 ("närmaste … motstånd (bas för mål)").
*Omfång:* 3 av 34 bedömda US-kandidater 31/8–1/9 (CVX, DE, NVDA) – samtliga stora, likvida bolag nära egna toppar.
*Status i dag:* **inte utlöst** – inga nivåer sattes. Kvarstår oåtgärdad.

**3. NY: två rapporter i repot anger olika datum för augusti-NFP, och ingetdera går att verifiera ur state.**
*Fil/fält:* `reports/scout/rapport-260902.md` ("augusti-NFP (5/9)") mot `reports/us_daily/us-daglig-260901.md` ("Fredag 2026-09-04 – amerikansk sysselsättningsstatistik (NFP)").
*Omfång:* 1 av 1 makrodatum i utsikterna; **2026-09-05 är en lördag** (2026-09-04 är veckans fredag), så minst en av de två uppgifterna är fel, och båda är hämtade ur allmänt känd kalender utan stöd i repots källor. `state/news_feed.json`:s `fed-press`-flöde bär inga poster om vare sig NFP eller FOMC i fönstret, och `state/earnings_calendar.json` känner bara bolagsrapporter.
*Varför det spelar roll:* rapportförbudet i punkt 2e och binärhändelse-spärren i punkt 2d (d) räknas i **handelsdagar från ett datum**. Ett datum som skiljer en dag mellan två routiner kan flytta en händelse in i eller ut ur tvådagarsfönstret, och skillnaden syns inte i någon fil.
*Förslag:* samma åtgärd som scoutens stående datanotis 2 – ett makro-/kalenderflöde i news-actionen, så att BLS- och FOMC-datum kan citeras ur state i stället för ur minnet. Till dess ska varje makrodatum i båda rotationerna märkas som ej verifierat ur repots källor (L-5), vilket görs nedan.

**4. NY: reservkällan som datakrav punkt 2 pekar ut är onåbar från routinens körmiljö.**
*Fil/fält:* `prompts/us_dagligprompt.md`, KRAV PÅ FÄRSK DATA punkt 2 ("Reservkälla: Yahoo Finance https://finance.yahoo.com/quote/<TICKER> (visar Pre-Market/After-Hours)") och punkt 3 (samma reservkälla för inaktuell kurs).
*Omfång:* **4 av 4 försökta värdar** i dagens körning svarade `EGRESS_BLOCKED` vid direkthämtning – `finance.yahoo.com`, `www.cnbc.com`, `tradingeconomics.com` och `www.schwab.com`. Websök fungerar och returnerar daterade sammanfattningar, men **sidhämtning gör det inte**, vilket är skillnaden mellan att kunna citera en nivå med tidsstämpel och att inte kunna det.
*Varför det spelar roll:* prompten gör Yahoo Finance till den enda namngivna reservvägen när ett innehav rör sig utanför reguljär session eller när `prices.json` är inaktuell. I dag är det inte bindande – boken har noll aktiepositioner, sleeven saknar nivåer som kan korsas, och `prices.json` är en timme gammal – men den dag ett innehav rapporterar after-hours vilar hela pre-/after-hours-kontrollen på `extendedPrice`-fältet i `prices.json` och har **ingen** reserv. Detta är kurs-blockeringen i `CLAUDE.md` avsnitt 6 sedd från prompten: fixen (`prices.yml`) täcker reguljära kurser, inte den utökade sessionen.
*Förslag:* antingen skriv ut i prompten att `extendedPrice`/`extendedSession` i `state/prices.json` ÄR reservkällan i denna miljö (och att avsaknad av fältet ska redovisas som "ej verifierbar" snarare än sökas upp manuellt), eller låt `fetch-prices.mjs` hämta utökade noteringar för samtliga innehav och pending-tickers, inte bara de värden Yahoo råkar leverera. `extendedCount` låg på **1 av 123** i dag och **3 av 123** i går.

## Bevakning inför imorgon

* **I kväll, onsdag 2026-09-02 – Broadcom (AVGO) fiskala Q3.** Källa: `state/earnings_calendar.json` `upcoming`, `isEstimate: false`, konsensus EPS 3,238 USD och omsättning 29,43 mdr USD; bolagets egen Q3-guide låg på ~29,4 mdr (+84 % å/å) med AI-intäkter "över 200 % å/å till 16,0 mdr USD". **Binär händelse – punkt 2e förbjuder köp in i den**, och AVGO är avvisad på grind 2 i veckorapportens bruttolista (RSI 43,6, kurs under EMA20 och EMA50). Aktien står i praktiken still i förbörs (369,38, −0,08 %). **Det som gör utfallet viktigt för boken är inte AVGO utan kohorten:** efter Q2-rapporten 3/6 föll aktien −12,6 % på en beat, enbart för att FY27-målet ">100 mdr USD AI" inte höjdes, och hela AI-komplexet (NVDA, AMD, TSM, MRVL, MU, AMAT) ligger just nu med MACD-linjen under signallinjen samtidigt. Reaktionen i morgon avgör om grind 2 öppnar för kohorten igen eller om konsolideringen fortsätter.
* **Torsdag 2026-09-03 – `260827-NVDA` löper ut** (`expiresAt` 2026-09-03). Posten är redan avgjord (`rejected`) och ingen åtgärd krävs; noteras bara så att den inte förväxlas med en kandidat som lämnats kvar som `new`.
* **Fredag 2026-09-04 – amerikansk sysselsättningsstatistik (augusti-NFP).** Veckans tyngsta makroavläsning efter juli:s −23 000, och särskilt tung med 10-årsräntan på högsta nivån sedan november 2023. **Datumet är INTE verifierat ur repots källor** – se åtgärdspunkt 3; `reports/scout/rapport-260902.md` anger 5/9, vilket är en lördag.
* **Löpande – Hormuz.** Ett handelsfartyg träffades av projektiler 1/9 vid sundets utlopp och Brent står kring 95 USD, högsta på nästan sex veckor. Riktningen avgör om energisektorn blir en katalysatorkälla i v37 eller upprepar XOM-mönstret 19–26/8, då premiet prisades ut på tre sessioner och kostade boken −2,97 %. En varaktigt högre olja är samtidigt en inflationsrisk som trycker upp räntan – samma kraft som drog ned index i tisdags.
* **Onsdag 2026-09-16 (utanför fönstret) – FOMC-besked.** Ingen position tas med horisont förbi det utan explicit motivering. Datumet är hämtat ur allmänt känd kalender och **inte verifierat ur repots egna källor** (åtgärdspunkt 3).

**L-5-markering – vad uppräkningen ovan täcker.** Rapportuppräkningen är gjord ur `state/earnings_calendar.json`, som **endast känner de symboler `prices.yml` hämtar** och som i dag bär exakt en post (AVGO). Katalysatoruppräkningen är gjord ur `state/news_feed.json`, vars amerikanska täckning är `sec-8k`, `prnewswire`, `globenewswire` och `fed-press` med ett tak på 30 poster per källa och dygn. **Amerikanska bolag som varken prisbevakas eller ryms inom dygnskvoten är därmed OKONTROLLERADE** – påståendet ovan är "ingen bekräftad stor bolagskatalysator bland de poster fönstret kan se", inte "inga katalysatorer i USA". NFP 4/9 och FOMC 16/9 är hämtade ur allmänt känd kalender och **inte verifierade ur repots källor**; `fed-press` bär inga poster om dem i fönstret. Ränte-, olje- och terminsnivåerna i marknadsläget kommer ur namngivna externa medier via websök och är **nyhetskontext, inte beslutsunderlag** – inget kursbaserat beslut i denna rapport vilar på dem, i enlighet med datakrav punkt 4.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
