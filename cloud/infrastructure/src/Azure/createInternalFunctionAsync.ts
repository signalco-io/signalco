import { createFunction } from './createFunction';
import { type ResourceGroup } from '@pulumi/azure-native/resources';
import publishProjectAsync from '../dotnet/publishProjectAsync';
import { assignFunctionCodeAsync } from './assignFunctionCodeAsync';
import apiStatusCheck from '../Checkly/apiStatusCheck';
import { ConfInternalApiCheckInterval } from '../config';
import { type BlobContainer, type StorageAccount } from '@pulumi/azure-native/storage';

const internalFunctionPrefix = 'cint';

export default async function createInternalFunctionAsync (
    resourceGroup: ResourceGroup, 
    name: string, 
    storageAccount: StorageAccount,
    zipsContainer: BlobContainer,
    shouldProtect: boolean) {
    const shortName = name.substring(0, 9).toLocaleLowerCase();
    const func = createFunction(
        resourceGroup,
        `int${shortName}`,
        shouldProtect,
        false);

    const codePath = `../src/Signalco.Func.Internal.${name}`;
    const publishResult = await publishProjectAsync(codePath);

    const code = await assignFunctionCodeAsync(
        resourceGroup,
        storageAccount,
        zipsContainer,
        `int${shortName}`,
        publishResult.releaseDir);
    apiStatusCheck(`${internalFunctionPrefix}-${shortName}`, `Internal - ${name}`, func.webApp.hostNames[0], ConfInternalApiCheckInterval);
    return { 
        name, 
        shortName, 
        ...func, 
        ...code,
    };
}
