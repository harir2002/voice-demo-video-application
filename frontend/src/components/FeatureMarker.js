/**
 * FeatureMarker Component
 * 
 * Displays floating chips for feature markers at specific timestamps
 */

import React, { useState, useEffect } from 'react';
import { findVisibleMarkers } from '../utils/timestampUtils';
import '../styles/FeatureMarker.css';

function FeatureMarker({ markers = [], currentTime = 0 }) {
  const [visibleMarkers, setVisibleMarkers] = useState([]);

  // Find visible markers based on current time
  useEffect(() => {
    const visible = findVisibleMarkers(currentTime, markers, {
      fadeTime: 3000
    });
    setVisibleMarkers(visible);
  }, [currentTime, markers]);

  if (!visibleMarkers || visibleMarkers.length === 0) {
    return null;
  }

  return (
    <div className="feature-markers">
      {visibleMarkers.map((marker, index) => (
        <div
          key={`${marker.time}-${index}`}
          className={`feature-chip ${marker.type || 'feature'} ${marker.isNew ? 'is-new' : ''}`}
          style={{ opacity: marker.opacity }}
        >
          {/* Chip icon based on type */}
          <span className="chip-icon">
            {marker.type === 'milestone' ? (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.72 6.36L9.36 14.72c-.77.77-.77 2.02 0 2.79l.02.02c.77.77 2.02.77 2.79 0l8.36-8.36c.77-.77.77-2.02 0-2.79-.77-.77-2.02-.77-2.79-.1z" />
                <path d="M16.5 12l1.96 1.96c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41L17.91 10.59c-.39-.39-1.02-.39-1.41 0-.39.39-.39 1.02 0 1.41z" />
              </svg>
            )}
          </span>

          {/* Label */}
          <span className="chip-label">{marker.label}</span>

          {/* Animation indicator */}
          <span className="chip-pulse" />
        </div>
      ))}
    </div>
  );
}

export default FeatureMarker;
