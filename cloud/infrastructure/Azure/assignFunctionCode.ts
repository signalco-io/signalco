import { asset, type Input, type Resource } from '@pulumi/pulumi';
import { type WebApp } from '@pulumi/azure-native/web';
import { type ResourceGroup } from '@pulumi/azure-native/resources';
import { Blob, BlobContainer } from '@pulumi/azure-native/storage';
import { createStorageAccount } from './createStorageAccount';
import { signedBlobReadUrl } from './signedBlobReadUrl';

export function assignFunctionCode (
    resourceGroup: ResourceGroup,
    app: WebApp,
    namePrefix: string,
    codePath: string,
    protect: boolean,
    dependsOn?: Input<Resource> | Input<Input<Resource>[]> | undefined) {
    const account = createStorageAccount(resourceGroup, namePrefix, protect, app);

    // Function code archives will be stored in this container.
    const codeContainer = new BlobContainer(`func-zips-${namePrefix}`, {
        containerName: 'zips',
        resourceGroupName: resourceGroup.name,
        accountName: account.storageAccount.name
    }, {
        // parent: app
    });

    // Upload Azure Function's code as a zip archive to the storage account.
    const codeBlob = new Blob(`func-zip-${namePrefix}`, {
        blobName: 'zip',
        resourceGroupName: resourceGroup.name,
        accountName: account.storageAccount.name,
        containerName: codeContainer.name,
        source: new asset.FileArchive(codePath)
    }, {
        dependsOn
        // parent: app
    });

    const codeBlobUrl = signedBlobReadUrl(codeBlob, codeContainer, account.storageAccount, resourceGroup);

    return {
        storageAccount: account,
        codeBlob,
        codeBlobUlr: codeBlobUrl
    };
}
