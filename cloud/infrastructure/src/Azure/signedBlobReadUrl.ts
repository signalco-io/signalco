import { type ResourceGroup } from '@pulumi/azure-native/resources';
import { type Blob, type BlobContainer, type StorageAccount, SignedResource, Permissions, HttpProtocol, listStorageAccountServiceSASOutput } from '@pulumi/azure-native/storage';
import { interpolate, Output } from '@pulumi/pulumi';

export function signedBlobReadUrl (
    blob: Blob,
    container: BlobContainer,
    account: StorageAccount,
    resourceGroup: ResourceGroup): Output<string> {
    const sasEndDateString = '2030-03-28';

    const blobSAS = listStorageAccountServiceSASOutput({
        accountName: account.name,
        protocols: HttpProtocol.Https,
        sharedAccessExpiryTime: sasEndDateString,
        sharedAccessStartTime: new Date().toISOString().split('T')[0],
        resourceGroupName: resourceGroup.name,
        resource: SignedResource.C,
        permissions: Permissions.R,
        canonicalizedResource: interpolate`/blob/${account.name}/${container.name}`,
        contentType: 'application/json',
        cacheControl: 'max-age=5',
        contentDisposition: 'inline',
        contentEncoding: 'deflate',
    });
    return interpolate`https://${account.name}.blob.core.windows.net/${container.name}/${blob.name}?${blobSAS.serviceSasToken}`;
}
