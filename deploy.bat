@echo off
REM Generic Build, Add, Commit, and Push script

echo ========================================
echo Step 1: Building Next.js project to check for errors...
echo ========================================
call npm run build
if errorlevel 1 (
    echo Build failed! Please fix the errors before deploying.
    pause
    exit /b 1
)

echo.
echo ========================================
echo Step 2: Adding changes...
echo ========================================
git add .
git status

echo.
echo ========================================
echo Step 3: Committing changes...
echo ========================================
set /p commit_msg="Enter your commit message: "
git commit -m "%commit_msg%"

echo.
echo ========================================
echo Step 4: Pushing to GitHub...
echo ========================================
git push origin main

echo.
echo ========================================
echo All done! Code successfully pushed to GitHub.
echo ========================================
echo.
echo NEXT STEP FOR VPS DEPLOYMENT:
echo To make this live, SSH into your server:
echo   ssh root@YOUR_VPS_IP
echo Then run:
echo   cd /var/www/pentapeaks
echo   ./deploy-vps.sh
echo ========================================
pause
