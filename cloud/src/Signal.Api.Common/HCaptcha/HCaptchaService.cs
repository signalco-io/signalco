using System;
using System.Threading;
using System.Threading.Tasks;
using Signal.Core.Secrets;

namespace Signal.Api.Common.HCaptcha;

public class HCaptchaService(
    ISecretsProvider secretsProvider,
    IHCaptchaApi api) : IHCaptchaService
{
    public async Task VerifyAsync(string response, CancellationToken cancellationToken = default)
    {
        var verifyResponse = await api.Verify(
            await secretsProvider.GetSecretAsync(SecretKeys.HCaptcha.Secret, cancellationToken),
            response,
            null,
            cancellationToken);
        if (verifyResponse?.Success ?? false)
            return;

        // TODO: Handle errors with more specific response
        throw new Exception("Invalid hCaptcha response: " + string.Join(" ", verifyResponse?.ErrorCodesHumanized ?? Array.Empty<string>()));
    }
}
