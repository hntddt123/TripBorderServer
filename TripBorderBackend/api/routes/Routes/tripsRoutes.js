import { Router } from 'express';
import {
  getAllTripsPagination,
  getTripsByEmailPagination,
  getTripByUUID,
  postTrips
} from '../controllers/tripsController';

const tripsRouter = Router();

tripsRouter.get('/', getAllTripsPagination);
tripsRouter.post('/tripsbyemail', getTripsByEmailPagination);
tripsRouter.post('/tripsbyuuid', getTripByUUID);
tripsRouter.post('/upload', postTrips);

export default tripsRouter;
