import { Output, Input, interpolate } from '@pulumi/pulumi';
import { listStorageAccountKeysOutput } from '@pulumi/azure-native/storage';
import { ResourceGroup } from '@pulumi/azure-native/resources';

export function getConnectionString (resourceGroup: ResourceGroup, accountName: Input<string>): Output<string> {
    // Retrieve the primary storage account key.
    const storageAccountKeys = listStorageAccountKeysOutput({ resourceGroupName: resourceGroup.name, accountName });
    const primaryStorageKey = storageAccountKeys.keys[0].value;

    // Build the connection string to the storage account.
    return interpolate`DefaultEndpointsProtocol=https;AccountName=${accountName};AccountKey=${primaryStorageKey}`;
}
