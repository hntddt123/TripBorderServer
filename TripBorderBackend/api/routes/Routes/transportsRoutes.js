import { Router } from 'express';
import {
  getAllTransportsPagination,
  getTransportsByTrip,
  createTransportByTrip,
  deleteTransportByID
} from '../controllers/transportsController';

const transportsRouter = Router();

transportsRouter.get('/', getAllTransportsPagination);
transportsRouter.post('/transportsbytrip', getTransportsByTrip);
transportsRouter.post('/upload', createTransportByTrip);
transportsRouter.delete('/removebyid', deleteTransportByID);

export default transportsRouter;
