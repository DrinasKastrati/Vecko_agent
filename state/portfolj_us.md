# Portfölj – US-rotation (USD)
**Senast uppdaterad:** 2026-07-20 06:00 UTC (LÄGE A – första veckorotationen v30 beslutad, se `reports/us_weekly/us-veckorapport-260720.md`; två villkorade pending-köp, inget triggat ännu)
**Ackumulerad avkastning sedan start:** 0 % (baslinje – ingen position har ännu stängts)

## Aktuellt innehav
| Aktie | Yahoo-ticker | Börs | Entry-datum | Entry | Stop-loss | Målkurs | Vikt | Anteckning |
|---|---|---|---|---|---|---|---|---|
| – | – | – | – | – | – | – | – | – |

### Pending veckorotation v30 (beslutad i us-veckorapport-260720.md)
| Aktie | Yahoo-ticker | Börs | Planerad entry (villkor) | Planerad stop-loss | Planerad målkurs | R/R | Planerad vikt | Status |
|---|---|---|---|---|---|---|---|---|
| Exxon Mobil | XOM | NYSE | Köp ENDAST vid rekyl till ≤ 142,00 USD (ref. 147,36 USD, prices.json/Yahoo chart API, marketTime 2026-07-17T20:03:17Z) | 137,50 USD | 158,00 USD | ~1:3,6 | 55 % | Villkorat rekyl-case – jagas EJ; ingen rekyl = kassa |
| JPMorgan Chase | JPM | NYSE | Köp ENDAST vid rekyl till ≤ 338,00 USD (ref. 341,10 USD, prices.json/Yahoo chart API, marketTime 2026-07-17T20:00:02Z) | 330,50 USD | 356,00 USD | ~1:2,4 | 45 % | Villkorat rekyl-case – jagas EJ; ingen rekyl = kassa |

*Nivåerna är planen från `us-veckorapport-260720.md` (verifierade kurser ur `state/prices.json`, marketTime 17/7 – senaste tillgängliga verifierade stängning inför den första körningen; ingen färsk måndags-premarket kunde verifieras via sökning för exakt pris/tidpunkt). Justeras proportionellt mot faktisk verifierad kurs innan resp. position öppnas. Detta är bokens FÖRSTA veckorotation – ingen tidigare pending-plan att ersätta.*

## Kassa
100 % (reserverad för de två benen ovan – 55 % öronmärkt XOM, 45 % öronmärkt JPM; förblir kvar i kassa för respektive ben om ingen rekyl till angiven nivå sker under veckan)

## Historik (append-only – rader får ALDRIG raderas eller ändras)
| Stängd | Aktie | Entry-datum | Entry | Exit | Utfall % | Vikt | Skäl (mål/stopp/rotation/katalysator) |
|---|---|---|---|---|---|---|---|
| – | – | – | – | – | – | – | – |

---
*USD-denominerad bok. Separat från den nordiska rotationen (`portfolj.md`). Detta är
automatiserat beslutsstöd, inte finansiell rådgivning.*
