@echo off
rem =====================================================
rem  Auto-push (schemalagd, TYST - ingen paus). Korrs av
rem  Task Scheduler var 30:e minut; hoppar sjalv over
rem  helger och natt. Registrera med setup_autopush.bat.
rem =====================================================
cd /d "%~dp0"

rem -- kor bara vardagar 07-19 (lokal tid) --
for /f %%i in ('powershell -NoProfile -Command "(Get-Date).DayOfWeek.value__"') do set DOW=%%i
for /f %%i in ('powershell -NoProfile -Command "(Get-Date).Hour"') do set HR=%%i
if "%DOW%"=="0" exit /b 0
if "%DOW%"=="6" exit /b 0
if %HR% LSS 7 exit /b 0
if %HR% GTR 19 exit /b 0

echo [%date% %time%] auto_push start >> auto_push.log

git add -A
git diff --cached --quiet
if errorlevel 1 (
  git commit -m "Auto-push %date% %time%" >> auto_push.log 2>&1
)

rem -- pusha alltid: tar aven med tidigare commits som inte gick ut --
git pull --rebase --autostash origin main >> auto_push.log 2>&1
git push origin main >> auto_push.log 2>&1

echo [%date% %time%] auto_push klar >> auto_push.log
exit /b 0
