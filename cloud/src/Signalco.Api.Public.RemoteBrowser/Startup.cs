using Microsoft.Azure.Functions.Extensions.DependencyInjection;
using Signalco.Api.Public.RemoteBrowser;

[assembly: FunctionsStartup(typeof(Startup))]

namespace Signalco.Api.Public.RemoteBrowser;

public class Startup : FunctionsStartup
{
    public override void Configure(IFunctionsHostBuilder builder)
    {
    }
}