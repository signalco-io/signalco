import { ContainerApp, ManagedEnvironment } from '@pulumi/azure-native/app/index.js';
import { ResourceGroup } from '@pulumi/azure-native/resources/index.js';
import { Image } from '@pulumi/docker';
import { interpolate } from '@pulumi/pulumi';
import { type ContainerRegistryResult } from './containerRegistry.js';

export function createContainerApp(resourceGroup: ResourceGroup, namePrefix: string, environment: ManagedEnvironment, registry: ContainerRegistryResult, image: Image, shouldProtect: boolean) {
    const containerApp = new ContainerApp(`docker-app-${namePrefix}`, {
        resourceGroupName: resourceGroup.name,
        managedEnvironmentId: environment.id,
        configuration: {
            ingress: {
                external: true,
                targetPort: 80,
            },
            registries: [{
                server: registry.registry.loginServer,
                username: registry.credentials.adminUserName,
                passwordSecretRef: 'pwd',
            }],
            secrets: [{
                name: 'pwd',
                value: registry.credentials.adminPassword,
            }],
        },
        template: {
            containers: [{
                name: 'app',
                image: image.imageName,
            }],
            scale: {
                minReplicas: 0,
                maxReplicas: 3,
            },
        },
    }, {
        protect: shouldProtect,
    });

    return {
        app: containerApp,
        url: interpolate`https://${containerApp.configuration.apply(c => c?.ingress?.fqdn)}`,
    };
}