/**
 * ConversationLoader Component
 * 
 * Handles loading conversation JSON files from upload or URL
 * 
 * Features:
 * - File upload with validation (size, format, integrity)
 * - URL loading with CORS support
 * - Comprehensive error messages
 * - Two UI modes: compact and large (for empty state)
 * - Accessible with proper ARIA labels
 * 
 * Error Handling:
 * - File size validation (max 5MB)
 * - File type validation (.json only)
 * - Empty file detection
 * - URL format validation
 * - All errors displayed to user with actionable messages
 */

import React, { useRef, useState } from 'react';
import '../styles/ConversationLoader.css';

function ConversationLoader({
  onFileLoad,
  onUrlLoad,
  disabled = false,
  large = false
}) {
  const fileInputRef = useRef(null);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [error, setError] = useState(null);

  const handleFileSelect = (file) => {
    setError(null);

    // Validate file exists
    if (!file) {
      setError('No file selected');
      return;
    }

    // Validate JSON file
    if (!file.name.endsWith('.json')) {
      setError('Only .json files are supported. Please select a conversation.json file.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File too large. Maximum size is 5MB.');
      return;
    }

    if (file.size === 0) {
      setError('File is empty. Please select a valid conversation file.');
      return;
    }

    // Clear input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }

    onFileLoad(file);
  };

  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleUrlSubmit = () => {
    const trimmedUrl = (urlInput || '').trim();

    if (!trimmedUrl) {
      setError('Please enter a URL');
      return;
    }

    // Basic URL validation
    try {
      new URL(trimmedUrl);
    } catch (e) {
      setError('Invalid URL format. Please check and try again.');
      return;
    }

    // Warn about file type
    if (!trimmedUrl.includes('.json')) {
      setError('URL should point to a .json file');
      return;
    }

    setError(null);
    onUrlLoad(trimmedUrl);
    setUrlInput('');
    setShowUrlInput(false);
  };

  const handleClick = () => {
    if (!disabled && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (large) {
    return (
      <div className="conversation-loader-large">
        <div className="loader-card">
          <div className="loader-icon">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
          </div>

          <h3 className="loader-title">Load Conversation</h3>
          <p className="loader-subtitle">Upload a conversation.json file</p>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleInputChange}
            disabled={disabled}
            aria-label="Load conversation JSON"
          />

          <button
            className="loader-btn-file"
            onClick={handleClick}
            disabled={disabled}
            title="Upload conversation file"
          >
            Choose File
          </button>

          <div className="loader-divider">or</div>

          {showUrlInput ? (
            <div className="loader-url-input">
              <input
                type="text"
                placeholder="Enter conversation.json URL"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') handleUrlSubmit();
                }}
              />
              <button
                onClick={handleUrlSubmit}
                disabled={disabled}
              >
                Load
              </button>
              <button
                onClick={() => {
                  setShowUrlInput(false);
                  setUrlInput('');
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="loader-btn-url"
              onClick={() => setShowUrlInput(true)}
              disabled={disabled}
            >
              Load from URL
            </button>
          )}

          {error && (
            <div className="loader-error" role="alert">
              {error}
            </div>
          )}

          <p className="loader-help">
            Sample files:
            <a href="/conversations/generic-demo.json">Generic Demo</a> •
            <a href="/conversations/godrej-finance-demo.json">Godrej Finance</a>
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="conversation-loader">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleInputChange}
        disabled={disabled}
        aria-label="Load conversation JSON"
      />

      <button
        className="loader-btn"
        onClick={handleClick}
        disabled={disabled}
        title="Upload conversation JSON"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <polyline points="8 17 12 21 16 17" />
          <line x1="12" y1="12" x2="12" y2="21" />
          <path d="M20.88 18.09A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.29" />
        </svg>
        Load Conversation
      </button>

      {showUrlInput && (
        <div className="url-input-compact">
          <input
            type="text"
            placeholder="URL"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') handleUrlSubmit();
            }}
          />
          <button onClick={handleUrlSubmit} disabled={disabled}>
            Go
          </button>
        </div>
      )}

      {!showUrlInput && (
        <button
          className="loader-btn-url-icon"
          onClick={() => setShowUrlInput(true)}
          disabled={disabled}
          title="Load from URL"
        >
          🔗
        </button>
      )}

      {error && (
        <div className="loader-error-compact">{error}</div>
      )}
    </div>
  );
}

export default ConversationLoader;
