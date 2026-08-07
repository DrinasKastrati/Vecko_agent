# Vecko_agent — projektkontext (läs detta först)

Detta dokument finns för att en ny Cowork-/Claude-session snabbt ska förstå projektet, nuläget
och vad som är kvar att göra. Ägare: **Dren** (kastratidrinas@gmail.com).
**Senast uppdaterad:** 2026-08-02.
**AKTIV ARBETSKOPIA:** `C:\Users\drini\code\Vecko_agent` (ny dator sedan 2026-07-31 – arbeta HÄR).
Tidigare kopior (`C:\Users\kastrdri\Git_proj\gitVecko_agent` samt den under OneDrive) är utfasade.

---

## 1. Vad projektet är
Ett automatiserat system för aktie-beslutsstöd. Sex ursprungliga delar beskrivs nedan; delarna
7–9 (US-rotation, allokerings-routine, miss-retro) tillkom senare och beskrivs i `docs/HISTORIK.md`.
Stödinfrastruktur som inte är egna "delar": nyhetsingestion (`news.yml` → `news_feed.json`),
beslutslogg (`decisions.json` + validator) och backtest (`backtest.mjs`).

1. **Routinen** – en schemalagd Claude-körning som varje handelsdag (LÄGE B) bevakar innehav och
   varje måndag (LÄGE A) gör en full veckorotation. Den läser preferenser/tillstånd/mallar,
   skriver en markdown-rapport + uppdaterar portföljen och committar direkt till `main`.
   Strategin (sedan 2026-07-31): upp till **4 nordiska aktier à ~25 %** plus en **indexsleeve**
   (`XACT-OMXS30.ST`) som håller oallokerat kapital; positionerna omprövas varje vecka men säljs
   INTE automatiskt (BEHÅLL är standardvalet). Dagligt beslut per aktie = **KÖP / SÄLJ / BEHÅLL**
   (eller AVVAKTA om kurs ej kan verifieras).
2. **Webb-dashboarden** – en sida som hämtar rapporterna live från repot och visar dem snyggt
   (dagsöversikt, fulla rapporter, nyheter/radar, avkastning). Mörkt "trading-terminal"-tema.
3. **Pris-hämtaren** – en GitHub Action som hämtar aktiekurser och skriver `state/prices.json`,
   eftersom routinens egen körmiljö är nätspärrad mot kurssajter (se avsnitt 6).
4. **Scout-routinen (USA & krypto)** – en FRISTÅENDE andra routine som varje dag sammanfattar
   USA-/kryptomarknaden (marknadsöversikt, ekonomiska siffror, aktuella händelser) och tar fram
   2–3 nya case. Skriver `reports/scout/rapport-yymmdd.md`, egen kategori i dashboarden. Täcker
   INTE Norden (det gör del 1).
5. **Analys på begäran** – skriv en ticker i dashboardens "Analys"-flik → ett förifyllt GitHub-issue
   ("analys: TICKER") köas av en NYCKELLÖS Action till `state/analysis_queue.json`. En MANUELL
   Claude-arbetare (`prompts/analysprompt.md`, körs i Cowork – **ingen API-nyckel**) bearbetar kön
   och skriver `reports/analysis/analys-TICKER-yymmdd.md`. Dashboarden cachar och visar analyserna.
6. **Intradag-monitor** – en NYCKELLÖS, LLM-FRI Action (`.github/workflows/monitor.yml` +
   `scripts/alerts.mjs`) som varje timme under börstid jämför öppna innehav/pending mot
   stop/mål/entry ur `state/portfolj.md` och flaggar KÖP/SÄLJ-signaler till `state/alerts.json`
   (dashboard-banner + GitHub-issue/e-post + **push-notis till telefonen sedan 2026-08-03**).
   Ren aritmetik → **noll tokens**; ersätter INTE routinens omdöme utan larmar bara att en nivå
   korsats.

- **Repo:** https://github.com/DrinasKastrati/Vecko_agent  (publikt, branch `main`)
- **Dashboard (GitHub Pages):** https://drinaskastrati.github.io/Vecko_agent/

---

## 2. Filer med särskilda regler
Repots struktur framgår av `ls`/`find`. Det som INTE syns i filträdet:

- `index.html` MÅSTE ligga i repo-roten – annars serverar inte GitHub Pages den på sajtens rot.
- `templates/` – strikta mallar. Routinerna får ALDRIG ändra dem (dashboardens parsningskontrakt).
  **Undantag: aktieanalyserna.** Dashboarden PARSAR INTE `reports/analysis/*.md` – den renderar dem
  som markdown och hittar dem enbart på filnamnet (`analys-<TICKER>-yymmdd.md`). Därför styrs deras
  form sedan 2026-08-03 av `prompts/aktieanalys_prompt.md` (Drens egen analysprompt: fem numrerade
  avsnitt, peers med namngiven konkurrent, ägarstruktur, exakt tre rangordnade risker,
  Bull/Base/Bear-tabell med riktkurser, omdöme i klammer `[KÖP]`/`[BEHÅLL]`/`[AVVAKTA]`/`[AVSTÅ]`/
  `[TECKNA]`). `templates/analys_mall.md` är därmed URKOPPLAD – ingen prompt läser den längre.
- `prompts/START.md` – korta laddare som routinerna pekar på; prompttexten klistras aldrig in.
- `state/lessons.md` – skrivs ENDAST av miss-retron.
- `state/news_feed.json` – PRIMÄR nyhetskälla för alla tre routinerna, inte ett komplement.
  **Fönstret mäts i HANDELSDAGAR (10), inte timmar – sedan 2026-08-03.** Det var 48 timmar, vilket
  kollapsade över helgen: måndag 05:58 UTC låg fredagens sista hämtning 55 timmar bakåt och rensades
  bort, så veckorotationen läste ett fönster på **47 minuter** och fick gå till git-historiken efter
  fredagens poster. Taket per källa och dygn (30) finns för att DAGARNA ska överleva, och det globala
  taket (2000) är medvetet satt över vad per-dygn-taket kan producera (6 × 30 × 10 = 1800) – är det
  lägre blir per-dygn-taket verkningslöst och fönstret kollapsar igen, bara långsammare. Ett test
  vaktar invarianten. Fältet `window` (täckning, `missingDays`, `perSource`) gör täckningen
  KONTROLLERBAR; watchdogen larmar under 5 handelsdagar. **Webbappen läser INTE filen** (Nyheter-vyn
  byggs ur rapporterna), så fönsterstorleken kostar inget i dashboarden.
- `state/decision_eval.json` – GENERERAD av `.github/scripts/decision_eval.mjs`, som körs i
  pris-jobbet (`prices.yml`) direkt efter hämtningen. Märkt `-merge` i `.gitattributes`. Redigera
  aldrig för hand. **Varför den finns:** backtestet visar att skelettet inte tillför avkastning över
  indexsleeven ⇒ edgen måste komma ur katalysatorurvalet, och ingenting mätte urvalet.
  `computeTradeStats` kräver STÄNGDA affärer (2 st) och retrons beslutsstatistik kräver 15 SÄLJ-rader
  – år bort. Den här filen mäter i stället VARJE rad i `decisions.json` mot efterföljande kurs 5/20
  handelsdagar framåt och mot bokens index (^OMX/^GSPC) över samma fönster, **inklusive de AVVISADE
  (AVVAKTA)**. De avvisade är hela poängen: de är det kontrafaktiska underlaget, och underlaget växer
  med ~10–15 rader/vecka i stället för ~1/månad. Två regler som inte får luckras upp: (1) ett omoget
  beslut räknas ALDRIG som noll – det drar alla medelvärden mot mitten, det ska utelämnas; (2) inget
  uttalande under `minN` (8) mätpunkter – fältet skriver `insufficient` + hur många rader som fattas.
  Skriptet skriver bara vid FAKTISK ändring (`generatedAt` jämförs inte), annars gav det ~48 tomma
  commits per dygn.
- **`state/scout_candidates.json` – BRYGGAN SCOUT → BÖCKERNA (ny 2026-08-04).** Scouten
  producerade prosa som ingen bok läste: Palantir flaggades i rapport-260801, -260802 och
  -260803 inför sin rapport 3/8 AMC, boken kunde varken se, avfärda eller köpa kandidaten,
  och aktien gick **+27,6 %** den 4/8. Fyndet fanns – kanalen fanns inte. Filen ÄR kanalen.
  **Regeln som inte får luckras upp:** varje kandidat med `status: "new"` MÅSTE få ett
  avgörande av ansvarig bok vid nästa körning – `rejected` med NAMNGIVEN spärr i
  `decisionReason`, eller `promoted`. Att låta en ligga kvar tills den expirerar är exakt
  den tystnad filen byggdes för att omöjliggöra; watchdogen larmar på den, för ingenting
  annat gör det (inget går sönder, rapporten ser normal ut). Varje avgörande loggas
  DESSUTOM i `decisions.json` (`KÖP`/`AVVAKTA`) så `decision_eval.mjs` får kontrafaktiskt
  underlag. Två hårda spärrar i `validate-scout-candidates.mjs`: **ingen promotion utan
  verifierad kurs** och **ingen promotion av obekräftad katalysator** (`confirmed: false`).
  Skrivs av scoutprompten (punkt 7) **och av analysarbetaren (`analysprompt.md` punkt 3g) när
  omdömet är `[KÖP]`/`[TECKNA]`**, läses av båda rotationsprompterna (punkt 2d) och av
  miss-retron (punkt 2c). Validatorn körs i `test.yml` OCH i auto-merge-grinden.
  **Analysen var samma återvändsgränd som scouten fram till 2026-08-04:** den skrev ett explicit
  köpomdöme i klammer som INGEN bok läste. Ett köpomdöme utan mottagare är inte beslutsstöd.
  Nordiska boken får normalt en TOM lista – scouten täcker bara USA/krypto, och nordisk
  kandidatgenerering sker direkt ur `news_feed.json` i LÄGE A punkt g0. Nordiska poster uppstår
  via `source: "analys"`. Leta ingen bugg i en tom lista.
  **Miss-retron (punkt 2c) läser filen för den DYRASTE sortens miss:** en vinnare systemet SÅG
  och ändå avstod från. De vanliga missdetektorerna (`movers.json`, nyhetssök) hittar bara sådant
  systemet aldrig såg. Retron ska leta MÖNSTER i `decisionReason` – faller samma spärr gång på
  gång på namn som sedan stiger är spärren felkalibrerad. Ett enskilt avvisat namn som gick upp
  är däremot facit-bias, inte en miss.
  **I dashboarden:** rutan "Kandidatkö" i Scout-vyn (`VRender.renderCandidates`). Den visar KÖN,
  inte utfallet – utfallet syns redan på annat håll (promotad → `KÖP` → Hem-vyns "något att
  göra?", avvisad → `AVVAKTA` → "Avvisade" i beslutsutvärderingen). Det som INTE gick att se
  förrän nu var en kandidat som ligger och väntar, och det var precis den tystnaden som lät
  Palantir flaggas tre dagar i rad. En försenad kandidat får en röd kant och en varningsrad.
  **Kursen fylls i AUTOMATISKT sedan 2026-08-05** av `.github/scripts/refresh-candidate-prices.mjs`
  (körs i `prices.yml` efter hämtningen), men BARA från en kurs som bevisligen ligger efter
  katalysatorn: utökad punkt senare än `catalystDate`, utökad `post`-punkt samma dag, eller
  reguljär kurs en dag strikt efter. **Anledningen:** 2026-08-05 låg ANET och AMD båda med
  `price: null` medan `prices.json` HADE kurser för dem – kurserna var stängningen 2026-08-04,
  och båda rapporterade 2026-08-04 AMC. Ett skript som fyllt i "kursen som fanns" hade skrivit
  en pre-event-kurs på en post-event-katalysator. Regeln uttrycks med datum + sessionsetikett,
  ALDRIG med klockslag: Stockholm stänger 15:30 UTC, New York 20:00 UTC, och sommartid flyttar
  båda. Kandidatfilen är sedan samma datum också TICKERKÄLLA för `fetch-prices.mjs`
  (`collectCandidateTickers`), vilket ersätter handpåläggningen i `config/watchlist_us.txt`.
  En kandidat med `priceSession` `"pre"`/`"post"` får BEDÖMAS men aldrig direktköpas –
  köpet läggs som villkorad Pending-plan med entry mot reguljär session.
- **`state/earnings_calendar.json` – GENERERAD av `.github/scripts/earnings-calendar.mjs`,
  körs i `prices.yml` på 05:00-cronen. Redigera aldrig för hand.** Löser att watchlistan
  fylldes i EFTERHAND: PLTR saknade rad i `watchlist_us.txt`, fick därför ingen kurs, föll
  på grind 1 (verifierbar kurs) och kunde inte utvärderas – och lades till dagen efter
  rörelsen. `fetch-prices.mjs` läser fältet `upcoming` och prisbevakar varje symbol som
  rapporterar inom 10 handelsdagar; posterna faller ur av sig själva när datumet passerat,
  så listan behöver ingen hygien. **Yahoo kräver cookie + crumb** (fc.yahoo.com → getcrumb →
  quoteSummary); utan dem 401 "Invalid Crumb". **Fälla: `isEstimate: true` betyder att Yahoo
  GISSAT datumet ur förra årets kadens.** Ett gissat datum duger för att säkra en kurs i
  förväg men får ALDRIG behandlas som "binär händelse inom 2 handelsdagar" – då kunde en
  gissning blockera ett köp, eller värre, släppa igenom ett köp dagen före en riktig rapport.
  Faller hämtningen lämnas filen ORÖRD (en tom kalender läses som "inga rapporter på väg").
  Märkt `-merge` i `.gitattributes` av samma skäl som `decision_eval.json`: två skrivare (actionen
  och en lokal felsökningskörning), och en auto-merge lägger konfliktmarkörer mitt i JSON:en.
  Fältet `errors` ska vara TOM i friskt läge – det är vad man larmar på. Instrument som saknar
  rapporter (ETF/index/valuta ⇒ HTTP 404) ligger i `notApplicable`. Utan den uppdelningen innehöll
  `errors` alltid indexsleeven (SPY, XACT-OMXS30.ST) och gick därför inte att larma på.
  **I dashboarden:** hopfällbara rutan "Rapporter på väg" i Översikt (`renderEarningsSoon`), som
  fäller ut sig SJÄLV bara när ett INNEHAV rapporterar – det är då det är en binär händelse som
  kräver ett beslut. Ett `isEstimate`-datum märks "gissat datum" och räknas aldrig som bekräftat.
- **`state/decisions.json` bruttolist-spärr i watchdogen (2026-08-04).** Regeln "logga hela
  bruttolistan i LÄGE A" fanns redan sedan 2026-08-03 och följdes ändå inte:
  us-veckorapport-260803 avvisade tretton namn i prosa men skrev två rader, så INTC och AMD
  finns noll gånger i loggen. En mening till i prompten hade inte hjälpt – regeln fanns.
  `checkGrossList` larmar därför när en måndagskörning ger < 6 rader för en bok. Tröskeln är
  medvetet låg (prompten kräver 10–15 kandidater) så den bara fångar det uppenbara fallet.
- **`state/live_start.json` – SKARP START MED RIKTIGA PENGAR 2026-08-10. Läs den innan du
  felsöker en "tom" bok.** Båda portföljerna nollställdes 2026-08-06 av
  `.github/scripts/reset-books.mjs`: noll innehav, noll pending, 100 % kassa, tom historik och
  ackumulerad avkastning +0,00 %. **Det är avsett – leta ingen bugg i en tom bok före
  v33-rotationen.** Pappersperioden 2026-07-14–2026-08-06 (nordiskt +6,28 %/2 affärer, US
  +0,89 %/1 affär) ligger oförändrad i `state/archive/portfolj-paper-260810.md` respektive
  `portfolj_us-paper-260810.md` och syns MEDVETET inte i dashboarden – Avkastning-vyn ska visa
  skarp period och ingenting annat. **`decisions.json` och `decision_eval.json` nollställdes
  INTE och får aldrig nollställas i efterhand:** de mäter om URVALET slår index, vilket är
  oberoende av om pengarna var riktiga, och de är det enda underlag som växer i meningsfull takt
  (~10–15 rader/vecka mot `minN` 8 och retrons krav på 15 SÄLJ-rader). Av samma skäl loggades
  INGA SÄLJ-rader för AMZN eller indexsleevarna när böckerna tömdes – de affärerna gjordes
  aldrig, och ett fiktivt utfall hade förgiftat just den mätningen. Snittet markeras därför i
  den här filen och inte i beslutsloggen; validatorns `action`-enum tillåter ändå bara
  KÖP/SÄLJ/BEHÅLL/AVVAKTA. **Kör aldrig om `reset-books.mjs` utan `--force`** – den vägrar av
  sig själv när den här filen finns. Skriptet är torrkörning som standard, återanvänder
  tabellhuvudena ur den befintliga filen (parsningskontraktet mot `vparse.js:parsePortfolio`,
  hårdkoda dem aldrig) och committar inte. Kapitalmodellen är OFÖRÄNDRAD: böckerna räknar
  fortsatt i vikt-%, inte i belopp. Designen står i
  `docs/superpowers/specs/2026-08-06-nollstallning-skarp-start-design.md`.
- `state/decisions.json` – append-only, valideras i CI av `validate-decisions.mjs`.
  **HELA bruttolistan loggas i LÄGE A sedan 2026-08-03**, inte bara de valda: varje kandidat som föll
  bort får en `AVVAKTA`-rad med den namngivna spärren i `reason`. Rotationen 2026-08-03 hade 16
  bruttokandidater och loggade 3 rader – med hela listan växer det kontrafaktiska underlaget i
  `state/decision_eval.json` ~5× snabbare. Kandidater som föll på att kursen inte kunde verifieras loggas med
  `price: null` (validatorn tillåter det). **Det är INGEN uppmjukning av kursverifieringskravet** –
  raden dokumenterar att inget kursbaserat beslut fattades, och en rad med `price: null` får aldrig
  bli ett KÖP.
- `state/portfolj.md` / `portfolj_us.md` – historiken är append-only. Radera aldrig filerna.
- `config/universe_nordic_movers.txt` – används BARA av `movers.mjs` (missdetektion), inte av pris-hämtaren.
- `assets/themes/base.css` – all struktur; hårdkoda aldrig färg/radie/typsnitt där, lägg en token.
- `state/dashboard.json` / `search-index.json` – GENERERADE av `dashboard.yml`. Redigera aldrig
  för hand; kör `node .github/scripts/build-dashboard.mjs` i stället. De är märkta `-merge` i
  `.gitattributes`: både actionen och lokala körningar skriver dem, och eftersom filen är EN rad
  blev varje samtidig ändring en konflikt som lade `<<<<<<<` MITT I JSON:en – webbappen föll då
  tyst tillbaka på ~60 hämtningar. Vid konflikt: bygg om och `git add`, aldrig handmerga.
- `sw.js` – service worker, nät-först. Bumpa `CACHE`-namnet om formatet på det som cachas ändras.
- **Manualerna har tre olika målgrupper – blanda inte ihop dem.** `Kom-igang.html` = använda
  dashboarden (enkel, ingen teknik). `Systemguide.html` = hur besluten fattas, hur de mäts och
  vad backtestet visade (djup, för den som vill förstå). `MANUAL.md` = drift åt Dren (push,
  tester, felsökning). **Lägg inte till en fjärde.** `Anvandarguide.html` och `Anvandarmanual.html`
  raderades 2026-08-02 just för att de överlappade de tre ovan – innehåll som saknas ska in i rätt
  av de tre, inte i en ny fil. De två `.html`-manualerna renderas till PDF med `make-manual.bat`
  – **kör det efter varje ändring**, annars ligger PDF:en kvar på gammalt innehåll utan att någon
  märker det. Deras GEMENSAMMA utseende ligger i `assets/manual.css` (utbruten 2026-08-02) –
  ändra där, inte i respektive fils `<style>`-block. Blocken innehåller bara det som är unikt
  för filen plus Systemguidens nio medvetna överskrivningar.
- **Push-notiser (sedan 2026-08-03): `.github/scripts/webpush.mjs` + `push-notify.mjs`, körs i
  `monitor.yml`.** Den gamla 🔔-knappen gjorde två fel, båda TYSTA: (1) den använde
  `new Notification(...)`, som på Android är en förbjuden konstruktor ("Illegal constructor") och
  kastade in i ett tomt `catch` – knappen såg ut att fungera men gjorde ingenting på telefonen;
  (2) den byggde på en `setInterval` i appen, alltså bara medan fliken låg öppen, vilket på en
  telefon i praktiken är aldrig. En äkta push måste skickas FRÅN en server och väcker service
  workern med appen stängd. Servern är GitHub-runnern. **Använd aldrig `new Notification` igen** –
  gå via `registration.showNotification()`; `tests/theme.mjs` larmar.
  Kryptot (RFC 8291 aes128gcm + RFC 8292 VAPID) är skrivet med bara `node:crypto`, eftersom
  monitor.yml aldrig kört `npm install` och inte ska börja. **Ett fel i nyckelhärledningen syns
  ingenstans:** push-tjänsten svarar 201 (den läser aldrig innehållet) och telefonen kastar
  paketet tyst – symptomet blir "inga notiser", utan felmeddelande. Därför verifieras det mot
  RFC 8291 §5:s officiella testvektor i `tests/run.mjs` ("webpush: RFC 8291 §5"), byte för byte,
  plus att VAPID-signaturen är ES256 i JOSE-format (`ieee-p1363`; DER ger 401 från FCM).
  **Kör det testet efter varje ändring i webpush.mjs.**
  **Notisikonen måste vara PNG** (`assets/icon-192.png` + `assets/badge-96.png`, byggda av
  `.github/scripts/make-icons.mjs`). Android/Chrome renderar INTE svg i en notis: pekar `icon` på
  en svg blir notisen helt utan ikon, tyst och utan felmeddelande. `badge` är statusradens lilla
  symbol och tonas om till en enfärgad mask – därav den separata vita filen; en färgad badge blir
  en vit klump. `tests/theme.mjs` larmar om någon pekar tillbaka på en svg. SVG-filerna är kvar
  och fortfarande rätt format för favicon och dashboardens logotyp.
  `--preview` skickar ett exempel av varje sort, byggt av driftens EGNA funktioner – gör aldrig om
  det till handskrivna strängar, då visar förhandsvisningen något annat än det som kommer.
  Bara **KÖP/SÄLJ** notifieras – aldrig BEHÅLL/AVVAKTA. Samma regel som styr "något att göra?" i
  Hem-vyn: systemet lägger inga ordrar, så bara köp och sälj är åtgärdbart. Håll dem i synk.
  `state/push_sent.json` är dedupe-listan; **första körningen skickar med flit ingenting** (den
  fyller bara listan), annars hade femton historiska beslut landat som femton notiser samtidigt.
  Nycklar: publik i `config/push.json` (committas), privat i hemligheten `VAPID_PRIVATE_KEY`.
  **Byt aldrig par i onödan** – alla registrerade enheter blir tysta tills de tryckt 🔔 igen.
  Enheter registreras via ett förifyllt issue ("push: …") som `push_subscribe.yml` lägger i
  `state/push_subs.json` – samma nyckellösa mönster som analyskön; alternativet är hemligheten
  `PUSH_SUBSCRIPTIONS`, och avsändaren läser båda. Latensen är monitorns egen (≤ 1 h under
  börstid): en egen workflow som lyssnar på push mot main hade ALDRIG gått igång, eftersom GitHub
  inte startar workflows för commits gjorda med `GITHUB_TOKEN` – och det är så både `alerts.json`
  och rapporterna når main.
- Actions `monitor`/`news`/`movers`/`analys_queue`/`push_subscribe` är nyckellösa och LLM-fria –
  de kostar noll tokens.
- **`auto_merge.yml` KÖR CI SJÄLV (sedan 2026-08-03) – rör inte den grinden.** GitHub startar
  medvetet inga workflows för pushar gjorda med den inbyggda `GITHUB_TOKEN` (skydd mot rekursiva
  körningar), och både `test.yml` och `dashboard.yml` lyssnar på `push` mot main. Följden var att
  ALLT routinerna producerade nådde main utan validering och utan dashboard-ombyggnad – CI var i
  praktiken avstängt för systemets egen output. Eftersom triggern inte går att få tillbaka kör
  actionen nu `validate-decisions.mjs` + `tests/run.mjs` + `tests/theme.mjs` INNAN den pushar, och
  bygger om `dashboard.json`/`search-index.json` efteråt. **Faller grinden pushas ingenting:** mergen
  kastas lokalt (`git reset --hard origin/main`), branchen lämnas KVAR så inget arbete försvinner,
  och jobbet failar synligt. `tests/data.mjs` är medvetet utanför grinden (hämtar ~110 filer över
  nätet) och körs bara i `test.yml`.
- **Watchdogen (`.github/scripts/watchdog.mjs`) bevakar två saker som är TYSTA fel.** (1) Regimfiltret
  behandlar en oberäknelig MA200 som AV, alltså inga nya positioner – det gör indexserien i
  `price_history.json` till en tyst spärr för HELA boken: faller `^OMX`/`^GSPC` ur pris-hämtningen
  slutar boken ta positioner utan att något går fel någonstans, och rapporten kan inte skilja det
  från en genuint svag marknad. Larmar per index under 200 stängningar. (2) Nyhetsfönstrets
  TÄCKNING, inte bara `generatedAt` – en fil kan vara färsk och ändå för tunn, och bara det första
  mättes tidigare. Båda kontrollerna är bakåtkompatibla: saknas fälten är watchdogen tyst.
  (3) **Analyskön (`checkAnalysisQueue`, 2026-08-07).** Kön FYLLS av ett nyckellöst Action men
  TÖMS av en manuell arbetare, så en glömd begäran bryter ingenting: issuet är redan kvitterat
  och stängt, dashboarden ser normal ut och ingen fil blir gammal. SAAB.ST låg pending
  2026-07-14 → 2026-08-07 – 24 dygn – utan att något larmade. Tröskeln är 14 dygn och medvetet
  generös (arbetaren körs för hand); en oläsbar `requestedAt` larmar INTE. **Checken skiljer på
  två fel med olika åtgärd:** en post som ligger i BÅDE `pending` och `done` (matchat på
  ticker + `requestedAt`) är REDAN KLAR och ska bara bort – det var det som faktiskt hade hänt
  med SAAB.ST, arbetaren kopierade i stället för att flytta. Den rapporteras som
  `analysis-queue-done` och utesluts ur ålderslarmet, annars hade svaret blivit "kör arbetaren"
  på en analys som redan fanns. Samma ticker med ANNAN `requestedAt` är en legitim ombegäran
  (NVO finns tre gånger i `done`) och larmar aldrig.
- **INTRADAG-KORSNINGAR: `alerts.mjs:evalSignals` MÅSTE läsa `dayHigh`/`dayLow` (fix 2026-08-07).**
  Funktionen läste bara `q.price`. Monitorn mäter en gång i timmen, så varje nivå som handlades
  genom MELLAN två mätpunkter var osynlig – för stop-loss, målkurs OCH pending-entry. Saabs
  målkurs 635 genomhandlades 2026-08-04 (dagshögsta 636,10) medan senastekursen låg på 619,70;
  monitorn teg och försäljningen beslutades först dagen efter av routinen. Datat fanns hela
  tiden: BÅDE Yahoo och stooq levererar fälten, för alla 58 tickers. **Gör aldrig om det till en
  ren `q.price`-jämförelse.** Signalen bär numera `basis` (`"price"` | `"intraday"`) och
  `hitPrice` (kursen som korsade nivån); `reason` hålls OFÖRÄNDRAD med flit, eftersom
  `mergeHistory` nycklar på `ticker|type` och notisnyckeln på `reason` – en ny sträng hade gett
  en andra notis för samma händelse. Både `renderAlerts` och notistexten visar `hitPrice`, annars
  läser larmet "målkurs nådd (nivå 635) · kurs 619,7" och ser motsägelsefullt ut. Stoppen prövas
  FÖRE målet även när båda korsats samma dag: risken först. Saknas fälten är beteendet exakt som
  förr.

Rapportfilnamn: `daglig-yymmdd.md`, `veckorapport-yymmdd.md` (yy=år, mm=månad, dd=dag).

## 3. Webb-dashboarden (teknik)
- Ren HTML/CSS/JS, inga byggsteg i webbappen. Laddar `marked@12`, `chart.js@4` och
  `lightweight-charts@4` från jsdelivr (CDN), samt de egna modulerna i ordning:
  `theme.js` och `settings.js` (i `<head>`) → `vparse.js` → `vrender.js` → `app.js`.
  **Varje sådan modul måste också stå i `SHELL` i `sw.js`**, annars fungerar den inte offline –
  `settings.js` saknades där fram till 2026-08-02. `tests/theme.mjs` kontrollerar det numera.
- **Datakällan är FÖRBYGGD (sedan 2026-08-02).** `state/dashboard.json` innehåller allt
  markdown-härlett färdigparsat och skrivs av `dashboard.yml` (nyckellös, LLM-fri) med samma
  `assets/vparse.js` som webbappen. Laddningen gick från ~106 nätanrop till ~23, varav 0
  masshämtad markdown. Volatil JSON (prices/alerts/allocation/decisions/kostnader/kön) bakas
  medvetet INTE in – den skrivs var 30:e minut och skulle tvinga fram ombyggnad lika ofta.
  **Budgeten är nästan slut:** `tests/data.mjs` kräver ≤ 30 hämtningar i den förbyggda vägen och
  ligger på **29** sedan kandidatkön och rapportkalendern kopplades in 2026-08-04. Nästa
  direkthämtade fil spränger taket – det är avsiktligt, den ska tvinga fram ett medvetet val
  mellan att baka in filen i `dashboard.json` och att höja taket. Höj det aldrig reflexmässigt.
  **Fallback finns kvar:** saknas eller fallerar `dashboard.json` går appen tillbaka till att
  läsa filträdet via GitHub-API:t och hämta varje rapport – t.ex. i fönstret mellan att en
  routine pushat och att actionen kört. `tests/data.mjs` bevisar att BÅDA vägarna fungerar.
  Fulltextsökningen läser `state/search-index.json` (en hämtning, lat laddad) i stället för 57.
  **Taken i `build-dashboard.mjs` är satta efter vad appen FAKTISKT läser** (bara `scouts[0]`
  renderas) – höj dem där om en vy börjar läsa längre bak i en lista.
- **Hem har TVÅ detaljnivåer (sedan 2026-08-02).** `data-hemmode` på `<html>`: `enkel`
  (STANDARD) renderar `VRender.renderSimple()` – klarspråk, svarar på "behöver du göra något i
  dag?", ingen högerspalt. `detaljerad` är den gamla vyn med innehavskort och rail. Modellen
  byggs i `app.js:simpleModel()`; renderfunktionen är REN och testas utan DOM. Växeln sitter i
  Hem-vyns rubrikrad och skriver via `VSettings`, och app.js lyssnar på attributet med en
  MutationObserver i stället för att koppla ihop modulerna. **Uppgiftslogiken är hela poängen:
  systemet lägger inga ordrar, så bara KÖP/SÄLJ räknas som "något att göra" – BEHÅLL gör det
  aldrig.** Lägger du till en vy-variant: ändra aldrig `renderSimple` till att läsa DOM.
- **Inställningar (sedan 2026-08-02):** `assets/settings.js` (`window.VSettings`) – vyn
  `installningar`, nås via kugghjulet i toppraden (medvetet INTE i menyn, elva flikar räcker).
  En deklarativ `SCHEMA`-tabell beskriver varje inställning; vyn RENDERAS ur tabellen, så en ny
  inställning = en post i SCHEMA + oftast en rad CSS. Valen skrivs som data-attribut på `<html>`
  och plockas upp av `base.css` som rena token-överskrivningar → fungerar i alla teman utan att
  något tema känner till dem. **Lagring: `localStorage` (nyckel `vr_settings`), alltså PER ENHET
  OCH WEBBLÄSARE** – inget sparas i repot, inget delas mellan personer. Tema och ljust/mörkt ÄGS
  av `VTheme`; VSettings delegerar dit så det bara finns en sanning. Precedens för läget:
  `?mode=` i URL:en > sparat val > temats standardläge.
- **Tredjepartsbiblioteken laddas LAT (sedan 2026-08-03).** `marked` (35 kB), `chart.js` (206 kB)
  och `lightweight-charts` (164 kB) låg som fasta `<script>` i `index.html` och hämtades vid VARJE
  sidladdning – 405 kB som startvyn inte använder en rad av. De hämtas nu av `app.js:lib(name)`
  när de faktiskt behövs (rapport öppnas / Avkastning visas / kursmodalen öppnas). **Lägg dem
  aldrig tillbaka i `index.html`** – `tests/theme.mjs` larmar. `lib()` har en tidsgräns på 8 s och
  resolvar `false` i stället för att hänga: varje anropsställe har en reserv (rå markdown,
  "diagram kunde inte laddas"), och en död CDN får aldrig låsa en vy på "Hämtar…".
- **VIEW TRANSITIONS API FÅR ALDRIG ÅTERINFÖRAS (2026-08-03).** Det låg i koden 2026-08-02 15:49
  (`e6bd08e`) till 2026-08-03 och gjorde flikbyten tröga: webbläsarens **standard-crossfade av
  `root`-lagret** täcker allt utan eget `view-transition-name` – alltså ramen och menyn – och var
  aldrig avstängd. Tillsammans med `::view-transition-*(page)` och `.view{animation:fade}` spelade
  tre animationer samtidigt, plus en ögonblicksbild av hela vyporten per klick. Vybytet ska vara
  DIREKT, med bara `.view`-toningen. `tests/theme.mjs` larmar om det kommer tillbaka.
- **Går ett fel inte att MÄTA fram: bisecta.** Exportera commits till fristående mappar med
  `git archive <hash> | tar -x -C <mapp>`, märk dem som rört webbappen, och låt den som ser felet
  halvera sig fram. Två omgångar CDP-mätningar hittade ingenting eftersom referensen var fel –
  felet fanns i båda versionerna som jämfördes. Bisecten tog tjugo minuter.
- **RÖR ALDRIG EN UTF-8-FIL MED POWERSHELL 5.1 (fälla, 2026-08-03).** `Get-Content -Raw` läser
  UTF-8 som ANSI om `-Encoding` utelämnas. Skrivs innehållet sedan tillbaka med
  `Set-Content -Encoding UTF8` blir varje "ä" bytesekvensen `C3 83 C2 A4` ("Ã¤") och filen får en
  BOM. Det hände `index.html`: 81 tecken förstördes, rubriker och meny visade `¤`. Felet syns
  INTE i en vanlig diff – bara på bytenivå. **Använd Edit/Write-verktygen för filändringar**, eller
  `git checkout -- <fil>` för att återställa. `tests/theme.mjs` kontrollerar numera BOM och
  dubbelkodning i alla filer webbappen läser.
- **Typsnitts-URL:en är känslig (fälla, kostade en felsökningsrunda 2026-08-03).** `Source Serif 4`
  har två axlar (`opsz,wght`); varje värdepar MÅSTE ange båda. Kortformen `8..60,400;600;700` fick
  Google att svara **400 med en text/html-felsida på hela anropet** – noll webbtypsnitt för
  SAMTLIGA fyra familjer, plus `ERR_BLOCKED_BY_ORB` (webbläsaren vägrar använda HTML som CSS).
  `display=optional` är medvetet valt före `swap`: typsnitten byter aldrig mitt i en sida.
  `tests/theme.mjs` räknar axlar per par. **Ändra aldrig raden utan att kontrollera att den ger 200.**
- **Felsök alltid webbprestanda i en RIKTIG webbläsare, inte i jsdom.** Flikbyten handlar om
  layout och paint. Metoden som fungerade: starta Chrome headless med `--remote-debugging-port`,
  koppla på med CDP (Node har inbyggd `WebSocket`), servera två lokala kopior – en av den gamla
  commiten och en av nuvarande – och mät CLS, långa uppgifter och svarskoder på båda. Utan
  A/B-jämförelsen går det inte att skilja "alltid varit så" från "ny regression".
- **Offline:** `sw.js` (service worker) cachar appskalet. Strategin är nät-först med cachen som
  reserv, aldrig tvärtom: appen uppdateras genom filpush utan versionsstämplade filnamn, så
  cache-först skulle servera gammal `vparse.js` mot nya rapporter och ge tyst felparsning.
- **Teman (sedan 2026-08-02):** markupen finns BARA i `index.html`. Utseendet ligger i
  `assets/themes/`: `base.css` har all struktur uttryckt i CSS-variabler, temafilerna sätter bara
  variabler + sina avvikelser. `assets/theme.js` (`window.VTheme`) väljer tema och ljust/mörkt
  läge, pekar om `<link id="themeCss">` och sparar valet i localStorage (läget sparas PER tema).
  Fem teman × två lägen. **Nytt tema = en rad i `THEMES` i theme.js + en fil i `assets/themes/`**
  – rör aldrig markupen. `base.css` härleder mjuka/linje-varianter med `color-mix`, så ett tema
  sätter ~19 färger per läge, inte ~50. `tests/theme.mjs` larmar om ett tema saknar en token.
  **Checklistan när ett tema läggs till** (missas något syns det inte förrän det är fel): raden i
  `THEMES`, filen i `assets/themes/`, filen i `SHELL` i `sw.js` PLUS en bump av `CACHE` (annars
  saknas temat offline på enheter som redan installerat den gamla cachen), `THEMES`-listan och
  antalsvillkoren i `tests/theme.mjs`, och antalet i hjälptexten för Tema i `assets/settings.js`.
  **Ett femte tema (`sjokort`) fanns 2026-08-06 och togs bort samma dag** på Drens begäran.
  Borttagningen kräver samma checklista fast baklänges, plus TVÅ saker som inte är uppenbara:
  (1) `CACHE` i `sw.js` måste bumpas ÄVEN vid borttagning – annars ligger den raderade CSS-filen
  kvar i en redan installerad cache och serveras därifrån, så temat överlever sin egen radering
  på just de enheter som hann installera den gamla versionen; (2) en enhet med det borttagna
  temat sparat i `localStorage` faller tillbaka på `THEMES[0]` (deck) via raden
  `byId(read(KEY_THEME)) || THEMES[0]` i `theme.js` – ingen extra migrering behövs, men ändra
  aldrig den raden till något som kastar på okänt id. Hämta filen ur git-historiken före
  2026-08-06 om temat ska tillbaka.
- **Datakälla:** hämtar fillista via GitHub-API (`git/trees/main?recursive=1`) och råtext via
  `raw.githubusercontent.com`. Upptäcker rapporter automatiskt på filnamn → **inga ändringar
  behövs i webbappen när filer flyttas till undermappar.** Uppdateras när routinen pushar.
- **Flikbaserad** (en vy i taget): Översikt (statusrad, KPI, **Aktuellt innehav** = öppna positioner
  ur `portfolj.md` med live-P/L + positionsmätare, dagens beslut, marknadsklimat), Rapporter
  (Daglig/Vecko/Scout-väljare), Nyheter & radar, USA & Krypto (scout), Analys (aktieanalys på
  begäran + cache, med färskhetsbadge), Kurser (prices.json-tabell med sparklines), Avkastning
  (handelsstatistik + benchmark-overlay + Chart.js + historik + bubblare). Överst visas en
  **intradag-signalbanner** (`state/alerts.json`, KÖP/SÄLJ vid nivåkorsning) samt routinens "DATAKÄLLA
  BLOCKERAD"-notis som en gul varningsbanner (korrekt beteende – appen speglar routinens status).
- **Analytics:** Avkastning räknar fram träffsäkerhet, snittvinst/-förlust, profit factor,
  bästa/sämsta, snitt-hålltid och mål/stopp/rotation ur portföljhistoriken (`computeTradeStats`).
  Sparklines ritas ur `state/price_history.json`.
- **Rutan "Tillför urvalet något?"** i Avkastning renderas av `VRender.renderDecisionEval` ur
  `state/decision_eval.json` (hämtas direkt, bakas medvetet INTE in i `dashboard.json` – den ändras
  när ett beslut mognar). Den ligger ÖPPET, inte i en `details`, eftersom det är den fråga backtestet
  lämnade obesvarad. Renderaren är ren och testas utan DOM. **Låt den aldrig visa ett tal som
  `insufficient`-fältet inte ger** – hela poängen är att den säger "för tidigt" när den inte vet.
- **Avkastning har TRE lägen (sedan 2026-08-03): Nordiska · Amerikanska · Gemensamt.** Alla renderas
  alltid och ligger i DOM:en – bokväljaren (`data-book-set`) sätter bara `data-book` på
  `<section id="view-avkastning">` och base.css döljer resten. Valet sparas medvetet INTE: det är en
  jämförelseväxel, inte en inställning. Varje bok visar Handelsstatistik + Historik öppet; riskmått,
  alpha och månadsutfall ligger i en hopfälld `<details class="sblock">`. Diagram, beslutslogg och
  bubblare gäller båda och ligger i `.shared-block` under en linje.
- **Gemensamt-läget kräver PER AFFÄR-kostnad och -index.** `computeTradeStats(history, costPct)` och
  `computeAlpha/computeAlphaStats(history, priceHistory, benchSym)` tar numera **antingen ett värde
  eller en funktion `(rad) => värde`**. Funktionsformen används av `renderBothBooks()`: varje rad
  bär `Bok`, som avgör rundturskostnad (~0,25 % nordiskt, ~0,75 % i USD med växlingspåslag) och
  benchmark (`^OMX` resp. `^GSPC`). **Använd aldrig ett snitt** – det gör nettot fel åt båda håll
  och mäter alpha mot fel marknad. Vid funktionsform sätts `costPct: null` i resultatet.
  **Riskmått och månadsutfall finns AVSIKTLIGT inte i gemensamt-läget:** båda kedjar en
  equity-kurva, och två separat finansierade böcker i olika valutor har ingen gemensam kurva.
  Blandad avkastning hör hemma i Total-vyn.
- **Avkastning visar BÅDA böckerna, i var sitt block (sedan 2026-08-03).** `renderBookStats()`
  matar dem med samma rena funktioner; bara kostnadsmodell, benchmark och id-prefix skiljer
  (nordisk: `tradeStats` … mot `^OMX`; US: `usTradeStats` … mot `^GSPC`). **Slå aldrig ihop dem** –
  ett gemensamt alpha över en SEK-affär mot OMXS30 och en USD-affär mot S&P 500 är meningslöst;
  blandad total hör hemma i Total-vyn. Statistiken låg tidigare BARA i US-rotation-vyn, vilket
  gjorde att en amerikansk affär (JPM) inte syntes där en nordisk (Alleima) gjorde det. Den vyn
  visar nu bara boken just nu och länkar hit – duplicera inte tillbaka blocken dit.
- Rena funktioner (parsning/rendering/kurslogik) testas med `node tests/run.mjs` (ingen nätåtkomst krävs).
- **HÅRDKODA ALDRIG INSTRUMENTNAMN ELLER ANTAL I `tests/sim.mjs` (städat 2026-08-07).** Filen
  bootar hela appen mot repots VERKLIGA filer, så ett påstående som `includes("Saab")` eller
  `n + u === 2` är en ögonblicksbild av dataläget – inte av koden. När böckerna nollställdes
  2026-08-06 föll tjugo assertions utan att en rad appkod var fel, och `=== 2` (kommenterad
  "1 + 1 i dag") hade dessutom varit fel sedan den tredje affären stängdes. Påståendena härleds
  numera ur `dash.state`: sifferfallet prövas när det finns stängda affärer, tom-rutans text
  annars, och invarianten är att gemensamt-läget räknar SUMMAN av böckerna – inte ett visst tal.
  Verifiera alltid en ändring i BÅDA lägena: exportera en commit med fyllda böcker
  (`git archive <sha> | tar -x -C <mapp>`), bygg om dess `dashboard.json` och kör sim.mjs där
  också – annars är det lätt att göra ett påstående tomt sant.
- **`test.yml` INSTALLERAR jsdom (sedan 2026-08-07) – ta aldrig bort det steget.** Fram till dess
  körde CI `npm install` aldrig, och tre sviter hoppade tyst över sig själva UTAN att faila:
  `theme.mjs` DEL B (34 test), `tests/data.mjs` (36 test, avslutade direkt med exit 0) och
  `tests/sim.mjs` (157 test, anropades inte alls). 227 påståenden var dekoration – de gick att
  bryta utan att något blev rött. Installationen är AD HOC och versionspinnad
  (`npm install --no-save jsdom@29.1.1`) därför att repot medvetet saknar Node-paketidentitet:
  både `package.json` och `package-lock.json` ligger i `.gitignore`, så `npm ci` är omöjlig.
  Höjs versionen måste den höjas i BÅDA (workflow + lokal `package.json`), annars mäter CI och
  lokalt olika saker. `node-version` står kvar på `"20"` som i repots övriga workflows – det
  löser till senaste 20.x och uppfyller jsdoms golv `^20.19.0`, men pinna aldrig till en äldre
  20.x. **`sim.mjs` ligger i `test.yml`, INTE i auto-merge-grinden** – grinden ska vara snabb,
  och `data.mjs` är utanför den av samma skäl (~110 nätanrop).

---

## 4. Routinen — vad prompten gör
- **`prompts/dagligprompt.md`** – ENDA ingången, körs varje handelsdag (mån–fre). Måndag = LÄGE A
  (full rotation, skriver `reports/weekly/…`), övriga dagar = LÄGE B (bevakning, skriver
  `reports/daily/…`). Läser `config/fokus.md`, `state/portfolj.md`, rätt mall i `templates/`, och
  **kurser i första hand ur `state/prices.json`**. Uppdaterar `state/portfolj.md` (historik är
  append-only). Committar till main.
  **Sedan 2026-08-06 får LÄGE B (i BÅDA rotationsprompterna) lägga EN villkorad bubblar-plan** –
  men bara för en bubblare där senaste veckorapporten angav saknad verifierad kurs som skälet
  att den inte fick en pending-rad, och bara om sex villkor håller (kurs finns nu · katalysator
  inom 5 handelsdagar · full poängsättning mot de fem grindarna · regimfilter på · ledig plats ·
  taket på två planer).
  **Anledningen:** veckorotationen 2026-08-03 kunde inte prissätta tre bubblare, kurserna kom
  4–5/8, och punkt 4b låg bara i LÄGE A – fyra handelsdagar där en färdigbedömd idé låg död av
  ett datafel. En bubblare som rankades under av OMDÖMESSKÄL omfattas aldrig; den bedömningen
  görs om vid rotationen. `watchdog.mjs:checkStalePricedBubblare` larmar när en bubblare fått
  kurs men ingen körning tagit ställning.
- **En separat måndagsprompt (`veckoprompt.md`) fanns tidigare men är raderad** – den körde
  rotationen en andra gång och skapade dubbletter. Schemalägg endast `dagligprompt.md`.
- **`prompts/scoutprompt.md`** (USA & krypto) – FRISTÅENDE daglig scout. Läser `config/fokus_scout.md`
  + `templates/scout_case.md`, kurser ur `state/prices.json` (US-symbol / `^INDEX` / `<MYNT>-USD`),
  skriver `reports/scout/rapport-yymmdd.md`, committar till main. Täcker INTE Norden. Egen kategori
  i dashboarden ("USA & Krypto").
- Hårt krav: varje kurs ska ha **verifierad källa + tidsstämpel**; annars "KURS EJ VERIFIERAD" och
  inget kursbaserat beslut. Detta krav ska INTE sänkas.

---

## 4b. Analys på begäran (flöde, ingen API-nyckel)
1. I dashboardens **Analys**-flik skriver du en ticker → finns den cachad visas den direkt.
2. Annars öppnas ett förifyllt GitHub-issue **"analys: TICKER"**. Skicka in det (ett klick).
3. `analys_queue.yml` (nyckellös Action, endast `GITHUB_TOKEN`, ägar-skyddad) lägger tickern i
   `state/analysis_queue.json` (pending), kvitterar och stänger issuet.
4. Kör den MANUELLA arbetaren i Cowork ("analysera kön") → `prompts/analysprompt.md` bearbetar
   pending, skriver `reports/analysis/analys-TICKER-yymmdd.md`, flyttar posten till done, committar.
5. Dashboarden pollar och visar analysen; sedan är den cachad. Filnamn: `analys-<TICKER>-yymmdd.md`.
   Ingen Anthropic API-nyckel behövs – arbetaren är en vanlig Claude/Cowork-körning.

**Analysens FORM ligger i `prompts/aktieanalys_prompt.md` (sedan 2026-08-03), inte i `templates/`.**
`analysprompt.md` styr ARBETSGÅNGEN (kön, kursverifiering, filnamn, commit); analysprompten styr
INNEHÅLLET. Den filen har tre delar: huvudprompt (används normalt), kort version (för snabbanalys)
och en tabell med **tillägg per situation** – olönsamt bolag/bioteknik (kassa, burn rate, runway,
utspädningsrisk), IPO (free float efter cornerstone, lock-up, cash-out), utdelningsbolag (täcks
utdelningen av FCF), förvärv, vändningscase. Använd rätt tillägg; ett bioteknikbolag utan
runway-avsnitt är en ofullständig analys. Kravet på verifierad kurs + tidsstämpel gäller
oförändrat och står i BÅDA filerna – sänk det aldrig.

---

## 5. Historik
Den daterade ändringsloggen – vad som byggts, i vilken ordning och VARFÖR – ligger i
`docs/HISTORIK.md`. Läs den när du behöver motiveringen bakom ett designval, en tidigare
bugg eller en backtest-siffra. Den laddas medvetet INTE automatiskt: den är ~37 000 tecken
och behövs sällan, medan den här filen läses vid varje sessionsstart.

Nuläge i korthet: alla nio delar är i drift och live i repot (nordisk rotation, dashboard,
pris-hämtare, scout USA/krypto, analys på begäran, intradag-monitor, US-rotation,
kapitalallokering, miss-retro). Vad som ÅTERSTÅR står i avsnitt 5b.

## 5b. Nuläge — KVAR / VALFRITT
- ✅ **Pushat & live (2026-07-12):** hela flik-omdesignen + alla fixar/features från 2026-07-11
  ligger nu på GitHub main (verifierat mot raw) – Pages kör nya dashboarden.
- **VÄNTAR PÅ FÖRSTA PRICES-KÖRNINGEN:** `prices.yml`-cronen kör bara vardagar → fixarna
  (US/krypto-symboler ur watchlist_us, `price_history.json` committas, stängningskurs-crons)
  exekverar första gången måndag 2026-07-13 ~05:00 UTC. Scout-rapporten 260712 flaggade korrekt
  "US-symboler saknas i prices.json / Yahoo 403" – det ska självläka i och med måndagskörningen.
  Otåliga: Actions → "Hämta kurser" → Run workflow. Scoutens tips: lägg ev. `XOM`/`CVX` i
  `config/watchlist_us.txt` (Hormuz-/oljecaset).
- ✅ **GitHub-inställningar:** verifierat klart – både `analys_queue.yml` (issue #2 → kö → analys)
  och `prices.yml` har committat till main, dvs. write-permissions + Issues fungerar.
- ✅ **SCHEMAT (gäller 2026-07-31, speglat i `nextRoutineRun`):** fem routines schemaläggs, en körs
  manuellt, en ska aldrig köras. Tider i CEST.
  | Routine | När | Prompt |
  |---|---|---|
  | Scout USA & krypto | dagligen **07:47** | `prompts/scoutprompt.md` |
  | Nordisk rotation | mån–fre **08:40** | `prompts/dagligprompt.md` |
  | US-rotation | mån–fre **15:00** | `prompts/us_dagligprompt.md` |
  | Kapitalallokering | måndag **15:30** | `prompts/allokering.md` |
  | Miss-retro | lördag **10:00** | `prompts/miss_retro.md` |

  Ordningen styrs av vilka Actions som måste ha skrivit sin fil först: kurser 05:00 + 06:00 UTC
  (och var 30:e min 07–20 UTC), nyheter från 05:17 UTC varannan timme. Därför ligger nordiska
  rotationen 08:40 (efter kurser, före Stockholm 09:00) och US-rotationen 15:00 (före 15:30 CEST).
  **Allokeringen måste ligga efter BÅDA veckorotationerna** – därav måndag 15:30.
  **Miss-retron ligger på lördag, inte fredag kväll:** fredagens US-stängningskurser skrivs
  21:10 UTC (23:10 CEST), så en lördagskörning har komplett facit för båda böckerna.
  `prompts/analysprompt.md` körs MANUELLT när kön har poster. En separat måndagsprompt får ALDRIG
  läggas till igen (den skapade dubbletter och är raderad).
- ✅ **PROMPTERNA KLISTRAS INTE IN LÄNGRE (2026-08-02):** `prompts/START.md` innehåller femradiga
  LADDARE att lägga i routinens prompt-fält i stället för hela prompttexten. Laddaren kör
  `git pull` och läser rätt fil ur `prompts/`, så en promptändring i repot slår igenom vid nästa
  körning utan att routinen rörs. Tidigare frös varje routine vid inklistringens version, vilket
  betydde att roboten kunde köra gammal logik utan att någon märkte det. Variant B i samma fil
  hämtar prompten via `raw.githubusercontent.com` för miljöer utan lokal arbetskopia – men den
  kan inte skriva tillbaka till repot, så A är förstahandsvalet.
- ✅ **Schemaläggning (historik):** Cowork scheduled tasks skapade 2026-07-11:
  `vecko-agent-scout-usa-krypto` (dagligen 07:47) och `vecko-agent-nordisk-rotation` (mån–fre
  08:40, efter prices-cronen, före börsöppning). Scoutens första körning 2026-07-12 producerade
  `reports/scout/rapport-260712.md`; helgkörningen 260711 hanterade stängda börser korrekt.
  Rotation-tasken har ännu inte kört (första gången mån 2026-07-13 ~08:40) – tryck gärna "Run now"
  en gång för att förgodkänna dess verktyg så måndagsrundan inte pausar på behörighetsfrågor.
  OBS: taskarna körs bara när Claude-appen är igång (annars vid nästa appstart), och sandlådan
  kan inte pusha – rapporterna skrivs lokalt och Dren publicerar med `push.bat`.
- **Commit/push sker från Drens dator** – Cowork-sandlådan kan inte pusha (saknar credentials) och
  OneDrive-monteringen blockerar git-lås. Claude skriver filer lokalt, Dren committar/pushar
  (enklast via `push.bat` i repo-roten).
- ✅ **Klonat utanför OneDrive (2026-07-16):** aktiv arbetskopia var `C:\Users\kastrdri\Git_proj\gitVecko_agent`.
- ✅ **Ny dator (2026-07-31):** repot klonat till `C:\Users\drini\code\vecko_agent` (gemener i
  mappnamnet på disk). Node v24 på plats. Auto-push-tasken är registrerad men AVSTÄNGD sedan
  2026-08-02 (se punkt 2 nedan) – pusha manuellt med `push.bat`. Schemaläggningen
  sköts via Drens routines (2026-07-31) – de gamla Cowork scheduled tasks behöver INTE återskapas.
- ✅ **BYGGT 2026-08-04 – "scouten flaggar men inget händer" är åtgärdat.** Kedjan var bruten
  på tre ställen samtidigt, alla TYSTA: (1) watchlistan fylldes i efterhand ⇒ ingen kurs på
  eventdagen ⇒ grind 1 föll; (2) scoutens fynd fanns bara i prosa ⇒ ingen bok såg dem;
  (3) LÄGE B saknade köpväg för en färsk bekräftad katalysator ⇒ fem handelsdagars latens
  till måndagens rotation. Nu: `earnings-calendar.mjs` prisbevakar rapportbolag 10
  handelsdagar i FÖRVÄG · `state/scout_candidates.json` + validator är kanalen · köpväg **(d)**
  finns i BÅDA rotationsprompterna (punkt 2d) med sex spärrar i ordning (obekräftad → kurs
  saknas → regim av → binär händelse ≤ 2 dagar → full bok → de fem grindarna), högst EN
  promotion per körning · varje avgörande loggas i `decisions.json`. Tre watchdog-kontroller
  (`checkGrossList`, `checkScoutCandidates`, `checkEarningsCalendar`) gör de återstående
  tysta felen hörbara. 30 nya tester i `tests/run.mjs` (493 totalt).
  **Kvar att se i skarp drift:** första scout-körningen som skriver kandidater (07:47) och
  första rotationen som avgör dem – kontrollera att `state/scout_candidates.json` växer och
  att inga poster står kvar som `new` efter `expiresAt`.
- ✅ **AVKLARAT 2026-08-07 (var punkt 0, 1 och 3 i listan nedan) – verifierat, inte antaget.**
  (0) **Push-notiser i skarp drift från runnern.** `VAPID_PRIVATE_KEY` ÄR satt i GitHub:
  monitor-körningen 13:11 UTC loggade `VAPID_PRIVATE_KEY: ***` och `Skickade 1 notis(er) till
  1 enhet(er)`. Fyra notiser i verklig KÖP/SÄLJ-form skickades dessutom med `--preview`, och en
  leveranskontroll gav **HTTP 201** från FCM med levande prenumeration (ej 404/410). Dren
  bekräftade mottagning på telefonen. Kryptot är dessutom bevisat mot RFC 8291 §5:s testvektor i
  `tests/run.mjs`. (1) **`movers.json` är i fas** – manuell körning 13:04 UTC gav `asOf:
  2026-08-07`, samma dag. Orsaken till den tidigare eftersläpningen förblir outredd; larmar
  watchdogen igen är det den tråden som ska dras. (3) **Auto-merge-grinden är sedd skarpt** –
  körning 31155334760 (06:49 UTC) körde `validate-decisions`, `validate-scout-candidates`,
  `run.mjs` (654 gröna) och `theme.mjs`, och byggde om `dashboard.json` 17 sekunder efter att
  rapporten landade. **Var noga med vad som ÄR bevisat:** grinden har observerats stoppa arbete
  två gånger, båda av andra skäl än underkänd CI – körning 31105771472 (2026-08-06) föll på
  MERGEKONFLIKT innan testerna ens kördes, och 31189191076 (2026-08-07) på att pushen till main
  förlorade kapplöpningen mot en samtidig `prices.yml`-push (`! [rejected] main -> main`).
  Att grinden stoppar en branch med FALLERANDE TESTER är alltså ännu inte sett i skarp drift –
  ingen branch har haft det. Påstå inte motsatsen.
- **`auto_merge.yml` SAKNAR RETRY PÅ PUSHEN – till skillnad från `monitor.yml`.** Den kör ett
  naket `git push origin main`, medan monitorn har en `for i in 1 2 3`-slinga med
  `pull --rebase` mellan försöken. Felfrekvensen är ~5 % (2 av 40 körningar), och den är som
  HÖGST på måndagar: scout 07:47, nordisk rotation 08:40, US-rotation 15:00 och allokering 15:30
  konkurrerar då med kurser var 30:e minut och nyheter varannan timme. Förlorar grinden
  kapplöpningen når rapporten ALDRIG main av sig själv – branchen ligger kvar och någon måste
  märka det och köra `workflow_dispatch` (den mergar alla befintliga `claude/**`-brancher).
  Watchdogen fångar det först indirekt, via "dagens rapport saknas".
- **KVAR (uppdaterad 2026-08-07) – i prioritetsordning:**
  1. **`docs/manual/`-skärmbilderna åldras** (`hem.png`, `avkastning.png`, båda 2026-08-02).
     **Vänta till EFTER v33-rotationen 2026-08-10.** Böckerna nollställdes 2026-08-06, så en
     skärmbild tagen dessförinnan visar "Roboten äger inget just nu" – sämre som illustration än
     de gamla bilderna med en fylld bok. Kommandot står i `make-manual.bat`; kör skriptet efteråt
     så PDF:erna följer med.
  2. **Ingenting STÄNGER GitHub-issues.** `monitor.yml` och `watchdog.yml` öppnar dem, men ingen
     workflow stänger dem när tillståndet är löst – därför samlas signal- och watchdog-issues på
     hög och säger inget om nuläget. Städa för hand, eller bygg stängningen (kontrollera i så
     fall mot `alerts.json`/watchdogens egen utdata, inte mot titeln).
- ✅ **Verifierat i skarp körning 2026-08-03 (samma kväll):** `news.yml` 15:56 UTC skrev `window`-fältet
  och fönstret bar **6 av 10 handelsdagar direkt** (äldsta post 2026-07-27) – flödena serverar själva
  äldre poster, så det behövde inte fyllas på dag för dag. Taket per källa och dygn band vid exakt 30
  för fyra flöden, som avsett. `prices.yml` 15:42 UTC körde `decision_eval.mjs` på runnern och
  committade filen (13 beslut, 13 mätbara, 0 utan kurshistorik).
- ✅ **Avklarat 2026-08-03 (var punkt 1–2 i 08-02-listan):** `push.bat` körd; (a) dagsrörelserna
  stämmer och filen bär `schemaVersion 2026-08-02-prevclose`; (b) `alerts.json` har `checkedAt`;
  (c) `decisions.json` har 15 rader varav 0 med `source: backfill`; (d) båda böckerna har migrerat
  kassa till sleeven (nordisk 65 % XACT, US-boken öppnade AMZN + SPY 2026-08-03).
  4. (Skärmbilderna – se punkt 1 i KVAR-listan ovan. Dubbletten borttagen 2026-08-07.)
  5. ✅ **Avklarat 2026-08-02:** filstädningen. `Anvandarguide.html`, `Anvandarmanual.html/.pdf`,
     `prompts/veckoprompt.md`, `templates/case_rapport.md`, `auto_push.bat` och
     `setup_autopush.bat` är raderade efter beslut av Dren. Se punkt 6 nedan om auto-pushen.
  6. **AUTO-PUSH ÄR HELT BORTTAGEN (2026-08-02).** Skripten `auto_push.bat`/`setup_autopush.bat`
     är raderade och den schemalagda Windows-uppgiften `VeckoAgent AutoPush` är avregistrerad –
     det finns inget kvar att slå på. **Pusha manuellt med `push.bat` efter varje session.**
     Vill du ha auto-push igen måste skriptet skrivas om (hämta det ur git-historiken före
     2026-08-02) och uppgiften registreras på nytt.
     Notera för framtida felsökning: commitar som heter *"Uppdatering via Cowork …"* kommer från
     **`push.bat`**. Äldre commitar med *"Auto-push …"* kom från den nu borttagna auto-pushen,
     som avbröt på helger och utanför 07–19 – den kunde alltså se ut att ha kört utan att ha
     gjort något.
     **Fälla som kvarstår oavsett:** kör aldrig `fetch-prices.mjs`/`fetch-news.mjs` lokalt
     samtidigt som actionen skriver samma filer – en `pull --rebase` fastnar då i konflikt.
     `state/dashboard.json` och `search-index.json` är skyddade via `.gitattributes` (`-merge`),
     de övriga JSON-filerna är det inte. Kontrollera `git status` innan du felsöker appen.
  3. Kontrollera `feeds`-fältet i `state/news_feed.json`: ett flöde som är verkligt dött visar
     nu "HTTP xxx – båda försöken" (ett enstaka fel görs om automatiskt sedan 2026-08-02).
  4. Kör om backtestet när universum eller nivåer ändras:
     `node .github/scripts/backtest.mjs nordic 5y 4` (resp. `us 5y 4`). Kräver nät. Sista
     argumentet är antalet positioner – utan det simuleras 4 à 25 %, som böckerna faktiskt
     handlas. Gridet på 2 positioner (filerna `backtest-260731-*`) är historik.
     **Motorn byggdes om 2026-08-02** (daglig equity-kurva med indexsleeven modellerad,
     lookback-svep 10/20/60/120 + skip, regimfilter, hålltidssvep, out-of-sample). Kolumnen
     `Equity %` är portföljkurvan och ska jämföras med benchmark; `Kedjat %` är det gamla
     affärskedjemåttet och finns bara kvar för jämförelse bakåt. **Ändra ALDRIG en nivå i en
     prompt utan att först läsa rapportens out-of-sample-avsnitt** – nordiska stoppbandet visade
     sig vara brus (samma nivå bäst i båda halvorna i 1 fall av 8), medan US-bandet höll (5 av 8).
     Detaljerna i `docs/HISTORIK.md`.
     **BREDDA ALDRIG UNIVERSUMET UTAN ATT KÖRA OM DETTA (mätt 2026-08-03).** Frågan "begränsar
     30 namn oss?" mättes med tre universum över samma period: `nordic` (30 large), `nordic-mid`
     (110 = movers-listan), `nordic-broad` (153, + 43 småbolag). Skelettet KOLLAPSAR monotont med
     bredden – medianen av alla 24 celler out-of-sample gick **−1,4 % → −16,3 % → −50,9 %**, och
     bästa cellen +42,3 % → −1,0 % → −41,2 %. Det är inte urvalsbrus: hela gridet försämras, inte
     bara toppcellen. Orsaken är att "topp 4 på efterföljande avkastning" blir en SÄMRE regel ju
     fler namn den får – toppen av en större fördelning är mer extrem och vänder tillbaka hårdare.
     En dekomponering (`VECKO_FLAT_COST=1`, kör om med fast 0,25 %) delar tappet i **~38 pp urval
     och ~22 pp kostnad**: billigare courtage räddar det INTE. Slutsats: håll `nordic` som
     backtestuniversum, och varje förslag att bredda måste komma med en urvalsregel som blir
     STRÄNGARE när bredden ökar. Notera dock vad testet mäter: momentum-proxyn, inte det
     katalysatordrivna urvalet (som avvisar RSI > 75 och alltså per konstruktion sorterar bort just
     de namn som fäller siffrorna). Bredd är därmed inte motbevisad för routinen – men bevisbördan
     ligger hos den som vill bredda.
     **Kostnad per symbol (sedan 2026-08-03):** `config/kostnader.json` → `nordic.liquidityTiers`
     (0,25 % ≥ 20 MSEK/dag · 0,75 % ≥ 3 · 1,5 % därunder). `backtest.mjs` väljer nivå ur symbolens
     UPPMÄTTA medianomsättning; saknas volymdata används dyraste nivån (det gjorde ICA/DOMETIC/BIOT
     felaktigt dyra i broad-körningen – 3 av 153, försumbart men värt att veta). `costPct` får vara
     ett tal ELLER en funktion `(sym) => procent`. Dashboarden är oförändrad och läser fortfarande
     `roundTripPct`. `VECKO_FLAT_COST=1` finns BARA för dekomponering och skriver till ett eget
     filnamn (`…-flatcost.md`) – aldrig som beslutsunderlag för ett universum med småbolag.
     **KOMBINATIONERNA ÄR KÖRDA – INGEN PARAMETER FICK ÄNDRAS (2026-08-03).** Rapportens nya
     avsnitt 6 kör de tre starkaste enskilda fynden TILLSAMMANS (hållregeln + lookback 120d/skip 20
     + regimfilter), var och en mätt på båda halvorna mot samma halvas benchmark. Kravet sattes i
     FÖRVÄG: slå benchmark i BÅDA halvorna. **Ingen kombination gjorde det, i någon av marknaderna.**
     Ändra därför inte lookback, hålltid eller nivåband på det underlaget – och kör om avsnitt 6
     innan någon gör det ändå. Mönstret som DÄREMOT är stabilt är ett riskmönster, inte ett
     avkastningsmönster: regimfiltret halverar ungefär max drawdown (nordiskt −41,4 % → −21,6 %,
     US −29,3 % → −23,6 %) och sänker exponeringen till ~58–65 %. Det uppför sig som en försäkring
     – nordiska MA200-varianten slår benchmark i den svaga halvan (+4,4 % mot −0,4 %) och förlorar
     i den starka (−5,5 % mot +38,2 %).
     **BESLUTET ÄR TAGET (2026-08-03, delegerat av Dren): regimfiltret är PÅ, HÅRT, MA200 i BÅDA
     böckerna.** Grunden är inte jämförelsen mot benchmark utan mot DAGENS uppsättning: "bara regim
     MA200" slår basfallet i FYRA AV FYRA halvor/marknader (nordiskt +4,4 % mot −27,2 % och −5,5 %
     mot −7,4 %; US +18,2 % mot +7,5 % och +34,6 % mot +21,0 %) och sänker max drawdown i båda
     (−41,4 → −27,0 % resp. −29,3 → −23,6 %). Inget annat i materialet replikerar så.
     Två skärpningar mot tidigare formulering: (1) regeln är en **spärr** – inga nya positioner när
     regimen är av – inte "höj ribban 2 poäng", eftersom det MÄTTA är en hård spärr och den mjuka
     varianten aldrig mätts; (2) nordiska boken gick MA100 → **MA200** trots att MA100 ger 5 pp mer
     nordiskt, därför att MA200 vinner med 24 pp i US-boken och olika fönster per marknad är precis
     den trimning som out-of-sample-avsnittet visat är brus. Saknas 200 punkter i serien behandlas
     regimen som AV (strängare riktning vid osäkerhet). **Regeln gör INTE att skelettet slår index**
     – den gör det mindre dåligt med halverad drawdown. Ändra inte tillbaka utan att köra om
     avsnitt 4 och 6 i backtestet.
  5. **Statistiken är fortfarande brus:** 2 stängda affärer. Retrons beslutsstatistik kräver
     ≥ 15 SÄLJ-rader i `decisions.json` innan poängvikterna (35/30/15/20) kan kalibreras mot data.
     Beslutslogg-rutan i Avkastning visar hur långt det är kvar.
- **Valfria förbättringar (ej byggda):** daglig digest-notis. (Jämför två tickers, fulltextsökning
  och alert-historik byggdes 2026-07-17; miss-retron + Retro-fliken, per-affär-equity-kurvan,
  månadsheatmapen och sälj-triggad avkastningsuppdatering byggdes 2026-07-31.)

---

## 6. Kurs-blockeringen och fixen (AKTIV)
Routinens egen körmiljö är nätspärrad (403 mot Yahoo/Avanza/Nasdaq m.fl.) → utan hjälp får den bara
odaterade kurser och avstår (korrekt) från beslut. **Fixen är byggd OCH aktiv:** GitHub Action
`prices.yml` + `fetch-prices.mjs` kör på GitHubs runner (fri nätåtkomst), hämtar Yahoos chart-API
(med **stooq-fallback**) och skriver en tidsstämplad `state/prices.json` (+ rullande
`price_history.json`). Routinen/scouten/analysen läser den filen → verifierad tidsstämpel finns.
`fetch-prices.mjs` samlar tickers ur `state/portfolj.md`, senaste vecko-/scout-rapportens case,
samt `config/watchlist.txt` (nordiskt) och `config/watchlist_us.txt` (USA/krypto: symbol,
`^INDEX`, `<MYNT>-USD`). Sänk ALDRIG verifieringskravet – lösningen är pålitliga priser, inte att
ta bort skyddet.

---

## 7. Fällor att känna till
- **OneDrive + git:** OneDrive-monteringen ger `.git/index.lock`-EPERM, CRLF-brus och trunkerade
  läsningar i Cowork-sandlådan. `.gitattributes` (LF) dämpar CRLF; den riktiga fixen är att klona
  repot UTANFÖR OneDrive. Sandlådan kan inte pusha – Dren committar/pushar från sin dator.
- **Dubbel rotation på måndag (ÅTGÄRDAT):** `dagligprompt.md` är enda ingången (den gör LÄGE A på
  måndagar). Skapa eller schemalägg ALDRIG en separat måndagsprompt igen (`veckoprompt.md`) –
  det skapade tidigare dubbletter (`veckorapport-yymmdd_1.md`).
- **TVÅ GITHUB-KONTON (fälla, kostade hela push-aktiveringen 2026-08-03).** Repot ägs av
  **DrinasKastrati**, men telefonen är inloggad som **Drinas-k** (samma person). Varje
  issue-driven Action som grindar på `github.event.issue.user.login == github.repository_owner`
  hoppar därför tyst över allt som skickas in FRÅN TELEFONEN: körningen blir `completed/skipped`,
  vilket ser GRÖNT ut i Actions-listan och inte lämnar ett enda felmeddelande. Symptomet var att
  `state/push_subs.json` aldrig dök upp. **Både `push_subscribe.yml` och `analys_queue.yml`
  grindar sedan dess på en LISTA** (`contains(fromJSON('["DrinasKastrati","Drinas-k"]'), …)`) –
  analys_queue åtgärdades 2026-08-04. Lägg till nya konton i listan; ta aldrig bort kontrollen.
- **KÖP ALDRIG INFÖR EN RAPPORT – mätt och underkänt 2026-08-04.**
  `.github/scripts/backtest-earnings.mjs` mäter fyra armar per rapporthändelse över fyra
  körningar (us/nordic × 5y/10y), rapporter i `reports/backtest/earnings-260804-*.md`.
  **PRE_ALL och PRE_MOM (köp dagen före reaktionen, utan resp. med momentumfilter) blev
  UNDERKÄNDA i SAMTLIGA FYRA** – negativ alpha i nordiska boken i båda halvorna, och 4–6 %
  av affärerna sämre än −10 %. Att aktien trendar upp in i rapporten hjälper inte; det är
  precis vad PRE_MOM mäter. Post-earnings drift (PEAD) mätte bättre men klarade inte kravet
  i båda marknaderna vid samma period (godkänd us-5y + nordic-10y, underkänd us-10y +
  nordic-5y) och är därför **ingen egen köpregel** – en bekräftad rapportöverraskning är en
  vanlig kandidat som ska passera samma fem grindar som allt annat.
  **Två mätfällor som filen dokumenterar och som gäller allt eventtestande här:**
  (1) *Look-ahead via händelseurvalet* – betingas mängden på gapets STORLEK får PRE-armen
  credit för att veta hur stor rörelsen blev innan den köper; höjd tröskel 4 % → 6 % lyfte
  PRE_ALL från +0,1 % till +1,3 % utan att strategin ändrats. Därför två mängder: `SET_GAP`
  (gapvillkor, BARA för PEAD som köper efter observationen) och `SET_VOL` (riktningsblind,
  BARA för PRE). (2) *Materialitetskravet* – ett rent `> 0`-krav släppte igenom +0,04 % på
  avrundning; godkännande kräver ≥ 0,5 % medel i BÅDA halvorna plus positiv alpha.
  Historiska rapportdatum finns inte i Yahoo (`events=earnings` ger null, `earningsHistory`
  räcker fyra kvartal) → rapportdagar detekteras ur pris + volym, vilket är en PROXY.
  Ändra ingen av dessa regler utan att köra om båda marknaderna på 10y.
- **`index.html` måste ligga i repo-roten** för att Pages ska servera den på sajtens rot.
- **EN RÖD "pages build and deployment" ÄR NÄSTAN ALDRIG REPOTS FEL (2026-08-06).** Deployen
  gick från ~10 s till 10 minuter och började faila. Loggen säger vad som händer:
  `Current status: deployment_in_progress` upprepas i tio minuter, sedan
  `##[error]Timeout reached, aborting!` + `Canceling Pages deployment...`. Artefakten laddas
  upp, GitHub tar emot deploymenten och den blir aldrig klar; actionen pollar en statusendpoint
  tills den ger upp och avbryter SIG SJÄLV. GitHub returnerar aldrig ett fel.
  **Innan någon rullar tillbaka något: mät.** `build`-steget och `deploy`-steget är olika saker
  – build är det som läser repot, och det stod stilla på 5–10 s genom hela haveriet. Jämför
  filantal och trädstorlek mellan sista snabba och första långsamma körningen
  (`git ls-tree -r -l <sha>`): här var det 206 → 206 filer och +0,5 % bytes mot 40× längre
  deploy, alltså friat. Jämför också artefaktstorleken mellan en lyckad och en misslyckad
  körning – 1,77 MB deployade både på 8 s och till timeout.
  **Fällan som gjorde felsökningen förvirrande: en "failed" deploy kan ändå publicera.**
  Körning 457 loggade `Canceled deployment` men innehållet nådde CDN:en ändå och serverades i
  flera minuter. Körningslistan och sajten sa emot varandra, och båda hade rätt. **Lita därför
  inte på Actions-statusen för att avgöra vad som ligger live – mät sajten**, och gör det med
  cache-busting, annars svarar CDN:en med gammalt innehåll:
  `curl -s "https://drinaskastrati.github.io/Vecko_agent/state/dashboard.json?cb=$RANDOM"`.
  Bra markörer för VILKEN commit som ligger ute: `CACHE`-namnet i `sw.js`, förekomsten av
  `state/live_start.json`, och antalet innehav i `dashboard.json`.
  **Loggen kräver inloggning.** Anonymt API ger `403: Must have admin rights to Repository`,
  och taket är 60 anrop/timme (autentiserat: 5 000). `gh` är installerat sedan 2026-08-06;
  logga in som **DrinasKastrati**, inte Drinas-k – samma tvåkontofälla som ovan. Hämta med
  `gh run view <run-id> --log-failed`. **PowerShell förstör `--jq`-uttryck** (backslashen äts)
  och lägger BOM på piping till Node – skriv `gh`-utdata till fil och parsa den därifrån.
  **Behöver ett experiment ändå köras: gör det reversibelt.** Sätt trädet till ett tidigare
  läge med `git read-tree -u --reset <sha>` och committa – historiken skrivs inte om, och allt
  kommer tillbaka med `git revert`. En force-push hade kostat 40 commits för ett fel som gick
  över av sig självt inom en timme.
- **Sänk inte verifieringskravet** för kurser – lösningen är pålitliga priser (prices.json), inte
  att ta bort skyddet.
- **Radera aldrig** `state/portfolj.md` (historik/ackumulerad avkastning) eller de mallar en prompt
  faktiskt läser (parsningskontraktet – kontrollera med `grep -r templates/ prompts/`) vid en
  omstrukturering.
- **Lärdomar får ALDRIG mjuka upp kursverifiering, stopp-disciplin eller riskregler.** Miss-retron
  får skriva processregler, inte sänka skyddsnät.
- **`prices.json` måste ha fältet `schemaVersion`** innan en dagsrörelse räknas ur filen. Saknas det
  pekar `previousClose` i äldre filer ~en vecka bakåt, och en veckorörelse läses som en dagsrörelse.
- **Bumpa `schemaVersion` bara när ett fälts BETYDELSE ändras** – inte vid vanliga ändringar.
- **Kör aldrig `fetch-prices.mjs`/`fetch-news.mjs` lokalt** samtidigt som GitHub-actionen skriver samma
  filer: nästa `pull --rebase` (t.ex. via `push.bat`) fastnar då i konflikt och lämnar
  konfliktmarkörer i JSON:en, vilket tömmer Kurser-vyn i dashboarden. Gäller även efter att
  auto-pushen togs bort 2026-08-02 – det är rebasen som är problemet, inte vem som startar den.
  `state/dashboard.json` och `search-index.json` är skyddade via `.gitattributes` (`-merge`);
  övriga JSON-filer är det inte. Kontrollera `git status` innan du felsöker appen.
- **`push.bat` löser konflikter i `state/dashboard.json` + `search-index.json` SJÄLV** (sedan
  2026-08-02) genom att köra `build-dashboard.mjs` och fortsätta rebasen. Krockar någon ANNAN fil
  kör den `git rebase --abort` och lämnar över – den gissar aldrig. Två fällor att känna till:
  (a) råkar en konflikt i en av de två filerna sammanfalla med en konflikt i en tredje fil avbryts
  ALLTIHOP, vilket är avsiktligt; (b) före 2026-08-02 stannade skriptet tyst mitt i rebasen med
  detached HEAD och skrev ändå `pause` – ser du en gammal körning som "såg klar ut" men inget kom
  fram till GitHub, är det den buggen. Kontrollera `git status -sb`.
  **(c) ÅTGÄRDAT 2026-08-03: exit 255 med `- was unexpected at this time.` EFTER en LYCKAD push.**
  Orsaken var en OESCAPAD parentes i ett `echo` inne i `if errorlevel 1 (`-blocket:
  `echo ar en laskonflikt (.git/index.lock) - vanta …`. cmd parsar hela blocket när det LÄSES, så
  `)` i sökvägen stängde blocket i förtid och resten av raden kördes som ett eget kommando –
  villkorslöst, alltså även när pushen gått bra. **Parenteser i `echo` inuti ett block måste escapas
  med `^`** (`^(` / `^)`), precis som `make-manual.bat` redan gjorde. Symptomet var lömskt: exit 255
  på en körning som gjort allt rätt, vilket får automatisering som läser exitkoden att tro att
  pushen misslyckades. Verifiera alltid med `git status -sb` innan du pushar om.

---

## 8. Var filerna ligger
Allt ligger nu i repot (branch `main`) enligt strukturen i avsnitt 2 – inga lösa filer utanför.
Drens AKTIVA lokala arbetskopia: `C:\Users\drini\code\Vecko_agent` (ny dator sedan 2026-07-31).
Äldre kopior (`C:\Users\kastrdri\Git_proj\gitVecko_agent` och OneDrive-mappen) är utfasade – gör
inga ändringar där.

---

## 9. Disclaimer
Allt systemet producerar är **automatiserat beslutsstöd, inte finansiell rådgivning.** Varje
rapport ska avslutas med den raden.
