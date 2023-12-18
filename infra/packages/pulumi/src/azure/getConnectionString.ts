import { Output, interpolate } from '@pulumi/pulumi';
import { listStorageAccountKeysOutput, StorageAccount } from '@pulumi/azure-native/storage/index.js';
import { ResourceGroup } from '@pulumi/azure-native/resources/index.js';

export function getConnectionString(resourceGroup: ResourceGroup, account: StorageAccount): Output<string> {
    // Retrieve the primary storage account key.
    const storageAccountKeys = listStorageAccountKeysOutput({ resourceGroupName: resourceGroup.name, accountName: account.name });
    const primaryStorageKey = storageAccountKeys.keys[0]!.value;

    // Build the connection string to the storage account.
    return interpolate`DefaultEndpointsProtocol=https;AccountName=${account.name};AccountKey=${primaryStorageKey}`;
}
