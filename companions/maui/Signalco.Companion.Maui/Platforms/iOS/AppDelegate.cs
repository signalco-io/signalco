using Foundation;
using Microsoft.Maui;
using Microsoft.Maui.Hosting;

namespace Signalco.Companion.Maui
{
	[Register("AppDelegate")]
	public class AppDelegate : MauiUIApplicationDelegate
	{
		protected override MauiApp CreateMauiApp() => MauiProgram.CreateMauiApp();
	}
}