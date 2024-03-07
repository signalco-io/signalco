import { nanoid } from 'nanoid';
import { PatchOperation } from '@azure/cosmos';
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
    active: boolean;

    price: number,
    currency: string,
    period: 'monthly' | 'yearly',
    createdAt: number,
    deactivatedAt?: number

    stripeSubscriptionId: string;
};

export type SubscriptionCreate = {
    planId: string;
    price: number,
    currency: string,
    period: 'monthly' | 'yearly',
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
            plan: plans.find(plan => plan.id === subscriptionDbItem.planId),
            active: subscriptionDbItem.active,
            price: subscriptionDbItem.price,
            currency: subscriptionDbItem.currency,
            period: subscriptionDbItem.period === 'monthly' ? 'monthly' : 'yearly',
            createdAt: subscriptionDbItem.createdAt,
            deactivatedAt: subscriptionDbItem.deactivatedAt,
            stripeSubscriptionId: subscriptionDbItem.stripeSubscriptionId
        });
    });
}

export async function accountSubscriptionCreate(accountId: string, subscription: SubscriptionCreate) {
    const dbSubscriptions = cosmosDataContainerSubscriptions();

    const subscriptionId = `subscription_${nanoid()}`;
    const dbSubscription: DbSubscription = {
        id: subscriptionId,
        accountId: accountId,
        planId: subscription.planId,
        active: true,
        price: subscription.price,
        currency: subscription.currency,
        period: subscription.period,
        createdAt: Date.now() / 1000, // UNIX seconds timestamp
        stripeSubscriptionId: subscription.stripeSubscriptionId
    };

    await dbSubscriptions.items.create<DbSubscription>(dbSubscription);

    // TODO: Deactivate previous subscription (currently only one active subscription is supported per account)

    return subscriptionId;
}

export async function accountSubscriptionSetStatus(accountId: string, subscriptionId: string, active: boolean) {
    const dbSubscriptions = cosmosDataContainerSubscriptions();
    if (!active) {
        await dbSubscriptions.item(subscriptionId, accountId).patch({
            operations: [
                { op: 'replace', path: '/deactivatedAt', value: new Date().getTime() / 1000 }
            ]
        });
    } else {
        await dbSubscriptions.item(subscriptionId, accountId).patch({
            operations: [
                { op: 'remove', path: '/deactivatedAt' }
            ]
        });
    }
}

async function accountActiveSubscription(accountId: string) {
    const subscriptions = await accountSubscriptions(accountId);
    return subscriptions.find(subscription => subscription.active);
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

    return {
        messages: {
            unlimited: plan?.limits.messages.unlimited ?? false,
            total: plan?.limits.messages ?? 0,
            used: results[0].resource?.value || 0,
        },
        workers: {
            unlimited: plan?.limits.workers.unlimited ?? false,
            total: plan?.limits.workers ?? 0,
            used: results[1].length,
        },
        period,
    };
}

// NOTE: https://docs.stripe.com/billing/subscriptions/billing-cycle#using-a-trial-to-change-the-billing-cycle
function period(billingCycleAnchorDay: number, onDate: Date) {
    const start = new Date(onDate);
    start.setMonth(0, billingCycleAnchorDay);
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