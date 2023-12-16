
using System;
using System.Globalization;
using System.Linq;
using System.Net;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker.Http;
using Microsoft.Extensions.Logging;
using Signal.Core.Exceptions;
using Signal.Core.Secrets;
using Signalco.Channel.Slack.Secrets;

namespace Signalco.Channel.Slack.Functions;

internal class SlackRequestHandler(
        ISecretsProvider secrets,
        ILogger<SlackRequestHandler> logger)
    : ISlackRequestHandler
{
    public async Task VerifyFromSlack(HttpRequestData req, CancellationToken cancellationToken = default)
    {
        var signature = req.Headers.GetValues("X-Slack-Signature").First();
        var timeStamp = req.Headers.GetValues("X-Slack-Request-Timestamp").First();
        var signingSecret = await secrets.GetSecretAsync(SlackSecretKeys.SigningSecret, cancellationToken);
        var content = await req.ReadAsStringAsync();

        var signBaseString = $"v0:{timeStamp}:{content}";

        var encoding = new UTF8Encoding();
        using var hmac = new HMACSHA256(encoding.GetBytes(signingSecret));
        var hash = hmac.ComputeHash(encoding.GetBytes(signBaseString));
        var hashString = $"v0={BitConverter.ToString(hash).Replace("-", "").ToLower(CultureInfo.InvariantCulture)}";

        if (hashString != signature)
        {
            logger.LogWarning("Slack signature not matching content");
            throw new ExpectedHttpException(HttpStatusCode.BadRequest, "Signature not valid");
        }
    }
}