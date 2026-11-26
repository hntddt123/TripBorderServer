import { Router } from 'express';
import {
  getAllTripTagsPagination,
  getAllPublicTripTagsInfiniteScroll,
  getTripTagsByTripID,
  createTripTagByTripIDAndTagID,
  deleteTripTagByID
} from '../controllers/triptagsController';
import { optionalAuth, requireAuth, requireAdmin } from '../controllers/authController';
import {
  requireTripReadAccess,
  requireTripOwner,
  requireRowTripOwner,
  fromBodyTripID,
  fromBodyData,
  fromBodyDataTripsUUID
} from '../../middlewares/authorizationMiddleware';

const tripTagsRouter = Router();

tripTagsRouter.get('/', requireAdmin, getAllTripTagsPagination);
tripTagsRouter.get('/publictriptagsinfinite', getAllPublicTripTagsInfiniteScroll); // public
tripTagsRouter.post('/triptagsbytripid', optionalAuth, requireTripReadAccess(fromBodyTripID), getTripTagsByTripID);
tripTagsRouter.post('/upload', requireAuth, requireTripOwner(fromBodyDataTripsUUID), createTripTagByTripIDAndTagID);
tripTagsRouter.delete('/removebyid', requireAuth, requireRowTripOwner('trip_tags', fromBodyData), deleteTripTagByID);

export default tripTagsRouter;
