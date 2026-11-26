import { Router } from 'express';
import {
  getAllTripsPagination,
  getTripsByEmailPagination,
  getMySharedTripsPagination,
  getOthersSharedTripsPagination,
  getTripsPublicPagination,
  getTripByUUID,
  initTrips,
  deleteTripsByID,
  updateTrips
} from '../controllers/tripsController';
import { optionalAuth, requireAuth, requireAdmin } from '../controllers/authController';
import {
  requireTripReadAccess,
  requireTripOwner,
  fromBodyData,
  fromParamsUUID
} from '../../middlewares/authorizationMiddleware';

const tripsRouter = Router();

tripsRouter.get('/', requireAdmin, getAllTripsPagination);
tripsRouter.get('/tripspublicpagination', getTripsPublicPagination); // public
tripsRouter.post('/tripsmysharedpagination', requireAuth, getMySharedTripsPagination);
tripsRouter.post('/tripsotherssharedpagination', requireAuth, getOthersSharedTripsPagination);
tripsRouter.post('/tripsbyemailpagination', requireAuth, getTripsByEmailPagination);
tripsRouter.post('/tripsbyuuid', optionalAuth, requireTripReadAccess(fromBodyData), getTripByUUID);
tripsRouter.post('/init', requireAuth, initTrips);
tripsRouter.delete('/removebyid', requireAuth, requireTripOwner(fromBodyData), deleteTripsByID);
tripsRouter.patch('/update/:uuid', requireAuth, requireTripOwner(fromParamsUUID), updateTrips);

export default tripsRouter;
