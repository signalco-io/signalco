import { Config, getStack, interpolate } from '@pulumi/pulumi';
import { ResourceGroup } from '@pulumi/azure-native/resources';
import { createSignalR } from './Azure/createSignalR';
import { createStorageAccount } from './Azure/createStorageAccount';
import { createKeyVault } from './Azure/createKeyVault';
import createPublicFunction from './Azure/createPublicFunction';
import { webAppIdentity } from './Azure/webAppIdentity';
import vaultSecret from './Azure/vaultSecret';
import { assignFunctionCode } from './Azure/assignFunctionCode';
import { assignFunctionSettings } from './Azure/assignFunctionSettings';
import createWebAppAppInsights from './Azure/createWebAppAppInsights';
import createAppInsights from './Azure/createAppInsights';
import createSes from './AWS/createSes';
import createInternalFunctionAsync from './Azure/createInternalFunctionAsync';
import createChannelFunction from './Azure/createChannelFunction';
import apiStatusCheck from './Checkly/apiStatusCheck';
import dnsRecord from './CloudFlare/dnsRecord';
import publishProjectAsync from './dotnet/publishProjectAsync';
import { ConfCloudApiCheckInterval, ConfPublicSignalRCheckInterval } from './config';
import createRemoteBrowser from './apps/createRemoteBrowser';
import { createContainerRegistry, getContainerRegistry } from './Azure/containerRegistry';
import createFunctionsStorage from './Azure/createFunctionsStorage';
import { Dashboard } from '@checkly/pulumi/dashboard';

/*
 * NOTE: `parent` configuration is currently disabled for all resources because
 *       there is memory issued when enabled. (2022/04)
 * NOTE: waiting for Circular dependency solution: https://github.com/pulumi/pulumi/issues/3021
 *       current workaround is to run `az` commands for domain verification (2022/04)
 *       - this doesn't work in CI because az is not installed and authenticated
 */

export = async () => {
    const resourceGroupSharedName = 'signalco-shared';
    const containerRegistryName = 'signalco';

    const config = new Config();
    const stack = getStack();

    if (stack === 'shared') {
        const resourceGroupShared = new ResourceGroup(resourceGroupSharedName, {
            resourceGroupName: resourceGroupSharedName,
        });

        createContainerRegistry(resourceGroupShared, containerRegistryName, true);

        return { };
    } else {
        const shouldProtect = stack === 'production';
        const domainName = `${config.require('domain')}`;

        const resourceGroupName = `signalco-cloud-${stack}`;
        const signalrPrefix = 'sr';
        const storagePrefix = 'store';
        const keyvaultPrefix = 'kv';

        const resourceGroup = new ResourceGroup(resourceGroupName);
        const corsDomains = [`app.${domainName}`, `www.${domainName}`, domainName];

        const signalr = createSignalR(resourceGroup, signalrPrefix, corsDomains, shouldProtect);
        apiStatusCheck(signalrPrefix, 'SignalR', signalr.signalr.hostName, ConfPublicSignalRCheckInterval, '/api/v1/health');

        // Create functions storage
        const funcStorage = createFunctionsStorage(resourceGroup, 'funcs', shouldProtect);

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
                shouldProtect);
            const apiFuncPublish = await publishProjectAsync(['../src/Signalco.Api.Public', api.name].filter(i => i.length).join('.'));
            const apiFuncCode = assignFunctionCode(
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
            internalFuncs.push(await createInternalFunctionAsync(resourceGroup, funcName, funcStorage.storageAccount.storageAccount, funcStorage.zipsContainer, shouldProtect));
        }

        // Generate channels functions
        const productionChannelNames = ['Samsung', 'Slack', 'Zigbee2Mqtt', 'PhilipsHue', 'iRobot'];
        const nextChannelNames = ['GitHubApp'];
        const channelNames = stack === 'production'
            ? productionChannelNames
            : [...productionChannelNames, ...nextChannelNames];
        const channelsFuncs = [];
        for (const channelName of channelNames) {
            channelsFuncs.push(await createChannelFunction(channelName, resourceGroup, funcStorage.storageAccount.storageAccount, funcStorage.zipsContainer, shouldProtect));
        }

        // Create App Insights
        const pubFuncInsights = createWebAppAppInsights(resourceGroup, 'cpub', publicFuncs[0].webApp);
        const intFuncInsights = createWebAppAppInsights(resourceGroup, 'cint', internalFuncs[0].webApp);

        // Create internal apps
        const registry = getContainerRegistry(resourceGroupSharedName, containerRegistryName);
        const appRb = createRemoteBrowser(resourceGroup, 'rb', registry, shouldProtect);

        // Create general storage and prepare tables
        const storage = createStorageAccount(resourceGroup, storagePrefix, shouldProtect);

        // Create AWS SES service
        const ses = createSes(`ses-${stack}`, 'notification');

        // Create and populate vault
        const vault = createKeyVault(resourceGroup, keyvaultPrefix, shouldProtect, [
            ...publicFuncs.map(c => webAppIdentity(c.webApp)),
            ...internalFuncs.map(c => webAppIdentity(c.webApp)),
            ...channelsFuncs.map(c => webAppIdentity(c.webApp)),
        ]);

        vaultSecret(resourceGroup, vault.keyVault, keyvaultPrefix, 'Slack--SigningSecret', config.requireSecret('secret-slackSigningSecret'));
        vaultSecret(resourceGroup, vault.keyVault, keyvaultPrefix, 'Slack--ClientId', config.require('secret-slackClientId'));
        vaultSecret(resourceGroup, vault.keyVault, keyvaultPrefix, 'Slack--ClientSecret', config.requireSecret('secret-slackClientSecret'));
        vaultSecret(resourceGroup, vault.keyVault, keyvaultPrefix, 'SignalcoAppRemoteBrowserUrl', appRb.app.url);

        const sharedEnvVariables = {
            'SignalcoKeyVaultUrl': interpolate`${vault.keyVault.properties.vaultUri}`,
            AzureSignalRConnectionString: signalr.connectionString,
            SignalcoStorageAccountConnectionString: storage.connectionString,
            'Auth0--ApiIdentifier': config.requireSecret('secret-auth0ApiIdentifier'),
            'Auth0--Domain': config.require('secret-auth0Domain'),
            'HCaptcha--SiteKey': config.requireSecret('secret-hcaptchaSiteKey'),
            'SignalcoProcessorAccessCode': config.requireSecret('secret-processorAccessCode'),
        };

        const internalEnvVariables = {
            SmtpNotificationServerUrl: ses.smtpServer,
            SmtpNotificationFromDomain: ses.smtpFromDomain,
            SmtpNotificationUsername: ses.smtpUsername,
            SmtpNotificationPassword: ses.smtpPassword,
            'Auth0--ClientId--Station': config.requireSecret('secret-auth0ClientIdStation'),
            'Auth0--ClientSecret--Station': config.requireSecret('secret-auth0ClientSecretStation'),
            'HCaptcha--Secret': config.requireSecret('secret-hcaptchaSecret'),
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
                    APPINSIGHTS_INSTRUMENTATIONKEY: interpolate`${pubFuncInsights.component.instrumentationKey}`,
                    APPLICATIONINSIGHTS_CONNECTION_STRING: interpolate`${pubFuncInsights.component.connectionString}`,
                },
                shouldProtect);
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
                    APPINSIGHTS_INSTRUMENTATIONKEY: interpolate`${intFuncInsights.component.instrumentationKey}`,
                    APPLICATIONINSIGHTS_CONNECTION_STRING: interpolate`${intFuncInsights.component.connectionString}`,
                },
                shouldProtect);
        });

        // Populate channel function settings
        channelsFuncs.forEach(channel => {
            assignFunctionSettings(
                resourceGroup,
                channel.webApp,
                `channel${channel.nameLower}`,
                funcStorage.storageAccount.connectionString,
                channel.codeBlobUlr,
                {
                    ...sharedEnvVariables,
                    APPINSIGHTS_INSTRUMENTATIONKEY: interpolate`${pubFuncInsights.component.instrumentationKey}`,
                    APPLICATIONINSIGHTS_CONNECTION_STRING: interpolate`${pubFuncInsights.component.connectionString}`,
                },
                shouldProtect,
            );
        });

        createAppInsights(resourceGroup, 'web', 'signalco');

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
    
        // Vercel - Domains
        dnsRecord('vercel-web', 'www', 'cname.vercel-dns.com', 'CNAME', false);
        dnsRecord('vercel-app', 'app', 'cname.vercel-dns.com', 'CNAME', false);
        dnsRecord('vercel-blog', 'blog', 'cname.vercel-dns.com', 'CNAME', false);
        dnsRecord('vercel-ui-docs', 'ui', 'cname.vercel-dns.com', 'CNAME', false);
        dnsRecord('vercel-brandgrab', 'brandgrab', 'cname.vercel-dns.com', 'CNAME', false);
        dnsRecord('vercel-slco', 'slco', 'cname.vercel-dns.com', 'CNAME', false);

        return {
            signalrUrl: signalr.signalr.hostName,
            internalFunctionUrls: internalFuncs.map(f => f.webApp.hostNames[0]),
            publicUrls: publicFuncs.map(c => c.dnsCname.hostname),
            channelsUrls: channelsFuncs.map(c => c.dnsCname.hostname),
            appUrls: [
                appRb.app.url,
            ],
        };
    }
};
