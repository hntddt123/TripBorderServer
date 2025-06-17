import { Router } from 'express';
import { getAllHotelsPagination, getHotelsByTrip } from '../controllers/hotelsController';

const hotelsRouter = Router();

hotelsRouter.get('/', getAllHotelsPagination);
hotelsRouter.post('/hotelsbytrip', getHotelsByTrip);

export default hotelsRouter;
