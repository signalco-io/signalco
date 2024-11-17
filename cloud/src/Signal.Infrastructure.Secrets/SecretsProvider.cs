using System;
using System.Threading;
using System.Threading.Tasks;
using Azure.Identity;
using Azure.Security.KeyVault.Secrets;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Signal.Core.Caching;
using Signal.Core.Secrets;

namespace Signal.Infrastructure.Secrets;

public class SecretsProvider(IServiceProvider serviceProvider) : ISecretsProvider
{
    private const string KeyVaultUrlKey = "SignalcoKeyVaultUrl";

    private Lazy<IConfiguration>? configuration;

    private static SecretClient? client;
    private static readonly InMemoryCache<string> SecretsCache = new(TimeSpan.FromHours(1));

    protected SecretClient Client()
    {
        this.configuration ??= serviceProvider.GetService<Lazy<IConfiguration>?>();
        if (this.configuration == null)
            throw new Exception("Configuration unavailable in this context - no access to configuration");

        var vaultUrl = this.configuration.Value[KeyVaultUrlKey];
        if (string.IsNullOrWhiteSpace(vaultUrl))
            throw new Exception("Configuration missing in this context - not access to Vault");
        
        return client ??= new SecretClient(
            new Uri(vaultUrl),
            new DefaultAzureCredential());
    }

    public async Task<string> GetSecretAsync(string key, CancellationToken cancellationToken = default)
    {
        // Check cache
        if (SecretsCache.TryGet(key, out var value))
            return value!;

        // Check configuration (never expires - required redeployment)
        try
        {
            this.configuration ??= serviceProvider.GetService<Lazy<IConfiguration>?>();
            if (this.configuration != null)
                return this.configuration.Value[key] ?? throw new Exception("Not a local secret.");
        }
        catch
        {
            // Try in vault next
        }

        // Instantiate secrets client if not already
        var secret = await this.Client().GetSecretAsync(key, cancellationToken: cancellationToken);
        return SecretsCache.Set(key, secret.Value.Value);
    }
}