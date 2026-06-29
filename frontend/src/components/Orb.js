/**
 * Orb Component
 * 
 * Animated central orb with states:
 * - idle: subtle pulsing
 * - processing: spinning animation
 * - speaking: wave/ripple effects
 */

import React from 'react';
import '../styles/Orb.css';

function Orb({ state = 'idle', isPlaying = false }) {
  // idle, processing, speaking, complete

  return (
    <div className={`orb-container orb-${state}`}>
      <div className="orb-wrapper">
        {/* Main orb */}
        <div className="orb-core">
          {/* Inner gradient circle */}
          <div className="orb-inner" />
          
          {/* Outer ring */}
          <div className="orb-ring" />
        </div>

        {/* Ripple effects for speaking state */}
        {(state === 'speaking' || isPlaying) && (
          <>
            <div className="orb-ripple ripple-1" />
            <div className="orb-ripple ripple-2" />
            <div className="orb-ripple ripple-3" />
          </>
        )}

        {/* Spinning indicator for processing */}
        {state === 'processing' && (
          <div className="orb-spinner" />
        )}

        {/* Pulse for idle state */}
        {state === 'idle' && (
          <div className="orb-pulse" />
        )}

        {/* Checkmark for complete state */}
        {state === 'complete' && (
          <div className="orb-checkmark">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        )}
      </div>

      {/* Status text */}
      <div className="orb-status">
        {state === 'idle' && 'Ready'}
        {state === 'processing' && 'Transcribing...'}
        {state === 'speaking' && 'Playing'}
        {state === 'complete' && 'Complete'}
      </div>
    </div>
  );
}

export default Orb;
