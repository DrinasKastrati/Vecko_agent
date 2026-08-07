/* ============================================================================
   fills.js — window.VFills: Drens EGNA köp- och säljkurser.

   VARFÖR FILEN FINNS: systemet lägger inga ordrar. Roboten skriver den
   VERIFIERADE kurs den såg när beslutet fattades; Dren utför affären hos
   mäklaren och betalar något annat. Under pappersperioden spelade skillnaden
   ingen roll — från den skarpa starten 2026-08-10 är felet kumulativt, och
   ingenting mätte det.

   LAGRING: localStorage, alltså PER ENHET OCH WEBBLÄSARE, precis som temat.
   Inget committas, inget delas, ingen backup finns — rensad webbläsardata
   raderar allt. EGEN nyckel (`vr_fills`) och inte `vr_settings`: den senares
   "Återställ inställningar" gör localStorage.removeItem() och hade tagit
   affärsdatan med sig.

   SIFFRORNA MÄTER UTFALL, DE STYR INGA BESLUT. Prompterna kör i GitHub Actions
   och kan inte läsa localStorage; stop-loss och målkurs prövas fortsatt mot
   ROBOTENS entry. Läste besluten den här datan skulle två enheter med olika
   ifyllda siffror ge olika signaler för samma position, och intradag-monitorn
   (som når ingendera) en tredje.
   ========================================================================== */
(function (root) {
  "use strict";

  var KEY = "vr_fills";

  /* Tickern står på TVÅ ställen beroende på tabell: innehavstabellen har en
     egen kolumn "Yahoo-ticker", historiktabellen har den bara i parentes i
     "Aktie" (`Saab (SAAB-B.ST)`). Nyckeln måste bli densamma i båda, annars
     tappas affären i samma sekund roboten flyttar den till historiken. */
  function tickerFrom(row) {
    if (!row) return "";
    var direkt = String(row["Yahoo-ticker"] || "").trim();
    if (direkt) return direkt.toUpperCase();
    var m = String(row["Aktie"] || "").match(/\(([^)]+)\)/);
    return m ? m[1].trim().toUpperCase() : "";
  }

  function keyFor(row) {
    var t = tickerFrom(row);
    var d = String((row && row["Entry-datum"]) || "").trim();
    return (t && d) ? (t + "|" + d) : null;
  }

  function read() {
    try { return JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { return {}; }
  }
  function write(o) {
    try { localStorage.setItem(KEY, JSON.stringify(o)); } catch (e) {}
  }

  function tal(v) { var n = typeof v === "number" ? v : parseFloat(v); return isFinite(n) ? n : 0; }
  function komplett(ben) { return !!ben && tal(ben.kurs) > 0 && tal(ben.antal) > 0; }

  /* Räknar Drens verkliga utfall för EN bok.

     `stangda` är robotens historikrader — bara stängda affärer ingår. Öppna
     positioner har per definition ingen säljkurs, och räknades de in i
     nämnaren skulle klara < totalt alltid vara sant och talet aldrig visas.

     `costPct` är rundturskostnaden i procent (vparse.js:costFor, som redan
     lägger på växlingspåslaget för US-boken), tagen på det investerade
     beloppet.

     REGELN SOM INTE FÅR LUCKRAS UPP: saknas en enda affär returneras null för
     avkastningPct och kronor. Ett halvfyllt tal ser ut att betyda något och
     inbjuder till jämförelse med robotens — hellre "för tidigt", precis som
     decision_eval gör. */
  function computeMyStats(fills, stangda, bok, costPct) {
    var db = fills || {}, rader = stangda || [];
    var perAffar = [], saknar = [];
    var netto = 0, investerat = 0;

    for (var i = 0; i < rader.length; i++) {
      var k = keyFor(rader[i]);
      var t = tickerFrom(rader[i]);
      var f = k ? db[k] : null;
      if (f && f.bok && f.bok !== bok) { saknar.push({ ticker: t, key: k, vad: "annan bok" }); continue; }
      var harKop = komplett(f && f.kop), harSalj = komplett(f && f.salj);
      if (!harKop || !harSalj) {
        saknar.push({ ticker: t, key: k, vad: (!harKop && !harSalj) ? "köp och sälj" : (harKop ? "sälj" : "köp") });
        continue;
      }
      var in_ = tal(f.kop.kurs) * tal(f.kop.antal);
      var ut = tal(f.salj.kurs) * tal(f.salj.antal);
      var avgift = in_ * (tal(costPct) / 100);
      var res = ut - in_ - avgift;
      investerat += in_; netto += res;
      perAffar.push({
        ticker: t, key: k, in: in_, ut: ut, antal: tal(f.kop.antal),
        brutto: ut - in_, avgift: avgift, netto: res,
        pct: in_ > 0 ? (res / in_ * 100) : null
      });
    }

    var klara = perAffar.length, totalt = rader.length;
    var fullt = totalt > 0 && klara === totalt;
    return {
      klara: klara, totalt: totalt, saknar: saknar, perAffar: perAffar,
      investerat: investerat,
      kronor: fullt ? netto : null,
      avkastningPct: (fullt && investerat > 0) ? (netto / investerat * 100) : null
    };
  }

  root.VFills = {
    KEY: KEY,
    tickerFrom: tickerFrom,
    keyFor: keyFor,
    computeMyStats: computeMyStats,
    all: function () { return read(); },
    get: function (k) { return (k && read()[k]) || null; },
    setKop: function (k, v) {
      var db = read(); var post = db[k] || {};
      if (v && v.bok) post.bok = v.bok;
      post.kop = { kurs: tal(v && v.kurs), antal: tal(v && v.antal), datum: (v && v.datum) || "" };
      db[k] = post; write(db);
    },
    setSalj: function (k, v) {
      var db = read(); var post = db[k] || {};
      post.salj = { kurs: tal(v && v.kurs), antal: tal(v && v.antal), datum: (v && v.datum) || "" };
      db[k] = post; write(db);
    },
    remove: function (k) { var db = read(); delete db[k]; write(db); }
  };
  if (typeof module !== "undefined" && module.exports) module.exports = root.VFills;
})(typeof window !== "undefined" ? window : this);
