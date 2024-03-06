import { plansGetAll } from '../../../src/lib/repository/plansRepository';

type ArrayElement<ArrType> = ArrType extends readonly (infer ElementType)[]
    ? ElementType
    : never;

export type PlanDto = Omit<ArrayElement<Awaited<ReturnType<typeof plansGetAll>>>, 'stripePriceId'>;

export async function GET() {
    const plans = await plansGetAll();
    const dtos: PlanDto[] = plans.map((plan) => ({
        id: plan.id,
        name: plan.name,
        price: plan.price,
        currency: plan.currency,
        limits: plan.limits,
        period: plan.period,
    }));
    return Response.json(dtos);
}