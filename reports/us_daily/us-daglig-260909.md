# Daglig bevakning – US-rotation
**Datum:** 2026-09-09 | **Läge:** Daglig bevakning (USD)
**Marknadsläget i korthet:** S&P 500 stängde 2026-09-08 på **7 673,52** (−0,58 %) och Nasdaq Composite på **26 421,41** (−0,32 %) – andra raka nedgångssessionen efter fredagens NFP-styrka, med intervallet 7 666,99–7 717,81 (`state/prices.json`, marketTime 2026-09-08T21:00:56Z). Riskaptiten är avvaktande snarare än säljande: dagens enda schemalagda makropost är **arbetskostnadsstatistik 10:00 ET** (websök 2026-09-09, CNBC/StrongBuyAnalytics), och terminerna låg nära oförändrat före öppning. **Regimfiltret är PÅ** – ^GSPC 7 673,52 ligger **+7,37 %** över sitt 200-dagars glidande medel **7 147,02**, räknat ur 250 daterade stängningar i `state/price_history.json`. Marginalen har krympt fyra sessioner i rad (+8,56 % den 4/9) men spärren är inte i närheten av att slå om.
**Pre-/after-hours:** Boken äger endast indexsleeven, som saknar stop och målkurs – ingen nivå kan korsas utanför reguljär session. `state/prices.json` bär i dag **`extendedCount: 1`** (ZS förbörs 162,1177 USD, 2026-09-09T12:18:51Z); SPY har ingen utökad notering. Inga innehav rapporterade after-hours och inga rapporter väntas (se Bevakning nedan).
**Portföljvikt & kassa:** 100 % indexsleeve (SPY) / 0 % aktier / 0 % kassa – fyra tomma aktieplatser, noll öppna pending-planer.

---

## Innehav 1: Indexsleeve (SPY / NYSE Arca)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| 765,96 USD – Yahoo Finance (chart API) via `state/prices.json`, 2026-09-08 20:00 UTC, reguljär stängning | −0,94 % | – | – | **BEHÅLL** |

**Pre-/after-hours:** – (ingen utökad notering för SPY i `state/prices.json`; `extendedCount` 1 avser ZS)
**Nyheter senaste 24h:** Inga bolagsspecifika nyheter är tillämpliga – sleeven är en indexparkering, inte ett case. Marknadsrörelsen ovan är den relevanta informationen.
**Motivering:** Sleeven föll −0,55 % på dagen (previousClose 770,19, `schemaVersion` `2026-08-02-prevclose` finns, så dagsrörelsen räknas ur filen) och står **−0,94 % mot entry 773,26** efter att ha varit −0,01 % i fredags. Rörelsen är index och inget annat: dagsintervallet 765,15–769,70 följer ^GSPC:s −0,58 %. Sleeven har per konstruktion **ingen stop och inget mål och säljs aldrig på nedgång** (INDEXSLEEVE-regeln) – den är den avsedda placeringen för oallokerat kapital, och punkt 0c mäter att parkeringen är en aktiv och lönsam handling, inte ett fel som ska åtgärdas med ett framtvingat case.

---

## Pending-planer
**Inga pending-planer.** Pending-sektionen i `state/portfolj_us.md` har noll öppna rader – samtliga fem befintliga är strukna och avförda eller triggade (XOM ben 2 och TGT avfördes 2026-08-26 på sin femte handelsdag; MU och NVDA triggade och är sedan stängda; PLTR avfördes 2026-08-17). Ingen nivå att pröva mot verifierad kurs denna körning.

### Intradag-signaler och monitorns hälsa (punkt 2c2 före 2c)
**Intradagsskyddet är NÄRVARANDE.** `state/alerts.json` bär `checkedAt` **2026-09-09T12:09:42Z**, alltså **10 minuter** gammalt vid körningen och långt inom punkt 2c2:s ~6-timmarsgräns. `generatedAt` står på 2026-09-07T13:18:17Z, vilket är korrekt beteende och inte ett fel: fältet flyttas bara när signalmängden ÄNDRAS, medan `checkedAt` visar att monitorn faktiskt kört. `active` är **tom** – noll signaler i någon av böckerna. Boken har ändå noll positioner med nivåer, så konsekvensen är noll denna körning.

### Scout-kandidater (punkt 2d)
`state/scout_candidates.json` bär **en post med `status: "new"` och `book: "us"`** – den avgörs här, ingen lämnas kvar.

**`260906-ZS` (Zscaler, NASDAQ) → `rejected`.** Spärrarna prövade i föreskriven ordning:

| Spärr | Utfall |
|---|---|
| a) obekräftad katalysator | **Passerar** – `confirmed: true`, Q4 FY26 rapporterad 2026-09-03 AMC |
| b) kurs ej verifierbar | **Passerar** – kandidaten bar 169,10 USD (`priceSession: "post"`, 2026-09-04T23:59:50Z), men det finns nu en **reguljär stängning 161,94 USD** (marketTime 2026-09-08T20:00:00Z), som är den strängare och färskare kursen och den jag avgör på |
| c) regimen av | **Passerar** – regimen är PÅ (+7,37 %) |
| d) binär händelse ≤ 2 handelsdagar | **Passerar** – nästa rapport 2026-11-24 i `state/earnings_calendar.json`, och den är `isEstimate: true`, alltså aldrig en bekräftad binär händelse |
| e) ingen ledig plats | **Passerar** – noll innehav, fyra tomma platser |
| **f) de fem grindarna** | **FALLER på det tekniska filtret (punkt 2)** |

**Vad grind f faller på, med faktiska värden ur `state/price_history.json` och `state/volume_history.json` (250 respektive 250 punkter):** MACD-linjen **2,731 ligger under signallinjen 5,610**, histogrammet **−2,878 och fallande** (−2,089 föregående dag) – motsatsen till kravet "färskt bullish kors/stigande histogram". Kursen **161,94 ligger under EMA20 173,69, EMA50 164,81 OCH EMA200 190,41**, alltså under samtliga tre. **Volymkvoten är 1,42×**, under kravet 1,5×. RSI(14) står på **43,6**, under det önskade bandet 50–70. Enda delkriteriet som håller är likviditetsgolvet: **467,1 MUSD/dag** räknat som 20-dagarssnittet av volym × kurs, långt över 20 MUSD.

**Katalysatorns riktning är dessutom negerad, vilket är den viktigare observationen.** Kandidatens tes är en beat-and-raise (intäkt 898 MUSD mot väntade ~877, just. EPS 1,19 mot ~1,09, ARR 3,77 mdr +25 %), och siffrorna stämmer. Men marknaden sålde den: **177,80 (3/9) → 169,80 (4/9) → 161,94 (8/9), alltså −8,92 % från katalysatordagens stängning**, varav −4,63 % i gårdagens session. Skälet är det kandidatens egen bear-mening redan pekade ut – FY27-guidance bromsar tillväxten till ~17 % från 25 % – i kombination med en AI-driven omstrukturering och pressat fritt kassaflöde (CNBC 2026-09-03, Benzinga och Investing.com 2026-09-04, websök 2026-09-09). **En bekräftad rapport med säljreaktion är ingen bull-katalysator**, och detta är samma bedömning som `us-veckorapport-260901` gjorde om MRVL och IREN. Att analytiker höjt riktkurser till 200–225 USD ändrar inget: grindarna prövar kurs och teknik, inte målkurser satta av andra.

Dagens rubrik **"Zscaler launches Agentic SOC to contain AI-Driven Threats"** (`state/news_feed.json`, globenewswire 2026-09-09T07:01Z) är en produktlansering, alltså en **stödsignal enligt punkt 1c och ingen katalysator ur punkt 1a** – den flyttar ingen grind.

**L-4-kontrollen:** noll icke-utlöpta `rejected`-poster med `book: "us"` ligger kvar inom sin `expiresAt` (de två senaste, `260901-CVX` och `260901-DE`, löpte ut 2026-09-08). Ingen post är avvisad på ett tillfälligt datavillkor som hunnit ikapp, och ingen omprövning åligger boken. ZS avvisas här på ett **omdömesskäl** (teknik), inte på ett datavillkor – posten omfattas därmed uttryckligen ALDRIG av L-4 och tas inte upp igen förrän nästa LÄGE A-rotation.

### Villkorad bubblar-plan (punkt 4, prövad en gång denna körning)
**Ingen plan läggs – regeln faller på villkor 1 för samtliga fem bubblare.** Senaste US-veckorapporten är `us-veckorapport-260901.md`, och där fälldes **grind 1 noll av 32 kandidater** – samtliga hade verifierad kurs. Ingen av de fem bubblarna angavs alltså ha saknad verifierad kurs som skäl; de föll på omdöme (TSLA och DE på grind 3, MU, NVDA och PLTR på grind 2). Villkor 1 kräver uttryckligen att kursen var det ENDA som saknades, och en bubblare som rankats under av omdömesskäl omfattas ALDRIG.

Kontrollen är gjord per bubblare mot verifierad kurs 2026-09-08 och omräknad teknik, och **grind 2 håller dessutom fortfarande emot i samtliga fem** – volymkvoten är under 1,5× rakt igenom:

| Bubblare | Kurs (2026-09-08) | Veckorapportens spärr | Volymkvot nu | Status i dag |
|---|---|---|---|---|
| TSLA | 368,16 (+3,98 %) | Grind 3 – hype enligt 1c | 1,34× | Villkor 1 faller; MACD bullish men volym under kravet |
| DE | 680,73 (−1,85 %) | Grind 3 – uppgradering är stödsignal | 0,68× | Villkor 1 faller; histogrammet viker 7,818 → 6,408 |
| MU | 1 000,26 (−1,61 %) | Grind 2 – volymkvot 0,74× | 0,96× | Villkor 1 faller; Q4 rapporteras 2026-09-30 |
| NVDA | 225,73 (−2,01 %) | Grind 2 – MACD + volym 0,97× | 0,93× | Villkor 1 faller; volym fortsatt under kravet |
| PLTR | 170,30 (−2,31 %) | Grind 2 – volymkvot 0,56× | 0,77× | Villkor 1 faller; MACD har vänt bearish |

Samtliga fem är loggade som `AVVAKTA` i `state/decisions.json` med den namngivna spärren, så `checkStalePricedBubblare` har en rad daterad efter veckorapporten och ger inget falsklarm.

## Åtgärder i portfolj_us.md
**Inga ändringar i innehav, vikter eller historik – endast "Senast uppdaterad" är uppdaterad.** Noll köp, noll sälj, noll rotationer. Boken står kvar på 100 % indexsleeve med fyra tomma platser, och **ackumulerad avkastning är oförändrad −2,87 %** eftersom ingen affär stängts. `state/scout_candidates.json` är uppdaterad med avgörandet för `260906-ZS`, och sju rader är appendade till `state/decisions.json` (1 × BEHÅLL för sleeven, 1 × AVVAKTA för ZS, 5 × AVVAKTA för bubblarprövningen).

**`config/watchlist_us.txt` lämnas oförändrad.** Samtliga sju symboler jag fattat beslut om i dag (SPY, ZS, TSLA, DE, MU, NVDA, PLTR) har redan rad i filen, så punkt 6b är uppfylld, och `missingSymbols` i `state/decision_eval.json` är **tom** – varje loggad rad går att mäta. Filen ligger över riktmärket 25 symboler, men punkt 6b går uttryckligen FÖRE taket: varje symbol där bär en dokumenterad beslutsrad, och en rensning skulle göra just de raderna omätbara för alltid eftersom `price_history.json` bara backfillas för hämtade symboler. Hygienen hör dessutom hemma i LÄGE A, som inte kört denna vecka (åtgärdspunkt 1).

## Åtgärdspunkter till Dren (L-3)

**1. ÅTERKOMMANDE – US-rotationens LÄGE A uteblev igen, denna gång 2026-09-08.** Måndagen 2026-09-07 var **Labor Day** och de amerikanska börserna var stängda (`state/price_history.json` för ^GSPC går direkt 2026-09-04 → 2026-09-08, ingen 09-07-punkt). Veckans första US-handelsdag var därmed **tisdag 2026-09-08**, och enligt "VÄLJ LÄGE EFTER DAG" skulle LÄGE A ha körts då. Det gjordes inte: `reports/us_weekly/` slutar fortfarande på **`us-veckorapport-260901.md`**, och `state/decisions.json` bär **noll rader med `book: "us"` för 2026-09-07, 2026-09-08 och 2026-09-09** (mot 27 nordiska rader den 07/9 och 7 den 08/9 – den nordiska boken körde alltså normalt). Ingen fil finns heller i `reports/us_daily/` för 09-07 eller 09-08, alltså startade routinen inte alls dessa dagar. **Omfång: US-boken saknar köpväg för tredje veckan i följd** – LÄGE A uteblev 2026-08-24 och 2026-08-31, togs igen av en extra rotation 2026-09-01, och har nu uteblivit på nytt. Boken står i sleeven med fyra tomma platser. **Åtgärd: kör `prompts/us_dagligprompt.md` i LÄGE A för hand**, annars är nästa ordinarie tillfälle måndag 2026-09-14. Denna körning är LÄGE B enligt promptens dagregel och kan inte ersätta rotationen.

**2. NY – `watchdog.mjs:checkUsRotation` har en helgdagsblind fläck och var tyst på exakt det fall den byggdes för.** Kontrollen grindar på `isMonday` (rad 246: `if (!isMonday || …) return []`). Det ger fel utfall åt **båda** hållen när måndagen är en amerikansk börshelgdag: på måndagen 2026-09-07 var `isMonday` sant och ingen us-veckorapport fanns, så kontrollen larmade om en rotation som **inte var påbörjad** – ett falsklarm, eftersom LÄGE A inte ska köras på en stängd marknad. På tisdagen 2026-09-08, som **faktiskt bar veckans rotation**, var `isMonday` falskt och kontrollen **tyst**. Nettot är att den enda mekanism som ska fånga en utebliven US-rotation missade den, precis som i augusti. **Omfång: varje vecka vars måndag är en US-marknadshelgdag – nio sådana måndagar under 2026** (bl.a. Labor Day 07/9, Thanksgiving-veckan undantagen, Christmas 25/12). **Förslag:** grinda på "veckans första US-handelsdag" härledd ur `^GSPC`-serien i `state/price_history.json` (det första daterade datumet i den ISO-veckan) i stället för på veckodagen – serien vet redan vilka dagar som var handelsdagar, och samma härledning löser problemet i båda riktningarna.

**3. ÅTGÄRDAD – `extendedCount` är tillbaka på 1.** Åtgärdspunkt 4 i `us-daglig-260903`/`-260904` gällde att `state/prices.json` bar `extendedCount: 0` fyra dygn i rad, vilket gjorde förbörs- och efterbörsrörelser omätbara ur repots egna källor. Filen bär i dag **`extendedCount: 1`** (ZS, `extendedSession: "pre"`, `extendedTime` 2026-09-09T12:18:51Z). Defekten är därmed inte längre observerbar; punkten stängs och återupptas bara om fältet faller till 0 igen.

**4. KVARSTÅR – ingen fil i repot räknar upp makrokalendern.** Dagens arbetskostnadssiffra 10:00 ET är hämtad ur websök (CNBC/StrongBuyAnalytics 2026-09-09) och **inte verifierad ur repots egna källor**: `fed-press` bär 2 poster i tiodagarsfönstret och ingen fil räknar upp BLS:s eller Feds datum. Samma strukturella lucka som beskrevs 2026-09-04. Omfång: varje makropost i varje rapport måste märkas som obelagd.

## Bevakning inför imorgon
* **Inga rapporter bland de symboler kalendern kan se.** `state/earnings_calendar.json` (`generatedAt` 2026-09-09T09:39:02Z, `errors` **tom**) har **`upcoming: []`** – noll bolag rapporterar inom 10 handelsdagar. **L-5-markering:** kalendern känner endast de **113 symboler `prices.yml` faktiskt hämtar** (106 upplösta, 5 i `noCoverage`, 2 i `notApplicable`), så påståendet är "inga rapporter **bland de symboler kalendern kan se**", inte "inga rapporter i USA". Marknaden utanför de hämtade US-symbolerna är **OKONTROLLERAD**.
* **Arbetskostnadsstatistik i dag 10:00 ET** – enda schemalagda makroposten, sätter tonen in mot FOMC. Ej verifierad ur repots källor (åtgärdspunkt 4).
* **FOMC-besked onsdag 2026-09-16** – ingen position tas med horisont som passerar beskedet utan explicit motivering. Även detta ur allmänt känd kalender, inte ur repots källor.
* **Regimfiltrets marginal:** +7,37 % och krympande fyra sessioner i rad. Ingen risk för omslag i närtid, men marginalen är värd att följa – faller ^GSPC under MA200 upphör all nyöppning, vilket är en hård spärr och inte en poängjustering.
* **Nyhetsflödets täckning:** `state/news_feed.json` (`generatedAt` 2026-09-09T09:50:33Z) bär **10 av 10 handelsdagar**, `missingDays` tomt, 1 200 poster, och **samtliga sex flöden svarar normalt** (globenewswire 20, globenewswire-earnings 20, prnewswire 20, mfn 48, sec-8k 40, fed-press 20). Ingen flödesdefekt att rapportera.

**Tillämpade lärdomar:** **L-3** (fyra datadefekter förda som namngivna åtgärdspunkter med kvantifierat omfång, i stället för beskrivna i löptext), **L-4** (kontrollen gjord per post – noll icke-utlöpta poster avvisade på tillfälligt datavillkor, och ZS avvisas uttryckligen på omdömesskäl och omfattas därför inte), **L-5** (varje "inga fler …"-formulering bär källa och täckningsangivelse; rapportkalenderns och makrokalenderns otäckta delar är märkta OKONTROLLERADE), **L-6** (ingen kandidat stryks med hänvisning till en fokus- eller universumfil – ZS är poängsatt fullt ut och avvisad på en namngiven grind).

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
