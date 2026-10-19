# Veckorapport: Nordisk Rotation
**Vecka:** v 43 | **Datum:** 2026-10-19
**Marknadsklimat:** OMXS30 (`^OMX`) stängde fredag **3 296,8425** (`state/prices.json`, source "Yahoo Finance (chart API)", marketTime 2026-10-16T15:35:00Z), **+0,83 %** mot förra rotationens bas (måndag 2026-10-12: 3 269,7925), med ett dyk till 3 256,08 (15/10) och en stark fredag (+1,25 %). **Regimfiltret är PÅ:** 3 296,8425 ligger **+4,87 %** över MA200 **3 143,8063** (200 daterade stängningar ur `state/price_history.json`, serien bär 250 punkter). Spärren binder vid ett fall till 3 143,81. Nya positioner är tillåtna. Veckans tema var rapportsäsongen: **Ericsson** steg omkring 11 % på Q3-rapporten 15/10 (organisk tillväxt 7 %, försäljning 59,5 mdr SEK; Ericssons pressmeddelande 2026-10-15, RTTNews 2026-10-15). **Nordisk medvind:** telekomutrustning (ERIC-B.ST), försvar (SAAB-B.ST **+8,42 %**, KOG.OL +6,74 %), dansk medicinteknik (COLO-B.CO +8,33 %) och Electrolux (ELUX-B.ST **+10,53 %**). **Nordisk motvind:** tank och torrbulk vände ned efter förra veckans rusning (HSHP.OL **−13,29 %**, FRO.OL −8,20 %, HAFNI.OL −8,18 %), fastigheter med svag balansräkning (SBB-B.ST −11,24 %), Nokia (NOKIA.HE −9,54 % inför Q3 22/10) och Nordea (NDA-SE.ST −5,85 %). Makro: ECB:s nästa räntebesked är **29/10** och Riksbankens **4/11** (Morningstar och EFN, centralbankskalendrar 2026), alltså inget besked inom fönstret. Ingen fil i repot bekräftar datumen, se åtgärdspunkten nedan.

**DATAFÄRSKHET.** `state/prices.json` `generatedAt` **2026-10-16T23:34:06Z**, `schemaVersion` "2026-08-02-prevclose", `wideAt` 2026-10-16T09:44:28Z. **Måndagens två förbörskörningar (cron `9 5` och `9 6` UTC) har INTE startat** – kontrollerat mot `origin/main` 06:42 UTC, senaste kurscommit är fredag 23:34 UTC. Det gör inget för beslutsunderlaget: börserna har inte öppnat och fredagens stängningar (marketTime 2026-10-16 14:25–15:35 UTC) är senaste handelsdagens stängning, alltså godkända enligt datakraven. Men 55 av 167 nordiska serier saknar rad i `prices.json` (se åtgärdspunkten). `state/news_feed.json` `generatedAt` 2026-10-16T23:38:45Z, fönstret bär **10 av 10 handelsdagar** (2026-10-05 → 2026-10-16, `missingDays` tomt). `state/alerts.json` `checkedAt` 2026-10-16T20:33:33Z, `active` tom. Det är fredagskvällens sista monitorkörning, så monitorn lever. **Fantompunktskontroll:** 8 av 275 serier i `state/price_history.json` upprepar sin föregående stängning (2,9 %), normal nivå. RSI/MACD/EMA är räknade på råserien. Indikatorerna räknas med EMA som startar på ett enkelt medelvärde och RSI med Wilder-utjämning. Enskilda decimaler kan skilja sig från tidigare rapporter (`ema200-value-not-reproducible`), men ingen grind avgörs av en sådan skillnad.

---

## 0. Facit: Förra veckans val
| Aktie | Entry | Exit | Utfall | Stop/Mål träffad? |
|---|---|---|---|---|
| XACT-OMXS30.ST | 494,60 | 490,35 (öppen) | −0,86 % | Nej (sleeven har varken stop eller mål) |

**Veckans portföljutfall (viktat):** **+0,48 %.** Boken låg 100,0 % i indexsleeven hela perioden. XACT-OMXS30.ST gick från 488,00 (2026-10-12) till **490,35** (`state/prices.json`, source "Yahoo Finance (chart API)", marketTime 2026-10-16T15:24:18Z). `^OMX` steg +0,83 % under samma period. Skillnaden är fondens spårning, inte ett urval. Siffrorna är brutto; dashboardens nettosiffra drar rundturskostnaden, men inga affärer gjordes. Ingen pending-plan låg öppen under veckan. LÄGE B prövade LUG.ST tre gånger (14–16/10) och lade ingen plan, med grind 2 och sedan villkor (3) som skäl. LUG.ST stängde fredag på **676,20 SEK** (marketTime 2026-10-16T15:29:36Z), +2,7 % över tisdagens 658,20. Det noteras som facit, inte som skäl att ändra volymkravet (`grind2-volume-threshold-uncalibrated` är redan öppen).
**Ackumulerad avkastning sedan strategistart:** **−2,17 %**, oförändrad. Två affärer har stängts sedan skarp start 2026-08-10: ASSA-B.ST −3,26 % (vikt 25 %) och SALM.OL −5,48 % (vikt 25 %), kedjat 0,991856 × 0,986291 = 0,978258. Sleevens orealiserade rörelse ingår inte i fältet.
**Portföljallokering denna vecka:** **100,0 % indexsleeve (XACT-OMXS30.ST) + 0 % kassa.** Alla fyra aktieplatser står tomma, eftersom inget case klarade alla fem grindar (se nedan). Kapitalet ligger i index, aldrig på konto.
**Lärdom:** Veckans tydligaste case, ERIC-B.ST med Q3-rapporten 15/10, föll på grind 1. Orsaken var inte att systemet missade bolaget: retron lade det i watchlisten 17/10, men ingen kurskörning har gått sedan dess. Bevakning som läggs på en lördag hinner inte prissättas före måndagens rotation när förbörskörningarna uteblir. Volymkravet fällde återigen de tekniskt hela namnen (SAAB-B.ST 1,47×, KOG.OL 1,25×), och de tre som klarade grind 2 (ELUX-B.ST, TRUE-B.ST, EKTA-B.ST) saknar daterad katalysator. Tillämpade lärdomar: **L-1** och **L-5** (rapportkalendern i radarn med täckning), **L-2** (varje bubblare har rad i watchlisten och ELUX-B.ST läggs till i dag), **L-3** (fyra datadefekter eskaleras nedan, tre ÅTERKOMMANDE), **L-4** (ingen kandidat vilar på en tillfällig dataspärr med giltig `expiresAt`, och `state/scout_candidates.json` bär noll nordiska poster med `status: "new"`), **L-6** (ingen kandidat struken på universumregel), **L-7** (rörelsegenomgången rangordnad ur prishistoriken) och **L-8** (inga indexöversyner hittades, se radarn).

### Bred scanning – varifrån bruttolistan kom

**Bruttolistan omfattar 22 kandidater:**
- **6 ur nyhetsflödet** (punkt g0): SAAB-B.ST, ASSA-B.ST, ZEAL.CO, LUMI.ST, NP3.ST, XBRANE.ST.
- **5 bubblare från v42**: CHEMM.CO, LUG.ST, VITR.ST, KCC.OL, GMAB.CO.
- **11 ur egen scanning** av veckans rörelser och den tekniska filtreringen: ERIC-B.ST, ELUX-B.ST, DOM.ST, PARKEN.CO, TRUE-B.ST, EKTA-B.ST, KOG.OL, CARL-B.CO, COLO-B.CO, DEMANT.CO, BWE.OL.

Nyhetsfönstret bar **10 av 10 handelsdagar** (`window.tradingDaysCovered`).

**Veckans rörelser (punkt g1, enligt L-7).** Rangordningen bygger på `state/price_history.json`. Den omfattar **164 nordiska symboler** (.ST/.OL/.CO/.HE) som har daterad stängning både på basdagen **2026-10-09** och på mätdagen **2026-10-16**, av 167 nordiska serier. `state/movers.json` har `asOf` **2026-10-16**, samma dag som mätdagen, och används som komplement. Dess tio rader (DOM.ST, SBB-B.ST, ELUX-B.ST, ORNBV.HE, ERIC-B.ST, NOKIA.HE, JM.ST, SAAB-B.ST, COLO-B.CO, FRO.OL) finns alla med i prishistorikens rangordning.
- **Störst uppåt:** PARKEN.CO +16,67 %, DOM.ST +15,00 %, FLEXQ.ST +12,95 %, ELUX-B.ST +10,53 %, ERIC-B.ST +8,88 %, ORNBV.HE +8,61 %, SAAB-B.ST +8,42 %, COLO-B.CO +8,33 %.
- **Störst nedåt:** HSHP.OL −13,29 %, NAPA.OL −11,70 %, SBB-B.ST −11,24 %, ALVO-SDB.ST −10,68 %, NOKIA.HE −9,54 %, NYKD.OL −9,16 %, FRO.OL −8,20 %, HAFNI.OL −8,18 %.

**Förbehåll:** för symbolerna utan rad i `prices.json` (bland dem DOM.ST, ERIC-B.ST och ORNBV.HE) är mätdagens punkt den breda körningens intradagsvärde från 09:44 UTC, inte en stängning. `movers.json` anger ERIC-B.ST till +10,08 % mot prishistorikens +8,88 % av just det skälet (`history-point-not-a-close-for-wide-symbols`). Nordiska namn utanför prishistoriken är **OKONTROLLERADE** (L-5).

**Nyhetsflödets nordiska poster i femdagarsfönstret (2026-10-12 – 2026-10-16):**
- **Saab:** första GlobalEye överlämnad till Sverige (MFN 2026-10-15T16:00Z). Det är en leverans inom en befintlig order, inte en ny order. Saab steg +3,46 % (15/10) och +2,94 % (16/10).
- **ASSA ABLOY:** säljer HID:s PKI-enhet (IdenTrust, HydrantID, ZeroSSL) till Vista Equity Partners. Försäljningen 2025 var cirka 58 MUSD (cirka 570 MSEK) och stängningen väntas under Q4 (MFN 2026-10-16T16:00Z; bolagets pressmeddelande via Cision). Affären är liten mot koncernens storlek.
- **Lundin Mining:** förhandsbesked inför Q3 (MFN 2026-10-15T21:30Z; bolagets pressmeddelande via Cision). Det innehåller cirka +51 MUSD i provisoriska prisjusteringar (koppar), cirka 66 MUSD i standbykostnader vid Caserones efter vinterstormar och cirka 9 MUSD i förluster på guldderivat. Q3-rapporten kommer 4/11.
- **NP3 Fastigheter:** förvärvar fastigheter för 286 MSEK (MFN 2026-10-14T17:22Z).
- **Xbrane Biopharma:** pivotalstudien för Xdivane är fullrekryterad (MFN 2026-10-13T16:48Z).
- **Zealand Pharma:** samarbets- och licensavtal med Generate Biomedicines om AI-designade proteinläkemedel (MFN 2026-10-13T20:30Z).
- **Övrigt, ej kandidater:**
  - Negativa besked eller kapitalanskaffning: Oncopeptides riktade emission på 100 MSEK, Gaming Corps riktade emission, InCoax och PolarCool med företrädesemissioner, Modus Therapeutics pausar fas IIa och Nordic Mining med uppdatering om finansiell situation.
  - Ingen köpbar uppsida: Emilshus nya utdelningspolicy, Techstep (prospekt och preliminära Q3-siffror), flaggningar i AcadeMedia, Loomis, INVISIO och Sveafastigheter samt FRO:s årsstämma.

**⚠️ ÅTGÄRDSPUNKT TILL DREN (L-3) – ÅTERKOMMANDE: måndagens schemalagda kurs- och nyhetskörningar har inte startat.**
- **Fil och fält:** `state/prices.json` `generatedAt` 2026-10-16T23:34:06Z och `state/news_feed.json` `generatedAt` 2026-10-16T23:38:45Z. Ingen commit från `prices.yml` (cron `9 5 * * 1-5` och `9 6 * * 1-5`) eller `news.yml` (cron `17 5-21/2 * * 1-5`) syns på `main` före 06:42 UTC.
- **Omfång:** 2 av 2 förbörskörningar i `prices.yml` och 1 av 1 i `news.yml`.
- **Konsekvens:** ERIC-B.ST, som retron lade i watchlisten 17/10, har ännu ingen kurs. Den breda hämtningen av moversuniversumet har inte gjorts för dagen.
- **Ersättningskälla:** fredagens stängningar, som är giltiga före öppning. Reservkällorna Yahoo och stooq nekas av den här körmiljöns nätproxy.
- **Status:** redan öppen i `state/action_items.json` som `scheduled-actions-not-firing`.

**⚠️ ÅTGÄRDSPUNKT TILL DREN (L-3) – ÅTERKOMMANDE: moversuniversumets symboler saknas i `state/prices.json` efter de smala körningarna.**
- **Fil och fält:** `state/prices.json` `quotes`.
- **Omfång:** **55 av 167** nordiska serier i `state/price_history.json` saknar rad i den aktuella filen. Deras senaste historikpunkt (2026-10-16) är den breda körningens intradagsvärde och deras senaste volympunkt är en halv session. Volymkvoterna blir därför systematiskt för låga, till exempel ERIC-B.ST 0,33×.
- **Konsekvens i veckan:** 5 av 22 bruttokandidater föll på grind 1. Av dem är DOM.ST och ERIC-B.ST veckans näst största och femte största rörelse.
- **Status:** redan öppen som `wide-fetch-not-last-run-of-day`, `history-point-not-a-close-for-wide-symbols` och `volume-point-is-half-session-for-wide-symbols`.

**⚠️ ÅTGÄRDSPUNKT TILL DREN (L-3) – ÅTERKOMMANDE: nyhetsflödena `globenewswire` och `globenewswire-earnings` svarar fortfarande HTTP 403.**
- **Fil och fält:** `state/news_feed.json`, `feeds.globenewswire` = "HTTP 403 – båda försöken (0.0 s)", och `feeds.globenewswire-earnings` har samma status.
- **Omfång:** 2 av 6 flöden, tredje veckan i rad.
- **Ersättningskälla:** MFN-flödet och websök.
- **Status:** redan öppen som `news-feed-globenewswire-http-403`.

**⚠️ ÅTGÄRDSPUNKT TILL DREN (L-3): dygnstaket och makrokalendern, två kvarstående luckor.**
- **MFN-flödets dygnstak:** `items` med `src: "mfn"` 2026-10-12 – 2026-10-16 har sin tidigaste post kl. **15:45 UTC**. Den nordiska handelssessionens meddelanden saknas alltså fortfarande. Status: öppen som `news-window-daily-cap-drops-morning-posts`.
- **Makrokalendern:** ECB 29/10 och Riksbanken 4/11 är verifierade endast genom websök. Ingen fil i `state/` bär en makrokalender. Status: öppen som `macro-calendar-not-verifiable-from-state`.

**Likviditetsgolvet** räknas som 20-dagarssnittet av volymen ur `state/volume_history.json` gånger verifierad kurs. För `.OL`/`.CO`/`.HE` anges talet i lokal valuta eftersom växelkurser saknas (`fx-rates-missing-eur-dkk-nok`). Utom för PARKEN.CO (1,3 MDKK/dag, långt under golvet i vilken växelkurs som helst) ligger alla kandidater så långt från golvet att växelkursen inte avgör.

---

## Case: INGA NYA VALDA DENNA VECKA

**Noll av 22 bruttokandidater passerade alla fem grindar. Boken öppnar ingen position, och alla fyra platser ligger kvar i indexsleeven (100,0 %).** Grinden som loggas är den första som fäller kandidaten i ordningen 1 → 5 (se `gate-assignment-ambiguous`). Oberoende fall på senare grindar anges i texten.

| Grind | Fäller (primärt) | Andel |
|---|---|---|
| 1 – verifierad kurs med källa + tidsstämpel | 5 | 23 % |
| 2 – teknisk filtrering (RSI/MACD/EMA/volym/likviditet) | 14 | 64 % |
| 3 – namngiven, bekräftad och daterad katalysator | 3 | 14 % |
| 4 – R/R ≥ 2:1 och kostnadströskel ≥ 6 % | 0 | – |
| 5 – nåbarhetstak | 0 | – |
| **Jämförelse v42** | grind 1: 4, grind 2: 13, grind 3: 2 av 19 | – |

### Föll på grind 1 – kurs saknas (5 st)
Ingen av dem har en rad i `state/prices.json`. LUMI.ST, NP3.ST, XBRANE.ST och DOM.ST läggs i `config/watchlist.txt` i denna körning (punkt 6b). ERIC-B.ST har haft en rad där sedan 2026-10-17.

| Ticker | Bolag | Katalysator (datum, källa) | `catalystType` |
|---|---|---|---|
| ERIC-B.ST | Ericsson | Q3-rapport: organisk tillväxt 7 %, försäljning 59,5 mdr SEK, cirka +11 % på dagen (Ericssons pressmeddelande 2026-10-15; RTTNews 2026-10-15) | earnings |
| LUMI.ST | Lundin Mining | Förhandsbesked Q3: +51 MUSD prisjustering, 66 MUSD standbykostnad (MFN 2026-10-15T21:30Z) | earnings |
| NP3.ST | NP3 Fastigheter | Fastighetsförvärv 286 MSEK (MFN 2026-10-14T17:22Z) | order |
| XBRANE.ST | Xbrane Biopharma | Xdivane-pivotalstudien fullrekryterad (MFN 2026-10-13T16:48Z) | regulatory |
| DOM.ST | Dometic | +15,00 % på veckan utan hittad daterad händelse (websök) | other |

**ERIC-B.ST är veckans starkaste kandidat.** Katalysatorn är bolagsbekräftad och kvantifierad. Den indikativa tekniken ur prishistoriken är hel trots att sista punkten är ett intradagsvärde: RSI 66,3, MACD-histogram 1,06 → 1,31, kurs 104,50 över EMA20 97,09, EMA50 97,50 och EMA200 99,59, och omsättningen ligger runt en miljard SEK per dag. Kandidaten förs upp som bubblare. Rapporten anger **saknad verifierad kurs som enda skäl**, så LÄGE B-regelns villkor (1) gäller ERIC-B.ST så länge katalysatorn ligger inom 5 handelsdagar, det vill säga till och med sessionen 2026-10-21. Nivåerna sätts mot den första verifierade kursen, aldrig mot intradagspunkten.

### Passerade grind 1 och 2, föll på grind 3 (3 st)
| Ticker | Kurs (marketTime 2026-10-16) | Veckan (rang/164) | RSI | MACD-hist | Volymkvot | Omsättning/dag | Spärr |
|---|---|---|---|---|---|---|---|
| ELUX-B.ST | 27,60 SEK | +10,53 % (4) | 60,9 | 0,260 → 0,343 | 1,61× | 57,4 MSEK | Grind 3: ingen daterad bolagshändelse i fönstret (websök: senaste är Q2-rapporten 29/7). Kursen ligger över EMA20 26,01 och EMA50 26,96 men långt under EMA200 42,68, och sexmånadersmomentum är −55,4 % efter företrädesemissionen i våras, vilket är en varning enligt punkt 0a. Q3-rapportens datum är obekräftat (23/10 eller 28/10 enligt två källor) och saknas i `state/earnings_calendar.json`. |
| TRUE-B.ST | 24,38 SEK | +5,59 % | 62,7 | 0,050 → 0,104 | 1,71× | 48,9 MSEK | Grind 3: bara det löpande återköpsprogrammet sedan juni (veckovisa MFN-meddelanden), ingen färsk katalysator. Hel EMA-stack 22,95 > 21,69 > 18,95. Q3 3/11 (`isEstimate: false`). |
| EKTA-B.ST | 57,05 SEK | +4,78 % | 71,7 | 0,360 → 0,427 | 1,90× | 63,1 MSEK | Grind 3: ingen daterad bolagshändelse hittad (websök). RSI 71,7 ligger strax över idealbandet, och EMA50 52,79 ligger under EMA200 53,46. Nästa rapport 25/11 enligt Affärsvärlden. |

### Föll på grind 2 (14 st)
| Ticker | Kurs (marketTime 2026-10-16) | Veckan | Spärr |
|---|---|---|---|
| SAAB-B.ST | 650,20 SEK | +8,42 % (7) | **Volymkvot 1,47×** (1 678 028 mot 20-dagarssnitt 1 142 714) mot kravet 1,5×. Övrig teknik är hel: RSI 62,7, MACD-histogram 1,41 → 3,73, kurs > EMA20 613,28 > EMA50 609,12 > EMA200 593,78, 743 MSEK/dag. Katalysatorn (GlobalEye-leveransen, MFN 15/10) är en leverans och ingen ny order. **Spärr 2e oberoende av detta:** Q3-rapporten kommer 23/10 (`isEstimate: false`), och ett case med 3–6 veckors horisont köps aldrig in i en rapport. |
| ASSA-B.ST | 359,50 SEK | +3,10 % | **Volymkvot 0,93×.** RSI 59,7, MACD-histogram 0,28 → 0,80, kurs över alla tre EMA. PKI-avyttringen är för liten för att bära ett case. |
| ZEAL.CO | 226,30 DKK | −4,92 % | **RSI 25,2.** Kursen ligger under EMA20 251,56, EMA50 273,56 och EMA200 336,23, och MACD är negativt. Licensavtalet vände inte trenden. |
| CHEMM.CO | 569,00 DKK | −2,98 % | **Volymkvot 0,43×** och MACD-histogram 1,42 → 0,16, alltså avtagande. Återköpet från 12/10 ligger nu utanför femdagarsfönstret. |
| LUG.ST | 676,20 SEK | +2,80 % | **Volymkvot 1,31×** (135 735 mot 103 454), och EMA50 634,11 ligger under EMA200 665,65. Grind 3 dessutom: produktionsbeskedet 8/10 ligger utanför fönstret. |
| VITR.ST | 98,15 SEK | +2,67 % | **Volymkvot 0,49×** och avtagande MACD-histogram (0,619 → 0,577). Spärr 2e: Q3-rapport 22/10. |
| KCC.OL | 104,20 NOK | −1,14 % | **MACD-histogram 0,082 → −0,021**, en negativ korsning, och volymkvot 0,71×. |
| GMAB.CO | 2 502,00 DKK | +2,33 % | **Volymkvot 0,72×** och MACD-histogram 9,34 → 7,18, alltså avtagande. Fas 3-beskedet 5/10 ligger utanför fönstret. |
| PARKEN.CO | 238,00 DKK | +16,67 % (1) | **Likviditetsgolvet: 1,3 MDKK/dag.** RSI 75,2. Ingen daterad händelse hittad. |
| KOG.OL | 315,30 NOK | +6,74 % | **Volymkvot 1,25×** trots färsk bullish MACD-korsning (−0,87 → 0,36). EMA20 305,75 ligger under EMA50 308,13. Q3 29/10. |
| CARL-B.CO | 938,60 DKK | +7,42 % | **RSI 72,5** och volymkvot 1,02×. Ingen daterad händelse. |
| COLO-B.CO | 472,20 DKK | +8,33 % (8) | **RSI 74,6** och volymkvot 0,73×. Rapport 3/11. |
| DEMANT.CO | 358,80 DKK | +5,16 % | **RSI 78,5** och avtagande MACD-histogram, så rörelsen är gjord. |
| BWE.OL | 68,50 NOK | +7,20 % | **RSI 75,1**, volymkvot 0,94× och platt MACD-histogram (0,947 → 0,928). Q3 29/10. |

### Grind 4/5
Ingen kandidat nådde grind 4 primärt, och därför räknas inga nivåer. Bokens beslutsstatistik citeras inte i veckan: `state/decision_eval.json` bär inget tal som klarar `MIN_CLUSTERS`, och ett tal utan `effectiveN` vore ofärdigt. **L-4:** ingen nordisk kandidat vilar på en tillfällig dataspärr med giltig `expiresAt`, eftersom `state/scout_candidates.json` bär noll nordiska poster med `status: "new"`.

---

## Bubblare (watchlist inför nästa vecka)
1. **ERIC-B.ST** – Q3-rapport 15/10 med bekräftad tillväxt, indikativt hel teknik och omsättning runt en miljard SEK per dag. Fälld **enbart på saknad verifierad kurs**. Raden finns i watchlisten sedan 17/10. LÄGE B-regelns villkor (1) gäller till och med sessionen 21/10.
2. **TRUE-B.ST** – klarar grind 2 fullt ut (volymkvot 1,71×, hel stack) men saknar katalysator. Rad finns i watchlisten.
3. **ELUX-B.ST** – klarar grind 2 (volymkvot 1,61×, stigande MACD) men saknar katalysator, och den långa trenden är negativ. Läggs i watchlisten i dag (L-2).
4. **SAAB-B.ST** – hel stack och stigande MACD, men volymkvoten är 1,47× och Q3-rapporten kommer 23/10 (spärr 2e). Kan prövas igen som rekyl-setup efter rapporten. Rad finns i watchlisten.
5. **KOG.OL** – färsk MACD-korsning och kurs över EMA200, men volymkvoten är 1,25× och ingen ny händelse finns. Q3 29/10. Rad finns i watchlisten.

Alla fem utom ERIC-B.ST har verifierad kurs i `state/prices.json`. ERIC-B.ST saknar kurs eftersom ingen kurskörning har gått sedan raden lades (åtgärdspunkten ovan).

**Förra veckans bubblare:**
- **CHEMM.CO** – STRUKEN (grind 2: volymkvot 0,43×, MACD avtar; återköpet utanför fönstret).
- **LUG.ST** – STRUKEN (grind 2: volymkvot 1,31×, EMA50 under EMA200; produktionsbeskedet utanför fönstret).
- **VITR.ST** – STRUKEN (grind 2: volymkvot 0,49×; spärr 2e före Q3 22/10).
- **KCC.OL** – STRUKEN (grind 2: negativ MACD-korsning).
- **GMAB.CO** – STRUKEN (grind 2: volymkvot 0,72×, MACD avtar).

**Villkorade bubblar-planer:** **Inga.** Punkt 4b kräver fullständiga nivåer och ett entry-villkor mot verifierad kurs för en bubblare som i övrigt håller.
- TRUE-B.ST och ELUX-B.ST faller på grind 3.
- SAAB-B.ST och KOG.OL faller på grind 2.
- ERIC-B.ST saknar just den verifierade kurs som nivåerna ska sättas mot.

## Veckans radar (kommande 5 handelsdagar)
* **Tisdag 20/10** – **Scandi Standard (SCST.ST)** Q3-rapport (`state/earnings_calendar.json`, `isEstimate: false`).
* **Onsdag 21/10** – **HMS Networks (HMS.ST)**, **MIPS (MIPS.ST)**, **SKF (SKF-B.ST)** och **Ringkjøbing Landbobank (RILBA.CO)** Q3-rapporter (`isEstimate: false`). Det är också sista sessionen i ERIC-B.ST:s femdagarsfönster.
* **Torsdag 22/10** – **Nokia (NOKIA.HE)**, **Vitrolife (VITR.ST)**, **Hemnet (HEM.ST)**, **Sagax (SAGA-B.ST)**, **Logistea (LOGI-B.ST)**, **Eastnine (EAST.ST)** och **Kongsberg Automotive (KOA.OL)** (`isEstimate: false`).
* **Fredag 23/10** – **Saab (SAAB-B.ST)**, **SCA (SCA-B.ST)**, **AAK (AAK.ST)**, **Evolution (EVO.ST)** och **Hoist Finance (HOFI.ST)** (`isEstimate: false`). Electrolux (ELUX-B.ST) möjligen 23/10 enligt Affärsvärlden; en annan källa anger 28/10, så datumet är obekräftat.
* **Inom 10 handelsdagar:**
  * **Tisdag 27/10:** Sobi (SOBI.ST), Gränges (GRK.HE) och KCC (KCC.OL).
  * **Onsdag 28/10:** Equinor (EQNR.OL), Fortum (FORTUM.HE) och UPM (UPM.HE).
  * **Torsdag 29/10:** Kongsberg (KOG.OL), BW Energy (BWE.OL), Neste (NESTE.HE) och Paradox (PDX.ST).
  * **Fredag 30/10:** AstraZeneca (AZN.ST) och Loomis (LOOMIS.ST).
* **Makro:** ECB-besked **29/10** och Riksbanken **4/11** enligt websök (Morningstar, EFN). Inget centralbanksbesked infaller inom femdagarsfönstret. Övrig makrodata är OKONTROLLERAD (åtgärdspunkt ovan).

**⚠️ TÄCKNINGSANGIVELSE ENLIGT L-1 OCH L-5.** Rapportuppräkningen ovan vilar på `state/earnings_calendar.json` (`generatedAt` 2026-10-16T09:43:01Z, `counts.resolved` **177 symboler**, `failed` 0, `noCoverage` 10), kompletterad med websök för Electrolux och Elekta. Alla namngivna rapportörer med bekräftat datum har rad i `config/watchlist.txt` eller hämtas redan av `prices.yml`; ELUX-B.ST läggs till i dag. **Nordiska Large/Mid Cap-bolag utanför kalenderns symboler är OKONTROLLERADE.** Q3-säsongen pågår veckorna 43–44 (Volvo, Atlas Copco, ASSA ABLOY, Sandvik och storbankerna brukar rapportera då), men inga sådana datum går att verifiera ur källor körningen når. **L-8:** ingen indexöversyn med beslut och ikraftträdande inom fönstret hittades. Websök efter STOXX-, MSCI- och OMXS30-översyner gav bara STOXX-strategiindexens ändringar som trädde i kraft 2026-09-21, alltså utanför horisonten. `state/news_feed.json` gav inga index-träffar bland fönstrets nordiska poster. Indexleverantörernas primärkällor täcks inte av någon fil i repot och är därmed **OKONTROLLERADE**.

---

## Bruttolista – samtliga 22 kandidater, loggade som AVVAKTA i `state/decisions.json`
- **Grind 1:** ERIC-B.ST, LUMI.ST, NP3.ST, XBRANE.ST, DOM.ST.
- **Grind 2:** SAAB-B.ST, ASSA-B.ST, ZEAL.CO, CHEMM.CO, LUG.ST, VITR.ST, KCC.OL, GMAB.CO, PARKEN.CO, KOG.OL, CARL-B.CO, COLO-B.CO, DEMANT.CO, BWE.OL.
- **Grind 3:** ELUX-B.ST, TRUE-B.ST, EKTA-B.ST.

**Watchlist (punkt 6/6b, L-2):**
- **Tillagda, fem rader:** LUMI.ST, NP3.ST, XBRANE.ST och DOM.ST (beslut utan kurs) samt ELUX-B.ST (bubblare).
- **Borttagna: inga.** Listan skyddas enligt `prompts/gemensam_korning.md` av ännu omogna beslut (20 handelsdagars utvärderingsfönster). Riktmärket 25 är underordnat mätbarheten (`watchlist-cap-vs-measurability-conflict`).

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
