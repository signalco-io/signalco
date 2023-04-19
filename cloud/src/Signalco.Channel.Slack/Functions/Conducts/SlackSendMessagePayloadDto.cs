using System;
using System.Text.Json.Serialization;

namespace Signalco.Channel.Slack.Functions.Conducts;

[Serializable]
internal class SlackSendMessagePayloadDto
{
    [JsonPropertyName("text")]
    public string? Text { get; set; }

    [JsonPropertyName("channelId")]
    public string? ChannelId { get; set; }
}