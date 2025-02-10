using System.Security.Claims;
using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Middleware;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Primitives;

namespace DigitalPlatform.API.Tests.Middleware;

[TestFixture]
public class CustomAuthMiddlewareTests
{
    private readonly CustomAuthMiddleware _middleware;
    private readonly RequestDelegate _next;
    private HttpContext _context = new DefaultHttpContext();

    public CustomAuthMiddlewareTests()
    {
        _next = Substitute.For<RequestDelegate>();
        var _logger = Substitute.For<ILogger<CustomAuthMiddleware>>();
        _middleware = new CustomAuthMiddleware(_next, _logger);
    }

    [SetUp]
    public void Setup()
    {
        _context = new DefaultHttpContext();

        var authServiceMock = Substitute.For<IAuthenticationService>();
        authServiceMock.AuthenticateAsync(Arg.Any<HttpContext>(), Arg.Any<string>())
            .Returns(Task.FromResult(AuthenticateResult.Success(new AuthenticationTicket(new ClaimsPrincipal(), "TestScheme"))));

        var services = new ServiceCollection();
        services.AddSingleton(authServiceMock);

        var serviceProvider = services.BuildServiceProvider();
        _context.RequestServices = serviceProvider; // Set RequestServices to the mock service provider
    }

    [Test]
    public async Task Invoke_ShouldSucceed_WhenAuthorizationHeaderExistsAndIsValid()
    {
        // Arrange
        _context.Request.Headers.Authorization = "Bearer valid_token";
        var claims = new List<Claim>
        {
            new(JwtClaims.crmId, Guid.NewGuid().ToString())
        };
        var identity = new ClaimsIdentity(claims, "TestScheme");
        _context.User = new ClaimsPrincipal(identity);
        var mockSuccessResult = AuthenticateResult.Success(new AuthenticationTicket(_context.User, "TestScheme"));
        _context.AuthenticateAsync().Returns(Task.FromResult(mockSuccessResult));

        // Act
        await _middleware!.Invoke(_context);

        // Assert
        await _next.Received(1).Invoke(_context);
        Assert.That(_context.Response.StatusCode, Is.EqualTo(200));
    }
    [Test]
    public async Task Invoke_ShouldReturnUnAuthorised_WhenAuthorizationHeaderExistsAndIsInValid()
    {
        // Arrange
        _context.Request.Headers.Authorization = "Bearer invalid_token";
        var claims = new List<Claim>
        {
            new(JwtClaims.crmId, Guid.NewGuid().ToString())
        };
        var identity = new ClaimsIdentity(claims, "TestScheme");
        _context.User = new ClaimsPrincipal(identity);
        var mockFailResult = AuthenticateResult.Fail("Invalid token");
        _context.AuthenticateAsync().Returns(Task.FromResult(mockFailResult));

        // Act
        await _middleware.Invoke(_context);

        // Assert
        await _next.Received(0).Invoke(_context);
        Assert.That(_context.Response.StatusCode, Is.EqualTo(401));
    }
    [Test]
    public async Task Invoke_ShouldReturnUnAuthorised_WhenAuthorizationHeaderIsValidButInvalidCrmId()
    {
        // Arrange
        _context.Request.Headers.Authorization = "Bearer valid_token";
        var claims = new List<Claim>
        {
            new(JwtClaims.crmId, "INVALID-GUID")
        };
        var identity = new ClaimsIdentity(claims, "TestScheme");
        _context.User = new ClaimsPrincipal(identity);
        var mockSuccessResult = AuthenticateResult.Success(new AuthenticationTicket(_context.User, "TestScheme"));
        _context.AuthenticateAsync().Returns(Task.FromResult(mockSuccessResult));

        // Act
        await _middleware.Invoke(_context);

        // Assert
        await _next.Received(0).Invoke(_context);
        Assert.That(_context.Response.StatusCode, Is.EqualTo(403));
    }
    [Test]
    public async Task Invoke_ShouldReturnAuthorised_WhenAuthorizationHeaderIsValidButCrmIdDoesntExist()
    {
        // Arrange
        _context.Request.Headers.Authorization = "Bearer valid_token";
        var identity = new ClaimsIdentity("TestScheme");
        _context.User = new ClaimsPrincipal(identity);
        var mockSuccessResult = AuthenticateResult.Success(new AuthenticationTicket(_context.User, "TestScheme"));
        _context.AuthenticateAsync().Returns(Task.FromResult(mockSuccessResult));

        // Act
        await _middleware.Invoke(_context);

        // Assert
        await _next.Received(1).Invoke(_context);
        Assert.That(_context.Response.StatusCode, Is.EqualTo(200));
    }

    [Test]
    public async Task Invoke_ShouldAllowPublicCallToPass_WhenAuthorizationHeaderDoesNotExist()
    {
        // Arrange
        _context.Request.Headers["Authorization"] = StringValues.Empty;

        // Act
        await _middleware.Invoke(_context);

        // Assert
        await _next.Received(1).Invoke(_context);
        Assert.That(_context.Response.StatusCode, Is.EqualTo(200));
    }

}