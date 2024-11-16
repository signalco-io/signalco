using System.Text.Json.Serialization;

namespace Signalco.Common.Channel;

public abstract class ConductFunctionsBase
{
    [Serializable]
    protected class ConductPayloadDto
    {
        [JsonPropertyName("valueSerialized")]
        public string? ValueSerialized { get; set; }
    }
}
