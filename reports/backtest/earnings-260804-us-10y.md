# Backtest: rapporthandel (us, 10y)

**Körd:** 2026-08-04 20:15 UTC · **Universum:** `config/backtest_universe_us.txt` (30 symboler) · **Benchmark:** ^GSPC

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

Detekterade händelser: **404** i SET_GAP (PEAD-armarna) · **645** i SET_VOL (PRE-armarna).

| Arm | n | Medel | Median | Träff | PF | Alpha | Sämsta decil | Andel ≤ −10 % |
|---|---|---|---|---|---|---|---|---|
| PRE_ALL | 645 | +0.3 % | -0.6 % | 44 % | 1.15 | +0.3 % | -9.8 % | 3 % |
| PRE_MOM | 430 | +0.2 % | -0.7 % | 43 % | 1.08 | +0.1 % | -10.1 % | 4 % |
| PEAD_D0 | 245 | +0.7 % | -6.2 % | 41 % | 1.19 | +0.6 % | -7.6 % | 1 % |
| PEAD_D0C | 245 | +0.8 % | -3.0 % | 42 % | 1.25 | +0.0 % | -7.7 % | 2 % |
| PEAD_D1 | 243 | +0.3 % | -6.2 % | 39 % | 1.08 | -0.2 % | -8.3 % | 2 % |

**Sämsta decil** = medelutfallet i de 10 % värsta affärerna. **Andel ≤ −10 %** = hur ofta en enskild position tappar mer än en tiondel. Båda kolumnerna finns för hävstångsfrågan: en arm med tjock vänstersvans tål ingen belåning oavsett medelvärde.

## 3. Out-of-sample (perioden delad på mitten)

Brytdatum: **2021-09-13**. En arm som bara fungerar i en halva är brus.

| Arm | Halva A (n) | Halva A medel | Halva B (n) | Halva B medel | Samma tecken? |
|---|---|---|---|---|---|
| PRE_ALL | 314 | +0.1 % | 331 | +0.6 % | **JA (+/+)** |
| PRE_MOM | 222 | -0.3 % | 208 | +0.7 % | **NEJ** |
| PEAD_D0 | 108 | -0.4 % | 137 | +1.5 % | **NEJ** |
| PEAD_D0C | 108 | +0.3 % | 137 | +1.2 % | **JA (+/+)** |
| PEAD_D1 | 108 | -0.6 % | 135 | +1.0 % | **NEJ** |

## 4. Känslighet mot detektionströsklarna

Varje arm svepas över tröskeln i SIN egen händelsemängd. Att svepa PRE över gap-tröskeln vore att svepa över just den look-ahead armen inte får ha – därför två tabeller.

**PEAD-armarna över gap-tröskeln (SET_GAP):**

| Gap-tröskel | Händelser | PEAD_D0 medel | PEAD_D0C medel | PEAD_D1 medel |
|---|---|---|---|---|
| ≥ 3 % | 532 | +0.9 % | +0.9 % | +0.6 % |
| ≥ 4 % | 404 | +0.7 % | +0.8 % | +0.3 % |
| ≥ 6 % | 264 | +1.5 % | +1.3 % | +1.1 % |

**PRE-armarna över volym-tröskeln (SET_VOL, inget gapvillkor):**

| Volym-tröskel | Händelser | PRE_ALL medel | PRE_MOM medel |
|---|---|---|---|
| ≥ 2.0× | 835 | -0.3 % | -0.2 % |
| ≥ 2.5× | 645 | +0.3 % | +0.2 % |
| ≥ 3.5× | 313 | +0.2 % | +0.6 % |

## 5. Latenskostnaden

Ett dygns fördröjning kostar **+0.4 procentenheter** per affär (PEAD_D0 +0.7 % → PEAD_D1 +0.3 %). Det är priset för att routinen kör före marknadens öppning och bara har föregående stängning verifierad. Skillnaden är liten nog att fördröjningen inte i sig underkänner armen.

## 6. Regimfiltrets bidrag

Huvudtabellerna ovan är körda MED regimfiltret på (benchmark > MA200), eftersom böckerna inte får öppna positioner när det är av. Tabellen nedan visar samma armar utan filtret – skillnaden är filtrets bidrag, inte en alternativ strategi.

| Arm | Med filter (n) | Med filter medel | Utan filter (n) | Utan filter medel | Bidrag |
|---|---|---|---|---|---|
| PRE_ALL | 645 | +0.3 % | 862 | -0.1 % | +0.5 pp |
| PRE_MOM | 430 | +0.2 % | 531 | -0.0 % | +0.2 pp |
| PEAD_D0 | 245 | +0.7 % | 317 | +1.1 % | -0.4 pp |
| PEAD_D0C | 245 | +0.8 % | 317 | +1.0 % | -0.2 pp |
| PEAD_D1 | 243 | +0.3 % | 315 | +0.4 % | -0.1 pp |

## 7. Slutsats

- **PRE_ALL: UNDERKÄND** (halva A +0.1 % < 0.5 %) · hela perioden +0.3 % medel, median -0.6 %, alpha +0.3 %, träff 44 %, sämsta decil -9.8 %, andel ≤ −10 %: 3 %
- **PRE_MOM: UNDERKÄND** (halva A -0.3 % < 0.5 %) · hela perioden +0.2 % medel, median -0.7 %, alpha +0.1 %, träff 43 %, sämsta decil -10.1 %, andel ≤ −10 %: 4 %
- **PEAD_D0: UNDERKÄND** (halva A -0.4 % < 0.5 %) · hela perioden +0.7 % medel, median -6.2 %, alpha +0.6 %, träff 41 %, sämsta decil -7.6 %, andel ≤ −10 %: 1 %
- **PEAD_D0C: UNDERKÄND** (halva A +0.3 % < 0.5 %) · hela perioden +0.8 % medel, median -3.0 %, alpha +0.0 %, träff 42 %, sämsta decil -7.7 %, andel ≤ −10 %: 2 %
- **PEAD_D1: UNDERKÄND** (halva A -0.6 % < 0.5 % · alpha -0.2 % ≤ 0) · hela perioden +0.3 % medel, median -6.2 %, alpha -0.2 %, träff 39 %, sämsta decil -8.3 %, andel ≤ −10 %: 2 %

**Kravet är satt i förväg** och har fyra led: (1) ≥ 0.5 % medel i halva A, (2) ≥ 0.5 % medel i halva B, (3) positiv alpha över hela perioden, (4) överlever känslighetssvepet i sin egen händelsemängd. Ledet om 0.5 % finns för att ett medelvärde som inte täcker rundturskostnaden inte är en edge – ett rent `> 0`-krav släppte igenom +0,04 % på avrundning i den första körningen.

**Om medianen är negativ men medelvärdet positivt** är utfallet höger-snedvridet: många små förluster (stoppen) och några få stora vinster (målet). Det är en fungerande men psykologiskt krävande profil – regeln får inte överges efter tre förlorare i rad, för det är så den ser ut när den fungerar. Skriv in det i prompten, annars avvecklas regeln av den som läser rapporten.

*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
