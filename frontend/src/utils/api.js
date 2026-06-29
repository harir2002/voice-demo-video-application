/**
 * API Utility Functions
 * 
 * Handles all communication with the backend
 */

import { API_TRANSCRIBE_ENDPOINT, AUDIO_UPLOAD_MAX_SIZE, SUPPORTED_AUDIO_TYPES } from '../config';

/**
 * Upload and transcribe an audio file
 * 
 * @param {File} audioFile - Audio file to upload
 * @param {Function} onProgress - Callback for progress updates
 * @returns {Promise<Object>} Transcription result
 */
export async function uploadAndTranscribe(audioFile, onProgress = null) {
  // Validate file
  const validation = validateAudioFile(audioFile);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  // Create form data
  const formData = new FormData();
  formData.append('audio', audioFile);

  try {
    // Upload file
    const xhr = new XMLHttpRequest();

    return new Promise((resolve, reject) => {
      // Progress tracking
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable && onProgress) {
          const percentComplete = (e.loaded / e.total) * 100;
          onProgress({ loaded: e.loaded, total: e.total, percent: percentComplete });
        }
      });

      // Completion
      xhr.addEventListener('load', () => {
        try {
          if (xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            if (response.success) {
              resolve(response);
            } else {
              reject(new Error(response.error || 'Transcription failed'));
            }
          } else {
            const error = JSON.parse(xhr.responseText);
            reject(new Error(error.error || 'Transcription failed'));
          }
        } catch (e) {
          reject(new Error('Invalid response from server'));
        }
      });

      // Error
      xhr.addEventListener('error', () => {
        reject(new Error('Network error - could not reach server'));
      });

      xhr.addEventListener('abort', () => {
        reject(new Error('Upload cancelled'));
      });

      // Send request
      xhr.open('POST', API_TRANSCRIBE_ENDPOINT);
      xhr.send(formData);
    });
  } catch (error) {
    throw error;
  }
}

/**
 * Validate audio file before upload
 * 
 * @param {File} file - File to validate
 * @returns {Object} Validation result
 */
export function validateAudioFile(file) {
  // Check file exists
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  // Check file size
  if (file.size > AUDIO_UPLOAD_MAX_SIZE) {
    const maxSizeMB = AUDIO_UPLOAD_MAX_SIZE / 1024 / 1024;
    return { valid: false, error: `File is too large. Maximum size is ${maxSizeMB}MB.` };
  }

  // Check file type
  if (!SUPPORTED_AUDIO_TYPES.includes(file.type)) {
    return { valid: false, error: 'File format not supported. Please use MP3, WAV, M4A, OGG, or WEBM.' };
  }

  return { valid: true };
}

/**
 * Load scenario JSON file
 * 
 * @param {File} file - JSON scenario file
 * @returns {Promise<Object>} Scenario configuration
 */
export async function loadScenarioFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const scenario = JSON.parse(e.target.result);
        validateScenario(scenario);
        resolve(scenario);
      } catch (error) {
        reject(new Error(`Invalid scenario file: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read scenario file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Validate scenario JSON structure
 * 
 * @param {Object} scenario - Scenario to validate
 * @throws {Error} If scenario is invalid
 */
export function validateScenario(scenario) {
  if (!scenario || typeof scenario !== 'object') {
    throw new Error('Scenario must be a JSON object');
  }

  // Optional fields
  if (scenario.title && typeof scenario.title !== 'string') {
    throw new Error('Scenario.title must be a string');
  }

  if (scenario.subtitle && typeof scenario.subtitle !== 'string') {
    throw new Error('Scenario.subtitle must be a string');
  }

  // Validate markers if present
  if (scenario.markers) {
    if (!Array.isArray(scenario.markers)) {
      throw new Error('Scenario.markers must be an array');
    }

    scenario.markers.forEach((marker, index) => {
      if (!marker.time || typeof marker.time !== 'number') {
        throw new Error(`Marker ${index} must have a numeric 'time' field`);
      }
      if (!marker.label || typeof marker.label !== 'string') {
        throw new Error(`Marker ${index} must have a 'label' field`);
      }
      if (marker.type && typeof marker.type !== 'string') {
        throw new Error(`Marker ${index} has invalid 'type' field`);
      }
    });
  }

  // Validate summary card if present
  if (scenario.summaryCard) {
    if (typeof scenario.summaryCard !== 'object') {
      throw new Error('Scenario.summaryCard must be an object');
    }
    if (scenario.summaryCard.title && typeof scenario.summaryCard.title !== 'string') {
      throw new Error('Scenario.summaryCard.title must be a string');
    }
    if (scenario.summaryCard.fields && !Array.isArray(scenario.summaryCard.fields)) {
      throw new Error('Scenario.summaryCard.fields must be an array');
    }
  }
}

/**
 * Format file size for display
 * 
 * @param {number} bytes - File size in bytes
 * @returns {string} Formatted size (e.g., "2.5 MB")
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format duration in seconds to MM:SS format
 * 
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted time (e.g., "1:23")
 */
export function formatDuration(seconds) {
  if (!seconds || seconds < 0) return '0:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

/**
 * Parse timestamp from string (e.g., "1:23" -> 83 seconds)
 * 
 * @param {string} timeStr - Time string (MM:SS or H:MM:SS)
 * @returns {number} Seconds
 */
export function parseTimestamp(timeStr) {
  const parts = timeStr.split(':').map(Number);

  if (parts.length === 2) {
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 3) {
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  }

  return 0;
}

/**
 * Check if backend is available
 * 
 * @returns {Promise<boolean>} True if backend is available
 */
export async function checkBackendHealth() {
  try {
    const response = await fetch(`${API_TRANSCRIBE_ENDPOINT.replace('/api/transcribe', '/health')}`, {
      method: 'GET',
      timeout: 5000
    });
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
}
