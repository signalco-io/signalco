import { AppServicePlan } from '@pulumi/azure-native/web/index.js';
import { ResourceGroup } from '@pulumi/azure-native/resources/index.js';

export function funcAppPlan(
    resourceGroup: ResourceGroup,
    namePrefix: string,
    protect: boolean,
) {
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

    return {
        plan,
    };
}