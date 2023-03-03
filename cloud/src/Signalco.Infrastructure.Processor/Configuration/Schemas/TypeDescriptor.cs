using System.Text.Json.Serialization;

namespace Signalco.Infrastructure.Processor.Configuration.Schemas;

internal record TypeDescriptor
{
    [JsonPropertyName("type")]
    public string? Type { get; set; }
}