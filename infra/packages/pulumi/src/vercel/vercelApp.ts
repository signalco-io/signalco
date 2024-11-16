import { Project } from '@pulumiverse/vercel';

export function vercelApp(prefix: string, name: string, {
    framework,
    ignoreCommand,
    outputDirectory,
    rootDirectory,
}: {
    framework?: 'nextjs';
    ignoreCommand?: string;
    outputDirectory?: string;
        rootDirectory?: string;
    }) {
    const project = new Project(`vercel-${prefix}`, {
        framework,
        ignoreCommand: ignoreCommand,
        outputDirectory: outputDirectory,
        name: `signalco-${name}`,
        serverlessFunctionRegion: 'dub1',
        rootDirectory: rootDirectory,
    });

    return {
        projectId: project.id,
    };
}