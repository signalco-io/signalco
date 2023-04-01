using System;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.Extensions.Logging;
using Signal.Api.Common.Exceptions;
using Signal.Api.Common.HCaptcha;
using Signal.Api.Common.OpenApi;
using Signal.Core.Exceptions;
using Signal.Core.Newsletter;
using Signal.Core.Storage;

namespace Signal.Api.Public.Functions.Website;

public class NewsletterFunction
{
    private readonly IHCaptchaService hCaptchaService;
    private readonly IAzureStorage storage;
    private readonly ILogger<NewsletterFunction> logger;

    public NewsletterFunction(
        IHCaptchaService hCaptchaService,
        IAzureStorage storage,
        ILogger<NewsletterFunction> logger)
    {
        this.hCaptchaService = hCaptchaService ?? throw new ArgumentNullException(nameof(hCaptchaService));
        this.storage = storage ?? throw new ArgumentNullException(nameof(storage));
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    [FunctionName("Website-Newsletter")]
    [OpenApiOperation(nameof(NewsletterFunction), "Website", Description = "Subscribe to a newsletter.")]
    [OpenApiHeader(HCaptchaHttpRequestExtensions.HCaptchaHeaderKey, Description = "hCaptcha response.")]
    [OpenApiJsonRequestBody<NewsletterSubscribeDto>(Description = "Subscribe with email address.")]
    [OpenApiResponseWithoutBody(HttpStatusCode.OK)]
    [OpenApiResponseBadRequestValidation]
    public async Task<IActionResult> Run(
        [HttpTrigger(AuthorizationLevel.Anonymous, "post", Route = "website/newsletter-subscribe")] HttpRequest req,
        CancellationToken cancellationToken = default) =>
        await req.AnonymousRequest(async () =>
        {
            await req.VerifyCaptchaAsync(this.hCaptchaService, cancellationToken);

            var data = await req.ReadFromJsonAsync<NewsletterSubscribeDto>(cancellationToken);
            if (string.IsNullOrWhiteSpace(data?.Email))
                throw new ExpectedHttpException(HttpStatusCode.BadRequest, "Email not provided.");

            // Persist email
            // Don't report errors so bots can't guess-attack
            try
            {
                await this.storage.UpsertAsync(
                    new NewsletterSubscription(data.Email.ToUpperInvariant()),
                    cancellationToken);
            }
            catch (Exception ex)
            {
                this.logger.LogError(ex, "Failed to subscribe to newsletter with email: {Email}", data.Email);
            }
        });

    [Serializable]
    private class NewsletterSubscribeDto
    {
        [Required]
        public string? Email { get; set; }
    }
}