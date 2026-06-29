/**
 * Voice Demo Studio - Backend Server
 * 
 * Handles audio file uploads and transcription via OpenAI Whisper API.
 * Provides RESTful endpoints for the frontend to integrate with.
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// Import routes and middleware
const uploadMiddleware = require('./middleware/upload');
const transcribeRoutes = require('./routes/transcribe');
const { errorHandler, asyncHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Ensure temp directory exists
const tempDir = process.env.UPLOAD_TEMP_DIR || './tmp';
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const statusColor = status >= 400 ? '\x1b[31m' : '\x1b[32m';
    console.log(
      `${statusColor}${status}\x1b[0m ${req.method} ${req.path} (${duration}ms)`
    );
  });
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', environment: NODE_ENV });
});

// API Routes
app.use('/api', transcribeRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    path: req.path
  });
});

// Error Handler (must be last)
app.use(errorHandler);

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`\n🎙️  Voice Demo Studio - Backend`);
  console.log(`\n📡 Server running on http://localhost:${PORT}`);
  console.log(`🔧 Environment: ${NODE_ENV}`);
  console.log(`📁 Temp directory: ${path.resolve(tempDir)}`);
  console.log('\n✅ Ready to receive audio files for transcription\n');
});

module.exports = app;
