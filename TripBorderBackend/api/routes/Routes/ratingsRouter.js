import { Router } from 'express';
import {
  getAllRatingsPagination,
  getRatingsByTrip,
  createRatingByTrip,
  deleteRatingByID
} from '../controllers/ratingsController';

const ratingsRouter = Router();

ratingsRouter.get('/', getAllRatingsPagination);
ratingsRouter.post('/ratingsbytrip', getRatingsByTrip);
ratingsRouter.post('/upload', createRatingByTrip);
ratingsRouter.delete('/removebyid', deleteRatingByID);

export default ratingsRouter;
