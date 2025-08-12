import { Router } from 'express';
import authRouter from './Routes/authRoutes';
import usersRouter from './Routes/usersRoutes';
import mileagesRouter from './Routes/mileagesRoutes';
import tripsRouter from './Routes/tripsRoutes';
import mealsRouter from './Routes/mealsRoutes';
import poisRouter from './Routes/poiRoutes';
import hotelsRouter from './Routes/hotelsRoutes';
import transportsRouter from './Routes/transportsRoutes';
import tagsRouter from './Routes/tagsRoutes';
import tripTagsRouter from './Routes/tripTagsRouter';
import ratingsRouter from './Routes/ratingsRouter';

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/mileages', mileagesRouter);
apiRouter.use('/trips', tripsRouter);
apiRouter.use('/meals', mealsRouter);
apiRouter.use('/pois', poisRouter);
apiRouter.use('/hotels', hotelsRouter);
apiRouter.use('/transports', transportsRouter);
apiRouter.use('/tags', tagsRouter);
apiRouter.use('/trip_tags', tripTagsRouter);
apiRouter.use('/ratings', ratingsRouter);

export default apiRouter;
