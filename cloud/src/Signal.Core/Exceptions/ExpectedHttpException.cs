using System;
using System.Net;
using System.Net.Http;

namespace Signal.Core.Exceptions;

public class ExpectedHttpException : Exception
{
    public ExpectedHttpException(HttpStatusCode code, string message = "")
        : base(message)
    {
        this.Code = code;
    }

    public HttpStatusCode Code { get; }

    public virtual void ApplyResponseDetails(HttpResponseMessage response)
    {
    }
}