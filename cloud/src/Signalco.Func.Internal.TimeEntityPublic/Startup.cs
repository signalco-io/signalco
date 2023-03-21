using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Signal.Api.Common;
using Signal.Core;
using Signal.Infrastructure.AzureStorage.Tables;
using Signal.Infrastructure.Secrets;
using Signalco.Func.Internal.TimeEntityPublic;

[assembly: FunctionsStartup(typeof(Startup))]

namespace Signalco.Func.Internal.TimeEntityPublic;

public class Startup : FunctionsStartup
{
    public override void Configure(IFunctionsHostBuilder builder)
    {
        builder.Services
            .AddCore()
            .AddApi()
            .AddSecrets()
            .AddAzureStorage();
    }
}