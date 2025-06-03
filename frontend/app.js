// Main JavaScript file for the SQL Learning Platform frontend

document.addEventListener('DOMContentLoaded', () => {
    // Select key DOM elements
    const exerciseDescriptionDiv = document.getElementById('exercise-description');
    const sqlQueryInput = document.getElementById('sql-query-input');
    const submitQueryButton = document.getElementById('submit-query-button');
    const queryResultsDiv = document.getElementById('query-results');

    // Log selected elements to confirm they are found (for debugging)
    console.log('Exercise Description Div:', exerciseDescriptionDiv);
    console.log('SQL Query Input:', sqlQueryInput);
    console.log('Submit Query Button:', submitQueryButton);
    console.log('Query Results Div:', queryResultsDiv);

    // Check if all elements were found
    if (!exerciseDescriptionDiv || !sqlQueryInput || !submitQueryButton || !queryResultsDiv) {
        console.error('One or more critical UI elements were not found. Check HTML IDs.');
        // Display an error to the user in a prominent way if necessary
        const body = document.querySelector('body');
        if (body) {
            const errorMsg = document.createElement('p');
            errorMsg.textContent = 'Error: Could not initialize UI components. Please contact support.';
            errorMsg.style.color = 'red';
            errorMsg.style.fontWeight = 'bold';
            body.prepend(errorMsg);
        }
        return; // Stop further execution if critical elements are missing
    }

    // Placeholder content (can be replaced with actual exercise loading logic later)
    exerciseDescriptionDiv.innerHTML = '<p>This is where the detailed description of the selected SQL exercise will appear. For now, it is static placeholder content.</p>';

    // Event listener for the "Submit Query" button
    submitQueryButton.addEventListener('click', () => {
        const userQuery = sqlQueryInput.value;

        // Log the query to the console for now
        console.log('Submit button clicked!');
        console.log('User SQL Query:', userQuery);

        // Display a message in the results area
        // In a real application, this would involve sending the query to the backend
        // and displaying the actual results or errors.
        queryResultsDiv.innerHTML = `
            <p><strong>Attempted Query:</strong></p>
            <pre>${userQuery || '(No query entered)'}</pre>
            <p><em>(This is a placeholder response. Query execution is not yet implemented.)</em></p>
        `;

        // Here, you would typically:
        // 1. Get the current exercise ID.
        // 2. Send the userQuery and exercise ID to the backend API.
        // 3. Receive results (data, error, or correctness status).
        // 4. Update the queryResultsDiv with the actual outcome.
    });

    // Initial message in results div
    queryResultsDiv.innerHTML = '<p>Submit a query to see results here.</p>';

    console.log('Frontend JavaScript loaded and initialized.');
});
