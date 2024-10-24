import express, { Express } from 'express';
import { PrismaClient } from '@prisma/client';
import stockRoutes from './routes/stockRoutes'
import { errorMiddleware } from './middlewares/errorMiddleware'
import logger from './config/logger';


const app: Express = express();
app.use(express.json());

app.use((req, _res, next) => {
    logger.info(`[${req.method}] ${req.url} - Request received`);
    next();
});

app.use(async (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.debug(`[${req.method}] ${req.url} - ${res.statusCode} - ${duration}ms`);
    });
    next();
});

app.use('/stock', stockRoutes);

export const prismaClient = new PrismaClient();

app.use(errorMiddleware);

export default app;