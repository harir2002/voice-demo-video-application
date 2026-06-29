/**
 * SummaryCard Component
 * 
 * Displays end-of-demo summary information as enterprise handoff panel
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

  // Build breadcrumb from journey or context
  const breadcrumb = data.journey || [];

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

        {/* Decorative top bar */}
        <div className="summary-accent-bar" />

        {/* Header */}
        <div className="summary-header">
          <h2 className="summary-title">{data.title || 'Demo Complete'}</h2>
          {data.subtitle && (
            <p className="summary-subtitle">{data.subtitle}</p>
          )}
        </div>

        {/* Primary fields grid */}
        {data.fields && Array.isArray(data.fields) && data.fields.length > 0 && (
          <div className="summary-fields">
            {data.fields.map((field, index) => (
              <div key={index} className="summary-field">
                <span className="field-label">{field.label}</span>
                <span className="field-value">{field.value}</span>
              </div>
            ))}
          </div>
        )}

        {/* Breadcrumb journey */}
        {breadcrumb && breadcrumb.length > 0 && (
          <div className="summary-breadcrumb">
            <div className="breadcrumb-label">Journey</div>
            <div className="breadcrumb-items">
              {breadcrumb.map((item, index) => (
                <div key={index} className="breadcrumb-item">
                  <span className="breadcrumb-text">{item}</span>
                  {index < breadcrumb.length - 1 && (
                    <span className="breadcrumb-divider">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Description / context captured */}
        {data.description && (
          <div className="summary-description">
            <p>{data.description}</p>
          </div>
        )}

        {/* Escalation reason if present */}
        {data.escalationReason && (
          <div className="summary-escalation">
            <span className="escalation-label">Escalation Reason</span>
            <span className="escalation-text">{data.escalationReason}</span>
          </div>
        )}

        {/* Action buttons */}
        <div className="summary-actions">
          {data.actionLabel && (
            <button className="summary-action primary" onClick={onClose}>
              {data.actionLabel}
            </button>
          )}
          <button className="summary-action secondary" onClick={onClose}>
            Close
          </button>
        </div>

        {/* Decorative background elements */}
        <div className="summary-decoration">
          <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.08">
            <circle cx="100" cy="100" r="90" />
            <circle cx="100" cy="100" r="70" />
            <circle cx="100" cy="100" r="50" />
            <circle cx="100" cy="100" r="30" />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default SummaryCard;
