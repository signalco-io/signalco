using Android.App;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Android.Appwidget;
using Android.Content;
using Android.OS;
using Android.Widget;

namespace Signalco.Companion.Maui.Platforms.Android
{
    [Service]
    internal class WidgetService : Service
    {
        public override StartCommandResult OnStartCommand(Intent? intent, StartCommandFlags flags, int startId)
        {
            // Build an update that holds the updated widget contents
            var updateViews = new RemoteViews(this.PackageName, Resource.Layout.action_widget);

            //updateViews.SetTextViewText (Resource.Id.blog_title, entry.Title);
            //updateViews.SetTextViewText (Resource.Id.creator, entry.Creator);

            // When user clicks on widget, launch to Wiktionary definition page
            //if (!string.IsNullOrEmpty (entry.Link)) {
            //    Intent defineIntent = new Intent (Intent.ActionView, Android.Net.Uri.Parse (entry.Link));
			
            //    PendingIntent pendingIntent = PendingIntent.GetActivity (context, 0, defineIntent, 0);
            //    updateViews.SetOnClickPendingIntent (Resource.Id.widget, pendingIntent);
            //}

            // Push update for this widget to the home screen
            ComponentName thisWidget = new ComponentName (this, Java.Lang.Class.FromType (typeof (ActionWidget)).Name);
            AppWidgetManager manager = AppWidgetManager.GetInstance (this);
            manager.UpdateAppWidget (thisWidget, updateViews);

            return base.OnStartCommand(intent, flags, startId);
        }

        public override IBinder? OnBind(Intent? intent) => null;
    }
}
