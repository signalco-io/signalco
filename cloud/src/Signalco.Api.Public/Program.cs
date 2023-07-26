using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Signal.Api.Common;
using Signal.Api.Common.Auth;
using Signal.Api.Common.HCaptcha;
using Signal.Core;
using Signal.Infrastructure.AzureStorage.Tables;
using Signal.Infrastructure.Secrets;
using Signalco.Infrastructure.Processor;

await new HostBuilder()
    .ConfigureFunctionsWorkerDefaults()
    .ConfigureServices(serviceCollection => serviceCollection
        .AddCore()
        .AddApi()
        .AddSecrets()
        .AddAzureStorage()
        .AddProcessor()
        .AddSingleton<IFunctionAuthenticator, FunctionAuth0Authenticator>()
        .AddHCaptcha())
    .Build()
    .RunAsync();
