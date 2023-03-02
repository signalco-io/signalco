using Microsoft.Extensions.DependencyInjection;
using Signal.Beacon.Application.Conducts;
using Signal.Beacon.Application.Lifetime;
using Signal.Beacon.Application.Mqtt;
using Signal.Beacon.Application.Network;
using Signal.Beacon.Application.Processing;
using Signal.Beacon.Application.PubSub;
using Signal.Beacon.Application.Shell;
using Signal.Beacon.Application.Signal.Client.Entity;
using Signal.Beacon.Application.Signal.Station;
using Signal.Beacon.Core.Architecture;
using Signal.Beacon.Core.Conditions;
using Signal.Beacon.Core.Conducts;
using Signal.Beacon.Core.Entity;
using Signal.Beacon.Core.Mqtt;
using Signal.Beacon.Core.Network;
using Signal.Beacon.Core.Processes;
using Signal.Beacon.Core.Shell;
using Signal.Beacon.Core.Workers;

namespace Signal.Beacon.Application;

public static class ApplicationServiceCollectionExtensions
{
    public static IServiceCollection AddBeaconApplication(this IServiceCollection services)
    {
        services.AddTransient<IWorkerService, ApplicationWorkerService>();

        services.AddTransient<IConditionEvaluatorService, ConditionEvaluatorService>();
        services.AddSingleton<IConditionEvaluatorValueProvider, ConditionEvaluatorValueProvider>();
        services.AddTransient<ICommandHandler<ConductPublishCommand>, ConductManager>();
        services.AddTransient<IProcessesService, ProcessesService>();
        services.AddSingleton<IEntitiesDao, EntitiesDao>();
        services.AddTransient<IEntityService, EntityService>();
        services.AddSingleton<IProcessesDao, ProcessesDao>();
        services.AddSingleton<IStationStateManager, StationStateManager>();
                
        services.AddTransient<IShellService, LinuxShellService>();
        services.AddTransient<IUpdateService, LinuxUpdateService>();

        // MQTT
        services.AddTransient<IMqttClient, MqttClient>();
        services.AddTransient<IMqttClientFactory, MqttClientFactory>();
        services.AddTransient<IMqttDiscoveryService, MqttDiscoveryService>();

        // PubSub
        services.AddTransient<IPubSubHub<IContactPointer>, PubSubHub<IContactPointer>>();
        services.AddTransient<IPubSubTopicHub<IConduct>, PubSubTopicHub<IConduct>>();

        // Processing
        services.AddSingleton<IProcessor, Processor>();

        // Conducts
        services.AddSingleton<IConductManager, ConductManager>();
        services.AddTransient<IConductSubscriberClient, ConductSubscriberClient>();

        // Network
        services.AddTransient<IHostInfoService, HostInfoService>();
        services.AddTransient<IMacLookupService, MacLookupService>();

        return services;
    }
}