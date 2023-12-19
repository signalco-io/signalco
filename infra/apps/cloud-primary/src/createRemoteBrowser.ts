import { type ResourceGroup } from '@pulumi/azure-native/resources/index.js';
import { type ContainerRegistryResult, type createLogWorkspace } from '@infra/pulumi/azure';
import { createContainerApp, createManagedEnvironment, createContainerImage } from '@infra/pulumi/azure';

export function createRemoteBrowser(
    resourceGroup: ResourceGroup,
    namePrefix: string,
    registry: ContainerRegistryResult,
    logWorkspace: ReturnType<typeof createLogWorkspace>,
    shouldProtect: boolean): { app: ReturnType<typeof createContainerApp> } {
    const environment = createManagedEnvironment(resourceGroup, namePrefix, logWorkspace, shouldProtect);
    const image = createContainerImage(registry, namePrefix, 'signalco-remote-browser', 'Signalco.Api.RemoteBrowser');
    const app = createContainerApp(resourceGroup, namePrefix, environment.managedEnvironment, registry, image.image, shouldProtect);

    return {
        app,
    };
}