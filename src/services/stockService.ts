import { Stock, StockPrice } from '@prisma/client';
import { prismaClient } from '..';
import { ErrorCode } from '../exceptions/ErrorCode';
import { NotFoundException } from '../exceptions/NotFoundException';
import { startPriceCheckJob } from '../utils/cronJobUtil'
import logger from '../config/logger';
import { StockQuote } from '../types/stockQuote';

export const getStockData = async (symbol: string): Promise<Stock> => {
    logger.debug(`Querying database for stock: ${symbol}`);

    const stock:Stock = await getStock(symbol);

    logger.debug(`Stock data found for: ${symbol}`);
    return stock;
  };

export const initiatePriceCheck = async (symbol: string) => {
    logger.debug(`Fetching stock price for symbol: ${symbol}`);

    const stock:Stock = await getStock(symbol);
    
    startPriceCheckJob(stock);
    
};

export const saveStockQuote = async(stockQuote: StockQuote, stock: Stock):Promise<StockPrice> => {
    const savedStockPrice = await prismaClient.stockPrice.create({
        data: {
          price: stockQuote.c,
          stock: {
            connect: { id: stock.id },
          },
        },
      });
    logger.info(`Saved stock price for symbol ${stock.symbol}: ${savedStockPrice.price}`);
    return savedStockPrice;
}

const getStock = async(symbol: string): Promise<Stock> => {
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
      return stock;
}