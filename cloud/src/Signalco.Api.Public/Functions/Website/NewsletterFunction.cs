using System;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Signal.Api.Common.Exceptions;
using Signal.Api.Common.HCaptcha;
using Signal.Api.Common.OpenApi;
using Signal.Core.Exceptions;
using Signal.Core.Newsletter;
using Signal.Core.Storage;

namespace Signalco.Api.Public.Functions.Website;

public class NewsletterFunction(
    IHCaptchaService hCaptchaService,
    IAzureStorage storage,
    ILogger<NewsletterFunction> logger)
{
    [Function("Website-Newsletter")]
    [OpenApiOperation<NewsletterFunction>("Website", Description = "Subscribe to a newsletter.")]
    [OpenApiHeader(HCaptchaHttpRequestExtensions.HCaptchaHeaderKey, Description = "hCaptcha response.")]
    [OpenApiJsonRequestBody<NewsletterSubscribeDto>(Description = "Subscribe with email address.")]
    [OpenApiResponseWithoutBody]
    [OpenApiResponseBadRequestValidation]
    public async Task<HttpResponseData> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "website/newsletter-subscribe")] HttpRequestData req,
        CancellationToken cancellationToken = default) =>
        await req.AnonymousRequest(async () =>
        {
            await req.VerifyCaptchaAsync(hCaptchaService, cancellationToken);

            var data = await req.ReadFromJsonAsync<NewsletterSubscribeDto>(cancellationToken);
            if (string.IsNullOrWhiteSpace(data?.Email))
                throw new ExpectedHttpException(HttpStatusCode.BadRequest, "Email not provided.");

            // Persist email
            // Don't report errors so bots can't guess-attack
            try
            {
                await storage.UpsertAsync(
                    new NewsletterSubscription(data.Email.ToUpperInvariant()),
                    cancellationToken);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to subscribe to newsletter with email: {Email}", data.Email);
            }
        }, cancellationToken: cancellationToken);

    [Serializable]
    private class NewsletterSubscribeDto
    {
        [Required]
        public string? Email { get; set; }
    }
}