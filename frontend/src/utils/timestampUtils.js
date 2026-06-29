/**
 * Timestamp Utility Functions
 * 
 * Handles timing synchronization between audio playback and transcript display
 */

/**
 * Find current segments based on playback time
 * 
 * @param {number} currentTime - Current playback time in seconds
 * @param {Array<Object>} segments - Segments array
 * @returns {Object} Current and upcoming segments
 */
export function findCurrentSegments(currentTime, segments = []) {
  if (!segments || segments.length === 0) {
    return {
      current: null,
      upcoming: [],
      revealedText: '',
      nextSegmentTime: null
    };
  }

  // Find all segments up to current time
  const revealedSegments = segments.filter(seg => seg.start <= currentTime);
  const upcomingSegments = segments.filter(seg => seg.start > currentTime);

  // Find current segment (most recent)
  const current = revealedSegments.length > 0 
    ? revealedSegments[revealedSegments.length - 1] 
    : null;

  // Build revealed text
  const revealedText = revealedSegments
    .map(seg => seg.text)
    .join(' ')
    .trim();

  // Find next segment time
  const nextSegmentTime = upcomingSegments.length > 0
    ? upcomingSegments[0].start
    : null;

  return {
    current,
    upcoming: upcomingSegments,
    revealedText,
    nextSegmentTime,
    revealedCount: revealedSegments.length,
    totalCount: segments.length,
    progress: segments.length > 0 
      ? (revealedSegments.length / segments.length) * 100 
      : 0
  };
}

/**
 * Find markers that should be visible at current time
 * 
 * @param {number} currentTime - Current playback time in seconds
 * @param {Array<Object>} markers - Markers array
 * @param {Object} options - Display options
 * @returns {Array<Object>} Visible markers
 */
export function findVisibleMarkers(currentTime, markers = [], options = {}) {
  const { fadeTime = 3000 } = options;
  const fadeTimeSeconds = fadeTime / 1000;

  if (!markers || markers.length === 0) {
    return [];
  }

  // Find markers that should be displayed
  const visibleMarkers = markers.filter(marker => {
    const timeSinceMarker = currentTime - marker.time;
    
    // Show marker from trigger time until fadeTime expires
    return timeSinceMarker >= 0 && timeSinceMarker <= fadeTimeSeconds;
  });

  // Calculate opacity for fade effect
  return visibleMarkers.map(marker => {
    const timeSinceMarker = currentTime - marker.time;
    const progress = timeSinceMarker / fadeTimeSeconds;
    const opacity = Math.max(0, 1 - progress);

    return {
      ...marker,
      opacity,
      isNew: timeSinceMarker < 0.2 // First 200ms is "new"
    };
  });
}

/**
 * Calculate time until next event (segment or marker)
 * 
 * @param {number} currentTime - Current playback time
 * @param {Array<Object>} segments - Segments array
 * @param {Array<Object>} markers - Markers array
 * @returns {number} Time in seconds until next event
 */
export function timeUntilNextEvent(currentTime, segments = [], markers = []) {
  const nextSegmentTime = segments
    .filter(seg => seg.start > currentTime)
    .map(seg => seg.start)
    .reduce((min, time) => Math.min(min, time), Infinity);

  const nextMarkerTime = markers
    .filter(m => m.time > currentTime)
    .map(m => m.time)
    .reduce((min, time) => Math.min(min, time), Infinity);

  const nextTime = Math.min(nextSegmentTime, nextMarkerTime);
  return nextTime === Infinity ? null : Math.max(0, nextTime - currentTime);
}

/**
 * Generate word-level segments if only full transcript available
 * Fallback for when timestamps are unavailable
 * 
 * @param {string} text - Full transcript text
 * @param {number} duration - Audio duration in seconds
 * @returns {Array<Object>} Generated segments
 */
export function generateFallbackSegments(text, duration) {
  if (!text || duration <= 0) {
    return [];
  }

  // Split by words
  const words = text.match(/\b\w+(?:'\w+)?\b|[.,!?;:]/g) || [];
  
  if (words.length === 0) {
    return [{
      text: text,
      start: 0,
      end: duration,
      confidence: 0.8
    }];
  }

  // Distribute words evenly across duration
  const timePerWord = duration / words.length;
  
  // Group words into phrases (3-5 words per segment for readability)
  const groupSize = Math.max(3, Math.floor(words.length / 15));
  const segments = [];

  for (let i = 0; i < words.length; i += groupSize) {
    const group = words.slice(i, i + groupSize);
    const segmentStart = i * timePerWord;
    const segmentEnd = Math.min((i + groupSize) * timePerWord, duration);

    segments.push({
      text: group.join(' '),
      start: segmentStart,
      end: segmentEnd,
      confidence: 0.8
    });
  }

  return segments;
}

/**
 * Check if audio should be playing at given time
 * Considers if we're past duration
 * 
 * @param {number} currentTime - Current time in seconds
 * @param {number} duration - Total duration in seconds
 * @param {boolean} isPlaying - Is player actively playing
 * @returns {boolean} Should audio be playing
 */
export function shouldBePlayingAtTime(currentTime, duration, isPlaying) {
  return isPlaying && currentTime < duration;
}

/**
 * Calculate progress percentage
 * 
 * @param {number} currentTime - Current time
 * @param {number} duration - Total duration
 * @returns {number} Progress 0-100
 */
export function calculateProgress(currentTime, duration) {
  if (duration <= 0) return 0;
  return Math.min(100, (currentTime / duration) * 100);
}

/**
 * Get time range for a segment
 * 
 * @param {Object} segment - Segment object
 * @returns {string} Formatted range like "0:05 - 0:10"
 */
export function getSegmentTimeRange(segment) {
  if (!segment) return '';
  
  const start = formatSeconds(segment.start);
  const end = formatSeconds(segment.end);
  
  return `${start} - ${end}`;
}

/**
 * Format seconds to MM:SS
 * 
 * @param {number} seconds - Seconds to format
 * @returns {string} Formatted time
 */
export function formatSeconds(seconds) {
  if (!seconds || seconds < 0) return '0:00';
  
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  
  return `${mins}:${String(secs).padStart(2, '0')}`;
}

/**
 * Parse playback rate multiplier
 * 
 * @param {string|number} rate - Rate string like "1x", "1.5x", or number
 * @returns {number} Rate multiplier
 */
export function parsePlaybackRate(rate) {
  if (typeof rate === 'number') return Math.max(0.25, Math.min(2, rate));
  
  const parsed = parseFloat(rate);
  return isNaN(parsed) ? 1 : Math.max(0.25, Math.min(2, parsed));
}

/**
 * Interpolate timing for smooth animation between segments
 * 
 * @param {number} currentTime - Current time
 * @param {Object} currentSegment - Current segment
 * @param {Object} nextSegment - Next segment
 * @param {number} totalDuration - Total audio duration
 * @returns {Object} Interpolation data
 */
export function interpolateSegmentTiming(currentTime, currentSegment, nextSegment, totalDuration) {
  if (!currentSegment) {
    return {
      t: 0,
      current: null,
      next: null,
      isBetweenSegments: true
    };
  }

  const segmentDuration = currentSegment.end - currentSegment.start;
  const timeInSegment = currentTime - currentSegment.start;
  const t = segmentDuration > 0 ? timeInSegment / segmentDuration : 0;

  return {
    t: Math.max(0, Math.min(1, t)),
    current: currentSegment,
    next: nextSegment,
    isBetweenSegments: !nextSegment || currentTime >= currentSegment.end,
    timeInSegment,
    segmentDuration
  };
}

export default {
  findCurrentSegments,
  findVisibleMarkers,
  timeUntilNextEvent,
  generateFallbackSegments,
  shouldBePlayingAtTime,
  calculateProgress,
  formatSeconds
};
