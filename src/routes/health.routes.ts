import { Router, Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { asyncHandler } from '../utils/asyncHandler';

const router = Router();

router.get(
  '/',
  asyncHandler(async (_req: Request, res: Response) => {
    const dbHealthy = AppDataSource.isInitialized;

    res.status(dbHealthy ? 200 : 503).json({
      success: dbHealthy,
      status: dbHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: dbHealthy ? 'connected' : 'disconnected',
    });
  })
);

export default router;