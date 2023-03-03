using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;

namespace Signalco.Channel.Slack.Functions;

public interface ISlackRequestHandler
{
    Task VerifyFromSlack(HttpRequest req, CancellationToken cancellationToken = default);
}