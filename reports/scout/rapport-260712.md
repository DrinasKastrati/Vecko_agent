# Daglig Scout: USA & Krypto
**Datum:** 2026-07-12
**Marknadsklimat:** Avvaktande med förnyad geopolitisk oro. USA-börser, olja och obligationer är stängda över helgen, så krypto är i praktiken det enda större tillgångsslag som prissätter helgens eskalering i realtid – och reaktionen har hittills varit dämpad (BTC/ETH i stort sett oförändrade). Under ytan lever två motstridiga krafter: förnyade USA-attacker mot Iran + Teherans utspel om stängd Hormuzsund (oljerisk uppåt) mot en gryende vändning i Bitcoin-ETF-flöden och fortsatt AI-/halvledaroptimism inför SK Hynix ordinarie handelsstart imorgon.

> ⚠️ **DATAKÄLLA – DELVIS BLOCKERAD:** `state/prices.json` (genererad 2026-07-10 15:32 UTC) innehåller
> just nu ENDAST nordiska tickers – inga US-/kryptosymboler (^GSPC, ^IXIC, BTC-USD, ETH-USD, SKHY m.fl.)
> trots att de ligger i `config/watchlist_us.txt`. Live-reservkällan (Yahoo Finance) gav HTTP 403 i
> körmiljön. Nivåerna nedan är därför **medie­rapporterade** (aktier: fredag 10 juli-stängning, senaste
> handelsdag; krypto: helgnoteringar 11–12 juli) med tydlig källa – men de är INTE hämtade ur den
> verifierade `prices.json`-feeden. Exakta prisnivåer i case-setuparna märks därför "KURS EJ VERIFIERAD".
> Åtgärd: se till att `prices.yml` faktiskt hämtar US/krypto-tickers till nästa körning.

## Marknadsöversikt
Aktieindex speglar fredagens (10 juli) stängning – börsen har varit stängd lör 11 + sön 12 juli:

- **S&P 500 (^GSPC):** 7 575,39, **+0,42 %** (fredag 10 juli-stängning) — källa: CNBC/The Motley Fool "Stock market today, July 10, 2026" (2026-07-10). *Ej ur prices.json.*
- **Nasdaq Composite (^IXIC):** 26 281,61, **+0,29 %** (fredag 10 juli-stängning) — källa: CNBC/The Motley Fool (2026-07-10). *Ej ur prices.json.*
- **Dow Jones:** 52 637,01, **+0,29 %** (+149,60 p, fredag 10 juli) — källa: CNBC (2026-07-10). *Ej ur prices.json.*
- **BTC-USD:** ~63 800 USD, **−0,3 % / 24h**, **+2 % / vecka** (helgnotering) — källa: CoinDesk "Bitcoin, ether little changed as U.S. launches fresh Iran strikes" (2026-07-12). *Ej ur prices.json; live-fallback (Yahoo) nätspärrad.*
- **ETH-USD:** endast "fraktionell" förändring senaste dygnet enligt CoinDesk (2026-07-12); referens: öppning fre 10 juli ~1 744 USD (+2,7 %/vecka) — källa: Yahoo Finance Personal Finance (2026-07-10). *Ej ur prices.json.*

Nordiska referenskurser finns verifierade i prices.json (marketTime 2026-07-10 ~15:29 UTC) men täcks av den nordiska rotationen och rapporteras inte här.

## Ekonomiska siffror & kalender
**Senaste utfall:** Ingen ny förstklassig USA-siffra släpptes över helgen (marknaderna stängda). Bakgrund inför veckan: bensin-/oljepriser föll kraftigt i juni, vilket väntas dämpa headline-inflationen i tisdagens CPI.

**Kommande releaser (1–5 dagar), tider ET:**
- **Tis 14 juli 08:30 ET – CPI & Kärn-CPI (juni).** ⭐ **MEST MARKNADSRÖRANDE.** Konsensus ~**3,8 % YoY headline** (ned från 4,2 % i maj), drivet av ~10 % lägre bensin; **kärn-CPI väntas +0,3 % m/m (~2,9 % YoY)**. Sista stora inflationsavläsningen före FOMC 29 juli. (Källor: Kiplinger "June CPI Preview", 2026-07; Octagon AI, 2026-07)
- **Mån 13 juli** – Kongressen återvänder; nytt utkast till CLARITY Act (krypto­marknadsstruktur) väntas mitten av juli. (Källa: InvestingNews "Regulation Crypto agenda slated for July", 2026-07)
- **Tis 14 juli 10:00 ET** – Fed-ordförande **Kevin Warsh** vittnar inför House Financial Services Committee; **Ons 15 juli 10:00 ET** inför Senate Banking Committee. (Källa: Kiplinger "Economic calendar July 13–17", 2026-07)
- **Ons 29 juli – FOMC-räntebesked** (utan uppdaterade SEP-projektioner denna gång → statement/presser väger tyngre). Kontext: junimötet höjde median-inflationsprognosen för 2026 till 3,6 % och dot-medianen för styrräntan till 3,8 %. (Källor: Federal Reserve FOMC-projektioner 2026-06-17; gomarkets, 2026-07)
- **Denna vecka** – rapportsäsongen inleds: storbanker samt **ASML** och **TSM** (halvledar-highlights). (Källa: Bloomberg/Yahoo Finance, 2026-07-10)

## Aktuella händelser & katalysatorer
- **Förnyad USA–Iran-eskalering (helgen 11–12 juli):** USA genomförde nya flyganfall mot Iran; Teheran deklarerade att man stängt **Hormuzsundet**. Olja, aktier och obligationer var stängda över helgen → Bitcoin var ett av få tillgångsslag som prissatte skeendet i realtid, med dämpad reaktion. Fullare reaktion i råolja väntas när handeln öppnar måndag. (Källa: CoinDesk 2026-07-12)
- **Bitcoin-ETF-flöden vänder upp (helgen):** US spot-Bitcoin-ETF:er bröt en 10-dagars uttagssvit och drog in **221,7 MUSD** – största dagsinflödet på två månader, efter en rekordsvag juni. (Källa: CoinDesk 2026-07-12)
- **SK Hynix → ordinarie handel imorgon (mån 13 juli):** Tillfälliga tickern **SKHYV** byts till **SKHY** och regular-way-handel inleds på Nasdaq. Leveraged-ETF:erna **SKUU/SKDD** väntas lanseras 13 juli. (Källor: Nasdaq Trader DTN2026-11, 2026-07; Yahoo Finance, 2026-07-10)
- **Delta Air Lines (DAL, 10 juli):** Föll >3 % trots att bolaget slog både topp- och bottenlinje i Q2 – "sell the news". (Källa: CNBC 2026-07-10)
- **WD-40 (WDFC, 10 juli):** Rusade >15 % efter justerad EPS 2,33 USD (vs 1,56 väntat) och höjd helårsguidning. (Källa: CNBC 2026-07-10)
- **Krypto Q2 2026:** Digitala tillgångar noterade tredje kvartalet i rad med förluster (längsta sviten sedan björnmarknaden 2022) då institutionellt kapital roterade till AI-aktier. (Källa: InvestingNews 2026-07)

## Dagens case
### Case 1: Bitcoin (BTC-USD / krypto)
**Katalysator:** Helgens geopolitiska eskalering (nya USA-attacker mot Iran + Teherans utspel om stängd Hormuzsund, 12 juli) gjorde BTC till marknadens realtidsbarometer när övriga marknader var stängda – och reaktionen var dämpad (−0,3 %/24h). Samtidigt vände ETF-flödena: +221,7 MUSD, största dagsinflödet på två månader. (Källa: CoinDesk 2026-07-12). *Ej ryktesdrivet.*
**Bull case:** BTC:s stabilitet mitt i en oljechock-risk stärker "digital guld"-narrativet; ETF-inflödesvändningen efter en rekordsvag juni antyder att institutionellt kapital åter söker sig in. CLARITY Act-processen (nytt utkast väntat mitten av juli) kan ge federal marknadsstruktur och institutionell klarhet.
**Bear case:** "Fullare reaktion väntar måndag" – öppnar olja i spik kan riskaptit vika och dra ned krypto med aktier. Q2 var tredje förlustkvartalet i rad; momentum är svagt och BTC handlas långt under tidigare ATH. Hökaktig Fed (dot 3,8 %) + stark DXY är strukturell motvind; CPI 14 juli kan slå åt båda håll.
**Setup:** ~63 800 USD, −0,3 %/24h, +2 %/vecka (helgnotering) — **KURS EJ VERIFIERAD** ur prices.json (BTC-USD saknas i feeden; Yahoo-fallback gav 403; endast media­rapporterat). Nyckelnivå att bevaka: reaktionen vid måndagens öppning när oljemarknaden åter prissätter Hormuz. Symbolen ligger i `config/watchlist_us.txt` → bör verifieras nästa körning.

### Case 2: SK Hynix (SKHY / Nasdaq – ordinarie handel från mån 13 juli)
**Katalysator:** Rekordstor USA-ADR-debut 10 juli (26,5 mdr USD rest, +13 % första dagen; öppnade ~+14 % över 149 USD IPO-pris). Imorgon (13 juli) byts SKHYV→**SKHY** och regular-way-handel inleds; leveraged-ETF:er (SKUU/SKDD) väntas samma dag → ökad likviditet/uppmärksamhet. Potentiell väg mot indexinklusion (t.ex. SOX) → passiva flöden. (Källor: Nasdaq Trader DTN2026-11 2026-07; CNBC/Yahoo Finance 2026-07-10)
**Bull case:** Ren, likvid USA-exponering mot minne (DRAM/HBM) i en AI-driven minnes-supercykel; nr 2 inom HBM jämte Micron, stor kundkoncentration mot AI-datacenter. Ordförande beskrev efterfrågan som "enormous" (CNBC 10 juli). Färsk kapitalanskaffning ger utrymme för USA-fabinvesteringar.
**Bear case:** Debut-eufori kan ge "buy the rumor"-bakslag efter förstadagsuppgången; ADR-arbitrage mot Seoul-noteringen kan pressa; minnespriser är cykliska och aktien är höggradigt korrelerad med NVDA/AI-narrativet → sårbar vid sentimentskifte eller om måndagens oljespik dämpar riskaptit brett.
**Setup:** SKHYV senast handlad ~168 USD (föreg. stängning 149 USD) enligt stockanalysis.com (2026-07-12) — **KURS EJ VERIFIERAD** ur prices.json (SKHY/SKHYV saknas i feeden; Yahoo-fallback 403). Bevaka volym/prisåtgärd på första ordinarie handelsdag (mån 13 juli). Ticker bör läggas till/verifieras i nästa prices.json-körning.

### Case 3: Energi/olja som Hormuz-hedge (t.ex. XOM / CVX, NYSE)
**Katalysator:** Teherans deklaration om stängd Hormuzsund + nya USA-attacker (12 juli) skapar en tydlig uppåtrisk för råolja när handeln öppnar måndag – "fullare reaktion i crude väntas när handeln återupptas" (CoinDesk 2026-07-12). USA-integrerade oljebolag (Exxon, Chevron) är ett likvidt sätt att uttrycka en oljeprisspik. Detta är ett makro-/händelsedrivet bevakningscase, inte en fundamental omvärdering.
**Bull case:** ~20–30 % av globalt sjöburet olja passerar Hormuz; en verklig (om än sannolikt kortvarig) störning kan lyfta Brent/WTI markant och ge omedelbar hävstång i uppströms-/integrerade bolags marginaler och fria kassaflöde. Energi har varit en eftersläntrare 2026 → utrymme för sektorrotation vid oljespik.
**Bear case:** Marknaden har upprepat "sett förbi" Mellanöstern-spänningar och en faktisk stängning av Hormuz har historiskt visat sig svår att upprätthålla → oljespikar har snabbt ebbat ut ("buy the rumor, sell the news" i omvänd form). En oljespik är dessutom en riskoff-katalysator för index brett, och energiaktier faller ofta tillbaka lika snabbt när spänningen deeskalerar. Ren spekulativ event-trade.
**Setup:** **KURS EJ VERIFIERAD** – XOM/CVX saknas i prices.json (feeden täcker ej US) och Yahoo-fallback gav 403; inga primärkällebelagda nivåer tillgängliga i körmiljön. Trigger är råoljans öppning måndag 13 juli. Lägg XOM/CVX (och ev. USO/Brent) i `config/watchlist_us.txt` för verifierad uppföljning. Tvinga inte in en position innan oljereaktionen bekräftats.

## Makro- & sektorfaktorer att bevaka
- **Geopolitik = veckans joker:** Nya USA–Iran-attacker och utspelet om stängd Hormuzsund (12 juli) är den färskaste katalysatorn. Olja/aktier/obligationer öppnar måndag och prissätter då eskaleringen fullt ut – en oljespik vore riskoff för index men medvind för energi; en snabb deeskalering vänder bilden. (Källa: CoinDesk 2026-07-12)
- **Ränte-/inflationsläge:** CPI (tis 14 juli, ~3,8 % headline / ~2,9 % kärna väntat) är veckans nyckel; oljefallet i juni talar för dämpad headline, men en Hormuz-driven oljespik hotar den bilden framåt. FOMC 29 juli utan SEP → statement/presser tolkas hårdare; junimötets dot på 3,8 % signalerar fortsatt hökaktig hållning. Warsh-vittnesmålen 14–15 juli kan flytta räntebanan.
- **Riskaptit & sektorrotation:** Halvledare/AI-infrastruktur leder alltjämt (SK Hynix-debut, chip-styrka), men index står på smal ledning – bevaka bredd när rapportsäsongen (storbanker, ASML, TSM) drar igång. En oljespik kan tvinga fram rotation mot energi.
- **DXY / krypto:** Bitcoin-ETF-flödena vände upp (+221,7 MUSD) efter en rekordsvag juni – swing-faktorn framåt. Krypto drivs av regulatorik (CLARITY) och flöden mer än geopolitik just nu; håll koll på DXY och realräntor som motvind vid hökaktig Fed.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
