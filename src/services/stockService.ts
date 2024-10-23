import { prismaClient } from '..';
import { ErrorCode } from '../exceptions/ErrorCode';
import { NotFoundException } from '../exceptions/NotFoundException'

export const getStockData = async (symbol: string) => {
    const stock = await prismaClient.stock.findFirst({
      where: { 
        symbol: {
            equals: symbol,
            mode: 'insensitive'
        }
       }
    });
    if (!stock) {
      throw new NotFoundException('Stock not found', ErrorCode.STOCK_NOT_FOUND);
    }
    return stock;
  };