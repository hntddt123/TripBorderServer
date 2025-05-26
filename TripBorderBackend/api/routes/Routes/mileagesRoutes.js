import { Router } from 'express';
import {
  getAllMileagePagination,
  getMileagesSelling,
  getMileagesByEmail,
  postMileagesByEmail,
  deleteMileagesByID,
  updateMileages
} from '../controllers/mileagesController';

const mileagesRouter = Router();

mileagesRouter.get('/', getAllMileagePagination);
mileagesRouter.get('/selling', getMileagesSelling);
mileagesRouter.post('/mileagesbyemail', getMileagesByEmail);
mileagesRouter.post('/upload', postMileagesByEmail);
mileagesRouter.delete('/removebyid', deleteMileagesByID);
mileagesRouter.patch('/update/:uuid', updateMileages);

export default mileagesRouter;
