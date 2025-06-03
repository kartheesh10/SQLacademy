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
      // Ensure simulated response is generic and does not use a name.
      const simulatedResponse = `Okay, I've reviewed the problem description and schema. It looks like the ${firstTableName} table will be important here.
To begin, let's figure out the \`FROM\` clause. Which table(s) do you think we'll need to query?`;
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
    const userContentOriginal = lastUserMessage.content; // Keep original case for some checks if needed

    // Keywords for SQL clauses (very basic check)
    const isSqlAttempt = userContent.includes("select") || userContent.includes("from") || userContent.includes("where") || userContent.includes("join") || userContent.includes("group by") || userContent.includes("order by");
    const isShortInput = userContent.length < 15;


    if (userContent.includes("hint") || userContent.includes("help me") || userContent.includes("clue")) {
      simulatedResponse = "Okay, here's a hint for this step: Think about the specific condition you need to filter by. For example, if you're looking for active users, it might be something like `WHERE status = 'active'`. What do you think?";
    } else if (userContent.includes("solution for this step") || userContent.includes("give up on step") || userContent.includes("answer for this step") || userContent.includes("show me the answer")) {
      simulatedResponse = "Alright, sometimes a step can be tricky! For the current step we are working on, you would typically need to provide an SQL clause. For example, if we were working on selecting columns, it might be `SELECT EmployeeID, FirstName, LastName`. What do you think the next logical step in solving the overall problem would be?";

    // Scenario 1: User provides plain English for a FROM clause (example)
    } else if ((userContent.includes("data from") || userContent.includes("tables are") || userContent.includes("need records from") || userContent.includes("information from") || userContent.includes("use " + (userContent.match(/(\w+)\s+and\s+(\w+)/)?.[1] || "") ) ) && !isSqlAttempt) {
        // Try to crudely extract table names if user mentions them
        let table1 = "TableA";
        let table2 = "TableB";
        const tableMatch = userContent.match(/(?:tables|data from|records from|use)\s*(\w+)\s*(?:and|,)?\s*(\w+)?/);
        if (tableMatch) {
            table1 = tableMatch[1] || table1;
            table2 = tableMatch[2] || table2;
        }
        simulatedResponse = `I understand you're thinking about the '${table1}' ${table2 !== 'TableB' ? `and '${table2}' ` : ''}table(s). When using multiple tables like these, we often need to join them. The SQL might look something like: \`FROM ${table1} t1 JOIN ${table2} t2 ON t1.common_column = t2.common_column\`. Could you try writing the specific FROM and JOIN clause for your problem?`;

    // Scenario 2: User provides partial SQL for a FROM clause (example)
    } else if (userContent.startsWith("from ") && userContent.includes("join") && !userContent.includes(" on ")) {
        simulatedResponse = `That's a good start on the FROM clause! To complete the join, we need an \`ON\` condition. For example: \`FROM Table1 t1 JOIN Table2 t2 ON t1.CommonColumn = t2.CommonColumn\`. What are the actual columns that link your tables?`;

    // Scenario 3: User provides plain English for a WHERE clause (example)
    } else if ((userContent.includes("filter by") || userContent.includes("where ") || userContent.includes("condition is")) && !isSqlAttempt && !isShortInput) {
        simulatedResponse = "Okay, you want to filter based on a condition. For instance, if you wanted to find records where 'Salary' is greater than 50000, the SQL would be `WHERE Salary > 50000`. Can you try writing the specific WHERE clause for this problem based on the requirements?";

    // Scenario 4: User provides obviously incomplete WHERE clause
    } else if (userContent.startsWith("where ") && (userContent.endsWith(">") || userContent.endsWith("<") || userContent.endsWith("=") || userContent.endsWith(" like"))) {
        simulatedResponse = `Good start on that \`WHERE\` clause! It looks like you've specified a condition like \`${userContentOriginal} ...\`. What value or pattern should complete this condition?`;

    // Existing SQL attempt logic (fallback)
    } else if (isSqlAttempt) {
      if (userContent.includes("from") && userContent.includes("join") && userContent.includes("on")) { // Reasonably complete JOIN
        simulatedResponse = "Excellent! That JOIN condition looks correct. Now that we've specified our tables, we usually need to filter the data. What `WHERE` clause conditions do we need for this problem?";
      } else if (userContent.includes("from")) { // Simple FROM without join, or incomplete join
        simulatedResponse = "Good start with the `FROM` clause. If you need to join another table, remember to use `JOIN` and `ON`. Otherwise, what's the next step? Usually, it's filtering with `WHERE` or selecting columns with `SELECT`.";
      } else if (userContent.includes("where")) { // More complete WHERE clause
        simulatedResponse = "Okay, that `WHERE` clause seems to capture some conditions. Are there any more conditions, or are we ready to specify which columns to `SELECT`?";
      } else if (userContent.includes("select")) {
        simulatedResponse = "Alright, you've specified the columns in the `SELECT` clause. Is your query complete now, or are there other clauses like `ORDER BY` or `GROUP BY` needed for this problem?";
      } else if (userContent.length > 5) { // A slightly more generic "good attempt" for shorter SQL snippets
        simulatedResponse = "Okay, that's a step in the right direction. How would you build on that for the current part of the problem?";
      } else {
        simulatedResponse = "Hmm, that SQL doesn't look quite right for what we're trying to achieve in this step. Could you double-check your table and column names, or perhaps the SQL keyword you're using?";
      }
    } else if (userContent.startsWith("problem description:")) { // Should be less common now
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
