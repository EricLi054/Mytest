using Shared.Integration.Tests.Services;
using System.Security.Claims;

namespace Person.Integration.Tests.GraphQL.Resolvers;

[TestFixture]
[Category("PersonSubgraph")]
public class QueryTests : MyRacAccountTestBase
{
    [Test]
    public async Task GetMe_WithValidData_ShouldReturnPerson()
    {
        var request = DataService.Person;
        var accessToken = await TestServices.GetAdb2CBearerTokenAsync(Email, Password);
        var principal = TestServices.CreateAdB2CPrincipal(accessToken);

        TestServices.SetupHttpContext(principal, TestServiceConfigurator.SourceSystem, accessToken);

        var result = await TestServices.ExecuteGraphQlWithRetryAsync(
            () => TestServices
                .ExecuteRequestAsync(
                    q => q.SetDocument("""
                                       query MyQuery {
                                         me {
                                           firstName
                                           surname
                                           mobilePhone
                                           personId
                                         }
                                       }
                                       """)
                        .AddGlobalState("Authorization", $"Bearer {accessToken}")
                        .AddGlobalState(nameof(ClaimsPrincipal), principal)),
            jsonObject => jsonObject["data"]?["me"]
        );

        Assert.Multiple(() =>
        {
            if (result != null)
            {
                Assert.That(result["firstName"]?.ToString(), Is.EqualTo(request.FirstName),
                    "FirstName does not match.");
                Assert.That(result["surname"]?.ToString(), Is.EqualTo(request.Surname), "Surname does not match.");
                Assert.That(result["mobilePhone"]?.ToString(), Is.EqualTo(request.MobilePhone),
                    "MobilePhone does not match.");
                Assert.That(result["personId"]?.ToString(), Is.EqualTo(request.RacId), "CrmId does not match.");
            }
            else
            {
                Assert.Warn("Expected a me object.");
            }
        });
    }
}