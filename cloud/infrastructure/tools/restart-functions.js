const { exec } = require('node:child_process');

exec('pulumi stack output --json', (err, stdout, stderr) => {
    if (err) {
        console.error(err, stderr);
        return;
    }
    
    const output = JSON.parse(stdout);
    const functionAppNames = output.functionApps;
    const resourceGroupName = output.resourceGroupName;
    for (const functionName of functionAppNames) {
        console.log(`Restarting function: ${functionName}`);
        exec(`az functionapp restart --name ${functionName} --resource-group ${resourceGroupName}`, (err, stdout, stderr) => {
            if (err) {
                console.error('Restarting function failed: ' + functionName, err, stderr);
                return;
            }
            console.log('Restarted function: ' + functionName);
        });
    }
});
