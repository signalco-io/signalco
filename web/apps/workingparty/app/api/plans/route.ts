import { plansGetAll } from '../../../src/lib/repository/plansRepository';
import { PlanDto } from '../../../src/lib/dtos/plan';

export const dynamic = 'force-dynamic';

export async function GET() {
    const plans = await plansGetAll();
    const dtos: PlanDto[] = plans.filter(plan => plan.active).map((plan) => ({
        id: plan.id,
        name: plan.name,
        price: plan.price,
        currency: plan.currency,
        limits: plan.limits,
        period: plan.period,
        active: plan.active
    }));
    return Response.json(dtos);
}
