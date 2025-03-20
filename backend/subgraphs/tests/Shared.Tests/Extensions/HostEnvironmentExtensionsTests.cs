using Microsoft.AspNetCore.Builder;
using Shared.Constants;
using Shared.Extensions;
using Shouldly;

namespace Shared.Tests.Extensions;

public class HostEnvironmentExtensionsTests
{
    [TestCase(Environments.Name.Local)]
    [TestCase("Local")]
    [TestCase("LOCAL")]
    public void IsLocal_ShouldReturnTrue_WhenLocalEnvironment(string environment)
    {
        Environment.SetEnvironmentVariable(Environments.Key, environment);
        var builder = WebApplication.CreateBuilder();
        builder.Environment.IsLocal().ShouldBeTrue();
    }

    [TestCase(Environments.Name.Dev)]
    [TestCase(Environments.Name.Sit)]
    [TestCase(Environments.Name.Uat)]
    [TestCase(Environments.Name.Prd)]
    [TestCase("Development")]
    [TestCase("Production")]
    [TestCase("Staging")]
    public void IsLocal_ShouldReturnFalse_WhenNotLocalEnvironment(string environment)
    {
        Environment.SetEnvironmentVariable(Environments.Key, environment);
        var builder = WebApplication.CreateBuilder();
        builder.Environment.IsLocal().ShouldBeFalse();
    }

    [TestCase(Environments.Name.Dev)]
    [TestCase("Dev")]
    [TestCase("DEV")]
    public void IsDev_ShouldReturnTrue_WhenDevEnvironment(string environment)
    {
        Environment.SetEnvironmentVariable(Environments.Key, environment);
        var builder = WebApplication.CreateBuilder();
        builder.Environment.IsDev().ShouldBeTrue();
    }

    [TestCase(Environments.Name.Local)]
    [TestCase(Environments.Name.Sit)]
    [TestCase(Environments.Name.Uat)]
    [TestCase(Environments.Name.Prd)]
    [TestCase("Development")]
    [TestCase("Production")]
    [TestCase("Staging")]
    public void IsDev_ShouldReturnFalse_WhenNotDevEnvironment(string environment)
    {
        Environment.SetEnvironmentVariable(Environments.Key, environment);
        var builder = WebApplication.CreateBuilder();
        builder.Environment.IsDev().ShouldBeFalse();
    }
}
