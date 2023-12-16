using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using Signal.Core.Exceptions;

namespace Signal.Api.Common.Auth;

public sealed class AuthenticationExpectedHttpException(string message = "") : ExpectedHttpException(HttpStatusCode.Forbidden, message)
{
    public override void ApplyResponseDetails(HttpResponseMessage response) => 
        response.Headers.WwwAuthenticate.Add(new AuthenticationHeaderValue("Bearer", "token_type=\"JWT\""));
}