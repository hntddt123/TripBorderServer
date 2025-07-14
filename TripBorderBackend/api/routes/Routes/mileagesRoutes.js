import { Router } from 'express';
import {
  getAllMileagePagination,
  getMileagesSelling,
  getMileagesByEmail,
  postMileages,
  deleteMileagesByID,
  updateMileages
} from '../controllers/mileagesController';

const mileagesRouter = Router();

mileagesRouter.get('/', getAllMileagePagination);
mileagesRouter.get('/selling', getMileagesSelling);
mileagesRouter.post('/mileagesbyemail', getMileagesByEmail);
mileagesRouter.post('/upload', postMileages);
mileagesRouter.delete('/removebyid', deleteMileagesByID);
mileagesRouter.patch('/update/:uuid', updateMileages);

export default mileagesRouter;
