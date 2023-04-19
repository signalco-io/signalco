using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker.Http;

namespace Signalco.Channel.Slack.Functions;

public interface ISlackRequestHandler
{
    Task VerifyFromSlack(HttpRequestData req, CancellationToken cancellationToken = default);
}