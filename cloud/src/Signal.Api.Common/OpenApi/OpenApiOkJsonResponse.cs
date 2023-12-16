using System.Net;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;

namespace Signal.Api.Common.OpenApi;

public class OpenApiOkJsonResponseAttribute<T>() : OpenApiResponseWithBodyAttribute(HttpStatusCode.OK, "application/json", typeof(T));