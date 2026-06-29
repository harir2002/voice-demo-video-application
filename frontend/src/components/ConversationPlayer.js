/**
 * ConversationPlayer Component
 * 
 * Handles sequential playback of multiple audio segments
 * Manages inter-segment delays and transitions
 */

import React, { useRef, useEffect, useState, forwardRef } from 'react';
import { formatDuration } from '../utils/conversationManager';
import '../styles/ConversationPlayer.css';

const ConversationPlayer = forwardRef(({
  segment,
  isPlaying = false,
  onPlayPause,
  onTimeUpdate,
  onSegmentEnd,
  currentSegmentIndex = 0,
  totalSegments = 0,
  onSegmentChange
}, ref) => {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current || !segment?.audioFile) return;

    if (isPlaying) {
      // Check if audio file exists
      audioRef.current
        .play()
        .catch(err => {
          console.error('Playback error:', err);
          // If audio fails, try to skip to next segment
          if (onSegmentEnd) {
            onSegmentEnd();
          }
        });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, segment]);

  // Update when segment changes
  useEffect(() => {
    if (audioRef.current && segment?.audioFile) {
      audioRef.current.src = segment.audioFile;
      setCurrentTime(0);
      setDuration(0);
    }
  }, [segment?.audioFile]);

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const dur = audioRef.current.duration;
      setDuration(dur);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const time = audioRef.current.currentTime;
      setCurrentTime(time);
      onTimeUpdate?.(time);
    }
  };

  const handleEnded = () => {
    onSegmentEnd?.();
  };

  const handleProgressClick = (e) => {
    if (!audioRef.current || !segment) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * duration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const togglePlayPause = () => {
    onPlayPause?.();
  };

  const handleSkip = (direction) => {
    if (!audioRef.current) return;

    const skipAmount = 5;
    const newTime = Math.max(0, Math.min(
      duration,
      audioRef.current.currentTime + (direction * skipAmount)
    ));

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const goToSegment = (index) => {
    if (index !== currentSegmentIndex) {
      onSegmentChange?.(index);
      setCurrentTime(0);
    }
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const displayDuration = duration || segment?.duration || 0;

  return (
    <div className="conversation-player">
      <audio
        ref={audioRef}
        src={segment?.audioFile}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
        crossOrigin="anonymous"
      />

      {/* Segment thumbnails/tabs */}
      <div className="segment-tabs">
        {totalSegments > 0 && (
          <div className="tabs-container">
            {Array.from({ length: totalSegments }).map((_, idx) => (
              <button
                key={idx}
                className={`segment-tab ${idx === currentSegmentIndex ? 'active' : ''}`}
                onClick={() => goToSegment(idx)}
                title={`Segment ${idx + 1}`}
              >
                <span className="tab-number">{idx + 1}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Progress bar */}
      <div
        className="player-progress"
        onClick={handleProgressClick}
        role="slider"
        aria-label="Playback progress"
        aria-valuemin="0"
        aria-valuemax={displayDuration}
        aria-valuenow={currentTime}
      >
        <div className="progress-bar" style={{ width: `${progress}%` }}>
          <div className="progress-handle" />
        </div>
      </div>

      {/* Time display */}
      <div className="player-time">
        <span className="current-time">{formatDuration(currentTime)}</span>
        <span className="total-time">{formatDuration(displayDuration)}</span>
      </div>

      {/* Controls */}
      <div className="player-controls">
        <button
          className="control-btn skip-back"
          onClick={() => handleSkip(-1)}
          disabled={!segment}
          title="Rewind 5s"
          aria-label="Rewind 5 seconds"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
          </svg>
        </button>

        <button
          className="control-btn play-pause"
          onClick={togglePlayPause}
          disabled={!segment}
          title={isPlaying ? 'Pause' : 'Play'}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          )}
        </button>

        <button
          className="control-btn skip-forward"
          onClick={() => handleSkip(1)}
          disabled={!segment}
          title="Forward 5s"
          aria-label="Forward 5 seconds"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z" />
          </svg>
        </button>
      </div>
    </div>
  );
});

ConversationPlayer.displayName = 'ConversationPlayer';

export default ConversationPlayer;
