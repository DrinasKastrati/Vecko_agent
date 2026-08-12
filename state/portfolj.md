# Portfölj – Nordisk Rotation
**Senast uppdaterad:** 2026-08-12T06:50:00Z (LÄGE B, daglig bevakning – **BEN 2 I ASSA-B.ST FYLLD**. Villkoret "verifierad kurs ≤ 361,00" korsades intradag 2026-08-11: dagslägsta **359,60** (prices.json, marketTime 2026-08-11T15:29:56Z), bekräftat av `state/alerts.json` (KÖP, `basis` "intraday", `hitPrice` 359,60). Positionen är enligt punkt 4a **sammanslagen i den befintliga raden** – vikt 12,5 % → **25,0 %**, entry viktat snitt **363,75** ((366,50 + 361,00)/2), entry-datum 2026-08-10 OFÖRÄNDRAT, stop 352,00 och mål 396,00 OFÖRÄNDRADE (punkt 6 tillåter aldrig nedflyttad stop) ⇒ R/R **2,74:1**. Ingen andra rad lagd. Sleeven minskad 87,5 % → **75,0 %** för att finansiera benet – enda tillåtna skälet att röra den i LÄGE B. Pending-raden struken som TRIGGAD. BEHÅLL på båda innehaven i övrigt. Se `reports/daily/daglig-260812.md`. Föregående rad: 2026-08-11T06:45:00Z, LÄGE B – BEHÅLL på båda, ben 2 EJ TRIGGAD (dagslägsta 361,40, 0,40 kr från nivån). Dessförinnan: 2026-08-10T07:10:00Z, LÄGE A, v33-rotationen – FÖRSTA SKARPA KÖRNINGEN med riktiga pengar. Boken öppnades från noll: ett case klarade samtliga fem grindar (ASSA-B.ST), som köps med delat entry enligt punkt 4a – ben 1 om 12,5 % direkt, ben 2 om 12,5 % som villkorad limit i Pending. Resterande kapital ligger i indexsleeven, aldrig på konto. Regimfiltret är PÅ: ^OMX 3 312,34 > MA200 3 022,85 räknat på 250 stängningar i `state/price_history.json`. Se `reports/weekly/veckorapport-260810.md`.)
**Ackumulerad avkastning sedan start:** +0,00 % (noll stängda affärer – skarp start 2026-08-10. Pappersperioden 2026-07-14–2026-08-06 slutade på +6,28 % på 2 stängd(a) affär(er) och räknas INTE in här; den ligger i `state/archive/portfolj-paper-260810.md`.)

## Aktuellt innehav
| Aktie | Yahoo-ticker | Börs | Entry-datum | Entry | Stop-loss | Målkurs | Vikt | Anteckning |
|---|---|---|---|---|---|---|---|---|
| ASSA ABLOY B | ASSA-B.ST | Nasdaq Stockholm | 2026-08-10 | 363,75 | 352,00 | 396,00 | 25,0 % | **FULL POSITION – båda benen fyllda (delat entry, punkt 4a).** Ben 1: 12,5 % @ 366,50 (2026-08-10). Ben 2: 12,5 % @ 361,00, villkoret ≤ 361,00 korsat intradag 2026-08-11 (dagslägsta 359,60, prices.json marketTime 2026-08-11T15:29:56Z; `state/alerts.json` `basis` "intraday", `hitPrice` 359,60). Entry = viktat snitt (366,50 + 361,00)/2 = **363,75**; entry-datum 2026-08-10 lämnat OFÖRÄNDRAT enligt punkt 4a (dashboardens `assets/fills.js` nycklar på ticker + entry-datum). Katalysator: förvärv av Gunnebo Entrance Control, PR Newswire 2026-08-03. catalystType `other`, horisont 20 handelsdagar. **Stop 352,00 och mål 396,00 OFÖRÄNDRADE** – punkt 6 tillåter aldrig nedflyttad stop, och mot det lägre entryt blir R/R **2,74:1** (32,25 / 11,75), alltså bättre än ben 1:s 2,03:1. (Tidigare noterat 349,50/393,00 var en proportionell justering nedåt och ströks 2026-08-11 som regelvidrig.) Ingen andra rad har lagts för ASSA-B.ST. |
| Indexsleeve (XACT OMXS30) | XACT-OMXS30.ST | Nasdaq Stockholm | 2026-08-10 | 494,60 | – | – | 75,0 % | Kapitalparkering enligt sleeve-regeln – oallokerat kapital ligger ALDRIG på konto. Ingen stop, ingen målkurs; justeras bara när aktievikterna ändras. **Minskad 87,5 % → 75,0 % 2026-08-12** för att finansiera ASSA ben 2 (12,5 pp) – det enda tillåtna skälet att röra sleeven i LÄGE B. Entry 494,60 oförändrat (delförsäljning, inte ny position). Kurs verifierad: prices.json, marketTime 2026-08-11T15:24:50Z (491,10). |

### Pending veckorotation v33
| Aktie | Yahoo-ticker | Börs | Planerad entry (villkor) | Planerad stop-loss | Planerad målkurs | R/R | Planerad vikt | Status |
|---|---|---|---|---|---|---|---|---|
| ~~ASSA ABLOY B~~ | ~~ASSA-B.ST~~ | ~~Nasdaq Stockholm~~ | ~~Verifierad kurs ≤ 361,00~~ | ~~352,00~~ | ~~396,00~~ | ~~2,03:1~~ | ~~12,5 %~~ | **TRIGGAD 2026-08-11** – dagslägsta 359,60 korsade nivån 361,00 intradag (prices.json marketTime 2026-08-11T15:29:56Z). Benet fyllt @ 361,00 och sammanslaget i innehavsraden ovan enligt punkt 4a; raden raderas aldrig, bara struken. |

*Inga villkorade BUBBLAR-planer ligger öppna (punkt 4b) – taket på två är oanvänt. Raden ovan var ben 2 av ett valt case, inte en bubblar-plan, och är nu fylld. Pending-sektionen är därmed TOM.*

## Kassa
0 % – allt oallokerat kapital ligger i indexsleeven (XACT-OMXS30.ST) enligt sleeve-regeln.

## Historik (append-only – rader får ALDRIG raderas eller ändras)
| Stängd | Aktie | Entry-datum | Entry | Exit | Utfall % | Vikt | Skäl (mål/stopp/rotation/katalysator) |
|---|---|---|---|---|---|---|---|
| – | – | – | – | – | – | – | – |
