import { Router } from 'express';
import { getAllTransportsPagination } from '../controllers/transportsController';

const transportsRouter = Router();

transportsRouter.get('/', getAllTransportsPagination);

export default transportsRouter;
