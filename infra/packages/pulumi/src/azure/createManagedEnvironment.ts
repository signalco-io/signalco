import { ManagedEnvironment } from '@pulumi/azure-native/app/index.js';
import { GetSharedKeysResult } from '@pulumi/azure-native/operationalinsights/index.js';
import { type ResourceGroup } from '@pulumi/azure-native/resources/index.js';
import { createLogWorkspace } from './createLogWorkspace.js';

export function createManagedEnvironment(
    resourceGroup: ResourceGroup,
    namePrefix: string,
    logWorkspace: ReturnType<typeof createLogWorkspace>,
    shouldProtect: boolean) {
    const managedEnvironment = new ManagedEnvironment(`env-${namePrefix}`, {
        resourceGroupName: resourceGroup.name,
        appLogsConfiguration: {
            destination: 'log-analytics',
            logAnalyticsConfiguration: {
                customerId: logWorkspace.workspace.customerId,
                sharedKey: logWorkspace.sharedKeys.apply((r: GetSharedKeysResult) => r.primarySharedKey!),
            },
        },
    }, {
        protect: shouldProtect,
    });

    return {
        managedEnvironment,
    };
}