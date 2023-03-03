import { getStack, Input, interpolate } from '@pulumi/pulumi';
import { Check } from '@checkly/pulumi';

export default function apiStatusCheck (prefix: string, name: string, domain: Input<string>, frequency: number, route?: string) {
    const stack = getStack();
    new Check(`apicheck-${prefix}`, {
        name: `${name} (${stack})`,
        activated: true,
        frequency,
        type: 'API',
        locations: ['eu-west-1'],
        tags: [stack === 'production' ? 'public' : 'dev'],
        request: {
            method: 'GET',
            url: interpolate`https://${domain}${route ?? '/api/status'}`
        }
    });
}
