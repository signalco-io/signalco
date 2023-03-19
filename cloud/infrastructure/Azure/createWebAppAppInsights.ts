import { ResourceGroup } from '@pulumi/azure-native/resources';
import { WebApp } from '@pulumi/azure-native/web';
import createAppInsights from './createAppInsights';

export default function createWebAppAppInsights (resourceGroup: ResourceGroup, namePrefix: string, webApp: WebApp) {
    return createAppInsights(resourceGroup, 'func', namePrefix, {
        resourceName: webApp.name
    });
}
