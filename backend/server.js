// Main server file for the SQL Learning Application backend
const express = require('express');
const bcrypt = require('bcrypt'); // For password hashing
const app = express();
const port = process.env.PORT || 3000; // Use environment variable for port or default to 3000

// Middleware to parse JSON request bodies
app.use(express.json());

// --- Hardcoded Sample Exercise for /api/submit-query ---
const sampleExerciseForFeedback = {
  exercise_id: 1,
  title: "Select All Products",
  description: "Write a SQL query to select all columns from the 'Products' table.",
  // For case-insensitive comparison, store the correct query in a consistent case (e.g., uppercase)
  // Or normalize both submitted and correct query during comparison.
  // For simplicity, we'll normalize during comparison here.
  correct_query: "SELECT * FROM Products;"
};

// Simple GET route for testing if the server is up
app.get('/', (req, res) => {
    res.send('SQL Learning Platform Backend is running!');
});

// --- Authentication Endpoints ---

// POST /api/auth/register
app.post('/api/auth/register', async (req, res) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required.' });
    }
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = { username, email, hashedPassword };
        console.log('Simulated registration for user:', email, 'Hashed password:', hashedPassword);
        res.status(201).json({
            message: 'User registered successfully (simulated)',
            user: newUser
        });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ error: 'Server error during registration.' });
    }
});

// POST /api/auth/login
app.post('/api/auth/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required.' });
    }
    console.log('Simulated login attempt for user:', email);
    // Actual user lookup and bcrypt.compare would go here in a real app
    res.json({
        message: 'User login successful (simulated)',
        token: 'SIMULATED_JWT_TOKEN_PLACEHOLDER'
    });
});

// --- Query Submission Endpoint ---

// API endpoint to receive and "evaluate" SQL queries
app.post('/api/submit-query', (req, res) => {
    const { sqlQuery, exercise_id } = req.body;

    // Validate input
    if (sqlQuery === undefined || exercise_id === undefined) {
        return res.status(400).json({ error: 'Missing sqlQuery or exercise_id in request body' });
    }

    // For now, assume the submitted exercise_id corresponds to our hardcoded one
    // In a real app, you'd fetch the exercise details from the database using exercise_id
    if (parseInt(exercise_id) !== sampleExerciseForFeedback.exercise_id) {
        return res.status(404).json({ error: 'Exercise not found or ID mismatch with sample.' });
    }

    // Normalize queries for comparison: trim whitespace and convert to a consistent case (e.g., lowercase)
    // Also, remove trailing semicolons if they exist, as they are often optional for query execution
    // but can affect string comparison.
    const normalizeQuery = (query) => {
        if (typeof query !== 'string') return '';
        return query.trim().toLowerCase().replace(/;$/, '');
    };

    const normalizedUserQuery = normalizeQuery(sqlQuery);
    const normalizedCorrectQuery = normalizeQuery(sampleExerciseForFeedback.correct_query);

    // Basic correctness check
    const is_correct = normalizedUserQuery === normalizedCorrectQuery;

    let feedback_message = '';
    let hint = null;

    if (is_correct) {
        feedback_message = 'Correct! Well done.';
    } else {
        feedback_message = 'Incorrect. Try reviewing your syntax or logic.';
        // Provide a generic hint based on the sample exercise
        if (sampleExerciseForFeedback.exercise_id === 1) { // Specific hint for our sample
            hint = "Hint: Make sure you are selecting all columns (using *) from the 'Products' table.";
        } else {
            hint = "Hint: Double-check your table names, column names, and conditions.";
        }
    }

    console.log(`Query for exercise ${exercise_id}: "${sqlQuery}". Correct: ${is_correct}`);

    // TODO: Save submission to the database here
    // This is where you would interact with your database to record the user's attempt.
    // For example, using an ORM like Sequelize or a direct database client.
    const simulated_user_id = 1; // Placeholder: In a real app, get this from session/token
    const submissionToSave = {
        user_id: simulated_user_id,
        exercise_id: parseInt(exercise_id), // Ensure it's a number
        user_query: sqlQuery,
        is_correct: is_correct,
        submitted_at: new Date().toISOString(),
        results: feedback_message // Storing the feedback message, could also be raw query output or error
    };
    console.log("SIMULATING SAVE TO 'submissions' TABLE:", JSON.stringify(submissionToSave, null, 2));

    res.json({
        message: 'Query processed',
        receivedQuery: sqlQuery, // Send back the original query as received
        exercise_id: parseInt(exercise_id),
        is_correct: is_correct,
        feedback_message: feedback_message,
        hint: hint
        // In a real app, you might also include:
        // results_data: (if query was run and correct, or for select queries even if not "exercise correct")
        // error_details: (if the SQL syntax was invalid)
    });
});

// Start the server and listen on the specified port
app.listen(port, () => {
    const message = `Server listening on port ${port}. Access it at http://localhost:${port}`;
    console.log(message);
});
