# Daglig bevakning – US-rotation
**Datum:** 2026-10-16 | **Läge:** Daglig bevakning (USD)
**Marknadsläget i korthet:** S&P 500 stängde **7 744,06** den 15/10, +0,33 % mot `previousClose` 7 718,94 (intervall 7 669,66–7 754,15). Nasdaq Composite stängde **26 713,03**, +0,08 % (`state/prices.json`, marketTime 2026-10-15T20:33Z resp. 21:15Z, `generatedAt` 2026-10-16T12:21Z). PPI för september blev +1,3 % m/m mot väntade +0,6 % (6,3 % å/å), och detaljhandeln steg +0,8 % mot väntade +0,3 % (BLS 2026-10-15 och Yahoo Finance/Zacks 2026-10-15, enligt scout-rapport-261016; egen websök 2026-10-16 gav inga träffar på siffrorna). Räntorna föll ändå, och kapitalet roterade från AI-hårdvara till banker och detaljhandel. Regimfiltret är **PÅ**: ^GSPC ligger +6,56 % över MA200 7 267,59 (`state/price_history.json`, 250 punkter). USD/SEK står på 9,9002 (2026-10-16T12:21Z). **I dag:** Fed-ordförande Warsh talar, och industriproduktionen publiceras (scout-rapport-261016).
**Pre-/after-hours:** SPY saknar utökad kurs i `state/prices.json`, och websök 2026-10-16 gav inget daterat terminsläge. Sleevens förbörsläge är därför **EJ VERIFIERAT**. Inget innehav har rapporterat. Kandidaten `TSM` står på förbörs **420,76** (prices.json `extendedSession: "pre"`, 2026-10-16T12:20Z), −0,35 % mot stängningen 422,25.
**Portföljvikt & kassa:** 100 % indexsleeve (SPY), 0 % kassa. Läget är oförändrat sedan 2026-10-14, och alla fyra aktieplatser är tomma.

---

## Innehav 1: Indexsleeve (SPY) (SPY / NYSE Arca)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| $771,79 – prices.json/Yahoo chart API, 2026-10-15 20:00 UTC, reguljär stängning | −0,19 % | – | – | **BEHÅLL** |

**Pre-/after-hours:** – (ingen utökad kurs i filen, och sleeven har inga nivåer)
**Nyheter senaste 24h:** 2026-10-15: en varm PPI och en stark detaljhandel, men fallande räntor och rotation in i värde (scout-rapport-261016). Dagsintervall 764,44–772,87, dagsrörelse +0,28 % mot `previousClose` 769,60.
**Motivering:** Sleeven har varken stop eller mål och säljs aldrig på nedgång. Inget aktieköp eller aktiesälj krävde en omviktning i dag, så den ligger kvar på 100 %. Läget har stärkts något sedan i går, men SPY:s MACD-histogram vände till −0,02 och RSI ligger på 51,8.

---

## Pending-planer
Inga pending-planer. Samtliga rader i `state/portfolj_us.md`:s Pending-sektioner är redan överstrukna (TRIGGADE eller AVFÖRDA).

**Intradag-signaler (2c/2c2):** `state/alerts.json` har `checkedAt` 2026-10-16T12:06:35Z, alltså färskt, och `active` är tom. Monitorn lever och har inga signaler.

**Scout-kandidater (punkt 2d):** två poster med `book: "us"` och `status: "new"`. Båda blir **rejected**.
- `261016-TSM` – Q3 2026-10-15, intäkter 46,72 mdr USD över guidningen 44,6–45,8, höjd helårstillväxt (TSMC 6-K 2026-10-15).
  - (a) Katalysatorn är bekräftad.
  - (b) Kurs finns: 422,25, marketTime 2026-10-15T20:00:02Z, reguljär session.
  - (c) Regimen är PÅ.
  - (d) Ingen binär händelse finns inom 2 handelsdagar (`state/earnings_calendar.json`).
  - (e) Ledig plats finns.
  - (f) **Faller på grind 2.** RSI är **37,7**, alltså under 40, och caset är ingen turnaround. Kursen ligger under EMA20 447,41 och EMA50 438,20, och MACD-histogrammet faller (−2,81 → −4,33 → −5,63). Volymen 2,26× och likviditeten ~4,4 mdr USD/dag håller, och nåbarheten (2 × 1,55 % × √30 = 17,0 %) skulle klara earnings-golvet 14 %. Men prisåtgärden går mot rapporten.
- `261016-USB` – Q3 2026-10-15, EPS 1,34 mot väntade 1,32–1,33, höjd intäktsguide till 8–9 % (U.S. Bancorp 2026-10-15).
  - (a)–(e) håller (kurs 57,39, marketTime 2026-10-15T20:00:02Z).
  - (f) **Faller på grind 2:** kursen 57,39 ligger **≤ MA200 57,78**, vilket blockerar nya aktiepositioner. Den ligger också under EMA20 58,08 och EMA50 59,67, och RSI är 41,6. Volymen 1,50× når precis kravet.
  - **Faller dessutom på grind 5.** Taket är 2 × 0,90 % × √30 = **9,9 %**, under earnings-golvet 14 %.

Båda avgörandena är loggade som `AVVAKTA` i `state/decisions.json`.

**Villkorad bubblar-plan (LÄGE B):** ej tillämplig. Ingen bubblare i `us-veckorapport-261013` saknade pending-rad på grund av saknad kurs. TEVA, CVX, XOM och ZS rankades alla under av omdömesskäl.

## Åtgärder i portfolj_us.md
- Inga affärer. Endast tidsstämpeln och sleevens kursnotering är uppdaterade, och SPY ligger kvar på 100 %.
- Ackumulerad avkastning är oförändrad på **−5,13 %**, eftersom ingen affär stängdes.
- `state/scout_candidates.json`: `261016-TSM` och `261016-USB` sätts till `rejected`.
- `state/decisions.json`: 3 nya rader (`book: "us"`, `mode: "B"`): BEHÅLL SPY, AVVAKTA TSM och AVVAKTA USB.

## Bevakning inför imorgon
* **Warshs tal i dag:** håller han oktober öppet efter KPI och PPI, stiger korträntorna och tillväxt pressas. Nästa handelsdag är måndag 19/10, då v43:s LÄGE A körs.
* **Rotationen ut ur AI-hårdvara:** TSM föll trots en stark rapport. Ett nytt halvledarcase kräver att trenden (EMA20/50) återtas.
* **Regimen:** ^GSPC har 6,6 % marginal till MA200 och är inte hotad på kort sikt.
* **META** rapporterar 21/10, och köp före rapporten är spärrat (punkt 2e).
* **Åtgärdspunkt till Dren (L-3), ÅTERKOMMANDE:** i `state/news_feed.json` (`generatedAt` 2026-10-16T09:53:44Z) står `feeds.globenewswire` och `feeds.globenewswire-earnings` på "HTTP 403 – båda försöken (0.0 s)". **Nytt i dag:** `feeds.prnewswire` står på "HTTP 404 – båda försöken (2.1 s)". Omfång: 3 av 6 flöden. Fönstret täcker fortfarande 10 av 10 handelsdagar via mfn, sec-8k och fed-press.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
