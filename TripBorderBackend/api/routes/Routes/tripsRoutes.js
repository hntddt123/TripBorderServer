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

const tripsRouter = Router();

tripsRouter.get('/', getAllTripsPagination);
tripsRouter.get('/tripspublicpagination', getTripsPublicPagination);
tripsRouter.post('/tripsmysharedpagination', getMySharedTripsPagination);
tripsRouter.post('/tripsotherssharedpagination', getOthersSharedTripsPagination);
tripsRouter.post('/tripsbyemailpagination', getTripsByEmailPagination);
tripsRouter.post('/tripsbyuuid', getTripByUUID);
tripsRouter.post('/init', initTrips);
tripsRouter.delete('/removebyid', deleteTripsByID);
tripsRouter.patch('/update/:uuid', updateTrips);

export default tripsRouter;
