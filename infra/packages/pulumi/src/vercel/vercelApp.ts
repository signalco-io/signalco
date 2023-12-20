import { Project } from '@pulumiverse/vercel';

export function vercelApp(prefix: string, name: string, {
    framework,
    ignoreCommand,
    outputDirectory,
}: {
    framework?: 'nextjs';
    ignoreCommand?: string;
    outputDirectory?: string;
}) {
    const project = new Project(`vercel-${prefix}`, {
        framework,
        gitRepository: {
            productionBranch: 'main',
            repo: 'signalco-io/signalco',
            type: 'github',
        },
        buildCommand: `cd ../.. && npx turbo run build --filter=${name}...`,
        installCommand: `pnpm install --frozen-lockfile --filter ${name}... --filter .`,
        ignoreCommand,
        outputDirectory,
        name: `signalco-${name}`,
        rootDirectory: `web/apps/${name}`,
        serverlessFunctionRegion: 'dub1',
    });

    return {
        projectId: project.id,
    };
}