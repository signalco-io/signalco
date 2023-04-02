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
    [FromQuery] int? height) =>
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
        
        await Task.Delay(1000);

        // Scroll through whole page to trigger in-view animations and content
        if (scrollThrough == true)
        {
            var currentHeight = 100;
            while (currentHeight < 10000)
            {
                var pageHeight = await page.EvaluateAsync<float>("document.body.scrollHeight");
                currentHeight += 100;
                await page.Mouse.WheelAsync(0, currentHeight);
                if (currentHeight > pageHeight)
                    break;
            }

            await page.Mouse.WheelAsync(0, 0);
        }

        var img = await page.ScreenshotAsync(new PageScreenshotOptions
        {
            FullPage = fullPage,
            Type = ScreenshotType.Png
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
