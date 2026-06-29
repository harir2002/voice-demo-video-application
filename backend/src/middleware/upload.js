/**
 * File Upload Middleware
 * 
 * Handles multipart form-data uploads with validation.
 * Supports common audio formats: MP3, WAV, M4A, OGG, WEBM
 */

const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || 25 * 1024 * 1024; // 25MB
const ALLOWED_AUDIO_TYPES = (process.env.ALLOWED_AUDIO_TYPES || 'mp3,wav,m4a,ogg,webm')
  .split(',')
  .map(ext => ext.trim());

// MIME type mapping
const mimeTypeMap = {
  'audio/mpeg': 'mp3',
  'audio/wav': 'wav',
  'audio/mp4': 'm4a',
  'audio/ogg': 'ogg',
  'audio/webm': 'webm',
  'audio/x-wav': 'wav',
  'audio/x-m4a': 'm4a',
};

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const tempDir = process.env.UPLOAD_TEMP_DIR || './tmp';
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase().slice(1) || 'audio';
    const filename = `${uuidv4()}.${ext}`;
    cb(null, filename);
  }
});

// File filter
const fileFilter = (req, file, cb) => {
  // Check MIME type
  const mimeExt = mimeTypeMap[file.mimetype];
  if (!mimeExt) {
    return cb(new Error(`Unsupported MIME type: ${file.mimetype}`));
  }

  // Check extension
  const ext = path.extname(file.originalname).toLowerCase().slice(1).toLowerCase();
  if (!ALLOWED_AUDIO_TYPES.includes(ext) && !ALLOWED_AUDIO_TYPES.includes(mimeExt)) {
    return cb(new Error(
      `File type not allowed. Supported: ${ALLOWED_AUDIO_TYPES.join(', ')}`
    ));
  }

  cb(null, true);
};

// Configure multer
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
    files: 1
  }
});

// Upload middleware with error handling
const uploadMiddleware = (req, res, next) => {
  upload.single('audio')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          success: false,
          error: 'File too large',
          code: 'FILE_TOO_LARGE',
          details: `Maximum file size is ${MAX_FILE_SIZE / 1024 / 1024}MB`
        });
      }
      if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({
          success: false,
          error: 'Only one file allowed',
          code: 'MULTIPLE_FILES'
        });
      }
    }

    if (err) {
      return res.status(400).json({
        success: false,
        error: err.message,
        code: 'UPLOAD_ERROR'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded',
        code: 'NO_FILE'
      });
    }

    next();
  });
};

module.exports = uploadMiddleware;
