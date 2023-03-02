using Microsoft.Extensions.DependencyInjection;
using Signal.Beacon.Application.Signal.Client;
using Signal.Beacon.Application.Signal.Client.Contact;
using Signal.Beacon.Application.Signal.Client.Entity;
using Signal.Beacon.Application.Signal.Client.Station;
using Signal.Beacon.Application.Signal.SignalR;
using Signal.Beacon.Application.Signal.Station;
using Signal.Beacon.Core.Extensions;
using Signal.Beacon.Core.Signal;

namespace Signal.Beacon.Application.Signal;

public static class SignalExtensions
{
    public static IServiceCollection AddSignalApi(this IServiceCollection services)
    {
        return services
            .AddTransient<ISignalcoEntityClient, SignalcoEntityClient>()
            .AddTransient<ISignalcoContactClient, SignalcoContactClient>()
            .AddTransient<ISignalcoStationClient, SignalcoStationClient>()
            .AddTransient<IStationStateService, StationStateService>()
            .AddSingleton<ISignalClient, ISignalcoClientAuthFlow, SignalcoClient>()
            .AddSingleton<ISignalSignalRDevicesHubClient, SignalSignalRDevicesHubClient>()
            .AddSingleton<ISignalSignalRConductsHubClient, SignalSignalRConductsHubClient>();
    }
}