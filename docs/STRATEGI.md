# Strategin i Vecko_agent — komplett beskrivning för extern granskning

**Version:** 2026-08-26 · **Ägare:** Dren · **Status:** skarp drift med riktiga pengar sedan 2026-08-10.

Detta dokument är SJÄLVBÄRANDE: det ska gå att läsa och granska utan tillgång till repot.
Det beskriver vad strategin gör, varför varje regel finns, vad som är MÄTT och vad som bara är
antaget. Siffror kommer ur egna backtest (motorn ombyggd 2026-08-02) om inget annat sägs.

Allt systemet producerar är automatiserat beslutsstöd, inte finansiell rådgivning.

---

## 1. Sammanfattning i en mening

Två separata, veckovis roterade swingtrade-böcker (Norden i SEK, USA i USD) som var för sig
håller **upp till 4 katalysatordrivna aktier à ~25 %** plus en **indexsleeve** som bär allt
oallokerat kapital, där varje köp måste passera fem hårda grindar och en marknadsregim-spärr,
och där **BEHÅLL är standardvalet** eftersom omsättning mätt är den största enskilda kostnaden.

---

## 2. Grundpremissen (viktigast att granska)

Backtestet visar att det **mekaniska skelettet inte slår index** i någon konfiguration som
replikerar out-of-sample. Slutsatsen som dragits av det är inte "lägg ned" utan:

1. Oallokerat kapital ska ligga i **index, aldrig i kassa** — att stå utanför marknaden är en
   garanterad kostnad, inte en neutral position.
2. Frågan strategin försöker svara på blir därmed den rätta: **tillför det aktiva
   katalysatorurvalet något UTÖVER index?**
3. Om svaret är nej ska boken i praktiken konvergera mot indexsleeven — och det är ett
   godkänt utfall, inte ett fel.

**All mätinfrastruktur (avsnitt 8) finns för att besvara punkt 2.** Det är den centrala
hypotesen granskningen bör angripa.

---

## 3. Kapital, böcker och allokering

| | Nordiska boken | US-boken |
|---|---|---|
| Universum | Nasdaq Stockholm/Köpenhamn/Helsingfors, Oslo Børs, First North, Euronext Growth, Spotlight. Alla bolagsstorlekar | NYSE, NASDAQ, NYSE American/Arca. Alla bolagsstorlekar |
| Valuta | SEK | USD |
| Indexsleeve | `XACT-OMXS30.ST` | `SPY` |
| Benchmark | `^OMX` (OMXS30) | `^GSPC` (S&P 500) |
| Rundturskostnad | ~0,25 % (courtage) | ~0,75 % (0,25 % courtage + 0,5 % växlingspåslag) |
| Likviditetskrav | ≥ 3 MSEK snittomsättning/dag | ≥ 20 MUSD snittomsättning/dag |
| Körs | mån–fre 08:40 CEST (före Stockholm 09:00) | mån–fre 15:00 CEST (före NY 09:30 ET) |

- Böckerna är **helt separata**: egna innehav, egen kassa, egen historik, egen ackumulerad
  avkastning. Blandas aldrig — alpha över en SEK-affär mot OMXS30 och en USD-affär mot S&P 500
  är meningslöst.
- Krypto ingår **inte** i någon handlad bok (bara i en icke-handlad idé-scout).
- En separat veckoprompt sätter **kapitalvikten mellan böckerna** (`nordic` + `us` = 1,0), inom
  bandet **0,2–0,8 per bok**, standard 0,5/0,5, maximal förflyttning ~15 procentenheter per
  vecka. Sleeve-andelen i respektive bok används som conviction-mätare: en bok som till 75 %
  ligger i sleeven levererar indexavkastning och viktas ned.
- Böckerna räknar i **vikt-%, inte i belopp**. US-bokens avkastning är i USD och alltså
  **exklusive USD/SEK-effekten**.

---

## 4. Portföljkonstruktion

- **Standard: 4 aktier à 25 %** + indexsleeve som fyller upp till 100 %.
- **Platt 25 % per aktie — conviction-bandet 15–35 % togs bort 2026-08-08.** Poängen styrde
  tidigare både urval och kapitalrisk; eftersom vikterna är antagna och okalibrerade förstärkte
  en obevisad signal sin egen osäkerhet. Poängen loggas fortsatt och styr urval/rangordning,
  aldrig vikt. Platt 25 % är också nollmodellen som framtida volatilitetsjusterad sizing mäts mot.
- **Färre än 4 godkända case är helt OK** — tomma platser går till sleeven. Ett case får aldrig
  tvingas fram för att fylla en plats. Noll affärer en vecka är ett korrekt utfall.
- Kassa (0 %) tillåts bara om sleeven inte kan handlas.

**Varför 4 och inte 2** (tidigare uppsättning): 4 à 25 % slår 2 à 50 % i **varje cell** i
backtest-gridet — profit factor upp, förlustutfall ungefär halverat, max drawdown ned
~15 procentenheter. Dessutom fördubblas datainsamlingstakten, vilket avgör hur snabbt
poängmodellen kan kalibreras. Courtaget är procentuellt, så fler positioner kostar inte mer
per krona.

---

## 5. Beslutscykeln

Sex schemalagda körningar (tider i CEST):

| Körning | När | Vad den gör |
|---|---|---|
| Scout USA & krypto | dagligen 07:47 | Marknadsöversikt + 2–3 nya case. Handlar inte. Skriver kandidater till en formell kandidatkö |
| Nordisk rotation | mån–fre 08:40 | LÄGE A på måndag (full rotation), LÄGE B övriga dagar |
| US-rotation | mån–fre 15:00 | Samma tvålägesmodell, egen bok |
| Kapitalallokering | måndag 15:30 | Splitten mellan böckerna (efter båda veckorotationerna) |
| Miss-retro | lördag 10:00 | Letar missar, skriver processlärdomar. Har komplett facit då fredagens US-stängning finns |
| Intradag-monitor | varje timme under börstid | LLM-fri aritmetik: jämför kurs + dagshögsta/dagslägsta mot stop/mål/entry, larmar vid korsning |

**LÄGE A (måndag, full rotation)**
1. Facit: färsk kurs per innehav, utfall sedan entry, har stop/mål träffats?
2. Lärdomar från de fyra senaste veckorapporterna + retro-destillatet.
3. Bred scanning → bruttolista **10–15 kandidater**, varav minst **5 ur nyhetsflödet**
   (pressmeddelande-RSS: MFN, GlobeNewswire, PR Newswire, SEC 8-K, Fed) innan egen scanning.
   Källkrav för rykten: etablerade finansmedier med initierade källor. X/Twitter, Reddit,
   forum och anonyma bloggar ignoreras helt.
4. Teknisk filtrering, poängsättning, urval av upp till 4 (avsnitt 6).
5. Rapport med komplett handelsplan per case + **3–5 bubblare** (veckans ersättarlista).
6. Max 2 bubblare får läggas som **villkorade pending-planer** med fullständiga nivåer;
   monitorn larmar när entry-nivån korsas. En plan som inte triggat inom 5 handelsdagar avförs.

**LÄGE B (övriga dagar, bevakning)**
- Ett beslut per innehav: **KÖP / SÄLJ / BEHÅLL** (eller **AVVAKTA** om kurs ej kan verifieras).
- Avgör alla nya poster i kandidatkön (avsnitt 7).
- Får lägga **en** villkorad bubblar-plan, men bara när saknad verifierad kurs var det enda
  skälet att den inte fick en plan på måndagen, och bara om sex villkor håller samtidigt.
- Systemet lägger **inga ordrar**. Endast KÖP/SÄLJ är åtgärdbart för människan; BEHÅLL/AVVAKTA
  notifieras aldrig.

---

## 6. Urvalsprocessen

### 6.1 Teknisk filtrering (på hela bruttolistan, med faktiska värden)
- RSI(14) helst 50–70. **> 75 kräver exceptionell katalysator**; < 40 endast turnaround med
  färsk katalysator.
- MACD(12,26,9): färskt bullish kors / stigande histogram är plus.
- Kurs över EMA20/EMA50, helst EMA20 > EMA50 > EMA200.
- Volym > 1,5× 20-dagarssnittet.
- Definiera närmaste **stöd** (bas för stop) och **motstånd** (bas för mål).
- Likviditetskrav enligt avsnitt 3 — annars stryks kandidaten.
- **Momentumhorisont:** aktiens rörelse över senaste **6 månaderna** (US: 3–6) väger positivt.
  En brant uppgång de senaste två veckorna **utan längre trend bakom sig är en VARNING, inte
  en styrka** — 10–20 dagars horisont är reversal, inte momentum.

### 6.2 Poängmodell (1–10 per dimension)
| Dimension | Vikt |
|---|---|
| Katalysator | 35 % |
| Teknisk setup | 30 % |
| Risk/Reward | 20 % |
| Makromedvind | 15 % |

Ytterligare urvalsregler: max 2 av 4 val får vara ryktesdrivna; undvik flera bolag med identisk
riskprofil (fyra positioner i samma sektor är en position); totalpoängen används som
signal för URVAL och RANGORDNING — sedan 2026-08-08 aldrig för vikten, som är fast 25 %.

**Vikterna är antagna, inte kalibrerade.** De kan inte kalibreras förrän beslutsstatistiken har
≥ 15 stängda SÄLJ-rader.

### 6.3 De fem grindarna (ALLA måste hålla)
1. **Verifierbar kurs** med källa + tidsstämpel.
2. **Namngiven katalysator senaste 5 handelsdagarna.**
3. **RSI ≤ 75** eller exceptionell katalysator.
4. **Målavstånd ≥ 6 % (nordiskt) / ≥ 8 % (US)** och ≤ nåbarhetstaket.
5. **Risk/Reward ≥ 2:1.**

Faller en kandidat loggas den med den **namngivna** grinden som skäl — inte i prosa.

---

## 7. Hårda spärrar (icke förhandlingsbara)

1. **KURSVERIFIERING.** Varje kurs kräver källa + tidsstämpel. Går det inte: "KURS EJ VERIFIERAD"
   och inget kursbaserat beslut den dagen. Kravet får **aldrig** sänkas — inte för att få fler
   affärer, inte av en lärdom, inte av en promotion. Lösningen på få affärer är bredare
   kandidatinflöde, inte lägre beviskrav. (Körmiljön är nätspärrad mot kurssajter; kurser hämtas
   därför av en separat, fri process och läses ur fil.)
2. **REGIMFILTER — hård spärr.** Ligger index (^OMX resp. ^GSPC) **på eller under sin MA200**
   öppnas **inga nya positioner**; tomma platser ligger i sleeven. Går MA200 inte att beräkna
   (< 200 punkter) behandlas regimen som **AV** — strängare riktning vid osäkerhet. Gäller
   **enbart nyöppning**; befintliga innehav sköts av sina stop/mål och regeln får aldrig
   användas som skäl att strunta i ett stop. **Samma fönster i båda böckerna.**
3. **KOSTNADSTRÖSKEL.** Entry → mål minst **6 %** nordiskt (≥ 20× rundturskostnaden) och **8 %**
   i US-boken (≥ 10× rundturskostnaden). Ett case med 3 % uppsida är efter kostnad inte värt en
   position, hur fin katalysatorn än är.
4. **R/R minst 2:1.** Oförändrat i varje rad.
5. **MÅLET MÅSTE VARA NÅBART.** Målavståndet i procent får vara högst
   **2 × aktiens genomsnittliga dagsrörelse × √(antal handelsdagar i horisonten)**.
   Är målet större: sänk målet, förläng horisonten, eller stryk caset. Ett mål taget ur ett
   analytikerintervall är ett påstående, inte en mätning.
6. **KÖP ALDRIG INFÖR EN RAPPORT.** Se avsnitt 9.4. Även: inget köp när en **bekräftad** binär
   händelse ligger inom 2 handelsdagar. Ett *gissat* rapportdatum räknas aldrig som bekräftat.
7. **STOP FÅR FLYTTAS UPP, ALDRIG NED.** Målkurs får bara höjas vid extraordinär ny katalysator,
   med motivering.
8. **Högst EN kandidat promotas per körning** (högst R/R vinner). Övriga avvisas med skäl —
   raderna är fortfarande värdefulla som kontrafaktiskt underlag.
9. **Lärdomar får skriva processregler, aldrig mjuka upp kursverifiering, stoppdisciplin eller
   riskregler.**

---

## 8. Nivåer och exit

### 8.1 Stoppbredden är en process, inte en nivå
Här stod tidigare först att −3 %/+6 % var "bevisat bäst", sedan att −4 %/+8 % var det. **Båda
påståendena var brus.** Out-of-sample-testet (femårsperioden delad på mitten, samma nivå måste
vinna i båda halvorna) håller i **1 av 8** kombinationer i nordiska boken. Vilken nivå som ser
bäst ut beror på vilken period som mäts.

Regeln är därför:
- Stop **3–5 % under entry**, satt **tekniskt** strax under närmaste stöd inom bandet.
- Målet **≥ 2× stoppavståndet**.
- Entry → mål **minst 6 % / 8 %** (kostnadströskeln binder ofta hårdare än bandet).
- Skriv aldrig i en rapport att en stoppnivå är "kalibrerad" eller "bevisat bäst".

### 8.2 Nivåer per katalysatortyp
| catalystType | Horisont | Målavstånd | Stop | Tidsstopp |
|---|---|---|---|---|
| `earnings`, `order`, `regulatory`, `buyback` | 3–6 veckor (post-earnings drift är långsam) | 12–15 % | 3–5 % | inget |
| `ma_rumor`, `insider`, `index` | 10–15 handelsdagar | 6–10 % (US: 10–12 %) | 3–5 % (US: 5–6 %) | **ja — avveckla efter 15 handelsdagar** om ryktet varken bekräftats eller dementerats |
| `macro`, `turnaround`, `other` | 2–4 veckor | 8–12 % | 3–5 % | inget |

### 8.3 Hållregeln — BEHÅLL är standardvalet
Backtestet kördes tidigare bara med en femdagarsklocka (boken byggdes om varje måndag).
**46 % av alla exits var klockan** — varken mål eller stop, alltså full rundturskostnad för noll
information. Med hållregeln faller omsättningen från **~205 till 66–117 affärer/år**, tidsexits
från 470–747 till 8–51, och utfallet förbättras i **samtliga tolv celler**. Max drawdown i bästa
cellen: −44,7 % → −17,8 %.

En position roteras ut **endast** om:
- (a) stop eller mål träffats,
- (b) tesen är punkterad (rykte dementerat, vinstvarning, negativt besked, makrohändelse),
- (c) katalysatorhorisonten löpt ut,
- (d) ett nytt case har **≥ 2 poäng högre** totalpoäng **och** platsen skulle annars stå tom.

Rotationen fyller lediga platser — den omprövar inte fungerande innehav. **Att en plats är
upptagen av ett fungerande innehav är i sig ett giltigt skäl att inte handla den veckan.**
Horisonten får vara längre än 30 dagar: hålltidssvepet ger −24,2 % vid 20 dagar, −18,9 % vid 30,
**−10,0 % vid 60** och −10,9 % vid 90. Kortare horisont är sämre i varje steg.

---

## 9. Vad backtestet faktiskt visar

Motorn byggdes om 2026-08-02 sedan sex mätfel hittats (sleeven räknades som noll, lookback
testades bara på 10–20 dagar, "bästa cell" valdes utan out-of-sample-test, survivorship
redovisades inte, regimfilter och hålltid varierades inte). Allt nedan kommer ur den ombyggda
motorn, netto efter kostnad, 5 år, topp 4 à 25 %.

### 9.1 Skelettet bär sig — men bara med lång momentumhorisont
- 120 dagars lookback + hållregeln: **+43,7 % mot ^OMX +36,3 %** (PF 1,13, max DD −17,8 %).
- 10–20 dagars lookback, samma nivåer: **−18,9 % till −34,1 %**.

### 9.2 Regimfiltret är den starkaste replikationen i hela materialet
| | Utan regim | Med MA200 | Max DD |
|---|---|---|---|
| Nordiskt | −20,2 % | **+21,7 %** | −41,4 % → −27,0 % |
| US | +42,1 % | **+70,2 %** (PF 1,17) | −29,3 % → −23,6 % |

Mätt halva för halva slår MA200 dagens uppsättning i **fyra av fyra** halvor/marknader.
Nordiskt är MA100 marginellt bättre på avkastning (+26,9 % mot +21,7 %) men sämre på drawdown,
och MA200 vinner med 24 procentenheter i US-boken — olika fönster per marknad är precis den
per-marknadstrimning som out-of-sample visat är brus.

**Vad regeln INTE gör:** den får inte skelettet att slå index (^GSPC +70,7 % köp-och-behåll över
samma period). Den gör det mindre dåligt och halverar ungefär nedgångarna. Den uppför sig som
en **försäkring**: nordiska MA200-varianten slår benchmark i den svaga halvan (+4,4 % mot
−0,4 %) och förlorar i den starka (−5,5 % mot +38,2 %). Exponeringen sjunker till ~58–65 %.

### 9.3 Kombinationstestet — ingen parameter fick ändras
De tre starkaste enskilda fynden (hållregeln + lookback 120d/skip 20 + regimfiltret) kördes
tillsammans, var och en mätt på båda halvorna mot samma halvas benchmark. Kravet sattes i
**förväg**: slå benchmark i **båda** halvorna. **Ingen kombination gjorde det, i någon marknad.**
Därför ändrades varken lookback, hålltid eller nivåband.

### 9.4 Köp inför rapport — mätt och underkänt
Fyra körningar (us/nordic × 5y/10y), fyra armar per rapporthändelse. **PRE_ALL** (köp dagen före
reaktionen) och **PRE_MOM** (samma, med momentumfilter) blev **underkända i samtliga fyra**:
negativ alpha i nordiska boken i båda halvorna (−0,7 % på 10 år), och 4–6 % av affärerna sämre
än −10 %. Att aktien trendar upp in i rapporten hjälper inte — det är precis vad PRE_MOM mäter.
Post-earnings drift (PEAD) mätte bättre men klarade inte kravet i båda marknaderna vid samma
period, och är därför **ingen egen köpregel**: en bekräftad rapportöverraskning är en vanlig
kandidat som ska passera samma fem grindar som allt annat.

Två mätfällor som dokumenterats och som gäller allt eventtestande här:
1. **Look-ahead via händelseurvalet.** Betingas händelsemängden på gapets STORLEK får en arm som
   köper före reaktionen credit för att veta hur stor rörelsen blev. Höjd tröskel 4 % → 6 %
   lyfte PRE_ALL från +0,1 % till +1,3 % utan att strategin ändrats. Därför två separata
   händelsemängder: en gapbetingad (bara för armar som köper efter observationen) och en
   riktningsblind (för armar som köper före).
2. **Materialitetskrav.** Ett rent `> 0`-krav släppte igenom +0,04 % på avrundning. Godkännande
   kräver ≥ 0,5 % medel i **båda** halvorna plus positiv alpha.

### 9.5 Universumsbredd — mätt, och den kollapsar
Tre universum över samma period: 30 large caps, 110 namn, 153 namn (+43 småbolag).
Medianen av alla 24 celler out-of-sample: **−1,4 % → −16,3 % → −50,9 %**. Bästa cellen:
+42,3 % → −1,0 % → −41,2 %. Hela gridet försämras, inte bara toppcellen. Orsaken är att
"topp 4 på efterföljande avkastning" blir en **sämre** regel ju fler namn den får — toppen av en
större fördelning är mer extrem och vänder tillbaka hårdare. En dekomponering delar tappet i
**~38 pp urval och ~22 pp kostnad**: billigare courtage räddar det inte.

Notera dock **vad testet mäter**: en momentum-proxy, inte det katalysatordrivna urvalet (som per
konstruktion avvisar RSI > 75 och alltså sorterar bort just de namn som fäller siffrorna). Bredd
är därmed inte motbevisad för den skarpa routinen — men bevisbördan ligger hos den som vill
bredda, och varje förslag måste komma med en urvalsregel som blir **strängare** när bredden ökar.

### 9.6 Survivorship
Backtestuniversumet är **dagens** mest likvida bolag. Avnoterade och krympta bolag saknas.
**Alla tal ovan är därför för bra, inte för dåliga.** Läs dem som ett tak.

---

## 10. Hur strategin mäts i skarp drift

Böckerna nollställdes 2026-08-06 inför skarp start 2026-08-10. Pappersperioden 2026-07-14 →
2026-08-06 (nordiskt +6,28 % / 2 affärer, US +0,89 % / 1 affär) ligger arkiverad och räknas
medvetet inte in.

1. **Beslutslogg (append-only).** Varje beslut loggas med ticker, action (KÖP/SÄLJ/BEHÅLL/
   AVVAKTA), kurs, katalysatortyp, horisont, entry/stop/mål/R/R/vikt och skäl. I LÄGE A loggas
   **hela bruttolistan** — varje kandidat som föll bort får en AVVAKTA-rad med den namngivna
   spärren. En kandidat vars kurs inte kunde verifieras loggas med `price: null` och får aldrig
   bli ett KÖP.
2. **Beslutsutvärdering.** Varje rad mäts mot efterföljande kurs **5 och 20 handelsdagar** framåt
   och mot bokens index över samma fönster — **inklusive de avvisade**. De avvisade är hela
   poängen: de är det kontrafaktiska underlaget. Går de systematiskt bättre än de köpta är
   urvalsfiltret för strängt. Två regler: ett **omoget** beslut räknas aldrig som noll (det drar
   medelvärden mot mitten — det utelämnas), och **inget uttalande under 8 mätpunkter** (fältet
   skriver "otillräckligt" + hur många rader som fattas).
   Varför detta finns: stängda affärer växer med ~1/månad, beslutsrader med ~10–15/vecka. Det är
   den enda mätningen av urvalet som inte kräver stängda affärer.

   > **Om siffrorna i det här avsnittet.** `state/decision_eval.json` skrivs om var 30:e minut av
   > pris-jobbet, så varje tal nedan är en **avläsning vid en tidpunkt**, inte ett fast värde.
   > Alla är avlästa ur `generatedAt` **2026-08-26T09:32:12Z** om inget annat sägs. En tidigare
   > version av det här dokumentet bar avläsningar som redan var förlegade samma dygn de skrevs
   > (bl.a. urvalsedge +0,58 pp mot faktiska +1,38, och BEHÅLL +0,16 % mot faktiska −0,59 %) —
   > jämför alltid mot filen innan ett tal citeras vidare.

   **2a. Effektiv stickprovsstorlek — radantalet ljuger.** Beslut som fattas samma dag, eller
   inom mätfönstrets längd från varandra, delar marknadsrörelse och är inte oberoende
   observationer. Vid avläsningen låg **191 mätbara rader på 18 datum, vilket blir
   5 icke-överlappande femdagarsfönster**. Ett medelvärde räknat som om raderna vore oberoende
   såg ungefär fem gånger starkare ut än materialet bär.
   Därför gäller: `decision_eval.mjs` räknar `effectiveN` = antal block vars mätfönster inte
   överlappar, och **varje nytt uttalande gateas på blocken, inte på raderna** (`MIN_CLUSTERS`,
   för närvarande 8). Fältet redovisar `n`, `nDates` och `effectiveN` bredvid varandra, och
   `clusterMeanAlphaPct` (ovägt medel per datum) bredvid `meanAlphaPct` (per rad) — skiljer de
   sig åt är besluten ojämnt fördelade i tiden, och det är i sig en varning.

   **2b. Två skilda hypoteser, inte en.** Frågan i avsnitt 2 gäller **grindarna**, men samma
   tabell besvarar lätt en helt annan fråga — om **kandidatflödet** hittar namn som rör sig.
   Ett system kan ha ett bra flöde och värdelösa grindar, eller tvärtom.
   - `poolAlpha` — bär kandidatflödet? Alla rader, oavsett beslut.
   - `selectionEdge` — bär de fem grindarna? KÖP mot AVVAKTA.

   Endast den andra säger något om urvalsprocessen. Vid avläsningen var pool-alphan positiv
   (+0,56 % per rad, +2,10 % per datum) medan urvalsedgen låg på **+1,38 pp** (KÖP n=8 rader,
   `effectiveN` **5** av 8 krävda fönster). **Talet är en riktning, inte ett svar** — filens
   `verdict` säger "rätt riktning" därför att den gaten går på radantal av historiska skäl, men
   `clusterCaveat` står bredvid och dashboarden färgar därför inte talet. Om mönstret består
   ligger värdet i kandidatgenereringen, och då ska arbetet läggas där.

   **2c. Hållregeln mäts separat.** BEHÅLL är den enda åtgärd som är ett **aktivt val** snarare
   än ett icke-val. `holdRule` jämför BEHÅLL-radernas alpha mot kandidatpoolens. Hållregeln
   antogs ur backtest där argumentet var omsättningskostnad, inte urvalskvalitet; går innehaven
   systematiskt sämre än poolen betalas kostnadsbesparingen med sämre innehav. Vid avläsningen:
   BEHÅLL **−0,59 % medel, −1,74 % median, 21,4 % över index (n=14 rader, `effectiveN` 3)** mot
   poolens +0,52 % medel och 58,2 % över index — för lite för ett uttalande, men fel riktning i
   varje dimension och därför under bevakning. Riktningen har dessutom **förvärrats** sedan
   föregående avläsning samma dygn (då +0,16 % medel och 27 % över index).
3. **Realiserad R/R** loggas vid varje SÄLJ (faktiskt utfall / planerat stoppavstånd). Efter
   ~20 affärer visar fältet om målen systematiskt är för optimistiska — den vanligaste tysta
   felkällan i den här sortens strategi.
4. **Handelsstatistik per bok:** träffsäkerhet, snittvinst/-förlust, profit factor, bästa/sämsta,
   snitt-hålltid, mål/stopp/rotation-fördelning, alpha mot bokens eget index, riskmått,
   månadsutfall. Alltid **netto** efter rundturskostnad, alltid per bok.
5. **Miss-retro (veckovis)** letar efter vinnare systemet missade — inklusive den dyraste sorten:
   en vinnare systemet **såg** och ändå avstod från. Den letar **mönster** i avslagsskälen —
   faller samma spärr gång på gång på namn som sedan stiger är spärren felkalibrerad. Ett
   enskilt avvisat namn som gick upp är däremot facit-bias, inte en miss.

6. **Konvergenstestet — tröskeln för avsnitt 2, deklarerad i förväg.** Utan en tröskel satt
   innan datan finns går frågan "tillför urvalet något?" att svara ja på hur länge som helst
   genom att vänta på en bra månad. Kravet står därför i kod (`CONVERGENCE` i
   `decision_eval.mjs`) av samma skäl som kombinationstestet i 9.3 fick sitt krav satt i förväg:

   > När urvalsedgen vilar på **minst 20 icke-överlappande mätfönster i både KÖP- och
   > AVVAKTA-gruppen** och då **inte når +0,5 procentenheter**, ska boken konvergera mot
   > indexsleeven.

   Utfallet är **godkänt enligt avsnitt 2 — det är inte ett fel**. Fältet `convergence` skriver
   ut `avvakta`, `fortsätt aktivt urval` eller `konvergera mot indexsleeven` med skäl och hur
   långt underlaget räcker. Läge vid avläsningen: **4 av 20 KÖP-fönster, 3 av 20 AVVAKTA-fönster**.
   Tröskelvärdena 20 och 0,5 är satta av Dren och får ändras bara enligt avsnitt 12.

**Nuvarande statistisk styrka: mycket låg.** **3 stängda affärer** sedan den skarpa starten
2026-08-10 — ASSA-B.ST (2026-08-18, −3,26 %), NVDA och MU (båda 2026-08-25, −4,30 % respektive
−5,79 %) — och **5 oberoende mätfönster** i beslutsutvärderingen. Samtliga tre stängdes på stop,
ingen på mål. Beslutsloggen bär 6 SÄLJ-rader totalt, varav 3 från pappersperioden; poängvikterna
(35/30/15/20) kan inte kalibreras förrän ≥ 15 finns.

---

## 11. Kända svagheter och öppna frågor

Dessa är redan identifierade internt — en granskning är mest värd om den går bortom dem.

1. **Ingen mätning stödjer att katalysatorurvalet skapar alpha.** Hela premissen i avsnitt 2 är
   ännu obesvarad. Backtestet mäter en momentum-proxy, inte den faktiska urvalsregeln.
   Sedan 2026-08-26 finns en **fördeklarerad tröskel** (avsnitt 10.6) för när frågan ska
   avgöras i stället för att förbli öppen, och mätningen gateas på **oberoende mätfönster**
   i stället för radantal (10.2a). Läget vid avläsningen: **5 av 8 fönster** — för tidigt för
   varje uttalande. Undantaget är `selectionEdge`, som av historiska skäl fortfarande gatear på
   radantal; den bär i stället `clusterCaveat`, och dashboarden färgar aldrig ett edge-tal som
   vilar på för få fönster (fix 2026-08-26).
2. **Poängvikterna är godtyckliga.** 35/30/15/20 är satt på magkänsla och är ännu inte
   kalibrerbart.
3. **Poängsättningen görs av en språkmodell** ur nyheter och teknisk data. Reproducerbarheten
   mellan körningar är inte mätt. Två körningar på samma data kan ge olika poäng.
4. **Regimfiltret sänker exponeringen till ~58–65 %** medan sleeven bär resten — men sleeven är
   fortfarande index, så "inga nya positioner" ger marknadsexponering ändå. Det är oklart om
   filtret då gör vad mätningen tillskriver det, eftersom mätningen gjordes med sleeven
   modellerad.
5. **Antalet grindar är högt** (fem grindar + sex sekventiella spärrar i kandidatkön + hållregel).
   Risken för att systemet aldrig handlar är reell och inte kvantifierad. Motviktsregeln
   ("bredare kandidatinflöde, inte lägre beviskrav") är oprövad.
6. **Kostnadsmodellen är schablon**, inte uppmätt spread. För US-boken tillkommer ett antaget
   växlingspåslag på 0,5 % rundtur.
7. **Ingen positionsstorlek efter volatilitet.** Vikten är fast 25 % (conviction-bandet togs bort
   2026-08-08), alltså fortfarande oberoende av aktiens risk. Ett 3 %-stopp i en lugn aktie och i
   en volatil aktie ger samma kapitalrisk. Platt vikt är nollmodellen, inte lösningen –
   volatilitetsjusterad sizing är fortfarande obyggd och otestad.
8. **Ingen korrelationsmätning mellan de två böckerna.** Allokeringssplitten görs kvalitativt.
9. **Slippage och partiella fills modelleras inte.** Systemet lägger inga ordrar; roboten
   noterar den verifierade kurs den såg, inte det pris som faktiskt betalades.
10. ~~**Känd inkonsistens i konfigurationen:** US-bokens preferensfil beskriver fortfarande
    "normalt 2 aktier viktade 50/50" medan den styrande prompten säger 4 à 25 %.~~
    **RÄTTAD 2026-08-26** i `config/fokus_us_rotation.md`. Punkten stod här som "känd" i stället
    för att åtgärdas, vilket är fel ände: filen läses av rotationen, och lärdom **L-6** kräver att
    en spärr citeras ORDAGRANT ur den fil den påstås komma ur — en körning som följde L-6 hade
    därmed citerat en regel strategin övergav 2026-08-02/08 som gällande auktoritet. Att
    dokumentera ett fel är inte att rätta det.

---

## 12. Vad som inte får ändras utan att mätas om

- Kursverifieringskravet (källa + tidsstämpel). Får aldrig sänkas, av något skäl.
- R/R 2:1 och kostnadströskeln (6 % / 8 %).
- Regimfiltret som **hård spärr** — den mjuka varianten ("höj ribban 2 poäng") har aldrig mätts.
- Förbudet mot köp inför rapport (kräver omkörning av eventtestet på 10 år i **båda** marknaderna).
- Universumsbredden (kräver omkörning av breddtestet + en urvalsregel som skärps med bredden).
- Stoppnivåer, lookback och hålltid (kräver omkörning av out-of-sample- och kombinationsavsnitten).
- Att böckerna redovisas separat, var och en mot sitt eget index.
- **Konvergenströskeln** (20 fönster / +0,5 pp, avsnitt 10.6) och gaten på oberoende
  mätfönster (`MIN_CLUSTERS`). Att sänka någon av dem efter att ha sett utfallet är precis det
  fel som fördeklarationen finns för att förhindra.

---

*Automatiserat beslutsstöd, inte finansiell rådgivning.*
