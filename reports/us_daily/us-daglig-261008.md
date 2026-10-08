# Daglig bevakning – US-rotation
**Datum:** 2026-10-08 | **Läge:** Daglig bevakning (USD)
**Marknadsläget i korthet:** S&P 500 stängde **7 801,77** den 7/10 (**−0,22 %** mot `previousClose` 7 818,93, intervall 7 763,34–7 807,02), Nasdaq Composite **27 538,69** (**−0,22 %**) – `state/prices.json`, marketTime 2026-10-07T20:55Z resp. 21:15Z. Regimfiltret **PÅ**: ^GSPC +7,74 % över MA200 7 241,28 (`state/price_history.json`, 250 punkter), en session efter nytt 250-dagarshögsta 7 818,93. USD/SEK 10,0018 (2026-10-08T13:19Z). Terminskurser för i dag gick inte att belägga via websök – inget påstående görs om öppningen.
**Pre-/after-hours:** SPY och MRVL saknar utökad kurs i `state/prices.json`, och Yahoo är inte nåbart från körmiljön – förbörsläget för de två är **EJ VERIFIERAT**. Sleeven har inga nivåer, och MRVL-planen gäller mot reguljär session och bevakas av monitorn. Bland kandidaterna: VST förbörs **165,40** (2026-10-08T13:18:21Z, −0,79 % mot stängningen 166,72), COST förbörs **952,00** (2026-10-08T13:14:31Z, +1,03 % mot pre-event-stängningen 942,25 efter septemberförsäljningen 7/10 efter stängning).
**Portföljvikt & kassa:** 100 % indexsleeve (SPY), 0 % aktier, 0 % kassa – fyra tomma aktieplatser; sleeven har en reservation på 25 % för MRVL-planen (≤ 275,00 t.o.m. 2026-10-14).

---

## Innehav 1: Indexsleeve (SPY) (SPY / NYSE Arca)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| $777,22 – prices.json/Yahoo chart API, 2026-10-07 20:00 UTC, reguljär stängning | +0,51 % | – | – | **BEHÅLL** |

**Pre-/after-hours:** – (ingen utökad kurs i filen; sleeven har inga nivåer)
**Nyheter senaste 24h:** Inga sleeve-specifika nyheter. Dagsintervall 773,61–779,10, dagsrörelse −0,24 % mot `previousClose` 779,09.
**Motivering:** Sleeven har varken stop eller mål och säljs aldrig på nedgång. Ingen av dagens scout-kandidater passerade grindarna och MRVL-planen triggade inte, så inget kapital lämnar sleeven. Läget i stort sett oförändrat sedan i går (779,09 → 777,22) och regimen är PÅ med 7,7 % marginal.

---

## Pending-planer
- **MRVL:** villkor ≤ $275,00 (reguljär session) – **EJ TRIGGAD** (dagslägsta 7/10 **276,50**, stängning 284,68, marketTime 2026-10-07T20:00:01Z, prices.json/Yahoo chart API; 0,55 % över villkoret) → ingen åtgärd. Katalysatorn (investerardagen 2026-10-06) är obruten; RSI 68,2, MACD-histogrammet stigande (1,93 → 2,62), kurs över EMA20/50/200 (258,19 / 241,21 / 187,76). Inga rapporter i `state/earnings_calendar.json` inom fönstret. Avförs om den inte triggat t.o.m. **2026-10-14**.
- **ACN** (ben 2, ≤ 205,00): redan **TRIGGAD 2026-10-02** och stängd – raden står kvar struken. Ingen åtgärd.

**Punkt 2c / 2c2 – monitorns hälsa: intradagsskyddet FRÅNVARANDE denna körning.** `state/alerts.json` `checkedAt` **2026-10-07T20:24:57Z**, alltså ~17 timmar gammalt kl. 13:21 UTC på en handelsdag (tröskel ~6 h); `active` tom. `monitor.yml` ska köra varje timme 07–20 UTC men har inte committat någon körning i dag. MRVL-nivån har kontrollerats manuellt mot verifierad kurs ovan. Se åtgärdspunkt nedan.

**Punkt 2d – scout-kandidater (`state/scout_candidates.json`), två `new` med `book: "us"`, båda avgjorda:**
- `261008-VST` (Vistra, `other`, DOE:s villkorade lånelöfte upp till 4,2 mdr USD 2026-10-05 enligt scouten – ANS Nuclear Newswire/Rigzone 2026-10-06) – spärr (a)–(e) passerar (bekräftad, kurs 166,72 regular 2026-10-07T20:00:02Z, regim PÅ, ingen rapport inom 2 dagar, ledig plats). **Rejected på grind 2 (teknik):** RSI **75,6** > 75 utan exceptionell katalysator – ett villkorat lånelöfte är inte exceptionellt; EMA20 145,33 < EMA50 145,59 < EMA200 157,58; 120 dagar **+0,7 %**, alltså en brant uppgång (+10,77 % 6/10, +3,88 % 7/10) utan längre trend bakom sig (punkt 1b). Volym 1,97× och likviditet 1 080 MUSD/dag hade passerat.
- `261008-COST` (Costco, `earnings`, septemberförsäljning 2026-10-07 efter stängning: +13,0 %, jämförbar +7,6 % exkl. bensin/valuta – mfn 2026-10-07T20:15Z) – **Rejected på grind 2 (trend/MA200):** stängningen 942,25 och förbörskursen 952,00 ligger båda under MA200 **962,52**, vilket blockerar ny aktieposition; volymkvot 0,74×. Kursen är förbörs och hade i vart fall bara kunnat bli en villkorad plan.
- **L-4-omprövning** av `261007-BKH` (Black Hills, `order`, bindande Google-avtal 2026-10-06 – avvisad i går på en datalucka med 1 historikpunkt). Serien bär nu 250 punkter och en post-katalysatorkurs finns (**75,84**, regular, 2026-10-07T20:01:13Z, +7,21 %). Grind 2 passerar nu (RSI 67,6, MACD-histogram 0,08 → 0,43, kurs över EMA20/50/200, volym 3,85×, 96 MUSD/dag). **Fortsatt rejected, nu på grind 5 (nåbarhet):** genomsnittlig dagsrörelse 1,04 % (60 dagar) ger taket 2 × 1,04 % × √30 = **11,4 %** även vid längsta horisonten, under order-bandets golv 14 %; målet skulle dessutom ligga över 250-dagarshögsta 76,83 utan chartreferens. Ny `decidedAt` 2026-10-08 i kandidatfilen.
- Inga kandidater promotades. Fyra rader i `state/decisions.json` (`SPY` BEHÅLL, `VST`/`COST`/`BKH` AVVAKTA).

**Villkorad bubblar-plan (LÄGE B):** ingen. Ingen av v41-bubblarna (XOM, BKH, AMD, ILMN) avvisades på saknad verifierad kurs – XOM på volym/250-dagarshögsta, BKH på datalucka i serien (nu omprövad ovan), AMD och ILMN på teknik/katalysator – så villkor (1) uppfylls inte för någon.

## Åtgärder i portfolj_us.md
Inga affärer. SPY-raden och MRVL-planen fick dagens verifierade kurs; "Senast uppdaterad" uppdaterad. Ackumulerad avkastning oförändrad −3,82 %.

## Bevakning inför imorgon
- **MRVL ≤ 275,00** – planens dag 2 av 5; nivån ligger 0,55 % under gårdagens dagslägsta.
- Fredag 9/10 – `DAL` Q3 (`state/earnings_calendar.json`) – flyg/bränslekostnad. Tisdag 13/10 – `C`, `JPM`, `WFC` Q3. Rapportförbudet (punkt 2e) gäller.
- **Åtgärdspunkter till Dren (L-3):** (1) **Schemalagda Actions uteblev i dag:** `monitor.yml` har ingen körning 2026-10-08 (`state/alerts.json` `checkedAt` 2026-10-07T20:24:57Z), `prices.yml` körde bara 00:25, 00:59, 11:59 och 13:19 UTC (ska köra var 30:e minut från 07 UTC), `news.yml` bara 01:03 och 12:04 UTC. Omfång: hela förmiddagen 07–12 UTC utan monitor. Samma klass som `scheduled-actions-not-firing`. (2) `state/news_feed.json` `feeds["fed-press"]`: **"HTTP 404 – båda försöken"** i körningen 2026-10-08T12:04Z, efter "20 poster" i alla körningar 2026-10-05–10-08 01:03. En enda observation – kontrollera nästa körning innan URL:en byts.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
