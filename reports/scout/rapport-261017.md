# Daglig Scout: USA & Krypto
**Datum:** 2026-10-17
**Marknadsklimat:** Fredagen var risk-av i AI-infrastruktur. Oron för skuldfinansierad datacenterutbyggnad (CoreWeave −12 %) drog ned chipindexet för åttonde dagen i rad, och `^IXIC` föll 2,14 %. `^GSPC` föll 1,09 %, och båda indexen hade sin sämsta vecka sedan juni. Energi var den enda tydliga motvikten (`XOM` +2,46 %, `CVX` +2,59 %, båda på 250-dagarshögsta). Krypto föll svagt (BTC −0,70 %, ETH −0,79 %), medan miners och treasury-bolag föll med 9–11 %. Det är lördag och de amerikanska börserna är stängda, så rapporten bygger på fredagens session 2026-10-16. **Aktiva lärdomar tillämpade:** L-3 (åtgärdspunkter sist), L-4 (kontroll av vilande kandidater, se uppföljningen), L-5 (rapportkalenderns källa och täckning anges) och L-6 (inga klasser utesluts). L-7 gäller inte scouten.

## Marknadsöversikt

Samtliga kurser kommer ur `state/prices.json` (källa `Yahoo Finance (chart API)` via GitHub Actions). Filen har `generatedAt` **2026-10-16T23:34:06.562Z**, `schemaVersion` **2026-08-02-prevclose**, `tickerCount` 220 och `okCount` 217. `wideAt` står på 2026-10-16T09:44:28Z. Arbetskopian var i fas med `origin/main` (`00b876b Nyheter: 2026-10-16 23:38 UTC`) efter `git pull` 2026-10-17 05:48 UTC.

| Symbol | Nivå | Rörelse fredag | Vecka (mot 2026-10-09) | marketTime |
|---|---|---|---|---|
| `^GSPC` | 7 659,44 | −1,09 % (7 744,06 → 7 659,44) | −1,95 % | 2026-10-16T20:42:08Z |
| `^IXIC` | 26 140,03 | −2,14 % (26 713,03 → 26 140,03) | −4,48 % | 2026-10-16T21:15:59Z |
| `BTC-USD` | 81 527,51 | −0,75 % mot `previousClose` 82 141,46 | −1,17 % | 2026-10-16T23:32:59Z |
| `ETH-USD` | 2 419,36 | −0,87 % mot `previousClose` 2 440,48 | −2,51 % | 2026-10-16T23:33:08Z |
| `SPY` (sleeve) | 763,25 | −1,11 % | −1,97 % | 2026-10-16T20:00:00Z |

Kryptots `previousClose` stämmer fortfarande inte med den daterade punkten 2026-10-15 i `state/price_history.json` (BTC 82 105,98, ETH 2 438,54). Mot de punkterna blir rörelsen −0,70 % respektive −0,79 %. Se åtgärdspunkt 3. Veckokolumnen är räknad ur daterade stängningar i `state/price_history.json`.

**Teknik (räknad på råserien i `state/price_history.json`, 250 punkter):**
- `^GSPC` ligger 5,3 % över MA200 (7 271,41), så regimfiltret för US-boken är fortsatt **PÅ**. Indexet föll under EMA20 (7 731,12) men ligger kvar över EMA50 (7 680,38). RSI är 44,1, och MACD-histogrammet fördjupas kraftigt (−0,78 → −8,40).
- `^IXIC` ligger under både EMA20 (26 894,71) och EMA50 (26 621,71) men över MA200 (24 919,36). RSI är 37,2, och MACD-histogrammet fördjupas (−73,62 → −125,19).
- `BTC-USD` har RSI 49,2 och ligger under EMA20 (82 335) men över EMA50 (79 106) och MA200 (71 654). MACD-histogrammet är oförändrat negativt (−615 → −618).
- `ETH-USD` har RSI 40,8 och ligger under både EMA20 (2 527) och EMA50 (2 443) men över MA200 (2 117).

Cboe Volatility Index steg 22,5 % till 20,16 och stängde över 20 (AP/ts2.tech 2026-10-16). Det kan inte verifieras ur repot, eftersom `^VIX` inte hämtas.

**Kryptoflöden:** spot-bitcoin-ETF:erna fick ett **nettoutflöde på 82,39 MUSD** 2026-10-16 (`IBIT` −71,78 MUSD, `FBTC` −10,61 MUSD), efter +5,06 MUSD dagen innan (SoSoValue via TokenPost 2026-10-17). Veckan som helhet hade netto utflöden (bcointalk 2026-10).

## Ekonomiska siffror & kalender

**Senaste utfall, fredag 2026-10-16:**
- **Industriproduktion september: +0,7 % m/m mot väntat +0,4 %.** Augusti reviderades till +0,1 %. Kraftverk och el steg 3,5 %, tillverkningsindustrin 0,3 % och gruvdrift 0,2 %, medan fordon föll 3,0 %. Kapacitetsutnyttjandet steg till 76,9 % (76,4 %) (Federal Reserve G.17 enligt Yahoo Finance och marketbusinessnews 2026-10-16).
- **Fed-ordförande Warsh (IMF, Bangkok, 2026-10-16) gav ingen räntesignal:** "I don't prejudge meetings." Han pekade på en "synchronous tightening" bland centralbankerna. **Under talet sjönk sannolikheten för en höjning vid FOMC 27–28 oktober till ~17 % från ~30 %** (CNBC 2026-10-16; NBC News 2026-10-16). Goldman Sachs väntar sig paus i oktober och en "second and final hike" i december (CNBC 2026-10-16). **Det var veckans mest marknadsrörande besked.** Fed är nu i tystnadsperiod inför mötet.
- Veckans tidigare utfall (PPI +1,3 % m/m, detaljhandeln +0,8 %, arbetslöshetsanspråk 199 000 och Empire State 25,5) står i rapport-261016.

**Kommande** (källa: websök, ingen fil i repot – se åtgärdspunkt 2):
- **Måndag 2026-10-19:** NAHB-index för oktober (väntat 31 mot 32). Bostadsbyggen och bygglov för september är också på väg, men dagen kan inte fastställas ur källan (Investing.com 2026-10-16; Investrade-kalendern 10/19–10/23).
- **Torsdag 2026-10-22:** initiala arbetslöshetsanspråk (väntat 200 000).
- **Fredag 2026-10-23:** S&P Global flash-PMI för oktober och slutlig UMich-sentiment (väntat 46,3), dag härledd ur källorna. **Flash-PMI är den mest marknadsrörande makropunkten nästa vecka.**
- **FOMC 27–28 oktober** ligger utanför 5-dagarsfönstret men styr hela veckans räntehandel.
- **Rapporter nästa 10 handelsdagar** (`state/earnings_calendar.json`, `generatedAt` 2026-10-16T09:43:01Z, `errors` tomt):
  - **2026-10-19:** `AGNC`
  - **2026-10-20:** `NFLX`
  - **2026-10-21:** `META`, `TSLA`, `ABT`
  - **2026-10-22:** `BE`
  - **2026-10-26:** `PECO`
  - **2026-10-27:** `BA`, `ITW` och `SKHY` (gissat)
  - **2026-10-28:** `GOOGL`, `MSFT`, `BIIB`, `AWK`, `AXGN` och `UTHR` (gissat)
  - **2026-10-29:** `AMZN`, `COIN`, `MSTR`, `RIOT`, `RDDT`, `INTC`, `ILMN`, `HII` och `SPXC`
  - **2026-10-30:** `XOM`, `CVX`
- **L-5:** `state/earnings_calendar.json` ser bara de symboler som `prices.yml` hämtar. Resten av det amerikanska universumet är **OKONTROLLERAT**, till exempel Fifth Third, som rapporterar 2026-10-19 enligt Alphastreet. Samtliga rapportbolag ovan finns redan i `config/watchlist_us.txt`, så inga rader läggs till i dag. Alla omfattas av rapportförbudet i punkt 8 och är bevakningsposter, aldrig köpförslag.

## Aktuella händelser & katalysatorer

- **AI-infrastrukturens skuldoro, 2026-10-16:** CoreWeave föll ~12 %, och Nebius föll ~12 % samtidigt. Oron gäller CoreWeaves obligationsräntor, där CDS-priset för femårig skuld nådde rekordnivån 1 194,5 punkter, samt räntehöjningsrisk och signaler från hyperskalarna om försenade datacenterprojekt (CNN 2026-10-16; Reuters-analys via Galveston News 2026-10-16; MarketScreener 2026-10-16). Chipindexet föll 3,8 % för åttonde dagen i rad. Nedgångarna i bevakade namn (`state/prices.json`, marketTime ~2026-10-16T20:00Z) var: `RIOT` −11,48 %, `APLD` −11,48 %, `IREN` −11,19 %, `CLSK` −10,16 %, `SMCI` −9,86 %, `MARA` −9,60 %, `PLTR` −7,22 %, `CIEN` −6,67 %, `SKHY` −6,58 %, `AMD` −5,95 % och `HPE` −5,97 %. **Det är en sektorrörelse utan bolagsspecifika negativa utfall, så den ger inga case.**
- **`MSTR` −9,56 % till 136,83 (`state/prices.json`, marketTime 2026-10-16T20:00Z): MSCI:s regel är nu bekräftad.** MSCI antog 2026-10-15 en regel om att utesluta "non-operating companies". Den träder i kraft efter stängning 2026-11-30, och listan över berörda bolag väntas 2026-11-11. Strategy och Metaplanet nämns, medan befintliga indexmedlemmar prövas gradvis under två år (The Block 2026-10-15; Benzinga 2026-10-16; TipRanks 2026-10-16). Strategy uppger att MSCI-relaterade fonder äger ~13 miljoner aktier, eller ~3,1 %. Gårdagens motsägelse är därmed löst: **beskedet är en negativ katalysator, och 2026-11-11 är ett binärt riskdatum.** Det blir inget case.
- **Truist (TFC) Q3, 2026-10-16 (bekräftat utfall, före börsöppning):** EPS slog förväntningarna, men intäkterna missade och aktien föll ~0,9 % före öppning (Investing.com 2026-10-16; Yahoo Finance 2026-10-16). EPS anges som 1,16 respektive 1,42 USD i olika källor, så siffran är **motsägelsefull** och används inte. `TFC` finns inte i watchlistan.
- **Energi:** WTI steg ~6,5 % på veckan till ~97,75 USD efter ett lagerdrag på 8,6 miljoner fat, och Brent steg ~1,2 % till ~105,9 USD (Vantage Markets och Coinpaper 2026-10-16). Uppgifterna är ungefärliga och skiljer sig mellan källor. Oljenivån kan inte verifieras ur repots filer. `XOM` steg till 178,98 (+2,46 %) och `CVX` till 224,99 (+2,59 %), båda på 250-dagarshögsta. `DVN` steg 3,03 % och **`CRGY` 10,07 %** (se Case 1). `XOM` och `CVX` saknar egen katalysator före rapporterna 2026-10-30.
- **`USB` +2,33 % till 58,73 på 2,12× volym** (`state/prices.json`, marketTime 2026-10-16T20:00:02Z). Det är andra dagen uppåt efter rapporten. Se uppföljningen.
- **`state/news_feed.json`** (`generatedAt` 2026-10-16T23:38:45Z) bär 10 av 10 handelsdagar (2026-10-05 – 2026-10-16, `missingDays` tomt). Rubrikerna 2026-10-16 är advokatbyråannonser, utdelningsbesked och 8-K utan rubrik, alltså inga bekräftade bolagskatalysatorer inom fokus. **`globenewswire` och `globenewswire-earnings` svarar fortfarande HTTP 403** (åtgärdspunkt 1), så den delen av pressmeddelandeflödet är **OKONTROLLERAD**.
- Inga rykten används i dag.

## Uppföljning av tidigare case

- **`TSM` (rapport-261016): 422,25 → 412,61 (−2,28 %, `state/prices.json`, marketTime 2026-10-16T20:00:02Z) – tes FÖRSVAGAD.** Aktien föll en andra dag på **1,60× volym**. Kursen ligger under EMA20 (444,10) och EMA50 (437,20), RSI är 34,2, och MACD-histogrammet fördjupas (−5,63 → −6,83). Avståndet till MA200 (395,05) är nu bara 4,4 %. Rapporten var stark, men chiprotationen dominerar helt. US-rotationen avvisade `261016-TSM` 2026-10-16 på grind 2.
- **`USB` (rapport-261016): 57,39 → 58,73 (+2,33 %, `state/prices.json`, marketTime 2026-10-16T20:00:02Z) – tes INTAKT, förstärkt.** Den blockerande invändningen från i går är upphävd: kursen stängde **över MA200 (57,81)** och över EMA20 (58,14) på **2,12× volym**. Kursen ligger kvar under EMA50 (59,63). RSI är 50,5, och MACD-histogrammet stiger (0,08 → 0,22). Dagsintervallet var 57,94–59,17. US-rotationen avvisade `261016-USB` 2026-10-16 på grind 2 (kurs ≤ MA200) och grind 5 (nåbarhet).

**Kandidatkön (`state/scout_candidates.json`, före dagens tillägg 81 poster: 76 `rejected`, 5 `promoted`, 0 `new`):** inga poster väntar på avgörande.

**L-4-kontroll:**
- **`261016-USB`** avvisades på **grind 2 (kurs ≤ MA200) och grind 5 (nåbarhetstak 9,9 % < 14 %)**. Båda är omdömesskäl (teknik och nåbarhet), inte en datalucka, så L-4 gäller inte. Att MA200-spärren nu har släppt ändrar inte det, och nåbarhetsspärren kvarstår oberoende av kursen. Posten kan omprövas vid veckorotationen v43 2026-10-19, då den fortfarande ligger inom `expiresAt` 2026-10-23. En ny scout-post för samma namn vore en dubblett och är inte tillåten.
- **`261016-TSM`, `261015-UNH` och `261015-BLK`** avvisades också av omdömesskäl.
- Inga andra avvisade poster inom sin `expiresAt` vilar på en datalucka. L-4 är uppfylld.

**Innehav:** US-boken har inga aktieinnehav, och indexsleeven `SPY` ligger på 100 % (`state/portfolj_us.md`, senast uppdaterad 2026-10-16T13:30Z). `state/alerts.json` (`checkedAt` 2026-10-16T20:33:33Z) har inga aktiva signaler.

## Dagens case

### Case 1: Crescent Energy (CRGY / NYSE)
**Katalysator:** **Bekräftat förvärv 2026-10-08:** Crescent köper Devons Eagle Ford-tillgångar kontant för ~4,2 mdr USD, med ett uppskattat nettopris på 3,85 mdr. Affären omfattar ~90 000 nettoacres och ~68 000 boe/d i produktion, varav 55–60 % olja, samt över 600 Tier 1-borrplatser. Crescent räknar med ~140 MUSD i årliga synergier, och stängning väntas i Q4 2026 eller tidigt 2027 (World Oil 2026-10-08; Oil & Gas Journal 2026-10-08; Rigzone 2026-10-09). Affären finansieras delvis med en nyemission: **92 miljoner A-aktier à 12,50 USD inklusive fullt utnyttjad övertilldelning, ~1,12 mdr USD netto, med likviddag 2026-10-13**. Ett KKR-relaterat bolag tecknade 40 miljoner av aktierna (SEC 8-K, prissättning oktober 2026; TipRanks 2026-10). **2026-10-16 steg aktien 10,07 % utan något nytt bolagsbesked.** GuruFocus 2026-10-16 knyter rörelsen till förvärvet och emissionen, men det är deras tolkning och inget pressmeddelande. Rörelsen sammanfaller med att WTI steg ~6,5 % på veckan. Katalysatorn är bekräftad men **9 dagar gammal**, och fredagens rörelse saknar en daterad egen orsak.
**Bull case:** Förvärvet ökar volymerna och oljeandelen, och Crescent ägs och styrs av KKR. Emissionen är nu likviderad och placerad, och aktien tog sig från emissionspriset 12,50 till 13,77 (+10,2 %). Emissionens överhäng har därmed absorberats, vilket ofta frigör kursen. Oljan ligger nära 100 USD. Produktionstillskottet säljer in i den nivån, och synergierna på ~140 MUSD är betydande mot ett börsvärde i miljardklassen.
**Bear case:** Rörelsen är **sektordriven och inte bolagsspecifik**. Den kan vända snabbt om oljepriset faller, till exempel vid en avspänning kring Hormuz eller Mellanöstern. Bryggfinansieringen på 2 mdr och den högre skuldsättningen gör aktien till en hävstång på oljan. Aktien stängde på dagshögsta (13,795), vilket ofta ger rekyl. Ingen ny katalysator föreligger före stängningen av affären, och synergierna är bolagets egna prognoser. Utspädningen var ~92 miljoner nya aktier.
**Setup:** Kursen var 13,77 USD (`state/prices.json`, marketTime 2026-10-16T20:00:02Z, Yahoo Finance chart API). Det är en reguljär stängning långt efter katalysatorn 2026-10-08. Dagsintervallet var 12,54–13,795, och dagsvolymen 22,3 miljoner aktier (~307 MUSD), så likviditeten är god. Volymkvoten är **2,18×** (`state/volume_history.json`). Kursen ligger över EMA20 (13,22), EMA50 (13,05) och MA200 (11,74). RSI är 56,3, och MACD-histogrammet är på väg att korsa uppåt (−0,093 → −0,016, alltså ännu negativt). Stödet ligger vid emissionspriset 12,50 (−9,2 %) och EMA20 ~13,22 (−4,0 %). Motståndet är 250-dagarshögsta 15,37 (+11,6 %). P/E och EV/EBITDA kan inte verifieras ur repot. **Prisåtgärden är godkänd på volym och trend, men katalysatorns ålder och avsaknaden av en daterad orsak till fredagens rörelse är grind 3-frågor för ansvarig bok.** Kandidaten är skriven till `state/scout_candidates.json` som `261017-CRGY` (`confirmed: true`, `catalystType: ma_rumor` – enumens förvärvsvärde, används för bekräftade förvärv på köparsidan som `260923-TLX` och `260929-AMD`, `catalystDate` 2026-10-08, `expiresAt` 2026-10-23).

**Inga fler case:**
- Fredagen bar inga bekräftade bolagsutfall med godkänd prisåtgärd inom fokus.
- Truist har motsägelsefulla EPS-uppgifter och finns inte i watchlistan.
- `MSTR` har en negativ katalysator.
- `XOM` och `CVX` ligger på 250-dagarshögsta med RSI 73,0 respektive 70,8, utan egen katalysator och med rapport 2026-10-30. Båda har avvisats flera gånger för samma brist.
- `USB` finns redan som kandidat (se L-4 ovan).
- Kryptot saknar en positiv kryptospecifik katalysator, och ETF-flödena är negativa.
- Ett tredje case tvingas inte fram.

## Makro- & sektorfaktorer att bevaka

**Räntorna:** Warsh höll dörren öppen men gav inga signaler, och marknaden prissätter nu ~17 % sannolikhet för en höjning i oktober och en trolig höjning i december. Industriproduktionen överraskade på uppsidan efter en vecka med varm PPI och KPI. Realräntan är fortsatt den största motvinden för högt värderad tillväxt och för krypto.

**Sektorrotation:** oron för AI-skulden har utvecklats från en rotation till en riskomprissättning av hela AI-kapitalkedjan:
- CoreWeaves CDS-pris har nått rekordnivå, chipindexet har fallit åtta dagar i rad och Nasdaq föll −4,48 % på veckan.
- Före rapporterna från MSFT, GOOGL och META (2026-10-21 och 2026-10-28) är capex-signalerna den binära frågan för hela sektorn.
- Kapitalet går till energi, banker (WFC, JPM och USB upp) och defensivt (PEP, KHC och AWK upp).

**Energi:** oljan nära 100 USD, med lagerdrag och risk i Mellanöstern, ger medvind för Case 1. Samtidigt bär oljan inflationsrisken i PPI, så en fortsatt stigande olja skärper också räntebilden.

**Krypto:** BTC ligger under EMA20 men över EMA50 och MA200, och ETH ligger under EMA20 och EMA50. ETF-utflödena återkom, och MSCI-regeln hänger över treasury-bolagen till 2026-11-11. Miners som också är AI-hostingbolag (IREN, APLD och CLSK) drabbas dubbelt av AI-skuldoron. **Läget är avvaktande:** det finns ingen kryptospecifik drivkraft, och riskaptiten är på väg ned (VIX över 20).

### Åtgärdspunkter till Dren (L-3)

1. **`news-feed-globenewswire-http-403` – kvarstår, ÅTERKOMMANDE.** I `state/news_feed.json` är `feeds.globenewswire` = `"HTTP 403 – båda försöken (0.0 s)"` och `feeds.globenewswire-earnings` = `"HTTP 403 – båda försöken (0.0 s)"` vid körningen 2026-10-16T23:38:45Z. **Omfång:** 2 av 6 flöden, varav ett är den enda källan som är dedikerad åt rapportöverraskningar. **Ersättningskälla:** websök och SEC 8-K.
2. **`macro-calendar-not-verifiable-from-state` – ÅTERKOMMANDE.** Industriproduktionen, Warshs uttalanden, FedWatch-sannolikheterna, VIX, oljepriserna och nästa veckas kalender kommer ur websök (Yahoo Finance, CNBC, NBC, AP, Vantage, Investrade). Dagarna för bostadsbyggen och flash-PMI är härledda och inte bekräftade. **Omfång:** samtliga makrodatum och -värden i rapporten.
3. **`crypto-previousclose-misdated` – ÅTERKOMMANDE.** I `state/prices.json` är `quotes["BTC-USD"].previousClose` = 82 141,46, medan punkten 2026-10-15 i `state/price_history.json` är 82 105,98. För `ETH-USD` är `previousClose` 2 440,48 och punkten 2 438,54. **Omfång:** 2 av 2 mynt, skillnad 0,05 respektive 0,08 procentenheter i dagsrörelsen. **Ersättningskälla:** `previousClose` i tabellen, med båda måtten redovisade.
4. **`watchlist-cap-vs-measurability-conflict` – ÅTERKOMMANDE.** `config/watchlist_us.txt` har 106 symbolrader mot riktmärket 25. Inga rader stryks, eftersom skydden i `prompts/gemensam_korning.md` går före riktmärket: giltiga kandidater, 20-dagarsutvärdering och rapportbevakning. `BK` saknar fortfarande kurs i `state/prices.json`. Det är en av 3 symboler utan `price`, tillsammans med `AI-USD` och `NRS.OL`.
5. **Ny i dag – `^VIX` hämtas inte.** Volatilitetsindexet (20,16, +22,5 %) kan bara anges ur websök. **Omfång:** 1 symbol. Övervägs för `config/watchlist_us.txt`, men läggs inte till här, eftersom listan redan ligger långt över riktmärket.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
