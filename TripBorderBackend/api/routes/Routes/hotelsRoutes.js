import { Router } from 'express';
import { getAllHotelsPagination } from '../controllers/hotelsController';

const hotelsRouter = Router();

hotelsRouter.get('/', getAllHotelsPagination);

export default hotelsRouter;
