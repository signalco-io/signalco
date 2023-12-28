import { run } from '@pulumi/command/local/index.js';

export async function publishProjectAsync(codePath: string) {
    const dotnetVersion = 8;
    await run({
        command: 'dotnet clean',
        dir: codePath,
    });

    await run({
        command: 'dotnet publish --configuration Release -nologo -consoleLoggerParameters:NoSummary -verbosity:quiet --v:q',
        dir: codePath,
    });

    return {
        releaseDir: `${codePath}/bin/Release/net${dotnetVersion}.0/publish/`,
    };
}
