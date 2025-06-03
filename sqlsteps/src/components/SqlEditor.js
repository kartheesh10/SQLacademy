import React, { useState } from 'react';
import './SqlEditor.css'; // Create this CSS file for styling

function SqlEditor({ onSqlSubmit, onGetHint, disabled }) {
  const [sqlInput, setSqlInput] = useState('');

  const handleSubmitSql = () => {
    if (!sqlInput.trim()) {
      alert("Please enter some SQL to submit.");
      return;
    }
    if (onSqlSubmit) {
      onSqlSubmit(sqlInput);
    }
    setSqlInput(''); // Clear input after submission
  };

  const handleHintRequest = () => {
    if (onGetHint) {
      onGetHint();
    }
  };

  return (
    <div className="sql-editor-container">
      <h2>SQL Editor</h2>
      <textarea
        value={sqlInput}
        onChange={(e) => setSqlInput(e.target.value)}
        rows="10"
        // cols="50" // Handled by CSS width
        placeholder="Enter your SQL query fragment here..."
        aria-label="SQL Query Input Area"
        disabled={disabled}
      />
      <div className="sql-editor-buttons">
        <button onClick={handleSubmitSql} disabled={disabled || !sqlInput.trim()}>
          Submit SQL Step
        </button>
        <button onClick={handleHintRequest} disabled={disabled} className="hint-button">
          Get Hint for Step
        </button>
      </div>
    </div>
  );
}

export default SqlEditor;
