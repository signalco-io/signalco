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
};

export type PlanCreate = {
    name: string;
    price: number;
    currency: string;
    period: 'monthly' | 'yearly' | 'one-time';
    stripePriceId?: string;
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
};

const defaultPlans: Array<PlanCreate> = [
    {
        name: 'Free',
        period: 'one-time',
        price: 0,
        currency: 'eur',
        limits: {
            messages: {
                total: 20,
                unlimited: false
            },
            workers: {
                total: 5,
                unlimited: false
            }
        }
    },
    {
        name: 'Plus',
        period: 'monthly',
        price: 9,
        currency: 'eur',
        limits: {
            messages: {
                total: 250,
                unlimited: false
            },
            workers: {
                total: 10,
                unlimited: false
            }
        },
        stripePriceId: 'price_1Oou5TKrhEdchP2Tx6lQL6uW'
    },
    {
        name: 'Plus',
        period: 'yearly',
        price: 99,
        currency: 'eur',
        limits: {
            messages: {
                total: 250,
                unlimited: false
            },
            workers: {
                total: 10,
                unlimited: false
            }
        },
        stripePriceId: 'price_1Oox8IKrhEdchP2TZ6Y0dbqy'
    },
    {
        name: 'Pro',
        period: 'monthly',
        price: 29,
        currency: 'eur',
        limits: {
            messages: {
                total: 1000,
                unlimited: false
            },
            workers: {
                total: 20,
                unlimited: false
            }
        },
        stripePriceId: 'price_1OoxAjKrhEdchP2T9wfx29u9'
    },
    {
        name: 'Pro',
        period: 'yearly',
        price: 299,
        currency: 'eur',
        limits: {
            messages: {
                total: 1000,
                unlimited: false
            },
            workers: {
                total: 20,
                unlimited: false
            }
        },
        stripePriceId: 'price_1OoxB4KrhEdchP2TABuliYVS'
    },
];

async function seedPlans() {
    for (const plan of defaultPlans) {
        await plansCreate(plan);
    }
}

export async function plansGetAll(): Promise<Array<DbPlan>> {
    const dbPlans = cosmosDataContainerPlans();
    const allPlans = await dbPlans.items.readAll().fetchAll();

    if (allPlans.resources.length === 0) {
        await seedPlans();
    }

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
            limits: planDbItem.limits
        });
    }).filter(Boolean) ?? [];
}

export async function plansGet(id: string): Promise<DbPlan> {
    const dbPlans = cosmosDataContainerPlans();
    const dbPlan = await dbPlans.item(id, id).read();
    return {
        id: dbPlan.resource.id,
        name: dbPlan.resource.name,
        price: dbPlan.resource.price,
        currency: dbPlan.resource.currency,
        period: dbPlan.resource.period,
        limits: dbPlan.resource.limits,
        stripePriceId: dbPlan.resource.stripePriceId,
    };
}

export async function plansCreate(plan: PlanCreate) {
    const dbPlans = cosmosDataContainerPlans();
    const planId = `plan_${nanoid()}`;
    await dbPlans.items.create({
        id: planId,
        name: plan.name,
        price: plan.price,
        currency: plan.currency,
        period: plan.period,
        stripePriceId: plan.stripePriceId,
        limits: plan.limits
    });
    return planId;
}

export async function plansDelete(id: string) {
    const dbPlans = cosmosDataContainerPlans();
    await dbPlans.item(id, id).delete();
}