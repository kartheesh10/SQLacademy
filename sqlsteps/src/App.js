import React, { useState, useEffect } from 'react';
import './App.css';
import ProblemInput from './components/ProblemInput';
import SqlEditor from './components/SqlEditor';
import GuidanceDisplay from './components/GuidanceDisplay';
// Updated import to include getLlmResponse
import { getFirstGuidance, getLlmResponse } from './services/llmService';

const JULES_SENDER = 'Jules';
const USER_SENDER = 'User';
const SYSTEM_SENDER = 'System'; // For system messages or context setting

const initialSystemPrompt = `You are Jules, an expert SQL tutor. Your primary goal is to help the user solve an SQL problem step-by-step.
Given the problem description and table schema below, your first task is to provide an engaging opening statement and the very first guiding question or a small, concrete step to get the user started.
Do NOT solve the entire problem at once. Do NOT provide the SQL query directly.
Focus on breaking the problem down. For example, you might ask about which table to start with, or which columns seem relevant, or how to approach a specific clause (SELECT, FROM, WHERE, JOIN, GROUP BY, etc.).
Keep your initial response concise and focused on the first step.
When the user provides an SQL snippet, evaluate it in context of the current step. Provide feedback and the next small step or question.
If the user asks for a hint, provide a specific hint for the current step.
If the user indicates they give up on a specific step (e.g., by typing 'give up on step', 'solution for this step'), provide the correct SQL snippet for that step *only*, explain it briefly, and then prompt for the next logical step in solving the overall problem.
Maintain an encouraging, patient, and clear tone throughout the interaction.
The user will provide a problem description and table schema. Use this context for your guidance.`;

function App() {
  const [guidanceMessages, setGuidanceMessages] = useState([]); // Array of message objects
  const [isLoadingLlm, setIsLoadingLlm] = useState(false);
  const [isProblemSubmitted, setIsProblemSubmitted] = useState(false);
  const [activeProblemDescription, setActiveProblemDescription] = useState('');
  const [activeTableSchema, setActiveTableSchema] = useState('');

  // Helper to create a new message object
  const createMessage = (text, sender, role, type = 'text') => ({
    id: crypto.randomUUID(), // Ensures unique key for React rendering
    text,
    sender,
    role, // 'system', 'user', 'assistant' for LLM
    type, // 'text', 'error', 'systemInfo' for UI styling or handling
    timestamp: new Date().toISOString(),
  });

  // useEffect can be used for other side effects if needed,
  // but initial message setup is now directly in handleProblemSubmit.
  // Example:
  // useEffect(() => {
  //   if (isProblemSubmitted) {
  //     console.log("A new problem session has started.");
  //   }
  // }, [isProblemSubmitted]);


  const handleProblemSubmit = async (description, schema) => {
    console.log("App.js: handleProblemSubmit called with", { description, schema });
    setIsLoadingLlm(true);
    setActiveProblemDescription(description);
    setActiveTableSchema(schema);
    // Clear previous full conversation, useEffect above will set initial system/user prompts
    setGuidanceMessages([]);
    setIsProblemSubmitted(true);

    // Get the first guidance message from Jules after initial context is set by useEffect
    // Need to ensure useEffect runs and sets state before this call or pass context directly
    // For simplicity, let's ensure context is formed before calling getFirstGuidance.

    // Construct the initial messages for getFirstGuidance explicitly here
    const problemContextForLlm = `Problem Description:\n${description}\n\nTable Schema(s):\n${schema}`;
    const initialMessagesForLlm = [
        createMessage(initialSystemPrompt, SYSTEM_SENDER, 'system', 'systemInfo'),
        createMessage(problemContextForLlm, USER_SENDER, 'user')
    ];
    // Set these messages immediately so UI updates, then fetch Jules' response
    setGuidanceMessages(initialMessagesForLlm);

    try {
      const apiKey = "SIMULATED_KEY_FOR_SUBTASK_PURPOSES";
      // getFirstGuidance now takes the system prompt and user problem directly
      const firstJulesMessageText = await getFirstGuidance(description, schema, initialSystemPrompt, apiKey);

      setGuidanceMessages(prevMessages => [
        ...prevMessages,
        createMessage(firstJulesMessageText, JULES_SENDER, 'assistant')
      ]);
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
        createMessage(julesResponseText, JULES_SENDER, 'assistant')
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
