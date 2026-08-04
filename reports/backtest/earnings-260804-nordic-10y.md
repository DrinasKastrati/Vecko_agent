# Backtest: rapporthandel (nordic, 10y)

**Körd:** 2026-08-04 20:16 UTC · **Universum:** `config/backtest_universe_nordic.txt` (30 symboler) · **Benchmark:** ^OMX

**Frågan:** ska boken köpa INFÖR en rapport (på förväntningar) eller EFTER en bekräftad överraskning (post-earnings drift)?

> ⚠️ **Rapportdagarna är en PROXY.** Yahoo levererar inga historiska rapportdatum (`events=earnings` ger null, `earningsHistory` räcker fyra kvartal). En rapportdag detekteras därför ur pris och volym. Proxyn missar rapporter som inte rörde kursen och fångar ibland en icke-rapport (M&A, vinstvarning, sektorchock). Läs tabellen som en rangordning, inte som en prognos.

> ⚠️ **TVÅ HÄNDELSEMÄNGDER – nödvändigt, inte pedantiskt.** En mängd som betingar på gapets STORLEK ger PRE-armen look-ahead: den får credit för att veta hur stor rörelsen blev innan den köper. Effekten är mätbar och stor – höjs gap-tröskeln från 4 % till 6 % går PRE_ALL från +0,1 % till +1,3 % utan att strategin ändrats. Därför:
>
> - **SET_GAP** (gap ≥ 4 % · volym ≥ 1.5× median · 40 dagars lucka) → **bara PEAD-armarna**. De köper efter att gapet observerats, så villkoret är legitimt för dem.
> - **SET_VOL** (inget gapvillkor · volym ≥ 2.5× median · 40 dagars lucka) → **bara PRE-armarna**. Riktningsblind: volymspiken säger att något hände, inte åt vilket håll.

> ⚠️ **Survivorship bias:** universumfilerna är dagens mest likvida namn. Bolag som kraschade ur listan saknas, vilket gör ALLA armar för bra – särskilt PRE-armarna, vars vänstersvans är den som saknas.

## 1. Armarna

| Arm | Vad den gör |
|---|---|
| **PRE_ALL** | Köp stängning dagen före reaktionsdagen, sälj stängning på reaktionsdagen. Ingen riktningsgissning. |
| **PRE_MOM** | Samma, men bara när aktien trendar upp (20d momentum > 0) in i rapporten. Hypotesen "det gick att läsa av i förväg" uttryckt mekaniskt. |
| **PEAD_D0** | Köp reaktionsdagens ÖPPNING efter ett bekräftat positivt gap. Optimistiskt – kräver att man hinner agera samma dag. |
| **PEAD_D0C** | Köp reaktionsdagens STÄNGNING efter ett bekräftat positivt gap. Strikt exekverbart: intradag-monitorn kör varje timme under börstid. |
| **PEAD_D1** | Köp öppningen DAGEN EFTER reaktionsdagen. Konservativt golv – vad boken kan göra helt utan intradag-mekanik. |

PEAD-armarna använder promptens `earnings`-nivåer: stop −5.5 %, mål +16 %, horisont 25 handelsdagar. Kostnad per symbol ur `config/kostnader.json`. Alla tal är NETTO.

## 2. Hela perioden

Detekterade händelser: **233** i SET_GAP (PEAD-armarna) · **580** i SET_VOL (PRE-armarna).

| Arm | n | Medel | Median | Träff | PF | Alpha | Sämsta decil | Andel ≤ −10 % |
|---|---|---|---|---|---|---|---|---|
| PRE_ALL | 580 | -0.6 % | -0.5 % | 46 % | 0.76 | -0.7 % | -10.3 % | 4 % |
| PRE_MOM | 371 | -0.1 % | -0.1 % | 50 % | 0.97 | -0.3 % | -10.2 % | 4 % |
| PEAD_D0 | 125 | +1.6 % | -1.4 % | 45 % | 1.62 | +2.2 % | -5.8 % | 0 % |
| PEAD_D0C | 125 | +1.2 % | -1.9 % | 47 % | 1.43 | +1.2 % | -6.1 % | 0 % |
| PEAD_D1 | 125 | +0.6 % | -2.3 % | 42 % | 1.21 | +0.6 % | -6.1 % | 0 % |

**Sämsta decil** = medelutfallet i de 10 % värsta affärerna. **Andel ≤ −10 %** = hur ofta en enskild position tappar mer än en tiondel. Båda kolumnerna finns för hävstångsfrågan: en arm med tjock vänstersvans tål ingen belåning oavsett medelvärde.

## 3. Out-of-sample (perioden delad på mitten)

Brytdatum: **2021-08-04**. En arm som bara fungerar i en halva är brus.

| Arm | Halva A (n) | Halva A medel | Halva B (n) | Halva B medel | Samma tecken? |
|---|---|---|---|---|---|
| PRE_ALL | 228 | -0.1 % | 352 | -0.9 % | ja (−/−) |
| PRE_MOM | 154 | +0.2 % | 217 | -0.3 % | **NEJ** |
| PEAD_D0 | 60 | +0.9 % | 65 | +2.3 % | **JA (+/+)** |
| PEAD_D0C | 60 | +1.2 % | 65 | +1.2 % | **JA (+/+)** |
| PEAD_D1 | 60 | +0.9 % | 65 | +0.4 % | **JA (+/+)** |

## 4. Känslighet mot detektionströsklarna

Varje arm svepas över tröskeln i SIN egen händelsemängd. Att svepa PRE över gap-tröskeln vore att svepa över just den look-ahead armen inte får ha – därför två tabeller.

**PEAD-armarna över gap-tröskeln (SET_GAP):**

| Gap-tröskel | Händelser | PEAD_D0 medel | PEAD_D0C medel | PEAD_D1 medel |
|---|---|---|---|---|
| ≥ 3 % | 355 | +0.7 % | +0.3 % | +0.1 % |
| ≥ 4 % | 233 | +1.6 % | +1.2 % | +0.6 % |
| ≥ 6 % | 113 | +1.8 % | +1.7 % | +0.6 % |

**PRE-armarna över volym-tröskeln (SET_VOL, inget gapvillkor):**

| Volym-tröskel | Händelser | PRE_ALL medel | PRE_MOM medel |
|---|---|---|---|
| ≥ 2.0× | 793 | -0.3 % | -0.0 % |
| ≥ 2.5× | 580 | -0.6 % | -0.1 % |
| ≥ 3.5× | 321 | -0.8 % | -0.2 % |

## 5. Latenskostnaden

Ett dygns fördröjning kostar **+1.0 procentenheter** per affär (PEAD_D0 +1.6 % → PEAD_D1 +0.6 %). Det är priset för att routinen kör före marknadens öppning och bara har föregående stängning verifierad. Skillnaden är liten nog att fördröjningen inte i sig underkänner armen.

## 6. Regimfiltrets bidrag

Huvudtabellerna ovan är körda MED regimfiltret på (benchmark > MA200), eftersom böckerna inte får öppna positioner när det är av. Tabellen nedan visar samma armar utan filtret – skillnaden är filtrets bidrag, inte en alternativ strategi.

| Arm | Med filter (n) | Med filter medel | Utan filter (n) | Utan filter medel | Bidrag |
|---|---|---|---|---|---|
| PRE_ALL | 580 | -0.6 % | 919 | -0.8 % | +0.2 pp |
| PRE_MOM | 371 | -0.1 % | 525 | -0.3 % | +0.2 pp |
| PEAD_D0 | 125 | +1.6 % | 188 | +1.1 % | +0.5 pp |
| PEAD_D0C | 125 | +1.2 % | 188 | +1.2 % | -0.0 pp |
| PEAD_D1 | 125 | +0.6 % | 188 | +0.7 % | -0.1 pp |

## 7. Slutsats

- **PRE_ALL: UNDERKÄND** (halva A -0.1 % < 0.5 % · halva B -0.9 % < 0.5 % · alpha -0.7 % ≤ 0) · hela perioden -0.6 % medel, median -0.5 %, alpha -0.7 %, träff 46 %, sämsta decil -10.3 %, andel ≤ −10 %: 4 %
- **PRE_MOM: UNDERKÄND** (halva A +0.2 % < 0.5 % · halva B -0.3 % < 0.5 % · alpha -0.3 % ≤ 0) · hela perioden -0.1 % medel, median -0.1 %, alpha -0.3 %, träff 50 %, sämsta decil -10.2 %, andel ≤ −10 %: 4 %
- **PEAD_D0: GODKÄND** · hela perioden +1.6 % medel, median -1.4 %, alpha +2.2 %, träff 45 %, sämsta decil -5.8 %, andel ≤ −10 %: 0 %
- **PEAD_D0C: GODKÄND** · hela perioden +1.2 % medel, median -1.9 %, alpha +1.2 %, träff 47 %, sämsta decil -6.1 %, andel ≤ −10 %: 0 %
- **PEAD_D1: UNDERKÄND** (halva B +0.4 % < 0.5 %) · hela perioden +0.6 % medel, median -2.3 %, alpha +0.6 %, träff 42 %, sämsta decil -6.1 %, andel ≤ −10 %: 0 %

**Kravet är satt i förväg** och har fyra led: (1) ≥ 0.5 % medel i halva A, (2) ≥ 0.5 % medel i halva B, (3) positiv alpha över hela perioden, (4) överlever känslighetssvepet i sin egen händelsemängd. Ledet om 0.5 % finns för att ett medelvärde som inte täcker rundturskostnaden inte är en edge – ett rent `> 0`-krav släppte igenom +0,04 % på avrundning i den första körningen.

**Om medianen är negativ men medelvärdet positivt** är utfallet höger-snedvridet: många små förluster (stoppen) och några få stora vinster (målet). Det är en fungerande men psykologiskt krävande profil – regeln får inte överges efter tre förlorare i rad, för det är så den ser ut när den fungerar. Skriv in det i prompten, annars avvecklas regeln av den som läser rapporten.

*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
