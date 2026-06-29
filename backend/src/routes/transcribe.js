/**
 * Transcribe Routes
 * 
 * Handles audio file upload and transcription requests
 */

const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const uploadMiddleware = require('../middleware/upload');
const { asyncHandler } = require('../middleware/errorHandler');
const { transcribeAudio, validateAudioFile } = require('../utils/transcription');

/**
 * POST /api/transcribe
 * 
 * Upload and transcribe an audio file
 * 
 * Request:
 *   - multipart/form-data with 'audio' field
 *   - Optional: 'language' field (ISO-639-1 code, e.g., 'en', 'es')
 * 
 * Response:
 *   {
 *     success: true,
 *     transcript: "full transcript text",
 *     segments: [
 *       { text: "word or phrase", start: 0.0, end: 1.5, confidence: 0.95 },
 *       ...
 *     ],
 *     duration: 45.2,
 *     language: "en"
 *   }
 */
router.post('/transcribe', uploadMiddleware, asyncHandler(async (req, res) => {
  try {
    const filePath = req.file.path;
    const originalName = req.file.originalname;
    const language = req.body.language || undefined;

    console.log(`\n🎙️  Transcribe request: ${originalName}`);

    // Validate uploaded file
    const validation = validateAudioFile(filePath);
    if (!validation.valid) {
      fs.unlinkSync(filePath); // Clean up
      return res.status(400).json({
        success: false,
        error: 'File validation failed',
        details: validation.errors
      });
    }

    // Transcribe audio
    const result = await transcribeAudio(filePath, { language });

    // Add metadata
    result.success = true;
    result.uploadedFileName = originalName;

    // Clean up uploaded file
    fs.unlinkSync(filePath);
    console.log(`🗑️  Cleaned up temporary file: ${path.basename(filePath)}`);

    res.json(result);
  } catch (error) {
    // Clean up on error
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    throw error;
  }
}));

/**
 * POST /api/transcribe/batch
 * 
 * Transcribe multiple files (future enhancement)
 * Currently returns 501 Not Implemented
 */
router.post('/transcribe/batch', (req, res) => {
  res.status(501).json({
    success: false,
    error: 'Batch transcription not yet implemented',
    code: 'NOT_IMPLEMENTED'
  });
});

/**
 * GET /api/transcribe/languages
 * 
 * Get list of supported languages
 */
router.get('/transcribe/languages', (req, res) => {
  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'it', name: 'Italian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'nl', name: 'Dutch' },
    { code: 'ru', name: 'Russian' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ja', name: 'Japanese' },
    { code: 'ko', name: 'Korean' },
    { code: 'hi', name: 'Hindi' },
  ];

  res.json({
    success: true,
    languages,
    count: languages.length
  });
});

module.exports = router;
