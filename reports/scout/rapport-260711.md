# Daglig Scout: USA & Krypto
**Datum:** 2026-07-11
**Marknadsklimat:** Måttligt riskvilligt. USA-börserna avslutade veckan på nya toppnivåer när marknaden såg förbi Mellanöstern-spänningar och positionerade sig inför rapportsäsongen, med halvledare i förarsätet efter SK Hynix rekordstora Wall Street-debut. I krypto har regulatorisk optimism (CLARITY Act) tagit över som prisdrivare framför geopolitiken, med BTC/ETH stabilt uppåt på ETF-inflöden.

> ⚠️ **DATAKÄLLA – DELVIS BLOCKERAD:** `state/prices.json` (genererad 2026-07-10 15:32 UTC) innehåller
> just nu ENDAST nordiska tickers – inga US-/kryptosymboler (^GSPC, ^IXIC, BTC-USD, ETH-USD, aktier)
> trots att de ligger i `config/watchlist_us.txt`. Live-reservkällan (Yahoo Finance chart-API) var
> nätspärrad i körmiljön. Nivåerna nedan är därför **medie­rapporterade stängningskurser för fre 10 juli**
> (senaste handelsdag; idag lör 11 juli är USA-börsen stängd), tydligt källbelagda – men de är INTE
> hämtade ur den verifierade `prices.json`-feeden. För case-setuparna anges därför "KURS EJ VERIFIERAD"
> för exakta prisnivåer. Åtgärd: se till att `prices.yml` faktiskt hämtar US/krypto-tickers till nästa körning.

## Marknadsöversikt
Stängning fredag 10 juli 2026 (senaste handelsdag före dagens lördag):

- **S&P 500 (^GSPC):** 7 575,39, **+0,42 %** (+31,75 p) — källa: Yahoo Finance / The Motley Fool "Stock Market Today, July 10, 2026" (2026-07-10). *Ej ur prices.json.*
- **Nasdaq Composite (^IXIC):** 26 281,61, **+0,29 %** (+74,72 p) — källa: Yahoo Finance / The Motley Fool (2026-07-10). *Ej ur prices.json.*
- **Dow Jones:** 52 637,01, **+0,29 %** — källa: Yahoo Finance (2026-07-10). *Ej ur prices.json.*
- **BTC-USD:** ~63 185 USD (öppning fre 10 juli), **+1,5 %** dygn / **+2,8 %** sju dagar — källa: Yahoo Finance Personal Finance "Bitcoin and ethereum prices today, Friday, July 10, 2026" (2026-07-10). *Ej ur prices.json.*
- **ETH-USD:** ~1 744 USD (öppning fre 10 juli), **+0,1 %** dygn / **+2,7 %** sju dagar — källa: Yahoo Finance Personal Finance (2026-07-10). *Ej ur prices.json.*

Nordiska referenskurser finns verifierade i prices.json (marketTime 2026-07-10 ~15:29 UTC) men täcks av den nordiska rotationen och rapporteras inte här.

## Ekonomiska siffror & kalender
**Senaste utfall:** Ingen ny förstklassig USA-siffra släpptes de senaste 24–48h (marknaden drevs av flöden/rapportförväntan). Bakgrund: WTI-oljan föll ~20,4 % under juni, vilket väntas dämpa kommande inflationsavläsning (källa: Kiplinger, 2026-07).

**Kommande releaser (1–5 dagar), tider ET:**
- **Tis 14 juli – CPI & Kärn-CPI (juni).** ⭐ **MEST MARKNADSRÖRANDE.** Väntas visa viss inflations­dämpning efter oljefallet. (Källa: Kiplinger "Economic Calendar July 13–17", 2026-07)
- **Mån 13 juli** – Kongressen återvänder från uppehåll; nytt utkast till CLARITY Act (krypto­marknadsstruktur) väntas mitten av juli. (Källa: KuCoin/Techtimes, 2026-07)
- **Tis 14 juli 10:00 ET** – Fed-ordförande **Kevin Warsh** vittnar inför House Financial Services Committee. (Källa: Kiplinger, 2026-07)
- **Ons 15 juli 10:00 ET** – Warsh inför Senate Banking Committee. (Källa: Kiplinger, 2026-07)
- **Ons 29 juli – FOMC-räntebesked.** Inga uppdaterade projektioner (SEP) denna gång → uttalande + presskonferens väger tyngre. (Källa: Kiplinger / gomarkets, 2026-07)

## Aktuella händelser & katalysatorer
- **SK Hynix rekorddebut på Wall Street (fre 10 juli).** Reste 26,5 mdr USD via ADR (177,9 M aktier à 149 USD) – största utländska USA-noteringen någonsin (slår Alibabas 25 mdr 2014). Aktien öppnade ~14 % över IPO-pris och **stängde ~+13 %**. Tillfällig ticker **SKHYV**, blir **SKHY** vid ordinarie handel mån 13 juli på Nasdaq. (Källor: Bloomberg 2026-07-09; TechCrunch, The Motley Fool, Yahoo Finance 2026-07-10)
- **Micron (MU) föll** när SK Hynix-debuten väckte oro för ökad konkurrens/marknadsandel i minne. (Källa: The Motley Fool 2026-07-10)
- **Breda index till nya toppar (fre 10 juli)** när marknaden såg förbi Mellanöstern-spänningar och riktade blicken mot rapportsäsongen; chip-styrka ledde. (Källa: Yahoo Finance / The Motley Fool 2026-07-10)
- **Krypto: regulatorik > geopolitik.** BTC/ETH höll sig fasta på ETF-inflöden och optimism kring pågående CLARITY Act; nytt lagutkast väntas så tidigt som nästa vecka. (Källor: Cryptonews 2026-07-10; Yahoo Finance 2026-07-10)
- **CLARITY Act-odds:** föll till ~40–50 % sedan Senatens 4 juli-mål passerade; Galaxy Research prisar in ~60 % för passage under 2026. JPMorgan beskriver passage som positiv katalysator för digitala tillgångar brett. (Källor: Techtimes 2026-07-04; 24/7 Wall St. 2026-05-30)

## Dagens case
### Case 1: SK Hynix (SKHY / Nasdaq – ordinarie handel från mån 13 juli)
**Katalysator:** Rekordstor USA-ADR-debut 10 juli (26,5 mdr USD rest, +13 % första dagen). Noteringen väntas krympa värderingsgapet mot Micron och banar väg för inträde i Philadelphia Semiconductor Index (SOX) → passiva flöden. (Källor: Bloomberg 2026-07-09; Yahoo Finance / TechCrunch 2026-07-10)
**Bull case:** Ren, likvid USA-exponering mot minne (DRAM/HBM) i en AI-driven minnes-supercykel; nummer 2 inom HBM efter/jämte Micron, stor kund­koncentration mot AI-datacenter. Indexinklusion kan tvinga fram passiv efterfrågan. Färsk kapitalanskaffning ger utrymme för USA-fab-investeringar.
**Bear case:** Debut-eufori kan ge "buy the rumor" bakslag efter första-dagsuppgången; ADR-arbitrage mot Seoul-noteringen kan pressa; minnespriser är cykliska; hög korrelation med NVDA/AI-narrativet gör aktien sårbar vid AI-sentimentskifte. UBS flaggade uttryckligen ett arbitrage-gap.
**Setup:** IPO-pris 149 USD, öppnade ~+14 %, stängde ~+13 % (fre 10 juli) → indikativ nivå ~168–170 USD men **KURS EJ VERIFIERAD** (saknas i prices.json; live-fallback nätspärrad; media­rapporterat, ej feed). Ticker byts SKHYV→SKHY mån 13 juli. **SKHY ligger redan i `config/watchlist_us.txt`** → bör dyka upp i nästa prices.json-körning för verifierad nivå. Bevaka första ordinarie handelsdag för volym/prisåtgärd.

### Case 2: Bitcoin & Ethereum (BTC-USD / ETH-USD)
**Katalysator:** Regulatorisk medvind – nytt CLARITY Act-utkast väntas mitten av juli när kongressen återvänder 13 juli; kombinerat med fortsatta spot-ETF-inflöden. Regulatorik har ersatt geopolitiken som huvuddrivare. (Källor: KuCoin/Techtimes 2026-07-04; Cryptonews & Yahoo Finance 2026-07-10). *Ej ryktesdrivet – bygger på öppet rapporterad lagstiftningsprocess.*
**Bull case:** Federal marknadsstruktur (SEC/CFTC-uppdelning) skulle ge institutionell klarhet – JPMorgan ser passage som bred positiv katalysator; Standard Chartered uppskattar t.ex. XRP-ETF-inflöden upp till 8 mdr USD om commodity-status kodifieras. ETF-flöden + supply-dynamik ger strukturell medvind.
**Bear case:** Passage-odds bara ~40–60 % och sju demokratröster för cloture saknas → "buy the rumor, sell the news"-risk om lagen fastnar. BTC långt under tidigare ATH-nivåer signalerar svag momentum; makro (CPI 14 juli, FOMC 29 juli) kan slå mot riskaptit. DXY/realräntor motvind om Fed förblir hökaktig.
**Setup:** BTC ~63 185 USD, ETH ~1 744 USD (öppning fre 10 juli; +2,8 % resp +2,7 % på sju dagar) — **KURS EJ VERIFIERAD** ur prices.json (BTC-USD/ETH-USD saknas i feeden; live-fallback nätspärrad; media­rapporterat). Nyckelhändelse: CLARITY-utkast v. 29. Symbolerna ligger i watchlist_us.txt → bör verifieras i nästa körning.

### Case 3: Micron Technology (MU / NASDAQ) – relativ motpol
**Katalysator:** MU föll 10 juli på SK Hynix-debuten (konkurrens om minnesandel), men den underliggande AI-minnes-supercykeln (HBM4 för NVIDIAs Vera Rubin) är intakt. Ett svaghetstillfälle vs strukturell tillväxt. (Källa: The Motley Fool 2026-07-10)
**Bull case:** Ledande HBM/DRAM/NAND-leverantör mitt i AI-datacenter-buildout; HBM-kapacitet rapporterat i det närmaste utsåld för 2026; långa avtal med hyperscalers. En ny börsnoterad konkurrent (SK Hynix) validerar hela minnestemats attraktivitet snarare än att underminera det.
**Bear case:** Minnespriser är notoriskt cykliska; ökad HBM-kapacitet (SK Hynix, Samsung) kan trycka priser 2027; aktien har redan gått mycket och är känslig för AI-capex-besvikelser. Konkret andelsförlust till SK Hynix om deras USA-närvaro accelererar designvinster.
**Setup:** **KURS EJ VERIFIERAD** – MU saknas i prices.json (feeden täcker ej US) och live-fallback var nätspärrad; endast icke-primära bloggkällor (intellectia.ai/tradingkey) angav prisnivåer, vilka INTE godtas enligt källkritikkravet. MU bör läggas till/verifieras i nästa prices.json-körning innan prisbaserad slutsats dras. Bevaka reaktionen mån 13 juli när SKHY börjar ordinarie handel.

## Makro- & sektorfaktorer att bevaka
- **Ränte-/inflationsläge:** CPI (tis 14 juli) är veckans nyckel; oljefallet i juni (~-20 %) talar för dämpad avläsning, vilket vore riskpositivt. FOMC 29 juli utan SEP → statement/presser tolkas hårdare. Warsh-vittnesmålen 14–15 juli kan flytta räntebanan.
- **Riskaptit & sektorrotation:** Halvledare/AI-infrastruktur leder (SK Hynix-debut, chip-rebound); index på nya toppar men på smal ledning – bevaka bredd. Rapportsäsongen (storbanker inleder mitten av juli) blir nästa test.
- **DXY / krypto:** Krypto drivs nu av regulatorik (CLARITY) mer än dollar/geopolitik; ETF-flöden är swing-faktorn. Håll koll på DXY och realräntor som motvind vid hökaktig Fed.
- **Geopolitik:** Mellanöstern-spänningar finns kvar men marknaden ser förbi dem så länge oljan faller; en re-eskalering med oljespik vore främsta risken mot inflations-/riskbilden.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
