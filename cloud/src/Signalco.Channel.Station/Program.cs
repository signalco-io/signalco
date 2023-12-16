using Microsoft.Extensions.Hosting;
using Signalco.Common.Channel;

await new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices(serviceCollection => serviceCollection
        .AddChannel())
    .Build()
    .RunAsync();