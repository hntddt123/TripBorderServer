import { Router } from 'express';
import {
  getAllUsersPagination,
  getUserByEmail,
  updateUser
} from '../controllers/usersController';

const usersRouter = Router();

usersRouter.get('/', getAllUsersPagination);
usersRouter.post('/userbyemail', getUserByEmail);
usersRouter.patch('/update/:uuid', updateUser);

export default usersRouter;
