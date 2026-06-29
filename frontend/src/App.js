/**
 * Voice Demo Studio - Multi-Segment Conversation Player
 * 
 * Enterprise-grade conversational AI playback for demo recording
 * Supports sequential audio playback of multiple speaker turns
 */

import React, { useState, useCallback, useRef, useEffect } from 'react';
import Orb from './components/Orb';
import ConversationLoader from './components/ConversationLoader';
import ConversationPlayer from './components/ConversationPlayer';
import FeatureMarker from './components/FeatureMarker';
import SummaryCard from './components/SummaryCard';
import { loadConversationFile, validateConversation } from './utils/conversationManager';
import './styles/App.css';

function App() {
  // State: Conversation
  const [conversation, setConversation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // State: Playback
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [orbState, setOrbState] = useState('idle'); // idle, loading, speaking, complete
  
  // State: UI
  const [showSummary, setShowSummary] = useState(false);
  const [visibleFeatures, setVisibleFeatures] = useState([]);

  const playerRef = useRef(null);

  // Handle conversation file load
  const handleConversationLoad = async (file) => {
    setError(null);
    setIsLoading(true);
    setIsPlaying(false);
    setCurrentSegmentIndex(0);
    setCurrentTime(0);
    setShowSummary(false);
    setOrbState('loading');

    try {
      // Load and parse conversation
      const data = await loadConversationFile(file);
      
      // Validate conversation structure
      const validation = validateConversation(data);
      if (!validation.valid) {
        throw new Error(`Invalid conversation: ${validation.errors.join(', ')}`);
      }

      setConversation(data);
      setOrbState('idle');
    } catch (err) {
      console.error('Conversation load error:', err);
      setError(err.message || 'Failed to load conversation. Please check the JSON file.');
      setOrbState('idle');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle conversation load from URL/path
  const handleConversationLoadFromUrl = async (url) => {
    setError(null);
    setIsLoading(true);
    setOrbState('loading');

    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch conversation');
      
      const data = await response.json();
      const validation = validateConversation(data);
      
      if (!validation.valid) {
        throw new Error(`Invalid conversation: ${validation.errors.join(', ')}`);
      }

      setConversation(data);
      setCurrentSegmentIndex(0);
      setCurrentTime(0);
      setIsPlaying(false);
      setShowSummary(false);
      setOrbState('idle');
    } catch (err) {
      console.error('Conversation load error:', err);
      setError(err.message || 'Failed to load conversation');
      setOrbState('idle');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle play/pause
  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  // Handle segment change
  const handleSegmentChange = (newSegmentIndex) => {
    setCurrentSegmentIndex(newSegmentIndex);
    setCurrentTime(0);
  };

  // Handle playback time update
  const handleTimeUpdate = (time) => {
    setCurrentTime(time);
    setOrbState('speaking');
  };

  // Handle segment end
  const handleSegmentEnd = () => {
    if (conversation && currentSegmentIndex < conversation.segments.length - 1) {
      // Move to next segment
      const nextIndex = currentSegmentIndex + 1;
      const nextSegment = conversation.segments[nextIndex];
      
      // Apply delay if specified
      if (nextSegment.delayAfter) {
        setTimeout(() => {
          handleSegmentChange(nextIndex);
          setIsPlaying(true);
        }, nextSegment.delayAfter * 1000);
      } else {
        handleSegmentChange(nextIndex);
        setIsPlaying(true);
      }
    } else {
      // End of conversation
      setIsPlaying(false);
      setOrbState('complete');
      
      if (conversation?.summaryCard) {
        setShowSummary(true);
      }
    }
  };

  // Handle restart
  const handleRestart = () => {
    setCurrentSegmentIndex(0);
    setCurrentTime(0);
    setIsPlaying(true);
    setShowSummary(false);
    setOrbState('idle');
  };

  // Handle reset
  const handleReset = () => {
    setConversation(null);
    setIsPlaying(false);
    setCurrentSegmentIndex(0);
    setCurrentTime(0);
    setOrbState('idle');
    setError(null);
    setShowSummary(false);
    setVisibleFeatures([]);
  };

  // Update visible features based on current segment
  useEffect(() => {
    if (conversation && currentSegmentIndex < conversation.segments.length) {
      const segment = conversation.segments[currentSegmentIndex];
      const features = segment.features || [];
      setVisibleFeatures(features);
    } else {
      setVisibleFeatures([]);
    }
  }, [currentSegmentIndex, conversation]);

  const currentSegment = conversation?.segments?.[currentSegmentIndex];
  const totalSegments = conversation?.segments?.length || 0;

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          {conversation?.brand?.name && (
            <p className="app-brand">{conversation.brand.name}</p>
          )}
          <h1 className="app-title">
            {conversation?.title || 'Voice Demo Studio'}
          </h1>
          {conversation?.subtitle && (
            <p className="app-subtitle">{conversation.subtitle}</p>
          )}
        </div>

        {!conversation && (
          <div className="header-actions">
            <ConversationLoader
              onFileLoad={handleConversationLoad}
              onUrlLoad={handleConversationLoadFromUrl}
              disabled={isLoading}
            />
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="app-main">
        {/* Error display */}
        {error && (
          <div className="error-banner" role="alert">
            <span className="error-icon">⚠️</span>
            <span className="error-message">{error}</span>
            <button
              className="error-close"
              onClick={() => setError(null)}
              aria-label="Close error"
            >
              ×
            </button>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="loading-state">
            <Orb state="loading" />
            <p>Loading conversation...</p>
          </div>
        )}

        {/* Conversation not loaded */}
        {!conversation && !isLoading && (
          <div className="empty-state">
            <Orb state="idle" />
            <h2>Welcome to Voice Demo Studio</h2>
            <p>Load a conversation JSON file to begin</p>
            <ConversationLoader
              onFileLoad={handleConversationLoad}
              onUrlLoad={handleConversationLoadFromUrl}
              disabled={isLoading}
              large
            />
          </div>
        )}

        {/* Conversation player */}
        {conversation && !isLoading && (
          <div className="playback-phase">
            {/* Top section: Orb and transcript */}
            <div className="playback-top">
              <Orb
                state={orbState}
                isPlaying={isPlaying}
                currentSpeaker={currentSegment?.speaker}
              />

              {currentSegment && (
                <div className="segment-display">
                  <div className="segment-info">
                    <span className={`speaker-badge speaker-${currentSegment.speaker}`}>
                      {currentSegment.speaker === 'ai' ? 'AI' : 'Customer'}
                    </span>
                    <span className="segment-counter">
                      {currentSegmentIndex + 1} / {totalSegments}
                    </span>
                  </div>

                  <div className="transcript-area">
                    <p className="transcript-text">
                      {currentSegment.transcript}
                    </p>
                  </div>

                  {currentSegment.emotion && (
                    <div className="emotion-indicator">
                      <span className={`emotion emotion-${currentSegment.emotion}`}>
                        {currentSegment.emotion}
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Feature markers overlay */}
            {visibleFeatures.length > 0 && (
              <FeatureMarker features={visibleFeatures} />
            )}

            {/* Bottom section: Player controls */}
            <div className="playback-bottom">
              <ConversationPlayer
                ref={playerRef}
                segment={currentSegment}
                isPlaying={isPlaying}
                onPlayPause={handlePlayPause}
                onTimeUpdate={handleTimeUpdate}
                onSegmentEnd={handleSegmentEnd}
                currentSegmentIndex={currentSegmentIndex}
                totalSegments={totalSegments}
                onSegmentChange={handleSegmentChange}
              />

              <div className="control-buttons">
                <button
                  className="btn-restart"
                  onClick={handleRestart}
                  title="Restart conversation"
                >
                  Restart
                </button>
                <button
                  className="btn-reset"
                  onClick={handleReset}
                  title="Load different conversation"
                >
                  Load New
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Summary card overlay */}
      {conversation?.summaryCard && (
        <SummaryCard
          data={conversation.summaryCard}
          isVisible={showSummary}
          onClose={() => setShowSummary(false)}
        />
      )}

      {/* Footer */}
      <footer className="app-footer">
        <p>
          {conversation
            ? `${conversation.title} • ${totalSegments} segments`
            : 'Voice Demo Studio - Multi-segment conversation player'}
        </p>
      </footer>
    </div>
  );
}

export default App;
