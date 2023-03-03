using Microsoft.Extensions.DependencyInjection;
using Signal.Core.Processor;

namespace Signalco.Infrastructure.Processor;

public static class ProcessorExtensions
{
    public static IServiceCollection AddProcessor(this IServiceCollection services)
    {
        return services
            .AddTransient<IProcessor, Processor>()
            .AddTransient<IProcessManager, ProcessManager>()
            .AddTransient<IProcessService, ProcessService>();
    }
}