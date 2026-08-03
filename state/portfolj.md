# Portfölj – Nordisk Rotation
**Senast uppdaterad:** 2026-08-03 07:05 UTC (LÄGE A – veckorotation v32. Saab BEHÅLLS: senaste verifierade kurs 597,90 kr (prices.json, schemaVersion 2026-08-02-prevclose, marketTime 2026-07-31 15:29:34 UTC) ger +2,21 % sedan entry 585; varken stop 560 eller mål 635 träffad och tesen (rekordorderstock 317,7 mdr + Q2-beat + uppgraderingsvåg 600–700) är intakt → poängsätts INTE om, enligt hållregeln. TVÅ REGELSTYRDA JUSTERINGAR: (1) Saab trimmas 50 % → 35 % eftersom positionsstorleksregeln sedan 2026-07-31 sätter taket till 35 % per aktie – det är en viktjustering mot regelverket, inte en rotation; (2) kassan 50 % → 0 %, kapitalet flyttas till indexsleeven XACT-OMXS30.ST @ 486,10 kr (marketTime 2026-07-31 15:23:46 UTC) enligt sleeve-regeln att oallokerat kapital aldrig ligger på konto. NOLL nya positioner: samtliga 16 bruttokandidater föll på en namngiven spärr – 13 saknar verifierad kurs (körmiljön är 403-spärrad mot alla kurssajter), SCA-B.ST på punkt 6 (nåbart mål 5,43 % < kravet 6,0 %), BOOZT/ALLEI/NOKIA på RSI (79,1 / 83,4 / 20,9), KOG.OL på sektorkoncentration mot Saab. Tre av fyra platser står tomma och ligger i sleeven. Se veckorapport-260803.md. Föregående: LÄGE B 2026-08-01 (helg, inga beslut); LÄGE B 2026-07-31, Saab BEHÅLL; LÄGE B 2026-07-30, Saab-entry ≤ 585 triggad → KÖP)
**Ackumulerad avkastning sedan start:** +3,19 % (Alleima +6,39 % × 50 % vikt; första och hittills enda stängda positionen. Saab är öppen och ingår inte.)

## Aktuellt innehav
| Aktie | Yahoo-ticker | Börs | Entry-datum | Entry | Stop-loss | Målkurs | Vikt | Anteckning |
|---|---|---|---|---|---|---|---|---|
| Saab | SAAB-B.ST | Nasdaq Stockholm | 2026-07-30 | 585 kr | 560 kr | 635 kr | 35 % | BEHÅLL vid v32-rotationen. Senaste verifierade kurs 597,90 kr (prices.json, marketTime 2026-07-31 15:29:34 UTC) = +2,21 % sedan entry. catalystType `order`, horisont 3–6 veckor (inget tidsstopp). RSI(14) ≈ 71,2 beräknad ur price_history (15 sessioner). Vikten sänkt 50 % → 35 % vid rotationen för att möta taket 35 % per aktie – positionen i sig är oförändrad. Stop får flyttas upp till entry först vid +5 %; jaga ej gap. |
| Indexsleeve (XACT OMXS30) | XACT-OMXS30.ST | Nasdaq Stockholm | 2026-08-03 | 486,10 kr | – | – | 65 % | Kapitalparkering för de tre tomma platserna, inte ett case. Kurs ur prices.json, marketTime 2026-07-31 15:23:46 UTC. Har medvetet ingen stop och ingen målkurs – säljs aldrig på nedgång, justeras bara när aktievikterna ändras. Loggas i decisions.json med catalystType `index` och filtreras bort ur urvalsstatistiken. |

### Pending veckorotation v32 (beslutad i veckorapport-260803.md)
| Aktie | Yahoo-ticker | Börs | Planerad entry (villkor) | Planerad stop-loss | Planerad målkurs | R/R | Planerad vikt | Status |
|---|---|---|---|---|---|---|---|---|
| – | – | – | Inga pending-planer denna vecka | – | – | – | – | Villkorade bubblar-planer kräver ett entry-villkor mot VERIFIERAD kurs (punkt 4b). Veckans tre nya bubblare (ASSA-B.ST, BETS-B.ST, SUBC.OL) saknar kurs i prices.json och kan därför inte få en pending-rad; de är lagda i config/watchlist.txt och prissätts från nästa hämtning. |

*~~v31-planen Saab entry ≤ 585 kr / stop 560 / mål 635 – TRIGGAD 2026-07-30 (dayLow 583,3), position öppnad, planen därmed avslutad.~~ ~~v30-planen entry ≤ 572 kr / stop 540 / mål 621 – aldrig triggad; Saab gapade ifrån hela v30, re-prisades v31.~~ ~~Moreld (MORLD.OL) rekyl-ben v29 (≤ 19,20 NOK) – aldrig triggad; utgår, kvar som bubblare.~~*

## Kassa
0 % – oallokerat kapital ligger i indexsleeven (XACT-OMXS30.ST, 65 %), aldrig på konto. Migrerat från 50 % kassa vid v32-rotationen 2026-08-03 enligt sleeve-regeln: att stå utanför marknaden är en garanterad kostnad, inte en neutral position. Nästa allokeringsöversyn i LÄGE A (måndag 2026-08-10, v33-rotation).

## Historik (append-only – rader får ALDRIG raderas eller ändras)
| Stängd | Aktie | Entry-datum | Entry | Exit | Utfall % | Vikt | Skäl (mål/stopp/rotation/katalysator) |
|---|---|---|---|---|---|---|---|
| 2026-07-17 | Alleima (ALLEI.ST) | 2026-07-14 | 97,05 kr | 103,25 kr | +6,39 % | 50 % | Målträff – Q2-rapport 17/7 slog förväntningarna (intäkter +3 % till 4 896 MSEK, Kanthal rekordmarginal 19,6 %, order recovery); aktien +7 % till intradag 105,90, stängning 104,50. Målkurs 103,25 nådd/överskriden (monitor-alert 17/7 15:13, 103,40). Såld enligt plan vid v30-rotation. |
