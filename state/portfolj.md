# Portfölj – Nordisk Rotation
**Senast uppdaterad:** 2026-08-11T06:45:00Z (LÄGE B, daglig bevakning – BEHÅLL på båda innehaven, inga ändringar i boken. ASSA-B.ST 363,40 (−0,85 % sedan entry, marketTime 2026-08-10T15:29:35Z): varken stop 352,00 eller mål 396,00 korsat, inte heller intradag (dayHigh 366,00 / dayLow 361,40). Pending ben 2 (≤ 361,00) EJ TRIGGAD – dagslägsta 361,40 kom 0,40 kr från nivån; avförs efter 2026-08-14. Sleeven orörd. Se `reports/daily/daglig-260811.md`. Föregående rad: 2026-08-10T07:10:00Z, LÄGE A, v33-rotationen – FÖRSTA SKARPA KÖRNINGEN med riktiga pengar. Boken öppnades från noll: ett case klarade samtliga fem grindar (ASSA-B.ST), som köps med delat entry enligt punkt 4a – ben 1 om 12,5 % direkt, ben 2 om 12,5 % som villkorad limit i Pending. Resterande kapital ligger i indexsleeven, aldrig på konto. Regimfiltret är PÅ: ^OMX 3 312,34 > MA200 3 022,85 räknat på 250 stängningar i `state/price_history.json`. Se `reports/weekly/veckorapport-260810.md`.)
**Ackumulerad avkastning sedan start:** +0,00 % (noll stängda affärer – skarp start 2026-08-10. Pappersperioden 2026-07-14–2026-08-06 slutade på +6,28 % på 2 stängd(a) affär(er) och räknas INTE in här; den ligger i `state/archive/portfolj-paper-260810.md`.)

## Aktuellt innehav
| Aktie | Yahoo-ticker | Börs | Entry-datum | Entry | Stop-loss | Målkurs | Vikt | Anteckning |
|---|---|---|---|---|---|---|---|---|
| ASSA ABLOY B | ASSA-B.ST | Nasdaq Stockholm | 2026-08-10 | 366,50 | 352,00 | 396,00 | 12,5 % | Ben 1 av 2 (delat entry, punkt 4a). Katalysator: förvärv av Gunnebo Entrance Control, PR Newswire 2026-08-03. catalystType `other`, horisont 20 handelsdagar, R/R 2,03:1. Kurs verifierad: prices.json, Yahoo Finance (chart API), marketTime 2026-08-07T15:29:49Z. Stop satt tekniskt strax under EMA20 353,41. Fylls ben 2 slås positionen ihop i DENNA rad: vikt 12,5 % → **25,0 %**, entry omräknat till viktat snitt 363,75, entry-datum 2026-08-10 oförändrat. **Stop 352,00 och mål 396,00 lämnas OFÖRÄNDRADE** – punkt 6 tillåter aldrig att stoppen flyttas ned, och mot det lägre entryt blir R/R då 2,74:1 (32,25 / 11,75). (Tidigare noterat 349,50/393,00 var en proportionell justering nedåt och är struken 2026-08-11 som regelvidrig.) Ingen andra rad läggs för ASSA-B.ST. |
| Indexsleeve (XACT OMXS30) | XACT-OMXS30.ST | Nasdaq Stockholm | 2026-08-10 | 494,60 | – | – | 87,5 % | Kapitalparkering enligt sleeve-regeln – oallokerat kapital ligger ALDRIG på konto. Ingen stop, ingen målkurs; justeras bara när aktievikterna ändras. Triggar ASSA ben 2 minskas sleeven till 75,0 %. Kurs verifierad: prices.json, marketTime 2026-08-07T15:24:00Z. |

### Pending veckorotation v33
| Aktie | Yahoo-ticker | Börs | Planerad entry (villkor) | Planerad stop-loss | Planerad målkurs | R/R | Planerad vikt | Status |
|---|---|---|---|---|---|---|---|---|
| ASSA ABLOY B | ASSA-B.ST | Nasdaq Stockholm | Verifierad kurs ≤ 361,00 | 352,00 | 396,00 | 2,03:1 | 12,5 % | BEN 2 – delat entry punkt 4a. Nivån satt grunt (−1,50 %, ca 1,5 genomsnittliga dagsrörelser) eftersom en tight limit långt under kursen historiskt aldrig triggar. Avförs efter 5 handelsdagar, dvs. t.o.m. 2026-08-14, om den inte triggat; kapitalet ligger då kvar i sleeven. |

*Inga villkorade BUBBLAR-planer lades denna rotation (punkt 4b) – taket på två är oanvänt. Raden ovan är ben 2 av ett valt case, inte en bubblar-plan.*

## Kassa
0 % – allt oallokerat kapital ligger i indexsleeven (XACT-OMXS30.ST) enligt sleeve-regeln.

## Historik (append-only – rader får ALDRIG raderas eller ändras)
| Stängd | Aktie | Entry-datum | Entry | Exit | Utfall % | Vikt | Skäl (mål/stopp/rotation/katalysator) |
|---|---|---|---|---|---|---|---|
| – | – | – | – | – | – | – | – |
