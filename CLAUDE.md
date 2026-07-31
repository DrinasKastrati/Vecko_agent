# Vecko_agent — projektkontext (läs detta först)

Detta dokument finns för att en ny Cowork-/Claude-session snabbt ska förstå projektet, nuläget
och vad som är kvar att göra. Ägare: **Dren** (kastratidrinas@gmail.com).
**Senast uppdaterad:** 2026-07-31.
**AKTIV ARBETSKOPIA:** `C:\Users\drini\code\Vecko_agent` (ny dator sedan 2026-07-31 – arbeta HÄR).
Tidigare kopior (`C:\Users\kastrdri\Git_proj\gitVecko_agent` samt den under OneDrive) är utfasade.

---

## 1. Vad projektet är
Ett automatiserat system för aktie-beslutsstöd. Sex ursprungliga delar beskrivs nedan; delarna
7–9 (US-rotation, allokerings-routine, miss-retro) tillkom senare och beskrivs i avsnitt 5.
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

## 2. Målstruktur för repot (efter omorganisation)
```
Vecko_agent/
├─ index.html            # webbappen (MÅSTE ligga i roten för GitHub Pages)
├─ manifest.json         # PWA-manifest (installerbar på mobil/desktop)
├─ push.bat              # Drens enklicks-commit+push efter en Cowork-session
├─ .nojekyll
├─ .gitignore            # OS-/editor-skräp (viktigt med OneDrive)
├─ assets/               # webbappens moduler
│  ├─ vparse.js          #   window.VParse  – all parsning (rena funktioner)
│  ├─ vrender.js         #   window.VRender – bygger HTML-strängar
│  ├─ app.js             #   class Dashboard – hämtar data, renderar, event
│  └─ icon.svg           #   app-ikon (PWA/favicon)
├─ prompts/              # instruktioner till routinerna
│  ├─ dagligprompt.md    #   nordisk rotation – enda ingången
│  ├─ veckoprompt.md     #   UTGÅNGEN stub (skapade dubbletter – schemalägg aldrig)
│  ├─ scoutprompt.md     #   USA & krypto – daglig scout (fristående kategori)
│  ├─ us_dagligprompt.md #   US-rotation (egen USD-bok, ~15:00 CET)
│  ├─ allokering.md      #   veckovis kapitalvikt nordisk/US -> allocation.json
│  ├─ miss_retro.md      #   veckovis lärloop -> lessons.md + reports/retro/
│  └─ analysprompt.md    #   aktieanalys på begäran (manuell kö-arbetare, ingen API-nyckel)
├─ templates/            # strikta mallar (routinerna får ALDRIG ändra dem)
│  ├─ vecko_rapport.md
│  ├─ daglig_mall.md
│  ├─ case_rapport.md
│  ├─ scout_case.md      #   USA & krypto-rapportens mall
│  ├─ us_daglig_mall.md  #   US-rotationens dagliga mall
│  ├─ us_vecko_rapport.md #  US-rotationens veckomall
│  ├─ retro_mall.md      #   miss-retrons mall
│  └─ analys_mall.md     #   mall för aktieanalys på begäran
├─ config/               # preferenser + bevakning
│  ├─ fokus.md           #   nordiska preferenser
│  ├─ fokus_scout.md     #   USA & krypto-preferenser (scout)
│  ├─ fokus_us_rotation.md #  US-rotationens preferenser
│  ├─ watchlist.txt      #   nordiska extra-tickers till pris-hämtaren
│  ├─ watchlist_us.txt   #   USA/krypto-tickers + USDSEK=X till pris-hämtaren
│  ├─ news_feeds.txt     #   RSS/Atom-flöden (namn|url) som fetch-news.mjs läser
│  ├─ kostnader.json     #   transaktionskostnad per bok (courtage + växlingspåslag)
│  └─ backtest_universe_{nordic,us}.txt  # universum för backtest.mjs
├─ state/                # levande tillstånd (muteras av routinen / actionen)
│  ├─ portfolj.md        #   innehav, kassa, ackumulerad avkastning, append-only historik
│  ├─ portfolj_us.md     #   samma för US-boken (USD)
│  ├─ prices.json        #   kurser (skrivs av GitHub Action, läses av routinen)
│  ├─ price_history.json #   rullande kurshistorik (sparklines i dashboarden)
│  ├─ analysis_queue.json #  analyskö (pending/done); issue-Action fyller, arbetaren tömmer
│  ├─ alerts.json        #   intradag-signaler (skrivs av monitor.yml, visas som dashboard-banner)
│  ├─ allocation.json    #   kapitalvikt nordisk/US (allokerings-routinen)
│  ├─ lessons.md         #   aktiva lärdomar – skrivs ENDAST av miss-retron
│  ├─ news_feed.json     #   nyhetsradar (skrivs av news.yml, PRIMÄR källa för routinerna)
│  └─ decisions.json     #   append-only beslutslogg (kalibreringsunderlag för retron)
├─ reports/
│  ├─ weekly/            #   veckorapport-yymmdd.md (nordisk)
│  ├─ daily/             #   daglig-yymmdd.md (nordisk)
│  ├─ scout/             #   rapport-yymmdd.md (USA & krypto)
│  ├─ us_daily/          #   us-daglig-yymmdd.md
│  ├─ us_weekly/         #   us-veckorapport-yymmdd.md
│  ├─ retro/             #   retro-yymmdd.md (miss-retron)
│  ├─ backtest/          #   backtest-yymmdd-<marknad>.md (körs manuellt, kräver nät)
│  └─ analysis/          #   analys-TICKER-yymmdd.md (på begäran, cache)
├─ tests/
│  ├─ run.mjs            #   testsvit för rena funktioner (node tests/run.mjs) – körs i CI
│  └─ sim.mjs            #   jsdom-simulering av HELA appen (kräver jsdom, körs INTE i CI)
└─ .github/
   ├─ workflows/prices.yml       # schemalagd kurshämtning (nordisk + USA/krypto + FX)
   ├─ workflows/auto_merge.yml   # auto-merge av claude/**-brancher till main
   ├─ workflows/analys_queue.yml # issue "analys: TICKER" -> analysis_queue.json (nyckellös)
   ├─ workflows/monitor.yml      # intradag-monitor varje timme börstid -> alerts.json (nyckellös, LLM-fritt)
   ├─ workflows/news.yml         # nyhetsingestion varannan timme -> news_feed.json (nyckellös)
   ├─ workflows/test.yml         # testsvit + decisions-validering + node --check vid varje push
   ├─ workflows/digest.yml       # daglig sammanfattning som issue/e-post
   ├─ workflows/watchdog.yml     # larmar om prices/rapporter/beslutslogg/nyheter tystnat
   ├─ scripts/fetch-prices.mjs   # hämtar Yahoo-kurser (+stooq-fallback) -> state/prices.json
   ├─ scripts/fetch-news.mjs     # läser RSS/Atom -> state/news_feed.json
   ├─ scripts/backtest.mjs       # backtestar mekaniska skelettet -> reports/backtest/
   ├─ scripts/validate-decisions.mjs # schema + append-only för decisions.json (körs i CI)
   ├─ scripts/queue-add.mjs      # lägger ticker i analysis_queue.json + rätt watchlist
   ├─ scripts/digest.mjs         # bygger dagens digest (LLM-fritt)
   ├─ scripts/watchdog.mjs       # hittar tysta fel -> watchdog.json
   └─ scripts/alerts.mjs         # jämför kurser mot stop/mål/entry -> alerts.json (inga tokens)
```
Filnamn på rapporter: `daglig-yymmdd.md` och `veckorapport-yymmdd.md` (yy=år, mm=månad, dd=dag).

---

## 3. Webb-dashboarden (teknik)
- Ren HTML/CSS/JS, inga byggsteg. Laddar `marked@12` och `chart.js@4` från jsdelivr (CDN), samt
  de egna modulerna i ordning: `vparse.js` → `vrender.js` → `app.js`.
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
  bästa/sämsta, snitt-hålltid och mål/stopp/rotation ur `portfolj.md`:s historik (`computeTradeStats`).
  Sparklines ritas ur `state/price_history.json`.
- Rena funktioner (parsning/rendering/kurslogik) testas med `node tests/run.mjs` (ingen nätåtkomst krävs).

---

## 4. Routinen — vad prompten gör
- **`prompts/dagligprompt.md`** – ENDA ingången, körs varje handelsdag (mån–fre). Måndag = LÄGE A
  (full rotation, skriver `reports/weekly/…`), övriga dagar = LÄGE B (bevakning, skriver
  `reports/daily/…`). Läser `config/fokus.md`, `state/portfolj.md`, rätt mall i `templates/`, och
  **kurser i första hand ur `state/prices.json`**. Uppdaterar `state/portfolj.md` (historik är
  append-only). Committar till main.
- **`prompts/veckoprompt.md`** är UTGÅNGEN (stub) – den separata måndagsrotationen skapade dubbletter
  och är borttagen ur flödet. Schemalägg endast `dagligprompt.md`.
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

---

## 5. Nuläge — vad som är gjort (allt live i repot)
- ✅ Dashboarden byggd, modulär, **flikbaserad omdesign** klar; GitHub Pages live.
- ✅ Tre routiner på plats: nordisk rotation (`dagligprompt.md`), scout USA/krypto
  (`scoutprompt.md`), aktieanalys på begäran (`analysprompt.md` + issue/kö-Action).
- ✅ Pris-hämtaren täcker nordiskt + USA/krypto, med **stooq-fallback** när Yahoo fallerar;
  skriver `prices.json` + rullande `price_history.json`.
- ✅ Analytics (handelsstatistik), sparklines och analys-färskhet i dashboarden.
- ✅ Testsvit `tests/run.mjs`; `.gitattributes` normaliserar radslut (OneDrive/CRLF).
- ✅ 2026-07-11: benchmark-overlay i Avkastning (OMXS30 `^OMX` + S&P `^GSPC` vs strategin),
  live-P/L-remsa på innehavskorten (prices.json), kursfärskhets-badge i topbaren, kortkommandon
  (1–7 flikar, R uppdatera), PWA-manifest (`manifest.json` + `assets/icon.svg`), `push.bat`
  (enklicks-commit+push), stängningskurs-crons i `prices.yml` (16:45 + 21:10 UTC),
  `price_history.json` committas nu av actionen (sparkline-fixen), ticker-regexen kräver ≥2 tecken
  i basen (inget "B.ST"-skräp ur "BAHN B.ST"), `config/watchlist.txt` skapad, `portfolj.md` städad,
  tickerformat-krav (bindestreck) tillagt i båda prompterna.
- ✅ 2026-07-11 (Översikt v2): statusrad (datum/läge/beslut-chips + nedräkning till nästa
  schemalagda körning), positionsmätare stopp→entry→nu→mål på innehavskorten, besluts-historik
  som färgpunkter (senaste 10 dagliga rapporterna). OBS: nedräkningen speglar schemat HÅRDKODAT i
  `vparse.js` (`nextRoutineRun`) – uppdatera funktionen om en routine schemaläggs om. Aktuell
  uppsättning står i avsnitt 5b under "SCHEMAT". Testsviten: 50 tester, gröna.
- ✅ 2026-07-12: allt ovan pushat till main och live på Pages. Schemalagda routinerna i drift:
  scout skrev `rapport-260712.md` (första automatiska körningen), `daglig-260711.md` (helgnotis).

- ✅ 2026-07-14: **intradag-monitor** (`monitor.yml` + `alerts.mjs`, LLM-fritt) → `state/alerts.json`
  + signalbanner/GitHub-issue; **Aktuellt innehav** visas nu på Översikt (öppna positioner ur
  `portfolj.md` med live-P/L); analys-loopen stänger cirkeln (köad ticker → watchlist → prices.json
  → verifierad kurs i analysen). Analyser hittills: SYNACT.ST, OSSD.ST, NVO, SAAB.ST.
- ✅ 2026-07-15: **interaktivitets-uppgradering av dashboarden** (ej pushad ännu – kör `push.bat`):
  all hård texttrunkering ersatt av CSS-klamp + "Visa mer/Visa mindre" per kort/notis (hela texten
  finns alltid i DOM; knappen visas bara när texten faktiskt svämmar över), veckans case-katalysator
  behåller nu FULL text i `parseWeekly` (2-menings-klippet borttaget), entry-/kurs-celler visas
  oavkortade. Nya interaktioner: klickbara ticker-pills (→ Analys-fliken, köar inget automatiskt),
  sorterbar Historik-tabell (datum/tal-medveten), filter + sortering (A–Ö/färskhet) i Kurser,
  hopfällbara scout-sektioner (`<details>`, minns läget i localStorage), "Full höjd"-knapp i
  Rapporter (74vh-boxen ↔ full höjd, minns valet). Testsviten: 62 tester, gröna.
  OBS sandlåde-fälla: OneDrive-monteringen serverade trunkerade JS-filer direkt efter redigering →
  testerna kördes mot en verifierad kopia och de verifierade bytesen skrevs tillbaka till repot.
- ✅ 2026-07-16: **arbetskopian flyttad** till `C:\Users\kastrdri\Git_proj\gitVecko_agent` (utanför
  OneDrive). **Prompt-pack:** dagligprompt fick 2b PENDING-PLANER (TRIGGAD/EJ TRIGGAD-check mot
  verifierad kurs), 2c INTRADAG-SIGNALER (läs `state/alerts.json`, agera eller motivera), 0b
  LÄRDOMAR (läs Lärdom-fältet i 4 senaste veckorapporterna) samt watchlist-hygien (≤ 25 tickers,
  14 dagars regel); scoutprompt fick 4b UPPFÖLJNING AV TIDIGARE CASE + watchlist_us-hygien;
  analysprompt fick c2 DELTA MOT CACHE ("Sedan senast"). Körsäkerhet i alla tre prompterna:
  datumverifiering före filnamn, push-fallback (lämna filer + notis till Dren i stället för att
  fastna), `git pull`/raw-URL för färskaste prices.json; daglig BEHÅLL kräver explicit motivering
  genom binära händelser (rapport ≤ 2 dagar bort); rapportkrav om EXAKTA mall-rubriker
  (dashboardens parsningskontrakt). Mallarna uppdaterade med matchande
  sektioner (`## Pending-planer` i daglig_mall, `## Uppföljning av tidigare case` i scout_case,
  `## Sedan senast` i analys_mall). **Dashboard:** "Ändrat idag"-remsa på beslutskorten (diff mot
  gårdagens rapport: beslut/stopp/mål + NY IDAG, `VParse.diffDailies`), klickbara Kurser-kort →
  kurshistorik-modal (Chart.js, 60 dagar), 🔔 Notiser-knapp (skrivbordsnotiser vid nya intradag-
  signaler, alerts.json pollas var 5:e min), tickande nedräkning i statusraden, scout-uppföljning
  parsas + renderas som egen sektion. Testsviten: 72 tester, gröna.
  OBS sandlåde-fälla generellt: sessions-monteringen visar GAMLA bytes en stund efter att filer
  redigerats (gäller ÄVEN utanför OneDrive) – kör tester mot en kopia i outputs-mappen om det
  strular direkt efter redigering.
- ✅ 2026-07-17: **sista webbupgrade-omgången.** Fulltextsökning i Rapporter-fliken (sökfält, Enter →
  söker i ALLA rapporttyper inkl. analyser, träfflista med markerade snippets, klick öppnar
  rapporten; `VParse.searchDocs` + `VRender.renderSearchResults`). "Jämför två"-läge i Analys
  (klicka två cachade analyser → sida vid sida-kolumner). Alert-historik: `alerts.mjs` fick
  `mergeHistory` (utgångna signaler sparas i `alerts.json.history`, max 50, med `expiredAt`) och
  dashboarden visar hopfällbar "Tidigare signaler". Testsviten: 82 tester, gröna.
  OBS: sandlåde-cachen fastnade på stale bytes hela sessionen → verifiering gjordes i en NYSKAPAD
  kopia (nya filer propagerar färskt) och de verifierade bytesen kopierades tillbaka till repot
  med bash-cp (sandlåde→host fungerar). Mönster vid strul: bygg om testträdet under NYTT filnamn.
- ✅ 2026-07-17 (automation-paket): **auto-push** (`auto_push.bat` tyst var 30:e min vardagar 07–19,
  registreras EN gång med `setup_autopush.bat`; loggar till gitignorade `auto_push.log`) – gör
  kedjan routine → push → Pages helt handsfree. **CI-tester** (`test.yml`: hela testsviten +
  node --check på alla JS-moduler vid varje push). **Daglig digest** (`digest.yml` + `digest.mjs`,
  LLM-fritt: bygger sammanfattning av dagens rapport → skapar+stänger issue → e-postnotis;
  dubblett-skydd via titelsökning). **Watchdog** (`watchdog.yml` + `watchdog.mjs`, 10:30 UTC
  vardagar: larmar via issue om prices.json >26 h gammal eller dagens nordiska/scout-rapport
  saknas; dedupe mot redan öppna issues). **Avanza-länk** i kurshistorik-modalen (app.js
  `avanzaUrl`: suffix strippas, klasstreck → mellanslag; döljs för ^index/-USD).
  Testsviten: 91 tester, gröna. **Push-race-fix:** monitor.yml/prices.yml:s commit-steg
  (pull --rebase || true; git push) kunde dö med exit 128 vid kollision med andra pushar
  (mycket vanligare nu med auto-push var 30:e min) – ersatt med retry-loop ×3:
  `pull --rebase -X theirs` (färsk action-data vinner konflikter) + `rebase --abort`-städning
  mellan försöken, samt `fetch-depth: 0` på checkout (grund klon kan inte rebasa när main
  hunnit flytta sig → fatal 128).
- ✅ 2026-07-17 (US-rotation): **ny sjunde del** – en EGEN, USD-denominerad amerikansk
  rotationsportfölj, HELT SEPARAT från nordiska rotationen och scout-idéerna. Egen prompt
  (`prompts/us_dagligprompt.md`, kör ~15:00 CET före US-öppning, LÄGE A måndag / LÄGE B
  bevakning), egna mallar (`templates/us_daglig_mall.md`, `us_vecko_rapport.md`), config
  (`config/fokus_us_rotation.md`), tillstånd (`state/portfolj_us.md`, USD-bok, baslinje 0 %) och
  rapporter (`reports/us_daily/us-daglig-yymmdd.md`, `reports/us_weekly/us-veckorapport-yymmdd.md`).
  **Pre-/after-hours-krav:** prompten kräver att pre-market och gårdagens after-hours-rörelser
  alltid vägs in (stop/mål brutet utanför reguljär session = brutet). **Prisinfra:**
  `fetch-prices.mjs` fick `extractUsPortfolioTickers` + `newestUsWeekly` så US-innehavens kurser
  garanterat hämtas; delar `prices.json`/`watchlist_us.txt`. **Monitor:** `alerts.mjs` läser nu
  BÅDE `portfolj.md` och `portfolj_us.md` (US-tickers får intradag-signaler). **Dashboard:** ny
  flik "US-rotation" (KPIs + innehav/beslut med live-USD-P/L + egen rapportväljare); parsers
  återanvänds oförändrat (parseFilename fick `us_daily`/`us_weekly`, `nextRoutineRun` fick
  us-rotation 15:00, `parsePortfolio` filtrerar nu bort dash-placeholder-rader ur pending).
  **Schemalagd Cowork-task:** `vecko-agent-us-rotation` (mån–fre 15:00, pekar på Git_proj-kopian).
  Testsviten: 100 tester, gröna. OBS: befintliga tasks (scout/nordisk) är `enabled:false` och
  pekar ännu på den UTFASADE OneDrive-kopian – US-tasken pekar korrekt på Git_proj.
- ✅ 2026-07-17 (conviction-viktning + Total-vy): **fast 50/50 ersatt av conviction-viktad sizing**
  i BÅDA böckerna. Prompterna tillåter nu 40–60 % per aktie + kassa (1 aktie + kassa, eller 100 %
  kassa vid svag conviction), varje avvikelse från 50/50 måste motiveras. Ny "Vikt"-kolumn i
  `Aktuellt innehav` + `Historik` (båda portfolj-filerna) och `Planerad vikt` i pending/veckomallar
  (positionellt parsade tabeller lämnades orörda; vikt läses via kolumnnamn så bakåtkompatibelt).
  **Avkastningsmatematiken** (`computeTradeStats`) läser nu per-affär-vikt (`VParse.weightFrac`,
  default 0,5) i stället för hårdkodat 0,5 → korrekt kedjad avkastning vid ojämna vikter.
  **Ny "Total"-flik** (FÖRSTA fliken, default): blended avkastning viktad med kapitalfördelningen
  mellan böckerna (default 50/50, `VParse.combinedReturn`), kapitalfördelnings-stapel och en
  kombinerad tabell med alla öppna positioner (bok-badge + live-P/L ur prices.json). Rena
  procenttal ⇒ ingen FX. `VRender.renderTotal`; "Översikt"-fliken heter nu "Nordisk". Vikt visas
  som pill på innehavskorten (`heldCard`). Testsviten: 115 tester, gröna.
- ✅ 2026-07-17 (dynamisk kapitalvikt mellan böckerna): **åttonde delen** – en veckovis
  ALLOKERINGS-routine som sätter hur totalkapitalet fördelas mellan nordiska och US-boken (i
  stället för fast 50/50 i Total-vyn). Böckerna förblir separata; detta är en övergripande vikt.
  Ny prompt `prompts/allokering.md` (läser båda veckorapporterna + portföljerna, sätter splitten
  inom bandet 0,2–0,8/bok, max ~15 pp rörelse/vecka, motivering krävs), nytt tillstånd
  `state/allocation.json` ({nordic, us, rationale, updatedAt, week}, baslinje 0,5/0,5). **Dashboard:**
  app.js läser allocation.json (defensiv clamp 0,2–0,8, annars 50/50-baslinje) och skickar splitten +
  motivering till `VRender.renderTotal(books, split, meta)`; Total-vyn visar kapitalvikts-stapeln
  enligt den dynamiska splitten + en rad med motiveringen/veckan. **Schemalagd Cowork-task:**
  `vecko-agent-allokering` (måndag ~15:30 CET, efter båda veckorotationerna, pekar på Git_proj).
  Testsviten: 119 tester, gröna. Kapital-splitten är nu det ENDA som allokerings-routinen rör –
  aktievalen sköts fortsatt av respektive boks rotation.

- ✅ 2026-07-31 (miss-retro): **nionde delen** – en veckovis LÄRANDE-loop som granskar veckans
  stora vinnare som INGEN routine fångade (t.ex. Microsoft efter stark rapport), spårar VAR i
  tratten de föll bort och destillerar generaliserbara processregler. Ny prompt
  `prompts/miss_retro.md` (körs fredag kväll/helg via Drens routines): STEG 1 hitta 3–5 missar
  (nyhetssök + `price_history.json`-veckorörelser; miss = varken ägd, pending/bubblare eller
  scout-case; rörelser utan katalysator = brus), STEG 2 traceback med klassificering
  A UTANFÖR UNIVERSUM / B SEDD MEN FÖRKASTAD / C SEDD MEN RANKAD UNDER / D SIGNAL FILTRERAD,
  STEG 3 facit-filter (PROCESSFEL kräver signal tillgänglig FÖRE rörelsen + generaliserbar regel;
  annars ACCEPTABELT UTFALL → "Ingen ändring" – skydd mot hindsight-överanpassning), STEG 4 max
  2 nya lärdomar/vecka till nya `state/lessons.md` (max 10 aktiva, L-ID, arkiv append-only,
  ENDAST retron får skriva i filen; lärdomar aldrig ticker-specifika, får ALDRIG sänka
  kursverifiering/risk-regler). Rapport: `reports/retro/retro-yymmdd.md` enligt nya strikta
  `templates/retro_mall.md`. **Loopen stängd:** dagligprompt/us_dagligprompt fick 1b LÄRDOMAR
  (läs lessons.md i båda lägena, referera L-ID i motiveringar) + utökad 0b; scoutprompt fick 1b.
  Retron rör ALDRIG portföljer/watchlists (genererar inga case). Dashboard-integration byggdes
  samma dag (se webb-paketet nedan).

- ✅ 2026-07-31 (webb-paket): **avkastning uppdateras vid varje SÄLJ** – LÄGE B punkt 8 i
  dagligprompt/us_dagligprompt kräver nu att "Ackumulerad avkastning sedan start" räknas om
  DIREKT i samma körning som ett SÄLJ (inte bara i måndagens FACIT); dashboardens KPI läser
  redan fältet live ur portfolj-filerna. **Ny flik "Retro"** (10:e fliken): aktiva lärdomar ur
  `state/lessons.md` som kort med L-ID-pill (`VParse.parseLessons` + `VRender.renderLessons`)
  + rapportväljare för `reports/retro/` (parseFilename fick typ `retro`; sökningen taggar nu
  även retro/us_daily/us_weekly). **Avkastning:** equity-kurva PER AFFÄR (`buildTradeSeries`:
  en punkt per stängd position, kedjad med per-affär-vikt; orange streckad serie i diagrammet
  med affärens namn+utfall i tooltip) och **månadsheatmap** (`buildMonthlyStats` +
  `renderMonthlyHeatmap`: kedjat viktat utfall per "Stängd"-månad, grön/röd intensitet).
  **Mobil:** scroll-skuggor på breda tabeller (background-attachment-tricket), större
  tryckytor (an-chip/px-item/rtype/sr-hit), modal maxhöjd + lägre diagram, heatmap 2 kolumner.
  **UI-polish:** laddningsskelett (shimmer) i tomma vyer under första hämtningen, tooltips på
  alla handelsstatistik-kort (profit factor förklarad m.m.), färgkodad Utfall %-kolumn i
  Historik, `.empty`-tomlägen som streckade boxar, kortkommando-hinten rättad (1–9 + Esc).
  Testsviten: 140 tester, gröna.

- ✅ 2026-07-31 (design-overhaul): **helt ny layout** – centrerade flik-designen ersatt av
  SIDOPANEL + full skärmbredd ("Quant Deck"-tema: förfinad mörk palett, sky-accent #38BDF8,
  grupperad meny Portfölj/Analys/Data, aktiv-indikator med glow). **Ny startvy "Hem"**
  (default, 11:e vyn): vänsterspalt med BÅDA böckernas innehav/dagens beslut/pending (bok-
  rubriker med ackumulerad avkastning), högerspalt ("rail") med Bevakning inför imorgon,
  Veckans radar, Senaste nytt och Aktiva lärdomar – alla med hopp-länkar till respektive vy
  (`data-goto-view`, delegerat klick i app.js). `renderHem()` i app.js komponerar allt av
  BEFINTLIGA renderare (renderHoldings/renderStatusRow m.fl.) ⇒ vrender orörd, alla 140
  enhetstester opåverkade. Mobil: sidopanelen blir scrollbar botten-bar (data-short-etiketter).
  showView-fallback ändrad till "hem"; statusraden tickar i både Nordisk- och Hem-vyn.
  **Nytt simuleringstest `tests/sim.mjs`** (jsdom, körs INTE i CI): bootar HELA appen med
  mockad fetch som serverar repots riktiga filer, verifierar Live-status, alla 11 vyer,
  navigering och fallback – 27 kontroller. Körs lokalt: `npm i jsdom && node tests/sim.mjs`
  (package.json/package-lock/node_modules gitignoreras). Verifierat 2026-07-31 på Drens
  dator: 140/140 enhetstester + 27/27 sim gröna.

- ✅ 2026-07-31 (sälj-facit + riskmått): **lärloopen täcker nu exits.** `prompts/miss_retro.md`
  fick STEG 3b SÄLJ-FACIT: varje position stängd under perioden utvärderas mot verifierad kurs
  ~5 handelsdagar efter exit → BRA EXIT / NEUTRAL / LÄMNADE PÅ BORDET (trösklar ~5 % Norden /
  ~4 % US), med samma facit-filter som missarna (rotationssälj som stiger = normalt ACCEPTABELT;
  stop-loss som vänder upp = kostnaden för skyddet – lärdomar får ALDRIG mjuka upp stopp-
  disciplin). Lärdomsbudgeten max 2/vecka delas mellan missar och exits. `templates/retro_mall.md`
  fick sektionen "## Sälj-facit (exits under perioden)" (tabell + bedömning). **Riskmått i
  Avkastning:** `VParse.computeRiskStats` (max drawdown på kedjade equity-kurvan, längsta
  förlust-/vinstsvit, volatilitet per affär (stddev), payoff ratio) + `VRender.renderRiskStats`
  (stat-kort med tooltips) i ny sektion under Handelsstatistik (`#riskStats`). Testsviten:
  149 tester; sim: 28 kontroller.

- ✅ 2026-07-31 (idé-pipeline): **bubblare & scout-case kopplade till besluten.**
  (A) OBLIGATORISKT INFLÖDE i LÄGE A: dagligprompt fick 1g BUBBLAR-ÅTERBRUK (förra veckans
  bubblare SKA in i bruttolistan, utfall redovisas som VALD/RANKAD UNDER/STRUKEN);
  us_dagligprompt fick 1g SCOUT-INFLÖDE (US-aktie-case med tes INTAKT ur de 5 senaste
  scout-rapporterna SKA poängsättas – scouten genererar, rotationen beslutar) + 1h
  bubblar-återbruk. (B) VILLKORADE BUBBLAR-PLANER: båda rotationerna FÅR lägga max 2 bubblare
  som pending-planer med explicita nivåer, märkta "BUBBLARE" – befintliga `monitor.yml` larmar
  då intradag utan tokens; KÖP-regeln i LÄGE B fick fall (c) (triggad bubblar-plan + ledig
  kapacitet); ej triggad på 5 handelsdagar → avförs. (C) IDÉFLÖDETS FACIT: miss_retro fick
  STEG 3c (förra veckans bubblare + 5–10 dagar gamla scout-case utvärderas mot verifierad kurs;
  träffbild idéer vs valda case; enskild vecka = brus, ≥ 3 veckors svit krävs för lärdom om
  rankningen). Vecko-mallarna fick fälten "Förra veckans bubblare"/"Scout-inflöde"/"Villkorade
  bubblar-planer" (parse-säkra fältrader); retro_mall fick "## Idéflödets facit". Inga
  JS-ändringar – testsvit/sim opåverkade (149/28).

- ✅ 2026-07-31 (datadrivet fundament – 3 delar):
  **(1) Beslutsdatabas:** nya `state/decisions.json` (version 1, append-only, schema i filens
  comment-fält: date/book/mode/ticker/action/price/weight/entry/stop/target/rr/catalystType-enum/
  sector/rsi/holdDays/outcomePct/reason/lessonIds). Båda rotationsprompterna fick sektionen
  BESLUTSDATABASEN: en rad per beslut varje körning (även AVVAKTA), aldrig ändra befintliga
  rader, JSON-validering med `node -e` före commit. miss_retro fick STEG 3d BESLUTSSTATISTIK
  (vid ≥ 15 SÄLJ-rader: utfall per catalystType/book → lärdomskandidater för poängmodellens
  viktning; ≥ 8 affärer per kategori krävs, annars brus). Syfte: kalibrera 35/30/15/20-vikterna
  mot data i stället för känsla.
  **(2) Nyhetsingestion (dödar kategori A-missar):** ny nyckellös Action `news.yml` (varannan
  timme vardagar) + `fetch-news.mjs` (LLM-fri): läser RSS/Atom ur nya `config/news_feeds.txt`
  (MFN, Cision, GlobeNewswire, PR Newswire, Business Wire; format namn|url, fallerande flöden
  hoppas över med status i JSON:en) → `state/news_feed.json` (dedupe på url, 48h-fönster, max
  300 poster, per-feed-status för felsökning). Rena funktioner parseRss/mergeNews/parseFeedList
  exporterade + testade. Alla tre prompterna fick "NYHETSFLÖDET FÖRST": news_feed.json är
  PRIMÄR nyhetsradar, rubriker verifieras via länken innan beslut, websök blir komplement.
  OBS: kontrollera `feeds`-statusen i news_feed.json efter första körningen och justera
  URL:er i news_feeds.txt om något flöde ger fel.
  **(3) Backtest av mekaniska skelettet:** nya `.github/scripts/backtest.mjs` + universum-filer
  `config/backtest_universe_{nordic,us}.txt` (~30 likvida namn per marknad). Simulerar RAMVERKET
  utan LLM-omdöme (momentum-proxy: topp 2 på lookback-avkastning varje måndag, entry på öppning,
  stop/mål i %, max 5 dagars håll, konservativ stop-före-mål + gap-hantering) över en parameter-
  grid (lookback 10/20 × stop/mål 3/6, 4/8, 5/10 %) och skriver `reports/backtest/backtest-
  yymmdd-<marknad>.md` med träff %, PF, kedjat utfall, max DD och benchmark-jämförelse (^OMX/
  ^GSPC). Körs MANUELLT på Drens dator (kräver nät): `node .github/scripts/backtest.mjs nordic`
  resp. `us` (valfri range, t.ex. `5y`). Rena funktioner (parseCandles/momentumAt/isWeekStart/
  simulateTrade/backtestUniverse/buyHoldPct) exporterade + testade. Testsviten: 168 tester.

- ✅ 2026-07-31 (avkastningspaket – 7 åtgärder mot faktiska läckor i systemet):
  **(1) Backtestet kört för första gången** (`reports/backtest/backtest-260731-{nordic,us}.md`,
  5 år, 30 symboler per marknad, 259/258 veckor). Resultat: BRUTTO ligger skelettet under sitt
  benchmark i båda marknaderna (nordic bäst +22,6 % vs ^OMX +36,3 %; us bäst +61,4 % vs
  ^GSPC +70,9 %) och NETTO efter courtage är allt kraftigt negativt (−36 % resp. −76 %).
  Slutsats: ramverket bär inte sin egen vikt – LLM-urvalet måste tillföra HELA edgen, och
  omsättningstakten (~100 affärer/år) är den enskilt största kostnaden. Nordiskt grid föredrog
  SMALASTE stoppen (−3 %/+6 %, PF 1,08), US-gridet de BREDASTE (20d/−5 %/+10 %, PF 1,13).
  **(2) Kostnader modellerade:** ny `config/kostnader.json` (nordic 0,25 % rundtur; us 0,25 % +
  0,5 % växlingspåslag). `VParse.costFor/netPct`, `computeTradeStats(history, costPct)` ger
  netChainedPct/netWinRate/netProfitFactor/costDragPct, `buildTradeSeries(history, costPct)` ger
  nettokurva med `grossPct` kvar per punkt, nytt stat-kort "Netto efter kostnad".
  `backtest.mjs` läser samma config (`params.costPct`). Bruttotalen är orörda.
  **(3) Valutan redovisad:** `USDSEK=X` tillagd i `config/watchlist_us.txt`, `VParse.fxRate`
  + valutarad i Total-vyn som säger explicit att blended-talet är EXKL. valutaeffekt (historiken
  kan inte räknas om – växelkursen per affär är inte loggad). OBS: `fetch-prices.mjs`
  filtrerade bort valutapar – `collectUsTickers` accepterar nu `^[A-Z]{6}=X$` och `fetchStooq`
  mappar `USDSEK=X` → `usdsek`. Utan den fixen hämtades paret aldrig (34/35 tickers, FX saknades).
  **(4) Beslutsloggen fungerar:** `state/decisions.json` backfylld med 6 historiska rader
  (5 KÖP/SÄLJ ur portföljhistoriken + dagens BEHÅLL Saab, alla märkta
  `"source": "backfill-260731"`), ny `.github/scripts/validate-decisions.mjs`
  (schema, enum, SÄLJ-fält, append-only mot föregående commit) körs i `test.yml`, och watchdogen
  larmar om dagens rapport pushas UTAN rader i loggen. Prompterna pekar nu på validatorn i
  stället för bara `JSON.parse`.
  **(5) Nyhetsingestionen live:** `cision-se` (HTTP 404) och `businesswire-tech` (tomt RSS-skal)
  var döda – ersatta med `sec-8k` (EDGAR Atom, kräver kontakt-UA → `uaFor()`), `fed-press` och
  `globenewswire-earnings`. 6/6 flöden gröna, 137 poster. Ett flöde som svarar 200 men 0 poster
  flaggas nu som "0 poster – kontrollera URL" i stället för att tystna. Watchdogen larmar om
  `news_feed.json` är > 6 h gammal.
  **(6) Prompt-kalibrering (båda rotationerna):** ny sektion "NIVÅER & OMSÄTTNING" med
  backtestade stoppband (nordic 3–5 %, us 4–6 %), **kostnadströskel** (entry→mål minst 6 %
  nordiskt / 8 % i US-boken) och **BEHÅLL som standardval** – 5-dagarsregeln säljer inte längre
  automatiskt, rotation kräver stop/mål, punkterad tes eller ≥ 2 poäng bättre nytt case.
  **(7) Delat entry (4a i båda prompterna):** halva vikten köps direkt vid rotationen, andra
  halvan som villkorad limit i Pending. Motverkar att kapitalet blir stående (Saab v30, Moreld,
  XOM triggade aldrig). Undantag vid gap > 3 % eller binär händelse inom 2 dagar.
  Dessutom: 1g0 NYHETSDRIVEN KANDIDATGENERERING (minst 5 kandidater ur `news_feed.json` innan
  scanning ur minnet) i båda rotationsprompterna, och LÄGE A punkt 0 (FACIT) omskriven i båda så
  den inte längre motsäger BEHÅLL-standarden.
  Testsviten: **214 tester**; sim: **31 kontroller**; `validate-decisions.mjs` OK (6 rader);
  watchdogen "Allt friskt". Allt verifierat på Drens dator 2026-07-31.
  **OBS – inte pushat:** ändringarna ligger lokalt i `C:\Users\drini\code\vecko_agent`. Kör
  `push.bat` för att publicera. Nya/ändrade tillståndsfiler som följer med: `state/prices.json`
  (nu med USDSEK=X), `state/news_feed.json` (ny fil), `state/decisions.json`,
  `reports/backtest/backtest-260731-{nordic,us}.md` (nya).

- ✅ 2026-07-31 (strategipaket – 5 ändringar av hur kapitalet allokeras och mäts):
  **(1) INDEXSLEEVE ersätter kassa.** Oallokerat kapital parkeras i `XACT-OMXS30.ST` (nordiskt)
  respektive `SPY` (US) i stället för på konto, redovisat som en egen rad i "Aktuellt innehav"
  utan stop/mål. Skälet: backtestet visade att index slog skelettet, så tid utanför marknaden är
  en garanterad kostnad. Frågan strategin svarar på blir därmed den rätta – tillför urvalet något
  UTÖVER index? Sleevens transaktioner loggas med `catalystType: "index"` och ska filtreras bort
  ur urvalsstatistiken. Kassa (0 %) tillåts bara om sleeven inte kan handlas.
  **(2) 4 positioner à 25 % ersätter 2 à 50 %** (conviction-band 15–35 %, max 35 % per aktie,
  max 2 av 4 ryktesdrivna). Halverar enskild-aktie-variansen och fördubblar takten som
  beslutsloggen fylls i – med n=2 gick det inte att skilja skicklighet från slump. Färre än 4
  godkända case fyller bara de platser som håller; resten går till sleeven.
  **(3) ALPHA MOT INDEX (ren kod).** `VParse.benchReturnPct/computeAlpha/computeAlphaStats`
  räknar benchmarkets avkastning över varje affärs EXAKTA hållperiod ur `price_history.json`
  (carry-forward över helger; period utanför historiken ⇒ `null`, aldrig 0). Historik-tabellen
  fick kolumnerna "OMXS30" och "Alpha", och Avkastning-vyn en ny sektion `#alphaStats`
  (snitt-alpha, andel affärer som slog index, summa alpha). Första mätningen: Alleima
  **+6,89 % alpha** (+6,39 % mot OMX −0,50 % under 14–17 juli).
  **(4) KATALYSATORTYPEN STYR PLANEN.** Ny tabell i båda prompterna: `earnings`/`order`/
  `regulatory`/`buyback` ⇒ 3–6 veckors horisont, mål 12–15 % (US 14–18 %); `ma_rumor`/`insider`/
  `index` ⇒ 5–10 dagar, snävare mål och **tidsstopp efter 10 handelsdagar** om tesen inte
  bekräftats; `macro`/`turnaround`/`other` ⇒ 2–4 veckor. Nytt fält `horizonDays` i beslutsloggen.
  **(5) MÅLET MÅSTE VARA NÅBART + realiserad R/R loggas.** Målavståndet får vara högst
  2 × genomsnittlig dagsrörelse × √(handelsdagar i horisonten) – ett analytikerintervall är ett
  påstående, inte en mätning. Vid SÄLJ loggas `realizedRr` (utfall / planerat stoppavstånd).
  Validatorn kontrollerar de nya fälten och att `alphaPct = outcomePct − benchPct`.
  **Infrastruktur som krävdes:** `fetch-prices.mjs` fångade inte ETF-tickers – `TICKER_RE`:s
  efterled vidgat 3→6 tecken och watchlist-filtret 10→14 tecken, annars hade `XACT-OMXS30.ST`
  aldrig hämtats. Verifierat: 37/38 tickers, sleeve-kurserna på plats (XACT 486,10 SEK, SPY 747,03).
  Testsviten: **234 tester**; sim: **33 kontroller**. Allt grönt 2026-07-31.

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
  `prompts/analysprompt.md` körs MANUELLT när kön har poster. `prompts/veckoprompt.md` är utgången
  och får ALDRIG schemaläggas (skapade dubbletter).
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
  mappnamnet på disk). Node v24 på plats. Auto-push-tasken ÄR registrerad här (se punkt 2 nedan) –
  den tidigare noteringen om att `setup_autopush.bat` återstod stämmer inte. Schemaläggningen
  sköts via Drens routines (2026-07-31) – de gamla Cowork scheduled tasks behöver INTE återskapas.
- **KVAR efter avkastningspaketet (2026-07-31):**
  1. Kör `push.bat` – hela paketet ligger lokalt, inget är pushat.
  2. ~~Kör `setup_autopush.bat`~~ – **auto-push ÄR aktiv på den här datorn** (verifierat
     2026-07-31: den committade mitt på ett pågående arbete som "Uppdatering via Cowork …" och
     startade en `pull --rebase` som konfliktade i `state/prices.json`, `price_history.json` och
     `news_feed.json`. Konflikterna löstes med den färskare lokala versionen). **Fälla:** kör
     aldrig `fetch-prices.mjs`/`fetch-news.mjs` lokalt samtidigt som actionen skriver samma filer
     – auto-pushen fastnar då i en rebase och lämnar konfliktmarkörer i JSON:en, vilket i sin tur
     får dashboarden att visa tom Kurser-vy. Kontrollera `git status` innan du felsöker appen.
  3. Kontrollera att `news.yml` gått grön i Actions efter första schemalagda körningen och att
     `feeds`-fältet i `state/news_feed.json` inte innehåller "0 poster – kontrollera URL".
  4. Kör om backtestet när universum eller nivåer ändras:
     `node .github/scripts/backtest.mjs nordic 5y` (resp. `us 5y`). Kräver nät.
  5. **Statistiken är fortfarande brus:** 2 stängda affärer. Retrons beslutsstatistik kräver
     ≥ 15 SÄLJ-rader i `decisions.json` innan poängvikterna (35/30/15/20) kan kalibreras mot data.
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
- **Dubbel rotation på måndag (ÅTGÄRDAT):** `veckoprompt.md` är utgången och `dagligprompt.md` är
  enda ingången (den gör LÄGE A på måndagar). Schemalägg ALDRIG en separat måndagsprompt igen –
  det skapade tidigare dubbletter (`veckorapport-yymmdd_1.md`).
- **`index.html` måste ligga i repo-roten** för att Pages ska servera den på sajtens rot.
- **Sänk inte verifieringskravet** för kurser – lösningen är pålitliga priser (prices.json), inte
  att ta bort skyddet.
- **Radera aldrig** `state/portfolj.md` (historik/ackumulerad avkastning) eller mallarna vid en
  omstrukturering.

---

## 8. Var filerna ligger
Allt ligger nu i repot (branch `main`) enligt strukturen i avsnitt 2 – inga lösa filer utanför.
Drens AKTIVA lokala arbetskopia: `C:\Users\drini\code\Vecko_agent` (ny dator sedan 2026-07-31).
Äldre kopior (`C:\Users\kastrdri\Git_proj\gitVecko_agent` och OneDrive-mappen) är utfasade – gör
inga ändringar där. Eventuella
`SETUP.md` / `MIGRATION.md` är historiska (migreringen är gjord) och kan ignoreras.

---

## 9. Disclaimer
Allt systemet producerar är **automatiserat beslutsstöd, inte finansiell rådgivning.** Varje
rapport ska avslutas med den raden.
