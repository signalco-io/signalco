using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Azure.WebJobs;
using Signal.Core.Sharing;
using Signal.Core.Storage;

namespace Signal.Api.Internal.Functions;

public class MaintenanceDanglingUserEntityAssignmentsFunction
{
    private const string CronEveryDay = "0 0 0 * * *";
    private readonly ISharingService sharingService;
    private readonly IAzureStorageDao dao;

    public MaintenanceDanglingUserEntityAssignmentsFunction(
        ISharingService sharingService,
        IAzureStorageDao dao)
    {
        this.sharingService = sharingService ?? throw new ArgumentNullException(nameof(sharingService));
        this.dao = dao ?? throw new ArgumentNullException(nameof(dao));
    }

    [FunctionName("Maintenance-DanglingUserEntityAssignments")]
    public async Task Run(
        [TimerTrigger(CronEveryDay)] 
        TimerInfo timer,
        CancellationToken cancellationToken = default)
    {
        var users = await this.dao.UsersAllAsync(cancellationToken);
        foreach (var user in users)
        {
            var assignmentsTask = this.dao.UserAssignedAsync(user.UserId, cancellationToken);
            var userEntitiesTask = this.dao.UserEntitiesAsync(user.UserId, null, cancellationToken);

            await Task.WhenAll(assignmentsTask, userEntitiesTask);

            var danglingEntityIds = assignmentsTask.Result.Select(a => a.EntityId).Except(
                userEntitiesTask.Result.Select(e => e.Id));

            await Task.WhenAll(danglingEntityIds.Select(danglingEntityId =>
                this.sharingService.UnAssignFromUserAsync(user.UserId, danglingEntityId, cancellationToken)));
        }
    }
}
