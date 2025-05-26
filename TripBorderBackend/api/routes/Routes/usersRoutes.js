import { Router } from 'express';
import { getAllUsers, updateUser } from '../controllers/usersController';

const usersRouter = Router();

usersRouter.get('/', getAllUsers);
usersRouter.patch('/update/:uuid', updateUser);

export default usersRouter;
