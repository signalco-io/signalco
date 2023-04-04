using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using Signal.Api.Common;
using Signal.Api.Common.Auth;
using Signal.Api.Common.HCaptcha;
using Signal.Core;
using Signal.Infrastructure.AzureStorage.Tables;
using Signal.Infrastructure.Secrets;
using Signalco.Api.Public;
using Signalco.Infrastructure.Processor;

[assembly: FunctionsStartup(typeof(Startup))]

namespace Signalco.Api.Public;

public class Startup : FunctionsStartup
{
    public override void Configure(IFunctionsHostBuilder builder)
    {
        builder.Services
            .AddCore()
            .AddApi()
            .AddSecrets()
            .AddAzureStorage()
            .AddProcessor()
            .AddSingleton<IFunctionAuthenticator, FunctionAuth0Authenticator>()
            .AddHCaptcha();
    }

    public override void ConfigureAppConfiguration(IFunctionsConfigurationBuilder builder)
    {
    }
}
