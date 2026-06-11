/**
 * Kimi K2.6 Client Configuration
 *
 * Supports two deployment modes:
 *   1. Local vLLM  — set KIMI_LOCAL_URL (e.g. http://localhost:8000)
 *   2. Remote API  — set KIMI_API_ENDPOINT + KIMI_API_KEY
 *
 * Environment variables:
 *   KIMI_LOCAL_URL      Local vLLM base URL (takes priority when set)
 *   KIMI_API_ENDPOINT   Remote Kimi API base URL
 *   KIMI_API_KEY        API key for remote endpoint (optional for local)
 *   KIMI_MODEL_NAME     Model identifier (default: "kimi-k2.6")
 */

'use strict';

require('dotenv').config();
const axios = require('axios');

// ── Configuration ────────────────────────────────────────────────────────────

const MODEL_NAME = process.env.KIMI_MODEL_NAME || 'kimi-k2.6';

/**
 * Resolve the active base URL.
 * Local vLLM takes priority over the remote API endpoint.
 */
function getBaseUrl() {
  if (process.env.KIMI_LOCAL_URL) {
    return process.env.KIMI_LOCAL_URL.replace(/\/$/, '');
  }
  if (process.env.KIMI_API_ENDPOINT) {
    return process.env.KIMI_API_ENDPOINT.replace(/\/$/, '');
  }
  return null;
}

/**
 * Build shared Axios request headers.
 */
function buildHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  if (process.env.KIMI_API_KEY) {
    headers['Authorization'] = `Bearer ${process.env.KIMI_API_KEY}`;
  }
  return headers;
}

// ── Health check ─────────────────────────────────────────────────────────────

/**
 * Verify that the Kimi endpoint is reachable.
 * Returns { ok: true } on success or { ok: false, error: string } on failure.
 */
async function checkKimiConnection() {
  const baseUrl = getBaseUrl();

  if (!baseUrl) {
    return {
      ok: false,
      error:
        'No Kimi endpoint configured. Set KIMI_LOCAL_URL or KIMI_API_ENDPOINT.',
    };
  }

  try {
    // vLLM exposes /v1/models; remote APIs typically do the same.
    await axios.get(`${baseUrl}/v1/models`, {
      headers: buildHeaders(),
      timeout: 5000,
    });
    return { ok: true, baseUrl, model: MODEL_NAME };
  } catch (err) {
    return {
      ok: false,
      error: err.response
        ? `HTTP ${err.response.status}: ${JSON.stringify(err.response.data)}`
        : err.message,
    };
  }
}

// ── Text generation ───────────────────────────────────────────────────────────

/**
 * Send a chat-completion request to Kimi K2.6 and return the full response.
 *
 * @param {Array<{role: string, content: string}>} messages  Chat history.
 * @param {object} [options]
 * @param {number} [options.maxTokens=2048]   Maximum tokens to generate.
 * @param {number} [options.temperature=0.7]  Sampling temperature.
 * @param {number} [options.topP=0.9]         Nucleus sampling probability.
 * @returns {Promise<{text: string, usage: object, model: string}>}
 */
async function generateText(messages, options = {}) {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    throw new Error(
      'Kimi endpoint not configured. Set KIMI_LOCAL_URL or KIMI_API_ENDPOINT.'
    );
  }

  const payload = {
    model: MODEL_NAME,
    messages,
    max_tokens: options.maxTokens ?? 2048,
    temperature: options.temperature ?? 0.7,
    top_p: options.topP ?? 0.9,
    stream: false,
  };

  try {
    const response = await axios.post(
      `${baseUrl}/v1/chat/completions`,
      payload,
      { headers: buildHeaders(), timeout: 120_000 }
    );

    const choice = response.data.choices?.[0];
    if (!choice) {
      throw new Error('Kimi returned an empty choices array.');
    }

    return {
      text: choice.message?.content ?? '',
      usage: response.data.usage ?? {},
      model: response.data.model ?? MODEL_NAME,
    };
  } catch (err) {
    const detail = err.response
      ? `HTTP ${err.response.status}: ${JSON.stringify(err.response.data)}`
      : err.message;
    throw new Error(`Kimi generateText failed: ${detail}`);
  }
}

// ── Streaming generation ──────────────────────────────────────────────────────

/**
 * Stream a chat-completion response from Kimi K2.6.
 * Calls `onChunk(text)` for every incremental token and resolves when done.
 *
 * @param {Array<{role: string, content: string}>} messages  Chat history.
 * @param {function(string): void} onChunk  Callback for each streamed token.
 * @param {object} [options]
 * @param {number} [options.maxTokens=2048]
 * @param {number} [options.temperature=0.7]
 * @param {number} [options.topP=0.9]
 * @returns {Promise<{fullText: string, model: string}>}
 */
async function generateTextStream(messages, onChunk, options = {}) {
  const baseUrl = getBaseUrl();
  if (!baseUrl) {
    throw new Error(
      'Kimi endpoint not configured. Set KIMI_LOCAL_URL or KIMI_API_ENDPOINT.'
    );
  }

  const payload = {
    model: MODEL_NAME,
    messages,
    max_tokens: options.maxTokens ?? 2048,
    temperature: options.temperature ?? 0.7,
    top_p: options.topP ?? 0.9,
    stream: true,
  };

  try {
    const response = await axios.post(
      `${baseUrl}/v1/chat/completions`,
      payload,
      {
        headers: buildHeaders(),
        responseType: 'stream',
        timeout: 120_000,
      }
    );

    return new Promise((resolve, reject) => {
      let fullText = '';
      let modelName = MODEL_NAME;
      let buffer = '';

      response.data.on('data', (chunk) => {
        buffer += chunk.toString('utf8');
        const lines = buffer.split('\n');
        // Keep the last (potentially incomplete) line in the buffer
        buffer = lines.pop();

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed || trimmed === 'data: [DONE]') continue;

          const jsonStr = trimmed.startsWith('data: ')
            ? trimmed.slice(6)
            : trimmed;

          try {
            const parsed = JSON.parse(jsonStr);
            modelName = parsed.model ?? modelName;
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              fullText += delta;
              onChunk(delta);
            }
          } catch {
            // Ignore malformed SSE lines
          }
        }
      });

      response.data.on('end', () => resolve({ fullText, model: modelName }));
      response.data.on('error', (err) =>
        reject(new Error(`Kimi stream error: ${err.message}`))
      );
    });
  } catch (err) {
    const detail = err.response
      ? `HTTP ${err.response.status}: ${JSON.stringify(err.response.data)}`
      : err.message;
    throw new Error(`Kimi generateTextStream failed: ${detail}`);
  }
}

// ── Exports ───────────────────────────────────────────────────────────────────

module.exports = {
  MODEL_NAME,
  getBaseUrl,
  checkKimiConnection,
  generateText,
  generateTextStream,
};
