import { Router } from 'express';
import {
  getAllMileagePagination,
  getMileagesSelling,
  getMileagesByEmail,
  postMileages,
  deleteMileagesByID,
  updateMileages
} from '../controllers/mileagesController';
import { requireAuth, requireAdmin } from '../controllers/authController';
import {
  requireRowOwnerEmail,
  forceOwnerEmail,
  fromBodyData
} from '../../middlewares/authorizationMiddleware';

const mileagesRouter = Router();

mileagesRouter.get('/', requireAdmin, getAllMileagePagination);
mileagesRouter.get('/selling', requireAuth, getMileagesSelling);
mileagesRouter.post('/mileagesbyemail', requireAuth, getMileagesByEmail);
mileagesRouter.post('/upload', requireAuth, forceOwnerEmail, postMileages);
mileagesRouter.delete('/removebyid', requireAuth, requireRowOwnerEmail('mileages', fromBodyData), deleteMileagesByID);
mileagesRouter.patch('/update/:uuid', requireAdmin, updateMileages); // verification / listing is admin-only

export default mileagesRouter;
