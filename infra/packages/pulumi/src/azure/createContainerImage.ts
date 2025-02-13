import { Image } from '@pulumi/docker';
import { getStack, interpolate } from '@pulumi/pulumi';
import { type ContainerRegistryResult } from './containerRegistry.js';
import path from 'node:path';

export function createContainerImage(
    registry: ContainerRegistryResult,
    namePrefix: string,
    imageName: string,
    projectName: string,
) {
    const stack = getStack().split('-').at(-1);
    const workingDirectory = path.join(process.cwd(), '..', '..', '..', 'cloud', 'src', projectName);
    const image = new Image(`docker-image-${namePrefix}`, {
        imageName: interpolate`${registry.registry.loginServer}/${imageName}:${stack}`,
        build: {
            context: workingDirectory,
            platform: 'linux/amd64',
        },
        registry: {
            server: registry.registry.loginServer,
            username: registry.credentials.adminUserName,
            password: registry.credentials.adminPassword,
        },
    });

    return {
        image,
    };
}