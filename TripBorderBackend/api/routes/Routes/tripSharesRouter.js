import { Router } from 'express';
import {
  getAllTripSharesPagination,
  getTripSharesByTrip,
  createTripSharesByTrip,
  updateTripSharesByID,
  deleteTripSharesByID
} from '../controllers/tripSharesController';

const tripSharesRouter = Router();

tripSharesRouter.get('/', getAllTripSharesPagination);
tripSharesRouter.post('/tripSharesbytrip', getTripSharesByTrip);
tripSharesRouter.post('/upload', createTripSharesByTrip);
tripSharesRouter.patch('/update/:uuid', updateTripSharesByID);
tripSharesRouter.delete('/removebyid', deleteTripSharesByID);

export default tripSharesRouter;
