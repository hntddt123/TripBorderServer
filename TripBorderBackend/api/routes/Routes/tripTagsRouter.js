import { Router } from 'express';
import { getAllTripTagsPagination, getTripTagsByTrip } from '../controllers/trip_tagsController';

const tripTagsRouter = Router();

tripTagsRouter.get('/', getAllTripTagsPagination);
tripTagsRouter.post('/triptagsbytrip', getTripTagsByTrip);

export default tripTagsRouter;
