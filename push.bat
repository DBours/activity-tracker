@echo off
cd /d "%~dp0"
echo Pushing Activity Tracker to GitHub...
git add index.html sw.js .github/workflows/deploy.yml .gitignore
git diff --cached --quiet && (echo No changes to push. && pause && exit /b 0)
git commit -m "Update app %date% %time%"
git push origin main
echo.
echo Done! GitHub Pages will update in ~30 seconds.
echo https://dbours.github.io/activity-tracker/
pause
