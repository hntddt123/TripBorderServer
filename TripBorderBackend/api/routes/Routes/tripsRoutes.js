import { Router } from 'express';
import { getAllTripsPagination, getTripsByEmailPagination } from '../controllers/tripsController';

const tripsRouter = Router();

tripsRouter.get('/', getAllTripsPagination);
tripsRouter.get('/', getTripsByEmailPagination);

export default tripsRouter;
