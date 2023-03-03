using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;

namespace Signal.Api.Common.OpenApi;

public class OpenApiOperationAttribute<T> : OpenApiOperationAttribute
{
    public OpenApiOperationAttribute(params string[] tags) : base(typeof(T).Name, tags)
    {
    }
}