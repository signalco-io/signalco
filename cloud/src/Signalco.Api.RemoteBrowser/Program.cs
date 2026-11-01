using Microsoft.AspNetCore.Mvc;
using Microsoft.Playwright;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);
var playwright = await Playwright.CreateAsync();

var app = builder.Build();

app.UseHttpsRedirection();

var defaultSize = new ViewportSize {Width = 1280, Height = 1024};

ViewportSize ResolveViewport(int? width, int? height)
{
    if (width != null && height == null)
        return new ViewportSize {Width = width.Value, Height = (int) (width.Value * .8)};
    if (height != null && width == null)
        return new ViewportSize {Width = (int) (height.Value * 1.25), Height = height.Value};
    if (height != null && width != null)
        return new ViewportSize {Width = width.Value, Height = height.Value};
    return defaultSize;
}

app.MapGet("/api/screenshot", async (
    [FromQuery] string url,
    [FromQuery] bool? scrollThrough,
    [FromQuery] bool? fullPage,
    [FromQuery] int? width,
    [FromQuery] int? height,
    [FromQuery] bool? allowAnimations,
    [FromQuery] int? wait,
    [FromQuery] bool? inspect,
    [FromQuery] bool? mobile,
    CancellationToken cancellationToken) =>
{
    // TODO: Use browser pool with prepared browsers
    var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
    {
        ExecutablePath = Environment.GetEnvironmentVariable("REMOTE_BROWSER_EXECUTABLE_PATH") ?? Path.Combine(
            AppContext.BaseDirectory,
            "runtimes",
            "linux-x64",
            "native",
            "chrome"),
        Headless = true
    });

    var page = await browser.NewPageAsync(new BrowserNewPageOptions
    {
        ViewportSize = ResolveViewport(width.HasValue ? Math.Clamp(width.Value, 1, 2560) : null, height.HasValue ? Math.Clamp(height.Value, 1, 1600) : null),
        IsMobile = mobile == true,
        DeviceScaleFactor = 1,
        ReducedMotion = ReducedMotion.Reduce
    });

    try
    {
        if (!Uri.TryCreate(url, UriKind.Absolute, out var target) ||
            (target.Scheme != "http" && target.Scheme != "https" && target.Scheme != "data"))
            return Results.BadRequest(new { error = "An HTTP(S) or data URL is required." });
        page.SetDefaultTimeout(15000);
        await page.GotoAsync(url, new PageGotoOptions { WaitUntil = WaitUntilState.DOMContentLoaded, Timeout = 25000 });
        await Task.Delay(Math.Clamp(wait ?? 800, 0, 3000), cancellationToken);
        await page.EvaluateAsync("() => Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 2000))])");

        // Visit each viewport so IntersectionObserver and lazy images can load. Bound
        // the work for infinite-scroll pages and report whether the bottom was reached.
        var reachedBottom = false;
        if (scrollThrough == true)
        {
            reachedBottom = await page.EvaluateAsync<bool>("""
                async () => {
                    const start = Date.now();
                    const pause = ms => new Promise(r => setTimeout(r, ms));
                    let bottom = false;
                    for (let step = 0; step < 100 && Date.now() - start < 18000; step++) {
                        window.scrollBy({ top: Math.max(200, innerHeight * .75), behavior: 'instant' });
                        await pause(220);
                        if (scrollY + innerHeight >= document.documentElement.scrollHeight - 2) {
                            await pause(500);
                            if (scrollY + innerHeight >= document.documentElement.scrollHeight - 2) { bottom = true; break; }
                        }
                    }
                    await Promise.race([Promise.all([...document.images].filter(i => !i.complete).map(i => new Promise(r => { i.addEventListener('load', r, { once: true }); i.addEventListener('error', r, { once: true }); }))), pause(2000)]);
                    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
                    await pause(600);
                    return bottom;
                }
                """);
        }

        JsonElement? inspection = null;
        if (inspect == true)
        {
            using var script = new StreamReader(typeof(Program).Assembly.GetManifestResourceStream("Signalco.Api.RemoteBrowser.inspect.js")!);
            inspection = await page.EvaluateAsync<JsonElement>(await script.ReadToEndAsync(cancellationToken));
        }

        var img = await page.ScreenshotAsync(new PageScreenshotOptions
        {
            FullPage = fullPage,
            Type = ScreenshotType.Png,
            Animations = allowAnimations == true ? ScreenshotAnimations.Allow : ScreenshotAnimations.Disabled
        });

        if (inspect == true)
            return Results.Json(new { data = $"data:image/png;base64,{Convert.ToBase64String(img)}", inspection, reachedBottom });
        return Results.File(img, "image/png", "screenshot.png");
    }
    finally
    {
        await page.CloseAsync();
        await browser.CloseAsync();
    }
});

app.Run();
