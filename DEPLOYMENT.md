# Intelli-CA Deployment Guide (Render & Vercel)

This repository is architected for seamless zero-friction deployment to **Render** and **Vercel**. You can deploy it using either a **unified full-stack** approach or a **split architecture** (Frontend on Vercel, Backend on Render).

---

## Strategy A: Unified Full-Stack on Render (Recommended & Fastest)

Render hosts both the Express API backend and serves the compiled React Vite frontend from a single web service.

### Method 1: Instant Blueprint via `render.yaml`
1. Push your repository to GitHub or GitLab.
2. Go to [Render Dashboard](https://dashboard.render.com/) -> Click **Blueprints** -> **New Blueprint Instance**.
3. Select your repository. Render will automatically detect `render.yaml`.
4. Add your `GEMINI_API_KEY` under Environment Variables.
5. Click **Apply**. Render will automatically build and launch your full-stack service!

### Method 2: Manual Web Service Setup on Render
1. In Render, click **New +** -> **Web Service**.
2. Connect your Git repository.
3. Configure the following settings:
   - **Name**: `intelli-ca`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run start`
   - **Health Check Path**: `/health`
4. Add Environment Variables:
   - `NODE_ENV`: `production`
   - `GEMINI_API_KEY`: `<Your Google Gemini API Key>`
5. Click **Create Web Service**.

---

## Strategy B: Split Deployment (Frontend on Vercel + Backend on Render)

### Step 1: Deploy Backend to Render
1. Follow **Strategy A** to deploy the service on Render.
2. Copy your live Render URL (e.g. `https://intelli-ca-api.onrender.com`).
3. Verify your health endpoint is active by opening `https://intelli-ca-api.onrender.com/health`.

### Step 2: Deploy Frontend to Vercel
1. Go to [Vercel Dashboard](https://vercel.com/new) -> Import your Git repository.
2. Vercel will auto-detect **Vite** using the included `vercel.json`.
3. Under **Environment Variables**, add:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: `https://intelli-ca-api.onrender.com/api/v1` (replace with your actual Render URL)
4. Click **Deploy**.
5. Vercel will build the frontend into `/dist` and apply client-side routing rewrites automatically.
   *(CORS is enabled out of the box on the Express backend, so API calls between your Vercel domain and Render backend will work immediately).*

---

## Strategy C: Complete Deployment on Vercel (Frontend + Serverless API)

This repository includes an automated Vercel Serverless Function entry point at `/api/index.ts`.

1. Import your Git repository into Vercel.
2. Under **Environment Variables**, add:
   - `GEMINI_API_KEY`: `<Your Google Gemini API Key>`
   - `VITE_API_BASE_URL`: `/api/v1`
3. Click **Deploy**.
4. Vercel serves the static Vite frontend and handles `/api/*` and `/health` requests through the serverless function.

---

## Environment Variables Summary

| Variable | Required For | Description | Default |
| :--- | :--- | :--- | :--- |
| `GEMINI_API_KEY` | Backend | Google Gemini API Key for AI chat, extraction, and RAG | — |
| `VITE_API_BASE_URL` | Frontend | API endpoint for the web client. Use `/api/v1` for single-host or full Render URL for split | `/api/v1` |
| `PORT` | Backend | Port number for Express. Render sets this dynamically | `3000` |
| `NODE_ENV` | Both | Environment mode (`production` / `development`) | `production` |

---

## Local Verification Commands

```bash
# Install dependencies
npm install

# Run full-stack development server (binds on port 3000)
npm run dev

# Test production build (bundles Vite frontend + esbuild backend)
npm run build

# Start production server
npm run start
```
