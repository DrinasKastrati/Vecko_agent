# Backtest av mekaniska skelettet – nordic (5y)
**Datum:** 2026-08-02 | **Universum:** 30 symboler | **Positioner:** 4 à 25 % | **Benchmark (^OMX) köp-och-behåll:** +36.33 % | **Transaktionskostnad:** 0.25 % per affär (netto)

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
| veckovis | 10d | −3 % | +6 % | 1015 | 206 | 3.9 | 79 % | 46 % | 0.95 | **-26.24 %** | -20.22 % | −44.7 % | 145/393/477 |
| veckovis | 10d | −4 % | +8 % | 1015 | 206 | 4.3 | 87 % | 47 % | 0.90 | **-39.89 %** | -36.21 % | −53.2 % | 82/292/641 |
| veckovis | 10d | −5 % | +10 % | 1015 | 206 | 4.5 | 92 % | 48 % | 0.89 | **-48.76 %** | -43.59 % | −60.9 % | 42/232/741 |
| veckovis | 20d | −3 % | +6 % | 1019 | 208 | 3.9 | 80 % | 47 % | 0.96 | **-26.83 %** | -19.29 % | −44.1 % | 145/404/470 |
| veckovis | 20d | −4 % | +8 % | 1019 | 208 | 4.3 | 88 % | 49 % | 0.95 | **-29.92 %** | -23.46 % | −43.8 % | 85/299/635 |
| veckovis | 20d | −5 % | +10 % | 1019 | 208 | 4.5 | 93 % | 50 % | 0.93 | **-34.96 %** | -29.74 % | −45.6 % | 44/228/747 |
| veckovis | 60d | −3 % | +6 % | 996 | 210 | 3.9 | 81 % | 45 % | 0.93 | **-32.85 %** | -27.54 % | −57.0 % | 145/396/455 |
| veckovis | 60d | −4 % | +8 % | 996 | 210 | 4.3 | 90 % | 47 % | 0.88 | **-43.64 %** | -42.04 % | −56.6 % | 78/293/625 |
| veckovis | 60d | −5 % | +10 % | 996 | 210 | 4.6 | 95 % | 48 % | 0.85 | **-54.74 %** | -52.55 % | −62.4 % | 36/224/736 |
| veckovis | 120d | −3 % | +6 % | 948 | 210 | 3.8 | 80 % | 47 % | 1.06 | **+18.32 %** | +17.87 % | −29.0 % | 158/362/428 |
| veckovis | 120d | −4 % | +8 % | 948 | 210 | 4.2 | 89 % | 49 % | 1.05 | **+15.65 %** | +15.14 % | −32.5 % | 87/268/593 |
| veckovis | 120d | −5 % | +10 % | 948 | 210 | 4.5 | 94 % | 50 % | 1.05 | **+3.43 %** | +13.13 % | −39.3 % | 47/201/700 |
| BEHÅLL | 10d | −3 % | +6 % | 540 | 109 | 6.9 | 75 % | 37 % | 0.94 | **-21.26 %** | -19.36 % | −36.5 % | 183/340/17 |
| BEHÅLL | 10d | −4 % | +8 % | 416 | 84 | 9.9 | 83 % | 38 % | 0.96 | **-20.92 %** | -15.90 % | −43.4 % | 130/252/34 |
| BEHÅLL | 10d | −5 % | +10 % | 340 | 69 | 12.7 | 86 % | 37 % | 0.91 | **-34.14 %** | -26.41 % | −43.9 % | 91/200/49 |
| BEHÅLL | 20d | −3 % | +6 % | 552 | 113 | 6.6 | 74 % | 37 % | 0.93 | **-23.76 %** | -21.17 % | −41.9 % | 191/349/12 |
| BEHÅLL | 20d | −4 % | +8 % | 418 | 85 | 9.8 | 83 % | 36 % | 0.95 | **-18.93 %** | -17.42 % | −41.4 % | 131/259/28 |
| BEHÅLL | 20d | −5 % | +10 % | 342 | 70 | 12.5 | 86 % | 36 % | 0.94 | **-29.32 %** | -20.05 % | −41.5 % | 93/198/51 |
| BEHÅLL | 60d | −3 % | +6 % | 553 | 117 | 6.6 | 76 % | 39 % | 1.05 | **+6.51 %** | +11.37 % | −41.8 % | 204/335/14 |
| BEHÅLL | 60d | −4 % | +8 % | 399 | 84 | 10.1 | 84 % | 37 % | 0.93 | **-20.44 %** | -22.16 % | −40.4 % | 127/246/26 |
| BEHÅLL | 60d | −5 % | +10 % | 315 | 66 | 13.3 | 88 % | 40 % | 1.04 | **+8.55 %** | +6.49 % | −33.7 % | 95/175/45 |
| BEHÅLL | 120d | −3 % | +6 % | 526 | 117 | 6.4 | 74 % | 40 % | 1.13 | **+43.69 %** | +36.75 % | −17.8 % | 204/314/8 |
| BEHÅLL | 120d | −4 % | +8 % | 394 | 87 | 9.5 | 82 % | 39 % | 1.07 | **+36.84 %** | +15.79 % | −29.5 % | 139/237/18 |
| BEHÅLL | 120d | −5 % | +10 % | 318 | 70 | 12.3 | 86 % | 42 % | 1.11 | **+31.03 %** | +26.47 % | −32.1 % | 99/178/41 |

**Hållregelns effekt, cell för cell:**

| Cell | PF veckovis → BEHÅLL | Equity % veckovis → BEHÅLL | Affärer/år veckovis → BEHÅLL |
|---|---|---|---|
| 10d −3/+6 % | 0.95 → **0.94** | -26.24 → **-21.26** | 206 → **109** |
| 10d −4/+8 % | 0.90 → **0.96** | -39.89 → **-20.92** | 206 → **84** |
| 10d −5/+10 % | 0.89 → **0.91** | -48.76 → **-34.14** | 206 → **69** |
| 20d −3/+6 % | 0.96 → **0.93** | -26.83 → **-23.76** | 208 → **113** |
| 20d −4/+8 % | 0.95 → **0.95** | -29.92 → **-18.93** | 208 → **85** |
| 20d −5/+10 % | 0.93 → **0.94** | -34.96 → **-29.32** | 208 → **70** |
| 60d −3/+6 % | 0.93 → **1.05** | -32.85 → **+6.51** | 210 → **117** |
| 60d −4/+8 % | 0.88 → **0.93** | -43.64 → **-20.44** | 210 → **84** |
| 60d −5/+10 % | 0.85 → **1.04** | -54.74 → **+8.55** | 210 → **66** |
| 120d −3/+6 % | 1.06 → **1.13** | +18.32 → **+43.69** | 210 → **117** |
| 120d −4/+8 % | 1.05 → **1.07** | +15.65 → **+36.84** | 210 → **87** |
| 120d −5/+10 % | 1.05 → **1.11** | +3.43 → **+31.03** | 210 → **70** |

## 2. Lookback-fönstret (mätfel 2)

Gamla gridet testade bara 10 och 20 dagar. Två till fyra veckors momentum är kortsiktig REVERSAL-horisont – att köpa topp N på det fönstret ligger nära att köpa det mest överköpta. Klassisk momentum mäts på 6–12 månader, ofta med den senaste månaden bortskippad.

| Lookback | Skip | Affärer/år | Investerad | Träff % | PF | Equity % | Max DD |
|---|---|---|---|---|---|---|---|
| 10d | 0d | 84 | 83 % | 38 % | 0.96 | **-20.92 %** | −43.4 % |
| 20d | 0d | 85 | 83 % | 36 % | 0.95 | **-18.93 %** | −41.4 % |
| 60d | 0d | 84 | 84 % | 37 % | 0.93 | **-20.44 %** | −40.4 % |
| 120d | 0d | 87 | 82 % | 39 % | 1.07 | **+36.84 %** | −29.5 % |
| 60d | 20d | 90 | 83 % | 40 % | 1.08 | **+23.58 %** | −30.9 % |
| 120d | 20d | 90 | 82 % | 40 % | 1.11 | **+37.25 %** | −28.9 % |

## 3. Indexsleeven (mätfel 1)

Böckerna parkerar oallokerat kapital i en indexsleeve. Den gamla kedjningen gav tom tid värdet noll, vilket systematiskt underskattade böckerna. Skillnaden mellan raderna nedan ÄR storleken på det gamla mätfelet.

| Sleeve | Investerad i aktier | Equity % | Max DD |
|---|---|---|---|
| av (gammalt mätsätt) | 83 % | -19.04 % | −35.5 % |
| **på (så böckerna handlas)** | 83 % | **-18.93 %** | −41.4 % |

Kapitalet stod ledigt 17 % av tiden, fördelat på 506 dagar. Låg den lediga tiden JÄMNT fördelad över perioden skulle sleeven gett **+5.52 %** (^OMX totalt +36.33 % upphöjt till andelen ledig tid). Den gav **+0.78 %**.

**Den lediga tiden var koncentrerad till svaga perioder.** Platser blir tomma när positioner stoppas ut, och det sker i nedgångar – sleeven ligger alltså i index just när index är svagt. Sleeven lyfter därför mindre än andelen ledig tid antyder. Mätsättet är ändå rätt: felet var att räkna tom tid som noll.
*(^OMX oviktat över samma dagar: +31.03 % – varje ledig dag räknad lika, oavsett hur många platser som stod tomma. Jämför inte det talet direkt med bidraget ovan.)*

## 4. Hålltid och regimfilter (mätfel 5 och 6)

| Variant | Affärer/år | Investerad | PF | Equity % | Max DD |
|---|---|---|---|---|---|
| horisont 20 dgr | 91 | 82 % | 0.92 | -24.22 % | −44.3 % |
| horisont 30 dgr | 85 | 83 % | 0.95 | -18.93 % | −41.4 % |
| horisont 60 dgr | 81 | 83 % | 1.01 | -10.04 % | −41.4 % |
| horisont 90 dgr | 81 | 83 % | 1.00 | -10.89 % | −41.4 % |
| regimfilter av | 85 | 83 % | 0.95 | -18.93 % | −41.4 % |
| regimfilter MA100 | 58 | 59 % | 1.09 | +28.86 % | −29.1 % |
| regimfilter MA200 | 65 | 65 % | 1.03 | +23.63 % | −27.0 % |

## 5. Out-of-sample (mätfel 3)

Perioden delas vid **2024-01-25**. Bästa cellen väljs på första halvan och mäts på andra, mot medianen av alla 24 celler i samma halva. Slår den inte medianen är "bästa cell" urvalsbrus, och nivåbanden i prompterna vilar på ingenting.

| | Period | Benchmark | Vald cell | Median av alla celler |
|---|---|---|---|---|
| In-sample | 2022-01-24 → 2024-01-25 | -0.79 % | -8.38 % | -26.65 % |
| **Out-of-sample** | 2024-01-25 → 2026-07-30 | +37.42 % | **+28.15 %** | -2.31 % |

Vald cell: **BEHÅLL 120d −3/+6 %**.
Cellen håller sig över medianen out-of-sample – valet bär åtminstone svagt.

**Håller nivåbandet i båda halvorna?**

| Läge | Lookback | Bästa nivå halva 1 | Bästa nivå halva 2 | Bästa nivå hela perioden | Samma? |
|---|---|---|---|---|---|
| veckovis | 10d | −3/+6 % | −3/+6 % | −3/+6 % | ja |
| veckovis | 20d | −4/+8 % | −3/+6 % | −3/+6 % | **nej** |
| veckovis | 60d | −4/+8 % | −3/+6 % | −3/+6 % | **nej** |
| veckovis | 120d | −3/+6 % | −4/+8 % | −3/+6 % | **nej** |
| BEHÅLL | 10d | −4/+8 % | −3/+6 % | −4/+8 % | **nej** |
| BEHÅLL | 20d | −3/+6 % | −4/+8 % | −4/+8 % | **nej** |
| BEHÅLL | 60d | −5/+10 % | −3/+6 % | −5/+10 % | **nej** |
| BEHÅLL | 120d | −3/+6 % | −5/+10 % | −3/+6 % | **nej** |

Samma nivå vinner i båda halvorna i **1 av 8** kombinationer. **Nivåbandet är INTE stabilt.** Vilken stop/mål-nivå som ser bäst ut beror på vilken period som mäts. Behandla banden i prompterna som en riskregel (R/R och kostnadströskel), inte som en optimerad parameter.

**Tolkning:** equity % över benchmark med rimlig max DD ⇒ skelettet bär sin egen vikt; under ⇒ LLM-urvalet måste tillföra hela edgen. Jämför cellerna mot varandra snarare än absoluttalen (momentum-proxyn är trubbigare än case-urvalet). **Skiljer sig rangordningen mellan lägena är nivåbanden en artefakt av hållregeln, inte en egenskap hos marknaden.** Väg alltid in survivorship-varningen överst.

*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
