# Åtgärdsloopen: `state/action_items.json` + watchdog-larm

**Datum:** 2026-08-23 · **Beslutad av:** Dren · **Berör:** `prompts/miss_retro.md`,
`.github/scripts/watchdog.mjs`, ny `.github/scripts/validate-action-items.mjs`, `tests/run.mjs`,
`test.yml`, `auto_merge.yml`

---

## Problemet

L-3 ("en upptäckt datadefekt ska eskaleras, inte gås runt en andra gång") fungerar som
synlighetsregel och har slutat fungera som åtgärdsdrivare. Den är tillämpad i praktiskt taget
varje rapport – 119 av 244 rader i `state/decisions.json` bär `L-3` i `lessonIds` – men
åtgärdspunkterna staplas i stället för att stängas.

Mätt 2026-08-23 på `origin/main`:

| Rapport | ÅTERKOMMANDE-märkningar |
|---|---|
| `veckorapport-260817.md` | 7 |
| `daglig-260820.md`, `daglig-260821.md` | 6 vardera |
| `retro-260822.md` | 5 |

Den dyraste enskilda punkten: `retro-260815` Miss 5 visade att sju kandidater avvisade på
"grind 3 ej prövbar" steg **+4,19 %** mot SPY **+0,40 %**, medan de som avvisades på ett OMDÖME
föll **−4,20 %**. Alltså: omdömesspärrarna fungerar, dataspärren kostade pengar. Rotorsaken är en
regelmotsägelse – grind 3 kräver 15 stängningar, grind 2 kräver katalysator ≤ 5 handelsdagar, så
en nyupptagen ticker kan aldrig hinna bli mätbar. Defekten var då rapporterad **sju gånger**.
Ingen larmade. Den självläkte av kalendertid, inte av åtgärd: `price_history.json` bär fortfarande
`backfilledAt: 2026-08-03`.

Detta är precis den tysta felklassen watchdogen finns för: ingenting går sönder, rapporten ser
normal ut, och den enda signalen är ett ord i löptext som ingen räknar.

## Varför inte parsa rapporterna

Åtgärdspunkterna är fri prosa i minst sex rubrikvarianter:

```
## Åtgärdspunkter till Dren (L-3)
## Åtgärdspunkt 1 till Dren (L-3) – **ÅTERKOMMANDE**
### ⚠️ Åtgärdspunkt till Dren (L-3, ÅTERKOMMANDE) – prices.json …
```

Veckoräkningen står som text ("ÅTERKOMMANDE, tredje veckan"). En regex över det är samma tysta
felklass som mekanismen ska avskaffa: fyra prompter formulerar rubrikerna fritt, och en omskrivning
skulle tysta larmet utan att något blir rött. **Avvisad.**

## Lösningen

En strukturerad fil med **en enda skrivare**, samma ägarmodell som `state/lessons.md`.

### `state/action_items.json`

```json
{
  "generatedAt": "2026-08-23T10:00:00.000Z",
  "items": [
    {
      "id": "backfill-price-history",
      "title": "price_history.json backfillas inte för nyupptagna symboler",
      "file": "state/price_history.json",
      "scope": "7 kandidater, 94 serier",
      "firstSeen": "2026-08-08",
      "lastSeen": "2026-08-22",
      "weeksOpen": 3,
      "status": "open",
      "resolvedAt": null,
      "resolvedBy": null
    }
  ]
}
```

**Fältkontrakt:**

| Fält | Krav |
|---|---|
| `id` | kebab-case, `^[a-z0-9]+(-[a-z0-9]+)*$`, 3–60 tecken, unikt i filen. Stabilt över veckor – det är nyckeln som gör att en punkt kan följas och stängas. |
| `title` | icke-tom sträng, ≤ 200 tecken |
| `file` | repo-relativ sökväg eller `null` (allt är inte en fil) |
| `scope` | icke-tom sträng – kvantifierat omfång, L-3:s eget krav |
| `firstSeen` / `lastSeen` | `åååå-mm-dd`, `lastSeen >= firstSeen` |
| `weeksOpen` | heltal ≥ 1 |
| `status` | `"open"` \| `"resolved"` |
| `resolvedAt` | `åååå-mm-dd` när `status: "resolved"`, annars `null` |
| `resolvedBy` | icke-tom sträng när `status: "resolved"`, annars `null` |

**Skrivare: miss-retron, ensam.** Rotationerna och scouten fortsätter skriva åtgärdspunkter i prosa
exakt som i dag – ingen annan prompt rörs. Retron konsoliderar veckans prosa till filen:
en ny defekt får en post, en som återkommer får `lastSeen` uppdaterat och `weeksOpen + 1`, en som
åtgärdats får `status: "resolved"`.

`weeksOpen` räknas av retron, inte ur datum. Motiv: retron kan hoppas över en vecka (helg,
sandlåda utan credentials), och en beräkning ur `firstSeen` skulle då räkna upp en punkt som
ingen faktiskt observerat. Räknaren ska mäta antalet retros som SETT punkten.

**Undantag: första ifyllningen räknar bakåt.** Startade varje punkt på `weeksOpen: 1` skulle en
defekt som redan varit öppen i veckor få tre veckors NY tystnad innan tröskeln nås – och det är
just de punkterna som är mest brådskande. Backfilldefekten var dokumenterad i sju rapporter när
mekanismen byggdes; med en ren start hade den larmat först 2026-09-12 i stället för 2026-08-29.
Vid den enda körning där filen skapas sätts därför `weeksOpen` till antalet distinkta ISO-veckor
defekten är dokumenterad i `reports/`, och `firstSeen` till den tidigaste rapporten. Tre spärrar:
det sker en enda gång; varje bakåtdaterad punkt ska namnge sina källrapporter i retro-rapporten;
och går antalet inte att belägga sätts `weeksOpen: 1` – aldrig en gissning uppåt, som skulle
larma för tidigt och urholka tröskeln.

Filen märks **inte** `-merge` i `.gitattributes`: en skrivare, en gång i veckan, samma som
`lessons.md`. `decision_eval.json` och `dashboard.json` är märkta för att de har två skrivare.

### `.github/scripts/validate-action-items.mjs`

Samma mönster som `validate-scout-candidates.mjs`: exporterad ren funktion
`validateItem(item, i)` som returnerar en array felmeddelanden, plus `validateDb(db)` för
filnivåkontroller (unika `id`). Saknas filen är det **inte** ett fel – mekanismen är ny och
retron kan ha kört utan att ha något att skriva. Exit 1 vid fel.

Körs i `test.yml` och i auto-merge-grinden, som de två befintliga validatorerna. Skälet att den
hör hemma i grinden: filen skrivs av en LLM, och en LLM som skriver JSON gör tre sorters fel
varav bara syntaxfelet fångas av `JSON.parse`.

### `watchdog.mjs: checkRecurringActionItems({ itemsDb, threshold })`

Larmar på `status === "open" && weeksOpen >= threshold` (standard **3**).

Ett problem **per punkt**, med nyckel `action-item-<id>`. Det är avgörande för `issue-sync.mjs`:
nyckeln hamnar i HTML-kommentaren i brödtexten, så ett issue per defekt öppnas när den passerar
tröskeln och **stängs av sig självt** när retron sätter `resolved` och punkten faller ur
problemlistan. En samlad "5 punkter öppna"-titel hade återskapat exakt den dedupe-bugg som
issue-sync byggdes för att lösa – antalet i titeln ändras och ett andra issue öppnas.

Bakåtkompatibel: saknas filen eller `items` är watchdogen tyst, som övriga checkar.

### Vad som INTE byggs

- **Ingen dashboard-ruta.** `tests/data.mjs` kräver ≤ 30 hämtningar i den förbyggda vägen och
  ligger på 29. Taket ska sprängas av ett medvetet val, inte som sidoeffekt av den här
  mekanismen. Larmet går via issue och e-post, som watchdogens övriga fynd.
- **Ingen automatisk konsolidering ur rapport-markdown.** Se "Varför inte parsa rapporterna".
- **Ingen handskriven seedning av filen.** Retron äger den och skapar den vid första körningen
  (2026-08-29). Att fylla den för hand skulle lägga state i en fil vars hela idé är en enda
  skrivare.

## Testning

Rena funktioner, `tests/run.mjs`, ingen nätåtkomst och ingen DOM:

- `validateItem` – godkänd post; varje enskilt fältfel; `resolvedAt`/`resolvedBy` krävs vid
  `resolved` och måste vara `null` vid `open`; `lastSeen < firstSeen`.
- `validateDb` – dubbletter av `id`.
- `checkRecurringActionItems` – tyst under tröskeln; larmar på och över; ignorerar `resolved`
  oavsett `weeksOpen`; tyst vid saknad fil, `null` och tom lista; en nyckel per punkt;
  nyckelformatet är `action-item-<id>`.

## Risker

**Retron kan sluta uppdatera filen** – då fryser `weeksOpen` och larmet uteblir. Ingen kontroll
byggs för det nu: mekanismen är ny och en vakt över vakten är för tidigt. Skulle det inträffa är
signalen att `generatedAt` slutar röra sig, vilket är samma mönster `checkStale` redan använder
för fem andra filer och kan utökas med när behovet är visat.

**Tröskeln 3 veckor är satt, inte mätt.** Den motsvarar L-3:s eget ÅTERKOMMANDE-begrepp (två
tidigare rapporter) plus en veckas marginal. Justeras om den visar sig larma för tidigt.
