/**
 * Transcription Utility
 * 
 * Handles audio transcription via OpenAI Whisper API.
 * Can be extended to support other transcription providers.
 */

const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const OpenAI = require('openai');

// Initialize OpenAI if API key is available
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
} else {
  console.warn('⚠️  OPENAI_API_KEY not set. Will try Python transcription service.');
}

/**
 * Transcribe using Python service (Sarvam or OpenAI)
 * 
 * @param {string} filePath - Path to audio file
 * @param {Object} options - Options
 * @returns {Promise<Object>} Transcription result
 */
async function transcribeWithPython(filePath, options = {}) {
  return new Promise((resolve, reject) => {
    const pythonScript = path.join(__dirname, 'transcriptionPython.py');
    const service = options.service || 'sarvam'; // 'sarvam' or 'openai'
    const apiKey = options.apiKey || 
      (service === 'sarvam' ? process.env.SARVAM_API_KEY : process.env.OPENAI_API_KEY);

    if (!apiKey) {
      return reject(new Error(`${service.toUpperCase()}_API_KEY environment variable is required`));
    }

    console.log(`🐍 Calling Python transcription service (${service})...`);

    const python = spawn('python3', [pythonScript, filePath, apiKey, service]);
    let output = '';
    let errorOutput = '';

    python.stdout.on('data', (data) => {
      output += data.toString();
    });

    python.stderr.on('data', (data) => {
      errorOutput += data.toString();
    });

    python.on('close', (code) => {
      if (code !== 0) {
        console.error('❌ Python error:', errorOutput);
        return reject(new Error(`Python transcription failed: ${errorOutput}`));
      }

      try {
        const result = JSON.parse(output);
        
        if (!result.success) {
          return reject(new Error(result.error || 'Transcription failed'));
        }

        // Transform to standard format
        const transcript = result.transcript;
        const segments = transformTranscriptToSegments(transcript);

        resolve({
          transcript,
          segments,
          duration: result.duration || calculateDuration(segments),
          language: result.language || 'en',
          provider: service,
          confidence: result.confidence
        });
      } catch (e) {
        reject(new Error(`Failed to parse Python output: ${e.message}`));
      }
    });
  });
}

/**
 * Transform transcript text into segments
 * 
 * @param {string} transcript - Full transcript text
 * @returns {Array<Object>} Array of segments
 */
function transformTranscriptToSegments(transcript) {
  if (!transcript) return [];

  // Split into sentences
  const sentences = transcript.match(/[^.!?]+[.!?]+/g) || [transcript];
  
  let currentTime = 0;
  const segments = [];

  for (const sentence of sentences) {
    const text = sentence.trim();
    if (!text) continue;

    // Estimate segment duration (average speaking rate: 150 words/min = 2.5 words/sec)
    const wordCount = text.split(/\s+/).length;
    const duration = Math.max(1.0, wordCount / 2.5);

    segments.push({
      text,
      start: currentTime,
      end: currentTime + duration,
      confidence: 0.95
    });

    currentTime += duration;
  }

  return segments;
}

/**
 * Transcribe an audio file
 * Tries Python service first, falls back to OpenAI
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

    let result;

    // Try Python service first (if SARVAM_API_KEY is set)
    if (process.env.SARVAM_API_KEY && !options.forceOpenAI) {
      try {
        result = await transcribeWithPython(filePath, {
          service: 'sarvam',
          apiKey: process.env.SARVAM_API_KEY
        });
      } catch (error) {
        console.warn('⚠️  Sarvam transcription failed, trying OpenAI...', error.message);
        if (openai) {
          result = await transcribeWithOpenAI(filePath, options);
        } else {
          throw new Error('No transcription service available');
        }
      }
    } 
    // Use OpenAI if available
    else if (openai) {
      result = await transcribeWithOpenAI(filePath, options);
    }
    // Fall back to Python service with OpenAI
    else if (process.env.OPENAI_API_KEY) {
      result = await transcribeWithPython(filePath, {
        service: 'openai',
        apiKey: process.env.OPENAI_API_KEY
      });
    }
    else {
      throw new Error('No transcription service configured. Set OPENAI_API_KEY or SARVAM_API_KEY');
    }

    console.log(`✅ Transcription complete: ${result.transcript.substring(0, 50)}...`);
    console.log(`⏱️  Duration: ${result.duration.toFixed(1)}s, Segments: ${result.segments.length}`);

    return result;
  } catch (error) {
    console.error('❌ Transcription error:', error.message);
    throw error;
  }
}

/**
 * Transcribe with OpenAI Whisper API
 */
async function transcribeWithOpenAI(filePath, options = {}) {
  const audioFile = fs.createReadStream(filePath);

  const transcription = await openai.audio.transcriptions.create({
    file: audioFile,
    model: 'whisper-1',
    language: options.language || undefined,
    temperature: options.temperature || 0,
    response_format: 'verbose_json'
  });

  const segments = extractSegments(transcription);

  return {
    transcript: transcription.text,
    segments,
    duration: transcription.duration || calculateDuration(segments),
    language: transcription.language || 'unknown',
    model: 'whisper-1',
    provider: 'openai'
  };
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
