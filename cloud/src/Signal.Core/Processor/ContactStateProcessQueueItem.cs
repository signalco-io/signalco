using System;
using Signal.Core.Contacts;

namespace Signal.Core.Processor;

[Serializable]
public record ContactStateProcessQueueItem(string ProcessEntityId);