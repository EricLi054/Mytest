using DigitalPlatform.API.Helpers;

namespace DigitalPlatform.API.Tests.Helpers
{
    [TestFixture]
    public class HttpClientHelpersTests
    {
        [Test]
        public void CreateInvokeMethodRequest_WithUrlAndEndpoint_ReturnsHttpRequestMessageWithCorrectUrl()
        {
            // Arrange
            var method = HttpMethod.Get;
            var url = "https://example.com";
            var endpoint = "/api/endpoint";

            // Act
            var request = HttpClientHelpers.CreateInvokeMethodRequest(method, url, endpoint);

            // Assert
            Assert.That(request.RequestUri?.ToString(), Is.EqualTo($"{url}{endpoint}"));
            Assert.That(request.Method, Is.EqualTo(method));
        }

        [Test]
        public void CreateInvokeMethodRequest_WithUrlEndpointAndContent_ReturnsHttpRequestMessageWithCorrectContent()
        {
            // Arrange
            var method = HttpMethod.Post;
            var url = "https://example.com";
            var endpoint = "/api/endpoint";
            var content = "test content";

            // Act
            var request = HttpClientHelpers.CreateInvokeMethodRequest(method, url, endpoint, content);

            // Assert
            Assert.That(request.RequestUri?.ToString(), Is.EqualTo($"{url}{endpoint}"));
            Assert.That(request.Method, Is.EqualTo(method));
            Assert.That(request.Content?.ReadAsStringAsync().Result, Is.EqualTo(content));
            Assert.That(request.Content.Headers.ContentType?.MediaType, Is.EqualTo("application/json"));
        }

        [Test]
        public void CreateInvokeMethodRequest_WithUrlEndpointAndObjectContent_ReturnsHttpRequestMessageWithCorrectContent()
        {
            // Arrange
            var method = HttpMethod.Post;
            var url = "https://example.com";
            var endpoint = "/api/endpoint";
            var content = new { Name = "John", Age = 30 };

            // Act
            var request = HttpClientHelpers.CreateInvokeMethodRequest(method, url, endpoint, content);

            // Assert
            Assert.That(request.RequestUri?.ToString(), Is.EqualTo($"{url}{endpoint}"));
            Assert.That(request.Method, Is.EqualTo(method));
            var jsonContent = request.Content?.ReadAsStringAsync().Result;
            Assert.That(jsonContent, Is.EqualTo("{\"Name\":\"John\",\"Age\":30}"));
            Assert.That(request.Content?.Headers.ContentType?.MediaType, Is.EqualTo("application/json"));
        }
    }
}