# Veckorapport: Nordisk Rotation
**Vecka:** v 42 | **Datum:** 2026-10-13
**Marknadsklimat:** OMXS30 (`^OMX`) stängde måndag **3 269,7925** (`state/prices.json`, source "Yahoo Finance (chart API)", marketTime 2026-10-12T15:35:00Z), **+0,38 %** mot förra rotationens bas (måndag 2026-10-05: 3 257,5857). Veckan var hackig: 3 282,94 (6/10) → 3 202,44 (8/10, −2,45 % på två dagar) → 3 258,14 (9/10) → 3 269,79 (12/10). **Regimfiltret är PÅ:** 3 269,7925 ligger **+4,28 %** över MA200 **3 135,4800** (200 daterade stängningar ur `state/price_history.json`, serien bär 250 punkter). Spärren binder vid ett fall till 3 135,48. Nya positioner är tillåtna. USA: S&P 500 **7 807,24** (`state/prices.json`, marketTime 2026-10-12T20:35:01Z), +0,43 % mot 2026-10-05. USD/SEK **10,0218** (`state/prices.json`, marketTime 2026-10-13T02:36:05Z), i stort sett oförändrad mot 10,0311 förra veckan. **Nordisk medvind:** tank och offshore-energi (FRO.OL **+12,48 %**, BWE.OL **+12,39 %**, HAFNI.OL +8,38 %; Poten & Partners rapporterade VLCC Mellanöstern–Asien kring 1,3 MUSD/dag i sin Tanker Opinion 2026-10-02), dansk medicinteknik (DEMANT.CO **+9,90 %**, COLO-B.CO +8,85 %), investmentbolag inför rapport (KINV-B.ST **+11,36 %**). **Nordisk motvind:** Zealand Pharma (ZEAL.CO **−11,60 %**), Implantica (IMP-A-SDB.ST −10,64 %), Tele2 (TEL2-B.ST −5,85 %), Betsson (BETS-B.ST −5,41 %). Makrobesked (räntor, inflation, tullar) går inte att verifiera ur någon fil i repot – se åtgärdspunkten nedan.

**⚠️ VARFÖR LÄGE A KÖRS PÅ EN TISDAG.** Veckans rotation saknas helt på `main`: det finns ingen `reports/weekly/veckorapport-261012.md`, ingen `daglig-261012.md`, och `state/decisions.json` bär **noll** `book: "nordic"`-rader daterade 2026-10-12 (kontrollerat mot `origin/main` @ 84597e4). Ingen `claude/**`-branch bär ett halvfärdigt försök. Enligt `prompts/gemensam_korning.md` ("Saknas veckans LÄGE A helt används LÄGE A vid nästa öppna handelsdags körning, även tisdag–fredag") körs rotationen därför i dag, med dagens datum och dagens verifierade data. **Inga bakdaterade affärer eller rapporter skapas.** Bokens enda innehav är indexsleeven, som saknar stop och mål, så ingen skyddsnivå kunde passeras obevakad under måndagen. Detta är **andra veckan i rad** som måndagens nordiska routine uteblir (v41 togs också igen på en tisdag) – se åtgärdspunkten nedan.

**DATAFÄRSKHET.** `state/prices.json` `generatedAt` **2026-10-13T02:36:15Z**, `schemaVersion` "2026-08-02-prevclose", `wideAt` samma tidpunkt (dygnets breda hämtning är gjord, 267 symboler). Samtliga nordiska kurser nedan är måndagens stängningar (marketTime 2026-10-12 14:25–15:35 UTC). `state/news_feed.json` `generatedAt` 2026-10-12T21:46:06Z, fönstret bär **10 av 10 handelsdagar** (2026-09-28 → 2026-10-12, `missingDays` tomt). `state/alerts.json` `checkedAt` 2026-10-12T23:30:38Z, `active` tom – monitorn lever. **Fantompunktskontroll:** 16 av 267 serier i `state/price_history.json` upprepar sin föregående stängning (6,0 %) – något högre än förra veckans 2,4 % men långt från 50-procentsklassen som skulle betyda regression i `historyDate`; RSI/MACD/EMA är räknade på råserien.

---

## 0. Facit: Förra veckans val
| Aktie | Entry | Exit | Utfall | Stop/Mål träffad? |
|---|---|---|---|---|
| XACT-OMXS30.ST | 494,60 | 488,00 (öppen) | −1,33 % | Nej (sleeven har varken stop eller mål) |

**Veckans portföljutfall (viktat):** **+0,70 %.** Boken låg 100,0 % i indexsleeven hela perioden. XACT-OMXS30.ST 484,60 (2026-10-05) → **488,00** (`state/prices.json`, source "Yahoo Finance (chart API)", marketTime 2026-10-12T15:23:13Z). `^OMX` över samma period +0,38 %; skillnaden är fondens spårning, inte ett urval. Bruttotal – dashboardens nettosiffra drar rundturskostnaden, men inga affärer gjordes. Veckans enda planerade affär, GMAB.CO-planen (≤ 2 410,00), triggades 2026-10-08 men avfördes 2026-10-09 på sitt förhandsdefinierade punkteringskriterium (stängning 2 356,00 under gapstödet 2 377) – i efterhand stängde GMAB.CO måndagen på **2 487,00 DKK** (marketTime 2026-10-12T14:59:40Z), +3,2 % över planens limit. Avförandet följde planen; utfallet registreras här som facit, inte som skäl att ändra kriteriet.
**Ackumulerad avkastning sedan strategistart:** **−2,17 %** – oförändrad. Två stängda affärer sedan skarp start 2026-08-10: ASSA-B.ST −3,26 % (vikt 25 %) och SALM.OL −5,48 % (vikt 25 %), kedjat 0,991856 × 0,986291 = 0,978258. Sleevens orealiserade rörelse ingår inte i fältet.
**Portföljallokering denna vecka:** **100,0 % indexsleeve (XACT-OMXS30.ST) + 0 % kassa.** Samtliga fyra aktieplatser står tomma; inget case klarade alla fem grindar (se nedan). Kapitalet ligger i index, aldrig på konto.
**Lärdom:** Veckans tekniskt starkaste namn (FRO.OL, BWE.OL, DEMANT.CO, BAVA.CO, KINV-B.ST) har alla RSI över 75 och saknar daterad bolagshändelse – rörelsen är redan gjord och jagas inte. De två som klarar hela grind 2 (VITR.ST, KCC.OL) saknar katalysator. Grind 3 och grind 2 fäller varandras kandidater, och det är rätt utfall. Tillämpade lärdomar: **L-1** och **L-5** (rapportkalendern i radarn med täckning), **L-2** (varje bubblare har rad i watchlisten; LUG.ST och VITR.ST läggs till i dag), **L-3** (tre datadefekter eskalerade nedan, två ÅTERKOMMANDE), **L-4** (GMAB.CO prövad om på post-event-kurs), **L-6** (inga kandidater strukna på universumregel), **L-7** (rörelsegenomgången rangordnad ur prishistoriken), **L-8** (inga indexöversyner hittade, se radarn).

### Bred scanning – varifrån bruttolistan kom

**Bruttolistan omfattar 19 kandidater:** **5 ur nyhetsflödet** (punkt g0: LUG.ST, ALVO-SDB.ST, KOA.OL, RILBA.CO, CHEMM.CO), **4 bubblare från v41** (GMAB.CO, EGTX.ST, FRO.OL, HMS.ST – den femte, CHEMM.CO, räknas under nyhetsflödet eftersom den fick en ny katalysator) och **10 ur egen scanning** av veckans rörelser och den tekniska filtreringen (HAYPP.ST, BWE.OL, KINV-B.ST, DEMANT.CO, BAVA.CO, NNIT.CO, EG7.ST, EMBRAC-B.ST, VITR.ST, KCC.OL). Nyhetsfönstret bar **10 av 10 handelsdagar** (`window.tradingDaysCovered`).

**Veckans rörelser (punkt g1, enligt L-7).** Rangordningen är gjord ur `state/price_history.json` över **161 nordiska symboler** (.ST/.OL/.CO/.HE) med daterad stängning på både basdagen **2026-10-05** och mätdagen **2026-10-12** (av 163 nordiska serier). `state/movers.json` har `asOf` **2026-10-09** (senare än basdagen, alltså användbar som komplement) och bär sju rader över sina trösklar: FRO.OL, PDX.ST, DEMANT.CO, HNSA.ST, GMAB.CO, KINV-B.ST och SF.ST – samtliga utom SF.ST finns i prishistorikens rangordning. Störst uppåt: HAYPP.ST +14,17 %, FRO.OL +12,48 %, BWE.OL +12,39 %, NNIT.CO +11,49 %, KINV-B.ST +11,36 %, DEMANT.CO +9,90 %, EGTX.ST +9,82 %, EG7.ST +9,70 %. Störst nedåt: ZEAL.CO −11,60 %, IMP-A-SDB.ST −10,64 %, G5EN.ST −7,58 %, TEL2-B.ST −5,85 %, VOW.OL −5,50 %, BETS-B.ST −5,41 %. Nordiska namn utanför prishistoriken är **OKONTROLLERADE** (L-5).

**Nyhetsflödets nordiska poster i femdagarsfönstret (2026-10-06 – 2026-10-12):**
- **Lundin Gold** – rekordproduktion Q3 2026: **153 736 oz** guld från Fruta del Norte (Q3 2025: 122 086 oz, +26 %), YTD 392 472 oz, helårsguidning 475 000–525 000 oz bekräftad (MFN 2026-10-08T21:00Z; bekräftat av bolagets pressmeddelande via Cision).
- **ChemoMetec** – nytt återköpsprogram, löper 2026-10-12 – 2027-03-05, efter att föregående program (max 100 MDKK, 500 000 aktier) avslutats 2026-10-08 (MFN/GlobeNewswire 2026-10-08T20:34Z, Announcement No. 320). Maxbeloppet för det nya programmet framgår inte av utdraget.
- **Alvotech** – tillverkningsavtal med LOTTE Biologics i Syracuse, USA, för biosimilarer (MFN/GlobeNewswire 2026-10-06T20:30Z).
- **Kongsberg Automotive** – godkännande av omstruktureringen av Cluses-enheten (MFN 2026-10-06T19:17Z).
- **Ringkjøbing Landbobank** – ett återköpsprogram avslutat och ett nytt igångsatt (MFN 2026-10-09T18:38Z och 18:42Z). Löpande kapitalallokering snarare än ny information.
- **Övrigt, ej kandidater:** Kaldvik (maneter i Reyðarfjörður, negativt, MFN 2026-10-07), S-Bank över 90 % i Oma Savings Bank (inlösen, MFN 2026-10-07), revisorsbyte i Sleep Cycle efter ägarförändring (MFN 2026-10-08), Synsams och Verkkokauppas veckorapporter om pågående återköp. Ingen av dem ger en köpbar uppsida.

**⚠️ ÅTGÄRDSPUNKT TILL DREN (L-3) – ÅTERKOMMANDE: nordiska routinen uteblir på måndagar.** Andra veckan i rad saknas måndagens LÄGE A (2026-10-05 och 2026-10-12) och tas igen på tisdagen. Omfång: 1 av 5 schemalagda nordiska körningar per vecka, två veckor i rad; rotationen fattar då beslut på en dags äldre katalysatorer. Redan öppen i `state/action_items.json` som `scheduled-routines-skipped` (2026-10-03 – 2026-10-05). Kontrollera routinens schema/historik för måndag 08:40 CEST.

**⚠️ ÅTGÄRDSPUNKT TILL DREN (L-3): nyhetsflödena `globenewswire` och `globenewswire-earnings` svarar åter HTTP 403.** Fil och fält: `state/news_feed.json`, `feeds.globenewswire` = "HTTP 403 – båda försöken (0.1 s)", `feeds.globenewswire-earnings` = samma. Omfång: 2 av 6 flöden; senaste GlobeNewswire-post i fönstret är **2026-10-09T11:50Z**, alltså ingen ny post sedan dess. Ersättningskälla i dag: MFN-flödet (som speglar många av samma nordiska meddelanden) och websök. Redan öppen som `news-feed-globenewswire-http-403`.

**⚠️ ÅTGÄRDSPUNKT TILL DREN (L-3) – ÅTERKOMMANDE: nyhetsfönstrets dygnstak stryker den nordiska handelssessionen ur `mfn`-flödet.** Fil och fält: `state/news_feed.json`, `items` med `src: "mfn"`. Omfång: 150 MFN-poster 2026-10-06 – 2026-10-12, **0 publicerade 07:00–15:00 UTC** – den tidigaste är 15:46 UTC. Flödet är dessutom till övervägande del icke-nordiskt (amerikanska och franska bolag). Följden är att g0 bara ser kvällsmeddelanden; ingen av veckans tio största nordiska rörelser gick att koppla till en post i flödet. Redan öppen som `news-window-daily-cap-drops-morning-posts` (sjätte veckan).

**⚠️ ÅTGÄRDSPUNKT TILL DREN (L-3): makrokalendern går inte att verifiera ur repots filer.** `state/news_feed.json`:s `fed-press` bär 9 poster i fönstret och inget räntebesked; det finns ingen makrokalender i `state/`. Omfång: samtliga makrohändelser i radarn nedan. Redan öppen som `macro-calendar-not-verifiable-from-state`.

**Likviditetsgolvet** räknas som 20-dagarssnittet av volym ur `state/volume_history.json` × verifierad kurs. För `.OL`/`.CO`/`.HE` anges talet i lokal valuta (växelkurser saknas, se `fx-rates-missing-eur-dkk-nok`); för samtliga kandidater nedan är avståndet till golvet så stort att växelkursen inte avgör.

---

## Case: INGA NYA VALDA DENNA VECKA

**Noll av 19 bruttokandidater passerade samtliga fem grindar. Boken öppnar ingen position och samtliga fyra platser ligger kvar i indexsleeven (100,0 %).** Grinden som loggas är den FÖRSTA som fäller kandidaten i ordningen 1 → 5 (se `gate-assignment-ambiguous`); oberoende fall på senare grindar anges i texten.

| Grind | Fäller (primärt) | Andel |
|---|---|---|
| 1 – verifierad kurs med källa + tidsstämpel | 4 | 21 % |
| 2 – teknisk filtrering (RSI/MACD/EMA/volym/likviditet) | 13 | 68 % |
| 3 – namngiven, bekräftad och daterad katalysator | 2 | 11 % |
| 4 – R/R ≥ 2:1 och kostnadströskel ≥ 6 % | 0 primärt | – |
| 5 – nåbarhetstak | 0 | – |
| **Jämförelse v41** | grind 1: 7, grind 2: 11, grind 3: 4 av 22 | – |

### Föll på grind 1 – kurs saknas (4 st)
Samtliga saknar rad i `state/prices.json` och läggs i `config/watchlist.txt` i denna körning (punkt 6b).

| Ticker | Bolag | Katalysator (datum, källa) | `catalystType` |
|---|---|---|---|
| LUG.ST | Lundin Gold | Rekordproduktion Q3 153 736 oz, guidning bekräftad (MFN 2026-10-08T21:00Z) | earnings |
| ALVO-SDB.ST | Alvotech | Tillverkningsavtal med LOTTE Biologics (MFN 2026-10-06T20:30Z) | order |
| KOA.OL | Kongsberg Automotive | Godkänd omstrukturering av Cluses-enheten (MFN 2026-10-06T19:17Z) | turnaround |
| RILBA.CO | Ringkjøbing Landbobank | Nytt återköpsprogram (MFN 2026-10-09T18:42Z) | buyback |

LUG.ST är den starkaste av de fyra – en kvantifierad, bolagsbekräftad rekordsiffra – och förs upp som bubblare. Femdagarsfönstret för beskedet löper ut med torsdagens session; Q3-rapporten med finansiella siffror kommer senare.

### Passerade grind 1 och 2, föll på grind 3 (2 st)
| Ticker | Kurs (marketTime 2026-10-12) | Veckan (rang/161) | RSI | MACD-hist | Volymkvot | Omsättning/dag | Spärr |
|---|---|---|---|---|---|---|---|
| VITR.ST | 95,20 SEK | +6,19 % (17) | 55,2 | 0,203 → 0,247 | 1,78× | 13,7 MSEK | Grind 3: ingen daterad bolagshändelse i fönstret (websök gav inga träffar). Kurs > EMA20 93,29 > EMA50 92,70 men under EMA200 101,23, sexmånadersmomentum −8,4 %. Q3-rapport 2026-10-22 (bolagets kalender via Nordnet/Onvista; saknas i `state/earnings_calendar.json`) |
| KCC.OL | 109,40 NOK | +3,40 % | 66,8 | 0,388 → 0,630 | 1,58× | 11,5 MNOK | Grind 3: ingen daterad bolagshändelse (websök gav inga träffar). Hel EMA-stack 103,50 > 101,62 > 94,14. Oberoende grind 4: kursen står på 250d-högsta 109,40 – inget motstånd att ankra ett mål i (`target-anchor-vs-cost-threshold-conflict`). Q3 2026-10-27 (`isEstimate: false`) |

### Föll på grind 2 (13 st)
| Ticker | Kurs (marketTime 2026-10-12) | Veckan | Spärr |
|---|---|---|---|
| CHEMM.CO | 584,50 DKK | −0,09 % | **Volymkvot 0,51×** mot kravet 1,5×. Katalysatorn (nytt återköp 8/10) är giltig och daterad, och tekniken är i övrigt hel: RSI 66,3, MACD-histogram +4,08 (platt), EMA 542,57 > 505,15 > 485,81, 38,7 MDKK/dag |
| GMAB.CO | 2 487,00 DKK | +4,63 % | **Volymkvot 0,98×.** RSI 65,7, MACD-histogram 8,71 → 10,48, hel EMA-stack. Grind 3 dessutom: fas 3-beskedet (MFN 2026-10-05T18:49Z) ligger före femdagarsfönstret. Kursen står på 250d-högsta – inget ankare (grind 4) |
| EGTX.ST | 9,95 SEK | +9,82 % | Volymkvot 0,46×, MACD-histogram avtar 0,155 → 0,144, RSI 72,7. Grind 3: FDA-beskedet 28/9 utanför fönstret |
| FRO.OL | 566,00 NOK | +12,48 % (2) | **RSI 78,3** > 75 utan exceptionell bolagskatalysator; volymkvot 0,97×. Sektormedvinden (VLCC-rater) är makro, inte en daterad bolagshändelse |
| HMS.ST | 565,50 SEK | +2,26 % | Volymkvot 0,53×, MACD-histogram avtar 0,643 → 0,429. Q3-rapport 2026-10-21 |
| HAYPP.ST | 164,40 SEK | +14,17 % (1) | Likviditetsgolvet: **2,3 MSEK/dag** mot 3 MSEK; RSI 75,8. Ingen daterad katalysator hittad (websök) |
| BWE.OL | 66,20 NOK | +12,39 % (3) | **RSI 81,5**; volymkvot 1,48×. Ingen daterad bolagshändelse i fönstret (websök: senaste är Q2-rapporten 30/7) |
| KINV-B.ST | 69,60 SEK | +11,36 % (5) | **RSI 77,5.** Dessutom spärr 2e: Q3-rapport **2026-10-15** (`isEstimate: false`), 2 handelsdagar bort – köps aldrig inför en rapport |
| DEMANT.CO | 350,80 DKK | +9,90 % (6) | **RSI 79,4.** +6,16 % den 9/10 utan verifierbar daterad händelse (websök) |
| BAVA.CO | 241,20 DKK | +8,45 % | **RSI 77,7.** Ingen daterad katalysator; 250d-högsta 242,10 ger inget ankare |
| NNIT.CO | 37,35 DKK | +11,49 % (4) | Likviditetsgolvet: **0,7 MDKK/dag**; kurs under EMA50 37,68 och EMA200 41,95 |
| EG7.ST | 15,16 SEK | +9,70 % (8) | RSI 48,1, kurs under EMA50 16,18 och EMA200 16,86, sexmånadersmomentum −12,6 % |
| EMBRAC-B.ST | 90,82 SEK | +6,30 % | MACD-histogram **−0,073** – ingen korsning – trots volymkvot 1,72× och RSI 69,4. Ingen daterad katalysator |

### Grind 4/5
Ingen kandidat nådde grind 4 primärt. Oberoende grind 4-fall noteras för KCC.OL, GMAB.CO och BAVA.CO, som alla står på eller strax under sin 250-dagarshögsta utan motstånd att ankra ett mål i. Bokens beslutsstatistik citeras inte i veckan – `state/decision_eval.json` bär inget tal som klarar `MIN_CLUSTERS`, och ett tal utan `effectiveN` vore ofärdigt.

**L-4-omprövning av GMAB.CO.** Kandidaten fälldes i v41 enbart på saknad post-event-kurs. Den kursen finns nu (2 487,00 DKK, reguljär session), och det nya fullständiga avgörandet är **AVVAKTA på grind 2** (volymkvot 0,98×) med katalysatorn utanför fönstret – loggat som ny rad.

---

## Bubblare (watchlist inför nästa vecka)
1. **CHEMM.CO** – nytt återköpsprogram från 12/10 (daterad katalysator, `buyback`) och hel EMA-stack; fälld enbart på volymkvoten 0,51×. Mål kan ankras i 250d-högsta 792. Rad i `config/watchlist.txt`, kurs i `state/prices.json`.
2. **LUG.ST** – rekordproduktion Q3 (MFN 2026-10-08); fälld enbart på saknad verifierad kurs. Läggs i watchlisten i dag (L-2). LÄGE B-regelns villkor (1) gäller: kan prövas när kursen finns, så länge katalysatorn ligger inom 5 handelsdagar (t.o.m. 2026-10-15).
3. **VITR.ST** – klarar grind 2 fullt ut (volymkvot 1,78×, färskt stigande MACD); saknar katalysator. Q3-rapporten 2026-10-22 stänger köpfönstret från 2026-10-20. Läggs i watchlisten i dag (L-2).
4. **KCC.OL** – klarar grind 2 fullt ut (volymkvot 1,58×, hel stack); saknar katalysator och ankare. Rad finns i watchlisten.
5. **GMAB.CO** – fas 3-medvind och hel stack, men volymkvoten 0,98× och katalysatorn ligger nu utanför fönstret. Rad finns i watchlisten.

**Förra veckans bubblare:** **GMAB.CO** – RANKAD UNDER (grind 2: volymkvot 0,98×; L-4-omprövad på post-event-kurs; kvar som bubblare). **EGTX.ST** – STRUKEN (grind 2: volymkvot 0,46×, MACD avtar; FDA-beskedet utanför fönstret). **CHEMM.CO** – RANKAD UNDER (ny katalysator – återköp 8/10 – men grind 2: volymkvot 0,51×; kvar som bubblare). **FRO.OL** – STRUKEN (grind 2: RSI 78,3 efter +12,48 % – rörelsen är gjord). **HMS.ST** – STRUKEN (grind 2: volymkvot 0,53×, MACD avtar; Q3-rapport 21/10).
**Villkorade bubblar-planer:** **Inga.** Punkt 4b kräver fullständiga nivåer och ett entry-villkor mot verifierad kurs för en bubblare som i övrigt håller. CHEMM.CO, VITR.ST, KCC.OL och GMAB.CO faller på grind 2 eller 3 (omdömesskäl), och LUG.ST saknar just den verifierade kurs nivåerna ska sättas mot. Rapporten anger uttryckligen saknad verifierad kurs som enda skäl för LUG.ST.

## Veckans radar (kommande 5 handelsdagar)
* **Tisdag 13/10** – amerikanska storbanker inleder Q3-säsongen (C, JPM, WFC i `state/earnings_calendar.json`) – riskaptitmätare.
* **Onsdag 14/10** – Lundin Gold handlas fjärde dagen efter produktionsbeskedet; första kursen efter watchlist-tillägget.
* **Torsdag 15/10** – **Kinnevik (KINV-B.ST)** Q3-rapport (`state/earnings_calendar.json`, `isEstimate: false`) – efter +11,36 % på veckan, binär händelse, köps inte före.
* **Tisdag 20/10** – **Scandi Standard (SCST.ST)** Q3-rapport (`isEstimate: false`), utanför femdagarsfönstret men inom 10 handelsdagar.
* **Onsdag 21/10** – **HMS Networks (HMS.ST)**, **MIPS (MIPS.ST)** och **SKF (SKF-B.ST)** Q3-rapporter (`isEstimate: false`).
* **Torsdag 22/10** – **Nokia (NOKIA.HE)**, **Logistea (LOGI-B.ST)**, **Sagax (SAGA-B.ST)**, **Hemnet (HEM.ST)**, **Eastnine (EAST.ST)** och **Vitrolife (VITR.ST, enligt Nordnet/Onvista)**. **Fredag 23/10** – **Saab (SAAB-B.ST)**, **SCA (SCA-B.ST)**, **AAK (AAK.ST)**, **Evolution (EVO.ST)**, **Hoist Finance (HOFI.ST)**. **Tisdag 27/10** – **Sobi (SOBI.ST)**, **Gränges (GRK.HE)**, **KCC (KCC.OL)**.
* **Makro:** räntebesked och inflationsdata för veckan går inte att verifiera ur repots filer (åtgärdspunkt ovan).

**⚠️ TÄCKNINGSANGIVELSE ENLIGT L-1 OCH L-5.** Rapportuppräkningen ovan vilar på `state/earnings_calendar.json` (`generatedAt` 2026-10-13T02:34:29Z, `counts.resolved` **168 symboler**, varav **76 nordiska** i `all`; `failed` 0, `noCoverage` 9), kompletterad med websök för Vitrolife. Samtliga namngivna rapportörer har rad i `config/watchlist.txt` (VITR.ST läggs till i dag). **Nordiska Large/Mid Cap-bolag utanför de 76 är OKONTROLLERADE** – Q3-säsongen pågår för fullt veckorna 42–44 (storbolag som Ericsson, Volvo, Atlas Copco och bankerna brukar rapportera då), men inga sådana datum går att verifiera ur källor körningen når. **L-8:** ingen indexöversyn med beslut och ikraftträdande inom fönstret hittades – `state/news_feed.json` gav **0 träffar** på index-/STOXX-/MSCI-/OMXS30-termer bland fönstrets poster 2026-10-06 – 2026-10-12. Indexleverantörernas primärkällor täcks inte av någon fil i repot och är därmed **OKONTROLLERADE**.

---

## Bruttolista – samtliga 19 kandidater, loggade som AVVAKTA i `state/decisions.json`
LUG.ST, ALVO-SDB.ST, KOA.OL, RILBA.CO (grind 1) · CHEMM.CO, GMAB.CO, EGTX.ST, FRO.OL, HMS.ST, HAYPP.ST, BWE.OL, KINV-B.ST, DEMANT.CO, BAVA.CO, NNIT.CO, EG7.ST, EMBRAC-B.ST (grind 2) · VITR.ST, KCC.OL (grind 3).

**Watchlist (punkt 6/6b, L-2):** fem rader tillagda – LUG.ST, ALVO-SDB.ST, KOA.OL, RILBA.CO (beslut utan kurs) och VITR.ST (bubblare + rapport inom 10 handelsdagar). **Ingen rad borttagen:** listan skyddas enligt `prompts/gemensam_korning.md` av ännu omogna beslut (20 handelsdagars utvärderingsfönster), och en rensning mot 14 handelsdagar kräver en genomgång som inte ryms utan att riskera just de symboler mätningen behöver. Riktmärket 25 är underordnat mätbarheten (`watchlist-cap-vs-measurability-conflict`).

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
