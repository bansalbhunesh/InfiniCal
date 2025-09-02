@echo off
echo 🚀 Infinite Calendar - Build and Deploy Helper
echo.

echo 📋 Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found in PATH
    echo 🔧 Attempting to refresh environment...
    set "PATH=%PATH%;C:\Program Files\nodejs"
    node --version >nul 2>&1
    if %errorlevel% neq 0 (
        echo ❌ Still can't find Node.js
        echo Please restart your terminal or reinstall Node.js
        pause
        exit /b 1
    )
)

echo ✅ Node.js found!
echo 📦 Installing dependencies...
npm install

if %errorlevel% equ 0 (
    echo.
    echo ✅ Dependencies installed!
    echo 🏗️ Building production version...
    npm run build
    
    if %errorlevel% equ 0 (
        echo.
        echo ✅ Build successful!
        echo 📁 Production files are in the 'dist' folder
        echo.
        echo 🌐 Ready to deploy! Choose your option:
        echo   1. Drag 'dist' folder to vercel.com
        echo   2. Drag 'dist' folder to netlify.com  
        echo   3. Upload to any web hosting service
        echo.
        echo 🎯 Or run 'npm run dev' to start development server
    ) else (
        echo ❌ Build failed
    )
) else (
    echo ❌ Failed to install dependencies
)

echo.
echo 💡 Tip: You can also use standalone.html for immediate access!
pause
