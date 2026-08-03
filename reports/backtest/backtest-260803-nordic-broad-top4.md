# Backtest av mekaniska skelettet – nordic-broad (5y)
**Datum:** 2026-08-03 | **Marknad/universum:** `nordic-broad` (config/backtest_universe_nordic_broad.txt) | **Universum:** 153 symboler | **Positioner:** 4 à 25 % | **Benchmark (^OMX) köp-och-behåll:** +37.27 % | **Transaktionskostnad:** nivåstyrd per symbol (0.25 % / 0.75 % / 1.5 %), se avsnitt 6

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
| veckovis | 10d | −3 % | +6 % | 1040 | 210 | 2.5 | 52 % | 32 % | 0.57 | **-92.99 %** | -93.33 % | −93.3 % | 209/646/185 |
| veckovis | 10d | −4 % | +8 % | 1040 | 210 | 3.0 | 63 % | 35 % | 0.61 | **-94.68 %** | -94.64 % | −95.0 % | 162/571/307 |
| veckovis | 10d | −5 % | +10 % | 1040 | 210 | 3.5 | 72 % | 37 % | 0.64 | **-95.29 %** | -94.87 % | −95.5 % | 137/491/412 |
| veckovis | 20d | −3 % | +6 % | 1032 | 210 | 2.6 | 53 % | 36 % | 0.65 | **-85.82 %** | -88.01 % | −87.3 % | 225/611/196 |
| veckovis | 20d | −4 % | +8 % | 1032 | 210 | 3.1 | 64 % | 38 % | 0.66 | **-89.83 %** | -91.62 % | −91.6 % | 166/551/315 |
| veckovis | 20d | −5 % | +10 % | 1032 | 210 | 3.5 | 73 % | 39 % | 0.67 | **-92.03 %** | -93.07 % | −93.5 % | 127/473/432 |
| veckovis | 60d | −3 % | +6 % | 1000 | 210 | 2.8 | 59 % | 39 % | 0.76 | **-67.30 %** | -73.96 % | −71.3 % | 246/550/204 |
| veckovis | 60d | −4 % | +8 % | 1000 | 210 | 3.4 | 71 % | 40 % | 0.77 | **-76.02 %** | -78.62 % | −80.3 % | 174/483/343 |
| veckovis | 60d | −5 % | +10 % | 1000 | 210 | 3.8 | 79 % | 42 % | 0.79 | **-75.48 %** | -77.75 % | −81.2 % | 127/405/468 |
| veckovis | 120d | −3 % | +6 % | 952 | 210 | 2.8 | 59 % | 38 % | 0.76 | **-72.18 %** | -72.90 % | −72.9 % | 224/535/193 |
| veckovis | 120d | −4 % | +8 % | 952 | 210 | 3.4 | 71 % | 40 % | 0.75 | **-78.16 %** | -78.72 % | −78.7 % | 151/461/340 |
| veckovis | 120d | −5 % | +10 % | 952 | 210 | 3.9 | 81 % | 42 % | 0.82 | **-72.29 %** | -71.10 % | −74.0 % | 117/374/461 |
| BEHÅLL | 10d | −3 % | +6 % | 825 | 167 | 3.2 | 53 % | 30 % | 0.62 | **-86.57 %** | -88.25 % | −87.8 % | 242/577/6 |
| BEHÅLL | 10d | −4 % | +8 % | 682 | 138 | 4.7 | 64 % | 29 % | 0.65 | **-87.54 %** | -88.11 % | −88.2 % | 193/478/11 |
| BEHÅLL | 10d | −5 % | +10 % | 571 | 115 | 6.3 | 72 % | 31 % | 0.72 | **-83.40 %** | -81.68 % | −86.9 % | 165/388/18 |
| BEHÅLL | 20d | −3 % | +6 % | 805 | 164 | 3.4 | 55 % | 31 % | 0.68 | **-77.96 %** | -82.12 % | −79.0 % | 252/548/5 |
| BEHÅLL | 20d | −4 % | +8 % | 656 | 134 | 5.0 | 66 % | 32 % | 0.72 | **-72.69 %** | -78.96 % | −75.8 % | 202/441/13 |
| BEHÅLL | 20d | −5 % | +10 % | 567 | 116 | 6.3 | 72 % | 31 % | 0.73 | **-76.29 %** | -79.59 % | −78.8 % | 169/380/18 |
| BEHÅLL | 60d | −3 % | +6 % | 765 | 161 | 3.6 | 58 % | 34 % | 0.77 | **-56.51 %** | -68.03 % | −64.9 % | 260/500/5 |
| BEHÅLL | 60d | −4 % | +8 % | 633 | 133 | 5.2 | 69 % | 35 % | 0.83 | **-50.20 %** | -59.48 % | −59.6 % | 214/409/10 |
| BEHÅLL | 60d | −5 % | +10 % | 515 | 108 | 7.0 | 76 % | 36 % | 0.87 | **-42.15 %** | -52.16 % | −56.5 % | 169/325/21 |
| BEHÅLL | 120d | −3 % | +6 % | 747 | 165 | 3.5 | 57 % | 32 % | 0.74 | **-68.62 %** | -72.16 % | −69.6 % | 239/503/5 |
| BEHÅLL | 120d | −4 % | +8 % | 606 | 134 | 5.1 | 68 % | 33 % | 0.80 | **-60.37 %** | -64.49 % | −63.3 % | 198/402/6 |
| BEHÅLL | 120d | −5 % | +10 % | 503 | 111 | 6.9 | 76 % | 35 % | 0.89 | **-41.24 %** | -46.80 % | −55.1 % | 169/323/11 |

**Hållregelns effekt, cell för cell:**

| Cell | PF veckovis → BEHÅLL | Equity % veckovis → BEHÅLL | Affärer/år veckovis → BEHÅLL |
|---|---|---|---|
| 10d −3/+6 % | 0.57 → **0.62** | -92.99 → **-86.57** | 210 → **167** |
| 10d −4/+8 % | 0.61 → **0.65** | -94.68 → **-87.54** | 210 → **138** |
| 10d −5/+10 % | 0.64 → **0.72** | -95.29 → **-83.40** | 210 → **115** |
| 20d −3/+6 % | 0.65 → **0.68** | -85.82 → **-77.96** | 210 → **164** |
| 20d −4/+8 % | 0.66 → **0.72** | -89.83 → **-72.69** | 210 → **134** |
| 20d −5/+10 % | 0.67 → **0.73** | -92.03 → **-76.29** | 210 → **116** |
| 60d −3/+6 % | 0.76 → **0.77** | -67.30 → **-56.51** | 210 → **161** |
| 60d −4/+8 % | 0.77 → **0.83** | -76.02 → **-50.20** | 210 → **133** |
| 60d −5/+10 % | 0.79 → **0.87** | -75.48 → **-42.15** | 210 → **108** |
| 120d −3/+6 % | 0.76 → **0.74** | -72.18 → **-68.62** | 210 → **165** |
| 120d −4/+8 % | 0.75 → **0.80** | -78.16 → **-60.37** | 210 → **134** |
| 120d −5/+10 % | 0.82 → **0.89** | -72.29 → **-41.24** | 210 → **111** |

## 2. Lookback-fönstret (mätfel 2)

Gamla gridet testade bara 10 och 20 dagar. Två till fyra veckors momentum är kortsiktig REVERSAL-horisont – att köpa topp N på det fönstret ligger nära att köpa det mest överköpta. Klassisk momentum mäts på 6–12 månader, ofta med den senaste månaden bortskippad.

| Lookback | Skip | Affärer/år | Investerad | Träff % | PF | Equity % | Max DD |
|---|---|---|---|---|---|---|---|
| 10d | 0d | 138 | 64 % | 29 % | 0.65 | **-87.54 %** | −88.2 % |
| 20d | 0d | 134 | 66 % | 32 % | 0.72 | **-72.69 %** | −75.8 % |
| 60d | 0d | 133 | 69 % | 35 % | 0.83 | **-50.20 %** | −59.6 % |
| 120d | 0d | 134 | 68 % | 33 % | 0.80 | **-60.37 %** | −63.3 % |
| 60d | 20d | 137 | 67 % | 35 % | 0.85 | **-56.42 %** | −69.3 % |
| 120d | 20d | 130 | 69 % | 35 % | 0.86 | **-47.97 %** | −64.5 % |

## 3. Indexsleeven (mätfel 1)

Böckerna parkerar oallokerat kapital i en indexsleeve. Den gamla kedjningen gav tom tid värdet noll, vilket systematiskt underskattade böckerna. Skillnaden mellan raderna nedan ÄR storleken på det gamla mätfelet.

| Sleeve | Investerad i aktier | Equity % | Max DD |
|---|---|---|---|
| av (gammalt mätsätt) | 66 % | -79.12 % | −81.6 % |
| **på (så böckerna handlas)** | 66 % | **-72.69 %** | −75.8 % |

Kapitalet stod ledigt 34 % av tiden, fördelat på 832 dagar. Låg den lediga tiden JÄMNT fördelad över perioden skulle sleeven gett **+11.37 %** (^OMX totalt +37.27 % upphöjt till andelen ledig tid). Den gav **+32.12 %**.

Den lediga tiden låg ungefär jämnt fördelad, så sleeven lyfter resultatet i proportion till andelen ledigt kapital.
*(^OMX oviktat över samma dagar: +25.62 % – varje ledig dag räknad lika, oavsett hur många platser som stod tomma. Jämför inte det talet direkt med bidraget ovan.)*

## 4. Hålltid och regimfilter (mätfel 5 och 6)

| Variant | Affärer/år | Investerad | PF | Equity % | Max DD |
|---|---|---|---|---|---|
| horisont 20 dgr | 140 | 65 % | 0.72 | -74.96 % | −78.5 % |
| horisont 30 dgr | 134 | 66 % | 0.72 | -72.69 % | −75.8 % |
| horisont 60 dgr | 130 | 67 % | 0.72 | -71.49 % | −75.5 % |
| horisont 90 dgr | 130 | 67 % | 0.72 | -71.99 % | −75.5 % |
| regimfilter av | 134 | 66 % | 0.72 | -72.69 % | −75.8 % |
| regimfilter MA100 | 90 | 45 % | 0.77 | -44.70 % | −57.8 % |
| regimfilter MA200 | 102 | 50 % | 0.71 | -58.38 % | −65.9 % |

## 5. Out-of-sample (mätfel 3)

Perioden delas vid **2024-01-26**. Bästa cellen väljs på första halvan och mäts på andra, mot medianen av alla 24 celler i samma halva. Slår den inte medianen är "bästa cell" urvalsbrus, och nivåbanden i prompterna vilar på ingenting.

| | Period | Benchmark | Vald cell | Median av alla celler |
|---|---|---|---|---|
| In-sample | 2021-11-01 → 2024-01-26 | -0.42 % | -12.92 % | -51.90 % |
| **Out-of-sample** | 2024-01-26 → 2026-08-03 | +37.85 % | **-30.98 %** | -50.91 % |

Vald cell: **BEHÅLL 60d −5/+10 %**.
Cellen håller sig över medianen out-of-sample – valet bär åtminstone svagt.

**Håller nivåbandet i båda halvorna?**

| Läge | Lookback | Bästa nivå halva 1 | Bästa nivå halva 2 | Bästa nivå hela perioden | Samma? |
|---|---|---|---|---|---|
| veckovis | 10d | −3/+6 % | −3/+6 % | −3/+6 % | ja |
| veckovis | 20d | −3/+6 % | −3/+6 % | −3/+6 % | ja |
| veckovis | 60d | −5/+10 % | −3/+6 % | −3/+6 % | **nej** |
| veckovis | 120d | −5/+10 % | −5/+10 % | −3/+6 % | ja |
| BEHÅLL | 10d | −5/+10 % | −5/+10 % | −5/+10 % | ja |
| BEHÅLL | 20d | −5/+10 % | −4/+8 % | −4/+8 % | **nej** |
| BEHÅLL | 60d | −5/+10 % | −5/+10 % | −5/+10 % | ja |
| BEHÅLL | 120d | −5/+10 % | −5/+10 % | −5/+10 % | ja |

Samma nivå vinner i båda halvorna i **6 av 8** kombinationer. Nivåbandet är åtminstone svagt stabilt – men rangordningen inom bandet är fortfarande brus.

## 6. Kostnadsmodell – nivå per symbol

Rundturskostnaden är **inte** ett enda tal i den här körningen. Den härleds ur varje symbols **medianomsättning per dag** (kurs × volym, median över perioden, normaliserad till SEK med fasta valutafaktorer). Median och inte medel: en enda rapportdag med tiodubbel volym ska inte få ett illikvitt bolag att framstå som likvidt.

| Nivå (rundtur) | Gräns (median MSEK/dag) | Antal symboler | Symboler |
|---|---|---|---|
| 0.25 % | ≥ 20.0 | 107 | AAK.ST, ABB.ST, ADDT-B.ST, AKER.OL, AKRBP.OL, AKSO.OL, ALFA.ST, ALIV-SDB.ST, ALLEI.ST, ASSA-B.ST, ATCO-A.ST, ATCO-B.ST, AXFO.ST, AZN.ST, BALD-B.ST, BAVA.CO, BEIJ-B.ST, BIOA-B.ST, BOL.ST, BONEX.ST, BWLPG.OL, CARL-B.CO, CAST.ST, CLAS-B.ST, COLO-B.CO, DEMANT.CO, DNB.OL, DOM.ST, DSV.CO, ELK.OL, ELUX-B.ST, EMBRAC-B.ST, EPI-A.ST, EPI-B.ST, EQNR.OL, EQT.ST, ERIC-B.ST, ESSITY-B.ST, EVO.ST, FABG.ST, FORTUM.HE, FRO.OL, GETI-B.ST, GMAB.CO, HAFNI.OL, HEM.ST, HEXA-B.ST, HM-B.ST, HUSQ-B.ST, INDT.ST, INVE-B.ST, JM.ST, KINV-B.ST, KNEBV.HE, KOG.OL, LAGR-B.ST, LATO-B.ST, LIFCO-B.ST, MAERSK-B.CO, MIPS.ST, MOWI.OL, MYCR.ST, NCC-B.ST, NDA-SE.ST, NESTE.HE, NETC.CO, NHY.OL, NIBE-B.ST, NOKIA.HE, NOVO-B.CO, ORK.OL, ORNBV.HE, ORSTED.CO, PEAB-B.ST, QTCOM.HE, ROCK-B.CO, SAAB-B.ST, SAGA-B.ST, SALM.OL, SAMPO.HE, SAND.ST, SBB-B.ST, SCA-B.ST, SEB-A.ST, SHB-A.ST, SINCH.ST, SKA-B.ST, SKF-B.ST, STERV.HE, SUBC.OL, SWEC-B.ST, SWED-A.ST, TEL.OL, TEL2-B.ST, TELIA.ST, THULE.ST, TREL-B.ST, TRUE-B.ST, TRYG.CO, UPM.HE, VOLCAR-B.ST, VOLV-B.ST, VWS.CO, WRT1V.HE, XVIVO.ST, YAR.OL, ZEAL.CO |
| 0.75 % | ≥ 3.0 | 29 | ARJO-B.ST, BEIA-B.ST, BOOZT.ST, BUFAB.ST, CINT.ST, HANZA.ST, HARVIA.HE, HNSA.ST, INSTAL.ST, IVSO.ST, KAR.ST, LIAB.ST, NCAB.ST, NEL.OL, NEWA-B.ST, NOLA-B.ST, NOTE.ST, PDX.ST, RATO-B.ST, REG1V.HE, RVRC.ST, SCST.ST, SDIP-B.ST, SF.ST, SYSR.ST, TOKMAN.HE, VIMIAN.ST, VITR.ST, VPLAY-B.ST |
| 1.5 % | ≥ 0.0 | 17 | BALCO.ST, BIOT.ST, CRAD-B.ST, CTM.ST, DOMETIC.ST, EOLU-B.ST, G5EN.ST, GARO.ST, ICA.ST, ISOFOL.ST, MORLD.OL, NIVI-B.ST, OSSD.ST, SEDANA.ST, STAR-B.ST, STIL.ST, TOBII.ST |

**3 symboler saknar volymdata** och har medvetet placerats i den DYRASTE nivån (BIOT.ST, DOMETIC.ST, ICA.ST) – att gissa billigt på det vi inte kan mäta är precis det fel modellen finns för att undvika.

> ⚠️ **Nivåerna är en schablon, inte uppmätt spread.** De är satta i `config/kostnader.json` efter vad en privat nätmäklarkund typiskt betalar i courtage plus observerad spread i respektive likviditetsklass. Verklig spread i ett illikvitt bolag varierar kraftigt över tid och är värst exakt när man vill ut. Läs därför resultatet för det breda universumet som ett TAK för vad det kan ge, inte som en prognos.

**Tolkning:** equity % över benchmark med rimlig max DD ⇒ skelettet bär sin egen vikt; under ⇒ LLM-urvalet måste tillföra hela edgen. Jämför cellerna mot varandra snarare än absoluttalen (momentum-proxyn är trubbigare än case-urvalet). **Skiljer sig rangordningen mellan lägena är nivåbanden en artefakt av hållregeln, inte en egenskap hos marknaden.** Väg alltid in survivorship-varningen överst.

*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
