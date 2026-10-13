# Daglig Scout: USA & Krypto
**Datum:** 2026-10-13
**Marknadsklimat:** Måndagen blev en avvaktande Columbus Day-session. Obligationsmarknaden var stängd, `^GSPC` stängde oförändrat (−0,06 %) och `^IXIC` föll 0,44 %. Halvledare och optik gav tillbaka (CIEN −9,95 %, MU −3,88 %), medan META steg 3,38 %. Kryptomarknaden har stabiliserats efter förra veckans ETF-utflöden. Storbankerna rapporterar i dag och KPI kommer i morgon, så marknaden väntar. **Aktiva lärdomar tillämpade:** L-3 (åtgärdspunkter sist), L-4 (kontroll av vilande kandidater, se uppföljningen), L-5 (rapportkalenderns källa och täckning anges, två bolag lagda i watchlistan) och L-6 (inga klasser utesluts). L-1, L-2, L-7 och L-8 gäller inte scouten i dag.

## Marknadsöversikt

Samtliga kurser kommer ur `state/prices.json` (källa `Yahoo Finance (chart API)` via GitHub Actions). Filens `generatedAt` är **2026-10-13T02:36:15.927Z**, `schemaVersion` **2026-08-02-prevclose**, `tickerCount` 267 och `okCount` 261. Arbetskopian var i fas med `origin/main` (`853340c Kurser: 2026-10-13 02:36 UTC`) efter `git pull` 2026-10-13 ~05:49 UTC.

| Symbol | Nivå | Rörelse | marketTime |
|---|---|---|---|
| `^GSPC` | 7 807,24 | −0,06 % (7 811,54 → 7 807,24, måndag 2026-10-12) | 2026-10-12T20:35:01Z |
| `^IXIC` | 27 245,90 | −0,44 % (27 366,17 → 27 245,90) | 2026-10-12T21:15:59Z |
| `BTC-USD` | 82 634,37 | +0,99 % mot den daterade punkten 2026-10-12 (81 826,13) i `state/price_history.json`; −0,79 % lördag → måndag (82 478,34 → 81 826,13) | 2026-10-13T02:34:45Z |
| `ETH-USD` | 2 478,11 | +1,15 % mot punkten 2026-10-12 (2 450,01); −1,51 % lördag → måndag (2 487,49 → 2 450,01) | 2026-10-13T02:35:04Z |
| `SPY` (sleeve) | 778,10 | −0,06 % | 2026-10-12T20:00:00Z |

Kryptorörelserna räknas på daterade punkter i `state/price_history.json` och inte ur `previousClose`. Det fältet anger för `BTC-USD` 83 679,47, vilket skulle ge −1,25 % och strider mot serien (se åtgärdspunkt 3). Serien saknar en punkt för söndag 2026-10-11, eftersom `prices.yml` bara kör vardagar.

**Teknik (räknad på råserien i `state/price_history.json`, 250 punkter):** `^GSPC` ligger 7,6 % över MA200 (7 255,09), så regimfiltret för US-boken är **PÅ**. RSI 59,4, kursen över EMA20 (7 733,23) och MACD positivt (+36,7). `^IXIC` har RSI 57,4 och kursen över EMA20. `BTC-USD` har RSI 53,5, kursen strax över EMA20 (82 484) och över MA200 (71 500). `ETH-USD` har RSI 43,8 och kursen under EMA20 (2 560), men över MA200 (2 113). Den långa trenden är intakt för båda mynten, men ETH saknar kortsiktigt momentum.

**Krypto-flöden:** De amerikanska spot-ETF:erna för bitcoin hade 681,1 MUSD i nettoutflöden förra veckan, vilket bröt tre veckor av inflöden. Ether-fonderna hade nettoutflöden nio handelsdagar i rad och veckans största uttag sedan januari (FXStreet 2026-10-12; Cointelegraph 2026-10). På måndagen konsoliderade BTC kring 83 600 USD (FXStreet 2026-10-12). Den nivån är inte verifierad, eftersom repots kurs ovan är den gällande.

## Ekonomiska siffror & kalender

**Senaste utfall:** inga nya amerikanska makrosiffror sedan rapport-261011. Måndagen var Columbus Day, och kontanthandeln i statsobligationer var stängd (Schwab 2026-10-12). Michigan-stämningen 46,3 mot väntade ~47,5 står kvar som senaste datapunkt (Reuters via MarketScreener 2026-10-09). Fed höjde räntan med 25 punkter till 3,75–4,00 % den 2026-09-16, den första höjningen sedan juli 2023 (Gotrade "Week Ahead" 2026-10-12).

**Kommande** (källa: websök, inte någon fil i repot – se åtgärdspunkt 2):
- **I dag, tisdag 2026-10-13:** `JPM` (pressmeddelande ~06:45–07:00 ET, samtal 08:30 ET enligt ScanX och Akrostec, som skiljer sig åt i klockslaget), `GS`, `WFC` och `C` (Quartz och Investing.com 2026-10-12). `state/earnings_calendar.json` anger dessutom `JNJ` och `UNH` till i dag, samtliga med `isEstimate: false`. Konsensus för JPM ligger på ungefär +17 % i vinst per aktie mot fjolåret (stock3 2026-10). Marknaden fokuserar på räntenettot (Quartz 2026-10-12).
- **Onsdag 2026-10-14, 12:30 UTC: KPI september – veckans mest marknadsrörande siffra.** Konsensus är 3,6 % å/å (från 3,4 %) och kärn-KPI 2,5 % (Gotrade 2026-10-12; Kitco/Reuters 2026-10-09). Samma dag rapporterar `BAC`, `MS` och `BLK` (`state/earnings_calendar.json`, `isEstimate: false`).
- **Torsdag 2026-10-15:** PPI samt `TSM`, `PNC` och `USB` (`state/earnings_calendar.json`). TSM prövar AI-temat efter måndagens svaghet i halvledare.
- **Veckan 2026-10-12–16:** `ABT` före öppning, exakt dag ej belagd (fffinstill veckokalender).
- **2026-10-20 `NFLX`** (projicerat enligt MarketScreener och nextearningsdate, ej bekräftat av bolaget), **2026-10-21 `TSLA`**, **2026-10-27 `META`** (MarketBeat 2026-10-12), **FOMC 2026-10-27–28**.
- **L-5:** `state/earnings_calendar.json` ser bara symboler som `prices.yml` redan hämtar. Resten av det amerikanska universumet är **OKONTROLLERAT**. `ABT` och `NFLX` saknade rad och har lagts till i `config/watchlist_us.txt` i dag. Rapportförbudet i promptens punkt 8 gäller samtliga rapportbolag ovan: de är bevakningsposter, aldrig köpförslag.

## Aktuella händelser & katalysatorer

- **`META` +3,38 % till 742,96 (`state/prices.json`, marketTime 2026-10-12T20:00Z).** Rörelsen kom på data från oberoende app-analysföretag om att den fristående assistenten Muse har tidig användarretention i nivå med ChatGPT, med fem miljoner nedladdningar på 22 dagar efter lanseringen i september. Den fick även stöd av spekulation om en ny modell med kodnamnet "Watermelon" efter ett inlägg av Metas AI-chef Alexandr Wang (GuruFocus 2026-10-12; StockStory/FinancialContent 2026-10-12; TradingKey 2026-10-12). Cantor Fitzgerald sänkte riktkursen till 840 USD men behöll Overweight (MarketBeat 2026-10-12). Enligt Financial Times planerar Meta att för första gången ge ut obligationer i Europa för att finansiera AI-infrastruktur (återgivet av GuruFocus 2026-10-12). **Ingen bekräftad bolagskatalysator:** retentionsdatan kommer från tredje part, och modellen är spekulation. Rapporten 2026-10-27 ligger 10 handelsdagar bort.
- **Halvledare och optik gav tillbaka (`state/prices.json`, marketTime 2026-10-12T20:00Z):** `CIEN` −9,95 % (405,01), `BE` −6,50 %, `AKAM` −4,96 %, `SMCI` −4,49 %, `HPE` −4,26 %, `SKHY` −4,02 %, `MU` −3,88 %, `MRVL` −3,42 % och `ZS` −3,40 %. **Ingen bolagsspecifik nyhet för CIEN daterad 2026-10-12 hittades.** Närmast är en MarketBeat-notis 2026-10-08 om −4,8 % på värderingsoro och kundkoncentration till hyperskalare. Rörelsen behandlas därför som sektorrotation, inte som en katalysator.
- **Energi efter orkanen Isaias:** produktionen i Mexikanska golfen återstartas gradvis. På söndagen var ~58 % av oljeproduktionen avstängd, mot 72 % som högst fredag 2026-10-09 (CNN via ABC Columbia 2026-10-12). BP har återstartat Na Kika och Thunder Horse, och Shell och Chevron rapporterar minimala skador (GuruFocus 2026-10-12, sekundärkälla). Brent låg kring 104 USD/fat i veckan före stormen (BigGo/GuruFocus). Ingen Brent-nivå verifieras ur repots filer, eftersom `state/prices.json` inte bär råvaruterminer. `XOM` steg 1,90 % till 172,15 (marketTime 2026-10-12T20:02:44Z) och `CVX` stängde på 215,00.
- **Applied Materials** presenterade ett EPIC-center för 5 mdr USD i Silicon Valley (mfn 2026-10-12T20:30Z, i `state/news_feed.json`). Det är en investering, inte ett intäktsutfall, och inget case.
- **`state/news_feed.json`** (`generatedAt` 2026-10-12T21:46:06Z) bär 10 av 10 handelsdagar (2026-09-28 – 2026-10-12, `missingDays` tomt), men bara **60 poster för 2026-10-12**. Rubrikerna efter fredagens stängning innehåller inga bekräftade amerikanska bolagskatalysatorer inom fokus, bara datumbesked (`META` 2026-10-27, `TeraWulf`, `RPC`, `Nelnet`), chefsbyten och grupptalan-annonser. **Två av sex flöden (`globenewswire`, `globenewswire-earnings`) svarar fortfarande HTTP 403** (åtgärdspunkt 1), så den delen av pressmeddelandeflödet är **OKONTROLLERAD**.
- Inga rykten används i dag.

## Uppföljning av tidigare case

Föregående scout-rapport är `reports/scout/rapport-261011.md`, och den hade inga case. **Inga tidigare case att följa upp.** Det finns ingen rapport-261012: måndagens scout-körning uteblev (åtgärdspunkt 4). Därför står de två senaste casen från rapport-261010 här som information:

- `TEVA` (rapport-261010): 41,10 → 41,17 USD (+0,17 %, `state/prices.json`, marketTime 2026-10-12T20:00Z). **Tes INTAKT.** RSI 65,6, kursen över EMA20 och MA200.
- `ZS` (rapport-261010): 233,73 → 225,78 USD (−3,40 %, marketTime 2026-10-12T20:00Z). **Tes FÖRSVAGAD.** Måndagens sektorsvaghet gav tillbaka halva fredagens rörelse, men kursen ligger över EMA20 (205,21). Investerardagens tes är intakt.

**Kandidater utan avgörande (ur `state/scout_candidates.json`, 76 poster: 69 `rejected`, 5 `promoted`, 2 `new`):** `261010-TEVA` och `261010-ZS` står fortfarande som `new`, med `expiresAt` 2026-10-16. **De skulle ha avgjorts av US-rotationen måndag 2026-10-12, men den körningen ägde inte rum.** `state/decisions.json` har noll rader daterade 2026-10-12 för båda böckerna, och `reports/us_weekly/` slutar på `us-veckorapport-261007.md`. Scouten avgör dem inte.

**L-4-kontroll:** `261009-DVN` (avvisad på "Grind 2 (datalucka)") har nu 250 daterade punkter och en post-katalysatorstängning på 48,96 (2026-10-12, +1,45 %). Ett nytt avgörande mot de fem grindarna krävs fortfarande av US-boken inom `expiresAt` 2026-10-16. **Den omprövningen uteblev också i och med att måndagens körning saknas.** Övriga avvisade poster inom sin `expiresAt` vilar på omdömesskäl, så L-4 är inte tillämplig på dem.

**Innehav:** `MRVL` 265,86 (−3,42 %, marketTime 2026-10-12T20:00Z). Avståndet till stop 260,00 är 2,3 %, och målet ligger på 313,50.

## Dagens case

**Inga case i dag.** Promptens punkt 6 säger att case aldrig ska tvingas fram, och det finns fyra skäl:

1. **Ingen bekräftad, handlingsbar bolagskatalysator i fönstret.** Den största positiva rörelsen (`META` +3,38 %) bygger på tredjepartsdata om appretention och spekulation om en modell, inte på ett inträffat bolagsutfall. Med `confirmed: false` vore den en bevakningspost, och den har redan kurs och watchlist-rad. De största negativa rörelserna (`CIEN`, `BE`) saknar daterad bolagsnyhet.
2. **Veckans binära händelser ligger rakt framför oss.** Storbankerna rapporterar i dag, KPI kommer i morgon och TSM på torsdag. Rapportförbudet i punkt 8 utesluter varje case kopplat till veckans rapportbolag.
3. **Krypto:** ETF-utflöden nio dagar i rad för ether och ingen krypto-specifik katalysator. ETH ligger under EMA20 med RSI 43,8.
4. **Kandidatkön är redan obearbetad.** `TEVA`, `ZS` och L-4-omprövningen av `DVN` väntar på en US-rotation som inte körts. Fler poster utan nytt underlag späder ut kön utan att tillföra något.

**INGA NYA KANDIDATPOSTER SKRIVS TILL `state/scout_candidates.json` I DAG.** Det finns inga case enligt punkt 5 och ingen bekräftad, handlingsbar bolagskatalysator utanför dem, alltså inga poster enligt punkt 7. Filen lämnas orörd med sina 76 poster.

## Makro- & sektorfaktorer att bevaka

**Därför avvaktande:** räntesidan är motvind. Fed höjde i september, KPI väntas stiga till 3,6 % och en höjning till är möjlig inför FOMC 27–28 oktober. Det går emot fokusfilens tema "tillväxtbolag som gynnas av fallande/stabila räntor". Bankerna i dag visar hur räntenettot klarar de högre räntorna och ger en första läsning på kreditkvaliteten.

**Sektorrotation:** måndagen var en upprepning av onsdag 2026-10-08. Tech och halvledare backade och energi och banker steg (`C` +1,76 %, `XOM` +1,90 %). AI-handeln är sårbar inför TSM på torsdag. `META` gick emot sin sektor, vilket visar att marknaden fortfarande belönar AI med tydlig monetisering.

**Energi och geopolitik:** golfen återstartar och skadorna verkar små, vilket talar för att orkanpremien i oljan faller tillbaka. Mellanöstern (attacker i Hormuzsundet) håller däremot Brent kring 100 USD, och det slår igenom i PPI och oktobers KPI.

**Krypto:** konsolidering efter utflödena. BTC ligger över EMA20 och MA200 med neutral RSI. Ett trendbrott uppåt kräver att ETF-flödena vänder. En KPI över väntan med högre realräntor är den största risken för båda mynten.

### Åtgärdspunkter till Dren (L-3)

1. **`news-feed-globenewswire-http-403` – kvarstår, ÅTERKOMMANDE.** Fältet `state/news_feed.json` `feeds.globenewswire` = `"HTTP 403 – båda försöken (0.1 s)"` och `feeds.globenewswire-earnings` = `"HTTP 403 – båda försöken (0.0 s)"` vid senaste körningen 2026-10-12T21:46:06Z. **Omfång:** 2 av 6 flöden, inklusive den enda källan som är dedikerad åt rapportöverraskningar. **Ersättningskälla:** websök.
2. **`macro-calendar-not-verifiable-from-state` – ÅTERKOMMANDE (öppen 5 veckor).** KPI-, PPI- och FOMC-datum samt JPM:s klockslag kommer ur websök. Källorna skiljer sig åt om JPM:s publiceringstid (06:45 mot 07:00 ET). **Omfång:** samtliga makrodatum i rapporten.
3. **`crypto-previousclose-misdated` – ÅTERKOMMANDE (öppen 7 veckor).** `state/prices.json` `quotes["BTC-USD"].previousClose` = 83 679,47 medan den daterade punkten 2026-10-12 i `state/price_history.json` är 81 826,13. För `ETH-USD` är motsvarande 2 534,70 mot 2 450,01. **Omfång:** 2 av 2 mynt. Fältet hade visat −1,25 % för BTC och −2,23 % för ETH, medan serien ger +0,99 % respektive +1,15 %. **Ersättningskälla:** de daterade punkterna i marknadsöversikten.
4. **MÅNDAGENS RUTINER UTEBLEV 2026-10-12 – kopplas till `scheduled-routines-skipped` och `us-rotation-lage-a-missed` (öppen 3 veckor), ÅTERKOMMANDE.** Det finns ingen `reports/scout/rapport-261012.md`, ingen nordisk eller amerikansk veckorapport för vecka 42 (`reports/weekly/` slutar på `veckorapport-261006.md` och `reports/us_weekly/` på `us-veckorapport-261007.md`), och **noll rader i `state/decisions.json` daterade 2026-10-12** för båda böckerna. **Omfång:** LÄGE A för vecka 42 saknas i båda böckerna. Två scout-kandidater (`261010-TEVA` och `261010-ZS`, som löper ut 2026-10-16) och en L-4-omprövning (`261009-DVN`) står utan avgörande. **Åtgärd:** enligt `prompts/gemensam_korning.md` ska nästa öppna handelsdags körning (i dag) ta igen LÄGE A för båda böckerna. Kontrollera att nordisk rotation 08:40 och US-rotation 15:00 CEST faktiskt startar i dag. Om de inte gör det, kör dem för hand.
5. **`watchlist-cap-vs-measurability-conflict` – ÅTERKOMMANDE.** `config/watchlist_us.txt` har nu 103 symbolrader, mot riktmärket 25, efter dagens tillägg av `ABT` och `NFLX` (L-5). Inga rader stryks, eftersom skydden i `prompts/gemensam_korning.md` (giltiga kandidater, 20-dagarsutvärdering och rapportbevakning) går före riktmärket. `BK` saknar fortfarande kurs i `state/prices.json` (en av 6 symboler utan `price`, tillsammans med `AI-USD`, `BIOT.ST`, `DOMETIC.ST`, `ICA.ST` och `NRS.OL`), med rapport på torsdag.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
