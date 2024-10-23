import { prismaClient } from '..';
import { ErrorCode } from '../exceptions/ErrorCode';
import { NotFoundException } from '../exceptions/NotFoundException'
import logger from '../config/logger';

export const getStockData = async (symbol: string) => {
    logger.debug(`Querying database for stock: ${symbol}`);

    const stock = await prismaClient.stock.findFirst({
      where: { 
        symbol: {
            equals: symbol,
            mode: 'insensitive'
        }
       }
    });
    if (!stock) {
      logger.error(`Stock not found: ${symbol}`);
      throw new NotFoundException('Stock not found', ErrorCode.STOCK_NOT_FOUND);
    }
    logger.debug(`Stock data found for: ${symbol}`);
    return stock;
  };