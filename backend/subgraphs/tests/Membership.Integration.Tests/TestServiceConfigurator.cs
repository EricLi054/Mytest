using Shared.Integration.Tests.Services;
using static Membership.Program;

namespace Membership.Integration.Tests;

[SetUpFixture]
public static class TestServiceConfigurator
{
    [OneTimeSetUp]
    public static async Task SetUp()
    {
        var app = CreateApp([]);

        TestServices.Initialize(app.Services);
        await DataService.InitializeAsync();
    }
}