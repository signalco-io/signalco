using System;

namespace Signal.Core.Contacts;

[Serializable]
public class ContactMetadataV1 : IContactMetadataBase
{
    public int Version => 1;

    public bool ProcessSameValue { get; set; }
}