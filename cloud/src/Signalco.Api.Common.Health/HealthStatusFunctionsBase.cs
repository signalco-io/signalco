using Microsoft.AspNetCore.Mvc;
using Signal.Core.Secrets;

namespace Signalco.Common.Channel;

public abstract class HealthStatusFunctionsBase
{
    private readonly ISecretsManager secretsManager;

    protected HealthStatusFunctionsBase(
        ISecretsManager secretsManager)
    {
        this.secretsManager = secretsManager ?? throw new ArgumentNullException(nameof(secretsManager));
    }

    protected async Task<IActionResult> HandleAsync()
    {
        // Keys we always want to keep hot
        var warmupKeys = new List<string>
        {
            SecretKeys.Auth0.ApiIdentifier,
            SecretKeys.Auth0.ClientSecretStation,
            SecretKeys.Auth0.Domain,
            SecretKeys.ProcessorAccessCode,
            SecretKeys.StorageAccountConnectionString,
        };

        await Task.WhenAll(warmupKeys.Select(k => this.secretsManager.GetSecretAsync(k)));

        return new OkResult();
    }
}