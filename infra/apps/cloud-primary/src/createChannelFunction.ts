import { Output, type StackReference } from '@pulumi/pulumi';
import { type ResourceGroup } from '@pulumi/azure-native/resources/index.js';
import { createPublicFunction, assignFunctionCodeAsync } from '@infra/pulumi/azure';
import { apiStatusCheck } from '@infra/pulumi/checkly';
import { publishProjectAsync } from '@infra/pulumi/dotnet';
import { ConfChannelApiCheckInterval } from './config.js';
import { type BlobContainer, type StorageAccount } from '@pulumi/azure-native/storage/index.js';

export async function createChannelFunction(
    channelName: string,
    resourceGroup: ResourceGroup,
    storageAccount: StorageAccount,
    zipsContainer: BlobContainer,
    currentStack: StackReference,
    protect: boolean,
    appPlanId: Output<string>): Promise<{
        nameLower: string,
        name: string,
    } & ReturnType<typeof createPublicFunction> & Awaited<ReturnType<typeof assignFunctionCodeAsync>>> {
    const channelNameLower = channelName.toLocaleLowerCase();
    const publicFunctionPrefix = 'channel' + channelNameLower;
    const publicFunctionStoragePrefix = 'ch' + channelNameLower;
    const publicFunctionSubDomain = channelNameLower + '.channel.api';
    const corsDomains = undefined;

    const channelFunc = createPublicFunction(
        resourceGroup,
        publicFunctionPrefix,
        publicFunctionSubDomain,
        corsDomains,
        currentStack,
        protect,
        appPlanId,
    );

    const codePath = `../../../cloud/src/Signalco.Channel.${channelName}`;
    const publishResult = await publishProjectAsync(codePath);

    const channelFuncCode = await assignFunctionCodeAsync(
        resourceGroup,
        storageAccount,
        zipsContainer,
        publicFunctionStoragePrefix,
        publishResult.releaseDir);
    apiStatusCheck(publicFunctionPrefix, `Channel - ${channelName}`, channelFunc.dnsCname.hostname, ConfChannelApiCheckInterval);

    return {
        nameLower: channelNameLower,
        name: channelName,
        ...channelFunc,
        ...channelFuncCode,
    };
}
