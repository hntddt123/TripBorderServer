import { Router } from 'express';
import { getAllMealsPagination } from '../controllers/mealsController';

const mealsRouter = Router();

mealsRouter.get('/', getAllMealsPagination);

export default mealsRouter;
