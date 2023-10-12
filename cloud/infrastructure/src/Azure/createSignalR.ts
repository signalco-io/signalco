import { Input, interpolate } from '@pulumi/pulumi';
import { ResourceGroup } from '@pulumi/azure-native/resources';
import { SignalR, listSignalRKeysOutput } from '@pulumi/azure-native/signalrservice';

export function createSignalR(resourceGroup: ResourceGroup, namePrefix: string, cors: Input<string>[], sku: 'free' | 'standard1', protect: boolean) {
    const signalr = new SignalR('signalr-' + namePrefix, {
        cors: {
            allowedOrigins: cors
                ? [
                    'https://localhost:3000', // Next.js
                    'http://localhost:3000', // Next.js
                    'https://localhost:3001', // Next.js
                    'http://localhost:3001', // Next.js
                    'https://localhost:6006', // Storybook
                    'http://localhost:6006', // Storybook
                    ...cors.map(c => interpolate`https://${c}`),
                ]
                : ['*'],
        },
        kind: 'SignalR',
        features: [
            {
                flag: 'ServiceMode',
                properties: {},
                value: 'Serverless',
            },
        ],
        networkACLs: {
            defaultAction: 'Deny',
            publicNetwork: {
                allow: [
                    'ServerConnection',
                    'ClientConnection',
                    'RESTAPI',
                    'Trace',
                ],
            },
        },
        resourceGroupName: resourceGroup.name,
        sku: {
            capacity: 1,
            name: sku === 'free' ? 'Free_F1' : 'Standard_S1',
        },
    }, {
        protect,
        // parent: resourceGroup
    });

    const connectionString = interpolate`${listSignalRKeysOutput({
        resourceGroupName: resourceGroup.name,
        resourceName: signalr.name,
    }).primaryConnectionString}`;

    return {
        signalr,
        connectionString,
    };
}
