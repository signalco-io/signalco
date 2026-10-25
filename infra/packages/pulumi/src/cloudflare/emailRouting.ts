import {
    EmailRoutingAddress,
    EmailRoutingCatchAll,
    EmailRoutingDns,
    EmailRoutingRule,
    Provider,
} from '@pulumi/cloudflare';
import { Config, all, secret } from '@pulumi/pulumi';

interface EmailRoutingAction {
    type: 'drop' | 'forward' | 'worker';
    values?: string[];
}

interface EmailRoutingMatcher {
    type: 'all' | 'literal';
    field?: 'to';
    value?: string;
}

interface EmailRoutingRuleConfig {
    id: string;
    name?: string;
    enabled: boolean;
    priority: number;
    matchers: EmailRoutingMatcher[];
    actions: EmailRoutingAction[];
}

/** A snapshot of existing routing, captured before adopting it into one stack. */
export interface EmailRoutingConfig {
    zoneId: string;
    accountId: string;
    domain: string;
    destinations: { id: string; email: string }[];
    rules: EmailRoutingRuleConfig[];
    catchAll: Omit<EmailRoutingRuleConfig, 'id' | 'priority'>;
}

/** Adopt existing routing in place. Account destinations must have one owning stack. */
export function emailRouting(name: string, config: EmailRoutingConfig, provider: Provider) {
    const zoneId = secret(config.zoneId);
    const dns = new EmailRoutingDns(`${name}-dns`, {
        zoneId,
    }, {
        import: config.zoneId,
        protect: true,
        provider,
    });

    const destinations = config.destinations.map(destination => new EmailRoutingAddress(
        `${name}-destination-${destination.id}`,
        {
            accountId: config.accountId,
            email: secret(destination.email),
        }, {
            import: `${config.accountId}/${destination.id}`,
            protect: true,
            provider,
        }));

    const rules = config.rules.map(rule => new EmailRoutingRule(`${name}-rule-${rule.id}`, {
        zoneId,
        name: rule.name === undefined ? undefined : secret(rule.name),
        enabled: rule.enabled,
        priority: rule.priority,
        matchers: secret(rule.matchers),
        actions: secret(rule.actions),
    }, {
        import: `${config.zoneId}/${rule.id}`,
        protect: true,
        provider,
        dependsOn: [dns, ...destinations],
    }));

    const catchAll = new EmailRoutingCatchAll(`${name}-catch-all`, {
        zoneId,
        name: config.catchAll.name === undefined ? undefined : secret(config.catchAll.name),
        enabled: config.catchAll.enabled,
        matchers: secret(config.catchAll.matchers),
        actions: secret(config.catchAll.actions),
    }, {
        import: config.zoneId,
        protect: true,
        provider,
        dependsOn: [dns, ...destinations],
    });

    return { dns, destinations, rules, catchAll };
}

/** Leave unconfigured stacks untouched, and reject inventories for another zone. */
export function emailRoutingFromConfig(name: string) {
    const config = new Config();
    const routing = config.getSecretObject<EmailRoutingConfig>('emailRouting');
    if (!routing) {
        return;
    }

    const zoneId = config.requireSecret('zoneid');
    const domain = config.require('domain');
    const apiToken = config.requireSecret('emailRoutingApiToken');
    return all([routing, zoneId]).apply(([inventory, id]) => {
        if (inventory.zoneId !== id || inventory.domain !== domain) {
            throw new Error('Email routing inventory does not match this stack\'s zone and domain.');
        }
        const provider = new Provider(`${name}-provider`, { apiToken });
        return emailRouting(name, inventory, provider);
    });
}
