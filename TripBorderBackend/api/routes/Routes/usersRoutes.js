import { Router } from 'express';
import { getAllUsersPagination, updateUser } from '../controllers/usersController';

const usersRouter = Router();

usersRouter.get('/', getAllUsersPagination);
usersRouter.patch('/update/:uuid', updateUser);

export default usersRouter;
