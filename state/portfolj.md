# Portfölj – Nordisk Rotation
**Senast uppdaterad:** 2026-07-10 15:15 CEST (fredag – LÄGE B, daglig bevakning)
**Ackumulerad avkastning sedan start:** 0 % (baslinje – ingen position ännu stängd)

> **✅ DATAKÄLLAN ÅTER I FUNKTION (2026‑07‑10).** Efter fem körningar med 403‑spärr levererar nu
> GitHub‑actionen verifierade kurser: `state/prices.json` genererad 2026‑07‑10 12:53 UTC med
> `marketTime` från idag för samtliga 7 tickers (ALLEI.ST 96,50 SEK @ 12:50 UTC m.fl.). Den
> tidigare egress‑blockeringen mot kurssajter är därmed kringgången – routinen kan åter fatta
> kursbaserade beslut.
>
> **⚠️ ATT VERIFIERA – priskonflikt:** prices.json anger ALLEI.ST 96,50 SEK, men flera webbaggregat
> (Börskollen/eToro/Yahoo‑nyhetssida) anger ~85–87 SEK samma dag – en ~12 %‑avvikelse. Källan
> (`fetch-prices.mjs`/Yahoo chart API) bör stämmas av mot Avanza/Nordnet innan entrynivåer handlas.
>
> **Beslut idag:** ingen entry – portföljen kvarstår 100 % kassa. Skäl: (1) Alleima Q2‑rapport
> fredag 17/7 (binär händelse om 5 handelsdagar), (2) ovan priskonflikt, (3) entryvillkoret
> "öppning < 96" ej rent triggat (kurs 96,50 = dagens högsta; retest 90–92 uteblev, dayLow 94,85).
> Inga öppna positioner → ingen stop‑loss‑/målkursrisk att bevaka. Saab B avfördes 2026‑07‑08
> (GlobalEye‑bekräftelse, kursen gapade förbi planen). Alleima kvarstår som prioriterat pending‑entry,
> att omprövas efter Q2 17/7 och/eller efter att priskällan bekräftats. Se daglig‑260710.md.

## Aktuellt innehav
| Aktie | Yahoo-ticker | Börs | Entry-datum | Entry | Stop-loss | Målkurs | Anteckning |
|---|---|---|---|---|---|---|---|
| – | – | – | – | – | – | – | Inga öppnade positioner – se pending nedan |

### Pending veckorotation v28 (beslutad i veckorapport-260706.md – ej öppnad)
| Aktie | Yahoo-ticker | Börs | Planerad entry (villkor) | Planerad stop-loss | Planerad målkurs | R/R | Status |
|---|---|---|---|---|---|---|---|
| Alleima (BEHÅLL/ankarcase) | ALLEI.ST | Nasdaq Stockholm | ~94,5 kr (köp om öppning < 96; annars retest 90–92) | 90,5 kr | 102,5 kr | 1:2,0 | 2026‑07‑10: kurs VERIFIERAD 96,50 SEK (prices.json 12:50 UTC) – entry EJ triggad (se toppnotis: Q2 17/7 + priskonflikt + villkor ej rent triggat). Kvarstår pending, omprövas efter rapport/källverifiering. |
| ~~Saab B (ryktescase)~~ | ~~SAAB-B.ST~~ | ~~Nasdaq Stockholm~~ | ~~~560 kr (köp om öppning < 575)~~ | ~~535 kr~~ | ~~615 kr~~ | ~~1:2,2~~ | **AVFÖRD 2026‑07‑08** – GlobalEye‑ryktet bekräftat (NATO/Ankara 7/7), aktien gapade förbi 575→~685 kr; entryvillkoret triggades aldrig. Ej öppnad → ingen historikrad. |

*Nivåerna ovan är planen från veckorapport-260706.md och ska justeras proportionellt mot faktisk verifierad öppningskurs innan position öppnas. Kongsberg (KOG.OL) roterades ut till bubblarlistan (Q2-rapport denna vecka). Saab avfördes 2026‑07‑08 efter att katalysatorn löst ut och kursen sprungit förbi planen.*

## Kassa
100 % (inga verifierade fills – rotationen ej exekverad denna körning)

## Historik (append-only – rader får ALDRIG raderas eller ändras)
| Stängd | Aktie | Entry-datum | Entry | Exit | Utfall % | Skäl (mål/stopp/rotation/katalysator) |
|---|---|---|---|---|---|---|
