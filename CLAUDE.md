# Vecko_agent — projektkontext (läs detta först)

Detta dokument finns för att en ny Cowork-/Claude-session snabbt ska förstå projektet, nuläget
och vad som är kvar att göra. Ägare: **Dren** (kastratidrinas@gmail.com).

---

## 1. Vad projektet är
Ett automatiserat system för aktie-beslutsstöd, i fem delar:

1. **Routinen** – en schemalagd Claude-körning som varje handelsdag (LÄGE B) bevakar innehav och
   varje måndag (LÄGE A) gör en full veckorotation. Den läser preferenser/tillstånd/mallar,
   skriver en markdown-rapport + uppdaterar portföljen och committar direkt till `main`.
   Strategin: alltid exakt 2 nordiska aktier viktade 50/50, roteras varje vecka; dagligt beslut
   per aktie = **KÖP / SÄLJ / BEHÅLL** (eller AVVAKTA om kurs ej kan verifieras).
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
│  └─ analysprompt.md    #   aktieanalys på begäran (manuell kö-arbetare, ingen API-nyckel)
├─ templates/            # strikta mallar (routinerna får ALDRIG ändra dem)
│  ├─ vecko_rapport.md
│  ├─ daglig_mall.md
│  ├─ case_rapport.md
│  ├─ scout_case.md      #   USA & krypto-rapportens mall
│  └─ analys_mall.md     #   mall för aktieanalys på begäran
├─ config/               # preferenser + bevakning
│  ├─ fokus.md           #   nordiska preferenser
│  ├─ fokus_scout.md     #   USA & krypto-preferenser (scout)
│  ├─ watchlist.txt      #   nordiska extra-tickers till pris-hämtaren
│  └─ watchlist_us.txt   #   USA/krypto-tickers till pris-hämtaren
├─ state/                # levande tillstånd (muteras av routinen / actionen)
│  ├─ portfolj.md        #   innehav, kassa, ackumulerad avkastning, append-only historik
│  ├─ prices.json        #   kurser (skrivs av GitHub Action, läses av routinen)
│  ├─ price_history.json #   rullande kurshistorik (sparklines i dashboarden)
│  └─ analysis_queue.json #  analyskö (pending/done); issue-Action fyller, arbetaren tömmer
├─ reports/
│  ├─ weekly/            #   veckorapport-yymmdd.md (nordisk)
│  ├─ daily/             #   daglig-yymmdd.md (nordisk)
│  ├─ scout/             #   rapport-yymmdd.md (USA & krypto)
│  └─ analysis/          #   analys-TICKER-yymmdd.md (på begäran, cache)
├─ tests/
│  └─ run.mjs            #   testsvit för rena funktioner (node tests/run.mjs)
└─ .github/
   ├─ workflows/prices.yml       # schemalagd kurshämtning (nordisk + USA/krypto)
   ├─ workflows/auto_merge.yml   # auto-merge av claude/**-brancher till main
   ├─ workflows/analys_queue.yml # issue "analys: TICKER" -> analysis_queue.json (nyckellös)
   ├─ scripts/fetch-prices.mjs   # hämtar Yahoo-kurser -> state/prices.json
   └─ scripts/queue-add.mjs      # lägger ticker i analysis_queue.json
```
Filnamn på rapporter: `daglig-yymmdd.md` och `veckorapport-yymmdd.md` (yy=år, mm=månad, dd=dag).

---

## 3. Webb-dashboarden (teknik)
- Ren HTML/CSS/JS, inga byggsteg. Laddar `marked@12` och `chart.js@4` från jsdelivr (CDN), samt
  de egna modulerna i ordning: `vparse.js` → `vrender.js` → `app.js`.
- **Datakälla:** hämtar fillista via GitHub-API (`git/trees/main?recursive=1`) och råtext via
  `raw.githubusercontent.com`. Upptäcker rapporter automatiskt på filnamn → **inga ändringar
  behövs i webbappen när filer flyttas till undermappar.** Uppdateras när routinen pushar.
- **Flikbaserad** (en vy i taget): Översikt (KPI + dagens beslut + marknadsklimat), Rapporter
  (Daglig/Vecko/Scout-väljare), Nyheter & radar, USA & Krypto (scout), Analys (aktieanalys på
  begäran + cache, med färskhetsbadge), Kurser (prices.json-tabell med sparklines), Avkastning
  (handelsstatistik + Chart.js + historik + bubblare). Visar även routinens "DATAKÄLLA
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
  tickerformat-krav (bindestreck) tillagt i båda prompterna. Testsviten utökad (38 tester, gröna).

## 5b. Nuläge — KVAR / VALFRITT
- **PUSH KRÄVS (2026-07-11):** flik-omdesignen (Analys-/Kurser-flikarna m.m.) och dagens
  fixar/features ligger LOKALT men är inte pushade – GitHub main + Pages kör fortfarande den äldre
  scroll-dashboarden. Dren: dubbelklicka `push.bat`. Verifiera gärna prices-actionen efteråt
  (Actions → "Hämta kurser" → Run workflow) så USA/krypto-symbolerna kommer med i prices.json.
- ✅ **GitHub-inställningar:** verifierat klart – både `analys_queue.yml` (issue #2 → kö → analys)
  och `prices.yml` har committat till main, dvs. write-permissions + Issues fungerar.
- ✅ **Schemaläggning:** Cowork scheduled tasks skapade 2026-07-11: `vecko-agent-scout-usa-krypto`
  (dagligen 07:47) och `vecko-agent-nordisk-rotation` (mån–fre 08:40, efter prices-cronen, före
  börsöppning). OBS: de körs bara när Claude-appen är igång (annars vid nästa appstart), och
  sandlådan kan inte pusha – rapporterna skrivs lokalt och Dren publicerar med `push.bat`.
- **Commit/push sker från Drens dator** – Cowork-sandlådan kan inte pusha (saknar credentials) och
  OneDrive-monteringen blockerar git-lås. Claude skriver filer lokalt, Dren committar/pushar
  (enklast via `push.bat` i repo-roten).
- **Valfria förbättringar (ej byggda):** daglig digest-notis, jämför två tickers i Analys, samt att
  klona repot UTANFÖR OneDrive (rekommenderas skarpt – dödar git-låsen och de trunkerade läsningarna).

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
Drens lokala arbetskopia ligger i en OneDrive-mapp; se OneDrive-fällan i avsnitt 7. Eventuella
`SETUP.md` / `MIGRATION.md` är historiska (migreringen är gjord) och kan ignoreras.

---

## 9. Disclaimer
Allt systemet producerar är **automatiserat beslutsstöd, inte finansiell rådgivning.** Varje
rapport ska avslutas med den raden.
