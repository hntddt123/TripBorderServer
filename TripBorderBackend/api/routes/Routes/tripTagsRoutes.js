import { Router } from 'express';
import {
  getAllTripTagsPagination,
  getAllPublicTripTagsInfiniteScroll,
  getTripTagsByTripID,
  createTripTagByTripIDAndTagID,
  deleteTripTagByID
} from '../controllers/triptagsController';

const tripTagsRouter = Router();

tripTagsRouter.get('/', getAllTripTagsPagination);
tripTagsRouter.get('/publictriptagsinfinite', getAllPublicTripTagsInfiniteScroll);
tripTagsRouter.post('/triptagsbytripid', getTripTagsByTripID);
tripTagsRouter.post('/upload', createTripTagByTripIDAndTagID);
tripTagsRouter.delete('/removebyid', deleteTripTagByID);

export default tripTagsRouter;
