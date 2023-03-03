using System.Text.Json.Serialization;

namespace Signal.Core.Usage;

public record Usage(
    [property: JsonPropertyName("other")]
    int Other,
    [property: JsonPropertyName("contactSet")]
    int ContactSet,
    [property: JsonPropertyName("conduct")]
    int Conduct,
    [property: JsonPropertyName("process")]
    int Process);