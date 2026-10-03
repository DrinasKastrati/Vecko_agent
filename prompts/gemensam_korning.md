# Gemensamma körregler – läs före rutinens egen prompt

Gäller rotationerna, scouten, miss-retron, allokeringen och analyskön i
`DrinasKastrati/Vecko_agent`. Vid motsägelse om körning, datum, watchlist eller publicering gäller dessa regler; respektive
prompt styr analys, tillåtna filer och riskkrav. Mallarnas rubriker ändras aldrig.

## Före arbete
- Verifiera repo, remote och aktuell branch. Uppdatera arbetskopian med `git pull`
  INNAN några filer ändras. Gör inte en ny pull per ticker eller mitt i osparat arbete.
  Finns opublicerat arbete: bevara det och kontrollera vad som redan gjorts innan en
  ny körning startas. Läs `CLAUDE.md` och den aktuella prompten från samma version.
- Använd `Europe/Stockholm` för schemat, handelsdag, ISO-vecka och rapportdatum,
  även när körmiljön använder UTC. ISO-tidsstämplar i JSON anges i UTC. Kl. 15:00
  Stockholm följer både sommar- och vintertid; verifiera US-sessionen separat.
- Kan miljön bara läsa GitHub ska den inte påstå sig ha uppdaterat state. Lämna
  rapporten och hela innehållet för varje ändrad state-/config-fil som sparunderlag,
  med status **EJ PUBLICERAD** och de exakta sökvägarna.

## Omkörningar och saknad veckorotation
- Läs befintlig rapport, portfölj, beslutslogg och kandidater innan du skriver.
  Kör inte samma affär två gånger. Historiska beslut och portföljhistorik är
  append-only; en faktiskt ny bedömning blir en ny rad med skäl. Ett befintligt
  kandidat-ID får inte dupliceras eller återställas från avgjort till `new`.
- För respektive bok: kontrollera om innevarande ISO-vecka har en publicerad
  veckorapport OCH `mode: "A"`-rader för samma datum/bok på `main`, samt en
  portfölj som stämmer med besluten. Om allt finns används LÄGE B, även vid en
  omkörning på måndag. En stängd marknad ger endast en kort daglig rapport.
- Saknas veckans LÄGE A helt används LÄGE A vid nästa öppna handelsdags körning,
  även tisdag–fredag. Använd dagens datum, aktuella verifierade data och veckomallen;
  skapa inga bakdaterade affärer eller rapporter. Skriv varför körningen tas igen.
- Finns bara delar av veckorotationen: kontrollera lokal commit, eventuell
  `claude/**`-branch och `auto_merge.yml`. Slutför publiceringen eller återställ
  saknade artefakter från verifierat underlag innan du gör fler affärer. Gissa
  inte gamla priser för att fylla en lucka. Enbart LÄGE B-rader bevisar inte LÄGE A.

## Riskkrav vid varje entry
- Samtliga filter i respektive rotationsprompts LÄGE A gäller även LÄGE B,
  scout-/analyskandidater och pending-fills: universum, verifierad kurs, likviditet,
  teknik, katalysator, regim, kapacitet, kostnadströskel, nåbarhet och R/R.
  Saknad MA200 eller kurs ≤ MA200 blockerar nya aktiepositioner.
- En kvalificerad för-/efterbörskurs får användas för bedömning, men ett nytt köp
  på den blir en villkorad plan mot REGULJÄR session. Indexsleeven är
  kapitalparkering och omfattas inte av aktiecasens stop-/tidsstoppsregler.

## Watchlist och validering
- Rensning får aldrig ta bort aktiva innehav, pending-planer, aktuella bubblare,
  ännu giltiga kandidater eller obligatoriska index/sleeves. Behåll även tickers
  vars beslut ännu behöver kurser till utvärderingens längsta fönster (20
  handelsdagar). Riktmärket 25 symboler får inte bryta dessa krav. Övrig rensning
  utgår från 14 HANDELSDAGAR, inte kalenderdagar eller enbart scoutens rapporter.
- Spara beslutsloggen från körningens basversion utanför repot innan den ändras.
  Kör `node .github/scripts/validate-decisions.mjs --base <basfil>` efter ändringen.
  Utan `--base` verifieras schema men INTE append-only. Kör även berörda
  kandidat-/åtgärdsvaliderare och `node .github/scripts/validate-state.mjs`.

## Publicering och kvitto i slutsvaret
- Publiceringsmålet är **main**. Committa rapporten och alla tillhörande state-/
  config-ändringar tillsammans. Skapa inte en separat branch/PR för en rutin.
  Om molnmiljön redan tilldelat en `claude/**`-branch får den användas som
  transport via befintlig `auto_merge.yml`; dess push är inte i sig publicering
  på main. Kontrollera jobbets utfall och läs därefter main.
- Säg **PUBLICERAD** först efter att du läst tillbaka remote main och verifierat
  de förväntade filerna och innehållet. För rotationer kontrolleras rapportdatum,
  portfölj och nya beslutsrader med rätt `book`/`mode`. Sluttexten ska ange repo,
  pushad commit-SHA, kontrollerad main-SHA, sökvägar samt datum/läge och antal
  tillagda beslutsrader. Kvitto ges i slutsvaret, inte som nya mallsektioner.
- Vid push-/mergefel eller när återläsning inte går: ange **EJ PUBLICERAD** eller
  **VÄNTAR PÅ MAIN**, bevara arbetet och ange felet, eventuell commit/branch och
  nästa kontroll. Lokala filer, en lyckad branch-push eller statusen "Slutförd"
  räcker inte. Undvik upprepade blinda pushförsök; lokal publicering kan göras
  med `push.bat`, följd av samma kontroll på main.
