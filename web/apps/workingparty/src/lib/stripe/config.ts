import Stripe from 'stripe';

let stripe: Stripe | null = null;

export function getStripe() {
    if (!stripe) {
        stripe = new Stripe(
            process.env.STRIPE_SECRETKEY ?? '',
            {
            }
        );
    }
    return stripe;
}
