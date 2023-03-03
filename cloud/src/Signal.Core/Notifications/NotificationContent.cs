namespace Signal.Core.Notifications;

public record NotificationContent(string Title, object Content, NotificationContentType Type);