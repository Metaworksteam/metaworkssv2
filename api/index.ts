// Vercel Serverless Function Entry Point
// This file wraps the Express app for Vercel's serverless environment
// Note: Static files are automatically served by Vercel from outputDirectory
// This function only handles API routes

import type { VercelRequest, VercelResponse } from '@vercel/node';
import express, { type Express } from 'express';
import { registerRoutes } from '../server/routes';

// Create a singleton Express app instance
let appInstance: Express | null = null;

async function getApp(): Promise<Express> {
  if (appInstance) {
    return appInstance;
  }

  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  // Register all API routes
  // Note: registerRoutes returns a Server, but we don't need it in serverless
  await registerRoutes(app);

  // Error handler
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(status).json({ message });
  });

  appInstance = app;
  return app;
}

// Export handler for Vercel
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const app = await getApp();
  
  // Convert Vercel request/response to Express-compatible format
  return new Promise<void>((resolve) => {
    // Enhance request object with Express-expected properties
    const expressReq = Object.assign(req, {
      protocol: (req.headers['x-forwarded-proto'] as string) || 'https',
      secure: req.headers['x-forwarded-proto'] === 'https',
      ip: (req.headers['x-forwarded-for'] as string)?.split(',')[0] || req.socket.remoteAddress,
      hostname: req.headers.host?.split(':')[0],
      get: (name: string) => req.headers[name.toLowerCase()],
    }) as any;

    // Enhance response object
    const expressRes = Object.assign(res, {
      locals: {},
    }) as any;

    // Handle the request through Express middleware stack
    app(expressReq, expressRes, (err?: any) => {
      if (err) {
        // If there's an error and it hasn't been handled, send 500
        if (!expressRes.headersSent) {
          expressRes.status(500).json({ message: err.message || 'Internal Server Error' });
        }
      } else if (!expressRes.headersSent) {
        // If no route matched, send 404
        expressRes.status(404).json({ message: 'Not found' });
      }
      resolve();
    });
  });
}

