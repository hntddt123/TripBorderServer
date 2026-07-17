import { Router } from 'express';
import {
  createPremiumSubscription
} from '../controllers/stripeController';

const stripeRouter = Router();

stripeRouter.post('/create-checkout-session', createPremiumSubscription);

export default stripeRouter;
