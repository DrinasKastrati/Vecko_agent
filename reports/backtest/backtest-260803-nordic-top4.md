# Backtest av mekaniska skelettet – nordic (5y)
**Datum:** 2026-08-03 | **Marknad/universum:** `nordic` (config/backtest_universe_nordic.txt) | **Universum:** 30 symboler | **Positioner:** 4 à 25 % | **Benchmark (^OMX) köp-och-behåll:** +37.26 % | **Transaktionskostnad:** nivåstyrd per symbol (0.25 % / 0.75 % / 1.5 %), se avsnitt 6

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
| veckovis | 10d | −3 % | +6 % | 1019 | 206 | 3.9 | 79 % | 46 % | 0.95 | **-25.51 %** | -19.27 % | −44.7 % | 145/393/481 |
| veckovis | 10d | −4 % | +8 % | 1019 | 206 | 4.3 | 87 % | 47 % | 0.91 | **-39.48 %** | -35.58 % | −53.2 % | 82/292/645 |
| veckovis | 10d | −5 % | +10 % | 1019 | 206 | 4.5 | 92 % | 48 % | 0.89 | **-48.41 %** | -43.04 % | −60.9 % | 42/232/745 |
| veckovis | 20d | −3 % | +6 % | 1023 | 209 | 3.9 | 80 % | 47 % | 0.96 | **-26.66 %** | -18.93 % | −44.1 % | 145/404/474 |
| veckovis | 20d | −4 % | +8 % | 1023 | 209 | 4.3 | 88 % | 48 % | 0.95 | **-29.97 %** | -23.28 % | −43.8 % | 85/299/639 |
| veckovis | 20d | −5 % | +10 % | 1023 | 209 | 4.5 | 93 % | 50 % | 0.93 | **-35.00 %** | -29.57 % | −45.6 % | 44/228/751 |
| veckovis | 60d | −3 % | +6 % | 1000 | 210 | 3.9 | 81 % | 45 % | 0.92 | **-34.37 %** | -28.98 % | −57.0 % | 145/397/458 |
| veckovis | 60d | −4 % | +8 % | 1000 | 210 | 4.3 | 90 % | 47 % | 0.88 | **-44.92 %** | -43.19 % | −56.6 % | 78/294/628 |
| veckovis | 60d | −5 % | +10 % | 1000 | 210 | 4.5 | 95 % | 48 % | 0.84 | **-55.76 %** | -53.50 % | −62.4 % | 36/225/739 |
| veckovis | 120d | −3 % | +6 % | 952 | 210 | 3.8 | 80 % | 47 % | 1.06 | **+17.18 %** | +16.73 % | −29.0 % | 158/362/432 |
| veckovis | 120d | −4 % | +8 % | 952 | 210 | 4.2 | 89 % | 49 % | 1.05 | **+14.18 %** | +13.79 % | −32.5 % | 87/268/597 |
| veckovis | 120d | −5 % | +10 % | 952 | 210 | 4.5 | 94 % | 50 % | 1.04 | **+2.12 %** | +11.81 % | −39.3 % | 47/201/704 |
| BEHÅLL | 10d | −3 % | +6 % | 542 | 110 | 6.9 | 75 % | 37 % | 0.94 | **-20.18 %** | -18.07 % | −36.5 % | 183/340/19 |
| BEHÅLL | 10d | −4 % | +8 % | 416 | 84 | 9.9 | 83 % | 38 % | 0.95 | **-22.61 %** | -17.42 % | −43.4 % | 130/253/33 |
| BEHÅLL | 10d | −5 % | +10 % | 341 | 69 | 12.6 | 87 % | 38 % | 0.91 | **-33.68 %** | -25.67 % | −43.9 % | 91/200/50 |
| BEHÅLL | 20d | −3 % | +6 % | 554 | 113 | 6.6 | 74 % | 37 % | 0.94 | **-23.19 %** | -20.41 % | −41.9 % | 191/349/14 |
| BEHÅLL | 20d | −4 % | +8 % | 418 | 85 | 9.8 | 83 % | 36 % | 0.95 | **-20.29 %** | -18.55 % | −41.4 % | 131/260/27 |
| BEHÅLL | 20d | −5 % | +10 % | 343 | 70 | 12.5 | 87 % | 36 % | 0.93 | **-30.91 %** | -21.67 % | −41.5 % | 93/198/52 |
| BEHÅLL | 60d | −3 % | +6 % | 554 | 117 | 6.5 | 76 % | 39 % | 1.04 | **+4.12 %** | +9.17 % | −41.8 % | 204/336/14 |
| BEHÅLL | 60d | −4 % | +8 % | 400 | 84 | 10.0 | 84 % | 37 % | 0.92 | **-22.34 %** | -23.82 % | −40.4 % | 127/247/26 |
| BEHÅLL | 60d | −5 % | +10 % | 315 | 66 | 13.3 | 88 % | 40 % | 1.04 | **+6.85 %** | +5.23 % | −33.7 % | 95/176/44 |
| BEHÅLL | 120d | −3 % | +6 % | 530 | 117 | 6.3 | 74 % | 40 % | 1.12 | **+42.30 %** | +35.43 % | −17.8 % | 204/314/12 |
| BEHÅLL | 120d | −4 % | +8 % | 397 | 88 | 9.4 | 82 % | 38 % | 1.07 | **+34.69 %** | +14.09 % | −29.5 % | 139/237/21 |
| BEHÅLL | 120d | −5 % | +10 % | 321 | 71 | 12.2 | 86 % | 41 % | 1.11 | **+28.98 %** | +24.62 % | −32.1 % | 99/178/44 |

**Hållregelns effekt, cell för cell:**

| Cell | PF veckovis → BEHÅLL | Equity % veckovis → BEHÅLL | Affärer/år veckovis → BEHÅLL |
|---|---|---|---|
| 10d −3/+6 % | 0.95 → **0.94** | -25.51 → **-20.18** | 206 → **110** |
| 10d −4/+8 % | 0.91 → **0.95** | -39.48 → **-22.61** | 206 → **84** |
| 10d −5/+10 % | 0.89 → **0.91** | -48.41 → **-33.68** | 206 → **69** |
| 20d −3/+6 % | 0.96 → **0.94** | -26.66 → **-23.19** | 209 → **113** |
| 20d −4/+8 % | 0.95 → **0.95** | -29.97 → **-20.29** | 209 → **85** |
| 20d −5/+10 % | 0.93 → **0.93** | -35.00 → **-30.91** | 209 → **70** |
| 60d −3/+6 % | 0.92 → **1.04** | -34.37 → **+4.12** | 210 → **117** |
| 60d −4/+8 % | 0.88 → **0.92** | -44.92 → **-22.34** | 210 → **84** |
| 60d −5/+10 % | 0.84 → **1.04** | -55.76 → **+6.85** | 210 → **66** |
| 120d −3/+6 % | 1.06 → **1.12** | +17.18 → **+42.30** | 210 → **117** |
| 120d −4/+8 % | 1.05 → **1.07** | +14.18 → **+34.69** | 210 → **88** |
| 120d −5/+10 % | 1.04 → **1.11** | +2.12 → **+28.98** | 210 → **71** |

## 2. Lookback-fönstret (mätfel 2)

Gamla gridet testade bara 10 och 20 dagar. Två till fyra veckors momentum är kortsiktig REVERSAL-horisont – att köpa topp N på det fönstret ligger nära att köpa det mest överköpta. Klassisk momentum mäts på 6–12 månader, ofta med den senaste månaden bortskippad.

| Lookback | Skip | Affärer/år | Investerad | Träff % | PF | Equity % | Max DD |
|---|---|---|---|---|---|---|---|
| 10d | 0d | 84 | 83 % | 38 % | 0.95 | **-22.61 %** | −43.4 % |
| 20d | 0d | 85 | 83 % | 36 % | 0.95 | **-20.29 %** | −41.4 % |
| 60d | 0d | 84 | 84 % | 37 % | 0.92 | **-22.34 %** | −40.4 % |
| 120d | 0d | 88 | 82 % | 38 % | 1.07 | **+34.69 %** | −29.5 % |
| 60d | 20d | 90 | 84 % | 39 % | 1.07 | **+20.38 %** | −30.9 % |
| 120d | 20d | 90 | 82 % | 39 % | 1.11 | **+35.16 %** | −28.9 % |

## 3. Indexsleeven (mätfel 1)

Böckerna parkerar oallokerat kapital i en indexsleeve. Den gamla kedjningen gav tom tid värdet noll, vilket systematiskt underskattade böckerna. Skillnaden mellan raderna nedan ÄR storleken på det gamla mätfelet.

| Sleeve | Investerad i aktier | Equity % | Max DD |
|---|---|---|---|
| av (gammalt mätsätt) | 83 % | -20.08 % | −35.5 % |
| **på (så böckerna handlas)** | 83 % | **-20.29 %** | −41.4 % |

Kapitalet stod ledigt 17 % av tiden, fördelat på 505 dagar. Låg den lediga tiden JÄMNT fördelad över perioden skulle sleeven gett **+5.61 %** (^OMX totalt +37.26 % upphöjt till andelen ledig tid). Den gav **+0.36 %**.

**Den lediga tiden var koncentrerad till svaga perioder.** Platser blir tomma när positioner stoppas ut, och det sker i nedgångar – sleeven ligger alltså i index just när index är svagt. Sleeven lyfter därför mindre än andelen ledig tid antyder. Mätsättet är ändå rätt: felet var att räkna tom tid som noll.
*(^OMX oviktat över samma dagar: +30.49 % – varje ledig dag räknad lika, oavsett hur många platser som stod tomma. Jämför inte det talet direkt med bidraget ovan.)*

## 4. Hålltid och regimfilter (mätfel 5 och 6)

| Variant | Affärer/år | Investerad | PF | Equity % | Max DD |
|---|---|---|---|---|---|
| horisont 20 dgr | 91 | 82 % | 0.92 | -24.11 % | −44.3 % |
| horisont 30 dgr | 85 | 83 % | 0.95 | -20.29 % | −41.4 % |
| horisont 60 dgr | 81 | 83 % | 1.00 | -11.55 % | −41.4 % |
| horisont 90 dgr | 81 | 83 % | 1.00 | -12.39 % | −41.4 % |
| regimfilter av | 85 | 83 % | 0.95 | -20.29 % | −41.4 % |
| regimfilter MA100 | 57 | 59 % | 1.08 | +26.69 % | −29.1 % |
| regimfilter MA200 | 65 | 65 % | 1.03 | +21.55 % | −27.0 % |

## 5. Out-of-sample (mätfel 3)

Perioden delas vid **2024-01-26**. Bästa cellen väljs på första halvan och mäts på andra, mot medianen av alla 24 celler i samma halva. Slår den inte medianen är "bästa cell" urvalsbrus, och nivåbanden i prompterna vilar på ingenting.

| | Period | Benchmark | Vald cell | Median av alla celler |
|---|---|---|---|---|
| In-sample | 2022-01-24 → 2024-01-26 | -0.42 % | -8.17 % | -27.15 % |
| **Out-of-sample** | 2024-01-26 → 2026-08-03 | +37.84 % | **+29.14 %** | -1.44 % |

Vald cell: **BEHÅLL 120d −3/+6 %**.
Cellen håller sig över medianen out-of-sample – valet bär åtminstone svagt.

**Håller nivåbandet i båda halvorna?**

| Läge | Lookback | Bästa nivå halva 1 | Bästa nivå halva 2 | Bästa nivå hela perioden | Samma? |
|---|---|---|---|---|---|
| veckovis | 10d | −3/+6 % | −3/+6 % | −3/+6 % | ja |
| veckovis | 20d | −4/+8 % | −3/+6 % | −3/+6 % | **nej** |
| veckovis | 60d | −4/+8 % | −3/+6 % | −3/+6 % | **nej** |
| veckovis | 120d | −3/+6 % | −4/+8 % | −3/+6 % | **nej** |
| BEHÅLL | 10d | −4/+8 % | −3/+6 % | −3/+6 % | **nej** |
| BEHÅLL | 20d | −3/+6 % | −4/+8 % | −4/+8 % | **nej** |
| BEHÅLL | 60d | −5/+10 % | −3/+6 % | −5/+10 % | **nej** |
| BEHÅLL | 120d | −3/+6 % | −4/+8 % | −3/+6 % | **nej** |

Samma nivå vinner i båda halvorna i **1 av 8** kombinationer. **Nivåbandet är INTE stabilt.** Vilken stop/mål-nivå som ser bäst ut beror på vilken period som mäts. Behandla banden i prompterna som en riskregel (R/R och kostnadströskel), inte som en optimerad parameter.

## 6. Kostnadsmodell – nivå per symbol

Rundturskostnaden är **inte** ett enda tal i den här körningen. Den härleds ur varje symbols **medianomsättning per dag** (kurs × volym, median över perioden, normaliserad till SEK med fasta valutafaktorer). Median och inte medel: en enda rapportdag med tiodubbel volym ska inte få ett illikvitt bolag att framstå som likvidt.

| Nivå (rundtur) | Gräns (median MSEK/dag) | Antal symboler | Symboler |
|---|---|---|---|
| 0.25 % | ≥ 20.0 | 30 | ABB.ST, AKRBP.OL, ALFA.ST, ATCO-A.ST, AZN.ST, BOL.ST, CARL-B.CO, DNB.OL, DSV.CO, EQNR.OL, ERIC-B.ST, EVO.ST, FORTUM.HE, HM-B.ST, INVE-B.ST, KNEBV.HE, KOG.OL, MAERSK-B.CO, MOWI.OL, NESTE.HE, NOKIA.HE, NOVO-B.CO, SAAB-B.ST, SAMPO.HE, SAND.ST, SEB-A.ST, SKF-B.ST, SWED-A.ST, VOLV-B.ST, YAR.OL |
| 0.75 % | ≥ 3.0 | 0 | – |
| 1.5 % | ≥ 0.0 | 0 | – |


> ⚠️ **Nivåerna är en schablon, inte uppmätt spread.** De är satta i `config/kostnader.json` efter vad en privat nätmäklarkund typiskt betalar i courtage plus observerad spread i respektive likviditetsklass. Verklig spread i ett illikvitt bolag varierar kraftigt över tid och är värst exakt när man vill ut. Läs därför resultatet för det breda universumet som ett TAK för vad det kan ge, inte som en prognos.

**Tolkning:** equity % över benchmark med rimlig max DD ⇒ skelettet bär sin egen vikt; under ⇒ LLM-urvalet måste tillföra hela edgen. Jämför cellerna mot varandra snarare än absoluttalen (momentum-proxyn är trubbigare än case-urvalet). **Skiljer sig rangordningen mellan lägena är nivåbanden en artefakt av hållregeln, inte en egenskap hos marknaden.** Väg alltid in survivorship-varningen överst.

*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
