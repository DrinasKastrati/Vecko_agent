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
| L-3 | 2026-08-01 | retro-260801 | Nordisk + US + Scout | **En upptäckt datadefekt ska eskaleras, inte gås runt en andra gång.** När en körning konstaterar att ett fält i en tillståndsfil (`state/prices.json`, `state/news_feed.json`, `state/alerts.json`, `state/price_history.json`) är felaktigt, inaktuellt eller internt motsägelsefullt, ska rapporten (a) namnge fältet och filen, (b) ange vilken verifierad ersättningskälla som använts i stället, och (c) föra upp defekten under en tydligt märkt **åtgärdspunkt till Dren** med kvantifierat omfång (hur många tickers/poster som berörs). Punkt (c) är kärnan: att bara beskriva en kringgång i löptext gör felet osynligt för den som kan rätta det. Har samma defekt beskrivits i **två eller fler** tidigare rapporter utan att vara åtgärdad ska den dessutom märkas **ÅTERKOMMANDE**. Regeln sänker inget krav – den förstärker kursverifieringen genom att göra det uttryckligt när verifieringsunderlaget självt är trasigt – och ändrar varken mallar, risk-regler eller källkrav. Uppfylld när varje rapport som beskriver ett datafel också bär en namngiven åtgärdspunkt med omfång; bruten när ett fel avfärdas som "känt sedan tidigare" utan sådan punkt. |
| L-4 | 2026-08-08 | retro-260808 | Nordisk + US + Scout | **En kandidat som avvisas på ett TILLFÄLLIGT datavillkor ska prövas om när villkoret upphört, inte begravas.** När en bok avvisar en post i `state/scout_candidates.json` på en spärr vars orsak är **tillfällig och datamässig** – i praktiken "kurs ej verifierbar ännu", dvs. att den enda verifierade kursen ligger FÖRE katalysatorn – ska avvisningen behandlas som **vilande, inte slutlig**. Konkret: så länge posten ligger inom sin `expiresAt` ska nästa körning för ansvarig bok (a) kontrollera om en kvalificerad post-katalysatorkurs numera finns, och om den gör det (b) ta ett nytt, fullständigt avgörande mot samtliga fem grindar och (c) logga det i `state/decisions.json` som en ny rad. Regeln gäller ENDAST spärrar vars orsak är data som hunnit ikapp; en kandidat som avvisats av **omdömesskäl** – obekräftad katalysator, teknik, nåbarhet, R/R, sektorkoncentration, ingen ledig kapacitet – omfattas ALDRIG, och den bedömningen görs om först vid nästa veckorotation. Regeln sänker inget krav: den förutsätter tvärtom att kursen är verifierad enligt oförändrade regler, och det är just avsaknaden av verifierad kurs som gör omprövningen nödvändig. Den ändrar varken mallar, risk-regler, källkrav eller stoppdisciplin, och den tvingar fram inget köp – ett förnyat "avvisad" med ny namngiven spärr uppfyller regeln lika väl. Uppfylld när varje kandidat som avvisats på "kurs ej verifierbar" och som därefter fått en kvalificerad post-katalysatorkurs bär ett andra avgörande med senare `decidedAt`, eller när rapporten uttryckligen anger varför den inte längre är aktuell; bruten när en sådan post ligger orörd tills den passerar `expiresAt`. Bakgrund: `260805-ANET` och `260805-AMD` avvisades 2026-08-05 på "kurs ej verifierbar" och låg 2026-08-08 fortfarande `rejected` med `price: null` trots kvalificerade post-katalysatorkurser i `prices.json` och giltig `expiresAt` – både `refresh-candidate-prices.mjs` och `watchdog.mjs:checkCandidatePrice` är avgränsade till `status === "new"`. |

---

## Arkiv (APPEND-ONLY – rader raderas aldrig)

| ID | Datum aktiv | Datum arkiverad | Källa | Regel (förkortad) | Skäl till arkivering |
|---|---|---|---|---|---|
| – | – | – | – | – | – |
