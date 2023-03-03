import { ResourceGroup } from '@pulumi/azure-native/resources';
import { Blob, BlobContainer, StorageAccount, SignedResource, Permissions, HttpProtocol, listStorageAccountServiceSASOutput } from '@pulumi/azure-native/storage';
import { interpolate, Output } from '@pulumi/pulumi';

export function signedBlobReadUrl (blob: Blob,
    container: BlobContainer,
    account: StorageAccount,
    resourceGroup: ResourceGroup): Output<string> {
    const sasStartDateString = '2022-03-28';
    const sasEndDateString = '2030-03-28';

    const blobSAS = listStorageAccountServiceSASOutput({
        accountName: account.name,
        protocols: HttpProtocol.Https,
        sharedAccessExpiryTime: sasEndDateString,
        sharedAccessStartTime: sasStartDateString,
        resourceGroupName: resourceGroup.name,
        resource: SignedResource.C,
        permissions: Permissions.R,
        canonicalizedResource: interpolate`/blob/${account.name}/${container.name}`,
        contentType: 'application/json',
        cacheControl: 'max-age=5',
        contentDisposition: 'inline',
        contentEncoding: 'deflate'
    });
    return interpolate`https://${account.name}.blob.core.windows.net/${container.name}/${blob.name}?${blobSAS.serviceSasToken}`;
}
