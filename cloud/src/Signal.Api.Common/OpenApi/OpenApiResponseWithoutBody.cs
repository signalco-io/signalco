using System.Net;

namespace Signal.Api.Common.OpenApi;


public class OpenApiResponseWithoutBodyAttribute(HttpStatusCode statusCode = HttpStatusCode.OK) 
    : Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes.OpenApiResponseWithoutBodyAttribute(statusCode);