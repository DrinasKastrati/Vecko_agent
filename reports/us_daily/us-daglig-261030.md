# Daglig bevakning – US-rotation
**Datum:** 2026-10-30 | **Läge:** Daglig bevakning (USD)
**Marknadsläget i korthet:** Torsdagens rapportkväll gav risk-off i tillväxt. S&P 500 föll **−0,30 % till 7 720,39** (intervall 7 690,94–7 732,21) och Nasdaq Composite **−1,38 % till 26 184,73**, när `GOOGL` och `MRVL` drog ned AI-kedjan (scout-rapport-261030). Källan är `state/prices.json` (marketTime 2026-10-29T20:32Z resp. 21:15Z, `generatedAt` 2026-10-30T12:42Z, `schemaVersion` 2026-08-02-prevclose). Regimfiltret är **PÅ**: ^GSPC ligger +5,67 % över MA200 7 306,46 (`state/price_history.json`, 250 punkter, råserien). Indexet ligger strax över EMA20 7 714,70 och EMA50 7 686,93, RSI är 50,8 och MACD-histogrammet negativt men stigande (−5,30 → −3,70). USD/SEK står på 9,8254 (2026-10-30T12:42Z). Efter stängning 29/10 rapporterade `AMZN` (AWS +39 %, men EPS-miss och tung capex) och `INTC`; före öppning i dag rapporterar `XOM`, `CVX` och `CBOE` (`state/earnings_calendar.json`).
**Pre-/after-hours:** SPY saknar utökad kurs i `state/prices.json`. Websök 2026-10-30 ("stock market futures October 30 2026") gav ingen daterad träff för dagen, så sleevens förbörsläge är **EJ VERIFIERAT**. Inga aktieinnehav finns som kan ha rapporterat. Kandidaternas förbörskurser i `state/prices.json`: **`AMZN` 225,50 (förbörs 2026-10-30 12:41 UTC)**, −7,50 % mot stängningen 243,79; **`HII` 315,97 (förbörs 11:07 UTC)**, −0,08 % mot 316,21. NUE och AXGN saknar utökad kurs.
**Portföljvikt & kassa:** 100 % indexsleeve (SPY), 0 % kassa. Alla fyra aktieplatser är tomma. Två villkorade planer är öppna: NUE ≤ 262,00 (25 %) och AXGN ≤ 46,00 (25 %).

---

## Innehav 1: Indexsleeve (SPY) (SPY / NYSE Arca)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| $769,36 – prices.json/Yahoo chart API, 2026-10-29 20:00 UTC, reguljär stängning | −0,51 % | – | – | **BEHÅLL** |

**Pre-/after-hours:** – (ingen utökad kurs i filen, och sleeven har inga nivåer)
**Nyheter senaste 24h:** 2026-10-29: S&P 500 −0,30 %, Nasdaq −1,38 % (`state/prices.json`). GOOGL −12,64 % och MRVL −13,24 % ledde nedgången i AI-kedjan; AMZN föll −4,25 % redan före sin rapport, och INTC ~−20 % efterbörs på svag Q4-guide (scout-rapport-261030). XOM, CVX och CBOE rapporterar 30/10 före öppning; AAPL och PLTR 2/11 (`state/earnings_calendar.json`). SPY:s dagsintervall var 766,62–770,76 och dagsrörelsen −0,38 % mot `previousClose` 772,31.
**Motivering:** Sleeven har varken stop eller mål och säljs aldrig på nedgång. Ingen plan fylldes och inget aktiesälj krävde omviktning, så den ligger kvar på 100 %. Läget har försvagats något sedan i går men trenden är intakt: 769,36 ligger strax över EMA20 769,00 och över EMA50 766,34, RSI är 50,6, MACD-histogrammet negativt men stigande (−0,47 → −0,34), och kursen ligger 5,60 % över MA200 728,53.

---

## Pending-planer
- **NUE: villkor ≤ 262,00 USD (reguljär session) – EJ TRIGGAD** (dagslägsta 271,30, stängning 275,29; prices.json/Yahoo chart API, 2026-10-29 20:00 UTC). 3,55 % över villkoret – avståndet har vuxit, kursen stängde på nytt 250-dagarshögsta. Dagens session har inte öppnat vid körningen (13:35 UTC). → ingen åtgärd, giltig t.o.m. 2026-11-04. Nivån höjs inte för att jaga uppgången.
- **AXGN: villkor ≤ 46,00 USD (reguljär session) – EJ TRIGGAD** (dagslägsta 48,43, stängning 49,63; prices.json/Yahoo chart API, 2026-10-29 20:00 UTC). 5,28 % över villkoret. → ingen åtgärd, giltig t.o.m. 2026-11-05.
- Övriga rader i `state/portfolj_us.md`:s Pending-sektioner är redan överstrukna (TRIGGADE eller AVFÖRDA).

**Intradag-signaler (2c/2c2):** `state/alerts.json` har `checkedAt` **2026-10-29T23:48:20Z**, alltså ~13,8 timmar gammalt vid körningen, och ingen monitorcommit har landat på main i dag fram till 13:35 UTC. `active` är tom, men enligt punkt 2c2 räknas intradagsskyddet som **FRÅNVARANDE** i dag. Utan aktieinnehav finns inga stop eller mål att pröva manuellt. Båda planernas nivåer har prövats mot verifierad kurs ovan. Se åtgärdspunkten nedan.

**Scout-kandidater (punkt 2d) – två nya poster, båda AVVISADE.** Båda har bekräftad katalysator, verifierad kurs efter katalysatorn och 250 punkter i både `state/price_history.json` och `state/volume_history.json`. Regimen är PÅ, ingen av dem rapporterar inom 2 handelsdagar och boken har fyra lediga platser, så spärrarna (a)–(e) håller. Båda faller på grind 2 i det fullständiga filtret. Indikatorerna är räknade på råserien t.o.m. 2026-10-29.
- **`261030-HII` (Huntington Ingalls) – AVVISAD, grind 2 (teknik).** Katalysatorn är stark: Q3 2026 (8-K 29/10 före öppning), EPS 5,48 mot konsensus ~4,36–4,43, höjd varvsguide, reaktion +13,23 % på 3,22× volym (scout-rapport-261030). Men kursen 316,21 ligger **under MA200 336,14 (−5,93 %)**, och RSI 75,7 överstiger taket 75. EMA20 277,32 < EMA50 280,04 < EMA200 311,15. Kurs ≤ MA200 blockerar nya positioner. Förbörs 315,97 (2026-10-30 11:07 UTC). Likviditet 167 MUSD/dag.
- **`261030-AMZN` (Amazon) – AVVISAD, grind 2 (teknik).** Q3 2026 efter stängning 29/10: AWS +39 %, rekordmarginal 13,9 %, men EPS 1,89 mot ~1,97 och capex 75,9 mdr (scout-rapport-261030). Förbörskursen **225,50 (2026-10-30 12:41 UTC, prices.json)** ligger **under MA200 243,38 (−7,35 %)**. EMA20 253,40 < EMA50 254,04, RSI 40,7 och MACD-histogrammet fallande (−0,47 → −1,02). Kurs ≤ MA200 blockerar. Reaktionen är dessutom negativ, vilket inte ger något köpcase.

Avgörandena är loggade i `state/scout_candidates.json` (`decidedBy` = denna rapport) och som `AVVAKTA`-rader i `state/decisions.json`. Inga vilande avvisningar från tidigare dagar kräver L-4-omprövning: samtliga avgöranden 2026-10-29 var slutliga.

**Villkorad bubblar-plan (LÄGE B):** ej tillämplig. Ingen av bubblarna i `us-veckorapport-261026` (RHI, ROP, S, DVN) föll på saknad verifierad kurs.

## Åtgärder i portfolj_us.md
- Inga affärer. SPY ligger kvar på 100 %, och ackumulerad avkastning är oförändrad på **−5,13 %**.
- NUE- och AXGN-planerna fick statusraden "EJ TRIGGAD per 2026-10-30".
- `state/decisions.json`: 3 nya rader (`book: "us"`, `mode: "B"`): BEHÅLL SPY, AVVAKTA HII och AVVAKTA AMZN. Raderna är validerade med `--base`.

## Bevakning inför imorgon
* **Nästa körning är måndag 2026-11-02 = LÄGE A (v45).** Då avförs inga planer ännu: NUE gäller t.o.m. 2026-11-04 och AXGN t.o.m. 2026-11-05. Båda planerna prövas om i rotationen.
* **Två planer kan trigga på en rekyl i dagens session:** NUE ≤ 262,00 och AXGN ≤ 46,00. Monitorn är det enda skyddet fram till måndag, och den har inte rapporterat i dag – se nedan.
* **Rapporter (`state/earnings_calendar.json`, täcker bara prisbevakade symboler – övriga OKONTROLLERAD, L-5):** `XOM`, `CVX`, `CBOE` 30/10; `AAPL`, `PLTR` 2/11; `AMD`, `ANET`, `SMCI` 3/11. Köp före rapport är spärrat (punkt 2e).
* **Åtgärdspunkt till Dren (L-3), TREDJE RAPPORTEN:** `state/alerts.json` `checkedAt` är 2026-10-29T23:48Z, och ingen monitorcommit har landat i dag fram till 13:35 UTC. Cronen i `monitor.yml` är fortfarande `0 7-20 * * 1-5`, alltså på minut 0, där GitHub oftast tappar körningar (`scheduled-actions-not-firing`). Omfång: intradagsskyddet för alla bevakade nivåer, i dag NUE- och AXGN-planerna. Åtgärd: flytta cronen från minut 0, som redan gjorts i `prices.yml`.
* **Åtgärdspunkt till Dren (L-3), ÅTERKOMMANDE:** i `state/news_feed.json` (`generatedAt` 2026-10-30T11:26Z) står `feeds.globenewswire` och `feeds.globenewswire-earnings` fortfarande på "HTTP 403 – båda försöken". Omfång: 2 av 6 flöden. Övriga fyra levererar, och fönstret täcker 10 av 10 handelsdagar.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
