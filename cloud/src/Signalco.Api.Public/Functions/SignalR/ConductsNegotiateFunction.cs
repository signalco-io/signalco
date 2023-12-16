using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Azure.SignalR.Management;
using Signal.Api.Common.Auth;
using Signal.Api.Common.Exceptions;
using Signal.Api.Common.OpenApi;
using Signal.Api.Common.SignalR;

namespace Signalco.Api.Public.Functions.SignalR;

public class ConductsNegotiateFunction(
    IFunctionAuthenticator authenticator,
    ISignalRHubContextProvider contextProvider)
{
    [Function("SignalR-Conducts-Negotiate")]
    [OpenApiSecurityAuth0Token]
    [OpenApiOperation<ConductsNegotiateFunction>("SignalR",
        Description = "Negotiates SignalR connection for conducts hub.")]
    [OpenApiOkJsonResponse(typeof(SignalRConnectionInfo), Description = "SignalR connection info.")]
    public async Task<HttpResponseData> Negotiate(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "signalr/conducts/negotiate")]
        HttpRequestData req,
        CancellationToken cancellationToken = default)
    {
        return await req.UserRequest(cancellationToken, authenticator, async context =>
        {
            var hub = await contextProvider.GetAsync("conducts", cancellationToken);
            var negotiateResult = await hub.NegotiateAsync(new NegotiationOptions
            {
                UserId = context.User.UserId,
            }, cancellationToken);
            return new
            {
                url = negotiateResult.Url,
                accessToken = negotiateResult.AccessToken,
            };
        });
    }
}