using Microsoft.AspNetCore.Http;
using Shared.Constants;
using Shared.Extensions;

namespace Shared.Tests.Extensions;

public class HttpContextAccessorExtensionsTests
{
    [Test]
    public void TryGetRequestHeaderValue_ShouldReturnHeaderValue_WhenHeaderExists()
    {
        const string sourceSystem = "TestSource";
        var httpContext = new DefaultHttpContext();
        httpContext.Request.Headers.TryAdd(Headers.SourceSystem, sourceSystem);
    
        var result = httpContext.TryGetRequestHeaderValue(Headers.SourceSystem);

        Assert.That(result, Is.EqualTo(sourceSystem));
    }

    [Test]
    public void TryGetRequestHeaderValue_ShouldReturnEmptyString_WhenHeaderDoesNotExist()
    {
        var httpContext = new DefaultHttpContext();

        var result = httpContext.TryGetRequestHeaderValue(Headers.SourceSystem);

        Assert.That(result, Is.EqualTo(string.Empty));
    }
}