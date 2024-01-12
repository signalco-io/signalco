using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Signal.Api.Common.Auth;
using Signal.Api.Common.Exceptions;
using Signal.Api.Common.OpenApi;
using Signal.Core.Auth;

namespace Signalco.Api.Public.Functions.Auth;

public class PatsRetrieveFunction(
    IFunctionAuthenticator functionAuthenticator,
    IPatService patService)
{
    [Function("Auth-Pats-Retrieve")]
    [OpenApiSecurityAuth0Token]
    [OpenApiOperation<PatsRetrieveFunction>("Auth", Description = "Retrieve all user PATs.")]
    [OpenApiOkJsonResponse<IEnumerable<PatDto>>]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "get", Route = "auth/pats")]
        HttpRequestData req,
        CancellationToken cancellationToken = default) =>
        await req.UserRequest(cancellationToken, functionAuthenticator, async context =>
            (await patService.GetAllAsync(context.User.UserId, cancellationToken))
            .Select(pat => new PatDto(pat.UserId, pat.PatEnd, pat.Alias, pat.Expire)));
}