import { Router } from 'express';
import {
  getAllHotelsPagination,
  getHotelsByTrip,
  createHotelsByTrip,
  deleteHotelsByID
} from '../controllers/hotelsController';

const hotelsRouter = Router();

hotelsRouter.get('/', getAllHotelsPagination);
hotelsRouter.post('/hotelsbytrip', getHotelsByTrip);
hotelsRouter.post('/upload', createHotelsByTrip);
hotelsRouter.delete('/removebyid', deleteHotelsByID);

export default hotelsRouter;
