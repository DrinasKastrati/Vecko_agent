# Daglig bevakning – US-rotation
**Datum:** 2026-10-29 | **Läge:** Daglig bevakning (USD)
**Marknadsläget i korthet:** Fed lämnade räntan oförändrad (FOMC-uttalande 2026-10-28 18:00 UTC, federalreserve.gov via `state/news_feed.json`; 3,75–4,00 % med reservationer enligt scout-rapport-261029). S&P 500 steg för tredje sessionen i rad, **+0,28 % till 7 743,98** (intervall 7 718,37–7 758,43), och Nasdaq Composite steg **+0,27 % till 26 549,85**. Källan är `state/prices.json` (marketTime 2026-10-28T21:18Z resp. 21:15Z, `generatedAt` 2026-10-29T12:50Z, `schemaVersion` 2026-08-02-prevclose). Regimfiltret är **PÅ**: ^GSPC ligger +6,04 % över MA200 7 302,68 (`state/price_history.json`, 250 punkter, råserien). Indexet ligger över EMA20 7 714,10 och EMA50 7 685,56, RSI är 53,0 och MACD-histogrammet negativt men stigande (−9,90 → −5,30). USD/SEK står på 9,8808 (2026-10-29T12:50Z). Rapportkvällen gick isär: `MSFT` steg i förbörs, `GOOGL` föll kraftigt på en vinstmiss (scout-rapport-261029).
**Pre-/after-hours:** SPY saknar utökad kurs i `state/prices.json`. Websök 2026-10-29 ("stock market futures October 29 2026") gav ingen daterad träff för dagen, så sleevens förbörsläge är **EJ VERIFIERAT**. Inga aktieinnehav finns som kan ha rapporterat. Kandidaternas förbörskurser i `state/prices.json`: **`MSFT` 540,95 (förbörs 2026-10-29 12:50 UTC)**, +1,87 % mot stängningen 531,01; **`AXGN` 49,59 (förbörs 12:07 UTC)**, +0,69 %; **`VRT` 232,01 (förbörs 12:50 UTC)**, −4,50 %; **`ORCL` 142,41 (förbörs 12:50 UTC)**, −1,47 %. NUE saknar utökad kurs.
**Portföljvikt & kassa:** 100 % indexsleeve (SPY), 0 % kassa. Alla fyra aktieplatser är tomma. Två villkorade planer är öppna: NUE ≤ 262,00 (25 %) och, ny i dag, AXGN ≤ 46,00 (25 %).

---

## Innehav 1: Indexsleeve (SPY) (SPY / NYSE Arca)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| $772,31 – prices.json/Yahoo chart API, 2026-10-28 20:00 UTC, reguljär stängning | −0,12 % | – | – | **BEHÅLL** |

**Pre-/after-hours:** – (ingen utökad kurs i filen, och sleeven har inga nivåer)
**Nyheter senaste 24h:** 2026-10-28: FOMC lämnade räntan oförändrad (federalreserve.gov, 2026-10-28 18:00 UTC). S&P 500 +0,28 %, Nasdaq +0,27 % (`state/prices.json`). MSFT och GOOGL rapporterade efter stängning 28/10; AMZN, INTC, COIN, MSTR, RDDT, ILMN och HII rapporterar 29/10 enligt `state/earnings_calendar.json`. SPY:s dagsintervall var 769,25–773,35 och dagsrörelsen +0,34 % mot `previousClose` 769,66.
**Motivering:** Sleeven har varken stop eller mål och säljs aldrig på nedgång. Ingen plan fylldes och inget aktiesälj krävde omviktning, så den ligger kvar på 100 %. Läget har stärkts något sedan i går: 772,31 ligger över EMA20 768,96 och EMA50 766,21, RSI är 53,3, MACD-histogrammet stiger (−0,95 → −0,47) och kursen ligger 6,06 % över MA200 728,15.

---

## Pending-planer
- **NUE: villkor ≤ 262,00 USD (reguljär session) – EJ TRIGGAD** (dagslägsta 263,435, stängning 271,79; prices.json/Yahoo chart API, 2026-10-28 20:00 UTC). 0,55 % över villkoret. Dagens session har inte öppnat vid körningen (13:20 UTC). → ingen åtgärd, giltig t.o.m. 2026-11-04.
- **AXGN (ny 2026-10-29): villkor ≤ 46,00 USD (reguljär session) – EJ TRIGGAD** (stängning 49,25, prices.json/Yahoo chart API, 2026-10-28 20:00 UTC; förbörs 49,59, 2026-10-29 12:07 UTC). Planen lades i dag, se nedan. → ingen åtgärd.
- Övriga rader i `state/portfolj_us.md`:s Pending-sektioner är redan överstrukna (TRIGGADE eller AVFÖRDA).

**Intradag-signaler (2c/2c2):** `state/alerts.json` har `checkedAt` **2026-10-28T23:53:58Z**, alltså ~13,5 timmar gammalt vid körningen. `active` är tom, men enligt punkt 2c2 räknas intradagsskyddet som **FRÅNVARANDE** i dag. Utan aktieinnehav finns inga stop eller mål att pröva manuellt. Båda planernas nivåer har prövats mot verifierad kurs ovan. Se åtgärdspunkten nedan.

**Scout-kandidater (punkt 2d) – fyra nya poster, en PROMOTAD som villkorad plan, tre AVVISADE.** Alla fyra har bekräftad katalysator, verifierad kurs efter katalysatorn och 250 punkter i både `state/price_history.json` och `state/volume_history.json`. Regimen är PÅ, ingen av dem rapporterar inom 2 handelsdagar enligt `state/earnings_calendar.json`, och boken har fyra lediga platser. Indikatorerna är räknade på råserien t.o.m. 2026-10-28.
- **`261029-AXGN` (Axogen) – PROMOTAD som villkorad plan.** Alla fem grindar:
  - **Grind 1 (katalysator):** Q3 2026 före öppning 28/10. Intäkter 75,8 MUSD (+26,2 %), justerat EPS 0,21 mot 0,13, helårsguiden höjd till minst 290 MUSD (Investing.com, TIKR, StreetInsider 2026-10-28 enligt scout-rapport-261029). Reaktion **+31,47 %** till 49,25.
  - **Grind 2 (teknik):** RSI 74,5, alltså under taket 75. MACD-linjen är −0,39 men histogrammet är positivt och stigande (0,54 → 1,29). Kursen ligger över EMA20 38,94, EMA50 40,89 och EMA200 38,33, och +25,05 % över MA200 39,38. Volymen var 6,09× 20-dagarssnittet.
  - **Grind 3 (likviditet):** 75 MUSD/dag (`state/volume_history.json`), över golvet 20 MUSD.
  - **Grind 4 (kostnad, R/R):** målavstånd 14,00 % ≥ 8 %. R/R 1:2,48 mot målet och 1:2,20 mot 250-dagarshögsta 51,73.
  - **Grind 5 (nåbarhet):** 2 × 2,81 % × √25 = 28,1 % ≥ 14,00 %.
  - **Plan:** hela positionen **25 % som limit ≤ 46,00** mot reguljär session. Punkt 4a gäller, eftersom aktien gapade > 3 %. 46,00 ligger 6,60 % under stängningen och inne i reaktionsdagens intervall 43,50–49,97. Det är ett rekylköp, ingen jakt på reaktionen (ACN stoppades 2026-10-02 samma dag den köptes på en reaktion).
  - **Nivåer:** stop **43,40** (−5,65 %, under reaktionsdagens lägsta 43,50). Mål **52,44** (+14,00 %, golvet i earnings-bandet). `catalystType: earnings`, horisont 25 handelsdagar. Avförs efter 2026-11-05.
  - **Invändningar:** 250-dagarshögsta 51,73 ligger under målet och är första hindret. RSI 74,5 står i grind 2:s övre kant, och EMA20 ligger under EMA50. Före gapet var 120-dagarstrenden negativ (−13,7 %), så varningen i punkt 1b gäller: uppgången har ingen längre trend bakom sig. Det är skälet till att entry ligger långt under reaktionen. Värderingen (~83× framåtriktad vinst enligt scouten) är också ett bear-argument. Totalpoäng 6,55 (katalysator 8, teknik 6, makro 5, R/R 6).
  - **Universum (L-6):** `config/fokus_us_rotation.md` säger "alla bolagsstorlekar" för NYSE & NASDAQ, och medicinteknik är inte undantaget.
- **`261029-MSFT` (Microsoft) – AVVISAD, grind 5 (nåbarhetstaket).** Q1 FY27 efter stängning 28/10: Azure +48 %, EPS 4,89 mot ~4,72 (scout-rapport-261029). Grind 1–3 håller: RSI 56,1, EMA20 526,55 > EMA50 508,02 > EMA200 463,93, +21,4 % över MA200, likviditet 10 518 MUSD/dag. Men earnings-bandet kräver mål ≥ 14 %, och taket är 2 × 1,10 % × √30 = **12,05 %** även vid den längsta horisonten (6 veckor). Kursen: förbörs 540,95 (2026-10-29 12:50 UTC).
- **`261029-VRT` (Vertiv) – AVVISAD, grind 2.** Kursen 242,94 ligger **under MA200 269,86 (−9,97 %)** och under EMA200 247,77 (marginellt över EMA50 241,29). Kurs ≤ MA200 blockerar nya positioner. Förbörs 232,01 (−4,50 %).
- **`261029-ORCL` (Oracle) – AVVISAD, grind 2.** Kursen 144,54 ligger **under MA200 157,59 (−8,28 %)** och under EMA200 161,57. Kurs ≤ MA200 blockerar. Investerardagens mål är mål, inte utfall.

**L-4-omprövning av gårdagens vilande kandidater.** Dataluckan är fylld: SOFI och PNR bär nu 250 punkter i båda serierna. Båda avvisas slutligt, nu av omdömesskäl (teknik), och bär ett andra avgörande daterat 2026-10-29.
- **`261028-SOFI` – AVVISAD, grind 2.** Kursen 17,14 ligger **under MA200 17,88 (−4,15 %)**, och EMA20 15,51 < EMA50 16,20 < EMA200 19,02.
- **`261028-PNR` – AVVISAD, grind 2.** Kursen 64,37 ligger **under MA200 76,55 (−15,91 %)**, och RSI 80,2 överstiger taket 75.

Avgörandena är loggade i `state/scout_candidates.json` (`decidedBy` = denna rapport) och som rader i `state/decisions.json`. AXGN-promotionen loggas som `AVVAKTA` med weight 0, eftersom ingen fyllnad har skett, enligt samma praxis som NUE 2026-10-28. Ett `KÖP` loggas när planen triggar. Högst en kandidat får promotas per körning, och AXGN var den enda som höll alla grindar.

**Villkorad bubblar-plan (LÄGE B):** ej tillämplig. Ingen av bubblarna i `us-veckorapport-261026` (RHI, ROP, S, DVN) föll på saknad verifierad kurs.

## Åtgärder i portfolj_us.md
- Inga affärer. SPY ligger kvar på 100 %, och ackumulerad avkastning är oförändrad på **−5,13 %**.
- **Ny Pending-sektion "Pending scout-promotion 2026-10-29 (v44)":** AXGN ≤ 46,00, stop 43,40, mål 52,44, R/R 1:2,48, 25 %. Triggar planen minskas sleeven med 25 pp.
- NUE-planen fick statusraden "EJ TRIGGAD per 2026-10-29".
- `state/decisions.json`: 7 nya rader (`book: "us"`, `mode: "B"`): BEHÅLL SPY, AVVAKTA AXGN (promotad som plan), MSFT, VRT, ORCL, SOFI och PNR. Raderna är validerade med `--base`.

## Bevakning inför imorgon
* **Två planer kan trigga på en rekyl:** NUE ≤ 262,00 och AXGN ≤ 46,00. Triggar en plan prövas samtliga filter om innan registrering. Triggar båda samma dag går aktievikten till 50 %, vilket ryms (fyra lediga platser).
* **Rapporter (`state/earnings_calendar.json`, täcker bara prisbevakade symboler – övriga OKONTROLLERAD, L-5):** `AMZN`, `INTC`, `COIN`, `HII`, `ILMN`, `MSTR`, `RDDT`, `SPXC` 29/10; `CVX`, `XOM`, `CBOE` 30/10; `AAPL`, `PLTR` 2/11; `AMD`, `ANET`, `SMCI` 3/11. Köp före rapport är spärrat (punkt 2e).
* **Åtgärdspunkt till Dren (L-3), ANDRA RAPPORTEN:** `state/alerts.json` `checkedAt` är 2026-10-28T23:53Z, och ingen monitorkörning har landat i dag fram till 13:20 UTC. Den 28/10 landade bara tre monitorcommits (13:50, 19:20 och 23:53 UTC) mot 14 schemalagda. Cronen i `monitor.yml` är fortfarande `0 7-20 * * 1-5`, alltså på minut 0, där GitHub oftast tappar körningar (`scheduled-actions-not-firing`). Omfång: intradagsskyddet för alla bevakade nivåer, i dag NUE- och AXGN-planerna. Åtgärd: flytta cronen från minut 0, som redan gjorts i `prices.yml`.
* **Uppföljning av gårdagens åtgärdspunkt om historiken för nya scoutsymboler:** i dag hade alla fyra nya US-kandidater och båda vilande 250 punkter vid avgörandet. Defekten slog alltså inte till i dag, men orsaken (backfillen körs bara i dygnssteget) är oförändrad. Den är inte åtgärdad, bara inte utlöst.
* **Åtgärdspunkt till Dren (L-3), ÅTERKOMMANDE:** i `state/news_feed.json` (`generatedAt` 2026-10-29T11:34Z) står `feeds.globenewswire` och `feeds.globenewswire-earnings` fortfarande på "HTTP 403 – båda försöken". Omfång: 2 av 6 flöden. Övriga fyra levererar, och fönstret täcker 10 av 10 handelsdagar.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
