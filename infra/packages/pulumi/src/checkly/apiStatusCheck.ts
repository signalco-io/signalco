import { getStack, Input, interpolate } from '@pulumi/pulumi';
import { Check } from '@checkly/pulumi';

export type CheckFrequency = 15 | 30 | 60 | 120 | 180 | 360 | 720 | 1440;

export function apiStatusCheck(prefix: string, name: string, domain: Input<string>, frequency: CheckFrequency, route?: string) {
    const stack = getStack().split('-').at(-1);
    new Check(`apicheck-${prefix}`, {
        name: `${name}`,
        activated: true,
        frequency,
        type: 'API',
        locations: ['eu-west-1'],
        tags: [stack === 'production' ? 'prod' : 'next'],
        request: {
            method: 'GET',
            url: interpolate`https://${domain}${(route ?? '/api/status')}`,
        },
    });
}
