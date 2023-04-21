import { run } from '@pulumi/command/local';

export default async function publishProjectAsync (codePath: string, dotnet: 7 = 7) {
    await run({
        command: 'dotnet publish --configuration Release --runtime linux-x64',
        dir: codePath,
    });

    return {
        releaseDir: `${codePath}/bin/Release/net${dotnet}.0/publish/`,
    };
}
