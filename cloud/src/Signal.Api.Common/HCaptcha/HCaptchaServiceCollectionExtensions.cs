using System;
using Microsoft.Extensions.DependencyInjection;
using Refit;

namespace Signal.Api.Common.HCaptcha;

public static class HCaptchaServiceCollectionExtensions
{
    /// <summary>
    /// Adds the HCaptcha configuration <see cref="section"/> as <see cref="HCaptchaOptions"/>.
    /// Adds <see cref="IHCaptchaApi"/> as Refit Client with given base address in <see cref="HCaptchaOptions"/>.
    /// </summary>
    public static IServiceCollection AddHCaptcha(this IServiceCollection services)
    {
        services
           .AddTransient<IHCaptchaService, HCaptchaService>()
           .AddRefitClient<IHCaptchaApi>()
           .ConfigureHttpClient(c =>
               {
                   c.BaseAddress = new Uri("https://hcaptcha.com");
               }
           );

        return services;
    }
}
