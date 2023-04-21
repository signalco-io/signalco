using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.SignalR.Management;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Signal.Core.Secrets;

namespace Signal.Api.Common.SignalR;

internal class SignalRHubContextProvider : ISignalRHubContextProvider
{
    private readonly IConfiguration configuration;
    private readonly ILoggerFactory loggerFactory;

    public SignalRHubContextProvider(
        IConfiguration configuration,
        ILoggerFactory loggerFactory)
    {
        this.configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
        this.loggerFactory = loggerFactory ?? throw new ArgumentNullException(nameof(loggerFactory));
    }

    private ServiceManager ServiceManager()
    {
        // TODO: Cache
        return new ServiceManagerBuilder()
            .WithOptions(option =>
            {
                option.ConnectionString = configuration[SecretKeys.SignalRConnectionString];
            })
            .WithLoggerFactory(this.loggerFactory)
            .BuildServiceManager();
    }
    
    public async Task<ServiceHubContext> GetAsync(string hubName, CancellationToken cancellationToken = default)
    {
        // TODO: Cache by hub name
        return await this.ServiceManager().CreateHubContextAsync(hubName, cancellationToken);
    } 
}