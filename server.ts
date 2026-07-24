import express from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily/safely
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    try {
      aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    } catch (err) {
      console.warn('Failed to initialize GoogleGenAI client:', err);
    }
  }
  return aiClient;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// POST /api/chat - AI Assistant endpoint using Groq or Gemini AI
app.post('/api/chat', async (req, res) => {
  try {
    const { message, mentorId, history } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemPrompt = `You are MentorLink AI. Help students with:
- Academics
- Coding
- Placements
- Internships
- Resume Reviews
- Career Guidance

Keep answers short, highly encouraging, and practical.`;

    let replyText = '';

    // Try Groq API if key is available
    if (process.env.GROQ_API_KEY) {
      try {
        const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
              { role: 'system', content: systemPrompt },
              ...(history || []).map((h: any) => ({
                role: h.isAi ? 'assistant' : 'user',
                content: h.text
              })),
              { role: 'user', content: message }
            ],
            temperature: 0.7,
            max_tokens: 500
          })
        });

        if (groqResponse.ok) {
          const groqData = await groqResponse.json();
          replyText = groqData.choices?.[0]?.message?.content || '';
        }
      } catch (err) {
        console.warn('Groq API call failed, falling back to Gemini or default:', err);
      }
    }

    // Fallback to Gemini API if Groq wasn't used or failed
    if (!replyText) {
      const gemini = getGeminiClient();
      if (gemini) {
        try {
          const prompt = `${systemPrompt}\n\nUser Question: ${message}`;
          const response = await gemini.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
          });
          replyText = response.text || '';
        } catch (err) {
          console.warn('Gemini API call failed:', err);
        }
      }
    }

    // General intelligent response if API keys aren't set
    if (!replyText) {
      const q = message.toLowerCase();
      if (q.includes('resume') || q.includes('cv')) {
        replyText = "For strong tech resumes: 1. Quantify impact (e.g. 'Reduced latency by 35%'). 2. List tech stack at the top. 3. Highlight system architecture & key contributions.";
      } else if (q.includes('placement') || q.includes('interview') || q.includes('coding')) {
        replyText = "Placement prep strategy: 1. Master Data Structures (Trees, Graphs, DP). 2. Practice System Design fundamentals. 3. Mock interview with a MentorLink mentor!";
      } else if (q.includes('internship') || q.includes('job')) {
        replyText = "To secure internships: 1. Build 2 high-quality full-stack projects. 2. Get referrals from mentors. 3. Maintain an active GitHub and LinkedIn profile.";
      } else {
        replyText = "Great question! Focusing on core fundamentals, building real-world projects, and getting 1-on-1 feedback from senior mentors is the fastest path to career growth.";
      }
    }

    return res.json({
      id: 'msg_' + Date.now(),
      senderId: mentorId || 'ai_mentor',
      senderName: mentorId ? 'Mentor' : 'MentorLink AI Guide',
      isAi: !mentorId,
      text: replyText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestions: [
        'How should I prepare for System Design interviews?',
        'What projects look best on a resume?',
        'How do I request a mentor referral?'
      ]
    });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({ error: 'Internal server error in AI Chat' });
  }
});

// Start Express server and mount Vite middleware
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`MentorLink Backend running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
