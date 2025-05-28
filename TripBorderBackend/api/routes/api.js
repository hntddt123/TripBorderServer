import { Router } from 'express';
import authRouter from './Routes/authRoutes';
import usersRouter from './Routes/usersRoutes';
import mileagesRouter from './Routes/mileagesRoutes';
import tripsRouter from './Routes/tripsRoutes';

const apiRouter = Router();
apiRouter.use('/auth', authRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/mileages', mileagesRouter);
apiRouter.use('/trips', tripsRouter);

export default apiRouter;
