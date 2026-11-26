import { Router } from 'express';
import {
  getAllTripSharesPagination,
  getTripSharesByTrip,
  createTripSharesByTrip,
  updateTripSharesByID,
  deleteTripSharesByID
} from '../controllers/tripSharesController';
import { requireAuth, requireAdmin } from '../controllers/authController';
import {
  requireTripOwner,
  requireRowTripOwner,
  fromBodyTripID,
  fromBodyData,
  fromBodyDataTripsUUID,
  fromParamsUUID
} from '../../middlewares/authorizationMiddleware';

const tripSharesRouter = Router();

tripSharesRouter.get('/', requireAdmin, getAllTripSharesPagination);
tripSharesRouter.post('/tripsharesbytrip', requireAuth, requireTripOwner(fromBodyTripID), getTripSharesByTrip);
tripSharesRouter.post('/upload', requireAuth, requireTripOwner(fromBodyDataTripsUUID), createTripSharesByTrip);
tripSharesRouter.patch('/update/:uuid', requireAuth, requireRowTripOwner('trip_shares', fromParamsUUID), updateTripSharesByID);
tripSharesRouter.delete('/removebyid', requireAuth, requireRowTripOwner('trip_shares', fromBodyData), deleteTripSharesByID);

export default tripSharesRouter;
