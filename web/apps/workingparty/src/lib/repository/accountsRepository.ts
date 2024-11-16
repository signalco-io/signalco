import { nanoid } from 'nanoid';
import { PatchOperation } from '@azure/cosmos';
import { getStripe } from '../stripe/config';
import { cosmosDataContainerAccounts, cosmosDataContainerSubscriptions, cosmosDataContainerUsage } from '../cosmosClient';
import { workersGetAll } from './workersRepository';
import { DbPlan, plansGet, plansGetAll } from './plansRepository';

type UsageScopesImmutable = 'workers';
type UsageScopesMutable = 'messages' | 'oaigpt35tokens';
type UsageScopes = UsageScopesImmutable | UsageScopesMutable;

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

    stripeSubscriptionId?: string;
};

export type SubscriptionCreate = {
    planId: string;
    stripeSubscriptionId?: string;
};

export type DbUsage = {
    id: string;
    accountId: string;
    subscriptionId: string;
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

async function accountAssignTrialPlan(accountId: string) {
    try {
        const plans = await plansGetAll();
        const trialPlan = plans.find(plan => plan.active && plan.period === 'one-time' && plan.name === 'Free');
        if (!trialPlan) {
            throw new Error('No trial plan available');
        }
        await accountSubscriptionCreate(accountId, {
            planId: trialPlan.id
        });
    } catch (error) {
        console.error('Failed to assign trial plan', error);
    }
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
    await accountAssignTrialPlan(accountId);

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

        // Skip if subscription is not created in Stripe
        if (!activeSubscription?.stripeSubscriptionId) continue;

        try {
            await getStripe().subscriptions.cancel(activeSubscription.stripeSubscriptionId, {
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

function subscriptionActivePeriod(subscriptionStart: number) {
    return period(new Date(subscriptionStart * 1000).getDate(), new Date());
}

async function accountBillingCycle(accountId: string) {
    const activeSubscription = await accountActiveSubscription(accountId);
    if (!activeSubscription)
        return null;
    const billingCycle = subscriptionActivePeriod(activeSubscription.createdAt);
    return {
        key: `${activeSubscription.id}-${billingCycle.start.getFullYear()}${billingCycle.start.getMonth() + 1}`,
        subscriptionId: activeSubscription.id
    };
}

export async function accountUsage(accountId: string) {
    try {
        const [messagesUsage, workersUsage, activeSubscription] = await Promise.all([
            accountUsageScope(accountId, 'messages'),
            accountUsageScope(accountId, 'workers'),
        accountActiveSubscription(accountId)
    ]);

        const period = activeSubscription ? subscriptionActivePeriod(activeSubscription.createdAt) : null;

    return {
        messages: {
            unlimited: messagesUsage.unlimited,
            total: messagesUsage.total,
            used: messagesUsage.used,
        },
        workers: {
            unlimited: workersUsage.unlimited,
            total: workersUsage.total,
            used: workersUsage.used,
        },
        period,
    };
    } catch (error) {
        console.error('Failed to get account usage', error);
        return {
            messages: {
                unlimited: false,
                total: 0,
                used: 0,
            },
            workers: {
                unlimited: false,
                total: 0,
                used: 0,
            },
            period: null,
        };
    }
}

export async function accountUsageScope(accountId: string, scope: UsageScopes) {
    const activeSubscription = await accountActiveSubscription(accountId);
    const plan = activeSubscription ? await plansGet(activeSubscription.planId) : null;
    if (!plan)
        throw new Error('No active subscription');

    const billingCycle = await accountBillingCycle(accountId);
    if (!billingCycle)
        throw new Error('No billing cycle available');

    if (scope === 'workers') {
        const workers = await workersGetAll(accountId)
        return {
            used: workers.length,
            total: plan?.limits.workers.total || 0,
            unlimited: plan?.limits.workers.unlimited || false
        };
    } else {
        const dbUsage = cosmosDataContainerUsage();
        const dbUsageItem = await dbUsage.item(`${scope}-${billingCycle?.key}`, accountId).read<DbUsage>();

        // Calculate limit
        const limit = { unlimited: false, total: 0 };
        if (scope === 'oaigpt35tokens')
            limit.unlimited = true;
        else {
            limit.unlimited = plan.limits[scope].unlimited;
            limit.total = plan.limits[scope].total;
        }

        return {
            used: dbUsageItem.resource?.value || 0,
            total: limit.total,
            unlimited: limit.unlimited
        };
    }
}

async function accountUsageIncrementScope(
    billingCycle: NonNullable<Awaited<ReturnType<typeof accountBillingCycle>>>,
    accountId: string,
    scope: UsageScopesMutable,
    value: number
) {
    const { subscriptionId, key } = billingCycle;
    const id = `${scope}-${key}`;
    const dbUsage = cosmosDataContainerUsage();
    const dbUsageItem = await dbUsage.item(id, accountId).read<DbUsage>();
    if (dbUsageItem.resource) {
        await dbUsage.item(id, accountId).patch({
            operations: [
                { op: 'incr', path: '/value', value: value }
            ]
        });
    } else {
        await dbUsage.items.create<DbUsage>({
            id,
            accountId,
            subscriptionId: subscriptionId,
            value
        });
    }
}

export async function accountUsageOverLimit(accountId: string, scope: UsageScopes): Promise<boolean> {
    const { used, total, unlimited } = await accountUsageScope(accountId, scope);
    if (unlimited) return false;
    return used >= total;
}

export async function accountUsageIncrement(accountId: string, used: {
    messages?: number;
    oaigpt35tokens?: number;
}) {
    const billingCycle = await accountBillingCycle(accountId);
    if (!billingCycle) {
        throw new Error('No billing cycle available');
    }

    if (used.messages !== undefined) {
        await accountUsageIncrementScope(billingCycle, accountId, 'messages', used.messages);
    }
    if (used.oaigpt35tokens !== undefined) {
        await accountUsageIncrementScope(billingCycle, accountId, 'oaigpt35tokens', used.oaigpt35tokens);
    }
}
