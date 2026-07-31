# Portfölj – US-rotation (USD)
**Senast uppdaterad:** 2026-07-31 (LÄGE B daglig bevakning – 100 % kassa bibehålls, inga trades. Inga öppna positioner att bevaka; `alerts.json` active tom; inga aktiva pending-planer. Inget ersättningsköp från bubblarlistan: bankrotation (WFC/MS) saknar teknisk vändningsbekräftelse efter hökaktig Fed 29/7, INTC −9 % i pågående halvledarkorrektion, och XOM/CVX rapporterar Q2 i just detta pass (binärt event – köps ej in i). Extrem megacap-dispersion tors 30/7 (MSFT +18 % vs META −11 %; AMZN +AH efter AWS-beat vs AAPL −AH på svag guidning). Dry powder hålls; full rotation avgörs i LÄGE A måndag 2026-08-03. Se `reports/us_daily/us-daglig-260731.md`. Föregående: 2026-07-30 SÄLJ JPM @ 344,71 (+1,99 %, stopp bruten), se Historik.)
**Ackumulerad avkastning sedan start:** +0,89 % (första stängda affären: JPM +1,99 % brutto × 45 % vikt, USD)

## Aktuellt innehav
| Aktie | Yahoo-ticker | Börs | Entry-datum | Entry | Stop-loss | Målkurs | Vikt | Anteckning |
|---|---|---|---|---|---|---|---|---|
| – | – | – | – | – | – | – | – | Inga öppna positioner – 100 % kassa efter SÄLJ JPM 2026-07-30 (stopp bruten). Dry powder inför LÄGE A-rotation måndag. |

### Pending veckorotation v30 (beslutad i us-veckorapport-260720.md)
| Aktie | Yahoo-ticker | Börs | Planerad entry (villkor) | Planerad stop-loss | Planerad målkurs | R/R | Planerad vikt | Status |
|---|---|---|---|---|---|---|---|---|
| ~~Exxon Mobil~~ | ~~XOM~~ | ~~NYSE~~ | ~~Köp ENDAST vid rekyl till ≤ 142,00 USD (ref. 147,36 USD, marketTime 2026-07-17T20:03:17Z)~~ | ~~137,50 USD~~ | ~~158,00 USD~~ | ~~~1:3,6~~ | ~~55 %~~ | **AVFÖRD 2026-07-27** – katalysatorn (eskalerande oljepremie via Hormuz/Röda havet) punkterad av USA–Iran-pausen (Brent −4–7 % från >100 USD, Morgan Stanley sänkte mål 171→168); dessutom binär Q2-rapport 31/7. Ingen köp – kassan frigörs som dry powder |
| ~~JPMorgan Chase~~ | ~~JPM~~ | ~~NYSE~~ | ~~Köp ENDAST vid rekyl till ≤ 338,00 USD~~ | ~~330,50 USD~~ | ~~356,00 USD~~ | ~~1:2,4~~ | ~~45 %~~ | **TRIGGAT 2026-07-21** (dagslägsta 337,37 USD mån 20/7) → position öppnad och **avvecklad 2026-07-30 via stopp 345,00** (+1,99 %), se Historik |

*Nivåerna är planen från `us-veckorapport-260720.md` (verifierade kurser ur `state/prices.json`, marketTime 17/7 – senaste tillgängliga verifierade stängning inför den första körningen). XOM-raden justeras proportionellt mot faktisk verifierad kurs när/om positionen öppnas.*

## Kassa
100 % (dry powder – JPM avvecklat 2026-07-30 via bruten stopp; kassan hålls oallokerad genom veckans binärkluster (AAPL+AMZN efter stängning tors 30/7, PCE + XOM/CVX-rapporter fre 31/7) för deploy på renare rotationssetup, avgörs i LÄGE A måndag)

## Historik (append-only – rader får ALDRIG raderas eller ändras)
| Stängd | Aktie | Entry-datum | Entry | Exit | Utfall % | Vikt | Skäl (mål/stopp/rotation/katalysator) |
|---|---|---|---|---|---|---|---|
| – | – | – | – | – | – | – | – |
| 2026-07-30 | JPMorgan Chase (JPM) | 2026-07-21 | 338,00 USD | 344,71 USD | +1,99 % | 45 % | Stopp 345,00 bruten (verifierad reguljär stängning 344,71, dayLow 343,78, monitor SÄLJ) efter hökaktig Fed-hold 29/7 → bredmarknads-riskoff; Great Rotation-tesen försvagad |

---
*USD-denominerad bok. Separat från den nordiska rotationen (`portfolj.md`). Detta är
automatiserat beslutsstöd, inte finansiell rådgivning.*
