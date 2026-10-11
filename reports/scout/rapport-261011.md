# Daglig Scout: USA & Krypto
**Datum:** 2026-10-11
**Marknadsklimat:** Söndag. De amerikanska börserna har varit stängda sedan rapport-261010, och ingen ny session har ägt rum. Fredagen stängde `^GSPC` på 7 811,54, 0,1 % under rekordet, inför en tung vecka med storbanker, KPI och TSM. Helgens nyheter gäller energi: orkanen Isaias gick i land som kategori 2, och USA:s energidepartement beviljade på lördagen ett nödlån på upp till 4 miljoner fat ur den strategiska oljereserven. Krypto saknar verifierad kurs efter lördag 00:48 UTC. **Aktiva lärdomar tillämpade:** L-3 (åtgärdspunkter sist), L-4 (kontroll av vilande kandidater, se uppföljningen) och L-5 (helgfönstret för krypto och kalenderns universum anges som OKONTROLLERADE). L-2 är uppfylld utan tillägg: inga nya case. L-1, L-6, L-7 och L-8 gäller inte scouten i dag.

## Marknadsöversikt

Samtliga kurser ur `state/prices.json` (källa `Yahoo Finance chart API via GitHub Actions`), `generatedAt` **2026-10-10T00:49:09.104Z**, `schemaVersion` **2026-08-02-prevclose**, `tickerCount` 262 / `okCount` 256. `git pull` 2026-10-11 ~05:48 UTC: arbetskopian i fas med `origin/main` (`982ce33 Veckans rörelser: 2026-10-10 12:31 UTC`). **Filen är densamma som i rapport-261010.** `prices.yml` kör bara mån–fre (`* * 1-5`).

| Symbol | Nivå | Senaste session | marketTime |
|---|---|---|---|
| `^GSPC` | 7 811,54 | +0,59 % (fredag 2026-10-09) – ingen session sedan dess | 2026-10-09T21:29:56Z |
| `^IXIC` | 27 366,17 | +0,64 % (fredag 2026-10-09) – ingen session sedan dess | 2026-10-09T21:15:59Z |
| `BTC-USD` | 82 478,34 | +1,07 % på daterade stängningar 2026-10-08 → 10-09 (81 615,85 → 82 489,32); **ingen verifierad kurs efter lördag 00:47 UTC** | 2026-10-10T00:47:47Z |
| `ETH-USD` | 2 487,49 | +0,35 % på daterade stängningar (2 472,95 → 2 481,59); **ingen verifierad kurs efter lördag 00:47 UTC** | 2026-10-10T00:47:59Z |
| `SPY` (sleeve) | 778,57 | +0,60 % (fredag) | 2026-10-09T20:00:00Z |

**HELGRÖRELSEN I KRYPTO ÄR OKONTROLLERAD (L-5) – KURS EJ VERIFIERAD för lördag–söndag.** `BTC-USD` och `ETH-USD` handlas dygnet runt, men den senaste kursen i repot är **~29 timmar gammal** vid körningen. Reservkällan gick inte att nå: `query1.finance.yahoo.com` gav `CONNECT tunnel failed, response 403` från körmiljön 2026-10-11 ~05:50 UTC. Websöket gav bara odaterade eller gamla nivåer, som enligt prompten inte får användas. Dagens rapport påstår därför ingenting om helgens kryptorörelse – varken uppgång, nedgång eller "ingen rörelse".

Tekniken är oförändrad från rapport-261010, eftersom ingen ny daterad stängning tillkommit: `^GSPC` +7,7 % över MA200 (regimfiltret för US-boken **PÅ**), RSI 59,9. Båda kryptohistogrammen var negativa och fallande vid senaste punkten.

## Ekonomiska siffror & kalender

**Senaste utfall:** inga nya sedan rapport-261010. Fredagens Michigan-stämning (46,3 mot väntade ~47,5) och Deltas sänkta helårsprognos står kvar som senaste datapunkter (Reuters via MarketScreener 2026-10-09).

**Helgens händelse med marknadspåverkan – lördag 2026-10-10:** Energidepartementet beviljade ett **nödlån på upp till 4 miljoner fat ur den strategiska oljereserven (SPR)**, som ska återlämnas senare med ett tillägg (AccuWeather live 2026-10-10; KATV 2026-10-10). Det är ett utbytesavtal, inte en försäljning, och volymen är liten jämfört med bortfallet (se nedan).

**Kommande (källa: websök, inte någon fil i repot – se åtgärdspunkt 3):**
- **Måndag 2026-10-12: Columbus Day.** Kontanthandeln i statsobligationer stängd; aktiemarknaden och obligationsterminerna öppna (Kitco/Reuters "Wall St Week Ahead" 2026-10-09).
- **Tisdag 2026-10-13: storbankerna** – `JPM`, `GS`, `C` och `WFC` enligt Kitco/Reuters 2026-10-09. För `JPM` väntas Q3-vinsten upp ~16 % till 5,90 USD/aktie, och optionsmarknaden prisar en rörelse på ~3,3 % (samma källa). `state/earnings_calendar.json` anger `C`, `JPM` och `WFC` till samma dag (`isEstimate: false`).
- **Onsdag 2026-10-14, 12:30 UTC: KPI september – veckans viktigaste siffra.** Förhandsbedömningen i Kitco/Reuters är **3,6 %** å/å från 3,4 %, och ett utfall i den storleken beskrivs som att det kan befästa ytterligare en räntehöjning i år. Rapport-261010 angav ~3,7 % ur en annan enskild källa: **konsensus är inte entydig, och ingen siffra bör behandlas som säker.** Samma dag `BAC` och `MS` (Kitco/Reuters 2026-10-09; rapport-261010 hade dem odaterade) samt `BLK` (`state/earnings_calendar.json`).
- **Torsdag 2026-10-15: PPI**, som enligt Kitco/Reuters är känsligare för oljepriset, samt `TSM` (`state/earnings_calendar.json`) – veckans prov för AI-temat.
- **2026-10-21 `TSLA`, 2026-10-23 Michigan slutlig, 2026-10-27–28 FOMC** (oförändrat från rapport-261010).
- **L-5:** `state/earnings_calendar.json` ser bara symboler som `prices.yml` redan hämtar. Resten av det amerikanska universumet är **OKONTROLLERAT**. Fem rapportbolag (`GS`, `JNJ`, `BAC`, `MS`, `UNH`) lades in i `config/watchlist_us.txt` 2026-10-10; inga nya tillägg i dag. Rapportförbudet (promptens punkt 8) gäller samtliga: de är bevakningsposter, aldrig köpförslag.

## Aktuella händelser & katalysatorer

- **Orkanen Isaias gick i land vid norra Gulfkusten som kategori 2 och var en tropisk regnstorm på lördagsmorgonen.** Minst fyra döda och över 835 000 kunder utan ström. Källor: AccuWeather live 2026-10-10; CNN live 2026-10-09/10. **Offshore:** cirka **63 % av golfens oljeproduktion (~1,3 miljoner fat/dag) och ~57 % av gasproduktionen** var avstängd före landstigningen (myndighetsdata via gCaptain 2026-10-09 och WAM/Reuters 2026-10-09), med personal evakuerad från 121 av 371 bemannade plattformar (OE Digital 2026-10-09). Shell och Chevron stängde ned flera anläggningar. **Raffinaderier:** analytikerna bedömde att 2–2,4 % av USA:s raffineringskapacitet låg i riskzonen, främst Chevrons Pascagoula och Vertex raffinaderi i Alabama, medan Louisiana-navet kring New Orleans verkade klara sig (CNBC 2026-10-09; gCaptain 2026-10-09). **Inga bekräftade skador på raffinaderier hittades** i helgens källor. Hur snabbt produktionen återstartar avgörs de närmaste dagarna. Inget case: en riskhändelse med okänt utfall är ingen bekräftad bolagskatalysator, och ingen energiaktie har handlats sedan landstigningen.
- **Mellanöstern:** Houthirebellerna anföll Riyadh en andra dag i rad den 2026-10-08 (flygplatsen träffades, minst tre döda), samtidigt som Iran ökat takten i attackerna mot fartyg i Hormuzsundet (Semafor 2026-10-08). Kitco/Reuters 2026-10-09 skriver att oro för utbudet i Mellanöstern drivit Brent "väl över 100 USD per fat". **Ingen oljenivå verifieras ur repots filer** – `state/prices.json` bär inga råvaruterminer.
- **Energiaktierna i fredags (ur `state/prices.json`, marketTime 2026-10-09T20:00–20:02Z):** `XOM` 168,94 (+0,26 %), `CVX` 211,98 (+0,20 %), `DVN` 48,26 (−1,35 %). Marknaden prisade inte in orkanen som någon större händelse för producenterna före helgen.
- **`state/news_feed.json` har inte uppdaterats sedan fredag** (`generatedAt` 2026-10-09T23:18:20Z; `news.yml` kör vardagar). Fönstret bär 10 av 10 handelsdagar, men **helgens pressmeddelanden är OKONTROLLERADE** (L-5). Rubrikerna efter fredagens stängning (prnewswire, sec-8k) innehåller inga bekräftade bolagskatalysatorer inom fokus: mest grupptalan-annonser, utdelningsbesked (`AES`) och 8-K utan beskriven händelse. Ett websök efter förvärv offentliggjorda under helgen gav inga träffar daterade 2026-10-10/11.
- Inga rykten används i dag.

## Uppföljning av tidigare case

Föregående scout-rapport är `reports/scout/rapport-261010.md`, med två case: `TEVA` och `ZS`. Ingen session har ägt rum sedan dess, så "nu" är samma stängning.

- **`TEVA` (rapport-261010): 41,10 → 41,10 USD (±0,00 %, `state/prices.json`, marketTime 2026-10-09T20:00:02Z)** – **tes INTAKT.** Ingen ny kursinformation. Kandidaten `261010-TEVA` står `new` med `expiresAt` 2026-10-16 och avgörs av US-bokens nästa körning (måndag 2026-10-12, 15:00 CEST). Scouten avgör den inte.
- **`ZS` (rapport-261010): 233,73 → 233,73 USD (±0,00 %, `state/prices.json`, marketTime 2026-10-09T20:00:00Z)** – **tes INTAKT.** Kandidaten `261010-ZS` står `new` med `expiresAt` 2026-10-16. Avgörandet ligger hos US-boken.

**L-4-kontroll (ur `state/scout_candidates.json`, 76 poster: 69 `rejected`, 5 `promoted`, 2 `new`):**
- **`261009-DVN`** (avvisad 2026-10-09 på "Grind 2 (datalucka): 1 historikpunkt") – dataluckan är fylld, med 250 daterade punkter och reguljär post-katalysatorstängning 48,26 (2026-10-09). Läget är oförändrat sedan rapport-261010. **Ett nytt fullständigt avgörande mot de fem grindarna krävs av US-boken måndag 2026-10-12, inom `expiresAt` 2026-10-16.** Scouten ändrar inte avgörandet.
- Övriga avvisade poster inom sin `expiresAt` (`261007-BKH`, `261008-VST`, `261008-COST`, `261009-ACN`) vilar på omdömesskäl. L-4 är inte tillämplig.

**Innehav:** `MRVL` 275,28 (fredagens stängning; stop 260,00, mål 313,50) – oförändrat, ingen session sedan dess.

## Dagens case

**Inga case i dag.** Promptens punkt 6 säger att case aldrig ska tvingas fram, och det finns fyra skäl:

1. **Inget nytt kursunderlag.** `state/prices.json` är samma fil som i gårdagens rapport, och ingen amerikansk session har ägt rum. Ett case nu skulle bygga på samma stängningar som rapport-261010 redan prövade.
2. **Helgens enda materiella händelser är makrohändelser utan bolagsutfall.** Orkanen och SPR-lånet påverkar energisektorn, men utfallet är okänt: det avgörs av hur snabbt produktionen återstartar och om raffinaderierna skadats. En kandidat med `confirmed: true` kräver ett inträffat bolagsutfall, och ingen energiaktie har handlats efter landstigningen. Ett case på den grunden vore spekulation om återstarten.
3. **Krypto saknar verifierad kurs sedan lördag 00:47 UTC.** Både trenden (negativa och fallande MACD-histogram vid senaste punkten) och avsaknaden av en katalysator talar emot ett krypto-case, även bortsett från datan.
4. **Två färska kandidater (`TEVA`, `ZS`) och en L-4-omprövning (`DVN`) väntar redan på US-bokens avgörande i morgon.** Fler poster utan nytt underlag späder ut kön utan att tillföra något.

**INGA NYA KANDIDATPOSTER SKRIVS TILL `state/scout_candidates.json` I DAG.** Inga case enligt punkt 5 och ingen bekräftad, handlingsbar bolagskatalysator utanför dem ⇒ inga poster enligt punkt 7. Filen lämnas orörd med sina 76 poster.

## Makro- & sektorfaktorer att bevaka

**Därför avvaktande:** veckan som börjar i morgon samlar tre binära händelser – bankrapporterna tisdag, KPI onsdag och TSM torsdag. Dessutom finns ett energiutbudsläge med två samtidiga störningar: golfen efter Isaias och Mellanöstern, där Brent enligt Kitco/Reuters ligger över 100 USD. Med en väntad KPI på 3,6–3,7 % och en räntehöjning inprisad som möjlig inför FOMC 27–28 oktober är räntesidan motvind för fokusfilens tema "tillväxtbolag som gynnas av fallande/stabila räntor". Rapportförbudet (punkt 8) utesluter samtidigt varje case kopplat till veckans rapportbolag.

**Energi:** återstarten i golfen är den viktigaste okända faktorn för PPI torsdag och för oktobers energikomponent i KPI. Ett snabbt återtag (inga skador på plattformar eller raffinaderier) talar för att oljepremien från orkanen faller tillbaka. Bestående raffinaderiskador vid Pascagoula skulle i stället lyfta raffineringsmarginalerna och bensinpriset. SPR-lånet på 4 miljoner fat motsvarar ungefär tre dagars bortfall vid 1,3 miljoner fat/dag – en signal mer än en lösning.

**Sektor:** fredagens rörelse leddes av mjukvara/säkerhet och en återhämtning i AI-namnen på låg volym (rapport-261010). TSM torsdag prövar AI-temat på riktigt.

**Krypto:** ingen katalysator och ingen verifierad helgkurs. Vid senaste punkten låg `BTC-USD` strax under EMA20 och över MA200, och `ETH-USD` under EMA20 – lång trend intakt, momentum nedåt.

### Åtgärdspunkter till Dren (L-3)

1. **`news-feed-globenewswire-http-403` – kvarstår (öppen 1 vecka enligt `state/action_items.json`).** `state/news_feed.json` `feeds.globenewswire` och `feeds.globenewswire-earnings` = `"HTTP 403 – båda försöken (0.0 s)"` vid senaste körningen 2026-10-09T23:18:20Z. Eftersom `news.yml` inte kör på helger finns ingen ny mätning. Måndagens första körning visar om blockeringen består. **Omfång:** 2 av 6 flöden. **Ersättningskälla:** websök. Detaljerna står i rapport-261010, punkt 1.
2. **Krypto saknar verifierad helgkurs – återkommande, ingen egen åtgärdspunkt hittad.** **Fil och fält:** `state/prices.json` `quotes["BTC-USD"].marketTime` och `quotes["ETH-USD"].marketTime` = 2026-10-10T00:47Z, ~29 timmar gammalt vid körningen, eftersom `prices.yml` kör `* * 1-5`. Samma sak konstaterades i rapport-260927. **Omfång:** 2 av 2 mynt, varje lördag–söndag. **Ersättningskälla:** ingen – Yahoo (`query1.finance.yahoo.com`) gav CONNECT 403 från körmiljön, och websök ger inga daterade kurser. **Åtgärdsförslag:** en helgcron i `prices.yml` begränsad till `BTC-USD`/`ETH-USD` (två anrop per körning). Alternativet är att uttryckligen godta att scoutens helgrapporter saknar kryptokurs.
3. **`macro-calendar-not-verifiable-from-state` – ÅTERKOMMANDE (öppen 5 veckor).** KPI-, PPI-, bank- och FOMC-datumen kommer från websök (Kitco/Reuters 2026-10-09). KPI-konsensus skiljer sig mellan källorna: 3,6 % hos Kitco/Reuters mot ~3,7 % hos Admiral Markets i rapport-261010.
4. **`crypto-previousclose-misdated` – ÅTERKOMMANDE (öppen 7 veckor).** `previousClose` för `BTC-USD` är 81 676,34, medan den daterade stängningen 2026-10-09 i `state/price_history.json` är 82 489,32. För `ETH-USD` är motsvarande 2 471,91 mot 2 481,59. **Omfång:** 2 av 2 mynt. **Ersättningskälla:** de daterade stängningarna i marknadsöversikten. `weeksOpen` ≥ 3 innebär att watchdogens `checkRecurringActionItems` redan bör larma.
5. **`watchlist-cap-vs-measurability-conflict` – ÅTERKOMMANDE.** Oförändrat från rapport-261010: inga rader stryks och inga läggs till i dag. `BK` saknar fortfarande kurs i `state/prices.json`, nu med rapport inom tre handelsdagar, och `WBD` bär `marketTime` 2026-10-05. Ingen ny mätning finns förrän `prices.yml` kör måndag.

Detta är automatiserat beslutsstöd, inte finansiell rådgivning.
