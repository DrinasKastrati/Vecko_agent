# Veckorapport: Nordisk Rotation
**Vecka:** v29 (2026-07-13 t.o.m. 2026-07-17) | **Datum:** 2026-07-10
**Marknadsklimat:** Nordiska index i en avvaktande men händelsetät fas: Stockholmsbörsen svagt ned inledningen av veckan (OMXS30 −0,35 % måndag) medan Oslo Børs stärkts på ett oljeprishopp (Brent +4,7 % till ~75,4 USD/fat) sedan USA återkallat en Iran-exportlicens med utfasning t.o.m. 17/7. Ingen räntesammanträde hos Riksbanken, Norges Bank eller ECB denna vecka (Riksbanken näst 20/8, Norges Bank näst i augusti) – lägre räntevolatilitet på hemmaplan. Fed möts inte förrän 29/7 (utanför denna veckas horisont) men tonen är hökaktig: styrränta oförändrad 3,50–3,75 %, ~25–30 % sannolikhet för höjning, inflationen hålls uppe av tullar och AI-infrastrukturinvesteringar – ett visst makromotvindstema för räntekänsliga sektorer. Norden har samtidigt en ovanligt aktiv M&A-vecka (Telenor/Bahnhof, Ambea/Humana, Boliden/Nexa, ABB/Høglund), vilket ger händelsedriven volatilitet i enskilda namn snarare än ett brett marknadsriktat tema.

---

## 0. Facit: Förra veckans val

> **⚠️ Anmärkning om datakontinuitet:** `reports/weekly/` innehöll inga tidigare veckorapporter vid den här körningens start (mappen var tom i repot). Detta är **inte** strategins första vecka – `state/portfolj.md` visar en löpande historik (rotation v28, m.fl.) och en ackumulerad avkastning på 0 % sedan start. Facit nedan är därför rekonstruerat ur `state/portfolj.md`s egna körnoteringar i stället för ur en arkiverad veckorapport-fil. Detta bör flaggas för Dren: rapportarkivet i `reports/weekly/` och `reports/daily/` verkar ha raderats i repots historik (commits "Delete reports/weekly directory" / "Delete reports/daily directory") efter omstruktureringen tidigare denna vecka.

| Aktie | Entry | Exit | Utfall | Stop/Mål träffad? |
|---|---|---|---|---|
| Alleima (ALLEI.ST) | Ej öppnad (pending) | – | 0 % | Nej – ingen position exekverades |
| Saab B (SAAB-B.ST) | Ej öppnad (pending) | – | 0 % | Nej – avförd 2026-07-08 efter GlobalEye-katalysator, kursen gapade förbi planerad entry |

**Veckans portföljutfall (50/50):** 0 % (ingen av de två positionerna öppnades)
**Ackumulerad avkastning sedan strategistart:** 0 % (oförändrad baslinje – ingen position har någonsin stängts)
**Lärdom:** Planen (rotation v28, Saab + Alleima) höll som *idé* – Saabs GlobalEye-affär bekräftades och Alleimas fundamentala bild förbättrades – men det strikta verifieringskravet på kurs stoppade exekvering fem dagar i rad p.g.a. blockerade datakällor, och när källan väl kom igång (2026-07-10) hade Saab redan gapat förbi den planerade entryn. Slutsats: verifieringskravet skyddade portföljen mot en dålig fyllnadskurs på Saab, men kostade en "missad" position – korrekt agerat givet reglerna, men visar värdet av att `state/prices.json` uppdateras tidigare på dagen (före ev. gap-öppningar).

---

## Case 1: Moreld ASA (MORLD / Oslo Børs, huvudlista)

### 1. Katalysatorn
Ocean Installer (helägt dotterbolag till Moreld) har på kort tid säkrat en tät serie stora kontrakt: 7/7 2026 utsedd av Equinor till första "vågen" av nya subsea tie-back-projekt på norska sockeln (Twin, Omega South, Tyrihans North, Brime) värt 1–2 miljarder NOK, som komplement till tidigare kontrakt med Equinor i Brasiliens Bacalhau-fält (500 mn–1 md NOK, 4,5 år, byggstart 2027), samt kontrakt med Vår Energi och TotalEnergies under samma period. Källor: Finansavisen/MFN (7/7 2026) och TradingView/Marketscreener (nyhetsflöde juni–juli 2026).

### 2. Investerings-tes (The Bull Case)
* Konkret, bekräftad orderingång (ej rykte) på flera hundra miljoner till ~2 md NOK i en enda vecka, ovanpå en redan kontrakterad backlog på ca 6,3 md NOK (varav 4,9 md för leverans 2026) per Q1-rapporten.
* Bolaget guidar EBITDA 0,7–0,9 md NOK för 2026 efter ett svagt Q1 (temporärt lågt projektaktivitet, EBITDA −93 mn NOK) – ledningen har själva flaggat en "significant uptick in activity and margins" från Q2, vilket den här veckans kontraktsflod stöder direkt.
* Oljeprisuppgången (Iran-licens återkallad, Brent +4,7 %) ger sektormedvind för norska offshore-leverantörer generellt.
* Teknisk bild: aktien i etablerad stigande trendkanal, köpsignal (kort och lång trend positiv).

### 3. Motargument & Risker (The Bear Case)
* Q1 2026 var svagt (negativt EBITDA) – bolaget är beroende av att den utlovade Q2-återhämtningen faktiskt syns i siffrorna; nästa kvartalsrapport är inte bekräftad inom denna veckas fönster men en besvikelse i marginalutvecklingen skulle slå hårt på ett litet bolag.
* Likviditet: exakt snittomsättning per dag på Oslo Børs huvudlista kunde **inte** verifieras med säkerhet i denna körning (sökträffar gav enbart data för en mindre, illikvid sekundärnotering, ej huvudnoteringen). Positionsstorlek bör anpassas försiktigt tills detta är dubbelkollat mot Euronext/Oslo Børs direkt.
* Småbolag (börsvärde ~2,9–3,5 md NOK) – högre volatilitet och känsligare för allmän riskaptit än large cap.
* Oljeprisuppgången är delvis händelsedriven (sanktionsrelaterad) och kan reversera lika snabbt som den kom.

### 4. Fundamental snapshot
* **Börsvärde:** ca 2,9–3,5 md NOK (senast rapporterat ~2,9 md NOK i mars 2026, sannolikt högre efter veckans kontraktsflöde) | **EV/EBITDA:** ca 3,5–4,5x mot 2026 EBITDA-guidning (0,7–0,9 md NOK) – lågt, men präglat av svagt Q1 | **Tillväxt (order-backlog):** ca 6,3 md NOK kontrakterat (4,9 md för 2026), plus ny orderingång denna vecka ej ännu inräknad | **Snittomsättning/dag:** ej fullständigt verifierad – flaggas som öppen post, se Bear Case.

### 5. Teknisk setup
* **RSI(14):** ej exakt siffervärde tillgängligt via denna körnings källor – kvalitativt "positivt momentum" enligt Investtech | **MACD:** ej specificerat, trend beskrivs som bullish på både kort och lång sikt | **Kurs vs EMA20/50/200:** kort- och långsiktig trend bedöms positiv (köpsignal) enligt Investtechs trendalgoritm | **Volym vs 20d-snitt:** ej verifierad exakt siffra | **Stöd:** 17,28 NOK | **Motstånd:** 18,30 NOK (nästa steg mot analytikernas snittriktkurs 19,38 NOK, spann 19,19–19,95)
* Senast noterad kurs: 17,64 NOK.

### 6. Handelsplan
| Entry | Stop-loss | Målkurs | Risk/Reward |
|---|---|---|---|
| 17,64 NOK (köp vid öppning om kurs ≤ 17,80) | 17,10 NOK (−3,1 %, strax under stödet 17,28) | 18,95 NOK (+7,4 %, genom motståndet 18,30 mot analytikersnittet 19,38) | ca 1:2,4 |

---

## Case 2: Alleima AB (ALLEI / Nasdaq Stockholm)

### 1. Katalysatorn
Handelsbanken höjde nyligen riktkursen för Alleima till 105 kr (från 84 kr) och lyfter fram tydligt förbättrade förutsättningar: minskad oro för Tube-divisionen, fortsatt stark utveckling i Kanthal, samt ljusare utsikter för både valutaeffekter och lönsamhet. Detta bygger vidare på en redan stark trend: aktien +15,4 % sedan årsskiftet och nära sin 52-veckorshögsta (67,15–97,40 kr). Alleima rapporterar Q2 fredag 17/7 – sista handelsdagen inom denna veckas femdagarsfönster.

### 2. Investerings-tes (The Bull Case)
* Färsk, konkret analytikeruppgradering (ej rykte) med tydligt högre riktkurs ger stöd för fortsatt uppvärdering inför rapporten.
* Aktien handlas nära 52-veckorshögsta – ett genombrott till nya toppnivåer är historiskt ett styrketecken snarare än en varningssignal när det åtföljs av förbättrade fundamenta.
* Positionerar portföljen inför en rapport där konsensus/analytikerkonsensus lutar åt förbättring, vilket kan ge en positiv reaktion om förväntningarna infrias eller slås.

### 3. Motargument & Risker (The Bear Case)
* **Bunden binär risk:** Q2-rapporten (17/7) faller precis i slutet av veckans handelsfönster – en besvikelse kan ge en kraftig enskild dags rörelse nedåt som stop-lossen måste hantera; positionen hålls alltså över en rapport, vilket är en förhöjd risk jämfört med ett rent tekniskt case.
* Tidigare körningar denna vecka noterade en prisdiskrepans mellan `state/prices.json` (96,50 kr, 12:50 UTC 10/7) och vissa webbaggregat (85–87 kr). Denna körnings kompletterande sökning indikerar en aktuell kurs kring 94–96 kr, vilket ligger nära `prices.json`-nivån och tyder på att de tidigare 85–87-kr-uppgifterna var inaktuella/cachade – men **exakt** avstämning mot Avanza/Nordnet i realtid rekommenderas ändå innan order läggs, i linje med projektets verifieringskrav.
* Äldre teknisk analys (Investtech) flaggade negativ volymbalans (säljare mer aggressiva än köpare) på lägre kursnivåer (~80 kr) – om detta mönster kvarstår nära ATH kan det signalera säljtryck vid toppen.
* Risk för "sell the news" om Q2-rapporten möter redan höga förväntningar efter Handelsbankens uppgradering.

### 4. Fundamental snapshot
* **Börsvärde:** ca 23 608 MSEK | **P/E:** kunde inte oberoende verifieras med exakt siffra i denna körning – fundamental tes bygger i stället på Handelsbankens riktkurshöjning (105 kr från 84 kr) och angivna skäl (Kanthal-styrka, minskad Tube-oro, bättre valuta-/marginalutsikter) | **Tillväxt:** +15,4 % aktiekurs YTD; Q2-rapport 17/7 väntas visa konkreta siffror | **Snittomsättning/dag:** stor, etablerad Nasdaq Stockholm-notering (tidigare Sandvik Materials Technology) – likviditetskravet (≥3 MSEK/dag) bedöms uppfyllt med god marginal givet börsvärdet, men exakt siffra ej hämtad denna körning.

### 5. Teknisk setup
* **RSI(14):** ej exakt siffervärde tillgängligt (äldre Investtech-data avser en kurs ~80 kr och bedöms inaktuell relativt dagens ~94–96 kr) | **MACD:** ej verifierad exakt | **Kurs vs EMA20/50/200:** kurs i etablerad stigande trendkanal på medellång sikt (Investtech), nära 52-veckorshögsta | **Volym vs 20d-snitt:** ej verifierad – se varning om negativ volymbalans i Bear Case | **Stöd:** ca 94,00 kr (dagens lägsta 94,85 kr samt talstöd) | **Motstånd:** 97,40 kr (52-veckorshögsta)
* Senast verifierad kurs: 96,50 kr kl. 12:50 UTC 10/7 (`state/prices.json`), korroborerad av oberoende sökning till ca 94,45 kr samma dag.

### 6. Handelsplan
| Entry | Stop-loss | Målkurs | Risk/Reward |
|---|---|---|---|
| 96,50 kr (köp vid öppning om kurs ≤ 97,00) | 94,00 kr (−2,6 %, strax under veckans lägsta/talstöd) | 101,50 kr (+5,2 %, delmål mot Handelsbankens riktkurs 105 kr) | 1:2 |

> **OBS:** Alleima var förra veckans (v28) prioriterade pending-case men öppnades aldrig som position (se Facit ovan). Den behandlas därför som en **ny entry** denna vecka, inte som "BEHÅLL" av en befintlig position – ingen sådan har någonsin funnits.

---

## Bubblare (watchlist inför nästa vecka)
1. **Boozt (BOOZT.ST)** – Stark teknisk uppgångstrend, RSI >70 och positiv volymbalans enligt Investtech, men saknar en färsk fundamental katalysator (nästa rapport ej förrän 14/8) – disqualificerad enligt regeln att hype/teknik ensamt inte får bära ett case. Bevaka för katalysator.
2. **Micro Systemation (MSAB B, ~4C.ST i bevakningslistan)** – Omvänd vinstvarning 6/7 (prel. Q2-intäkter 122 MSEK) gav en kursrusning på +16 %, men aktien har sedan gett tillbaka en stor del (RSI ~39, brutet stöd, negativ MACD och volymbalans enligt Investtech). Q2-rapport 16/7 – bevaka om tekniken stabiliseras innan ev. entry.
3. **Kongsberg Gruppen (KOG.OL)** – Nedgraderad till Underweight av Morgan Stanley (7/7) och föll vidare efter Q2-rapport 8/7 (−9 % dagens rörelse 10/7). Utesluten denna vecka p.g.a. negativt post-rapport-momentum; bevaka för ev. stabilisering/vändning.
4. **Bahnhof (BAHN B.ST)** – Telenor har lagt bud 62 kr/aktie (22 % premie mot stängning 50,9 kr, 8/7), bekräftat och ej rykte. Uteslutet som veckocase: som ett i praktiken avgjort uppköpsbud är risk/reward-profilen för en arbitragehandel (begränsad uppsida mot budet, större nedsida om affären skulle fallera) inte förenlig med strategins krav på minst 2:1 R/R uppåt.
5. **Nokia (Helsingfors)** – Höjda tillväxtmål för Network Infrastructure (12–14 %) och Optical/IP Networks (18–20 %) inför Q2-rapport 23/7. Katalysatorn ligger utanför denna veckas femdagarsfönster men är en stark kandidat att bevaka inför nästa veckas rotation.

## Veckans radar (kommande 5 handelsdagar)
* Mån 13/7 – Vecka inleds; ev. entry-exekvering för Moreld och Alleima om villkoren i handelsplanerna ovan triggas.
* Ons–Tor (15–16/7) – Fortsatt utfasning av den återkallade Iran-exportlicensen mot 17/7-deadline; kan hålla uppe volatiliteten i oljepriset och därmed Oslo Børs energi-/offshoresektor (påverkar Case 1, Moreld).
* Tor 16/7 – Micro Systemations (MSAB) Q2-rapport – relevant för bubblarlistan, ej för öppna case.
* Fre 17/7 – **Alleimas Q2-rapport** – nyckelhändelse för Case 2; binär risk, hanteras med stop-loss enligt handelsplanen ovan.
* Löpande – Fed möts inte förrän 29/7 men hökaktig ton i kommunikationen kan påverka USD/SEK och därmed exportbolagens sentiment under veckan.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
