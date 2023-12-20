import { Workspace, getSharedKeysOutput, WorkspaceSkuNameEnum } from '@pulumi/azure-native/operationalinsights/index.js';
import { ResourceGroup } from '@pulumi/azure-native/resources/index.js';

export function createLogWorkspace(resourceGroup: ResourceGroup, namePrefix: string) {
    const workspace = new Workspace(`loganalytics-${namePrefix}`, {
        resourceGroupName: resourceGroup.name,
        sku: {
            name: WorkspaceSkuNameEnum.PerGB2018,
        },
        workspaceCapping: {
            dailyQuotaGb: 1,
        },
        retentionInDays: 30,
    });

    const workspaceSharedKeys = getSharedKeysOutput({
        resourceGroupName: resourceGroup.name,
        workspaceName: workspace.name,
    });

    return {
        workspace,
        sharedKeys: workspaceSharedKeys,
    };
}
