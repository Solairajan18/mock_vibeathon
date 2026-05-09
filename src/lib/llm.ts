export async function generateAIResponse(systemPrompt: string, userMessage: string): Promise<string> {
  const OPENROUTER_URL = process.env.OPENROUTER_URL || "https://openrouter.ai/api/v1/chat/completions";
  const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
  const MODEL = process.env.MODEL || "liquid/lfm-2.5-1.2b-instruct:free";

  if (!OPENROUTER_API_KEY) {
    console.warn("No OPENROUTER_API_KEY found. Falling back to mock response.");
    return "This is a mock response because the OpenRouter API key is missing. Ensure you add OPENROUTER_API_KEY to your .env file.";
  }

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("OpenRouter API Error:", errorData);
      throw new Error(`OpenRouter API responded with status ${response.status}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "I'm sorry, I could not generate a response.";
  } catch (error) {
    console.error("Failed to generate AI response:", error);
    throw new Error("Failed to contact the AI model.");
  }
}
