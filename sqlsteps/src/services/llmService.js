// llmService.js

/**
 * Simulates fetching the first piece of guidance from an LLM.
 *
 * IMPORTANT: API Key Handling
 * In a real application, the API key must be handled securely.
 * - It should NOT be hardcoded in the client-side JavaScript.
 * - It should ideally be managed on a backend server that makes requests to the LLM.
 * - If client-side calls are absolutely necessary (not recommended for production),
 *   the key should be stored in environment variables and accessed carefully,
 *   or users should be prompted to enter it securely.
 * - For this subtask, we are SIMULATING the API call and response, so no real key is used.
 *
 * @param {string} problemDescription The user's description of the SQL problem.
 * @param {string} tableSchema The SQL schema (CREATE TABLE statements) for the problem.
 * @param {string} systemPrompt The system prompt defining Jules' role and methodology.
 * @param {string} apiKey A placeholder for the LLM API key (NOT USED in this simulation).
 * @returns {Promise<string>} A promise that resolves to the LLM's first guidance message.
 */
async function getFirstGuidance(problemDescription, tableSchema, systemPrompt, apiKey = "SIMULATED_API_KEY_NOT_USED") {
  console.log("llmService.getFirstGuidance called with:", { problemDescription, tableSchema });

  // 1. Construct the messages for the LLM
  const messages = [
    { role: 'system', content: systemPrompt },
    {
      role: 'user',
      content: `Problem Description:\n${problemDescription}\n\nTable Schema(s):\n${tableSchema}\n\nBased on this, what is the very first small step or question you have for me?`
    }
  ];


  // 2. Simulate API Call
  console.log("Simulating API call to LLM with messages:", messages);
  console.log("Using API Key (placeholder):", apiKey); // For demonstration if a key were passed

  // In a real application, this would be a fetch call:
  /*
  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages, // Pass the constructed messages array
        temperature: 0.7,
        max_tokens: 150,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('LLM API Error:', errorData);
      throw new Error(`LLM API request failed with status ${response.status}: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      console.log("LLM Raw Response:", data);
      return data.choices[0].message.content.trim();
    } else {
      console.error('Invalid LLM response structure:', data);
      throw new Error('Received an invalid response structure from LLM.');
    }
  } catch (error) {
    console.error('Error in getFirstGuidance:', error);
    throw error;
  }
  */

  // Simulated response for this subtask:
  return new Promise((resolve) => {
    setTimeout(() => {
      const firstTableNameMatch = tableSchema.match(/CREATE TABLE\s+([^\s(]+)/i);
      const firstTableName = firstTableNameMatch ? firstTableNameMatch[1] : 'the main table';
      const simulatedResponse = `Okay, I've looked at your problem description and the schema. It seems we need to work with the ${firstTableName} table, among others possibly.
Let's start by focusing on the core of any SQL query: the \`FROM\` clause. Which table (or tables) do you think we need to retrieve data from for this problem?`;
      console.log("Returning simulated LLM response for getFirstGuidance:", simulatedResponse);
      resolve(simulatedResponse);
    }, 1000); // Simulate network delay
  });
}

/**
 * Simulates fetching a follow-up response from an LLM based on conversation history.
 *
 * IMPORTANT: API Key Handling (Same as getFirstGuidance)
 * - In a real app, manage API keys securely, ideally on a backend.
 * - This simulation does NOT use a real API key.
 *
 * @param {Array<object>} messages The conversation history (array of {role, content} objects). The first message is expected to be the system prompt.
 * @param {string} apiKey A placeholder for the LLM API key.
 * @returns {Promise<string>} A promise that resolves to the LLM's follow-up message.
 */
async function getLlmResponse(messages, apiKey = "SIMULATED_API_KEY_NOT_USED") {
  console.log("llmService.getLlmResponse called with messages:", messages);
  console.log("Using API Key (placeholder):", apiKey);

  const lastUserMessage = messages.filter(msg => msg.role === 'user').pop();
  let simulatedResponse = "I'm not sure how to respond to that. Could you try rephrasing your SQL or your question?";

  if (lastUserMessage) {
    const userContent = lastUserMessage.content.toLowerCase();
    if (userContent.includes("hint") || userContent.includes("help me") || userContent.includes("clue")) {
      simulatedResponse = "Okay, here's a hint for this step: Think about the specific condition you need to filter by. For example, if you're looking for active users, it might be something like `WHERE status = 'active'`. What do you think?";
    } else if (userContent.includes("solution for this step") || userContent.includes("give up on step") || userContent.includes("answer for this step") || userContent.includes("show me the answer")) {
      simulatedResponse = "Alright, sometimes a step can be tricky! For the current step we are working on, you would typically need to provide an SQL clause. For example, if we were working on selecting columns, it might be `SELECT EmployeeID, FirstName, LastName`. What do you think the next logical step in solving the overall problem would be?";
    } else if (userContent.includes("select") || userContent.includes("from") || userContent.includes("where") || userContent.includes("join") || userContent.includes("group by") || userContent.includes("order by")) {
      // Simulate feedback on an SQL attempt
      // More sophisticated simulation could try to parse the SQL or look for keywords.
      if (userContent.length > 10 && (userContent.includes("employees") || userContent.includes("products"))) { // very basic check
        simulatedResponse = "That's a good attempt for this step! Your SQL snippet looks plausible. Let's consider what comes next. Do we need to filter these results further, or perhaps join with another table?";
      } else {
        simulatedResponse = "Hmm, that SQL doesn't look quite right for what we're trying to achieve in this step. Could you double-check your table and column names, or perhaps the SQL keyword you're using? For example, ensure all selected columns exist in the tables mentioned in the FROM clause.";
      }
    } else if (userContent.startsWith("problem description:")) {
      // This case should ideally be handled by getFirstGuidance.
      // If it reaches here, it implies an unexpected state or a new problem submission mid-conversation.
      simulatedResponse = "It looks like you might be trying to define a new problem. If so, please use the problem submission form. If you're continuing with the current problem, what SQL would you like to try for this step?";
    }
  }

  // In a real application, this would be a fetch call:
  /*
  try {
    // Ensure the first message IS the system prompt if not already included by App.js
    // However, App.js is now designed to always include it.
    const messagesForApi = [...messages]; // Create a copy to potentially modify

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messagesForApi,
        temperature: 0.5, // Slightly lower temperature for more focused tutoring
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('LLM API Error:', errorData);
      throw new Error(`LLM API request failed: ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    if (data.choices && data.choices.length > 0 && data.choices[0].message) {
      return data.choices[0].message.content.trim();
    } else {
      throw new Error('Invalid LLM response structure.');
    }
  } catch (error) {
    console.error('Error in getLlmResponse:', error);
    throw error;
  }
  */

  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Returning simulated LLM follow-up for getLlmResponse:", simulatedResponse);
      resolve(simulatedResponse);
    }, 800); // Simulate network delay
  });
}

export { getFirstGuidance, getLlmResponse };
