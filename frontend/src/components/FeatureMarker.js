/**
 * FeatureMarker Component
 * 
 * Displays floating chips for segment-level feature markers
 * Shows enterprise voice AI capabilities at key moments
 * 
 * Features:
 * - Automatic chip entrance/exit animations
 * - Maximum 4 visible chips to prevent clutter
 * - Segment-level markers appear immediately when segment starts
 * - Progressive markers based on timestamp within segment
 * - Type-based icon and color coding
 * - Accessibility support for screen readers
 */

import React, { useState, useEffect, useMemo } from 'react';
import '../styles/FeatureMarker.css';

const MAX_VISIBLE_FEATURES = 4; // Prevent visual clutter

function FeatureMarker({ 
  features = [], 
  currentTime = 0,
  currentSegmentIndex = 0,
  segment = null 
}) {
  const [visibleFeatures, setVisibleFeatures] = useState([]);
  const [shownFeatureIds, setShownFeatureIds] = useState(new Set());

  // Parse feature markers from segment or props
  const segmentFeatures = useMemo(() => {
    const result = [];
    
    // If we have a segment with features array, use those
    if (segment?.features && Array.isArray(segment.features)) {
      segment.features.forEach((feature, idx) => {
        // Segment-level features appear at segment start
        result.push({
          id: `seg-${currentSegmentIndex}-${idx}`,
          label: feature.label || feature.name || feature.marker || feature,
          type: feature.type || feature.marker || 'feature',
          timing: 'immediate', // Show immediately when segment starts
          timestamp: 0,
          description: feature.description
        });
      });
    }

    // Merge with time-based features if provided
    if (features && Array.isArray(features)) {
      features.forEach((feature, idx) => {
        result.push({
          id: `time-${currentSegmentIndex}-${idx}`,
          label: feature.label || feature.name || feature.marker || feature,
          type: feature.type || feature.marker || 'feature',
          timing: feature.timing || 'progressive',
          timestamp: feature.timestamp || 0,
          description: feature.description
        });
      });
    }

    return result;
  }, [segment, features, currentSegmentIndex]);

  // Determine which features should be visible with max limit
  useEffect(() => {
    const visibleSet = [];
    const nowShown = new Set(shownFeatureIds);

    // First pass: collect eligible features in order
    const eligibleFeatures = [];
    
    segmentFeatures.forEach(feature => {
      // For immediate features at segment start (within first second)
      if (feature.timing === 'immediate' && currentTime < 1.0) {
        eligibleFeatures.push(feature);
      }
      // For progressive features based on time (with small tolerance for timing sync)
      else if (feature.timing === 'progressive' && currentTime >= (feature.timestamp - 0.1)) {
        eligibleFeatures.push(feature);
      }
    });

    // Second pass: limit to MAX_VISIBLE_FEATURES, prioritizing new features
    const newFeatures = eligibleFeatures.filter(f => !shownFeatureIds.has(f.id));
    const keptFeatures = eligibleFeatures.filter(f => shownFeatureIds.has(f.id));
    
    // Show new features first (up to capacity), then keep previous
    const toShow = [
      ...newFeatures.slice(0, Math.min(MAX_VISIBLE_FEATURES, MAX_VISIBLE_FEATURES - keptFeatures.length)),
      ...keptFeatures.slice(0, MAX_VISIBLE_FEATURES)
    ].slice(0, MAX_VISIBLE_FEATURES);

    toShow.forEach(feature => {
      if (!shownFeatureIds.has(feature.id)) {
        feature.isNew = true;
        nowShown.add(feature.id);
      }
      visibleSet.push(feature);
    });

    setVisibleFeatures(visibleSet);
    setShownFeatureIds(nowShown);
  }, [currentTime, segmentFeatures, shownFeatureIds]);

  // Reset shown features when segment changes
  useEffect(() => {
    setShownFeatureIds(new Set());
    setVisibleFeatures([]);
  }, [currentSegmentIndex]);

  if (!visibleFeatures || visibleFeatures.length === 0) {
    return null;
  }

  const getIconSvg = (type) => {
    const typeNormalized = (type || '').toLowerCase();
    
    switch (typeNormalized) {
      case 'milestone':
      case 'achievement':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
          </svg>
        );
      case 'interrupt':
      case 'interruption':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
          </svg>
        );
      case 'language':
      case 'accent':
      case 'indian-accents':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
          </svg>
        );
      case 'response-time':
      case 'speed':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z" />
          </svg>
        );
      case 'context':
      case 'context-window':
      case 'context-switching':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zm-5.04-6.71l-2.75 3.54h2.86l-.63 2.17h2.4l-6.02-8.07.63-2.14h-2.4l.63 2.14 2.75 3.54h-2.86l.63-2.17h-2.4l6.02 8.07-.63 2.14h2.4z" />
          </svg>
        );
      case 'handoff':
      case 'escalation':
      case 'human-handoff':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
          </svg>
        );
      case 'multiturn-navigational':
      case 'multiturn':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M7 10l5 5 5-5z" />
          </svg>
        );
      case 'faq':
      case 'faq-handling':
      case 'predefined-faqs':
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z" />
          </svg>
        );
      default:
        return (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
          </svg>
        );
    }
  };

  return (
    <div className="feature-markers" role="region" aria-label="Feature markers" aria-live="polite">
      {visibleFeatures.map((feature) => (
        <div
          key={feature.id}
          className={`feature-chip ${feature.type || 'feature'} ${feature.isNew ? 'is-new' : ''}`}
          role="status"
          title={feature.description || feature.label}
          aria-label={`Feature: ${feature.label}`}
        >
          <span className="chip-icon">
            {getIconSvg(feature.type)}
          </span>

          <span className="chip-label">{feature.label}</span>

          <span className="chip-pulse" aria-hidden="true" />
        </div>
      ))}
    </div>
  );
}

export default FeatureMarker;
