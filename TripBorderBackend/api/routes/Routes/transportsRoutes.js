import { Router } from 'express';
import {
  getAllTransportsPagination,
  getTransportsByTrip,
  createTransportByTrip,
  updateTransportByID,
  deleteTransportByID
} from '../controllers/transportsController';
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

const transportsRouter = Router();

transportsRouter.get('/', requireAdmin, getAllTransportsPagination);
transportsRouter.post('/transportsbytrip', optionalAuth, requireTripReadAccess(fromBodyTripID), getTransportsByTrip);
transportsRouter.post('/upload', requireAuth, requireTripOwner(fromBodyDataTripsUUID), createTransportByTrip);
transportsRouter.patch('/update/:uuid', requireAuth, requireRowTripOwner('transports', fromParamsUUID), updateTransportByID);
transportsRouter.delete('/removebyid', requireAuth, requireRowTripOwner('transports', fromBodyData), deleteTransportByID);

export default transportsRouter;
