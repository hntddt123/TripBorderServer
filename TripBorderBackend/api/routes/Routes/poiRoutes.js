import { Router } from 'express';
import {
  getAllPOIsPagination,
  getPOIsByTrip,
  createPOIByTrip,
  deletePOIByID
} from '../controllers/poiController';

const poisRouter = Router();

poisRouter.get('/', getAllPOIsPagination);
poisRouter.post('/poisbytrip', getPOIsByTrip);
poisRouter.post('/upload', createPOIByTrip);
poisRouter.delete('/removebyid', deletePOIByID);

export default poisRouter;
