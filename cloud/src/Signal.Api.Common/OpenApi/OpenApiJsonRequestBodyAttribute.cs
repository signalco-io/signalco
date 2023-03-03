using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;

namespace Signal.Api.Common.OpenApi;

public class OpenApiJsonRequestBodyAttribute<T> : OpenApiRequestBodyAttribute
{
    public OpenApiJsonRequestBodyAttribute() : base("application/json", typeof(T))
    {
    }
}