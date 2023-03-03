using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace Signalco.Infrastructure.Processor.Configuration.Schemas;

[Serializable]
public record ConductEntityContact : Conduct
{
    [Required]
    [JsonPropertyName("contacts")]
    public ICollection<ConductContact>? Contacts { get; set; }
}