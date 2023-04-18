import { run } from '@pulumi/command/local';

export default async function publishProjectAsync (codePath: string, dotnet: 6 | 7 = 6) {
    await run({
        command: 'dotnet publish --configuration Release',
        dir: codePath,
    });

    return {
        releaseDir: `${codePath}/bin/Release/net${dotnet}.0/publish/`,
    };
}
