using HotChocolate.Resolvers;
using System.Security.Claims;
using DigitalPlatform.API.Interfaces;
using HotChocolate;
using Microsoft.Extensions.Logging;
using DigitalPlatform.API.Models.SourceSystem.Otp;
using DigitalPlatform.API.GraphQL.Exceptions;
using NSubstitute.ExceptionExtensions;
using System.Net;
using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.GraphQL.Queries;
using DigitalPlatform.API.Models.SourceSystem.MemberCards;

namespace DigitalPlatform.API.Tests.GraphQL;

[TestFixture]
public class BaseQueryTests
{
    private ILogger<BaseQuery> logger;
    private IResolverContext context;
    private IOtpService otpService;
    private BaseQuery baseQuery;
    private ClaimsPrincipal validClaimsPrincipal;
    private IMemberCardsService memberCardsService;

    [SetUp]
    public void Setup()
    {
        logger = Substitute.For<ILogger<BaseQuery>>();
        context = Substitute.For<IResolverContext>();
        otpService = Substitute.For<IOtpService>();
        memberCardsService = Substitute.For<IMemberCardsService>();
        baseQuery = new BaseQuery(logger);

        List<Claim> claims = [new Claim(JwtClaims.crmId, "123456")];
        ClaimsIdentity claimsIdentity = new(claims, "IDK");
        validClaimsPrincipal = new(claimsIdentity);
    }

    [Test]
    public async Task CheckOtp_ValidRequest()
    {
        CheckOtpQuery mutation = new() { Key = "something" };
        CheckOtpRequest request = new() { CrmId = "123456", Key = "something" };
        List<Claim> claims = [new Claim(JwtClaims.crmId, "123456")];
        ClaimsIdentity claimsIdentity = new(claims, "IDK");
        ClaimsPrincipal claimsPrincipal = new(claimsIdentity);
        CheckOtpQueryResponse expectedResult = new() { IsVerified = true };
        otpService.CheckOtpAsync(request).Returns(expectedResult);

        var result = await baseQuery.CheckOtp(mutation, claimsPrincipal, context, otpService);

        Assert.That(result, Is.EqualTo(expectedResult));
        _ = otpService.Received(1).CheckOtpAsync(request);
    }

    [Test]
    public async Task CheckOtp_NotVerified()
    {
        CheckOtpQuery mutation = new() { Key = "something" };
        CheckOtpRequest request = new() { CrmId = "123456", Key = "something" };
        ClaimsPrincipal claimsPrincipal = validClaimsPrincipal;
        CheckOtpQueryResponse expectedResult = new() { IsVerified = false };
        otpService.CheckOtpAsync(request).Returns(expectedResult);

        var result = await baseQuery.CheckOtp(mutation, claimsPrincipal, context, otpService);

        Assert.That(result, Is.EqualTo(expectedResult));
        _ = otpService.Received(1).CheckOtpAsync(request);
    }

    [Test]
    public void CheckOtp_InvalidRequest()
    {
        CheckOtpQuery request = new() { Key = "" };
        ClaimsPrincipal claimsPrincipal = validClaimsPrincipal;

        AggregateException exception = Assert.ThrowsAsync<AggregateException>(async () => await baseQuery.CheckOtp(request, claimsPrincipal, context, otpService));

        Assert.That(exception.InnerExceptions, Has.Count.EqualTo(1));
    }

    [Test]
    public void CheckOtp_DownstreamHttpException()
    {
        CheckOtpQuery mutation = new() { Key = "something" };
        CheckOtpRequest request = new() { CrmId = "123456", Key = "something" };
        ClaimsPrincipal claimsPrincipal = validClaimsPrincipal;

        otpService.CheckOtpAsync(request).ThrowsAsync(new HttpRequestException("An error occurred while processing your request.", null, HttpStatusCode.BadGateway));

        HttpError error = Assert.ThrowsAsync<HttpError>(async () => await baseQuery.CheckOtp(mutation, claimsPrincipal, context, otpService));

        Assert.Multiple(() =>
        {
            Assert.That(error.Message, Is.EqualTo("An error occurred while processing your request."));
            Assert.That(error.ErrorCode, Is.EqualTo(HttpStatusCode.BadGateway.ToString()));
        });

    }

    [Test]
    public void CheckOtp_HttpExceptionDefaultServerError()
    {
        CheckOtpQuery mutation = new() { Key = "something" };
        CheckOtpRequest request = new() { CrmId = "123456", Key = "something" };
        ClaimsPrincipal claimsPrincipal = validClaimsPrincipal;

        otpService.CheckOtpAsync(request).ThrowsAsync(new HttpRequestException("An error occurred while processing your request."));

        HttpError error = Assert.ThrowsAsync<HttpError>(async () => await baseQuery.CheckOtp(mutation, claimsPrincipal, context, otpService));

        Assert.Multiple(() =>
        {
            Assert.That(error.Message, Is.EqualTo("An error occurred while processing your request."));
            Assert.That(error.ErrorCode, Is.EqualTo(HttpStatusCode.InternalServerError.ToString()));
        });
    }

    [Test]
    public async Task CheckOtp_UnhandledException()
    {
        CheckOtpQuery mutation = new() { Key = "something" };
        CheckOtpRequest request = new() { CrmId = "123456", Key = "something" };
        ClaimsPrincipal claimsPrincipal = validClaimsPrincipal;

        otpService.CheckOtpAsync(request).ThrowsAsync(new Exception("An error occurred while processing your request."));

        var result = await baseQuery.CheckOtp(mutation, claimsPrincipal, context, otpService);

        Assert.That(result, Is.Null);
        context.Received(1).ReportError(Arg.Is<Error>(error =>
            error.Extensions!["type"]!.ToString() == "UnhandledException"));
    }

    [Test]
    public async Task RetrieveDigitalCardsDetails_SuccessResponse()
    {
        ClaimsPrincipal claimsPrincipal = validClaimsPrincipal;
        DigitalCardDetailsResponse response = new()
        {
            IsSuccess = true,
            Errors = null,
            Value = new()
            {
                Id = "digital-pass-id",
                DigitalCardPassId = "digital-pass-1234",
                DigitalCardPassIsActive = true,
                DigitalCardPassUrl = "https://digital-pass-1234",
                NumberOfPassesInstalled = 0
            }
        };

        memberCardsService.RetrieveDigitalCardDetails("123456").Returns(response);
        var result = await baseQuery.GetDigitalCardDetails(claimsPrincipal, context, memberCardsService);

        Assert.That(result.IsSuccess, Is.True);
        Assert.That(result.Errors, Is.Null);
        Assert.That(result.Value, Is.Not.Null);
        Assert.That(result.Value.Id, Is.EqualTo("digital-pass-id"));
        Assert.That(result.Value.DigitalCardPassId, Is.EqualTo("digital-pass-1234"));
        Assert.That(result.Value.DigitalCardPassUrl, Is.EqualTo("https://digital-pass-1234"));
        Assert.That(result.Value.DigitalCardPassIsActive, Is.True);
        Assert.That(result.Value.NumberOfPassesInstalled, Is.Zero);

        _ = memberCardsService.Received(1).RetrieveDigitalCardDetails("123456");
    }

    [Test]
    public void RetrieveDigitalCardsDetails_HttpError()
    {
        ClaimsPrincipal claimsPrincipal = validClaimsPrincipal;

        memberCardsService.RetrieveDigitalCardDetails("123456").ThrowsAsync(new HttpRequestException("An error occurred while processing your request."));
        HttpError error = Assert.ThrowsAsync<HttpError>(async () => await baseQuery.GetDigitalCardDetails(claimsPrincipal, context, memberCardsService));
        Assert.Multiple(() =>
        {
            Assert.That(error.Message, Is.EqualTo("An error occurred while processing your request."));
            Assert.That(error.ErrorCode, Is.EqualTo(HttpStatusCode.InternalServerError.ToString()));
        });
    }

    [Test]
    public async Task RetrieveDigitalCardsDetails_UnhandledError()
    {
        ClaimsPrincipal claimsPrincipal = validClaimsPrincipal;

        memberCardsService.RetrieveDigitalCardDetails("123456").ThrowsAsync(new Exception("Unhandled error occurred"));
        _ = await baseQuery.GetDigitalCardDetails(claimsPrincipal, context, memberCardsService);

        context.Received(1).ReportError(Arg.Is<Error>(error =>
            error.Extensions!["type"]!.ToString() == "UnhandledException"));
    }

    [Test]
    public void RetrieveDigitalCardsDetails_UnauthorisedError()
    {
        List<Claim> claims = [new Claim(JwtClaims.crmId, string.Empty)];
        ClaimsIdentity claimsIdentity = new(claims, "IDK");
        ClaimsPrincipal claimsPrincipal = new(claimsIdentity);

        DigitalCardDetailsResponse response = new()
        {
            IsSuccess = false,
            Errors = null,
            Value = null
        };

        memberCardsService.RetrieveDigitalCardDetails("123456").Returns(response);
        var error = Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await baseQuery.GetDigitalCardDetails(claimsPrincipal, context, memberCardsService));
        Assert.That(error.Message, Is.EqualTo("User is not authenticated"));
    }
}
