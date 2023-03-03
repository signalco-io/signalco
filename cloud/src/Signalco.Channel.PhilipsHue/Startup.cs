using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Signalco.Channel.PhilipsHue;
using Signalco.Common.Channel;

[assembly: FunctionsStartup(typeof(Startup))]

namespace Signalco.Channel.PhilipsHue;

public class Startup : FunctionsStartup
{
    public override void Configure(IFunctionsHostBuilder builder)
    {
        builder.Services
            .AddChannel();
    }

    public override void ConfigureAppConfiguration(IFunctionsConfigurationBuilder builder)
    {
    }
}