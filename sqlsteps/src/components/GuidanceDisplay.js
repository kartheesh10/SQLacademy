import React from 'react';
import './GuidanceDisplay.css'; // Create this CSS file for styling messages

function GuidanceDisplay({ messages, isLoading }) {
  if (isLoading) {
    return (
      <div className="guidance-display-container">
        <h2>Jules' Guidance</h2>
        <div className="loading-message">Loading guidance from Jules...</div>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="guidance-display-container">
        <h2>Jules' Guidance</h2>
        <p className="placeholder-message">
          Your step-by-step guidance will appear here once you submit a problem.
        </p>
      </div>
    );
  }

  return (
    <div className="guidance-display-container">
      <h2>Jules' Guidance</h2>
      <div className="messages-list">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender.toLowerCase()} ${msg.type || 'text'}`}>
            <span className="sender-label">{msg.sender}:</span>
            <p className="message-text">{msg.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GuidanceDisplay;
