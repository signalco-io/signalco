using Microsoft.AspNetCore.Mvc;
using Microsoft.Playwright;

var builder = WebApplication.CreateBuilder(args);
var playwright = await Playwright.CreateAsync();

var app = builder.Build();

app.UseHttpsRedirection();

app.MapGet("/api/screenshot", async (
    [FromQuery] string url,
    [FromQuery] bool? scrollThrough) =>
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

    var page = await browser.NewPageAsync();

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
            FullPage = true,
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