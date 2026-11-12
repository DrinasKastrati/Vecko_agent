# Daglig bevakning – US-rotation
**Datum:** 2026-11-12 | **Läge:** Daglig bevakning (USD)
**Marknadsläget i korthet:** Onsdagen 11/11 steg S&P 500 **+1,31 % till 7 619,38** (intervall 7 571,88–7 647,20) och Nasdaq Composite **+1,60 % till 25 466,19** (`state/prices.json`, marketTime 2026-11-11T21:42Z resp. 22:15Z, `generatedAt` 2026-11-12T02:17Z, `schemaVersion` 2026-08-02-prevclose). **Regimfiltret är PÅ:** ^GSPC ligger **+3,89 %** över MA200 7 334,25 (`state/price_history.json`, 250 punkter). Indexet ligger strax över EMA20 7 606,14 men under EMA50 7 640,20. RSI är 49,7, och MACD-histogrammet är negativt men stiger (−20,29 → −9,25). USD/SEK står på 9,9690 (2026-11-12T02:17Z). Efter stängningen 11/11 rapporterade scouten ett ⚠️ RYKTE – EJ BEKRÄFTAT (WSJ, 2026-11-11) om att NVIDIA:s styrelse förbereder ett vd-byte; enligt scouten föll NVDA −8,6 % i efterhandeln. Terminskurserna för 12/11 gick inte att verifiera i någon daterad källa.
**Pre-/after-hours:** `state/prices.json` har inga utökade kurser för SPY eller CBOE, och websök gav ingen daterad förbörsnivå för dem 2026-11-12. Förbörsläget är därför **EJ VERIFIERAT**. Inget beslut hänger på det: CBOE:s stop ligger 6,55 % under stängningen och målet 3,61 % över.
**Portföljvikt & kassa:** 87,5 % indexsleeve (SPY) / 12,5 % CBOE (ben 1), 0 % kassa. En av fyra aktieplatser är upptagen. Inga öppna pending-planer.

---

## Innehav 1: Indexsleeve (SPY) (SPY / NYSE Arca)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| $759,81 – prices.json/Yahoo chart API, 2026-11-11 21:00 UTC, reguljär stängning | −1,74 % | – | – | **BEHÅLL** |

**Pre-/after-hours:** – (ingen utökad kurs i filen, och sleeven har inga nivåer)
**Nyheter senaste 24h:** 2026-11-11: S&P 500 steg +1,31 %. SPY handlades mellan 754,91 och 762,51 och stängde +1,32 %, på volym 0,78× 20-dagarssnittet (`state/prices.json`, `state/volume_history.json`).
**Motivering:** Sleeven har varken stop eller mål och ligger kvar på 87,5 %. Inget aktieköp eller -sälj i dag kräver omviktning. Kursen ligger 3,90 % över MA200 731,31, strax över EMA20 758,27 och under EMA50 761,69.

---

## Innehav 2: Cboe Global Markets (CBOE / Cboe BZX)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| $369,19 – prices.json/Yahoo chart API, 2026-11-11 21:00 UTC, reguljär stängning | +10,03 % | $345,00 (avstånd −6,55 %) | $382,50 (avstånd +3,61 %) | **BEHÅLL** |

**Pre-/after-hours:** EJ VERIFIERAT (ingen utökad kurs i `state/prices.json`, ingen daterad förbörsnivå via websök).
**Nyheter senaste 24h:** 2026-11-11: CBOE steg **+1,20 % till 369,19**, ett nytt 250-dagarshögsta (intervall 359,96–371,06, volym 1,01×; `state/prices.json`, `state/volume_history.json`). `state/news_feed.json` har inga CBOE-poster för 11–12/11, och websök gav ingen daterad bolagsnyhet för perioden. Senast daterade bolagsnyheter: oktobervolymerna (PR Newswire 2026-11-04) och stämningen mot CFTC om perpetuals (PR Newswire 2026-11-03).
**Motivering:** Tesen är intakt (Q3 30/10: justerat EPS 3,63, +36 %, sänkt opex-guide; SEC 8-K ex. 99.1), och läget har **stärkts** ytterligare. Kursen ligger över EMA20 336,00 > EMA50 314,23 > EMA200 293,67, och MACD-histogrammet stiger (2,21 → 2,45). Dagslägsta 359,96 låg över stoppen och dagshögsta 371,06 under målet, så ingen nivå korsades. RSI 73,0 är överköpt. Stoppen 345,00 lämnas orörd: en höjning till under 11/11-lägsta 359,96 hade gett ett riskavstånd på bara 2,5 %, långt under 5–6 %-bandet (punkt 1). Ingen CBOE-rapport ligger inom 2 handelsdagar (`state/earnings_calendar.json`).

---

## Pending-planer
Inga pending-planer. Alla rader i `state/portfolj_us.md`:s Pending-sektioner är redan överstrukna (TRIGGADE eller AVFÖRDA). Senast avfördes U-planen 2026-11-11.

**Intradag-signaler (2c/2c2):** `state/alerts.json` har `checkedAt` **2026-11-11T21:45:52Z**, alltså ~15,9 timmar gammalt vid körningen ~13:20 UTC, och `active` är tom. Före den amerikanska öppningen syns ingen monitorkörning under dagens timmar. Enligt punkt 2c2 räknas intradagsskyddet som **FRÅNVARANDE** för den här körningen. Nivåerna har därför prövats manuellt mot verifierad kurs ovan. Gårdagens checkedAt kommer från en körning efter US-stängningen 11/11, så monitorn fungerade under gårdagens session.

**Scout-kandidater (punkt 2d) – två nya, båda avvisade på spärr (a):**
- **`261112-NVDA` (NVIDIA) – AVVISAD, spärr (a): obekräftad katalysator – bevakas.** ⚠️ RYKTE – EJ BEKRÄFTAT (WSJ 2026-11-11, återgivet av Reuters/Bloomberg enligt scout-rapport-261112) om vd-byte. Bolaget har inte kommunicerat något. Kandidaten saknar dessutom kurs efter katalysatorn (`price: null`). Stängningen 173,73 ligger **15,0 % under MA200 204,47**, och rapporten 17/11 är en binär händelse. Den hade alltså fallit även på (b), (d) och grind 2.
- **`261112-AMAT` (Applied Materials) – AVVISAD, spärr (a): obekräftad katalysator – bevakas.** Kandidaten är ett väntat event, Q4 FY26 med rapport 12/11 efter stängning (`state/earnings_calendar.json`). Köp inför en rapport är underkänt i backtestet (punkt 2e). Stängningen 395,08 ligger dessutom **11,5 % under MA200 446,17**. Ett bekräftat utfall prövas som en ny kandidat.

Avgörandena är loggade i `state/scout_candidates.json` (`decidedBy` = denna rapport, `decidedAt` 2026-11-12) och som `AVVAKTA`-rader i `state/decisions.json`.

**Villkorad bubblar-plan (LÄGE B):** **ABNB** är fortfarande den enda bubblaren i us-veckorapport-261109 som föll på saknad verifierad kurs, så den prövas igen. Kursen är 181,13 (prices.json/Yahoo chart API, 2026-11-11 21:00 UTC), −3,09 % under dagen. Katalysatorn (Q3 5/11 efter stängning) är inne på sin femte handelsdag, regimen är PÅ och boken har ledig plats. Vid full poängsättning faller ABNB på **grind 2: volym 1,42×** den 11/11 (krav > 1,5×), och MACD-histogrammet har vänt nedåt (2,07 → 1,64). Övriga mått höll: kurs över MA200 148,58, EMA20 175,07 > EMA50 170,44 > EMA200 153,43, RSI 56,7, likviditet 825 MUSD/dag. **Ingen plan läggs.** AVVAKTA-raden är loggad. Katalysatorn faller ur femdagarsfönstret efter i dag, så ABNB prövas inte längre den här vägen.

## Åtgärder i portfolj_us.md
- Inga affärer. CBOE (12,5 %, stop 345,00, mål 382,50) och sleeven (87,5 %) är oförändrade. Anteckningen på CBOE-raden är kompletterad med dagens BEHÅLL.
- "Senast uppdaterad" och Kassa-sektionen är uppdaterade. Ackumulerad avkastning är oförändrad, **−6,49 %**, eftersom ingen affär stängdes.
- `state/decisions.json`: 5 nya rader (`book: "us"`, `mode: "B"`): BEHÅLL SPY (vikt 0,875), BEHÅLL CBOE samt AVVAKTA för NVDA, AMAT och ABNB.

## Bevakning inför imorgon
* **Rapporter (`state/earnings_calendar.json`, `generatedAt` 2026-11-12T02:15Z):** 12/11 efter stängning `AMAT`, `CSCO` och `NBIS`; 17/11 `HD` och `NVDA`; 18/11 `LOW` och `TGT`. Kalendern täcker bara symboler som prisbevakas, så resten av US-marknaden är **OKONTROLLERAD** (L-5). Varken CBOE eller någon bubblare har rapport inom fönstret.
* **NVDA-ryktet:** NVIDIA är en tung S&P 500-vikt, så ett bekräftat vd-byte kan slå mot sleeven (SPY) och halvledarkedjan. Sleeven har inga nivåer, och ingen åtgärd följer av ett obekräftat rykte.
* **CBOE:** stop 345,00, mål 382,50 (+3,61 %). Med RSI 73,0 på nytt 250-dagarshögsta är både ett målgenomslag och en rekyl möjliga. Monitorn bevakar nivåerna under sessionen.
* **Åtgärdspunkt till Dren (L-3), ÅTERKOMMANDE:** vid körningen ~13:20 UTC är `checkedAt` i `state/alerts.json` 2026-11-11T21:45Z, och ingen monitorkörning syns under dagens förbörstimmar. **Omfång:** intradagsskyddet före den amerikanska öppningen. Under själva sessionen kör monitorn, vilket syns på gårdagens checkedAt.
* **Åtgärdspunkt till Dren (L-3), ÅTERKOMMANDE:** i `state/news_feed.json` (`generatedAt` 2026-11-12T02:17Z) står `feeds.globenewswire` och `feeds.globenewswire-earnings` på "HTTP 403 – båda försöken". **Omfång:** 2 av 6 flöden. Fönstret täcker ändå 10 av 10 handelsdagar (`missingDays` tom). **Ersättningskälla:** websök och SEC 8-K.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
