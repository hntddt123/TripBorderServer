import { Router } from 'express';
import {
  createPremiumSubscription
} from '../controllers/stripeController';
import { requireAuth } from '../controllers/authController';

const stripeRouter = Router();

stripeRouter.post('/create-checkout-session', requireAuth, createPremiumSubscription);

export default stripeRouter;
