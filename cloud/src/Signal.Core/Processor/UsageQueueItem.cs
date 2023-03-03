using System;

namespace Signal.Core.Processor;

[Serializable]
public record UsageQueueItem(string UserId, UsageKind Kind);