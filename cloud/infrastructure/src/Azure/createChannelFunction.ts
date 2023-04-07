import { type ResourceGroup } from '@pulumi/azure-native/resources';
import createPublicFunction from './createPublicFunction';
import { assignFunctionCode } from './assignFunctionCode';
import apiStatusCheck from '../Checkly/apiStatusCheck';
import publishProjectAsync from '../dotnet/publishProjectAsync';
import { ConfChannelApiCheckInterval } from '../config';
import { type BlobContainer, type StorageAccount } from '@pulumi/azure-native/storage';

export default async function createChannelFunctionAsync (
    channelName: string, 
    resourceGroup: ResourceGroup, 
    storageAccount: StorageAccount,
    zipsContainer: BlobContainer,
    shouldProtect: boolean) {
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
        shouldProtect,
    );

    const codePath = `../src/Signalco.Channel.${channelName}`;
    const publishResult = await publishProjectAsync(codePath);

    const channelFuncCode = assignFunctionCode(
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
