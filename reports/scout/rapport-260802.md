# Daglig Scout: USA & Krypto
**Datum:** 2026-08-02
**Marknadsklimat:** Helgedition (söndag) – US-börserna stängda; **fredagens (31/7) stängning** är fortfarande senaste verifierade aktienivå (oförändrad sedan gårdagens rapport). Läget in i den nya veckan präglas av **AI-moln-differentieringen**: molnvinnarna (AMZN +15,3 %, GOOGL +6,7 %, MSFT över veckan +19 %) prissätts som monetiserad AI-capex medan AAPL (−7,4 %) och META straffas. Krypto ligger i motvind efter månadsskiftets rotation tillbaka in i aktier (BTC under 63k, ETH under 1 900 vid fredagens snapshot). Veckans agenda är makrotung: ISM (mån), JOLTS (tis) och **NFP (fre 7/8)** blir facit för en hökaktig Fed.

## Marknadsöversikt
Kurskälla: `state/prices.json` (Yahoo Finance chart API, `generatedAt` 2026-07-31T22:14Z). Idag är **söndag 2 aug**, US-börserna stängda sedan fredag; senaste verifierade aktienivå är **fredagens (31/7) reguljära stängning**. **OBS dataintegritet (ÅTERKOMMANDE – se åtgärdspunkt nedan):** prices.json saknar fältet `schemaVersion` och `previousClose` är fastfruset på förra veckans nivåer för **12 av 37 tickers** → dagsrörelse beräknad mot `previousClose` ger falska vecko-långa hopp (t.ex. MSFT "+21,7 %", META "−6,5 %" på fel bas). Därför beräknas **alla dagsrörelser nedan mot daterade torsdagsstängningar (07-30 → 07-31) ur `state/price_history.json`** och absoluta nivåer anges ur prices.json (verifierad marketTime). Krypto-nivåerna är en **fredag-kväll-snapshot** (marketTime 2026-07-31T22:14Z), INTE live söndag – helgens kryptorörelse går inte att verifiera ur mina källor.

- **S&P 500 (^GSPC):** 7 489,72 — marketTime 2026-07-31T21:22Z (prices.json). **+0,70 %** mot torsdagens 7 437,63. Veckan hämtade tillbaka onsdagens FOMC-/chip-dipp (bottnade 7 316 den 29/7). Källa: prices.json + price_history.json, 2026-07-31.
- **Nasdaq (^IXIC):** 25 373,85 — marketTime 2026-07-31T21:15Z (prices.json). **+1,00 %** mot torsdagens 25 122,18. Ledd av mega-cap-molnvinnarna (AMZN/GOOGL); ny årshögsta-zon. Källa: prices.json + price_history.json, 2026-07-31.
- **BTC-USD:** 62 940,68 USD — marketTime 2026-07-31T22:14Z (prices.json, fredag-kväll-snapshot). **−3,01 %** mot torsdagens 64 893,18; föll under 63k när kapital roterade in i aktierallyt vid månadsskiftet. Trots dippen upp ~+7,5 % för juli. **Helgens rörelse EJ VERIFIERAD** (prices.json är från fredag; live söndagskurs saknas). Källa: prices.json + price_history.json, 2026-07-31.
- **ETH-USD:** 1 860,90 USD — marketTime 2026-07-31T22:14Z (prices.json, fredag-kväll-snapshot). **−3,34 %** mot torsdagens 1 925,25; bröt tillbaka under 1 900 och 2 000-utbrottet uteblev igen. **Helgens rörelse EJ VERIFIERAD.** Källa: prices.json + price_history.json, 2026-07-31.

## Ekonomiska siffror & kalender
**Senaste marknadsrörande utfall (verifierade tidigare i veckan):**
- **Juni-PCE (rapporterad tor 30/7):** **kärn-PCE +0,1 % m/m** (svalare än väntat +0,2 %) och **3,3 % å/å** (ned från 3,4 %). Headline −0,1 % m/m. Svalare-än-fruktat gav luft åt aktierallyt, men båda måtten ligger kvar väl över Feds 2 %-mål. Källa: BEA/Yahoo Finance (2026-07-30).
- **FOMC 29 juli (veckans tyngsta makro):** styrränta oförändrad **3,50–3,75 %**, men **hökaktig hold med tre dissens** (ville HÖJA 25 bp) och slopad forward guidance → 10-årsräntan över 4,67 %. Källa: CNBC/CNN (2026-07-29).

**Kommande releaser & händelser (3–7 aug) – marknadsrörande markerat:**
- **Måndag 3/8:** ISM Manufacturing (juli) + Construction Spending. **Palantir (PLTR) rapporterar AMC** – första tunga namnet i den nya veckan. Källa: Kiplinger/CNBC (2026-07-31).
- **Tisdag 4/8:** JOLTS (job openings) – arbetsmarknads-förfacit inför NFP.
- **Onsdag 5/8:** ADP privat sysselsättning + ISM Services.
- **★ Fredag 7/8 08:30 ET: Juli jobbrapport (NFP) ← veckans mest marknadsrörande.** Konsensus **+87 500** jobb (från +57 000), arbetslöshet väntas upp till **4,3 %** (från 4,2 %). Efter en Fed med tre höjnings-dissens blir arbetsmarknadsfacit nyckeln för räntebanan och för värderingskänsliga megacaps. Källa: CNBC/FactSet/Kiplinger (2026-07-31).

## Aktuella händelser & katalysatorer
Inga nya bekräftade bolagskatalysatorer sedan fredagens stängning (helg). Nyhetsradar `state/news_feed.json` (`generatedAt` 2026-07-31T22:17Z) domineras av mikrobolags-8-K:er och PR-wire-brus utan mega-cap-signal; enda makronyheten är Fed-förslag om regelmodernisering (icke marknadsrörande). De fortsatt live-katalysatorerna in i veckan är fredagens rapporter:
- **Amazon KROSSADE Q2 (30/7 AMC):** intäkter **200,61 mdr** (+19,6 % å/å), EPS **5,75** (beat), **AWS +37 %** (42,2 mdr, snabbast på 18 kvartal, run rate ~169 mdr), AWS-marginal **39,4 %**; AI/chip vardera >25 mdr run rate. Aktien **+15,3 %** fredag (235,50 → 271,58). Källa: CNBC/Amazon IR (2026-07-30/31). **← veckans tyngsta positiva katalysator.**
- **Apple föll trots beat (fiskala Q3, 30/7 AMC):** rekordintäkt **109,4 mdr** och EPS **2,02** (båda beat), iPhone +22 %, men aktien **−7,4 %** (333,43 → 308,91) på **svag Q4-guide** (+9–11 %), **marginalvarning** (47–48 % mot 50,1 %) och **Services-miss** (30,7 mdr). Källa: CNBC/FX Leaders/Benzinga (2026-07-31). **← veckans tyngsta katalysator på nedsidan.**
- **Coinbase-miss (Q2, 30/7 AMC):** **nettoförlust 359,5 MUSD** (−1,36/aktie mot väntad −0,17), intäkter 1,2 mdr (miss), spot-volym −20 %. Ljuspunkt: abonnemang/tjänster nu **48 % av intäkten** och rekord spot-andel 10,3 %. Aktien **−10,6 %** fredag (163,58 → 146,26). Källa: Qz/CryptoTimes/CoinDesk (2026-07-31).
- **Kryptobeta rött i månadsskiftesrotationen (31/7):** COIN −10,6 %, RIOT −8,8 % (22,12 → 20,17), MSTR −4,6 %, MARA −4,2 % – pressat av spot-nedgång + kapitalrotation till aktier. ⚠️ Ingen enskild nyhetschock, bredd-rotation. Källa: prices.json + price_history.json + CoinDesk (2026-07-31).

## Uppföljning av tidigare case
- **Amazon (AMZN, rapport-260801):** 271,58 USD (marketTime 2026-07-31T20:00Z, prices.json) – oförändrad sedan gårdagens rapport (helg, ingen ny handel). Gap-hold-testet är fortsatt olöst till måndagens öppning. → **INTAKT (avvaktar Monday gap-test).**
- **Apple (AAPL, rapport-260801):** 308,91 USD (marketTime 2026-07-31T20:00Z, prices.json) – oförändrad (helg). Ingen ny information; fade/avvakta-tesen ligger kvar. → **INTAKT (försiktigheten oförändrat motiverad).**
- **Coinbase (COIN, rapport-260801):** 146,26 USD (marketTime 2026-07-31T20:00Z, prices.json) – oförändrad aktienivå (helg); helgens BTC/ETH-riktning som är dess primära filter går dock EJ att verifiera ur prices.json. → **FÖRSVAGAD (nedtrend intakt, kryptovolym svag).**

## Dagens case
> Söndagsedition: inga nya verifierbara katalysatorer sedan fredag → nya case tvingas INTE fram (se makro-sektionen). Nedan de två fortsatt live-setuperna som går att prisverifiera ur fredagens stängning, framåtblickande mot veckans facit.

### Case 1: Amazon ([AMZN] / NASDAQ)
**Katalysator:** Q2-rapporten 30/7 AMC krossade – **AWS +37 %** (run rate ~169 mdr), AWS-marginal 39,4 %, koncernintäkt 200,61 mdr (+19,6 %), EPS 5,75. Aktien +15,3 % fredag. Verifierad, bekräftad (ej rykte). Källa: CNBC/Amazon IR (2026-07-30/31).
**Bull case:** AWS-återaccelerationen är den renaste bekräftelsen på att AI-capex omsätts i BÅDE moln­tillväxt och marginal – till skillnad från Metas capex-utan-payoff. Moln + annonser (rekord) + detaljhandel drar samtidigt; run rate på AI/chip >25 mdr vardera ger flerårig synlighet. Bekräftar AI-moln-ledarskapet ihop med MSFT (Azure +43 %).
**Bear case:** +15 % på en dag inbjuder "sell the print"-risk vid måndagens öppning; en hökaktig Fed (tre höjnings-dissens) + fredagens NFP kan pressa värderingskänsliga megacaps oavsett rapport. AWS-tillväxt på hög bas svår att accelerera; gap-fyllnad kan uppstå efter helgen.
**Setup:** Verifierad reguljär stängning **271,58 USD** (marketTime 2026-07-31T20:00Z, prices.json), +15,3 % mot torsdagens 235,50 (price_history.json). Trend starkt positiv efter utbrott. **Avvakta måndagens öppning för att se om gapet håller** innan positionering; väg in NFP 7/8 som riskfilter. Källa: prices.json + price_history.json + CNBC, 2026-07-31.

### Case 2: Coinbase ([COIN] / NASDAQ) – kryptorotations-watch
**Katalysator:** Q2 30/7 AMC – nettoförlust 359,5 MUSD (−1,36/aktie mot väntad −0,17), intäkt 1,2 mdr (miss), spot-volym −20 %. Aktien −10,6 % fredag. I samma rotation föll BTC −3,0 % och ETH −3,3 % (fredag-snapshot). Verifierad, bekräftad. Källa: Qz/CryptoTimes/CoinDesk (2026-07-31).
**Bull case:** Intäktsmixens skifte mot återkommande abonnemang/tjänster (48 %, upp från 29 % Q4-24) de-riskar affärsmodellen från volatila handelsvolymer; rekord spot-andel 10,3 % visar marknadsandelsvinster även i svag miljö. En vändning i kryptovolym ger stor hävstång på hög-beta-profilen. **Primär trigger att bevaka: BTC återtar 63k** (helgnivån EJ verifierad – kräver färsk kurs innan slutsats).
**Bear case:** Tredje raka kvartalet under estimat med faktisk nettoförlust bekräftar att handelsintäkterna kollapsar när volymerna faller tvåsiffrigt. Med krypto i månadsskiftesrotation ut ur risk saknas kortsiktig volymkatalysator; −10,6 % på en dag visar sårbarheten tills spot-aktiviteten vänder.
**Setup:** Verifierad reguljär stängning **146,26 USD** (marketTime 2026-07-31T20:00Z, prices.json), −10,6 % mot torsdagens 163,58 (price_history.json). Kraftig nedtrend efter rapporten. **Ingen positionering utan (a) verifierad färsk BTC/ETH-riktning och (b) COIN-stabilisering** – helgens kryptorörelse går inte att verifiera ur prices.json, så caset är en bevakning, inte ett köpläge. Källa: prices.json + price_history.json + CoinDesk, 2026-07-31.

## Makro- & sektorfaktorer att bevaka
Tre trådar drar åt olika håll in i den nya veckan. **AI-moln-differentieringen (temat just nu):** AMZN (AWS +37 %), MSFT (Azure +43 %, +19 % på veckan) och GOOGL (+6,7 %) belönas för monetiserad AI-capex medan Meta straffas för capex-utan-payoff och Apple för marginalpress/svag guide – marknaden prissätter tydligt VEM som tjänar pengar på AI, inte bara vem som spenderar. **Ränta/Fed (riskfiltret):** FOMC:s hökaktiga hold med tre höjnings-dissens + slopad guidance höjde riskpremien; svala juni-PCE (kärna 3,3 %) gav luft, men **veckans datakedja ISM (mån) → JOLTS (tis) → ADP/ISM Services (ons) → NFP (fre 7/8, konsensus +87,5k, arbetslöshet 4,3 %)** blir nästa binära facit för räntebanan. **Palantir (mån 3/8 AMC)** är veckans första bolagsfacit. **Krypto (egen väg, i motvind):** månadsskiftets kapitalrotation tillbaka in i aktier tryckte BTC under 63k och ETH under 1 900 vid fredagens snapshot; kryptobeta (COIN/RIOT/MARA) tog extra stryk – helgens rörelse är dock oförvisserlig ur mina källor.

**Varför bara två case:** helgen har inte tillfört någon ny verifierbar katalysator sedan fredag, och att fabricera ett tredje case ur oförändrad data vore att tvinga fram signal. De verkliga beslutspunkterna ligger i veckans makro (NFP 7/8) och måndagens gap-test av fredagens rapportrörelser.

**Tillämpade lärdomar:** **L-2** – samtliga bevakade case-tickers (AMZN, COIN + BTC/ETH) ligger i `config/watchlist_us.txt` med verifierad kurs i prices.json. **L-3** – dataintegritetsdefekten i prices.json eskaleras nedan som namngiven åtgärdspunkt med kvantifierat omfång i stället för att bara gås runt. L-1 är nordisk-specifik och gäller inte scouten. **Ryktesdrivet case idag: nej** – båda casen vilar på bekräftade rapporter och verifierade prices.json-nivåer.

### ⚠️ Åtgärdspunkt till Dren (L-3, ÅTERKOMMANDE) – dataintegritet i state/prices.json
- **Fil & fält:** `state/prices.json`, fältet **`previousClose`** (samt avsaknad av `schemaVersion`).
- **Fel:** filen saknar `schemaVersion`-fältet (ska vara `"2026-08-02-prevclose"` eller senare) och `previousClose` är fastfruset på förra veckans nivåer för **12 av 37 tickers** (bekräftat: MSFT 15,4 % fel bas, META 10,4 %, HNSA.ST 10,3 %, AMD 7,5 %, GOOGL 4,2 %, MORLD.OL 3,9 %, COIN 3,2 %, IREN 3,1 % m.fl.). Dagsrörelse mot `previousClose` blir därmed en vecko-rörelse och ger falska tal.
- **Verifierad ersättningskälla som använts:** daterade stängningar ur `state/price_history.json` (07-30 → 07-31) för alla dagsrörelser; absoluta nivåer ur prices.json (verifierad `marketTime`).
- **Rotorsak / status:** `prevCloseFrom`-fixen i `fetch-prices.mjs` (CLAUDE.md 2026-08-02) har ännu INTE producerat en ny fil – `prices.yml` kör vardagar, senaste körning 2026-07-31T22:14Z (före fixen slog igenom i actionen). **Verifiera vid måndagens 05:00 UTC-körning** att den nya `prices.json` bär `schemaVersion` och att `previousClose` blivit en dagsbas. Defekten har nu beskrivits i ≥ 2 rapporter i rad utan att vara åtgärdad → märkt **ÅTERKOMMANDE**.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
