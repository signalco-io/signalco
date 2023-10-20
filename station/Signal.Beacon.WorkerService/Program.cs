using System;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Serilog;
using Serilog.Events;
using Signal.Beacon.Application;
using Signal.Beacon.Application.Signal;
using Signal.Beacon.Application.Signal.Client.Station;
using Signal.Beacon.Application.Signal.Station;
using Signal.Beacon.Channel.iRobot;
using Signal.Beacon.Channel.PhilipsHue;
using Signal.Beacon.Channel.Samsung;
using Signal.Beacon.Channel.Signal;
using Signal.Beacon.Channel.Zigbee2Mqtt;
using Signal.Beacon.Configuration;
using Signal.Beacon.Core.Helpers;
using Signal.Beacon.Voice;
using Signalco.Station.Channel.MiFlora;
using Signalco.Station.Channel.Shelly;

namespace Signal.Beacon;

public static class Program
{
    public static void Main(string[] args)
    {
        CreateHostBuilder(args).Build().Run();
    }

    private static IHostBuilder CreateHostBuilder(string[] args) =>
        Host.CreateDefaultBuilder(args)
            .ConfigureServices(services =>
            {
                services
                    .AddHostedService<Worker>()
                    .AddBeaconConfiguration()
                    .AddBeaconApplication()
                    .AddSignalApi()
                    .AddZigbee2Mqtt()
                    .AddSignal()
                    .AddPhilipsHue()
                    .AddSamsung()
                    .AddMiFlora()
                    .AddIRobot()
                    .AddShelly()
                    .AddVoice();

                services.AddTransient(typeof(Lazy<>), typeof(Lazier<>));
                services.AddSingleton<IWorkerServiceManager, WorkerServiceManager>();
                services.AddTransient<IChannelWorkerServiceResolver, ChannelWorkerServiceResolver>();
            })
            .UseSerilog((context, provider, config) =>
            {
                config
                    .MinimumLevel.Verbose()
                    .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
                    .Enrich.FromLogContext()
                    .WriteTo.File(
                        "Logs/log.log",
                        rollingInterval: RollingInterval.Day,
                        retainedFileTimeLimit: TimeSpan.FromDays(3))
                    .WriteTo.Console()
                    .WriteTo.SignalcoStationLogging(
                        new Lazy<IStationStateService>(provider.GetRequiredService<IStationStateService>),
                new Lazy<ISignalcoStationClient>(provider.GetRequiredService<ISignalcoStationClient>));
            });
}