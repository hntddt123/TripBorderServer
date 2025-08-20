import { Router } from 'express';
import {
  getAllUsersPagination,
  getUserByUUID,
  updateUser
} from '../controllers/usersController';

const usersRouter = Router();

usersRouter.get('/', getAllUsersPagination);
usersRouter.post('/userbyuuid', getUserByUUID);
usersRouter.patch('/update/:uuid', updateUser);

export default usersRouter;
