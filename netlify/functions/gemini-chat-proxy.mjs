// Netlify Function: Chat Proxy — keeps Gemini API key server-side
// Routes EMMA chat through the server so students never need API keys
export default async (request) => {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405, headers: { 'Content-Type': 'application/json' }
    });
  }

  const GEMINI_KEY = Netlify.env.get('GEMINI_API_KEY');
  if (!GEMINI_KEY) {
    return new Response(JSON.stringify({ error: 'Chat API key not configured' }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const body = await request.json();
    const { systemContext, userMessage } = body;
    const model = body.model || 'gemini-2.0-flash';

    if (!userMessage) {
      return new Response(JSON.stringify({ error: 'Missing "userMessage" field' }), {
        status: 400, headers: { 'Content-Type': 'application/json' }
      });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_KEY}`;

    const payload = {
      contents: [{ parts: [{ text: userMessage }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 512,
        topP: 0.9
      }
    };

    // Add system instruction if provided
    if (systemContext) {
      payload.system_instruction = { parts: [{ text: systemContext }] };
    }

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const data = await resp.json();

    // Extract the text response
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || null;

    return new Response(JSON.stringify({ text, raw: data }), {
      status: resp.status,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { 'Content-Type': 'application/json' }
    });
  }
};
