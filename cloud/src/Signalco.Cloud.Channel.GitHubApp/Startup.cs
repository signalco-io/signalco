using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Signal.Infrastructure.AzureStorage.Tables;
using Signal.Infrastructure.Secrets;
using Signalco.Cloud.Channel.GitHubApp;

[assembly: FunctionsStartup(typeof(Startup))]

namespace Signalco.Cloud.Channel.GitHubApp;

public class Startup : FunctionsStartup
{
    public override void Configure(IFunctionsHostBuilder builder)
    {
        builder.Services
            .AddSecrets()
            .AddAzureStorage();
    }

    public override void ConfigureAppConfiguration(IFunctionsConfigurationBuilder builder)
    {
    }
}