import { Router } from 'express';
import { getAllMealsPagination, getMealsByTrip } from '../controllers/mealsController';

const mealsRouter = Router();

mealsRouter.get('/', getAllMealsPagination);
mealsRouter.post('/mealsbytrip', getMealsByTrip);

export default mealsRouter;
