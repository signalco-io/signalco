using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Signal.Core.Notifications;

namespace Signal.Api.Common.SignalR;

internal class SignalRService : ISignalRService
{
    private readonly ISignalRHubContextProvider signalRHubContextProvider;
    private static DateTime? tooManyRequests;
    private static TimeSpan tooManyRequestsBackOff = TimeSpan.FromMinutes(1);

    public SignalRService(
        ISignalRHubContextProvider signalRHubContextProvider)
    {
        this.signalRHubContextProvider = signalRHubContextProvider ?? throw new ArgumentNullException(nameof(signalRHubContextProvider));
    }
    
    public async Task SendToUsersAsync(
        IReadOnlyList<string> userIds, 
        string hubName, 
        string target, 
        object[] arguments,
        CancellationToken cancellationToken = default)
    {
        if (tooManyRequests.HasValue &&
            DateTime.UtcNow - tooManyRequests < tooManyRequestsBackOff)
            return;

        try
        {
            var hub = await this.signalRHubContextProvider.GetAsync(hubName, cancellationToken);
            await hub.Clients.Users(userIds).SendCoreAsync(
                target,
                arguments,
                cancellationToken);

            tooManyRequestsBackOff = TimeSpan.FromMinutes(1);
            tooManyRequests = null;
        }
        catch (Exception)
        {
            tooManyRequests = DateTime.UtcNow;
            tooManyRequestsBackOff = TimeSpan.FromMinutes(tooManyRequestsBackOff.TotalMinutes * 2);
        }
    }
}