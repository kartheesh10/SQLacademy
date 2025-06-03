import React from 'react';
import './GuidanceDisplay.css'; // Create this CSS file for styling messages

function GuidanceDisplay({ messages, isLoading }) {
  if (isLoading) {
    return (
      <div className="guidance-display-container">
        <h2>Tutor Guidance</h2> {/* Ensure this was changed, it was in previous step */}
        <div className="loading-message">Loading guidance from Tutor...</div>
      </div>
    );
  }

  if (!messages || messages.length === 0) {
    return (
      <div className="guidance-display-container">
        <h2>Tutor Guidance</h2> {/* Ensure this was changed */}
        <p className="placeholder-message">
          Your step-by-step guidance will appear here once you submit a problem.
        </p>
      </div>
    );
  }

  return (
    <div className="guidance-display-container">
      <h2>Tutor Guidance</h2> {/* Renamed from Jules */}
      <div className="messages-list">
        {messages
          .filter(msg => msg.role !== 'system') // Exclude system-role messages
          .map((msg) => ( // msg.id is now preferred for key
            <div key={msg.id} className={`message ${msg.sender.toLowerCase()} ${msg.type || 'text'}`}>
              <span className="sender-label">{msg.sender}:</span>
              <p className="message-text">{msg.text}</p>
            </div>
        ))}
      </div>
    </div>
  );
}

export default GuidanceDisplay;
