# Daglig Scout: USA & Krypto
**Datum:** 2026-11-01
**Marknadsklimat:** Det är söndag. De amerikanska börserna har varit stängda sedan fredagens session 2026-10-30, då `^IXIC` föll −2,86 % och `^GSPC` −1,82 %. Kryptot ligger kvar på låga nivåer efter Binance-hacket, men det går inte att verifiera någon kurs för helgen. Veckan som kommer bär tre binära händelser i följd: rapporterna från `AAPL`/`PLTR` på måndag, mellanårsvalet och rapporterna från `AMD`/`ANET` på tisdag, samt NFP på fredag. **Aktiva lärdomar tillämpade:** L-3 (åtgärdspunkter sist), L-4 (inga vilande avvisningar att pröva om), L-5 (kalenderns täckning) och L-6 (inga klasser utesluts). L-1, L-2, L-7 och L-8 gäller inte scouten.

## Marknadsöversikt

`git pull` 2026-11-01 05:48 UTC (06:48 CET) gav `origin/main` = `9fd9dad` (`Veckans rörelser: 2026-10-31 12:26 UTC`). Källan är `state/prices.json` med `generatedAt` 2026-10-31T00:47:18Z, `schemaVersion` 2026-08-02-prevclose, `tickerCount` 298 och `okCount` 293 (Yahoo Finance chart API via GitHub Actions). **Filen är oförändrad sedan i går:** `prices.yml` kör bara mån–fre.

| Symbol | Senaste verifierade nivå | Rörelse | marketTime |
|---|---|---|---|
| `^GSPC` | 7 580,07 | −1,82 % fredag (7 720,39 → 7 580,07) | 2026-10-30T20:47:43Z |
| `^IXIC` | 25 437,00 | −2,86 % fredag (26 184,72 → 25 437,00) | 2026-10-30T21:15:59Z |
| `BTC-USD` | 77 273,34 (**inaktuell, ~29 h**) | +0,41 % mot daterad punkt 2026-10-30 (76 955,32) | 2026-10-31T00:45:34Z |
| `ETH-USD` | 2 245,92 (**inaktuell, ~29 h**) | +0,47 % mot daterad punkt 2026-10-30 (2 235,48) | 2026-10-31T00:45:51Z |
| `SPY` (sleeve) | 755,72 | −1,77 % fredag | 2026-10-30T20:00:00Z |

**Krypto – KURS EJ VERIFIERAD för lördagen och söndagen.** Den senaste punkten i `state/prices.json` är från lördag 00:45 UTC. Båda reservkällorna föll: `query1.finance.yahoo.com` gav `CONNECT tunnel failed, response 403`, och `finance.yahoo.com` gick inte att slå upp (`getaddrinfo ENOTFOUND`, värden ligger utanför sessionens tillåtna nätdomäner). Nyhetssajternas nivåer från lördagen används inte som kurs (prompten förbjuder kurser ur artiklar). Tabellen anger därför den senaste verifierade punkten, och den är märkt inaktuell (åtgärdspunkt 1). Rörelsen är räknad mot den daterade punkten i `state/price_history.json`, inte mot `previousClose` (åtgärdspunkt 4).

**Teknik** (oförändrad sedan rapport-261031, eftersom ingen ny stängning har kommit): `^GSPC` ligger 3,70 % över MA200 (7 309,73) ⇒ **regimfiltret för US-boken är fortsatt PÅ**, men kursen ligger under EMA20 och EMA50, RSI 40,1, och MACD-histogrammet fördjupas. `^IXIC` ligger bara 1,52 % över MA200 (25 055,71), RSI 34,7. `BTC-USD` och `ETH-USD` ligger under EMA20 och EMA50 men 6,9 % respektive 5,4 % över MA200.

**Klockan ställs om:** USA går över till normaltid i dag (2026-11-01), och Europa gjorde det 2026-10-25. Från måndag öppnar New York 14:30 UTC = **15:30 CET**, och data som släpps 08:30 ET kommer 13:30 UTC = 14:30 CET (simianx.ai 2026-10-23). **US-rotationen kör 15:00 CET och alltså en halvtimme FÖRE öppning.** Det är samma läge som rotationen är byggd för (den kör före sin marknads öppning).

## Ekonomiska siffror & kalender

**Senaste utfall** (oförändrat, inga releaser under helgen):
- **Kärn-PCE september (2026-10-29):** +0,3 % m/m och 3,1 % å/å, i linje med konsensus och den högsta takten sedan maj. Totalt PCE 3,6 % å/å (CNBC 2026-10-29).
- **ECI Q3 (2026-10-30):** +0,8 % k/k, i linje med konsensus; 3,4 % å/å (BLS 2026-10-30).
- **BNP Q3 (2026-10-29):** +3,4 % annualiserat mot 3,2 %. **Jobless claims:** 194 000 mot 199 000 (rapport-261030).

**Kommande:**
- **Måndag 2026-11-02:** ISM tillverkning (oktober). Datumet är inte verifierat ur primärkälla (åtgärdspunkt 2).
- **Tisdag 2026-11-03:** **mellanårsvalet i USA.** Aktie- och obligationsmarknaderna är öppna som vanligt (simianx.ai 2026-10-23). Investerare bevakar om ett demokratiskt maktövertag skulle ge hårdare tillsyn av banker och kryptobolag, och vad utfallet betyder för AI-regleringen (Reuters via Kitco 2026-10-30; The Star 2026-10-31).
- **Torsdag 2026-11-05:** jobless claims.
- **Fredag 2026-11-06, 08:30 ET (14:30 CET): NFP oktober – VECKANS MEST MARKNADSRÖRANDE.** Konsensus är ~65 000 nya jobb efter septembers 29 000. Ett starkt utfall kan förstärka förväntningarna på en Fed-**höjning** i december (Reuters via Kitco 2026-10-30; KuCoin-sammanställning 2026-10-31). KPI oktober kommer tisdag 2026-11-10 (simianx.ai).
- Bank of England och Reserve Bank of Australia har räntebesked under veckan (Reuters via Kitco 2026-10-30).

**Rapporter nästa 5 handelsdagar** (`state/earnings_calendar.json`, `generatedAt` 2026-10-31T00:45:17Z, `errors` tomt), US-symboler:
- 11-02: `AAPL`, `PLTR`, `RIG`, `RHP`, `CRGY` och `AESI`
- 11-03: `AMD`, `ANET`, `SMCI`, `TEVA` och `AMRX`, samt `PCVX` (`isEstimate: true`)
- 11-04: `NVO`, `PAYC`, `PTC`, `QGEN`, `UTHR`, `KHC`, `BKH`, `CXW` och `RIOT`, samt `MARA` (`isEstimate: true`)
- 11-05: `AKAM`, `DVN`, `EVCM`, `IREN`, `NET`, `TEAM` och `U`, samt `SYNA` och `WBD` (båda `isEstimate: true`)
- 11-06: `VST`

Förväntningarna enligt Reuters: Apple ~113 mdr USD i intäkter och AMD ~13 mdr USD, där fokus ligger på Helios-skåpet och MI450 (Reuters via Kitco 2026-10-30). **L-5:** kalendern ser bara de symboler `prices.yml` hämtar, så resten av det amerikanska universumet är **OKONTROLLERAT**. Samtliga symboler ovan finns redan i `config/watchlist_us.txt`. Alla datum är bevakningsposter enligt punkt 8 och aldrig köpförslag.

## Aktuella händelser & katalysatorer

- **Inga nya bolagskatalysatorer under helgen.** `state/news_feed.json` (`generatedAt` 2026-10-30T23:00:03Z) har inte uppdaterats sedan fredag kväll, eftersom `news.yml` bara kör på vardagar. Fönstret täcker **10 av 10 handelsdagar** (2026-10-19 – 2026-10-30, `missingDays` tomt).
- **Binance-hacket (bekräftat 2026-10-29), uppföljning:** omfånget anges till ~6,3 mdr USD, ungefär 4 % av de ~144 mdr USD som fanns på plattformen före hacket (DefiLlama via Yahoo Finance/CoinDesk 2026-10-30). Chainalysis och ZachXBT pekar på Lazarus-gruppen, men **⚠️ attributionen är INTE BEKRÄFTAD** (CoinDesk 2026-10-30; sammanställning av tech-insider.org). Spot-ETF:erna för BTC och ETH hade sammanlagt **~800 MUSD i utflöden** 2026-10-30 enligt SoSoValue (The Crypto Times 2026-10-31). Det är ett negativt flöde – inget case.
- **AI-kedjan inför veckan:** Reuters beskriver marknaden som "AI-wary" efter de svaga rapporterna från Alphabet och Amazon och Intels fall på ~29 %. Vinsterna steg ändå i snitt med ~31 % för halva S&P 500 som hunnit rapportera (Reuters via Kitco 2026-10-30).
- Fredagens händelser (`INTC` −28,58 %, `RDDT` −29,22 %, `CBOE`-, `CVX`- och `XOM`-rapporterna) står i rapport-261031 och upprepas inte här.

## Uppföljning av tidigare case

- **`CBOE` (rapport-261031): 335,53 → 335,53** (±0,00 %; `state/prices.json` 2026-10-30T20:00:00Z – ingen session sedan dess). **Tes INTAKT.** Kandidat `261031-CBOE` står kvar som `new` och avgörs av US-boken måndag 2026-11-02.
- **`CVX` (rapport-261031): 235,52 → 235,52** (±0,00 %; `state/prices.json` 2026-10-30T20:02:24Z). **Tes INTAKT**, men RSI 72,9 ligger nära grind 3-taket. Kandidat `261031-CVX` står kvar som `new` och avgörs av US-boken måndag.

**Kandidatkön (`state/scout_candidates.json`):** 103 poster, varav 94 `rejected`, 7 `promoted` och **2 `new`** (`261031-CBOE` och `261031-CVX`, båda `expiresAt` 2026-11-06). Ingen post är försenad, och US-boken har inte kört sedan de skrevs. Det finns inga avvisningar på en tillfällig dataspärr ⇒ **L-4 ger ingen omprövning.** Inga nya poster skrivs i dag.

**Innehav och pending (`state/portfolj_us.md`):** inga aktieinnehav, och `SPY` ligger på 100 %. Pending `NUE` ≤ 262,00 och `AXGN` ≤ 46,00 är fortsatt EJ TRIGGADE: dagslägsta 2026-10-30 var 268,75 respektive 48,08.

## Dagens case

**Inga nya case i dag.** Ingen session har handlats och ingen ny bekräftad katalysator har publicerats sedan rapport-261031. Nyhetsflödet är inte uppdaterat och kryptokurserna går inte att verifiera. Fredagens två case (`CBOE` och `CVX`) ligger redan i kandidatkön och väntar på US-bokens avgörande. Att skapa nya case på inaktuella kurser eller på kommande rapporter (punkt 8) vore att tvinga fram dem – skälen står under Makro nedan.

## Makro- & sektorfaktorer att bevaka

**Varför avvaktande:** veckan staplar binära händelser. `AAPL` och `PLTR` rapporterar måndag kväll, `AMD`/`ANET`/`SMCI` och mellanårsvalet ligger på tisdag, och NFP kommer fredag. Ingen av dem får köpas in i (punkt 8). Reaktionerna från tisdag morgon och onsdag morgon blir veckans case-råvara.

**Räntor:** kärn-PCE 3,1 %, ECI 3,4 % och BNP 3,4 % utan att arbetsmarknaden försvagas. Marknaden diskuterar en **höjning** i december, inte en sänkning. Det är motvind för långduration-tillväxt och krypto. DXY och statsobligationsräntorna för 2026-10-30 gick inte att verifiera.

**Regim:** `^GSPC` 3,70 % över MA200 och `^IXIC` 1,52 % över. En ny dag som fredag (−1,8 % till −2,9 %) skulle föra Nasdaq under MA200 och halvera S&P:s marginal. **Bryter `^GSPC` MA200 slår regimfiltret av och US-boken får inga nya positioner.**

**Sektorrotation:** från halvledare och AI-infrastruktur till energi (`XOM`, `CVX`), defensiva (`PEP`, `VZ`) och finansiell infrastruktur (`CBOE`) – dagens kandidater ligger i de sektorer som har medvind.

**Krypto:** Binance-hacket, ETF-utflöden på ~800 MUSD och den möjliga tillsynsrisken efter valet talar emot ett kryptocase. Båda mynten ligger under EMA20/EMA50.

**Geopolitik:** inget verifierat i dag utöver valet.

### Åtgärdspunkter till Dren (L-3)

1. **`crypto-weekend-not-priced` – NY.** `state/prices.json` (`generatedAt` 2026-10-31T00:47:18Z) uppdateras inte på helger, eftersom samtliga crons i `prices.yml` har `* * 1-5`. `BTC-USD` och `ETH-USD` handlas dygnet runt, men den senaste verifierade punkten är 29 timmar gammal när söndagsscouten kör. **Omfång:** 2 av 2 mynt, varje lördag och söndag (≈ 2/7 av scoutens körningar). **Ersättningskälla:** ingen – båda reservkällorna är blockerade (åtgärdspunkt 2), så krypto blir KURS EJ VERIFIERAD. **Föreslagen fix:** en helgcron i `prices.yml` som bara hämtar `*-USD` (till exempel `17 5 * * 0,6`) – två symboler, ingen throttling-risk.
2. **`macro-calendar-not-verifiable-from-state` – ÅTERKOMMANDE.** `finance.yahoo.com` ger `ENOTFOUND` och `query1.finance.yahoo.com` ger 403 i tunneln. ISM- och NFP-datumen samt samtliga makrovärden kommer ur websök. **Omfång:** samtliga makrovärden + 2 av 2 kryptokurser i dag. Lägg till `finance.yahoo.com`, `query1.finance.yahoo.com`, `bls.gov`, `bea.gov` och `sec.gov` i miljöns nätverksinställningar.
3. **`news-feed-globenewswire-http-403` – kvarstår.** `feeds.globenewswire` och `feeds.globenewswire-earnings` är båda `"HTTP 403 – båda försöken (0.0 s)"` (`state/news_feed.json`, 2026-10-30T23:00:03Z). **Omfång:** 2 av 6 flöden. **Ersättningskälla:** websök.
4. **`crypto-previousclose-misdated` – ÅTERKOMMANDE.** `quotes["BTC-USD"].previousClose` är 77 775,11 mot den daterade punkten 76 955,32; för `ETH-USD` 2 249,50 mot 2 235,48. Räknat rakt av ger fältet fel tecken för båda (−0,65 %/−0,16 % mot korrekta +0,41 %/+0,47 %). **Omfång:** 2 av 2 mynt. **Ersättningskälla:** `state/price_history.json`.
5. **`news-window-daily-cap-drops-morning-posts` – ÅTERKOMMANDE.** Alla poster för 2026-10-30 ligger efter 18:08 UTC (`perDay` 90). **Omfång:** se rapport-261031 (3 av 3 morgonrapporter 30/10). **Ersättningskälla:** websök.
6. **`earnings-calendar-coverage` – L-5.** Kalendern täcker bara de hämtade symbolerna, så resten av US-universumet är OKONTROLLERAT för veckans rapporter.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
