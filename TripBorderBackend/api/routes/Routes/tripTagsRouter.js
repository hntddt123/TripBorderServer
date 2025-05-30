import { Router } from 'express';
import { getAllTripTagsPagination } from '../controllers/trip_tagsController';

const tripTagsRouter = Router();

tripTagsRouter.get('/', getAllTripTagsPagination);

export default tripTagsRouter;
