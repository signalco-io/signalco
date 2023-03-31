import { ResourceGroup } from '@pulumi/azure-native/resources';
import createContainerApp from '../Azure/createContainerApp';
import createManagedEnvironment from '../Azure/createManagedEnvironment';
import createContainerRegistry from '../Azure/createContainerRegistry';
import createContainerImage from '../Azure/createContainerImage';

export default function createRemoteBrowser(resourceGroup: ResourceGroup, namePrefix: string, shouldProtect: boolean) {
    const environment = createManagedEnvironment(resourceGroup, namePrefix, shouldProtect);
    const registry = createContainerRegistry(resourceGroup, 'signalco', shouldProtect);
    const image = createContainerImage(registry, namePrefix, 'signalco-remote-browser', 'Signalco.Api.RemoteBrowser');
    createContainerApp(resourceGroup, namePrefix, environment.managedEnvironment, registry, image.image, shouldProtect);
}