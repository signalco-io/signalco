import { createFunction, assignFunctionCodeAsync } from '@infra/pulumi/azure';
import { type ResourceGroup } from '@pulumi/azure-native/resources/index.js';
import { publishProjectAsync } from '@infra/pulumi/dotnet';
import { apiStatusCheck } from '@infra/pulumi/checkly';
import { ConfInternalApiCheckInterval } from './config.js';
import { type BlobContainer, type StorageAccount } from '@pulumi/azure-native/storage/index.js';
import { Output } from '@pulumi/pulumi';

const internalFunctionPrefix = 'cint';

export async function createInternalFunctionAsync(
    resourceGroup: ResourceGroup,
    name: string,
    storageAccount: StorageAccount,
    zipsContainer: BlobContainer,
    shouldProtect: boolean,
    appPlanId?: Output<string>): Promise<{
        name: string,
        shortName: string,
    } & ReturnType<typeof createFunction> & Awaited<ReturnType<typeof assignFunctionCodeAsync>>> {
    const shortName = name.substring(0, 9).toLocaleLowerCase();
    const func = createFunction(
        resourceGroup,
        `int${shortName}`,
        shouldProtect,
        false,
        undefined,
        appPlanId);

    const codePath = `../../../cloud/src/Signalco.Func.Internal.${name}`;
    const publishResult = await publishProjectAsync(codePath);

    const code = await assignFunctionCodeAsync(
        resourceGroup,
        storageAccount,
        zipsContainer,
        `int${shortName}`,
        publishResult.releaseDir);
    apiStatusCheck(`${internalFunctionPrefix}-${shortName}`, `Internal - ${name}`, func.webApp.hostNames[0]!, ConfInternalApiCheckInterval);
    return {
        name,
        shortName,
        ...func,
        ...code,
    };
}
