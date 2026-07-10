# Vecko_agent — projektkontext (läs detta först)

Detta dokument finns för att en ny Cowork-/Claude-session snabbt ska förstå projektet, nuläget
och vad som är kvar att göra. Ägare: **Dren** (kastratidrinas@gmail.com).

---

## 1. Vad projektet är
Ett automatiserat system för nordisk swing trade-rotation, i tre delar:

1. **Routinen** – en schemalagd Claude-körning som varje handelsdag (LÄGE B) bevakar innehav och
   varje måndag (LÄGE A) gör en full veckorotation. Den läser preferenser/tillstånd/mallar,
   skriver en markdown-rapport + uppdaterar portföljen och committar direkt till `main`.
   Strategin: alltid exakt 2 nordiska aktier viktade 50/50, roteras varje vecka; dagligt beslut
   per aktie = **KÖP / SÄLJ / BEHÅLL** (eller AVVAKTA om kurs ej kan verifieras).
2. **Webb-dashboarden** – en sida som hämtar rapporterna live från repot och visar dem snyggt
   (dagsöversikt, fulla rapporter, nyheter/radar, avkastning). Mörkt "trading-terminal"-tema.
3. **Pris-hämtaren** – en GitHub Action som hämtar aktiekurser och skriver `state/prices.json`,
   eftersom routinens egen körmiljö är nätspärrad mot kurssajter (se avsnitt 6).

- **Repo:** https://github.com/DrinasKastrati/Vecko_agent  (publikt, branch `main`)
- **Dashboard (GitHub Pages):** https://drinaskastrati.github.io/Vecko_agent/

---

## 2. Målstruktur för repot (efter omorganisation)
```
Vecko_agent/
├─ index.html            # webbappen (MÅSTE ligga i roten för GitHub Pages)
├─ .nojekyll
├─ .gitignore            # OS-/editor-skräp (viktigt med OneDrive)
├─ assets/               # webbappens moduler
│  ├─ vparse.js          #   window.VParse  – all parsning (rena funktioner)
│  ├─ vrender.js         #   window.VRender – bygger HTML-strängar
│  └─ app.js             #   class Dashboard – hämtar data, renderar, event
├─ prompts/              # instruktionen till routinen
│  └─ dagligprompt.md    #   enda ingången (veckoprompt.md är utgången/stub)
├─ templates/            # strikta mallar (routinen får ALDRIG ändra dem)
│  ├─ vecko_rapport.md
│  ├─ daglig_mall.md
│  └─ case_rapport.md
├─ config/               # preferenser + bevakning
│  ├─ fokus.md
│  └─ watchlist.txt      # extra tickers till pris-hämtaren
├─ state/                # levande tillstånd (muteras av routinen / actionen)
│  ├─ portfolj.md        #   innehav, kassa, ackumulerad avkastning, append-only historik
│  └─ prices.json        #   kurser (skrivs av GitHub Action, läses av routinen)
├─ reports/
│  ├─ weekly/            #   veckorapport-yymmdd.md
│  └─ daily/             #   daglig-yymmdd.md
└─ .github/
   ├─ workflows/prices.yml     # schemalagd kurshämtning
   └─ scripts/fetch-prices.mjs # hämtar Yahoo-kurser -> state/prices.json
```
Filnamn på rapporter: `daglig-yymmdd.md` och `veckorapport-yymmdd.md` (yy=år, mm=månad, dd=dag).

---

## 3. Webb-dashboarden (teknik)
- Ren HTML/CSS/JS, inga byggsteg. Laddar `marked@12` och `chart.js@4` från jsdelivr (CDN), samt
  de egna modulerna i ordning: `vparse.js` → `vrender.js` → `app.js`.
- **Datakälla:** hämtar fillista via GitHub-API (`git/trees/main?recursive=1`) och råtext via
  `raw.githubusercontent.com`. Upptäcker rapporter automatiskt på filnamn → **inga ändringar
  behövs i webbappen när filer flyttas till undermappar.** Uppdateras när routinen pushar.
- Sektioner: Översikt (KPI + dagens beslut), Rapporter (Daglig/Vecko-väljare), Nyheter & radar,
  Avkastning (Chart.js + historik + bubblare). Visar även routinens "DATAKÄLLA BLOCKERAD"-notis
  som en gul varningsbanner (det är korrekt beteende – appen speglar bara routinens status).
- Verifierad i sandbox med jsdom (parsning + rendering + modul-laddning), inte bara antaget.

---

## 4. Routinen — vad prompten gör
- **`prompts/dagligprompt.md`** – ENDA ingången, körs varje handelsdag (mån–fre). Måndag = LÄGE A
  (full rotation, skriver `reports/weekly/…`), övriga dagar = LÄGE B (bevakning, skriver
  `reports/daily/…`). Läser `config/fokus.md`, `state/portfolj.md`, rätt mall i `templates/`, och
  **kurser i första hand ur `state/prices.json`**. Uppdaterar `state/portfolj.md` (historik är
  append-only). Committar till main.
- **`prompts/veckoprompt.md`** är UTGÅNGEN (stub) – den separata måndagsrotationen skapade dubbletter
  och är borttagen ur flödet. Schemalägg endast `dagligprompt.md`.
- Hårt krav: varje kurs ska ha **verifierad källa + tidsstämpel**; annars "KURS EJ VERIFIERAD" och
  inget kursbaserat beslut. Detta krav ska INTE sänkas.

---

## 5. Nuläge — vad som är gjort
- ✅ Dashboarden byggd, uppdelad i moduler och verifierad.
- ✅ Promptarna omskrivna för den nya mappstrukturen **och** för att läsa `state/prices.json`.
- ✅ Migreringsguide skriven (`SETUP.md` + `MIGRATION.md` med färdiga `git mv`-kommandon).
- ✅ Pris-hämtaren (GitHub Action + `fetch-prices.mjs`) byggd och testad (ticker-extraktion,
  JSON-struktur; live-hämtningen körs på GitHubs runner, inte i sandlådan).

## 5b. Nuläge — KVAR ATT GÖRA (nästa steg, i ordning)
1. **Klona repot till en mapp UTANFÖR OneDrive** (OneDrive som synkar `.git` ger konflikter).
   `git clone https://github.com/DrinasKastrati/Vecko_agent.git`
2. **Kör mappmigreringen** enligt `SETUP.md` Del 3 (`git mv` av mallar/config/state/reports).
   Radera INGET – särskilt inte `portfolj.md` (levande tillstånd/historik) eller `daglig_mall.md`.
3. **Lägg in webbappen** (`index.html`, `.nojekyll`, `assets/`) och **pris-fixen**
   (`.github/workflows/prices.yml`, `.github/scripts/fetch-prices.mjs`, `config/watchlist.txt`).
4. **Ersätt routinens två promptar** med de uppdaterade `dagligprompt.md` / `veckoprompt.md`.
   (Flytt av filer + promptbyte måste ske i SAMMA veva, annars kraschar nästa körning.)
5. **Aktivera GitHub Pages:** Settings → Pages → Deploy from a branch → `main` / `/ (root)`.
6. **Aktivera pris-Actionen:** Settings → Actions → General → **Read and write permissions**;
   kör workflowet manuellt en gång; justera `cron` i `prices.yml` till 15–30 min FÖRE routinen (UTC).
7. `git commit` + `git push` (migrering + prompts + webapp + action).

---

## 6. Viktigaste problemet just nu (och fixen)
Routinen rapporterar återkommande **"DATAKÄLLA BLOCKERAD"**: Yahoo, Avanza, Nordnet, Nasdaq m.fl.
svarar 403 (egress-proxy) i routinens sandlåda. Bara websökning funkar → odaterade kurser →
routinen avstår (korrekt) från beslut och står på 100 % kassa.

**Fix (byggd, ej ännu aktiverad i repot):** en GitHub Action (`prices.yml` + `fetch-prices.mjs`)
kör på GitHubs runner (fri nätåtkomst), hämtar kurser från Yahoos chart-API och skriver en
tidsstämplad `state/prices.json`. Routinen läser den filen i stället för att hämta live – då finns
verifierad tidsstämpel och besluten kan fattas igen. `fetch-prices.mjs` samlar tickers från
`state/portfolj.md` + senaste veckorapportens case/bubblare (t.ex. `KOG.OL`, `MAERSK-B.CO`) +
`config/watchlist.txt`. Nya måndagskandidater läggs i `config/watchlist.txt`.

---

## 7. Fällor att känna till
- **OneDrive + git:** klona repot utanför OneDrive-mappen (annars sync-konflikter i `.git`).
- **Dubbel rotation på måndag (ÅTGÄRDAT):** `veckoprompt.md` är utgången och `dagligprompt.md` är
  enda ingången (den gör LÄGE A på måndagar). Schemalägg ALDRIG en separat måndagsprompt igen –
  det skapade tidigare dubbletter (`veckorapport-yymmdd_1.md`).
- **`index.html` måste ligga i repo-roten** för att Pages ska servera den på sajtens rot.
- **Sänk inte verifieringskravet** för kurser – lösningen är pålitliga priser (prices.json), inte
  att ta bort skyddet.
- **Radera aldrig** `state/portfolj.md` (historik/ackumulerad avkastning) eller mallarna vid en
  omstrukturering.

---

## 8. Var filerna ligger just nu (innan de lagts i repot)
Dren har en lokal arbetsmapp (`vecko_bot`) med: `index.html`, `.nojekyll`, `assets/`, `prompts/`,
`SETUP.md`, `MIGRATION.md`, samt originalfilerna (`fokus.md`, `vecko_rapport.md`, `case_rapport.md`,
`veckoprompt.md`). De uppdaterade fix-filerna (`fetch-prices.mjs`, `prices.yml`, `watchlist.txt`,
och de senaste `dagligprompt.md` / `veckoprompt.md` med prices.json-stöd) levererades separat och
ska in i repot enligt strukturen i avsnitt 2.

---

## 9. Disclaimer
Allt systemet producerar är **automatiserat beslutsstöd, inte finansiell rådgivning.** Varje
rapport ska avslutas med den raden.
