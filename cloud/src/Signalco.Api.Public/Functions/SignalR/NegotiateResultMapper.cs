using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http.Connections;
using Microsoft.Azure.Functions.Worker.Http;
using Signal.Api.Common.Exceptions;

namespace Signalco.Api.Public.Functions.SignalR;

internal static class NegotiateResultMapper
{
    public static Task<HttpResponseData> NegotiateResultToJsonAsync(HttpRequestData req, NegotiationResponse negotiateResult, CancellationToken cancellationToken = default)
    {
        return req.JsonResponseAsync(new
        {
            negotiateResult.AccessToken,
            negotiateResult.Error,
            negotiateResult.ConnectionId,
            negotiateResult.ConnectionToken,
            negotiateResult.Url,
            negotiateResult.Version,
            AvailableTransports = negotiateResult.AvailableTransports?.Select(i => new
            {
                i.Transport,
                TransferFormats = i.TransferFormats?.ToList()
            }).ToList()
        }, cancellationToken: cancellationToken);
    }
}