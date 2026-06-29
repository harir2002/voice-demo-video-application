/**
 * SummaryCard Component
 * 
 * Displays end-of-demo summary information
 */

import React, { useEffect, useState } from 'react';
import '../styles/SummaryCard.css';

function SummaryCard({ data = null, isVisible = false, onClose }) {
  const [isAnimatingIn, setIsAnimatingIn] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Trigger animation after mounting
      requestAnimationFrame(() => {
        setIsAnimatingIn(true);
      });
    } else {
      setIsAnimatingIn(false);
    }
  }, [isVisible]);

  if (!data || !isVisible) {
    return null;
  }

  return (
    <div className={`summary-card-overlay ${isAnimatingIn ? 'visible' : ''}`}>
      <div className={`summary-card ${isAnimatingIn ? 'slide-in' : ''}`}>
        {/* Close button */}
        <button
          className="summary-close"
          onClick={onClose}
          aria-label="Close summary"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Header */}
        <div className="summary-header">
          <h2 className="summary-title">{data.title || 'Demo Complete'}</h2>
          {data.subtitle && (
            <p className="summary-subtitle">{data.subtitle}</p>
          )}
        </div>

        {/* Fields */}
        {data.fields && Array.isArray(data.fields) && (
          <div className="summary-fields">
            {data.fields.map((field, index) => (
              <div key={index} className="summary-field">
                <span className="field-label">{field.label}</span>
                <span className="field-value">{field.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Description */}
        {data.description && (
          <p className="summary-description">{data.description}</p>
        )}

        {/* Action button */}
        {data.actionLabel && (
          <button className="summary-action" onClick={onClose}>
            {data.actionLabel}
          </button>
        )}

        {/* Decorative element */}
        <div className="summary-decoration">
          <svg viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.1">
            <circle cx="50" cy="50" r="45" />
            <circle cx="50" cy="50" r="35" />
            <circle cx="50" cy="50" r="25" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default SummaryCard;
