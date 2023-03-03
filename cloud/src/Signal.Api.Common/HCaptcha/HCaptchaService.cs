using System;
using System.Threading;
using System.Threading.Tasks;
using Signal.Core.Secrets;

namespace Signal.Api.Common.HCaptcha;

public class HCaptchaService : IHCaptchaService
{
    private readonly ISecretsProvider secretsProvider;
    private readonly IHCaptchaApi api;

    public HCaptchaService(
        ISecretsProvider secretsProvider,
        IHCaptchaApi api)
    {
        this.secretsProvider = secretsProvider ?? throw new ArgumentNullException(nameof(secretsProvider));
        this.api = api ?? throw new ArgumentNullException(nameof(api));
    }

    public async Task VerifyAsync(string response, CancellationToken cancellationToken = default)
    {
        var verifyResponse = await this.api.Verify(
            await this.secretsProvider.GetSecretAsync(SecretKeys.HCaptcha.Secret, cancellationToken),
            response,
            null,
            cancellationToken);
        if (verifyResponse?.Success ?? false)
            return;

        // TODO: Handle errors with more specific response
        throw new Exception("Invalid hCaptcha response: " + string.Join(" ", verifyResponse?.ErrorCodesHumanized ?? Array.Empty<string>()));
    }
}
