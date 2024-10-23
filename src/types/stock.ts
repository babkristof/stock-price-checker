import { Stock, StockPrice } from "@prisma/client";

export type StockWithPrices = Stock & { prices: StockPrice[] };

export interface StockResponse {
    symbol: string;
    currentPrice: number;
    lastUpdated: Date;
    movingAverage: number | null;
}

export interface FullStockQuote {
    c: number;
    d: number;
    dp: number;
    h: number;
    l: number;
    o: number;
    pc: number;
    t: number;
  }
  
export type StockQuote = Pick<FullStockQuote, 'c'>;
