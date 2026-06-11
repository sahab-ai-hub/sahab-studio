# Sahab Studio

AI-powered design platform backend — Node.js + Express.js, powered by **Kimi K2.6**.

---

## Getting started

```bash
npm install
cp .env.example .env   # fill in the values below
npm run dev
```

---

## Environment variables

### Database

| Variable       | Description                        | Required |
|----------------|------------------------------------|----------|
| `DATABASE_URL` | PostgreSQL connection string       | Yes      |

### Kimi K2.6 (AI)

Kimi K2.6 is the open-source model used for all AI features. Two deployment
modes are supported — **local vLLM** (recommended for full control) and a
**remote API endpoint**.

| Variable              | Description                                                                 | Required          |
|-----------------------|-----------------------------------------------------------------------------|-------------------|
| `KIMI_LOCAL_URL`      | Base URL of a local vLLM server (e.g. `http://localhost:8000`). Takes priority over `KIMI_API_ENDPOINT` when set. | One of the two    |
| `KIMI_API_ENDPOINT`   | Base URL of a remote Kimi-compatible API (e.g. `https://api.moonshot.cn`)   | One of the two    |
| `KIMI_API_KEY`        | Bearer token / API key for the endpoint (not required for local vLLM)       | Conditional       |
| `KIMI_MODEL_NAME`     | Model identifier sent in every request (default: `kimi-k2.6`)               | No                |

#### Local vLLM quick-start

```bash
# Pull and serve Kimi K2.6 with vLLM
pip install vllm
vllm serve moonshotai/Kimi-K2-Instruct \
  --served-model-name kimi-k2.6 \
  --port 8000
```

Then set `KIMI_LOCAL_URL=http://localhost:8000` in your `.env`.

### Payments

| Variable         | Description              | Required |
|------------------|--------------------------|----------|
| `STRIPE_API_KEY` | Stripe secret key        | Yes      |

### Auth

| Variable     | Description                          | Required |
|--------------|--------------------------------------|----------|
| `JWT_SECRET` | Secret used to sign JWT tokens       | Yes      |

### Server

| Variable   | Description                    | Default |
|------------|--------------------------------|---------|
| `PORT`     | HTTP port the server listens on | `3000`  |
| `NODE_ENV` | `development` or `production`  | —       |

---

## AI endpoints

| Method | Path                | Description                                      |
|--------|---------------------|--------------------------------------------------|
| `POST` | `/api/ai/generate`  | Full response — returns `{ text, usage, model }` |
| `POST` | `/api/ai/stream`    | Server-Sent Events stream of incremental tokens  |

**Request body (both endpoints):**

```json
{
  "messages": [
    { "role": "system", "content": "You are a helpful design assistant." },
    { "role": "user",   "content": "Generate a color palette for a fintech app." }
  ],
  "maxTokens": 2048,
  "temperature": 0.7,
  "topP": 0.9
}
```

---

## Why Kimi K2.6?

- Matches Claude Opus 4.7 on coding benchmarks
- Fully open-source — deploy on your own infrastructure
- Significantly lower cost than proprietary APIs
- OpenAI-compatible API surface (drop-in for vLLM)
