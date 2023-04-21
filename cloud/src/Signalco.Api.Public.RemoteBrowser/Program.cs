using Microsoft.Extensions.Hosting;
using Signal.Core;
using Signal.Infrastructure.Secrets;

new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices(serviceCollection => serviceCollection
            .AddCore()
            .AddSecrets())
    .Build()
    .Run();
