/**
 * UploadZone Component
 * 
 * Drag-and-drop and file picker for audio uploads
 */

import React, { useRef, useState } from 'react';
import { validateAudioFile, formatFileSize } from '../utils/api';
import '../styles/UploadZone.css';

function UploadZone({ onFileSelect, disabled = false, loading = false }) {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = (file) => {
    setError(null);

    // Validate
    const validation = validateAudioFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    // Call parent handler
    onFileSelect(file);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!disabled && !loading) {
      setDragActive(e.type === 'dragenter' || e.type === 'dragover');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);

    if (disabled || loading) return;

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled && !loading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div
      className={`upload-zone ${dragActive ? 'drag-active' : ''} ${disabled || loading ? 'disabled' : ''}`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={handleClick}
      role="button"
      tabIndex={disabled ? -1 : 0}
      onKeyPress={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleClick();
        }
      }}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/mp3,audio/wav,audio/mp4,audio/ogg,audio/webm,.mp3,.wav,.m4a,.ogg,.webm"
        onChange={handleInputChange}
        disabled={disabled || loading}
        aria-label="Upload audio file"
      />

      <div className="upload-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="17 8 12 3 7 8" />
          <line x1="12" y1="3" x2="12" y2="15" />
        </svg>
      </div>

      <h3 className="upload-title">
        {loading ? 'Processing...' : 'Drop audio here'}
      </h3>

      <p className="upload-subtitle">
        {loading ? 'Please wait' : 'or click to select'}
      </p>

      <p className="upload-formats">
        MP3, WAV, M4A, OGG, WEBM • Max 25MB
      </p>

      {error && (
        <div className="upload-error" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}

export default UploadZone;
