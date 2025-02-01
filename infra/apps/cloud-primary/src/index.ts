import { Config, getStack, interpolate, StackReference, getProject } from '@pulumi/pulumi';
import { ResourceGroup } from '@pulumi/azure-native/resources/index.js';
import {
    createSignalR,
    createStorageAccount,
    createKeyVault,
    createPublicFunction,
    webAppIdentity,
    vaultSecret,
    assignFunctionCodeAsync,
    assignFunctionSettings,
    createContainerRegistry,
    getContainerRegistry,
    createFunctionsStorage,
    createLogWorkspace,
    createAppInsights,
    acsEmails,
} from '@infra/pulumi/azure';
import { apiStatusCheck } from '@infra/pulumi/checkly';
import { dnsRecord } from '@infra/pulumi/cloudflare';
import { publishProjectAsync } from '@infra/pulumi/dotnet';
import { ConfCloudApiCheckInterval, ConfPublicSignalRCheckInterval } from './config.js';
import { createRemoteBrowser } from './createRemoteBrowser.js';
import { Dashboard } from '@checkly/pulumi';
import { nextJsApp, vercelApp } from '@infra/pulumi/vercel';
import { createChannelFunction } from './createChannelFunction.js';
import { createInternalFunctionAsync } from './createInternalFunctionAsync.js';
import { funcAppPlan } from '../../../packages/pulumi/src/azure/funcAppPlan.js';

/*
 * NOTE: `parent` configuration is currently disabled for all resources because
 *       there is memory issued when enabled. (2022/04)
 * NOTE: waiting for Circular dependency solution: https://github.com/pulumi/pulumi/issues/3021
 *       current workaround is to run `az` commands for domain verification (2022/04)
 *       - this doesn't work in CI because az is not installed and authenticated
 */

const up = async () => {
    const resourceGroupSharedName = 'signalco-shared';
    const containerRegistryName = 'signalco';

    const config = new Config();
    const stack = getStack();

    if (stack === 'shared') {
        const resourceGroupShared = new ResourceGroup(resourceGroupSharedName, {
            resourceGroupName: resourceGroupSharedName,
        });

        createContainerRegistry(resourceGroupShared, containerRegistryName, true);

        return {};
    } else {
        const shouldProtect = stack === 'production';

        const signalrPrefix = 'sr';
        const storagePrefix = 'store';
        const keyvaultPrefix = 'kv';

        const currentStack = new StackReference(`signalco/${getProject()}/${getStack()}`);

        const resourceGroup = new ResourceGroup(`signalco-cloud-${stack}`);

        const domainName = `${config.require('domain')}`;
        const corsDomains = [`app.${domainName}`, `www.${domainName}`, domainName];

        const signalr = createSignalR(resourceGroup, signalrPrefix, corsDomains, 'free', false);
        apiStatusCheck(signalrPrefix, 'SignalR', signalr.signalr.hostName, ConfPublicSignalRCheckInterval, '/api/v1/health');

        // Create functions storage
        const funcStorage = createFunctionsStorage(resourceGroup, 'funcs', shouldProtect);

        // Create log workspace
        const logWorkspace = createLogWorkspace(resourceGroup, 'log');

        // Create functions app plan
        const sharedLinuxConsumptionPlan = funcAppPlan(resourceGroup, 'linux-consumption', false);

        // Generate public functions
        const publicApis = [
            { name: '', prefix: 'cpub', subDomain: 'api', cors: corsDomains },
            { name: 'RemoteBrowser', prefix: 'rbpub', subDomain: 'browser.api' },
        ];
        const publicFuncs = [];
        for (const api of publicApis) {
            const apiFunc = createPublicFunction(
                resourceGroup,
                api.prefix,
                api.subDomain,
                api.cors,
                currentStack,
                false,
                sharedLinuxConsumptionPlan.plan.id);
            const apiFuncPublish = await publishProjectAsync([
                '../../../cloud/src/Signalco.Api.Public',
                api.name,
            ].filter(i => i.length).join('.'));
            const apiFuncCode = await assignFunctionCodeAsync(
                resourceGroup,
                funcStorage.storageAccount.storageAccount,
                funcStorage.zipsContainer,
                api.prefix,
                apiFuncPublish.releaseDir);
            apiStatusCheck(api.prefix, [api.name, 'API'].filter(i => i.length).join(' '), apiFunc.dnsCname.hostname, ConfCloudApiCheckInterval);
            publicFuncs.push({
                name: api.name,
                shortName: api.prefix,
                ...apiFunc,
                ...apiFuncCode,
            });
        }

        // Generate internal functions
        const internalNames = ['UsageProcessor', 'ContactStateProcessor', 'TimeEntityPublic', 'Maintenance', 'Migration'];
        const internalFuncs = [];
        for (const funcName of internalNames) {
            internalFuncs.push(await createInternalFunctionAsync(
                resourceGroup,
                funcName,
                funcStorage.storageAccount.storageAccount,
                funcStorage.zipsContainer,
                false,
                sharedLinuxConsumptionPlan.plan.id));
        }

        // Generate channels functions
        const productionChannelNames = ['Samsung', 'Slack', 'Zigbee2Mqtt', 'PhilipsHue', 'iRobot', 'Station'];
        const nextChannelNames = ['GitHubApp'];
        const channelNames = stack === 'production'
            ? productionChannelNames
            : [...productionChannelNames, ...nextChannelNames];
        const channelsFunctions = [];
        for (const channelName of channelNames) {
            channelsFunctions.push(await createChannelFunction(
                channelName,
                resourceGroup,
                funcStorage.storageAccount.storageAccount,
                funcStorage.zipsContainer,
                currentStack,
                false,
                sharedLinuxConsumptionPlan.plan.id));
        }

        // Generate discrete functions
        const discreteNames = ['Mutex'];
        const discreteFunctions = [];
        for (const funcName of discreteNames) {
            const discreteResourceGroup = new ResourceGroup(`signalco-discrete-${stack}-${funcName.toLowerCase()}`);
            const discreteLinuxConsumptionPlan = funcAppPlan(discreteResourceGroup, `linux-consumption-${funcName}`, false);
            const discreteStorage = createFunctionsStorage(discreteResourceGroup, `${funcName.toLowerCase().substring(0, 5)}funcs`, false);
            const func = createPublicFunction(
                discreteResourceGroup,
                funcName.toLowerCase().substring(0, 5),
                `${funcName.toLowerCase()}.api`,
                undefined,
                currentStack,
                false,
                discreteLinuxConsumptionPlan.plan.id);
            const funcPublish = await publishProjectAsync(`../../../discrete/Signalco.Discrete.Api.${funcName}/cloud`);
            const funcCode = await assignFunctionCodeAsync(
                discreteResourceGroup,
                discreteStorage.storageAccount.storageAccount,
                discreteStorage.zipsContainer,
                funcName.toLowerCase().substring(0, 5),
                funcPublish.releaseDir);
            discreteFunctions.push({
                name: funcName,
                shortName: funcName.toLowerCase().substring(0, 5),
                resourceGroup: discreteResourceGroup,
                ...func,
                ...funcCode,
                storage: discreteStorage,
            });
        }

        // Create app insights
        const insights = createAppInsights(resourceGroup, 'insights', logWorkspace);

        // Create internal apps
        const registry = getContainerRegistry(resourceGroupSharedName, containerRegistryName);
        const appRb = createRemoteBrowser(resourceGroup, 'rb', registry, logWorkspace, false);

        // Create general storage
        const storage = createStorageAccount(resourceGroup, storagePrefix, shouldProtect);

        // ACS (Email)
        // DomainName can be root (e.g. signalco.io) or subdomain (e.g. next.signalco.io)
        // ACS Domain name should be the root domain (e.g. signalco.io)
        // Subdomain is used for the ACS subdomain (e.g. next)
        const acsDomainName = domainName.split('.').length > 2 ? domainName.split('.').slice(1).join('.') : domainName;
        const acsSubDomain = domainName.split('.').length > 2 ? domainName.split('.')[0] : null;
        const { acsPrimaryConnectionString } = await acsEmails(
            'cp',
            resourceGroup,
            acsDomainName,
            acsSubDomain,
            stack,
            [
                { subdomain: 'notifications', displayName: 'Signalco Notifications' },
                { subdomain: 'system', displayName: 'Signalco' },
            ]);

        // Create and populate vault
        const vault = createKeyVault(resourceGroup, keyvaultPrefix, shouldProtect, [
            ...publicFuncs.map(c => webAppIdentity(c.webApp)),
            ...internalFuncs.map(c => webAppIdentity(c.webApp)),
            ...channelsFunctions.map(c => webAppIdentity(c.webApp)),
        ]);

        vaultSecret(resourceGroup, vault.keyVault, keyvaultPrefix, 'Slack--SigningSecret', config.requireSecret('secret-slackSigningSecret'));
        vaultSecret(resourceGroup, vault.keyVault, keyvaultPrefix, 'Slack--ClientId', config.require('secret-slackClientId'));
        vaultSecret(resourceGroup, vault.keyVault, keyvaultPrefix, 'Slack--ClientSecret', config.requireSecret('secret-slackClientSecret'));
        vaultSecret(resourceGroup, vault.keyVault, keyvaultPrefix, 'SignalcoAppRemoteBrowserUrl', appRb.app.url);

        const sharedEnvVariables = {
            'SignalcoKeyVaultUrl': interpolate`${vault.keyVault.properties.vaultUri}`,
            AzureSignalRConnectionString: signalr.connectionString,
            SignalcoStorageAccountConnectionString: storage.connectionString,
            'Auth0_ApiIdentifier': config.requireSecret('secret-auth0ApiIdentifier'),
            'Auth0_Domain': config.require('secret-auth0Domain'),
            'HCaptcha_SiteKey': config.requireSecret('secret-hcaptchaSiteKey'),
            'SignalcoProcessorAccessCode': config.requireSecret('secret-processorAccessCode'),
            APPINSIGHTS_INSTRUMENTATIONKEY: interpolate`${insights.component.instrumentationKey}`,
            APPLICATIONINSIGHTS_CONNECTION_STRING: interpolate`${insights.component.connectionString}`,
        };

        const internalEnvVariables = {
            AcsConnectionString: acsPrimaryConnectionString,
            AcsDomain: acsDomainName,
            'Auth0_ClientId_Station': config.requireSecret('secret-auth0ClientIdStation'),
            'Auth0_ClientSecret_Station': config.requireSecret('secret-auth0ClientSecretStation'),
            'HCaptcha_Secret': config.requireSecret('secret-hcaptchaSecret'),
            'SignalcoPatSigningToken': config.requireSecret('secret-patSigningToken'),
        };

        // Populate public functions settings
        publicFuncs.forEach(func => {
            assignFunctionSettings(
                resourceGroup,
                func.webApp,
                `pub${func.shortName}`,
                funcStorage.storageAccount.connectionString,
                func.codeBlobUlr,
                {
                    ...sharedEnvVariables,
                    ...internalEnvVariables,
                },
                false);
        });

        // Populate internal functions settings
        internalFuncs.forEach(func => {
            assignFunctionSettings(
                resourceGroup,
                func.webApp,
                `int${func.shortName}`,
                funcStorage.storageAccount.connectionString,
                func.codeBlobUlr,
                {
                    ...sharedEnvVariables,
                    ...internalEnvVariables,
                },
                false);
        });

        // Populate channel function settings
        channelsFunctions.forEach(channel => {
            assignFunctionSettings(
                resourceGroup,
                channel.webApp,
                `channel${channel.nameLower}`,
                funcStorage.storageAccount.connectionString,
                channel.codeBlobUlr,
                {
                    ...sharedEnvVariables,
                },
                false,
            );
        });

        // Populate discrete function settings
        discreteFunctions.forEach(func => {
            assignFunctionSettings(
                func.resourceGroup,
                func.webApp,
                `discrete${func.shortName}`,
                func.storage.storageAccount.connectionString,
                func.codeBlobUlr,
                {
                    StorageAccountConnectionString: func.storage.storageAccount.connectionString,
                },
                false);
        });

        // Checkly public dashboard (only for production)
        if (stack === 'production') {
            new Dashboard('checkly-public-dashboard', {
                customDomain: 'status.signalco.io',
                customUrl: 'signalco-public',
                header: 'Status',
                logo: 'https://www.signalco.io/images/icon-light-512x512.png',
                link: 'https://www.signalco.io',
                tags: ['public'],
            });

            // Checkly - Domains
            dnsRecord('checkly-public-dashboard', 'status', 'checkly-dashboards.com', 'CNAME', false);
            dnsRecord('checkly-public-dashboard-txt', '_vercel', 'vc-domain-verify=status.signalco.io,563d86cd3501b049a1ad', 'TXT', false);
        }

        // Vercel apps
        nextJsApp('signalco-blog', 'blog', 'web/apps/blog');
        nextJsApp('signalco-app', 'app', 'web/apps/app');
        nextJsApp('signalco-web', 'web', 'web/apps/web');
        nextJsApp('slco', 'slco', 'web/apps/slco');
        nextJsApp('brandgrab', 'brandgrab', 'web/apps/brandgrab');
        nextJsApp('doprocess', 'doprocess', 'web/apps/doprocess');
        vercelApp('signalco-ui-docs', 'ui-docs', {
            ignoreCommand: 'npx turbo-ignore',
            outputDirectory: 'storybook-static',
        });

        // Vercel - Domains
        dnsRecord('vercel-web', 'www', 'cname.vercel-dns.com', 'CNAME', false);
        dnsRecord('vercel-app', 'app', 'cname.vercel-dns.com', 'CNAME', false);
        dnsRecord('vercel-blog', 'blog', 'cname.vercel-dns.com', 'CNAME', false);
        dnsRecord('vercel-ui-docs', 'ui', 'cname.vercel-dns.com', 'CNAME', false);
        dnsRecord('vercel-brandgrab', 'brandgrab', 'cname.vercel-dns.com', 'CNAME', false);
        dnsRecord('vercel-slco', 'slco', 'cname.vercel-dns.com', 'CNAME', false);
        dnsRecord('vercel-doprocess', 'doprocess', 'cname.vercel-dns.com', 'CNAME', false);

        return {
            signalrUrl: signalr.signalr.hostName,
            internalFunctionUrls: internalFuncs.map(f => f.webApp.hostNames[0]),
            publicUrls: publicFuncs.map(c => c.dnsCname.hostname),
            channelsUrls: channelsFunctions.map(c => c.dnsCname.hostname),
            appUrls: [
                appRb.app.url,
            ],
            discreteUrls: discreteFunctions.map(f => f.webApp.hostNames[0]),
            resourceGroupName: resourceGroup.name,
            functionApps: [
                ...internalFuncs.map(c => c.webApp.name),
                ...publicFuncs.map(c => c.webApp.name),
                ...channelsFunctions.map(c => c.webApp.name),
                ...discreteFunctions.map(c => c.webApp.name),
            ],
            certs: [
                ...publicFuncs.map(f => ({ fullDomainName: f.fullDomainName, thumbprint: f.cert.thumbprint })),
                ...channelsFunctions.map(f => ({ fullDomainName: f.fullDomainName, thumbprint: f.cert.thumbprint })),
                ...discreteFunctions.map(f => ({ fullDomainName: f.fullDomainName, thumbprint: f.cert.thumbprint })),
            ],
        };
    }
};

export default up;
