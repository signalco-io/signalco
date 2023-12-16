using System;

namespace Signal.Core.Storage.Blobs;

public class BlobInfo(string name) : IBlobInfo
{
    public string Name { get; } = name;

    public DateTimeOffset? CreatedTimeStamp { get; init; }

    public DateTimeOffset? LastModifiedTimeStamp { get; init; }

    public long? Size { get; init; }
}