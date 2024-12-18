import { Request, Response } from 'express'
import { stockSymbolSchema } from '../validators/stockSchema'
import { getStockData , initiatePriceCheck} from '../services/stockService'
import logger from '../config/logger';

export const getStock = async(req: Request, res: Response) => {
    const { symbol } = stockSymbolSchema.parse(req.params);
    logger.info(`Fetching stock data for symbol: ${symbol}`);

    const stockData = await getStockData(symbol);

    logger.info(`Successfully fetched stock data for symbol: ${symbol}`);
    res.status(200).json(stockData);
}

export const startPriceCheck = async(req: Request, res: Response) => {
    const { symbol } = stockSymbolSchema.parse(req.params);
    logger.info(`Starting periodic price check for symbol: ${symbol}`);

    await initiatePriceCheck(symbol);

    logger.info(`Started periodic price check for symbol: ${symbol}`);
    res.status(200).json({ started: true });
}
