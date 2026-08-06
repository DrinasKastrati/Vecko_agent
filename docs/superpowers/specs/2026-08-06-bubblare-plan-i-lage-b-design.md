# Villkorad bubblar-plan i LÄGE B när kursen var det enda som saknades

**Datum:** 2026-08-06 · **Ägare:** Dren · **Status:** godkänd design, ej byggd

Låter en bubblare som veckorotationen bedömde som god nog för bubblarlistan — men som INTE
kunde få en villkorad plan därför att `state/prices.json` saknade kursen — få den planen
under veckan så snart kursen finns. Rättar ett datafel, aldrig ett omdöme.

---

## 1. Problemet, mätt

Veckorotationen 2026-08-03 skrev fem nordiska bubblare och noll villkorade planer.
Rapportens egen motivering:

> **Villkorade bubblar-planer:** Inga. … De tre nya bubblarna saknar verifierad kurs och kan
> därför inte få en pending-rad.

De tre — ASSA-B.ST, BETS-B.ST, SUBC.OL — fick verifierade kurser 2026-08-04/05. Men punkt 4b
ligger i LÄGE A, så ingen plan kan läggas förrän v33-rotationen måndag 2026-08-10.
`state/portfolj.md` säger det rakt ut: *"Nya planer läggs inte i LÄGE B."*

**Fyra handelsdagar där en färdigbedömd idé ligger död av ett datafel.**

US-boken drabbades inte samma vecka — dess fem bubblare hade alla kurs på måndagen, och två
fick planer (MSFT ≤ 445,00, JPM ≤ 340,00). Det är tur, inte konstruktion: samma sak händer i
US-boken så snart ett namn tillkommer utan kurs.

### Vad detta INTE handlar om

Kapitalet står inte stilla. Sleeven är 100 % `XACT-OMXS30.ST` och boken tar OMXS30:s
avkastning på de fyra tomma platserna. Frågan är index kontra eget aktieplock, och den frågan
är **ännu obesvarad**: `state/decision_eval.json` 2026-08-05 har 18 beslut, varav 3 mogna på
5 dagars horisont, och varje fält är märkt `insufficient: true` (behöver 5 till).

Det enda som ÄR mätt talar emot mer aktieplock: backtestet visar att skelettet inte tillför
avkastning över indexsleeven, och att bredda universumet gör det monotont sämre.
Katalysatorurvalet är däremot omätt — och de 15 omogna besluten håller på att mäta det.

**Därför är den här ändringens värde i första hand mätningstakt, inte avkastning.** En
villkorad plan flyttar inget kapital (entryt ligger under marknaden) men den producerar ett
loggat beslut, och beslut är den knappa resursen just nu.

---

## 2. Designen

### 2.1 Regeln i LÄGE B

En bubblare ur SENASTE veckorapporten får en villkorad plan om och endast om ALLA håller:

1. **Kursen var skälet.** Veckorapporten angav uttryckligen saknad verifierad kurs som skälet
   att bubblaren inte fick en pending-rad. En bubblare som rankades under av OMDÖMESSKÄL
   (saknad egen katalysator, sektorkoncentration, ej beräkningsbar teknik) omfattas ALDRIG —
   den bedömningen görs om vid rotationen, inte mitt i veckan.
2. `state/prices.json` har nu en verifierad kurs med tidsstämpel för tickern.
3. Katalysatorn är fortfarande inom sina 5 handelsdagar och obruten.
4. Bubblaren klarar **full poängsättning mot de fem grindarna**. Den kunde inte poängsättas på
   måndagen, eftersom kursen är det poängsättningen behöver — RSI, EMA-struktur, nåbart mål
   och kostnadströskel förutsätter alla en kursserie.
5. Regimfiltret är PÅ (index över MA200 ur `state/price_history.json`).
6. Boken har ledig plats (< 4 innehav) och taket på **två** villkorade planer per bok spräcks inte.

**Högst EN sådan plan per körning.** Samma begränsning som köpväg (d) för scout-kandidater.

Varje avgörande loggas i `state/decisions.json`: `AVVAKTA` med den NAMNGIVNA spärren när den
faller, och en rad när planen läggs. Det är hela mätpoängen.

### 2.2 Vad som INTE ändras

Fyra positioner · vikterna · de fem grindarna · kursverifieringskravet · taket på två planer
per bok · femdagarsavföringen av en plan som inte triggat · universumets bredd.

Ingen ny fil, inget nytt tillstånd. Mekaniken finns redan i punkt 4b; det som saknas är att
LÄGE B får använda den i det här ENA fallet.

### 2.3 Gäller båda böckerna

`prompts/dagligprompt.md` och `prompts/us_dagligprompt.md`. Prompterna är parallella by design
och drift mellan dem är en dokumenterad felkälla i det här repot (analys_queue-grinden 2026-08-04).

---

## 3. Watchdog-kontroll

Larm när en bubblare som veckorapporten märkte "kurs ej verifierad" nu HAR en verifierad kurs,
men ingen körning tagit ställning till den sedan veckorapporten skrevs.

Tyst felsort: inget går sönder, rapporten ser normal ut, idén tystnar bara. Exakt samma
mönster som `checkCandidatePrice` fångar för scout-kandidater.

### 3.1 Att läsa bubblarsektionen är den bräckliga delen

Mätt 2026-08-06 mot båda böckernas 260803-rapporter:

- Sektionen börjar på `## Bubblare` och slutar vid nästa `## `.
- **Den MÅSTE klippas vid `**Förra veckans bubblare`**. Utan det klippet plockas STRUKNA
  bubblare upp — i veckorapport-260803 gav naiv extraktion åtta tickers, varav HNSA.ST,
  BOOZT.ST och SCA-B.ST alla var strukna. Watchdogen hade larmat på idéer rotationen
  medvetet dödat.
- Bubblarna ligger som numrerade rader (`1.` … `5.`) med namnet i fetstil.
- **De två böckerna skriver tickern olika:**
  - nordiskt: `**ASSA ABLOY (ASSA-B.ST)**` — tickern i parentes, med börssuffix
  - amerikanskt: `**MSFT**` — naken symbol
  `extractTickers` (som kräver `.ST`/`.OL`/`.CO`/`.HE`) hittar därför NOLL i US-rapporten.
  Extraktorn måste hantera båda formerna.

Eftersom parsningen är bräcklig ska kontrollen **fail-silent**: hittar den ingen sektion,
inga numrerade rader eller inga tickers returnerar den inga problem. En watchdog som kraschar
på en formulering är värre än ingen watchdog.

### 3.2 Villkoret

För varje bubblare i senaste veckorapportens numrerade lista:

- tickern har en verifierad kurs i `state/prices.json` (`price != null`, inget `error`), OCH
- ingen rad i `state/decisions.json` nämner tickern med ett datum EFTER veckorapportens datum

⇒ larm, med tickern och veckorapportens datum namngivna.

Bakåtkompatibel: saknas någon indata är kontrollen tyst.

---

## 4. Övervägt och valt bort

**Att låta bubblare gå via `state/scout_candidates.json`.** Elegantare på ytan — hela kedjan
byggd 2026-08-05 (`collectCandidateTickers`, `refresh-candidate-prices.mjs`,
`checkCandidatePrice`) hade återanvänts utan en rad ny kod. Men punkt 2d kräver att varje
kandidat med `status: "new"` får ett avgörande VARJE körning, och grind (b) avvisar
`price: null`. En bubblare utan kurs hade därmed avvisats permanent på sin första körning —
värre än dagens fyra dagars väntan. Att mjuka upp den invarianten är uteslutet: CLAUDE.md
märker den "får inte luckras upp", och den finns för att göra Palantir-tystnaden omöjlig.

**Att låta ALLA bubblare med kurs bli planer i LÄGE B.** Avvisat av Dren 2026-08-06. Det hade
låtit LÄGE B göra om måndagens rangordning med färre ögon på helheten — KOG.OL och SF.ST
rankades under av omdömesskäl, inte kursskäl.

**Att knyta regeln till att en plats tömts (efter SÄLJ).** Hade inte hjälpt den vecka som
utlöste frågan: Saab såldes först 2026-08-05, medan bubblarna legat döda sedan måndag.

---

## 5. Utanför scope

- Nordisk scout (dagligt kandidatinflöde för nordiska boken). Större bygge, och fel ordning:
  mät om urvalet tillför något innan flödet breddas.
- Fler positioner, större vikter, lösare grindar.
- Den kända kapplöpningen i punkt 2d (scout lämnar `price: null`, grind (b) avvisar) — loggad
  2026-08-05, orörd här.
