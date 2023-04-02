import { Registry, listRegistryCredentialsOutput } from '@pulumi/azure-native/containerregistry';
import { type ResourceGroup } from '@pulumi/azure-native/resources';
import { interpolate, type Output } from '@pulumi/pulumi';

export type ContainerRegistryResult = {
    registry: Registry,
    credentials: {
        adminUserName: Output<string>,
        adminPassword: Output<string>,
    }
}

export default function createContainerRegistry(resourceGroup: ResourceGroup, name: string, shouldProtect: boolean): ContainerRegistryResult {
    const registry = new Registry(`acr-${name}`, {
        registryName: name,
        resourceGroupName: resourceGroup.name,
        sku: {
            name: 'Basic',
        },
        adminUserEnabled: true,
    }, {
        protect: shouldProtect,
    });

    const credentials = listRegistryCredentialsOutput({
        resourceGroupName: resourceGroup.name,
        registryName: registry.name,
    });

    return {
        registry,
        credentials: {
            adminUserName: interpolate`${credentials.username}`,
            adminPassword: credentials.apply(c => c.passwords![0].value!),
        },
    };
}