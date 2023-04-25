using System.Net;

namespace Signal.Api.Common.OpenApi;


public class OpenApiResponseWithoutBodyAttribute : Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes.OpenApiResponseWithoutBodyAttribute
{
    public OpenApiResponseWithoutBodyAttribute(HttpStatusCode statusCode = HttpStatusCode.OK) : base(statusCode)
    {
    }
}