using System;
using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Functions.Worker.Http;
using Signal.Api.Common.Auth;
using Signal.Core.Auth;
using Signal.Core.Exceptions;

namespace Signal.Api.Common.Exceptions;

public static class HttpRequestExtensions
{
    private class TimeSpanConverter : JsonConverter<TimeSpan>
    {
        public override TimeSpan Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            var data = reader.GetString();
            return data != null ? TimeSpan.Parse(data) : default;
        }

        public override void Write(Utf8JsonWriter writer, TimeSpan value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToString());
        }
    }

    public static async Task<T> ReadAsJsonAsync<T>(this HttpRequestData req)
    {
        var requestContent = await req.ReadAsStringAsync();
        return JsonSerializer.Deserialize<T>(
            requestContent,
            new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                Converters = {new TimeSpanConverter()}
            })!;
    }

    public static async Task<HttpResponseData> AnonymousRequest(
        this HttpRequest _,
        Func<Task> executionBody)
    {
        try
        {
            await executionBody();
            return new OkResult();
        }
        catch (ExpectedHttpException ex)
        {
            return new ObjectResult(new ApiErrorDto(ex.Code.ToString(), ex.Message))
            {
                StatusCode = (int)ex.Code
            };
        }
    }

    public static Task<HttpResponseData> AnonymousRequest<TPayload, TResponse>(
        this HttpRequestData req,
        CancellationToken cancellationToken,
        Func<AnonymousRequestContextWithPayload<TPayload>, Task<TResponse>> executionBody) =>
        AnonymousRequest<TPayload>(req, async context =>
            new OkObjectResult(await executionBody(context)), cancellationToken);

    private static async Task<HttpResponseData> AnonymousRequest<TPayload>(
        this HttpRequestData req,
        Func<AnonymousRequestContextWithPayload<TPayload>, Task<HttpResponseData>> executionBody,
        CancellationToken cancellationToken = default)
    {
        try
        {
            // Deserialize and validate
            var payload = await req.ReadAsJsonAsync<TPayload>();
            if (payload == null)
                throw new ExpectedHttpException(HttpStatusCode.BadRequest, "Failed to read request data.");

            return await executionBody(new AnonymousRequestContextWithPayload<TPayload>(payload, cancellationToken));
        }
        catch (ExpectedHttpException ex)
        {
            return new ObjectResult(new ApiErrorDto(ex.Code.ToString(), ex.Message))
            {
                StatusCode = (int)ex.Code
            };
        }
    }

    public static async Task<HttpResponseData> UserRequest<TResponse>(
        this HttpRequestData req,
        CancellationToken cancellationToken,
        IFunctionAuthenticator authenticator,
        Func<UserRequestContext, Task<TResponse>> executionBody)
    {
        try
        {
            var user = await authenticator.AuthenticateAsync(req, cancellationToken);
            return new OkObjectResult(await executionBody(new UserRequestContext(user, cancellationToken)));
        }
        catch (ExpectedHttpException ex)
        {
            return new ObjectResult(new ApiErrorDto(ex.Code.ToString(), ex.Message))
            {
                StatusCode = (int)ex.Code
            };
        }
    }

    public static Task<HttpResponseData> UserRequest<TPayload>(
        this HttpRequestData req,
        CancellationToken cancellationToken,
        IFunctionAuthenticator authenticator,
        Func<UserRequestContextWithPayload<TPayload>, Task> executionBody) =>
        UserRequest<TPayload>(req, authenticator, async context =>
        {
            await executionBody(context);
            return new OkResult();
        }, cancellationToken);

    public static Task<HttpResponseData> UserOrSystemRequest<TPayload>(
        this HttpRequestData req,
        CancellationToken cancellationToken,
        IFunctionAuthenticator authenticator,
        Func<UserOrSystemRequestContextWithPayload<TPayload>, Task> executionBody) =>
        UserOrSystemRequest<TPayload>(req, authenticator, async context =>
        {
            await executionBody(context);
            return new OkResult();
        }, cancellationToken);

    public static Task<HttpResponseData> UserRequest<TPayload, TResponse>(
        this HttpRequestData req,
        CancellationToken cancellationToken,
        IFunctionAuthenticator authenticator,
        Func<UserRequestContextWithPayload<TPayload>, Task<TResponse>> executionBody) =>
        UserRequest<TPayload>(req, authenticator, async context => 
            new OkObjectResult(await executionBody(context)), cancellationToken);

    private static async Task<HttpResponseData> UserOrSystemRequest<TPayload>(
        this HttpRequestData req,
        IFunctionAuthenticator authenticator,
        Func<UserOrSystemRequestContextWithPayload<TPayload>, Task<HttpResponseData>> executionBody,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var isSystem = req.Headers.Contains(KnownHeaders.ProcessorAccessCode);
            IUserAuth? user = null;
            if (isSystem)
                await authenticator.AuthenticateSystemAsync(req, cancellationToken);
            else user = await authenticator.AuthenticateAsync(req, cancellationToken);

            // Deserialize and validate
            var payload = await req.ReadAsJsonAsync<TPayload>();
            if (payload == null)
                throw new ExpectedHttpException(HttpStatusCode.BadRequest, "Failed to read request data.");

            return await executionBody(
                isSystem
                    ? new UserOrSystemRequestContextWithPayload<TPayload>(true, payload, cancellationToken)
                    : new UserOrSystemRequestContextWithPayload<TPayload>(user, payload, cancellationToken));
        }
        catch (ExpectedHttpException ex)
        {
            return new ObjectResult(new ApiErrorDto(ex.Code.ToString(), ex.Message))
            {
                StatusCode = (int)ex.Code
            };
        }
    }

    private static async Task<HttpResponseData> UserRequest<TPayload>(
        this HttpRequestData req,
        IFunctionAuthenticator authenticator,
        Func<UserRequestContextWithPayload<TPayload>, Task<HttpResponseData>> executionBody,
        CancellationToken cancellationToken = default)
    {
        try
        {
            var user = await authenticator.AuthenticateAsync(req, cancellationToken);

            // Deserialize and validate
            var payload = await req.ReadAsJsonAsync<TPayload>();
            if (payload == null)
                throw new ExpectedHttpException(HttpStatusCode.BadRequest, "Failed to read request data.");

            return await executionBody(new UserRequestContextWithPayload<TPayload>(user, payload, cancellationToken));
        }
        catch (ExpectedHttpException ex)
        {
            return new ObjectResult(new ApiErrorDto(ex.Code.ToString(), ex.Message))
            {
                StatusCode = (int)ex.Code
            };
        }
    }
}