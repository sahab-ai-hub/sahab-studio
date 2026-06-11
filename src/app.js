const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

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

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes placeholder
app.get('/api', (req, res) => {
  res.json({ message: 'Sahab Studio API', version: '1.0.0' });
});

// Auth routes placeholder
app.post('/api/auth/register', (req, res) => {
  res.status(201).json({ message: 'Register endpoint' });
});

app.post('/api/auth/login', (req, res) => {
  res.status(200).json({ message: 'Login endpoint' });
});

module.exports = app;
