using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;

namespace Signal.Api.Common.OpenApi;

public class OpenApiOperationAttribute<T>(params string[] tags) : OpenApiOperationAttribute(typeof(T).Name, tags);