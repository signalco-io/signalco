using System;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Signal.Api.Common.Auth;
using Signal.Api.Common.Exceptions;
using Signal.Api.Common.OpenApi;

namespace Signalco.Api.Public.Functions.SignalR;

public class ConductsNegotiateFunction
{
    private readonly IFunctionAuthenticator authenticator;

    public ConductsNegotiateFunction(
        IFunctionAuthenticator authenticator)
    {
        this.authenticator = authenticator ?? throw new ArgumentNullException(nameof(authenticator));
    }

    [Function("SignalR-Conducts-Negotiate")]
    [OpenApiSecurityAuth0Token]
    [OpenApiOperation<ConductsNegotiateFunction>("SignalR", 
        Description = "Negotiates SignalR connection for conducts hub.")]
    [OpenApiOkJsonResponse(typeof(SignalRConnectionInfo), Description = "SignalR connection info.")]
    public async Task<HttpResponseData> Negotiate(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "signalr/conducts/negotiate")]
        HttpRequestData req,
        IBinder binder, CancellationToken cancellationToken = default) =>
        // This style is an example of imperative attribute binding; the mechanism for declarative binding described below does not work
        // UserId = "{headers.x-my-custom-header}" https://docs.microsoft.com/en-us/azure/azure-signalr/signalr-concept-serverless-development-config
        // Source: https://charliedigital.com/2019/09/02/azure-functions-signalr-and-authorization/
        await req.UserRequest(cancellationToken, this.authenticator, async context =>
            await binder.BindAsync<SignalRConnectionInfo>(new SignalRConnectionInfoAttribute
            {
                HubName = "conducts",
                UserId = context.User.UserId
            }, cancellationToken));
}