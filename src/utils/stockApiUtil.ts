import axios from 'axios';
import { Stock } from '@prisma/client';
import config from "../config/config";
import logger from '../config/logger';
import { StockQuote, FullStockQuote } from '../types/stock';
import { InternalException } from '../exceptions/InternalException';
import { ErrorCode } from '../exceptions/ErrorCode';

const API_KEY = config.finnhubApiKey;
const BASE_URL = config.finnhubUrl;

export const fetchStockFromApi = async (stock: Stock): Promise<StockQuote> => {
  try {
    const response = await axios.get<FullStockQuote>(`${BASE_URL}/quote`, {
      params: { symbol:stock.symbol, token: API_KEY }
    });

    const stockQuote: StockQuote = { c: response.data.c };
    if (stockQuote.c == null) {
      throw new InternalException(`No price data found for the symbol. ${stock.symbol}`,null,ErrorCode.INTERNAL_EXCEPTION);

    }
    return stockQuote;
  } catch (error) {
    logger.error(`Error fetching stock data for ${stock.symbol}, error.  ${error}`);
    throw new InternalException(`Error fetching stock data for ${stock.symbol}`,error,ErrorCode.INTERNAL_EXCEPTION);
}
};
