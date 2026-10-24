import assert from 'node:assert/strict';
import { test } from 'node:test';
import { isSecret, output, runtime } from '@pulumi/pulumi';
import { emailRoutingFromConfig } from '../dist/email-routing-tests/emailRouting.js';

const registrations = [];
await runtime.setMocks({
    newResource: args => ({ id: args.id || `${args.name}-id`, state: args.inputs }),
    call: () => { throw new Error('Email routing adoption must not invoke unrelated providers.'); },
}, 'cloud-primary', 'cloud-primary-production', true);

// Inspect what the SDK actually sends to the engine, including import IDs and protection.
const monitor = runtime.getMonitor();
const registerResource = monitor.registerResource.bind(monitor);
monitor.registerResource = (request, callback) => {
    registrations.push({
        name: request.getName(),
        type: request.getType(),
        importId: request.getImportid(),
        protect: request.getProtect(),
        dependencies: request.getDependenciesList(),
        provider: request.getProvider(),
        inputKeys: Object.keys(request.getObject().toJavaScript()),
    });
    return registerResource(request, callback);
};

const inventory = {
    zoneId: 'zone-1',
    accountId: 'account-1',
    domain: 'example.com',
    destinations: [{ id: 'destination-1', email: 'recipient@example.net' }],
    rules: [{
        id: 'rule-1',
        name: 'Existing forward',
        enabled: true,
        priority: 0,
        matchers: [{ type: 'literal', field: 'to', value: 'info@example.com' }],
        actions: [{ type: 'forward', values: ['recipient@example.net'] }],
    }, {
        id: 'rule-2',
        name: 'Existing disabled worker',
        enabled: false,
        priority: 42,
        matchers: [{ type: 'literal', field: 'to', value: 'disabled@example.com' }],
        actions: [{ type: 'worker', values: ['email-worker'] }],
    }],
    catchAll: {
        name: '',
        enabled: false,
        matchers: [{ type: 'all' }],
        actions: [{ type: 'drop' }],
    },
};

function configure(value = inventory, zoneId = 'zone-1', domain = 'example.com') {
    runtime.setAllConfig({
        'cloud-primary:domain': domain,
        'cloud-primary:zoneid': zoneId,
        'cloud-primary:emailRouting': JSON.stringify(value),
        'cloud-primary:emailRoutingApiToken': 'test-routing-token',
    }, ['cloud-primary:zoneid', 'cloud-primary:emailRouting', 'cloud-primary:emailRoutingApiToken']);
}

test('unconfigured stacks register no resources and require no routing configuration', () => {
    runtime.setAllConfig({});
    assert.equal(emailRoutingFromConfig('unconfigured'), undefined);
    assert.equal(registrations.length, 0);
});

test('inventories from another zone or domain fail before registering resources', async () => {
    configure(inventory, 'other-zone');
    let attempted = emailRoutingFromConfig('wrong-zone');
    await assert.rejects(Promise.all([attempted.promise(), attempted.isKnown, attempted.isSecret]), /does not match/);
    configure(inventory, 'zone-1', 'other.example.com');
    attempted = emailRoutingFromConfig('wrong-domain');
    await assert.rejects(Promise.all([attempted.promise(), attempted.isKnown, attempted.isSecret]), /does not match/);
    assert.equal(registrations.length, 0);
});

test('adopts existing DNS, destinations, rules and catch-all with protection', async () => {
    configure();
    const resources = await emailRoutingFromConfig('email').promise();
    const actual = await output({
        dnsId: resources.dns.id,
        destinationIds: resources.destinations.map(destination => destination.id),
        destinationEmails: resources.destinations.map(destination => destination.email),
        rules: resources.rules.map(rule => ({
            id: rule.id,
            name: rule.name,
            enabled: rule.enabled,
            priority: rule.priority,
            matchers: rule.matchers,
            actions: rule.actions,
        })),
        catchAll: {
            id: resources.catchAll.id,
            name: resources.catchAll.name,
            enabled: resources.catchAll.enabled,
            matchers: resources.catchAll.matchers,
            actions: resources.catchAll.actions,
        },
    }).promise();

    assert.equal(actual.dnsId, 'zone-1');
    assert.deepEqual(actual.destinationIds, ['account-1/destination-1']);
    assert.deepEqual(actual.destinationEmails, ['recipient@example.net']);
    assert.deepEqual(actual.rules, inventory.rules.map(rule => ({ ...rule, id: `zone-1/${rule.id}` })));
    assert.deepEqual(actual.catchAll, { ...inventory.catchAll, id: 'zone-1' });
    assert.equal(registrations.length, 6);
    const imported = registrations.filter(resource => resource.type.startsWith('cloudflare:'));
    assert.equal(imported.length, 5);
    assert.ok(imported.every(resource => resource.protect && resource.importId));
    assert.ok(imported.every(resource => resource.provider.endsWith('email-provider-id')));
    // Supplying the optional DNS name causes a post-import update with Cloudflare 6.11.
    assert.deepEqual(imported.find(resource => resource.name === 'email-dns').inputKeys, ['zoneId']);

    const prerequisites = await output([resources.dns.urn, resources.destinations[0].urn]).promise();
    for (const resource of registrations.filter(resource => /-rule-|-catch-all$/.test(resource.name))) {
        assert.ok(prerequisites.every(urn => resource.dependencies.includes(urn)));
    }

    assert.equal(await isSecret(resources.destinations[0].email), true);
    for (const rule of [...resources.rules, resources.catchAll]) {
        assert.equal(await isSecret(rule.matchers), true);
        assert.equal(await isSecret(rule.actions), true);
        assert.equal(await isSecret(rule.name), true);
    }
});

test('another stack can adopt zone rules without also owning account destinations', async () => {
    configure({ ...inventory, destinations: [], rules: [] });
    const resources = await emailRoutingFromConfig('other-owner').promise();
    await output([resources.dns.id, resources.catchAll.id]).promise();
    assert.deepEqual(resources.destinations, []);
    assert.deepEqual(resources.rules, []);
    assert.equal(registrations.filter(resource => resource.name.startsWith('other-owner') && resource.type.startsWith('cloudflare:')).length, 2);
});
