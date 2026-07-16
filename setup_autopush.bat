@echo off
rem =====================================================
rem  Registrerar auto_push.bat i Windows Task Scheduler.
rem  Kor EN gang (dubbelklicka). Tasken kors var 30:e
rem  minut nar du ar inloggad; skriptet hoppar sjalv over
rem  helg/natt. Loggen hamnar i auto_push.log (gitignorad).
rem =====================================================
schtasks /Create /F /TN "VeckoAgent AutoPush" /TR "\"%~dp0auto_push.bat\"" /SC MINUTE /MO 30

if %errorlevel%==0 (
  echo.
  echo Klart! Auto-push kors nu var 30:e minut, vardagar 07-19.
  echo Rapporter fran routinerna publiceras automatiskt - push.bat
  echo behovs bara om du vill pusha OMEDELBART.
  echo.
  echo Ta bort tasken med:
  echo   schtasks /Delete /TN "VeckoAgent AutoPush" /F
) else (
  echo.
  echo NAGOT GICK FEL - prova att kora igen fran en vanlig kommandotolk.
)
pause
