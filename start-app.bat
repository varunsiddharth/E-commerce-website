@echo off
setlocal enabledelayedexpansion

:: Prevent the window from closing automatically
title E-Commerce Application Startup

echo ========================================
echo    E-Commerce Application Startup
echo ========================================
echo.

:: Get the directory where this batch file is located
set "PROJECT_ROOT=%~dp0"
:: Remove trailing backslash
set "PROJECT_ROOT=%PROJECT_ROOT:~0,-1%"
echo Project Root: %PROJECT_ROOT%
echo Current Working Directory: %CD%
echo.

:: Check if required directories exist
echo [CHECK] Verifying project structure...
if not exist "%PROJECT_ROOT%\backend" (
    echo [ERROR] Backend directory not found!
    echo Expected location: %PROJECT_ROOT%\backend
    echo Please make sure you're running this from the project root directory.
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

if not exist "%PROJECT_ROOT%\frontend" (
    echo [ERROR] Frontend directory not found!
    echo Expected location: %PROJECT_ROOT%\frontend
    echo Please make sure you're running this from the project root directory.
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

echo [OK] Project structure verified
echo.

:: Check if Node.js is installed
echo [CHECK] Verifying Node.js installation...
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/
    echo.
    echo Press any key to exit...
    pause >nul
    exit /b 1
) else (
    for /f "tokens=*" %%i in ('node --version 2^>nul') do echo [OK] Node.js version: %%i
)

:: Check if Python is installed (for fallback)
echo [CHECK] Verifying Python installation...
python --version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Python is not installed. Will use live-server only.
    set USE_PYTHON=0
) else (
    for /f "tokens=*" %%i in ('python --version 2^>nul') do echo [OK] Python version: %%i
    set USE_PYTHON=1
)

echo.
echo [1/6] Setting up Frontend Dependencies...
cd /d "%PROJECT_ROOT%\frontend"

:: Install live-server if not present
if not exist "node_modules" (
    echo [INSTALL] Installing live-server for frontend...
    npm install live-server --save-dev --silent
    if errorlevel 1 (
        echo [WARNING] Failed to install live-server
        if "%USE_PYTHON%"=="1" (
            echo [FALLBACK] Will use Python server instead
            set USE_PYTHON=1
        ) else (
            echo [ERROR] No server available. Please install Python or fix npm.
            echo.
            echo Press any key to exit...
            pause >nul
            exit /b 1
        )
    ) else (
        echo [OK] live-server installed successfully
        set USE_PYTHON=0
    )
) else (
    echo [OK] Frontend dependencies already installed
    set USE_PYTHON=0
)

echo.
echo [2/6] Setting up Backend Dependencies...
cd /d "%PROJECT_ROOT%\backend"

:: Check if backend dependencies are installed
if not exist "node_modules" (
    echo [INSTALL] Installing backend dependencies...
    npm install --silent
    if errorlevel 1 (
        echo [ERROR] Failed to install backend dependencies!
        echo Please check your internet connection and try again.
        echo.
        echo Press any key to exit...
        pause >nul
        exit /b 1
    ) else (
        echo [OK] Backend dependencies installed successfully
    )
) else (
    echo [OK] Backend dependencies already installed
)

echo.
echo [3/6] Setting up Environment Configuration...
:: Check if .env file exists
if not exist ".env" (
    echo [CREATE] Creating .env file...
    if exist "env.example" (
        copy "env.example" ".env" >nul 2>&1
        echo [OK] .env file created from template
    ) else (
        echo [CREATE] Creating basic .env file...
        (
            echo PORT=5000
            echo NODE_ENV=development
            echo MONGO_URI=mongodb://localhost:27017/ecommerce
            echo JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
            echo FRONTEND_URL=http://localhost:8080
        ) > .env
        echo [OK] Basic .env file created
    )
) else (
    echo [OK] .env file already exists
)

echo.
echo [4/6] Starting Backend Server...
echo [START] Starting backend server on port 5000...

:: Start backend server in a new window that stays open
start "E-Commerce Backend Server" cmd /k "cd /d \"%PROJECT_ROOT%\backend\" & echo [BACKEND] Starting Express server... & echo [BACKEND] Server will run on http://localhost:5000 & echo [BACKEND] Press Ctrl+C to stop the server & echo. & npm start"

:: Wait for backend to start
echo [WAIT] Waiting for backend to initialize...
timeout /t 10 /nobreak >nul

:: Test if backend is running
echo [TEST] Testing backend connection...
curl -s http://localhost:5000/api/health >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Backend may not be ready yet, but continuing...
    echo [INFO] Please check the backend window for any errors.
    echo [INFO] If MongoDB is not running, the backend will show connection errors.
) else (
    echo [OK] Backend is responding! ✓
)

echo.
echo [5/6] Seeding Database...
cd /d "%PROJECT_ROOT%\backend"
echo [SEED] Seeding database with sample products...
npm run seed >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Database seeding failed, but continuing...
    echo [INFO] You may need to start MongoDB first (mongod command)
    echo [INFO] Or check if MongoDB Atlas connection is working
) else (
    echo [OK] Database seeded with sample products ✓
)

echo.
echo [6/6] Starting Frontend Server...
cd /d "%PROJECT_ROOT%\frontend"

if "%USE_PYTHON%"=="1" (
    echo [START] Starting Python HTTP server on port 8080...
    start "E-Commerce Frontend Server" cmd /k "cd /d \"%PROJECT_ROOT%\frontend\" & echo [FRONTEND] Starting Python server... & echo [FRONTEND] Server will run on http://localhost:8080 & echo [FRONTEND] Press Ctrl+C to stop the server & echo. & python -m http.server 8080"
    set FRONTEND_URL=http://localhost:8080
) else (
    echo [START] Starting live-server on port 8080...
    start "E-Commerce Frontend Server" cmd /k "cd /d \"%PROJECT_ROOT%\frontend\" & echo [FRONTEND] Starting live-server... & echo [FRONTEND] Server will run on http://localhost:8080 & echo [FRONTEND] Press Ctrl+C to stop the server & echo. & npx live-server --port=8080 --entry-file=index.html --no-browser"
    set FRONTEND_URL=http://localhost:8080
)

:: Wait for frontend to start
echo [WAIT] Waiting for frontend to start...
timeout /t 5 /nobreak >nul

echo.
echo [BROWSER] Opening application in browser...
timeout /t 3 /nobreak >nul
start "" "%FRONTEND_URL%/index.html"

echo.
echo ========================================
echo    Application Started Successfully!
echo ========================================
echo.
echo [INFO] Backend Server: http://localhost:5000
echo [INFO] Frontend Server: %FRONTEND_URL%
echo [INFO] API Health Check: http://localhost:5000/api/health
echo.
echo [SUCCESS] The application should now be open in your browser.
echo [INFO] If not, manually open: %FRONTEND_URL%/index.html
echo.
echo [IMPORTANT] Make sure MongoDB is running:
echo   - Local: Run 'mongod' command in a separate terminal
echo   - Cloud: Update MONGO_URI in backend/.env for MongoDB Atlas
echo.
echo [CONTROL] To stop the servers:
echo   - Close the "Backend Server" window to stop backend
echo   - Close the "Frontend Server" window to stop frontend
echo.
echo [DEBUG] If you see errors:
echo   - Check the backend and frontend windows for error messages
echo   - Make sure ports 5000 and 8080 are not in use by other applications
echo   - Verify MongoDB is running and accessible
echo.
echo Press any key to close this startup window...
pause >nul
