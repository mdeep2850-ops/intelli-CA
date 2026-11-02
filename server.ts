import path from 'path';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createExpressApp } from './server/app';

// Ensure default fallback if not explicitly set
if (!process.env.VITE_API_BASE_URL) {
  process.env.VITE_API_BASE_URL = '/api/v1';
}

async function startServer() {
  const app = createExpressApp();

  // Render passes PORT dynamically (e.g. 10000 or custom port)
  // In local/container environments, defaults to 3000
  const PORT = Number(process.env.PORT) || 3000;

  // --- Vite Dev Middleware or Production Static File Serving ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Intelli-CA Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
