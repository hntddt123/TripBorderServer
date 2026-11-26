import { Router } from 'express';
import {
  getAllUsersPagination,
  getUserByEmail,
  updateUser
} from '../controllers/usersController';
import { requireAdmin } from '../controllers/authController';

const usersRouter = Router();

usersRouter.get('/', requireAdmin, getAllUsersPagination);
usersRouter.post('/userbyemail', requireAdmin, getUserByEmail);
usersRouter.patch('/update/:uuid', requireAdmin, updateUser);

export default usersRouter;
