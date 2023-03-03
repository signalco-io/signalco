using Microsoft.Maui.Hosting;
using Microsoft.Maui.Controls.Hosting;

namespace Signalco.Companion.Maui
{
	public static class MauiProgram
	{
		public static MauiApp CreateMauiApp()
		{
			var builder = MauiApp.CreateBuilder();
			builder
				.UseMauiApp<App>()
				.ConfigureFonts(fonts =>
				{
					fonts.AddFont("OpenSans-Regular.ttf", "OpenSansRegular");
                    fonts.AddFont("MaterialIcons-Regular.ttf", "MaterialIconsRegular");
				});

			return builder.Build();
		}
	}
}