import { ResourceGroup } from '@pulumi/azure-native/resources/index.js';
import { createStorageAccount, createKeyVault } from '@infra/pulumi/azure';
import { BlobContainer } from '@pulumi/azure-native/storage/index.js';

const up = async () => {
    const shouldProtect = true;

    // Azure
    const resourceGroupName = 'pulumi-backend';
    const resourceGroup = new ResourceGroup(resourceGroupName);

    const stateStorage = createStorageAccount(
        resourceGroup,
        'state',
        shouldProtect,
    );
    
    // Function code archives will be stored in this container.
    const stateContainer = new BlobContainer('pulumi-state', {
        containerName: 'states',
        resourceGroupName: resourceGroup.name,
        accountName: stateStorage.storageAccount.name,
    }, {
        parent: stateStorage.storageAccount,
        protect: shouldProtect,
    });

    const keyvault = createKeyVault(resourceGroup,  'pulumi', shouldProtect, [], true);
};

export default up;