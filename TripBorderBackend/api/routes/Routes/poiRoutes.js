import { Router } from 'express';
import { getAllPOIsPagination, getPOIsByTrip } from '../controllers/poiController';

const poisRouter = Router();

poisRouter.get('/', getAllPOIsPagination);
poisRouter.post('/poisbytrip', getPOIsByTrip);

export default poisRouter;
