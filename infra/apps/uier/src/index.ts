import { nextJsApp } from '@infra/pulumi/vercel';
import { dnsRecord } from '@infra/pulumi/cloudflare';
import { ProjectDomain } from '@pulumiverse/vercel';
import { Config, getStack, interpolate } from '@pulumi/pulumi';
import { ResourceGroup } from '@pulumi/azure-native/resources/index.js';
import {
    createStorageAccount,
    createLogWorkspace,
    createAppInsights,
    createFunctionsStorage,
    createPublicFunction,
    assignFunctionCodeAsync,
    assignFunctionSettings,
} from '@infra/pulumi/azure';

const up = async () => {
    const config = new Config();
    const stack = getStack();

    let domainName = undefined; // const domainName = `${config.require('domain')}`;
    if (stack === 'next') domainName = 'next.uier.io';
    else if (stack === 'production') domainName = 'uier.io';
    const corsDomains = [`toolbar.${domainName}`, domainName];

    const resourceGroup = new ResourceGroup(`uier-${stack}`);
    const funcStorage = createFunctionsStorage(resourceGroup, 'funcs', false);
    const toolbarStorage = createStorageAccount(resourceGroup, 'uiertoolbar', false);
    const logWorkspace = createLogWorkspace(resourceGroup, 'log');
    const insights = createAppInsights(resourceGroup, 'insights', logWorkspace);

    const sharedEnvVariables = {
        APPINSIGHTS_INSTRUMENTATIONKEY: interpolate`${insights.component.instrumentationKey}`,
        APPLICATIONINSIGHTS_CONNECTION_STRING: interpolate`${insights.component.connectionString}`,
        ToolbarStorageAccountConnectionString: toolbarStorage.connectionString,
    };

    const internalEnvVariables = {
    };

    const publicApis = [
        { name: '', prefix: 'cpub', subDomain: 'toolbar', cors: corsDomains },
    ];
    const publicFuncs = [];
    for (const api of publicApis) {
        const apiFunc = createPublicFunction(
            resourceGroup,
            api.prefix,
            api.subDomain,
            api.cors,
            currentStack,
            false);
        const apiFuncPublish = await publishProjectAsync([
            '../../../cloud/src/Uier.Api.Public',
            api.name,
        ].filter(i => i.length).join('.'));
        const apiFuncCode = await assignFunctionCodeAsync(
            resourceGroup,
            funcStorage.storageAccount.storageAccount,
            funcStorage.zipsContainer,
            api.prefix,
            apiFuncPublish.releaseDir);
        apiStatusCheck(api.prefix, [api.name, 'API'].filter(i => i.length).join(' '), apiFunc.dnsCname.hostname, ConfCloudApiCheckInterval);

        const func = {
            name: api.name,
            shortName: api.prefix,
            ...apiFunc,
            ...apiFuncCode,
        };

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

        publicFuncs.push(func);
    }

    const app = nextJsApp('uier', 'uier');

    // Configure domain name
    if (domainName) {
        new ProjectDomain('vercel-uier-domain', {
            projectId: app.projectId,
            domain: domainName,
        });

        if (stack === 'next') {
            dnsRecord('vercel-uier', 'next', 'cname.vercel-dns.com', 'CNAME', false);
        } else if (stack === 'production') {
            dnsRecord('vercel-uier', '@', '76.76.21.21', 'A', false);
        }
    }
};

export default up;