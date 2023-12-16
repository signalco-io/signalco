using System;
using System.Net;
using System.Net.Http;

namespace Signal.Core.Exceptions;

public class ExpectedHttpException(HttpStatusCode code, string message = "") : Exception(message)
{
    public HttpStatusCode Code { get; } = code;

    public virtual void ApplyResponseDetails(HttpResponseMessage response)
    {
    }
}