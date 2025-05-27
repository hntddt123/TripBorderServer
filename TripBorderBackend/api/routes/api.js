import { Router } from 'express';
import usersRouter from './Routes/usersRoutes';
import mileagesRouter from './Routes/mileagesRoutes';
import authRouter from './Routes/authRoutes';

const apiRouter = Router();
apiRouter.use('/users', usersRouter);
apiRouter.use('/mileages', mileagesRouter);
apiRouter.use('/auth', authRouter);

export default apiRouter;
