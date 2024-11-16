import { WebApp, AppServicePlan, SupportedTlsVersions } from '@pulumi/azure-native/web/index.js';
import { ResourceGroup } from '@pulumi/azure-native/resources/index.js';
import { Input, interpolate } from '@pulumi/pulumi';

export function createFunction(
    resourceGroup: ResourceGroup,
    namePrefix: string,
    protect: boolean,
    isPublic: boolean,
    cors?: Input<string>[]) {
    const plan = new AppServicePlan(`func-appplan-${namePrefix}`, {
        resourceGroupName: resourceGroup.name,
        kind: 'linux',
        reserved: true,
        sku: {
            name: 'Y1',
            tier: 'Dynamic',
        },
    }, {
        protect,
        // parent: resourceGroup
    });

    const app = new WebApp(`func-${namePrefix}`, {
        resourceGroupName: resourceGroup.name,
        serverFarmId: plan.id,
        kind: 'functionapp,linux',
        containerSize: 1536,
        dailyMemoryTimeQuota: 500000,
        httpsOnly: !isPublic, // Internal functions are HTTPS only
        identity: {
            type: 'SystemAssigned',
        },
        keyVaultReferenceIdentity: 'SystemAssigned',
        siteConfig: {
            linuxFxVersion: 'DOTNET-ISOLATED|9.0',
            http20Enabled: true,
            minTlsVersion: SupportedTlsVersions.SupportedTlsVersions_1_2,
            functionAppScaleLimit: 200,
            cors: {
                allowedOrigins: cors
                    ? [
                        'https://localhost:3000', // Next.js
                        'http://localhost:3000', // Next.js
                        'https://localhost:3001', // Next.js
                        'http://localhost:3001', // Next.js
                        ...cors.map(c => interpolate`https://${c}`),
                    ]
                    : ['*'],
                supportCredentials: !!cors,
            },
        },
    }, {
        protect,
        // parent: plan
    });

    return {
        webApp: app,
        servicePlan: plan,
    };
}
