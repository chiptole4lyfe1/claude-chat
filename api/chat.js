// api/chat.js
export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { apiKey, messages } = req.body;

    // Validate inputs
    if (!apiKey) {
      return res.status(400).json({ error: 'API key is required' });
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Valid message history is required' });
    }

    // Call Anthropic API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20240620',
        max_tokens: 1500,
        messages: messages
      })
    });

    const data = await response.json();

    // Check for API errors
    if (data.error) {
      return res.status(500).json({ error: data.error.message || 'Unknown API error' });
    }

    // Return the response
    return res.status(200).json({ 
      response: data.content?.[0]?.text || 'No text in response'
    });
  } catch (error) {
    console.error('Error calling Claude API:', error);
    return res.status(500).json({ error: error.message || 'Unknown error' });
  }
}
