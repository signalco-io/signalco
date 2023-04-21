namespace Signal.Api.Common.OpenApi;

public class OpenApiParameterAttribute : Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes.OpenApiParameterAttribute
{
    public OpenApiParameterAttribute(string name) : base(name)
    {
    }
}