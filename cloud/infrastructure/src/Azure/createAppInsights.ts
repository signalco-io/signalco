import { type ResourceGroup } from '@pulumi/azure-native/resources';
import { ComponentCurrentBillingFeature, Component, ApplicationType, type ComponentArgs } from '@pulumi/azure-native/insights';
import type createLogWorkspace from './createLogWorkspace';

export default function createAppInsights(
    resourceGroup: ResourceGroup,
    namePrefix: string,
    logWorkspace: ReturnType<typeof createLogWorkspace>,
    options?: Partial<ComponentArgs>) {
    const component = new Component(`${namePrefix}`, {
        kind: 'web',
        resourceGroupName: resourceGroup.name,
        applicationType: ApplicationType.Web,
        samplingPercentage: 0.1,
        retentionInDays: 30,
        workspaceResourceId: logWorkspace.workspace.id,
        ...options,
    });

    new ComponentCurrentBillingFeature(`${namePrefix}-billing`, {
        resourceGroupName: resourceGroup.name,
        resourceName: component.name,
        currentBillingFeatures: ['Basic'],
        dataVolumeCap: {
            cap: 1,
        },
    });

    return {
        component,
    };
}