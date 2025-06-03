import React, { useState } from 'react';

// Accept onProblemSubmit prop
function ProblemInput({ onProblemSubmit }) {
  const [problemContext, setProblemContext] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission which reloads the page

    if (!problemContext.trim()) {
      alert("Please provide the problem context (description and any relevant schema).");
      return;
    }

    // Call the passed-in handler from App.js with the single context string
    onProblemSubmit(problemContext);

    // Optionally clear field after submission
    // setProblemContext('');
  };

  return (
    <div className="problem-input-container">
      <h2>Define Your SQL Problem</h2>
      <p>Enter the full context of your SQL problem, including the description, any relevant table schemas (e.g., CREATE TABLE statements), and sample data if applicable, all in the text area below.</p>
      <form onSubmit={handleSubmit} className="problem-input-form">
        <div className="form-group">
          <label htmlFor="problemContext">Problem Context (Description, Schema, Sample Data):</label>
          <textarea
            id="problemContext"
            value={problemContext}
            onChange={(e) => setProblemContext(e.target.value)}
            rows="12" // Increased rows as it's now the only input
            placeholder="e.g., Problem: Find all employees hired in the last year. Schema: CREATE TABLE Employees (ID INT, Name TEXT, HireDate DATE). Sample Data: INSERT INTO Employees VALUES (1, 'John Doe', '2023-05-15');"
            required
          />
        </div>
        {/*
        <div className="form-group">
          <label htmlFor="sampleData">Sample Data (Optional - INSERT statements):</label>
          <textarea
            id="sampleData"
            value={sampleData}
            onChange={(e) => setSampleData(e.target.value)}
            rows="5"
            placeholder="e.g., INSERT INTO Employees (EmployeeID, FirstName, LastName, HireDate) VALUES (1, 'John', 'Doe', '2023-03-15');"
          />
        </div>
        */}
        <button type="submit" className="submit-problem-button">Start Tutoring Session</button>
      </form>
    </div>
  );
}

export default ProblemInput;
