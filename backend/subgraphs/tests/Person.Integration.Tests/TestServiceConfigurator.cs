using Shared.Integration.Tests.Services;
using static Person.Program;

namespace Person.Integration.Tests;

[SetUpFixture]
public static class TestServiceConfigurator
{
    public const string SourceSystem = "PersonSubGraphIntegrationTests";

    [OneTimeSetUp]
    public static async Task SetUp()
    {
        var app = CreateApp([]);

        TestServices.Initialize(app.Services);
        await DataService.InitializeAsync();
    }
}