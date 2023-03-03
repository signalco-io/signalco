using Signal.Core.Contacts;

namespace Signal.Api.Internal;

public static class KnownEntities
{
    public static class Time
    {
        public const string EntityId = "00000000-0000-0000-ffff-00000000714e";

        public static class Contacts
        {
            public static class Utc
            {
                public const string ChannelName = "time";

                public const string ContactName = "utc";

                public static readonly IContactPointer Pointer = new ContactPointer(
                    EntityId,
                    ChannelName,
                    ContactName);
            }
        }
    }
}