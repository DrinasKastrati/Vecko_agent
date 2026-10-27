# Daglig bevakning – US-rotation
**Datum:** 2026-10-27 | **Läge:** Daglig bevakning (USD)
**Marknadsläget i korthet:** Måndagen 26/10 var en återhämtningsdag inför FOMC-mötet: S&P 500 steg **+0,70 % till 7 676,77** (intervall 7 639,70–7 702,13) och Nasdaq Composite **+0,82 % till 26 169,38**. Källan är `state/prices.json` (marketTime 2026-10-26T20:43Z resp. 21:15Z, `generatedAt` 2026-10-27T13:10Z, `schemaVersion` 2026-08-02-prevclose). Regimfiltret är **PÅ**: ^GSPC ligger +5,23 % över MA200 7 295,06 (`state/price_history.json`, 250 punkter, råserien). Indexet ligger dock fortfarande under EMA20 7 709,73 och strax under EMA50 7 681,58. RSI är 47,2 och MACD-histogrammet negativt men stigande (−15,66 → −14,33). USD/SEK står på 9,9349 (2026-10-27T13:10Z).
**Pre-/after-hours:** SPY saknar utökad kurs i `state/prices.json`. Websök 2026-10-27 ("stock market futures October 27 2026 FOMC") gav inget daterat terminsläge för dagen, så sleevens förbörsläge är **EJ VERIFIERAT**. Inga aktieinnehav finns som kan ha rapporterat. Kandidaternas förbörskurser står i `state/prices.json`: **`CDNS` 324,99 (förbörs 2026-10-27 13:07 UTC)**, +0,88 % mot stängningen 322,17; **`NUE` 259,00 (förbörs 2026-10-27 13:08 UTC)**, +0,64 % mot 257,35; **`VZ` 42,9983 (förbörs 2026-10-27 13:08 UTC)**, −0,24 % mot 43,10.
**Portföljvikt & kassa:** 100 % indexsleeve (SPY), 0 % kassa. Läget är oförändrat sedan 2026-10-14, och alla fyra aktieplatser är tomma.

---

## Innehav 1: Indexsleeve (SPY) (SPY / NYSE Arca)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| $765,37 – prices.json/Yahoo chart API, 2026-10-26 20:00 UTC, reguljär stängning | −1,02 % | – | – | **BEHÅLL** |

**Pre-/after-hours:** – (ingen utökad kurs i filen, och sleeven har inga nivåer)
**Nyheter senaste 24h:** 2026-10-26: bred återhämtning (S&P 500 +0,70 %, Nasdaq +0,82 %; scout-rapport-261027, bekräftat mot `state/prices.json`). Cadence (efter stängning), Nucor och Verizon (före öppning) rapporterade Q3 2026 enligt SEC 8-K 2026-10-26 (scout-rapport-261027). Två-dagars FOMC-mötet börjar i dag med besked onsdag 28/10. SPY:s dagsintervall var 761,64–767,73, och dagsrörelsen +0,71 % mot `previousClose` 759,97.
**Motivering:** Sleeven har varken stop eller mål och säljs aldrig på nedgång. Inget aktieköp eller aktiesälj krävde en omviktning i dag, så den ligger kvar på 100 %. Läget har stärkts något sedan i går, men inte förändrats: kursen 765,37 har återtagit EMA50 765,81 nästan helt men ligger under EMA20 768,50. RSI är 47,3 och MACD-histogrammet negativt men stigande (−1,51 → −1,37). Kursen ligger fortsatt klart över MA200 727,39.

---

## Pending-planer
Inga pending-planer. Samtliga rader i `state/portfolj_us.md`:s Pending-sektioner är redan överstrukna (TRIGGADE eller AVFÖRDA). Veckorotationen v44 (`us-veckorapport-261026`) lade inga nya.

**Intradag-signaler (2c/2c2):** `state/alerts.json` har `checkedAt` 2026-10-27T12:59:28Z, alltså färskt, och `active` är tom. Monitorn lever och har inga signaler.

**Scout-kandidater (punkt 2d):** tre nya poster med `book: "us"`, alla avgjorda i dag och alla **AVVISADE som VILANDE** enligt L-4. Spärrarna a–e passerade för alla tre:
- (a) katalysatorn är bekräftad (SEC 8-K 2026-10-26 enligt scouten);
- (b) det finns en verifierad förbörskurs efter katalysatorn;
- (c) regimen är PÅ;
- (d) ingen av dem finns i `state/earnings_calendar.json`:s `upcoming`, så ingen binär händelse ligger inom 2 handelsdagar;
- (e) boken har fyra lediga platser.

**Alla tre faller på grind 2 (teknik), som inte går att mäta.** `state/price_history.json` och `state/volume_history.json` har **en enda punkt** (2026-10-26) för CDNS, NUE och VZ. Därför går varken RSI(14), MACD(12,26,9), EMA20/50/200, MA200 eller volymkvoten mot 20-dagarssnittet att räkna. Kurs ≤ MA200 blockerar nya positioner, och en saknad MA200 blockerar likaså (`prompts/gemensam_korning.md`). Yahoo och stooq svarar 403 från körmiljön, så det fanns ingen reservkälla för historiken. Ingen negativ teknisk bedömning är gjord. Spärren är **tillfällig och datamässig**, och posterna ska därför prövas om när historiken backfillats (L-4).
- **`261027-CDNS` (Cadence Design Systems):** Q3 slog den egna guiden (intäkt 1,633 mdr USD mot 1,595–1,625, non-GAAP EPS 2,11 mot 2,01–2,07) och helårsguiden höjdes. Förbörs **324,99 (2026-10-27 13:07 UTC)**. Reaktionen på rapportdagen var +1,79 % (316,49 → 322,17, intervall 315,35–331,65), och omsättningen var ~1 430 MUSD på en enskild dag.
- **`261027-NUE` (Nucor):** EPS 5,80 slog den egna guiden 5,55–5,65. Jämförelsen mot konsensus är ej verifierad. Förbörs **259,00 (2026-10-27 13:08 UTC)**. Reaktionen var −0,29 % (258,11 → 257,35), med omsättning ~410 MUSD på en dag.
- **`261027-VZ` (Verizon):** justerad EPS 1,31 mot konsensus ~1,28 (tredjepartsuppgift). Förbörs **43,00 (2026-10-27 13:08 UTC)**. Reaktionen på rapportdagen var **−3,49 %** (44,66 → 43,10). Marknaden läste rapporten negativt, vilket försvagar tesen redan före den tekniska prövningen.

Avgörandena är loggade i `state/scout_candidates.json` (`decidedBy` = denna rapport, kandidatkursen uppdaterad till dagens förbörsnotering) och som `AVVAKTA`-rader i `state/decisions.json`. Ingen kandidat promotades.

**Villkorad bubblar-plan (LÄGE B):** ej tillämplig. Ingen av bubblarna i `us-veckorapport-261026` (RHI, ROP, S, DVN) föll på saknad verifierad kurs. Alla fyra rankades under av omdömesskäl, och alla fyra har kurs i `state/prices.json`.

## Åtgärder i portfolj_us.md
- Inga affärer. Endast tidsstämpeln och sleevens kursnotering är uppdaterade, och SPY ligger kvar på 100 %.
- Ackumulerad avkastning är oförändrad på **−5,13 %**, eftersom ingen affär stängdes.
- `state/decisions.json`: 4 nya rader (`book: "us"`, `mode: "B"`): BEHÅLL SPY, AVVAKTA CDNS, AVVAKTA NUE och AVVAKTA VZ. Raderna är validerade med `--base`.

## Bevakning inför imorgon
* **FOMC-besked onsdag 28/10.** Regimen har 5,2 % marginal till MA200, men ^GSPC ligger under EMA20 och strax under EMA50.
* **Rapporter (`state/earnings_calendar.json`):** `BA`, `ITW` 27/10; `GOOGL`, `MSFT`, `BIIB`, `AWK`, `VRT` 28/10; `AMZN`, `INTC`, `COIN` 29/10. Köp före rapport är spärrat (punkt 2e). Bekräftade överraskningar prövas efteråt som vanliga kandidater.
* **L-4-omprövning i morgon:** CDNS, NUE och VZ (`expiresAt` 2026-11-03) ska prövas om mot samtliga fem grindar så snart dygnets backfill har fyllt deras serier. Katalysatorn (26/10) ligger då 2 handelsdagar bak.
* **Åtgärdspunkt till Dren (L-3), NY:** symboler som scouten lägger i `config/watchlist_us.txt` under dagen får bara **en** punkt i `state/price_history.json` och `state/volume_history.json` till nästa dygns breda körning. Det beror på att `backfill-history.mjs` bara körs i dygnssteget i `prices.yml` (`needsDailyRun`/`wideAt`, i dag 2026-10-27T00:06Z), alltså innan scouten lagt till symbolerna. Följden är att varje ny scoutkandidat **per konstruktion** är omätbar på grind 2 den dag boken måste avgöra den. Omfång i dag: 3 av 3 nya US-kandidater (CDNS, NUE, VZ). Snabbåtgärd: en manuell körning av "Hämta kurser" (`workflow_dispatch`) kör backfill-steget direkt. Varaktig fix: kör `backfill-history.mjs --missing=200` även på smala körningar när symboler med < 35 punkter finns, eftersom urvalet redan är begränsat till korta serier.
* **Åtgärdspunkt till Dren (L-3), ÅTERKOMMANDE:** i `state/news_feed.json` (`generatedAt` 2026-10-27T10:38:59Z) står `feeds.globenewswire` och `feeds.globenewswire-earnings` fortfarande på "HTTP 403 – båda försöken". Omfång: 2 av 6 flöden, inklusive den enda källan som är dedikerad åt rapportöverraskningar. Övriga fyra flöden levererar, och fönstret täcker 10 av 10 handelsdagar.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
