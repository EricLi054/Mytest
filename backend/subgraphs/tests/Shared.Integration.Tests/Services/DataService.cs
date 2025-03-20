using System.Text.Json;
using System.Text;
using System.Net.Http.Headers;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Hosting;
using Person.API.Person.Models;
using System.Globalization;
using Shared.Constants;
using Person.GraphQL.Types.ADB2CGraph;

namespace Shared.Integration.Tests.Services;

public static class DataService
{
    public const string SourceSystem = "PersonSubGraphIntegrationTests";
    private const string GraphUrl = "https://graph.microsoft.com/v1.0/users";

    public static async Task InitializeAsync()
    {
        await CreateContactAsync();
    }

    private static HttpClient GetHttpClient() => TestServices.Services.GetRequiredService<HttpClient>();

    private static IConfiguration GetConfiguration() => TestServices.Services.GetRequiredService<IConfiguration>();

    private static readonly Dictionary<string, string> EnvironmentUrls = new()
    {
        { "local", "https://racwa-sit.crm6.dynamics.com" },
        { "dev", "https://racwa-sit.crm6.dynamics.com" },
        { "sit", "https://racwa-sit.crm6.dynamics.com" },
        { "uat", "https://racwa-uat.crm6.dynamics.com" }
    };

    public static MatchPersonRequest Person { get; private set; }
    public static UpdateUserCrmIdRequest Adb2cAccount { get; private set; }

    public static async Task<(string email, string password)> GetAccountAsync()
    {
        var account = await CreateAdb2CAccountAsync();

        await LinkAccountAsync(account.email, Person.RacId);

        return account;
    }

    public static async Task DeleteAccountAsync(string email)
    {
        var accountId = await GetAdb2CAccountAsync(email);
        var httpClient = GetHttpClient();
        var requestUrl = $"{GraphUrl}/{accountId}";
        using var requestMessage = new HttpRequestMessage(HttpMethod.Delete, requestUrl);
        requestMessage.Headers.Authorization =
            new AuthenticationHeaderValue("Bearer", await GetGraphAccessTokenAsync());
        requestMessage.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        var response = await httpClient.SendAsync(requestMessage);
        response.EnsureSuccessStatusCode();
    }

    private static async Task<(string email, string password)> CreateAdb2CAccountAsync()
    {
        var email = GenerateRandomEmail();
        var fullEmailAddress = $"{email}@ytrlm97h.mailosaur.net";
        var password = Guid.NewGuid().ToString();

        var configuration = GetConfiguration();
        var token = await GetGraphAccessTokenAsync();

        var client = GetHttpClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", token);

        var userJson = $$"""
                         {
                             "accountEnabled": true,
                             "displayName": "{{email}}",
                             "passwordProfile": {
                                 "forceChangePasswordNextSignIn": false,
                                 "password": "{{password}}"
                             },
                             "identities": [
                                 {
                                     "signInType": "emailAddress",
                                     "issuer": "{{configuration["MS-GRAPH-TENANT"]}}",
                                     "issuerAssignedId": "{{fullEmailAddress}}"
                                 }
                             ]
                         }
                         """;

        var request = new StringContent(userJson, Encoding.UTF8, "application/json");

        var response = await client.PostAsync(GraphUrl, request);
        response.EnsureSuccessStatusCode();

        return (fullEmailAddress, password);
    }

    private static string GenerateRandomEmail()
    {
        const string chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        var random = new Random();
        var stringBuilder = new StringBuilder();

        for (int i = 0; i < 12; i++)
        {
            stringBuilder.Append(chars[random.Next(chars.Length)]);
        }

        return $"{stringBuilder}";
    }

    private static async Task LinkAccountAsync(string email, string crmId)
    {
        var accountId = await GetAdb2CAccountAsync(email);

        var httpClient = GetHttpClient();
        var configuration = GetConfiguration();
        var requestUrl = $"{configuration["APIM:BaseUrl"]}/adb2cgraph/v1/users/{accountId}";

        using var requestMessage = new HttpRequestMessage(HttpMethod.Patch, requestUrl);
        requestMessage.Headers.Add(Headers.SubscriptionKey, configuration["RACWA-AUTOMATION-APIM-SUBSCRIPTION-KEY"]);
        requestMessage.Headers.Add(Headers.SourceSystem, SourceSystem);
        requestMessage.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        requestMessage.Content = new StringContent(JsonSerializer.Serialize(new { CrmId = crmId }), Encoding.UTF8,
            "application/json");

        var response = await httpClient.SendAsync(requestMessage);
        response.EnsureSuccessStatusCode();
    }

    private static async Task<string> GetAdb2CAccountAsync(string email)
    {
        var httpClient = GetHttpClient();
        var configuration = GetConfiguration();
        var requestUrl = $"{configuration["APIM:BaseUrl"]}/adb2cgraph/v1/user-by-email";

        using var requestMessage = new HttpRequestMessage(HttpMethod.Post, requestUrl);
        requestMessage.Headers.Add(Headers.SubscriptionKey, configuration["RACWA-AUTOMATION-APIM-SUBSCRIPTION-KEY"]);
        requestMessage.Headers.Add(Headers.SourceSystem, SourceSystem);
        requestMessage.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        requestMessage.Content = new StringContent(JsonSerializer.Serialize(new { email = email }), Encoding.UTF8,
            "application/json");

        var response = await httpClient.SendAsync(requestMessage);
        response.EnsureSuccessStatusCode();

        var responseContent = await response.Content.ReadAsStringAsync();
        using var jsonDoc = JsonDocument.Parse(responseContent);

        return jsonDoc.RootElement[0].GetProperty("id").GetString();
    }

    private static string GetEnvironmentUrl()
    {
        var hostingEnvironment = TestServices.Services.GetRequiredService<IHostEnvironment>();
        var environmentName = hostingEnvironment.EnvironmentName.ToLower();

        return EnvironmentUrls.GetValueOrDefault(environmentName);
    }

    private static async Task CreateContactAsync()
    {
        var httpClient = GetHttpClient();
        var token = await GetAccessTokenAsync();
        var dynamicsUrl = GetEnvironmentUrl();
        var requestUrl =
            $"{dynamicsUrl}/api/data/v9.2/contacts?$top=50&$select=contactid,firstname,lastname,emailaddress1,mobilephone,rac_birthdatetext&$filter=mobilephone ne null and contactid ne null and firstname ne null and lastname ne null and emailaddress1 ne null and rac_birthdatetext ne null";

        using var requestMessage = new HttpRequestMessage(HttpMethod.Get, requestUrl);
        requestMessage.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);
        requestMessage.Headers.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

        var response = await httpClient.SendAsync(requestMessage);
        response.EnsureSuccessStatusCode();

        var responseContent = await response.Content.ReadAsStringAsync();
        using var jsonDoc = JsonDocument.Parse(responseContent);
        var contacts = jsonDoc.RootElement
            .GetProperty("value")
            .EnumerateArray()
            .ToList();

        if (!contacts.Any())
        {
            return;
        }

        var random = new Random();
        var randomIndex = random.Next(contacts.Count);
        var contact = contacts[randomIndex];

        string[] dateFormats = ["dd/MM/yyyy", "d/MM/yyyy", "dd/M/yyyy", "d/M/yyyy"];
        var dateOfBirthString = contact.GetProperty("rac_birthdatetext").GetString();
        if (!DateTime.TryParseExact(dateOfBirthString, dateFormats, CultureInfo.InvariantCulture, DateTimeStyles.None,
                out var dateOfBirth))
        {
            dateOfBirth = DateTime.MinValue;
        }

        Person = new MatchPersonRequest
        {
            FirstName = contact.GetProperty("firstname").GetString() ?? string.Empty,
            DateOfBirth = dateOfBirth.ToString("yyyy-MM-dd"),
            Surname = contact.GetProperty("lastname").GetString() ?? string.Empty,
            MobilePhone = contact.GetProperty("mobilephone").GetString(),
            RacId = contact.GetProperty("contactid").GetString(),
            ProductNumber = contact.GetProperty("emailaddress1").GetString()
        };
    }

    private static async Task<string> GetAccessTokenAsync()
    {
        var configuration = GetConfiguration();
        var httpClient = GetHttpClient();
        const string tokenUrl = "https://login.microsoftonline.com/rac.com.au/oauth2/token";
        const string clientId = "ddcea47f-dd83-4683-a06d-5240c9917401";
        var clientSecret = configuration["RACWA-AUTOMATION-DYNAMICS-OAUTH-CLIENT-SECRET"];
        const string grantType = "client_credentials";

        var requestBody = new StringContent(
            $"client_id={clientId}&client_secret={clientSecret}&resource={GetEnvironmentUrl()}&grant_type={grantType}",
            Encoding.UTF8,
            "application/x-www-form-urlencoded"
        );

        var response = await httpClient.PostAsync(tokenUrl, requestBody);
        response.EnsureSuccessStatusCode();

        var responseContent = await response.Content.ReadAsStringAsync();
        using var jsonDoc = JsonDocument.Parse(responseContent);
        return jsonDoc.RootElement.GetProperty("access_token").GetString();
    }

    private static async Task<string> GetGraphAccessTokenAsync()
    {
        var configuration = GetConfiguration();
        var httpClient = GetHttpClient();
        var tokenUrl = $"https://login.microsoftonline.com/{configuration["MS-GRAPH-TENANT"]}/oauth2/v2.0/token";
        var clientId = configuration["MS-GRAPH-CLIENT-ID"];
        var clientSecret = configuration["RACWA-AUTOMATION-MS-GRAPH-OAUTH-CLIENT-SECRET"];
        const string grantType = "client_credentials";
        const string scope = "https://graph.microsoft.com/.default";

        var requestBody = new StringContent(
            $"client_id={clientId}&client_secret={clientSecret}&scope={scope}&grant_type={grantType}",
            Encoding.UTF8,
            "application/x-www-form-urlencoded"
        );

        var response = await httpClient.PostAsync(tokenUrl, requestBody);
        response.EnsureSuccessStatusCode();

        var responseContent = await response.Content.ReadAsStringAsync();
        using var jsonDoc = JsonDocument.Parse(responseContent);
        return jsonDoc.RootElement.GetProperty("access_token").GetString();
    }
}