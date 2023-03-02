using Microsoft.Extensions.DependencyInjection;
using Signal.Beacon.Core.Workers;

namespace Signal.Beacon.Voice;

public static class VoiceServiceCollectionExtensions
{
    public static IServiceCollection AddVoice(this IServiceCollection services)
    {
        return services
            .AddTransient<SpeechResultEvaluator>()
            .AddSingleton<IWorkerService, VoiceService>();
    }
}