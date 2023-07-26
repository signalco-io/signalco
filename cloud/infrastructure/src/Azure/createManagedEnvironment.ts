import { ManagedEnvironment } from '@pulumi/azure-native/app';
import { GetSharedKeysResult } from '@pulumi/azure-native/operationalinsights';
import { type ResourceGroup } from '@pulumi/azure-native/resources';
import type createLogWorkspace from './createLogWorkspace';

export default function createManagedEnvironments(
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