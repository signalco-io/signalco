using System;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Cryptography;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.Azure.WebJobs;
using Microsoft.Azure.WebJobs.Extensions.Http;
using Microsoft.Azure.WebJobs.Extensions.OpenApi.Core.Attributes;
using Microsoft.IdentityModel.Tokens;
using Octokit;
using Signal.Core.Secrets;
using Signalco.Channel.GitHubApp.Secrets;

namespace Signalco.Channel.GitHubApp.Functions
{
    public class Function1
    {
        private readonly ISecretsProvider secretsProvider;

        public Function1(ISecretsProvider secretsProvider)
        {
            this.secretsProvider = secretsProvider ?? throw new ArgumentNullException(nameof(secretsProvider));
        }

        private static string GenerateAppToken(string privateKey, string appIdentifier)
        {
            // Load key
            var rsaProvider = new RSACryptoServiceProvider();
            rsaProvider.FromXmlString(privateKey);
            var key = new RsaSecurityKey(rsaProvider);

            // Create token using the JwtSecurityTokenHandler
            var handler = new JwtSecurityTokenHandler();
            var token = handler.CreateJwtSecurityToken(appIdentifier, null, null, null, DateTime.Now.AddMinutes(1),
                DateTime.Now, new SigningCredentials(key, SecurityAlgorithms.RsaSha256));

            return token.RawData;
        }

        //[FunctionName("Function1")]
        //[OpenApiOperation(nameof(Function1), "GitHub", Description = "TODO")]
        //[OpenApiResponseWithoutBody(HttpStatusCode.OK)]
        //public async Task Run(
        //    [HttpTrigger(AuthorizationLevel.Function, "get", "post", Route = null)] HttpRequest req,
        //    CancellationToken cancellationToken)
        //{
        //    var client = await GitHubClient(cancellationToken);

        //    // Get a list of installations for the authenticated GitHubApp
        //    var installations = await client.GitHubApps.GetAllInstallationsForCurrent();

        //}

        private async Task<GitHubClient> GitHubClient(CancellationToken cancellationToken)
        {
            var privateKey = await secretsProvider.GetSecretAsync(GitHubAppSecretKeys.PrivateKey, cancellationToken);
            var appId = await secretsProvider.GetSecretAsync(GitHubAppSecretKeys.AppId, cancellationToken);

            // TODO: Cache token until expires
            var token = GenerateAppToken(privateKey, appId);

            var appClient = new GitHubClient(new ProductHeaderValue("signalco-app"))
            {
                Credentials = new Credentials(token, AuthenticationType.Bearer)
            };
            return appClient;
        }
    }
}

