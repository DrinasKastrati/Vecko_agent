# Veckorapport: Nordisk Rotation
**Vecka:** v 32 | **Datum:** 2026-08-03
**Marknadsklimat:** Riskaptiten är fortsatt positiv men marknaden är utsträckt. OMXS30 (`^OMX`) stängde fredag **3 246,92** (`state/prices.json`, source "Yahoo Finance (chart API)", marketTime 2026-07-31T15:35:00Z, +0,42 % mot föregående stängning 3 233,44) – femte uppgångsveckan i rad och nära juli månads rekordnivå (juliintervall ca 3 116,72–3 256,27, ny rekordnotering 2026-07-02, källa Placera 2026-07-02). Svenskt inköpschefsindex för industrin föll till **55,8 i juli** – nedväxling från hög nivå men fortsatt expansion (Swedbank/Silf via MFN 2026-08-03 06:30 UTC). USD/SEK **9,5188** (prices.json, marketTime 2026-08-03T06:45:13Z, −0,20 % på dagen). Inga centralbanksbesked denna vecka – Riksbanken nästa 2026-08-20. Q2-säsongens tunga nordiska namn är avklarade (huvudveckan 14–17 juli; Evolution rapporterade 17/7, källa Evolution IR/Seeking Alpha), så veckan drivs av enskilda bolagshändelser snarare än av rapportflödet.

---

## 0. Facit: Förra veckans val
| Aktie | Entry | Exit | Utfall | Stop/Mål träffad? |
|---|---|---|---|---|
| Saab (SAAB-B.ST) | 585,00 kr (2026-07-30) | – (positionen är öppen) | +2,21 % (orealiserat) | Nej – varken stop 560 kr eller mål 635 kr träffad. Veckans högsta stängning 615,40 kr (28/7), fredagens dayHigh 610,80 / dayLow 586,90 (prices.json, marketTime 2026-07-31T15:29:34Z) |

**Veckans portföljutfall (viktat):** +1,10 % (orealiserat: 50 % Saab × +2,21 %; resterande 50 % låg i kassa hela veckan och bidrog med 0,0 %). Bruttotal – dashboardens nettosiffra drar rundturskostnaden 0,25 % per affär (`config/kostnader.json`, updatedAt 2026-07-31).
**Ackumulerad avkastning sedan strategistart:** +3,19 % (oförändrad – ingen position stängdes v31. Enda stängda affären är fortfarande Alleima +6,39 % × 50 % vikt.)
**Portföljallokering denna vecka:** 35 % Saab (SAAB-B.ST) + 65 % indexsleeve (XACT-OMXS30.ST). Två avvikelser mot förra veckan, båda regelstyrda: (1) **Saab trimmas 50 % → 35 %.** Positionsstorleksregeln som gäller sedan 2026-07-31 sätter taket till 35 % per aktie; 50 % är ett arv från den gamla 2-positionsmodellen och är inte längre tillåtet. 35 % är taket i bandet och uttrycker att convictionen är oförändrat hög – tesen är bekräftad och intakt. Detta är en **viktjustering mot regelverket, inte en rotation**: hållregeln (punkt 0b/3) säger att en fungerande position inte ska poängsättas om, och Saab poängsätts INTE om. (2) **Kassan avvecklas till indexsleeven.** Oallokerat kapital ska ligga i XACT OMXS30, aldrig på konto – 50 % kassa var en kvarleva från före sleeve-regeln. Sleeven köps till 486,10 kr (prices.json, marketTime 2026-07-31T15:23:46Z). Kassa 0 %. De faktiskt utförda benen (sälj 15 %, köp 65 %) kostar tillsammans ca 0,10 % av boken i courtage/spread.
**Lärdom:** Förra veckans lärdom – sätt entry NÄRA marknaden i stället för en tight limit långt under kursen – höll: taket ≤ 585 kr triggades redan andra dagen (dayLow 583,30 den 30/7) och veckan slutade med en fungerande position i stället för 100 % kassa för andra veckan i rad. Veckans egen lärdom ligger på en annan nivå: **portföljen låg kvar i den gamla 2-positionsgeometrin (50/50) i tre dygn efter att 4×25 %-modellen och sleeve-regeln införts 2026-07-31.** En strategiändring som inte migreras in i `state/portfolj.md` samma körning lever kvar tyst tills nästa rotation – här kostade det en helg med 50 % av kapitalet utanför marknaden. Tillämpad denna vecka: migreringen görs nu, före något nytt case övervägs. Tillämpade lärdomar ur `state/lessons.md`: **L-1** (rapportkalendern namnges i radarn nedan), **L-2** (varje bubblare läggs i `config/watchlist.txt` i samma körning), **L-3** (tre datadefekter eskaleras som namngivna åtgärdspunkter med kvantifierat omfång, sist i rapporten).

---

## Case 1: Saab AB (SAAB-B.ST / Nasdaq Stockholm) – BEHÅLL

### 1. Katalysatorn
*Oförändrad sedan v31 och fortfarande inom sin horisont: Q2-rapporten 2026-07-17 slog förväntningarna brett (försäljning +29 % till 25,45 mdr SEK, EBIT +41 % till 2,79 mdr SEK, marginal 11,0 %), med **rekordorderingång 68,4 mdr SEK** och **rekordorderstock 317,7 mdr SEK** (från 197,6 mdr året innan), driven av bl.a. den polska A26-ubåtsordern (~47 mdr SEK). Uppföljande uppgraderingsvåg under v30: Morgan Stanley Overweight TP 700 kr, DNB Carnegie Köp TP 630 kr, Pareto TP 645 kr, Handelsbanken TP 600 kr (Behåll). Källor: PRNewswire/CNBC/Investing.com 2026-07-17, Börskollen/Nordnet 2026-07-21/24. Kompletterande bekräftelse denna vecka: Inderes har inlett bevakning med köprekommendation och pekar på GlobeEye (websök 2026-08-03; publiceringsdatum ej entydigt daterat i träffen och används därför INTE som beslutsunderlag, endast som kontext).*

**catalystType:** `order` | **Horisont:** 3–6 veckor (15–30 handelsdagar) enligt katalysatortabellen. Entry 2026-07-30 ⇒ 2 avslutade handelsdagar hållna, väl inom horisonten. Inget tidsstopp gäller för `order`.

### 2. Investerings-tes (The Bull Case)
* Trippelkatalysatorn (rapportbeat + rekordorderbok + institutionell uppgraderingsvåg) är offentliggjord och obruten. Fyra av fem analyshus har riktkurser i intervallet 600–700 kr, vilket ger ett fundamentalt ankare ovanför målkursen 635 kr.
* Positionen är i vinst och strukturen är intakt: 597,90 kr ligger över EMA5 (596,27) och klart över EMA10 (584,48), och aktien har stigit +12,92 % över de 15 verifierade sessionerna i `state/price_history.json`. Enligt backtestets punkt 0a är just den längre momentum-horisonten det som bär skelettet – Saab uppfyller den, till skillnad från ett namn som poppat två veckor utan trend bakom sig.
* Rekordorderstocken ger flerårig intäktssynlighet, vilket gör värderingspremien fundamentalt understödd snarare än enbart sentimentsdriven.

### 3. Motargument & Risker (The Bear Case)
* **Fredsmakro** är fortfarande den enskilt största överhängande risken: hela sektorn föll tidigare i år på fredssignaler, och ett återupptaget fredsnarrativ sänker Saab oavsett rapporten.
* **RSI(14) ≈ 71,2** – aktien är i den övre delen av intervallet och har lämnat komfortzonen 50–70. Det diskvalificerar inte ett befintligt innehav (filtret gäller nyöppning), men det höjer risken för en rekyl mot EMA10 (584) som skulle ta positionen till nära noll.
* **Rekyl redan påbörjad en gång:** kursen toppade på 615,40 kr (28/7) och handlade ned till 591,30 (30/7) innan den återhämtade sig till 597,90. Spannet visar att stoppen på 560 kr är realistiskt satt men inte generöst – ett normalt dagsspann är ~4,0 % av kursen.

### 4. Fundamental snapshot
* **Börsvärde:** ~320–330 mdr SEK (est. utifrån B-kursen 597,90 kr) | **P/E / EV/EBITDA:** förhöjt försvarspremium (~P/E 35–40x, est.) | **Tillväxt:** +29 % intäkter Q2 (organiskt +29,8 %), orderstock +61 % å/å | **Snittomsättning/dag:** flera hundra MSEK (OMXS30-storbolag – vida över likviditetskravet 3 MSEK/dag)

### 5. Teknisk setup
* **RSI(14):** 71,2 | **MACD:** ej beräkningsbar (kräver 26+35 dagliga stängningar; `price_history.json` innehåller 15) | **Kurs vs EMA20/50/200:** ej beräkningsbara – kursen ligger över EMA5 (596,27) och EMA10 (584,48), vilket är de längsta glidande medelvärden underlaget medger | **Volym vs 20d-snitt:** ej tillgängligt (`prices.json` innehåller ingen volym) | **Stöd:** 591,30 (torsdagens stängning), därunder 586,90 (fredagens dayLow) och 583,30 (entryzonen 30/7) | **Motstånd:** 610,80 (fredagens dayHigh), därefter 615,40 (veckans högsta stängning 28/7)
* *Beräkningsunderlag: RSI(14) och EMA är räknade av denna körning ur de 15 daterade stängningarna i `state/price_history.json` (2026-07-13 – 2026-07-31) med enkelt medelvärde, inte Wilder-utjämning. De är alltså approximationer ur eget underlag, inte oberoende verifierade indikatorvärden. Raden för 2026-08-03 i price_history är fredagens stängning framskriven (börsen har inte öppnat) och är exkluderad ur alla beräkningar.*

### 6. Handelsplan
| Entry | Stop-loss | Målkurs | Risk/Reward |
|---|---|---|---|
| 585,00 kr (befintlig, oförändrad) | 560 kr (−4,27 % från entry; −6,34 % från 597,90) | 635 kr (+8,55 % från entry; +6,20 % kvar från 597,90) | 1:2,00 |

**Planerad vikt:** 35 % (ned från 50 %). Motivering: 35 % är taket i bandet 15–35 % och är det närmaste den gamla 50 %-vikten som regelverket tillåter – convictionen är oförändrat hög eftersom tesen är bekräftad och intakt, men ingen enskild aktie får överstiga 35 %. Resterande 65 % ligger i indexsleeven, inte i kassa.
**Kostnadströskel (punkt 2):** entry → mål = **+8,55 %**, dvs. 34× rundturskostnaden 0,25 %. Klarar kravet ≥ 6 % med god marginal.
**Nåbart mål (punkt 6):** genomsnittlig absolut dagsrörelse 2,05 % (15 sessioner). Tak = 2 × 2,05 % × √15 = **15,9 %** för en 15-dagarshorisont. Målavståndet 8,55 % ligger klart under taket ⇒ målet är nåbart.
**Riskjustering:** stoppen ligger kvar på 560 kr. Regeln tillåter att den flyttas upp till entry vid +5 %; positionen står på +2,21 % och kvalificerar alltså inte ännu. Stoppen flyttas ALDRIG ned.

---

## Indexsleeve (XACT-OMXS30.ST / Nasdaq Stockholm)

*Detta är kapitalparkering, inte ett aktiecase, och är därför medvetet INTE numrerad som "Case 2" – veckans antal valda case är ett (Saab, behållet). Sleeven redovisas som en egen rad i "Aktuellt innehav" i `state/portfolj.md`; avsnittet här finns för spårbarhet. Den poängsätts inte och konkurrerar inte om de fyra platserna.*

### 1. Katalysatorn
*Ingen – sleeven är regelstyrd. Oallokerat kapital ska ligga i XACT OMXS30, aldrig på konto, eftersom backtestet 2026-07-31 visade att köp-och-behåll av index slog strategiskelettet över fem år. Att stå utanför marknaden är därmed en garanterad kostnad, inte en neutral position.*

**catalystType:** `index` (filtreras bort ur urvalsstatistiken) | **Kurs:** 486,10 kr, `state/prices.json`, source "Yahoo Finance (chart API)", marketTime 2026-07-31T15:23:46Z.

### 6. Handelsplan
| Entry | Stop-loss | Målkurs | Risk/Reward |
|---|---|---|---|
| 486,10 kr | – | – | – |

**Planerad vikt:** 65 % (= 100 % − Saabs 35 %). Sleeven har medvetet ingen stop och ingen målkurs; den säljs aldrig på nedgång utan justeras bara när aktievikterna ändras.

---

## Urvalsarbetet denna vecka (bruttolista, filtrering och varför noll nya case)

**Bruttolista: 21 unika kandidater.** Fördelning enligt punkt 1g0: **8 ur `state/news_feed.json`** (kravet är minst 5), 6 ur `state/movers.json`, 5 ur förra veckans bubblarlista och 3 ur egen scanning – 22 träffar, varav SF.ST förekommer i två källor (movers och bubblarlistan) ⇒ 21 unika.

**Ur nyhetsflödet (8):** ASSA ABLOY (förvärv av Gunnebo Entrance Control, PR Newswire 2026-08-03 06:16/06:20 UTC, `order`/`other`) · Betsson (förvärvet av Rhino Entertainment slutfört, MFN 2026-08-03 06:30, `other`) · GRK Infra (datacenterprojekt i Finland ~66 MEUR, MFN 2026-08-03 06:30, `order`) · Subsea 7 (HSR-fristen löpt ut – regulatoriskt steg mot samgåendet, MFN/GlobeNewswire 2026-07-31 16:15, `regulatory`) · Precise Biometrics (fusion med Fingerprint Cards + företrädesemission, MFN 2026-08-03 06:30, `other`) · Himalaya Shipping (två fartyg konverterade till fast time charter, MFN 2026-08-03 06:30, `other`) · Norse Atlantic (operationell och strategisk uppdatering, MFN 2026-07-31 15:45, `turnaround`) · Mendole A/S (förvärv av Rebo A/S + höjd 2026-guidning till 300–350 MDKK, MFN 2026-07-31 16:10, `other`).

**Ur `state/movers.json` (6):** SF.ST (+63,45 % vecka), HEXA-B.ST (+19,92 %), ELUX-B.ST (+29,40 %), MIPS.ST (+12,64 %), EMBRAC-B.ST (+10,57 %), VOLCAR-B.ST (+8,88 %).

**Ur egen scanning (3):** ALLEI.ST, MORLD.OL, NOKIA.HE.

### Filtreringen – varje kandidat föll på en namngiven, mätbar spärr

| Kandidat | Verifierad kurs | Fälld av | Mätvärde |
|---|---|---|---|
| ASSA-B.ST, BETS-B.ST, SUBC.OL, GRK.HE, PREC.ST, HSHP.OL, NAS.OL, Mendole | **KURS EJ VERIFIERAD** | Datakrav punkt 4 | Ingen av dem finns i `state/prices.json`, och reservkällorna (Yahoo, Google Finance, Avanza, stooq) svarar 403 – körmiljöns utgående trafik är spärrad mot alla kurssajter. Inget köpbeslut får fattas på kursnivå. Samtliga lagda i `config/watchlist.txt` (L-2) ⇒ prissatta från nästa hämtning. |
| HEXA-B.ST, ELUX-B.ST, MIPS.ST, EMBRAC-B.ST, VOLCAR-B.ST | **KURS EJ VERIFIERAD** | Datakrav punkt 4 + punkt 1g1(i) | Saknas i prices.json. Dessutom: rörelsen har redan inträffat (+8,9 till +29,4 % på en vecka) och ingen av raderna bär en egen färsk katalysator som gör den till en rekyl-setup. Jagas inte. |
| SCA-B.ST | 108,25 kr (marketTime 2026-07-31T15:29:36Z) | **Punkt 6 – målet ej nåbart** | Genomsnittlig dagsrörelse 0,70 %. Tak = 2 × 0,70 × √15 = **5,43 %** på 15 dagar (6,27 % först på 20 dagar). Kostnadströskeln kräver ≥ 6,0 % ⇒ det finns i praktiken ingen målnivå som är både nåbar och lönsam. Ingen färsk katalysator heller (Q2 kom 22/7, utanför 5-dagarsfönstret). |
| BOOZT.ST | 167,40 kr | **Punkt 2 – RSI** | RSI(14) **79,1** (> 75 kräver exceptionell katalysator; ingen finns). Kursen ligger dessutom över SEB:s riktkurs 163 kr, så ett mål ≥ 6 % saknar fundamentalt ankare. |
| ALLEI.ST | 113,00 kr | **Punkt 2 – RSI** | RSI(14) **83,4**, +16,14 % på 15 sessioner. Såldes på målträff 103,25 den 17/7; att köpa tillbaka 9,4 % högre utan ny katalysator är att jaga. |
| NOKIA.HE | 7,958 EUR | **Punkt 2 – RSI/trend** | RSI(14) **20,9**, −24,64 % på 15 sessioner, kurs under både EMA5 (7,99) och EMA10 (8,38). RSI < 40 tillåts bara för turnaround med färsk katalysator – ingen sådan i flödet. |
| MORLD.OL | 19,90 NOK | **Ingen färsk katalysator** | RSI(14) 44,8, sjunkande sedan 21,50 den 17/7. Rekyl-benet från v29 avfördes redan; tesen är inaktuell. Tak för målet 7,72 % på 15 dagar – tekniskt möjligt, men utan katalysator får caset inte tas. |
| SF.ST | 6,625 kr | **Punkt 1g1(i) + ej beräkningsbar teknik** | +63,45 % på en vecka (movers) och −3,50 % på fredagen. Rörelsen har redan inträffat och den enda katalysatorn (Q2 den 24/7) ligger utanför 5-dagarsfönstret; Q2 hade dessutom organiskt fallande intäkter (−1,3 %). Endast 5 daterade stängningar ⇒ RSI(14) går inte att beräkna, så det tekniska filtret kan inte utvärderas på verifierad data. |
| HNSA.ST | 34,40 kr | **Katalysatorhorisonten** | Den reella binära katalysatorn (FDA/PDUFA för imlifidase) infaller 2026-12-19 – långt utanför varje swinghorisont. Poppen har dessutom redan rullat tillbaka: 37,84 → 34,40 kr (−9,09 % på 5 sessioner). |
| KOG.OL | 296,20 NOK | **Katalysator + koncentration** | Enda kandidaten som klarar både RSI-filtret (70,2, i band) och punkt 6 (tak 8,33 % på 15 dagar mot krav 6,0 %). Faller ändå på två spärrar: (a) ingen namngiven färsk katalysator de senaste 5 handelsdagarna – bara samma sektormedvind som Saab redan uttrycker; (b) punkt 3, "fyra positioner i samma sektor är en position" – ett andra försvarsnamn dubblar exakt den fredsmakro-risk som redan är Saab-casets största. Kvar som bubblare. |

**Slutsats: noll nya positioner.** Tre av fyra platser står tomma och kapitalet ligger i indexsleeven. Det är enligt punkt 3 ett korrekt utfall, inte en utebliven insats: "Tvinga ALDRIG fram ett case" och "Noll affärer en vecka är ett korrekt utfall". Med sleeven på plats får boken indexavkastning på de tomma platserna i stället för noll.

**Marknadsregimen (punkt 2b) – EJ VERIFIERBAR denna körning.** Regeln kräver en jämförelse mellan OMXS30 och dess 100-dagars glidande medelvärde. `state/price_history.json` innehåller **15 daterade stängningar för `^OMX`** (2026-07-13 – 2026-07-31); MA100 kräver 100. Ingen reservkälla är nåbar (403 mot Yahoo och stooq). Indirekt talar underlaget för medvind – indexet är +2,52 % över de 15 sessionerna, ligger över EMA5 (3 226,18) och EMA10 (3 205,42) och noterade rekordnivå så sent som 2026-07-02 – men det är inte samma sak som en mätning. Regeln tillämpas därför i sin **strängare** riktning: höjd ribba för nyöppning. Det påverkar inte veckans utfall, eftersom inget case nådde ens den ordinarie ribban. Se åtgärdspunkt 3.

---

## Bubblare (watchlist inför nästa vecka)
1. **ASSA ABLOY (ASSA-B.ST)** – har avtalat om att förvärva Gunnebo Entrance Control (PR Newswire via `news_feed.json`, 2026-08-03 06:16 och 06:20 UTC). Färsk, bekräftad och bolagsspecifik. KURS EJ VERIFIERAD – saknas i prices.json och länken kunde inte öppnas (utgående trafik spärrad); tillagd i `config/watchlist.txt` denna körning enligt L-2.
2. **Betsson (BETS-B.ST)** – förvärvet av Rhino Entertainment slutfört (MFN 2026-08-03 06:30 UTC). Genomförd transaktion snarare än avsiktsförklaring. KURS EJ VERIFIERAD; tillagd i watchlisten.
3. **Subsea 7 (SUBC.OL)** – väntetiden enligt Hart-Scott-Rodino har löpt ut (MFN/GlobeNewswire 2026-07-31 16:15 UTC), ett konkret regulatoriskt steg med definierad tidslinje. KURS EJ VERIFIERAD; tillagd i watchlisten.
4. **Kongsberg (KOG.OL)** – 296,20 NOK (prices.json, marketTime 2026-07-31T14:29:45Z). Rankad under enbart på sektorkoncentration mot Saab och avsaknad av egen färsk katalysator; tekniskt klarar den filtren. Blir aktuell om Saab stängs eller om Kongsberg får en egen katalysator.
5. **Stillfront (SF.ST)** – 6,625 kr (prices.json, marketTime 2026-07-31T15:29:30Z). Bevakas ENBART som rekyl-setup med egen färsk katalysator. Uppgången på +63 % i veckan jagas inte, och en fjärde eller femte session med stängningar krävs innan RSI(14) går att beräkna.

**Förra veckans bubblare:** **SF.ST** – RANKAD UNDER (kvar som bubblare; rörelsen redan inträffad, ingen färsk katalysator, teknik ej beräkningsbar). **HNSA.ST** – STRUKEN (katalysatorn, FDA-beslutet, infaller 2026-12-19 och ligger utanför varje swinghorisont; poppen har rullat tillbaka −9,09 %). **KOG.OL** – RANKAD UNDER (kvar som bubblare; klarar tekniken men saknar egen katalysator och dubblar Saabs sektorrisk). **BOOZT.ST** – STRUKEN (RSI 79,1 utan exceptionell katalysator, och kursen 167,40 ligger över SEB:s TP 163 kr). **SCA-B.ST** – STRUKEN (målet ej nåbart enligt punkt 6: tak 5,43 % mot kostnadströskelns krav på 6,0 %).
**Villkorade bubblar-planer:** Inga. Regeln (punkt 4b) kräver ett entry-villkor mot **verifierad** kurs plus fullständiga nivåer. De tre nya bubblarna saknar verifierad kurs och kan därför inte få en pending-rad; KOG.OL och SF.ST saknar katalysator respektive beräkningsbar teknik och ska inte heller ha en. Att lägga en plan utan verifierat entry hade dessutom aktiverat intradag-monitorn på en nivå som ingen kunnat kontrollera.

## Veckans radar (kommande 5 handelsdagar)
* **Måndag 3/8** – **Servana AB: delårsrapport två 2026** (MFN 2026-08-03 06:30 UTC; datumet tidigarelades, meddelat via MFN 2026-07-31 15:40) – ingen direkt påverkan på casen, men den enda daterade rapporten i flödet just nu.
* **Måndag 3/8** – **Aino Health AB** och **PixelFox AB** publicerar delårsrapport/kvartalsrapport två 2026 (MFN 2026-08-03 06:15–06:30 UTC) – småbolag, ingen påverkan på casen.
* **Måndag 3/8** – Svenskt inköpschefsindex industri **55,8 för juli**, ned från högre nivå men fortsatt över 50 (Swedbank/Silf via MFN 2026-08-03 06:30) – nedväxling i industrin är motvind för verkstad/cykliskt, neutral för försvar.
* **Löpande v32** – **Nordens Large/Mid Cap-rapportsäsong är i praktiken avslutad.** Den tunga veckan var 14–17 juli (Ericsson, SEB, Handelsbanken, Nordea, Investor, Atlas Copco, Volvo, Sandvik, Telia, Swedbank och Saab), och Evolution rapporterade 17/7 (källa: Evolution IR). **Ingen namngiven nordisk storbolagsrapport med verifierat datum infaller inom de kommande 5 handelsdagarna** – underlaget är dock begränsat, se åtgärdspunkt 2. Nästa daterade hållpunkt är **Boozt (BOOZT.ST) full Q2-rapport 2026-08-14** (uppgift från veckorapport-260727, ej omverifierad denna körning).
* **Löpande v32** – freds- och geopolitiknarrativet kring försvar är den enda variabel som direkt kan punktera Saab-tesen; följs dagligen i LÄGE B. Riksbanken nästa besked **2026-08-20**, inga centralbanksbesked inom fönstret.

---

## Åtgärdspunkter till Dren (L-3 – namngiven defekt, fil/fält och kvantifierat omfång)

1. **`state/prices.json` var 56 timmar gammal när körningen startade – de schemalagda Actions hade inte utlösts.** Filen låg på `generatedAt` 2026-07-31T22:14:33Z och saknade `schemaVersion`; `state/news_feed.json` låg på 2026-07-31T22:17:09Z. Cronen i `prices.yml` (`0 5 * * 1-5` och `0 6 * * 1-5`) och i `news.yml` (`17 5-21/2 * * 1-5`) borde ha kört 05:00, 05:17 och 06:00 UTC i dag – ingen av dem gjorde det, och sista lyckade körning var fredag 22:14 UTC. Båda workflowsen står som `state: active`, så det är inte fråga om GitHubs 60-dagars-avstängning. **Denna körning startade båda manuellt via workflow_dispatch**, vilket löste problemet direkt: nya filer skrevs 2026-08-03 06:45 UTC med 41/41 tickers hämtade. **Omfång: 2 workflows, 3 uteblivna schemalagda körningar.** Åtgärd: kontrollera om schemalagda körningar fortsätter utebli under veckan – blir det ett mönster behöver cronen ses över.
2. **`state/news_feed.json` är ett ögonblicksfönster, inte fem handelsdagar – vilket punkt 1g0 förutsätter.** Den färska filen innehåller 88 poster, samtliga från **2026-08-03 05:58–06:45 UTC**, dvs. 47 minuter. Fredagsversionen innehöll 258 poster varav 254 från 2026-07-31 och 4 från 2026-07-30. Prompten kräver en genomgång av "de senaste 5 handelsdagarna"; filen kan strukturellt inte leverera det, eftersom varje hämtning skriver över med de senaste ~20–48 posterna per flöde. Denna körning kringgick det genom att läsa **båda** versionerna (den färska plus fredagsversionen ur `git show 57e4fea:state/news_feed.json`) – därav 8 nyhetsdrivna kandidater i stället för 5. **Omfång: 6 flöden, fönster ~47 minuter mot krävda 5 handelsdagar.** Åtgärd: låt `fetch-news.mjs` ackumulera poster i stället för att skriva över, med avdrag för dubbletter på URL och en bortre gräns på t.ex. 10 handelsdagar. Detta är **ÅTERKOMMANDE** i den meningen att varje rotation sedan flödet infördes har haft samma begränsning.
3. **`state/price_history.json` rymmer 16 sessioner – de tekniska filtren och regimfiltret kräver mer.** Djupaste serierna har 16 daterade stängningar, de grundaste 1 (`XACT-OMXS30.ST` har 2, `HCA`/`MS`/`NOC`/`WFC` har 1). Konsekvenser denna körning: (a) **MA100 för `^OMX` kunde inte beräknas** ⇒ regimfiltret i punkt 2b gick inte att mäta och tillämpades i sin strängare riktning; (b) **MACD (kräver ~35 stängningar) och EMA20/50/200 kunde inte beräknas för någon ticker**; (c) **RSI(14) kunde beräknas för 6 av 10 nordiska kandidater** – SF.ST, HNSA.ST och SCA-B.ST har bara 5–6 stängningar. Punkt 2 i LÄGE A kräver "faktiska värden" för alla tre. **Omfång: 3 av 5 indikatorer i det tekniska filtret är omätbara, för samtliga 45 symboler i filen.** Åtgärd: höj retentionen i `fetch-prices.mjs` till minst 120 handelsdagar, eller backfylla en gång ur en historisk källa. Detta är den enskilt största begränsningen i urvalsarbetet just nu.
4. **Bekräftat åtgärdat: `previousClose`-felet.** CLAUDE.md punkt 2 bad om verifiering i dag. Den gamla filen (utan `schemaVersion`) hade fel `previousClose` för **29 av 34 jämförbara tickers** – för `SAAB-B.ST` stod 601,00, vilket är stängningen 2026-07-27, fyra sessioner bakåt, och gav "dagsrörelsen" −0,52 % när den verkliga var +1,12 %. Den nya filen bär `schemaVersion: "2026-08-02-prevclose"` och `previousClose` stämmer nu mot `price_history.json` för samtliga kontrollerade tickers. Rättelsen är därmed **verifierad mot en fil som faktiskt bär fältet** – till skillnad från slutsatsen 2026-08-01, som drogs ur en fil utan `schemaVersion` och blev fel.
5. **Bekräftat åtgärdat: prnewswire-flödet.** `feeds`-fältet visade `"prnewswire": "HTTP 404"` i fredagsfilen; i den färska filen står `"20 poster"`. Flödet lever. Det var också det flöde som levererade veckans starkaste nya kandidat (ASSA ABLOY).
6. **`state/movers.json` är en dag för gammal.** `asOf` står på 2026-07-30, medan förra handelsdagen var 2026-07-31. `movers.yml` kör lördag 06:00 UTC och läser då fredagens data, men filen genererades 2026-08-01T22:44:58Z med torsdagsstängningar. **Omfång: 1 fil, 17 rader, samtliga daterade 2026-07-30.** Rörelsesiffrorna missar alltså fredagens session. Åtgärd: kontrollera varför lördagskörningen hämtar torsdagens stängning i stället för fredagens.
7. **Åtgärdat i denna körning: `tests/run.mjs` föll på den första äkta beslutsraden.** Assertionen "alla backfyllda rader är märkta med source" kontrollerade i själva verket att **samtliga** rader i `state/decisions.json` var backfyllda (`filter(...).length === decisions.length`). Det stämde bara så länge filen enbart innehöll rekonstruktionen från 2026-07-31, och testet var därmed garanterat att falla första gången en routine appendade en riktig rad – exakt det CLAUDE.md punkt 2 efterfrågade i dag. Eftersom testet körs i CI (`test.yml`) hade varje framtida rotation blockerats. Assertionen mäter nu det namnet lovar: de sex rekonstruerade raderna är kvar och märkta, och ingen rad bär en annan source-stämpel. **Omfång: 1 assertion, som annars hade brutit CI vid varje rotation från och med i dag.** Hela sviten går igenom: 368 passed, 0 failed.
8. **Mindre: fältetiketten i `assets/vparse.js` matchar inte mallen.** `parseWeekly` (rad 290) läser `field(md, "Veckans portföljutfall (50/50)")` medan `templates/vecko_rapport.md` rad 13 och de två senaste veckorapporterna skriver "Veckans portföljutfall (viktat)". Fältet blir därför alltid tomt för nya rapporter. **Omfång: 2 av 5 veckorapporter matchar den gamla etiketten.** Ingen synlig effekt i dag eftersom `facit.outcome` inte används av vare sig `vrender.js` eller `build-dashboard.mjs` – men fältet är död kod tills etiketten rättas eller läsningen tas bort.

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
