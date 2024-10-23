import { Router } from 'express';
import { getStock, startPriceCheck } from '../controllers/stockController';
import { errorHandler } from '../utils/errorHandler'

const stockRoutes: Router = Router();

stockRoutes.get('/:symbol', errorHandler(getStock));
stockRoutes.put('/:symbol', errorHandler(startPriceCheck));

export default stockRoutes;