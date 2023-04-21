using Microsoft.Extensions.Hosting;
using Signal.Api.Common;
using Signal.Core;
using Signal.Infrastructure.AzureStorage.Tables;
using Signal.Infrastructure.Secrets;
using Signalco.Infrastructure.Processor;

new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices(serviceCollection => serviceCollection
        .AddCore()
        .AddApi()
        .AddSecrets()
        .AddAzureStorage()
        .AddProcessor())
    .Build()
    .Run();
