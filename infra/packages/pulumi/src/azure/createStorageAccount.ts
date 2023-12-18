import { StorageAccount, SkuName, Kind, MinimumTlsVersion } from '@pulumi/azure-native/storage/index.js';
import { ResourceGroup } from '@pulumi/azure-native/resources/index.js';
import { getConnectionString } from './getConnectionString.js';

export function createStorageAccount(resourceGroup: ResourceGroup, namePrefix: string, protect: boolean) {
    const storageAccount = new StorageAccount(`sa${namePrefix}`, {
        resourceGroupName: resourceGroup.name,
        enableHttpsTrafficOnly: true,
        minimumTlsVersion: MinimumTlsVersion.TLS1_2,
        sku: {
            name: SkuName.Standard_LRS,
        },
        kind: Kind.StorageV2,
    }, {
        protect,
    });

    const connectionString = getConnectionString(resourceGroup, storageAccount);

    return {
        storageAccount,
        connectionString,
    };
}
