import { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { config } from '../config/env';

export const helmetMiddleware = helmet({
  contentSecurityPolicy: config.isProd,
  crossOriginEmbedderPolicy: config.isProd,
});

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    const allowedOrigins = [config.frontendUrl];
    if (config.isDev) {
      allowedOrigins.push(
        'http://localhost:3000',
        'http://localhost:4200',
        'http://localhost:5173'
      );
    }

    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  maxAge: 86400,
});

export const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: config.isProd ? 100 : 1000,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later',
    },
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const strictRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many attempts, please try again in 15 minutes',
    },
  },
});

export const requestSizeLimiter = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const contentLength = req.headers['content-length'];
  const maxBytes = 10 * 1024 * 1024;

  if (contentLength && parseInt(contentLength, 10) > maxBytes) {
    return res.status(413).json({
      success: false,
      error: {
        code: 'PAYLOAD_TOO_LARGE',
        message: 'Request payload exceeds 10MB limit',
      },
    });
  }

  next();
};