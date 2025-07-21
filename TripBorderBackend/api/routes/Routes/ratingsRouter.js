import { Router } from 'express';
import {
  getAllRatingsPagination,
  getRatingsByTrip,
  createRatingByTrip,
  deleteRatingByID,
  updateRating
} from '../controllers/ratingsController';

const ratingsRouter = Router();

ratingsRouter.get('/', getAllRatingsPagination);
ratingsRouter.post('/ratingsbytrip', getRatingsByTrip);
ratingsRouter.post('/upload', createRatingByTrip);
ratingsRouter.delete('/removebyid', deleteRatingByID);
ratingsRouter.patch('/update/:uuid', updateRating);

export default ratingsRouter;
