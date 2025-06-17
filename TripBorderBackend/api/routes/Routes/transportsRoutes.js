import { Router } from 'express';
import { getAllTransportsPagination, getTransportsByTrip } from '../controllers/transportsController';

const transportsRouter = Router();

transportsRouter.get('/', getAllTransportsPagination);
transportsRouter.post('/transportsbytrip', getTransportsByTrip);

export default transportsRouter;
