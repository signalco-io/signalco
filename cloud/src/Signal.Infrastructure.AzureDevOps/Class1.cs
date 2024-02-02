using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.VisualStudio.Services.Common;
using Microsoft.VisualStudio.Services.WebApi;

namespace Signal.Infrastructure.AzureDevOps;

public class DevOpsProject
{
    public Guid Id { get; set; }

    public string? Name { get; set; }
}

public class DevOpsOrganizationService
{
    public static async Task<IEnumerable<DevOpsProject>> GetProjectsAsync()
    {
        //var projects = await GetContext(AzureDevOpsOrganizationUrl, DfnoiseDevOpsPatFull).Connection.GetClient<ProjectHttpClient>().GetProjects();
        //return projects.Select(p => new DevOpsProject { Id = p.Id, Name = p.Name });
        throw new NotImplementedException();
    }

    public static async Task CreateSubscriptionAsync()
    {
        throw new NotImplementedException();
        // var context = GetContext(azureDevOpsOrganizationUrl, dfnoiseDevOpsPatFull);
        // var project = await context.Connection
        //     .GetClient<ProjectHttpClient>().GetProject("5efbd867-e379-42aa-b5f4-801b5141f4af");
        // var hooks = context.Connection.GetClient<ServiceHooksManagementHttpClient>();
        // await hooks.CreateSubscriptionAsync(new Subscription()
        // {
        //     PublisherId = "tfs",
        //     EventType = "build.complete",
        //     ConsumerId = "azureStorageQueue",
        //     ConsumerActionId = "enqueue",
        //     ActionDescription = "Account signalstorageaccount, Queue azuredevops"
        // });
    }

    private static DevOpsContext GetContext(string organizationUrl, string pat)
    {
        var credentials = new VssBasicCredential("Signal", pat);
        var connection = new VssConnection(new Uri(organizationUrl), credentials);
        return new DevOpsContext(connection);
    }
}

public class DataDevOpsOrganization
{
    public string? OrganizationUrl { get; set; }

    public string? Pat { get; set; }

    public DateTime CreatedTimeStamp { get; set; }
}

public class DevOpsContext(VssConnection connection)
{
    public string OrganizationUrl => this.Connection.Uri.ToString();

    public VssConnection Connection { get; } = connection;
}