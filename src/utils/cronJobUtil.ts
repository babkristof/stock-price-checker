import cron from 'node-cron';
import { Stock } from '@prisma/client';
import logger from '../config/logger';
import { JobAlreadyRunningException } from '../exceptions/JobAlreadyRunningException';
import { fetchStockFromApi } from './stockApiUtil';
import { saveStockQuote } from '../services/stockService';
import { InternalException } from '../exceptions/InternalException';
import { ErrorCode } from '../exceptions/ErrorCode';

const scheduledJobs: { [symbol: string]: cron.ScheduledTask } = {};

export const startPriceCheckJob = (stock: Stock) => {
    if (scheduledJobs[stock.symbol]) {
        throw new JobAlreadyRunningException(stock.symbol);
    }
      const job = cron.schedule('* * * * *', async () => {
      try {
        const stockQuote = await fetchStockFromApi(stock);
        await saveStockQuote(stockQuote,stock);
      } catch (error) {
        logger.error(`Error during scheduled task for ${stock.symbol}: ${error}`);
        throw new InternalException(`Error running scheduled task for ${stock.symbol}`,error,ErrorCode.INTERNAL_EXCEPTION);
      }
    });
  
    job.start();
    scheduledJobs[stock.symbol] = job;
    logger.info(`Started price check for symbol: ${stock.symbol}`);
  };
