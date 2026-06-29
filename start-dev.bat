@echo off
REM Voice Demo Studio - Windows Development Startup
REM This script starts both backend and frontend servers

echo.
echo ========================================
echo   Voice Demo Studio - Dev Startup
echo ========================================
echo.

REM Check if backend dependencies are installed
if not exist "backend\node_modules" (
    echo Installing backend dependencies...
    cd backend
    call npm install
    cd ..
)

REM Check if frontend dependencies are installed
if not exist "frontend\node_modules" (
    echo Installing frontend dependencies...
    cd frontend
    call npm install
    cd ..
)

REM Check if .env file exists
if not exist "backend\.env" (
    echo.
    echo WARNING: backend\.env file not found!
    echo Please copy backend\.env.example to backend\.env and add your OpenAI API key.
    echo.
    pause
    exit /b 1
)

echo.
echo Starting servers...
echo.
echo Backend will start on: http://localhost:3001
echo Frontend will start on: http://localhost:3000
echo.
echo Press Ctrl+C to stop servers.
echo.

REM Start backend in new window
echo Starting backend server...
cd backend
start "Voice Demo Studio - Backend" cmd /k "npm start"
cd ..

REM Wait for backend to start
timeout /t 3 /nobreak

REM Start frontend in new window
echo Starting frontend server...
cd frontend
start "Voice Demo Studio - Frontend" cmd /k "npm start"
cd ..

echo.
echo Both servers started in separate windows.
echo Frontend should open automatically in your browser.
echo.
echo To stop, close both windows or press Ctrl+C.
echo.

pause
