# Daglig bevakning – US-rotation
**Datum:** 2026-10-28 | **Läge:** Daglig bevakning (USD)
**Marknadsläget i korthet:** Tisdagen 27/10 fortsatte återhämtningen inför FOMC: S&P 500 steg **+0,60 % till 7 722,60** (intervall 7 677,16–7 736,24) och Nasdaq Composite **+1,18 % till 26 477,81**. Källan är `state/prices.json` (marketTime 2026-10-27T20:48Z resp. 21:15Z, `generatedAt` 2026-10-28T12:42Z, `schemaVersion` 2026-08-02-prevclose). Regimfiltret är **PÅ**: ^GSPC ligger +5,81 % över MA200 7 298,85 (`state/price_history.json`, 250 punkter, råserien). Indexet har nu återtagit både EMA20 7 710,95 och EMA50 7 683,17. RSI är 51,2 och MACD-histogrammet negativt men stigande (−14,33 → −9,90). USD/SEK står på 9,9321 (2026-10-28T12:42Z). FOMC-beskedet kommer i kväll, onsdag 28/10.
**Pre-/after-hours:** SPY saknar utökad kurs i `state/prices.json`. Websök 2026-10-28 ("stock market futures October 28 2026 Fed decision") gav ingen daterad träff för dagen, så sleevens förbörsläge är **EJ VERIFIERAT**. Inga aktieinnehav finns som kan ha rapporterat. Kandidaternas förbörskurser står i `state/prices.json`: **`SOFI` 16,4314 (förbörs 2026-10-28 12:41 UTC)**, +0,19 % mot stängningen 16,40; **`PNR` 62,4535 (förbörs 2026-10-28 12:08 UTC)**, +0,26 % mot 62,29. CDNS, NUE och VZ saknar utökad kurs i filen.
**Portföljvikt & kassa:** 100 % indexsleeve (SPY), 0 % kassa. Alla fyra aktieplatser är tomma. En ny villkorad plan har lagts: NUE ≤ 262,00 (25 %).

---

## Innehav 1: Indexsleeve (SPY) (SPY / NYSE Arca)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| $769,66 – prices.json/Yahoo chart API, 2026-10-27 20:00 UTC, reguljär stängning | −0,47 % | – | – | **BEHÅLL** |

**Pre-/after-hours:** – (ingen utökad kurs i filen, och sleeven har inga nivåer)
**Nyheter senaste 24h:** 2026-10-27: bred uppgång (S&P 500 +0,60 %, Nasdaq +1,18 %; `state/prices.json`). SoFi och Pentair rapporterade Q3 2026 före öppning 27/10 (scout-rapport-261028, SEC 8-K). FOMC-beslut i kväll 28/10; MSFT, GOOGL, VRT, BIIB och AWK rapporterar 28/10 enligt `state/earnings_calendar.json`. SPY:s dagsintervall var 765,21–771,13, och dagsrörelsen +0,56 % mot `previousClose` 765,37.
**Motivering:** Sleeven har varken stop eller mål och säljs aldrig på nedgång. Inget aktieköp fylldes och inget aktiesälj krävde omviktning, så den ligger kvar på 100 %. Den nya NUE-planen påverkar sleeven först om den triggar. Läget har stärkts sedan i går: 769,66 ligger över både EMA20 768,61 och EMA50 765,96, RSI är 51,1 och MACD-histogrammet stiger (−1,37 → −0,95). Kursen ligger klart över MA200 727,76.

---

## Pending-planer
- **NUE (ny 2026-10-28): villkor ≤ 262,00 USD (reguljär session) – EJ TRIGGAD** (stängning 270,79 och dagslägsta 262,51, prices.json/Yahoo chart API, 2026-10-27 20:00 UTC). Planen lades i dag, se nedan. → ingen åtgärd.
- Övriga rader i `state/portfolj_us.md`:s Pending-sektioner är redan överstrukna (TRIGGADE eller AVFÖRDA).

**Intradag-signaler (2c/2c2):** `state/alerts.json` har `checkedAt` **2026-10-27T22:51:28Z**, alltså ~15 timmar gammalt vid körningen (13:32 UTC). `active` är tom, men enligt punkt 2c2 räknas intradagsskyddet som **FRÅNVARANDE** i dag. Utan aktieinnehav finns inga stop eller mål att pröva manuellt. Sleeven har inga nivåer. NUE-planens nivå 262,00 har prövats mot verifierad kurs ovan. Se åtgärdspunkten nedan.

**Scout-kandidater (punkt 2d) – två nya poster, båda AVVISADE som VILANDE (L-4):**
Spärrarna a–e passerade för båda:
- (a) katalysatorn är bekräftad (SEC 8-K 2026-10-27 enligt scouten);
- (b) det finns en verifierad förbörskurs efter katalysatorn;
- (c) regimen är PÅ;
- (d) ingen av dem finns i `state/earnings_calendar.json`:s `upcoming`. Källan täcker bara prisbevakade symboler, och båda är prisbevakade;
- (e) boken har fyra lediga platser.

**Båda faller på grind 2 (teknik), som inte går att mäta.** `state/price_history.json` och `state/volume_history.json` har **en enda punkt** (2026-10-27) för SOFI och PNR. Därför går RSI(14), MACD, EMA20/50/200, MA200 och volymkvoten inte att räkna, och en saknad MA200 blockerar nya positioner. Ingen negativ teknisk bedömning är gjord.
- **`261028-SOFI` (SoFi Technologies):** Q3 med justerad nettointäkt ~1,4 mdr USD (+44 %), FY26-guiden höjd till 5,04 mdr. Förbörs **16,4314 (2026-10-28 12:41 UTC)**. Reaktionen var +13,4 % (14,46 → 16,40) på ~2 630 MUSD omsättning.
- **`261028-PNR` (Pentair):** justerad EPS 1,18 mot konsensus 1,08. Bear: kärnförsäljningen −5 % och GAAP-guiden sänkt. Förbörs **62,4535 (2026-10-28 12:08 UTC)**. Reaktionen var +12,8 % (55,22 → 62,29).

**L-4-omprövning av gårdagens vilande kandidater.** Dataluckan är fylld: CDNS, NUE och VZ bär nu 250 punkter i båda serierna (`partialBackfilledAt` 2026-10-28T00:31Z). Kurserna är reguljära stängningar 2026-10-27 (prices.json/Yahoo chart API), alltså efter katalysatorn 26/10.

- **`261027-NUE` (Nucor) – PROMOTAD som villkorad plan.** Alla fem grindar:
  - **Grind 1 (katalysator):** Q3 2026 enligt 8-K 26/10 efter stängning. EPS 5,80 slog den egna guiden 5,55–5,65. Konsensusjämförelsen är ej verifierad, och websök gav ingen 2026-träff. Reaktionen kom 27/10: **+5,22 %** till 270,79 (intervall 262,51–275,90).
  - **Grind 2 (teknik):** RSI 65,9. MACD 3,50 med histogrammet stigande (0,95 → 1,52). EMA20 256,25 > EMA50 253,01 > EMA200 219,89. Kursen ligger +21,7 % över MA200 222,43. Volymen var 1,99× 20-dagarssnittet. Momentum är +15,6 % på 120 dagar, så uppgången på +14,6 % på 20 dagar har en längre trend bakom sig (punkt 1b).
  - **Grind 3 (likviditet):** 327 MUSD/dag (`state/volume_history.json`).
  - **Grind 4 (kostnad, R/R):** se planen nedan.
  - **Grind 5 (nåbarhet):** 2 × 1,51 % × √25 = 15,10 % ≥ målavståndet 14,12 %.
  - **Plan:** hela positionen **25 % som limit ≤ 262,00** mot reguljär session. Punkt 4a åberopas på båda leden: aktien steg > 3 % på reaktionsdagen, och FOMC-beskedet ikväll är en binär händelse inom 2 handelsdagar.
  - **Nivåer:** stop **247,00** (−5,73 %, under EMA20 och under basen 254–258). Mål **299,00** (+14,12 %). R/R **1:2,47**. `catalystType: earnings`, horisont 25 handelsdagar. Avförs efter 2026-11-04.
  - **Invändning:** 250-dagarshögsta 274,74 (2026-08-05) testades intradag men stängningen låg under. Målet saknar därför chartreferens ovanför, och den gamla toppen är första hindret.
- **`261027-CDNS` (Cadence) – AVVISAD, grind 4.**
  - Grind 2 håller: RSI 58,1, kursen över EMA20 327,55, EMA50 326,91 och EMA200 324,68, volymen 2,00×, MACD-histogrammet stigande (−3,27 → −1,40). Likviditeten är 795 MUSD/dag.
  - Toppen **351–359,55 (2–7/10)** ligger däremot bara 2–5 % över stängningen 343,08. Från ett rekyl-entry under reaktionen blir R/R mot det motståndet under 2:1.
  - Punkt 1b varnar också: −3,3 % på 120 dagar men +7,3 % på 5 dagar, alltså en brant uppgång utan längre trend bakom sig.
  - Den har dessutom lägre R/R än NUE, och högst en kandidat får promotas per körning.
- **`261027-VZ` (Verizon) – AVVISAD, grind 2.** Kursen 43,93 ligger **under MA200 46,75 (−6,04 %)**, under både EMA20 och EMA50, och RSI är 43,5. Kurs ≤ MA200 blockerar nya positioner.

Avgörandena är loggade i `state/scout_candidates.json` (`decidedBy` = denna rapport) och som rader i `state/decisions.json`. NUE-promotionen loggas som `AVVAKTA` med weight 0, eftersom ingen fyllnad har skett, enligt samma praxis som TGT 2026-08-20 och MRVL 2026-10-07. Ett `KÖP` loggas när planen triggar.

**Villkorad bubblar-plan (LÄGE B):** ej tillämplig. Ingen av bubblarna i `us-veckorapport-261026` (RHI, ROP, S, DVN) föll på saknad verifierad kurs, och alla fyra har kurs i `state/prices.json`.

## Åtgärder i portfolj_us.md
- Inga affärer. SPY ligger kvar på 100 %, och ackumulerad avkastning är oförändrad på **−5,13 %**.
- **Ny Pending-sektion "Pending scout-promotion 2026-10-28 (v44)":** NUE ≤ 262,00, stop 247,00, mål 299,00, R/R 1:2,47, 25 %. Triggar planen minskas sleeven 100 % → 75 %.
- `state/decisions.json`: 6 nya rader (`book: "us"`, `mode: "B"`): BEHÅLL SPY, AVVAKTA NUE (promotad som plan), CDNS, VZ, SOFI och PNR. Raderna är validerade med `--base`.

## Bevakning inför imorgon
* **FOMC-besked i kväll 28/10.** Regimen har 5,8 % marginal till MA200. NUE-planen kan trigga på en negativ marknadsreaktion. Triggar den prövas samtliga filter om innan registrering.
* **Rapporter (`state/earnings_calendar.json`, täcker bara prisbevakade symboler – övriga OKONTROLLERAD, L-5):** `GOOGL`, `MSFT`, `VRT`, `BIIB`, `AWK` 28/10; `AMZN`, `INTC`, `COIN`, `HII`, `ILMN`, `MSTR`, `RDDT` 29/10; `CVX`, `XOM`, `CBOE` 30/10. Köp före rapport är spärrat (punkt 2e).
* **L-4-omprövning i morgon:** SOFI och PNR (`expiresAt` 2026-11-04) när natten mellan 28 och 29/10 har backfillat deras serier.
* **Åtgärdspunkt till Dren (L-3), ANDRA RAPPORTEN:** symboler som scouten lägger i `config/watchlist_us.txt` under dagen får bara **en** punkt i `state/price_history.json` och `state/volume_history.json` till nästa dygns breda körning (`wideAt` 2026-10-28T00:31Z). Det beror på att `backfill-history.mjs` bara körs i dygnssteget. Följden är att varje ny scoutkandidat per konstruktion är omätbar på grind 2 den dag boken ska avgöra den. Omfång i dag: 2 av 2 nya US-kandidater (SOFI, PNR); i går 3 av 3. Gårdagens tre blev mätbara först i dag, vilket bekräftar orsaken. Varaktig fix: kör `backfill-history.mjs --missing=200` även på smala körningar när symboler med < 35 punkter finns.
* **Åtgärdspunkt till Dren (L-3), NY:** `state/alerts.json` `checkedAt` är 2026-10-27T22:51Z, och ingen monitorkörning har landat under dagens handelsdag fram till 13:32 UTC. Cronen i `monitor.yml` är `0 7-20 * * 1-5`. Den 26/10 och 27/10 landade bara 3 körningar per dygn, mot 14 schemalagda. Det är samma mönster som `scheduled-actions-not-firing`, och cronen ligger fortfarande på minut 0. Omfång: intradagsskyddet för alla bevakade nivåer, i dag NUE-planen. Åtgärd: flytta cronen från minut 0, som redan gjorts i `prices.yml`.
* **Åtgärdspunkt till Dren (L-3), ÅTERKOMMANDE:** i `state/news_feed.json` (`generatedAt` 2026-10-28T11:23Z) står `feeds.globenewswire` och `feeds.globenewswire-earnings` fortfarande på "HTTP 403 – båda försöken". Omfång: 2 av 6 flöden. Övriga fyra levererar, och fönstret täcker 10 av 10 handelsdagar.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
