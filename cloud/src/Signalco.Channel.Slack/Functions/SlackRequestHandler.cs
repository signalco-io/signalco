using System;
using System.Globalization;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Extensions.Logging;
using Signal.Core.Exceptions;
using Signal.Core.Secrets;
using Signalco.Channel.Slack.Secrets;

namespace Signalco.Channel.Slack.Functions;

internal class SlackRequestHandler : ISlackRequestHandler
{
    private readonly ISecretsProvider secrets;
    private readonly ILogger<SlackRequestHandler> logger;

    public SlackRequestHandler(
        ISecretsProvider secretsProvider,
        ILogger<SlackRequestHandler> logger)
    {
        this.secrets = secretsProvider ?? throw new ArgumentNullException(nameof(secretsProvider));
        this.logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task VerifyFromSlack(HttpRequest req, CancellationToken cancellationToken = default)
    {
        var signature = req.Headers["X-Slack-Signature"];
        var timeStamp = req.Headers["X-Slack-Request-Timestamp"];
        var signingSecret = await this.secrets.GetSecretAsync(SlackSecretKeys.SigningSecret, cancellationToken);
        var content = await req.ReadAsStringAsync();

        var signBaseString = $"v0:{timeStamp}:{content}";

        var encoding = new UTF8Encoding();
        using var hmac = new HMACSHA256(encoding.GetBytes(signingSecret));
        var hash = hmac.ComputeHash(encoding.GetBytes(signBaseString));
        var hashString = $"v0={BitConverter.ToString(hash).Replace("-", "").ToLower(CultureInfo.InvariantCulture)}";

        if (hashString != signature)
        {
            this.logger.LogWarning("Slack signature not matching content");
            throw new ExpectedHttpException(HttpStatusCode.BadRequest, "Signature not valid");
        }
    }
}