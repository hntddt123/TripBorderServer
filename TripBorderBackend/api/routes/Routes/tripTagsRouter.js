import { Router } from 'express';
import {
  getAllTripTagsPagination,
  getTripTagsByTrip,
  createTripTagByTrip,
  deleteTripTagByID
} from '../controllers/triptagsController';

const tripTagsRouter = Router();

tripTagsRouter.get('/', getAllTripTagsPagination);
tripTagsRouter.post('/triptagsbytrip', getTripTagsByTrip);
tripTagsRouter.post('/upload', createTripTagByTrip);
tripTagsRouter.delete('/removebyid', deleteTripTagByID);

export default tripTagsRouter;
