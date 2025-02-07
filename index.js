require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// OpenAI API Configuration
const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.API_KEY,
}));

// Valentine's Day Questions
const questions = [
  "What is your idea of a perfect romantic date?",
  "What’s your favorite love story—fictional or real?",
  "What song always reminds you of love?",
  "If you could plan a surprise for your crush, what would it be?",
  "What’s the most romantic thing someone has ever done for you?"
];

// API Route to Get a Random Question
app.get('/api/question', (req, res) => {
  const randomQuestion = questions[Math.floor(Math.random() * questions.length)];
  res.json({ question: randomQuestion });
});

// API Route to Generate AI-Powered Response
app.post('/api/response', async (req, res) => {
  try {
    const { userResponse } = req.body;
    const prompt = `Respond romantically to: ${userResponse}`;
    
    const aiResponse = await openai.createCompletion({
      model: "gpt-4o-mini",
      prompt: prompt,
      max_tokens: 50,
    });

    res.json({ aiReply: aiResponse.data.choices[0].text.trim() });
  } catch (error) {
    res.status(500).json({ error: 'Error generating response' });
  }
});

// Start Server
app.listen(port, () => {
  console.log(`Cupid server running on http://localhost:${port}`);
});
