import Stripe from 'stripe';
import { stripe } from '../../../../src/lib/stripe/config';
import { plansCreate, plansDelete, plansGetAll, plansUpdate } from '../../../../src/lib/repository/plansRepository';
import { accountGetByStripeCustomerId, accountSubscriptionCreate, accountSubscriptionSetStatus, accountSubscriptions } from '../../../../src/lib/repository/accountsRepository';

const relevantEvents = new Set([
    'product.created',
    'product.updated',
    'product.deleted',
    'price.created',
    'price.updated',
    'price.deleted',
    'checkout.session.completed',
    'customer.subscription.created',
    'customer.subscription.updated',
    'customer.subscription.deleted'
]);

async function deletePriceRecord(price: Stripe.Price) {
    // Find plan by stripePriceId and deactivate it
    const plans = await plansGetAll();
    const editedPlan = plans.find(p => p.stripePriceId === price.id);
    if (!editedPlan) {
        throw new Error('Plan not found');
    }
    await plansDelete(editedPlan.id);
}

async function upsertPriceRecord(price: Stripe.Price) {
    const product = typeof price.product === 'string'
        ? await stripe.products.retrieve(price.product)
        : price.product;
    if (!product || product.deleted) {
        throw new Error('Product not found');
    }

    const period = price.type === 'one_time'
        ? 'one-time'
        : (price.recurring?.interval === 'month'
            ? 'monthly'
            : (price.recurring?.interval === 'year'
                ? 'yearly'
                : undefined));
    if (!period) {
        throw new Error('Invalid price period');
    }

    if (typeof price.unit_amount !== 'number' || price.unit_amount < 0) {
        throw new Error('Invalid price unit amount');
    }

    const priceValue = price.unit_amount / 100;
    const limits = {
        messages: {
            total: parseInt(price.metadata['limits_messages_total'] || '0', 10) || 0,
            unlimited: price.metadata['limits_messages_unlimited'] === 'true'
        },
        workers: {
            total: parseInt(price.metadata['limits_workers_total'] || '0', 10) || 0,
            unlimited: price.metadata['limits_workers_unlimited'] === 'true'
        }
    };

    // Find plan by stripePriceId and update it, create new plan if not found
    const plans = await plansGetAll();
    const editedPlan = plans.find(p => p.stripePriceId === price.id);
    if (editedPlan) {
        await plansUpdate({
            ...editedPlan,
            name: product.name,
            currency: price.currency,
            price: priceValue,
            period,
            limits,
            active: true
        });
    } else {
        await plansCreate({
            name: product.name,
            stripePriceId: price.id,
            currency: price.currency,
            price: priceValue,
            period,
            limits,
            active: true
        })
    }
}

async function manageSubscriptionStatusChange(stripeSubscriptionId: string, stripeCustomerId: string, isSubscriptionActive: boolean) {
    const account = await accountGetByStripeCustomerId(stripeCustomerId);
    if (!account) {
        throw new Error('Account not found');
    }

    // TODO: Find account subscription by stripeSubscriptionId
    const subscriptions = await accountSubscriptions(account.id);
    const editedSubscription = subscriptions.find(s => s.stripeSubscriptionId === stripeSubscriptionId);
    if (!editedSubscription) {
        // TODO: Create subscription
        throw new Error('Subscription not found');
    }

    // TODO: Update account subscription status
    await accountSubscriptionSetStatus(account.id, editedSubscription.id, isSubscriptionActive);
}

export async function POST(req: Request) {
    const body = await req.text();
    const sig = req.headers.get('stripe-signature') as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let event: Stripe.Event;

    // Validate signature and parse event
    try {
        if (!sig || !webhookSecret)
            return new Response('Webhook secret not found.', { status: 400 });
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
        console.info(`🔔  Webhook received: ${event.type}`);
    } catch (err: unknown) {
        if (err instanceof Error) {
            console.error(`❌ Error message: ${err.message}`);
            return new Response(`Webhook Error: ${err.message}`, { status: 400 });
        } else {
            console.error('Stripe webhook event - unknown error', err);
            return new Response('Stripe webhook event - unknown error', { status: 400 });
        }
    }

    // Ignore not supported event (check Stripe webhook config)
    if (!relevantEvents.has(event.type)) {
        return new Response(`Unsupported event type: ${event.type}`, {
            status: 400
        });
    }

    try {
        switch (event.type) {
            case 'product.created':
            case 'product.updated':
                // TODO: Check if we needs to store products
                // await upsertProductRecord(event.data.object as Stripe.Product);
                break;
            case 'product.deleted':
                // await deleteProductRecord(event.data.object as Stripe.Product);
                break;
            case 'price.created':
            case 'price.updated':
                await upsertPriceRecord(event.data.object as Stripe.Price);
                break;
            case 'price.deleted':
                await deletePriceRecord(event.data.object as Stripe.Price);
                break;
            case 'customer.subscription.created':
            case 'customer.subscription.updated':
            case 'customer.subscription.deleted':
                const subscription = event.data.object as Stripe.Subscription;
                await manageSubscriptionStatusChange(
                    subscription.id,
                    subscription.customer as string,
                    event.type === 'customer.subscription.created'
                );
                break;
            case 'checkout.session.completed':
                const checkoutSession = event.data.object as Stripe.Checkout.Session;
                if (checkoutSession.mode === 'subscription') {
                    const subscriptionId = checkoutSession.subscription;
                    await manageSubscriptionStatusChange(
                        subscriptionId as string,
                        checkoutSession.customer as string,
                        true
                    );
                }
                break;
            default:
                throw new Error('Unhandled relevant event!');
        }
    } catch (error) {
        console.error('Stripe webhook error', error);
        return new Response(
            'Stripe webhook handler failed',
            {
                status: 400
            }
        );
    }

    return new Response(JSON.stringify({ received: true }));
}