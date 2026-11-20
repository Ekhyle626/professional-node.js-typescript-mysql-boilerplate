import express, { Application } from 'express';
import {
  helmetMiddleware,
  corsMiddleware,
  rateLimiter,
  requestSizeLimiter,
} from './middleware/security';
import { errorHandler, notFoundHandler } from './middleware/errorHandler';
import routes from '.';
import { createLogger } from './utils/logger';

const logger = createLogger('App');

export const createApp = (): Application => {
  const app = express();

  app.use(helmetMiddleware);
  app.use(corsMiddleware);
  app.use(requestSizeLimiter);
  app.use(rateLimiter);

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  app.use((req, _res, next) => {
    logger.http(`${req.method} ${req.path}`);
    next();
  });

  app.use('/api/v1', routes);
  // Backward-compatible API prefix for existing clients.
  app.use('/api', routes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
};