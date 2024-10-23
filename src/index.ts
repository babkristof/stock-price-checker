import express, { Express } from 'express';
import { PrismaClient } from '@prisma/client';
import config from './config/config';
import stockRoutes from './routes/stockRoutes'
import { errorMiddleware } from './middlewares/errorMiddleware'

const app: Express = express();
app.use(express.json());
app.use('/stock', stockRoutes);

export const prismaClient = new PrismaClient({
    log: ['query'],
});
app.use(errorMiddleware);

app.listen(config.port, () => {console.log(`Server is running on port ${config.port}`)});