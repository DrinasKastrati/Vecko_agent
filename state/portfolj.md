# Portfölj – Nordisk Rotation
**Senast uppdaterad:** 2026-07-14 08:50 UTC (LÄGE B – KÖP Alleima exekverad @ 97,05 kr på verifierad intradagskurs; Moreld kvarstår pending, se daglig-260714.md)
**Ackumulerad avkastning sedan start:** 0 % (baslinje – ingen position har ännu stängts)

## Aktuellt innehav
| Aktie | Yahoo-ticker | Börs | Entry-datum | Entry | Stop-loss | Målkurs | Anteckning |
|---|---|---|---|---|---|---|---|
| Alleima | ALLEI.ST | Nasdaq Stockholm | 2026-07-14 | 97,05 kr (prices.json/Yahoo chart API, 2026-07-14T07:45:16Z) | 94,05 kr | 103,25 kr | Vikt 50 %. Primärcase v29; stop/mål proportionellt justerade från plan (97,30/94,30/103,50). Binär Q2-risk fre 17/7 ~11:30 CEST – stop får flyttas UPP, aldrig ned |

### Pending veckorotation v29 (beslutad i veckorapport-260713.md)
| Aktie | Yahoo-ticker | Börs | Planerad entry (villkor) | Planerad stop-loss | Planerad målkurs | R/R | Status |
|---|---|---|---|---|---|---|---|
| Moreld | MORLD.OL | Oslo Børs | Köp ENDAST vid rekyl till ≤ 19,20 NOK (ref. 20,00 NOK, prices.json 14/7 07:20 UTC) | 18,55 NOK | 20,90 NOK | ~1:2,6 | Villkorat rekyl-case – jagas EJ; ingen rekyl = kassa |

*Nivåerna är planen från veckorapport-260713.md (verifierade kurser ur `state/prices.json`, marketTime 13/7). Justeras proportionellt mot faktisk verifierad öppningskurs innan position öppnas. Försvarsnamnen Saab (SAAB-B.ST, −11,75 % idag) och Kongsberg (KOG.OL, −13,8 % idag) uteslöts p.g.a. veckans fredsdrivna försvarsras (fallande knivar) och ligger på bubblarlistan. Föregående pending-plan v29 från veckorapport-260710.md (Moreld ≤17,80 / Alleima ≤97,00) triggades aldrig och är ersatt av nivåerna ovan.*

**Status 2026-07-14 (LÄGE B):** Morgonens körningar kunde inte verifiera färsk kurs (lokal prices.json = måndagens stängning). Efter git pull ~10:30 CEST fanns intradagsfeed (generatedAt 07:48 UTC) → Alleima-villkoret (≤ 97,80) UPPFYLLT och KÖP exekverad @ 97,05 kr (flyttad till Aktuellt innehav ovan). Moreld-villkoret (≤ 19,20) EJ uppfyllt (20,00 NOK, 07:20 UTC) – kvarstår AKTIVT. Se `reports/daily/daglig-260714.md`.

## Kassa
50 % (reserverad för Moreld-benet; blir kvar i kassa om ingen rekyl ≤ 19,20 NOK sker under veckan)

## Historik (append-only – rader får ALDRIG raderas eller ändras)
| Stängd | Aktie | Entry-datum | Entry | Exit | Utfall % | Skäl (mål/stopp/rotation/katalysator) |
|---|---|---|---|---|---|---|
