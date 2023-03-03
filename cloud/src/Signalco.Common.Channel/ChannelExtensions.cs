using Microsoft.Extensions.DependencyInjection;
using Signal.Api.Common;
using Signal.Api.Common.Auth;
using Signal.Core;
using Signal.Infrastructure.AzureStorage.Tables;
using Signal.Infrastructure.Secrets;
using Signalco.Infrastructure.Processor;

namespace Signalco.Common.Channel;

public static class ChannelExtensions
{
    public static IServiceCollection AddChannel(this IServiceCollection collection) =>
        collection
            .AddSecrets()
            .AddCore()
            .AddApi()
            .AddAzureStorage()
            .AddProcessor()
            .AddSingleton<IFunctionAuthenticator, FunctionAuth0Authenticator>();
}