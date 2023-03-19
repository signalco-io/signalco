import { createFunction } from './createFunction';
import { type ResourceGroup } from '@pulumi/azure-native/resources';
import publishProjectAsync from '../dotnet/publishProjectAsync';
import { assignFunctionCode } from './assignFunctionCode';
import apiStatusCheck from '../Checkly/apiStatusCheck';

const internalFunctionPrefix = 'cint';

export default async function createInternalFunctionAsync (resourceGroup: ResourceGroup, name: string, shouldProtect: boolean) {
    const shortName = name.substring(0, 9).toLocaleLowerCase();
    const func = createFunction(
        resourceGroup,
        `int${shortName}`,
        shouldProtect,
        false);

    const codePath = `../src/Signalco.Func.Internal.${name}`;
    const publishResult = await publishProjectAsync(codePath);

    const code = assignFunctionCode(
        resourceGroup,
        func.webApp,
        `int${shortName}`,
        publishResult.releaseDir,
        shouldProtect);
    apiStatusCheck(`${internalFunctionPrefix}-${shortName}`, `Internal - ${name}`, func.webApp.hostNames[0], 60);
    return { name, shortName, func, code };
}
