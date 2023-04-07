using Microsoft.AspNetCore.Mvc;
using Microsoft.Playwright;

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
    [FromQuery] int? wait) =>
{
    // TODO: Use browser pool with prepared browsers
    var browser = await playwright.Chromium.LaunchAsync(new BrowserTypeLaunchOptions
    {
        ExecutablePath = Path.Combine(
            AppContext.BaseDirectory,
            "runtimes",
            "linux-x64",
            "native",
            "chrome"),
        Headless = true
    });

    var page = await browser.NewPageAsync(new BrowserNewPageOptions
    {
        ViewportSize = ResolveViewport(width, height)
    });

    try
    {
        await page.GotoAsync(url);
        
        await Task.Delay(wait ?? 1000);

        // Scroll through whole page to trigger in-view animations and content
        if (scrollThrough == true)
        {
            var lastLeftToScroll = float.MaxValue;
            while (lastLeftToScroll > 0)
            {
                var leftToScroll = await page.EvaluateAsync<float>("document.body.scrollHeight - (window.innerHeight + window.scrollY)");
                if (leftToScroll <= 0 ||
                    Math.Abs(lastLeftToScroll - leftToScroll) < float.Epsilon)
                    break;
                
                lastLeftToScroll = leftToScroll;
                await page.EvaluateAsync("window.scrollBy(0, 100)");
                await Task.Delay(50);
            }

            await page.EvaluateAsync("window.scrollTo({ top: 0, left: 0, behaviour: 'instant' })");
            await Task.Delay(500);
        }

        var img = await page.ScreenshotAsync(new PageScreenshotOptions
        {
            FullPage = fullPage,
            Type = ScreenshotType.Png,
            Animations = allowAnimations == true ? ScreenshotAnimations.Allow : ScreenshotAnimations.Disabled
        });

        return Results.File(img, "image/png", "screenshot.png");
    }
    finally
    {
        await page.CloseAsync();
        await browser.CloseAsync();
    }
});

app.Run();
