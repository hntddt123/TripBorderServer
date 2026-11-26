import { Router } from 'express';
import {
  getAllHotelsPagination,
  getHotelsByTrip,
  createHotelByTrip,
  updateHotelByID,
  deleteHotelByID
} from '../controllers/hotelsController';
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

const hotelsRouter = Router();

hotelsRouter.get('/', requireAdmin, getAllHotelsPagination);
hotelsRouter.post('/hotelsbytrip', optionalAuth, requireTripReadAccess(fromBodyTripID), getHotelsByTrip);
hotelsRouter.post('/upload', requireAuth, requireTripOwner(fromBodyDataTripsUUID), createHotelByTrip);
hotelsRouter.patch('/update/:uuid', requireAuth, requireRowTripOwner('hotels', fromParamsUUID), updateHotelByID);
hotelsRouter.delete('/removebyid', requireAuth, requireRowTripOwner('hotels', fromBodyData), deleteHotelByID);

export default hotelsRouter;
