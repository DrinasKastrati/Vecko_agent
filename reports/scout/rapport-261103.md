# Daglig Scout: USA & Krypto
**Datum:** 2026-11-03
**Marknadsklimat:** Det är tisdag före öppning och mellanårsvalet är i dag. Måndagen blev splittrad: Dow steg +0,41 % medan Nasdaq föll −1,07 % och halvledarindex −3,35 %. Det var Nasdaq-100:s inträde i teknisk korrektion, och `^IXIC` ligger nu bara 0,40 % över MA200 (CNBC + Yahoo Finance 2026-11-02). Efter stängning slog både `AAPL` och `PLTR` förväntningarna men föll ändå efterbörs. Kryptot står still under 77 000 efter Binance-hacket. **Aktiva lärdomar tillämpade:** L-3 (åtgärdspunkter sist), L-4 (inga vilande avvisningar att pröva om), L-5 (kalenderns täckning; `FN` läggs till i watchlist) och L-6 (inga klasser utesluts). L-1, L-2, L-7 och L-8 gäller inte scouten.

## Marknadsöversikt

`git pull` 2026-11-03 05:48 UTC (06:48 CET): HEAD = `origin/main` = `9de8a29`. Källan är `state/prices.json` med `generatedAt` 2026-11-03T02:56:39Z, `schemaVersion` 2026-08-02-prevclose, `tickerCount` 305 och `okCount` 300 (Yahoo Finance chart API via GitHub Actions). Måndagens kurser och nyheter **kom in i tid** i dag (`news_feed.json` `generatedAt` 2026-11-02T23:08:00Z).

| Symbol | Senaste verifierade nivå | Rörelse | marketTime |
|---|---|---|---|
| `^GSPC` | 7 541,40 | −0,51 % (7 580,07 → 7 541,40) | 2026-11-02T21:50:59Z |
| `^IXIC` | 25 164,36 | −1,07 % (25 437,00 → 25 164,36) | 2026-11-02T23:18:15Z |
| `BTC-USD` | 76 723,58 | +0,04 % mot daterad punkt 2026-11-02 (76 693,13) | 2026-11-03T02:54:52Z |
| `ETH-USD` | 2 251,47 | +0,08 % mot daterad punkt 2026-11-02 (2 249,75) | 2026-11-03T02:55:12Z |
| `SPY` (sleeve) | 752,10 | −0,48 % (755,72 → 752,10) | 2026-11-02T21:00:00Z |

Kryptorörelserna är räknade mot den daterade punkten i `state/price_history.json`, inte mot `previousClose` (åtgärdspunkt 2). I serien saknas en punkt för söndag 2026-11-01 (åtgärdspunkt 3).

**Måndagens bredd i de hämtade US-symbolerna** (124 symboler med marketTime 2026-11-02 i `state/prices.json`; resten av marknaden är OKONTROLLERAD enligt L-5):
- **Bäst:** `PNR` +6,49 %, `JEF` +4,66 %, `LOW` +4,34 %, `CCL` +4,23 %, `ITW` +4,13 %, `CBOE` +4,08 % och `DAL` +4,08 %.
- **Sämst:** `MRVL` −12,72 %, `CIEN` −11,34 %, `AESI` −10,74 %, `RIG` −10,23 %, `APLD` −8,95 %, `INTC` −8,80 %, `ORCL` −8,76 % och `AMD` −7,52 %.

Rotationen gick från AI-hårdvara och energi till konsument, industri och flyg.

**Teknik** (räknad på råserien i `state/price_history.json`, sista punkt 2026-11-02):
- `^GSPC` ligger 3,13 % över MA200 (7 312,71) ⇒ **regimfiltret för US-boken är fortsatt PÅ**. Kursen ligger under MA50 (7 694,42), RSI 37,8, och det är tredje raka nedgångsdagen.
- `^IXIC` ligger **0,40 % över MA200** (25 063,88), RSI 32,2.

## Ekonomiska siffror & kalender

**Senaste utfall:**
- **ISM tillverkning oktober (2026-11-02): 55,5 mot konsensus ~54,5–54,7. MEST MARKNADSRÖRANDE av senaste utfallen.** Det är högsta nivån sedan juli och tionde månaden med expansion. Produktionen steg till 59,0, högsta sedan november 2021. Nya order 55,5 och prices paid 75,2 mot ~77,5 väntat (investingLive, TheStreet Pro, ISM roundup 2026-11-02). Därmed är förra rapportens datumfråga (11-02 eller 11-03) avgjord: utfallet kom 2026-11-02. Siffrorna kommer ur sekundärkällor och är inte kontrollerade mot ismworld.org, som inte nås härifrån.
- S&P Global PMI tillverkning (slutlig, oktober): 54,9 mot preliminära 56,0 (investingLive 2026-11-02).
- Oförändrat från tidigare: kärn-PCE september 3,1 % å/å, ECI Q3 3,4 % å/å och BNP Q3 +3,4 %.

**Kommande:**
- **I dag 2026-11-03:** **mellanårsvalet i USA**, med marknaderna öppna. JOLTS (september) kommer 10:00 ET (16:00 CET). Datumet har bara en källa (fedratecalc.com) och konsensus gick inte att belägga.
- **Torsdag 2026-11-05:** jobless claims.
- **Fredag 2026-11-06, 08:30 ET (14:30 CET): NFP oktober – VECKANS MEST MARKNADSRÖRANDE.** Konsensus ~65 000 (Reuters via Kitco 2026-10-30, oförändrat). Ett starkt utfall stärker förväntningarna på en höjning i december.
- ADP och ISM tjänster: datumen gick inte att verifiera i dag (åtgärdspunkt 4).

**Rapporter nästa 5 handelsdagar** (`state/earnings_calendar.json`, `generatedAt` 2026-11-03T02:54:35Z, `errors` tomt), US-symboler:
- 11-03: `AMD`, `ANET`, `SMCI`, `AMGN`, `TEVA` och `AMRX`, samt `PCVX` (`isEstimate: true`)
- 11-04: `NVO`, `PAYC`, `PTC`, `QGEN`, `UTHR`, `KHC`, `BKH`, `CXW` och `RIOT`
- 11-05: `AKAM`, `DVN`, `EVCM`, `IREN`, `KMB`, `NET`, `TEAM` och `U`, samt `SYNA` och `WBD` (båda `isEstimate: true`)
- 11-06: `VST`
- 11-09: `ACHR`, `CEG`, `KKR` och `MARA` (`MARA` flyttad från uppskattade 11-04)

**L-5:** kalendern ser bara de symboler `prices.yml` hämtar, så resten av det amerikanska universumet är **OKONTROLLERAT**. Till exempel saknas `PFE` och `MCD` (CNBC 2026-11-01). Alla datum är bevakningsposter enligt punkt 8 och aldrig köpförslag; det gäller särskilt `AMD`/`ANET`/`SMCI` i kväll.

## Aktuella händelser & katalysatorer

- **Palantir Q3 2026 (2026-11-02 efter stängning, bekräftat):** intäkter 2,313 mdr USD (+96 %), EPS 0,44 mot ~0,41. Q4-guiden är 2,649–2,653 mdr mot konsensus ~2,46, och helårsguiden höjs till ~8,53 mdr. Bokningarna (TCV) växte däremot bara +6 % mot +49 % i Q2. Aktien låg ungefär −3 % efterbörs (Palantir SEC 8-K ex. 99.1; Fortune, Motley Fool och CNBC 2026-11-02).
- **Apple Q4 FY26 (2026-11-02 efter stängning, bekräftat):** intäkter 114,5 mdr USD (+12 %) mot ~113,5, EPS 2,10 mot 2,00 och iPhone 57,6 mdr (+17,5 %). Decemberkvartalets bruttomarginalguide är 45–46 % mot ~46,9 % väntat, på grund av minneskostnader. Aktien låg ~−2,8 % till 328,81 kl. 19:59 ET – nivån kommer ur artikeln och används inte som kurs (CNBC live, MacStories och Quartz 2026-11-02). Det var John Ternus första rapport som VD.
- **Marvell köper Lumentum för ~115 mdr USD i aktier (bekräftat 2026-11-02):** `MRVL` −12,72 % och Lumentum −18,59 %. `CIEN` föll −11,34 % i samma rörelse (The Wall Street Republic och Yahoo Finance 2026-11-02). Affären späder ut köparen och sänker målets värde mekaniskt – **inget case**.
- **Oracle tar in 10 mdr USD i aktier och 10 mdr i obligationer för AI-utbyggnaden (2026-11-02):** `ORCL` −8,76 % (samma källor). Detta förstärker oron för skuldfinansierad AI-capex.
- **Fabrinet (2026-11-02 efter stängning):** guiden för innevarande kvartal låg långt över konsensus och aktien steg >10 % efterbörs. **Clorox** +2 % efterbörs på ett Q1-slag (CNBC after-hours movers 2026-11-02).
- **Olja:** `XOM` −4,05 % och `CVX` −3,29 % (prices.json). Sekundärkällor talar om ett oljeras på ~7 % kopplat till fredsförhandlingar mellan USA och Iran (Broad Spectrum Finance, TechFlow 2026-11-03). **Rasets storlek och orsak gick inte att belägga med daterad primärkälla**, och oljepriset finns inte i `prices.json` (åtgärdspunkt 4).
- **Binance-hacket, uppföljning:** Binance säger att de förlorade tillgångarna är fullt återställda med egna medel, och FBI och Secret Service utreder. Reuters rapporterade nettouttag på 3,64 mdr USD, 2,1 % av tillgångarna (Bitcoin.com, Yahoo Finance Morning Minute, Analytics Insight 2026-11-02). Inget kryptocase.

## Uppföljning av tidigare case

- **`CBOE` (rapport-261031): 335,53 → 349,22** (+4,08 %; `state/prices.json` 2026-11-02T21:00:00Z, intervall 334,67–351,58). **Tes INTAKT.** Kandidaten promotades 2026-11-02 och ben 1 (12,5 %) ägs nu av US-boken. Ben 2 ≤ 325,00 är inte triggad.
- **`CVX` (rapport-261031): 235,52 → 227,77** (−3,29 %; `state/prices.json` 2026-11-02T21:02:08Z). **Tes FÖRSVAGAD** av oljeraset. Kandidaten avvisades 2026-11-02 på grind 5.

(Rapport-261101 och -261102 hade inga egna case.)

**Kandidatkön (`state/scout_candidates.json`) före dagens tillägg:** 103 poster, varav 95 `rejected`, 8 `promoted` och **0 `new`**. Ingen avvisning vilar på en tillfällig dataspärr som har hunnit fyllas ⇒ **L-4 ger ingen omprövning.**

**Pending i US-boken:** `NUE` ≤ 262,00 (dagslägsta 276,225), `AXGN` ≤ 46,00 (49,04) och `CBOE` ben 2 ≤ 325,00 (334,67) är alla **EJ TRIGGADE** i sessionen 2026-11-02 (`state/prices.json`).

## Dagens case

### Case 1: Palantir Technologies (PLTR / NASDAQ)
**Katalysator:** Q3 2026, släppt 2026-11-02 efter stängning (bekräftat). Intäkterna växte +96 % till 2,313 mdr USD, och för första gången var US commercial (984 MUSD) större än US government (953 MUSD). EPS 0,44 mot ~0,41. Q4-guiden 2,649–2,653 mdr ligger ~7–8 % över konsensus (~2,46), och FY26-guiden höjs till ~8,53 mdr (~+91 %) (Palantir SEC 8-K ex. 99.1; Fortune och Motley Fool 2026-11-02).
**Bull case:** Tillväxten accelererar fortfarande i en skala över 2 mdr per kvartal, och guiden höjs kraftigt. Den kommersiella affären är nu större än den statliga, vilket breddar intäktsbasen.
**Bear case:** Bokningarna (TCV +6 % mot +49 % i Q2) bromsar och kan föregå svagare tillväxt. Värderingen är ~114× FY26-vinsten (TipRanks 2026-11-02), och aktien föll efterbörs trots beatet – det är "sell the news" i en AI-korrektion. Nasdaq ligger bara 0,40 % över MA200.
**Setup:** Senaste verifierade kurs **178,34** (reguljär stängning, marketTime 2026-11-02T21:00:00Z, `state/prices.json`). Den är **PRE-event**, och någon efterbörskurs finns inte i filen ⇒ `price: null` i kandidatkön. Kursen ligger 16,13 % över MA200 (153,57) men under MA50 (186,87), RSI 37,7, och 250d-högsta 209,05 ligger 17 % ovanför. Kandidat `261103-PLTR` (`confirmed: true`). US-boken avgör den mot de fem grindarna; `prices.yml` fyller i en kvalificerad post-event-kurs.

### Case 2: Apple (AAPL / NASDAQ)
**Katalysator:** Q4 FY26, släppt 2026-11-02 efter stängning (bekräftat). Intäkterna var rekordhöga för septemberkvartalet, 114,5 mdr USD (+12 %) mot ~113,46. EPS 2,10 mot 2,00. iPhone 57,6 mdr (+17,5 %) och tjänster 31,6 mdr (+10 %, rekord) (Apple SEC 8-K ex. 99.1; MacStories, Quartz och CNBC 2026-11-02).
**Bull case:** iPhone-cykeln är stark trots begränsat utbud: kvartalet innehåller bara åtta dagar av iPhone 18 Pro och inget av iPhone Duo. Det talar för ett starkt decemberkvartal i volym.
**Bear case:** Marginalguiden 45–46 % ligger under väntade ~46,9 %, eftersom minneskostnaderna stiger. Q4-marginalen 47,9 % lyftes dessutom ~1 punkt av tullåterbetalningar. Aktien föll ~2–4 % efterbörs, och det är den nye VD:ns första rapport.
**Setup:** Senaste verifierade kurs **338,32** (reguljär stängning, marketTime 2026-11-02T21:00:01Z, `state/prices.json`). Den är **PRE-event** ⇒ `price: null`. Kursen ligger 13,93 % över MA200 (296,96) och 1,41 % över MA50 (333,62), RSI 47,9, och 250d-högsta 348,91 ligger 3 % ovanför. Kandidat `261103-AAPL` (`confirmed: true`).

### Case 3: Fabrinet (FN / NYSE)
**Katalysator:** kvartalsrapporten 2026-11-02 efter stängning (bekräftad). Guiden för innevarande kvartal låg "långt över" konsensus, och aktien steg >10 % efterbörs (CNBC after-hours movers 2026-11-02). **De exakta siffrorna gick inte att verifiera ur primärkälla.**
**Bull case:** Fabrinet gör optisk paketering för AI-nätverk. En stark guide samma dag som Marvell–Lumentum-affären pekar på fortsatt efterfrågan på optiska komponenter. Rörelsen går mot sektorn – det är just en sådan relativ styrka som är värd att mäta.
**Bear case:** Sektorn föll 11–19 % samma dag (`MRVL`, `CIEN`, Lumentum). Siffrorna är obelagda och kunden är koncentrerad till ett fåtal stora nätverksbolag.
**Setup:** **KURS EJ VERIFIERAD** – `FN` saknas i `state/prices.json` och i `state/price_history.json`. Den är tillagd i `config/watchlist_us.txt` i dag, så kurs och serie börjar hämtas vid nästa körning. Grind 2 är omätbar tills serien har vuxit eller backfillen har kört (åtgärdspunkt 5). Kandidat `261103-FN` med `price: null`.

## Makro- & sektorfaktorer att bevaka

**Räntor:** ISM 55,5 bekräftar en stark tillverkningssektor men med höga priser (75,2). Lägg till kärn-PCE 3,1 % och BNP 3,4 %, och marknaden fortsätter att diskutera en Fed-**höjning** i december. Det är motvind för långduration-tillväxt och krypto. DXY och statsobligationsräntorna gick inte att verifiera (åtgärdspunkt 4).

**Regim:** `^GSPC` ligger 3,13 % över MA200 – regimen är PÅ, men marginalen krymper (3,70 % i fredags). **`^IXIC` ligger 0,40 % över sin MA200 – en dag till av måndagens slag bryter den.** Bryter `^GSPC` MA200 får US-boken inga nya positioner.

**Sektorrotation:** pengarna går från AI-hårdvara och halvledare (SOX −3,35 %) och nu även energi (olja ned) till konsument (`LOW`, `HD`, `WMT`), industri (`ITW`, `PNR`), flyg/resor (`DAL`, `CCL`) och finansiell infrastruktur (`CBOE`, `JEF`, `KKR`). Ett lägre oljepris är medvind för flyg och konsument.

**Binära händelser:** valet i dag, `AMD`/`ANET`/`SMCI` i kväll och NFP på fredag. Inget av dagens case får köpas *in i* en händelse (punkt 8). Casen bygger på redan släppta rapporter.

**Krypto:** BTC 5,98 % och ETH 5,56 % över MA200, båda med RSI ~35–37. Utflödena efter hacket och höjningsrisken talar emot ett kryptocase.

**Watchlist-hygien:** `config/watchlist_us.txt` bär långt fler symboler än riktmärket 25, men ingen rensning görs i dag. Veckans rapportbolag, CBOE-innehavet, de tre pending-planerna, dagens tre kandidater och besluten inom utvärderingens 20-dagarsfönster skyddas enligt `prompts/gemensam_korning.md`. Enda ändringen är tillägget av `FN`.

### Åtgärdspunkter till Dren (L-3)

1. **`scheduled-actions-not-firing` – ÅTERKOMMANDE, men i dag utan effekt.** Kurser (`generatedAt` 02:56Z) och nyheter (23:08Z) var färska när scouten körde. Detta noteras bara för att punkten är öppen i `state/action_items.json`.
2. **`crypto-previousclose-misdated` – ÅTERKOMMANDE.** `quotes["BTC-USD"].previousClose` är 78 248,45 mot daterad punkt 2026-11-02 76 693,13, och `ETH-USD` 2 273,05 mot 2 249,75. Fältet ger −1,95 % respektive −0,95 % i stället för +0,04 % respektive +0,08 %. **Omfång:** 2 av 2 mynt. **Ersättningskälla:** `state/price_history.json`.
3. **`crypto-weekend-not-priced` – ÅTERKOMMANDE (tredje rapporten).** `state/price_history.json` saknar punkten 2026-11-01 för `BTC-USD` och `ETH-USD`, eftersom `prices.yml` bara har `* * 1-5`-crons. **Omfång:** 2 av 2 mynt, 1 av 7 dygnspunkter per vecka (söndag) plus en inaktuell lördag. **Föreslagen fix:** en helgcron som bara hämtar `*-USD`.
4. **`macro-calendar-not-verifiable-from-state` – ÅTERKOMMANDE.** ISM-värdet, JOLTS-datumet, oljeraset och NFP-konsensus kommer ur websök. ADP- och ISM-tjänsters datum gick inte att belägga. `www.sec.gov` och `www.cnbc.com` gav DNS-fel i tunneln (`ENOTFOUND`), och olja (`CL=F`/`BZ=F`), DXY (`DX-Y.NYB`) och 10-årsräntan (`^TNX`) saknas i `state/prices.json`. **Omfång:** samtliga makrovärden + 4 makrosymboler. **Föreslagen fix:** lägg till `CL=F`, `DX-Y.NYB` och `^TNX` i `config/watchlist_us.txt` samt `sec.gov`, `cnbc.com`, `bls.gov`, `ismworld.org` och `finance.yahoo.com` i miljöns nätverksinställningar.
5. **`earnings-calendar-coverage` – L-5.** `FN` rapporterade utan att finnas i kalendern eller i `prices.json`, och den läggs till först i efterhand – samma mönster som PLTR 2026-08. Även `PFE`, `MCD` och `CLX` saknas. **Omfång:** hela US-universumet utanför de ~124 hämtade US-symbolerna är OKONTROLLERAT.
6. **`news-feed-globenewswire-http-403` – kvarstår.** `feeds.globenewswire` och `feeds.globenewswire-earnings` ger `"HTTP 403 – båda försöken (0.0 s)"`. **Omfång:** 2 av 6 flöden. **Ersättningskälla:** websök.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
