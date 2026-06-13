import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json({ limit: '50kb' }));

app.post('/api/chat', async (req, res) => {
  const { messages, systemPrompt } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(503).json({ error: 'No GEMINI_API_KEY configured on server' });
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: messages.map(m => ({
            role: m.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: m.text }]
          })),
          generationConfig: { temperature: 0.9, maxOutputTokens: 150 }
        })
      }
    );

    if (!response.ok) {
      const err = await response.text();
      console.error('Gemini API error:', err);
      return res.status(502).json({ error: 'Gemini API error' });
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!reply) return res.status(502).json({ error: 'Empty response' });

    res.json({ reply });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Solstice API server running on http://localhost:${PORT}`);
  console.log('Set GEMINI_API_KEY env var for live AI responses.');
});
