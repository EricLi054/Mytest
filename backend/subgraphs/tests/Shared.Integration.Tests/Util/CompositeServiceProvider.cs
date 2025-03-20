using Microsoft.AspNetCore.Http;

namespace Shared.Integration.Tests.Util;

public class CompositeServiceProvider(IServiceProvider primary, IServiceProvider secondary)
    : IServiceProvider
{
    public object GetService(Type serviceType)
    {
        var service = TryGetService(primary, serviceType);

        return service ?? TryGetService(secondary, serviceType);
    }

    private static object TryGetService(IServiceProvider provider, Type serviceType)
    {
        var service = provider.GetService(serviceType);

        if (service is IHttpContextAccessor httpContextAccessor)
        {
            InitializeHttpContext(httpContextAccessor);
        }

        return service;
    }

    private static void InitializeHttpContext(IHttpContextAccessor httpContextAccessor)
    {
        httpContextAccessor.HttpContext ??= new DefaultHttpContext();
    }
}