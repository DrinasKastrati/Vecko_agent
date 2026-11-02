# Daglig Scout: USA & Krypto
**Datum:** 2026-11-02
**Marknadsklimat:** Det är måndag före öppning. Futures steg under söndagskvällen (S&P 500 +0,5 %, Nasdaq-100 +0,9 %) efter fredagens AI-ras, då `^IXIC` föll −2,86 % och halvledarindex −7,2 % (CNBC 2026-11-01). Veckan staplar binära händelser: `AAPL`/`PLTR` i kväll, mellanårsvalet och `AMD`/`ANET` i morgon, NFP på fredag. Kryptot ligger kvar på låga nivåer efter Binance-hacket, men kurserna går inte att verifiera efter lördag 00:45 UTC. **Aktiva lärdomar tillämpade:** L-3 (åtgärdspunkter sist), L-4 (inga vilande avvisningar att pröva om), L-5 (kalenderns täckning) och L-6 (inga klasser utesluts). L-1, L-2, L-7 och L-8 gäller inte scouten.

## Marknadsöversikt

`git pull` 2026-11-02 05:48 UTC (06:48 CET), ny kontroll 05:50 UTC: `origin/main` = `68b8ed6`. Källan är `state/prices.json` med `generatedAt` 2026-10-31T00:47:18Z, `schemaVersion` 2026-08-02-prevclose, `tickerCount` 298 och `okCount` 293 (Yahoo Finance chart API via GitHub Actions). **Måndagens 05:09 UTC-körning av `prices.yml` hade inte committat vid 05:50 UTC** (åtgärdspunkt 1). Ingen amerikansk session har handlats sedan fredag, så aktie- och indexnivåerna nedan är fortsatt de senaste.

| Symbol | Senaste verifierade nivå | Rörelse | marketTime |
|---|---|---|---|
| `^GSPC` | 7 580,07 | −1,82 % fredag (7 720,39 → 7 580,07) | 2026-10-30T20:47:43Z |
| `^IXIC` | 25 437,00 | −2,86 % fredag (26 184,72 → 25 437,00) | 2026-10-30T21:15:59Z |
| `BTC-USD` | 77 273,34 (**inaktuell, ~53 h**) | +0,41 % mot daterad punkt 2026-10-30 (76 955,32) | 2026-10-31T00:45:34Z |
| `ETH-USD` | 2 245,92 (**inaktuell, ~53 h**) | +0,47 % mot daterad punkt 2026-10-30 (2 235,48) | 2026-10-31T00:45:51Z |
| `SPY` (sleeve) | 755,72 | −1,77 % fredag | 2026-10-30T20:00:00Z |

**Krypto – KURS EJ VERIFIERAD för lördagen, söndagen och måndag morgon.** Reservkällan `query1.finance.yahoo.com` gav `CONNECT tunnel failed, response 403`, och detsamma gällde `api.coinbase.com`. Nivåer ur nyhetsartiklar används inte som kurs. Rörelsen är räknad mot den daterade punkten i `state/price_history.json`, inte mot `previousClose` (åtgärdspunkt 4). Futuresnivåerna i klimatraden är rörelser ur CNBC och används inte som kurs.

**Teknik** (oförändrad sedan rapport-261031, eftersom ingen ny stängning har kommit): `^GSPC` ligger 3,70 % över MA200 (7 309,73) ⇒ **regimfiltret för US-boken är fortsatt PÅ**, men kursen ligger under EMA20 och EMA50, RSI 40,1. `^IXIC` ligger 1,52 % över MA200 (25 055,71), RSI 34,7.

**Normaltid gäller nu i båda regionerna:** New York öppnar 14:30 UTC = 15:30 CET, och data som släpps 08:30 ET kommer 14:30 CET. US-rotationen (15:00 CET) kör före öppning.

## Ekonomiska siffror & kalender

**Senaste utfall** (oförändrat, inga releaser under helgen):
- **Kärn-PCE september (2026-10-29):** +0,3 % m/m och 3,1 % å/å, i linje med konsensus (CNBC 2026-10-29).
- **ECI Q3 (2026-10-30):** +0,8 % k/k, i linje; 3,4 % å/å (BLS 2026-10-30).
- **BNP Q3 (2026-10-29):** +3,4 % annualiserat mot 3,2 %. **Jobless claims:** 194 000 mot 199 000 (rapport-261030).

**Kommande:**
- **I dag 2026-11-02, 10:00 ET (16:00 CET):** ISM tillverkning (oktober). Datumet följer ISM:s regel om första bankdagen; Continuum Economics förhandsgranskning anger däremot "due November 3". **Datumet är motsägelsefullt och inte verifierat ur primärkälla** (åtgärdspunkt 2). Ingen konsensus gick att belägga.
- **Tisdag 2026-11-03:** **mellanårsvalet i USA.** Marknaderna är öppna. Utfallet bevakas för tillsynen av banker och kryptobolag samt AI-regleringen (Reuters via Kitco 2026-10-30).
- **Torsdag 2026-11-05:** jobless claims.
- **Fredag 2026-11-06, 08:30 ET (14:30 CET): NFP oktober – VECKANS MEST MARKNADSRÖRANDE.** Konsensus ~65 000 efter septembers 29 000. Ett starkt utfall stärker förväntningarna på en Fed-höjning i december (Reuters via Kitco 2026-10-30). KPI oktober kommer 2026-11-10.

**Rapporter nästa 5 handelsdagar** (`state/earnings_calendar.json`, `generatedAt` 2026-10-31T00:45:17Z, `errors` tomt), US-symboler:
- 11-02: `AAPL`, `PLTR`, `RIG`, `RHP`, `CRGY` och `AESI`
- 11-03: `AMD`, `ANET`, `SMCI`, `TEVA` och `AMRX`, samt `PCVX` (`isEstimate: true`)
- 11-04: `NVO`, `PAYC`, `PTC`, `QGEN`, `UTHR`, `KHC`, `BKH`, `CXW` och `RIOT`, samt `MARA` (`isEstimate: true`)
- 11-05: `AKAM`, `DVN`, `EVCM`, `IREN`, `NET`, `TEAM` och `U`, samt `SYNA` och `WBD` (båda `isEstimate: true`)
- 11-06: `VST`

CNBC nämner även Pfizer och McDonald's bland veckans rapporter (CNBC 2026-11-01); `PFE` och `MCD` finns inte i `config/watchlist_us.txt` och därför inte i kalendern. **L-5:** kalendern ser bara de symboler `prices.yml` hämtar, så resten av det amerikanska universumet är **OKONTROLLERAT**. Alla datum är bevakningsposter enligt punkt 8 och aldrig köpförslag.

## Aktuella händelser & katalysatorer

- **Futures upp inför veckan (CNBC 2026-11-01; FX Leaders 2026-11-01):** S&P 500 +0,5 %, Nasdaq-100 +0,9 % och Dow +186 punkter på söndagskvällen. Under förra veckan föll Nasdaq Composite 2 %, Dow 0,85 % och S&P 500 0,57 %; fredagen blev Nasdaq-100:s sämsta dag sedan juni (−3,5 %).
- **Binance-hacket (bekräftat 2026-10-29), uppföljning:** Binance har avsatt 6,34 mdr USD för att täcka förlusterna. Uttagen var stoppade "till omkring söndag" (Motley Fool 2026-10-30). **Att uttagen faktiskt har öppnats igen gick inte att belägga med daterad källa.** Spot-ETF:erna för BTC och ETH hade ~800 MUSD i utflöden 2026-10-30 (SoSoValue via The Crypto Times 2026-10-31). Det är ett negativt flöde – inget case.
- **Inga nya bekräftade bolagskatalysatorer under helgen.** `state/news_feed.json` (`generatedAt` 2026-10-30T23:00:03Z) är inte uppdaterad sedan fredag kväll, eftersom `news.yml` bara kör på vardagar (första måndagskörningen 05:17 UTC hade inte committat vid 05:50 UTC). Fönstret täcker **10 av 10 handelsdagar** (2026-10-19 – 2026-10-30, `missingDays` tomt). En websökning efter M&A daterade 2026-11-02 gav inga träffar.

## Uppföljning av tidigare case

- **`CBOE` (rapport-261031): 335,53 → 335,53** (±0,00 %; `state/prices.json` 2026-10-30T20:00:00Z – ingen session sedan dess). **Tes INTAKT.** Kandidat `261031-CBOE` står kvar som `new` och avgörs av US-boken i dag 15:00 CET.
- **`CVX` (rapport-261031): 235,52 → 235,52** (±0,00 %; `state/prices.json` 2026-10-30T20:02:24Z). **Tes INTAKT**, men RSI 72,9 ligger nära grind 3-taket. Kandidat `261031-CVX` står kvar som `new` och avgörs av US-boken i dag.

(Rapport-261101 hade inga egna case; uppföljningen avser de senaste redovisade casen.)

**Kandidatkön (`state/scout_candidates.json`):** 103 poster, varav 94 `rejected`, 7 `promoted` och **2 `new`** (`261031-CBOE` och `261031-CVX`, båda `expiresAt` 2026-11-06). Ingen post är försenad. Det finns inga avvisningar på en tillfällig dataspärr ⇒ **L-4 ger ingen omprövning.** Inga nya poster skrivs i dag.

**Pending i US-boken:** `NUE` ≤ 262,00 och `AXGN` ≤ 46,00 är fortsatt EJ TRIGGADE: dagslägsta 2026-10-30 var 268,75 respektive 48,08 (`state/prices.json`).

## Dagens case

**Inga nya case i dag.** Ingen session har handlats sedan rapport-261031, ingen ny bekräftad katalysator har publicerats och kryptokurserna går inte att verifiera. Dagens enda kända händelser är rapporterna från `AAPL` och `PLTR` efter stängning – de får inte köpas in i (punkt 8). Fredagens två case ligger redan i kandidatkön och avgörs av US-boken i dag.

## Makro- & sektorfaktorer att bevaka

**Varför avvaktande:** veckan staplar binära händelser. Futures-studsen på söndagen är en reaktion på fredagens ras, inte en ny katalysator. Reaktionerna i morgon och på onsdag morgon på `AAPL`/`PLTR` respektive `AMD`/`ANET`/`SMCI` blir veckans case-råvara.

**Räntor:** kärn-PCE 3,1 %, ECI 3,4 % och BNP 3,4 % utan att arbetsmarknaden försvagas. Marknaden diskuterar en **höjning** i december. Det är motvind för långduration-tillväxt och krypto. DXY och statsobligationsräntorna gick inte att verifiera.

**Regim:** `^GSPC` 3,70 % över MA200 och `^IXIC` 1,52 % över. **Bryter `^GSPC` MA200 slår regimfiltret av och US-boken får inga nya positioner.**

**Sektorrotation:** från halvledare och AI-infrastruktur till energi (`XOM`, `CVX`), defensiva (`PEP`, `VZ`) och finansiell infrastruktur (`CBOE`).

**Krypto:** Binance-hacket, ETF-utflöden och den möjliga tillsynsrisken efter valet talar emot ett kryptocase.

**Watchlist-hygien:** `config/watchlist_us.txt` bär långt fler symboler än riktmärket 25, men ingen rensning görs i dag: veckans rapportbolag, de två kandidaterna, pending-planerna och besluten inom utvärderingens 20-dagarsfönster skyddas enligt `prompts/gemensam_korning.md`, och de skyddade mängderna kan inte räknas ut säkert före veckans US-rotation.

### Åtgärdspunkter till Dren (L-3)

1. **`scheduled-actions-not-firing` – ÅTERKOMMANDE.** `prices.yml`:s cron `9 5 * * 1-5` och `news.yml`:s `17 5-21/2 * * 1-5` hade inte committat vid 05:50 UTC i dag (`state/prices.json` `generatedAt` 2026-10-31T00:47:18Z, `state/news_feed.json` 2026-10-30T23:00:03Z). **Omfång:** 298 av 298 kurssymboler och 6 av 6 nyhetsflöden är kvar på fredagsläget när scouten kör. Rotationerna (08:40 och 15:00 CET) ska kontrollera `generatedAt` innan de läser filen; `06:09`-cronen är reserv.
2. **`macro-calendar-not-verifiable-from-state` – ÅTERKOMMANDE.** ISM-datumet är motsägelsefullt (regeln om första bankdagen ger 11-02, Continuum anger 11-03), och samtliga makrovärden kommer ur websök. `query1.finance.yahoo.com` och `api.coinbase.com` ger 403 i tunneln. **Omfång:** samtliga makrovärden + 2 av 2 kryptokurser. Lägg till `finance.yahoo.com`, `query1.finance.yahoo.com`, `bls.gov`, `bea.gov`, `ismworld.org` och `sec.gov` i miljöns nätverksinställningar.
3. **`crypto-weekend-not-priced` – ÅTERKOMMANDE (andra rapporten).** `prices.yml` har bara `* * 1-5`-crons, så `BTC-USD`/`ETH-USD` står still från lördag 00:45 UTC till måndagens första körning – i dag ~53 timmar. **Omfång:** 2 av 2 mynt, ≈ 3 av 7 scoutkörningar per vecka. **Ersättningskälla:** ingen. **Föreslagen fix:** en helgcron som bara hämtar `*-USD`.
4. **`crypto-previousclose-misdated` – ÅTERKOMMANDE.** `quotes["BTC-USD"].previousClose` 77 775,11 mot daterad punkt 76 955,32; `ETH-USD` 2 249,50 mot 2 235,48. Fältet ger fel tecken för båda. **Omfång:** 2 av 2 mynt. **Ersättningskälla:** `state/price_history.json`.
5. **`news-feed-globenewswire-http-403` – kvarstår.** `feeds.globenewswire` och `feeds.globenewswire-earnings` är `"HTTP 403 – båda försöken (0.0 s)"`. **Omfång:** 2 av 6 flöden. **Ersättningskälla:** websök.
6. **`earnings-calendar-coverage` – L-5.** Kalendern täcker bara de hämtade symbolerna; till exempel saknas `PFE` och `MCD`, som rapporterar denna vecka enligt CNBC. Resten av US-universumet är OKONTROLLERAT.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
