# Portfölj – US-rotation (USD)
**Senast uppdaterad:** 2026-07-29 (LÄGE B daglig bevakning – BEHÅLL JPM @ 357,31 USD, +5,71 % sedan entry (prices.json/Yahoo, marketTime 2026-07-28T20:00:02Z, tis stängning; after-hours 28/7 ~355,93 USD, pre-market ~357,01 USD, Investing.com). Rotationstesen förstärkt: JPM +3,50 % tis samtidigt som Nasdaq −3,72 %. Kursen inom plan – varken stop 345,00 eller mål 366,00 korsad intradag/pre-/after-hours. Stop hålls medvetet oförändrad på 345,00 (drar ej snävare in i FOMC ons 29/7 kl 14:00 ET, håll-konsensus ~62 %). Inga aktiva intradag-signaler (alerts.json). Kassa 55 % oförändrad. Se `reports/us_daily/us-daglig-260729.md`.)
**Ackumulerad avkastning sedan start:** 0 % (baslinje – ingen position har ännu stängts)

## Aktuellt innehav
| Aktie | Yahoo-ticker | Börs | Entry-datum | Entry | Stop-loss | Målkurs | Vikt | Anteckning |
|---|---|---|---|---|---|---|---|---|
| JPMorgan Chase | JPM | NYSE | 2026-07-21 | 338,00 USD | 345,00 USD | 366,00 USD | 45 % | Rekyl-villkor (≤ 338,00 USD) triggat via intradagslägsta 337,37 USD mån 2026-07-20. Stop höjd 2026-07-27: 330,50 → 345,00 (+5 %-regeln, låser ~+2,1 %). Mål höjt 2026-07-27: 356,00 → 366,00 (Great Rotation in i finans + DB mål 375). Fre-stängning 353,21 USD (prices.json/Yahoo chart API, marketTime 2026-07-24T20:00:02Z), pre-market 27/7 ~350,60 USD (Investing.com) |

### Pending veckorotation v30 (beslutad i us-veckorapport-260720.md)
| Aktie | Yahoo-ticker | Börs | Planerad entry (villkor) | Planerad stop-loss | Planerad målkurs | R/R | Planerad vikt | Status |
|---|---|---|---|---|---|---|---|---|
| ~~Exxon Mobil~~ | ~~XOM~~ | ~~NYSE~~ | ~~Köp ENDAST vid rekyl till ≤ 142,00 USD (ref. 147,36 USD, marketTime 2026-07-17T20:03:17Z)~~ | ~~137,50 USD~~ | ~~158,00 USD~~ | ~~~1:3,6~~ | ~~55 %~~ | **AVFÖRD 2026-07-27** – katalysatorn (eskalerande oljepremie via Hormuz/Röda havet) punkterad av USA–Iran-pausen (Brent −4–7 % från >100 USD, Morgan Stanley sänkte mål 171→168); dessutom binär Q2-rapport 31/7. Ingen köp – kassan frigörs som dry powder |
| ~~JPMorgan Chase~~ | ~~JPM~~ | ~~NYSE~~ | ~~Köp ENDAST vid rekyl till ≤ 338,00 USD~~ | ~~330,50 USD~~ | ~~356,00 USD~~ | ~~1:2,4~~ | ~~45 %~~ | **TRIGGAT 2026-07-21** (dagslägsta 337,37 USD mån 20/7) → position öppnad, se "Aktuellt innehav" ovan |

*Nivåerna är planen från `us-veckorapport-260720.md` (verifierade kurser ur `state/prices.json`, marketTime 17/7 – senaste tillgängliga verifierade stängning inför den första körningen). XOM-raden justeras proportionellt mot faktisk verifierad kurs när/om positionen öppnas.*

## Kassa
55 % (dry powder – XOM-pending avförd 2026-07-27; kassan hålls oallokerad genom veckans binära kluster (FOMC ons + fyra megacap-rapporter ons–tors) för deploy på renare rotationssetup därefter)

## Historik (append-only – rader får ALDRIG raderas eller ändras)
| Stängd | Aktie | Entry-datum | Entry | Exit | Utfall % | Vikt | Skäl (mål/stopp/rotation/katalysator) |
|---|---|---|---|---|---|---|---|
| – | – | – | – | – | – | – | – |

---
*USD-denominerad bok. Separat från den nordiska rotationen (`portfolj.md`). Detta är
automatiserat beslutsstöd, inte finansiell rådgivning.*
