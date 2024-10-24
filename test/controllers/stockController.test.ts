import sinon from 'sinon';
import { expect } from 'chai';
import { Request, Response } from 'express';
import { getStock, startPriceCheck } from '../../src/controllers/stockController';
import * as stockService from '../../src/services/stockService';
import { StockResponse } from '../../src/types/stock';
import logger from '../../src/config/logger'; 
import { ZodError } from 'zod';

describe('Stock Controller', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let statusSpy: sinon.SinonSpy;
  let jsonSpy: sinon.SinonSpy;
  let infoSpy: sinon.SinonSpy;

  beforeEach(() => {
    req = {};
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    statusSpy = res.status as sinon.SinonSpy;
    jsonSpy = res.json as sinon.SinonSpy;
    infoSpy = sinon.spy(logger, 'info');
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('getStock', () => {
    it('should fetch stock data and return 200 with valid data', async () => {
      req.params = { symbol: 'AAPL' };
      const stockData: StockResponse = {
        symbol: 'AAPL',
        currentPrice: 213.222,
        lastUpdated: new Date(),
        movingAverage: 213.111 };
      sinon.stub(stockService, 'getStockData').resolves(stockData);
      await getStock(req as Request, res as Response);

      expect(statusSpy.calledWith(200)).to.be.true;
      expect(jsonSpy.calledWith(stockData)).to.be.true;
      expect(infoSpy.calledWith('Fetching stock data for symbol: ' + stockData.symbol)).to.be.true;
      expect(infoSpy.calledWith('Successfully fetched stock data for symbol: ' + stockData.symbol)).to.be.true;
    });

    it('should throw error if symbol is too long', async () => {
        req.params = { symbol: 'TOOLONGSYMBOL123' };

        try {
            await getStock(req as Request, res as Response);
        } catch (error) {
            expect(error instanceof ZodError).to.be.true;
            expect(infoSpy.called).to.be.false;
            if(error instanceof ZodError) {
                expect(error.errors[0].message).to.be.equal('Symbol must not exceed 5 characters');
            }
        }
    });

    it('should throw error if symbol is not a string', async () => {
        req.params = { symbol:  12345 as any };

        try {
            await getStock(req as Request, res as Response);
        } catch (error) {
            expect(error instanceof ZodError).to.be.true;
            expect(infoSpy.called).to.be.false;
            if(error instanceof ZodError) {
                expect(error.errors[0].message).to.be.equal('Expected string, received number');
            }
        }
      });

      it('should throw error if symbol is empty', async () => {
        req.params = { symbol: '' };

        try {
          await getStock(req as Request, res as Response);
        } catch (error) {
            expect(error instanceof ZodError).to.be.true;
            expect(infoSpy.called).to.be.false;
        if(error instanceof ZodError) {
            expect(error.errors[0].message).to.be.equal('Symbol must be at least 1 character long');
        }
        }
      });

      it('should throw error if symbol is missing', async () => {
        req.params = {};
    
        try {
          await getStock(req as Request, res as Response);
        } catch (error) {
            expect(error instanceof ZodError).to.be.true;
            expect(infoSpy.called).to.be.false;
            if (error instanceof ZodError) {
                expect(error.errors[0].message).to.be.equal('Required');
            }
        }
      });
  });

  describe('start price checking', () => {
    it('should start periodic price check and return 200 with success message', async () => {
        req.params = { symbol: 'AAPL' };
    
        sinon.stub(stockService, 'initiatePriceCheck').resolves();
    
        await startPriceCheck(req as Request, res as Response);
    
        expect(statusSpy.calledWith(200)).to.be.true;
        expect(jsonSpy.calledWith({ started: true })).to.be.true;
        expect(infoSpy.calledWith('Starting periodic price check for symbol: ' + req.params.symbol)).to.be.true;
        expect(infoSpy.calledWith('Started periodic price check for symbol: ' + req.params.symbol)).to.be.true;
    });

    it('should throw error if symbol is too long', async () => {
        req.params = { symbol: 'TOOLONGSYMBOL123' };
    
        try {
            await startPriceCheck(req as Request, res as Response);
        } catch (error) {
            expect(error instanceof ZodError).to.be.true;
            expect(infoSpy.called).to.be.false;
            if (error instanceof ZodError) {
                expect(error.errors[0].message).to.be.equal('Symbol must not exceed 5 characters');
            }
        }
    });

    it('should throw error if symbol is not a string', async () => {
        req.params = { symbol:  12345 as any };

        try {
            await startPriceCheck(req as Request, res as Response);
        } catch (error) {
            expect(error instanceof ZodError).to.be.true;
            expect(infoSpy.called).to.be.false;
            if(error instanceof ZodError) {
                expect(error.errors[0].message).to.be.equal('Expected string, received number');
            }
        }
      });

    it('should throw error if symbol is empty', async () => {
        req.params = { symbol: '' };

        try {
          await startPriceCheck(req as Request, res as Response);
        } catch (error) {
            expect(error instanceof ZodError).to.be.true;
            expect(infoSpy.called).to.be.false;
        if(error instanceof ZodError) {
            expect(error.errors[0].message).to.be.equal('Symbol must be at least 1 character long');
        }
        }
    });

    it('should throw error if symbol is missing', async () => {
        req.params = {};
    
        try {
          await startPriceCheck(req as Request, res as Response);
        } catch (error) {
            expect(error instanceof ZodError).to.be.true;
            expect(infoSpy.called).to.be.false;
            if (error instanceof ZodError) {
                expect(error.errors[0].message).to.be.equal('Required');
            }
        }
    });
  })
});
