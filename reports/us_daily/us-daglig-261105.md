# Daglig bevakning – US-rotation
**Datum:** 2026-11-05 | **Läge:** Daglig bevakning (USD)
**Marknadsläget i korthet:** Onsdagen 4/11 var en bred uppgång. S&P 500 steg **+1,58 % till 7 688,62** (intervall 7 635,81–7 715,57) och Nasdaq Composite steg **+1,44 % till 25 736,51** (`state/prices.json`, marketTime 2026-11-04T21:51Z resp. 22:15Z, `generatedAt` 2026-11-05T13:08Z, `schemaVersion` 2026-08-02-prevclose). Regimfiltret är **PÅ**: ^GSPC ligger +5,03 % över MA200 7 320,32 (`state/price_history.json`, 250 punkter, råserien). Kortsiktigt har läget förbättrats: indexet stängde över EMA20 7 676,65 och EMA50 7 673,56, RSI steg till 50,4 och MACD-histogrammet steg (−19,75 → −11,94) men är fortfarande negativt. USD/SEK står på 9,7846 (2026-11-05T13:07Z). Websök gav ingen daterad marknadsrapport för 4/11 eller terminsläget i dag, så drivkraften bakom uppgången är **EJ VERIFIERAD**. Efter stängning 4/11 rapporterade `APP` och `COHR` (scout-rapport-261105).
**Pre-/after-hours:** Varken SPY, CBOE eller NUE har utökad kurs i `state/prices.json`, och websök gav ingen daterad förbörsnivå för 2026-11-05. Förbörsläget för innehaven är därför **EJ VERIFIERAT**. Stoppen ligger 8,46 % (CBOE) och 7,80 % (NUE) under senaste stängningen, så ett gap dit skulle kräva en extrem rörelse. Kandidaternas förbörskurser i `state/prices.json`: **`APP` 333,61 (förbörs 2026-11-05 13:06 UTC)**, +22,76 % mot stängningen 271,75, och **`COHR` 189,60 (förbörs 13:06 UTC)**, −2,81 % mot 195,09.
**Portföljvikt & kassa:** 62,5 % indexsleeve (SPY) / 25 % NUE / 12,5 % CBOE (ben 1), 0 % kassa. Två av fyra aktieplatser är upptagna. Två villkorade planer är öppna: CBOE ben 2 ≤ 325,00 (12,5 %) och AXGN ≤ 46,00 (25 %, sista dag i dag).

---

## Innehav 1: Indexsleeve (SPY) (SPY / NYSE Arca)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| $766,81 – prices.json/Yahoo chart API, 2026-11-04 21:00 UTC, reguljär stängning | −0,83 % | – | – | **BEHÅLL** |

**Pre-/after-hours:** – (ingen utökad kurs i filen, och sleeven har inga nivåer)
**Nyheter senaste 24h:** 2026-11-04: S&P 500 +1,58 %, Nasdaq +1,44 % (`state/prices.json`). SPY:s dagsintervall var 762,64–769,22 och dagsrörelsen +1,65 % mot `previousClose` 754,35. `state/news_feed.json` gav inga sleeve-relevanta poster för 2026-11-04 – 2026-11-05.
**Motivering:** Sleeven har varken stop eller mål och säljs aldrig på nedgång. Den **minskas 87,5 % → 62,5 %** för att finansiera NUE-planen som triggades i går. Att ett aktieköp kräver det är det enda tillåtna skälet att röra sleeven i LÄGE B. Tekniskt har läget stärkts: 766,81 ligger nu strax över EMA20 765,27 och EMA50 765,02, RSI är 50,7 och kursen ligger 5,06 % över MA200 729,91.

---

## Innehav 2: Cboe Global Markets (CBOE / Cboe BZX)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| $345,21 – prices.json/Yahoo chart API, 2026-11-04 21:00 UTC, reguljär stängning | +2,88 % | $316,00 (avstånd −8,46 %) | $382,50 (avstånd +10,80 %) | **BEHÅLL** |

**Pre-/after-hours:** EJ VERIFIERAT (ingen utökad kurs i `state/prices.json`, ingen daterad förbörsnivå via websök).
**Nyheter senaste 24h:** 2026-11-04: CBOE +0,27 % till 345,21 (intervall 336,25–347,94) och släpade därmed efter ett S&P 500 som steg +1,58 % (`state/prices.json`). Websök "Cboe Global Markets news November 2026" gav inga daterade bolagsnyheter för perioden, och `state/news_feed.json` saknar CBOE-poster.
**Motivering:** Tesen är intakt: Q3 30/10 med justerat EPS 3,63 (+36 %) och sänkt opex-guide (SEC 8-K ex. 99.1). Läget är **oförändrat** sedan i går. RSI är 65,5, kursen ligger över EMA20 320,72 och EMA50 304,33, och MACD-histogrammet är positivt men planar ut (2,29 → 2,15). Volymen var låg (0,88×). Dagslägsta 336,25 låg 6,4 % över stoppen. Stoppen ligger kvar på 316,00 eftersom +5 %-nivån 352,31 inte nåtts (dagshögsta 347,94). Ingen rapport för CBOE finns inom 2 handelsdagar (`state/earnings_calendar.json`).

---

## Innehav 3: Nucor (NUE / NYSE)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| $267,91 – prices.json/Yahoo chart API, 2026-11-04 21:00 UTC, reguljär stängning | +2,26 % (entry 262,00) | $247,00 (avstånd −7,80 %) | $299,00 (avstånd +11,60 %) | **KÖP** |

**Pre-/after-hours:** EJ VERIFIERAT (ingen utökad kurs i `state/prices.json`, ingen daterad förbörsnivå via websök).
**Nyheter senaste 24h:** 2026-11-04: NUE föll −2,05 % till 267,91. Sessionen gick från dagshögsta 278,98 ned till dagslägsta **260,405**, alltså genom planens nivå 262,00, och återhämtade sig sedan (`state/prices.json`). Volymen var 1,75× 20-dagarssnittet. Websök "Nucor stock November 4 2026" gav inga daterade bolagsnyheter för perioden, och `state/news_feed.json` saknar NUE-poster. Drivkraften bakom intradagsfallet är därför **EJ VERIFIERAD**.
**Motivering:** Planen ≤ 262,00 (scoutkandidat `261027-NUE`, promotad 2026-10-28) **triggades i den reguljära sessionen 2026-11-04**, planens femte och sista giltighetsdag. Sessionen öppnade över nivån (föregående stängning 273,53), så fyllnaden bokförs till limitnivån 262,00 och stoppen 247,00 berördes inte. Före registreringen prövades samtliga filter om. Regimen är PÅ, RSI är 56,6 och kursen ligger över EMA20 263,87, EMA50 257,33, EMA200 228,77 och MA200 225,47. Volymen var 1,75×, likviditeten 355 MUSD/dag och ingen rapport ligger inom 2 handelsdagar. Nåbarheten är 2 × 1,49 % × √25 = 14,9 % ≥ 14,12 %, och R/R är 1:2,47. Svaghet: MACD-histogrammet är positivt men fallande (1,81 → 1,09), och 250-dagarshögsta 277,65 ligger mellan entry och mål.

---

## Pending-planer
- **NUE: villkor ≤ 262,00 USD (reguljär session) – TRIGGAD** (dagslägsta 260,405, stängning 267,91; prices.json/Yahoo chart API, 2026-11-04 21:00 UTC). Fyllnad vid 262,00 → **KÖP 25 %** (Innehav 3), raden struken med "TRIGGAD 2026-11-04", sleeven minskad med 25 pp.
- **CBOE ben 2: villkor ≤ 325,00 USD (reguljär session) – EJ TRIGGAD** (dagslägsta 336,25, stängning 345,21; prices.json/Yahoo chart API, 2026-11-04 21:00 UTC). Kursen ligger 3,46 % över villkoret → ingen åtgärd. Planen gäller t.o.m. 2026-11-06.
- **AXGN: villkor ≤ 46,00 USD (reguljär session) – EJ TRIGGAD** (dagslägsta 50,08, stängning 51,35; prices.json/Yahoo chart API, 2026-11-04 21:00 UTC). Dagslägsta låg 8,87 % över villkoret → ingen åtgärd. Dagens session är planens sista. Triggar den inte avförs planen i nästa körning. Nivån höjs inte.
- Övriga rader i `state/portfolj_us.md`:s Pending-sektioner är redan överstrukna (TRIGGADE eller AVFÖRDA).

**Intradag-signaler (2c/2c2):** `state/alerts.json` har `checkedAt` **2026-11-04T21:43:23Z**, alltså ~15,5 timmar gammalt vid körningen (13:15 UTC). Det har inte kommit någon monitorkörning under dagens handelstimmar. Den enda aktiva signalen gäller `KOG.OL` (nordiska boken). Enligt punkt 2c2 räknas intradagsskyddet som **FRÅNVARANDE** den här körningen. Jag har därför prövat CBOE:s och NUE:s stop och mål samt båda planernas villkor manuellt mot verifierad kurs ovan. **Dessutom är NUE-korsningen i går osynlig för monitorn av ett annat skäl, se åtgärdspunkten nedan.**

**Scout-kandidater (punkt 2d) – två nya poster, båda AVVISADE som vilande (L-4).** Båda har bekräftad katalysator (rapporter 4/11 efter stängning) och verifierad förbörskurs efter katalysatorn (`priceSession: "pre"`). Regimen är PÅ, ingen rapporterar inom 2 handelsdagar och boken har ledig plats. Spärrarna (a)–(e) håller alltså. Båda faller på samma datalucka i det fullständiga filtret:
- **`261105-APP` (AppLovin) – AVVISAD, grind 2 omätbar, vilande (L-4).** Q3 2026: intäkt 2,18 mdr USD (+55 %), EPS 4,30, Q4-guide 2,37–2,40 mdr och utökat återköp med 3,2 mdr (scout-rapport-261105; AppLovin 8-K ex. 99.1, 2026-11-04). `state/price_history.json` bär **1 punkt** (2026-11-04). Därför går MA200, RSI, MACD, EMA och volymkvot inte att räkna, och saknad MA200 blockerar nya aktiepositioner (`prompts/gemensam_korning.md`). Förbörskursen 333,61 ligger +22,76 % över stängningen, så ett eventuellt köp vid omprövning måste läggas som limit (punkt 4a, gap > 3 %).
- **`261105-COHR` (Coherent) – AVVISAD, grind 2 omätbar, vilande (L-4).** Q1 FY27: intäkt 2,37 mdr USD (+50 %) mot ca 2,31, non-GAAP EPS 2,09 mot 1,99 och datacenter +85 % (scout-rapport-261105). Serien bär **1 punkt** (2026-11-04), så samma spärr gäller. Förbörskursen 189,60 ligger −2,81 % under stängningen, och det var en efterbörsuppgång på ca +7 % som vänt (scoutens uppgift).
Avvisningarna är **tillfälliga och datamässiga**. Enligt L-4 ska nästa körning pröva om båda när backfillen gett serierna ≥ 200 punkter, så länge de ligger inom `expiresAt` 2026-11-12. Avgörandena är loggade i `state/scout_candidates.json` (`decidedBy` = denna rapport) och som `AVVAKTA`-rader i `state/decisions.json`.

**Villkorad bubblar-plan (LÄGE B):** ej tillämplig. Ingen av bubblarna i `us-veckorapport-261102` (CVX, DVN, S, RHI) föll på saknad verifierad kurs.

## Åtgärder i portfolj_us.md
- **KÖP NUE @ 262,00** (villkorad plan triggad 2026-11-04): ny rad i Aktuellt innehav, vikt 25 %, entry-datum 2026-11-04, stop 247,00, mål 299,00, R/R 1:2,47, horisont 25 handelsdagar. Pending-raden är struken med "TRIGGAD 2026-11-04" och inte raderad.
- **Indexsleeven (SPY) minskad 87,5 % → 62,5 %.** CBOE ligger kvar på 12,5 %. Ackumulerad avkastning är oförändrad på **−5,13 %**, eftersom ingen affär stängdes.
- Planerna för CBOE ben 2 och AXGN fick statusraden "EJ TRIGGAD per 2026-11-05". Kassa-texten och "Senast uppdaterad" är ändrade.
- `state/decisions.json`: 5 nya rader (`book: "us"`, `mode: "B"`): BEHÅLL SPY (vikt 0,625), KÖP NUE, BEHÅLL CBOE, AVVAKTA APP och AVVAKTA COHR. Raderna är validerade med `--base`.

## Bevakning inför imorgon
* **AXGN-planen ≤ 46,00 avförs i morgondagens körning** om dagens session inte triggar den. **CBOE ben 2 ≤ 325,00** har sin sista dag 2026-11-06.
* **L-4-omprövning av `261105-APP` och `261105-COHR`** när deras serier har backfillats (backfillen körs i `prices.yml` på dygnets första körning).
* **Rapporter (`state/earnings_calendar.json`, `generatedAt` 2026-11-05T01:27Z, täcker bara prisbevakade symboler – övriga OKONTROLLERAD, L-5):**
  * 5/11: `DVN` (bubblare), `NET`, `TEAM`, `AKAM`, `IREN`, `KMB`, `U` och `EVCM`, samt `SYNA` och `WBD` (`isEstimate: true`).
  * 6/11: `VST`.
  * 9/11: `CEG`, `KKR`, `ACHR` och `MARA`.
  * Ingen rapport för `CBOE`, `NUE` eller `AXGN`. Köp före rapport är spärrat (punkt 2e).
* **NUE:** stängningen 267,91 ligger under 250-dagarshögsta 277,65. Stoppen 247,00 flyttas upp till entry först vid +5 % (275,10).
* **Åtgärdspunkt till Dren (L-3), NY:** `.github/scripts/alerts.mjs:45` (`collectTargets`) läser bara den **första** `### Pending`-tabellen i `state/portfolj_us.md` genom `tableAfter(md, /^###\s+Pending/i)`. Planer i senare Pending-sektioner bevakas därför aldrig. **Omfång:** `state/alerts.json` `watched` = `["KOG.OL","SPY","CBOE"]`. **2 av 3 öppna US-planer** var obevakade: NUE ≤ 262,00 (lagd 2026-10-28) och AXGN ≤ 46,00 (lagd 2026-10-29). NUE-korsningen 2026-11-04 (dagslägsta 260,405) gav därför ingen KÖP-signal eller push-notis, och den registreras först nu, en handelsdag senare. Efter dagens ändringar är AXGN fortfarande obevakad. Samma parsning gäller `state/portfolj.md`, så nordiska boken kan ha samma lucka. **Ersättningskälla:** manuell prövning av `dayLow`/`dayHigh` i `state/prices.json` i varje rotationskörning. **Åtgärd:** låt `collectTargets` samla ALLA tabeller under rubriker som matchar `^###\s+Pending` och hoppa över överstrukna rader, plus ett test i `tests/run.mjs`.
* **Åtgärdspunkt till Dren (L-3), ÅTERKOMMANDE:** fältet `checkedAt` i `state/alerts.json` är 2026-11-04T21:43Z vid körningen 13:15 UTC, och ingen monitorkörning syns under dagens handelstimmar. Samma defekt beskrevs i us-daglig-261030, us-veckorapport-261102, us-daglig-261103 och us-daglig-261104. **Omfång:** intradagsskyddet för CBOE (stop 316,00, mål 382,50), NUE (stop 247,00, mål 299,00) och två villkorade planer. **Åtgärd:** kontrollera att `monitor.yml` kör, och flytta dess cron från minut 0 (`scheduled-actions-not-firing`).
* **Åtgärdspunkt till Dren (L-3), ÅTERKOMMANDE:** i `state/news_feed.json` (`generatedAt` 2026-11-05T01:30Z) står `feeds.globenewswire` och `feeds.globenewswire-earnings` fortfarande på "HTTP 403 – båda försöken". **Omfång:** 2 av 6 flöden. Övriga fyra levererar, och fönstret täcker 10 av 10 handelsdagar. **Ersättningskälla:** websök och SEC 8-K.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
