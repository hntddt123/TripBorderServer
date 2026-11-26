import { Router } from 'express';
import {
  getAllMealsPagination,
  getMealsByTrip,
  createMealsByTrip,
  updateMealsByID,
  deleteMealsByID
} from '../controllers/mealsController';
import { optionalAuth, requireAuth, requireAdmin } from '../controllers/authController';
import {
  requireTripReadAccess,
  requireTripOwner,
  requireRowTripOwner,
  fromBodyTripID,
  fromBodyData,
  fromBodyDataTripsUUID,
  fromParamsUUID
} from '../../middlewares/authorizationMiddleware';

const mealsRouter = Router();

mealsRouter.get('/', requireAdmin, getAllMealsPagination);
mealsRouter.post('/mealsbytrip', optionalAuth, requireTripReadAccess(fromBodyTripID), getMealsByTrip);
mealsRouter.post('/upload', requireAuth, requireTripOwner(fromBodyDataTripsUUID), createMealsByTrip);
mealsRouter.patch('/update/:uuid', requireAuth, requireRowTripOwner('meals', fromParamsUUID), updateMealsByID);
mealsRouter.delete('/removebyid', requireAuth, requireRowTripOwner('meals', fromBodyData), deleteMealsByID);

export default mealsRouter;
