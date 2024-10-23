import { Request, Response } from 'express'
import { stockSymbolSchema } from '../validators/stockSchema'
import { getStockData } from '../services/stockService'

export const getStock = async(req: Request, res: Response) => {
    const { symbol } = stockSymbolSchema.parse(req.params);
    const stockData = await getStockData(symbol);
    res.status(200).json(stockData);
}

export const startPriceCheck = async(req: Request, res: Response) => {
}
