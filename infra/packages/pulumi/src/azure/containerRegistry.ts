import { Registry, listRegistryCredentialsOutput, getRegistryOutput } from '@pulumi/azure-native/containerregistry/index.js';
import { type ResourceGroup } from '@pulumi/azure-native/resources/index.js';
import { interpolate, type Output } from '@pulumi/pulumi';

export type ContainerRegistryResult = {
    registry: {
        name: Output<string>,
        loginServer: Output<string>
    },
    credentials: {
        adminUserName: Output<string>,
        adminPassword: Output<string>,
    }
}

export function getContainerRegistry(resourceGroupName: string, name: string): ContainerRegistryResult {
    const registry = getRegistryOutput({
        registryName: name,
        resourceGroupName: resourceGroupName,
    });

    const credentials = listRegistryCredentialsOutput({
        resourceGroupName: resourceGroupName,
        registryName: registry.name,
    });

    return {
        registry,
        credentials: {
            adminUserName: interpolate`${credentials.username}`,
            adminPassword: credentials.apply(c => c.passwords![0]!.value!),
        },
    };
}

export function createContainerRegistry(resourceGroup: ResourceGroup, name: string, shouldProtect: boolean): ContainerRegistryResult {
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
            adminPassword: credentials.apply(c => c.passwords![0]!.value!),
        },
    };
}