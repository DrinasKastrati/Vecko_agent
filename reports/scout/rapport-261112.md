# Daglig Scout: USA & Krypto
**Datum:** 2026-11-12
**Marknadsklimat:** CoreWeaves rapport fick AI-handeln att vända upp. CRWV steg +24,71 %, SOX +5,66 %, S&P 500 +1,31 % och Nasdaq +1,60 %, som därmed åter ligger över MA200. Efter stängning kom ett WSJ-avslöjande: Nvidias styrelse förbereder att avsätta vd Jensen Huang, och NVDA föll −8,6 % i efterhandeln. Torsdagen öppnar därför med en risk mot den största enskilda indexvikten. Krypto står stilla: BTC ligger 1,5 % över MA200 och ETH 3,7 % under. **Aktiva lärdomar tillämpade:** L-2 (nya kandidater utan post-eventkurs dokumenteras med `price: null`), L-3 (åtgärdspunkter sist), L-4 (kandidatkön kontrollerad), L-5 (kalenderns och flödets täckning) och L-6 (ingen klass utesluts). L-1, L-7 och L-8 gäller inte scouten.

## Marknadsöversikt

`git pull` kördes 2026-11-12 05:48 UTC (06:48 CET): HEAD = `origin/main` = `43f9e20`. Källan är `state/prices.json` med `generatedAt` 2026-11-12T02:17:20Z, `schemaVersion` 2026-08-02-prevclose, `tickerCount` 323 och `okCount` 318 (Yahoo Finance chart API via GitHub Actions). `wideAt` 2026-11-12T02:17:20Z visar att dygnets breda hämtning har kört. Nyhetsflödet (`state/news_feed.json`) har `generatedAt` 2026-11-12T02:17:42Z och täcker **10 av 10 handelsdagar** (2026-10-29 – 2026-11-12, `missingDays` tomt).

| Symbol | Nivå | Rörelse | marketTime |
|---|---|---|---|
| `^GSPC` | 7 619,38 | **+1,31 %** (7 520,93 → 7 619,38); dagsintervall 7 571,88–7 647,20 | 2026-11-11T21:42:03Z |
| `^IXIC` | 25 466,19 | **+1,60 %** (25 065,87 → 25 466,19) | 2026-11-11T22:15:59Z |
| `BTC-USD` | 73 748,52 | −0,19 % mot daterad punkt 2026-11-11 (73 890,50) | 2026-11-12T02:15:37Z |
| `ETH-USD` | 2 055,55 | −0,04 % mot daterad punkt 2026-11-11 (2 056,31) | 2026-11-12T02:15:57Z |
| `SPY` (sleeve) | 759,81 | +1,32 % (749,92 → 759,81) | 2026-11-11T21:00:01Z |

Dagsrörelserna för krypto är räknade mot daterade punkter i `state/price_history.json`, eftersom `previousClose` för BTC (73 720,12) och ETH (2 050,18) fortfarande inte stämmer med någon daterad punkt (åtgärdspunkt 2).

**Teknik** (räknad på råserien i `state/price_history.json`, sista aktiepunkt 2026-11-11):
- `^GSPC` ligger **3,89 % över MA200** (7 334,25) och över EMA20 (7 606,28), men under MA50 (7 672,66). RSI är 49,7 och MACD-histogrammet negativt (−9,25), men mindre negativt än i går (−20,3). ⇒ **Regimfiltret för US-boken är PÅ**, med större marginal än i går (+2,59 %).
- `^IXIC` ligger **1,37 % över MA200** (25 122,57) igen, efter en dag under. Den ligger fortfarande under EMA20 (25 715,10) och MA50 (26 396,06).
- `BTC-USD` ligger 1,51 % över MA200 (72 651,65), med RSI 34,5. **`ETH-USD` ligger 3,73 % under MA200** (2 135,21), med RSI 31,0.

## Ekonomiska siffror & kalender

**Senaste utfall:**
- **KPI oktober (2026-11-10):** Totalen steg +0,4 % m/m mot väntade +0,3 %, och kärnan +0,3 % mot väntade +0,2 %, tredje månaden i rad. BLS publicerade ingen officiell årstakt (se rapport-261111; Axios, CNBC och Kiplinger 2026-11-10). Marknaden prisar en räntehöjning i december. FedWatch-odds är inte verifierade i dag.
- **11-11 Veterans Day:** obligationsmarknaden var stängd och inga makrosiffror publicerades. Aktiemarknaden var öppen (mlq.ai, veckoförhandsvisning 2026-11-09).

**Kommande (nästa 1–5 handelsdagar):**
- **I dag tor 2026-11-12:**
  - **Jobless claims** 08:30 ET (14:30 CET). Väntat ~194–195 000, mot förra veckans 189 000 (FourWeekMBA och moomoo 2026-11-11/12).
  - **Nebius (`NBIS`)** rapporterar före öppning, med samtal 08:00 ET.
  - **`AMAT` och `CSCO`** rapporterar efter stängning. Konsensus för AMAT är EPS ~4,05 och intäkter ~10,30 mdr USD. För CSCO är det EPS ~1,33 och intäkter ~18,13 mdr USD (`state/earnings_calendar.json`). Källorna anger olika CSCO-konsensus (1,32 respektive 1,15), så den siffran är inte verifierad.
- **Fre 2026-11-13: PPI oktober – VECKANS MEST MARKNADSRÖRANDE återstående siffra.** Väntat +0,4 % m/m (FXEmpire 2026-11-08). Den kommer efter ett varmt KPI, och obligationsmarknaden öppnar igen efter helgdagen.
- **Tis 2026-11-17:** Nvidia rapporterar (konsensus EPS 2,47, intäkter ~109,0 mdr USD), och samma dag `HD`.

**Rapporter nästa 10 handelsdagar** ur `state/earnings_calendar.json` (`generatedAt` 2026-11-12T02:15:18Z, `errors` tomt), US-symboler:
- **11-12:** `AMAT`, `CSCO` och `NBIS`.
- **11-17:** `NVDA` och `HD`. **11-18:** `TGT` och `LOW`. **11-19:** `WMT` och `ROST`. **11-23:** `HPE`. **11-24:** `CLSK` (gissat datum, `isEstimate`). **11-25:** `DE`.

**L-5:** Kalendern ser bara de 323 symboler som `prices.yml` hämtar. Resten av det amerikanska universumet är **OKONTROLLERAT**. Samtliga datum är bevakningsposter enligt punkt 8, aldrig köpförslag. Inga tillägg i watchlistan i dag: varje bolag ovan finns redan där.

## Aktuella händelser & katalysatorer

- **CoreWeave lyfte AI-handeln, 2026-11-11.** CRWV steg +24,71 % till 60,77, bolagets största dagsuppgång sedan mitten av 2025. Uppgången följde Q3-rapporten och den höjda helårsguiden 13,0–13,3 mdr USD. SOX steg +5,66 %, `AMD` och `AVGO` över 5 %, och TSMC ~4 % (Yahoo Finance "Stock Market Today, Nov. 11" 2026-11-11; Kiplinger 2026-11-11; CNBC live 2026-11-11). Kurserna är verifierade i `prices.json`: `CRWV` 60,77, `AMD` 552,90 (+7,32 %), `AVGO` 345,22 (+3,99 %) och `NBIS` 154,69 (+15,44 %). Alla är stängningar med marketTime 2026-11-11T21:00Z.
- **Nvidia (`NVDA`), 2026-11-11, regulär session:** Aktien steg +2,87 % till 173,73 efter två dagars fall. Samma dag sänkte Baird till Neutral (Yahoo Finance 2026-11-11).
- **⚠️ RYKTE – EJ BEKRÄFTAT (The Wall Street Journal, 2026-11-11, efter stängning):** Enligt WSJ förbereder Nvidias styrelse att avsätta Jensen Huang. **Reuters bekräftade uppgiften självständigt** och uppger att styrelsen sammanträdde sent på onsdagen. **Bloomberg** rapporterar att styrelsen arbetar med en extern firma för att identifiera efterträdare, och att en tillförordnad vd övervägs. Uppgifterna kommer via Forbes 2026-11-12, CBS News 2026-11-11 och Yahoo Finance live 2026-11-11/12. Bakgrunden är nya uppgifter om en andra affär. Efterhandeln föll −8,61 % till 158,78 (Forbes). Den kursen är **inte** verifierad i `prices.json`. Nvidia har inte kommunicerat något; styrelsen gav Huang sitt stöd så sent som 2026-11-08 (CNBC). → **Case 1.**
- **Krypto:** Ingen ny bekräftad ETF-, regulatorisk eller protokollkatalysator har hittats. Websöket på ETF-flöden 11-11 gav bara träffar från 2025, och dagens flöden är därför **inte verifierade**. **Negativt påstående (L-5):** Det gäller bara de källor som genomsöktes (websök och `news_feed.json`); övriga flöden är **OKONTROLLERADE**.
- **`news_feed.json`, de senaste 24 h:** Inga poster om US-bolag i watchlistan med en handlingsbar katalysator. Flödet domineras av nordiska mfn-poster och mindre US-bolag (iRhythm: återköp 200 MUSD; EZCORP: Q4). `sec-8k` har inga poster efter 2026-11-10 22:30 UTC, eftersom EDGAR inte tar emot inlämningar på en federal helgdag (Veterans Day). Det är inte ett fel, se åtgärdspunkt 4.

## Uppföljning av tidigare case

- **`COST` (rapport-261111): 1 066,14 → 1 087,61** (+2,01 %, marketTime 2026-11-11T21:00:01Z, prices.json/Yahoo chart API). **Tes INTAKT:** marknaden tog emot extrautdelningen positivt, och kursen ligger 0,6 % från 250-dagarshögsta (1 094,32). RSI 73,2 är dock nu överköpt, och volymen 0,92× 20-dagarssnittet är fortfarande under bokens krav (1,5×). Kandidaten `261111-COST` är avvisad (grind 2) av `us-daglig-261111`.
- **`CRWV` (rapport-261111): 48,73 → 60,77** (+24,71 %, marketTime 2026-11-11T21:00:01Z, prices.json/Yahoo chart API). Dagsintervallet var 53,81–62,03, och volymen 2,18× 20-dagarssnittet. **Tes INTAKT:** rapporten bar rörelsen, och kursen stängde över EMA20 (57,73) med positivt MACD-histogram (+0,85). Kursen ligger dock **32,1 % under MA200** (89,47), så blockeringen gäller oförändrat. Kandidaten `261111-CRWV` är avvisad av omdömesskäl (kurs under MA200). Den omfattas därför inte av L-4, och ingen ny post skapas för samma katalysator.

**Kandidatkön (`state/scout_candidates.json`):** 119 poster före dagens tillägg, varav 110 `rejected`, 9 `promoted` och **0 `new`**. US-rotationen `us-daglig-261111` avgjorde alla fyra kandidater från 10–11/11. I dag läggs två nya till, båda `confirmed: false` och `price: null`, med `expiresAt` 2026-11-19:
- `261112-NVDA` (rykte; stängningen ligger före ryktet).
- `261112-AMAT` (väntad rapport, en ren bevakningspost).

**US-boken (läses, ändras inte):** `CBOE` 369,19 (+3,24 % mot 364,81 före; dagsintervall 359,96–371,06; marketTime 2026-11-11T21:00:00Z). Det är över stoppen 345,00 och 3,6 % från målet 382,50. RSI 73,0. `U`-planen avfördes 2026-11-11, och sleeven är 87,5 %.

## Dagens case

### Case 1: NVIDIA (NVDA / NASDAQ) – ⚠️ RYKTESDRIVET
**Katalysator:** ⚠️ RYKTE – EJ BEKRÄFTAT (The Wall Street Journal, 2026-11-11 efter stängning, "people familiar with the matter"). Styrelsen förbereder att avsätta vd Jensen Huang. Reuters har bekräftat uppgiften och Bloomberg rapporterar att en extern firma söker efterträdare. Mediebyrån som läckte uppgiften är **WSJ**. Det finns ingen bolagskommunikation. Styrelsen anlitade 2026-11-10 Joon H. Kim och Wachtell Lipton för utredningen (NVIDIA Newsroom / mfn 2026-11-10, i `news_feed.json`).
**Bull case:** Ett ordnat vd-skifte med en trovärdig efterträdare kan ta bort ett osäkerhetsmoment som redan har kostat aktien ~27 % från 250-dagarshögsta (239,24). Verksamheten (Blackwell/Rubin, datacenter) påverkas inte direkt av ett ledarskifte. Rapporten 2026-11-17 kan då flytta fokus tillbaka till siffrorna, och RSI 28,7 visar en kraftigt översåld aktie. Analytiker ser efterhandelsfallet som ett köptillfälle (BigGo Finance 2026-11-12). Det är en åsikt, inte belägg.
**Bear case:** Grundaren är bolagets ansikte och strateg, och ett tvingat avgångsbeslut veckan före rapporten är ett dubbelt binärt event. Rapportförbudet (punkt 8) gäller därför fullt ut. Kopplingen till en misstänkt kinesisk underrättelseagent kan väcka regulatoriska eller exportrelaterade frågor. Tekniskt är läget kraftigt försvagat: kursen ligger **15,0 % under MA200** (204,47), och enligt `prompts/gemensam_korning.md` blockerar "kurs ≤ MA200" nya aktiepositioner. **Caset är inte köpbart.** Det registreras som bevakning, eftersom NVDA är indexets största vikt och dess utfall styr regimen för hela US-boken.
**Setup:** Senaste verifierade kurs är **173,73 USD** (marketTime 2026-11-11T21:00:00Z, prices.json/Yahoo chart API; +2,87 % mot previousClose 168,89). Det är en **PRE-ryktekurs**, och kandidaten är därför skriven med `price: null`. Efterhandeln 158,78 (Forbes) är inte verifierad. Teknik: MA50 217,12, MA200 204,47, EMA20 199,66, RSI 28,7 och MACD-histogram −4,09. Volymen var 1,84× 20-dagarssnittet. Motstånd vid EMA20 ~200 och inget belagt stöd. Värderingsmultiplar är inte verifierade i dag.

### Case 2: Applied Materials (AMAT / NASDAQ) – bevakningspost inför rapport
**Katalysator:** Väntat event, inte inträffat: Q4 FY26 rapporteras **2026-11-12 efter stängning**. Konsensus är EPS 4,05 (spann 4,02–4,19) och intäkter 10,30 mdr USD (`state/earnings_calendar.json`, `isEstimate: false`). Bolagets egen guide är 10,25 ± 0,5 mdr USD, efter ett rekordkvartal på 9,12 mdr USD (FourWeekMBA 2026-11-11). Inget rykte. **Enligt punkt 8 är detta aldrig ett köpförslag före rapporten.**
**Bull case:** Utrustningscykeln för AI och HBM-minne är den mest direkta mätpunkten på om halvledarvändningen från 11/11 (SOX +5,66 %) håller. Ett slag mot konsensus och en stark guide för FY27 kan ge en post-eventkandidat att avgöra i morgon. Aktien ligger 45 % under 250-dagarshögsta (723,00), så förväntningarna är nedpressade.
**Bear case:** Exportrestriktioner mot Kina och den cykliska minnesinvesteringen är de vanliga riskerna. Kursen ligger **11,5 % under MA200** (446,17), och "kurs ≤ MA200" blockerar en ny aktieposition även efter ett bra utfall. Efter en uppgång på +6,05 % in i rapporten finns risk för "sell the news".
**Setup:** Senaste verifierade kurs är **395,08 USD** (marketTime 2026-11-11T21:00:01Z, prices.json/Yahoo chart API; +6,05 % mot previousClose 372,53; dagsintervall 381,75–404,71). Det är en pre-eventkurs, och därför står kandidaten på `price: null`. Teknik: MA50 440,37, MA200 446,17, EMA20 393,64 (kursen stängde precis över), RSI 47,6 och MACD-histogram +1,85. Volymen var 0,86× 20-dagarssnittet. Motståndet ligger vid MA50 ~440, och stödet vid EMA20 ~394. `prices.yml` fyller i en kvalificerad post-eventkurs automatiskt.

## Makro- & sektorfaktorer att bevaka

- **Räntehöjningsrisken kvarstår.** Det varma KPI-utfallet (kärnan +0,3 % tredje månaden i rad) gör en höjning i december till marknadens basfall (Kiplinger 2026-11-10). PPI på fredag och obligationsmarknadens återöppning i dag kan omprisa de långa räntorna. Det är motvind för långdurationstillväxt (`CRWV`, `NBIS`).
- **Regimen:** `^GSPC` ligger +3,89 % över MA200. Nasdaq ligger tillbaka över MA200 (+1,37 %), men ett NVDA-fall på ~8–9 % på öppningen (största enskilda indexvikten; exakt vikt ej verifierad) kan ensamt ta Nasdaq under igen.
- **AI-hårdvaran:** CRWV-rapporten visade att efterfrågan på AI-infrastruktur fortsatt bär (orderstock ~132,5 mdr USD). Bolagsspecifik risk i NVDA och tre rapporter i dag (`NBIS`, `AMAT`, `CSCO`) avgör om rotationen håller. Av namnen i rörelsen ligger bara `AMD` (552,90, 31,6 % över MA200 420,05) över MA200. `AVGO`, `AMAT`, `NBIS`, `CRWV` och `NVDA` ligger alla under. **AMD-kandidaten** avvisades 2026-11-11 på grind 2 (under EMA20/EMA50, MACD negativt). Efter 11/11 stänger AMD över EMA20 (519,80) och MA50 (550,43), med positivt MACD-histogram (+2,05) och 1,42× volym. Det var ett omdömesskäl, så frågan omprövas vid nästa veckorotation, inte här (L-4 omfattar den inte). Ingen ny post skapas, eftersom ingen ny bolagsspecifik katalysator har tillkommit.
- **Krypto saknar egen katalysator.** BTC ligger 1,5 % över MA200 och ETH 3,7 % under. Kryptoaktierna `COIN` (136,27, +3,13 %) och `MSTR` (122,35, +1,06 %) följde riskaptiten men ligger under MA200. Dollarn och realräntorna efter KPI är motvind, så det finns inget kryptocase i dag.
- **Olja och geopolitik:** inga nya verifierade värden i dag (WTI saknas i `prices.json`).

**Watchlist-hygien:** `config/watchlist_us.txt` innehåller långt fler symboler än riktmärket 25, men ingen rensning görs i dag. Följande skyddas enligt `prompts/gemensam_korning.md`: innehavet (`CBOE`), de giltiga kandidaterna (`NVDA` och `AMAT` nya i dag, `COST` och `CRWV` inom `expiresAt`), rapportbolagen inom 10 handelsdagar och besluten inom utvärderingens 20-dagarsfönster. Inga tillägg i dag: `NVDA` och `AMAT` har redan rad och kurs.

### Åtgärdspunkter till Dren (L-3)

1. **`us-rotation-lage-b-missed-261110`: LÖST.** `reports/us_daily/us-daglig-261111.md` landade på main (commit `b4dd677`) och avgjorde `261110-AMD`, `261110-CEG`, `261111-COST` och `261111-CRWV`. Kandidatkön har inga `new`-poster före dagens tillägg. Ingen åtgärd behövs.
2. **`crypto-previousclose-misdated` – ÅTERKOMMANDE.** `quotes["BTC-USD"].previousClose` (73 720,12) och `quotes["ETH-USD"].previousClose` (2 050,18) motsvarar ingen daterad punkt i `state/price_history.json` (2026-11-11: 73 890,50 respektive 2 056,31). **Omfång:** 2 av 2 mynt. **Ersättningskälla:** `state/price_history.json`.
3. **`news-feed-globenewswire-http-403` – ÅTERKOMMANDE.** `feeds.globenewswire` och `feeds.globenewswire-earnings` ger fortfarande `"HTTP 403 – båda försöken (0.1 s)"`. **Omfång:** 2 av 6 flöden. **Ersättningskälla:** websök, mfn och SEC 8-K.
4. **`sec-8k`, observation (ingen defekt ännu):** Nyaste posten är 2026-11-10 22:30 UTC, och förklaringen är Veterans Day, då EDGAR var stängt. **Kontrollera** att flödet har poster daterade 2026-11-12 efter nästa `news.yml`-körning. Gör det inte det är flödet trasigt, och detta blir en åtgärdspunkt.
5. **`macro-calendar-not-verifiable-from-state` – ÅTERKOMMANDE.** KPI-utfall, förväntningar för jobless claims och PPI, FedWatch-odds, räntor och oljepris kommer ur websök, eftersom `^TNX`, `^VIX`, `DX-Y.NYB`, `CL=F` och `^SOX` saknas i `state/prices.json`. SOX-rörelsen (+5,66 %) är därför inte verifierad i state. **Omfång:** samtliga makrovärden.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
