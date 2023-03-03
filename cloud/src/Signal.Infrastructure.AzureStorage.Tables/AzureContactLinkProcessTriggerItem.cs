using Signal.Core.Contacts;
using Signal.Core.Processor;

namespace Signal.Infrastructure.AzureStorage.Tables;

internal class AzureContactLinkProcessTriggerItem : AzureTableEntityBase
{
    public AzureContactLinkProcessTriggerItem() : base(string.Empty, string.Empty)
    {
    }

    protected AzureContactLinkProcessTriggerItem(string partitionKey, string rowKey) : base(partitionKey, rowKey)
    {
    }

    public static AzureContactLinkProcessTriggerItem From(IContactLinkProcessTriggerItem item) =>
        new($"triggerProcess-{item.ContactPointer.ToString()}", item.ProcessEntityId);

    public static IContactLinkProcessTriggerItem To(AzureContactLinkProcessTriggerItem item) =>
        new ContactLinkProcessTriggerItem(
            (ContactPointer)item.PartitionKey[(item.PartitionKey.IndexOf('-') + 1)..],
            item.RowKey);
}