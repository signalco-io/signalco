import { Image } from '@pulumi/docker';
import { interpolate } from '@pulumi/pulumi';
import { type ContainerRegistryResult } from './createContainerRegistry';

export default function createContainerImage(
    registry: ContainerRegistryResult,
    namePrefix: string,
    imageName: string,
    dockerFileDirectory: string,
) {
    const image = new Image(`docker-image-${namePrefix}`, {
        imageName: interpolate`${registry.registry.loginServer}/${imageName}:v1.0.0`,
        build: { context: dockerFileDirectory },
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