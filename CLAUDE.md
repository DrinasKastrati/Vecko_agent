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
   (dashboard-banner + GitHub-issue/e-post). Ren aritmetik → **noll tokens**; ersätter INTE
   routinens omdöme utan larmar bara att en nivå korsats.

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
- Actions `monitor`/`news`/`movers`/`analys_queue` är nyckellösa och LLM-fria – de kostar noll tokens.
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
  Fyra teman × två lägen. **Nytt tema = en rad i `THEMES` i theme.js + en fil i `assets/themes/`**
  – rör aldrig markupen. `base.css` härleder mjuka/linje-varianter med `color-mix`, så ett tema
  sätter ~19 färger per läge, inte ~50. `tests/theme.mjs` larmar om ett tema saknar en token.
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

---

## 4. Routinen — vad prompten gör
- **`prompts/dagligprompt.md`** – ENDA ingången, körs varje handelsdag (mån–fre). Måndag = LÄGE A
  (full rotation, skriver `reports/weekly/…`), övriga dagar = LÄGE B (bevakning, skriver
  `reports/daily/…`). Läser `config/fokus.md`, `state/portfolj.md`, rätt mall i `templates/`, och
  **kurser i första hand ur `state/prices.json`**. Uppdaterar `state/portfolj.md` (historik är
  append-only). Committar till main.
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
- **KVAR efter genomgången (2026-08-02) – i prioritetsordning:**
  1. **Kör `push.bat`.** Hela 08-02-paketet ligger lokalt. Extra viktigt att det sker FÖRE
     måndagens rotation: `previousClose`-fixen måste vara i repot innan `prices.yml` kör 05:00
     UTC, annars fattar rotationen beslut på falska dagsrörelser en dag till.
  2. **Verifiera måndag 2026-08-03 att fixarna bitit:** (a) `state/prices.json` – jämför någon
     ticker mot en extern kurs, dagsrörelsen ska nu vara en DAGSrörelse; (b) `state/alerts.json`
     – fältet `checkedAt` ska finnas och stämplas om under dagen; (c) `state/decisions.json` –
     rotationerna ska lägga rader UTAN `source: backfill`, syns direkt i Avkastning-vyns nya
     Beslutslogg-ruta; (d) båda portföljerna ska ha migrerat kassa till sleeven (prompternas
     punkt 4c) – nordiska boken låg på 50 % kassa, US-boken 100 %.
  3. **Kör `movers.yml` manuellt en gång** (Actions → "Veckans rörelser" → Run workflow) för att
     förgodkänna den, eller lita på lördagskörningen. `state/movers.json` finns redan lokalt från
     körningen 2026-08-02.
  4. `docs/manual/`-skärmbilderna åldras. Tas nya: se kommentaren i `make-manual.bat`, och kör
     sedan skriptet så PDF:en följer med.
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
- **`index.html` måste ligga i repo-roten** för att Pages ska servera den på sajtens rot.
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
