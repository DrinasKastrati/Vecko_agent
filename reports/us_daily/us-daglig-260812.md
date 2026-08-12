# Daglig bevakning – US-rotation
**Datum:** 2026-08-12 | **Läge:** Daglig bevakning (USD)
**Marknadsläget i korthet:** Tisdagen 2026-08-11 blev en försiktig nedgång in i CPI-facit: S&P 500 stängde **7 728,20** (**−0,32 %** mot 7 753,11; dagsintervall 7 717,25–7 767,51, Yahoo Finance chart API via `state/prices.json`, marketTime 2026-08-11 20:34:05 UTC) och Nasdaq Composite **26 445,45** (**−0,60 %** mot 26 605,36, marketTime 2026-08-11 21:15:59 UTC). **Veckans bredmarknadsbinära event är nu avgjort:** juli-KPI publicerades i dag 2026-08-12 kl. 12:30 UTC och kom in **+0,1 % m/m och 3,4 % å/å, ned från 3,5 % och i linje med konsensus** (BLS via Bloomberg live-blogg, NBC News och Qz, 2026-08-12). Utfallet är alltså varken den heta siffra som veckorapporten pekade ut som caseets största externa risk eller ett besked som prisar in sänkningar – inflationen ligger kvar väl över Feds 2 %-mål och håller FOMC delat inför september. Reaktionen i förbörsen är riskpositiv med tekniktyngd: S&P 500-terminen **+0,4 %**, Nasdaq-100 **+0,8 %**, med halvledarna i täten sedan CoreWeave och Super Micro rapporterat och bekräftat AI-investeringstakten (Yahoo Finance marknadslivelogg/Bloomberg, 2026-08-12). **Regimfiltret (promptens punkt 2b) står PÅ:** 7 728,20 > MA200 **7 065,18**, beräknat på 200 daterade stängningar ur `state/price_history.json` (serien bär 250 punkter) – kursen ligger **+9,38 %** över medelvärdet. Nästa hållpunkt är **PPI torsdag 13/8**. USD/SEK 9,5019 (marketTime 2026-08-12 12:44:53 UTC); boken redovisas i USD och den effekten ingår inte i avkastningen.
**Pre-/after-hours:** **Ingen av bokens tre bevakade US-symboler (NVDA, SPY, PLTR) bär utökade fält i dagens `state/prices.json`** (`generatedAt` 2026-08-12 12:44:57 UTC) – filens `extendedCount` avser uteslutande nordiska tickers, och det finns därmed **ingen verifierad förbörsnivå med tidsstämpel** för dem i dag. Websök ger en riktning men ingen verifierbar nivå: NVDA rapporteras stiga i förbörsen 2026-08-12 draget av sektorn, med Micron **+4,3 %** och Marvell **+4,8 %** (Yahoo Finance premarket movers, 2026-08-12). **Rörelsen är uppåt, och ingen stop har därmed kunnat brytas utanför reguljär session**; målkursen 256,00 ligger 17,7 % bort och är inte i närheten. Inget innehav rapporterade efter gårdagens stängning – NVDA:s egen rapport ligger **2026-08-26** (`state/earnings_calendar.json`, `isEstimate: false`, 10 handelsdagar bort). Enligt datakravens punkt 5 fattas **inget kursbaserat beslut på de overifierade förbörsuppgifterna** – besluten nedan vilar på verifierade reguljära stängningar.
**Portföljvikt & kassa:** **25 % NVDA + 75 % indexsleeve (SPY) + 0 % kassa.** Oförändrat sedan i går: en full aktieposition och tre lediga platser. Ackumulerad avkastning sedan start: **+0,00 %** (noll stängda affärer; skarp start 2026-08-10 enligt `state/live_start.json`).

---

## Innehav 1: NVIDIA (NVDA / NASDAQ)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| 217,50 USD – Yahoo Finance chart API via `state/prices.json`, 2026-08-11 20:00:00 UTC, reguljär stängning (US-sessionen ej öppnad vid filens `generatedAt` 2026-08-12 12:44:57 UTC) | −1,35 % (mot viktat entry 220,48) | 211,00 USD (−2,99 % från kurs) | 256,00 USD (+17,70 % från kurs) | **BEHÅLL** |

**Pre-/after-hours:** Ingen verifierad nivå – NVDA saknar utökade fält i dagens `prices.json`. Indikativ riktning uppåt i förbörsen 2026-08-12, driven av halvledarsektorn (MU +4,3 %, MRVL +4,8 %, Yahoo Finance premarket movers 2026-08-12); används **inte** som beslutsunderlag, endast för att konstatera att ingen nivå kan ha korsats nedåt. Ingen after-hours-rapport efter gårdagens stängning.
**Nyheter senaste 24h:** Inga nya bolagsspecifika besked. Gårdagens finansieringsplattform (2026-08-10 20:01 UTC, NVIDIA IR via `state/news_feed.json`/`mfn`) är redan inarbetad. **2026-08-12 – makro:** juli-KPI 3,4 % å/å i linje med konsensus, halvledare leder förbörsuppgången efter CoreWeave- och Super Micro-rapporter som bekräftar AI-investeringstakten (Yahoo Finance/Bloomberg, 2026-08-12). **2026-08-12 12:00 UTC – PR Newswire (via `news_feed.json`):** Dell'Oro Group räknar med att marknaden för datacenter-halvledare och -komponenter passerar 1 800 md USD över fem år – branschdata, inte en bolagskatalysator. Inga negativa besked, ingen guidance-ändring.
**Motivering:** Tesen är intakt och stop/mål är orörda – gårdagens reguljära intervall 216,30–222,20 låg helt inom planen, med **5,2 % marginal ned till stoppen 211,00**. Enligt punkt 3 i "NIVÅER & OMSÄTTNING" är BEHÅLL standardvalet när varken (a) stop/mål träffats eller (b) tesen punkterats, och ingetdera har inträffat: SpaceX-avtalet 2026-08-05 (`order`, horisont 25 handelsdagar, inget tidsstopp) är obrutet. **Den enskilt viktigaste förändringen i dag är att caseets största namngivna externa risk föll bort:** veckorapporten pekade ut en het CPI som det som skulle pressa AI-multiplarna i två steg, och siffran kom in i linje (3,4 % å/å, +0,1 % m/m) med halvledarna ledande i förbörsen. Tekniskt ligger kursen kvar över hela EMA-stapeln i korrekt ordning (EMA20 **210,43** > EMA50 **207,15** > EMA200 **195,14**, ur `price_history.json`) med RSI(14) **57,3** – avkylt från 64,5 vid entry utan att trenden brutits. Kvarstående invändning oförändrad: motståndet **235,74** (årshögsta 2026-05-14) ligger före målet. Rapporten 2026-08-26 är ett binärt event **inom** horisonten men **utanför** tvådagarsfönstret i punkt 4, och utlöser därför inget krav på att motivera positionen genom eventet i dag.

---

## Innehav 2: Indexsleeve (SPY / NYSE Arca)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| 770,56 USD – Yahoo Finance chart API via `state/prices.json`, 2026-08-11 20:00:00 UTC, reguljär stängning | −0,35 % | – | – | **BEHÅLL** |

**Pre-/after-hours:** – (inga utökade fält för SPY i dagens `prices.json`)
**Nyheter senaste 24h:** Inga väsentliga nyheter som rör sleeven. Bredmarknadens facit i dag är juli-KPI (3,4 % å/å, i linje); nästa hållpunkt är PPI 13/8.
**Motivering:** Sleeven hålls oförändrad på **75 %** enligt sleeve-regeln – ingen stop, inget mål, och den säljs aldrig på nedgång. Inget aktieköp eller -sälj i dag kräver att den rörs, vilket är det enda skäl LÄGE B tillåter. Positionen står på **−0,35 %** mot entry 773,26 (2026-08-10) efter gårdagens breda nedgång; det är kapitalparkering, inte ett case, och avvikelsen kräver ingen åtgärd.

---

## Pending-planer
* **PLTR ≤ 160,00 USD (BUBBLARE, villkorad plan punkt 4b)** – **EJ TRIGGAD** (kurs 174,94 USD, dagslägsta **172,72**, marketTime 2026-08-11 20:00:00 UTC, Yahoo Finance chart API via `state/prices.json`). Kursen ligger **9,34 %** över villkoret och rörde sig i praktiken inte i går (−0,17 %). Planen är oförändrat giltig t.o.m. **2026-08-17** och ligger kvar; ingen jakt uppåt – det var sträckningen efter +10,32 % den 7/8 som diskvalificerade ett köp till marknadskurs, och den har inte minskat. Katalysatorn (Q2 3/8 AMC + BofA-uppgradering 7/8) är obruten. Ingen åtgärd.
* NVDA-raden för ben 2 är sedan i går struken och märkt **TRIGGAD 2026-08-10** – ingen kvarliggande olöst rad, så monitorn larmar inte på en redan fylld nivå.

## Villkorad plan för prissatt bubblare (promptens LÄGE B punkt 4, ny 2026-08-06)
Regeln prövades **en gång** denna körning, oberoende av innehavsslingan. **Utfall: ingen ny plan läggs.** Villkor (1) faller för samtliga fem bubblare i `us-veckorapport-260810.md` – regeln omfattar bara en bubblare där **saknad verifierad kurs** var skälet att den inte fick en pending-rad, och ingen av dem saknade kurs.

| Bubblare | Skälet i veckorapporten | Omfattas av regeln? | Kurs 2026-08-11 (prices.json) | Punkter i `price_history.json` |
|---|---|---|---|---|
| PLTR | Grind 3 ej prövbar (RSI ej beräkningsbar) – **plan redan lagd** | Nej (och plan finns) | 174,94 | 7 |
| PAYC | Grind 3 ej prövbar + en rekylfri session är ingen satt bas | Nej – omdömesskäl | 212,23 | 4 |
| U | Grind 3 ej prövbar (RSI ej beräkningsbar) | Nej – omdömesskäl | 43,87 | 4 |
| TEAM | Grind 3 ej prövbar efter +35,3 % på en session | Nej – omdömesskäl | 154,08 | 3 |
| ANET | RANKAD UNDER av omdömesskäl (fade efter katalysatorn) | Nej – omfattas aldrig | 197,85 | 6 |

**Noterat utan att det ändrar utfallet:** ANET har brutit sitt fade och står nu **197,85** (+4,86 % på två sessioner från 188,67), över nivån boken kunde ha köpt på den 7/8, och TEAM har byggt vidare till 154,08. Ingen av dem får en plan i dag – men båda är relevanta för måndagens rotation, som gör om bedömningen från grunden. **Grind 3 är fortfarande inte prövbar för någon av de fem** (RSI(14) kräver 15 stängningar; de har 3–7). Se Datakvalitet nedan.

## Scout-kandidater (promptens punkt 2d)
**`state/scout_candidates.json` innehåller noll poster med `status: "new"`** – för någon av böckerna. Samtliga elva poster är avgjorda (10 `rejected`, 1 `promoted`), så det finns inget att ta ställning till i dag och ingen post riskerar att passera `expiresAt` som `new`. Filen validerad: `node .github/scripts/validate-scout-candidates.mjs` → OK.

**L-4-kontroll (kandidat avvisad på ett TILLFÄLLIGT datavillkor ska prövas om):** **ingen post kvalificerar.** Tre US-poster når sitt `expiresAt` i dag – `260805-ANET`, `260805-AMD` och `260805-AVGO` – och samtliga är avvisade på **omdömesskäl**, inte på "kurs ej verifierbar": ANET på fade + ej prövbar teknik, AMD på det tekniska filtret (under EMA20, beatet såldes −8,8 % AH), AVGO på `confirmed: false`. ANET och AMD fick dessutom sitt L-4-avgörande redan 2026-08-10 med då verifierade post-katalysatorkurser. `260811-NVDA` (avvisad i går på spärr (e), ingen ledig kapacitet) omfattas heller aldrig – kapacitet är uttryckligen ett omdömesskäl i L-4, och NVDA står på exakt 25 % där positionsregeln förbjuder övervikt. Bedömningarna görs om vid nästa veckorotation.

## Intradag-signaler & monitor-hälsa (promptens punkt 2c/2c2)
**Monitorn är frisk – kontrollerat FÖRE signalläsningen enligt 2c2.** `state/alerts.json` bär `checkedAt` **2026-08-12 11:44:22 UTC**, alltså ~1,4 timmar gammalt vid körningen och långt inom sextimmarsgränsen; fältet finns, så actionen kör kod från efter 2026-08-02. Intradagsskyddet behandlas därmed som NÄRVARANDE. `active` är **tom**, och den tomma listan kan här läsas som "lugnt" just för att `checkedAt` är färskt. `watched` täcker samtliga tre relevanta symboler (NVDA, SPY, PLTR) plus nordiska ASSA-B.ST. Historiken visar att NVDA-signalen (`KÖP`, `level` 217, `hitPrice` 216,77, `basis: "intraday"`) korrekt löpte ut 2026-08-11 14:56 UTC när pending-raden ströks. Inga aktiva signaler att agera på eller motivera bort.

## Datakvalitet (L-3)
**1. `state/price_history.json` – för få punkter för att pröva grind 3 (ÅTERKOMMANDE, fjärde rapporteringen).**
**Fil och fält:** `series` i `state/price_history.json`. **Omfång:** **fem** US-symboler med bekräftad katalysator och verifierad kurs bär 3–7 daterade stängningar där RSI(14) kräver 15 – PLTR (7), ANET (6), PAYC (4), U (4), TEAM (3), och även NET (3) utanför bubblarlistan. **Konsekvens:** grind 3 går inte att pröva ur repots egna data, vilket blockerade sex kandidater i v33-rotationen och blockerar dem fortfarande. **Ersättningskälla som använts:** ingen – kravet kringgås inte, kandidaterna avvisas i stället, och tekniken vilar där den kan beräknas på `price_history.json`. **Åtgärdspunkt till Dren:** symbolerna backfillas inte historiskt när de läggs till i `config/watchlist_us.txt`; serien börjar den dag symbolen först hämtas. Sex symboler behöver ~15 handelsdagars backfill (eller ~11 dagars väntan) innan de kan poängsättas fullt ut.
**2. `state/news_feed.json` – två av sex flöden fallerar (ÅTERKOMMANDE, rapporterad även i dagens nordiska rapport).**
**Fil och fält:** `feeds.globenewswire` och `feeds.globenewswire-earnings` står båda på `"fel: This operation was aborted – båda försöken"` i filen med `generatedAt` 2026-08-12 12:01:01 UTC – alltså avbrott även efter den automatiska omförsöksrundan, symptomatiskt för en timeout i `.github/scripts/fetch-news.mjs` snarare än en HTTP-status. **Omfång:** 2 av 6 flöden; GlobeNewswires earnings-flöde är det som prompten pekar ut som särskilt värdefullt för rapportöverraskningar. **Mildrande:** fönstret är ändå fullt – `window` visar **10 av 10 handelsdagar täckta**, `missingDays` tom, 952 poster, med prnewswire (240), sec-8k (240) och mfn (240) intakta. **Ersättningskälla som använts:** `sec-8k`- och `mfn`-flödena samt websök enligt punkt 6b. **Åtgärdspunkt till Dren:** höj tidsgränsen för GlobeNewswire-flödena i `fetch-news.mjs`, eller byt URL – felet är nu ihållande, inte enstaka.
**3. `config/watchlist_us.txt` – 41 symboler mot riktmärket ≤ 25 (informationspunkt, ingen defekt).**
Ingen symbol uppfyller borttagningskriteriet i punkt 6: samtliga 41 är antingen innehav, pending, bubblare eller nämnda i en rapport de senaste 14 dagarna, och punkt 6b (varje symbol med ett beslut i `decisions.json` måste gå att prissätta) går uttryckligen före taket. `missingSymbols` i `state/decision_eval.json` är tom, vilket bekräftar att inget beslut är omätbart. **Ingen rensning görs i LÄGE B** – hygienen hör hemma i rotationen, när v33:s nyhetsdrivna kandidater (ACHR, BA, CXW, RHP, ITW, BIIB) antingen tagit plats i en bruttolista eller fallit ur.

## Åtgärder i portfolj_us.md
**Inga positionsändringar – endast tidsstämpel och nulägesbeskrivning uppdaterade.** BEHÅLL på båda innehaven, ingen pending-plan triggad eller avförd, ingen scout-kandidat promotad, ingen ny villkorad plan lagd. Vikterna står kvar på 25 % NVDA + 75 % SPY-sleeve + 0 % kassa, historiken är orörd (noll stängda affärer) och ackumulerad avkastning kvarstår på +0,00 %. Sju rader appendade till `state/decisions.json`: NVDA `BEHÅLL`, SPY `BEHÅLL` (`index`), PLTR `AVVAKTA` (pending ej triggad) samt PAYC/U/TEAM/ANET `AVVAKTA` med den namngivna spärren från prövningen av LÄGE B punkt 4.

## Bevakning inför imorgon
* **PPI torsdag 13/8** – veckans andra inflationssiffra och nästa bredmarknadsbinära event. En het producentprissiffra kan ta tillbaka den lättnad KPI gav i dag, och halvledare är högbeta mot ränteförväntningar.
* **NVDA 235,74** – årshögsta från 2026-05-14 och första verkliga motståndet före målet 256,00. Ett återtag med volym är det som gör målet nåbart; en avvisning där är den naturliga platsen att ompröva planen.
* **NVDA:s rapport 2026-08-26** (`earnings_calendar.json`, bekräftat datum, ej gissat) – 10 handelsdagar bort och inom horisontens 25 dagar. Kravet i punkt 4 på att explicit motivera en position genom ett binärt event slår till när avståndet är ≤ 2 handelsdagar, dvs. tidigast i körningen 2026-08-24.
* **PLTR ≤ 160,00 USD** – planen har fyra handelsdagar kvar (t.o.m. 2026-08-17) och 9,3 % dit. Triggar den inte avförs den vid måndagens rotation.
* **ANET och TEAM** – båda bröt sina respektive fade/konsolideringar i går utan att kunna poängsättas. Har `price_history.json` byggt tillräckligt med punkter till måndag blir de prövbara mot grind 3 för första gången.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
