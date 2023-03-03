using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;

namespace Signal.Api.Common.HCaptcha;

/// <summary>
/// Response Model to get the verification result
/// </summary>
/// <remarks>https://docs.hcaptcha.com/#server</remarks>
public class HCaptchaVerifyResponseDto
{
    /// <summary>
    /// indicates if verify was successfully or not
    /// </summary>
    /// <remarks>https://docs.hcaptcha.com/#server</remarks>
    [JsonPropertyName("success")]
    public bool Success { get; set; }

    /// <summary>
    /// timestamp of the captcha (ISO format yyyy-MM-dd'T'HH:mm:ssZZ)
    /// </summary>
    /// <remarks>https://docs.hcaptcha.com/#server</remarks>
    [JsonPropertyName("challenge_ts")]
    public DateTimeOffset Timestamp { get; set; }

    /// <summary>
    /// the hostname of the site where the captcha was solved
    /// </summary>
    /// <remarks>https://docs.hcaptcha.com/#server</remarks>
    [JsonPropertyName("hostname")]
    public string? Hostname { get; set; }

    /// <summary>
    /// optional: whether the response will be credited
    /// </summary>
    /// <remarks>https://docs.hcaptcha.com/#server</remarks>
    [JsonPropertyName("credit")]
    public bool Credit { get; set; }

    /// <summary>
    /// string based error code array
    /// </summary>
    /// <remarks>https://docs.hcaptcha.com/#server</remarks>
    [JsonPropertyName("error-codes")]
    public string[]? ErrorCodes { get; set; }

    /// <summary>
    /// string based error code in human readable form.
    /// </summary>
    /// <remarks>https://docs.hcaptcha.com/#server</remarks>
    public IEnumerable<string>? ErrorCodesHumanized
    {
        get
        {
            return this.ErrorCodes?.Select(ecs =>
            {
                switch (ecs)
                {
                    case "missing-input-secret":
                        return "Your secret key is missing.";
                    case "invalid-input-secret":
                        return "Your secret key is invalid or malformed.";
                    case "missing-input-response":
                        return "The response parameter (verification token) is missing.";
                    case "invalid-input-response":
                        return "The response parameter (verification token) is invalid or malformed.";
                    case "bad-request":
                        return "The request is invalid or malformed.";
                    case "invalid-or-already-seen-response":
                        return "The response parameter has already been checked, or has another issue.";
                    case "not-using-dummy-passcode":
                        return "You have used a testing sitekey but have not used its matching secret.";
                    case "sitekey-secret-mismatch":
                        return "The sitekey is not registered with the provided secret.";
                    default:
                        return $"Unknown error: {ecs}";
                }
            });
        }
    }

    /// <summary>
    /// ENTERPRISE feature: a score denoting malicious activity
    /// </summary>
    /// <remarks>https://docs.hcaptcha.com/#server</remarks>
    [JsonPropertyName("score")]
    public double? Score { get; set; }

    /// <summary>
    /// ENTERPRISE feature: reason(s) for score.
    /// </summary>
    /// <remarks>https://docs.hcaptcha.com/#server</remarks>
    [JsonPropertyName("score_reason")]
    public string[]? ScoreReason { get; set; }
}