const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const {
  generateText,
  generateTextStream,
  MODEL_NAME,
} = require('./config/kimi');

const app = express();
app.set('trust proxy', 1);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

// ── Health check ──────────────────────────────────────────────────────────────

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── API info ──────────────────────────────────────────────────────────────────

app.get('/api', (req, res) => {
  res.json({ message: 'Sahab Studio API', version: '1.0.0', ai: MODEL_NAME });
});

// ── Auth routes (placeholder) ─────────────────────────────────────────────────

app.post('/api/auth/register', (req, res) => {
  res.status(201).json({ message: 'Register endpoint' });
});

app.post('/api/auth/login', (req, res) => {
  res.status(200).json({ message: 'Login endpoint' });
});

// ── Mistral 7B AI endpoints ───────────────────────────────────────────────────

/**
 * POST /api/ai/generate
 *
 * Body:
 *   { messages: [{role, content}, ...], maxTokens?, temperature?, topP? }
 *
 * Returns the full generated text in one response.
 */
app.post('/api/ai/generate', async (req, res) => {
  const { messages, maxTokens, temperature, topP } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res
      .status(400)
      .json({ error: '`messages` must be a non-empty array.' });
  }

  try {
    const result = await generateText(messages, { maxTokens, temperature, topP });
    res.json(result);
  } catch (err) {
    console.error('❌ Mistral generate error:', err.message);
    res.status(502).json({ error: err.message });
  }
});

/**
 * POST /api/ai/stream
 *
 * Body:
 *   { messages: [{role, content}, ...], maxTokens?, temperature?, topP? }
 *
 * Streams the response as Server-Sent Events (text/event-stream).
 * Each event: `data: <token>\n\n`
 * Final event: `data: [DONE]\n\n`
 */
app.post('/api/ai/stream', async (req, res) => {
  const { messages, maxTokens, temperature, topP } = req.body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return res
      .status(400)
      .json({ error: '`messages` must be a non-empty array.' });
  }

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  try {
    await generateTextStream(
      messages,
      (chunk) => res.write(`data: ${chunk}\n\n`),
      { maxTokens, temperature, topP }
    );
    res.write('data: [DONE]\n\n');
  } catch (err) {
    console.error('❌ Mistral stream error:', err.message);
    res.write(`data: [ERROR] ${err.message}\n\n`);
  } finally {
    res.end();
  }
});

module.exports = app;
