using System.Runtime.Serialization;

namespace Signalco.Infrastructure.Processor.Configuration.Schemas;

public enum CompareOperation
{
    [EnumMember(Value = @"equal")]
    Equal = 0,


    [EnumMember(Value = @"notEqual")]
    NotEqual = 1,

    [EnumMember(Value = @"lessThan")]
    LessThan = 2,

    [EnumMember(Value = @"greaterThan")]
    GreaterThan = 3,

    [EnumMember(Value = @"lessThanOrEqual")]
    LessThanOrEqual = 4,

    [EnumMember(Value = @"greaterThanOrEqual")]
    GreaterThanOrEqual = 5
}