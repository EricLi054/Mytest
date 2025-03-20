using Microsoft.Extensions.Hosting;

namespace Shared.Extensions;

// Reference: https://github.com/dotnet/runtime/blob/main/src/libraries/Microsoft.Extensions.Hosting.Abstractions/src/HostEnvironmentEnvExtensions.cs
public static class HostEnvironmentExtensions
{
    public static bool IsDev(this IHostEnvironment hostEnvironment)
    {
        return hostEnvironment.IsEnvironment(Constants.Environments.Name.Dev);
    }

    public static bool IsLocal(this IHostEnvironment hostEnvironment)
    {
        return hostEnvironment.IsEnvironment(Constants.Environments.Name.Local);
    }
}
