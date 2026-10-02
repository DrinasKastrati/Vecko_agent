# Daglig bevakning – US-rotation
**Datum:** 2026-10-02 | **Läge:** Daglig bevakning (USD)
**Marknadsläget i korthet:** S&P 500 stängde **7 666,45** den 1/10 (**+0,19 %** mot `previousClose` 7 651,54, intervall 7 616,78–7 684,75) och bröt därmed tre svaga sessioner i rad. Nasdaq Composite stängde **26 871,60** (**+0,04 %**). Källa: `state/prices.json`, marketTime 2026-10-01T20:35:37Z resp. 21:15:59Z, `generatedAt` 2026-10-02T12:23:27Z. `schemaVersion` `2026-08-02-prevclose` finns, så dagsrörelserna räknas ur filen. **Regimfiltret är PÅ:** ^GSPC ligger **+6,16 %** över MA200 **7 221,26** (200 daterade stängningar 2025-12-15 → 2026-10-01 i `state/price_history.json`). USD/SEK 10,0588 (marketTime 2026-10-02T12:23:20Z). Septembers jobbrapport (NFP) skulle publiceras i dag 12:30 UTC. Websökningen gav inget daterat utfall från en etablerad källa, och den enda träffen med siffror (661 000 jobb, 7,9 % arbetslöshet) hör uppenbart till 2020. **Därför görs inget påstående om utfallet.** Enligt `state/earnings_calendar.json` (`generatedAt` 2026-10-02T00:45Z) finns inga rapporter t.o.m. 2026-10-07. Källan täcker bara symboler som `prices.yml` hämtar, så resten av universumet är OKONTROLLERAT (L-5).
**Pre-/after-hours:** SPY har ingen utökad kurs i `state/prices.json`, och sleeven saknar nivåer som en förbörsrörelse skulle kunna korsa. ACN handlades förbörs på **211,10** (2026-10-02T12:10:08Z, `extendedSession: pre`), alltså −0,56 % mot gårdagens stängning 212,30. SYNA handlades förbörs på **121,00** (12:22:51Z), strax under kontantbudet 123.
**Portföljvikt & kassa:** 12,5 % ACN (ben 1 av 2) + 87,5 % indexsleeve (SPY), 0 % kassa. Tre aktieplatser är tomma och en pending-plan finns (ACN ben 2).

---

## Innehav 1: Accenture (ACN / NYSE)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| $212,30 – prices.json/Yahoo chart API, 2026-10-01 20:00 UTC, reguljär stängning | ±0,00 % (ny) | $200,50 (avstånd −5,56 %) | $242,10 (avstånd +14,04 %) | **KÖP** |

**Pre-/after-hours:** 211,10 förbörs (prices.json `extendedPrice`, 2026-10-02T12:10:08Z, `pre`), −0,56 % mot stängningen. Stoppen korsas inte.
**Nyheter senaste 24h:** 2026-10-01: Q4 FY26-rapport före öppning (Accenture 8-K, SEC CIK 0001467373; Yahoo Finance/Benzinga/RTTNews 2026-10-01 enligt scouten). Intäkten blev 18,68 mdr USD (+6 %), över bolagets eget intervall 17,75–18,40 och konsensus ~18,04 (Benzinga). Orderingången var 22,2 mdr USD med rekordmånga storaffärer, och guiden för FY27 är +3–6 % i lokal valuta. Senaste analysmålen före rapporten: Wells Fargo 194 (nedgradering till Equal-Weight, 14/9), Morgan Stanley 175 (14/9), Wolfe 215 (25/8) – källa Benzinga/TipRanks. Inga daterade nyheter från 2026-10-02 hittades.
**Motivering:** Scout-kandidat `261002-ACN` passerar samtliga sex spärrar i punkt 2d och alla fem grindar, så den promotas.
- **Grind 1:** kursen 212,30 är verifierad och satt efter katalysatorn.
- **Grind 2:** RSI 70,0. Kursen ligger över EMA20 184,75, EMA50 178,78 och EMA200 191,11. MACD-korset är färskt (histogram −1,498 → +0,771). Volymen är 5,50× 20-dagarssnittet och omsättningen 1 118 MUSD/dag.
- **Grind 3:** katalysatorn kom 1/10.
- **Grind 4:** målet 242,10 ligger +14,04 % över entry och har chartreferens i februaribasen 234–242.
- **Grind 5:** nåbarhetstaket är 2 × 2,23 % × √25 = 22,3 % (dagsrörelse ur 60 dagar exklusive rapportdagen). R/R är 1:2,53.

Över 3 månader har aktien gått +54 % från junibotten 129, vilket punkt 1b räknar som ett plus. Entryt delas enligt punkt 4a: ben 1 köps direkt, och ben 2 läggs som limit ≤ 205,00. Gap-undantaget gäller inte i dag, eftersom kursen står −0,56 % förbörs. Invändningarna redovisas i stället för att tigas ihjäl:
- stängningen tonades ned 6,7 % från dagshögsta 227,58;
- EMA50 ligger fortfarande under EMA200;
- analysmålen före rapporten låg under eller i nivå med dagens kurs.

---

## Innehav 2: Indexsleeve (SPY) (SPY / NYSE Arca)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| $763,99 – prices.json/Yahoo chart API, 2026-10-01 20:00 UTC, reguljär stängning | −1,20 % | – | – | **BEHÅLL** |

**Pre-/after-hours:** – (ingen utökad kurs i filen, och sleeven har inga nivåer)
**Nyheter senaste 24h:** Inga sleeve-specifika nyheter. Dagsintervallet var 758,79–765,65 och dagsrörelsen +0,18 % mot `previousClose` 762,63.
**Motivering:** Sleeven minskas från 100 % till 87,5 % för att finansiera ACN ben 1. Ett aktieköp är det enda tillåtna skälet att röra sleeven i LÄGE B. Fylls ben 2 minskas den till 75 %. Sleeven har varken stop eller mål.

---

## Pending-planer
ACN (ben 2 av 2): villkoret är verifierad kurs ≤ $205,00 i reguljär session. **EJ TRIGGAD**: förbörskursen är 211,10 (prices.json, 2026-10-02T12:10Z), alltså 2,98 % över nivån. Planen lades i dag och gäller t.o.m. 2026-10-08. Fylls den slås positionen ihop till en rad: 25 %, viktat entry 208,65, stop 200,50 oförändrad och R/R 1:4,10.

**Punkt 2c2 – monitorns hälsa: intradagsskyddet är FRÅNVARANDE denna körning.** `state/alerts.json` har `checkedAt` **2026-10-01T20:08:30Z**, vilket är ~17 timmar gammalt kl. 13:21 UTC på en handelsdag (tröskeln är ~6 h). `active` är tom. Git-historiken visar monitorcommits 2026-10-01 kl. 14:13 och 20:08 UTC men ingen i dag. **Konsekvensen är inte längre noll:** boken har nu en stop (ACN 200,50) och en entry-nivå (205,00) som ingen bevakar mellan körningarna. Se åtgärdspunkt 1.

**Punkt 2d – scout-kandidater: två poster med `status: "new"` och `book: "us"`. Båda är avgjorda, med en promotion.** Regimen är PÅ (spärr c) och boken hade fyra lediga platser (spärr e). Ingen kandidat har en bekräftad binär händelse inom 2 handelsdagar i `earnings_calendar.json` (spärr d), och båda har `confirmed: true` (spärr a).

| Kandidat | Kurs (USD) | RSI | Utfall |
|---|---|---|---|
| 261002-ACN (earnings 1/10) | 212,30 reguljär stängning efter katalysatorn | 70,0 | **PROMOTED** – alla fem grindar, se Innehav 1 |
| 261002-SYNA (other 1/10, reviderat fusionsavtal) | 122,49 förbörs (2026-10-02T11:04Z, `pre`) | – | **REJECTED, grind 4** – onsemis kontantbud på 123 USD/aktie är taket. Uppsidan blir +0,4 % mot kravet ≥ 8 % (kostnadströskeln). Grind 2 är dessutom omätbar: 1 punkt i `price_history.json`. Fusionsarbitrage passar inte en bok med 0,75 % rundturskostnad. |

**L-4-omprövning: 261001-UTHR.** UTHR avvisades i går på grind 2 enbart för att serien hade 1 punkt. Det var ett tillfälligt datavillkor, och backfillen har nu fyllt 250 punkter i både pris- och volymserien. Kandidaten (giltig t.o.m. 2026-10-08) har därför prövats om mot alla fem grindar:
- **Grind 2 passerar:** RSI 72,0. Kursen 571,38 ligger över EMA20 505,45, EMA50 511,95 och EMA200 516,34. MACD har korsat signalen (2,516 mot −4,929), volymen är 1,89× och omsättningen 511 MUSD/dag.
- **Grind 4 fäller:** klassen `other` kräver mål +10–14 % (628–651), vilket ligger över 250-dagarshögsta 596,76. Närmaste motstånd ger bara +4,4 %.

Det är samma bedömning som fällde MSFT, AMD och TEVA i går. Kandidaten avvisas, och avgörandet loggas som en ny AVVAKTA-rad.

Teknik räknad på råserierna i `state/price_history.json`, volym ur `state/volume_history.json`. **4 rader loggade i `state/decisions.json`** (SPY BEHÅLL, ACN KÖP samt AVVAKTA för SYNA och UTHR) och validerade före commit: `validate-decisions.mjs` OK (831 rader), `validate-scout-candidates.mjs` OK.

**Villkorad bubblar-plan i LÄGE B: ingen.** Det finns ingen us-veckorapport för vecka 40. De fem bubblarna i senaste rapporten (`us-veckorapport-260921.md`) rankades alla under av omdömesskäl, så villkor 1 uppfylls inte.

## Åtgärder i portfolj_us.md
- **KÖP ACN ben 1 (12,5 %) @ $212,30** enligt handelsplanen: stop $200,50, mål $242,10, R/R 1:2,53, `earnings`, 25 handelsdagar. Ny rad i Aktuellt innehav.
- **Indexsleeven (SPY) minskad 100 % → 87,5 %.**
- **Ny pending-plan:** ACN ben 2, ≤ $205,00, 12,5 %, gäller t.o.m. 2026-10-08. Den lades i en ny sektion "### Pending scout-promotion 2026-10-02" överst, där `alerts.mjs` och `vparse.js` läser den första Pending-tabellen.
- Historiken är orörd och den ackumulerade avkastningen oförändrad på **−2,87 %**.

**Åtgärdspunkter till Dren (L-3):**
1. **ÅTERKOMMANDE – `state/alerts.json` `checkedAt` 2026-10-01T20:08:30Z:** ingen monitorkörning är registrerad under dagens handelstimmar. Samma defekt fanns i går (`checkedAt` 2026-09-30T22:49Z) och i de nordiska dagsrapporterna 260925–261002. Omfånget är hela intradagsskyddet för båda böckerna. **I dag gäller det en levande stop (ACN 200,50) och en entry-nivå (205,00).** Kontrollera att `monitor.yml` faktiskt startar. GitHub tappar schemalagda körningar vid hög last, se KVAR punkt 8 i CLAUDE.md.
2. **US-rotationens LÄGE A för vecka 40 saknas fortfarande** (`reports/us_weekly/` slutar på `us-veckorapport-260921.md`). Detta ÅTERKOMMER från 2026-08-24, 08-31 och 09-28. Nästa ordinarie rotation är måndag 2026-10-05.
3. **`config/watchlist_us.txt` har 86 aktiva rader mot riktmärket ≤ 25.** Hygien rensas medvetet inte i en LÄGE B-körning. Den hör hemma i nästa veckorotation, men listan kostar Yahoo-anrop var 30:e minut.

## Bevakning inför imorgon
- **ACN:** följ reaktionen på gapet. Ben 2 fylls vid ≤ 205,00, och stoppen ligger på 200,50. En stängning under gapets botten 211,04 försvagar tesen.
- **Jobbrapporten för september (NFP):** utfallet är ej verifierat i dag. Den bör vägas in i nästa körning tillsammans med räntespåret.
- **Måndag 2026-10-05: LÄGE A.** Det blir första veckorotationen sedan 2026-09-21 och ska fylla tre lediga platser.
- Rapporter enligt `earnings_calendar.json`: **PEP 2026-10-08, DAL 2026-10-09** (inga innehav).

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
