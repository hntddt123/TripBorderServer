import { Router } from 'express';
import { getAllPOIsPagination } from '../controllers/poiController';

const poisRouter = Router();

poisRouter.get('/', getAllPOIsPagination);

export default poisRouter;
