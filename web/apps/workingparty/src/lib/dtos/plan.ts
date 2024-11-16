import { plansGetAll } from '../repository/plansRepository';

type ArrayElement<ArrType> = ArrType extends readonly (infer ElementType)[]
    ? ElementType
    : never;

export type PlanDto = Omit<ArrayElement<Awaited<ReturnType<typeof plansGetAll>>>, 'stripePriceId'>;