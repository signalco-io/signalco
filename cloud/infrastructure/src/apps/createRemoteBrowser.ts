import { type ResourceGroup } from '@pulumi/azure-native/resources';
import { type ContainerRegistryResult } from '../Azure/createContainerRegistry';
import createContainerApp from '../Azure/createContainerApp';
import createManagedEnvironment from '../Azure/createManagedEnvironment';
import createContainerImage from '../Azure/createContainerImage';

export default function createRemoteBrowser(resourceGroup: ResourceGroup, namePrefix: string, registry: ContainerRegistryResult, shouldProtect: boolean) {
    const environment = createManagedEnvironment(resourceGroup, namePrefix, shouldProtect);
    const image = createContainerImage(registry, namePrefix, 'signalco-remote-browser', 'Signalco.Api.RemoteBrowser');
    const app = createContainerApp(resourceGroup, namePrefix, environment.managedEnvironment, registry, image.image, shouldProtect);

    return {
        app,
    };
}