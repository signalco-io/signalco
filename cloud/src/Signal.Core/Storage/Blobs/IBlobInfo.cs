using System;

namespace Signal.Core.Storage.Blobs;

public interface IBlobInfo
{
    string Name { get; }

    DateTimeOffset? CreatedTimeStamp { get; }

    DateTimeOffset? LastModifiedTimeStamp { get; }

    long? Size { get; }
}