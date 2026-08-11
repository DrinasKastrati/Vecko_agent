# Daglig bevakning – US-rotation
**Datum:** 2026-08-11 | **Läge:** Daglig bevakning (USD)
**Marknadsläget i korthet:** Måndagen 2026-08-10 blev en lugn konsolidering i väntan på **KPI (CPI) onsdag 12/8**: S&P 500 stängde **7 753,11** (**−0,06 %** mot 7 757,64; dagsintervall 7 743,11–7 773,76, Yahoo Finance chart API via `state/prices.json`, marketTime 2026-08-10 20:38:36 UTC) och Nasdaq Composite **26 605,36** (**−0,32 %** mot 26 690,62, marketTime 2026-08-10 21:15:59 UTC). Halvledarna reducerade risk inför facit (NVDA −2,86 %, AMD −2,86 %, AVGO −1,25 %, MU −1,89 %) medan fredagens mjukvaru-beat-kohort höll uppåt (PLTR +1,87 %, NET +3,44 %, TEAM +1,88 %) – positionering, ingen bolagsspecifik svaghet. **Regimfiltret (promptens punkt 2b) står PÅ:** 7 753,11 > MA200 **7 060,36**, beräknat på 200 stängningar ur `state/price_history.json` (250 punkter) – kursen ligger **+9,81 %** över medelvärdet. Veckans binära bredmarknadsevent är CPI 12/8 (konsensus fortsatt över 3 %) följt av PPI 13/8. USD/SEK 9,5064 (marketTime 2026-08-11 12:05:07 UTC); bokens avkastning är USD-denominerad och innehåller inte den effekten.
**Pre-/after-hours:** **NVDA handlas i förbörsen 2026-08-11 till 220,05 USD** (`extendedPrice`, `extendedSession` "pre", `extendedTime` 2026-08-11 12:04:58 UTC, Yahoo Finance chart API via `state/prices.json`), **+1,15 %** mot måndagens stängning 217,55 – oberoende bekräftat av förbörsaggregat (**219,90 USD kl. 07:58 ET**, +1,08 %, Public.com, 2026-08-11) och av Benzinga, som kopplar uppgången till finansieringsnyheten (2026-08-11). Rörelsen är uppåt och **ingen stop har därmed kunnat brytas utanför reguljär session**; målkursen 256,00 ligger 16 % bort och är inte i närheten. **Efter måndagens stängning (20:00 UTC) släppte NVIDIA sitt pressmeddelande om finansieringsplattformarna 20:01 UTC** – se Nyheter under Innehav 1; ingen rapport och inget negativt besked. SPY och PLTR saknar utökade fält i dagens `prices.json` och har därmed ingen verifierad förbörsnivå – ingen nivå för dem bedöms utanför reguljär session.
**Portföljvikt & kassa:** **25 % NVDA + 75 % indexsleeve (SPY) + 0 % kassa.** Vikten i NVDA gick från 12,5 % till 25 % i dag när **ben 2 fylldes** (se nedan), och sleeven minskades symmetriskt 87,5 % → 75 % för att finansiera den. Boken har därmed en full position och tre lediga platser. Ackumulerad avkastning sedan start: **+0,00 %** (noll stängda affärer; skarp start 2026-08-10).

---

## Innehav 1: NVIDIA (NVDA / NASDAQ)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| 217,55 USD – Yahoo Finance chart API via `state/prices.json`, 2026-08-10 20:00:00 UTC, reguljär stängning (US-sessionen ej öppnad vid filens `generatedAt` 2026-08-11 12:05:11 UTC) | −1,33 % (mot nytt viktat entry 220,48) | 211,00 USD (−4,30 %) | 256,00 USD (+16,11 %) | **KÖP** |

**Pre-/after-hours:** 220,05 USD i förbörsen 2026-08-11 12:04:58 UTC (`extendedSession` "pre", prices.json/Yahoo), **+1,15 %** mot 217,55; bekräftad av Public.com 219,90 USD kl. 07:58 ET (2026-08-11). Ingen nivå korsad utanför reguljär session.
**Nyheter senaste 24h:** **2026-08-10 20:01:45 UTC – NVIDIA offentliggör partnerskap med Apollo, BlackRock, Blackstone, Brookfield, Goldman Sachs och KKR om finansieringsplattformar för AI-compute-infrastruktur som ska mobilisera över 500 md USD i tredjepartskapital** (bolagets eget pressmeddelande via `state/news_feed.json`, källa `mfn`, verifierad mot NVIDIA Investor Relations och Blackstones pressrum). Bekräftat utfall, inget rykte. **2026-08-11 – Benzinga**: aktien upp knappt 1 % i förbörsen på nyheten. Inga negativa besked, ingen guidance-ändring, ingen rapport.
**Motivering:** **Ben 2 i det delade entryt fylldes** – villkoret "verifierad kurs ≤ 217,00 USD" korsades i måndagens reguljära session (dagslägsta **216,77 USD**, marketTime 2026-08-10 20:00:00 UTC), vilket `state/alerts.json` fångade självständigt (`type: "KÖP"`, `basis: "intraday"`, `hitPrice: 216,77`, `level: 217`). Enligt punkt 4a slås positionen ihop till **en** rad: vikt 12,5 + 12,5 = **25 %**, viktat entry **220,48 USD**, entry-datum oförändrat 2026-08-10, och **stoppen lämnas kvar på 211,00** – den flyttas aldrig ned, och eftersom ben 2 fyllde lägre är riskavståndet nu 4,30 % i stället för 5,79 %, vilket **förbättrar** R/R från 1:2,5 till **1:3,7**. Att avståndet därmed ligger under det backtestade 5–6 %-bandet är ingen uppmjukning: bandet gäller stoppens placering vid entry, och LÄGE B punkt 6 (stop får aldrig flyttas ned) är överordnad. Tesen är intakt och stärkt – SpaceX-avtalet 2026-08-05 (`order`, horisont 25 handelsdagar, inget tidsstopp) är oförändrat, och gårdagens finansieringsplattform pekar åt exakt samma håll: den finansierar den datacenterutbyggnad som konsumerar bolagets GPU:er, med sex av världens största kapitalförvaltare bakom sig. Kursen ligger över hela EMA-stapeln i korrekt ordning (EMA20 208,87 > EMA50 206,29 > EMA200 194,78), RSI(14) **58,1** och MACD-histogrammet **+2,30**. Kvarstående invändningar från veckorapporten står fast och har inte förvärrats: motståndet 235,74 (årshögsta 2026-05-14) ligger före målet, och **CPI 12/8** är ett bredmarknadsbinärt event som slår hårt mot AI-multiplar – men det är inte ett bolagsbinärt event och utlöser därför inte kravet i punkt 4 på att motivera en position genom ett event. NVDA:s egen rapport ligger sent i augusti, utanför tvådagarsfönstret (`state/earnings_calendar.json`, `errors` tom, NVDA saknas i `upcoming`).

---

## Innehav 2: Indexsleeve (SPY / NYSE Arca)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| 773,03 USD – Yahoo Finance chart API via `state/prices.json`, 2026-08-10 20:00:00 UTC, reguljär stängning | −0,03 % | – | – | **BEHÅLL** |

**Pre-/after-hours:** – (inga utökade fält för SPY i dagens `prices.json`)
**Nyheter senaste 24h:** Inga väsentliga nyheter som rör sleeven. Bredmarknadens nästa hållpunkt är CPI 12/8.
**Motivering:** Sleeven hålls enligt sleeve-regeln – ingen stop, inget mål, den säljs aldrig på nedgång. **Den enda ändringen är en storleksjustering: 87,5 % → 75 %**, vilket är precis det som LÄGE B tillåter ("rör den i LÄGE B endast när ett aktieköp/-sälj kräver det") eftersom ben 2 i NVDA måste finansieras ur sleeven. Detta är en omviktning, inte en stängd affär – ingen historikrad skapas och ingen `SÄLJ`-rad loggas, eftersom ett fiktivt utfall skulle förgifta just den beslutsstatistik loggen finns för. Positionen står på −0,03 % mot entry 773,26 (2026-08-10), i praktiken oförändrad.

---

## Pending-planer
* **NVDA ≤ 217,00 USD (BEN 2, delat entry punkt 4a)** – **TRIGGAD** (dagslägsta 216,77 USD, Yahoo Finance chart API via `state/prices.json`, marketTime 2026-08-10 20:00:00 UTC; bekräftad av `state/alerts.json`, `basis: "intraday"`, `hitPrice: 216,77`) → köpt till limitnivån 217,00, sammanslagen med den befintliga innehavsraden, pending-raden struken med `~~…~~` och Status satt till "TRIGGAD 2026-08-10". Kapitalet togs ur sleeven.
* **PLTR ≤ 160,00 USD (BUBBLARE, villkorad plan punkt 4b)** – **EJ TRIGGAD** (kurs 175,23 USD, dagslägsta **170,87**, marketTime 2026-08-10 20:00:00 UTC, prices.json/Yahoo). Kursen ligger **9,5 %** över villkoret och gick i motsatt riktning i går (+1,87 %). Planen är oförändrat giltig t.o.m. **2026-08-17** och ligger kvar; ingen jakt uppåt, det var sträckningen som diskvalificerade ett köp till marknadskurs och den har inte minskat. Katalysatorn (Q2 3/8 + BofA-uppgradering 7/8) är obruten.

## Villkorad plan för prissatt bubblare (promptens LÄGE B punkt 4, ny 2026-08-06)
Regeln prövades **en gång** denna körning, oberoende av innehavsslingan. **Utfall: ingen ny plan läggs.** Villkor (1) faller för samtliga fyra kvarvarande bubblare i `us-veckorapport-260810.md`, och det är avgörande: regeln omfattar bara en bubblare där **saknad verifierad kurs** var skälet att den inte fick en pending-rad.

| Bubblare | Skälet i veckorapporten | Omfattas av regeln? |
|---|---|---|
| **PAYC** (213,45) | Grind 3 ej prövbar (3 punkter i `price_history.json`) + "en rekylfri session är inte en satt bas" | **Nej** – ej beräkningsbar teknik är uttryckligen ett omdömesskäl |
| **U** (43,10) | Grind 3 ej prövbar (3 punkter) | **Nej** – samma skäl |
| **TEAM** (151,87) | Grind 3 ej prövbar (2 punkter) efter +35,3 %-gapet | **Nej** – samma skäl |
| **ANET** (191,52) | Fade efter katalysatorn, tre sessioner i rad | **Nej** – rankad under av omdömesskäl |

Samtliga fyra hade **verifierad kurs redan på måndagen** (L-2 uppfylld), så kursen var aldrig det som saknades – och regeln säger uttryckligen att en bubblare som rankats under av omdömesskäl, "ej beräkningsbar teknik" inbegripen, **aldrig** omfattas. **PLTR** är den femte bubblaren och har redan en aktiv plan; den prövas som pending ovan. Noteras för nästa rotation: ANET:s fade **bröts** i går (+1,51 % till 191,52, första uppgången sedan katalysatorn) – det ändrar inget i dag men är den enda av de fyra vars invändning börjat lösas upp. Avgörandena för alla fem loggas i `state/decisions.json` daterade efter veckorapporten, både för att regeln kräver logg oavsett utfall och för att `watchdog.mjs:checkStalePricedBubblare` annars falsklarmar på dem resten av veckan.

## Scout-kandidater (promptens punkt 2d)
`state/scout_candidates.json` innehöll **en kandidat med `status: "new"` och `book: "us"`** – `260811-NVDA`, skapad av dagens scout-rapport. Den har fått ett avgörande i denna körning; ingen lämnas kvar. Spärrarna prövades i promptens ordning (a → f).

* **NVDA – `rejected`, spärr (e) "ingen ledig kapacitet".** Kandidaten passerar allt före den spärren, och det ska stå tydligt: **(a) confirmed** `true` – $500 md-finansieringsplattformen är bolagets eget pressmeddelande 2026-08-10 20:01:45 UTC, verifierat mot NVIDIA IR och Blackstone, inget rykte. **(b) kurs** verifierad, **219,06 USD** (`priceAsOf` 2026-08-11 08:04:12 UTC, `priceSession` "pre") – en utökad session som ligger EFTER katalysatorn och därför räknas som verifierad enligt punkt 2d, redovisad med session och tidsstämpel. **(c) regim** PÅ (7 753,11 > MA200 7 060,36). **(d) binär händelse** nej – NVDA saknas i `upcoming` i `state/earnings_calendar.json` (generatedAt 2026-08-11 05:51:58 UTC, `errors` tom). **(e) faller här:** NVDA är **redan innehav** och når i dag exakt **25 %** när ben 2 fylls, vilket är takvikten per position. "Avvikelse från 25 % är inte tillåten … skillnaden går till indexsleeven – aldrig till att övervikta ett befintligt innehav." Det finns alltså tre lediga platser i boken men **noll ledig kapacitet för just den här tickern**, och grindarna (f) prövades därför aldrig formellt. Att kandidatens katalysator är stark spelar ingen roll för utfallet: den bekräftar en tes vi redan äger till full vikt, och rätt sätt att uttrycka en starkare tes är inte en större position i samma namn.
* **Konsekvens:** noll promotioner (taket är en per körning ändå). Avgörandet är loggat i `state/decisions.json` som `AVVAKTA` med den namngivna spärren, så `decision_eval.mjs` får raden som kontrafaktiskt underlag – och den är mätbar, eftersom NVDA ligger i `config/watchlist_us.txt`. Validerat med `node .github/scripts/validate-scout-candidates.mjs` (OK, 11 kandidater). Ingen kandidat i filen ligger kvar som `new` efter sitt `expiresAt`.

## Intradag-signaler & monitor-hälsa (promptens punkt 2c/2c2)
**Monitorns hälsa kontrollerad FÖRST:** `state/alerts.json` bär `checkedAt` **2026-08-11 11:51:19 UTC**, alltså **2 timmar** gammalt vid körningen (13:55 UTC) – väl inom sexatimmarsgränsen. Fältet finns, så actionen kör kod från efter 2026-08-02. **Intradagsskyddet är alltså närvarande**, ingen L-3-defekt att eskalera här och ingen manuell nivåkontroll behöver ersätta det.

`active` innehöll **två** signaler, varav en rör US-boken:
* **NVDA – KÖP, "entry-villkor uppfyllt"**, nivå 217, `basis: "intraday"`, `hitPrice: 216,77`, marketTime 2026-08-10 20:00:00 UTC. **Åtgärdad:** det är precis ben 2:s villkor, och positionen är köpt och sammanslagen i denna körning. Signalen tystnar av sig själv när `alerts.json` byggs om mot den uppdaterade portföljfilen, eftersom pending-raden nu är struken.
* **ASSA-B.ST – KÖP** rör den **nordiska** boken och hanteras av `prompts/dagligprompt.md`; ingen åtgärd härifrån.

Ingen signal ignoreras tyst.

## Datakvalitet (L-3)
* **`state/prices.json`:** `schemaVersion` **"2026-08-02-prevclose"** finns, `generatedAt` 2026-08-11 12:05:11 UTC – dagsrörelser mot `previousClose` är därmed giltiga. Att `price` för US-aktier är måndagens stängning på en tisdag före öppning (13:30 UTC) är **förväntat, ingen defekt**. `marketState` är `null` för samtliga symboler; sessionsstatus har därför härletts ur `marketTime` plus de utökade fälten (`extendedSession`), aldrig ur klockslag.
* **`state/news_feed.json` – ÅTGÄRDSPUNKT TILL DREN.** Fältet `feeds` visar `globenewswire: "fel: This operation was aborted – båda försöken"` och `globenewswire-earnings: "fel: This operation was aborted – båda försöken"`, alltså avbrott även efter den automatiska omförsöksrundan. **Omfång:** **2 av 6 flöden** nere i **samtliga hämtningar sedan 2026-08-10 20:04 UTC** (sju på varandra följande körningar; sista lyckade hämtningen var 2026-08-10 14:32 UTC). Felet är ett avbrott/timeout, inte "0 poster – kontrollera URL", vilket pekar på svarstid eller blockering snarare än en trasig URL. **Påverkan på dagens beslut: ingen.** Fönstret bär fortfarande **10 av 10 handelsdagar** (`window.tradingDaysCovered` 10, `missingDays` tom) med 180 + 51 poster kvar från tidigare körningar, och dagens enda US-relevanta rubrik kom via `mfn` och verifierades mot NVIDIA IR. Men GlobeNewswires earnings-flöde är den kanal som fångar rapportöverraskningar, så en fortsatt nedgång urholkar kandidatgenereringen i måndagens LÄGE A utan att något går sönder. Samma defekt fördes upp i `reports/daily/daglig-260811.md` i morse – detta är andra rapporten som beskriver den.
* **`state/price_history.json`:** de fyra bubblarna PAYC (3 punkter), U (3), TEAM (2) och ANET (5) är fortfarande för tunna för RSI(14), som kräver 15. **ÅTERKOMMANDE** – samma defekt beskrevs i `us-veckorapport-260810.md` (då 6 symboler) och i `us-veckorapport-260803.md`. Omfånget krymper långsamt av sig självt när `prices.yml` fyller på, men det blockerar just nu grind 3 för fyra av fem bubblare.

## Åtgärder i portfolj_us.md
* **KÖP NVDA ben 2 @ 217,00 USD (12,5 %)** → sammanslagen med den befintliga raden enligt punkt 4a: vikt **25 %**, viktat entry **220,48**, entry-datum oförändrat 2026-08-10, stop **211,00** oförändrad, mål **256,00** oförändrat, R/R omräknad till **1:3,7**. Ingen andra rad för samma ticker.
* **Pending-raden NVDA ≤ 217,00 struken** med `~~…~~`, Status "TRIGGAD 2026-08-10 (registrerad 2026-08-11)" – raden raderas aldrig.
* **Indexsleeven (SPY) minskad 87,5 % → 75 %** för att finansiera ben 2. Kassan står kvar på 0 %.
* **PLTR-planen ≤ 160,00 lämnad oförändrad** (EJ TRIGGAD, giltig t.o.m. 2026-08-17).
* "Senast uppdaterad" satt till 2026-08-11 15:55 CEST. **Ackumulerad avkastning oförändrad +0,00 %** – noll stängda affärer, och en sleeve-omviktning är ingen stängd affär.
* `config/watchlist_us.txt` **oförändrad**: samtliga symboler med ett beslut i dag (NVDA, SPY, PLTR, PAYC, U, TEAM, ANET) ligger redan i listan, och `missingSymbols` i `state/decision_eval.json` är tom – inga rader blir omätbara (punkt 6b).

## Bevakning inför imorgon
* **★ ONSDAG 12/8 08:30 ET – juli KPI (CPI).** Veckans i särklass viktigaste datapunkt och ett bredmarknadsbinärt event. Konsensus ligger fortsatt över 3 %; en het siffra slår hårdast mot AI-/hög-multipelnamn och därmed direkt mot NVDA-positionen, en mjuk siffra bekräftar sänkningsspåret efter fredagens jobbchock (NFP −23k). Positionen hålls genom siffran – den är inte bolagsbinär, stoppen 211,00 ligger 3,0 % under måndagens stängning och sköter risken utan att behöva flyttas.
* **Torsdag 13/8 – juli PPI + jobless claims.** Bekräftar eller motsäger CPI dagen innan.
* **Nivåer att hålla ögonen på:** NVDA stop **211,00** (monitorn larmar intradag; stödet 211,94 från 2026-08-04 ligger strax över) och PLTR-planens **160,00**. Inget innehav och ingen pending-symbol har rapport inom 2 handelsdagar enligt `state/earnings_calendar.json` – kalenderns `upcoming` innehåller enbart nordiska bolag den närmaste veckan.
* **Kvarvarande giltighet:** PLTR-planen avförs 2026-08-17 om den inte triggat.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
