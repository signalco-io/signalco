import { nanoid } from "nanoid";
import { cosmosDataContainerPlans } from "../cosmosClient";

export type DbPlan = {
    id: string;
    name: string;
    price: number,
    currency: string,
    period: 'monthly' | 'yearly',
    stripePriceId: string;
};

export type PlanCreate = {
    name: string;
    price: number;
    currency: string;
    period: 'monthly' | 'yearly';
    stripePriceId?: string;
};

export async function plansGetAll(): Promise<Array<DbPlan>> {
    const dbPlans = cosmosDataContainerPlans();
    const allPlans = await dbPlans.items.readAll().fetchAll();

    return allPlans.resources.map((planDbItem) => {
        if (!planDbItem.id)
            return null;

        return ({
            id: planDbItem.id,
            name: planDbItem.name,
            price: planDbItem.price,
            currency: planDbItem.currency,
            period: planDbItem.period,
            stripePriceId: planDbItem.stripePriceId
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
        stripePriceId: dbPlan.resource.stripePriceId
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
        stripePriceId: plan.stripePriceId
    });
    return planId;
}

export async function plansDelete(id: string) {
    const dbPlans = cosmosDataContainerPlans();
    await dbPlans.item(id, id).delete();
}