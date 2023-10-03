using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Signal.Core.Storage;

namespace Signal.Core.Users;

public class UserService(IAzureStorageDao dao) : IUserService
{
    public async Task<IUserPublic?> GetPublicAsync(string userId, CancellationToken cancellationToken = default)
    {
        var user = await this.GetAsync(userId, cancellationToken);
        return user == null
            ? null
            : new UserPublic(user.UserId, user.Email, user.FullName);
    }

    public async Task<IEnumerable<IUserPublic>> GetPublicAsync(
        IEnumerable<string> userIds,
        CancellationToken cancellationToken = default) =>
        (await dao.UsersAsync(userIds, cancellationToken))
        .Select(u => new UserPublic(u.UserId, u.Email, u.FullName));

    public async Task<IUser?> GetAsync(string userId, CancellationToken cancellationToken = default)
    {
        var user = await dao.UserAsync(userId, cancellationToken);

        // TODO: Register if new user

        return user;
    }

    public async Task<string?> IdByEmailAsync(string email, CancellationToken cancellationToken = default) => 
        await dao.UserIdByEmailAsync(email, cancellationToken);

    // TODO: Use for retrieving user info
    //private async Task ResolveUserAsync(HttpRequestData request, CancellationToken cancellationToken, string nameIdentifier)
    //{
    //    // Create user if doesn't exist
    //    var existingUser = await this.azureStorageDao.UserAsync(nameIdentifier, cancellationToken);
    //    if (existingUser == null ||
    //        string.IsNullOrWhiteSpace(existingUser.Email))
    //    {
    //        // Retrieve Auth0 user info
    //        using var httpClient = new HttpClient();
    //        var userInfo = await new Auth0Service(httpClient, this.secretsProvider)
    //            .Auth0UserInfo(request.Headers["Authorization"], cancellationToken);

    //        if (string.IsNullOrWhiteSpace(userInfo.Email))
    //            throw new ExpectedHttpException(HttpStatusCode.BadRequest, "User info doesn't contain email.");

    //        // Create user entity
    //        await this.azureStorage.UpsertAsync(
    //            new User(UserSources.GoogleOauth, nameIdentifier, userInfo.Email, userInfo.Name),
    //            cancellationToken);

    //        // TODO: Sent welcome notification
    //    }
    //}
}