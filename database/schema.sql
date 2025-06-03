-- SQL Schema for the SQL Learning Application
-- This file defines the structure of the database tables.

-- Users table: Stores information about registered users.
CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL PRIMARY KEY, -- Unique identifier for the user
    username VARCHAR(255) UNIQUE NOT NULL, -- User's chosen username
    email VARCHAR(255) UNIQUE NOT NULL, -- User's email address
    password_hash VARCHAR(255) NOT NULL, -- Hashed password for security
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Timestamp of when the user was created
);

-- Exercises table: Stores the details of SQL exercises.
CREATE TABLE IF NOT EXISTS exercises (
    exercise_id SERIAL PRIMARY KEY, -- Unique identifier for the exercise
    title VARCHAR(255) NOT NULL, -- Title of the exercise
    description TEXT NOT NULL, -- Detailed description of the exercise task
    difficulty VARCHAR(50), -- Difficulty level (e.g., 'easy', 'medium', 'hard')
    expected_schema TEXT, -- SQL DDL statements for the schema to be used for this exercise (e.g., CREATE TABLE ...)
    sample_data TEXT, -- SQL DML statements for populating the schema with sample data (e.g., INSERT INTO ...)
    correct_query TEXT, -- The correct SQL query that solves the exercise
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP -- Timestamp of when the exercise was created
);

-- Submissions table: Stores users' attempts to solve exercises.
CREATE TABLE IF NOT EXISTS submissions (
    submission_id SERIAL PRIMARY KEY, -- Unique identifier for the submission
    user_id INT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE, -- Foreign key to the users table
    exercise_id INT NOT NULL REFERENCES exercises(exercise_id) ON DELETE CASCADE, -- Foreign key to the exercises table
    user_query TEXT, -- The SQL query submitted by the user
    is_correct BOOLEAN, -- Whether the submitted query was correct
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP, -- Timestamp of when the query was submitted
    results TEXT -- Stores any output or error messages from the query execution (e.g., JSON with query result or error info)
);

-- Potential future tables:
-- lessons: To group exercises into lessons or modules.
-- user_progress: To track overall progress beyond individual submissions.
-- hints: To provide hints for exercises.

COMMENT ON COLUMN exercises.expected_schema IS 'Stores the SQL DDL (CREATE TABLE statements) for the schema relevant to this exercise.';
COMMENT ON COLUMN exercises.sample_data IS 'Stores SQL DML (INSERT statements) to populate the tables defined in expected_schema with data.';
COMMENT ON COLUMN submissions.results IS 'Stores results from query execution, could be query output (e.g., as JSON) or error messages.';
