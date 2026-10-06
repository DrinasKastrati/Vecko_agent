# Veckorapport: Nordisk Rotation
**Vecka:** v 41 | **Datum:** 2026-10-06
**Marknadsklimat:** OMXS30 (`^OMX`) stängde måndag **3 257,5857** (`state/prices.json`, source "Yahoo Finance (chart API)", marketTime 2026-10-05T15:35:00Z), **−0,09 %** mot föregående stängning 3 260,51 och **−1,14 % sedan förra rotationens bas** (fredag 2026-09-25: 3 295,0295). Den största dagsrörelsen i perioden var onsdag–torsdag (3 268,98 → 3 226,59, −1,30 %), varefter index återhämtade sig fredagen. **Regimfiltret är PÅ:** 3 257,5857 ligger **+4,25 %** över MA200 **3 124,8277** (200 daterade stängningar ur `state/price_history.json`, serien bär 250 punkter). Marginalen har krympt från +5,90 % vid v40-rotationen; spärren binder vid ett fall till 3 124,83, alltså −4,07 % härifrån. Nya positioner är tillåtna. USA: S&P 500 **7 773,95** (`state/price_history.json`, 2026-10-05), +1,17 % mot 2026-09-28. USD/SEK **10,0311** (`state/prices.json`, marketTime 2026-10-06) – kronan har försvagats ytterligare från 9,9145, fjärde veckan i rad, fortsatt medvind för exportledet. **Nordisk medvind:** tank/produkttank (HAFNI.OL **+10,70 %**, FRO.OL **+8,73 %**), cellanalys/livsvetenskapsverktyg (CHEMM.CO **+11,96 %**), Genmab (GMAB.CO +3,26 % till ny 250-dagarshögsta, före fas 3-beskedet efter stängning). **Nordisk motvind:** fordon/konsument (VOLCAR-B.ST **−11,59 %**, ELUX-B.ST −9,18 %), fastigheter (SBB-B.ST −9,29 %), lax (BAKKA.OL −4,39 %, SALM.OL −3,74 %) och Neste (NESTE.HE −5,01 %). Makrobesked (räntor, inflation, tullar) går inte att verifiera ur någon fil i repot – se åtgärdspunkten nedan.

**⚠️ VARFÖR LÄGE A KÖRS PÅ EN TISDAG.** Veckans rotation saknas helt på `main`: det finns ingen `reports/weekly/veckorapport-261005.md`, ingen `daglig-261005.md`, och `state/decisions.json` bär **noll** `book: "nordic"`-rader daterade 2026-10-05 (kontrollerat mot `origin/main` @ bb074ba). Ingen `claude/**`-branch bär ett halvfärdigt försök. Enligt `prompts/gemensam_korning.md` ("Saknas veckans LÄGE A helt används LÄGE A vid nästa öppna handelsdags körning, även tisdag–fredag") körs rotationen därför i dag, med dagens datum och dagens verifierade data. **Inga bakdaterade affärer eller rapporter skapas.** Måndagens LÄGE B-bevakning togs inte heller; bokens enda innehav är indexsleeven, som saknar stop och mål, så ingen skyddsnivå kunde passeras obevakad.

**DATAFÄRSKHET.** `state/prices.json` `generatedAt` **2026-10-06T01:46:58Z**, `schemaVersion` "2026-08-02-prevclose", `wideAt` samma tidpunkt (dygnets breda hämtning är gjord, 246 symboler). Samtliga nordiska kurser nedan är måndagens stängningar (marketTime 2026-10-05 14:25–15:35 UTC). `state/news_feed.json` `generatedAt` 2026-10-06T01:47:16Z, fönstret bär **10 av 10 handelsdagar** (2026-09-22 → 2026-10-06, `missingDays` tomt). `state/alerts.json` `checkedAt` 2026-10-05T22:19:45Z – monitorn lever; de två aktiva signalerna gäller ACN (US-boken), inget i denna bok. **Fantompunktskontroll:** 6 av 248 serier i `state/price_history.json` upprepar sin föregående stängning (2,4 %), normalt band – RSI/MACD/EMA är räknade på råserien.

---

## 0. Facit: Förra veckans val
| Aktie | Entry | Exit | Utfall | Stop/Mål träffad? |
|---|---|---|---|---|
| XACT-OMXS30.ST | 494,60 | 484,60 (öppen) | −2,02 % | Nej (sleeven har varken stop eller mål) |

**Veckans portföljutfall (viktat):** **−1,23 %.** Boken låg 100,0 % i indexsleeven hela perioden. XACT-OMXS30.ST 490,65 (2026-09-25) → **484,60** (`state/prices.json`, source "Yahoo Finance (chart API)", marketTime 2026-10-05T15:24:28Z). `^OMX` över samma period −1,14 %; skillnaden är fondens förvaltningsavgift och spårningsfel, inte ett urval. Bruttotal – dashboardens nettosiffra drar rundturskostnaden, men inga affärer gjordes.
**Ackumulerad avkastning sedan strategistart:** **−2,17 %** – oförändrad. Två stängda affärer sedan skarp start 2026-08-10: ASSA-B.ST −3,26 % (vikt 25 %) och SALM.OL −5,48 % (vikt 25 %), kedjat 0,991856 × 0,986291 = 0,978258. Sleevens orealiserade rörelse ingår inte i fältet.
**Portföljallokering denna vecka:** **100,0 % indexsleeve (XACT-OMXS30.ST) + 0 % kassa.** Samtliga fyra aktieplatser står tomma; inget case klarade alla fem grindar (se nedan). Kapitalet ligger i index, aldrig på konto.
**Lärdom:** Veckans enda case med en bekräftad, daterad och materiell katalysator – Genmabs fas 3-utfall i EPCORE DLBCL-2 – publicerades **efter** stängning (MFN 2026-10-05T18:49Z), så den enda verifierade kursen ligger FÖRE händelsen och kan inte bära ett beslut. Det är rätt utfall, inte en lucka: grind 1 kräver en kurs som speglar katalysatorn, och den finns först efter dagens öppning. Tillämpade lärdomar: **L-1** och **L-5** (rapportkalendern i radarn med täckning), **L-2** (varje bubblare har rad i watchlisten och kurs i `prices.json`, utom EGTX.ST som läggs till i dag), **L-3** (två datadefekter eskalerade nedan, varav en ÅTERKOMMANDE), **L-6** (inga kandidater strukna på universumregel), **L-7** (rörelsegenomgången rangordnad ur prishistoriken), **L-8** (inga indexöversyner hittade, se radarn).

### Bred scanning – varifrån bruttolistan kom

**Bruttolistan omfattar 22 kandidater:** **9 ur nyhetsflödet** (punkt g0: GMAB.CO, EGTX.ST, NOVO-B.CO, BAKKA.OL, LOGI-B.ST, SYSR.ST, TRMD-A.CO, LOOMIS.ST, EKTA-B.ST), **9 ur egen scanning** av veckans rörelser och den tekniska filtreringen (SKF-B.ST, HMS.ST, CHEMM.CO, MGN.OL, IMP-A-SDB.ST, HAFNI.OL, FRO.OL, G5EN.ST, AKVA.OL) och **4 bubblare från v40** (SINCH.ST, SALM.OL, NIBE-B.ST, NESTE.HE – den femte, GMAB.CO, räknas under nyhetsflödet). Nyhetsfönstret bar **10 av 10 handelsdagar** (`window.tradingDaysCovered`).

**Veckans rörelser (punkt g1, enligt L-7).** Rangordningen är gjord ur `state/price_history.json` över **155 nordiska symboler** (.ST/.OL/.CO/.HE) med daterad stängning på både basdagen **2026-09-28** och mätdagen **2026-10-05**. `state/movers.json` har `asOf` **2026-10-02** (senare än basdagen, alltså användbar som komplement) och bär bara två rader över sina trösklar: VOLCAR-B.ST (−10,82 % vecka) och G5EN.ST (+9,22 %) – båda finns även i prishistorikens rangordning. Störst uppåt: IMP-A-SDB.ST +16,34 %, CHEMM.CO +11,96 %, AKVA.OL +10,95 %, HAFNI.OL +10,70 %, FRO.OL +8,73 %, G5EN.ST +8,04 %, MGN.OL +6,62 %. Störst nedåt: VOLCAR-B.ST −11,59 %, FLEXQ.ST −11,04 %, GSF.OL −10,64 %, NOL.OL −10,11 %, SBB-B.ST −9,29 %, ELUX-B.ST −9,18 %. Nordiska namn utanför prishistoriken är **OKONTROLLERADE** (L-5).

**Nyhetsflödets nordiska poster i femdagarsfönstret (2026-09-29 – 2026-10-05, plus kvällen 2026-09-28):**
- **Genmab / AbbVie** – fas 3 EPCORE DLBCL-2: epcoritamab + R-CHOP gav statistiskt signifikant förbättrad progressionsfri överlevnad i nydiagnostiserad DLBCL (MFN 2026-10-05T18:49Z; bekräftat av ir.genmab.com och OncLive: HR 0,49, 95 % KI 0,35–0,69, p < 0,0001 i IPI 3–5-populationen). Första fas 3-studien med en bispecifik kombination i förstalinjen.
- **Egetis Therapeutics** – FDA-godkännande av EMCITATE (tiratricol) för MCT8-brist, plus Rare Pediatric Disease Priority Review Voucher (GlobeNewswire/MFN 2026-09-28T21:45Z; bekräftat av Placera och RARE Daily).
- **Novo Nordisk** – FDA:s granskning av denecimig-BLA förlängd på grund av pågående åtgärder vid produktionsanläggningen; inga brister i klinisk effekt/säkerhet, ingen ny tidslinje, oförändrad prognos 2026 (MFN/GlobeNewswire 2026-10-02T20:53Z; bekräftat i SEC Form 6-K 2026-10-02). Negativ förskjutning.
- **Bakkafrost** – Q3 2026 trading update med rättelse (MFN 2026-10-05T20:08Z). Innehållet gick inte att länkverifiera (mfn.se är EGRESS_BLOCKED); riktningen antas inte.
- **Logistea** – förvärv av logistikportfölj i Danmark för 1 010 MSEK, fullt uthyrd till Velux (MFN 2026-09-29T18:20Z).
- **Systemair** – planerar att avveckla produktionsanläggningen i Nederländerna (rättelse MFN 2026-09-29T18:11Z).
- **TORM** – sekundärerbjudande av A-aktier från en säljande storägare (MFN 2026-10-05T21:03Z). Utbudstryck, negativt.
- **Loomis** – slutfört förvärvet av Hermes Transportes Blindados (MFN 2026-10-05T21:00Z). Slutförande av ett tidigare annonserat förvärv.
- **Elekta** – långtidsdata för Elekta Unity vid ASTRO (MFN 2026-09-28T17:00Z) och fas 2-data för Leksell Gamma Knife (MFN 2026-09-29T19:00Z). Konferensdata, inte regulatoriskt besked.

**⚠️ ÅTGÄRDSPUNKT TILL DREN (L-3) – ÅTERKOMMANDE: nyhetsfönstrets dygnstak stryker hela den nordiska handelssessionen ur `mfn`-flödet.** Fil och fält: `state/news_feed.json`, `items` med `src: "mfn"`. Omfång: **270 MFN-poster i fönstret, 0 av dem publicerade 07:00–15:00 UTC**; den tidigaste timmen är 16 UTC, och varje handelsdag 2026-09-23 – 2026-10-05 bär exakt **30** poster (taket per källa och dygn). Taket behåller dygnets senaste 30, så allt som släpps under börstid försvinner. Ersättningskälla i dag: websök (Placera, ir.genmab.com, OncLive, SEC 6-K). Punkten är öppen sedan fem veckor i `state/action_items.json` (`news-window-daily-cap-drops-morning-posts`). Följden är att g0 bara ser kvällsmeddelanden – exempelvis var CHEMM.CO:s +11,96 % och IMP-A-SDB.ST:s +16,34 % inte möjliga att koppla till någon post i flödet.

**⚠️ ÅTGÄRDSPUNKT TILL DREN (L-3): makrokalendern går inte att verifiera ur repots filer.** `state/news_feed.json`:s `fed-press` bär 9 poster i fönstret och inget räntebesked; det finns ingen makrokalender i `state/`. Omfång: samtliga makrohändelser i radarn nedan. Redan öppen som `macro-calendar-not-verifiable-from-state`.

**Likviditetsgolvet** räknas som 20-dagarssnittet av volym ur `state/volume_history.json` × verifierad kurs. För `.OL`/`.CO`/`.HE` anges talet i lokal valuta (växelkurser saknas, se `fx-rates-missing-eur-dkk-nok`); för samtliga kandidater nedan är avståndet till golvet så stort att växelkursen inte avgör.

---

## Case: INGA NYA VALDA DENNA VECKA

**Noll av 22 bruttokandidater passerade samtliga fem grindar. Boken öppnar ingen position och samtliga fyra platser ligger kvar i indexsleeven (100,0 %).** Grinden som loggas är den FÖRSTA som fäller kandidaten i ordningen 1 → 5 (se `gate-assignment-ambiguous`); oberoende fall på senare grindar anges i texten.

| Grind | Fäller (primärt) | Andel |
|---|---|---|
| 1 – verifierad kurs med källa + tidsstämpel (efter katalysatorn) | 7 | 32 % |
| 2 – teknisk filtrering (RSI/MACD/EMA/volym/likviditet) | 11 | 50 % |
| 3 – namngiven, bekräftad och daterad katalysator | 4 | 18 % |
| 4 – R/R ≥ 2:1 och kostnadströskel ≥ 6 % | 0 primärt | – |
| 5 – nåbarhetstak | 0 | – |
| **Jämförelse v40** | grind 1: 8, grind 2: 13, grind 3: 3 av 24 | – |

### Genmab (GMAB.CO) – veckans enda kandidat med materiell katalysator, och varför den ändå inte köps i dag

**Kurs 2 377 DKK** (`state/prices.json`, source "Yahoo Finance (chart API)", marketTime **2026-10-05T14:59:40Z**). Teknik på måndagens stängning: RSI(14) **66,7**, MACD-histogram **+2,673** – en färsk bullish korsning (föregående session −0,985), hel EMA-stack **2 252,67 > 2 138,15 > 1 962,21** med kursen över alla tre, volymkvot **3,23×**, omsättning **153,8 MDKK/dag**, sexmånadersmomentum **+35,2 %**. Grind 2 klaras på pre-event-stängningen.

**Faller på grind 1.** Fas 3-beskedet publicerades **18:49 UTC**, tre timmar och femtio minuter efter Köpenhamns stängning. Kursen 2 377 är därmed en **pre-event-kurs på en post-event-katalysator** – exakt det fall `refresh-candidate-prices.mjs` byggdes för att aldrig fylla i. Ingen förbörs- eller reguljär kurs efter beskedet finns i `state/prices.json` vid körningstillfället (06:4x UTC, före öppning 07:00 UTC). Att köpa på gårdagens stängning vore att handla på en kurs som inte längre går att få.
**Grind 4 och 5 går inte att avgöra före en post-event-kurs.** Kursen står på 250-dagarshögsta (2 377), så det finns inget motstånd ovanför att ankra ett mål i, och ett gap uppåt i dag flyttar både entry och stoppets stödnivå. Samma geometri fällde GMAB.CO på grind 4 i v40.
**Binär händelse:** Q3-rapporten är **2026-11-05** (`state/earnings_calendar.json`, `isEstimate: false`), 22 handelsdagar bort – inte en spärr.
**Utfästelse till LÄGE B (punkt 4, villkorad bubblar-plan):** skälet att GMAB.CO inte får en pending-rad i dag är **uttryckligen saknad verifierad kurs efter katalysatorn**. Villkor (1) i LÄGE B-regeln är därmed uppfyllt. Från onsdagens körning kan en villkorad plan läggas om (2) en reguljär post-event-stängning finns, (3) katalysatorn är inom 5 handelsdagar, (4) caset passerar full poängsättning mot de fem grindarna på den nya kursen – inklusive ett ankringsbart mål ≥ 6 % och R/R ≥ 2:1, (5) regimen är PÅ och (6) taket på två planer håller. `catalystType` loggas som `other` (fas 3-utfall är inte ett regulatoriskt godkännande); horisont 2–4 veckor, mål 8–12 %.

### Övriga som föll på grind 1 – kurs saknas (6 st)
Samtliga saknar rad i `state/prices.json` och läggs i `config/watchlist.txt` i denna körning (punkt 6b).

| Ticker | Bolag | Katalysator (datum, källa) | `catalystType` |
|---|---|---|---|
| EGTX.ST | Egetis Therapeutics | **FDA-godkännande** av EMCITATE + priority review voucher (MFN/GlobeNewswire 2026-09-28T21:45Z) | regulatory |
| LOGI-B.ST | Logistea | Förvärv av dansk portfölj 1 010 MSEK, uthyrd till Velux (MFN 2026-09-29T18:20Z) | order |
| SYSR.ST | Systemair | Planerad avveckling av produktion i Nederländerna (MFN 2026-09-29T18:11Z) | turnaround |
| TRMD-A.CO | TORM | Sekundärerbjudande från säljande storägare (MFN 2026-10-05T21:03Z) – negativt | other |
| LOOMIS.ST | Loomis | Slutfört förvärv av Hermes Transportes Blindados (MFN 2026-10-05T21:00Z) | other |
| EKTA-B.ST | Elekta | Kliniska data vid ASTRO (MFN 2026-09-28T17:00Z, 2026-09-29T19:00Z) | other |

EGTX.ST är den enda av de sex med en katalysator i punkt 1a:s uppräkning (regulatoriskt godkännande). Den hamnar på bubblarlistan; femdagarsfönstret för beskedet löper ut med måndagens session, så den blir köpbar först om en ny daterad händelse tillkommer (t.ex. lanseringsbesked eller försäljning av vouchern).

### Passerade grind 1 och 2, föll på grind 3 (4 st)
| Ticker | Kurs (marketTime 2026-10-05) | Veckan (rang/155) | RSI | Volymkvot | Omsättning/dag | Spärr |
|---|---|---|---|---|---|---|
| CHEMM.CO | 585,00 DKK | +11,96 % (2) | 72,8 | 2,15× | 46,1 MDKK | Grind 3: ingen daterad händelse i fönstret – årsrapporten 10/9 och återköpet (löper till 8/10) är äldre. RSI 72,8 nära taket 75 |
| SKF-B.ST | 275,10 SEK | +1,85 % (38) | 55,5 | 1,51× | 286,7 MSEK | Grind 3: ingen bolagshändelse i fönstret (websök gav inga träffar). Oberoende grind 4: 250d-högsta 278,00 = +1,05 % < 6 % |
| HMS.ST | 553,00 SEK | +2,60 % (29) | 60,1 | 1,68× | 24,1 MSEK | Grind 3: ingen bolagshändelse i fönstret. Q3-rapport 21/10 (`isEstimate: false`). MACD-histogram avtar 0,405 → 0,249, stängde på dagslägsta |
| MGN.OL | 22,55 NOK | +6,62 % (7) | 56,8 | 1,89× | 11,8 MNOK | Grind 3: senaste händelsen är konferenspresentation 16/9. Dessutom EMA50 22,25 < EMA200 23,13 och sexmånadersmomentum −6,8 % |

### Föll på grind 2 (11 st)
| Ticker | Kurs (marketTime 2026-10-05) | Veckan | Spärr |
|---|---|---|---|
| IMP-A-SDB.ST | 70,50 SEK | +16,34 % (1) | Volymkvot 0,70×, MACD-histogram avtar 1,764 → 1,515. Ingen daterad katalysator i fönstret |
| HAFNI.OL | 96,70 NOK | +10,70 % (4) | Volymkvot 0,52×. Grind 3 dessutom: emissionsbeskedet 23/9 är utspädande, inte en köpkatalysator |
| FRO.OL | 503,20 NOK | +8,73 % (5) | Volymkvot **1,47×**, strax under 1,5× – trots färsk MACD-korsning (−0,671 → +0,535). Grind 3 dessutom: ingen daterad bolagshändelse |
| G5EN.ST | 71,20 SEK | +8,04 % (6) | Likviditetsgolvet: **0,8 MSEK/dag** mot 3 MSEK. Dessutom RSI 72,7 och EMA50 64,01 < EMA200 67,93 (ingen stack) |
| AKVA.OL | 157,00 NOK | +10,95 % (3) | Likviditetsgolvet: **0,8 MNOK/dag**. RSI 74,2 |
| NOVO-B.CO | 246,80 DKK | −2,16 % | RSI 25,3, kurs under samtliga EMA (264,00/280,69/299,36). Katalysatorn (förlängd FDA-granskning 2/10) är negativ |
| BAKKA.OL | 431,60 NOK | −4,39 % | Kurs under samtliga EMA (441,84/446,73/451,34), volymkvot 0,44×, MACD-histogram 0,344 → −0,000 |
| SINCH.ST | 46,45 SEK | +0,74 % | MACD-histogram −0,440 (negativt), kurs 46,45 under EMA20 46,63 |
| SALM.OL | 567,00 NOK | −3,74 % | Volymkvot 0,52×, MACD-histogram vände negativt (0,167 → −0,439) |
| NIBE-B.ST | 45,02 SEK | −1,57 % | Volymkvot 0,88×, MACD-histogram −0,146 |
| NESTE.HE | 32,45 EUR | −5,01 % | Volymkvot 0,84×, MACD-histogram −0,350, kurs under EMA20 33,13 |

### Grind 4/5
Ingen kandidat nådde grind 4 primärt. Oberoende grind 4-fall noteras för SKF-B.ST (ankaret 278,00 = +1,05 %). Bokens beslutsstatistik citeras inte i veckan – `state/decision_eval.json` bär inget tal som klarar `MIN_CLUSTERS`, och ett tal utan `effectiveN` vore ofärdigt.

---

## Bubblare (watchlist inför nästa vecka)
1. **GMAB.CO** – fas 3-utfall i EPCORE DLBCL-2 (MFN 2026-10-05T18:49Z) med full teknisk stack; fälld ENBART på saknad verifierad kurs efter katalysatorn. Prövas i LÄGE B när post-event-stängningen finns (se utfästelsen ovan). Rad finns i `config/watchlist.txt`, kurs i `state/prices.json`.
2. **EGTX.ST** – FDA-godkännande 2026-09-28 med priority review voucher; saknar kurs i `state/prices.json` och läggs i watchlisten i dag (L-2). Kräver en ny daterad händelse för att vara köpbar efter femdagarsfönstret.
3. **CHEMM.CO** – veckans näst starkaste rörelse (+11,96 %), volymkvot 2,15×, hel EMA-stack; saknar daterad katalysator (grind 3). Mål kan ankras i 250d-högsta 792.
4. **FRO.OL** – färsk MACD-korsning, volymkvot 1,47× – en tiondels steg från grind 2; saknar daterad bolagshändelse (grind 3).
5. **HMS.ST** – hel EMA-stack, volymkvot 1,68×; saknar katalysator, och Q3-rapporten 2026-10-21 är en binär händelse som stänger köpfönstret från 2026-10-19.

**Förra veckans bubblare:** **SINCH.ST** – RANKAD UNDER (grind 2: MACD-histogram −0,440, kurs under EMA20). **GMAB.CO** – RANKAD UNDER (grind 1: ny katalysator efter stängning, ingen post-event-kurs; kvar som bubblare). **SALM.OL** – STRUKEN (grind 2: volymkvot 0,52×, MACD vände negativt; insiderköpet 25/9 ligger utanför fönstret). **NIBE-B.ST** – STRUKEN (grind 2: volymkvot 0,88×, MACD negativt). **NESTE.HE** – STRUKEN (grind 2: −5,01 % på veckan, under EMA20, MACD negativt).
**Villkorade bubblar-planer:** **Inga.** Punkt 4b kräver fullständiga nivåer och ett entry-villkor mot verifierad kurs för en bubblare som i övrigt håller. GMAB.CO saknar just den verifierade kursen som nivåerna ska sättas mot; övriga fyra faller på grind 2 eller 3.

## Veckans radar (kommande 5 handelsdagar)
* **Tisdag 6/10** – Genmab handlas för första gången efter fas 3-beskedet (Köpenhamn öppnar 07:00 UTC). Novo Nordisk efter förlängd denecimig-granskning.
* **Torsdag 8/10** – ChemoMetecs återköpsprogram löper ut (enligt bolagets kommunikation; datum ej länkverifierat).
* **Torsdag 15/10** – **Kinnevik (KINV-B.ST)** Q3-rapport (`state/earnings_calendar.json`, `isEstimate: false`) – utanför femdagarsfönstret men inom 10 handelsdagar.
* **Tisdag 20/10** – **Scandi Standard (SCST.ST)** Q3-rapport (`isEstimate: false`).
* **Onsdag 21/10** – **HMS Networks (HMS.ST)** Q3-rapport (`isEstimate: false`).
* **Makro:** räntebesked och inflationsdata för veckan går inte att verifiera ur repots filer (åtgärdspunkt ovan). Bevaka amerikansk storbanksrapportering från 13/10 (C, JPM, WFC i `state/earnings_calendar.json`) som riskaptitmätare.

**⚠️ TÄCKNINGSANGIVELSE ENLIGT L-1 OCH L-5.** Rapportuppräkningen ovan vilar på `state/earnings_calendar.json` (`generatedAt` 2026-10-06T01:45:35Z, `counts.resolved` **146 symboler**, varav **69 nordiska**; `failed` 0, `noCoverage` 9). Inom kommande 10 handelsdagar (6/10–20/10) rapporterar bland de 69 bara KINV-B.ST och SCST.ST; HMS.ST ligger dagen efter. **Nordiska Large/Mid Cap-bolag utanför de 69 är OKONTROLLERADE** – rapportsäsongen för Q3 startar normalt i mitten av oktober (storbolag som Ericsson, Volvo och bankerna brukar rapportera veckorna 42–43), men inget sådant datum går att verifiera ur källor körningen når, och websök gav bara äldre års kalendrar. Samtliga tre namngivna rapportörer har redan rad i `config/watchlist.txt`. **L-8:** ingen indexöversyn med beslut och ikraftträdande inom fönstret hittades i nyhetsflödet; indexleverantörernas primärkällor täcks inte av någon fil i repot och är därmed **OKONTROLLERADE**.

---

## Bruttolista – samtliga 22 kandidater, loggade som AVVAKTA i `state/decisions.json`
GMAB.CO, EGTX.ST, LOGI-B.ST, SYSR.ST, TRMD-A.CO, LOOMIS.ST, EKTA-B.ST (grind 1) · IMP-A-SDB.ST, HAFNI.OL, FRO.OL, G5EN.ST, AKVA.OL, NOVO-B.CO, BAKKA.OL, SINCH.ST, SALM.OL, NIBE-B.ST, NESTE.HE (grind 2) · CHEMM.CO, SKF-B.ST, HMS.ST, MGN.OL (grind 3).

**Watchlist (punkt 6/6b, L-2):** sju rader tillagda – EGTX.ST, LOGI-B.ST, SYSR.ST, TRMD-A.CO, LOOMIS.ST, EKTA-B.ST (beslut utan kurs) och SKF-B.ST (bubblare; hämtades hittills bara via den breda dygnskörningen). **Ingen rad borttagen:** listan skyddas enligt `prompts/gemensam_korning.md` av ännu omogna beslut (20 handelsdagars utvärderingsfönster), och en rensning mot 14 handelsdagar kräver en genomgång som inte ryms utan att riskera just de symboler mätningen behöver. Riktmärket 25 är underordnat mätbarheten (`watchlist-cap-vs-measurability-conflict`).

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
