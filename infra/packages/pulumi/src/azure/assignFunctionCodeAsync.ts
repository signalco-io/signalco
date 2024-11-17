import { type Input, type Resource } from '@pulumi/pulumi';
import { FileArchive } from '@pulumi/pulumi/asset/index.js';
import { type ResourceGroup } from '@pulumi/azure-native/resources/index.js';
import { Blob, type BlobContainer, type StorageAccount } from '@pulumi/azure-native/storage/index.js';
import { signedBlobReadUrl } from './signedBlobReadUrl.js';
import path from 'path';
import fsAsync from 'fs/promises';
import { glob } from 'glob';
import { zipSync } from 'fflate';
import { createHash } from 'crypto';

async function hashCode(cwd: string, globPattern: string) {
    // console.log('hashing cwd', cwd, 'globPattern', globPattern);

    const targetFiles = await glob(globPattern, { cwd, absolute: false, nodir: true });
    const promises = targetFiles.sort().map(async (file) => {
        // console.log(file);
        const fpath = path.join(cwd, file);
        const buffer = new Uint8Array(await fsAsync.readFile(fpath));
        return {
            path: file,
            buffer,
        };
    });

    const resolvedPathBuffer = await Promise.all(promises);
    const filenamesAndContents = resolvedPathBuffer.reduce((acc, { path, buffer }) => {
        return { ...acc, [path]: buffer };
    }, {});

    // console.log(Object.keys(filenamesAndContents));

    // zip with fixed m_time produces the same hash based on the file contents instead of the date, regardless of the system.
    const zipContent = zipSync(filenamesAndContents, {
        os: 0,
        mtime: '1987-12-26',
    });
    const hash = createHash('md5').update(zipContent).digest('hex');

    return {
        hash,
    };
}

export async function assignFunctionCodeAsync(
    resourceGroup: ResourceGroup,
    storageAccount: StorageAccount,
    zipsContainer: BlobContainer,
    namePrefix: string,
    codePath: string,
    dependsOn?: Input<Resource> | Input<Input<Resource>[]> | undefined) {
    const { hash } = await hashCode(codePath, '**/*');

    // Upload Azure Function's code as a zip archive to the storage account.
    const codeBlob = new Blob(`zip-${namePrefix}-hash${hash}`, {
        blobName: `zip-${namePrefix}-hash${hash}.zip`,
        resourceGroupName: resourceGroup.name,
        accountName: storageAccount.name,
        containerName: zipsContainer.name,
        source: new FileArchive(codePath),
    }, {
        dependsOn,
        retainOnDelete: true,
    });

    const codeBlobUrl = signedBlobReadUrl(codeBlob, zipsContainer, storageAccount, resourceGroup);

    return {
        codeBlob,
        codeBlobUlr: codeBlobUrl,
    };
}
