using Shared.Integration.Tests.Services;
using static Motoring.Program;

namespace Motoring.Integration.Tests;

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
