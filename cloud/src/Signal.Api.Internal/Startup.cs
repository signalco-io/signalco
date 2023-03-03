using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Signal.Api.Common;
using Signal.Api.Internal;
using Signal.Core;
using Signal.Infrastructure.AzureStorage.Tables;
using Signal.Infrastructure.Secrets;
using Signalco.Infrastructure.Processor;

[assembly: FunctionsStartup(typeof(Startup))]

namespace Signal.Api.Internal;

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