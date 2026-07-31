# Miss-retro: veckans post-mortem
**Vecka:** [v NN] | **Datum:** [ÅÅÅÅ-MM-DD] | **Period granskad:** [ÅÅÅÅ-MM-DD – ÅÅÅÅ-MM-DD]
**Sammanfattning:** [2–3 meningar: hur många kandidater granskades, hur många bedömdes som
PROCESSFEL respektive ACCEPTABELT UTFALL, utfallet av sälj-facit (antal exits, varav
LÄMNADE PÅ BORDET), och hur många nya lärdomar som skrevs (0–2).]

## Datagrund
[Vilka filer och källor som lästs: veckorapporter, dagliga rapporter, scout-rapporter,
watchlists, portföljer, price_history.json. Ange `generatedAt`/marketTime för kursdata och
notera uttryckligen om kurserna är intradag eller stängning. Lista de nyhetssök som gjorts.]

## Veckans kursfacit (verifierad data)
[Tabell över spårade tickers vars veckorörelse överstiger tröskeln (~10 % Norden / ~8 % US
large cap), samt de systemet ägde. Bas = föregående fredags stängning. Varje rad med källa +
tidsstämpel. Rörelser som inte kan verifieras med siffror markeras
"EJ VERIFIERAD – nyhetsbaserad uppskattning".]

| Ticker | Bas (datum) | Nu (datum/tid) | Vecka % | Källa | Ägdes/bevakades? |
|---|---|---|---|---|---|

## Missar

### Miss 1: [BOLAG] ([TICKER] / [BÖRS])
**Rörelse:** [x % under perioden, med verifierad kurs: bas → nu, källa + tidsstämpel. Eller
"EJ VERIFIERAD – nyhetsbaserad uppskattning (källa, datum)".]
**Katalysator:** [Den identifierbara utlösaren med datum + källa. Saknas identifierbar
katalysator ⇒ diskvalificera kandidaten som brus.]
**Traceback:** [Var i tratten föll den bort? Sökning i veckans rapporter/bubblare/watchlists –
redovisa vad sökningen gav, inklusive "noll träffar".]
**Kategori:** [A – UTANFÖR UNIVERSUM / B – SEDD MEN FÖRKASTAD / C – SEDD MEN RANKAD UNDER /
D – SIGNAL FILTRERAD] – exakt en.
**Motivering till kategorin:** [Vid B: citera förkastningsskälet ordagrant. Vid C: vilka case
den förlorade mot. Vid D: vilken regel som stoppade den.]
**Facit-filter:** [**PROCESSFEL** eller **ACCEPTABELT UTFALL**. Vid PROCESSFEL: ange vilken
daterad signal som fanns TILLGÄNGLIG FÖRE rörelsen och vilken generaliserbar regel som hade
fångat den utan att släppa igenom brus. Vid ACCEPTABELT: ange varför – oprognostiserbar,
utanför strategins avsikt, eller skulle kräva överanpassning.]

### Miss 2: […]
### Miss 3: […]

## Sälj-facit (exits under perioden)
[En rad per position stängd under perioden (båda böckerna). Efterkurs = verifierad kurs ~5
handelsdagar efter exit (källa + tidsstämpel; ange färre dagar om så är fallet). Bedömning:
BRA EXIT / NEUTRAL / LÄMNADE PÅ BORDET. Skriv "Inga exits under perioden." om historiken
saknar stängda positioner i fönstret.]

| Aktie (bok) | Exit-datum | Exitkurs | Efterkurs (källa, tid) | Efterutfall % | Skäl vid sälj | Bedömning |
|---|---|---|---|---|---|---|

[Per exit bedömd LÄMNADE PÅ BORDET: samma facit-filter som för missar – **PROCESSFEL** (daterad
signal före säljbeslutet + generaliserbar regel som behållit positionen utan höjd risk) eller
**ACCEPTABELT UTFALL** (t.ex. rotationsregeln är design; stop-loss som träffades är kostnaden
för skyddet – aldrig lärdomar som mjukar upp stoppdisciplin). Motivera i 1–3 meningar.]

## Idéflödets facit (bubblare & scout-case)
[Utvärdering av idéer som flaggades men inte köptes: förra veckans bubblare (båda böckerna)
och scout-case från 5–10 handelsdagar sedan. Kurs vid flaggning → verifierad kurs nu.
Skriv "Inga utvärderingsbara idéer denna vecka." om underlag saknas.]

| Idé (källa) | Flaggad (datum, kurs) | Nu (kurs, källa/tid) | Utfall % | Jämfört med valda case |
|---|---|---|---|---|

**Träffbild:** [snittutfall idéer vs valda case samma period; andel idéer över/under ±5 %]
**Svit:** [t.ex. "Idéflödet slog de valda casen 1 vecka i rad (3 krävs för lärdomskandidat)" – en enskild vecka är brus]

## Diskvalificerade kandidater
[Rörelser som granskats men INTE är missar: systemet ägde dem, hade dem som pending/bubblare
med aktiv plan, eller lyfte dem som scout-case – samt rörelser utan identifierbar katalysator.
Ange skäl per rad. Strukturella observationer får noteras här utan att bli lärdomar.]

## Nya lärdomar (max 2, endast ur PROCESSFEL)
[Skriv "Inga nya lärdomar denna vecka." om inget kvalificerar – det är ett fullgott utfall.
Per lärdom: ID, regel (generaliserbar, testbar), vilka routiner den gäller (Nordisk / US /
Scout / kombination), och vilken miss den härleds ur.]

- **[L-n]** *(gäller: [routiner])* – [Regeln, formulerad så att den går att kontrollera i
  efterhand. Aldrig ticker-specifik. Får ALDRIG sänka kravet på verifierad kurs, ändra
  mallarna eller ta bort risk-regler.]
  **Härledd ur:** [Miss n]

## Träffbild: tillämpades tidigare lärdomar?
[Per aktiv lärdom i `state/lessons.md`: nämndes den i veckans rapporter (ja/nej) och gav den
effekt (ja/nej/för tidigt)? En lärdom som ignorerats eller varit utan effekt i 4 veckor är
kandidat för arkivering – notera det uttryckligen. Saknas aktiva lärdomar, redovisa i stället
de "Lärdom"-fält som veckorapporterna själva bär.]

## Ändringar i state/lessons.md
[Vilka rader som lagts till i "Aktiva lärdomar" och vilka som flyttats till "Arkiv", med skäl.
Skriv "Inga ändringar." om filen lämnas orörd.]

---
*Detta är automatiserat beslutsstöd, inte finansiell rådgivning.*
