import { ResourceGroup } from '@pulumi/azure-native/resources/index.js';
import { Vault, Secret } from '@pulumi/azure-native/keyvault/index.js';
import { Input, Resource } from '@pulumi/pulumi';

export function vaultSecret(resourceGroup: ResourceGroup, vault: Vault, namePrefix: string, name: string, value: Input<string>, waitFor?: Input<Resource> | Input<Input<Resource>[]>) {
    const secret = new Secret(`secret-${namePrefix}-${name}`, {
        resourceGroupName: resourceGroup.name,
        vaultName: vault.name,
        secretName: name,
        properties: {
            value,
        },
    }, {
        dependsOn: waitFor,
    });

    return {
        secret,
    };
}
