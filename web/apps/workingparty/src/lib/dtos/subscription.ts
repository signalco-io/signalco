import { PlanDto } from './plan';

export type SubscriptionDto = {
    id: string;
    plan?: PlanDto;
    active: boolean;
    start: string;
    end?: string;
    hasUpgradePath: boolean;
}