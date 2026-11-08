# Daglig Scout: USA & Krypto
**Datum:** 2026-11-08
**Marknadsklimat:** Söndag, och aktiemarknaden har varit stängd sedan fredagens session. Den slutade med en studs i AI-hårdvaran efter torsdagens ras, men indexet bleknade från dagshögsta och starka jobbsiffror lyfte decemberhöjningsoddsen till ~77 %. Krypto har stått still kring 75 800 över helgen, efter ~1,28 mdr USD i ETF-utflöden förra veckan. Tisdagens KPI är den binära händelse marknaden väntar på. **Aktiva lärdomar tillämpade:** L-3 (åtgärdspunkter sist), L-4 (kandidatkön kontrollerad), L-5 (kalenderns och flödets täckning) och L-6 (inga klasser utesluts). L-2 är uppfylld sedan i går (`ABNB` finns i watchlistan). L-1, L-7 och L-8 gäller inte scouten.

## Marknadsöversikt

`git pull` kördes 2026-11-08 05:48 UTC (06:48 CET): HEAD = `origin/main` = `1e871a2`. Källan är `state/prices.json` med `generatedAt` 2026-11-07T00:55:35Z, `schemaVersion` 2026-08-02-prevclose, `tickerCount` 308 och `okCount` 303 (Yahoo Finance chart API via GitHub Actions). **Filen har inte uppdaterats sedan lördag 00:55 UTC**, eftersom `prices.yml` bara kör vardagar. Aktiekurserna är därmed fredagens stängningar, vilket är de senaste som finns. Kryptokurserna är ~29 timmar gamla. Nyhetsflödet (`state/news_feed.json`) har `generatedAt` 2026-11-07T00:57:38Z och täcker 10 av 10 handelsdagar (2026-10-26 – 2026-11-07, `missingDays` tomt).

| Symbol | Senaste verifierade nivå | Rörelse | marketTime |
|---|---|---|---|
| `^GSPC` | 7 376,86 | +0,31 % fredag (7 353,73 → 7 376,86) | 2026-11-06T21:37:09Z |
| `^IXIC` | 24 579,42 | +1,09 % fredag (24 315,00 → 24 579,42) | 2026-11-06T22:15:59Z |
| `BTC-USD` | 75 796,22 | +0,10 % mot daterad punkt 2026-11-06 (75 718,39). **Helgrörelsen är EJ VERIFIERAD.** | 2026-11-07T00:54:10Z |
| `ETH-USD` | 2 237,84 | +0,49 % mot daterad punkt 2026-11-06 (2 227,03). **Helgrörelsen är EJ VERIFIERAD.** | 2026-11-07T00:54:30Z |
| `SPY` (sleeve) | 735,29 | +0,31 % fredag | 2026-11-06T21:00:00Z |

**Krypto i helgen: KURS EJ VERIFIERAD.** Prompten anvisar Yahoo Finance som reservkälla, men ett direktanrop gav `CONNECT tunnel failed, response 403` (åtgärdspunkt 5). Börssidornas sökträffar (Coinbase ~75 870 lördag morgon, CoinGecko ~75 800, −0,2 % på 24 h) tyder på ett oförändrat läge, men de är cachade sökträffar och används inte som kurs.

Fredagens bredd, megacaps och sämsta namn står i rapport-261107 och har inte ändrats.

**Teknik** (räknad på råserien i `state/price_history.json`, sista aktiepunkt 2026-11-06, oförändrad sedan i går):
- `^GSPC` ligger **0,71 % över MA200** (7 325,03), med RSI 35,1. ⇒ **Regimfiltret för US-boken är fortfarande PÅ, med minimal marginal inför måndagens veckorotation.**
- `^IXIC` ligger 2,07 % under MA200.
- `BTC-USD` ligger ~4,4 % över MA200 men ~6,3 % under MA50. `ETH-USD` ligger ~4,7 % över MA200.

## Ekonomiska siffror & kalender

**Senaste utfall:**
- **NFP oktober (2026-11-06):** +165 000 jobb mot ~59 000 väntat, arbetslösheten 4,1 % och timlönen +0,4 % m/m (BLS och CNBC 2026-11-06; se rapport-261107). Enligt CME FedWatch är sannolikheten för en höjning med 25 punkter i december ~77 %. Inga nya makrodata har kommit under helgen.

**Kommande (nästa 1–5 handelsdagar):**
- **Mån 2026-11-09:** inga större US-releaser. Kinas KPI/PPI för oktober kommer samma dag.
- **Tis 2026-11-10, 08:30 ET (14:30 CET): KPI oktober – VECKANS MEST MARKNADSRÖRANDE.** Konsensus enligt FactSet är 3,9 % å/å (föregående 3,7 %), medan kärn-KPI väntas svalna något m/m (CNBC 2026-11-06, "Stock market next week: Outlook for Nov. 9-13"). Det är sista KPI före Fed-mötet 8–9 december. Samma dag kommer NFIB.
- **Ons 2026-11-11:** Veterans Day. Obligationsmarknaden är stängd, men aktiemarknaden är öppen (CNBC 2026-11-06).
- **Tor 2026-11-12:** jobless claims.
- **Fre 2026-11-13:** PPI oktober (Schaeffer's 2026-11-05).

**Rapporter nästa 5 handelsdagar** ur `state/earnings_calendar.json` (`generatedAt` 2026-11-07T00:53:57Z), US-symboler:
- 11-09: `ACHR`, `CEG`, `KKR` och `MARA`
- 11-12: `AMAT`
- Utanför kalendern enligt CNBC 2026-11-06: `RKLB`, `OXY` (11-09), `CRWV`, `RGTI` (11-10), `CSCO`, `NBIS` (11-12). Optionsmarknaden prisar ~±20 % rörelse i `NBIS` och `CRWV`.

**L-5:** kalendern ser bara de symboler som `prices.yml` hämtar. Bland namnen ovan saknas `RKLB`, `OXY`, `CRWV`, `RGTI`, `CSCO` och `NBIS` i både `config/watchlist_us.txt` och `state/prices.json`, så resten av det amerikanska universumet är **OKONTROLLERAT**. De sex läggs i watchlistan i dag, så att kursserien finns före rapporterna. Samtliga datum är bevakningsposter enligt punkt 8, aldrig köpförslag.

## Aktuella händelser & katalysatorer

- **Krypto-ETF:er (vecka 2026-11-02 – 11-06):** De 12 amerikanska spot-bitcoin-ETF:erna hade nettoutflöden på ~1,28 mdr USD, det mesta sedan juni, och årets flöden blev därmed negativa (SoSoValue via mlq.ai, 2026-11-07). Utflödet var 411,92 MUSD 2026-11-06, den andra dagen i rad, varav 403 MUSD ur IBIT (Tokenpost 2026-11-07). The Block 2026-11-06 kopplar utförsäljningen till marknadens tolkning av mellanårsvalet.
- **Helgen 2026-11-07/08:** Ingen bekräftad bolags-, ETF- eller regulatorisk katalysator för de namn scouten bevakar. `state/news_feed.json` har 62 poster efter 2026-11-06 20:00 UTC, och de består huvudsakligen av 8-K-filer från mikrobolag och stämningsannonser. Ingen post är nyare än 2026-11-07 00:53 UTC, eftersom `news.yml` inte kör på helger.
- **Berkshire Hathaway (`BRK-B`):** Q3-rapporten väntades lördag 2026-11-07 enligt en resultatkalender (arincen), men ingen bevakning av själva utfallet hittades. **Händelsen är EJ VERIFIERAD** och används inte.

## Uppföljning av tidigare case

Ingen session har handlats sedan rapport-261107, så kurserna "nu" är desamma som då.
- **`ABNB` (rapport-261107): KURS EJ VERIFIERAD → KURS EJ VERIFIERAD.** `ABNB` lades i `config/watchlist_us.txt` i går, men `prices.yml` har inte kört sedan dess. **Tes INTAKT** (Q3: intäkter +19 %, EPS 3,16, återköp 12 mdr USD). Första kursen väntas vid måndagens 05:09 UTC-körning, före US-rotationen.
- **`VST` (rapport-261107): 124,80 → 124,80** (±0 %; marketTime 2026-11-06T21:00:02Z, prices.json). **Tes INTAKT men blockerad:** kursen ligger 18,24 % under MA200 (152,65). Saknad MA200 eller kurs ≤ MA200 blockerar nya aktiepositioner (`prompts/gemensam_korning.md`).

**Kandidatkön (`state/scout_candidates.json`):** 115 poster, varav 104 `rejected`, 9 `promoted` och 2 `new` (`261107-ABNB` och `261107-VST`, båda med `expiresAt` 2026-11-13). Ingen bok har kört sedan de skrevs, så de är inte försenade. Måndagens US-rotation ska avgöra båda. Inga nya poster läggs till i dag.

**US-boken:** Inga nya sessioner har handlats, så status är densamma som i rapport-261107. `CBOE` ligger över stoppen 316,00, och `U`-planen ≤ 49,00 är **EJ TRIGGAD**.

## Dagens case

**Inga nya case i dag.** Ingen session har handlats och ingen ny bekräftad katalysator har publicerats sedan rapport-261107. Nyhetsflödet och kurserna står still sedan lördag ~00:55 UTC, och helgens kryptokurser går inte att verifiera. Gårdagens två case (`ABNB` och `VST`) ligger redan i kandidatkön och väntar på US-bokens avgörande. Att skapa nya case på inaktuella kurser eller på kommande rapporter (punkt 8) vore att tvinga fram dem – skälen står under Makro nedan.

## Makro- & sektorfaktorer att bevaka

**Varför avvaktande:**
1. **Regimen står på en knivsegg.** `^GSPC` ligger 0,71 % över MA200, och `^IXIC` ligger redan under sin. Ett fall på ~0,7 % slår av regimfiltret, och då får US-boken inte ta nya aktiepositioner.
2. **KPI på tisdag är binär.** Med en het jobbrapport och ~77 % prisad decemberhöjning kan en KPI över 3,9 % å/å låsa fast höjningen. Det är motvind för långduration (mjukvara, tillväxt och krypto).
3. **Krypto saknar köpare.** ETF-flödena har varit negativa två dagar i rad och veckans utflöde är det största sedan juni. BTC och ETH ligger kvar över MA200 men under MA50, utan egen katalysator.
4. **AI-hårdvaran testas igen** av `CRWV` (11-10), `AMAT`/`CSCO`/`NBIS` (11-12) och `NVDA` (11-17), samtidigt som den regulatoriska risken mot datacenterbygget kvarstår.

**Det marknaden fortsatt premierar:** rapportvinnare med kapitallätt tillväxt (`APP`, `U`, `NET`, `ABNB`).

**Watchlist-hygien:** `config/watchlist_us.txt` bär långt fler symboler än riktmärket 25, men ingen rensning görs i dag. Följande skyddas enligt `prompts/gemensam_korning.md`: innehavet (`CBOE`), U-planen, de giltiga kandidaterna och besluten inom utvärderingens 20-dagarsfönster. Tillägg (L-5): `RKLB`, `OXY`, `CRWV`, `RGTI`, `CSCO` och `NBIS`.

### Åtgärdspunkter till Dren (L-3)

1. **`us-rotation-lage-a-missed` / `scheduled-actions-not-firing` – ÅTERKOMMANDE.** Måndag 2026-11-09 är veckorotation för US-boken, med två `new`-kandidater i kön (`261107-ABNB` och `261107-VST`). Kontrollera att LÄGE A faktiskt körs och att båda avgörs.
2. **`crypto-previousclose-misdated` – ÅTERKOMMANDE.** `quotes["BTC-USD"].previousClose` (75 942,13) ≠ daterad punkt 2026-11-06 (75 718,39), och `ETH-USD` (2 234,48) ≠ 2 227,03. **Omfång:** 2 av 2 mynt. **Ersättningskälla:** `state/price_history.json`.
3. **`news-feed-globenewswire-http-403` – ÅTERKOMMANDE.** `feeds.globenewswire` och `feeds.globenewswire-earnings` ger fortfarande `"HTTP 403 – båda försöken (0.0 s)"`. **Omfång:** 2 av 6 flöden. **Ersättningskälla:** websök och SEC 8-K.
4. **`macro-calendar-not-verifiable-from-state` – ÅTERKOMMANDE.** KPI-konsensus, FedWatch-odds och räntenivåer kommer ur websök, eftersom `^TNX`, `^VIX`, `DX-Y.NYB`, `CL=F` och `^SOX` saknas i `state/prices.json`. **Omfång:** samtliga makrovärden.
5. **Ingen helgkälla för kryptokurser – ÅTERKOMMANDE (även rapport-261101).** `prices.yml` kör bara vardagar, så `BTC-USD`/`ETH-USD` är ~29 h gamla på söndagsmorgonen. Reservkällan Yahoo ger `CONNECT tunnel failed, response 403` från scoutens körmiljö. **Omfång:** 2 av 2 mynt, varje lördag och söndag. **Föreslagen fix:** en helgcron i `prices.yml` som bara hämtar `*-USD`-symbolerna.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
