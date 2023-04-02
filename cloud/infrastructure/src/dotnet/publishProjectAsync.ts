import { run } from '@pulumi/command/local';

export default async function publishProjectAsync (codePath: string) {
    await run({
        command: 'dotnet publish --configuration Release',
        dir: codePath,
    });

    return {
        releaseDir: `${codePath}/bin/Release/net6.0/publish/`,
    };
}
