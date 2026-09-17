@echo off
chcp 65001 > nul
cd /d "C:\GameDev\AshenAfterimage_Site"
call npm run deploy
echo.
pause
