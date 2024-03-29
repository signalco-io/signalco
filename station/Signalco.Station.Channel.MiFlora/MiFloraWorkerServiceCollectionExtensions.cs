﻿using Microsoft.Extensions.DependencyInjection;
using Signal.Beacon.Core.Workers;

namespace Signalco.Station.Channel.MiFlora;

public static class MiFloraWorkerServiceCollectionExtensions
{
    public static IServiceCollection AddMiFlora(this IServiceCollection services) =>
        services
            .AddTransient<IWorkerServiceRegistration, MiFloraWorkerServiceRegistration >()
            .AddTransient<MiFloraWorkerService>();
}