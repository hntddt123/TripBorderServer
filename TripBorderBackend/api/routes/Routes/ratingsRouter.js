import { Router } from 'express';
import { getAllRatingsPagination, getRatingsByTrip } from '../controllers/ratingsController';

const ratingsRouter = Router();

ratingsRouter.get('/', getAllRatingsPagination);
ratingsRouter.post('/ratingsbytrip', getRatingsByTrip);

export default ratingsRouter;
