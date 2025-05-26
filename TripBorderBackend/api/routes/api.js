import { Router } from 'express';
import usersRouter from './Routes/usersRoutes';
import mileagesRouter from './Routes/mileagesRoutes';

const apiRouter = Router();
apiRouter.use('/users', usersRouter);
apiRouter.use('/mileages', mileagesRouter);

export default apiRouter;
