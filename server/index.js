import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import express from 'express';
import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 5000;

// In production, serve Vite's built static files
const distPath = path.resolve(__dirname, '../dist');
if (fs.existsSync(distPath)) {
  // Serve static assets with appropriate caching
  app.use(
    express.static(distPath, {
      maxAge: '1d',
      setHeaders: (res, filePath) => {
        // Never cache HTML so SPA updates immediately after deployment
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
          res.setHeader('Pragma', 'no-cache');
          res.setHeader('Expires', '0');
        }
      },
    })
  );

  // For any non-API route, send index.html for client-side routing (compatible with Express 4 & Express 5)
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) {
      return next();
    }
    res.sendFile(path.join(distPath, 'index.html'), (err) => {
      if (err) {
        console.error('[DurgamSoft API] Error serving index.html fallback:', err);
        res.status(500).send('Error loading application. Please check server logs.');
      }
    });
  });
}

app.listen(PORT, () => {
  console.log(`[DurgamSoft API] Server listening on http://localhost:${PORT}`);
  console.log(`[DurgamSoft API] Health check: http://localhost:${PORT}/api/health`);
});
