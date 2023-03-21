using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Signal.Api.Common;
using Signal.Core;
using Signal.Infrastructure.AzureStorage.Tables;
using Signal.Infrastructure.Secrets;
using Signalco.Func.Internal.Maintenance;
using Signalco.Infrastructure.Processor;

[assembly: FunctionsStartup(typeof(Startup))]

namespace Signalco.Func.Internal.Maintenance;

public class Startup : FunctionsStartup
{
    public override void Configure(IFunctionsHostBuilder builder)
    {
        builder.Services
            .AddCore()
            .AddApi()
            .AddSecrets()
            .AddAzureStorage()
            .AddProcessor();
    }

    public override void ConfigureAppConfiguration(IFunctionsConfigurationBuilder builder)
    {
    }
}