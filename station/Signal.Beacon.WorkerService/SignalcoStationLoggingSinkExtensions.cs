using System;
using Serilog;
using Serilog.Configuration;
using Signal.Beacon.Application.Signal.Client.Station;
using Signal.Beacon.Application.Signal.Station;

namespace Signal.Beacon;

public static class SignalcoStationLoggingSinkExtensions
{
    public static LoggerConfiguration SignalcoStationLogging(
        this LoggerSinkConfiguration loggerConfiguration,
        Lazy<IStationStateService> stationStateService, 
        Lazy<ISignalcoStationClient> clientFactory) =>
        loggerConfiguration.Sink(new SignalcoStationLoggingSink(stationStateService, clientFactory));
}