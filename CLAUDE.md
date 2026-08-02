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
- `prompts/veckoprompt.md` – UTGÅNGEN stub. Schemalägg den ALDRIG (skapade dubbletter).
- `prompts/START.md` – korta laddare som routinerna pekar på; prompttexten klistras aldrig in.
- `state/lessons.md` – skrivs ENDAST av miss-retron.
- `state/news_feed.json` – PRIMÄR nyhetskälla för alla tre routinerna, inte ett komplement.
- `state/decisions.json` – append-only, valideras i CI av `validate-decisions.mjs`.
- `state/portfolj.md` / `portfolj_us.md` – historiken är append-only. Radera aldrig filerna.
- `config/universe_nordic_movers.txt` – används BARA av `movers.mjs` (missdetektion), inte av pris-hämtaren.
- `assets/themes/base.css` – all struktur; hårdkoda aldrig färg/radie/typsnitt där, lägg en token.
- Actions `monitor`/`news`/`movers`/`analys_queue` är nyckellösa och LLM-fria – de kostar noll tokens.

Rapportfilnamn: `daglig-yymmdd.md`, `veckorapport-yymmdd.md` (yy=år, mm=månad, dd=dag).

## 3. Webb-dashboarden (teknik)
- Ren HTML/CSS/JS, inga byggsteg. Laddar `marked@12` och `chart.js@4` från jsdelivr (CDN), samt
  de egna modulerna i ordning: `theme.js` (i `<head>`) → `vparse.js` → `vrender.js` → `app.js`.
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
  `prompts/analysprompt.md` körs MANUELLT när kön har poster. `prompts/veckoprompt.md` är utgången
  och får ALDRIG schemaläggas (skapade dubbletter).
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
  mappnamnet på disk). Node v24 på plats. Auto-push-tasken ÄR registrerad här (se punkt 2 nedan) –
  den tidigare noteringen om att `setup_autopush.bat` återstod stämmer inte. Schemaläggningen
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
  5. **Beslut kvar till Dren:** `Anvandarguide.html` (den korta tidigare guiden i roten) är nu
     överlappad av `Anvandarmanual.pdf`. Filen är otrackad och raderas INTE utan besked.
  2. ~~Kör `setup_autopush.bat`~~ – **auto-push ÄR aktiv på den här datorn** (verifierat
     2026-07-31: den committade mitt på ett pågående arbete som "Uppdatering via Cowork …" och
     startade en `pull --rebase` som konfliktade i `state/prices.json`, `price_history.json` och
     `news_feed.json`. Konflikterna löstes med den färskare lokala versionen). **Fälla:** kör
     aldrig `fetch-prices.mjs`/`fetch-news.mjs` lokalt samtidigt som actionen skriver samma filer
     – auto-pushen fastnar då i en rebase och lämnar konfliktmarkörer i JSON:en, vilket i sin tur
     får dashboarden att visa tom Kurser-vy. Kontrollera `git status` innan du felsöker appen.
  3. Kontrollera `feeds`-fältet i `state/news_feed.json`: ett flöde som är verkligt dött visar
     nu "HTTP xxx – båda försöken" (ett enstaka fel görs om automatiskt sedan 2026-08-02).
  4. Kör om backtestet när universum eller nivåer ändras:
     `node .github/scripts/backtest.mjs nordic 5y 4` (resp. `us 5y 4`). Kräver nät. Sista
     argumentet är antalet positioner – utan det simuleras 4 à 25 %, som böckerna faktiskt
     handlas. Gridet på 2 positioner (filerna `backtest-260731-*`) är historik.
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
- **Dubbel rotation på måndag (ÅTGÄRDAT):** `veckoprompt.md` är utgången och `dagligprompt.md` är
  enda ingången (den gör LÄGE A på måndagar). Schemalägg ALDRIG en separat måndagsprompt igen –
  det skapade tidigare dubbletter (`veckorapport-yymmdd_1.md`).
- **`index.html` måste ligga i repo-roten** för att Pages ska servera den på sajtens rot.
- **Sänk inte verifieringskravet** för kurser – lösningen är pålitliga priser (prices.json), inte
  att ta bort skyddet.
- **Radera aldrig** `state/portfolj.md` (historik/ackumulerad avkastning) eller mallarna vid en
  omstrukturering.
- **Lärdomar får ALDRIG mjuka upp kursverifiering, stopp-disciplin eller riskregler.** Miss-retron
  får skriva processregler, inte sänka skyddsnät.
- **`prices.json` måste ha fältet `schemaVersion`** innan en dagsrörelse räknas ur filen. Saknas det
  pekar `previousClose` i äldre filer ~en vecka bakåt, och en veckorörelse läses som en dagsrörelse.
- **Bumpa `schemaVersion` bara när ett fälts BETYDELSE ändras** – inte vid vanliga ändringar.
- **Kör aldrig `fetch-prices.mjs`/`fetch-news.mjs` lokalt** samtidigt som GitHub-actionen skriver samma
  filer: auto-pushen fastnar i en rebase och lämnar konfliktmarkörer i JSON:en, vilket tömmer
  Kurser-vyn i dashboarden. Kontrollera `git status` innan du felsöker appen.

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
