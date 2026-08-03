# Backtest av mekaniska skelettet – nordic-broad (5y)
**Datum:** 2026-08-03 | **Marknad/universum:** `nordic-broad` (config/backtest_universe_nordic_broad.txt) | **Universum:** 153 symboler | **Positioner:** 4 à 25 % | **Benchmark (^OMX) köp-och-behåll:** +37.26 % | **Transaktionskostnad:** 0.25 % per affär (netto)

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
| veckovis | 10d | −3 % | +6 % | 1040 | 210 | 2.5 | 52 % | 33 % | 0.69 | **-81.97 %** | -82.92 % | −83.2 % | 209/646/185 |
| veckovis | 10d | −4 % | +8 % | 1040 | 210 | 3.0 | 63 % | 36 % | 0.71 | **-86.30 %** | -86.27 % | −87.3 % | 162/571/307 |
| veckovis | 10d | −5 % | +10 % | 1040 | 210 | 3.5 | 72 % | 38 % | 0.74 | **-87.87 %** | -86.84 % | −88.7 % | 137/491/412 |
| veckovis | 20d | −3 % | +6 % | 1032 | 210 | 2.6 | 53 % | 36 % | 0.78 | **-63.48 %** | -69.26 % | −69.0 % | 225/611/196 |
| veckovis | 20d | −4 % | +8 % | 1032 | 210 | 3.1 | 64 % | 38 % | 0.77 | **-73.84 %** | -78.53 % | −79.7 % | 166/551/315 |
| veckovis | 20d | −5 % | +10 % | 1032 | 210 | 3.5 | 73 % | 40 % | 0.77 | **-79.43 %** | -82.20 % | −84.2 % | 127/473/432 |
| veckovis | 60d | −3 % | +6 % | 1000 | 210 | 2.8 | 59 % | 39 % | 0.89 | **-31.04 %** | -45.22 % | −51.9 % | 246/550/204 |
| veckovis | 60d | −4 % | +8 % | 1000 | 210 | 3.4 | 71 % | 41 % | 0.88 | **-49.43 %** | -55.03 % | −63.7 % | 174/483/343 |
| veckovis | 60d | −5 % | +10 % | 1000 | 210 | 3.8 | 79 % | 43 % | 0.90 | **-48.18 %** | -53.09 % | −66.8 % | 127/405/468 |
| veckovis | 120d | −3 % | +6 % | 952 | 210 | 2.8 | 59 % | 38 % | 0.86 | **-49.84 %** | -51.18 % | −57.2 % | 224/535/193 |
| veckovis | 120d | −4 % | +8 % | 952 | 210 | 3.4 | 71 % | 40 % | 0.84 | **-60.63 %** | -61.70 % | −63.0 % | 151/461/340 |
| veckovis | 120d | −5 % | +10 % | 952 | 210 | 3.9 | 81 % | 43 % | 0.91 | **-50.00 %** | -47.92 % | −61.5 % | 117/374/461 |
| BEHÅLL | 10d | −3 % | +6 % | 825 | 167 | 3.2 | 53 % | 30 % | 0.73 | **-70.45 %** | -74.20 % | −74.7 % | 242/577/6 |
| BEHÅLL | 10d | −4 % | +8 % | 682 | 138 | 4.7 | 64 % | 29 % | 0.74 | **-75.86 %** | -77.02 % | −77.9 % | 193/478/11 |
| BEHÅLL | 10d | −5 % | +10 % | 571 | 115 | 6.3 | 72 % | 31 % | 0.80 | **-70.25 %** | -67.24 % | −77.8 % | 165/388/18 |
| BEHÅLL | 20d | −3 % | +6 % | 805 | 164 | 3.4 | 55 % | 31 % | 0.81 | **-52.11 %** | -61.24 % | −59.6 % | 252/548/5 |
| BEHÅLL | 20d | −4 % | +8 % | 656 | 134 | 5.0 | 66 % | 32 % | 0.83 | **-47.81 %** | -59.87 % | −63.1 % | 202/441/13 |
| BEHÅLL | 20d | −5 % | +10 % | 567 | 116 | 6.3 | 72 % | 31 % | 0.82 | **-57.53 %** | -63.49 % | −67.1 % | 169/380/18 |
| BEHÅLL | 60d | −3 % | +6 % | 765 | 161 | 3.6 | 58 % | 34 % | 0.89 | **-18.84 %** | -40.46 % | −46.5 % | 260/500/5 |
| BEHÅLL | 60d | −4 % | +8 % | 633 | 133 | 5.2 | 69 % | 35 % | 0.94 | **-14.85 %** | -30.81 % | −44.4 % | 214/409/10 |
| BEHÅLL | 60d | −5 % | +10 % | 515 | 108 | 7.0 | 76 % | 36 % | 0.96 | **-8.56 %** | -24.45 % | −41.8 % | 169/325/21 |
| BEHÅLL | 120d | −3 % | +6 % | 747 | 165 | 3.5 | 57 % | 32 % | 0.83 | **-48.76 %** | -54.60 % | −55.3 % | 239/503/5 |
| BEHÅLL | 120d | −4 % | +8 % | 606 | 134 | 5.1 | 68 % | 33 % | 0.88 | **-40.18 %** | -46.46 % | −52.7 % | 198/402/6 |
| BEHÅLL | 120d | −5 % | +10 % | 503 | 111 | 6.9 | 76 % | 35 % | 0.96 | **-15.01 %** | -23.14 % | −45.2 % | 169/323/11 |

**Hållregelns effekt, cell för cell:**

| Cell | PF veckovis → BEHÅLL | Equity % veckovis → BEHÅLL | Affärer/år veckovis → BEHÅLL |
|---|---|---|---|
| 10d −3/+6 % | 0.69 → **0.73** | -81.97 → **-70.45** | 210 → **167** |
| 10d −4/+8 % | 0.71 → **0.74** | -86.30 → **-75.86** | 210 → **138** |
| 10d −5/+10 % | 0.74 → **0.80** | -87.87 → **-70.25** | 210 → **115** |
| 20d −3/+6 % | 0.78 → **0.81** | -63.48 → **-52.11** | 210 → **164** |
| 20d −4/+8 % | 0.77 → **0.83** | -73.84 → **-47.81** | 210 → **134** |
| 20d −5/+10 % | 0.77 → **0.82** | -79.43 → **-57.53** | 210 → **116** |
| 60d −3/+6 % | 0.89 → **0.89** | -31.04 → **-18.84** | 210 → **161** |
| 60d −4/+8 % | 0.88 → **0.94** | -49.43 → **-14.85** | 210 → **133** |
| 60d −5/+10 % | 0.90 → **0.96** | -48.18 → **-8.56** | 210 → **108** |
| 120d −3/+6 % | 0.86 → **0.83** | -49.84 → **-48.76** | 210 → **165** |
| 120d −4/+8 % | 0.84 → **0.88** | -60.63 → **-40.18** | 210 → **134** |
| 120d −5/+10 % | 0.91 → **0.96** | -50.00 → **-15.01** | 210 → **111** |

## 2. Lookback-fönstret (mätfel 2)

Gamla gridet testade bara 10 och 20 dagar. Två till fyra veckors momentum är kortsiktig REVERSAL-horisont – att köpa topp N på det fönstret ligger nära att köpa det mest överköpta. Klassisk momentum mäts på 6–12 månader, ofta med den senaste månaden bortskippad.

| Lookback | Skip | Affärer/år | Investerad | Träff % | PF | Equity % | Max DD |
|---|---|---|---|---|---|---|---|
| 10d | 0d | 138 | 64 % | 29 % | 0.74 | **-75.86 %** | −77.9 % |
| 20d | 0d | 134 | 66 % | 32 % | 0.83 | **-47.81 %** | −63.1 % |
| 60d | 0d | 133 | 69 % | 35 % | 0.94 | **-14.85 %** | −44.4 % |
| 120d | 0d | 134 | 68 % | 33 % | 0.88 | **-40.18 %** | −52.7 % |
| 60d | 20d | 137 | 67 % | 35 % | 0.95 | **-25.38 %** | −52.4 % |
| 120d | 20d | 130 | 69 % | 35 % | 0.95 | **-19.83 %** | −49.6 % |

## 3. Indexsleeven (mätfel 1)

Böckerna parkerar oallokerat kapital i en indexsleeve. Den gamla kedjningen gav tom tid värdet noll, vilket systematiskt underskattade böckerna. Skillnaden mellan raderna nedan ÄR storleken på det gamla mätfelet.

| Sleeve | Investerad i aktier | Equity % | Max DD |
|---|---|---|---|
| av (gammalt mätsätt) | 66 % | -60.10 % | −67.7 % |
| **på (så böckerna handlas)** | 66 % | **-47.81 %** | −63.1 % |

Kapitalet stod ledigt 34 % av tiden, fördelat på 832 dagar. Låg den lediga tiden JÄMNT fördelad över perioden skulle sleeven gett **+11.37 %** (^OMX totalt +37.26 % upphöjt till andelen ledig tid). Den gav **+32.12 %**.

Den lediga tiden låg ungefär jämnt fördelad, så sleeven lyfter resultatet i proportion till andelen ledigt kapital.
*(^OMX oviktat över samma dagar: +25.62 % – varje ledig dag räknad lika, oavsett hur många platser som stod tomma. Jämför inte det talet direkt med bidraget ovan.)*

## 4. Hålltid och regimfilter (mätfel 5 och 6)

| Variant | Affärer/år | Investerad | PF | Equity % | Max DD |
|---|---|---|---|---|---|
| horisont 20 dgr | 140 | 65 % | 0.83 | -50.71 % | −63.4 % |
| horisont 30 dgr | 134 | 66 % | 0.83 | -47.81 % | −63.1 % |
| horisont 60 dgr | 130 | 67 % | 0.83 | -45.84 % | −63.3 % |
| horisont 90 dgr | 130 | 67 % | 0.83 | -46.94 % | −63.3 % |
| regimfilter av | 134 | 66 % | 0.83 | -47.81 % | −63.1 % |
| regimfilter MA100 | 90 | 45 % | 0.88 | -14.38 % | −45.2 % |
| regimfilter MA200 | 102 | 50 % | 0.81 | -33.61 % | −54.5 % |

## 5. Out-of-sample (mätfel 3)

Perioden delas vid **2024-01-26**. Bästa cellen väljs på första halvan och mäts på andra, mot medianen av alla 24 celler i samma halva. Slår den inte medianen är "bästa cell" urvalsbrus, och nivåbanden i prompterna vilar på ingenting.

| | Period | Benchmark | Vald cell | Median av alla celler |
|---|---|---|---|---|
| In-sample | 2021-11-01 → 2024-01-26 | -0.42 % | +3.09 % | -40.01 % |
| **Out-of-sample** | 2024-01-26 → 2026-08-03 | +37.84 % | **-9.12 %** | -27.64 % |

Vald cell: **BEHÅLL 60d −5/+10 %**.
Cellen håller sig över medianen out-of-sample – valet bär åtminstone svagt.

**Håller nivåbandet i båda halvorna?**

| Läge | Lookback | Bästa nivå halva 1 | Bästa nivå halva 2 | Bästa nivå hela perioden | Samma? |
|---|---|---|---|---|---|
| veckovis | 10d | −3/+6 % | −3/+6 % | −3/+6 % | ja |
| veckovis | 20d | −3/+6 % | −3/+6 % | −3/+6 % | ja |
| veckovis | 60d | −5/+10 % | −3/+6 % | −3/+6 % | **nej** |
| veckovis | 120d | −5/+10 % | −5/+10 % | −3/+6 % | ja |
| BEHÅLL | 10d | −5/+10 % | −3/+6 % | −5/+10 % | **nej** |
| BEHÅLL | 20d | −5/+10 % | −4/+8 % | −4/+8 % | **nej** |
| BEHÅLL | 60d | −5/+10 % | −3/+6 % | −5/+10 % | **nej** |
| BEHÅLL | 120d | −5/+10 % | −5/+10 % | −5/+10 % | ja |

Samma nivå vinner i båda halvorna i **4 av 8** kombinationer. Nivåbandet är åtminstone svagt stabilt – men rangordningen inom bandet är fortfarande brus.

**Tolkning:** equity % över benchmark med rimlig max DD ⇒ skelettet bär sin egen vikt; under ⇒ LLM-urvalet måste tillföra hela edgen. Jämför cellerna mot varandra snarare än absoluttalen (momentum-proxyn är trubbigare än case-urvalet). **Skiljer sig rangordningen mellan lägena är nivåbanden en artefakt av hållregeln, inte en egenskap hos marknaden.** Väg alltid in survivorship-varningen överst.

*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
