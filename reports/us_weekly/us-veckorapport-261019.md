# Veckorapport: US-rotation
**Vecka:** v 43 | **Datum:** 2026-10-19
**Marknadsklimat:** Förra veckan var den sämsta för S&P 500 och Nasdaq sedan juni. Fredagen drogs av en ny våg av halvledarförsäljning på tvivel om AI-utbyggnadens längd: `^GSPC` stängde på **7 659,44 (−1,09 %)** och `^IXIC` på **26 140,03 (−2,14 %)** (prices.json/Yahoo chart API, marketTime 2026-10-16T20:42:08Z resp. 21:15:59Z; Lanacion/AP 2026-10-16). `MU` föll 5,6 % och `INTC` 5,8 % samma dag (AP 2026-10-16). Brent noterades kring 110 USD och 10-årsräntan över 5 %, vilket pressade dyr tillväxt. Fed-chefen Kevin Warsh gav ingen signal om en höjning i oktober (Thrive in Markets kvällsrapport 2026-10-16). Bredden var bättre än indexen: energi, detaljhandel och hälsovård steg medan teknik föll. DXY och VIX finns inte i `state/prices.json` och anges därför inte med siffra. **Regimfiltret är PÅ:** ^GSPC 7 659,44 ligger **+5,34 %** över MA200 7 271,41 (200 daterade stängningar ur `state/price_history.json`, serien bär 250 punkter). Marginalen har krympt från +7,61 % för en vecka sedan.

---

## 0. Facit: Förra veckans val
| Aktie | Entry | Exit | Utfall | Stop/Mål träffad? |
|---|---|---|---|---|
| MRVL | $275,00 | $260,00 | −5,45 % | Stop @ $260,00 (intradag 2026-10-13, dagslägsta 248,45; såld 2026-10-14) |
| SPY (sleeve) | $773,26 | – (behålls) | −1,29 % mot entry (763,25, 2026-10-16T20:00:00Z) | Ingen stop/mål – sleeven |

**Veckans portföljutfall (viktat):** cirka **−2,4 %** från stängningen 2026-10-12 till stängningen 2026-10-16. SPY-delen (75 %) gick 778,10 → 763,25 (−1,91 %). MRVL-platsen (25 %) gick först 265,86 → 260,00 (−2,20 %) och låg sedan i sleeven från 778,01 till 763,25 (−1,90 %), sammanlagt −4,06 %.
**Ackumulerad avkastning sedan strategistart:** **−5,13 %** (fem stängda affärer i skarp drift: NVDA, MU, XOM, ACN, MRVL – omräknad i säljkörningen 2026-10-14). Exklusive USD/SEK-effekten (USDSEK=X 9,8928, 2026-10-19T12:57:19Z).
**Portföljallokering denna vecka:** **100 % SPY-sleeve.** Alla fyra aktieplatser står tomma. Ingen viktavvikelse att motivera.
**Lärdom:** Tre av de fem senaste US-affärerna (ACN, MRVL, MU) stoppades inom 1–4 handelsdagar, och alla tre köptes i en sektor som just haft ett kraftigt lyft. Veckans halvledarras bekräftar att grind 2:s volym- och trendkrav ska hållas strikt i stället för att sänkas för att fylla platser. Två kandidater (BLK, UNH) har nu klarat trenddelen två veckor i rad men fallit på nåbarheten (grind 5). Det tyder på att lugna storbolag systematiskt inte når earnings-golvet på 14 % – en strukturell iakttagelse, inte ett skäl att sänka golvet (se `target-anchor-vs-cost-threshold-conflict` i `state/action_items.json`). Tillämpade lärdomar: **L-2** (`FITB`, `JEF`, `RIG`, `S`, `FIVE` lagda i `config/watchlist_us.txt`), **L-3** (åtgärdspunkter nedan), **L-4** (`261017-CRGY` avgjord på omdömesskäl, ingen vilande dataspärr), **L-5** (radarns källa och täckning), **L-6** (inga klasser strukna med hänvisning till fokusfilen), **L-7** (rörelsegenomgång ur price_history) och **L-8** (indexöversyner, se radarn).

---

## Case: INGA VALDA DENNA VECKA

Ingen av de 21 bruttokandidaterna passerade alla fem grindar. De fyra tomma platserna stannar därför i SPY-sleeven. Enligt punkt 0 och 0c i "NIVÅER & OMSÄTTNING" är det ett giltigt utfall: US-boken ska vara mer selektiv än den nordiska, och sleeven slår ett halvbra case.

**Bred scanning – varifrån bruttolistan kom (21 kandidater, samtliga loggade i `state/decisions.json`):**
* **Ur nyhetsflödet (g0): 5.** `FITB` (8-K 2026-10-19, Q3: justerad EPS 1,13 mot konsensus 1,08 enligt SEC-dokumentet `q32026earningsrelease.htm`), `JEF` (8-K 2026-10-19), `RIG` (8-K 2026-10-14, -15 och -19), `S` (8-K 2026-10-16) och `FIVE` (8-K 2026-10-14). `state/news_feed.json` (`generatedAt` 2026-10-19T10:50:50Z) täcker **10 av 10 handelsdagar** (`tradingDaysCovered` 10, `missingDays` tomt, äldsta 2026-10-05). **Två av sex flöden, `globenewswire` och `globenewswire-earnings`, svarar fortfarande HTTP 403** (se åtgärdspunkt 1), så den delen av pressmeddelandeflödet är **OKONTROLLERAD**. 8-K-rubrikerna bär inget innehåll, och innehållet är bara belagt för `FITB`.
* **Ur scout (g): 5.** `UNH` och `BLK` (rapport-261015), `TSM` och `USB` (rapport-261016) samt `CRGY` (rapport-261017).
* **Förra veckans bubblare (h): 4.** `TEVA`, `CVX`, `XOM` och `ZS`.
* **Rörelsegenomgången (L-7): 3.** `CBRL`, `ACN` och `PAYC`.
* **Egen scanning/websök: 4.** `AAPL` (volym 1,58×), `WFC` (volym 2,00× efter Q3), samt veckans rapporter `NFLX` och `ABT`.

**Funneln:** grind 1 (verifierad kurs) fäller 5 (`FITB`, `JEF`, `RIG`, `S`, `FIVE`). De loggas med `price: null` och läggs till i watchlisten. Rapportförbudet (punkt 2e) fäller 2 (`NFLX` rapporterar 20/10 och `ABT` 21/10, binär händelse inom 2 handelsdagar; båda ligger dessutom under EMA200). Grind 2 (teknik) fäller 10: på **volymkvot < 1,5×** `UNH` 1,36×, `XOM` 1,02×, `PAYC` 0,97×, `ACN` 0,94×, `TEVA` 0,93× och `CVX` 0,93×; på **trend/momentum** `USB` (under EMA50 59,63), `WFC` (under EMA50 och EMA200), `TSM` (under EMA20/50, fallande histogram) och `ZS` (histogrammet vände negativt, under EMA20). Grind 3 (katalysator) fäller 3: `CRGY` (förvärvet 2026-10-08 ligger 7 handelsdagar bak), `CBRL` (ingen daterad katalysator hittad, RSI 79,8) och `AAPL` (ingen daterad katalysator, rapport 2/11). Grind 5 (nåbarhet) fäller `BLK`, den enda kandidaten som klarar grind 2 fullt ut. Volymkvoten är räknad ur `state/volume_history.json` som senaste punkten (2026-10-16) delad med snittet av de 20 föregående. Nåbarhetstaket är räknat som 2 × genomsnittlig absolut daglig förändring (20 dagar, ur `state/price_history.json`) × √horisont.

### De fyra som kom längst – och exakt varför de föll
1. **`BLK` – 1 134,38 USD** (marketTime 2026-10-16T20:00:02Z). Q3-rapporten 2026-10-14 (scout-261015, `earnings`). Kursen ligger över EMA20 1 084,98, EMA50 1 086,68, EMA200 1 077,92 och MA200 1 061,17. RSI 63,6, MACD-histogrammet stiger (2,70 → 5,57 → 8,01) och volymkvoten är 1,96×. Omsättningen är 662 MUSD/dag. **Fällt av grind 5 (nåbarhet):** 2 × 1,17 % × √25 = **11,7 %**, under earnings-golvet 14 %. **Andra spärr, grind 4:** ett mål på +14 % (1 293) ligger över 250-dagarshögsta 1 182,84 och saknar motstånd att ankras i.
2. **`UNH` – 401,43 USD** (2026-10-16T20:00:02Z). Q3 2026-10-13 (scout-261015). Över EMA20/50/200 och MA200 359,10, RSI 63,0, stigande histogram (2,71 → 4,31). **Fällt av grind 2 (volym):** 1,36×. **Andra spärr, grind 5:** 2 × 1,20 % × √25 = 12,0 % < 14 %.
3. **`CRGY` – 13,77 USD** (2026-10-16T20:00:02Z; förbörs 13,62, 2026-10-19T12:37Z). Scoutkandidat `261017-CRGY`. Fredagens +10,07 % på 2,18× volym tog kursen över EMA20 13,22, EMA50 13,05 och MA200 11,74. **Fällt av grind 3:** förvärvet av Devons Eagle Ford-tillgångar offentliggjordes 2026-10-08 (World Oil; Oil & Gas Journal) och ligger 7 handelsdagar bak, utanför femdagarsfönstret. Fredagens rörelse saknar en egen daterad orsak. **Andra spärr, grind 2:** MACD-histogrammet är fortfarande negativt (−0,093 → −0,016).
4. **`CVX` – 224,99 USD** (2026-10-16T20:03:43Z). Full EMA-stack, RSI 70,8 och stigande histogram (1,32 → 1,62). Brent kring 110 USD ger makromedvind. **Fällt av grind 2 (volym):** 0,93×. **Andra spärr, grind 4:** kursen står på 250-dagarshögsta. Rapport 30/10.

**Scout-kandidater i `state/scout_candidates.json`:** `261017-CRGY` → **rejected** (grind 3 + grind 2). Inga poster med `book: "us"` står kvar som `new`.

---

## Bubblare (watchlist inför nästa vecka)
1. **BLK** – 1 134,38 USD (2026-10-16T20:00:02Z). Den enda kandidaten med full teknisk bekräftelse (1,96× volym, stigande histogram). Den faller bara på att en lugn megacap inte når 14 % inom horisonten. Prövbar om dagsrörelsen stiger eller en ny katalysator ger en annan katalysatortyp.
2. **CVX** – 224,99 USD (2026-10-16T20:03:43Z). Energimedvind med Brent kring 110. Faller enbart på volymen; målet måste också lösas mot 250-dagarshögsta. Rapporten 30/10 gör att fönstret för ett köp stänger 28/10.
3. **UNH** – 401,43 USD (2026-10-16T20:00:02Z). Uppåttrend efter Q3 med 7,7 % kvar till 250-dagarshögsta 436,35, vilket ger ett motstånd att ankra ett mål i. Saknar flödesbekräftelse (1,36×).
4. **CRGY** – 13,77 USD (2026-10-16T20:00:02Z). Utbrott på 2,18× volym. Behöver en ny daterad katalysator och ett positivt MACD-histogram. Rapport 2/11.

Samtliga fyra finns i `config/watchlist_us.txt` och har kurs i `state/prices.json` (L-2).

**Förra veckans bubblare:** **TEVA** – STRUKEN (grind 2: volym 0,93×; grind 3: FDA-beskedet 9/10 är 6 handelsdagar gammalt; grind 4: kurs = 250-dagarshögsta 41,50). **CVX** – RANKAD UNDER, bubblare 2 (grind 2: volym 0,93×). **XOM** – STRUKEN (grind 2: volym 1,02×, fjärde veckan i rad under 1,5×; RSI 73,0 och kurs = 250-dagarshögsta). **ZS** – STRUKEN (grind 2: histogrammet vände negativt 0,76 → −0,57 och kursen föll under EMA20).
**Scout-inflöde:** (de 5 senaste: rapport-261015, -261016, -261017, -261018 och -261019; de två sista hade inga nya case). **BLK** (261015) – RANKAD UNDER, bubblare 1 (grind 5). **UNH** (261015) – RANKAD UNDER, bubblare 3 (grind 2: volym). **TSM** (261016) – STRUKEN (grind 2: under EMA20/50, fallande histogram, RSI 34,2). **USB** (261016) – STRUKEN (grind 2: under EMA50; grind 5 kvarstår: 10,1 % < 14 %). **CRGY** (261017) – RANKAD UNDER, bubblare 4, kandidat **rejected**.
**Villkorade bubblar-planer:** **Inga.** Ingen bubblare klarar samtliga grindar, och en pending-rad på ett case som underkänts på en grind vore att kringgå grinden.

**Rörelsegenomgång (L-7):** rangordnad ur `state/price_history.json` över **98 amerikanska symboler** (exklusive sleeven SPY) med daterad stängning både 2026-10-09 (bas) och 2026-10-16 (mätdag). Topp: `CBRL` +20,03 %, `ACN` +9,86 %, `CRGY` +8,77 %, `PAYC` +8,36 %, `NKE` +6,97 %, `WMT` +6,70 %, `COO` +6,57 %, `ROST` +6,51 %, `HD` +6,50 %, `KHC` +6,33 %. Botten: `CIEN` −26,02 %, `HPE` −24,95 %, `SMCI` −24,43 %, `APLD` −23,78 %, `IREN` −23,30 %, `MARA` −21,97 % och `BE` −21,10 %. Topp-4 finns i bruttolistan. `NKE`, `WMT`, `COO`, `ROST`, `HD` och `KHC` togs inte in: ingen daterad katalysator inom fem handelsdagar hittades, och ingen har volymkvot ≥ 1,5× (0,67–1,24×). `state/movers.json` har `asOf` **2026-10-16** men täcker bara nordiska symboler, så den bär inget urvalspåstående här. Resten av den amerikanska marknaden är **OKONTROLLERAD**.

## Veckans radar (kommande 5 handelsdagar)
* **Måndag 19/10** – `AGNC` Q3 och `FITB` Q3 (före öppning, justerad EPS 1,13 mot 1,08 enligt SEC 8-K). Inga innehav berörs.
* **Tisdag 20/10** – `NFLX` Q3 (`state/earnings_calendar.json`, `isEstimate: false`).
* **Onsdag 21/10** – `ABT`, `META` och `TSLA` Q3 (`earnings_calendar.json`). Metas och Teslas capex-besked är den första prövningen av om AI-oron fortsätter (scout-261018).
* **Torsdag 22/10** – `BE` Q3 (`earnings_calendar.json`).
* **Nästa vecka (utanför fönstret)** – `MSFT` och `GOOGL` 28/10, `AMZN` och `INTC` 29/10, `CVX` och `XOM` 30/10.
* **Makro:** inga makrodatum är belagda ur repot. `state/` har ingen makrokalender (`macro-calendar-not-verifiable-from-state`), så veckans makrodata är **OKONTROLLERADE**. Oljan (Brent kring 110) och 10-årsräntan över 5 % är de drivkrafter som syntes förra veckan.
* **Källa och täckning (L-5):** rapportdatumen kommer ur `state/earnings_calendar.json`, som bara ser symboler som `prices.yml` redan hämtar. Resten av US-universumet är **OKONTROLLERAT**. Rapportförbudet (punkt 2e) gäller samtliga namn ovan. **Indexöversyner (L-8):** ingen fil i repot räknar upp S&P-förändringar, och ingen bekräftad S&P 500-förändring med ikraftträdande inom fönstret hittades i `state/news_feed.json` (titlar 2026-10-12–19). Den otäckta delen är **OKONTROLLERAD**.
* **Sektorer:** **medvind** – energi (Brent kring 110) samt defensiv detaljhandel och hälsovård, som steg medan teknik föll (`WMT`, `HD`, `COST`, `UNH`). **Motvind** – halvledare, optik och AI-infrastruktur (`CIEN`, `HPE`, `SMCI`, `AMAT` −19 till −26 % på veckan), räntekänslig tillväxt med 10-årsräntan över 5 %, samt kryptominers.

## Åtgärdspunkter till Dren (L-3)
1. **`news-feed-globenewswire-http-403` – ÅTERKOMMANDE.** Fält: `state/news_feed.json` `feeds.globenewswire` = "HTTP 403 – båda försöken (0.0 s)" och `feeds.globenewswire-earnings` = "HTTP 403 – båda försöken (0.1 s)" (`generatedAt` 2026-10-19T10:50:50Z). **Omfång:** 2 av 6 flöden, inklusive den enda källan som är dedikerad åt rapportöverraskningar. Beskrivet i us-veckorapport-261013 och i flera scoutrapporter. **Ersättningskälla:** websök och SEC 8-K.
2. **`alerts-checkedat-heartbeat-lag` / `scheduled-actions-not-firing` – ÅTERKOMMANDE.** Fält: `state/alerts.json` `checkedAt` = 2026-10-16T20:33:33Z vid körningen 2026-10-19 ~13:10 UTC. `monitor.yml` är schemalagd varje timme 07–20 UTC mån–fre, så **6 schemalagda körningar i dag (07–12 UTC) syns inte**. **Omfång:** intradagsskyddet för båda böckerna. US-boken har inga aktieinnehav och inga pending-planer, så ingen nivå är obevakad i dag. Sleeven saknar stop. Skyddet är behandlat som FRÅNVARANDE denna körning.
3. **Watchlist-taket.** `config/watchlist_us.txt` bär långt fler än 25 symboler. Ingen rensning är gjord i denna körning, eftersom punkt 6b och `prompts/gemensam_korning.md` (20 handelsdagars utvärderingsfönster) skyddar de flesta. Fem nya symboler är tillagda (`FITB`, `JEF`, `RIG`, `S`, `FIVE`). Spänningen är redan uppförd som `watchlist-cap-vs-measurability-conflict`.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
