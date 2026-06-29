#!/bin/bash

# Voice Demo Studio - Unix/Linux Development Startup
# This script starts both backend and frontend servers

echo ""
echo "========================================"
echo "   Voice Demo Studio - Dev Startup"
echo "========================================"
echo ""

# Check if backend dependencies are installed
if [ ! -d "backend/node_modules" ]; then
    echo "Installing backend dependencies..."
    cd backend
    npm install
    cd ..
fi

# Check if frontend dependencies are installed
if [ ! -d "frontend/node_modules" ]; then
    echo "Installing frontend dependencies..."
    cd frontend
    npm install
    cd ..
fi

# Check if .env file exists
if [ ! -f "backend/.env" ]; then
    echo ""
    echo "WARNING: backend/.env file not found!"
    echo "Please copy backend/.env.example to backend/.env and add your OpenAI API key."
    echo ""
    exit 1
fi

echo ""
echo "Starting servers..."
echo ""
echo "Backend will start on: http://localhost:3001"
echo "Frontend will start on: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop servers."
echo ""

# Start backend in background
echo "Starting backend server..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend in background
echo "Starting frontend server..."
cd frontend
npm start &
FRONTEND_PID=$!
cd ..

echo ""
echo "Both servers started:"
echo "  Backend PID: $BACKEND_PID"
echo "  Frontend PID: $FRONTEND_PID"
echo ""
echo "Frontend should open automatically in your browser."
echo ""
echo "To stop, press Ctrl+C"
echo ""

# Wait for interrupt signal
trap "kill $BACKEND_PID $FRONTEND_PID" INT

wait
