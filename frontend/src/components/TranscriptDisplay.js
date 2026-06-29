/**
 * TranscriptDisplay Component
 * 
 * Renders transcript with progressive reveal based on playback time
 */

import React, { useMemo, useState, useEffect } from 'react';
import { findCurrentSegments } from '../utils/timestampUtils';
import '../styles/Transcript.css';

function TranscriptDisplay({
  segments = [],
  currentTime = 0,
  isPlaying = false,
  fullTranscript = '',
  confidence = 1.0
}) {
  const [displaySegments, setDisplaySegments] = useState([]);

  // Find current segments and update display
  useEffect(() => {
    const result = findCurrentSegments(currentTime, segments);
    
    setDisplaySegments({
      revealed: result.revealedText,
      upcoming: segments.slice(result.revealedCount),
      revealedCount: result.revealedCount,
      totalCount: result.totalCount,
      progress: result.progress
    });
  }, [currentTime, segments]);

  // Fallback to full transcript if no segments
  const hasSegments = segments && segments.length > 0;
  const currentDisplay = displaySegments.revealed || fullTranscript;

  return (
    <div className="transcript-display">
      {/* Header */}
      <div className="transcript-header">
        <h2 className="transcript-title">
          {isPlaying ? 'Now Playing' : 'Transcript'}
        </h2>
        
        {hasSegments && (
          <div className="transcript-progress">
            <span className="progress-text">
              {displaySegments.revealedCount} / {displaySegments.totalCount}
            </span>
            <div className="progress-bar-small">
              <div
                className="progress-fill"
                style={{ width: `${displaySegments.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Main transcript area */}
      <div className="transcript-content">
        {currentDisplay ? (
          <p className="transcript-text">
            {/* Revealed text - shown normally */}
            <span className="text-revealed">
              {displaySegments.revealed || currentDisplay}
            </span>

            {/* Upcoming text - shown dimly if available */}
            {hasSegments && displaySegments.upcoming.length > 0 && (
              <>
                <span className="text-separator">{' '}</span>
                <span className="text-upcoming">
                  {displaySegments.upcoming.map(seg => seg.text).join(' ')}
                </span>
              </>
            )}
          </p>
        ) : (
          <p className="transcript-empty">
            Transcript will appear here during playback...
          </p>
        )}
      </div>

      {/* Confidence indicator (if available) */}
      {confidence && confidence < 1.0 && (
        <div className="transcript-confidence">
          <svg className="icon-info" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
          <span>Confidence: {Math.round(confidence * 100)}%</span>
        </div>
      )}

      {/* Statistics */}
      <div className="transcript-stats">
        <span>{currentDisplay.split(/\s+/).filter(w => w).length} words</span>
      </div>
    </div>
  );
}

export default TranscriptDisplay;
