import { asset, type Input, type Resource } from '@pulumi/pulumi';
import { type ResourceGroup } from '@pulumi/azure-native/resources';
import { Blob, type BlobContainer, type StorageAccount } from '@pulumi/azure-native/storage';
import { signedBlobReadUrl } from './signedBlobReadUrl';

export function assignFunctionCode (
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
        source: new asset.FileArchive(codePath),
    }, {
        dependsOn,
        // parent: app
    });

    const codeBlobUrl = signedBlobReadUrl(codeBlob, zipsContainer, storageAccount, resourceGroup);

    return {
        codeBlob,
        codeBlobUlr: codeBlobUrl,
    };
}
