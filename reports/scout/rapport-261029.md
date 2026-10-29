# Daglig Scout: USA & Krypto
**Datum:** 2026-10-29
**Marknadsklimat:** Fed lämnade räntan oförändrad på 3,75–4,00 % i en 10–2-omröstning där två ledamöter ville höja direkt. `^GSPC` steg för tredje sessionen i rad (+0,28 % till 7 743,98). Rapportkvällen gick isär: `MSFT` steg ~4 % efterbörs på Azure +48 %, medan `GOOGL` föll ~9–10 % på en vinstmiss och negativt fritt kassaflöde. Kryptot står stilla under EMA20 (`BTC-USD` 81 030,16, `ETH-USD` 2 352,64). **Aktiva lärdomar tillämpade:** L-3 (åtgärdspunkter sist), L-4 (gårdagens två vilande kandidater har nu full historik), L-5 (kalenderns källa och täckning) och L-6 (inga klasser utesluts; `AXGN` poängsätts trots att medicinteknik inte står bland fokussektorerna, eftersom `config/fokus_scout.md` prioriterar "**Earnings surprises:** bolag som krossat förväntningarna i senaste rapporten" och marknaden "USA (NYSE & NASDAQ)"). L-1, L-2, L-7 och L-8 gäller inte scouten.

## Marknadsöversikt

`git pull` 2026-10-29 05:48 UTC (06:48 CET) gav `origin/main` = `4ce5650`. Källan är `state/prices.json` med `generatedAt` 2026-10-29T00:55:28Z, `schemaVersion` 2026-08-02-prevclose, `tickerCount` 298, `okCount` 293 och `wideAt` 2026-10-29T00:55:28Z (Yahoo Finance chart API via GitHub Actions).

| Symbol | Nivå | Rörelse sedan föregående session | 5 sessioner (mot 2026-10-21/22) | marketTime |
|---|---|---|---|---|
| `^GSPC` | 7 743,98 | +0,28 % (7 722,60 → 7 743,98) | −0,17 % | 2026-10-28T21:18:42Z |
| `^IXIC` | 26 549,85 | +0,27 % (26 477,81 → 26 549,85) | −0,57 % | 2026-10-28T21:15:59Z |
| `BTC-USD` | 81 030,16 | −0,28 % mot daterad punkt 2026-10-28 (81 259,33) | −0,33 % | 2026-10-29T00:53:41Z |
| `ETH-USD` | 2 352,64 | −0,25 % mot daterad punkt 2026-10-28 (2 358,56) | −1,40 % | 2026-10-29T00:54:00Z |
| `SPY` (sleeve) | 772,31 | +0,34 % (769,66 → 772,31) | −0,10 % | 2026-10-28T20:00:00Z |

**Kryptots dagsrörelse** räknas mot den daterade punkten i `state/price_history.json`, inte mot `previousClose`. Fältet avviker fortfarande från serien (åtgärdspunkt 3). Dagens nivåer för båda mynten är intradagspunkter från 00:53–00:54 UTC.

**Teknik** (råserien i `state/price_history.json`, 250 punkter):
- **`^GSPC`:** 6,0 % över MA200 (7 302,68) ⇒ **regimfiltret för US-boken är fortsatt PÅ**. Kursen ligger över EMA20 (7 714,10) och EMA50 (7 685,57), med RSI 53,0.
- **`^IXIC`:** strax under EMA20 (26 589,05) och strax över EMA50 (26 544,34), 6,1 % över MA200. RSI 48,9.
- **`BTC-USD`:** under EMA20 (81 770,99), över EMA50 (79 824,97) och 12,2 % över MA200 (72 217,54). RSI 47,8.
- **`ETH-USD`:** under EMA20 (2 436,85) och EMA50 (2 423,88), 10,5 % över MA200 (2 129,85). RSI 40,0.

**Onsdagens bredd** bland de 118 US-aktierna med kurs och `previousClose` i `state/prices.json` (`price / previousClose − 1`, reguljär session 2026-10-28):
- **Starkast:** `AXGN` +31,47 %, `VRT` +16,48 %, `SKHY` +13,30 %, `ORCL` +10,73 %, `RIOT` +6,56 %, `MU` +5,86 %, `IREN` +5,10 %, `AMAT` +5,07 % och `SOFI` +4,51 %.
- **Svagast:** `BIIB` −3,43 %, `NET` −2,77 %, `VST` −2,69 %, `VZ` −1,71 %, `ZS` −1,67 %, `U` −1,50 % och `AKAM` −1,50 %.

De fyra starkaste har alla en daterad katalysator samma dag: rapport (`AXGN`, `VRT`, `SKHY`) eller investerardag (`ORCL`). Minnes- och AI-infrastrukturkedjan ledde (`SKHY`, `MU`, `AMAT`, `VRT`). **Efterbörs** finns i `state/prices.json` bara för symboler som rapporterar inom 0–2 handelsdagar räknat från 00:53 UTC. Därför **saknas efterbörskurs för `MSFT` och `GOOGL`**, som rapporterade i går kväll (åtgärdspunkt 7). Efterbörs ~23:59 UTC inför kvällens rapporter, alltså före eventet: `AMZN` 254,60 regulj., `COIN` 160,06 (−1,39 %), `INTC` och `MSTR` mindre rörelser.

## Ekonomiska siffror & kalender

**Senaste utfall:**
- **FOMC 2026-10-28: räntan oförändrad på 3,75–4,00 %, 10–2.** Lisa Cook och Beth Hammack röstade för en höjning med 25 bp. Ordförande Kevin Warsh betonade inflationsbekämpningen, och decemberbeslutet görs beroende av data. Marknaden prisar ~85 % för en höjning den 9 december (Yahoo Finance live och CNBC 2026-10-28, Bloomberg-data). Den 10-åriga räntan steg till ~5,03 % efter beskedet (CryptoNews AU/FXStreet 2026-10-28; nivån har en enda källa och är **inte verifierad**). **Detta löser gårdagens oklarhet om målintervallet:** det är 3,75–4,00 %, vilket stämmer med en höjning i september. **Utfallet är hökaktigt** – två reservationer för en omedelbar höjning.
- **Conference Board oktober (2026-10-27): 91,7 mot väntat ~81** (rapport-261028).

**Kommande:**
- **I DAG torsdag 2026-10-29, 08:30 ET (13:30 CET): BNP Q3, förhandsskattning. Konsensus 3,2 %** (FXStreet; ActionForex anger 3,0 %) mot 2,2 % i Q2, och Atlanta Feds GDPNow låg på 3,5 % (20/10). **Samtidigt: jobless claims**, konsensus 196–200 tusen mot 194 tusen. **Dagens mest marknadsrörande punkt** – ett starkt BNP-tal stärker en höjning i december. Samma dag: **ECB-beslut** (väntat oförändrat, depositränta 2,50 %) och euroområdets Q3-flash (konsensus 0,2 %).
- **Fredag 2026-10-30:** **PCE september** och **BoJ**-beslut (FXStreet 2026-10-26 nämner "US PCE" denna vecka; exakt dag och tid är inte verifierade ur primärkälla).

**Rapporter nästa 5 handelsdagar** (`state/earnings_calendar.json`, `generatedAt` 2026-10-29T00:53:26Z, `errors` tomt), US-symboler:
- 10-29 (i kväll): `AMZN`, `COIN`, `MSTR`, `INTC`, `RDDT`, `HII`, `ILMN` och `SPXC`
- 10-30: `XOM`, `CVX` och `CBOE`
- 11-02: `AAPL`, `PLTR`, `RIG`, `RHP`, `CRGY` och `AESI`
- 11-03: `AMD`, `ANET`, `SMCI`, `TEVA`, `AMRX` och `PCVX` (`PCVX` har `isEstimate: true`)
- 11-04: `NVO`, `PAYC`, `PTC`, `QGEN`, `UTHR`, `KHC`, `BKH`, `CXW`, `RIOT` och `MARA` (`MARA` har `isEstimate: true`)
- 11-05: `AKAM`, `DVN`, `EVCM`, `IREN`, `NET`, `TEAM` och `U`, samt `SYNA` och `WBD` (båda `isEstimate: true`)

**L-5:** kalendern ser bara de symboler `prices.yml` hämtar, så resten av det amerikanska universumet är **OKONTROLLERAT**. Rapporterna i går från Fortinet (föll efterbörs enligt Stocktitan 2026-10-28) och SK Hynix (`SKHY`, finns i watchlisten men saknades i kalendern) syns inte i den. `META`:s rapportdatum är motsägelsefullt mellan källorna (21/10 eller 28/10) och **inte verifierat**. Alla datum ovan är bevakningsposter enligt punkt 8, aldrig köpförslag. **`AMZN`, `COIN`, `MSTR` och `INTC` i kväll får inte köpas in i rapporten.**

## Aktuella händelser & katalysatorer

- **Microsoft (`MSFT`), Q1 FY27, 2026-10-28 efter stängning:** intäkter 92,3 mdr USD (+19 %), Microsoft Cloud 63,9 mdr (+30 %), **Azure +48 %**, non-GAAP EPS 4,89 mot ~4,72. Kommersiell RPO steg 73 % till 677 mdr. Q2-guiden ligger på 96,0–97,1 mdr med Azure +49–50 %. Capex för helåret FY27 väntas bli ~170 mdr, och bolaget säger att det förblir FCF-positivt (247wallst, Seeking Alpha, investingLive 2026-10-28). Aktien steg **~4 % efterbörs** (Yahoo Finance live 2026-10-28; efterbörskursen saknas i `state/prices.json`). **Bekräftat utfall.**
- **Alphabet (`GOOGL`), Q3 2026, 2026-10-28 efter stängning:** Google Cloud steg 103 % till 30,7 mdr, men **EPS blev 2,12 mot ~2,87–3,02**, delvis på grund av en orealiserad förlust på 8,7 mdr på aktieinnehav. Capex var 51,4 mdr i kvartalet, och FCF var negativt med ~−9,1 mdr. Söktillväxten bromsade till 12 % (Fortune, Investing.com, Benzinga 2026-10-28). Aktien föll **−8 till −10 % efterbörs** (källorna är oeniga). **Negativ katalysator.** Kursen 324,89 ligger redan under MA200 (341,20), så det blir inget case.
- **Vertiv (`VRT`), Q3 2026, 2026-10-28 före öppning (SEC 8-K ex. 99.1):** nettoförsäljning 4,31 mdr USD (+61 %, organiskt +55 %), **organiska order mer än +100 %**, justerat EPS 2,21 (+78 %). Helårsguiden höjdes med 650 MUSD till 14,45–14,85 mdr, med justerat EPS ~7,15 i mitten (Investing.com, Benzinga, TIKR 2026-10-28). Aktien steg +16,48 % till 242,94 (`state/prices.json`, 2026-10-28T20:00:02Z) på 3,3× normal volym. **Bekräftat utfall.**
- **Oracle (`ORCL`), investerardag 2026-10-28:** bolaget räknar med ett fritt kassaflöde på ~30 mdr USD i FY29, positivt redan från andra halvåret FY28. Nya kapitalresningar begränsas till 20 mdr fram till FY30, och intäktsmålet för FY30 på 225 mdr står kvar (Oracle IR, Bloomberg, CNBC 2026-10-28). Aktien steg +10,73 % till 144,54 (2026-10-28T20:03:50Z) på 3,0× volym. **Bekräftat besked, men det är mål och inte utfall.**
- **Axogen (`AXGN`), Q3 2026, 2026-10-28 före öppning:** intäkter 75,8 MUSD (+26,2 %) och justerat EPS 0,21 mot 0,13. Intäktsguiden för 2026 höjdes till minst 290 MUSD, inklusive BioCircuit som förvärvades 1/10 (Investing.com, TIKR, StreetInsider 2026-10-28). Aktien steg +31,47 % till 49,25 (2026-10-28T20:00:01Z) på 6,1× volym. **Bekräftat utfall.**
- **SK Hynix (`SKHY`, ADR), Q3 2026, 2026-10-28:** intäkter 104,62 bn KRW och rörelseresultat 83,33 bn KRW mot väntade 76,72 bn (TheStreet 2026-10-28). ADR:en steg +13,30 % till 164,70. **Inget case:** serien har bara 78 punkter (ny notering), så MA200 går inte att räkna, och US-boken spärrar då per regel nya positioner.
- **`state/news_feed.json`** (`generatedAt` 2026-10-28T23:16:12Z) täcker **10 av 10 handelsdagar** (2026-10-15 – 2026-10-28, `missingDays` tomt). **Alla 91 posterna för 2026-10-28 ligger efter 18:00 UTC**, så ingen av gårdagens rapporter (VRT, AXGN, SKHY, ORCL:s investerardag) finns i flödet – tredje dagen i rad (åtgärdspunkt 5). `globenewswire` och `globenewswire-earnings` svarar fortfarande HTTP 403 (åtgärdspunkt 1).
- **Inga rykten används i dag.**

## Uppföljning av tidigare case

- **`SOFI` (rapport-261028): KURS EJ VERIFIERAD då (stängning före rapporten 14,46, 2026-10-26) → 17,14 nu** (+18,5 % sedan dess, varav +4,51 % i går; `state/prices.json` 2026-10-28T20:00:01Z). Historiken är nu fylld till 250 punkter. Kursen ligger **4,2 % under MA200 (17,88)** men över EMA20 (15,51) och EMA50 (16,20), med RSI 62,4. **Tes INTAKT fundamentalt** och reaktionen fortsätter, men som köpcase är den **FÖRSVAGAD**: kurs ≤ MA200 blockerar.
- **`PNR` (rapport-261028): KURS EJ VERIFIERAD då (55,22, 2026-10-26) → 64,37 nu** (+16,6 %, varav +3,34 % i går; 2026-10-28T20:00:02Z). Kursen ligger **15,9 % under MA200 (76,55)**, med **RSI 80,2**, alltså över grind 3:s tak på 75. **Tes FÖRSVAGAD** som köpcase: den är både överköpt och under MA200.

**Kandidatkön (`state/scout_candidates.json`):** före dagens körning fanns 95 poster, varav 89 `rejected`, 6 `promoted` och **0 `new`**. Inga poster är försenade.

**L-4-kontroll:** `261028-SOFI` och `261028-PNR` avvisades 2026-10-28 av US-boken (`us-daglig-261028.md`) med motiveringen **"Grind 2 (teknik) OMÄTBAR … VILANDE enligt L-4"**. Det var en tillfällig datalucka: serierna hade 1 punkt. **Luckan är nu fylld.** Båda har 250 daterade stängningar i `state/price_history.json` och en kvalificerad kurs efter katalysatorn i `state/prices.json` (reguljär stängning 2026-10-28), och båda ligger inom `expiresAt` 2026-11-04. **Enligt L-4 ska US-rotationen kl. 15:00 i dag ta nya, fullständiga avgöranden och logga dem i `state/decisions.json`.** Ett avvisande med namngiven grind räcker; scouten noterar att båda ligger under MA200. Scouten avgör dem inte själv.

**Innehav och pending:** US-boken har inga aktieinnehav, och `SPY` ligger på 100 % (`state/portfolj_us.md`). `SPY` står på 772,31 (2026-10-28T20:00:00Z), −0,12 % mot entry 773,26. **Pending `NUE` ≤ 262,00 är EJ TRIGGAD:** dagslägsta 2026-10-28 var 263,435 (0,55 % över villkoret) och stängningen 271,79 (2026-10-28T20:00:03Z).

## Dagens case

### Case 1: Microsoft (MSFT / NASDAQ)
**Katalysator:** Bekräftad Q1 FY27-rapport 2026-10-28 efter stängning. Azure växte 48 % (förväntningarna i förhandsanalyserna låg på ~45 %), intäkterna blev 92,3 mdr USD (+19 %) och non-GAAP EPS 4,89 mot ~4,72. Kommersiell RPO ökade 73 % till 677 mdr. Q2-guiden lyfter Azure till 49–50 % (Seeking Alpha, 247wallst, investingLive 2026-10-28).
**Bull case:** Azure accelererar trots kapacitetsbrist; ledningen säger att efterfrågan överstiger utbudet. En RPO på 677 mdr ger flerårig synlighet. Till skillnad från Alphabet samma kväll förblir Microsoft FCF-positivt trots ~170 mdr i capex för FY27. Kvällens rapport skilde alltså vinnaren från förloraren inom hyperscaler-capex.
**Bear case:** Capex mer än fördubblades (39–45 mdr i kvartalet beroende på hur leasing räknas) och ska överstiga 50 mdr i Q2. Viss GPU-kapacitet från tredje part har skjutits till andra halvåret FY27, vilket är en leveransrisk för Azure-guiden. En hökaktig Fed (10-årsräntan ~5 %) pressar multiplarna för megacap-tillväxt. En efterbörsrörelse på ~4 % kan reverseras i reguljär handel ("sell the news").
**Setup:** Senaste verifierade kurs **531,01** (reguljär stängning, `state/prices.json` 2026-10-28T20:00:01Z) är en **PRE-event-kurs**. Efterbörskursen saknas i filen (åtgärdspunkt 7), så **KURS EJ VERIFIERAD efter katalysatorn.** Tekniken före rapporten: 21,4 % över MA200 (437,32), över EMA20 (526,55) och EMA50 (508,02), RSI 56,1, 2,3 % under 250-dagarshögsta (543,45). En reaktion på +4 % skulle ta kursen till runt den toppen, som blir motståndet att bedöma. Kandidat **`261029-MSFT`** har `price: null`. `refresh-candidate-prices.mjs` fyller i kursen när förbörs eller dagens reguljära session finns. En förbörskurs får bara ge en villkorad plan mot reguljär session.

### Case 2: Axogen (AXGN / NASDAQ)
**Katalysator:** Bekräftad Q3-rapport 2026-10-28 före öppning. Intäkterna steg 26,2 % till 75,8 MUSD och justerat EPS blev 0,21 mot konsensus 0,13. Intäktsguiden för helåret 2026 höjdes till minst 290 MUSD, varav minst 7 MUSD från förvärvet BioCircuit (Investing.com, TIKR, StreetInsider 2026-10-28).
**Bull case:** Ett tydligt beat på både intäkter och vinst, plus en guidehöjning, i ett bolag med strukturell tillväxt inom perifer nervreparation. Att förvärvet redan bidrar till guiden ger en konkret väg till fortsatt tillväxt över 20 %. Rörelsen var bolagsspecifik (marknaden låg platt) och kom på 6,1× normal volym.
**Bear case:** Värderingen är hög, ~83× framåtriktad vinst efter rörelsen (Investing.com 2026-10-28). Ett gap på +31 % gör att en stor del av beatet troligen redan är prisat, och **RSI 74,5 ligger precis under grind 3:s tak på 75**. Det är ett småbolag inom medicinteknik med begränsad analytikertäckning, så risken för en rekyl efter gapet är hög.
**Setup:** **49,25** (reguljär stängning 2026-10-28T20:00:01Z, `state/prices.json`, efter katalysatorn). Kursen ligger 25,1 % över MA200 (39,38), över EMA20 (38,94) och EMA50 (40,89), och 4,8 % under 250-dagarshögsta (51,73), som är närmaste motstånd. Volymen 9,28 mn aktier (~457 MUSD) är 6,1× 20-dagarssnittet, och snittomsättningen ~58 MUSD/dag ligger över likviditetsgolvet på 20 MUSD. Gapet på över 3 % gör att ett eventuellt köp enligt bokens regel bör läggas som villkorad limit, inte som jakt på gapet. Kandidat **`261029-AXGN`**.

### Case 3: Vertiv (VRT / NYSE)
**Katalysator:** Bekräftad Q3-rapport 2026-10-28 före öppning (SEC 8-K ex. 99.1). Nettoförsäljningen steg 61 % till 4,31 mdr USD, de organiska orderna mer än fördubblades och justerat EPS steg 78 % till 2,21. Helårsguiden höjdes med 650 MUSD till 14,45–14,85 mdr, och justerat rörelseresultat väntas överstiga 3,5 mdr (Investing.com, Benzinga 2026-10-28).
**Bull case:** En orderingång över +100 % är den starkaste ledande indikatorn i AI-infrastrukturkedjan (kylning och kraft till datacenter). Den bekräftades samma kväll av Microsofts uttalande om att efterfrågan överstiger kapacitet och av Alphabets capex på 51,4 mdr. Volymen var 3,3× normalt.
**Bear case:** Guiden kräver ~50 % organisk tillväxt i Q4, så leveransrisken är den största enskilda risken (TIKR 2026-10-28). Tekniskt är trenden fortfarande nedåt efter toppen på 376,23: **kursen ligger 10,0 % under MA200 (269,86)** och EMA20 (222,78) ligger under EMA50 (241,29). Alphabets negativa FCF visar att marknaden kan börja ifrågasätta capex-cykeln.
**Setup:** **242,94** (reguljär stängning 2026-10-28T20:00:02Z, efter katalysatorn). Kursen ligger över EMA20 och EMA50 men under MA200, med RSI 57,0 och 3,3× volym. **Enligt bokens regel blockerar kurs ≤ MA200 en ny aktieposition**, så kandidaten loggas för mätbarhet och väntas bli avvisad på grind 2 tills kursen tagit MA200. Kandidat **`261029-VRT`**.

**Kandidatkön:** fyra nya poster skrivs med `status: "new"`, `confirmed: true`, `catalystDate` 2026-10-28 och `expiresAt` 2026-11-05: `261029-MSFT` (`price: null`, pre-event), `261029-AXGN`, `261029-VRT` och **`261029-ORCL`** (`catalystType: other`, investerardagen; 144,54, 2026-10-28T20:03:50Z, 8,3 % under MA200 157,59 – handlingsbar bara om kursen tar MA200 inom fönstret). `validate-scout-candidates.mjs` gav OK (99 kandidater). US-boken avgör dem i dag kl. 15:00 CET. **Krypto:** inget case. Det finns ingen positiv kryptospecifik katalysator. BTC gav tillbaka uppgången efter Fed-beskedet, ETH ligger under EMA20 och EMA50 med RSI 40,0, och ETF-flödena för 27/10 är motsägelsefulla mellan källorna (24,5–176 MUSD in). `COIN` och `MSTR` rapporterar i kväll och får inte köpas in i rapporten (punkt 8).

## Makro- & sektorfaktorer att bevaka

**Räntor och inflation:** Fed höll räntan, men två reservationer för en omedelbar höjning och ~85 % prissatt sannolikhet för en höjning i december gör läget hökaktigt. 10-årsräntan ligger runt 5 % (ej verifierad nivå). Dagens BNP (konsensus 3,2 %) och fredagens PCE avgör decemberprissättningen. Det är motvind för långduration-tillväxt, utlåningsbolag (`SOFI`) och krypto, och relativ medvind för bolag med kassaflöde här och nu (`MSFT` före `GOOGL`).

**AI-kedjan:** gårdagen visade att marknaden nu skiljer på hyperscalers som tjänar pengar på sin capex (`MSFT` +4 % efterbörs) och de som inte gör det (`GOOGL` −9–10 %), medan leverantörerna (`VRT`, `SKHY`, `MU`, `AMAT`) belönas för båda. `ORCL`:s FCF-besked tog bort en del av finansieringsoron. `AMZN` i kväll är nästa test, och `AAPL`/`PLTR` (2/11) och `AMD`/`ANET`/`SMCI` (3/11) följer.

**Industri och övrigt:** marginal- och orderbeats belönas (`VRT`, `NUE`, `PNR`), men `PNR` och `AXGN` har nått överköpta nivåer efter sina gap.

**Krypto:** BTC ligger klart över MA200 men under EMA20, utan riktning. Volatiliteten är rekordlåg (Glassnode via FXStreet 2026-10-28). Stigande realräntor är den största motvinden. **DXY** för 2026-10-28 gick inte att verifiera. `COIN`:s rapport i kväll visar handelsaktiviteten efter Robinhoods svaga kryptointäkter (−55 % å/å).

**Geopolitik:** Iran-läget och oljepriset (rapport-261027) är inte uppdaterade i dag; `XOM` och `CVX` rapporterar i morgon.

### Åtgärdspunkter till Dren (L-3)

1. **`news-feed-globenewswire-http-403` – kvarstår, ÅTERKOMMANDE.** `feeds.globenewswire` och `feeds.globenewswire-earnings` är båda `"HTTP 403 – båda försöken (0.0 s)"` (`state/news_feed.json`, 2026-10-28T23:16:12Z). **Omfång:** 2 av 6 flöden. **Ersättningskälla:** websök.
2. **`macro-calendar-not-verifiable-from-state` – ÅTERKOMMANDE.** FOMC-utfallet, BNP- och claims-konsensus samt alla bolagssiffror för MSFT, GOOGL, VRT, ORCL, AXGN och SKHY kommer ur websök. Både `www.sec.gov` och flera nyhetssajter (fool.com, stocktitan.net) är spärrade från körmiljön (`getaddrinfo ENOTFOUND`). **Omfång:** samtliga makrovärden och 4 av 4 kandidattester. 10-årsräntan (~5,03 %) och PCE-dagen är inte verifierade.
3. **`crypto-previousclose-misdated` – ÅTERKOMMANDE.** `quotes["BTC-USD"].previousClose` är 80 805,08 medan punkten 2026-10-28 i `state/price_history.json` är 81 259,33. För `ETH-USD` är det 2 347,73 mot 2 358,56. **Omfång:** 2 av 2 mynt. **Ersättningskälla:** den daterade punkten, som används i tabellen.
4. **`watchlist-cap-vs-measurability-conflict` – ÅTERKOMMANDE.** `config/watchlist_us.txt` har 126 symbolrader mot riktmärket 25. Inga rader läggs till eller stryks i dag (alla fyra kandidater finns redan), eftersom skydden i `prompts/gemensam_korning.md` går före riktmärket. 5 av 298 symboler i `state/prices.json` saknar `price` (`BK`, `BIOT.ST`, `DOMETIC.ST`, `ICA.ST`, `NRS.OL`); `BK` är den enda US-symbolen.
5. **`news-feed-daily-cap-drops-us-morning` – ÅTERKOMMANDE (tredje dagen).** Alla 91 poster för 2026-10-28 ligger efter 18:00 UTC. Morgonens rapportflöde saknas alltså helt i `state/news_feed.json` igen. **Omfång:** 4 av 4 bekräftade katalysatorer under dagtid som nämns här (VRT, AXGN, SKHY, ORCL); 5 av 5 den 2026-10-27 och 3 av 3 den 2026-10-26. **Ersättningskälla:** websök.
6. **`earnings-calendar-coverage` – L-5.** `SKHY` finns i watchlisten men saknades i `state/earnings_calendar.json` inför rapporten 28/10. Fortinet rapporterade utan att prisbevakas. **Omfång:** minst 2 bolag på en dag.
7. **NY: `extended-scope-drops-same-evening-reporters`.** `fetch-prices.mjs:extendedScope()` tar bara med kalendersymboler med `tradingDaysAway` 0–2. Körningen 00:55 UTC räknade avståndet från den nya UTC-dagen, så gårdagens efterbörsrapportörer föll ur mängden just när reaktionen skulle mätas. Följden är att `state/prices.json` saknar `extendedPrice` för **`MSFT` och `GOOGL`** (och för `BIIB`, `AWK`, `VNDA`), medan symboler som rapporterar i kväll (`AMZN`, `COIN`, `INTC`) har det. **Omfång:** 7 av 7 rapportörer för 2026-10-28 i kalendern saknar efterbörskurs. **Ersättningskälla:** websök (procentsatser, ingen kurs). Delvis lindrat för `MSFT`, eftersom en `new`-kandidat med `confirmed: true` tas med i `extendedScope`; föreslagen fix: ta med även `tradingDaysAway` −1.
8. **`^VIX` hämtas inte – kvarstår.** Volatilitetsmåttet saknas dagen efter FOMC. **Omfång:** 1 symbol.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
