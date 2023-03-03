using System.Net.Http;
using Signal.Core.Exceptions;

namespace Signal.Api.Common.Exceptions;

public static class ExpectedHttpExceptionExtensions
{
    public static HttpResponseMessage CreateErrorResponseMessage(this ExpectedHttpException ex, HttpRequestMessage request)
    {
        var result = request.CreateErrorResponse(ex.Code, ex.Message);
        ex.ApplyResponseDetails(result);
        return result;
    }
}