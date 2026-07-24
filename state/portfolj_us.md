# Portfölj – US-rotation (USD)
**Senast uppdaterad:** 2026-07-24 (LÄGE B – BEHÅLL JPM, tesen intakt och stärkt av Deutsche Banks uppgradering (mål 375 USD), relativ styrka mot torsdagens breda tech-selloff; XOM-pending kvarstår ej triggad, gap till villkoret (≤ 142,00 USD) har vidgats till ~10,5 % drivet av vidare oljestyrka (Brent >100 USD/fat, Röda havet-eskalering). Se `reports/us_daily/us-daglig-260724.md`.)
**Ackumulerad avkastning sedan start:** 0 % (baslinje – ingen position har ännu stängts)

## Aktuellt innehav
| Aktie | Yahoo-ticker | Börs | Entry-datum | Entry | Stop-loss | Målkurs | Vikt | Anteckning |
|---|---|---|---|---|---|---|---|---|
| JPMorgan Chase | JPM | NYSE | 2026-07-21 | 338,00 USD | 330,50 USD | 356,00 USD | 45 % | Rekyl-villkor (≤ 338,00 USD) triggat via intradagslägsta 337,37 USD mån 2026-07-20 (prices.json/Yahoo chart API, marketTime 2026-07-20T20:00:02Z); stängde 338,87 USD samma dag |

### Pending veckorotation v30 (beslutad i us-veckorapport-260720.md)
| Aktie | Yahoo-ticker | Börs | Planerad entry (villkor) | Planerad stop-loss | Planerad målkurs | R/R | Planerad vikt | Status |
|---|---|---|---|---|---|---|---|---|
| Exxon Mobil | XOM | NYSE | Köp ENDAST vid rekyl till ≤ 142,00 USD (ref. 147,36 USD, prices.json/Yahoo chart API, marketTime 2026-07-17T20:03:17Z) | 137,50 USD | 158,00 USD | ~1:3,6 | 55 % | Villkorat rekyl-case – jagas EJ; EJ TRIGGAD (stängning 156,89 USD tors 23/7, ~10,5 % över villkoret; se `us-daglig-260724.md`) |
| ~~JPMorgan Chase~~ | ~~JPM~~ | ~~NYSE~~ | ~~Köp ENDAST vid rekyl till ≤ 338,00 USD~~ | ~~330,50 USD~~ | ~~356,00 USD~~ | ~~1:2,4~~ | ~~45 %~~ | **TRIGGAT 2026-07-21** (dagslägsta 337,37 USD mån 20/7) → position öppnad, se "Aktuellt innehav" ovan |

*Nivåerna är planen från `us-veckorapport-260720.md` (verifierade kurser ur `state/prices.json`, marketTime 17/7 – senaste tillgängliga verifierade stängning inför den första körningen). XOM-raden justeras proportionellt mot faktisk verifierad kurs när/om positionen öppnas.*

## Kassa
55 % (öronmärkt XOM-pending; kvarstår i kassa om ingen rekyl till ≤ 142,00 USD sker)

## Historik (append-only – rader får ALDRIG raderas eller ändras)
| Stängd | Aktie | Entry-datum | Entry | Exit | Utfall % | Vikt | Skäl (mål/stopp/rotation/katalysator) |
|---|---|---|---|---|---|---|---|
| – | – | – | – | – | – | – | – |

---
*USD-denominerad bok. Separat från den nordiska rotationen (`portfolj.md`). Detta är
automatiserat beslutsstöd, inte finansiell rådgivning.*
