using System.Threading;
using System.Threading.Tasks;
using Refit;

namespace Signal.Api.Common.HCaptcha;

public interface IHCaptchaApi
{
    [Post("/siteverify")]
    Task<HCaptchaVerifyResponseDto?> Verify(
        string secret,
        string response,
        string? remoteIp = null,
        CancellationToken cancellationToken = default);
}
