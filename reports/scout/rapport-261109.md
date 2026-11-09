# Daglig Scout: USA & Krypto
**Datum:** 2026-11-09
**Marknadsklimat:** Det är måndag morgon före öppning i New York. Underlaget är oförändrat sedan fredagens stängning: AI-hårdvaran studsade och indexet bleknade, medan starka jobbsiffror håller decemberhöjningen prisad till ~77 %. Krypto har stått still kring 75 800 enligt senaste verifierade punkt. Tisdagens KPI är fortsatt veckans binära händelse. **Aktiva lärdomar tillämpade:** L-3 (åtgärdspunkter sist), L-4 (kandidatkön kontrollerad), L-5 (kalenderns och flödets täckning) och L-6 (inga klasser utesluts). L-2 är uppfylld (`ABNB` och gårdagens sex tillägg finns i watchlistan). L-1, L-7 och L-8 gäller inte scouten.

## Marknadsöversikt

`git pull` kördes 2026-11-09 05:48 UTC (06:48 CET): HEAD = `origin/main` = `cb83093`. Källan är `state/prices.json` med `generatedAt` 2026-11-07T00:55:35Z, `schemaVersion` 2026-08-02-prevclose, `tickerCount` 308 och `okCount` 303 (Yahoo Finance chart API via GitHub Actions). **Måndagens första körning med cron `9 5 * * 1-5` hade inte startat kl. 05:48 UTC.** Senaste körningen av `prices.yml` är run 881 från 2026-11-07 00:52 UTC (GitHub Actions API). Aktiekurserna är därmed fortsatt fredagens stängningar, och kryptokurserna är ~53 timmar gamla. Nyhetsflödet (`state/news_feed.json`) har `generatedAt` 2026-11-07T00:57:38Z och täcker 10 av 10 handelsdagar (2026-10-26 – 2026-11-07, `missingDays` tomt). Inga poster är nyare än lördag 00:57 UTC.

| Symbol | Senaste verifierade nivå | Rörelse | marketTime |
|---|---|---|---|
| `^GSPC` | 7 376,86 | +0,31 % fredag (7 353,73 → 7 376,86) | 2026-11-06T21:37:09Z |
| `^IXIC` | 24 579,42 | +1,09 % fredag (24 315,00 → 24 579,42) | 2026-11-06T22:15:59Z |
| `BTC-USD` | 75 796,22 | +0,10 % mot daterad punkt 2026-11-06 (75 718,39). **Helgrörelsen är EJ VERIFIERAD.** | 2026-11-07T00:54:10Z |
| `ETH-USD` | 2 237,84 | +0,49 % mot daterad punkt 2026-11-06 (2 227,03). **Helgrörelsen är EJ VERIFIERAD.** | 2026-11-07T00:54:30Z |
| `SPY` (sleeve) | 735,29 | +0,31 % fredag | 2026-11-06T21:00:00Z |

**Krypto över helgen: KURS EJ VERIFIERAD.** Reservkällorna Yahoo (`query1.finance.yahoo.com`) och Coinbase (`api.coinbase.com`) gav båda `CONNECT tunnel failed, response 403` från scoutens körmiljö (åtgärdspunkt 5). Websök gav inga daterade kurser för 2026-11-07/08.

**Teknik** (räknad på råserien i `state/price_history.json`, sista aktiepunkt 2026-11-06, oförändrad sedan rapport-261108):
- `^GSPC` ligger **0,71 % över MA200** (7 325,03), med RSI 35,1. ⇒ **Regimfiltret för US-boken är PÅ, men marginalen är minimal inför dagens veckorotation.**
- `^IXIC` ligger 2,07 % under MA200.
- `BTC-USD` ligger ~4,4 % över MA200 men ~6,3 % under MA50. `ETH-USD` ligger ~4,7 % över MA200.

## Ekonomiska siffror & kalender

**Senaste utfall:**
- **NFP oktober (2026-11-06):** +165 000 jobb mot ~59 000 väntat. Arbetslösheten var 4,1 % och timlönen steg 0,4 % m/m (BLS och CNBC 2026-11-06; se rapport-261107). Enligt CME FedWatch är sannolikheten för en höjning med 25 punkter i december ~77 %. Inga nya amerikanska makrodata har publicerats sedan dess.
- **Kinas KPI/PPI för oktober (2026-11-09):** Utfallet var inte verifierbart vid körningen, eftersom websök bara gav träffar från tidigare år. Siffrorna används inte.

**Kommande (nästa 1–5 handelsdagar):**
- **Mån 2026-11-09:** Inga större US-releaser.
- **Tis 2026-11-10, 08:30 ET (14:30 CET): KPI oktober – VECKANS MEST MARKNADSRÖRANDE.** Konsensus enligt FactSet är 3,9 % å/å, mot föregående 3,7 % (CNBC 2026-11-06, "Stock market next week: Outlook for Nov. 9-13"). Det är sista KPI före Fed-mötet 8–9 december. NFIB publiceras samma dag.
- **Ons 2026-11-11:** Veterans Day. Obligationsmarknaden är stängd, aktiemarknaden öppen (CNBC 2026-11-06).
- **Tor 2026-11-12:** Jobless claims.
- **Fre 2026-11-13:** PPI oktober (Schaeffer's 2026-11-05).

**Rapporter nästa 5 handelsdagar** ur `state/earnings_calendar.json` (`generatedAt` 2026-11-07T00:53:57Z), US-symboler:
- **I dag 11-09:** `ACHR`, `CEG`, `KKR` och `MARA`. Enligt CNBC 2026-11-06 rapporterar även `RKLB` och `OXY`.
- **11-10:** `CRWV` och `RGTI` (CNBC 2026-11-06).
- **11-12:** `AMAT`, samt `CSCO` och `NBIS` (CNBC 2026-11-06).

**L-5:** Kalendern ser bara de symboler som `prices.yml` hämtar. `RKLB`, `OXY`, `CRWV`, `RGTI`, `CSCO` och `NBIS` lades i `config/watchlist_us.txt` i går, men saknar fortfarande kurs i `state/prices.json` eftersom ingen hämtning körts sedan dess. Resten av det amerikanska universumet är **OKONTROLLERAT**. Samtliga datum är bevakningsposter enligt punkt 8, aldrig köpförslag.

## Aktuella händelser & katalysatorer

- **Krypto-ETF:er (vecka 2026-11-02 – 11-06):** De 12 amerikanska spot-bitcoin-ETF:erna hade nettoutflöden på ~1,28 mdr USD, veckans största sedan juni (SoSoValue via mlq.ai, 2026-11-07). Fredagens utflöde var 411,92 MUSD, varav 403 MUSD ur IBIT (Tokenpost 2026-11-07). Dataserien för måndagen kommer först efter stängning.
- **Helgen 2026-11-07/08:** Ingen bekräftad bolags-, ETF- eller regulatorisk katalysator har hittats för de namn scouten bevakar. `state/news_feed.json` har inga poster efter 2026-11-07, eftersom `news.yml` inte kör på helger och måndagens första körning (05:17 UTC) ännu inte har committat. Websök 2026-11-09 gav inga daterade träffar för helgen. **Negativt påstående (L-5):** Det gäller bara de källor som genomsöktes, och övriga flöden är **OKONTROLLERADE**.
- **Berkshire Hathaway (`BRK-B`):** Q3 2026-utfallet (väntat 2026-11-07) gick fortfarande inte att verifiera, eftersom websök bara gav tidigare år. **Händelsen är EJ VERIFIERAD** och används inte.

## Uppföljning av tidigare case

Rapport-261108 innehöll inga nya case. Uppföljningen avser därför de två case som fortfarande är öppna från rapport-261107. Ingen session har handlats sedan dess.
- **`ABNB` (rapport-261107): KURS EJ VERIFIERAD → KURS EJ VERIFIERAD.** `ABNB` finns i `config/watchlist_us.txt`, men `prices.yml` har inte kört sedan raden lades till. **Tes INTAKT** (Q3: intäkter +19 %, EPS 3,16, återköp 12 mdr USD). En kurs krävs före US-rotationens avgörande i dag.
- **`VST` (rapport-261107): 124,80 → 124,80** (±0 %, marketTime 2026-11-06T21:00:02Z, prices.json). **Tes INTAKT men blockerad:** kursen ligger 18,24 % under MA200 (152,65). Enligt `prompts/gemensam_korning.md` blockerar saknad MA200, eller kurs ≤ MA200, nya aktiepositioner.

**Kandidatkön (`state/scout_candidates.json`):** 115 poster, varav 104 `rejected`, 9 `promoted` och 2 `new`. De nya är `261107-ABNB` (`price: null`) och `261107-VST` (124,80), båda med `expiresAt` 2026-11-13. Dagens US-rotation (LÄGE A, 15:00) ska avgöra båda. **L-4:** `ABNB` kan avfärdas men inte köpas förrän en kvalificerad kurs finns. Inga nya poster läggs till i dag.

**US-boken:** Ingen ny session har handlats. `CBOE` 353,27 ligger över stoppen 316,00, och `U`-planen ≤ 49,00 är **EJ TRIGGAD** (`U` 51,49, marketTime 2026-11-06T21:00:02Z, prices.json).

## Dagens case

**Inga nya case i dag.** Ingen ny session har handlats och ingen ny bekräftad katalysator har publicerats sedan rapport-261107. Kurser och nyhetsflöde står still sedan lördag ~00:55 UTC, och måndagens första hämtning har inte kört. Dagens rapporter (`CEG`, `KKR`, `MARA`, `ACHR`, `RKLB`, `OXY`) har inte släppts. De är bevakningsposter enligt punkt 8 och får inte bli köpförslag före utfallet. Att bygga case på 53 timmar gamla kurser vore att tvinga fram dem. Skälen står under Makro nedan.

## Makro- & sektorfaktorer att bevaka

**Varför avvaktande:**
1. **Regimen står på en knivsegg.** `^GSPC` ligger 0,71 % över MA200, och `^IXIC` ligger redan under sin. Ett fall på ~0,7 % slår av regimfiltret, och då får US-boken inte ta nya aktiepositioner. Det är det första dagens veckorotation måste pröva mot en färsk kurs.
2. **KPI på tisdag är binär.** Med en het jobbrapport och ~77 % prisad decemberhöjning skulle en KPI över 3,9 % å/å låsa fast höjningen. Det är motvind för långduration: mjukvara, tillväxt och krypto.
3. **Krypto saknar köpare.** ETF-flödena var negativa två dagar i rad och veckans utflöde var det största sedan juni. BTC och ETH ligger kvar över MA200 men under MA50, utan egen katalysator.
4. **AI-hårdvaran testas igen** av `CRWV` (11-10), `AMAT`/`CSCO`/`NBIS` (11-12) och `NVDA` (11-17).

**Det marknaden fortsatt premierar:** Rapportvinnare med kapitallätt tillväxt (`APP`, `U`, `NET`, `ABNB`).

**Watchlist-hygien:** `config/watchlist_us.txt` innehåller långt fler symboler än riktmärket 25, men ingen rensning görs i dag. Följande skyddas enligt `prompts/gemensam_korning.md`: innehavet (`CBOE`), `U`-planen, de giltiga kandidaterna, gårdagens L-5-tillägg och besluten inom utvärderingens 20-dagarsfönster. Inga tillägg i dag.

### Åtgärdspunkter till Dren (L-3)

1. **`scheduled-actions-not-firing` – ÅTERKOMMANDE.** `prices.yml`-cronen `9 5 * * 1-5` (05:09 UTC) hade inte startat kl. 05:48 UTC, och run 881 (2026-11-07 00:52 UTC) var fortfarande den senaste. **Omfång:** samtliga 308 symboler, varav de sju nya (`ABNB`, `RKLB`, `OXY`, `CRWV`, `RGTI`, `CSCO`, `NBIS`) helt saknar kurs. **Kontrollera** att `prices.yml` har kört före nordisk rotation 08:40 och US-rotation 15:00. Kör annars "Hämta kurser" för hand.
2. **`us-rotation-lage-a-missed` – ÅTERKOMMANDE.** I dag är det veckorotation för US-boken, och `261107-ABNB` och `261107-VST` ligger som `new` i kön. Kontrollera att LÄGE A körs och att båda avgörs.
3. **`crypto-previousclose-misdated` – ÅTERKOMMANDE.** `quotes["BTC-USD"].previousClose` (75 942,13) stämmer inte med den daterade punkten 2026-11-06 (75 718,39). Samma gäller `ETH-USD` (2 234,48 mot 2 227,03). **Omfång:** 2 av 2 mynt. **Ersättningskälla:** `state/price_history.json`.
4. **`news-feed-globenewswire-http-403` – ÅTERKOMMANDE.** `feeds.globenewswire` och `feeds.globenewswire-earnings` ger fortfarande `"HTTP 403 – båda försöken (0.0 s)"`. **Omfång:** 2 av 6 flöden. **Ersättningskälla:** websök och SEC 8-K.
5. **Ingen helgkälla för kryptokurser – ÅTERKOMMANDE.** `prices.yml` kör bara vardagar, och reservkällorna Yahoo och Coinbase ger `CONNECT tunnel failed, response 403` från scoutens körmiljö. **Omfång:** 2 av 2 mynt, ~53 timmar gamla måndag morgon. **Föreslagen fix:** en helgcron i `prices.yml` som bara hämtar `*-USD`-symbolerna.
6. **`macro-calendar-not-verifiable-from-state` – ÅTERKOMMANDE.** KPI-konsensus, FedWatch-odds och räntenivåer kommer ur websök, eftersom `^TNX`, `^VIX`, `DX-Y.NYB`, `CL=F` och `^SOX` saknas i `state/prices.json`. **Omfång:** samtliga makrovärden. Kinas KPI/PPI för oktober gick inte att verifiera i dag.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
