using System;

namespace Signal.Core.Storage.Blobs;

public class BlobInfo : IBlobInfo
{
    public BlobInfo(string name)
    {
        this.Name = name;
    }

    public string Name { get; }

    public DateTimeOffset? CreatedTimeStamp { get; init; }

    public DateTimeOffset? LastModifiedTimeStamp { get; init; }

    public long? Size { get; init; }
}