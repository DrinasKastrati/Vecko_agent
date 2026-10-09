# Daglig bevakning – US-rotation
**Datum:** 2026-10-09 | **Läge:** Daglig bevakning (USD)
**Marknadsläget i korthet:** S&P 500 stängde **7 765,36** den 8/10 (**−0,47 %** mot `previousClose` 7 801,77, intervall 7 731,26–7 797,79), Nasdaq Composite **27 193,34** (**−1,25 %**) – `state/prices.json`, marketTime 2026-10-08T20:46Z resp. 21:15Z. Andra raka nedgångsdagen: oljan steg och chipaktierna föll på AI-oro efter en FT-rapport som ifrågasatte OpenAIs intäkter (Yahoo Finance 2026-10-08); 10-årsräntan runt 5,2–5,3 % efter Fed-protokollet (Yahoo Finance / Benzinga 2026-10-08, källorna skiljer sig åt i riktning). Regimfiltret **PÅ**: ^GSPC +7,17 % över MA200 7 245,94 (`state/price_history.json`, 250 punkter). USD/SEK 9,9974 (2026-10-09T13:07Z). Terminskurser för i dag gick inte att belägga via websök – inget påstående görs om öppningen.
**Pre-/after-hours:** SPY och MRVL saknar utökad kurs i `state/prices.json`, och Yahoo är inte nåbart från körmiljön (proxy 403) – förbörsläget för båda är **EJ VERIFIERAT**. MRVL rapporterade inte och har ingen post i `state/earnings_calendar.json` inom fönstret. Bland kandidaterna: DVN förbörs **48,30** (scout, 2026-10-09T11:13Z). DAL rapporterar Q3 i dag före öppning (förbörs 80,09, 2026-10-09T13:05Z, −2,49 % mot stängningen 82,14) – ej i boken.
**Portföljvikt & kassa:** 25 % MRVL + 75 % indexsleeve (SPY), 0 % kassa – en av fyra aktieplatser upptagen.

---

## Innehav 1: Indexsleeve (SPY) (SPY / NYSE Arca)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| $773,93 – prices.json/Yahoo chart API, 2026-10-08 20:00 UTC, reguljär stängning | +0,09 % | – | – | **BEHÅLL** |

**Pre-/after-hours:** – (ingen utökad kurs i filen; sleeven har inga nivåer)
**Nyheter senaste 24h:** Inga sleeve-specifika nyheter. Dagsintervall 770,435–777,09, dagsrörelse −0,42 % mot `previousClose` 777,22.
**Motivering:** Sleeven har varken stop eller mål och säljs aldrig på nedgång. Den minskas 100 % → 75 % för att finansiera MRVL-positionen som triggade i gårdagens session – det enda tillåtna skälet att röra sleeven i LÄGE B. Läget något försvagat sedan i går (777,22 → 773,93), regimen PÅ med 7,2 % marginal.

---

## Innehav 2: Marvell Technology (MRVL / NASDAQ)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| $274,66 – prices.json/Yahoo chart API, 2026-10-08 20:00 UTC, reguljär stängning | −0,12 % | $260,00 (avstånd −5,34 %) | $313,50 (avstånd +14,14 %) | **KÖP** |

**Pre-/after-hours:** EJ VERIFIERAT – ingen utökad kurs i `state/prices.json`, Yahoo ej nåbart från körmiljön.
**Nyheter senaste 24h:** 2026-10-08 Benzinga – MRVL lägre i förbörs på stigande räntor och olja; investerardagens långsiktiga mål och 208 % uppgång på tolv månader lämnar aktien sårbar för vinsthemtagning. 2026-10-08 Yahoo Finance – chipsektorn (NVDA, MU, INTC) föll på AI-oro efter FT-rapporten om OpenAIs intäkter. Inget bolagsspecifikt negativt besked – investerardagens mål (FY31 70–90 mdr USD, FY28 ~20 mdr) står kvar.
**Motivering:** Den villkorade planen ≤ 275,00 (reguljär session) **triggade 2026-10-08**: sessionen öppnade över nivån (dagshögsta 283,89, föregående stängning 284,68) och föll genom 275,00 till dagslägsta 265,79 – fyllnad till limitnivån, stoppen 260,00 berördes inte. Alla filter omprövade före registreringen: regim PÅ, RSI 61,2, kurs över EMA20/50/200 (259,76 / 242,53 / 188,21), MACD-histogram positivt men avtagande (2,62 → 1,76), volym 1,55× 20-dagarssnittet, likviditet ~5 100 MUSD/dag, mål +14,0 % under 250-dagarshögsta 316,43, nåbarhet 2 × 3,78 % × √20 = 33,8 %, ingen binär händelse inom 2 handelsdagar. Rekylen är sektor-/makrodriven, inte en punkterad tes – precis den delvisa gapfyllnad planen väntade på. 25 %, `catalystType: other`, horisont 20 handelsdagar, inget tidsstopp.

---

## Pending-planer
- **MRVL:** villkor ≤ $275,00 (reguljär session) – **TRIGGAD** 2026-10-08 (dagslägsta 265,79, stängning 274,66, marketTime 2026-10-08T20:00:01Z, prices.json/Yahoo chart API) → KÖP 25 % @ 275,00, raden struken som TRIGGAD i `portfolj_us.md`. **Registreras först i dag:** körningen 2026-10-08 skedde 13:25 UTC, före sessionen, och monitorn larmade inte (se åtgärdspunkt 1).
- **ACN** (ben 2, ≤ 205,00): redan **TRIGGAD 2026-10-02** och stängd – raden står kvar struken. Ingen åtgärd.
- Inga öppna pending-planer kvar.

**Punkt 2c / 2c2 – monitorns hälsa: intradagsskyddet FRÅNVARANDE denna körning.** `state/alerts.json` `checkedAt` **2026-10-08T20:30:35Z**, alltså ~17 timmar gammalt kl. 13:30 UTC på en handelsdag (tröskel ~6 h); ingen monitorkörning i git-historiken i dag (cron `0 7-20 * * 1-5`). `active` bär bara `GMAB.CO` (nordiska boken). Stop/mål för MRVL har kontrollerats manuellt mot verifierad kurs ovan.

**Punkt 2d – scout-kandidater (`state/scout_candidates.json`), två `new` med `book: "us"`, båda avgjorda:**
- `261009-ACN` (Accenture, `other`, Dell Business Group 2026-10-08 – Investing.com/MarketScreener 2026-10-08) – spärr (a)–(e) passerar (bekräftad, kurs 208,36 regular 2026-10-08T20:00:03Z, regim PÅ, ingen rapport inom 2 dagar, tre lediga platser). **Rejected på grind 3 (katalysator):** en affärsgrupp med utbildade konsulter utan kvantifierad intäkt eller order hör inte till katalysatorlistan i LÄGE A 1a (beat + höjd guidance, kontrakt/order, M&A, index, insider, återköp), och boken ska vara mer selektiv här än i den nordiska (punkt 0). Faller dessutom på grind 4: motståndet 212,30–213,31 (+1,9–2,4 %) är exakt där rapportreaktionen vände 1–2/10 och boken stoppades ut. Teknik i övrigt: RSI 63,1, volym 1,73×, men EMA50 182,38 < EMA200 191,10.
- `261009-DVN` (Devon, `other`, Eagle Ford-försäljning 4,2 mdr USD 2026-10-08 – globenewswire-earnings 2026-10-08T11:10Z, 8-K) – kurs finns (48,92 regular 2026-10-08T20:00Z, efter katalysatorn; förbörs 48,30). **Rejected på grind 2 (datalucka):** `state/price_history.json` och `state/volume_history.json` bär **1 punkt** – MA200, RSI, MACD och volymkvot omätbara, och saknad MA200 blockerar nya positioner. Ingen negativ teknisk bedömning är gjord: avvisningen är **vilande enligt L-4** och prövas om när serien backfillats, inom `expiresAt` 2026-10-16. (DVN:s Q3-datum är aviserat men står inte i `state/earnings_calendar.json` – kontrolleras vid omprövningen.)
- Inga kandidater promotades. Fyra rader i `state/decisions.json` (`SPY` BEHÅLL, `MRVL` KÖP, `ACN`/`DVN` AVVAKTA).

**Villkorad bubblar-plan (LÄGE B):** ingen. Ingen av v41-bubblarna (XOM, BKH, AMD, ILMN) avvisades på saknad verifierad kurs, så villkor (1) uppfylls inte.

## Åtgärder i portfolj_us.md
KÖP MRVL @ $275,00 (triggad villkorad plan 2026-10-08) → ny rad i Aktuellt innehav: entry-datum 2026-10-08, stop $260,00, mål $313,50, R/R 1:2,57, vikt 25 %. Indexsleeven (SPY) minskad 100 % → 75 %. Pending-raden för MRVL struken som TRIGGAD. Ackumulerad avkastning oförändrad −3,82 %.

## Bevakning inför imorgon
- **MRVL:** stop 260,00 ligger 5,3 % under stängningen; dagslägsta 8/10 265,79. Monitorn bevakar nu raden i Aktuellt innehav (första tabellen) – men kontrollera att `alerts.json` `watched` faktiskt bär MRVL efter nästa körning.
- Fredag 9/10 – DAL Q3 (före öppning). Tisdag 13/10 – C, JPM, WFC Q3; onsdag 14/10 – BLK; torsdag 15/10 – TSM, PNC, USB (`state/earnings_calendar.json`; täcker bara hämtade symboler, L-5). Rapportförbudet (punkt 2e) gäller.
- **Åtgärdspunkter till Dren (L-3):** (1) **`alerts.mjs` läser bara den FÖRSTA Pending-tabellen** (`tableAfter(md, /^###\s+Pending/i)`, rad 45). `state/portfolj_us.md` hade tre Pending-tabeller och MRVL-planen låg i den andra, så `state/alerts.json` `watched` var `["SPY","GMAB.CO"]` – planen bevakades aldrig och korsningen 2026-10-08 (lägsta 265,79 mot nivån 275,00) gav ingen signal. Omfång: varje plan som inte står i första Pending-tabellen, i båda böckerna. Scouten flaggade samma sak i rapport-261009. (2) **Schemalagda Actions uteblir fortfarande:** ingen `monitor.yml`-körning 2026-10-09 (07–13 UTC), `prices.yml` körde 00:24, 01:12, 11:52 och 13:07 UTC (ska köra var 30:e minut från 07 UTC), `news.yml` 01:15 och 11:56. Andra dagen i rad – samma klass som `scheduled-actions-not-firing`. (3) `fed-press`-flödet svarar åter "20 poster" – gårdagens HTTP 404 var en enstaka observation, ingen åtgärd.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
