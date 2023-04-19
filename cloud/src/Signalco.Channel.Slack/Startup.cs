using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection;
using Signalco.Channel.Slack;
using Signalco.Channel.Slack.Functions;
using Signalco.Channel.Slack.Functions.Conducts;
using Signalco.Common.Channel;

[assembly: FunctionsStartup(typeof(Startup))]

namespace Signalco.Channel.Slack;

public class Startup : FunctionsStartup
{
    public override void Configure(IFunctionsHostBuilder builder)
    {
        builder.Services
            .AddChannel()
            .AddTransient<ISlackRequestHandler, SlackRequestHandler>()
            .AddTransient<ISlackAccessTokenProvider, SlackAccessTokenProvider>();
    }

    public override void ConfigureAppConfiguration(IFunctionsConfigurationBuilder builder)
    {
    }
}