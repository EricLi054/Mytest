using DigitalPlatform.API.GraphQL.Mutations;
using DigitalPlatform.API.Models.Data.Person;
using HotChocolate.Resolvers;
using System.Security.Claims;
using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Tests.Data;
using HotChocolate;
using Microsoft.Extensions.Logging;
using DigitalPlatform.API.Models.SourceSystem.Otp;
using DigitalPlatform.API.GraphQL.Exceptions;
using NSubstitute.ExceptionExtensions;
using System.Net;
using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Models.SourceSystem.MemberCards;
using NSubstitute.Extensions;

namespace DigitalPlatform.API.Tests.GraphQL;

[TestFixture]
public class BaseMutationTests
{
    private ILogger<BaseMutation> logger;
    private IResolverContext context;
    private IPersonService personService;
    private IOtpService otpService;
    private IMemberCardsService memberCardsService;
    private BaseMutation baseMutation;
    private ClaimsPrincipal validClaimsPrincipal;

    [SetUp]
    public void Setup()
    {
        logger = Substitute.For<ILogger<BaseMutation>>();
        context = Substitute.For<IResolverContext>();
        personService = Substitute.For<IPersonService>();
        otpService = Substitute.For<IOtpService>();
        memberCardsService = Substitute.For<IMemberCardsService>();
        baseMutation = new BaseMutation(logger);

        List<Claim> claims = [new Claim(JwtClaims.crmId, "123456")];
        ClaimsIdentity claimsIdentity = new(claims, "IDK");
        validClaimsPrincipal = new(claimsIdentity);
    }


    [Test]
    public async Task UpdatePerson_Returns_Person_When_Successful()
    {
        // Arrange
        var personUpdateMutation = PersonTestData.MutationUpdatePersonEntity;
        var claimsPrincipal = validClaimsPrincipal;
        var expectedPerson = PersonTestData.EditedPersonEntity;
        var sessionKey = "otpSession";
        personService.UpdatePerson(personUpdateMutation, sessionKey, claimsPrincipal, context).Returns(expectedPerson);
        otpService.CheckOtpAsync(Arg.Any<CheckOtpRequest>()).Returns(new CheckOtpQueryResponse { IsVerified = true });

        // Act
        var result = await baseMutation.UpdatePerson(personUpdateMutation, sessionKey, claimsPrincipal, context, personService, otpService);

        // Assert
        Assert.That(result, Is.EqualTo(expectedPerson));
    }

    [Test]
    public void UpdatePerson_Returns_Error_When_Not_Otp()
    {
        // Arrange
        var personUpdateMutation = PersonTestData.MutationUpdatePersonEntity;
        var claimsPrincipal = validClaimsPrincipal;
        var expectedPerson = PersonTestData.EditedPersonEntity;
        var sessionKey = "otpSession";

        personService.UpdatePerson(personUpdateMutation, sessionKey, claimsPrincipal, context).Returns(expectedPerson);
        otpService.CheckOtpAsync(Arg.Any<CheckOtpRequest>()).Returns(new CheckOtpQueryResponse { IsVerified = false });

        UnauthorizedAccessException error = Assert.ThrowsAsync<UnauthorizedAccessException>(async () =>
        {
            await baseMutation.UpdatePerson(personUpdateMutation, sessionKey, claimsPrincipal, context, personService, otpService);
        });
    }

    [Test]
    public async Task UpdatePerson_Returns_Null_When_Unhandled_Exception()
    {
        // Arrange
        var personUpdateMutation = PersonTestData.MutationUpdatePersonEntity;
        var claimsPrincipal = validClaimsPrincipal;
        var sessionKey = "otpSession";

        personService
            .When(x => x.UpdatePerson(Arg.Any<PersonUpdateMutation>(), sessionKey, Arg.Any<ClaimsPrincipal>(), Arg.Any<IResolverContext>()))
            .Throw<Exception>();
        otpService.CheckOtpAsync(Arg.Any<CheckOtpRequest>()).Returns(new CheckOtpQueryResponse { IsVerified = true });

        // Act
        var result = await baseMutation.UpdatePerson(personUpdateMutation, sessionKey, claimsPrincipal, context, personService, otpService);

        // Assert
        Assert.That(result, Is.Null);
        context.Received(1).ReportError(Arg.Is<Error>(error =>
            error.Extensions!["type"]!.ToString() == "UnhandledException"));
    }

    private static IEnumerable<TestCaseData> UpdatePerson_InvalidPersonFields_TestCases()
    {
        yield return new TestCaseData(new PersonUpdateMutation { FirstName = "123" }).SetName("UpdatePerson_Invalid_First_Name");
        yield return new TestCaseData(new PersonUpdateMutation { MiddleName = "123" }).SetName("UpdatePerson_Invalid_Middle_Name");
        yield return new TestCaseData(new PersonUpdateMutation { Surname = "123" }).SetName("UpdatePerson_Invalid_Surname");
        yield return new TestCaseData(new PersonUpdateMutation { MobilePhone = "123" }).SetName("UpdatePerson_Invalid_Mobile_Phone");
        yield return new TestCaseData(new PersonUpdateMutation { HomePhone = "123" }).SetName("UpdatePerson_Invalid_Home_Phone");
        yield return new TestCaseData(new PersonUpdateMutation { WorkPhone = "123" }).SetName("UpdatePerson_Invalid_Work_Phone");
        yield return new TestCaseData(new PersonUpdateMutation { PersonalEmailAddress = "123" }).SetName("UpdatePerson_Invalid_Personal_Email_Address");
    }

    [TestCaseSource(nameof(UpdatePerson_InvalidPersonFields_TestCases))]
    public void UpdatePerson_InvalidPersonFields(PersonUpdateMutation mutation)
    {
        // Arrange
        var claimsPrincipal = validClaimsPrincipal;
        var sessionKey = "otpSession";

        AggregateException exception = Assert.ThrowsAsync<AggregateException>(async () =>
        {
            await baseMutation.UpdatePerson(mutation, sessionKey, claimsPrincipal, context, personService, otpService);
        });

        // check for exception with messgae
        Assert.That(exception.InnerExceptions, Has.Count.EqualTo(1));

        var fieldName = typeof(PersonUpdateMutation)
                        .GetProperties()
                        .FirstOrDefault(property => property.GetValue(mutation)?.ToString() == "123")
                        ?.Name;
        Assert.That(exception.InnerExceptions[0].Message, Is.EqualTo($"The field {fieldName} is invalid."));
    }

    [Test]
    public async Task UpdatePerson_ExceptionReturnsNullAndReportError()
    {
        // Arrange
        var validPerson = new PersonUpdateMutation
        {
            PersonalEmailAddress = "john.doe@example.com",
            MobilePhone = "0400000000",
            FirstName = "John",
            Surname = "Doe"
        };
        var sessionKey = "otpSession";
        var claimsPrincipal = validClaimsPrincipal;
        personService
            .When(x => x.UpdatePerson(Arg.Any<PersonUpdateMutation>(), sessionKey, Arg.Any<ClaimsPrincipal>(), Arg.Any<IResolverContext>()))
            .Throw<Exception>();
        otpService.CheckOtpAsync(Arg.Any<CheckOtpRequest>()).Returns(new CheckOtpQueryResponse { IsVerified = true });

        // Act
        var result = await baseMutation.UpdatePerson(validPerson, sessionKey, claimsPrincipal, context, personService, otpService);

        // Assert
        Assert.That(result, Is.Null);
        context.Received(1).ReportError(Arg.Is<Error>(error =>
            error.Extensions!["type"]!.ToString() == "UnhandledException"));
    }

    [Test]
    public void UpdatePerson_DownstreamHttpException()
    {
        var validPerson = new PersonUpdateMutation
        {
            PersonalEmailAddress = "john.doe@example.com",
            MobilePhone = "0400000000",
            FirstName = "John",
            Surname = "Doe"
        };
        var claimsPrincipal = validClaimsPrincipal;
        var sessionKey = "otpSession";

        personService.UpdatePerson(Arg.Any<PersonUpdateMutation>(), sessionKey, Arg.Any<ClaimsPrincipal>(), Arg.Any<IResolverContext>())
                     .ThrowsAsync(new HttpRequestException("An error occurred while processing your request.", null, HttpStatusCode.BadGateway));

        otpService.CheckOtpAsync(Arg.Any<CheckOtpRequest>()).Returns(new CheckOtpQueryResponse { IsVerified = true });

        // Act
        HttpError error = Assert.ThrowsAsync<HttpError>(async () => await baseMutation.UpdatePerson(validPerson, sessionKey, claimsPrincipal, context, personService, otpService));

        Assert.Multiple(() =>
        {
            Assert.That(error.Message, Is.EqualTo("An error occurred while processing your request."));
            Assert.That(error.ErrorCode, Is.EqualTo(HttpStatusCode.BadGateway.ToString()));
        });
    }

    [Test]
    public void UpdatePerson_HttpExceptionDefaultServerError()
    {
        var validPerson = new PersonUpdateMutation
        {
            PersonalEmailAddress = "john.doe@example.com",
            MobilePhone = "0400000000",
            FirstName = "John",
            Surname = "Doe"
        };
        var claimsPrincipal = validClaimsPrincipal;
        var sessionKey = "otpSession";

        personService.UpdatePerson(Arg.Any<PersonUpdateMutation>(), sessionKey, Arg.Any<ClaimsPrincipal>(), Arg.Any<IResolverContext>())
                     .ThrowsAsync(new HttpRequestException("An error occurred while processing your request."));

        otpService.CheckOtpAsync(Arg.Any<CheckOtpRequest>()).Returns(new CheckOtpQueryResponse { IsVerified = true });

        // Act
        HttpError error = Assert.ThrowsAsync<HttpError>(async () => await baseMutation.UpdatePerson(validPerson, sessionKey, claimsPrincipal, context, personService, otpService));

        Assert.Multiple(() =>
        {
            Assert.That(error.Message, Is.EqualTo("An error occurred while processing your request."));
            Assert.That(error.ErrorCode, Is.EqualTo(HttpStatusCode.InternalServerError.ToString()));
        });
    }

    [Test]
    public void UpdatePerson_NullPersonReturnsNullAndReportError()
    {
        // Arrange
        PersonUpdateMutation nullPerson = null!; // Simulate null input for PersonUpdateMutation
        var claimsPrincipal = validClaimsPrincipal;
        var sessionKey = "otpSession";

        // Act
        ValidationError exception = Assert.ThrowsAsync<ValidationError>(async () =>
        {
            await baseMutation.UpdatePerson(nullPerson, sessionKey, claimsPrincipal, context, personService, otpService);
        });

        Assert.That(exception.Message, Is.EqualTo("Person cannot be null"));
    }

    [Test]
    public async Task SentOtp_ValidRequest()
    {
        SendOtpRequest request = new() { Channel = OtpChannel.SMS, Key = "something" };
        ClaimsPrincipal claimsPrincipal = new();
        SendOtpResponse expectedResult = new() { HasSendAttemptsRemaining = true };
        otpService.SendOtpAsync(request).Returns(expectedResult);

        var result = await baseMutation.SendOtp(request, claimsPrincipal, context, otpService);

        Assert.That(result, Is.EqualTo(expectedResult));
        _ = otpService.Received(1).SendOtpAsync(request);
    }

    [Test]
    public void SendOtp_InvalidKey()
    {
        SendOtpRequest request = new() { Key = "" };
        var claimsPrincipal = new ClaimsPrincipal();

        AggregateException exception = Assert.ThrowsAsync<AggregateException>(async () => await baseMutation.SendOtp(request, claimsPrincipal, context, otpService));

        Assert.That(exception.InnerExceptions, Has.Count.EqualTo(1));
    }

    [Test]
    public void SendOtp_DownstreamHttpException()
    {
        SendOtpRequest request = new() { Channel = OtpChannel.SMS, Key = "something" };
        var claimsPrincipal = new ClaimsPrincipal();

        otpService.SendOtpAsync(request).ThrowsAsync(new HttpRequestException("An error occurred while processing your request.", null, HttpStatusCode.BadGateway));

        HttpError error = Assert.ThrowsAsync<HttpError>(async () => await baseMutation.SendOtp(request, claimsPrincipal, context, otpService));

        Assert.Multiple(() =>
        {
            Assert.That(error.Message, Is.EqualTo("An error occurred while processing your request."));
            Assert.That(error.ErrorCode, Is.EqualTo(HttpStatusCode.BadGateway.ToString()));
        });

    }

    [Test]
    public void SendOtp_HttpExceptionDefaultServerError()
    {
        SendOtpRequest request = new() { Channel = OtpChannel.SMS, Key = "something" };
        var claimsPrincipal = new ClaimsPrincipal();

        otpService.SendOtpAsync(request).ThrowsAsync(new HttpRequestException("An error occurred while processing your request."));

        HttpError error = Assert.ThrowsAsync<HttpError>(async () => await baseMutation.SendOtp(request, claimsPrincipal, context, otpService));

        Assert.Multiple(() =>
        {
            Assert.That(error.Message, Is.EqualTo("An error occurred while processing your request."));
            Assert.That(error.ErrorCode, Is.EqualTo(HttpStatusCode.InternalServerError.ToString()));
        });

    }

    [Test]
    public async Task SendOtp_UnhandledException()
    {
        SendOtpRequest request = new() { Channel = OtpChannel.SMS, Key = "something" };
        var claimsPrincipal = new ClaimsPrincipal();

        otpService.SendOtpAsync(request).ThrowsAsync(new Exception("An error occurred while processing your request."));

        var result = await baseMutation.SendOtp(request, claimsPrincipal, context, otpService);

        Assert.That(result, Is.Null);
        context.Received(1).ReportError(Arg.Is<Error>(error =>
            error.Extensions!["type"]!.ToString() == "UnhandledException"));
    }

    [Test]
    public async Task VerifyOtp_ValidRequest()
    {
        VerifyOtpRequest request = new() { Code = "123456", Key = "something" };
        ClaimsPrincipal claimsPrincipal = new();
        VerifyOtpResponse expectedResult = new() { IsVerified = true };
        otpService.VerifyOtpAsync(request).Returns(expectedResult);

        var result = await baseMutation.VerifyOtp(request, claimsPrincipal, context, otpService);

        Assert.That(result, Is.EqualTo(expectedResult));
        _ = otpService.Received(1).VerifyOtpAsync(request);
    }

    [Test]
    public void VerifyOtp_Invalid()
    {
        VerifyOtpRequest request = new() { Code = "", Key = "" };
        var claimsPrincipal = new ClaimsPrincipal();

        AggregateException exception = Assert.ThrowsAsync<AggregateException>(async () => await baseMutation.VerifyOtp(request, claimsPrincipal, context, otpService));

        Assert.That(exception.InnerExceptions, Has.Count.EqualTo(2));
    }

    [Test]
    public void VerifyOtp_DownstreamHttpException()
    {
        VerifyOtpRequest request = new() { Code = "123456", Key = "something" };
        var claimsPrincipal = new ClaimsPrincipal();

        otpService.VerifyOtpAsync(request).ThrowsAsync(new HttpRequestException("An error occurred while processing your request.", null, HttpStatusCode.BadGateway));

        HttpError error = Assert.ThrowsAsync<HttpError>(async () => await baseMutation.VerifyOtp(request, claimsPrincipal, context, otpService));

        Assert.Multiple(() =>
        {
            Assert.That(error.Message, Is.EqualTo("An error occurred while processing your request."));
            Assert.That(error.ErrorCode, Is.EqualTo(HttpStatusCode.BadGateway.ToString()));
        });

    }

    [Test]
    public void VerifyOtp_HttpExceptionDefaultServerError()
    {
        VerifyOtpRequest request = new() { Code = "123456", Key = "something" };
        var claimsPrincipal = new ClaimsPrincipal();

        otpService.VerifyOtpAsync(request).ThrowsAsync(new HttpRequestException("An error occurred while processing your request."));

        HttpError error = Assert.ThrowsAsync<HttpError>(async () => await baseMutation.VerifyOtp(request, claimsPrincipal, context, otpService));

        Assert.Multiple(() =>
        {
            Assert.That(error.Message, Is.EqualTo("An error occurred while processing your request."));
            Assert.That(error.ErrorCode, Is.EqualTo(HttpStatusCode.InternalServerError.ToString()));
        });

    }

    [Test]
    public async Task VerifyOtp_UnhandledException()
    {
        VerifyOtpRequest request = new() { Code = "123456", Key = "something" };
        var claimsPrincipal = new ClaimsPrincipal();

        otpService.VerifyOtpAsync(request).ThrowsAsync(new Exception("An error occurred while processing your request."));

        var result = await baseMutation.VerifyOtp(request, claimsPrincipal, context, otpService);

        Assert.That(result, Is.Null);
        context.Received(1).ReportError(Arg.Is<Error>(error =>
            error.Extensions!["type"]!.ToString() == "UnhandledException"));
    }

    [Test]
    public async Task CreatePhysicalCardRequest_ValidRequest()
    {
        PhysicalCardRequest request = new() { MemberId = "123456" };
        PhysicalCardResponse expectedResult = new()
        {
            IsSuccess = true,
            Value = "Physical card request is successful"
        };

        memberCardsService.CreatePhysicalCardRequestAsync(request).Returns(expectedResult);

        var claimsPrincipal = new ClaimsPrincipal();
        var result = await baseMutation.RequestPhysicalCard(request, claimsPrincipal, context, memberCardsService);

        Assert.That(result, Is.Not.Null);
        Assert.That(result, Is.EqualTo(expectedResult));
        _ = memberCardsService.Received(1).CreatePhysicalCardRequestAsync(request);
    }

    [Test]
    public void CreatePhysicalCardRequest_InvalidRequest()
    {
        PhysicalCardRequest request = new() { MemberId = "" };

        var claimsPrincipal = new ClaimsPrincipal();

        AggregateException exception = Assert.ThrowsAsync<AggregateException>(async () =>
            await baseMutation.RequestPhysicalCard(request, claimsPrincipal, context, memberCardsService));

        Assert.That(exception.InnerExceptions, Has.Count.EqualTo(1));
    }

    [Test]
    public void CreatePhysicalCardRequest_NoClaimPrincipal()
    {
        PhysicalCardRequest request = new() { MemberId = "12345" };

        UnauthorizedAccessException exception = Assert.ThrowsAsync<UnauthorizedAccessException>(async () =>
            await baseMutation.RequestPhysicalCard(request, null!, context, memberCardsService));

        Assert.That(exception.Message, Is.EqualTo("User is not authenticated"));
    }

    [Test]
    public void CreatePhysicalCardRequest_UnauthorizedException()
    {
        PhysicalCardRequest request = new() { MemberId = "12345" };
        var claimsPrincipal = new ClaimsPrincipal();

        memberCardsService.CreatePhysicalCardRequestAsync(request).ThrowsAsync(new UnauthorizedAccessException("User is not authenticated"));

        UnauthorizedAccessException exception = Assert.ThrowsAsync<UnauthorizedAccessException>(async () => await baseMutation.RequestPhysicalCard(request, claimsPrincipal, context, memberCardsService));

        Assert.That(exception.Message, Is.EqualTo("User is not authenticated"));
    }

    [Test]
    public void CreatePhysicalCardRequest_HttpException()
    {
        PhysicalCardRequest request = new() { MemberId = "12345" };
        var claimsPrincipal = new ClaimsPrincipal();

        memberCardsService.CreatePhysicalCardRequestAsync(request).ThrowsAsync(new HttpRequestException("An error occurred while processing your request."));

        HttpError error = Assert.ThrowsAsync<HttpError>(async () => await baseMutation.RequestPhysicalCard(request, claimsPrincipal, context, memberCardsService));

        Assert.Multiple(() =>
        {
            Assert.That(error.Message, Is.EqualTo("An error occurred while processing your request."));
            Assert.That(error.ErrorCode, Is.EqualTo(HttpStatusCode.InternalServerError.ToString()));
        });
    }

    [Test]
    public async Task CreatePhysicalCardRequest_UnhandledException()
    {
        PhysicalCardRequest request = new() { MemberId = "12345" };
        var claimsPrincipal = new ClaimsPrincipal();

        memberCardsService.CreatePhysicalCardRequestAsync(request).ThrowsAsync(new Exception("An error occurred while processing your request."));

        var result = await baseMutation.RequestPhysicalCard(request, claimsPrincipal, context, memberCardsService);

        Assert.That(result, Is.Null);
        context.Received(1).ReportError(Arg.Is<Error>(error =>
            error.Extensions!["type"]!.ToString() == "UnhandledException"));
    }
}
