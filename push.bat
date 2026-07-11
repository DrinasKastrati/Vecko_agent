@echo off
rem =====================================================
rem  Enklicks-push: committar ALLA lokala andringar och
rem  pushar till main. Dubbelklicka efter en Cowork-session
rem  (Claude kan skriva filer men inte pusha).
rem =====================================================
cd /d "%~dp0"

git add -A
git diff --cached --quiet
if %errorlevel%==0 (
  echo Inga andringar att pusha.
  pause
  exit /b 0
)

git commit -m "Uppdatering via Cowork %date% %time%"
git pull --rebase --autostash origin main
git push origin main

if %errorlevel%==0 (
  echo.
  echo Klart! Dashboarden uppdateras inom nagon minut.
) else (
  echo.
  echo NAGOT GICK FEL - se felmeddelandet ovan. Vanligaste orsaken i OneDrive-mappen
  echo ar en laskonflikt (.git/index.lock) - vanta 10 sek och kor igen.
)
pause
