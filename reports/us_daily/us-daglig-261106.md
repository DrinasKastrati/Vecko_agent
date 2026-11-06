# Daglig bevakning – US-rotation
**Datum:** 2026-11-06 | **Läge:** Daglig bevakning (USD)
**Marknadsläget i korthet:** Torsdagen 5/11 föll S&P 500 **−4,36 % till 7 353,73** (intervall 7 350,35–7 681,29), och Nasdaq Composite föll **−5,52 % till 24 315,00**, vilket betyder korrektion (`state/prices.json`, marketTime 2026-11-05T21:34Z resp. 22:15Z, `generatedAt` 2026-11-06T12:54Z, `schemaVersion` 2026-08-02-prevclose). Det var den värsta dagen sedan april 2025. Försäljningen leddes av AI- och chipaktier efter oro för att utbyggnaden av datacenter bromsar efter mellanårsvalet. NVDA föll −9,3 %, och alla elva S&P-sektorer föll, IT mest med −7,30 % (CNBC 2026-11-05, Yahoo Finance 2026-11-05, Spectrum News 2026-11-05). Uppgången efter valet på onsdagen är därmed helt borta. **Regimfiltret är fortfarande PÅ, men marginalen är tunn:** ^GSPC ligger **+0,42 %** över MA200 7 322,71 (`state/price_history.json`, 250 punkter). Indexet ligger under EMA20 7 645,89 och EMA50 7 661,02, RSI är 33,5 och MACD-histogrammet fortsätter nedåt (−11,94 → −27,69). USD/SEK står på 9,8736 (2026-11-06T12:54Z).
**Pre-/after-hours:** `state/prices.json` har inga utökade kurser för SPY, CBOE eller NUE, och websök gav ingen daterad förbörsnivå för dem 2026-11-06. Därför är förbörsläget **EJ VERIFIERAT**. Det avgör inget beslut i dag: NUE:s stop bröts redan i den reguljära sessionen, och CBOE:s stop ligger 10,50 % under stängningen. Kandidaternas förbörskurser i `state/prices.json` är **`U` 51,00 (förbörs 2026-11-06 12:54 UTC)**, +4,51 % mot stängningen 48,80, och **`NET` 294,50 (förbörs 2026-11-06 12:53 UTC)**, +20,44 % mot stängningen 244,51.
**Portföljvikt & kassa:** 87,5 % indexsleeve (SPY) / 12,5 % CBOE (ben 1), 0 % kassa. En av fyra aktieplatser är upptagen. Två planer är öppna: CBOE ben 2 ≤ 325,00 (12,5 %, sista session i dag) och U ≤ 49,00 (25 %, ny).

---

## Innehav 1: Indexsleeve (SPY) (SPY / NYSE Arca)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| $733,00 – prices.json/Yahoo chart API, 2026-11-05 21:00 UTC, reguljär stängning | −5,21 % | – | – | **BEHÅLL** |

**Pre-/after-hours:** – (ingen utökad kurs i filen, och sleeven har inga nivåer)
**Nyheter senaste 24h:** 2026-11-05: S&P 500 −4,36 %, sämsta dagen sedan april 2025, i en AI- och chiputförsäljning (CNBC, Yahoo Finance 2026-11-05). SPY:s dagsintervall var 732,71–765,97 och dagsrörelsen −4,41 % mot `previousClose` 766,81. Volymen var 2,98× 20-dagarssnittet.
**Motivering:** Sleeven har varken stop eller mål och säljs aldrig på nedgång. Den **ökas 62,5 % → 87,5 %** med kapitalet från NUE, som såldes på stop. Att ett aktiesälj kräver det är det enda tillåtna skälet att röra sleeven i LÄGE B. Tekniskt har läget försvagats kraftigt: SPY ligger under EMA20 762,20 och EMA50 763,76 med RSI 33,5, och bara 0,39 % över MA200 730,15.

---

## Innehav 2: Cboe Global Markets (CBOE / Cboe BZX)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| $353,07 – prices.json/Yahoo chart API, 2026-11-05 21:00 UTC, reguljär stängning | +5,23 % | $316,00 (avstånd −10,50 %) | $382,50 (avstånd +8,34 %) | **BEHÅLL** |

**Pre-/after-hours:** EJ VERIFIERAT (ingen utökad kurs i `state/prices.json`, ingen daterad förbörsnivå via websök).
**Nyheter senaste 24h:** 2026-11-05: CBOE steg **+2,28 % till 353,07** (intervall 345,18–355,98, volym 1,27×) samtidigt som S&P 500 föll −4,36 % (`state/prices.json`). `state/news_feed.json` har inga CBOE-poster. Börsoperatörer brukar gynnas av volatilitet och hög handelsvolym (VIX/optioner), men orsaken till just den här rörelsen har jag inte verifierat i någon daterad källa.
**Motivering:** Tesen är intakt: Q3 30/10 med justerat EPS 3,63 (+36 %) och sänkt opex-guide (SEC 8-K ex. 99.1). Läget har **stärkts** sedan i går. Aktien steg mot en fallande marknad, RSI är 68,0, kursen ligger klart över EMA20 323,80 och EMA50 306,24, och MACD-histogrammet steg (2,15 → 2,33). +5 %-nivån 352,31 har nåtts. **Stoppen ligger ändå kvar på 316,00 en session till.** Om den lyfts till entry 335,53 nu hamnar den ovanför ben 2:s villkor 325,00, och en aktiv plan blir då ofyllbar. Ben 2 löper ut efter dagens session, och stoppen lyfts i nästa körning om tesen håller. Ingen CBOE-rapport ligger inom 2 handelsdagar (`state/earnings_calendar.json`).

---

## Innehav 3: Nucor (NUE / NYSE)

| Aktuell kurs (källa, tidsstämpel) | Sedan entry | Stop-loss | Målkurs | DAGENS BESLUT |
|---|---|---|---|---|
| $245,68 – prices.json/Yahoo chart API, 2026-11-05 21:00 UTC, reguljär stängning | −6,23 % (exit 247,00: −5,73 %) | $247,00 (**BRUTEN**, dagslägsta 245,14) | $299,00 | **SÄLJ** |

**Pre-/after-hours:** EJ VERIFIERAT. Det spelar ingen roll för beslutet, eftersom stoppen bröts i den reguljära sessionen.
**Nyheter senaste 24h:** 2026-11-05: NUE föll **−8,30 %** från 267,91 till 245,68 (intervall 245,14–271,24) på 2,35× volym (`state/prices.json`). `state/alerts.json` har en aktiv **SÄLJ-signal** ("stop-loss träffad", nivå 247, `hitPrice` 245,68, `checkedAt` 2026-11-05T21:46Z). Stålsektorn föll brett samma dag. AskTraders och Traders Union anger NUE omkring −5,6 % och Steel Dynamics −5,58 % intradag, men datumen i deras artiklar är otydliga. Ingen bolagsspecifik nyhet är verifierad, så drivkraften utöver marknadsfallet är **EJ VERIFIERAD**.
**Motivering:** Stop-loss 247,00 är bruten i den reguljära sessionen, med en stängning under nivån. Det är en mekanisk SÄLJ enligt punkt 4. Sessionen öppnade över nivån (föregående stängning 267,91, dagshögsta 271,24), så exit bokförs till stoppnivån 247,00 enligt bokens konvention (NVDA/MU/ACN/MRVL). Utfallet är **−5,73 %** på 25 % vikt efter en handelsdags innehav. ^GSPC föll −4,36 % över samma period, så alpha blev −1,37 pp och realiserad R/R −1,00. Kapitalet går till SPY-sleeven.

---

## Pending-planer
- **CBOE ben 2: villkor ≤ 325,00 USD (reguljär session) – EJ TRIGGAD** (dagslägsta 345,18, stängning 353,07; prices.json/Yahoo chart API, 2026-11-05 21:00 UTC). Kursen ligger 6,21 % över villkoret, så ingen åtgärd. Dagens session (2026-11-06) är planens sista, och planen avförs i nästa körning om den inte triggar.
- **AXGN: villkor ≤ 46,00 USD (reguljär session) – EJ TRIGGAD → AVFÖRD.** Sista sessionen 2026-11-05 hade dagslägsta 47,575 och stängning 48,75 (prices.json/Yahoo chart API, 2026-11-05 21:00 UTC), 3,42 % över villkoret. Planen har nu löpt sina 5 handelsdagar och är struken med "AVFÖRD 2026-11-06" i `state/portfolj_us.md`, inte raderad. Kapitalet stannar i sleeven.
- **U (ny i dag): villkor ≤ 49,00 USD (reguljär session) – LAGD**, se scout-kandidater nedan. Senaste stängning 48,80 och förbörs 51,00 (2026-11-06 12:54 UTC). Villkoret prövas från och med dagens reguljära session.
- Övriga rader i `state/portfolj_us.md`:s Pending-sektioner är redan överstrukna (TRIGGADE eller AVFÖRDA). NUE-planen triggades 2026-11-04.

**Intradag-signaler (2c/2c2):** `state/alerts.json` har `checkedAt` **2026-11-05T21:46:31Z**, alltså ~15,5 timmar gammalt vid körningen (13:15 UTC). Senaste monitorkörningen var efter stängningen 5/11, och ingen har syns under dagens timmar före den amerikanska öppningen. Per punkt 2c2 räknas intradagsskyddet som **FRÅNVARANDE** den här körningen, och jag har prövat alla nivåer manuellt mot verifierad kurs ovan. Aktiva signaler: **NUE SÄLJ (stop-loss träffad)**, som hanteras ovan med SÄLJ, och KOG.OL, som hör till nordiska boken.

**Scout-kandidater (punkt 2d) – två nya och två L-4-omprövningar.** Spärrarna (a)–(e) håller för alla fyra. Katalysatorerna är bekräftade, kurserna verifierade och ligger efter katalysatorn, regimen är PÅ (+0,42 %), ingen kandidat har en rapport inom 2 handelsdagar i `state/earnings_calendar.json`, och boken har tre lediga platser.
- **`261106-U` (Unity Software) – PROMOTAD som villkorad plan.** Q3 2026 släpptes 2026-11-05 före öppning. Intäkten var 622 MUSD (+32 %), den strategiska intäkten 597 MUSD (+59 %), Vector växte +126 % och bolaget redovisade sin första GAAP-vinst (122 MUSD). FCF var 220 MUSD, och Q4-guiden för strategisk intäkt är 683–691 MUSD (+65–67 %) (Unity 8-K ex. 99.1, SEC, 2026-11-05). Reaktionen blev **+14,93 %** till 48,80 på 5,11× volym, på en dag då S&P 500 föll −4,36 %. Alla fem grindarna håller:
  - **Teknik:** RSI 68,2, EMA20 41,78 > EMA50 41,36 > EMA200 36,57, kurs 54 % över MA200 31,66, MACD-histogram 0,00 → 0,57 (färskt positivt).
  - **Momentum och likviditet:** +13,5 % på 3 månader och +82,6 % på 6 månader, likviditet 478 MUSD/dag.
  - **Kostnadströskel och nåbarhet:** målet ligger +15,31 % bort (≥ 8 %), och nåbarhetstaket är 2 × 2,46 % × √25 = 24,6 % ≥ 15,31 %.
  - **R/R:** 1:2,68.
  
  Poäng: katalysator 8, teknik 7, makro 4, R/R 6, totalt **6,7**. Aktien gapade > 3 % och senaste kursen är en förbörskurs, så **hela positionen läggs som limit ≤ 49,00 mot reguljär session** (punkt 4a och 2d). Stop 46,20 (−5,71 %, över reaktionsdagens lägsta 44,82), mål 56,50, vikt 25 %, horisont 25 handelsdagar. Planen gäller t.o.m. 2026-11-13. **Invändningar:** RSI nära 70 och kurs på ny 250-dagarshögsta (49,47), en marknad i AI- och teknikutförsäljning, och en regim som bara ligger +0,42 % över MA200. Faller ^GSPC under MA200 innan planen triggar gäller regimspärren, och planen avförs.
- **`261106-NET` (Cloudflare) – AVVISAD, grind 2 (teknik).** Q3 2026 (5/11 efter stängning): intäkt 782,5 MUSD (+39 %), Q4-guide cirka 845,5 MUSD (scout-rapport-261106). Förbörskursen 294,50 ligger **under EMA20 299,99 och EMA50 308,23**. MACD-histogrammet faller (−6,17 → −7,40) och RSI var 29,4 vid stängningen 5/11. Scouten noterar dessutom att bruttomarginalen sjönk från 74,0 % till 71,2 %. Även om filtret hade hållit gäller promotionstaket: R/R är lägre än U:s.
- **`261105-APP` (AppLovin) – L-4-omprövning, nu SLUTLIGT AVVISAD (grind 2).** Serien har backfillats till 250 punkter, så avvisningen från 2026-11-05 (omätbar grind 2) omprövas. Stängningen 356,10 ligger **under MA200 409,96**, och det blockerar nya aktiepositioner (`prompts/gemensam_korning.md`). EMA-ordningen är bearish (EMA20 272,21 < EMA50 295,61 < EMA200 405,34). Den här avvisningen bygger på teknisk bedömning och är inte längre vilande.
- **`261105-COHR` (Coherent) – L-4-omprövning, nu SLUTLIGT AVVISAD (grind 2).** Serien har backfillats till 250 punkter. Stängningen 169,76 (−12,98 % 5/11) ligger **under MA200 296,47**, under EMA20 230,65 och EMA50 262,95, MACD-histogrammet faller och RSI är 28,4.

Avgörandena är loggade i `state/scout_candidates.json` (`decidedBy` = denna rapport, `decidedAt` 2026-11-06) och som `AVVAKTA`-rader i `state/decisions.json`. Promotionen av U loggas som AVVAKTA med vikt 0 tills planen fylls, samma konvention som NUE och AXGN.

**Villkorad bubblar-plan (LÄGE B):** ej tillämplig. Ingen av bubblarna i `us-veckorapport-261102` (CVX, DVN, S, RHI) föll på saknad verifierad kurs.

## Åtgärder i portfolj_us.md
- **SÄLJ NUE @ 247,00** (stop-loss bruten 2026-11-05) → flyttad till Historik: −5,73 %, vikt 25,0 %, skäl STOPP. Raden i Aktuellt innehav är borttagen.
- **Indexsleeven (SPY) ökad 62,5 % → 87,5 %.** CBOE ligger kvar på 12,5 % med stop 316,00 och mål 382,50.
- **Ackumulerad avkastning sedan start räknad om till −6,49 %**, eftersom sex stängda affärer kedjas multiplikativt: 0,94870 × (1 + 0,25 × −0,0573) = 0,93512.
- **AXGN-planen avförd** (överstruken, inte raderad). CBOE ben 2 har fått statusraden "EJ TRIGGAD per 2026-11-06".
- **Ny villkorad plan U ≤ 49,00** (stop 46,20, mål 56,50, R/R 1:2,68, 25 %). Den ligger i den **första** `### Pending`-tabellen, så att `alerts.mjs` bevakar den. Det är bekräftat med `collectTargets`, där pending = CBOE 325 och U 49.
- `state/decisions.json`: 8 nya rader (`book: "us"`, `mode: "B"`): BEHÅLL SPY (vikt 0,875), SÄLJ NUE, BEHÅLL CBOE samt AVVAKTA för AXGN (avförd plan), U (promotad plan), NET, APP och COHR. Raderna är validerade med `--base`, liksom `validate-scout-candidates.mjs` och `validate-state.mjs`.

## Bevakning inför imorgon
* **Regimen:** ^GSPC ligger bara **+0,42 %** över MA200 (7 322,71). En stängning under nivån slår av regimen, och då öppnas inga nya positioner och U-planen avförs. Befintliga innehav sköts av sina stop och mål.
* **CBOE:** ben 2 ≤ 325,00 har sin sista session i dag. I nästa körning lyfts stoppen till minst entry 335,53 (eller till viktat entry om ben 2 fylls), eftersom +5 % är nått och tesen håller.
* **U-planen ≤ 49,00** gäller t.o.m. 2026-11-13. Fylls den tas 25 pp ur sleeven.
* **Rapporter (`state/earnings_calendar.json`, `generatedAt` 2026-11-06T01:31Z):** 6/11 `VST`; 9/11 `CEG`, `KKR`, `ACHR` och `MARA`; 12/11 `AMAT`. Kalendern täcker bara symboler som prisbevakas, så resten av US-marknaden är **OKONTROLLERAD** (L-5). Det finns ingen rapport för `CBOE` eller `U` inom fönstret. Köp före rapport är spärrat (punkt 2e).
* **Åtgärdspunkt till Dren (L-3), ÅTERKOMMANDE:** `.github/scripts/alerts.mjs:45` (`collectTargets`) läser fortfarande bara den **första** `### Pending`-tabellen. Punkten togs upp i us-daglig-261105 och är oåtgärdad. **Omfång i dag:** inga öppna planer ligger utanför den första tabellen, eftersom U-planen lades där med flit och AXGN är avförd. Felet finns dock kvar för varje framtida plan i en ny sektion, och samma parsning gäller `state/portfolj.md`. **Åtgärd:** samla alla `### Pending`-tabeller och hoppa över överstrukna rader, och lägg till ett test i `tests/run.mjs`.
* **Åtgärdspunkt till Dren (L-3), ÅTERKOMMANDE:** `checkedAt` i `state/alerts.json` är 2026-11-05T21:46Z vid körningen 13:15 UTC, och ingen monitorkörning syns under dagens timmar. Samma defekt beskrevs i us-daglig-261030, us-veckorapport-261102 och us-daglig-261103–261105. **Omfång:** intradagsskyddet för CBOE (stop 316,00, mål 382,50) och två villkorade planer. **Åtgärd:** kontrollera att `monitor.yml` kör, och flytta dess cron från minut 0 (`scheduled-actions-not-firing`).
* **Åtgärdspunkt till Dren (L-3), ÅTERKOMMANDE:** i `state/news_feed.json` (`generatedAt` 2026-11-06T12:59Z) står `feeds.globenewswire` och `feeds.globenewswire-earnings` fortfarande på "HTTP 403 – båda försöken". **Omfång:** 2 av 6 flöden. Fönstret täcker ändå 10 av 10 handelsdagar. **Ersättningskälla:** websök och SEC 8-K.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
