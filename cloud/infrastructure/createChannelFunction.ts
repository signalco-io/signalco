import { ResourceGroup } from '@pulumi/azure-native/resources';
import createPublicFunction from './createPublicFunction';
import { assignFunctionCode } from './assignFunctionCode';
import apiStatusCheck from './apiStatusCheck';

export default function createChannelFunction (channelName: string, resourceGroup: ResourceGroup, shouldProtect: boolean) {
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
        shouldProtect
    );
    const channelFuncCode = assignFunctionCode(
        resourceGroup,
        channelFunc.webApp,
        publicFunctionStoragePrefix,
        `../Signalco.Channel.${channelName}/bin/Release/net6.0/publish/`,
        shouldProtect);
    apiStatusCheck(publicFunctionPrefix, `Channel - ${channelName}`, channelFunc.dnsCname.hostname, 30);

    return {
        nameLower: channelNameLower,
        name: channelName,
        ...channelFunc,
        ...channelFuncCode
    };
}
