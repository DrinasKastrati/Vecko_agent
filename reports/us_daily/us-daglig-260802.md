# Daglig bevakning – US-rotation
**Datum:** 2026-08-02 | **Läge:** Börser stängda (söndag) – inga beslut
**Marknadsläget i korthet:** Söndag – NYSE och NASDAQ är stängda för helgen. Ingen handel, inga
pre-market-noteringar och inga verifierbara intradagskurser idag. Senast verifierade underlag är
fredagens (2026-07-31) stängning ur `state/prices.json` (`generatedAt` 2026-07-31T22:14:33Z).
**Pre-/after-hours:** – (helg; inga öppna positioner och därmed inga stop/mål att bevaka utanför
reguljär session).
**Portföljvikt & kassa:** 100 % kassa (inga öppna positioner sedan SÄLJ JPM 2026-07-30).

---

## Status
- **Inga beslut fattas** – US-börserna är stängda (helg). Ingen kurs kan verifieras för dagen och
  inget kursbaserat KÖP/SÄLJ/BEHÅLL fattas, i enlighet med promptens krav på färsk data.
- **Aktuellt innehav:** inga öppna positioner. Boken står i 100 % kassa sedan JPM avvecklades
  2026-07-30 via bruten stopp (+1,99 %, 45 % vikt → ackumulerat +0,89 %, se Historik i
  `state/portfolj_us.md`).
- **Pending-planer:** inga aktiva. XOM (≤ 142,00 USD) är AVFÖRD sedan 2026-07-27 och JPM-raden är
  slutförd/stängd. Inga villkorade bubblar-planer ligger ute.
- **Intradag-signaler:** `state/alerts.json` har tom `active`-lista. Se monitor-hälsan nedan –
  den tomma listan är i detta läge inte ett besked om att allt är lugnt.
- **Beslutsdatabasen:** inga rader appendas till `state/decisions.json` i denna körning, eftersom
  inga beslut fattats (stängd marknad, noll innehav, noll pending). Loggen står kvar på 6 rader,
  samtliga fortfarande märkta `backfill-260731` – första live-raden väntas från måndagens rotation.

## Datakvalitet & monitor-hälsa (åtgärdspunkter till Dren, enligt L-3)
- **`state/alerts.json` saknar fältet `checkedAt`.** Filens `generatedAt` är 2026-07-30T09:30:07Z
  (~63 timmar gammal) och fälten `checkedAt`/`watched` saknas helt. Enligt promptens punkt 2c2
  betyder ett saknat `checkedAt` att actionen kört kod äldre än 2026-08-02, dvs. att intradag-
  skyddet ska behandlas som FRÅNVARANDE. **Omfång:** 1 tillståndsfil; berör bevakningen av
  1 öppen position i den nordiska boken (SAAB-B.ST, stop 560 kr) och 0 positioner i US-boken.
  **Status:** rättningen finns redan i repot (`heartbeatDue` + `checkedAt` i
  `.github/scripts/alerts.mjs`) men har ännu inte exekverat – `monitor.yml` kör bara under
  börstid på vardagar. **Ersättningskälla i dag:** ingen behövdes – US-boken har noll öppna
  positioner, så inga nivåer kunde korsas. **Kontroll måndag 2026-08-03:** `checkedAt` ska finnas
  i filen och stämplas om under dagen. Gör den inte det är defekten ÅTERKOMMANDE och kräver
  felsökning av actionen, inte av skriptet.
- **`state/news_feed.json`: flödet `prnewswire` svarar HTTP 404.** Filens `generatedAt` är
  2026-07-31T22:17:09Z, dvs. skriven FÖRE omförsökslogiken lades in – statusraden saknar därför
  markeringen "(efter omförsök)" och går inte att tolka som ett bekräftat dött flöde.
  **Omfång:** 1 av 6 flöden; 258 poster hämtade totalt, övriga fem flöden gröna
  (globenewswire 20, globenewswire-earnings 20, mfn 48, sec-8k 40, fed-press 20).
  **Åtgärd:** kontrollera statussträngen efter måndagens första news-körning – står det
  "HTTP 404 – båda försöken" är flödet verkligt dött och URL:en ska bytas i
  `config/news_feeds.txt`; står det "20 poster" var 404:an transient och inget behöver göras.
- **`config/watchlist_us.txt` ligger på 30 rader mot riktmärket ≤ 25.** Fem av raderna är dock
  infrastruktur som prompten själv kräver (`^GSPC`, `^IXIC`, `^OMX`, sleeven `SPY`, valutan
  `USDSEK=X`), vilket ger exakt 25 faktiskt bevakade aktie-/kryptosymboler. Ingen rensning görs
  i dag – bubblarna HCA/NOC/WFC/MS är kvar enligt L-2 (de behöver verifierad kurs) och samtliga
  symboler behövs som underlag för måndagens rotation. Hygienen omprövas i LÄGE A.

## Åtgärder i portfolj_us.md
Inga ändringar. Börserna är stängda och inga beslut har fattats, så innehav, pending, kassa och
Historik står oförändrade. "Senast uppdaterad" lämnas medvetet orörd så att fredagens (2026-07-31)
substantiella bevakningsnotis finns kvar som underlag inför måndagens rotation.

## Bevakning inför nästa handelsdag
- **Måndag 2026-08-03 = LÄGE A (veckorotation v32).** Boken går in i rotationen med 100 % kassa.
- **Sleeve-migrering är obligatorisk (promptens punkt 4c):** rubriken "Kassa" står på 100 % och har
  gjort det sedan 2026-07-30 – exakt det läge indexsleeven finns för att undvika. Kapitalet ska
  flyttas till **SPY** i måndagens körning, inte vänta på ett bättre aktieläge, och sleeve-köpet
  loggas i `state/decisions.json` med `catalystType: "index"`.
- **Kontrollera att `prices.json` uppdaterats** av `prices.yml` (kör 05:00 + 06:00 UTC vardagar)
  innan rotationen fattar beslut; nuvarande fil är fredagens stängning. Verifiera samtidigt att
  `previousClose` nu ger en DAGSrörelse (fixen från 2026-08-02) innan några dagsrörelser citeras.
- **Rapportkluster att väga in i rotationen:** AAPL (Q3 efter stängning 30/7 – slog EPS/omsättning
  men svag Q4-guidning, föll ~6,6 % efter samtalet) och AMZN (stort AWS-beat, +7–9 % after hours)
  präglar megacap-bilden in i veckan; XOM/CVX rapporterade Q2 fredag 31/7. Nivåerna verifieras mot
  färska kurser i måndagens körning – inget av detta är ett beslutsunderlag i dag.
- **Obligatoriskt inflöde i LÄGE A:** nyhetsdriven kandidatgenerering (≥ 5 kandidater ur
  `state/news_feed.json`), scout-inflödet (US-aktiecase med intakt tes ur de 5 senaste
  scout-rapporterna) och förra veckans bubblare (HCA/NOC/WFC/MS ur `us-veckorapport-260727.md`)
  ska alla poängsättas.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
