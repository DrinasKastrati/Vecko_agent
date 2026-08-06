# Nollställning inför skarp start med riktiga pengar

**Datum:** 2026-08-06
**Ägare:** Dren
**Status:** Godkänd design, ej implementerad
**Skarp start:** måndag 2026-08-10 (v33-rotationen, LÄGE A)

---

## 1. Bakgrund och syfte

Systemet har handlats som pappersbok sedan 2026-07-14. Tre affärer är stängda
(Alleima +6,39 %, Saab +8,55 % nordiskt; JPM +1,99 % i US-boken) och böckerna bär
en ackumulerad avkastning på +6,28 % respektive +0,89 %.

Från och med v33-rotationen investeras riktiga pengar. Avkastningssiffrorna i
dashboarden ska då spegla den skarpa perioden och ingenting annat — en redovisad
avkastning som blandar papper och riktiga pengar går inte att tolka, och det är
den siffran hela Avkastning-vyn vilar på.

**Syftet med nollställningen är alltså redovisningsmässigt, inte tekniskt.**
Ingenting är trasigt. Det som ändras är vilken period siffrorna gäller.

## 2. Beslut som styr designen

Fyra val gjorda av Dren 2026-08-06:

1. **Kapitalmodellen ändras INTE.** Böckerna fortsätter räkna i vikt-%
   (upp till 4 platser à ~25 %, tak 35 % per aktie). Inga absoluta belopp,
   inget antal aktier, inget kontantsaldo i kronor. Dren översätter själv
   vikt-% till belopp hos mäklaren.
2. **Startläget är 100 % kassa i båda böckerna.** Inga innehav följer med,
   inte heller indexsleevarna. Måndagens LÄGE A avgör allt som köps,
   sleeven inkluderad.
3. **Bara affärsstatistiken nollställs. Beslutsloggen löper vidare.**
   `state/decisions.json` och `state/decision_eval.json` rörs inte.
4. **Pappersperioden arkiveras till `state/archive/`** och syns inte i
   dashboarden.

### 2.1 Varför beslutsloggen INTE nollställs

`decisions.json` och `decision_eval.json` mäter en annan sak än portföljfilerna.
Portföljen mäter **hur det gick för pengarna**; beslutsloggen mäter **om urvalet
slår index** — varje rad, inklusive de avvisade (AVVAKTA), följs upp mot
efterföljande kurs 5/20 handelsdagar framåt och mot bokens index.

Den mätningen är oberoende av om pengarna var riktiga. Ett KÖP som slog ^OMX med
5,68 pp gjorde det oavsett vem som ägde aktien.

Att nollställa den skulle dessutom kosta månader: `decision_eval.mjs` skriver
`insufficient` under `minN` = 8 mätpunkter, och miss-retrons viktkalibrering
kräver ≥ 15 SÄLJ-rader. De 31 befintliga raderna är det enda underlag i systemet
som växer i meningsfull takt (~10–15 rader/vecka). Att kasta dem precis när
riktiga pengar gör mätningen som mest värd vore fel prioritering.

## 3. Omfattning

### 3.1 Filer som ändras

| Fil | Åtgärd |
|---|---|
| `state/portfolj.md` | Kopieras till arkivet, ersätts av tom bok |
| `state/portfolj_us.md` | Kopieras till arkivet, ersätts av tom bok |
| `state/allocation.json` | Återställs till 50/50 med ny `rationale` |
| `state/archive/portfolj-paper-260810.md` | **Ny** — oförändrad kopia |
| `state/archive/portfolj_us-paper-260810.md` | **Ny** — oförändrad kopia |
| `state/live_start.json` | **Ny** — markerar snittet |
| `.github/scripts/reset-books.mjs` | **Ny** — utför nollställningen |
| `tests/run.mjs` | Nya tester för tom bok |

### 3.2 Filer som uttryckligen INTE rörs

- `state/decisions.json`, `state/decision_eval.json` — se 2.1
- `reports/**` — rapporterna är narrativ historik, inte statistik. De
  beskriver vad som beslutades och varför, och den kedjan får inte brytas.
  Dashboardens Översikt och Rapporter-vyer läser dem oförändrat.
- `state/price_history.json`, `news_feed.json`, `scout_candidates.json`,
  `movers.json`, `earnings_calendar.json`, `lessons.md`
- `prompts/dagligprompt.md`, `prompts/us_dagligprompt.md` — **noll
  promptändringar.** Måndagens LÄGE A läser en tom bok och gör sitt
  ordinarie arbete. Nollställningen är ett filtillstånd, inte en regel.
- `templates/` — parsningskontraktet är oförändrat
- `config/kostnader.json` — kostnadsmodellen gäller redan riktiga pengar

## 4. Den tomma bokens form

Formen är styrd av parsningskontraktet, inte av smak. `vparse.js:parsePortfolio`
(rad 199) hittar sektioner på rubriktext, så samtliga rubriker står kvar
oförändrade: `## Aktuellt innehav`, `### Pending veckorotation`, `## Kassa`,
`## Historik`.

Regler för den tomma boken:

- **Innehav och Historik:** tabellhuvudet står kvar, följt av EN rad där
  kolumnen `Aktie` är en tankstrecks-platshållare. Det är samma konvention som
  Pending-sektionen redan använder i dag, och `computeTradeStats`
  (`vparse.js:799`) filtrerar bort den på just det mönstret. En helt tom tabell
  vore ett nytt fall för parsern; en platshållarrad är ett redan hanterat fall.
- **Ackumulerad avkastning sedan start:** `+0,00 %`, med en not om att
  pappersperioden 2026-07-14–2026-08-06 ligger i `state/archive/`.
  Fältnamnet måste vara ordagrant — `vparse.js:202` läser det på exakt sträng.
- **Pending-sektionen töms.** US-boken bär i dag två pending-block
  (v30 och v32) och nordiska boken ett. Samtliga ersätts av ETT block med
  rubriken `### Pending veckorotation v33` och en platshållarrad. De gamla
  planerna är knutna till pappersperiodens kapital och får inte triggas
  i skarp drift.
- **Kassa:** `100 %`, med not om att fördelningen avgörs av v33-rotationen.
- **Senast uppdaterad:** stämplas av skriptet med körtidpunkten och texten
  "Nollställd inför skarp start".
- **Historik-rubrikens varningstext** (`append-only – rader får ALDRIG raderas
  eller ändras`) står kvar. Regeln gäller den nya boken från och med nu.

## 5. Skriptet `.github/scripts/reset-books.mjs`

### 5.1 Beteende

- **Torrkörning som standard.** Utan `--apply` skriver skriptet ingenting utan
  redovisar exakt vilka filer som skulle skapas, ändras och arkiveras.
  Motivet: operationen är irreversibel i arbetskopian och rör bokförda data.
- **`--apply`** utför ändringarna.
- **Idempotent:** finns `state/live_start.json` redan avbryter skriptet med
  exit 1 och ett meddelande om att böckerna redan är nollställda.
  **`--force`** krävs för att köra om.
- **Arkivnamnet härleds ur startdatum**, inte ur körtidpunkten, så att en
  omkörning inte skapar ett andra arkiv med annat namn.
- **`allocation.json`** skrivs om till `nordic: 0.50`, `us: 0.50`, `week: "v 33"`
  med en `rationale` som säger att fördelningen är standardläget vid skarp
  start och prövas av allokeringsroutinen måndag 15:30. Fältet `updatedAt`
  sätts till körtidpunkten.
- Skriptet **committar inte och pushar inte.** Dren granskar diffen och kör
  `push.bat`.

### 5.2 `state/live_start.json`

```json
{
  "startDate": "2026-08-10",
  "note": "Skarp start med riktiga pengar. Pappersperioden 2026-07-14–2026-08-06 arkiverad.",
  "resetAt": "<ISO-tidsstämpel>",
  "archived": {
    "nordic": "state/archive/portfolj-paper-260810.md",
    "us": "state/archive/portfolj_us-paper-260810.md"
  },
  "paperStats": { "nordic": "+6,28 %", "us": "+0,89 %", "closedTrades": 3 }
}
```

`paperStats` finns för att pappersperiodens facit ska gå att läsa utan att
öppna arkivfilerna.

### 5.3 Varför snittet INTE markeras i `decisions.json`

Ursprungstanken var en markörrad i beslutsloggen. Det går inte:
`validate-decisions.mjs:16` begränsar `action` till
`["KÖP","SÄLJ","BEHÅLL","AVVAKTA"]`, så en markörrad skulle kräva ett påhittat
`action` — eller att enumet vidgas för en rad som inte är ett beslut. Därav
egen fil.

Av samma skäl loggas **inga SÄLJ-rader** för AMZN eller indexsleevarna när
böckerna töms. De affärerna gjordes aldrig. Ett fiktivt utfall i beslutsloggen
skulle förgifta exakt den urvalsmätning som beslut 3 valde att bevara.

## 6. Konsekvenser att vara medveten om

1. **AMZN försvinner ur US-boken.** Positionen står i dag på +2,15 %. Vill
   Dren äga den med riktiga pengar måste v33-rotationen välja den på nytt mot
   de fem grindarna. Ingen gräddfil.
2. **Dashboardens Avkastning-vy visar noll affärer** tills första skarpa
   affären stängs. `computeTradeStats` returnerar tomt, riskmått och
   månadsutfall likaså. Det är korrekt beteende, inte ett fel.
3. **Rutan "Tillför urvalet något?" påverkas inte** — den läser
   `decision_eval.json`, som löper vidare.
4. **Regimfiltret måste stå PÅ** för att måndagens rotation ska kunna öppna
   något. Nordiskt är det PÅ (OMXS30 3 326,93 > MA200 3 014,02). Står det AV
   köps ingenting, och böckerna blir liggande i kassa tills det slår om —
   vilket är regelverkets avsedda beteende, men värt att veta i förväg.
5. **Sleeve-regeln** ("oallokerat kapital ligger aldrig på konto") gör i
   praktiken att LÄGE A köper sleeven på måndag. Beslut 2 tar inte bort den
   regeln — det ger bara rotationen mandatet i stället för skriptet.

## 7. Verifiering

Innan push ska följande köras och vara gröna:

| Kommando | Krav |
|---|---|
| `node tests/run.mjs` | 611 + de nya testerna, 0 failed |
| `node .github/scripts/validate-decisions.mjs` | exit 0 |
| `node .github/scripts/build-dashboard.mjs` | bygger mot tom bok utan fel |
| `node .github/scripts/watchdog.mjs` | inga NYA larm jämfört med före körningen |

### 7.1 Nya tester

- `parsePortfolio` mot en tom bok: `holdings`, `history` och `pending` blir
  tomma efter platshållarfiltrering; `accum` läses som 0.
- `computeTradeStats([])` och mot en bok med enbart platshållarrad: returnerar
  ett resultat som markerar "för få affärer" utan att kasta.
- `computeRiskStats` / `buildMonthlyStats` mot tom historik: kastar inte.
- `reset-books.mjs` torrkörning: skriver inga filer.
- `reset-books.mjs` idempotens: avbryter när `live_start.json` finns.

Watchdog-jämförelsen i tabellen är avsiktligt formulerad som "inga NYA larm":
de två befintliga larmen om prissatta bubblare utan avgörande är väntade och
försvinner först när v33-rotationen tagit ställning.

## 8. Genomförande

1. Skriptet + testerna byggs och verifieras (avsnitt 7)
2. Dren kör `node .github/scripts/reset-books.mjs` (torrkörning) och läser utfallet
3. Dren kör om med `--apply`
4. Dren granskar `git diff` och kör `push.bat`

Allt detta ska vara klart **före måndag 2026-08-10 08:40 CEST**, då den
nordiska rotationen startar. Sker det efteråt kör v33-rotationen på den gamla
boken och nollställningen skjuts en vecka.
