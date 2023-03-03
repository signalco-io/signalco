using System.Text.Json;

namespace Signal.Core.Contacts;

public static class ContactExtensions
{
    public static T? ReadMetadata<T>(this IContact contact)
        where T : class, IContactMetadataBase =>
        string.IsNullOrWhiteSpace(contact.Metadata) 
            ? default 
            : JsonSerializer.Deserialize<T>(contact.Metadata);
}