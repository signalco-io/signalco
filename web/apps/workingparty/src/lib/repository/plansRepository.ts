import { nanoid } from 'nanoid';
import { cosmosDataContainerPlans } from '../cosmosClient';

export type DbPlan = {
    id: string;
    name: string;
    price: number,
    currency: string,
    period: 'monthly' | 'yearly' | 'one-time',
    stripePriceId: string;
    limits: {
        messages: {
            total: number;
            unlimited: boolean;
        };
        workers: {
            total: number;
            unlimited: boolean;
        };
    };
    active: boolean;
};

export type PlanCreate = {
    name: string;
    price: number;
    currency: string;
    period: 'monthly' | 'yearly' | 'one-time';
    stripePriceId: string;
    limits: {
        messages: {
            total: number;
            unlimited: boolean;
        };
        workers: {
            total: number;
            unlimited: boolean;
        };
    };
    active: boolean;
};

export type PlanUpdate = {
    id: string;
    name: string;
    price: number;
    currency: string;
    period: 'monthly' | 'yearly' | 'one-time';
    stripePriceId: string;
    limits: {
        messages: {
            total: number;
            unlimited: boolean;
        };
        workers: {
            total: number;
            unlimited: boolean;
        };
    };
    active: boolean;
};

export async function plansGetAll(): Promise<Array<DbPlan>> {
    const dbPlans = cosmosDataContainerPlans();
    const allPlans = await dbPlans.items.readAll<DbPlan>().fetchAll();

    return allPlans.resources.map((planDbItem) => {
        if (!planDbItem.id)
            return null;

        return ({
            id: planDbItem.id,
            name: planDbItem.name,
            price: planDbItem.price,
            currency: planDbItem.currency,
            period: planDbItem.period,
            stripePriceId: planDbItem.stripePriceId,
            limits: planDbItem.limits,
            active: planDbItem.active
        });
    }).filter(Boolean);
}

export async function plansGet(id: string): Promise<DbPlan | undefined> {
    const dbPlans = cosmosDataContainerPlans();
    const dbPlan = await dbPlans.item(id, id).read<DbPlan>();
    if (!dbPlan.resource?.id)
        return undefined;

    return dbPlan.resource;
}

export async function plansGetByStripePriceId(stripePriceId: string): Promise<DbPlan | undefined> {
    const dbPlans = cosmosDataContainerPlans();
    const { resources: plans } = await dbPlans.items.query<DbPlan>({
        query: 'SELECT * FROM plans p WHERE p.stripePriceId = @stripePriceId',
        parameters: [{ name: '@stripePriceId', value: stripePriceId }]
    }).fetchAll();

    return plans[0];
}

export async function plansCreate(plan: PlanCreate) {
    const dbPlans = cosmosDataContainerPlans();
    const planId = `plan_${nanoid()}`;
    await dbPlans.items.create<DbPlan>({
        id: planId,
        name: plan.name,
        price: plan.price,
        currency: plan.currency,
        period: plan.period,
        stripePriceId: plan.stripePriceId,
        limits: plan.limits,
        active: plan.active
    });
    return planId;
}

export async function plansUpdate(plan: PlanUpdate) {
    const dbPlans = cosmosDataContainerPlans();
    await dbPlans.item(plan.id, plan.id).replace<DbPlan>({
        id: plan.id,
        name: plan.name,
        price: plan.price,
        currency: plan.currency,
        period: plan.period,
        stripePriceId: plan.stripePriceId,
        limits: plan.limits,
        active: plan.active
    });
}

export async function plansDelete(id: string) {
    const dbPlans = cosmosDataContainerPlans();
    await dbPlans.item(id, id).patch<DbPlan>({
        operations: [{ op: 'replace', path: '/active', value: false }]
    });
}