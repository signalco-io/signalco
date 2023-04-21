using Microsoft.Extensions.Hosting;
using Signalco.Common.Channel;

new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices(serviceCollection => serviceCollection
        .AddChannel())
    .Build()
    .Run();