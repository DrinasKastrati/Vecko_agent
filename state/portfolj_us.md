# Portfölj – US-rotation (USD)
**Senast uppdaterad:** 2026-08-07 15:50 CEST (LÄGE B daglig bevakning – **inga positionsändringar; boken är nollställd inför den skarpa starten och LÄGE B öppnar ingen position dessförinnan**. Noll innehav ⇒ innehavsslingan har noll iterationer; noll pending-planer ⇒ inget villkor att pröva. **Två scout-kandidater avgjorda, ingen promotad:** PAYC och U avvisade på spärr (e) "ingen ledig kapacitet" – kapitalet står på 100 % kassa men är RESERVERAT för v33-rotationen 2026-08-10, inte ledigt. Båda passerade (a)–(d) med bekräftad rapportkatalysator och verifierad REGULJÄR post-katalysatorkurs (PAYC 215,97 USD efter Q2-beat 5/8 AMC + höjd FY-guide, +23,55 % på sessionen; U 40,81 USD efter Q2-beat 6/8 med EPS +0,28 mot väntad förlust, +15,06 %). Båda går in i v33:s bruttolista via scout-inflödet. **Ny datapunkt till Dren (L-3):** `price_history.json` backfillas inte för nytillkomna symboler – PAYC och U har 1 punkt vardera, så grind 3 (RSI ≤ 75) är inte prövbar ur repots data för någon kandidat scouten flaggat den senaste veckan (6 av 58 symboler berörda). Regeln om villkorad plan för prissatt bubblare prövades och gav ingen plan (faller på villkor 6 och villkor 1); inga nya bubblarrader loggades eftersom gårdagens rader redan tystar watchdogen och dubbletter hade dubbelräknats i `decision_eval.mjs`. Regimfiltret PÅ: S&P 500 7 709,96 > MA200 7 049,76. Monitorn frisk (`alerts.json` `checkedAt` 2026-08-07 11:44 UTC, tom `active`-lista); tom `watched` är väntat tills v33. Julis NFP kom −23 000 mot väntade +83 000 – marknaden läste det duvaktigt, boken har noll exponering. Watchdogen: "Allt friskt". Se `reports/us_daily/us-daglig-260807.md`. Föregående: 2026-08-06 15:35 CEST (LÄGE B daglig bevakning – **inga positionsändringar; boken är nollställd inför den skarpa starten och LÄGE B öppnar ingen position dessförinnan**. Noll innehav ⇒ innehavsslingan har noll iterationer; noll pending-planer ⇒ inget villkor att pröva. **Två scout-kandidater avgjorda, ingen promotad:** NVDA och GOOGL avvisade på spärr (e) "ingen ledig kapacitet" – kapitalet står på 100 % kassa men är RESERVERAT för v33-rotationen 2026-08-10, inte ledigt. NVDA passerade (a)–(d) med bekräftad katalysator (Musk 5/8: SpaceX bygger hela sin AI-infrastruktur exklusivt på NVIDIA Vera Rubin, projekt "Starmind") och verifierad reguljär stängning 219,22 USD; caset går in i v33:s bruttolista via scout-inflödet och ska poängsättas på nytt mot de fem grindarna då. GOOGL hade dessutom fallit på grind 2 – händelsen 5/8 är bekräftad men NEGATIV (AI-ledningsflykt, −4,03 %). Den nya LÄGE B-regeln om villkorad plan för prissatt bubblare prövades och gav ingen plan (faller på både villkor 6 och villkor 1). Regimfiltret PÅ: S&P 500 7 723,55 > MA200 7 044,99. Monitorn frisk (`alerts.json` `checkedAt` 2026-08-06 09:39 UTC, tom `active`-lista); dess `watched` blir tom för US-boken tills v33 lagt nya positioner, vilket är väntat. Se `reports/us_daily/us-daglig-260806.md`. Föregående: 2026-08-06T13:12:03Z – NOLLSTÄLLD inför skarp start med riktiga pengar 2026-08-10. Boken är tom: noll innehav, noll pending-planer, 100 % kassa och tom historik. Pappersperioden ligger oförändrad i `state/archive/portfolj_us-paper-260810.md` och dess facit i `state/live_start.json`. Kapitalmodellen är OFÖRÄNDRAD – boken räknar fortsatt i vikt-%, inte i belopp. Vad som köps avgörs helt av v33-rotationen (LÄGE A), indexsleeven inkluderad; inga positioner följde med över snittet, så en tidigare innehavd aktie måste väljas på nytt mot de fem grindarna. `state/decisions.json` och `state/decision_eval.json` nollställdes INTE – de mäter om urvalet slår index, vilket är oberoende av om pengarna var riktiga.)
**Ackumulerad avkastning sedan start:** +0,00 % (noll stängda affärer – skarp start 2026-08-10. Pappersperioden 2026-07-14–2026-08-06 slutade på +0,89 % på 1 stängd(a) affär(er) och räknas INTE in här; den ligger i `state/archive/portfolj_us-paper-260810.md`.)

## Aktuellt innehav
| Aktie | Yahoo-ticker | Börs | Entry-datum | Entry | Stop-loss | Målkurs | Vikt | Anteckning |
|---|---|---|---|---|---|---|---|---|
| – | – | – | – | – | – | – | – | – |

### Pending veckorotation v33 (ingen plan lagd – v33-rotationen 2026-08-10 avgör)
| Aktie | Yahoo-ticker | Börs | Planerad entry (villkor) | Planerad stop-loss | Planerad målkurs | R/R | Planerad vikt | Status |
|---|---|---|---|---|---|---|---|---|
| – | – | – | – | – | – | – | – | – |

*Pappersperiodens pending-planer följde INTE med över snittet: de var prissatta mot ett annat kapital och får inte trigga i skarp drift. De finns kvar i arkivfilen.*

## Kassa
100 % – hela kapitalet är oallokerat vid den skarpa starten. Fördelningen avgörs av v33-rotationen 2026-08-10 (LÄGE A), som också beslutar om indexsleeven enligt sleeve-regeln att oallokerat kapital aldrig ligger kvar på konto.

## Historik (append-only – rader får ALDRIG raderas eller ändras)
| Stängd | Aktie | Entry-datum | Entry | Exit | Utfall % | Vikt | Skäl (mål/stopp/rotation/katalysator) |
|---|---|---|---|---|---|---|---|
| – | – | – | – | – | – | – | – |

---
*USD-denominerad bok. Separat från den nordiska rotationen (`portfolj.md`). Detta är
automatiserat beslutsstöd, inte finansiell rådgivning.*
