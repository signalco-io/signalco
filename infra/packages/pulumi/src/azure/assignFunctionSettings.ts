import { Input } from '@pulumi/pulumi';
import { type WebApp, WebAppApplicationSettings } from '@pulumi/azure-native/web/index.js';
import { type ResourceGroup } from '@pulumi/azure-native/resources/index.js';

export function assignFunctionSettings(resourceGroup: ResourceGroup, app: WebApp, namePrefix: string, storageConnectionString: Input<string>, codeUrl: Input<string>, appSettings: Input<{ [key: string]: Input<string>; }>, protect: boolean) {
    const settings = new WebAppApplicationSettings(`func-appsettings-${namePrefix}`, {
        name: app.name,
        resourceGroupName: resourceGroup.name,
        properties: {
            AzureWebJobsStorage: storageConnectionString,
            WEBSITE_RUN_FROM_PACKAGE: codeUrl,
            FUNCTIONS_EXTENSION_VERSION: '~4',
            FUNCTIONS_WORKER_RUNTIME: 'dotnet-isolated',
            OpenApi__DocTitle: 'Signalco API',
            OpenApi__Version: 'v3',
            OpenApi__HideSwaggerUI: 'true',
            ...appSettings,
        },
    }, {
        protect,
        // parent: app
    });

    return {
        appSettings: settings,
    };
}
