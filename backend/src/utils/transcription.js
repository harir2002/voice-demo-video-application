/**
 * Transcription Utility
 * 
 * Handles audio transcription via OpenAI Whisper API.
 * Can be extended to support other transcription providers.
 */

const fs = require('fs');
const path = require('path');
const OpenAI = require('openai');

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is required');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

/**
 * Transcribe an audio file using OpenAI Whisper
 * 
 * @param {string} filePath - Path to the audio file
 * @param {Object} options - Transcription options
 * @returns {Promise<Object>} Transcription result with segments and timestamps
 */
async function transcribeAudio(filePath, options = {}) {
  try {
    // Verify file exists
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    // Get file stats
    const stats = fs.statSync(filePath);
    const fileSizeInMB = stats.size / (1024 * 1024);

    console.log(`📁 Transcribing file: ${path.basename(filePath)} (${fileSizeInMB.toFixed(2)}MB)`);

    // Create read stream
    const audioFile = fs.createReadStream(filePath);

    // Call Whisper API with verbose JSON response
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: options.language || undefined,
      temperature: options.temperature || 0,
      // Request verbose JSON to get word-level timestamps
      response_format: 'verbose_json'
    });

    // Extract segments from verbose response
    const segments = extractSegments(transcription);

    // Build response
    const result = {
      transcript: transcription.text,
      segments,
      duration: transcription.duration || calculateDuration(segments),
      language: transcription.language || 'unknown',
      model: 'whisper-1',
      provider: 'openai'
    };

    console.log(`✅ Transcription complete: ${result.transcript.substring(0, 50)}...`);
    console.log(`⏱️  Duration: ${result.duration.toFixed(1)}s, Segments: ${segments.length}`);

    return result;
  } catch (error) {
    console.error('❌ Transcription error:', error.message);
    
    // Re-throw with more context
    if (error.status === 401) {
      throw new Error('Invalid OpenAI API key');
    }
    if (error.status === 429) {
      throw new Error('OpenAI API rate limit exceeded');
    }
    if (error.status === 413) {
      throw new Error('File too large for transcription');
    }
    
    throw error;
  }
}

/**
 * Extract word/phrase segments from Whisper verbose response
 * 
 * @param {Object} transcription - Whisper API response
 * @returns {Array<Object>} Array of segments with timing info
 */
function extractSegments(transcription) {
  const segments = [];

  // Check if we have word-level timestamps (verbose_json response)
  if (transcription.words && Array.isArray(transcription.words)) {
    // Build segments from individual words
    let currentSegment = null;
    const wordsPerSegment = 3; // Group words into small chunks
    let wordCount = 0;

    for (const word of transcription.words) {
      if (!currentSegment) {
        currentSegment = {
          text: word.word,
          start: word.start,
          end: word.end,
          confidence: word.confidence || 1.0
        };
      } else {
        currentSegment.text += ' ' + word.word;
        currentSegment.end = word.end;
        wordCount++;

        if (wordCount >= wordsPerSegment) {
          segments.push(currentSegment);
          currentSegment = null;
          wordCount = 0;
        }
      }
    }

    // Push remaining segment
    if (currentSegment) {
      segments.push(currentSegment);
    }
  } else if (transcription.segments && Array.isArray(transcription.segments)) {
    // Fallback: use segment-level data if available
    return transcription.segments.map(seg => ({
      text: seg.text || '',
      start: seg.start || 0,
      end: seg.end || 0,
      confidence: seg.no_speech_prob ? (1 - seg.no_speech_prob) : 1.0
    }));
  }

  // Fallback: create a single segment from full transcript
  if (segments.length === 0 && transcription.text) {
    segments.push({
      text: transcription.text,
      start: 0,
      end: transcription.duration || 60,
      confidence: 0.95
    });
  }

  return segments;
}

/**
 * Calculate total duration from segments
 * 
 * @param {Array<Object>} segments - Array of segments
 * @returns {number} Total duration in seconds
 */
function calculateDuration(segments) {
  if (!segments || segments.length === 0) return 0;
  const lastSegment = segments[segments.length - 1];
  return lastSegment.end || 0;
}

/**
 * Validate audio file before transcription
 * 
 * @param {string} filePath - Path to audio file
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
function validateAudioFile(filePath, options = {}) {
  const errors = [];

  // Check file exists
  if (!fs.existsSync(filePath)) {
    errors.push('File does not exist');
    return { valid: false, errors };
  }

  // Check file size
  const stats = fs.statSync(filePath);
  const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 25 * 1024 * 1024;
  if (stats.size > maxSize) {
    errors.push(`File size (${stats.size} bytes) exceeds maximum (${maxSize} bytes)`);
  }

  // Check file extension
  const ext = path.extname(filePath).toLowerCase().slice(1);
  const allowed = (process.env.ALLOWED_AUDIO_TYPES || 'mp3,wav,m4a,ogg,webm').split(',');
  if (!allowed.includes(ext)) {
    errors.push(`File extension .${ext} not allowed`);
  }

  return {
    valid: errors.length === 0,
    errors,
    fileSize: stats.size,
    fileName: path.basename(filePath)
  };
}

module.exports = {
  transcribeAudio,
  extractSegments,
  validateAudioFile,
  calculateDuration
};
