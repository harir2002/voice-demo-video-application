/**
 * Conversation Manager Utilities
 * 
 * Handles loading, validating, and managing conversation JSON files
 */

/**
 * Load conversation from JSON file
 * 
 * @param {File} file - JSON file to load
 * @returns {Promise<Object>} Parsed conversation object
 */
export async function loadConversationFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const content = e.target.result;
        const data = JSON.parse(content);
        resolve(data);
      } catch (error) {
        reject(new Error(`Invalid JSON: ${error.message}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };

    reader.readAsText(file);
  });
}

/**
 * Validate conversation structure
 * 
 * @param {Object} conversation - Conversation object to validate
 * @returns {Object} Validation result { valid: boolean, errors: string[] }
 */
export function validateConversation(conversation) {
  const errors = [];

  if (!conversation || typeof conversation !== 'object') {
    errors.push('Conversation must be an object');
    return { valid: false, errors };
  }

  // Check required fields
  if (!conversation.version) {
    errors.push('Missing "version" field');
  }

  if (!conversation.title) {
    errors.push('Missing "title" field');
  }

  // Check segments
  if (!Array.isArray(conversation.segments)) {
    errors.push('Missing or invalid "segments" array');
    return { valid: false, errors };
  }

  if (conversation.segments.length === 0) {
    errors.push('At least one segment is required');
    return { valid: false, errors };
  }

  // Validate each segment
  conversation.segments.forEach((segment, index) => {
    const segmentErrors = validateSegment(segment, index);
    errors.push(...segmentErrors);
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Validate individual segment
 * 
 * @param {Object} segment - Segment to validate
 * @param {number} index - Segment index
 * @returns {string[]} Array of error messages
 */
function validateSegment(segment, index) {
  const errors = [];

  if (!segment.id) {
    errors.push(`Segment ${index}: Missing "id"`);
  }

  if (!segment.speaker) {
    errors.push(`Segment ${index}: Missing "speaker"`);
  } else if (!['customer', 'ai', 'agent'].includes(segment.speaker)) {
    errors.push(`Segment ${index}: Invalid speaker "${segment.speaker}"`);
  }

  if (!segment.audioFile) {
    errors.push(`Segment ${index}: Missing "audioFile"`);
  }

  if (!segment.transcript) {
    errors.push(`Segment ${index}: Missing "transcript"`);
  }

  if (segment.timestamps) {
    if (!Array.isArray(segment.timestamps)) {
      errors.push(`Segment ${index}: "timestamps" must be an array`);
    } else {
      // Check timestamps are in order
      for (let i = 1; i < segment.timestamps.length; i++) {
        if (segment.timestamps[i].time < segment.timestamps[i - 1].time) {
          errors.push(`Segment ${index}: Timestamps not in ascending order`);
          break;
        }
      }
    }
  }

  if (segment.features) {
    if (!Array.isArray(segment.features)) {
      errors.push(`Segment ${index}: "features" must be an array`);
    }
  }

  if (segment.delayAfter && typeof segment.delayAfter !== 'number') {
    errors.push(`Segment ${index}: "delayAfter" must be a number`);
  }

  return errors;
}

/**
 * Format duration in seconds to MM:SS or H:MM:SS
 * 
 * @param {number} seconds - Duration in seconds
 * @returns {string} Formatted time string
 */
export function formatDuration(seconds) {
  if (!seconds || seconds < 0 || !Number.isFinite(seconds)) return '0:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  }

  return `${minutes}:${String(secs).padStart(2, '0')}`;
}

/**
 * Calculate total conversation duration
 * 
 * @param {Object} conversation - Conversation object
 * @returns {number} Total duration in seconds
 */
export function calculateTotalDuration(conversation) {
  if (!conversation?.segments) return 0;

  let total = 0;
  conversation.segments.forEach(segment => {
    total += (segment.duration || 0);
    total += (segment.delayAfter || 0);
  });

  return total;
}

/**
 * Get current segment info with progress
 * 
 * @param {Object} conversation - Conversation object
 * @param {number} segmentIndex - Current segment index
 * @param {number} segmentTime - Current time within segment
 * @returns {Object} Segment info with progress
 */
export function getCurrentSegmentInfo(conversation, segmentIndex, segmentTime) {
  const segment = conversation?.segments?.[segmentIndex];

  if (!segment) {
    return null;
  }

  const duration = segment.duration || 0;
  const progress = duration > 0 ? (segmentTime / duration) * 100 : 0;

  return {
    segment,
    index: segmentIndex,
    time: segmentTime,
    duration,
    progress,
    totalSegments: conversation?.segments?.length || 0,
    isLastSegment: segmentIndex === (conversation?.segments?.length - 1)
  };
}

/**
 * Find visible features for current time/segment
 * 
 * @param {Object} segment - Current segment
 * @returns {Array} Array of visible features
 */
export function getVisibleFeatures(segment) {
  if (!segment?.features) return [];

  return segment.features.map(feature => ({
    ...feature,
    id: `${segment.id}-${feature.marker}`
  }));
}

/**
 * Export conversation as JSON
 * 
 * @param {Object} conversation - Conversation object
 * @returns {string} JSON string
 */
export function exportConversationAsJson(conversation) {
  return JSON.stringify(conversation, null, 2);
}

/**
 * Download conversation as JSON file
 * 
 * @param {Object} conversation - Conversation object
 * @param {string} filename - Optional filename (default: conversation.json)
 */
export function downloadConversation(conversation, filename = 'conversation.json') {
  const json = exportConversationAsJson(conversation);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Validate audio file accessibility
 * Checks if audio file URL is valid
 * 
 * @param {string} audioUrl - Audio file URL or path
 * @returns {Promise<boolean>} True if audio is accessible
 */
export async function validateAudioFile(audioUrl) {
  try {
    const response = await fetch(audioUrl, {
      method: 'HEAD',
      mode: 'no-cors'
    });
    return response.ok;
  } catch (error) {
    console.warn(`Audio file not accessible: ${audioUrl}`, error);
    return false;
  }
}

/**
 * Get speaker display name
 * 
 * @param {string} speaker - Speaker role (ai, customer, agent)
 * @returns {string} Display name
 */
export function getSpeakerDisplayName(speaker) {
  const names = {
    ai: 'AI Assistant',
    customer: 'Customer',
    agent: 'Agent'
  };
  return names[speaker] || 'Speaker';
}

/**
 * Get speaker color for UI
 * 
 * @param {string} speaker - Speaker role
 * @returns {string} Color code
 */
export function getSpeakerColor(speaker) {
  const colors = {
    ai: '#0066FF',
    customer: '#00CC88',
    agent: '#FF6600'
  };
  return colors[speaker] || '#999999';
}
