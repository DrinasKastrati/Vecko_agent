# Veckorapport: US-rotation
**Vecka:** v 42 | **Datum:** 2026-10-13
**Marknadsklimat:** Måndagen var en Columbus Day-session med obligationsmarknaden stängd. `^GSPC` stängde nästan oförändrat på **7 807,24 (−0,06 %)** och `^IXIC` på 27 245,90 (−0,44 %) (prices.json/Yahoo chart API, marketTime 2026-10-12T20:35:01Z resp. 21:15:59Z). Halvledare och optik gav tillbaka (`CIEN` −9,95 %, `MU` −3,88 %, `MRVL` −3,42 %), med minnesaktierna pressade av CXMT:s nya minnesdesign och Samsungs fall (Yahoo Finance 2026-10-12). Storbankerna rapporterar i dag före öppning, med blandat utfall: JPMorgan missade vinstestimaten, Wells Fargo hade intäkter under väntan och Citigroup slog (CNBC och Quartz 2026-10-13). I förbörs står `GS` +3,74 % och `UNH` +3,83 %, medan `WFC` står −2,90 % och `JNJ` −2,01 % (prices.json `extendedPrice`, session `pre`, 12:38–12:40 UTC). Fed höjde till 3,75–4,00 % den 16/9, och KPI för september kommer i morgon. DXY, 10-årsräntan och VIX finns inte i `state/prices.json` och anges därför inte med siffra. **Regimfiltret är PÅ:** ^GSPC 7 807,24 ligger **+7,61 %** över MA200 7 255,09 (200 daterade stängningar ur `state/price_history.json`, serien bär 250 punkter).

> **Varför LÄGE A på en tisdag.** `reports/us_weekly/` slutar på `us-veckorapport-261007.md` (v41), och `state/decisions.json` har inga `book: "us"`-rader daterade 2026-10-12. Måndagens US-körning uteblev, precis som scoutens (`rapport-261012` saknas). Enligt `prompts/gemensam_korning.md` tas en saknad veckorotation igen vid nästa öppna handelsdags körning, med dagens datum och dagens data. Inga affärer bakdateras. Ingen `claude/**`-branch bär opublicerad US-rotation: remote har bara `main` och den här körningens tilldelade branch, och den är identisk med main.

---

## 0. Facit: Förra veckans val
| Aktie | Entry | Exit | Utfall | Stop/Mål träffad? |
|---|---|---|---|---|
| MRVL | $275,00 | – (behålls) | −3,32 % (265,86, 2026-10-12T20:00:01Z) | Nej – dagslägsta 260,80 12/10, stop 260,00 |
| SPY (sleeve) | $773,26 | – (behålls) | +0,63 % mot entry (778,10, 2026-10-12T20:00:00Z) | Ingen stop/mål – sleeven |

**MRVL – villkorad plan triggad, sedan försvagad.** Planen ≤ 275,00 ur v41 fylldes i sessionen 2026-10-08 (dagslägsta 265,79) och registrerades 2026-10-09. Sedan dess: 274,66 → 275,28 (9/10) → **265,86** (12/10, −3,42 %). Fallet i måndags var sektorbrett. TradingKey (2026-10-12) beskriver det som vinsthemtagning efter investerardagens rally, och Yahoo Finance (2026-10-12) lyfter koncentrationsrisken i 20-miljardersplanen. Ingen bolagsnyhet punkterar tesen. Avståndet från dagslägsta 260,80 till stoppen var 0,31 %.

**Veckans portföljutfall (viktat):** cirka **−1,1 %** från stängningen 2026-10-06 till stängningen 2026-10-12. Bidragen: SPY −0,13 % på 75 %, och på MRVL-platsen först SPY 779,09 → 773,93 (−0,66 %) och sedan MRVL 275,00 → 265,86 (−3,32 %), på 25 %.
**Ackumulerad avkastning sedan strategistart:** **−3,82 %**, oförändrad eftersom ingen affär stängts sedan 2026-10-07 (fyra stängda affärer i skarp drift: NVDA, MU, XOM, ACN). Exklusive USD/SEK-effekten (USDSEK=X 9,9784, 2026-10-13T12:40:08Z).
**Portföljallokering denna vecka:** **25 % MRVL + 75 % SPY-sleeve.** En av fyra aktieplatser är upptagen och tre står tomma. Ingen viktavvikelse att motivera: platt 25 % per aktie, resten i sleeven.
**Lärdom:** Ingen av de 19 kandidaterna med volymdata nådde 1,5×, och för 12 av dem var volymkvoten den främsta spärren. Dagen den mättes på var dessutom en helgdagssession med låg volym. Det sänker inte kravet: TEVA hade 2,74× på sin katalysatordag men bara 1,23× nästa session, och det är precis det grinden ska se. Vi köper inte in oss i en reaktion som flödet inte bär. Det är också andra veckan i rad som en utebliven måndagskörning (L-3) gör att kandidater som scouten flaggat ligger kvar `new` i ett dygn längre än tänkt. Tillämpade lärdomar: **L-2** (`APLD`, `CRGY`, `KHC` lagda i `config/watchlist_us.txt`), **L-3** (åtgärdspunkter nedan), **L-4** (`261009-DVN` omprövad när dataluckan fyllts), **L-5** (radarns källa och täckning), **L-6** (inga klasser strukna med hänvisning till fokusfilen), **L-7** (rörelsegenomgång ur price_history) och **L-8** (indexöversyner, se radarn).

---

## Case: INGA VALDA DENNA VECKA

Ingen av de 22 bruttokandidaterna passerade alla fem grindar, och de tre tomma platserna stannar därför i SPY-sleeven. Enligt punkt 0 och 0c i "NIVÅER & OMSÄTTNING" är det ett giltigt utfall: US-boken ska vara mer selektiv än den nordiska, och sleeven slår ett halvbra case.

**Bred scanning – varifrån bruttolistan kom (22 kandidater, samtliga loggade i `state/decisions.json`):**
* **Ur nyhetsflödet (g0): 5.** `JNJ` (8-K 2026-10-13, Q3), `APLD` (8-K 2026-10-07, rapport FQ1), `CRGY` (8-K 2026-10-09, köper Devons Eagle Ford för 4,2 mdr USD), `KHC` (8-K 2026-10-07, tre rapportsegment från Q3) och `CVX` (8-K 2026-10-06). `state/news_feed.json` (`generatedAt` 2026-10-13T12:45:25Z) täcker **10 av 10 handelsdagar** (`tradingDaysCovered` 10, `missingDays` tomt, äldsta 2026-09-30). **Två av sex flöden, `globenewswire` och `globenewswire-earnings`, svarar HTTP 403** (se åtgärdspunkt 1), så den delen av pressmeddelandeflödet är **OKONTROLLERAD**. 8-K-rubrikerna bär inget innehåll. Innehållet för `APLD` och `KHC` är belagt med websök (SEC-dokumentnamn och Kalkine 2026-10), och för `CRGY` med scoutrapport-261009.
* **Ur egen scanning/websök: 5.** Dagens bankrapporter: `JPM`, `WFC`, `C`, `GS` och `UNH` (CNBC och Quartz 2026-10-13; datum ur `state/earnings_calendar.json`, `isEstimate: false`).
* **Ur scout (g): 6.** `TEVA`, `ZS`, `DVN`, `VST`, `COST` och `ACN`.
* **Förra veckans bubblare (h): 4.** `XOM`, `BKH`, `AMD` och `ILMN`.
* **Rörelsegenomgången (L-7): 2.** `PLTR` och `CEG`.

**Funneln:** grind 1 (verifierad kurs) fäller 3 (`APLD`, `CRGY`, `KHC`), som loggas med `price: null` och läggs till i watchlisten. Grind 2 (teknik) fäller 18, varav **12 främst på volymkvoten < 1,5×**: `TEVA` 1,23×, `BKH` 1,12×, `PLTR` 1,02×, `VST` 0,93×, `ACN` 0,86×, `CVX` 0,84×, `ZS` 0,79×, `XOM` 0,67×, `CEG` 0,64×, `COST` 0,62×, `DVN` 0,44× och `ILMN` 0,36× (`COST` ligger dessutom under MA200). De övriga sex faller på trend eller momentum: `JPM`, `WFC`, `C`, `GS`, `UNH` och `AMD` ligger under EMA20/50. `JNJ` fäller rapportförbudet (punkt 2e: binär händelse i dag, och reaktionen syns bara i förbörs). Grind 3–5 nås inte av någon kandidat. Där de också skulle ha fallit nämns de som andra spärr. Volymkvoten är räknad ur `state/volume_history.json` som senaste punkten (2026-10-12) delad med snittet av de 20 föregående.

### De fyra som kom längst – och exakt varför de föll
1. **`TEVA` – 41,17 USD** (marketTime 2026-10-12T20:00:02Z; förbörs 41,00 2026-10-13T12:10Z). FDA godkände WELTRUZA 2026-10-09 (Teva/GlobeNewswire 2026-10-09; `regulatory`). Full EMA-stack, RSI 65,6, MACD-histogrammet har just korsat upp (−0,145 → −0,033 → +0,037), kursen ligger över MA200 33,96 och omsättningen är 240 MUSD/dag. **Fällt av grind 2 (volym):** kvoten var 2,74× på katalysatordagen men bara 1,23× den 12/10. **Andra spärr, grind 4:** kursen står på 250-dagarshögsta 41,17, så ett mål på +14 % (46,93) har inget motstånd att ankras i.
2. **`CVX` – 215,00 USD** (2026-10-12). Full EMA-stack, MACD-histogrammet har korsat upp (−0,127 → 0,158 → 0,512) och RSI är 63,7. **Fällt av grind 2 (volym):** 0,84×. Makrotesen försvagas dessutom när golfproduktionen startar om efter orkanen Isaias.
3. **`ZS` – 225,78 USD** (2026-10-12T20:00:00Z; förbörs 221,02, −2,11 %). Investerardagen 2026-10-06 satte målet >8 mdr USD ARR FY31. Full EMA-stack, stigande histogram och RSI 66,1. **Fällt av grind 2 (volym):** 0,79×. Katalysatorn ligger nu sex handelsdagar bak, i kanten av femdagarsfönstret.
4. **`DVN` – 48,96 USD** (2026-10-12), omprövad enligt L-4. Dataluckan som fällde den 2026-10-09 är fylld (250 punkter). Full EMA-stack, RSI 56,1, stigande histogram och kurs +8,9 % över MA200 44,97. **Fällt av grind 2 (volym):** 0,44×. Det är ett omdömesskäl, så kandidaten omfattas inte av fler L-4-omprövningar.

**Scout-kandidater i `state/scout_candidates.json`:** `261010-TEVA` och `261010-ZS` → **rejected** (grind 2, volym). `261009-DVN` har fått ett andra avgörande med `decidedAt` 2026-10-13 → **rejected** (grind 2, volym). Inga poster med `book: "us"` står kvar som `new`.

---

## Bubblare (watchlist inför nästa vecka)
1. **TEVA** – 41,17 USD (2026-10-12T20:00:02Z). Den enda kandidaten med en färsk, bekräftad, hård katalysator (FDA 9/10) och en ren teknisk bild. Den saknar flödesbekräftelse (1,23×), och målet ligger över 250-dagarshögsta. Prövbar om en session ger ≥ 1,5× och kursen håller över 39.
2. **CVX** – 215,00 USD (2026-10-12). Färsk MACD-korsning och full EMA-stack. Faller enbart på volymen. Målet (+10–14 %) ligger över 250-dagarshögsta 217,77, så grind 4 måste också lösas.
3. **XOM** – 172,15 USD (2026-10-12T20:02:44Z). Står på 250-dagarshögsta med RSI 69,0. Volymkvoten har legat under 1,5× tre veckor i rad (0,67×). Oljans riktning efter orkanen och Hormuz avgör.
4. **ZS** – 225,78 USD (2026-10-12T20:00:00Z). Ligger 30 % under 250-dagarshögsta 336,27, så det finns motstånd att ankra ett mål i. Faller på volymen, och katalysatorn åldras ur fönstret.

Samtliga fyra finns i `config/watchlist_us.txt` och har kurs i `state/prices.json` (L-2).

**Förra veckans bubblare:** **XOM** – RANKAD UNDER, bubblare 3 (grind 2: volym 0,67×). **BKH** – STRUKEN (grind 2: volym 1,12×; grind 5 kvarstår: nåbarhet 2 × 0,98 % × √30 = 10,7 % under order-golvet 14 %). **AMD** – STRUKEN (grind 2: kurs under EMA20, MACD-histogram 0,42 → −5,02, volym 0,69×). **ILMN** – STRUKEN (grind 2: negativt och fallande histogram, volym 0,36×).
**Scout-inflöde:** (de 5 senaste: rapport-261008, -261009, -261010, -261011 och -261013; rapport-261012 saknas, eftersom måndagens scout uteblev). **TEVA** (261010) – RANKAD UNDER, bubblare 1, kandidat **rejected**. **ZS** (261010) – RANKAD UNDER, bubblare 4, kandidat **rejected**. **DVN** (261009) – STRUKEN (grind 2: volym 0,44×), L-4-omprövad och **rejected**. **ACN** (261009) – STRUKEN (grind 2: volym 0,86×; grind 3 kvarstår). **VST** (261008) – STRUKEN (grind 2: EMA-ordningen ej uppfylld, vändande histogram, volym 0,93×). **COST** (261008) – STRUKEN (grind 2: kurs 959,44 under MA200 963,99). Rapport-261011 och -261013 hade inga case.
**Villkorade bubblar-planer:** **Inga.** Ingen bubblare klarar samtliga grindar, och en pending-rad på ett case som underkänts på en grind vore att kringgå grinden.

**Rörelsegenomgång (L-7):** rangordnad ur `state/price_history.json` över **93 amerikanska symboler** med daterad stängning både 2026-10-05 (bas) och 2026-10-12 (mätdag). Topp: `ZS` +11,88 %, `PLTR` +10,35 %, `ACN` +10,16 %, `CEG` +9,82 %, `VST` +9,14 %, `BKH` +8,29 %, `WMT` +7,62 %, `RDDT` +6,32 %, `TEAM` +5,64 %, `XOM` +4,97 %. Botten: `CLSK` −17,47 %, `SKHY` −16,81 %, `MARA` −15,49 %, `RIOT` −14,75 %, `IREN` −14,03 % och `INTC` −12,77 %. Samtliga topp-6 finns i bruttolistan. `WMT` (kurs under EMA200, ingen katalysator inom fem dagar), `RDDT` och `TEAM` (ingen daterad katalysator) togs inte in. `state/movers.json` har `asOf` **2026-10-09** och täcker bara nordiska symboler, så den bär inget urvalspåstående här. Resten av den amerikanska marknaden är **OKONTROLLERAD**.

## Veckans radar (kommande 5 handelsdagar)
* **Tisdag 13/10** – `JPM`, `WFC`, `C`, `GS`, `JNJ` och `UNH` Q3 före öppning (`state/earnings_calendar.json`, `isEstimate: false`). Ger en läsning på räntenetto och kreditkvalitet. Inga innehav berörs.
* **Onsdag 14/10, 12:30 UTC – KPI september.** Konsensus är 3,6 % å/å och kärn-KPI 2,5 % (scout-261013 via Gotrade/Kitco). Det är veckans viktigaste siffra för räntekänslig tillväxt och halvledare, alltså för `MRVL`. Samma dag rapporterar `BAC`, `MS` och `BLK` (`earnings_calendar.json`).
* **Torsdag 15/10** – PPI samt `TSM`, `PNC` och `USB` Q3 (`earnings_calendar.json`). TSM är den direkta prövningen av AI-halvledartemat och påverkar `MRVL`.
* **Veckan 12–16/10** – `ABT` Q3 före öppning (exakt dag ej belagd, scout-261013). **Måndag 19/10** – `AGNC`. **Tisdag 20/10** – `NFLX` (projicerat, ej bekräftat av bolaget).
* **Källa och täckning (L-5):** rapportdatumen kommer ur `state/earnings_calendar.json`, som bara ser symboler som `prices.yml` redan hämtar. Resten av US-universumet är **OKONTROLLERAT**. `MRVL` saknar rapport i fönstret enligt samma källa. Rapportförbudet (punkt 2e) gäller samtliga namn ovan. **Indexöversyner (L-8):** ingen fil i repot räknar upp S&P-förändringar, och ingen bekräftad S&P 500-förändring med ikraftträdande inom fönstret hittades i `state/news_feed.json` (titlar sökta 2026-10-06–13). Den otäckta delen är **OKONTROLLERAD**.
* **Sektorer:** **medvind** – energi (Hormuz håller Brent nära 100 USD, även om orkanpremien faller tillbaka) och banker med stark räntenettoutveckling (GS, C). **Motvind** – halvledare och optik (CXMT, vinsthemtagning, TSM framför), räntekänslig tillväxt inför KPI efter höjningen i september, och kryptominers.

## Åtgärdspunkter till Dren (L-3)
1. **`news-feed-globenewswire-http-403` – ÅTERKOMMANDE.** Fält: `state/news_feed.json` `feeds.globenewswire` = "HTTP 403 – båda försöken (0.1 s)" och `feeds.globenewswire-earnings` = "HTTP 403 – båda försöken (0.1 s)" (`generatedAt` 2026-10-13T12:45:25Z). **Omfång:** 2 av 6 flöden, inklusive den enda källan som är dedikerad åt rapportöverraskningar. TEVA:s FDA-godkännande kom via just GlobeNewswire. Beskrivet i scout-261011 och -261013. **Ersättningskälla:** websök.
2. **US-rotationen uteblev 2026-10-12 – ÅTERKOMMANDE (`us-rotation-lage-a-missed`).** Fil: `reports/us_weekly/` (saknar v42 fram till i dag) och `state/decisions.json` (noll `book: "us"`-rader 2026-10-12). Även scoutens `reports/scout/rapport-261012.md` saknas. **Omfång:** 1 utebliven handelsdag och 1 utebliven veckorotation, samt 3 kandidater (`261010-TEVA`, `261010-ZS` och L-4-omprövningen `261009-DVN`) som stod obearbetade ett dygn längre än avsett. Det är tredje veckan på fyra med en utebliven US-körning (v40, v41 och v42). Kontrollera schemat för routinen "USA-Rotation": dagens körning startade 13:27 UTC mot schemalagda 13:06.
3. **`state/alerts.json` `checkedAt` 2026-10-12T23:30:38Z** – 14 timmar gammal vid körningen, men monitorn kör bara under börstid, och US-sessionen har inte öppnat. `watched` = `["SPY","MRVL"]`, och `active` är tom. Stop och mål för MRVL är därför kontrollerade manuellt mot `dayLow` 260,80 i `state/prices.json`. Intradagsskyddet gäller från dagens första monitorkörning.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
