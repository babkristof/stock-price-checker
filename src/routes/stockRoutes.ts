import { Router } from 'express';
import { getStock, startPriceCheck } from '../controllers/stockController';
import { errorHandler } from '../utils/errorHandler'

const stockRoutes: Router = Router();

/**
 * @swagger
 * /stock/{symbol}:
 *   get:
 *     summary: Get stock data
 *     description: Returns the current price, last updated time, and moving average for a given stock symbol.
 *     parameters:
 *       - in: path
 *         name: symbol
 *         schema:
 *           type: string
 *         required: true
 *         description: The stock symbol (e.g., AAPL, TSLA)
 *     responses:
 *       200:
 *         description: Stock data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 symbol:
 *                   type: string
 *                   example: AAPL
 *                 currentPrice:
 *                   type: number
 *                   example: 145.67
 *                 lastUpdated:
 *                   type: string
 *                   format: date-time
 *                   example: "2023-10-23T15:53:00Z"
 *                 movingAverage:
 *                   type: number
 *                   example: 140.50
 *       400:
 *         description: Not enough price data for the stock symbol
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Not enough price data for AAPL. At least 10 prices are required."
 *                 errorCode:
 *                   type: integer
 *                   example: 1003
 *       404:
 *         description: Stock not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Stock not found for symbol: AAPL."
 *                 errorCode:
 *                   type: integer
 *                   example: 1001
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong"
 *                 errorCode:
 *                   type: integer
 *                   example: 2001
 */
stockRoutes.get('/:symbol', errorHandler(getStock));


/**
 * @swagger
 * /stock/{symbol}:
 *   put:
 *     summary: Start periodic stock price checks
 *     description: Starts a cron job that fetches stock prices every minute for the given symbol.
 *     parameters:
 *       - in: path
 *         name: symbol
 *         schema:
 *           type: string
 *         required: true
 *         description: The stock symbol (e.g., AAPL, TSLA)
 *     responses:
 *       200:
 *         description: Price check started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 started:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Bad Request (e.g., validation failed or unprocessable entity)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unprocessable entity"
 *                 errorCode:
 *                   type: integer
 *                   example: 1002
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: string
 *       404:
 *         description: Stock not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Stock not found"
 *                 errorCode:
 *                   type: integer
 *                   example: 1001
 *       409:
 *         description: Job already running for the specified stock symbol
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Price check for AAPL is already running."
 *                 errorCode:
 *                   type: integer
 *                   example: 3001
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Something went wrong"
 *                 errorCode:
 *                   type: integer
 *                   example: 2001
 */
stockRoutes.put('/:symbol', errorHandler(startPriceCheck));

export default stockRoutes;