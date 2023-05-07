using Microsoft.Extensions.Hosting;
using Signal.Core;
using Signal.Infrastructure.Secrets;

await new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices(serviceCollection => serviceCollection
            .AddCore()
            .AddSecrets())
    .Build()
    .RunAsync();
