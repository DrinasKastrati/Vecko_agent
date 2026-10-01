# Daglig bevakning – US-rotation
**Datum:** 2026-10-01 | **Läge:** Daglig bevakning (USD)
**Marknadsläget i korthet:** Tre svaga sessioner i rad: S&P 500 stängde **7 651,54** den 30/9 (**−0,25 %** mot `previousClose` 7 670,84, intervall 7 651,54–7 722,88 – stängning på dagslägsta), Nasdaq Composite **26 861,06** (**+0,24 %**) – `state/prices.json`, marketTime 2026-09-30T20:38:12Z resp. 21:15:59Z, `schemaVersion` `2026-08-02-prevclose` finns, så dagsrörelserna räknas ur filen. ^GSPC har gått 7 743,41 → 7 651,54 (**−1,19 %**) sedan 25/9. **Regimfiltret är PÅ:** ^GSPC ligger **+6,02 %** över MA200 **7 217,06** (200 daterade stängningar 2025-12-12 → 2026-09-30 i `state/price_history.json`), mot +6,99 % den 25/9. USD/SEK 10,0334 (marketTime 2026-10-01T13:02:10Z). Websök efter daterade förbörs-/makronyheter för 2026-10-01 gav inga träffar med dagens datum – inget makropåstående görs därför utöver repots egna data. Dagens rapporter enligt `state/earnings_calendar.json` (`isEstimate: false`): **ACN** och **NKE** 2026-10-01 – inga innehav, inga kandidater (källan täcker bara symboler `prices.yml` hämtar; övriga universumet OKONTROLLERAT, L-5).
**Pre-/after-hours:** SPY saknar utökad kurs i `state/prices.json` (inget `extendedPrice`). Sleeven har varken stop eller mål, så en förbörsrörelse kan inte korsa någon nivå. Bland kandidaterna: MU förbörs **1 054,00** (2026-10-01T13:01:47Z, −1,04 % mot pre-event-stängningen 1 065,11 efter FQ4-rapporten 30/9 AMC), UTHR förbörs **552,48** (13:01:30Z).
**Portföljvikt & kassa:** 100 % indexsleeve (SPY), 0 % aktier, 0 % kassa – fyra tomma aktieplatser, noll pending-planer.

---

## Innehav 1: Indexsleeve (SPY) (SPY / NYSE Arca)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| $762,63 – prices.json/Yahoo chart API, 2026-09-30 20:00 UTC, reguljär stängning | −1,38 % | – | – | **BEHÅLL** |

**Pre-/after-hours:** – (ingen utökad kurs i filen; sleeven har inga nivåer)
**Nyheter senaste 24h:** Inga sleeve-specifika nyheter. Dagsintervall 762,18–769,41, dagsrörelse −0,21 % mot `previousClose` 764,20.
**Motivering:** Sleeven har varken stop eller mål och säljs aldrig på nedgång. Ingen av dagens elva scout-kandidater passerade grindarna, så inget kapital lämnar sleeven. Läget något försvagat sedan 25/9 (771,35 → 762,63), men regimen är PÅ med 6 % marginal.

---

## Pending-planer
Inga pending-planer.

**Punkt 2c2 – monitorns hälsa: intradagsskyddet FRÅNVARANDE denna körning.** `state/alerts.json` `checkedAt` **2026-09-30T22:49:19Z**, alltså ~14,5 timmar gammalt kl. 13:21 UTC på en handelsdag (tröskel ~6 h); `active` tom. Konsekvensen är i dag noll – boken har inga nivåer att korsa – men se åtgärdspunkt 2.

**Punkt 2d – scout-kandidater: ELVA poster med `status: "new"` och `book: "us"`, samtliga avgjorda, noll promotions, ingen lämnad kvar.** Regimen är PÅ (spärr c passerar), boken har fyra lediga platser (spärr e passerar), ingen kandidat har bekräftad binär händelse inom 2 handelsdagar i `earnings_calendar.json` (spärr d passerar), alla bär `confirmed: true` (spärr a passerar). Kursen för samtliga är nu verifierad i `state/prices.json` (spärr b passerar, så L-4 utlöses inte). Utfall mot de fem grindarna (1 kurs · 2 teknik · 3 katalysator ≤ 5 handelsdagar · 4 mål ≥ 8 % med chartreferens · 5 nåbarhet + R/R), kurs = reguljär stängning 2026-09-30 om inget annat anges:

| Kandidat | Kurs (USD) | RSI | Fälld på |
|---|---|---|---|
| 260926-AKAM (order 24/9) | 106,35 | 44,5 | **grind 2** – under EMA20 110,11/EMA50 112,73/EMA200 109,98, MACD-histogram fallande 0,879 → 0,157, volymkvot 1,14× |
| 260926-COST (earnings 24/9) | 910,34 | 46,2 | **grind 2** – under EMA20/50/200, volymkvot 0,93×; oberoende **grind 5** (taket 10,1 % vid 30 dagar < 14 %) |
| 260926-MSFT (other 23/9) | 512,90 | 60,3 | **grind 3** – katalysatorn 6 handelsdagar bak; oberoende **grind 4** – mål 564–585 över 250d-högsta 542,07 |
| 260926-AESI (order 24/9) | 12,01 | 44,9 | **grind 2** – under EMA20/50/200, MACD −0,283 under signal −0,109, volymkvot 1,23× |
| 260929-AMD (ma_rumor 28/9) | 611,76 | 66,3 | **grind 2** – volymkvot 0,75×, histogram fallande 11,27 → 6,48; **grind 4** – mål 673–685 över 250d-högsta 630,63 |
| 260929-TEVA (regulatory 28/9) | 39,60 | 58,5 | **grind 2** – MACD 0,877 under signal 0,886, volymkvot 1,08×; **grind 4** – mål 45,1–46,7 över 250d-högsta 40,22 |
| 260930-CCL (earnings 29/9) | 24,54 | 56,8 | **grind 2** – under EMA50 24,59 och EMA200 26,74, inverterad stack; 3 mån −14,0 % (punkt 1b); grind 4/5 hade passerat (chartreferens 28–29,6 i aug, tak 16,8 % vid 20 d) |
| 260930-HII (order 29/9) | 267,07 | 37,3 | **grind 2** – RSI under 40 utan turnaround, under EMA20/50/200, MACD under signal |
| 260930-VNDA (regulatory 29/9) | 4,91 | 40,2 | **grind 2** – likviditet **4,3 MUSD/dag** under golvet 20 MUSD |
| 261001-MU (earnings 30/9 AMC) | 1 054,00 förbörs (2026-10-01 13:01 UTC) | 59,7 | **grind 2** – MACD-histogram fallande 8,87 → 7,10 → 5,37, volymkvot 1,16×; grind 4/5 hade passerat (mål ≈ 250d-högsta 1 213,56, +15,1 %). Förbörskurs ⇒ hade ändå bara fått bli en villkorad plan |
| 261001-UTHR (other 30/9) | 541,89 | – | **grind 2** – teknik och likviditet ej beräkningsbara: **1 punkt** i både `price_history.json` och `volume_history.json`. Kursen är post-event (domen kom under sessionen 30/9) |

Teknik räknad på råserierna i `state/price_history.json` (250 daterade punkter för alla utom UTHR), volym ur `state/volume_history.json`. 12 rader loggade i `state/decisions.json` (SPY BEHÅLL + elva AVVAKTA), validerade före commit (`validate-decisions.mjs` OK, 821 rader; `validate-scout-candidates.mjs` OK).

**Punkt 4b (villkorad bubblar-plan i LÄGE B): ingen.** Det finns ingen us-veckorapport för vecka 40 (se åtgärdspunkt 1); senaste är `us-veckorapport-260921.md`, vars fem bubblare (BE, ILMN, INTC, TSM, AMD) samtliga rankades under på omdömesgrindar – villkor 1 uppfylls inte, och deras katalysatorer ligger dessutom utanför fem handelsdagar.

## Åtgärder i portfolj_us.md
Inga ändringar i innehav, vikter eller historik – endast "Senast uppdaterad". Ackumulerad avkastning oförändrad **−2,87 %**.

**Åtgärdspunkter till Dren (L-3):**
1. **US-rotationen har inte kört sedan 2026-09-25 – veckans LÄGE A (måndag 2026-09-28) saknas helt.** `reports/us_weekly/` slutar på `us-veckorapport-260921.md`, `reports/us_daily/` hoppar från 260925 till 261001, och `state/decisions.json` har noll `book: "us"`-rader för 28/9, 29/9 och 30/9. Den nordiska rotationen och scouten har kört alla dagarna. Följden: fyra scout-kandidater (AKAM, COST, MSFT, AESI) låg `new` i fem dygn och sex till i ett–två, och MSFT hann falla ut ur femdagarsfönstret innan den prövades. **ÅTERKOMMANDE** – samma fel som 2026-08-24/08-31 (`us-rotation-lage-a-missed`). Denna körning är LÄGE B (torsdag) enligt promptens dagval och ersätter inte rotationen; kör `prompts/us_dagligprompt.md` i LÄGE A för hand om veckans bruttolista ska göras före måndag 2026-10-05, och kontrollera routinen "USA-Rotation" (dagens körning startade 13:20 UTC mot schemalagda 13:06).
2. **`state/alerts.json` `checkedAt` 2026-09-30T22:49:19Z** – ingen monitorkörning registrerad under dagens handelstimmar (≥ 6 förväntade 07–13 UTC). Omfång: hela intradagsskyddet för båda böckerna; i dag utan konsekvens eftersom inga nivåer finns.
3. **UTHR saknar historik** (1 punkt i `price_history.json` och `volume_history.json`, tillagd 2026-10-01). Backfillen bör fylla den vid nästa dygnskörning; kandidaten löper till 2026-10-08 och bör då prövas om på grind 2.

## Bevakning inför imorgon
- **MU:s första reguljära session efter FQ4** (förbörs −1,0 % trots beat och guide 61,5 mdr) – en reaktionssession med volym ≥ 1,5× kan ändra grind 2-bilden vid nästa veckorotation; kandidaten är avgjord och förlängs inte.
- **CCL** behöver återta EMA50 (~24,6) och bygga mot EMA200 26,74 för att bli ett case; chartreferensen 28–29,6 finns.
- **Jobbrapporten (NFP) för september** väntas fredag 2026-10-02 (ej verifierad i dagens nyhetsflöde – kontrollera datum), ovanpå ett räntehöjningsspår.
- Rapporter enligt `earnings_calendar.json`: **PEP 2026-10-08, DAL 2026-10-09** (inga innehav).

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
