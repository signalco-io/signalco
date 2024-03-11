import { nanoid } from 'nanoid';
import { PatchOperation } from '@azure/cosmos';
import { stripe } from '../stripe/config';
import { cosmosDataContainerAccounts, cosmosDataContainerSubscriptions, cosmosDataContainerUsage } from '../cosmosClient';
import { workersGetAll } from './workersRepository';
import { DbPlan, plansGet } from './plansRepository';

export type DbAccount = {
    id: string;
    name: string;
    email: string;
    createdAt: number;
    stripeCustomerId?: string;
};

export type AccountCreate = {
    name: string;
    email: string;
};

export type AccountPatch = {
    name?: string;
    email?: string;
};

export type DbSubscription = {
    id: string;
    accountId: string;
    planId: string;

    createdAt: number,
    deactivatedAt?: number

    stripeSubscriptionId: string;
};

export type SubscriptionCreate = {
    planId: string;
    stripeSubscriptionId: string;
};

export type DbUsage = {
    id: string;
    accountId: string;
    subscriptionId: string;
    periodStart: number;
    periodEnd: number;
    value: number;
};

export async function accountGet(id: string): Promise<DbAccount | undefined> {
    const dbAccounts = cosmosDataContainerAccounts();
    const { resource: accountDbItem } = await dbAccounts.item(id, id).read<DbAccount>();
    if (!accountDbItem?.id)
        return undefined;

    return {
        id: accountDbItem.id,
        name: accountDbItem.name,
        email: accountDbItem.email,
        createdAt: accountDbItem.createdAt,
        stripeCustomerId: accountDbItem.stripeCustomerId,
    };
}

export async function accountGetByStripeCustomerId(stripeCustomerId: string): Promise<DbAccount | undefined> {
    const dbAccounts = cosmosDataContainerAccounts();
    const { resources: accounts } = await dbAccounts.items.query<DbAccount>({
        query: 'SELECT * FROM c WHERE c.stripeCustomerId = @stripeCustomerId',
        parameters: [{ name: '@stripeCustomerId', value: stripeCustomerId }]
    }).fetchAll();

    return accounts[0];
}

export async function accountCreate({
    name,
    email
}: AccountCreate) {
    const accountId = nanoid(8);
    const account = {
        id: accountId,
        name,
        createdAt: Date.now() / 1000, // UNIX seconds timestamp
        email
    };

    const dbAccounts = cosmosDataContainerAccounts();
    await dbAccounts.items.create<DbAccount>(account);

    return accountId;
}

export async function accountUpdate(id: string, {
    name,
    email
}: AccountPatch) {
    const operations: PatchOperation[] = [];
    if (name) {
        operations.push({
            op: 'replace',
            path: '/name',
            value: name
        });
    }
    if (email) {
        // TODO: Allow email change (requires email verification)
        // operations.push({
        //     op: 'replace',
        //     path: '/email',
        //     value: email
        // });
        throw new Error('Email change is not supported.');
    }

    await cosmosDataContainerAccounts().item(id, id).patch(operations);

    // TODO: Update email in Stripe customer
}

export async function accountAssignStripeCustomer(accountId: string, stripeCustomerId: string) {
    const dbUsers = cosmosDataContainerAccounts();
    await dbUsers.item(accountId, accountId).patch({
        operations: [
            { op: 'add', path: '/stripeCustomerId', value: stripeCustomerId }
        ]
    });
}

export async function accountSubscriptions(id: string): Promise<Array<DbSubscription & { plan?: DbPlan }>> {
    const dbSubscriptions = cosmosDataContainerSubscriptions();
    const allSubscriptions = await dbSubscriptions.items.readAll<DbSubscription>({ partitionKey: id }).fetchAll();

    const distinctPlanIds = [...new Set(allSubscriptions.resources.map(subscriptionDbItem => subscriptionDbItem.planId))];
    const plans = await Promise.all(distinctPlanIds.map(planId => plansGet(planId)));

    return allSubscriptions.resources.map(subscriptionDbItem => {
        if (!subscriptionDbItem.id)
            throw new Error('Invalid subscription data in store.');

        return ({
            id: subscriptionDbItem.id,
            accountId: subscriptionDbItem.accountId,
            planId: subscriptionDbItem.planId,
            plan: plans.find(plan => plan && plan?.id === subscriptionDbItem.planId),
            createdAt: subscriptionDbItem.createdAt,
            deactivatedAt: subscriptionDbItem.deactivatedAt,
            stripeSubscriptionId: subscriptionDbItem.stripeSubscriptionId
        });
    });
}

async function accountCancelAllSubscriptions(accountId: string) {
    const subscriptions = await accountSubscriptions(accountId);
    const activeSubscriptions = subscriptions.filter(s => !s.deactivatedAt || s.deactivatedAt > Date.now() / 1000);
    for (let i = 0; i < activeSubscriptions.length; i++) {
        const activeSubscription = activeSubscriptions[i];
        if (!activeSubscription) continue;
        try {
            await stripe.subscriptions.cancel(activeSubscription.stripeSubscriptionId, {
                cancellation_details: {
                    comment: 'Plan upgraded'
                }
            });
            console.info('Subscription cancelled', activeSubscription.stripeSubscriptionId);
        } catch (error) {
            console.error('Failed to cancel previous subscription', activeSubscription.stripeSubscriptionId, error);
        }
    }
}

export async function accountSubscriptionCreate(accountId: string, subscription: SubscriptionCreate) {
    // Deactivate previously active subscription
    // (currently only one active subscription is supported per account)
    await accountCancelAllSubscriptions(accountId);

    const subscriptionId = `subscription_${nanoid()}`;
    const dbSubscription: DbSubscription = {
        id: subscriptionId,
        accountId: accountId,
        planId: subscription.planId,
        createdAt: Date.now() / 1000, // UNIX seconds timestamp
        stripeSubscriptionId: subscription.stripeSubscriptionId
    };

    const dbSubscriptions = cosmosDataContainerSubscriptions();
    await dbSubscriptions.items.create<DbSubscription>(dbSubscription);

    return subscriptionId;
}

export async function accountSubscriptionSetStatus(accountId: string, subscriptionId: string, deactivatedAt: Date | null) {
    const dbSubscriptions = cosmosDataContainerSubscriptions();
    await dbSubscriptions.item(subscriptionId, accountId).patch({
        operations: [
            { op: 'add', path: '/deactivatedAt', value: deactivatedAt ? deactivatedAt.getTime() / 1000 : null }
        ]
    });
}

async function accountActiveSubscription(accountId: string) {
    const subscriptions = await accountSubscriptions(accountId);
    return subscriptions.find(subscription => !subscription.deactivatedAt || subscription.deactivatedAt > Date.now() / 1000);
}

function subscriptionActivePeriod(subscriptionStart: number) {
    return period(new Date(subscriptionStart * 1000).getDate(), new Date());
}

async function accountBillingCycleKey(accountId: string) {
    const activeSubscription = await accountActiveSubscription(accountId);
    if (!activeSubscription)
        return null;
    const billingCycle = subscriptionActivePeriod(activeSubscription.createdAt);
    return `${activeSubscription.id}-${billingCycle.start.getFullYear()}${billingCycle.start.getMonth() + 1}`;
}

export async function accountUsage(accountId: string) {
    const billingCycleKey = await accountBillingCycleKey(accountId);
    const dbUsage = cosmosDataContainerUsage();
    const results = await Promise.all([
        dbUsage.item(`messages-${billingCycleKey}`, accountId).read<DbUsage>(),
        workersGetAll(accountId),
        accountActiveSubscription(accountId)
    ]);

    const activeSubscription = results[2];
    const period = activeSubscription ? subscriptionActivePeriod(activeSubscription.createdAt) : null;
    const plan = activeSubscription ? await plansGet(activeSubscription.planId) : null;
    console.log('plan', plan);

    return {
        messages: {
            unlimited: plan?.limits.messages.unlimited ?? false,
            total: plan?.limits.messages.total ?? 0,
            used: results[0].resource?.value || 0,
        },
        workers: {
            unlimited: plan?.limits.workers.unlimited ?? false,
            total: plan?.limits.workers.total ?? 0,
            used: results[1].length,
        },
        period,
    };
}

// NOTE: https://docs.stripe.com/billing/subscriptions/billing-cycle#using-a-trial-to-change-the-billing-cycle
function period(billingCycleAnchorDay: number, onDate: Date) {
    const start = new Date(onDate);
    start.setDate(billingCycleAnchorDay);
    start.setHours(0, 0, 0, 0);

    // Check if the billing cycle anchor day is valid day of on date month
    while (start.getMonth() !== onDate.getMonth()) {
        start.setDate(start.getDate() - 1);
    }

    const end = new Date(start);
    end.setMonth(end.getMonth() + 1);
    end.setDate(billingCycleAnchorDay);
    end.setHours(0, 0, 0, 0);

    while (end.getFullYear() - start.getFullYear() > 1) {
        end.setDate(end.getDate() - 1);
    }

    return { start, end };
}

export async function accountUsageUpdate(id: string) {
    const dbUsage = cosmosDataContainerUsage();
}