import { Router } from 'express';
import { getAllTrips } from '../controllers/tripsController';

const tripsRouter = Router();

tripsRouter.get('/', getAllTrips);
// tripsRouter('/', getTripsByEmail);

export default tripsRouter;
