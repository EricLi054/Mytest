using Azure.Core;
using Azure.Identity;
using HotChocolate.Execution;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Shared.Constants;
using Shared.Integration.Tests.Util;
using System.Security.Claims;
using Newtonsoft.Json;
using System.IdentityModel.Tokens.Jwt;
using Newtonsoft.Json.Linq;

namespace Shared.Integration.Tests.Services;

public static class TestServices
{
    public static IServiceProvider Services { get; private set; }
    public static RequestExecutorProxy Executor { get; private set; }

    private static IConfiguration _configuration;

    public static void Initialize(IServiceProvider serviceProvider)
    {
        _configuration = serviceProvider.GetRequiredService<IConfiguration>();

        var requestExecutorResolver = serviceProvider.GetRequiredService<IRequestExecutorResolver>();
        var requestExecutorProxy = new RequestExecutorProxy(requestExecutorResolver, Schema.DefaultName);

        var serviceCollection = new ServiceCollection();
        serviceCollection.AddSingleton(requestExecutorProxy);

        var newProvider = serviceCollection.BuildServiceProvider();

        Services = new CompositeServiceProvider(serviceProvider,
            newProvider);

        Executor = Services.GetRequiredService<RequestExecutorProxy>();
    }

    public static async Task<string> ExecuteRequestAsync(
        Action<OperationRequestBuilder> configureRequest,
        CancellationToken cancellationToken = default)
    {
        await using var scope = Services.CreateAsyncScope();

        var requestBuilder = new OperationRequestBuilder();
        requestBuilder.SetServices(scope.ServiceProvider);
        configureRequest(requestBuilder);
        var request = requestBuilder.Build();

        await using var result = await Executor.ExecuteAsync(request, cancellationToken);
        return result.ToJson();
    }

    public static async Task<T> ExecuteGraphQlWithRetryAsync<T>(Func<Task<string>> executeRequestAsync,
        Func<JObject, T> extractResult)
    {
        const int maxRetries = 3;
        const int delayMs = 2000;

        for (int attempt = 1; attempt <= maxRetries; attempt++)
        {
            var resultJson = await executeRequestAsync();
            var jsonObject = JsonConvert.DeserializeObject<JObject>(resultJson);

            var extractedValue = extractResult(jsonObject);
            if (extractedValue != null)
            {
                return extractedValue;
            }

            await Task.Delay(delayMs);
        }

        return default;
    }

    public static ClaimsPrincipal CreateAdB2CPrincipal(string token) => CreatePrincipal(
        $"{_configuration["AzureAdB2C:Instance"]}{_configuration["AzureAdB2C:Domain"]}/v2.0/",
        _configuration["AzureAdB2C:ClientId:DigitalPlatform"], GetExtensionCrmId(token));

    public static ClaimsPrincipal CreateAdPrincipal() => CreatePrincipal(
        $"https://sts.windows.net/{_configuration["AzureAd:TenantId"]}/",
        _configuration["AzureAd:Audience"]!);

    private static string GetExtensionCrmId(string token)
    {
        var handler = new JwtSecurityTokenHandler();
        var jwtToken = handler.ReadJwtToken(token);
        var crmIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == "extension_CRMID");

        return crmIdClaim?.Value;
    }

    private static ClaimsPrincipal CreatePrincipal(string iss, string aud, string cmdId = "")
    {
        var claims = new List<Claim>
        {
            new("iss", iss), new("aud", aud), new("extension_crmId", cmdId), new(ClaimTypes.Role, "roleName")
        };

        var claimIdentity = new ClaimsIdentity(claims, "TestAuthType");
        var claimsPrincipal = new ClaimsPrincipal(claimIdentity);
        return claimsPrincipal;
    }

    public static async Task<string> GetAdBearerTokenAsync()
    {
        var tenantId = _configuration["AzureAd:TenantId"];
        var credential = new DefaultAzureCredential(new DefaultAzureCredentialOptions { TenantId = tenantId });

        var audience = _configuration["AzureAd:Audience"];

        var tokenRequestContext = new TokenRequestContext([audience]);

        var accessToken = await credential.GetTokenAsync(tokenRequestContext);

        return accessToken.Token;
    }

    public static async Task<string> GetAdb2CBearerTokenAsync(string username, string password)
    {
        const int maxRetries = 3;
        const int delayMs = 2000;

        var client = Services.GetRequiredService<IHttpClientFactory>().CreateClient();
        var requestUrl =
            $"{_configuration["AzureAdB2C:Instance"]}{_configuration["AzureAdB2C:TenantId"]}.onmicrosoft.com/B2C_1_ropc_integration_tests/oauth2/v2.0/token";

        for (int attempt = 1; attempt <= maxRetries; attempt++)
        {
            var request = new HttpRequestMessage(HttpMethod.Post, requestUrl)
            {
                Content = new FormUrlEncodedContent(new Dictionary<string, string>
                {
                    { "grant_type", "password" },
                    { "client_id", _configuration["AzureAdB2C:ClientId:DigitalPlatform"] },
                    { "client_secret", _configuration["AZURE-AD-B2C-CLIENT-SECRET"] },
                    {
                        "scope",
                        $"offline_access openid profile {_configuration["AzureAdB2C:ClientId:DigitalPlatform"]}"
                    },
                    { "username", username },
                    { "password", password }
                })
            };

            var waitTimeForAdb2CToPropagate = TimeSpan.FromSeconds(2);
            await Task.Delay(waitTimeForAdb2CToPropagate);

            var response = await client.SendAsync(request);
            response.EnsureSuccessStatusCode();

            var responseBody = await response.Content.ReadAsStringAsync();
            var tokenResponse = JsonConvert.DeserializeObject<dynamic>(responseBody);
            var accessToken = (string)tokenResponse.access_token;

            var crmId = GetExtensionCrmId(accessToken);
            if (!string.IsNullOrEmpty(crmId))
            {
                return accessToken;
            }

            await Task.Delay(delayMs);
        }

        return null;
    }

    public static void SetupHttpContext(ClaimsPrincipal principal, string sourceSystem = "", string accessToken = "")
    {
        var httpContextAccessor =
            Services.GetRequiredService<IHttpContextAccessor>();

        if (httpContextAccessor.HttpContext == null)
        {
            return;
        }

        httpContextAccessor.HttpContext.User = principal;

        if (!string.IsNullOrEmpty(sourceSystem))
        {
            httpContextAccessor.HttpContext.Request.Headers[Headers.SourceSystem] = sourceSystem;
        }

        if (!string.IsNullOrEmpty(accessToken))
        {
            httpContextAccessor.HttpContext.Request.Headers.Authorization = $"Bearer {accessToken}";
        }
    }
}