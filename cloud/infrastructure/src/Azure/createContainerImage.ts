import { Image } from '@pulumi/docker';
import { getStack, interpolate } from '@pulumi/pulumi';
import { type ContainerRegistryResult } from './createContainerRegistry';
import path = require('node:path');

export default function createContainerImage(
    registry: ContainerRegistryResult,
    namePrefix: string,
    imageName: string,
    projectName: string,
) {
    const stack = getStack();
    const workingDirectory = path.join(process.cwd(), '..', 'src', projectName);
    // const dockerFilePath = path.join(process.cwd(), '..', 'src', projectName, 'Dockerfile');
    const image = new Image(`docker-image-${namePrefix}`, {
        imageName: interpolate`${registry.registry.loginServer}/${imageName}:${stack}`,
        build: { 
            context: workingDirectory,
            // dockerfile: dockerFilePath,
            platform: 'linux/amd64',
            // builderVersion: 'BuilderV1',
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