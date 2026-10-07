# Veckorapport: US-rotation
**Vecka:** v 41 | **Datum:** 2026-10-07
**Marknadsklimat:** `^GSPC` stängde tisdagen på **rekordnivå 7 818,93 (+0,58 %)** och `^IXIC` på 27 599,89 (+0,45 %) (prices.json/Yahoo chart API, marketTime 2026-10-06T20:40:07Z resp. 22:31:33Z); uppgången bars av AI-halvledare (`MRVL` +5,81 %, `AMD` +2,80 %). Före öppning i dag faller terminerna – S&P 500 −0,5 %, Nasdaq 100 −0,9 % med chip och storbolagsteknik under tryck – samtidigt som tätare iranska attacker mot fartyg i Hormuzsundet lyft Brent över 101 USD (TheStreet 2026-10-07). Dagens makrohändelse är FOMC-protokollet från 15–16/9 kl. 18:00 UTC. DXY, 10-årsräntan och VIX finns inte i `state/prices.json` och redovisas därför inte med siffra. **Regimfiltret är PÅ:** ^GSPC 7 818,93 ligger **+8,05 %** över MA200 7 236,15 (200 daterade stängningar ur `state/price_history.json`, serien bär 250 punkter).

> **Varför LÄGE A på en onsdag.** `reports/us_weekly/` slutar på `us-veckorapport-260921.md`, och `state/decisions.json` har inga `book: "us"`, `mode: "A"`-rader efter 2026-09-21. Varken v40:s (2026-09-28) eller v41:s (2026-10-05) US-rotation kördes, och ingen US-körning alls skedde 2026-10-05 och 2026-10-06. Enligt `prompts/gemensam_korning.md` tas en saknad veckorotation igen vid nästa öppna handelsdags körning, med dagens datum och dagens data – inga bakdaterade affärer. Ingen `claude/**`-branch bär opublicerad US-rotation (kontrollerat mot remote: enda claude-branchen är `claude/beslutsmatning-oberoende-fonster`).

---

## 0. Facit: Förra veckans val
| Aktie | Entry | Exit | Utfall | Stop/Mål träffad? |
|---|---|---|---|---|
| ACN | $208,65 (viktat: ben 1 $212,30 + ben 2 $205,00) | $200,50 | −3,91 % | Stop @ $200,50 (2026-10-02 intradag) |
| SPY (sleeve) | $773,26 | – (behålls) | +0,75 % mot entry; +1,98 % sedan 2026-10-01 | Ingen stop/mål – sleeven |

**ACN – stoppen bröts samma dag som positionen öppnades, och boken registrerade det fem dagar för sent.** Ben 1 köptes i `us-daglig-261002.md` på reguljära stängningen 2026-10-01 (212,30). Sessionen 2026-10-02 gick från dagshögsta **213,31** till dagslägsta **198,375** och stängde **198,90** (marketTime 2026-10-02T20:00:03Z, prices.json/Yahoo chart API, ur git-historiken för filen). Eftersom sessionen startade över båda nivåerna passerades ben 2:s limit ≤ 205,00 **före** stoppen 200,50 – ben 2 registreras som fyllt (punkt 4a: en rad, 25 %, viktat entry 208,65, oförändrat entry-datum) och hela positionen stängs till stoppnivån. Det är det sämre av de två bokföringsalternativen för boken (12,5 % × −5,56 % = −0,70 pp mot 25 % × −3,91 % = −0,98 pp) och det som limitorderns logik ger. Ingen gapöppning genom stoppen, så exit till nivån enligt bokens konvention (NVDA/MU). ^GSPC 2026-10-01 → 2026-10-02: +0,73 % ⇒ **alpha −4,64 pp**, `realizedRr` −1,00. `state/alerts.json` har burit både `SÄLJ` (stop-loss träffad) och `KÖP` (entry-villkor uppfyllt) för ACN obehandlade sedan dess. **Senaste verifierade stängning är 193,40** (2026-10-06T20:00:03Z) – den som säljer en faktisk ACN-position först nu får ungefär −7,3 % mot det viktade entryt, inte bokens −3,91 %. Orsaken till reaktionen enligt websök: marknaden fokuserade på svagare utsikter och en serie cybersäkerhetsförvärv efter rapporten (XTB, Benzinga).

**Veckans portföljutfall (viktat):** cirka **+0,50 %** sedan 2026-10-01 (ACN −0,98 pp på 25 % + SPY +1,48 pp på 75 %).
**Ackumulerad avkastning sedan strategistart:** **−3,82 %** (fyra stängda affärer i skarp drift, kedjade multiplikativt på faktisk vikt: NVDA, MU, XOM, ACN). Exklusive USD/SEK-effekten (USDSEK=X 10,0242, 2026-10-07T13:12:24Z).
**Portföljallokering denna vecka:** **100 % SPY-sleeve**, alla fyra aktieplatser tomma. En villkorad plan: `MRVL` 25 % som limit ≤ 275,00 (se Case 1). Ingen viktavvikelse att motivera – platt 25 % per aktie, resten i sleeven.
**Lärdom:** Två saker, båda mätta i repots egna filer. (1) **Att jaga en rapportreaktion på dag 1 med RSI 70 kostade en hel stop på en session** – ACN köptes efter +15,78 % och gav tillbaka hela rörelsen på tre dagar. Veckans enda promotion (`MRVL`, samma profil: +5,81 %, RSI 69,9) läggs därför som villkorad limit med entry nära föregående stängning, inte som direktköp. (2) **En utebliven rutin är en riskhändelse, inte bara en saknad rapport:** stoppen låg bruten i tre sessioner utan att boken agerade. Det är upptaget som åtgärdspunkt nedan (L-3). Tillämpade lärdomar: L-2 (sex nya symboler i `config/watchlist_us.txt`), L-3, L-4 (`BKH` avvisad på tillfällig datalucka, prövas om), L-5 (radarns källor och OKONTROLLERAT universum), L-6 (inga klasser strukna med hänvisning till fokusfilen), L-7 (rörelsegenomgång ur price_history), L-8 (indexöversyner, se radarn).

---

## Case 1: Marvell Technology (MRVL / NASDAQ)

### 1. Katalysatorn
Investerardag **2026-10-06** (under sessionen): intäktsmål **70–90 mdr USD för räkenskapsåret 2031** (55–60 % årlig tillväxt), FY28-målet höjt till **~20 mdr USD** och custom silicon för FY29 höjt till **12 mdr USD+** (från 10 mdr), ankrat i det tidigare Google-avtalet. Aktien föll först ~3 %, vände till som mest +11 % (dagshögsta 301,27) och stängde **+5,81 % på 287,01** (prices.json/Yahoo chart API, marketTime 2026-10-06T20:00:01Z) på **3,01× normal volym** (`state/volume_history.json`). Källor: Investing.com 2026-10-06, Startup Fortune 2026-10-06, BigGo Finance 2026-10-06 (via scout-261007). Ingen after-hours-rapport. **Förbörs i dag 282,72** (prices.json `extendedPrice`, session `pre`, 2026-10-07T13:11:21Z), alltså −1,49 % i takt med svaga chipterminer. Bekräftad, inte ryktesbaserad. `catalystType: other`.

### 2. Investerings-tes (The Bull Case)
* Målen höjer den medelfristiga intäktsbanan kraftigt och flyttar fokus till custom-ASIC-volymerna, där Google-avtalet ger en namngiven motpart – dagens volym (3,01×) visar att det är institutionellt flöde, inte en enskild nyhetsspik.
* Rörelsen har lång trend bakom sig (120 dagar **+113,2 %**, 20 dagar +27,3 %), vilket punkt 1b väger som ett plus snarare än en ensam brant spik. Planen köper en rekyl mot föregående stängning, inte själva gapet.

### 3. Motargument & Risker (The Bear Case)
* **Samma profil som ACN:** stor reaktion på en händelse, RSI precis under 70. Långsiktiga mål (FY31) är inte en rapportöverraskning och kan prisas ut lika fort som de prisades in.
* Chipsektorn är i dag under tryck i förbörs (Nasdaq 100 −0,9 %), räntorna stiger och Hormuz-läget driver oljan över 101 USD – en riskavvecklingsdag kan ta kursen genom 275 och vidare mot stoppen.
* Målet ligger strax under 250-dagarshögsta 316,43 – där väntar säljare från förra toppen; uppsidan är därmed tydligt begränsad.

### 4. Fundamental snapshot
* **Börsvärde:** ej verifierat ur repots filer (ingen aktieantalskälla) | **P/E / EV/EBITDA:** ej verifierat | **Tillväxt:** bolagets mål 55–60 % årlig intäktstillväxt till FY31 (bolagsmål, ej utfall) | **Snittomsättning/dag:** **4 875 MUSD** (20-dagarssnitt volym × kurs, `state/volume_history.json`)

### 5. Teknisk setup
* **RSI(14):** 69,9 | **MACD:** stigande histogram 1,930 → 2,588 | **Kurs vs EMA20/50/200:** över alla (255,41 / 239,44 / 186,93, EMA20 > EMA50 > EMA200) | **Volym vs 20d-snitt:** 3,01× | **Stöd:** 271,25 (föregående stängning) / 267,26 (katalysatordagens lägsta) | **Motstånd:** 301,27 (dagshögsta) och 316,43 (250-dagarshögsta)

### 6. Handelsplan
| Entry | Stop-loss | Målkurs | Risk/Reward |
|---|---|---|---|
| $275,00 (villkorad limit, reguljär session) | $260,00 (−5,45 %) | $313,50 (+14,0 %) | 1:2,57 |

Horisont **20 handelsdagar** (`other`: 2–4 veckor, mål 10–14 %, stop 5–6 %, inget tidsstopp). Kostnadströskeln: entry → mål **+14,0 % ≥ 8 %**. Nåbarhet: 2 × 3,87 % (genomsnittlig absolut dagsrörelse, 60 dagar ur price_history) × √20 = **34,6 % ≥ 14,0 %**. **HELA positionen som limit**, inte delat entry: kandidatens färskaste kurs är förbörs, och punkt 2d säger att ett köp på en utökad kurs alltid blir en villkorad plan mot reguljär session; aktien gapade dessutom +5,81 % på katalysatordagen (undantaget i punkt 4a). Ej triggad t.o.m. **2026-10-14** → avförs, kapitalet stannar i SPY.
Poäng: katalysator 7 × 35 % + teknik 8 × 30 % + makro 5 × 15 % + R/R 6 × 20 % = **6,80**.

**Planerad vikt:** 25 % (platt vikt; triggar planen minskas sleeven 100 % → 75 %).

---

## Bubblare (watchlist inför nästa vecka)
1. **XOM** – 164,48 USD (marketTime 2026-10-06T20:03:47Z). Full EMA-stack (162,63 > 159,92 > 148,33), MACD-histogrammet korsade upp 6/10 (−0,033 → +0,037), RSI 56,0, och Hormuz-attackerna i dag är en färsk makrokatalysator. Faller enbart på volymkvoten 0,67×. Prövbar om en session efter 7/10 ger ≥ 1,5× – annars är rörelsen inte flödesbekräftad. Målet (+10–14 %) ligger över 250-dagarshögsta 171,47, så även grind 4 måste lösas.
2. **BKH** – 70,74 USD (stängning 2026-10-06, FÖRE katalysatorn 20:10 UTC; förbörs 71,00 i dag). Bindande Google-avtal 2026-10-06 (1,8 mdr USD egen gasproduktion, 590 MW + 2,1 GW). Avvisad enbart på att kursserien har EN punkt – tillfällig datalucka, prövas om enligt L-4 när backfillen fyllt serien.
3. **AMD** – 649,42 USD (2026-10-06T20:00:01Z). Starkast trend i fältet (120 dagar +151,6 %), men står PÅ 250-dagarshögsta (inget motstånd att ankra ett mål i), RSI 72,2 och volymkvot 1,09×, och saknar hård katalysator inom fem dagar.
4. **ILMN** – 273,54 USD (2026-10-06T20:00:01Z). Hel EMA-stack, men MACD-histogrammet faller (3,04 → 1,91) och −6,86 % 6/10 gav tillbaka måndagens analytikerdrivna uppgång. Behöver en bolagskatalysator.

**Förra veckans bubblare:** (senaste US-veckorapporten är `us-veckorapport-260921.md` – v40 kördes aldrig) **BE** – **STRUKEN** (grind 2: volymkvot 0,71×; grind 3: indexkatalysatorn 21/9 förbrukad). **ILMN** – **RANKAD UNDER**, bubblare 4 (grind 2: fallande MACD-histogram, volymkvot 1,02×). **INTC** – **STRUKEN** (grind 2: MACD-histogram −0,04 → −0,62, kurs under EMA20; grind 3: inget bekräftat SK hynix-engagemang). **TSM** – **STRUKEN** (grind 2: volymkvot 0,83×, RSI 72,6; rapport 15/10 är binär och får inte köpas inför, punkt 2e). **AMD** – **RANKAD UNDER**, bubblare 3 (grind 2 och 4).
**Scout-inflöde:** (de 5 senaste: rapport-260930, -261001, -261002, -261006, -261007) **MRVL** (261007) – **VALD**, Case 1, kandidat `261007-MRVL` **promoted**. **BKH** (261007) – **RANKAD UNDER**, bubblare 2, kandidat `261007-BKH` **rejected** (grind 2, datalucka). **PCVX** (261006) – **STRUKEN**, kandidat **rejected** (grind 4: regulatory-målet +14 % = 76,04 över 250-dagarshögsta 73,82; emission 5/10). **PTC** (261006) – **STRUKEN**, kandidat **rejected** (grind 4: budet 205 USD ger +6,2 % uppsida, under kostnadströskeln 8 %; RSI 80,6). **SYNA** (261002) – **STRUKEN** (grind 4: kontantbudet 123 USD ger +3,0 %). **ACN** (261002) – såld på stop, se facit. **UTHR** (261001) – **STRUKEN** (grind 2: fallande MACD, EMA20 < EMA50 < EMA200). **MU** (261001) – **STRUKEN** (grind 2: MACD-histogrammet vände negativt 1,77 → −1,22, volymkvot 0,87×). **HII** (260930) – **STRUKEN** (grind 2: RSI 37,4, under alla EMA). **CCL** (260930) – **STRUKEN** (grind 2: under EMA200, volym 0,89×). **VNDA** (260930) – **STRUKEN** (grind 2: likviditet 5 MUSD/dag). Uppföljningarna **TEVA**, **AKAM**, **COST** – **STRUKNA** på grind 2 (fallande MACD resp. kurs under EMA20/50 resp. EMA200) och grind 3 (katalysatorerna 24–28/9 utanför femdagarsfönstret).
**Villkorade bubblar-planer:** **Inga** BUBBLARE-planer – ingen av de fyra bubblarna klarar samtliga grindar, och en pending-rad på ett case som underkänts på en grind vore att kringgå grinden. Den enda Pending-raden är scout-promotionen `MRVL` ≤ 275,00 (stop 260,00, mål 313,50, R/R 1:2,57, 25 %).

**Bruttolistan (35 rader i `state/decisions.json`, `mode: "A"`):** 32 kandidater + ACN (ben 2 + SÄLJ) + sleeven. **Ur nyhetsflödet (g0): 6** – `PCVX` (GlobeNewswire 2026-10-05), `BKH` (mfn 2026-10-06T20:10Z), `PTC` (8-K 2026-10-05), `PECO` (GlobeNewswire 2026-10-01, höjd förvärvsguide), `AXGN` (GlobeNewswire 2026-10-01, slutfört förvärv), `NG` (GlobeNewswire + 8-K 2026-10-05, Donlin-förvärvet). **Ur egen scanning/websök: 3** – `CEG` (kärnkraftsavtal med Google, +12,25 % förbörs), `VST` (+10,77 % förbörs på väntat statligt lån, obekräftat), `CIEN` (+13,85 % förbörs) (TheStreet 2026-10-07). Övriga ur scout (`MRVL`, `SYNA`, `UTHR`, `MU`, `HII`, `CCL`, `VNDA`, `TEVA`, `AKAM`, `COST`; `PCVX`/`PTC`/`BKH` räknade ovan), förra veckans bubblare (`AMD`, `BE`, `ILMN`, `INTC`, `TSM`), Hormuz-makro (`XOM`, `CVX`) och rörelsegenomgången (`HPE`, `EVCM`, `U`, `TEAM`, `AESI`, `TSLA`). Nyhetsfönstret täcker **10 av 10 handelsdagar** (`window.tradingDaysCovered` 10, `missingDays` tomt, äldsta 2026-09-24). **Funneln:** grind 1 fäller 6 (`PECO`, `AXGN`, `NG`, `CEG`, `VST`, `CIEN` – saknas i `state/prices.json`, loggade med `price: null`, tillagda i watchlist per punkt 6b), grind 2 fäller 22 (varav `BKH` på datalucka), grind 4 fäller 3 (`PCVX`, `PTC`, `SYNA`), 1 passerar alla (`MRVL`). Volymkvoten under 1,5× är fortfarande det vanligaste fallet i grind 2 (20 av 22). Grind 3 nämns som andra spärr där den också faller; en rad loggas på den första grind den faller på (jfr åtgärdspunkten `gate-assignment-ambiguous`).
**Rörelsegenomgång (L-7):** rangordnad ur `state/price_history.json` över **80 amerikanska symboler** med daterad stängning både 2026-09-29 (bas) och 2026-10-06 (mätdag). Topp: `PTC` +40,30 %, `SYNA` +18,45 %, `PCVX` +17,66 %, `EVCM` +15,73 %, `HPE` +14,62 %, `U` +13,17 %, `UTHR` +12,49 %, `TEAM` +10,24 %, `ACN` +9,19 % (mätt mot 29/9, före rapporten), `AESI` +9,10 %, `MRVL` +9,02 %. `state/movers.json` bär `asOf` **2026-10-02** och täcker endast nordiska symboler – den bär inget urvalspåstående här. Resten av den amerikanska marknaden är **OKONTROLLERAD**.

## Veckans radar (kommande 5 handelsdagar)
* Onsdag 7/10 – FOMC-protokollet (15–16/9) kl. 18:00 UTC – räntekänslighet för tillväxt/halvledare, alltså för `MRVL`-planen.
* Onsdag 7/10 – Hormuz: iranska attacker mot fartyg, Brent > 101 USD (TheStreet 2026-10-07) – energi (`XOM`, `CVX`) medvind, transport och konsumtion motvind.
* Torsdag 8/10 – `PEP` Q3 (`state/earnings_calendar.json`, ej uppskattat datum) – konsumtionsavläsning.
* Fredag 9/10 – `DAL` Q3 (`earnings_calendar.json`) – flyg/bränslekostnad med oljan över 100.
* Tisdag 13/10 – `C`, `JPM`, `WFC` Q3; onsdag 14/10 `BLK`; torsdag 15/10 `TSM`, `PNC`, `USB` (`earnings_calendar.json`). Rapportförbudet (punkt 2e) gäller för samtliga – ingen köps inför sin rapport.
* **Källa och täckning (L-5):** rapportdatumen kommer ur `state/earnings_calendar.json`, som bara ser symboler `prices.yml` redan hämtar; resten av US-universumet är **OKONTROLLERAT**. Datum för KPI (september) och övriga makrosiffror kunde inte beläggas ur repots filer eller websök i denna körning och anges därför inte. **Indexöversyner (L-8):** ingen fil i repot räknar upp S&P-förändringar; ingen bekräftad S&P 500-förändring med ikraftträdande i fönstret hittades i nyhetsflödet (sökt på "S&P 500"/"S&P MidCap" i titlarna 2026-09-30–10-07). Den otäckta delen är **OKONTROLLERAD**.
* Sektorer: **medvind** – energi (oljepriset), AI-kraft/kärnkraft (`CEG`, `VST` på Google-avtal och lån); **motvind** – halvledare och storbolagsteknik i dag, IT-tjänster (`ACN`-reaktionen), räntekänsligt vid stigande avkastningar.

## Åtgärdspunkter till Dren (L-3)
1. **US-rotationen uteblev 2026-09-28 – 2026-10-06 (ÅTERKOMMANDE).** Fil: `reports/us_weekly/` (saknar v40 och v41 fram till i dag), `reports/us_daily/` (saknar 2026-09-28, -09-29, -09-30, -10-05, -10-06), `state/decisions.json` (noll `book: "us"`-rader på samma datum). Omfång: **5 uteblivna handelsdagar, 2 uteblivna veckorotationer**. Konsekvens: ACN-stoppen låg bruten och obehandlad i tre sessioner (`state/alerts.json` `active`: SÄLJ + KÖP för ACN sedan 2026-10-02). Samma defekt beskrevs som `us-rotation-lage-a-missed` (CLAUDE.md 5b punkt 9) – tredje gången. Ersättningskälla: git-historiken för `state/prices.json` (dagshögsta/-lägsta per session). Kontrollera schemat för routinen "USA-Rotation" (dagens körning startade 13:22 UTC mot schemalagda 13:06).
2. **`state/alerts.json` `checkedAt` 2026-10-06T23:35:18Z** – inom sex timmar räknat från sista sessionens slut, men monitorn kör inte före öppning, så intradagsskyddet för `MRVL`-planen gäller först från dagens första monitorkörning.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
