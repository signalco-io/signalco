using System.Threading;
using System.Threading.Tasks;

namespace Signal.Api.Common.HCaptcha;

public interface IHCaptchaService
{
    Task VerifyAsync(string response, CancellationToken cancellationToken = default);
}
