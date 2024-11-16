import { WebApp, SupportedTlsVersions } from '@pulumi/azure-native/web/index.js';
import { ResourceGroup } from '@pulumi/azure-native/resources/index.js';
import { Input, interpolate, Output } from '@pulumi/pulumi';
import { funcAppPlan } from './funcAppPlan.js';

export function createFunction(
    resourceGroup: ResourceGroup,
    namePrefix: string,
    protect: boolean,
    isPublic: boolean,
    cors?: Input<string>[],
    serviceFarmId?: Output<string>) {
    const targetServiceFarmId =
        serviceFarmId ??
        funcAppPlan(resourceGroup, namePrefix, protect).plan.id;

    const app = new WebApp(`func-${namePrefix}`, {
        resourceGroupName: resourceGroup.name,
        serverFarmId: targetServiceFarmId,
        kind: 'functionapp,linux',
        containerSize: 1536,
        dailyMemoryTimeQuota: 500000,
        httpsOnly: !isPublic, // Internal functions are HTTPS only
        identity: {
            type: 'SystemAssigned',
        },
        keyVaultReferenceIdentity: 'SystemAssigned',
        siteConfig: {
            // TODO: Detect .NET version
            linuxFxVersion: 'DOTNET-ISOLATED|8.0',
            http20Enabled: true,
            minTlsVersion: SupportedTlsVersions.SupportedTlsVersions_1_2,
            functionAppScaleLimit: 200,
            cors: {
                allowedOrigins: cors
                    ? [
                        // TODO: Remove localhost
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
        servicePlanId: targetServiceFarmId,
    };
}
