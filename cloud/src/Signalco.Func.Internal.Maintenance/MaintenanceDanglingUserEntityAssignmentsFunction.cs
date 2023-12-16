using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.Functions.Worker;
using Signal.Core.Sharing;
using Signal.Core.Storage;

namespace Signalco.Func.Internal.Maintenance;

public class MaintenanceDanglingUserEntityAssignmentsFunction(
    ISharingService sharingService,
    IAzureStorageDao dao)
{
    private const string CronEveryDay = "0 0 0 * * *";

    [Function("Maintenance-DanglingUserEntityAssignments")]
    public async Task Run(
        [TimerTrigger(CronEveryDay)] 
        TimerInfo timer,
        CancellationToken cancellationToken = default)
    {
        var users = await dao.UsersAllAsync(cancellationToken);
        foreach (var user in users)
        {
            var assignmentsTask = dao.UserAssignedAsync(user.UserId, cancellationToken);
            var userEntitiesTask = dao.UserEntitiesAsync(user.UserId, null, cancellationToken);

            await Task.WhenAll(assignmentsTask, userEntitiesTask);

            var danglingEntityIds = assignmentsTask.Result.Select(a => a.EntityId).Except(
                userEntitiesTask.Result.Select(e => e.Id));

            await Task.WhenAll(danglingEntityIds.Select(danglingEntityId =>
                sharingService.UnAssignFromUserAsync(user.UserId, danglingEntityId, cancellationToken)));
        }
    }
}
