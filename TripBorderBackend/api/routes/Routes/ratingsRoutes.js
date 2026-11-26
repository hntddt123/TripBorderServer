import { Router } from 'express';
import {
  getAllRatingsPagination,
  getRatingsByTrip,
  createRatingByTrip,
  deleteRatingByID,
  updateRating
} from '../controllers/ratingsController';
import { optionalAuth, requireAuth, requireAdmin } from '../controllers/authController';
import {
  requireTripReadAccess,
  requireTripOwner,
  requireRowTripOwner,
  forceOwnerEmail,
  fromBodyTripID,
  fromBodyData,
  fromBodyDataTripsUUID,
  fromParamsUUID
} from '../../middlewares/authorizationMiddleware';

const ratingsRouter = Router();

ratingsRouter.get('/', requireAdmin, getAllRatingsPagination);
ratingsRouter.post('/ratingsbytrip', optionalAuth, requireTripReadAccess(fromBodyTripID), getRatingsByTrip);
ratingsRouter.post('/upload', requireAuth, requireTripOwner(fromBodyDataTripsUUID), forceOwnerEmail, createRatingByTrip);
ratingsRouter.delete('/removebyid', requireAuth, requireRowTripOwner('ratings', fromBodyData), deleteRatingByID);
ratingsRouter.patch('/update/:uuid', requireAuth, requireRowTripOwner('ratings', fromParamsUUID), updateRating);

export default ratingsRouter;
