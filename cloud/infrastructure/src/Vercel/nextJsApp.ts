import { Project } from '@pulumiverse/vercel';

export function nextJsApp(prefix: string, name: string) {
    new Project(`vercel-${prefix}`, {
        buildCommand: `cd ../.. && npx turbo run build --filter=${name}...`,
        framework: 'nextjs',
        gitRepository: {
            productionBranch: 'main',
            repo: 'signalco-io/signalco',
            type: 'github',
        },
        installCommand: `pnpm install --frozen-lockfile --filter ${name}... --filter .`,
        name: `signalco-${name}`,
        rootDirectory: `web/apps/${name}`,
        serverlessFunctionRegion: 'iad1',
    });
}