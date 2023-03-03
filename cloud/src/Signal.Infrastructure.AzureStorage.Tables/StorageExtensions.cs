using Microsoft.Extensions.DependencyInjection;
using Signal.Core.Storage;

namespace Signal.Infrastructure.AzureStorage.Tables;

public static class StorageExtensions
{
    public static IServiceCollection AddAzureStorage(this IServiceCollection services)
    {
        return services
            .AddTransient<IAzureStorage, AzureStorage>()
            .AddTransient<IAzureStorageDao, AzureStorageDao>()
            .AddSingleton<IAzureStorageClientFactory, AzureStorageClientFactory>();
    }
}