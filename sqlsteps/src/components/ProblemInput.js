import React, { useState } from 'react';

// Accept onProblemSubmit prop
function ProblemInput({ onProblemSubmit }) {
  const [problemDescription, setProblemDescription] = useState('');
  const [tableSchema, setTableSchema] = useState('');
  // Could add another state for sample data if needed later
  // const [sampleData, setSampleData] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault(); // Prevent default form submission which reloads the page

    if (!problemDescription.trim() || !tableSchema.trim()) {
      alert("Please provide both a problem description and table schema.");
      return;
    }

    // Call the passed-in handler from App.js
    onProblemSubmit(problemDescription, tableSchema);

    // Optionally clear fields after submission, or let App.js manage this
    // setProblemDescription('');
    // setTableSchema('');
  };

  return (
    <div className="problem-input-container">
      <h2>Define Your SQL Problem</h2>
      <p>Enter the description of the SQL problem you want to solve and the schema of the relevant table(s).</p>
      <form onSubmit={handleSubmit} className="problem-input-form">
        <div className="form-group">
          <label htmlFor="problemDescription">Problem Description:</label>
          <textarea
            id="problemDescription"
            value={problemDescription}
            onChange={(e) => setProblemDescription(e.target.value)}
            rows="6"
            placeholder="e.g., Select all columns for employees hired after January 1, 2022."
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="tableSchema">Table Schema(s) (CREATE TABLE statements):</label>
          <textarea
            id="tableSchema"
            value={tableSchema}
            onChange={(e) => setTableSchema(e.target.value)}
            rows="8"
            placeholder="e.g., CREATE TABLE Employees (EmployeeID INT PRIMARY KEY, FirstName VARCHAR(50), LastName VARCHAR(50), HireDate DATE);"
            required
          />
        </div>
        {/*
        // Optional: Textarea for sample data (INSERT statements)
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
