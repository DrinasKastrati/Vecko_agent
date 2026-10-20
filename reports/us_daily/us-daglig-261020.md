# Daglig bevakning – US-rotation
**Datum:** 2026-10-20 | **Läge:** Daglig bevakning (USD)
**Marknadsläget i korthet:** S&P 500 stängde måndagen 19/10 på **7 690,73**, +0,41 % mot `previousClose` 7 659,44 (intervall 7 684,79–7 731,18). Nasdaq Composite steg mer: **26 430,89**, +1,11 % (`state/prices.json`, marketTime 2026-10-19T20:44Z resp. 21:15Z, `generatedAt` 2026-10-20T12:42Z). Studsen leddes av AI-/nätverksnamn och `TSLA` inför onsdagens rapport. Den tar inte tillbaka fredagens fall, och `^GSPC`:s MACD-histogram fördjupas fortfarande (scout-rapport-261020). Regimfiltret är **PÅ**: ^GSPC ligger +5,71 % över MA200 7 275,63 (`state/price_history.json`, 250 punkter, råserien). USD/SEK står på 9,9025 (2026-10-20T12:42Z). **I dag:** `NFLX` rapporterar efter stängning (`state/earnings_calendar.json`, `isEstimate: false`).
**Pre-/after-hours:** SPY saknar utökad kurs i `state/prices.json`. Websök 2026-10-20 ("stock market futures October 20 2026") gav inget daterat terminsläge för dagen. Sleevens förbörsläge är därför **EJ VERIFIERAT**. Inga aktieinnehav finns som kan ha rapporterat efter stängning.
**Portföljvikt & kassa:** 100 % indexsleeve (SPY), 0 % kassa. Läget är oförändrat sedan 2026-10-14, och alla fyra aktieplatser är tomma.

---

## Innehav 1: Indexsleeve (SPY) (SPY / NYSE Arca)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| $766,48 – prices.json/Yahoo chart API, 2026-10-19 20:00 UTC, reguljär stängning | −0,88 % | – | – | **BEHÅLL** |

**Pre-/after-hours:** – (ingen utökad kurs i filen, och sleeven har inga nivåer)
**Nyheter senaste 24h:** 2026-10-19: en bred studs efter förra veckans teknikförsäljning, ledd av Nasdaq (+1,11 %). Ingen av de största uppgångarna (`APLD`, `AMZN`, `RIG`, `PLTR`, `MRVL`) hade en daterad bolagskatalysator som gick att verifiera (scout-rapport-261020). SPY:s dagsintervall var 765,82–770,46, och dagsrörelsen +0,42 % mot `previousClose` 763,25.
**Motivering:** Sleeven har varken stop eller mål och säljs aldrig på nedgång. Inget aktieköp eller aktiesälj krävde en omviktning i dag, så den ligger kvar på 100 %. Läget är marginellt starkare än i går (+0,42 %), men momentum har inte vänt: RSI ligger på 47,1 och MACD-histogrammet fördjupas (−0,80 → −1,06).

---

## Pending-planer
Inga pending-planer. Samtliga rader i `state/portfolj_us.md`:s Pending-sektioner är redan överstrukna (TRIGGADE eller AVFÖRDA). Veckorotationen v43 (`us-veckorapport-261019`) lade inga nya.

**Intradag-signaler (2c/2c2):** `state/alerts.json` har `checkedAt` 2026-10-20T12:32:52Z, alltså färskt, och `active` är tom. Monitorn lever och har inga signaler. Gårdagens åtgärdspunkt om en eftersläpande `checkedAt` gäller inte längre i dag.

**Scout-kandidater (punkt 2d):** inga poster med `book: "us"` och `status: "new"` finns i `state/scout_candidates.json`. Scout-rapport-261020 lade inga nya US-kandidater i filen. Inget att avgöra.

**Villkorad bubblar-plan (LÄGE B):** ej tillämplig. Ingen av bubblarna i `us-veckorapport-261019` (BLK, CVX, UNH, CRGY) föll på saknad verifierad kurs. Alla fyra rankades under av omdömesskäl (grind 2, 3 eller 5) och har kurs i `state/prices.json`.

## Åtgärder i portfolj_us.md
- Inga affärer. Endast tidsstämpeln och sleevens kursnotering är uppdaterade, och SPY ligger kvar på 100 %.
- Ackumulerad avkastning är oförändrad på **−5,13 %**, eftersom ingen affär stängdes.
- `state/decisions.json`: 1 ny rad (`book: "us"`, `mode: "B"`): BEHÅLL SPY. Raden är validerad med `--base`.

## Bevakning inför imorgon
* **NFLX i kväll, META, TSLA och ABT onsdag 21/10, BE torsdag 22/10:** capex-signalerna avgör om AI-oron fortsätter. Köp före rapport är spärrat (punkt 2e). En bekräftad överraskning prövas som vanlig kandidat mot de fem grindarna från torsdag.
* **Bubblarna:** `CVX` behöver volymbekräftelse (≥ 1,5×) före fönstret som stänger 28/10, inför rapporten 30/10. `UNH` behöver flödesbekräftelse (1,36× i v43). `BLK` faller fortsatt på nåbarheten.
* **Regimen:** ^GSPC har 5,7 % marginal till MA200, men ligger under EMA20 7 727,27 och histogrammet fördjupas. Regimen är inte hotad på kort sikt.
* **Åtgärdspunkt till Dren (L-3), ÅTERKOMMANDE:** i `state/news_feed.json` (`generatedAt` 2026-10-20T10:08:00Z) står `feeds.globenewswire` och `feeds.globenewswire-earnings` fortfarande på "HTTP 403 – båda försöken (0.1 s)". Omfång: 2 av 6 flöden, inklusive den enda källan som är dedikerad åt rapportöverraskningar. `prnewswire` är tillbaka med 20 poster. Fönstret täcker 10 av 10 handelsdagar.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
