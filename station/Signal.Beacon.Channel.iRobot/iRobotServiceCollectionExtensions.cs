using Microsoft.Extensions.DependencyInjection;
using Signal.Beacon.Core.Workers;

namespace Signal.Beacon.Channel.iRobot;

public static class iRobotServiceCollectionExtensions
{
    public static IServiceCollection AddIRobot(this IServiceCollection services)
    {
        return services.AddSingleton<IWorkerService, iRobotWorkerService>();
    }
}