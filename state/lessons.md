# Lärdomar – processregler destillerade ur veckans missar

Denna fil skrivs **endast** av miss-retro-routinen (`prompts/miss_retro.md`). Övriga routiner
(nordisk rotation, US-rotation, scout) **läser** den vid varje körning och ska nämna vilka
aktiva lärdomar som tillämpats.

**Regler för filen:**
- Max **10 aktiva** lärdomar. Överskrids taket, eller är en lärdom motbevisad / inaktuell /
  duplicerad – flytta den till **Arkiv** med skäl.
- **Arkivet är APPEND-ONLY.** Rader får ALDRIG raderas eller skrivas om.
- En lärdom ska vara GENERALISERBAR (aldrig ticker-specifik), TESTBAR (går att se i efterhand
  om den tillämpats) och FÖRENLIG MED SKYDDEN: den får ALDRIG sänka kravet på verifierad kurs,
  aldrig instruera ändring av mallarna och aldrig ta bort risk-regler (stop-loss-disciplin,
  likviditetsgolv, källkrav).
- ID:n är löpande (L-1, L-2, …) och återanvänds ALDRIG efter arkivering.

---

## Aktiva lärdomar

| ID | Datum | Källa | Gäller | Regel |
|---|---|---|---|---|
| L-1 | 2026-07-31 | retro-260731 | Nordisk | **Namnge rapportkalendern i veckans radar.** Den nordiska veckorapportens "Veckans radar" ska lista de bolag i Nordens Large/Mid Cap som rapporterar kvartalssiffror under den kommande veckan, med datum och bolagsnamn – inte enbart en generisk formulering om att rapportsäsongen pågår. Syftet är bevakning, inte köp: rapportdagen är ett binärt event som fortsatt INTE får köpas in i, men ett namngivet event gör att en kraftig rapportreaktion registreras samma vecka och kan utvärderas som rekyl-setup i stället för att passera osedd. Regeln är uppfylld när radarn innehåller minst en namngiven rapport med datum, eller uttryckligen konstaterar att inga sådana rapporter infaller. |
| L-2 | 2026-07-31 | retro-260731 | Nordisk + US | **En bubblare ska ha verifierad kurs samma vecka den flaggas.** Varje ticker som förs upp på veckorapportens bubblarlista ska i samma körning finnas i motsvarande watchlist-fil (`config/watchlist.txt` för nordiska, `config/watchlist_us.txt` för amerikanska), så att `state/prices.json` innehåller en verifierad kurs för den från och med nästa hämtning. Skälet är verifiering och mätbarhet, inte fler köp: utan kurs kan intradag-monitorn inte larma på bubblaren, en villkorad bubblar-plan i Pending kan inte läggas (den kräver verifierat entry-villkor) och retron kan inte utvärdera idén i efterhand. Regeln höjer inget risktagande och sänker inget krav. Watchlist-hygienen gäller oförändrat (riktmärke ≤ 25 symboler; tickers som varken är innehav, pending, bubblare eller nämnda de senaste 14 handelsdagarna rensas). Uppfylld när varje bubblare i den senaste veckorapporten går att slå upp i `state/prices.json`, eller när rapporten uttryckligen anger varför en bubblare inte kan prissättas. |

---

## Arkiv (APPEND-ONLY – rader raderas aldrig)

| ID | Datum aktiv | Datum arkiverad | Källa | Regel (förkortad) | Skäl till arkivering |
|---|---|---|---|---|---|
| – | – | – | – | – | – |
