/**
 * Frontend Configuration
 * 
 * Centralized configuration for API endpoints, upload limits, and feature flags
 */

// API Configuration
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
export const API_TRANSCRIBE_ENDPOINT = `${API_BASE_URL}/api/transcribe`;
export const API_HEALTH_ENDPOINT = `${API_BASE_URL}/health`;

// File Upload Configuration
export const AUDIO_UPLOAD_MAX_SIZE = 25 * 1024 * 1024; // 25MB
export const SUPPORTED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/wav',
  'audio/mp4',
  'audio/ogg',
  'audio/webm',
  'audio/x-wav',
  'audio/x-m4a'
];

// Audio MIME type to extension mapping
export const MIME_TO_EXT = {
  'audio/mpeg': 'mp3',
  'audio/wav': 'wav',
  'audio/mp4': 'm4a',
  'audio/ogg': 'ogg',
  'audio/webm': 'webm',
  'audio/x-wav': 'wav',
  'audio/x-m4a': 'm4a'
};

// UI Configuration
export const ORB_ANIMATION_SPEED = 2; // seconds for one full rotation
export const TRANSCRIPT_REVEAL_DELAY = 50; // ms between word reveals
export const FEATURE_MARKER_FADE_TIME = 3000; // ms to keep marker visible
export const SUMMARY_CARD_ANIMATION_TIME = 500; // ms for card slide-in

// Feature Flags
export const FEATURES = {
  AUTO_PLAY_ON_TRANSCRIBE: true, // Auto-play when transcription completes
  SHOW_CONFIDENCE_SCORES: false, // Show confidence percentages
  ENABLE_MARKERS: true, // Support scenario markers
  ENABLE_SUMMARY_CARD: true, // Support summary card at end
  ENABLE_SCENARIO_UPLOAD: true, // Allow JSON scenario upload
  DEBUG_MODE: false // Show debug info in console
};

// Keyboard Shortcuts
export const SHORTCUTS = {
  PLAY_PAUSE: ' ', // Space
  UPLOAD: 'u',
  RESET: 'r'
};

// Default messages
export const MESSAGES = {
  UPLOADING: 'Uploading audio...',
  TRANSCRIBING: 'Transcribing audio...',
  READY: 'Ready to play',
  PLAYING: 'Playing...',
  PAUSED: 'Paused',
  COMPLETED: 'Completed',
  ERROR_UPLOAD_FAILED: 'Upload failed. Please try again.',
  ERROR_TRANSCRIBE_FAILED: 'Transcription failed. Please check your audio file.',
  ERROR_FILE_TOO_LARGE: 'File is too large. Maximum size is 25MB.',
  ERROR_FILE_NOT_SUPPORTED: 'File format not supported. Please use MP3, WAV, M4A, OGG, or WEBM.'
};

// Logging
export const LOG_LEVEL = process.env.REACT_APP_LOG_LEVEL || 'info'; // 'debug', 'info', 'warn', 'error'

export default {
  API_BASE_URL,
  API_TRANSCRIBE_ENDPOINT,
  API_HEALTH_ENDPOINT,
  AUDIO_UPLOAD_MAX_SIZE,
  SUPPORTED_AUDIO_TYPES,
  ORB_ANIMATION_SPEED,
  TRANSCRIPT_REVEAL_DELAY,
  FEATURES,
  MESSAGES,
  LOG_LEVEL
};
