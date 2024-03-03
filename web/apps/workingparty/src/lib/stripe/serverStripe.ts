'use server';

import Stripe from 'stripe';
import { showNotification } from '@signalco/ui-notifications';
import { DbUser, usersAssignStripeCustomer } from '../repository/usersRepository';
import { domain } from '../../providers/env';
import { KnownPages } from '../../knownPages';
import { stripe } from './config';

const returnUrl = `https://${domain}/${KnownPages.AppSettingsAccountBilling}`;

async function ensureStripeCustomer(user: DbUser): Promise<string> {
    // Check if the user already has a Stripe customer ID
    // Ensure customer still exists in Stripe and is not deleted
    if (user.stripeCustomerId && user.stripeCustomerId.length > 0) {
        const existingCustomerId = await stripe.customers.retrieve(user.stripeCustomerId);
        if (existingCustomerId && !existingCustomerId.deleted) return existingCustomerId.id;
    }

    // Try to find customer by email
    const customers = await stripe.customers.list({ email: user.email });
    if (customers.data.length > 0) {
        const customer = customers.data[0];
        if (customer && !customer.deleted) {
            await usersAssignStripeCustomer(user.id, customer.id)
            return customer.id;
        }
    }

    // Create a new customer in Stripe
    const newCustomer = await stripe.customers.create({
        email: user.email,
        name: user.displayName,
    });
    await usersAssignStripeCustomer(user.id, newCustomer.id);
    return newCustomer.id;
}

export async function checkoutWithStripe(
    user: DbUser,
    stripePriceId: string
) {
    try {
        const customer = await ensureStripeCustomer(user);
        const params: Stripe.Checkout.SessionCreateParams = {
            billing_address_collection: 'required',
            customer,
            customer_update: {
                address: 'auto'
            },
            line_items: [
                {
                    price: stripePriceId,
                    quantity: 1
                }
            ],
            mode: 'subscription',
            cancel_url: returnUrl,
            success_url: returnUrl
        };

        // Create a checkout session in Stripe
        let session;
        try {
            session = await stripe.checkout.sessions.create(params);
        } catch (err) {
            console.error(err);
            throw new Error('Unable to create checkout session.');
        }

        // Instead of returning a Response, just return the data or error.
        if (session) {
            return { sessionId: session.id };
        }

        throw new Error('Unable to create checkout session.');
    } catch (error) {
        if (error instanceof Error) {
            showNotification(error.message + ' Please try again later or contact a system administrator.', 'error');
        } else {
            showNotification('An unknown error occurred. Please try again later or contact a system administrator.', 'error');
        }
        throw error;
    }
}

export async function createStripePortal(user: DbUser) {
    try {
        const customer = await ensureStripeCustomer(user);
        try {
            const { url } = await stripe.billingPortal.sessions.create({
                customer,
                return_url: returnUrl
            });
            if (!url) {
                throw new Error('Could not create billing portal');
            }
            return url;
        } catch (err) {
            console.error(err);
            throw new Error('Could not create billing portal');
        }
    } catch (error) {
        if (error instanceof Error) {
            console.error(error);
            showNotification(error.message + ' Please try again later or contact a system administrator.', 'error');
        } else {
            showNotification('An unknown error occurred. Please try again later or contact a system administrator.', 'error');
        }
    }
}