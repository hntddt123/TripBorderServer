import { Router } from 'express';
import {
  getAllMealsPagination,
  getMealsByTrip,
  createMealsByTrip,
  updateMealsByID,
  deleteMealsByID
} from '../controllers/mealsController';

const mealsRouter = Router();

mealsRouter.get('/', getAllMealsPagination);
mealsRouter.post('/mealsbytrip', getMealsByTrip);
mealsRouter.post('/upload', createMealsByTrip);
mealsRouter.patch('/update/:uuid', updateMealsByID);
mealsRouter.delete('/removebyid', deleteMealsByID);

export default mealsRouter;
