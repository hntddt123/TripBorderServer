import { Router } from 'express';
import {
  getAllHotelsPagination,
  getHotelsByTrip,
  createHotelByTrip,
  updateHotelByID,
  deleteHotelByID
} from '../controllers/hotelsController';

const hotelsRouter = Router();

hotelsRouter.get('/', getAllHotelsPagination);
hotelsRouter.post('/hotelsbytrip', getHotelsByTrip);
hotelsRouter.post('/upload', createHotelByTrip);
hotelsRouter.patch('/update/:uuid', updateHotelByID);
hotelsRouter.delete('/removebyid', deleteHotelByID);

export default hotelsRouter;
