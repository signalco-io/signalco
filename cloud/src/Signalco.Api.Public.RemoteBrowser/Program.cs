using Microsoft.Extensions.Hosting;
using Signal.Core;

var host = new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices(services =>
    {
        services.AddCore();
    })
    .Build();
host.Run();