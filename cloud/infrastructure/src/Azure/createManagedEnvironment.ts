import { ManagedEnvironment } from '@pulumi/azure-native/app';
import { GetSharedKeysResult } from '@pulumi/azure-native/operationalinsights';
import { type ResourceGroup } from '@pulumi/azure-native/resources';
import createLogWorkspace from './createLogWorkspace';

export default function createManagedEnvironments(resourceGroup: ResourceGroup, namePrefix: string) {
    const workspace = createLogWorkspace(resourceGroup, namePrefix);

    const managedEnvironment = new ManagedEnvironment(`env-${namePrefix}`, {
        resourceGroupName: resourceGroup.name,
        appLogsConfiguration: {
            destination: 'log-analytics',
            logAnalyticsConfiguration: {
                customerId: workspace.workspace.customerId,
                sharedKey: workspace.sharedKeys.apply((r: GetSharedKeysResult) => r.primarySharedKey!),
            },
        },
    });

    return {
        managedEnvironment,
    };
}