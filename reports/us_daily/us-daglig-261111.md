# Daglig bevakning – US-rotation
**Datum:** 2026-11-11 | **Läge:** Daglig bevakning (USD)
**Marknadsläget i korthet:** Tisdagen 10/11 föll S&P 500 **−0,38 % till 7 520,93** (intervall 7 470,43–7 543,92) och Nasdaq Composite **−0,74 % till 25 065,88** (`state/prices.json`, marketTime 2026-11-10T22:00Z resp. 22:15Z, `generatedAt` 2026-11-11T12:41Z, `schemaVersion` 2026-08-02-prevclose). **Regimfiltret är PÅ:** ^GSPC ligger **+2,59 %** över MA200 7 331,05 (`state/price_history.json`, 250 punkter), men under EMA20 7 604,75 och EMA50 7 641,06. RSI är 44,5 och MACD-histogrammet är negativt men stiger (−25,63 → −20,29). USD/SEK står på 9,9251 (2026-11-11T12:40Z). Terminskurserna för 11/11 gick inte att verifiera i någon daterad källa. Veterans Day är ingen NYSE-helgdag, så aktiebörserna har öppet i dag.
**Pre-/after-hours:** `state/prices.json` har inga utökade kurser för SPY, CBOE eller U, och websök gav ingen daterad förbörsnivå för dem 2026-11-11. Förbörsläget är därför **EJ VERIFIERAT**. Inget beslut hänger på det: CBOE:s stop ligger 5,43 % under stängningen. Kandidaterna har förbörskurser i filen: **`COST` 1 069,33 (förbörs 2026-11-11 12:39 UTC)**, +0,30 % mot stängningen 1 066,14, och **`CRWV` 56,84 (förbörs 2026-11-11 12:39 UTC)**, +16,64 % mot stängningen 48,73.
**Portföljvikt & kassa:** 87,5 % indexsleeve (SPY) / 12,5 % CBOE (ben 1), 0 % kassa. En av fyra aktieplatser är upptagen. Inga öppna pending-planer: U-planen triggades 10/11 men avfördes vid omprövningen, se nedan.

> **Körningen 2026-11-10 uteblev.** Det finns ingen `us-daglig-261110.md` och inga `book: "us"`-rader daterade 2026-11-10 på main. U-planens trigger och scoutkandidaterna `261110-AMD`/`261110-CEG` från i går avgörs därför i dag. Inga bakdaterade affärer görs.

---

## Innehav 1: Indexsleeve (SPY) (SPY / NYSE Arca)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| $749,92 – prices.json/Yahoo chart API, 2026-11-10 21:00 UTC, reguljär stängning | −3,02 % | – | – | **BEHÅLL** |

**Pre-/after-hours:** – (ingen utökad kurs i filen, och sleeven har inga nivåer)
**Nyheter senaste 24h:** 2026-11-10: S&P 500 föll −0,38 %. SPY handlades mellan 744,87 och 752,14 med volym 0,83× 20-dagarssnittet (`state/prices.json`, `state/volume_history.json`).
**Motivering:** Sleeven har varken stop eller mål och ligger kvar på 87,5 %. Inget aktieköp eller -sälj i dag kräver omviktning. Kursen ligger 2,59 % över MA200 730,99 men under EMA20 758,11 och EMA50 761,77.

---

## Innehav 2: Cboe Global Markets (CBOE / Cboe BZX)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| $364,81 – prices.json/Yahoo chart API, 2026-11-10 21:00 UTC, reguljär stängning | +8,73 % | $345,00 (avstånd −5,43 %; höjd från 334,00) | $382,50 (avstånd +4,85 %) | **BEHÅLL** |

**Pre-/after-hours:** EJ VERIFIERAT (ingen utökad kurs i `state/prices.json`, ingen daterad förbörsnivå via websök).
**Nyheter senaste 24h:** 2026-11-10: CBOE steg **+3,41 % till 364,81** (intervall 352,00–364,95, volym 0,73×) mot ett S&P 500 på −0,38 % (`state/prices.json`). Det är nära 250-dagarshögsta 366,70. `state/news_feed.json` har inga CBOE-poster, och websök gav ingen daterad bolagsnyhet för 10/11. Drivkraften bakom rörelsen är därför **EJ VERIFIERAD**.
**Motivering:** Tesen är intakt (Q3 30/10: justerat EPS 3,63, +36 %, sänkt opex-guide; SEC 8-K ex. 99.1) och läget har **stärkts** sedan senaste körningen. Kursen ligger över EMA20 332,50 > EMA50 311,99 > EMA200 292,98, och MACD-histogrammet stiger (1,88 → 2,21). RSI 71,7 är däremot överköpt. **Stoppen flyttas UPP 334,00 → 345,00** (punkt 6), under swinglägsta 346,34 (6/11). Det ligger inom 5–6 %-bandet och låser +2,82 % mot entry. Målet 382,50 är oförändrat. Ingen CBOE-rapport ligger inom 2 handelsdagar (`state/earnings_calendar.json`).

---

## Pending-planer
- **U: villkor ≤ 49,00 USD (reguljär session) – TRIGGAD 2026-11-10 → AVFÖRD vid omprövningen.** Sessionen öppnade över nivån (föregående stängning 51,43, dagshögsta 51,785) och föll till dagslägsta **48,945** innan den stängde på 50,34 (prices.json/Yahoo chart API, 2026-11-10 21:00 UTC). `state/alerts.json` bär KÖP-signalen (`basis: "intraday"`, `hitPrice` 48,945). Stoppen 46,20 berördes inte. Enligt LÄGE B punkt 4c och `prompts/gemensam_korning.md` ska samtliga LÄGE A-filter hålla när en pending-plan fylls. Planen föll på **grind 2: volym 0,97× 20-dagarssnittet** (12,49 M; `state/volume_history.json`; kravet i LÄGE A punkt 2 är > 1,5×). Det är samma mått som fällde AMZN (0,87×) och DAL (0,88×) i us-veckorapport-261109 (L-6). Alla övriga filter höll: regim PÅ, RSI 68,0, EMA20 44,18 > EMA50 42,46 > EMA200 37,00, kurs 58 % över MA200, MACD-histogram 1,333 → 1,356, likviditet 647 MUSD/dag, ingen rapport inom 2 handelsdagar. **Inget köp registreras.** Raden är struken med "AVFÖRD 2026-11-11" i `state/portfolj_us.md`, inte raderad, och kapitalet stannar i sleeven.
- Övriga rader i `state/portfolj_us.md`:s Pending-sektioner är redan överstrukna (TRIGGADE eller AVFÖRDA).

**Intradag-signaler (2c/2c2):** `state/alerts.json` har `checkedAt` **2026-11-10T21:39:31Z**, alltså ~15,6 timmar gammalt vid körningen 13:18 UTC. Ingen monitorkörning syns under dagens timmar före den amerikanska öppningen. Enligt punkt 2c2 räknas intradagsskyddet som **FRÅNVARANDE** för den här körningen, och alla nivåer har prövats manuellt mot verifierad kurs ovan. Enda aktiva signal: **U KÖP (entry-villkor uppfyllt)**, som hanteras ovan.

**Scout-kandidater (punkt 2d) – fyra nya, alla avvisade.** Spärrarna (a)–(e) håller för alla fyra. Katalysatorerna är bekräftade, kurserna verifierade och daterade efter katalysatorn, regimen är PÅ och boken har tre lediga platser. Ingen kandidat har en rapport inom 2 handelsdagar i `state/earnings_calendar.json`. Alla fyra faller på (f):
- **`261110-AMD` (AMD) – AVVISAD, grind 2.** Katalysatorn är EPYC som värdprocessor för Google Clouds TPU 8tx och Oppenheimers uppgradering 9/11 (scout-rapport-261110). Stängningen 515,21 (10/11 21:00 UTC) ligger **under EMA20 516,39 och EMA50 531,46**, och MACD-histogrammet är negativt (−7,60 → −3,37). Volymen var 1,62×.
- **`261110-CEG` (Constellation Energy) – AVVISAD, grind 2.** Bekräftat Q3 9/11 (justerat EPS 5,06; SEC 8-K). Stängningen 267,76 ligger **under MA200 278,54**, vilket blockerar nya aktiepositioner, och under EMA200 283,48.
- **`261111-COST` (Costco) – AVVISAD, grind 2.** Extrautdelning 30 USD per aktie och nytt återköp på 4 mdr USD (Costco 8-K, mfn i `state/news_feed.json` 2026-11-10 21:15 UTC). Teknisk ordning och RSI 69,6 håller, men volymen var **0,64×** i senaste reguljära session. Reaktionen i förbörs är bara +0,30 % (1 069,33, förbörs 2026-11-11 12:39 UTC). Extrautdelningen sänker dessutom kursen med ~2,8 % på ex-dagen.
- **`261111-CRWV` (CoreWeave) – AVVISAD, grind 2.** Bekräftat Q3 10/11 efter stängning (intäkt 3 661 MUSD, +168 %). Förbörskursen 56,84 (förbörs 2026-11-11 12:39 UTC) ligger **långt under MA200 89,71**, under EMA20 57,41 och EMA50 69,35.

Avgörandena är loggade i `state/scout_candidates.json` (`decidedBy` = denna rapport, `decidedAt` 2026-11-11) och som `AVVAKTA`-rader i `state/decisions.json`.

**Villkorad bubblar-plan (LÄGE B):** **ABNB** är den enda bubblaren i us-veckorapport-261109 som föll på saknad verifierad kurs, så villkor (1) gäller. Kursen finns nu: 186,90 (prices.json/Yahoo chart API, 2026-11-10 21:00 UTC). Katalysatorn (Q3 5/11 efter stängning, reaktion +11,67 % 6/11) ligger inom 5 handelsdagar. Regimen är PÅ och boken har ledig plats. Vid full poängsättning faller ABNB på **grind 2: volym 1,00×** 10/11 (1,36× 9/11, 3,36× på reaktionsdagen 6/11). Övriga mått höll: kurs över MA200 148,34, EMA20 174,43 > EMA50 170,01 > EMA200 153,20, RSI 62,6, histogram 1,96 → 2,07, likviditet 832 MUSD/dag. **Ingen plan läggs.** AVVAKTA-raden är loggad.

## Åtgärder i portfolj_us.md
- **CBOE: stop-loss flyttad UPP 334,00 → 345,00.** Vikten 12,5 % och målet 382,50 är oförändrade.
- **U-planen ≤ 49,00 avförd** (överstruken med "AVFÖRD 2026-11-11", inte raderad). Den triggade 10/11 men föll på grind 2 (volym) vid omprövningen. Inget köp, och sleeven ligger kvar på 87,5 %.
- "Senast uppdaterad" och Kassa-sektionen är uppdaterade. Ackumulerad avkastning är oförändrad, **−6,49 %**, eftersom ingen affär stängdes.
- `state/decisions.json`: 8 nya rader (`book: "us"`, `mode: "B"`): BEHÅLL SPY (vikt 0,875), BEHÅLL CBOE samt AVVAKTA för U (avförd plan), AMD, CEG, COST, CRWV och ABNB. Raderna är validerade med `--base`, liksom `validate-scout-candidates.mjs` och `validate-state.mjs`.

## Bevakning inför imorgon
* **Rapporter (`state/earnings_calendar.json`, `generatedAt` 2026-11-11T01:14Z):** 12/11 `AMAT`, `CSCO` och `NBIS`; 17/11 `HD` och `NVDA`. Kalendern täcker bara symboler som prisbevakas, så resten av US-marknaden är **OKONTROLLERAD** (L-5). Varken `CBOE` eller någon bubblare har rapport inom fönstret. Köp före rapport är spärrat (punkt 2e).
* **CBOE:** ny stop 345,00 och mål 382,50 (+4,85 %). Med RSI 71,7 nära 250-dagarshögsta 366,70 är en rekyl in mot stoppen fullt möjlig.
* **ABNB och U** är kvar som bevakade namn i `config/watchlist_us.txt`. En U-rekyl till ≤ 49 kräver en NY plan via rotationen eller en scoutkandidat. Den gamla planen återupplivas inte.
* **Åtgärdspunkt till Dren (L-3), NY: volymkravet gör villkorade limit-planer i praktiken ofyllbara.** LÄGE A punkt 2 kräver volym > 1,5× 20-dagarssnittet, och gemensam_korning.md tillämpar samtliga filter även på pending-fills. En limit-plan läggs på en rekyl, och rekyler sker normalt på lägre volym. Snittet blåses dessutom upp av själva katalysatordagen: U:s 20-dagarssnitt bär reaktionsdagen 5/11 på 5,11×. **Omfång:** U-planen 10/11 (0,97×) och ABNB i dag (1,00×). Av tidigare fyllnader passerade ACN (1,52×), MRVL (1,55×) och NUE (1,75×) bara med knapp marginal. **Beslutet att avföra planen följer reglerna som de står. Den här punkten ändrar ingen regel**, men frågan behöver avgöras: ska volymkravet mätas på katalysatorns reaktionsdag eller på fyllnadsdagen? Ändra bara efter mätning i `decision_eval`.
* **Åtgärdspunkt till Dren (L-3), NY: US-körningen 2026-11-10 uteblev.** Det finns ingen rapport och inga beslutsrader för dagen. **Omfång:** U-triggern och två scoutkandidater blev liggande ett dygn. **Åtgärd:** kontrollera routinen "USA-Rotation" (schemaläggningen kl. 15:00).
* **Åtgärdspunkt till Dren (L-3), ÅTERKOMMANDE:** `checkedAt` i `state/alerts.json` är 2026-11-10T21:39Z vid körningen 13:18 UTC, och ingen monitorkörning syns under dagens timmar. **Omfång:** intradagsskyddet för CBOE (stop 345,00, mål 382,50).
* **Åtgärdspunkt till Dren (L-3), ÅTERKOMMANDE:** i `state/news_feed.json` (`generatedAt` 2026-11-11T12:46Z) står `feeds.globenewswire` och `feeds.globenewswire-earnings` på "HTTP 403 – båda försöken". **Omfång:** 2 av 6 flöden. Fönstret täcker ändå 10 av 10 handelsdagar (`missingDays` tom). **Ersättningskälla:** websök och SEC 8-K.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
