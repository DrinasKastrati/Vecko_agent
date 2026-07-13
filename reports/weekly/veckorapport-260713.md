# Veckorapport: Nordisk Rotation
**Vecka:** v29 (2026-07-13 t.o.m. 2026-07-17) | **Datum:** 2026-07-13 (LÄGE A – veckorotation, körd efter måndagens stängning)
**Marknadsklimat:** Nordiska börser inledde veckan svagt – OMXS30 (`^OMX`) stängde 3167,16 (−1,2 % mot föregående stängning 3205,46; källa: prices.json, marketTime 2026-07-13T15:35 UTC). Den helt dominerande drivkraften är en **kraftig sektorrotation UR försvar** på förnyade fredsförhoppningar: Saab B föll −11,75 % (529,50 kr mot 600,00 kr, prices.json 15:29 UTC) och norska Kongsberg Gruppen −13,8 % (279,00 NOK mot 323,50 NOK, prices.json 14:26 UTC). Temat bekräftas av flera etablerade medier (EFN, Realtid, Börskollen, Privata Affärer: "Försvarsaktier backar efter fredssamtal/fredsavtal", 10–13/7 2026). Detta ger **motvind för nordiskt försvar** hela veckan och gör att både Saab och Kongsberg utesluts som köpcase trots låga kurser (fallande kniv). Samtidigt visar Oslo Børs energi-/offshoresektor relativ styrka (Moreld +6,1 %). Inga penningpolitiska möten i Norden denna vecka (Riksbanken näst 20/8, Norges Bank i augusti); Fed möts först 29/7 (utanför fönstret). Nettobilden: händelsedriven, sektorspecifik volatilitet snarare än ett brett riktat marknadstema.

---

## 0. Facit: Förra veckans val (plan v29, beslutad i veckorapport-260710.md)

> Föregående veckorapport (`veckorapport-260710.md`, skriven fre 10/7) lade en **pending-plan** för v29 med två villkorade entries: Moreld (köp vid öppning om kurs ≤ 17,80) och Alleima (köp om kurs ≤ 97,00). `state/portfolj.md` visar att **ingen** av positionerna öppnades – portföljen är 100 % kassa och ackumulerad avkastning 0 % (ingen position har någonsin stängts).

| Aktie | Planerad entry | Utfall vid dagens facit | Stop/Mål träffad? |
|---|---|---|---|
| Moreld (MORLD.OL) | ≤ 17,80 NOK (villkor) | Ej öppnad – kursen gapade förbi villkoret; står nu 20,20 NOK (prices.json 14:25 UTC 13/7), +6,1 % idag och långt över planens målkurs 18,95. Villkoret ≤17,80 triggades aldrig. | Nej – ingen position |
| Alleima (ALLEI.ST) | ≤ 97,00 kr (villkor) | Ej öppnad – står 97,30 kr (prices.json 15:29 UTC 13/7). Villkoret ≤97,00 nåddes fre 10/7 (96,50) men position exekverades ej i portföljen. | Nej – ingen position |

**Veckans portföljutfall (50/50):** 0 % (ingen position öppnades)
**Ackumulerad avkastning sedan strategistart:** 0 % (oförändrad baslinje – ingen position har någonsin stängts)
**Lärdom:** Moreld sprang ifrån planen på samma sätt som Saab gjorde veckan innan – ett återkommande mönster där små, katalysatordrivna case gapar förbi den disciplinerade entry-nivån. Det bekräftar värdet av villkorade entries (kapitalet skyddades från en dålig jaktfyllnad), men visar också att strategin missar rörelser när den enda ingången är en snäv limit under gårdagens kurs. Slutsats för v29: behåll disciplinen, men låt Alleima (som handlas nära nuvarande nivå med en konkret rapportkatalysator) vara veckans aktiva primärcase, och behandla Moreld som ett rent **rekyl-case** (köp bara på återtest) i stället för att jaga ett +6 %-utbrott.

---

## Case 1: Alleima AB (ALLEI.ST / Nasdaq Stockholm)

### 1. Katalysatorn
Två samverkande, färska katalysatorer: (a) Handelsbanken höjde nyligen riktkursen till **105 kr** (från 84 kr) med hänvisning till minskad Tube-oro, fortsatt styrka i Kanthal samt ljusare valuta-/marginalutsikter; (b) **Alleima publicerar Q2-rapporten fredag 17/7 ~11:30 CEST** – bekräftat via MarketScreener ("Invitation to presentation of Alleima's Q2 interim report 2026", hämtad 13/7 2026). Rapporten faller på veckans sista handelsdag och är en konkret, daterad trigger inom femdagarsfönstret. Icke-försvar → oberoende av veckans försvarsras.

### 2. Investerings-tes (The Bull Case)
* Färsk analytikeruppgradering (ej rykte) med tydligt högre riktkurs (105 kr) ger fundamentalt stöd inför rapporten.
* Aktien handlas nära 52-veckorshögsta (~97,40 kr) och stängde idag +1,35 % på 97,30 kr (dagens högsta = dagens stängning, dvs. styrka in i stängningen). Utbrott till nya toppnivåer med förbättrade fundamenta är historiskt ett styrketecken.
* Specialstål/Kanthal är strukturellt exponerat mot elektrifiering och industriell värme – tematiskt frånkopplat från veckans försvars-/geopolitiska brus.

### 3. Motargument & Risker (The Bear Case)
* **Bunden binär risk:** Q2-rapporten (17/7) ligger i slutet av handelsfönstret – en besvikelse kan ge en kraftig enskild dags rörelse som kan **gapa förbi stop-lossen**. Positionen hålls över en rapport = förhöjd risk.
* "Sell the news"-risk efter Handelsbankens uppgradering – förväntansbilden är redan positiv.
* Nära ATH utan tydligt tekniskt motstånd ovanför = svårt att sätta en objektiv målnivå bortom analytikerriktkursen; delmål 103,50 kr valt konservativt under HB:s 105 kr.

### 4. Fundamental snapshot
* **Börsvärde:** ca 23,6 md SEK (tidigare Sandvik Materials Technology) | **P/E / EV/EBITDA:** ej oberoende exakt verifierad denna körning – tesen vilar på HB:s riktkurshöjning och angivna skäl | **Tillväxt:** aktien ~+15 % YTD; Q2 17/7 väntas ge konkreta siffror | **Snittomsättning/dag:** stor, etablerad large cap-notering – likviditetskravet (≥3 MSEK/dag) uppfyllt med bred marginal.

### 5. Teknisk setup
* **RSI(14):** ej exakt siffervärde verifierat via denna körnings källor (Investtech/aggregat brusiga) – kvalitativt högt/positivt momentum nära ATH | **MACD:** ej exakt verifierad | **Kurs vs EMA20/50/200:** kurs i stigande trend, nära 52-veckorshögsta (över glidande medelvärden) | **Volym vs 20d-snitt:** ej exakt verifierad | **Stöd:** 95,70 kr (dagens lägsta) samt 94-talstöd | **Motstånd:** 97,40 kr (52-veckorshögsta), därefter öppet.
* Senast verifierad kurs: **97,30 kr**, marketTime 2026-07-13T15:29:35Z, source: Yahoo Finance (chart API) via `state/prices.json`.

### 6. Handelsplan
| Entry | Stop-loss | Målkurs | Risk/Reward |
|---|---|---|---|
| 97,30 kr (köp vid nästa öppning om kurs ≤ 97,80) | 94,30 kr (−3,1 %, under dagens lägsta 95,70 + 94-talstöd) | 103,50 kr (+6,4 %, delmål mot HB:s riktkurs 105) | ca 1:2,05 |

> **OBS binär risk:** stop-lossen kan gapas ur på Q2-rapporten fredag 17/7. Om positionen står i vinst inför rapporten: överväg att flytta stoppen upp mot entry (får ALDRIG flyttas ned).

---

## Case 2: Moreld ASA (MORLD.OL / Oslo Børs) – VILLKORAT REKYL-CASE

### 1. Katalysatorn
Ocean Installer (helägt dotterbolag) har säkrat en tät serie stora kontrakt: major-kontrakt från **Vår Energi** (>2 md NOK, Balder Next New Wells, 26/6 2026, ett av bolagets största någonsin) samt sizeable-kontrakt från **TotalEnergies** (Byggve/Skirne/Atla-dekommissionering, 25/6 2026). Källor: Euronext/MFN, TradingView, RTTNews (25–26/6 2026). **VIKTIGT:** dessa katalysatorer är nu ~13 handelsdagar gamla – **utanför** LÄGE A:s färskhetsfönster på 5 handelsdagar. Ingen ny bekräftad kontraktsnyhet hittades för 10–13/7; dagens +6,1 % framstår därför som momentum/oljesektor-medvind snarare än en färsk trigger. Caset kvalificerar därför **inte** för en marknadsköps-entry – det behandlas som ett rent rekyl-case.

### 2. Investerings-tes (The Bull Case)
* Bekräftad, betydande orderingång (>2 md NOK) ovanpå en redan stor backlog stärker intäktsvisibiliteten för 2026–2028.
* Oljeprismedvind och relativ styrka i Oslos offshoresektor på en dag då nordiskt försvar rasade – Moreld är tematiskt frånkopplat från fredstemat.
* Teknisk momentumbild positiv (stängde nära dagens högsta 20,30).

### 3. Motargument & Risker (The Bear Case)
* **Katalysatorn är för gammal** för ett nytt LÄGE A-case och aktien är **utsträckt** (+6,1 % idag, långt över förra planens målkurs 18,95) – att jaga på 20,20 ger otillräcklig R/R och bryter mot regeln om att inte jaga hype/momentum utan färsk katalysator.
* Litet bolag (börsvärde ~3 md NOK) – hög volatilitet, känsligt för allmän riskaptit.
* Oljeprisuppgången är delvis sanktions-/händelsedriven och kan reversera snabbt.

### 4. Fundamental snapshot
* **Börsvärde:** ca 3 md NOK | **EV/EBITDA:** lågt (~3,5–4,5x mot 2026 EBITDA-guidning 0,7–0,9 md NOK), präglat av svagt Q1 | **Tillväxt (backlog):** ~6,3 md NOK kontrakterat + ny orderingång juni | **Snittomsättning/dag:** ej fullständigt verifierad – positionsstorlek bör hållas försiktig.

### 5. Teknisk setup
* **RSI(14):** ej exakt verifierad – kvalitativt högt efter dagens rusning | **MACD:** positiv/stigande (kvalitativt) | **Kurs vs EMA:** över glidande medelvärden, stigande trend | **Volym:** förhöjd (rusningsdag) | **Stöd:** ~19,26 (dagens lägsta) / 19,0-talet (utbrottsretest) | **Motstånd:** 20,30 (dagens högsta), därefter öppet.
* Senast verifierad kurs: **20,20 NOK**, marketTime 2026-07-13T14:25:09Z, source: Yahoo Finance (chart API) via `state/prices.json`.

### 6. Handelsplan (endast rekyl – ingen jakt)
| Entry | Stop-loss | Målkurs | Risk/Reward |
|---|---|---|---|
| Köp ENDAST vid rekyl till ≤ 19,20 NOK (utbrottsretest) | 18,55 NOK (−3,4 % från 19,20, under 19-talstöd) | 20,90 NOK (+8,9 % från 19,20) | ca 1:2,6 |

> **Om ingen rekyl till ≤19,20 sker under veckan → ingen position, kapitalet står kvar i kassa.** Detta är avsiktligt: caset får inte jagas på utsträckt nivå.

---

## Bubblare (watchlist inför nästa vecka)
1. **Kongsberg Gruppen (KOG.OL)** – Föll −13,8 % idag (279,00 NOK) i försvarsraset. Fallande kniv – utesluten tills momentum stabiliseras; kan bli ett turnaround-case om fredstemat visar sig överdrivet (Morningstar: strukturell försvarsefterfrågan intakt).
2. **Saab B (SAAB-B.ST)** – −11,75 % idag (529,50 kr) på samma fredstema. Bevaka för stabilisering; strukturella försvarsbudgetar talar för på sikt, men negativt kortsiktigt momentum diskvalificerar denna vecka.
3. **Boozt (BOOZT.ST)** – +3,6 % idag (151,80 kr), stark teknisk trend men **saknar färsk fundamental katalysator** (nästa rapport ~14/8). Diskvalificerad enligt regeln att teknik/hype ensamt inte bär ett case.
4. **Micro Systemation / MSAB (4C.ST i bevakningslistan)** – −3,4 % idag (8,74 kr). Q2-rapport 16/7 – potentiell katalysator; bevaka om tekniken stabiliseras inför rapporten.
5. **Nokia (Helsingfors)** – Höjda tillväxtmål inför Q2-rapport 23/7. Katalysatorn ligger utanför denna veckas fönster men är en stark kandidat inför nästa rotation.

## Veckans radar (kommande handelsdagar)
* **Tis–fre** – Försvars-/fredstemat driver Saab & Kongsberg; håll dem i bubblarlistan tills momentum vänder (påverkar ej öppna case, båda utom portföljen).
* **Tis** – Ev. rekyl i Moreld mot ≤19,20 = trigger för Case 2 (annars kassa).
* **Tor 16/7** – Micro Systemations (MSAB/4C) Q2-rapport – relevant för bubblarlistan.
* **Fre 17/7** – **Alleimas Q2-rapport (~11:30 CEST)** – nyckelhändelse för Case 1; binär risk hanteras med stop-loss (kan gapas).
* **Löpande** – Oljepris (Oslo offshore/Moreld) och fredsförhandlingsrubriker (försvar) sätter tonen.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
