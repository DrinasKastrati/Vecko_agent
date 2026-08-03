# Backtest av mekaniska skelettet – nordic-mid (5y)
**Datum:** 2026-08-03 | **Marknad/universum:** `nordic-mid` (config/backtest_universe_nordic_mid.txt) | **Universum:** 110 symboler | **Positioner:** 4 à 25 % | **Benchmark (^OMX) köp-och-behåll:** +37.26 % | **Transaktionskostnad:** nivåstyrd per symbol (0.25 % / 0.75 % / 1.5 %), se avsnitt 6

> Momentum-proxy (positiv lookback-avkastning, topp N) ersätter LLM:ens case-urval.
> Resultatet validerar RAMVERKET (rotationstakt, stop-/målnivåer, hållregel) – inte strategin som helhet.
> **VECKOVIS** = boken byggs om varje måndag, max 5 dagars håll (originalet).
> **BEHÅLL** = platsen behålls tills stop/mål eller horisonten löper ut; rotationen fyller bara tomma platser (regeln böckerna kör sedan 2026-07-31).
> **Equity %** är en DAGLIG kurva där tomma platser ligger i indexsleeven – jämför den med benchmark. **Kedjat %** är det gamla måttet (affärskedja, tom tid = noll) och finns kvar för att äldre rapporter ska gå att jämföra med.
> **Max DD** mäts numera på equity-kurvan, inte på affärskedjan.

> ⚠️ **SURVIVORSHIP BIAS:** universumfilen innehåller dagens mest likvida namn. Bolag som avnoterats, kraschat eller tappat likviditet under perioden saknas, och dagens vinnare är med just för att de vann. Det gör ALLA tal nedan för BRA, inte för dåliga – en cell som inte slår benchmark här skulle sannolikt gå ännu sämre mot ett punkt-i-tiden-universum.

## 1. Huvudgrid – läge × lookback × nivåer

| Läge | Lookback | Stop | Mål | Affärer | Aff./år | Snitt dagar | Investerad | Träff % | PF | Equity % | Kedjat % | Max DD | Mål/Stop/Tid |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| veckovis | 10d | −3 % | +6 % | 1040 | 210 | 2.9 | 61 % | 37 % | 0.69 | **-80.54 %** | -82.31 % | −83.0 % | 201/574/265 |
| veckovis | 10d | −4 % | +8 % | 1040 | 210 | 3.4 | 71 % | 40 % | 0.73 | **-81.96 %** | -82.51 % | −84.5 % | 155/494/391 |
| veckovis | 10d | −5 % | +10 % | 1040 | 210 | 3.8 | 79 % | 42 % | 0.77 | **-80.00 %** | -80.18 % | −84.0 % | 118/403/519 |
| veckovis | 20d | −3 % | +6 % | 1032 | 210 | 3.0 | 62 % | 39 % | 0.75 | **-69.25 %** | -73.89 % | −71.7 % | 203/549/280 |
| veckovis | 20d | −4 % | +8 % | 1032 | 210 | 3.5 | 73 % | 42 % | 0.76 | **-73.73 %** | -77.54 % | −76.1 % | 139/475/418 |
| veckovis | 20d | −5 % | +10 % | 1032 | 210 | 3.9 | 81 % | 44 % | 0.79 | **-73.62 %** | -76.29 % | −76.4 % | 104/377/551 |
| veckovis | 60d | −3 % | +6 % | 1000 | 210 | 3.1 | 66 % | 41 % | 0.87 | **-39.64 %** | -49.44 % | −59.1 % | 228/501/271 |
| veckovis | 60d | −4 % | +8 % | 1000 | 210 | 3.7 | 78 % | 43 % | 0.86 | **-54.47 %** | -56.71 % | −65.0 % | 148/424/428 |
| veckovis | 60d | −5 % | +10 % | 1000 | 210 | 4.1 | 86 % | 44 % | 0.85 | **-58.84 %** | -62.14 % | −67.7 % | 92/334/574 |
| veckovis | 120d | −3 % | +6 % | 952 | 210 | 3.2 | 68 % | 43 % | 0.94 | **-23.48 %** | -26.63 % | −44.3 % | 225/461/266 |
| veckovis | 120d | −4 % | +8 % | 952 | 210 | 3.8 | 79 % | 44 % | 0.87 | **-49.17 %** | -51.95 % | −55.6 % | 136/389/427 |
| veckovis | 120d | −5 % | +10 % | 952 | 210 | 4.2 | 87 % | 46 % | 0.89 | **-45.30 %** | -48.66 % | −53.0 % | 96/311/545 |
| BEHÅLL | 10d | −3 % | +6 % | 763 | 154 | 3.9 | 60 % | 31 % | 0.69 | **-75.01 %** | -78.15 % | −78.3 % | 230/526/7 |
| BEHÅLL | 10d | −4 % | +8 % | 629 | 127 | 5.5 | 69 % | 31 % | 0.73 | **-74.37 %** | -75.94 % | −76.5 % | 187/429/13 |
| BEHÅLL | 10d | −5 % | +10 % | 500 | 101 | 7.7 | 77 % | 33 % | 0.76 | **-67.71 %** | -71.16 % | −70.8 % | 144/329/27 |
| BEHÅLL | 20d | −3 % | +6 % | 729 | 149 | 4.2 | 62 % | 32 % | 0.74 | **-64.58 %** | -70.50 % | −69.5 % | 233/489/7 |
| BEHÅLL | 20d | −4 % | +8 % | 599 | 122 | 5.9 | 71 % | 33 % | 0.80 | **-56.18 %** | -64.28 % | −65.9 % | 187/393/19 |
| BEHÅLL | 20d | −5 % | +10 % | 487 | 99 | 7.8 | 77 % | 32 % | 0.77 | **-62.38 %** | -67.56 % | −72.8 % | 139/317/31 |
| BEHÅLL | 60d | −3 % | +6 % | 716 | 151 | 4.2 | 63 % | 36 % | 0.90 | **-19.36 %** | -36.00 % | −45.7 % | 259/453/4 |
| BEHÅLL | 60d | −4 % | +8 % | 562 | 118 | 6.3 | 74 % | 37 % | 0.96 | **-12.40 %** | -21.45 % | −47.1 % | 199/351/12 |
| BEHÅLL | 60d | −5 % | +10 % | 438 | 92 | 8.8 | 80 % | 38 % | 0.97 | **-0.96 %** | -17.00 % | −48.5 % | 146/267/25 |
| BEHÅLL | 120d | −3 % | +6 % | 665 | 147 | 4.5 | 66 % | 37 % | 0.93 | **-12.97 %** | -26.81 % | −39.0 % | 246/414/5 |
| BEHÅLL | 120d | −4 % | +8 % | 536 | 119 | 6.3 | 74 % | 35 % | 0.86 | **-40.11 %** | -48.58 % | −52.6 % | 180/348/8 |
| BEHÅLL | 120d | −5 % | +10 % | 421 | 93 | 8.8 | 81 % | 38 % | 0.94 | **-19.69 %** | -25.60 % | −41.7 % | 143/260/18 |

**Hållregelns effekt, cell för cell:**

| Cell | PF veckovis → BEHÅLL | Equity % veckovis → BEHÅLL | Affärer/år veckovis → BEHÅLL |
|---|---|---|---|
| 10d −3/+6 % | 0.69 → **0.69** | -80.54 → **-75.01** | 210 → **154** |
| 10d −4/+8 % | 0.73 → **0.73** | -81.96 → **-74.37** | 210 → **127** |
| 10d −5/+10 % | 0.77 → **0.76** | -80.00 → **-67.71** | 210 → **101** |
| 20d −3/+6 % | 0.75 → **0.74** | -69.25 → **-64.58** | 210 → **149** |
| 20d −4/+8 % | 0.76 → **0.80** | -73.73 → **-56.18** | 210 → **122** |
| 20d −5/+10 % | 0.79 → **0.77** | -73.62 → **-62.38** | 210 → **99** |
| 60d −3/+6 % | 0.87 → **0.90** | -39.64 → **-19.36** | 210 → **151** |
| 60d −4/+8 % | 0.86 → **0.96** | -54.47 → **-12.40** | 210 → **118** |
| 60d −5/+10 % | 0.85 → **0.97** | -58.84 → **-0.96** | 210 → **92** |
| 120d −3/+6 % | 0.94 → **0.93** | -23.48 → **-12.97** | 210 → **147** |
| 120d −4/+8 % | 0.87 → **0.86** | -49.17 → **-40.11** | 210 → **119** |
| 120d −5/+10 % | 0.89 → **0.94** | -45.30 → **-19.69** | 210 → **93** |

## 2. Lookback-fönstret (mätfel 2)

Gamla gridet testade bara 10 och 20 dagar. Två till fyra veckors momentum är kortsiktig REVERSAL-horisont – att köpa topp N på det fönstret ligger nära att köpa det mest överköpta. Klassisk momentum mäts på 6–12 månader, ofta med den senaste månaden bortskippad.

| Lookback | Skip | Affärer/år | Investerad | Träff % | PF | Equity % | Max DD |
|---|---|---|---|---|---|---|---|
| 10d | 0d | 127 | 69 % | 31 % | 0.73 | **-74.37 %** | −76.5 % |
| 20d | 0d | 122 | 71 % | 33 % | 0.80 | **-56.18 %** | −65.9 % |
| 60d | 0d | 118 | 74 % | 37 % | 0.96 | **-12.40 %** | −47.1 % |
| 120d | 0d | 119 | 74 % | 35 % | 0.86 | **-40.11 %** | −52.6 % |
| 60d | 20d | 117 | 74 % | 35 % | 0.87 | **-41.37 %** | −56.9 % |
| 120d | 20d | 113 | 75 % | 37 % | 0.96 | **-2.25 %** | −41.9 % |

## 3. Indexsleeven (mätfel 1)

Böckerna parkerar oallokerat kapital i en indexsleeve. Den gamla kedjningen gav tom tid värdet noll, vilket systematiskt underskattade böckerna. Skillnaden mellan raderna nedan ÄR storleken på det gamla mätfelet.

| Sleeve | Investerad i aktier | Equity % | Max DD |
|---|---|---|---|
| av (gammalt mätsätt) | 71 % | -65.17 % | −69.3 % |
| **på (så böckerna handlas)** | 71 % | **-56.18 %** | −65.9 % |

Kapitalet stod ledigt 29 % av tiden, fördelat på 744 dagar. Låg den lediga tiden JÄMNT fördelad över perioden skulle sleeven gett **+9.47 %** (^OMX totalt +37.26 % upphöjt till andelen ledig tid). Den gav **+26.99 %**.

Den lediga tiden låg ungefär jämnt fördelad, så sleeven lyfter resultatet i proportion till andelen ledigt kapital.
*(^OMX oviktat över samma dagar: +27.11 % – varje ledig dag räknad lika, oavsett hur många platser som stod tomma. Jämför inte det talet direkt med bidraget ovan.)*

## 4. Hålltid och regimfilter (mätfel 5 och 6)

| Variant | Affärer/år | Investerad | PF | Equity % | Max DD |
|---|---|---|---|---|---|
| horisont 20 dgr | 127 | 71 % | 0.79 | -57.83 % | −66.8 % |
| horisont 30 dgr | 122 | 71 % | 0.80 | -56.18 % | −65.9 % |
| horisont 60 dgr | 116 | 73 % | 0.82 | -45.42 % | −59.2 % |
| horisont 90 dgr | 116 | 73 % | 0.82 | -46.45 % | −60.0 % |
| regimfilter av | 122 | 71 % | 0.80 | -56.18 % | −65.9 % |
| regimfilter MA100 | 82 | 50 % | 0.84 | -23.04 % | −46.6 % |
| regimfilter MA200 | 93 | 55 % | 0.76 | -43.53 % | −57.3 % |

## 5. Out-of-sample (mätfel 3)

Perioden delas vid **2024-01-26**. Bästa cellen väljs på första halvan och mäts på andra, mot medianen av alla 24 celler i samma halva. Slår den inte medianen är "bästa cell" urvalsbrus, och nivåbanden i prompterna vilar på ingenting.

| | Period | Benchmark | Vald cell | Median av alla celler |
|---|---|---|---|---|
| In-sample | 2022-01-24 → 2024-01-26 | -0.42 % | -22.80 % | -46.08 % |
| **Out-of-sample** | 2024-01-26 → 2026-08-03 | +37.84 % | **+3.00 %** | -16.32 % |

Vald cell: **BEHÅLL 120d −3/+6 %**.
Cellen håller sig över medianen out-of-sample – valet bär åtminstone svagt.

**Håller nivåbandet i båda halvorna?**

| Läge | Lookback | Bästa nivå halva 1 | Bästa nivå halva 2 | Bästa nivå hela perioden | Samma? |
|---|---|---|---|---|---|
| veckovis | 10d | −5/+10 % | −3/+6 % | −5/+10 % | **nej** |
| veckovis | 20d | −3/+6 % | −3/+6 % | −3/+6 % | ja |
| veckovis | 60d | −3/+6 % | −3/+6 % | −3/+6 % | ja |
| veckovis | 120d | −3/+6 % | −3/+6 % | −3/+6 % | ja |
| BEHÅLL | 10d | −5/+10 % | −5/+10 % | −5/+10 % | ja |
| BEHÅLL | 20d | −3/+6 % | −4/+8 % | −4/+8 % | **nej** |
| BEHÅLL | 60d | −5/+10 % | −5/+10 % | −5/+10 % | ja |
| BEHÅLL | 120d | −3/+6 % | −3/+6 % | −3/+6 % | ja |

Samma nivå vinner i båda halvorna i **6 av 8** kombinationer. Nivåbandet är åtminstone svagt stabilt – men rangordningen inom bandet är fortfarande brus.

## 6. Kostnadsmodell – nivå per symbol

Rundturskostnaden är **inte** ett enda tal i den här körningen. Den härleds ur varje symbols **medianomsättning per dag** (kurs × volym, median över perioden, normaliserad till SEK med fasta valutafaktorer). Median och inte medel: en enda rapportdag med tiodubbel volym ska inte få ett illikvitt bolag att framstå som likvidt.

| Nivå (rundtur) | Gräns (median MSEK/dag) | Antal symboler | Symboler |
|---|---|---|---|
| 0.25 % | ≥ 20.0 | 91 | AAK.ST, ABB.ST, AKRBP.OL, AKSO.OL, ALFA.ST, ALIV-SDB.ST, ALLEI.ST, ASSA-B.ST, ATCO-A.ST, ATCO-B.ST, AXFO.ST, AZN.ST, BALD-B.ST, BEIJ-B.ST, BOL.ST, CARL-B.CO, CAST.ST, CLAS-B.ST, COLO-B.CO, DEMANT.CO, DNB.OL, DOM.ST, DSV.CO, ELUX-B.ST, EMBRAC-B.ST, EPI-A.ST, EPI-B.ST, EQNR.OL, EQT.ST, ERIC-B.ST, ESSITY-B.ST, EVO.ST, FABG.ST, FORTUM.HE, FRO.OL, GETI-B.ST, GMAB.CO, HEXA-B.ST, HM-B.ST, HUSQ-B.ST, INDT.ST, INVE-B.ST, JM.ST, KINV-B.ST, KNEBV.HE, KOG.OL, LATO-B.ST, LIFCO-B.ST, MAERSK-B.CO, MIPS.ST, MOWI.OL, NCC-B.ST, NDA-SE.ST, NESTE.HE, NHY.OL, NIBE-B.ST, NOKIA.HE, NOVO-B.CO, ORK.OL, ORNBV.HE, ORSTED.CO, PEAB-B.ST, SAAB-B.ST, SAGA-B.ST, SALM.OL, SAMPO.HE, SAND.ST, SBB-B.ST, SCA-B.ST, SEB-A.ST, SHB-A.ST, SINCH.ST, SKA-B.ST, SKF-B.ST, STERV.HE, SUBC.OL, SWEC-B.ST, SWED-A.ST, TEL.OL, TEL2-B.ST, TELIA.ST, THULE.ST, TREL-B.ST, TRUE-B.ST, TRYG.CO, UPM.HE, VOLCAR-B.ST, VOLV-B.ST, VWS.CO, WRT1V.HE, YAR.OL |
| 0.75 % | ≥ 3.0 | 11 | ARJO-B.ST, BOOZT.ST, HNSA.ST, NEWA-B.ST, NOLA-B.ST, PDX.ST, RATO-B.ST, SCST.ST, SF.ST, VITR.ST, VPLAY-B.ST |
| 1.5 % | ≥ 0.0 | 8 | BIOT.ST, CTM.ST, DOMETIC.ST, G5EN.ST, ICA.ST, MORLD.OL, STAR-B.ST, STIL.ST |

**3 symboler saknar volymdata** och har medvetet placerats i den DYRASTE nivån (BIOT.ST, DOMETIC.ST, ICA.ST) – att gissa billigt på det vi inte kan mäta är precis det fel modellen finns för att undvika.

> ⚠️ **Nivåerna är en schablon, inte uppmätt spread.** De är satta i `config/kostnader.json` efter vad en privat nätmäklarkund typiskt betalar i courtage plus observerad spread i respektive likviditetsklass. Verklig spread i ett illikvitt bolag varierar kraftigt över tid och är värst exakt när man vill ut. Läs därför resultatet för det breda universumet som ett TAK för vad det kan ge, inte som en prognos.

**Tolkning:** equity % över benchmark med rimlig max DD ⇒ skelettet bär sin egen vikt; under ⇒ LLM-urvalet måste tillföra hela edgen. Jämför cellerna mot varandra snarare än absoluttalen (momentum-proxyn är trubbigare än case-urvalet). **Skiljer sig rangordningen mellan lägena är nivåbanden en artefakt av hållregeln, inte en egenskap hos marknaden.** Väg alltid in survivorship-varningen överst.

*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
