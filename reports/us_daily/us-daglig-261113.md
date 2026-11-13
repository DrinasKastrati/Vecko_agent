# Daglig bevakning – US-rotation
**Datum:** 2026-11-13 | **Läge:** Daglig bevakning (USD)
**Marknadsläget i korthet:** Torsdagen 12/11 föll S&P 500 **−0,35 % till 7 592,40** (intervall 7 550,84–7 652,76) och Nasdaq Composite **−0,39 % till 25 366,09** (`state/prices.json`, marketTime 2026-11-12T21:58Z resp. 22:15Z, `generatedAt` 2026-11-13T14:29Z, `schemaVersion` 2026-08-02-prevclose). NVIDIA bekräftade före öppning 12/11 att vd Jensen Huang lämnar med omedelbar verkan (NVIDIA 8-K, SEC 2026-11-12, enligt scout-rapport-261113). NVDA stängde −4,34 % till 166,19 efter ett dagslägsta på 148,80. **Regimfiltret är PÅ:** ^GSPC ligger **+3,48 %** över MA200 7 337,33 (`state/price_history.json`, 250 punkter). Indexet ligger under både EMA20 7 604,83 och EMA50 7 638,33. RSI är 48,4, och MACD-histogrammet är negativt men stiger (−9,25 → −3,20). USD/SEK står på 10,0573 (marketTime 2026-11-13T14:29Z). PPI publiceras i dag (scout-rapport-261113).
**Pre-/after-hours:** Körningen startade ~14:55 UTC, alltså strax efter den reguljära öppningen 14:30 UTC. `state/prices.json` (14:29Z) bär ännu bara stängningen 12/11 för SPY och CBOE och saknar utökade kurser för dem. Intradagskurs för 13/11 gick inte att verifiera: Yahoo är nätspärrat i körmiljön, och websök gav ingen daterad nivå. Förbörs- och intradagsläget är därför **EJ VERIFIERAT**. Inget beslut hänger på det: CBOE:s stop ligger 6,48 % under senaste stängning och målet 3,69 % över, och monitorn bevakar nivåerna under sessionen.
**Portföljvikt & kassa:** 87,5 % indexsleeve (SPY) / 12,5 % CBOE (ben 1), 0 % kassa. En av fyra aktieplatser är upptagen. Inga öppna pending-planer.

---

## Innehav 1: Indexsleeve (SPY) (SPY / NYSE Arca)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| $757,12 – prices.json/Yahoo chart API, 2026-11-12 21:00 UTC, reguljär stängning | −2,09 % | – | – | **BEHÅLL** |

**Pre-/after-hours:** – (ingen utökad kurs i filen, och sleeven har inga nivåer)
**Nyheter senaste 24h:** 2026-11-12: S&P 500 −0,35 %. SPY handlades mellan 753,70 och 763,03 och stängde −0,35 %, på volym 0,78× 20-dagarssnittet (`state/prices.json`, `state/volume_history.json`). Vd-bytet i NVIDIA (8-K 2026-11-12) gav bara en liten indexeffekt, eftersom AMD och AVGO steg (scout-rapport-261113).
**Motivering:** Sleeven har varken stop eller mål och ligger kvar på 87,5 %. Inget aktieköp eller -sälj i dag kräver omviktning. Kursen ligger 3,49 % över MA200 731,62 och strax under EMA20 758,16.

---

## Innehav 2: Cboe Global Markets (CBOE / Cboe BZX)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| $368,89 – prices.json/Yahoo chart API, 2026-11-12 21:00 UTC, reguljär stängning | +9,94 % | $345,00 (avstånd −6,48 %) | $382,50 (avstånd +3,69 %) | **BEHÅLL** |

**Pre-/after-hours:** EJ VERIFIERAT (ingen utökad kurs i `state/prices.json`, ingen daterad nivå via websök).
**Nyheter senaste 24h:** 2026-11-12: CBOE −0,08 % till 368,89. Aktien nådde intradag ett nytt högsta på 378,35 men stängde nära dagslägsta 368,14, på volym 1,04× (`state/prices.json`, `state/volume_history.json`). `state/news_feed.json` (`generatedAt` 2026-11-13T13:11Z) har inga CBOE-poster för 12–13/11, och websök gav ingen bolagsnyhet daterad i perioden.
**Motivering:** Tesen är intakt (Q3 30/10: justerat EPS 3,63, +36 %, sänkt opex-guide; SEC 8-K ex. 99.1). Läget har **försvagats något** sedan i går: dagens nya högsta 378,35 backades ned till stängning nära dagslägsta, och MACD-histogrammet sjunker (2,45 → 2,31) vid RSI 72,7. Trenden står ändå kvar, med kurs över EMA20 339,13 > EMA50 316,38 > EMA200 294,28. Ingen nivå korsades: dagslägsta 368,14 låg över stoppen och dagshögsta 378,35 under målet. Stoppen 345,00 lämnas orörd, eftersom det inte finns något nytt swingstöd inom 5–6 %-bandet (punkt 1). Ingen CBOE-rapport ligger inom 2 handelsdagar (`state/earnings_calendar.json`).

---

## Pending-planer
Inga pending-planer. Alla rader i `state/portfolj_us.md`:s Pending-sektioner är redan överstrukna (TRIGGADE eller AVFÖRDA).

**Intradag-signaler (2c/2c2):** `state/alerts.json` har `checkedAt` **2026-11-12T22:03:27Z**, alltså ~16,9 timmar gammalt vid körningen. Monitorn körde alltså efter US-stängningen 12/11, och den fungerade under gårdagens session. Under dagens förbörstimmar syns ingen körning, och enligt punkt 2c2 räknas intradagsskyddet därför som **FRÅNVARANDE** för den här körningen. Nivåerna har prövats manuellt mot verifierad kurs ovan. Den enda aktiva signalen (MORLD.OL) hör till den nordiska boken. SPY och CBOE står i `watched`.

**Scout-kandidater (punkt 2d) – tre nya, samtliga avvisade:**
- **`261113-NVDA` (NVIDIA) – AVVISAD, spärr (d): binär händelse inom 2 handelsdagar.** Katalysatorn är nu bekräftad: vd-bytet framgår av en 8-K signerad 2026-11-12. Kursen 166,19 (2026-11-12 21:00 UTC) är post-event, och regimen är PÅ. Rapporten kommer dock 17/11 (`state/earnings_calendar.json`, `isEstimate: false`, `tradingDaysAway` 2), och köp inför en rapport är underkänt (punkt 2e). Aktien ligger dessutom **18,7 % under MA200 204,34**, med RSI 26,0, så den hade fallit på grind 2 också.
- **`261113-CSCO` (Cisco) – AVVISAD, grind 2 (teknik): kurs under MA200.** Rapporten är bekräftad (Q1 FY27, 12/11 efter stängning). Förbörskursen 98,87 USD (förbörs 2026-11-13 13:00 UTC) ligger under MA200 102,26, och det blockerar en ny aktieposition (`prompts/gemensam_korning.md`). Kursen ligger också under EMA20 103,56 och EMA50 107,16, och MACD-histogrammet är negativt (−0,72 → −0,35).
- **`261113-AMAT` (Applied Materials) – AVVISAD, grind 2 (teknik): kurs under MA200.** Rapporten är bekräftad (Q4 FY26, 12/11 efter stängning). Förbörskursen 378,30 USD (förbörs 2026-11-13 13:00 UTC) ligger **15,3 % under MA200 446,39** och under EMA20, EMA50 och EMA200.

Avgörandena är loggade i `state/scout_candidates.json` (`decidedBy` = denna rapport, `decidedAt` 2026-11-13) och som `AVVAKTA`-rader i `state/decisions.json`.

**Villkorad bubblar-plan (LÄGE B):** Ingen bubblare är kvar att pröva. ABNB var den enda bubblaren i us-veckorapport-261109 som föll på saknad kurs, och dess katalysator föll ur femdagarsfönstret efter 12/11. Ingen plan läggs.

## Åtgärder i portfolj_us.md
- Inga affärer. CBOE (12,5 %, stop 345,00, mål 382,50) och sleeven (87,5 %) är oförändrade. Anteckningen på CBOE-raden är kompletterad med dagens BEHÅLL.
- "Senast uppdaterad" och Kassa-sektionen är uppdaterade. Ackumulerad avkastning är oförändrad, **−6,49 %**, eftersom ingen affär stängdes.
- `state/decisions.json`: 5 nya rader (`book: "us"`, `mode: "B"`): BEHÅLL SPY (vikt 0,875), BEHÅLL CBOE samt AVVAKTA för NVDA, CSCO och AMAT.

## Bevakning inför imorgon
* **Nästa körning är måndag 16/11 = LÄGE A (v47).** CBOE prövas mot stop/mål, och tre lediga platser ska fyllas eller lämnas i sleeven.
* **Rapporter (`state/earnings_calendar.json`, `generatedAt` 2026-11-13T01:48Z):** 17/11 `HD` och `NVDA`; 18/11 `LOW` och `TGT`; 19/11 `ROST` och `WMT`. Kalendern täcker bara symboler som prisbevakas, så resten av US-marknaden är **OKONTROLLERAD** (L-5). CBOE har ingen rapport inom fönstret.
* **NVDA 17/11:** NVIDIA är en tung S&P 500-vikt. Den första rapporten efter vd-bytet kan därför slå mot sleeven och mot halvledarkedjan. Sleeven har inga nivåer, så ingen åtgärd följer av det.
* **CBOE:** stop 345,00, mål 382,50 (+3,69 %). Gårdagens backning från 378,35 och den fallande MACD:n vid RSI 72,7 gör en rekyl möjlig. Monitorn bevakar nivåerna under sessionen.
* **Åtgärdspunkt till Dren (L-3), ÅTERKOMMANDE:** vid körningen ~14:55 UTC är `checkedAt` i `state/alerts.json` 2026-11-12T22:03Z, och ingen monitorkörning syns under dagens förbörstimmar. **Omfång:** intradagsskyddet före den amerikanska öppningen.
* **Åtgärdspunkt till Dren (L-3), ÅTERKOMMANDE:** i `state/news_feed.json` (`generatedAt` 2026-11-13T13:11Z) står `feeds.globenewswire` och `feeds.globenewswire-earnings` på "HTTP 403 – båda försöken". **Omfång:** 2 av 6 flöden. Fönstret täcker ändå 10 av 10 handelsdagar (`missingDays` tom). **Ersättningskälla:** websök och SEC 8-K.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
