using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Android.App;
using Android.Appwidget;
using Android.Content;
using Android.Widget;

namespace Signalco.Companion.Maui.Platforms.Android
{
    [BroadcastReceiver(Label = "@string/action_widget_name", Exported = true)]
    [IntentFilter(new string[] { "android.appwidget.action.APPWIDGET_UPDATE" })]
    [MetaData ("android.appwidget.provider", Resource = "@xml/action_widget")]
    public class ActionWidget : AppWidgetProvider
    {
        private static string AnnouncementClick = "AnnouncementClickTag";

        public override void OnUpdate(Context context, AppWidgetManager appWidgetManager, int[] appWidgetIds)
        {
            var me = new ComponentName(context, Java.Lang.Class.FromType(typeof(ActionWidget)).Name);
            appWidgetManager.UpdateAppWidget(me, BuildRemoteViews(context, appWidgetIds));
        }

        private RemoteViews BuildRemoteViews(Context context, int[] appWidgetIds)
        {
            var widgetView = new RemoteViews(context.PackageName, Resource.Layout.action_widget);

            SetTextViewText(widgetView);
            RegisterClicks(context, appWidgetIds, widgetView);

            return widgetView;
        }

        private void SetTextViewText(RemoteViews widgetView)
        {
            //widgetView.SetTextViewText(Resource.Id.widgetMedium, "HelloAppWidget");
            //widgetView.SetTextViewText(Resource.Id.widgetSmall,
            //    string.Format("Last update: {0:H:mm:ss}", DateTime.Now));
        }

        private void RegisterClicks(Context context, int[] appWidgetIds, RemoteViews widgetView)
        {
            var intent = new Intent(context, typeof(ActionWidget));
            intent.SetAction(AppWidgetManager.ActionAppwidgetUpdate);
            intent.PutExtra(AppWidgetManager.ExtraAppwidgetIds, appWidgetIds);

            // Register click event for the Background
            //var piBackground = PendingIntent.GetBroadcast(context, 0, intent, PendingIntentFlags.UpdateCurrent);
            //widgetView.SetOnClickPendingIntent(Resource.Id.actionWidgetBg, piBackground);

            // Register click event for the Announcement-icon
            widgetView.SetOnClickPendingIntent(Resource.Id.actionWidgetBackground, GetPendingSelfIntent(context, AnnouncementClick));
        }

        private PendingIntent GetPendingSelfIntent(Context context, string action)
        {
            var intent = new Intent(context, typeof(ActionWidget));
            intent.SetAction(action);
            return PendingIntent.GetBroadcast(context, 0, intent, PendingIntentFlags.Immutable);
        }

        public override void OnReceive(Context context, Intent intent)
        {
            base.OnReceive(context, intent);

            // Check if the click is from the "Announcement" button
            if (AnnouncementClick == intent.Action)
            {
                var pm = context.PackageManager;
                try
                {
                    var packageName = "com.android.settings";
                    var launchIntent = pm.GetLaunchIntentForPackage(packageName);
                    context.StartActivity(launchIntent);
                }
                catch
                {
                    // Something went wrong :)
                }
            }
        }
    }
}
