import Stripe from 'stripe';
import { cleanEnv, str, url } from 'envalid';
import logger from '../../../setupPino';
import { getUserByEmailDB, updateUserDB } from '../../knex/userknex';
import { knexDBInstance } from '../../knex/knexDBInstance';

const env = cleanEnv(process.env, {
  STRIPE_SECRET_KEY: str(),
  STRIPE_PRICE_ID: str(),
  STRIPE_WEBHOOK_SECRET: str(),
  FRONTEND_ORIGIN: url(),
});

const {
  STRIPE_SECRET_KEY,
  STRIPE_PRICE_ID,
  STRIPE_WEBHOOK_SECRET,
  FRONTEND_ORIGIN
} = env;

const stripe = new Stripe(STRIPE_SECRET_KEY);

export const createPremiumSubscription = async (req, res) => {
  const { ownerEmail } = req.body.data;
  const { uuid } = await getUserByEmailDB(ownerEmail);

  try {
    if (!uuid) res.status(401).json({ error: 'Unauthorized' });

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: `${STRIPE_PRICE_ID}`,
          quantity: 1,
        },
      ],
      success_url: `${FRONTEND_ORIGIN.split(',')[0]}?payment=success`,
      automatic_tax: { enabled: true },
      metadata: { useruuid: uuid },
    });
    res.json({ url: session.url });
  } catch (error) {
    logger.error(`Error in creating Premium Subscription Session: ${error}`);
    res.status(500).send({ error: 'Failed to create Premium Subscription Session' });
  }
};

export const upgradePremiumSubscription = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = await stripe.webhooks.constructEvent(req.body, sig, STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    logger.error(`Webhook signature verification failed: ${err.message}`);
    res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    logger.info(`Stripe event received: ${event.type}`);
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const subscription = await stripe.subscriptions.retrieve(session.subscription);
        const data = subscription.items.data[0];
        const userUUID = session.metadata?.useruuid;
        if (userUUID) {
          const updates = {
            role: 'premium_user',
            premium_started_at: data.current_period_start
              ? new Date(data.current_period_start * 1000)
              : null,
            stripe_customer_id: session.customer,
            stripe_subscription_id: subscription.id,
            subscription_end_at: data.current_period_end
              ? new Date(data.current_period_end * 1000)
              : null,
          };
          const updatedRows = await updateUserDB(userUUID, updates);
          if (updatedRows === 0) {
            res.status(404).json({ error: 'User not found' });
          } else {
            logger.info('User upgraded to premium');
          }
        }
        break;
      }
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const { status } = subscription;
        const data = subscription.items.data[0];

        const newRole = (status === 'active')
          ? 'premium_user'
          : 'user';

        await knexDBInstance('user_accounts')
          .where('stripe_subscription_id', subscription.id)
          .update({
            role: newRole,
            subscription_end_at: data.current_period_end
              ? new Date(data.current_period_end * 1000)
              : null,
          });
        break;
      }

      default:
        break;
    }
    res.status(200).json({ received: true });
  } catch (error) {
    logger.error(`Error in Upgrading User: ${error}`);
    res.status(500).send({ error: 'Failed to Upgrade User' });
  }
};
