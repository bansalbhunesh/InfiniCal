@echo off
echo 🗓️ Infinite Calendar Setup
echo.

echo 📋 Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Node.js is installed!
    goto :install_deps
) else (
    echo ❌ Node.js not found. Installing...
    echo.
    echo 📥 Installing Node.js via winget...
    winget install OpenJS.NodeJS --silent
    echo.
    echo 🔄 Please restart your terminal and run this script again.
    echo    Or manually run: npm install && npm run dev
    pause
    exit /b
)

:install_deps
echo.
echo 📦 Installing project dependencies...
npm install

if %errorlevel% equ 0 (
    echo.
    echo ✅ Dependencies installed successfully!
    echo.
    echo 🚀 Starting development server...
    echo 🌐 Open http://localhost:3000 in your browser
    echo.
    npm run dev
) else (
    echo.
    echo ❌ Failed to install dependencies
    echo Please check your Node.js installation and try again
    pause
)
