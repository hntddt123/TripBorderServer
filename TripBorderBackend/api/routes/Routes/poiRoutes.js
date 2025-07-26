import { Router } from 'express';
import {
  getAllPOIsPagination,
  getPOIsByTrip,
  createPOIByTrip,
  updatePOIByID,
  deletePOIByID
} from '../controllers/poiController';

const poisRouter = Router();

poisRouter.get('/', getAllPOIsPagination);
poisRouter.post('/poisbytrip', getPOIsByTrip);
poisRouter.post('/upload', createPOIByTrip);
poisRouter.patch('/update/:uuid', updatePOIByID);
poisRouter.delete('/removebyid', deletePOIByID);

export default poisRouter;
