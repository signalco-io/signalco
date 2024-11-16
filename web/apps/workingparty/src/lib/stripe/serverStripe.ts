'use server';

import Stripe from 'stripe';
import { showNotification } from '@signalco/ui-notifications';
import { DbAccount, accountAssignStripeCustomer } from '../repository/accountsRepository';
import { domain } from '../../providers/env';
import { KnownPages } from '../../knownPages';
import { getStripe } from './config';

const returnUrl = `https://${domain}/${KnownPages.AppSettingsAccountBilling}`;

async function ensureStripeCustomer(account: DbAccount): Promise<string> {
    // Check if the user already has a Stripe customer ID
    // Ensure customer still exists in Stripe and is not deleted
    if (account.stripeCustomerId && account.stripeCustomerId.length > 0) {
        const existingCustomerId = await getStripe().customers.retrieve(account.stripeCustomerId);
        if (existingCustomerId && !existingCustomerId.deleted)
            return existingCustomerId.id;
    }

    // Try to find customer by email
    const customers = await stripeListAll<Stripe.Customer>(params => getStripe().customers.list({
        email: account.email,
        ...params
    }));

    if (customers.length > 0) {
        const customer = customers[0];
        if (customer && !customer.deleted) {
            await accountAssignStripeCustomer(account.id, customer.id)
            return customer.id;
        }
    }

    // Create a new customer in Stripe
    const newCustomer = await getStripe().customers.create({
        email: account.email,
        name: account.name
    });
    await accountAssignStripeCustomer(account.id, newCustomer.id);
    return newCustomer.id;
}

export async function stripeCheckout(
    account: DbAccount,
    stripePriceId: string
) {
    try {
        const customer = await ensureStripeCustomer(account);
        const params: Stripe.Checkout.SessionCreateParams = {
            billing_address_collection: 'required',
            customer,
            customer_update: {
                address: 'auto',
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
            session = await getStripe().checkout.sessions.create(params);
        } catch (err) {
            console.error(err);
            throw new Error('Unable to create checkout session.');
        }

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

export async function stripeCustomerBillingInfo(account: DbAccount) {
    try {
        const customerId = await ensureStripeCustomer(account);
        const stripeCustomer = await getStripe().customers.retrieve(customerId);
        if (stripeCustomer.deleted)
            throw new Error('Customer not found');

        return {
            country: stripeCustomer.address?.country,
            city: stripeCustomer.address?.city,
            postalCode: stripeCustomer.address?.postal_code,
            state: stripeCustomer.address?.state,
            line1: stripeCustomer.address?.line1,
            line2: stripeCustomer.address?.line2,
        };
    } catch (error) {
        if (error instanceof Error) {
            showNotification(error.message + ' Please try again later or contact a system administrator.', 'error');
        } else {
            showNotification('An unknown error occurred. Please try again later or contact a system administrator.', 'error');
        }
    }
}

async function stripeListAll<T extends { id: string }>(fetchMethod: (params: Stripe.PaginationParams) => Promise<Stripe.ApiList<T>>) {
    const data: T[] = [];
    let hasMore = true;
    while (hasMore) {
        const page = await fetchMethod({
            starting_after: data[data.length - 1]?.id
        });
        data.push(...page.data);
        hasMore = page.has_more;
    }
    return data;
}

export async function stripeCustomerPaymentMethods(account: DbAccount) {
    try {
        const customerId = await ensureStripeCustomer(account);
        const stripeCustomer = await getStripe().customers.retrieve(customerId);
        if (stripeCustomer.deleted)
            throw new Error('Customer not found');

        const paymentMethods = await stripeListAll<Stripe.PaymentMethod>(params => getStripe().paymentMethods.list({
            customer: customerId,
            ...params
        }));

        return paymentMethods.map((pm) => {
            return {
                id: pm.id,
                brand: pm.card?.brand,
                displayBrand: pm.card?.display_brand,
                last4: pm.card?.last4,
                expMonth: pm.card?.exp_month,
                expYear: pm.card?.exp_year,
                isDefault: pm.id === stripeCustomer.invoice_settings.default_payment_method
            };
        });
    } catch (error) {
        if (error instanceof Error) {
            showNotification(error.message + ' Please try again later or contact a system administrator.', 'error');
        } else {
            showNotification('An unknown error occurred. Please try again later or contact a system administrator.', 'error');
        }
    }
}

export async function stripeCreatePortal(account: DbAccount) {
    try {
        const customer = await ensureStripeCustomer(account);
        try {
            const { url } = await getStripe().billingPortal.sessions.create({
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