import { Router } from 'express';
import {
  getAllTripsPagination,
  getTripsByEmailPagination,
  getTripByUUID,
  initTrips,
  deleteTripsByID,
  updateTrips
} from '../controllers/tripsController';

const tripsRouter = Router();

tripsRouter.get('/', getAllTripsPagination);
tripsRouter.post('/tripsbyemail', getTripsByEmailPagination);
tripsRouter.post('/tripsbyuuid', getTripByUUID);
tripsRouter.post('/init', initTrips);
tripsRouter.delete('/removebyid', deleteTripsByID);
tripsRouter.patch('/update/:uuid', updateTrips);

export default tripsRouter;
