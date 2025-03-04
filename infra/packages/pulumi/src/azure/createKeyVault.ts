import { Output } from '@pulumi/pulumi';
import { ResourceGroup } from '@pulumi/azure-native/resources/index.js';
import { Vault, SkuFamily, SkuName, KeyPermissions, SecretPermissions } from '@pulumi/azure-native/keyvault/index.js';
import { getClientConfig } from '@pulumi/azure-native/authorization/index.js';

export function createKeyVault(
    resourceGroup: ResourceGroup,
    namePrefix: string,
    protect: boolean,
    policies: Output<{
        tenantId: Output<string>;
        objectId: Output<string>;
    }>[] = [],
    rbac = false) {
    const current = Output.create(getClientConfig());
    const vault = new Vault(`vault-${namePrefix}`, {
        resourceGroupName: resourceGroup.name,
        properties: {
            sku: {
                family: SkuFamily.A,
                name: SkuName.Standard,
            },
            tenantId: current.tenantId,
            enableRbacAuthorization: rbac,
            accessPolicies: [
                {
                    objectId: current.objectId,
                    permissions: {
                        keys: [
                            KeyPermissions.Get,
                            KeyPermissions.Create,
                            KeyPermissions.Delete,
                            KeyPermissions.List,
                            KeyPermissions.Recover,
                            KeyPermissions.Purge,
                        ],
                        secrets: [
                            SecretPermissions.Get,
                            SecretPermissions.List,
                            SecretPermissions.Set,
                            SecretPermissions.Delete,
                            SecretPermissions.Recover,
                            SecretPermissions.Purge,
                        ],
                    },
                    tenantId: current.tenantId,
                },
                ...policies.map(i => ({
                    objectId: i.objectId,
                    tenantId: i.tenantId,
                    permissions: {
                        secrets: [SecretPermissions.Get, SecretPermissions.Set],
                    },
                })),
            ],
        },
    }, {
        protect,
    });

    return {
        keyVault: vault,
    };
}
