# Daglig bevakning – US-rotation

**Datum:** 2026-09-04 | **Läge:** Daglig bevakning (USD)
**Marknadsläget i korthet:** Fredag före US-öppning efter en bred uppgång i torsdagens session. S&P 500 (`^GSPC`) stängde **7 747,71 (+1,06 %)** och Nasdaq Composite (`^IXIC`) **26 584,06 (+1,40 %)** (`state/prices.json`, source "Yahoo Finance (chart API)", marketTime 2026-09-03T20:49:08Z resp. 21:15:59Z; dagsrörelsen räknad ur `previousClose` i en fil som bär `schemaVersion` "2026-08-02-prevclose"). USD/SEK **9,5498** (marketTime 2026-09-04T12:06:36Z), **−0,84 %** på dagen. **Augusti-NFP släpptes i dag 12:30 UTC: +162 000 jobb mot väntade 53 000, arbetslöshet oförändrad 4,1 %** (CNBC 2026-09-04) – den starkaste månaden sedan mars och en tydlig motvind för räntebanan in mot FOMC 16/9. Siffran ligger EFTER den senaste verifierade reguljära stängningen i `state/prices.json` och är därför **nyhetskontext, inte beslutsunderlag** (datakrav punkt 4). Den avgör samtidigt åtgärdspunkt 3 nedan: datumet 2026-09-04 är bekräftat, scoutrapportens "5/9" var fel.
**Pre-/after-hours:** **Inget innehav berört – boken har noll aktiepositioner.** Indexsleeven **SPY saknar `extendedPrice`-fält** i `state/prices.json` (`extendedCount: 0` för hela filen, tredje dygnet i rad), så ingen rörelse utanför reguljär session går att verifiera för den, och sleeven har varken stop, mål eller tidsstopp som kunde korsas. **Gårdagens öppna bevakningspunkt är däremot avgjord:** Broadcoms reaktion på Q3-rapporten 2/9 AMC går nu att läsa i en **verifierad reguljär stängning** – se nästa stycke – och behövde alltså aldrig gissas fram ur en otillgänglig reservkälla.
**Portföljvikt & kassa:** **100 % indexsleeve (SPY)**, kassa 0 %. Fyra tomma aktieplatser, noll öppna pending-planer. Oförändrat efter dagens beslut.

**AVGO-reaktionen – gårdagens bevakningspunkt, nu mätt i stället för gissad.** `us-veckorapport-260901.md` pekade ut Broadcoms Q3 som "veckans viktigaste enskilda signal för hela AI-kohorten", och `us-daglig-260903.md` kunde inte verifiera utfallet. Torsdagens reguljära stängning ger svaret: **AVGO 357,16 USD, −2,74 %** (marketTime 2026-09-03T20:00:01Z, `state/prices.json`/Yahoo chart API), med dagsintervall **342,331–359,40** – aktien handlades alltså **4,15 % under stängningen** som lägst innan den köptes tillbaka. Rapporten var en beat: intäkt +86 % å/å till 29,591 mdr USD och AI-halvledarintäkt 16,70 mdr (+221 % å/å), men bara **+0,53 % över konsensus på intäkten och +2,53 % på EPS** (24/7 Wall St 2026-09-03, CNBC 2026-09-02) – för tunt mot förväntningarna i AI-handeln. **Den avgörande observationen för nästa rotation är att kohorten INTE följde med ned:** NVDA **+1,80 %**, PLTR **+7,71 %**, TSLA **+5,42 %**, ANET **+2,87 %**, SMCI **+2,35 %**, MRVL **+1,14 %**, TSM **+0,36 %**, medan AMD **−0,20 %** och AMAT **−0,58 %** stod stilla (samtliga `state/prices.json`, marketTime 2026-09-03T20:00Z). Säljreaktionen var alltså **bolagsspecifik, inte kohortbred** – v36-rapportens tes att AVGO-utfallet skulle avgöra om AI-kohortens grind 2 öppnar i v37 håller därmed inte i sin enkla form. **Detta är en observation för v37:s poängsättning, inte ett köpskäl i dag:** grind 2 avgörs av MACD-, EMA- och volymvärden räknade vid rotationen, och en enskild sessions rörelse är varken volymbekräftelse eller katalysator.

---

## Innehav 1: Indexsleeve (SPY / NYSE Arca)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| 773,17 USD – `state/prices.json`, source "Yahoo Finance (chart API)", marketTime 2026-09-03T20:00:00Z, marketState `null` (reguljär stängning; US-börserna öppnar först 13:30 UTC i dag) | **−0,01 %** (entry 773,26, 2026-08-10) | – | – | **BEHÅLL** |

**Pre-/after-hours:** – (inget `extendedPrice`-fält för SPY i `state/prices.json`; `extendedCount: 0` i hela filen, ingen utökad notering går att verifiera för någon symbol i dag)
**Nyheter senaste 24h:** `state/news_feed.json` (1 169 poster, sex svarande flöden) bär **131 poster i fönstret 2026-09-03 20:00 UTC → 2026-09-04 09:42 UTC** (mfn 41, globenewswire 40, sec-8k 30, prnewswire 20) och **noll av dem rör sleeven som instrument eller något av de sex bevakade US-namnen** – sökning på broadcom/avgo/nvidia/micron/palantir/tesla/deere/semiconductor/GPU ger inga träffar, och sec-8k-flödets 30 poster i fönstret är småbolags-8-K:er (SPAC-bolag, REIT:er, regionala banker). **Fortfarande ingen Broadcom-8-K** i flödet, två dygn efter rapporten – reaktionen är i stället verifierad ur reguljär stängning ovan. 2026-09-04, CNBC (websök): augusti-NFP **+162 000 mot väntade 53 000**, arbetslöshet 4,1 %; **nyhetskontext, inte beslutsunderlag** (datakrav punkt 4).
**Motivering:** Dagsrörelsen är **+1,05 %** mot `previousClose` 765,16, räknad ur en fil som bär `schemaVersion` "2026-08-02-prevclose" – alltså en dagsrörelse och inte en veckorörelse förklädd till en, och den stämmer mot de daterade stängningarna i `state/price_history.json` (ons 2/9 765,16 → tors 3/9 773,17). Sleeven står därmed **praktiskt taget på sitt entry igen** (−0,01 % mot 773,26) efter att ha legat −1,48 % så sent som i tisdags. Sleeven har varken stop-loss eller målkurs och **säljs aldrig på nedgång**; den är kapitalparkering, inte ett case, och en enskild sessions rörelse i endera riktningen är därför inget beslutsunderlag – lika lite som återhämtningen är det. Med noll köp och noll sälj i dagens körning kräver ingen aktievikt någon förändring, och de fyra tomma platserna ligger kvar i index enligt punkt 0c: att parkera i SPY när inget case håller måttet är en aktiv och lönsam handling, inte ett uteblivet beslut. Loggas i `state/decisions.json` med `catalystType: "index"` så att raden filtreras bort ur urvalsstatistiken.

---

## Pending-planer

**Inga öppna pending-planer.** Samtliga fem rader i `state/portfolj_us.md`:s Pending-sektion är strukna och avgjorda sedan tidigare: XOM (ben 2) och TGT avförda 2026-08-26 på sin femte handelsdag utan trigger, MU triggad 2026-08-18, NVDA triggad 2026-08-10, PLTR avförd 2026-08-17. Raderna raderas aldrig. Ingen nivå finns alltså att pröva mot dagens kurser, och monitorn kan inte larma på en redan avförd nivå.

## Åtgärder i portfolj_us.md

**Inga ändringar i innehav, vikter eller historik – endast "Senast uppdaterad" är uppdaterad.** Noll köp, noll sälj, noll flyttar till Historik. Ackumulerad avkastning står oförändrad på **−2,87 %** (tre stängda affärer: NVDA −4,30 % på 25,0 %, MU −5,79 % på 25,0 %, XOM −2,97 % på 12,5 %) – fältet räknas om direkt vid varje SÄLJ enligt LÄGE B punkt 8, och utan SÄLJ finns inget att räkna om.

## Punkt 2d – Scout-kandidater (`state/scout_candidates.json`)

**Filen bär noll poster med `status: "new"`** (23 poster totalt, samtliga `rejected`, `promoted` eller utlöpta). Ingen kandidat ska alltså avgöras i dag och ingen lämnas kvar – kravet är uppfyllt genom att kön är tom, inte genom att den förbigås. `reports/scout/rapport-260904.md` har inte skrivit någon ny kandidat i fönstret som föregår denna körning.

**L-4-kontroll (avvisad på TILLFÄLLIGT datavillkor?): ingen post kvalificerar.** Efter att `260827-NVDA` löpte ut i går ligger **två** kandidater kvar inom sin `expiresAt`, och båda avvisades på **omdömesgrindar** med verifierad kurs – inte på "kurs ej verifierbar".

| Kandidat | `expiresAt` | Spärr vid avvisningen | Kurs 2026-09-03 | L-4 tillämplig? |
|---|---|---|---|---|
| `260901-CVX` | 2026-09-08 | Grind 2 (MACD-linjen 3,909 under signallinjen 4,198); andra ledet grind 4 | 211,32 USD (−0,22 %) | **Nej** – kursen fanns |
| `260901-DE` | 2026-09-08 | Grind 3 (analytikeruppgradering är stödsignal per punkt 1c, inte katalysator per 1a); andra ledet grind 4 | 694,41 USD (−0,57 %) | **Nej** – kursen fanns |

L-4 omfattar uttryckligen **endast** spärrar vars orsak är data som hunnit ikapp, och slår fast att en kandidat som avvisats av omdömesskäl "omfattas ALDRIG" och prövas om först vid nästa veckorotation. Ingen omprövning görs alltså i dag, och ingen ny rad skrivs för de två – ett andra avgörande utan ny data vore en uppmjukning, inte ett beslut. **Att båda gav tillbaka en del av gårdagens uppgång ändrar lika lite som att de steg i förrgår gjorde** – rörelsen åt endera hållet utan ny fundamental print är facit-bias, inte information.

## Punkt 4 (a), (b) och (c) – ersättningsköp och triggade planer

**Ej tillämpliga.** (a) förutsätter att en position sålts i förtid och ska ersättas – boken har noll aktiepositioner och sålde inget i dag. (b) förutsätter ett triggat entry-villkor ur veckorapporten – `us-veckorapport-260901.md` lade **inga** villkorade planer och det finns därför ingen "BEN 2"-rad som kan fyllas. (c) förutsätter en villkorad BUBBLAR-plan i Pending som triggats – Pending-sektionen har noll öppna rader. **(d)** täcks av punkt 2d ovan: tom kandidatkö.

## Punkt 4 – villkorad plan för en prissatt bubblare (tillägget 2026-08-06)

**Prövad en gång, faller på villkor 1 för samtliga fem bubblare – samma utfall som de två föregående dagarna.** Regeln kräver att den senaste us-veckorapporten uttryckligen angav **saknad verifierad kurs** som skälet att bubblaren inte fick en pending-rad. `us-veckorapport-260901.md` säger motsatsen ordagrant: *"Villkorade bubblar-planer: **Inga.** … ingen av de fem gör det: TSLA och DE faller på grind 3, MU, NVDA och PLTR på grind 2."* Samtliga fem föll alltså på **omdömesskäl**, och veckans mätning var dessutom att **grind 1 fällde noll av 32 kandidater** – ingen bubblare stoppades av kursförsörjning, och därmed finns ingen bubblare som villkoret kan gälla. Punkt 4 är kategorisk: *"en bubblare som rankades under av OMDÖMESSKÄL … omfattas ALDRIG"*. Villkor 2 (verifierad kurs), 5 (regimen PÅ) och 6 (fyra lediga platser, noll planer mot taket två) håller alla i dag – det ändrar ingenting, eftersom villkoren är kumulativa och villkor 1 är den som faller.

| Bubblare | Kurs 2026-09-03 (marketTime 20:00Z) | Dag | RSI(14) | Veckorapportens spärr | Villkor 1 |
|---|---|---|---|---|---|
| TSLA | 376,365 | +5,42 % | 63,2 | Grind 3 (SpaceX-beskedet är hype enligt punkt 1c) | **Faller** |
| DE | 694,41 | −0,57 % | 70,4 | Grind 3 (uppgradering ≠ katalysator per punkt 1a) | **Faller** |
| MU | 958,16 | +0,22 % | 47,9 | Grind 2 (volymkvot 0,74× mot 1,5×) | **Faller** |
| NVDA | 228,45 | +1,80 % | 52,3 | Grind 2 (MACD under signalen, volymkvot 0,97×) | **Faller** |
| PLTR | 182,53 | +7,71 % | 56,6 | Grind 2 (volymkvot 0,56× mot 1,5×) | **Faller** |

RSI(14) är räknat på **råserien** i `state/price_history.json` (250 daterade stängningar per symbol, sista punkten 2026-09-03) – ingen avdubblering görs, eftersom fantompunkten är fixad sedan 2026-08-17 och den gamla workarounden numera raderar äkta oförändrade stängningar.

Avgörandet loggas i `state/decisions.json` oavsett utfall, enligt regelns eget krav: **fem AVVAKTA-rader med den namngivna spärren** (TSLA, DE, MU, NVDA, PLTR). **PLTR:s +7,71 % och TSLA:s +5,42 % är den enskilt starkaste frestelsen den här veckan och ändrar ändå ingen grind.** Veckorapporten fällde PLTR på volymkvot 0,56× – en uppgång utan volymbekräftelse – och en ny uppgång utan att volymkvoten räknats om är samma sak en gång till, inte ett motbevis. Att skriva om spärren för de tre som steg och lämna den intakt för DE som föll vore facit-bias i sin renaste form. Frågan avgörs vid nästa LÄGE A-rotation, där volymkvot och MACD räknas om från grunden.

### Regimfilter och datastatus

| Kontroll | Utfall |
|---|---|
| **Regimfilter (punkt 2b)** | **PÅ.** ^GSPC 7 747,71 > MA200 **7 136,51**, marginal **+8,56 %** (mot +7,50 % i går), räknat på 250 daterade stängningar i `state/price_history.json`. Nya positioner är tillåtna; regimen är inte dagens spärr. |
| **`state/prices.json`** | **Färsk.** `generatedAt` **2026-09-04T12:06:41Z** (~1,3 h gammal), `schemaVersion` "2026-08-02-prevclose", `tickerCount` **118**, `okCount` **116**, `extendedCount` **0**. `wideAt` **2026-09-04T09:35:23Z** – dygnsgrindens breda hämtning HAR körts i dag, så de 118 symbolerna kommer ur en senare smal körning, inte ur att den breda uteblivit. |
| **Intradag-monitorn (punkt 2c2)** | **Frisk.** `state/alerts.json` bär `checkedAt` **2026-09-04T11:58:59Z**, alltså ~1,4 h gammalt och långt under 6-timmarsgränsen. `active` bär **en** signal – **SALM.OL** (KÖP, entry-villkor uppfyllt, 548 NOK) – som tillhör den **nordiska** boken och inte rör US-boken. Ingen aktiv signal rör ett US-innehav eller en US-pending-rad, och den listan får därför läsas som "lugnt för denna bok", inte som att monitorn tiger. |
| **`state/news_feed.json`** | **Frisk.** `generatedAt` 2026-09-04T09:42:33Z, fönstret täcker **10 av 10 handelsdagar** med `missingDays` **tom**, 1 169 poster (`oldest` 2026-08-24, `newest` 2026-09-04). Samtliga sex flöden svarar: globenewswire 20, globenewswire-earnings 20, prnewswire 20 (efter omförsök), mfn 48, sec-8k 40, fed-press 20. |
| **`state/earnings_calendar.json`** | **Frisk.** `generatedAt` 2026-09-04T09:34:10Z, `errors` **tomt objekt**, `noCoverage` 4 nordiska symboler, `notApplicable` 2 (SPY, XACT-OMXS30.ST). `upcoming` är **tom** – AVGO 2026-09-02 har passerat och ingen av de 95 upplösta symbolerna rapporterar inom 10 handelsdagar. |
| **`state/decision_eval.json`** | `generatedAt` 2026-09-04T12:06:41Z, `missingSymbols` **tom** – varje symbol med en rad i beslutsloggen går att mäta. Punkt 6b kräver därför inget tillägg i `config/watchlist_us.txt` i dag; SPY, TSLA, DE, MU, NVDA och PLTR ligger alla redan där. Inget tal ur filen citeras i dag, så `effectiveN`-kravet aktualiseras inte. |
| **Watchlist-hygien (punkt 6)** | Genomgången, **inga tillägg och inga rensningar**. Listan bär medvetet över riktmärket ≤ 25 symboler: index `^GSPC`/`^IXIC`/`^OMX` och sleeven SPY är skyddade av punkt 6, och varje övrig rad är antingen nämnd inom 14 handelsdagar eller skyddad av punkt 6b (en symbol med rad i `decisions.json` måste gå att prissätta) respektive L-2/L-5. Dagens fem bubblare, AVGO och de två kandidatnamnen ligger alla redan i filen. |

**Tillämpade lärdomar:** **L-3** (fyra åtgärdspunkter förs vidare med fil, fält och kvantifierat omfång; punkt 3 är **delvis åtgärdad** i dag och punkt 4 är fortsatt **ÅTERKOMMANDE**), **L-4** (varje icke-utlöpt `rejected`-kandidat kontrollerad mot regelns avgränsning till TILLFÄLLIGA dataspärrar; ingen kvalificerar, och det redovisas per post i stället för att tigas), **L-5** (varje "inga fler …"-formulering bär källa och täckningsangivelse, och den otäckta delen märks OKONTROLLERAD), **L-6** (ingen kandidat eller kandidatklass utesluts ur poängsättningen med hänvisning till en fokus- eller universumfil; de spärrar som avgör i dag citeras ordagrant ur `prompts/us_dagligprompt.md` och ur `us-veckorapport-260901.md`).

### Åtgärdspunkter till Dren (L-3 – namngiven defekt, fil/fält och kvantifierat omfång)

**1. ÖPPEN sedan 2026-09-01 (ej återkommande i dag – ingen kandidat avgjordes på grind): `prompts/us_dagligprompt.md` definierar "de fem grindarna" på två oförenliga sätt.**
*Fil/fält:* punkt 2d (f) mot LÄGE A punkt 2 och 3 i samma fil.
*Omfång:* varje scout-kandidat som avgörs i LÄGE B – 20 av 23 poster i `state/scout_candidates.json` har avgjorts den vägen. Parentesen i 2d (f) räknar upp fem kriterier **utan** MACD-, EMA-, volym- och likviditetskraven, medan LÄGE A:s grind 2 bär hela det tekniska filtret.
*Status i dag:* **inte utlöst** – kandidatkön var tom, så ingen grindtilldelning gjordes. Punkten kvarstår oåtgärdad och märks inte ÅTERKOMMANDE, eftersom den inte påverkade ett beslut i denna körning.

**2. ÖPPEN sedan 2026-09-01: kostnadströskeln och kravet på ett motstånd att ankra målet i kan vara ömsesidigt uteslutande.**
*Fil/fält:* `prompts/us_dagligprompt.md`, NIVÅER punkt 2 (mål ≥ 8 %) och punkt 5:s katalysatortabell, mot LÄGE A punkt 2 ("närmaste … motstånd (bas för mål)").
*Omfång:* 3 av 34 bedömda US-kandidater 31/8–1/9 (CVX, DE, NVDA) – samtliga stora, likvida bolag nära egna toppar.
*Status i dag:* **inte utlöst** – inga nivåer sattes. Kvarstår oåtgärdad.

**3. DELVIS ÅTGÄRDAD i dag (öppnad 2026-09-02): datumkonflikten om augusti-NFP är avgjord, den strukturella luckan kvarstår.**
*Fil/fält:* `reports/scout/rapport-260902.md` ("augusti-NFP (5/9)") mot `reports/us_daily/us-daglig-260901.md` ("Fredag 2026-09-04").
*Vad som avgjordes:* BLS Employment Situation för augusti publicerades **fredag 2026-09-04 kl. 08:30 ET** och siffran är ute (+162 000 mot väntade 53 000, arbetslöshet 4,1 %; CNBC 2026-09-04). **Scoutens 5/9 var alltså fel** – det är en lördag, precis som `us-daglig-260903.md` misstänkte. Rotationens datum var rätt.
*Vad som kvarstår:* **1 av 1 makrodatum är fortfarande overifierbart ur repots egna källor.** Avgörandet gjordes med websök, inte ur state: `state/news_feed.json`:s `fed-press`-flöde bär **2 poster i tiodagarsfönstret** och ingen av dem rör NFP eller FOMC, och `state/earnings_calendar.json` känner bara bolagsrapporter. Nästa datumkonflikt kommer att kräva samma manuella avgörande.
*Varför det spelar roll:* rapportförbudet i punkt 2e och binärhändelse-spärren i punkt 2d (d) räknas i **handelsdagar från ett datum**. Ett datum som skiljer en dag mellan två routiner kan flytta en händelse in i eller ut ur tvådagarsfönstret, och skillnaden syns inte i någon fil.
*Förslag (oförändrat):* ett makro-/kalenderflöde i news-actionen, så att BLS- och FOMC-datum kan citeras ur state. Till dess märks varje makrodatum i båda rotationerna som ej verifierat ur repots källor (L-5).

**4. ÖPPEN sedan 2026-09-02, ÅTERKOMMANDE (tredje rapporten): utökade noteringar går inte att verifiera, och den reservkälla datakrav punkt 2 pekar ut är onåbar ur körmiljön.**
*Fil/fält:* `state/prices.json`, fältet `extendedCount` / avsaknaden av `extendedPrice`; `prompts/us_dagligprompt.md`, KRAV PÅ FÄRSK DATA punkt 2 ("Reservkälla: Yahoo Finance https://finance.yahoo.com/quote/<TICKER>") och punkt 3.
*Omfång:* `extendedCount` har gått **3 (1/9) → 1 (2/9) → 0 (3/9) → 0 (4/9)** utan tekniskt fel – **0 av 118 symboler** bär en utökad notering i dag, fjärde dygnet i rad, och 4 av 4 försökta värdar (`finance.yahoo.com`, `www.cnbc.com`, `tradingeconomics.com`, `www.schwab.com`) har svarat `EGRESS_BLOCKED` vid direkthämtning i tidigare körningar.
*Nytt i dag – den bindande instansen är löst av tid, inte av åtgärd:* gårdagens spärr gällde AVGO:s after-hours-reaktion, och den går nu att läsa i en **verifierad reguljär stängning** (357,16 USD, −2,74 %, marketTime 2026-09-03T20:00:01Z). **Att vänta på reguljär session var alltså rätt beslut och gav ett bättre underlag än en gissad efterbörskurs** – men det kostade ett dygn, och nästa gång en nivå faktiskt korsas i utökad session är dygnet inte gratis: ett stop kan brytas och läsas av först dagen efter.
*Förslag (oförändrat):* antingen skriv ut i prompten att `extendedPrice`/`extendedSession` i `state/prices.json` ÄR reservkällan i denna miljö (och att avsaknad av fältet redovisas som "ej verifierbar" i stället för att sökas upp manuellt), eller låt `fetch-prices.mjs` hämta utökade noteringar för samtliga innehav och pending-tickers i en dedikerad körning direkt efter kända rapporttider.

## Bevakning inför imorgon

* **Augusti-NFP är släppt i dag 12:30 UTC (+162 000 mot väntade 53 000, arbetslöshet 4,1 %, CNBC 2026-09-04)** – den starkaste månaden sedan mars och tre gånger konsensus. Reaktionen i räntor och index sker i dagens session, alltså EFTER denna körnings sista verifierade stängning, och läses av först i måndagens underlag. **Konsekvensen för boken är noll i dag** (sleeven har inga nivåer), men den är direkt relevant för v37: en het jobbsiffra trycker upp den korta räntan in mot FOMC 16/9 och är motvind för långa duration-namn – vilket är precis den kohort grind 2 redan håller stängd.
* **AVGO-reaktionen är avgjord och kohorten följde inte med ned** (se marknadsläget ovan). Frågan för v37 är därför inte längre "vad gjorde Broadcom", utan om NVDA/PLTR/ANET-uppgången kommer **på volym** – volymkvoten var 0,97× respektive 0,56× vid rotationen, och det är den siffran som avgör grind 2, inte kursrörelsen.
* **Onsdag 2026-09-16 (utanför fönstret) – FOMC-besked.** Ingen position tas med horisont förbi det utan explicit motivering. Datumet är hämtat ur allmänt känd kalender och **inte verifierat ur repots egna källor** (åtgärdspunkt 3).
* **Torsdag 2026-09-24 (utanför fönstret, för planering) – Teslas Semi-event**, annonserat 2026-08-27. Nämns här enligt L-1 så att en reaktion blir mätbar, inte som köpskäl. TSLA steg +5,42 % i går utan namngiven bolagsspecifik print i nyhetsflödet.
* **Måndag 2026-09-07 – nästa LÄGE A-rotation (v37).** Fyra lediga platser, regimen PÅ med 8,56 % marginal, och hela frågan är om AI-kohortens volymkvot kommit tillbaka över 1,5×.

**L-5-markering – vad uppräkningen ovan täcker.** Rapportuppräkningen är gjord ur `state/earnings_calendar.json`, som **endast känner de 95 symboler `prices.yml` hämtar och kunde lösa upp** och som i dag bär noll poster i `upcoming`. Katalysatoruppräkningen är gjord ur `state/news_feed.json`, vars amerikanska täckning är `sec-8k`, `prnewswire`, `globenewswire` och `fed-press` med ett tak på 30 poster per källa och dygn. **Amerikanska bolag som varken prisbevakas eller ryms inom dygnskvoten är därmed OKONTROLLERADE** – påståendet ovan är "ingen bekräftad stor bolagskatalysator bland de poster fönstret kan se", inte "inga katalysatorer i USA". FOMC 16/9 och Semi-event 24/9 är hämtade ur allmänt känd kalender och **inte verifierade ur repots källor**; `fed-press` bär 2 poster i tiodagarsfönstret och ingen av dem rör dem. NFP-datumet 4/9 och utfallet är däremot **verifierade via websök mot CNBC 2026-09-04**, inte ur state – källan är namngiven i stället för underförstådd, och siffran används som kontext, inte som beslutsunderlag (datakrav punkt 4). AVGO-siffrorna kommer ur 24/7 Wall St 2026-09-03 och CNBC 2026-09-02; **kursen och dagsrörelsen kommer uteslutande ur `state/prices.json`**, aldrig ur artiklarna.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
