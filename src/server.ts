import 'reflect-metadata';
import { createApp } from './app';
import { AppDataSource } from './config/data-source';
import { config } from './config/env';
import { createLogger } from './utils/logger';

const logger = createLogger('Server');

const startServer = async (): Promise<void> => {
  try {
    await AppDataSource.initialize();
    logger.info('MySQL database connection established successfully');

    const app = createApp();
    const server = app.listen(config.port, () => {
      logger.info(
        `Server running in ${config.env} mode on http://localhost:${config.port}/api/v1`
      );
    });

    const shutdown = async (signal: string): Promise<void> => {
      logger.warn(`${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        if (AppDataSource.isInitialized) {
          await AppDataSource.destroy();
          logger.info('Database connection closed');
        }
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();