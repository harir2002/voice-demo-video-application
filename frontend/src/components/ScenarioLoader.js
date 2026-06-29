/**
 * ScenarioLoader Component
 * 
 * Allows loading optional JSON scenario configuration
 */

import React, { useRef, useState } from 'react';
import { loadScenarioFile } from '../utils/api';
import '../styles/ScenarioLoader.css';

function ScenarioLoader({ onScenarioLoad, disabled = false, hasScenario = false }) {
  const fileInputRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileSelect = async (file) => {
    setError(null);
    setLoading(true);

    try {
      const scenario = await loadScenarioFile(file);
      onScenarioLoad(scenario);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleInputChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleClick = () => {
    if (!disabled && !loading && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`scenario-loader ${hasScenario ? 'has-scenario' : ''} ${disabled || loading ? 'disabled' : ''}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleInputChange}
        disabled={disabled || loading}
        aria-label="Load scenario JSON"
      />

      <button
        className="scenario-btn"
        onClick={handleClick}
        disabled={disabled || loading}
        title="Load scenario configuration"
        aria-label="Load scenario JSON file"
      >
        <svg className="scenario-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {hasScenario ? (
            <polyline points="20 6 9 17 4 12" />
          ) : (
            <path d="M9 13h6m-3-3v6M19 13a7 7 0 1 1-14 0 7 7 0 0 1 14 0z" />
          )}
        </svg>
        <span className="scenario-text">
          {hasScenario ? 'Scenario loaded' : 'Load scenario'}
        </span>
      </button>

      {error && (
        <div className="scenario-error" role="alert">
          {error}
        </div>
      )}

      {loading && (
        <div className="scenario-loading">
          Loading...
        </div>
      )}

      {/* Info tooltip */}
      <div className="scenario-tooltip">
        <p><strong>Scenario file</strong> (optional)</p>
        <p>Upload a JSON file to add feature markers and summary cards.</p>
        <code>{`{
  "title": "Demo Title",
  "markers": [
    {"time": 5, "label": "Feature 1"}
  ]
}`}</code>
      </div>
    </div>
  );
}

export default ScenarioLoader;
