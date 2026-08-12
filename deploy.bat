@echo off
REM Build, Add, Commit, and Push script
cd /d "d:\Sumair Butt Sab\Website\pentapeaks"

echo ========================================
echo Step 1: Building Next.js project...
echo ========================================
call npm run build
if errorlevel 1 (
    echo Build failed!
    exit /b 1
)

echo.
echo ========================================
echo Step 2: Checking git status...
echo ========================================
git status

echo.
echo ========================================
echo Step 3: Adding changes...
echo ========================================
git add app/page.tsx

echo.
echo ========================================
echo Step 4: Committing changes...
echo ========================================
git commit -m "fix: Fix homepage banner first image not loading

- Add visibility: visible to .slide-wrap.inactive:first-child to ensure first slide image preloads
- Apply heroParallax only to active slides to reduce unnecessary transforms
- Add quality={85} to Image component for better optimization
- Ensures Next.js Image optimization works properly on initial page load

Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>"

echo.
echo ========================================
echo Step 5: Pushing to remote...
echo ========================================
git push

echo.
echo ========================================
echo All done!
echo ========================================
echo.
echo NEXT STEP FOR VPS DEPLOYMENT:
echo To deploy to Hostinger VPS, SSH into your server and run:
echo ssh user@your-vps-ip "cd /var/www/pentapeaks && ./deploy-vps.sh"
echo ========================================
pause
