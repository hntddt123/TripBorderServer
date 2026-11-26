import { Router } from 'express';
import {
  getAllPOIsPagination,
  getPOIsByTrip,
  createPOIByTrip,
  updatePOIByID,
  deletePOIByID
} from '../controllers/poiController';
import { optionalAuth, requireAuth, requireAdmin } from '../controllers/authController';
import {
  requireTripReadAccess,
  requireTripOwner,
  requireRowTripOwner,
  fromBodyTripID,
  fromBodyData,
  fromBodyDataTripsUUID,
  fromParamsUUID
} from '../../middlewares/authorizationMiddleware';

const poisRouter = Router();

poisRouter.get('/', requireAdmin, getAllPOIsPagination);
poisRouter.post('/poisbytrip', optionalAuth, requireTripReadAccess(fromBodyTripID), getPOIsByTrip);
poisRouter.post('/upload', requireAuth, requireTripOwner(fromBodyDataTripsUUID), createPOIByTrip);
poisRouter.patch('/update/:uuid', requireAuth, requireRowTripOwner('points_of_interest', fromParamsUUID), updatePOIByID);
poisRouter.delete('/removebyid', requireAuth, requireRowTripOwner('points_of_interest', fromBodyData), deletePOIByID);

export default poisRouter;
