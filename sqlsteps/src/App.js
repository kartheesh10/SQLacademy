import React, { useState, useEffect } from 'react';
import './App.css';
import ProblemInput from './components/ProblemInput';
import SqlEditor from './components/SqlEditor';
import GuidanceDisplay from './components/GuidanceDisplay';
// Updated import to include getLlmResponse
import { getFirstGuidance, getLlmResponse } from './services/llmService';

const TUTOR_SENDER = 'Tutor'; // Renamed from JULES_SENDER
const USER_SENDER = 'User';
const SYSTEM_SENDER = 'System'; // For system messages or context setting

const initialSystemPrompt = `You are Tutor, an expert SQL tutor. Your primary goal is to help the user solve an SQL problem step-by-step.
Given the problem description and table schema below, your first task is to provide an engaging opening statement and the very first guiding question or a small, concrete step to get the user started.
Do NOT solve the entire problem at once. Do NOT provide the SQL query directly.
Focus on breaking the problem down. For example, you might ask about which table to start with, or which columns seem relevant, or how to approach a specific clause (SELECT, FROM, WHERE, JOIN, GROUP BY, etc.).
Keep your initial response concise and focused on the first step.

When the user provides an SQL snippet for a step, evaluate it in context of that current step. Provide feedback and then guide to the next small step or question.
The user might respond to your step-specific questions with plain English descriptions, partial SQL statements, or complete SQL for that step.
If the user's input is in plain English or is a partial (but correct direction) SQL statement for the current step, acknowledge their understanding. Then, guide them to the more complete and correct SQL syntax for that specific step. You can do this by providing the structured SQL for the step and asking them to fill in missing details (e.g., specific column names for a JOIN condition, or correct aliases).
Example Interaction: If you asked for the FROM clause, and the user says 'I need data from customers and orders', you might respond: 'Correct, we'll need the Customers and Orders tables. The SQL for joining them typically looks like: \\`FROM Customers c JOIN Orders o ON c.CustomerID = o.CustomerID\\`. (Assuming CustomerID is the join key). Does that look right for this problem, or are the join columns different?' Or, if they say 'from customer join orders', you might say: 'Good start! To complete that join, we need an ON clause: \\`FROM Customer c JOIN Orders o ON c.??? = o.???\\`. Which columns should we use to connect them?'
Your primary goal is still to break the problem down into manageable steps and ensure the user understands how to construct each piece of the SQL query correctly. Use their natural language or partial attempts as a starting point to build up to the correct SQL for the step.

If the user asks for a hint, provide a specific hint for the current step.
If the user indicates they give up on a specific step (e.g., by typing 'give up on step', 'solution for this step'), provide the correct SQL snippet for that step *only*, explain it briefly, and then prompt for the next logical step in solving the overall problem.
Maintain an encouraging, patient, and clear tone throughout the interaction.
The user will provide a problem description and table schema (potentially combined in one text block). Use this context for your guidance.`;
// Note: "You are Tutor..." is for the LLM's instruction, not directly displayed if system messages are hidden.

function App() {
  const [guidanceMessages, setGuidanceMessages] = useState([]); // Array of message objects
  const [isLoadingLlm, setIsLoadingLlm] = useState(false);
  const [isProblemSubmitted, setIsProblemSubmitted] = useState(false);
  const [activeProblemContext, setActiveProblemContext] = useState(''); // Combined context

  // Helper to create a new message object
  const createMessage = (text, sender, role, type = 'text') => ({
    id: crypto.randomUUID(), // Ensures unique key for React rendering
    text,
    sender,
    role, // 'system', 'user', 'assistant' for LLM
    type, // 'text', 'error', 'systemInfo' for UI styling or handling
    timestamp: new Date().toISOString(),
  });

  // Effect to initialize messages when a new problem is submitted
  useEffect(() => {
    if (isProblemSubmitted && activeProblemContext) {
      // The activeProblemContext now contains both description and schema
      const fullProblemContextForLlm = `Full Problem Context (Description, Schema, Sample Data if provided):\n${activeProblemContext}`;
      setGuidanceMessages([
        createMessage(initialSystemPrompt, SYSTEM_SENDER, 'system', 'systemInfo'),
        createMessage(fullProblemContextForLlm, USER_SENDER, 'user')
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isProblemSubmitted, activeProblemContext]); // Dependencies that trigger re-initialization


  const handleProblemSubmit = async (problemContext) => {
    console.log("App.js: handleProblemSubmit called with single problemContext:", problemContext);
    setIsLoadingLlm(true);
    setActiveProblemContext(problemContext); // Store the combined context
    // Clear previous full conversation. useEffect above will set initial system/user prompts
    // after activeProblemContext and isProblemSubmitted are updated.
    setGuidanceMessages([]);
    setIsProblemSubmitted(true);

    // The useEffect will now handle setting the initial system and user messages.
    // Then, we fetch Jules' first response.
    // To ensure useEffect has run, we can introduce a micro-delay or rely on the natural flow.
    // For more robust flow, getFirstGuidance could be called inside the useEffect,
    // or await a state update if possible (not directly with useState).
    // A simple approach:
    // Let useEffect set the base messages. Then, in a subsequent step (simulated or real), fetch Jules' reply.
    // For now, directly call getFirstGuidance, assuming useEffect's state update for messages will be
    // conceptually part of the "current" message list when getFirstGuidance's response is processed.

    // The actual problem context sent to LLM for its first reply.
    const problemContextForInitialLLM = `Full Problem Context:\n${problemContext}`;

    try {
      const apiKey = "SIMULATED_KEY_FOR_SUBTASK_PURPOSES";
      // Pass problemContext as 'description' and a note for 'schema' to llmService.
      // The LLM will need to understand that the schema is embedded in the description.
      const firstJulesMessageText = await getFirstGuidance(problemContextForInitialLLM, "Schema is included in the description above.", initialSystemPrompt, apiKey);

      // Append Tutor's first message.
      setGuidanceMessages(prevMessages => {
        const baseMessages = (prevMessages.length > 0) ? prevMessages : [
            createMessage(initialSystemPrompt, SYSTEM_SENDER, 'system', 'systemInfo'),
            createMessage(problemContextForInitialLLM, USER_SENDER, 'user')
        ];
        return [
          ...baseMessages,
          createMessage(firstJulesMessageText, TUTOR_SENDER, 'assistant') // Use TUTOR_SENDER
        ];
      });
    } catch (error) {
      console.error("Error getting first guidance:", error);
      setGuidanceMessages(prevMessages => [
        ...prevMessages,
        createMessage(`Error: ${error.message}`, SYSTEM_SENDER, 'system', 'error')
      ]);
    } finally {
      setIsLoadingLlm(false);
    }
  };

  const commonLlmCall = async (newMessages) => {
    setIsLoadingLlm(true);
    // Add new user/system messages to existing history
    // newMessages is an array, e.g., [userSqlMsg] or [hintRequestMsg]
    const messagesWithUserUpdate = [...guidanceMessages, ...newMessages];
    setGuidanceMessages(messagesWithUserUpdate); // Show user's message immediately

    // Prepare messages for LLM (role: 'system', 'user', or 'assistant')
    const llmMessages = messagesWithUserUpdate.map(msg => ({
      // Ensure role is always set correctly based on our conventions
      role: msg.role,
      content: msg.text
    }));

    try {
      const apiKey = "SIMULATED_KEY_FOR_SUBTASK_PURPOSES";
      const julesResponseText = await getLlmResponse(llmMessages, apiKey);
      setGuidanceMessages(prevMessages => [
        ...prevMessages,
        createMessage(julesResponseText, TUTOR_SENDER, 'assistant') // Use TUTOR_SENDER
      ]);
    } catch (error) {
      console.error("Error getting LLM response:", error);
      setGuidanceMessages(prevMessages => [
        ...prevMessages,
        createMessage(`Error: ${error.message}`, SYSTEM_SENDER, 'system', 'error')
      ]);
    } finally {
      setIsLoadingLlm(false);
    }
  };

  const handleSqlSubmit = async (sqlSnippet) => {
    console.log("App.js: handleSqlSubmit called with", sqlSnippet);
    // Use createMessage for user's SQL submission
    const userSqlMsg = createMessage(sqlSnippet, USER_SENDER, 'user');
    await commonLlmCall([userSqlMsg]);
  };

  const handleGetHint = async () => {
    console.log("App.js: handleGetHint called");
    // Use createMessage for hint request
    const hintRequestMsg = createMessage("I need a hint for the current step, please.", USER_SENDER, 'user');
    await commonLlmCall([hintRequestMsg]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>SQLSteps - Learn SQL Step-by-Step</h1>
      </header>
      <main className="App-main-content">
        <div className="problem-pane">
          <ProblemInput onProblemSubmit={handleProblemSubmit} />
        </div>
        <div className="interaction-pane">
          <GuidanceDisplay messages={guidanceMessages} isLoading={isLoadingLlm} />
          <SqlEditor
            onSqlSubmit={handleSqlSubmit}
            onGetHint={handleGetHint}
            disabled={!isProblemSubmitted || isLoadingLlm} // Disable editor if no problem or LLM is working
          />
        </div>
      </main>
      <footer className="App-footer">
        <p>&copy; 2024 SQLSteps Learning</p>
      </footer>
    </div>
  );
}

export default App;
