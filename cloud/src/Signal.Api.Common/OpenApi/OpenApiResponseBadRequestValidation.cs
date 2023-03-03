using System.Net;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;

namespace Signal.Api.Common.OpenApi;

public sealed class OpenApiResponseBadRequestValidation : OpenApiResponseWithoutBodyAttribute
{
    public OpenApiResponseBadRequestValidation() : base(
        HttpStatusCode.BadRequest)
    {
        this.Description = "One or more required property is missing in request.";
    }
}