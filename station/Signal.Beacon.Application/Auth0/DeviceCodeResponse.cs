using System;

namespace Signal.Beacon.Application.Auth0;

public class DeviceCodeResponse
{
    public string DeviceCode { get; set; }

    public string UrlComplete { get; set; }

    public string UserCode { get; set; }

    public TimeSpan CheckTokenInterval { get; set; }
    public string Url { get; set; }
}