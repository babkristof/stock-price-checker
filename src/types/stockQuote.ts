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
  