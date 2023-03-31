import { ResourceGroup } from '@pulumi/azure-native/resources';
import createContainerApp from '../Azure/createContainerApp';
import createManagedEnvironment from '../Azure/createManagedEnvironment';
import createContainerRegistry from '../Azure/createContainerRegistry';
import createContainerImage from '../Azure/createContainerImage';
import path = require('node:path');

export default function createRemoteBrowser(resourceGroup: ResourceGroup, namePrefix: string) {
    const environment = createManagedEnvironment(resourceGroup, namePrefix);
    const registry = createContainerRegistry(resourceGroup, 'signalco');
    const image = createContainerImage(registry, namePrefix, 'signalco-remote-browser', path.join(process.cwd(), '..', 'src', 'Signalco.Api.RemoteBrowser'));
    createContainerApp(resourceGroup, namePrefix, environment.managedEnvironment, registry, image.image);
}