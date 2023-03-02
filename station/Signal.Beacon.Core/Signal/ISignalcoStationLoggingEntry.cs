using System;

namespace Signal.Beacon.Core.Signal;

public interface ISignalcoStationLoggingEntry
{
    public DateTimeOffset TimeStamp { get; }

    public int Level { get; }

    public string Message { get; }
}