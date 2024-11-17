import { type ResourceGroup } from '@pulumi/azure-native/resources/index.js';
import { type Blob, type BlobContainer, type StorageAccount, SignedResource, Permissions, HttpProtocol, listStorageAccountServiceSASOutput } from '@pulumi/azure-native/storage/index.js';
import { interpolate, Output } from '@pulumi/pulumi';

const accessYearsValid = 3;

export function signedBlobReadUrl(
    blob: Blob,
    container: BlobContainer,
    account: StorageAccount,
    resourceGroup: ResourceGroup): Output<string> {

    const sharedAccessStartDate = new Date(new Date().getFullYear(), 0, 1);
    const sharedAccessExpiryDate = new Date(sharedAccessStartDate);
    sharedAccessExpiryDate.setFullYear(sharedAccessExpiryDate.getFullYear() + accessYearsValid);

    const blobSAS = listStorageAccountServiceSASOutput({
        accountName: account.name,
        protocols: HttpProtocol.Https,
        sharedAccessStartTime: sharedAccessStartDate.toISOString(),
        sharedAccessExpiryTime: sharedAccessExpiryDate.toISOString(),
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
