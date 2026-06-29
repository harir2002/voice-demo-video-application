/**
 * AudioPlayer Component
 * 
 * Audio playback controls and progress display
 */

import React, { useRef, useEffect, useState } from 'react';
import { formatDuration } from '../utils/api';
import '../styles/AudioPlayer.css';

function AudioPlayer({
  audioUrl,
  onPlayPause,
  onTimeUpdate,
  onEnded,
  isPlaying = false,
  disabled = false,
  fileName = '',
  duration = 0
}) {
  const audioRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [internalDuration, setInternalDuration] = useState(duration);

  // Handle play/pause
  useEffect(() => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.play().catch(err => {
        console.error('Playback error:', err);
      });
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying]);

  // Update duration when metadata loads
  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      const dur = audioRef.current.duration;
      setInternalDuration(dur);
      onTimeUpdate?.(0);
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
    onEnded?.();
  };

  const handleProgressClick = (e) => {
    if (!audioRef.current || disabled) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const newTime = percent * internalDuration;

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const togglePlayPause = () => {
    if (!disabled) {
      onPlayPause?.();
    }
  };

  const handleSkip = (direction) => {
    if (!audioRef.current || disabled) return;

    const skipAmount = 5; // 5 seconds
    const newTime = Math.max(0, Math.min(
      internalDuration,
      audioRef.current.currentTime + (direction * skipAmount)
    ));

    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const displayDuration = internalDuration || duration;
  const progress = displayDuration > 0 ? (currentTime / displayDuration) * 100 : 0;

  return (
    <div className={`audio-player ${disabled ? 'disabled' : ''}`}>
      <audio
        ref={audioRef}
        src={audioUrl}
        onLoadedMetadata={handleLoadedMetadata}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleEnded}
      />

      {/* File info */}
      {fileName && (
        <div className="player-info">
          <span className="player-filename">{fileName}</span>
        </div>
      )}

      {/* Progress bar */}
      <div
        className="player-progress"
        onClick={handleProgressClick}
        role="slider"
        aria-label="Audio progress"
        aria-valuemin="0"
        aria-valuemax={displayDuration}
        aria-valuenow={currentTime}
      >
        <div
          className="progress-bar"
          style={{ width: `${progress}%` }}
        >
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
          disabled={disabled}
          title="Rewind 5s"
          aria-label="Rewind 5 seconds"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
            <text x="12" y="14" fontSize="8" textAnchor="middle" fill="white">5</text>
          </svg>
        </button>

        <button
          className="control-btn play-pause"
          onClick={togglePlayPause}
          disabled={disabled}
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
          disabled={disabled}
          title="Forward 5s"
          aria-label="Forward 5 seconds"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z" />
            <text x="12" y="14" fontSize="8" textAnchor="middle" fill="white">5</text>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default AudioPlayer;
