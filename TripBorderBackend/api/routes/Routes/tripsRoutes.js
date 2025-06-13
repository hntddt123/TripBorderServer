import { Router } from 'express';
import { getAllTripsPagination, getTripsByEmailPagination } from '../controllers/tripsController';

const tripsRouter = Router();

tripsRouter.get('/', getAllTripsPagination);
tripsRouter.post('/tripsbyemail', getTripsByEmailPagination);

export default tripsRouter;
