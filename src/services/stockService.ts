import { Stock, StockPrice } from '@prisma/client';
import { prismaClient } from '../index';
import { ErrorCode } from '../exceptions/ErrorCode';
import { NotFoundException } from '../exceptions/NotFoundException';
import { startPriceCheckJob } from '../utils/cronJobUtil'
import logger from '../config/logger';
import { StockQuote, StockResponse, StockWithPrices } from '../types/stock';
import config from '../config/config';
import { HttpException } from '../exceptions/HttpException';

const RECORD_NUMBER_FOR_AVARAGE = config.recordNumberForAvarage;


export const getStockData = async (symbol: string): Promise<StockResponse> => {
    logger.debug(`Querying database for stock: ${symbol}`);

    const stockWithPrices:StockWithPrices = await getStockWithPrices(symbol);
    if (!hasSufficientPriceData(stockWithPrices)) {
        logger.error(`Not enough price data for ${symbol}. Only ${stockWithPrices.prices.length} prices found.`);
        throw new HttpException(`Not enough price data for ${symbol}. At least ${RECORD_NUMBER_FOR_AVARAGE} prices are required.`, ErrorCode.INSUFFICIENT_DATA,400);
    }

    const { latestPrice, lastUpdated } = getLatestPriceData(stockWithPrices.prices);
    const movingAverage = calculateSimpleMovingAverage(stockWithPrices.prices);

    logger.debug(`Successfully fetched stock data for: ${symbol}`);

    return {
        symbol: stockWithPrices.symbol,
        currentPrice: latestPrice,
        lastUpdated,
        movingAverage,
    };
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
};

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
};

const getStockWithPrices = async(symbol: string): Promise<StockWithPrices> => {
    const stockWithPrices = await prismaClient.stock.findFirst({
        where: { 
            symbol: { equals: symbol, mode: 'insensitive' }
        },
        include: {
            prices: {
                orderBy: { recordedAt: 'desc' },
                take: +RECORD_NUMBER_FOR_AVARAGE
            }
        }
    });

    if (!stockWithPrices) {
        logger.error(`Stock not found for symbol: ${symbol}`);
        throw new NotFoundException(`Stock not found for symbol: ${symbol}`, ErrorCode.STOCK_NOT_FOUND);
    }

    return stockWithPrices;
};

const hasSufficientPriceData = (stockWithPrices: StockWithPrices): boolean => {
    return stockWithPrices.prices.length >= +RECORD_NUMBER_FOR_AVARAGE;
};

const getLatestPriceData = (prices: StockPrice[]): { latestPrice: number, lastUpdated: Date } => {
    const latestPrice = Number(prices[0].price);
    const lastUpdated = prices[0].recordedAt;
    return { latestPrice, lastUpdated };
};

const calculateSimpleMovingAverage = (prices: StockPrice[]): number => {
    const totalPrice = prices.reduce((acc, price) => acc + Number(price.price), 0);
    return totalPrice / prices.length;
};