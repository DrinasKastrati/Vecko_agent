#!/bin/bash
# Kör hela CI-kedjan N varv. Ett grönt testresultat säger bara att koden inte
# kraschar; det som kan gå sönder tyst är att dashboard-bygget blir
# ICKE-DETERMINISTISKT. Därför jämförs de genererade filerna varv för varv –
# med `generatedAt` bortplockat, eftersom den ÄR menad att ändras varje bygge.
cd "$(dirname "$0")/.." || exit 1
N=${1:-8}
fail=0
strip() { node -e "const o=JSON.parse(require('fs').readFileSync(process.argv[1],'utf8'));delete o.generatedAt;delete o.builtAt;console.log(JSON.stringify(o))" "$1" | sha256sum | cut -d' ' -f1; }
node .github/scripts/build-dashboard.mjs >/dev/null 2>&1
ref_dash=$(strip state/dashboard.json)
ref_idx=$(strip state/search-index.json)
echo "referens (utan generatedAt): dashboard ${ref_dash:0:16}… index ${ref_idx:0:16}…"
for i in $(seq 1 "$N"); do
  out=""
  node tests/run.mjs > /tmp/l-run.txt 2>&1     || { out="$out run:FEL"; fail=1; }
  node tests/theme.mjs > /tmp/l-theme.txt 2>&1 || { out="$out theme:FEL"; fail=1; }
  node tests/data.mjs > /tmp/l-data.txt 2>&1   || { out="$out data:FEL"; fail=1; }
  node .github/scripts/validate-decisions.mjs > /tmp/l-dec.txt 2>&1 || { out="$out decisions:FEL"; fail=1; }
  node .github/scripts/build-dashboard.mjs > /tmp/l-dash.txt 2>&1   || { out="$out dashboard:FEL"; fail=1; }
  for f in assets/vparse.js assets/vrender.js assets/app.js assets/theme.js assets/settings.js; do
    node --check "$f" 2>/dev/null || { out="$out syntax:$f"; fail=1; }
  done
  [ "$(strip state/dashboard.json)" = "$ref_dash" ] || { out="$out dashboard.json INSTABIL"; fail=1; }
  [ "$(strip state/search-index.json)" = "$ref_idx" ] || { out="$out search-index.json INSTABIL"; fail=1; }
  echo "varv $i: run[$(tail -1 /tmp/l-run.txt)] theme[$(tail -1 /tmp/l-theme.txt)] data[$(tail -1 /tmp/l-data.txt)] ${out:-allt OK}"
done
echo "---"
if [ "$fail" = 0 ]; then echo "SLUTRESULTAT: $N varv, allt grönt och deterministiskt"; else echo "SLUTRESULTAT: FEL upptäckta"; fi
exit $fail
