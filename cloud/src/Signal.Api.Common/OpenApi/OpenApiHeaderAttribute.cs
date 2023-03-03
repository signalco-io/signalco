using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.OpenApi.Models;

namespace Signal.Api.Common.OpenApi;

public sealed class OpenApiHeaderAttribute : OpenApiParameterAttribute
{
    public OpenApiHeaderAttribute(string name) : base(name)
    {
        this.In = ParameterLocation.Header;
    }
}