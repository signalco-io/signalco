using Microsoft.Extensions.DependencyInjection;
using Signal.Core.Secrets;

namespace Signal.Infrastructure.Secrets;

public static class SecretsExtensions
{
    public static IServiceCollection AddSecrets(this IServiceCollection services)
    {
        return services
            .AddTransient<ISecretsProvider, SecretsProvider>()
            .AddTransient<ISecretsManager, SecretsManager>();
    }
}