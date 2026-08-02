# Backtest av mekaniska skelettet – us (5y)
**Datum:** 2026-08-02 | **Universum:** 30 symboler | **Positioner:** 4 à 25 % | **Benchmark (^GSPC) köp-och-behåll:** +70.72 % | **Transaktionskostnad:** 0.75 % per affär (netto)

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
| veckovis | 10d | −3 % | +6 % | 1013 | 205 | 3.5 | 71 % | 38 % | 0.65 | **-80.32 %** | -85.23 % | −81.3 % | 174/488/351 |
| veckovis | 10d | −4 % | +8 % | 1013 | 205 | 4.0 | 82 % | 41 % | 0.69 | **-79.88 %** | -83.47 % | −81.2 % | 109/378/526 |
| veckovis | 10d | −5 % | +10 % | 1013 | 205 | 4.4 | 90 % | 43 % | 0.75 | **-75.48 %** | -77.95 % | −77.7 % | 69/279/665 |
| veckovis | 20d | −3 % | +6 % | 1012 | 207 | 3.4 | 70 % | 39 % | 0.71 | **-74.96 %** | -79.03 % | −75.2 % | 189/485/338 |
| veckovis | 20d | −4 % | +8 % | 1012 | 207 | 4.0 | 81 % | 42 % | 0.73 | **-76.32 %** | -79.46 % | −76.3 % | 120/390/502 |
| veckovis | 20d | −5 % | +10 % | 1012 | 207 | 4.4 | 90 % | 44 % | 0.79 | **-67.93 %** | -71.76 % | −69.1 % | 74/287/651 |
| veckovis | 60d | −3 % | +6 % | 984 | 207 | 3.3 | 68 % | 40 % | 0.80 | **-59.02 %** | -65.90 % | −61.4 % | 220/477/287 |
| veckovis | 60d | −4 % | +8 % | 984 | 207 | 3.9 | 80 % | 42 % | 0.83 | **-59.79 %** | -63.47 % | −62.5 % | 154/385/445 |
| veckovis | 60d | −5 % | +10 % | 984 | 207 | 4.3 | 88 % | 44 % | 0.87 | **-54.18 %** | -55.75 % | −57.6 % | 94/291/599 |
| veckovis | 120d | −3 % | +6 % | 938 | 208 | 3.3 | 67 % | 39 % | 0.76 | **-64.66 %** | -70.83 % | −67.4 % | 201/466/271 |
| veckovis | 120d | −4 % | +8 % | 938 | 208 | 3.8 | 79 % | 42 % | 0.83 | **-58.02 %** | -63.40 % | −61.4 % | 146/377/415 |
| veckovis | 120d | −5 % | +10 % | 938 | 208 | 4.3 | 88 % | 44 % | 0.90 | **-44.09 %** | -47.90 % | −55.5 % | 100/280/558 |
| BEHÅLL | 10d | −3 % | +6 % | 621 | 126 | 5.6 | 70 % | 36 % | 0.80 | **-49.84 %** | -56.62 % | −56.6 % | 216/395/10 |
| BEHÅLL | 10d | −4 % | +8 % | 485 | 98 | 8.1 | 79 % | 38 % | 0.89 | **-29.47 %** | -36.73 % | −39.4 % | 163/293/29 |
| BEHÅLL | 10d | −5 % | +10 % | 351 | 71 | 12.0 | 85 % | 44 % | 1.17 | **+55.73 %** | +50.07 % | −33.6 % | 121/186/44 |
| BEHÅLL | 20d | −3 % | +6 % | 653 | 133 | 5.1 | 68 % | 37 % | 0.82 | **-47.63 %** | -54.21 % | −51.6 % | 234/407/12 |
| BEHÅLL | 20d | −4 % | +8 % | 507 | 104 | 7.6 | 78 % | 39 % | 0.93 | **-14.21 %** | -28.85 % | −30.8 % | 183/303/21 |
| BEHÅLL | 20d | −5 % | +10 % | 381 | 78 | 10.8 | 84 % | 44 % | 1.12 | **+42.13 %** | +35.61 % | −29.3 % | 134/204/43 |
| BEHÅLL | 60d | −3 % | +6 % | 704 | 148 | 4.4 | 65 % | 38 % | 0.86 | **-42.13 %** | -47.88 % | −45.0 % | 266/435/3 |
| BEHÅLL | 60d | −4 % | +8 % | 554 | 117 | 6.4 | 74 % | 38 % | 0.95 | **-20.64 %** | -26.20 % | −42.9 % | 207/336/11 |
| BEHÅLL | 60d | −5 % | +10 % | 429 | 90 | 9.0 | 81 % | 40 % | 1.05 | **+7.30 %** | +12.75 % | −41.9 % | 156/250/23 |
| BEHÅLL | 120d | −3 % | +6 % | 671 | 149 | 4.3 | 64 % | 35 % | 0.79 | **-52.56 %** | -60.72 % | −56.2 % | 237/432/2 |
| BEHÅLL | 120d | −4 % | +8 % | 534 | 118 | 6.4 | 75 % | 36 % | 0.91 | **-24.12 %** | -35.78 % | −40.7 % | 187/339/8 |
| BEHÅLL | 120d | −5 % | +10 % | 413 | 91 | 8.8 | 80 % | 41 % | 1.15 | **+53.23 %** | +55.59 % | −29.4 % | 159/237/17 |

**Hållregelns effekt, cell för cell:**

| Cell | PF veckovis → BEHÅLL | Equity % veckovis → BEHÅLL | Affärer/år veckovis → BEHÅLL |
|---|---|---|---|
| 10d −3/+6 % | 0.65 → **0.80** | -80.32 → **-49.84** | 205 → **126** |
| 10d −4/+8 % | 0.69 → **0.89** | -79.88 → **-29.47** | 205 → **98** |
| 10d −5/+10 % | 0.75 → **1.17** | -75.48 → **+55.73** | 205 → **71** |
| 20d −3/+6 % | 0.71 → **0.82** | -74.96 → **-47.63** | 207 → **133** |
| 20d −4/+8 % | 0.73 → **0.93** | -76.32 → **-14.21** | 207 → **104** |
| 20d −5/+10 % | 0.79 → **1.12** | -67.93 → **+42.13** | 207 → **78** |
| 60d −3/+6 % | 0.80 → **0.86** | -59.02 → **-42.13** | 207 → **148** |
| 60d −4/+8 % | 0.83 → **0.95** | -59.79 → **-20.64** | 207 → **117** |
| 60d −5/+10 % | 0.87 → **1.05** | -54.18 → **+7.30** | 207 → **90** |
| 120d −3/+6 % | 0.76 → **0.79** | -64.66 → **-52.56** | 208 → **149** |
| 120d −4/+8 % | 0.83 → **0.91** | -58.02 → **-24.12** | 208 → **118** |
| 120d −5/+10 % | 0.90 → **1.15** | -44.09 → **+53.23** | 208 → **91** |

## 2. Lookback-fönstret (mätfel 2)

Gamla gridet testade bara 10 och 20 dagar. Två till fyra veckors momentum är kortsiktig REVERSAL-horisont – att köpa topp N på det fönstret ligger nära att köpa det mest överköpta. Klassisk momentum mäts på 6–12 månader, ofta med den senaste månaden bortskippad.

| Lookback | Skip | Affärer/år | Investerad | Träff % | PF | Equity % | Max DD |
|---|---|---|---|---|---|---|---|
| 10d | 0d | 71 | 85 % | 44 % | 1.17 | **+55.73 %** | −33.6 % |
| 20d | 0d | 78 | 84 % | 44 % | 1.12 | **+42.13 %** | −29.3 % |
| 60d | 0d | 90 | 81 % | 40 % | 1.05 | **+7.30 %** | −41.9 % |
| 120d | 0d | 91 | 80 % | 41 % | 1.15 | **+53.23 %** | −29.4 % |
| 60d | 20d | 89 | 81 % | 44 % | 1.26 | **+110.32 %** | −25.9 % |
| 120d | 20d | 90 | 81 % | 44 % | 1.20 | **+69.07 %** | −27.1 % |

## 3. Indexsleeven (mätfel 1)

Böckerna parkerar oallokerat kapital i en indexsleeve. Den gamla kedjningen gav tom tid värdet noll, vilket systematiskt underskattade böckerna. Skillnaden mellan raderna nedan ÄR storleken på det gamla mätfelet.

| Sleeve | Investerad i aktier | Equity % | Max DD |
|---|---|---|---|
| av (gammalt mätsätt) | 84 % | +30.82 % | −27.1 % |
| **på (så böckerna handlas)** | 84 % | **+42.13 %** | −29.3 % |

Kapitalet stod ledigt 16 % av tiden, fördelat på 538 dagar. Låg den lediga tiden JÄMNT fördelad över perioden skulle sleeven gett **+9.00 %** (^GSPC totalt +70.72 % upphöjt till andelen ledig tid). Den gav **+9.98 %**.

Den lediga tiden låg ungefär jämnt fördelad, så sleeven lyfter resultatet i proportion till andelen ledigt kapital.
*(^GSPC oviktat över samma dagar: +10.89 % – varje ledig dag räknad lika, oavsett hur många platser som stod tomma. Jämför inte det talet direkt med bidraget ovan.)*

## 4. Hålltid och regimfilter (mätfel 5 och 6)

| Variant | Affärer/år | Investerad | PF | Equity % | Max DD |
|---|---|---|---|---|---|
| horisont 20 dgr | 87 | 82 % | 1.02 | +3.40 % | −34.8 % |
| horisont 30 dgr | 78 | 84 % | 1.12 | +42.13 % | −29.3 % |
| horisont 60 dgr | 74 | 86 % | 1.09 | +27.92 % | −31.3 % |
| horisont 90 dgr | 69 | 87 % | 1.09 | +22.79 % | −29.9 % |
| regimfilter av | 78 | 84 % | 1.12 | +42.13 % | −29.3 % |
| regimfilter MA100 | 60 | 67 % | 1.12 | +46.02 % | −26.3 % |
| regimfilter MA200 | 63 | 69 % | 1.17 | +70.15 % | −23.6 % |

## 5. Out-of-sample (mätfel 3)

Perioden delas vid **2024-01-30**. Bästa cellen väljs på första halvan och mäts på andra, mot medianen av alla 24 celler i samma halva. Slår den inte medianen är "bästa cell" urvalsbrus, och nivåbanden i prompterna vilar på ingenting.

| | Period | Benchmark | Vald cell | Median av alla celler |
|---|---|---|---|---|
| In-sample | 2022-01-24 → 2024-01-30 | +12.26 % | +37.00 % | -23.38 % |
| **Out-of-sample** | 2024-01-30 → 2026-07-31 | +52.08 % | **+21.68 %** | -34.49 % |

Vald cell: **BEHÅLL 120d −5/+10 %**.
Cellen håller sig över medianen out-of-sample – valet bär åtminstone svagt.

**Håller nivåbandet i båda halvorna?**

| Läge | Lookback | Bästa nivå halva 1 | Bästa nivå halva 2 | Bästa nivå hela perioden | Samma? |
|---|---|---|---|---|---|
| veckovis | 10d | −5/+10 % | −3/+6 % | −5/+10 % | **nej** |
| veckovis | 20d | −5/+10 % | −5/+10 % | −5/+10 % | ja |
| veckovis | 60d | −5/+10 % | −4/+8 % | −5/+10 % | **nej** |
| veckovis | 120d | −5/+10 % | −5/+10 % | −5/+10 % | ja |
| BEHÅLL | 10d | −5/+10 % | −5/+10 % | −5/+10 % | ja |
| BEHÅLL | 20d | −5/+10 % | −5/+10 % | −5/+10 % | ja |
| BEHÅLL | 60d | −4/+8 % | −5/+10 % | −5/+10 % | **nej** |
| BEHÅLL | 120d | −5/+10 % | −5/+10 % | −5/+10 % | ja |

Samma nivå vinner i båda halvorna i **5 av 8** kombinationer. Nivåbandet är åtminstone svagt stabilt – men rangordningen inom bandet är fortfarande brus.

**Tolkning:** equity % över benchmark med rimlig max DD ⇒ skelettet bär sin egen vikt; under ⇒ LLM-urvalet måste tillföra hela edgen. Jämför cellerna mot varandra snarare än absoluttalen (momentum-proxyn är trubbigare än case-urvalet). **Skiljer sig rangordningen mellan lägena är nivåbanden en artefakt av hållregeln, inte en egenskap hos marknaden.** Väg alltid in survivorship-varningen överst.

*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
