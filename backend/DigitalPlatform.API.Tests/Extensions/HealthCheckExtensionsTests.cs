using DigitalPlatform.API.Extensions;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Net;

namespace DigitalPlatform.API.Tests.Extensions
{
    [TestFixture]
    public class HealthCheckExtensionsTests
    {
        private TestServer _server;
        private HttpClient _client;

        [SetUp]
        public void Setup()
        {
            var config = Substitute.For<IConfiguration>();
            _server = new TestServer(new WebHostBuilder()
                .ConfigureServices(services =>
                {
                    services.AddContainerHealthChecks(config);
                    services.AddRouting();
                })
                .Configure(app =>
                {
                    app.UseRouting().UseEndpoints(endpoints =>
                    {
                        endpoints.UseContainerHealthChecks();
                    });
                }));

            _client = _server.CreateClient();
        }

        [TearDown]
        public void TearDown()
        {
            _client.Dispose();
            _server.Dispose();
        }

        [Test]
        public async Task HealthCheckExtensions_AddContainerHealthChecks_ReturnsHealthyResponseForLiveness()
        {
            // Arrange

            // Act
            var response = await _client.GetAsync("/healthz/liveness");

            Assert.Multiple(async () =>
            {
                // Assert
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(await response.Content.ReadAsStringAsync(), Is.EqualTo("Healthy"));
            });
        }
        [Test]
        public async Task HealthCheckExtensions_UseContainerHealthChecks_ReturnsHealthyResponseForReadiness()
        {
            // Arrange

            // Act
            var response = await _client.GetAsync("/healthz/readiness");

            Assert.Multiple(async () =>
            {
                // Assert
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(await response.Content.ReadAsStringAsync(), Is.EqualTo("Healthy"));
            });
        }

        [Test]
        public async Task HealthCheckExtensions_UseContainerHealthChecks_ReturnsHealthyResponseForStartup()
        {
            // Arrange

            // Act
            var response = await _client.GetAsync("/healthz/startup");

            Assert.Multiple(async () =>
            {
                // Assert
                Assert.That(response.StatusCode, Is.EqualTo(HttpStatusCode.OK));
                Assert.That(await response.Content.ReadAsStringAsync(), Is.EqualTo("Healthy"));
            });
        }
    }
}