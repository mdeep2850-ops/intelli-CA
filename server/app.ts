import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { documentStorage } from './storage';
import { processAgentQuery } from './agent';

/**
 * Creates and configures the Express API application.
 * Decoupled from the HTTP server to enable easy deployment on:
 * - Render (as a Node.js fullstack service or standalone backend)
 * - Vercel (as a Serverless function in /api/index.ts)
 * - Docker / Cloud Run / AWS / GCP
 */
export function createExpressApp() {
  const app = express();

  // Permissive CORS to support split deployment (e.g. Vercel frontend + Render backend)
  app.use(
    cors({
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    })
  );

  app.use(express.json());

  // Multer setup for document uploads
  const upload = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  });

  // Health check endpoint (used by Render, Docker, AWS, Uptime monitors)
  app.get('/health', (req, res) => {
    res.json({
      status: 'ok',
      project: 'Intelli-CA',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Root API info endpoint
  app.get(['/api', '/api/v1'], (req, res) => {
    res.json({
      name: 'Intelli-CA API',
      version: '1.0.0',
      description: 'Intelli-CA Chartered Accountancy & Tax Intelligence API',
      endpoints: [
        '/health',
        '/api/v1/documents',
        '/api/v1/documents/upload',
        '/api/v1/documents/:id',
        '/api/v1/documents/search',
        '/api/v1/agent/query',
        '/api/v1/chat',
        '/api/v1/rag/query',
      ],
    });
  });

  // --- Document Routes ---
  app.get(['/api/v1/documents', '/api/v1/documents/'], (req, res) => {
    const skip = parseInt(req.query.skip as string, 10) || 0;
    const limit = parseInt(req.query.limit as string, 10) || 100;
    const docs = documentStorage.listDocuments(skip, limit);
    res.json(docs);
  });

  app.post('/api/v1/documents/upload', upload.single('file'), (req, res) => {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ detail: 'No file provided' });
    }

    const allowedExtensions = ['.pdf', '.docx', '.xlsx'];
    const originalname = file.originalname || '';
    const hasValidExt = allowedExtensions.some((ext) =>
      originalname.toLowerCase().endsWith(ext)
    );

    if (!hasValidExt) {
      return res.status(400).json({
        detail: 'Invalid file extension. Only PDF, DOCX, and XLSX are allowed.',
      });
    }

    try {
      const doc = documentStorage.saveDocument(file);
      res.json(doc);
    } catch (err: any) {
      res.status(500).json({ detail: err.message || 'Failed to upload document' });
    }
  });

  app.get('/api/v1/documents/:id', (req, res) => {
    const docId = parseInt(req.params.id, 10);
    const doc = documentStorage.getDocument(docId);
    if (!doc) {
      return res.status(404).json({ detail: 'Document not found' });
    }
    res.json(doc);
  });

  app.delete('/api/v1/documents/:id', (req, res) => {
    const docId = parseInt(req.params.id, 10);
    const success = documentStorage.deleteDocument(docId);
    if (!success) {
      return res.status(404).json({ detail: 'Document not found' });
    }
    res.json({ message: 'Document deleted successfully' });
  });

  app.post('/api/v1/documents/:id/process', (req, res) => {
    const docId = parseInt(req.params.id, 10);
    const success = documentStorage.processDocument(docId);
    if (!success) {
      return res.status(404).json({ detail: 'Document not found' });
    }
    res.json({ message: 'Document processed successfully', document_id: docId });
  });

  app.post('/api/v1/documents/search', (req, res) => {
    const { query, limit } = req.body || {};
    const results = documentStorage.search(query || '', limit || 5);
    res.json(results);
  });

  // --- Agent & RAG Routes ---
  app.post('/api/v1/agent/query', async (req, res) => {
    try {
      const { query, limit, filters } = req.body || {};
      if (!query) {
        return res.status(400).json({ detail: 'Query is required' });
      }
      const response = await processAgentQuery({ query, limit, filters });
      res.json(response);
    } catch (err: any) {
      res.status(500).json({ detail: err.message || 'Agent query failed' });
    }
  });

  app.post('/api/v1/chat', async (req, res) => {
    const { content, session_id } = req.body || {};
    const sessionId = session_id || Date.now();
    try {
      const agentRes = await processAgentQuery({ query: content || '' });
      res.json({
        content: agentRes.answer,
        role: 'assistant',
        session_id: sessionId,
      });
    } catch (err: any) {
      res.status(500).json({ detail: err.message || 'Chat generation failed' });
    }
  });

  app.post('/api/v1/rag/query', async (req, res) => {
    const { query, limit } = req.body || {};
    try {
      const agentRes = await processAgentQuery({ query: query || '', limit });
      res.json({
        answer: agentRes.answer,
        citations: agentRes.citations,
        is_sufficient: agentRes.citations.length > 0,
      });
    } catch (err: any) {
      res.status(500).json({ detail: err.message || 'RAG query failed' });
    }
  });

  return app;
}
