using System;
using System.ComponentModel.DataAnnotations;

namespace Signal.Core.Notifications;

[Serializable]
public class ConductPayloadCloudNotificationCreate
{
    [Required]
    public string? Title { get; set; }

    [Required]
    public string? Content { get; set; }
}