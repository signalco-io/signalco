using System.Threading;
using System.Threading.Tasks;

namespace Signalco.Channel.Slack.Functions.Conducts;

internal interface ISlackAccessTokenProvider
{
    Task<string> GetAccessTokenAsync(string entityId, CancellationToken cancellationToken = default);
}