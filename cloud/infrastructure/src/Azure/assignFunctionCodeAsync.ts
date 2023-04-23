import { hashElement } from 'folder-hash';
import { asset, type Input, type Resource } from '@pulumi/pulumi';
import { type ResourceGroup } from '@pulumi/azure-native/resources';
import { Blob, type BlobContainer, type StorageAccount } from '@pulumi/azure-native/storage';
import { signedBlobReadUrl } from './signedBlobReadUrl';

export async function assignFunctionCodeAsync(
    resourceGroup: ResourceGroup,
    storageAccount: StorageAccount,
    zipsContainer: BlobContainer,
    namePrefix: string,
    codePath: string,
    dependsOn?: Input<Resource> | Input<Input<Resource>[]> | undefined) {
    const hash = await hashElement(codePath);
    const archive = new asset.FileArchive(codePath);

    // Upload Azure Function's code as a zip archive to the storage account.
    const codeBlob = new Blob(`zip-${namePrefix}`, {
        blobName: `zip-${namePrefix}-${hash.hash}.zip`,
        resourceGroupName: resourceGroup.name,
        accountName: storageAccount.name,
        containerName: zipsContainer.name,
        source: archive,
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
