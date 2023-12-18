import { type Input, type Resource } from '@pulumi/pulumi';
import { FileArchive } from '@pulumi/pulumi/asset/index.js';
import { type ResourceGroup } from '@pulumi/azure-native/resources/index.js';
import { Blob, type BlobContainer, type StorageAccount } from '@pulumi/azure-native/storage/index.js';
import { signedBlobReadUrl } from './signedBlobReadUrl.js';

export async function assignFunctionCodeAsync(
    resourceGroup: ResourceGroup,
    storageAccount: StorageAccount,
    zipsContainer: BlobContainer,
    namePrefix: string,
    codePath: string,
    dependsOn?: Input<Resource> | Input<Input<Resource>[]> | undefined) {
    // Upload Azure Function's code as a zip archive to the storage account.
    const codeBlob = new Blob(`zip-${namePrefix}`, {
        blobName: `zip-${namePrefix}`,
        resourceGroupName: resourceGroup.name,
        accountName: storageAccount.name,
        containerName: zipsContainer.name,
        source: new FileArchive(codePath),
    }, {
        dependsOn,
    });

    const codeBlobUrl = signedBlobReadUrl(codeBlob, zipsContainer, storageAccount, resourceGroup);

    return {
        codeBlob,
        codeBlobUlr: codeBlobUrl,
    };
}
