import { type ResourceGroup } from '@pulumi/azure-native/resources';
import { Component, ApplicationType, ComponentArgs } from '@pulumi/azure-native/insights';
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
        workspaceResourceId: logWorkspace.workspace.id,
        ...options,
    });

    return {
        component,
    };
}