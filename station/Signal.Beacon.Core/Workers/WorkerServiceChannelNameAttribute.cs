using System;

namespace Signal.Beacon.Core.Workers;

public class WorkerServiceChannelNameAttribute : Attribute
{
    public string ChannelName { get; set; }

    public WorkerServiceChannelNameAttribute(string channelName)
    {
        this.ChannelName = channelName;
    }
}