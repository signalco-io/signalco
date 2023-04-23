using System;
using System.Net;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading;
using System.Threading.Tasks;
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
        if (requestContent == null)
            throw new NullReferenceException("No content in request");
        
        return JsonSerializer.Deserialize<T>(
            requestContent,
            new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                Converters = {new TimeSpanConverter()}
            })!;
    }

    public static async Task<HttpResponseData> AnonymousRequest(
        this HttpRequestData req,
        Func<Task> executionBody,
        CancellationToken cancellationToken = default)
    {
        try
        {
            await executionBody();
            return req.CreateResponse(HttpStatusCode.OK);
        }
        catch (ExpectedHttpException ex)
        {
            return ExceptionResponse(req, ex);
        }
    }

    public static HttpResponseData JsonResponse<TPayload>(
        this HttpRequestData req,
        TPayload payload,
        HttpStatusCode statusCode = HttpStatusCode.OK)
    {
        var resp = req.CreateResponse();
        // ReSharper disable once MethodHasAsyncOverloadWithCancellation
        resp.WriteString(Newtonsoft.Json.JsonConvert.SerializeObject(payload));
        resp.Headers.Add("Content-Type", "application/json");
        resp.StatusCode = statusCode;
        return resp;
    }

    public static Task<HttpResponseData> AnonymousRequest<TPayload, TResponse>(
        this HttpRequestData req,
        CancellationToken cancellationToken,
        Func<AnonymousRequestContextWithPayload<TPayload>, Task<TResponse>> executionBody) =>
        AnonymousRequest<TPayload>(req, async context =>
                req.JsonResponse(await executionBody(context)),
            cancellationToken);

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
            return ExceptionResponse(req, ex);
        }
    }

    private static HttpResponseData ExceptionResponse(HttpRequestData req, ExpectedHttpException ex) =>
        req.JsonResponse(
            new ApiErrorDto(ex.Code.ToString(), ex.Message),
            ex.Code);

    public static async Task<HttpResponseData> UserRequest<TResponse>(
        this HttpRequestData req,
        CancellationToken cancellationToken,
        IFunctionAuthenticator authenticator,
        Func<UserRequestContext, Task<TResponse>> executionBody)
    {
        try
        {
            var user = await authenticator.AuthenticateAsync(req, cancellationToken);
            return req.JsonResponse(await executionBody(new UserRequestContext(user, cancellationToken)));
        }
        catch (ExpectedHttpException ex)
        {
            return ExceptionResponse(req, ex);
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
            return req.CreateResponse(HttpStatusCode.OK);
        }, cancellationToken);

    public static Task<HttpResponseData> UserOrSystemRequest<TPayload>(
        this HttpRequestData req,
        CancellationToken cancellationToken,
        IFunctionAuthenticator authenticator,
        Func<UserOrSystemRequestContextWithPayload<TPayload>, Task> executionBody) =>
        UserOrSystemRequest<TPayload>(req, authenticator, async context =>
        {
            await executionBody(context);
            return req.CreateResponse(HttpStatusCode.OK);
        }, cancellationToken);

    public static Task<HttpResponseData> UserRequest<TPayload, TResponse>(
        this HttpRequestData req,
        CancellationToken cancellationToken,
        IFunctionAuthenticator authenticator,
        Func<UserRequestContextWithPayload<TPayload>, Task<TResponse>> executionBody) =>
        UserRequest<TPayload>(req, authenticator, async context => 
            req.JsonResponse(await executionBody(context)), cancellationToken);

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
            return ExceptionResponse(req, ex);
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
            return ExceptionResponse(req, ex);
        }
    }
}