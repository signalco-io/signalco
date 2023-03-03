using System.Runtime.Serialization;

namespace Signalco.Infrastructure.Processor.Configuration.Schemas;

public enum ProcessType
{
    [EnumMember(Value = @"basic")]
    Basic = 0,
}