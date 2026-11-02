import { createExpressApp } from '../server/app';

// Vercel Serverless Function entry point
// Routes all /api/* requests to the Express application
const app = createExpressApp();

export default app;
