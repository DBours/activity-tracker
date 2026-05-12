@echo off
cd /d "%~dp0"
echo Pushing Activity Tracker to GitHub...
git add index.html sw.js .github/workflows/deploy.yml
git commit -m "Update app %date% %time%"
git push origin main
echo.
echo Done! GitHub will auto-deploy to Pages in ~30 seconds.
echo https://dbours.github.io/activity-tracker/
pause
