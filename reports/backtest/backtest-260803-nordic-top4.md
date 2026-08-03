# Backtest av mekaniska skelettet – nordic (5y)
**Datum:** 2026-08-03 | **Marknad/universum:** `nordic` (config/backtest_universe_nordic.txt) | **Universum:** 30 symboler | **Positioner:** 4 à 25 % | **Benchmark (^OMX) köp-och-behåll:** +37.57 % | **Transaktionskostnad:** nivåstyrd per symbol (0.25 % / 0.75 % / 1.5 %), se avsnitt 6

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
| veckovis | 10d | −3 % | +6 % | 1019 | 206 | 3.9 | 79 % | 46 % | 0.95 | **-25.32 %** | -19.05 % | −44.7 % | 145/393/481 |
| veckovis | 10d | −4 % | +8 % | 1019 | 206 | 4.3 | 87 % | 47 % | 0.91 | **-39.32 %** | -35.41 % | −53.2 % | 82/292/645 |
| veckovis | 10d | −5 % | +10 % | 1019 | 206 | 4.5 | 92 % | 48 % | 0.89 | **-48.27 %** | -42.88 % | −60.9 % | 42/232/745 |
| veckovis | 20d | −3 % | +6 % | 1023 | 209 | 3.9 | 80 % | 47 % | 0.96 | **-26.56 %** | -18.82 % | −44.1 % | 145/404/474 |
| veckovis | 20d | −4 % | +8 % | 1023 | 209 | 4.3 | 88 % | 49 % | 0.95 | **-29.86 %** | -23.16 % | −43.8 % | 85/299/639 |
| veckovis | 20d | −5 % | +10 % | 1023 | 209 | 4.5 | 93 % | 50 % | 0.94 | **-34.91 %** | -29.46 % | −45.6 % | 44/228/751 |
| veckovis | 60d | −3 % | +6 % | 1000 | 210 | 3.9 | 81 % | 46 % | 0.92 | **-34.02 %** | -28.62 % | −57.0 % | 145/397/458 |
| veckovis | 60d | −4 % | +8 % | 1000 | 210 | 4.3 | 90 % | 47 % | 0.88 | **-44.63 %** | -42.90 % | −56.6 % | 78/294/628 |
| veckovis | 60d | −5 % | +10 % | 1000 | 210 | 4.5 | 95 % | 48 % | 0.84 | **-55.53 %** | -53.26 % | −62.4 % | 36/225/739 |
| veckovis | 120d | −3 % | +6 % | 952 | 210 | 3.8 | 80 % | 47 % | 1.06 | **+17.12 %** | +16.68 % | −29.0 % | 158/362/432 |
| veckovis | 120d | −4 % | +8 % | 952 | 210 | 4.2 | 89 % | 49 % | 1.05 | **+14.14 %** | +13.75 % | −32.5 % | 87/268/597 |
| veckovis | 120d | −5 % | +10 % | 952 | 210 | 4.5 | 94 % | 50 % | 1.04 | **+2.08 %** | +11.77 % | −39.3 % | 47/201/704 |
| BEHÅLL | 10d | −3 % | +6 % | 542 | 110 | 6.9 | 75 % | 37 % | 0.94 | **-20.03 %** | -17.91 % | −36.5 % | 183/340/19 |
| BEHÅLL | 10d | −4 % | +8 % | 416 | 84 | 9.9 | 83 % | 38 % | 0.95 | **-22.60 %** | -17.41 % | −43.4 % | 130/253/33 |
| BEHÅLL | 10d | −5 % | +10 % | 341 | 69 | 12.6 | 87 % | 38 % | 0.91 | **-33.56 %** | -25.53 % | −43.9 % | 91/200/50 |
| BEHÅLL | 20d | −3 % | +6 % | 554 | 113 | 6.6 | 74 % | 37 % | 0.94 | **-23.09 %** | -20.31 % | −41.9 % | 191/349/14 |
| BEHÅLL | 20d | −4 % | +8 % | 418 | 85 | 9.8 | 83 % | 36 % | 0.95 | **-20.19 %** | -18.45 % | −41.4 % | 131/260/27 |
| BEHÅLL | 20d | −5 % | +10 % | 343 | 70 | 12.5 | 87 % | 36 % | 0.93 | **-30.71 %** | -21.43 % | −41.5 % | 93/198/52 |
| BEHÅLL | 60d | −3 % | +6 % | 554 | 117 | 6.5 | 76 % | 39 % | 1.04 | **+4.29 %** | +9.35 % | −41.8 % | 204/336/14 |
| BEHÅLL | 60d | −4 % | +8 % | 400 | 84 | 10.0 | 84 % | 37 % | 0.92 | **-22.28 %** | -23.76 % | −40.4 % | 127/247/26 |
| BEHÅLL | 60d | −5 % | +10 % | 315 | 66 | 13.3 | 88 % | 40 % | 1.04 | **+7.02 %** | +5.40 % | −33.7 % | 95/176/44 |
| BEHÅLL | 120d | −3 % | +6 % | 530 | 117 | 6.3 | 74 % | 40 % | 1.12 | **+42.24 %** | +35.37 % | −17.8 % | 204/314/12 |
| BEHÅLL | 120d | −4 % | +8 % | 397 | 88 | 9.4 | 82 % | 38 % | 1.07 | **+34.63 %** | +14.04 % | −29.5 % | 139/237/21 |
| BEHÅLL | 120d | −5 % | +10 % | 321 | 71 | 12.2 | 86 % | 41 % | 1.11 | **+28.92 %** | +24.56 % | −32.1 % | 99/178/44 |

**Hållregelns effekt, cell för cell:**

| Cell | PF veckovis → BEHÅLL | Equity % veckovis → BEHÅLL | Affärer/år veckovis → BEHÅLL |
|---|---|---|---|
| 10d −3/+6 % | 0.95 → **0.94** | -25.32 → **-20.03** | 206 → **110** |
| 10d −4/+8 % | 0.91 → **0.95** | -39.32 → **-22.60** | 206 → **84** |
| 10d −5/+10 % | 0.89 → **0.91** | -48.27 → **-33.56** | 206 → **69** |
| 20d −3/+6 % | 0.96 → **0.94** | -26.56 → **-23.09** | 209 → **113** |
| 20d −4/+8 % | 0.95 → **0.95** | -29.86 → **-20.19** | 209 → **85** |
| 20d −5/+10 % | 0.94 → **0.93** | -34.91 → **-30.71** | 209 → **70** |
| 60d −3/+6 % | 0.92 → **1.04** | -34.02 → **+4.29** | 210 → **117** |
| 60d −4/+8 % | 0.88 → **0.92** | -44.63 → **-22.28** | 210 → **84** |
| 60d −5/+10 % | 0.84 → **1.04** | -55.53 → **+7.02** | 210 → **66** |
| 120d −3/+6 % | 1.06 → **1.12** | +17.12 → **+42.24** | 210 → **117** |
| 120d −4/+8 % | 1.05 → **1.07** | +14.14 → **+34.63** | 210 → **88** |
| 120d −5/+10 % | 1.04 → **1.11** | +2.08 → **+28.92** | 210 → **71** |

## 2. Lookback-fönstret (mätfel 2)

Gamla gridet testade bara 10 och 20 dagar. Två till fyra veckors momentum är kortsiktig REVERSAL-horisont – att köpa topp N på det fönstret ligger nära att köpa det mest överköpta. Klassisk momentum mäts på 6–12 månader, ofta med den senaste månaden bortskippad.

| Lookback | Skip | Affärer/år | Investerad | Träff % | PF | Equity % | Max DD |
|---|---|---|---|---|---|---|---|
| 10d | 0d | 84 | 83 % | 38 % | 0.95 | **-22.60 %** | −43.4 % |
| 20d | 0d | 85 | 83 % | 36 % | 0.95 | **-20.19 %** | −41.4 % |
| 60d | 0d | 84 | 84 % | 37 % | 0.92 | **-22.28 %** | −40.4 % |
| 120d | 0d | 88 | 82 % | 38 % | 1.07 | **+34.63 %** | −29.5 % |
| 60d | 20d | 90 | 84 % | 39 % | 1.07 | **+20.22 %** | −30.9 % |
| 120d | 20d | 90 | 82 % | 39 % | 1.11 | **+34.93 %** | −28.9 % |

## 3. Indexsleeven (mätfel 1)

Böckerna parkerar oallokerat kapital i en indexsleeve. Den gamla kedjningen gav tom tid värdet noll, vilket systematiskt underskattade böckerna. Skillnaden mellan raderna nedan ÄR storleken på det gamla mätfelet.

| Sleeve | Investerad i aktier | Equity % | Max DD |
|---|---|---|---|
| av (gammalt mätsätt) | 83 % | -19.98 % | −35.5 % |
| **på (så böckerna handlas)** | 83 % | **-20.19 %** | −41.4 % |

Kapitalet stod ledigt 17 % av tiden, fördelat på 505 dagar. Låg den lediga tiden JÄMNT fördelad över perioden skulle sleeven gett **+5.65 %** (^OMX totalt +37.57 % upphöjt till andelen ledig tid). Den gav **+0.36 %**.

**Den lediga tiden var koncentrerad till svaga perioder.** Platser blir tomma när positioner stoppas ut, och det sker i nedgångar – sleeven ligger alltså i index just när index är svagt. Sleeven lyfter därför mindre än andelen ledig tid antyder. Mätsättet är ändå rätt: felet var att räkna tom tid som noll.
*(^OMX oviktat över samma dagar: +30.49 % – varje ledig dag räknad lika, oavsett hur många platser som stod tomma. Jämför inte det talet direkt med bidraget ovan.)*

## 4. Hålltid och regimfilter (mätfel 5 och 6)

| Variant | Affärer/år | Investerad | PF | Equity % | Max DD |
|---|---|---|---|---|---|
| horisont 20 dgr | 91 | 82 % | 0.92 | -24.01 % | −44.3 % |
| horisont 30 dgr | 85 | 83 % | 0.95 | -20.19 % | −41.4 % |
| horisont 60 dgr | 81 | 83 % | 1.00 | -11.44 % | −41.4 % |
| horisont 90 dgr | 81 | 83 % | 1.00 | -12.29 % | −41.4 % |
| regimfilter av | 85 | 83 % | 0.95 | -20.19 % | −41.4 % |
| regimfilter MA100 | 57 | 59 % | 1.08 | +26.85 % | −29.1 % |
| regimfilter MA200 | 65 | 65 % | 1.03 | +21.70 % | −27.0 % |

## 5. Out-of-sample (mätfel 3)

Perioden delas vid **2024-01-26**. Bästa cellen väljs på första halvan och mäts på andra, mot medianen av alla 24 celler i samma halva. Slår den inte medianen är "bästa cell" urvalsbrus, och nivåbanden i prompterna vilar på ingenting.

| | Period | Benchmark | Vald cell | Median av alla celler |
|---|---|---|---|---|
| In-sample | 2022-01-24 → 2024-01-26 | -0.42 % | -8.17 % | -27.15 % |
| **Out-of-sample** | 2024-01-26 → 2026-08-03 | +38.15 % | **+29.08 %** | -1.30 % |

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

## 6. Kombinationer – håller vinnarna ihop? (tillagt 2026-08-03)

Svepen ovan varierar **en** dimension i taget från basfallet, medvetet: ett stort kors låter en "bästa cell" plockas ur brus. Men då ser man heller aldrig vad vinnarna gör tillsammans. Listan nedan är kort, fast och skriven i förväg ur de enskilda svepen – **hypoteser, inte optimering**. Nivåerna hålls på basfallets, eftersom avsnitt 5 visat att stop/mål-bandet inte är stabilt och därför inte ska optimeras.

**Kravet för att få ändra en prompt: slå benchmark i BÅDA halvorna.** Halva 1 (2021-08-03 → 2024-01-26) benchmark -0.42 %, halva 2 (2024-01-26 → 2026-08-03) benchmark +38.15 %.

| Kombination | Hela perioden | Halva 1 | Halva 2 | Slår bench i båda? | Investerad | Max DD (hela) |
|---|---|---|---|---|---|---|
| Basfall (som böckerna körs i dag) | -20.19 % | -27.21 % | -7.37 % | nej | 83 % | −41.4 % |
| + lookback 120d | +34.63 % | -24.84 % | +45.03 % | nej (bara en halva) | 82 % | −29.5 % |
| + lookback 120d, skip 20d | +34.93 % | -22.35 % | +56.69 % | nej (bara en halva) | 82 % | −28.9 % |
| + 120d/skip20 + regim MA100 | +39.23 % | -19.76 % | +51.94 % | nej (bara en halva) | 58 % | −23.0 % |
| + 120d/skip20 + regim MA200 | +64.41 % | -7.78 % | +57.44 % | nej (bara en halva) | 62 % | −21.6 % |
| + 120d/skip20 + MA100 + horisont 60d | +37.65 % | -16.75 % | +44.70 % | nej (bara en halva) | 59 % | −21.2 % |
| Bara regim MA200 (annars basfall) | +21.70 % | +4.39 % | -5.52 % | nej (bara en halva) | 65 % | −27.0 % |

**Ingen kombination slår benchmark i båda halvorna.** Ändra därför INGEN nivå eller regel i prompterna på det här underlaget. Slutsatsen som bär är i stället den tråkiga: skelettet tillför inte mätbar avkastning över indexsleeven, och edgen måste komma från katalysatorurvalet – som den här motorn inte mäter.

## 7. Kostnadsmodell – nivå per symbol

Rundturskostnaden är **inte** ett enda tal i den här körningen. Den härleds ur varje symbols **medianomsättning per dag** (kurs × volym, median över perioden, normaliserad till SEK med fasta valutafaktorer). Median och inte medel: en enda rapportdag med tiodubbel volym ska inte få ett illikvitt bolag att framstå som likvidt.

| Nivå (rundtur) | Gräns (median MSEK/dag) | Antal symboler | Symboler |
|---|---|---|---|
| 0.25 % | ≥ 20.0 | 30 | ABB.ST, AKRBP.OL, ALFA.ST, ATCO-A.ST, AZN.ST, BOL.ST, CARL-B.CO, DNB.OL, DSV.CO, EQNR.OL, ERIC-B.ST, EVO.ST, FORTUM.HE, HM-B.ST, INVE-B.ST, KNEBV.HE, KOG.OL, MAERSK-B.CO, MOWI.OL, NESTE.HE, NOKIA.HE, NOVO-B.CO, SAAB-B.ST, SAMPO.HE, SAND.ST, SEB-A.ST, SKF-B.ST, SWED-A.ST, VOLV-B.ST, YAR.OL |
| 0.75 % | ≥ 3.0 | 0 | – |
| 1.5 % | ≥ 0.0 | 0 | – |


> ⚠️ **Nivåerna är en schablon, inte uppmätt spread.** De är satta i `config/kostnader.json` efter vad en privat nätmäklarkund typiskt betalar i courtage plus observerad spread i respektive likviditetsklass. Verklig spread i ett illikvitt bolag varierar kraftigt över tid och är värst exakt när man vill ut. Läs därför resultatet för det breda universumet som ett TAK för vad det kan ge, inte som en prognos.

**Tolkning:** equity % över benchmark med rimlig max DD ⇒ skelettet bär sin egen vikt; under ⇒ LLM-urvalet måste tillföra hela edgen. Jämför cellerna mot varandra snarare än absoluttalen (momentum-proxyn är trubbigare än case-urvalet). **Skiljer sig rangordningen mellan lägena är nivåbanden en artefakt av hållregeln, inte en egenskap hos marknaden.** Väg alltid in survivorship-varningen överst.

*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
