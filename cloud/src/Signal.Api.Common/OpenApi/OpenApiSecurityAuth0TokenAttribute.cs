using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Enums;
using Microsoft.OpenApi.Models;

namespace Signal.Api.Common.OpenApi;

public sealed class OpenApiSecurityAuth0TokenAttribute : OpenApiSecurityAttribute
{
    public OpenApiSecurityAuth0TokenAttribute() : base(
        "bearer", SecuritySchemeType.Http)
    {
        this.BearerFormat = "JWT";
        this.In = OpenApiSecurityLocationType.Header;
        this.Scheme = OpenApiSecuritySchemeType.Bearer;
        this.Description = "Auth0 token.";
    }
}