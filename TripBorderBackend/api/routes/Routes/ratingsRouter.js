import { Router } from 'express';
import { getAllRatingsPagination } from '../controllers/ratingsController';

const ratingsRouter = Router();

ratingsRouter.get('/', getAllRatingsPagination);

export default ratingsRouter;
