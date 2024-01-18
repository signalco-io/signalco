import { Project } from '@pulumiverse/vercel';

export function vercelApp(prefix: string, name: string, {
    framework,
    ignoreCommand,
    outputDirectory,
}: {
    framework?: 'nextjs';
    ignoreCommand?: string;
    outputDirectory?: string;
    }, noGit: boolean = false) {
    const project = new Project(`vercel-${prefix}`, {
        framework,
        gitRepository: noGit ? undefined : {
            productionBranch: 'main',
            repo: 'signalco-io/signalco',
            type: 'github',
        },
        buildCommand: noGit ? undefined : `cd ../.. && npx turbo run build --filter=${name}...`,
        installCommand: noGit ? undefined : `pnpm install --frozen-lockfile --filter ${name}... --filter .`,
        ignoreCommand: noGit ? undefined : ignoreCommand,
        outputDirectory: noGit ? undefined : outputDirectory,
        name: `signalco-${name}`,
        rootDirectory: `web/apps/${name}`,
        serverlessFunctionRegion: 'dub1',
    });

    return {
        projectId: project.id,
    };
}