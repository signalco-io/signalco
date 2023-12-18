import { ResourceGroup } from '@pulumi/azure-native/resources/index.js';
import { type Input, type StackReference } from '@pulumi/pulumi';
import { assignCustomDomain } from './assignCustomDomain.js';
import { createFunction } from './createFunction.js';

export function createPublicFunction(
    resourceGroup: ResourceGroup,
    namePrefix: string,
    subDomainName: string,
    corsDomains: Input<string>[] | undefined,
    currentStack: StackReference,
    protect: boolean) {
    const pubFunc = createFunction(resourceGroup, namePrefix, protect, true, corsDomains);
    const domain = assignCustomDomain(
        resourceGroup, pubFunc.webApp, pubFunc.servicePlan, namePrefix, subDomainName,
        currentStack, protect);

    return {
        ...pubFunc,
        ...domain,
    };
}
