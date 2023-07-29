using System;
using Signal.Beacon.Core.Workers;

namespace Signal.Beacon.Channel.iRobot;

internal sealed class iRobotWorkerServiceRegistration : IWorkerServiceRegistration
{
    public string ChannelName => iRobotChannels.RoombaChannel;

    public Type WorkerServiceType => typeof(iRobotWorkerService);
}