using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;
using Signal.Core.Exceptions;
using Signal.Core.Secrets;
using Signal.Core.Storage;

namespace Signal.Core.Auth;

public class PatService(
    IAzureStorage storage,
    IAzureStorageDao dao,
    ISecretsProvider secretsProvider) : IPatService
{
    public async Task VerifyAsync(string userId, string pat, CancellationToken cancellationToken = default)
    {
        if (!await dao.PatExistsAsync(userId, PatHashSha256(userId, pat), cancellationToken))
            throw new ExpectedHttpException(HttpStatusCode.Unauthorized);
    }

    public Task<IEnumerable<IPat>> GetAllAsync(string userId, CancellationToken cancellationToken = default) =>
        dao.PatsAsync(userId, cancellationToken);

    public async Task<string> CreateAsync(IPatCreate patCreate, CancellationToken cancellationToken = default)
    {
        var token = await this.JwtTokenAsync(patCreate.UserId, patCreate.Expire, cancellationToken);
        var hash = PatHashSha256(patCreate.UserId, token);
        await storage.PatCreateAsync(
            patCreate.UserId,
            token[^4..], hash,
            patCreate.Alias,
            patCreate.Expire, cancellationToken);
        return token;
    }

    private async Task<string> JwtTokenAsync(string userId, DateTime? expire, CancellationToken cancellationToken)
    {
        var signingToken = await secretsProvider.GetSecretAsync(SecretKeys.PatSigningToken, cancellationToken);
        var signingKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(signingToken));
        var signingCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha512Signature);
        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, userId),
        };
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Issuer = "https://api.signalco.io/",
            Subject = new ClaimsIdentity(claims),
            Expires = expire,
            SigningCredentials = signingCredentials
        };
        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }

    private static string PatHashSha256(string key, string pat)
    {
        var hash = new StringBuilder();
        var crypto = HMACSHA512.HashData(Encoding.UTF8.GetBytes(key), Encoding.UTF8.GetBytes(pat));
        foreach (var theByte in crypto)
            hash.Append(theByte.ToString("x2"));
        return hash.ToString();
    }
}