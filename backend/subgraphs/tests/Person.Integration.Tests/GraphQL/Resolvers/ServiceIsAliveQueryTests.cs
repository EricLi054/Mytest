using Newtonsoft.Json;
using Shared.Integration.Tests.Services;

namespace Person.Integration.Tests.GraphQL.Resolvers;

[TestFixture]
[Category("PersonSubgraph")]
public class ServiceIsAliveQueryTests
{
    [Test]
    public async Task GetServiceIsAlive_ShouldReturnServiceIsAlive()
    {
        TestServices.SetupHttpContext(TestServices.CreateAdPrincipal());

        const string query = """
                                 query {
                                     serviceIsAlive {
                                         personService
                                         mfaService
                                     }
                                 }
                             """;

        var resultJson = await TestServices
            .ExecuteRequestAsync(
                q => q.SetDocument(query));

        var result = JsonConvert.DeserializeObject<dynamic>(resultJson);

        Assert.That(result, Is.Not.Null);

        var services = result.data.serviceIsAlive;

        Assert.Multiple(() =>
        {
            Assert.That((bool)services.personService, Is.True);
            Assert.That((bool)services.mfaService, Is.True);
        });
    }
}