using Shared.Integration.Tests.Services;
using System.Security.Claims;

namespace Person.Integration.Tests.GraphQL.Resolvers;

[TestFixture]
[Category("PersonSubgraph")]
public class MutationTests
{
    [Test]
    public async Task Match_WithValidData_ShouldMatchSuccessfully()
    {
        var request = DataService.Person;
        var accessToken = await TestServices.GetAdBearerTokenAsync();
        var principal = TestServices.CreateAdPrincipal();

        TestServices.SetupHttpContext(principal, TestServiceConfigurator.SourceSystem, accessToken);

        var result = await TestServices.ExecuteGraphQlWithRetryAsync(
            () => TestServices.ExecuteRequestAsync(q => q
                .SetDocument($$$"""
                                mutation MyMutation {
                                  match(input: {
                                    request: {
                                        firstName: "{{{request.FirstName}}}", 
                                        dateOfBirth: "{{{request.DateOfBirth}}}", 
                                        surname: "{{{request.Surname}}}",
                                        mobilePhone: "{{{request.MobilePhone}}}"}})
                                  {
                                    matchedPerson {
                                      firstName
                                      mobilePhone
                                      membershipType
                                    }
                                  }
                                }
                                """)
                .AddGlobalState("Authorization", $"Bearer {accessToken}")
                .AddGlobalState(nameof(ClaimsPrincipal), principal)),
            jsonObject => jsonObject["data"]?["match"]?["matchedPerson"]
        );

        Assert.Multiple(() =>
        {
            if (result != null)
            {
                Assert.That(result["firstName"]?.ToString(), Is.EqualTo(request.FirstName),
                    "FirstName does not match.");
                Assert.That(result["mobilePhone"]?.ToString(), Is.EqualTo(request.MobilePhone),
                    "MobilePhone does not match.");
            }
            else
            {
                Assert.Warn("Expected a matchedPerson object.");
            }
        });
    }
}