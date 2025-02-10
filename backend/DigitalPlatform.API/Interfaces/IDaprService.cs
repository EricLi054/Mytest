using System.Net;

namespace DigitalPlatform.API.Interfaces
{
    public interface IDaprService
    {
        /// <summary>
        /// <para>
        /// Creates a Dapr invocation request using either a URL or a HTTPEndpoint Component, an endpoint, and adds the required headers. Returns the response as the specified type.
        /// </para>
        /// <para>
        /// Under the hood, this method calls <see cref="DaprClient.CreateInvokeMethodRequest(HttpMethod, string, string)"/> to create the request, then calls <see cref="AddRequestHeadersAsync(InvokeMethodRequest, Dictionary{string, string})"/> to add the required headers, then calls <see cref="HandleDaprResponseAsync{T}(InvokeMethodRequest)"/> to handle the response.
        /// </para>
        /// <para>
        /// Example call: <code>await _daprService.InvokeDaprGetMethodAsync&lt;List&lt;Product&gt;&gt;(_configuration[ConfigDescriptors.API_BASE_URL] ?? DaprComponents.APIM_Endpoint, endpoint);</code> where <code>endpoint</code> is the endpoint to call, e.g. <code>"/api/finops/productlist"</code>
        /// </para>
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="url"></param>
        /// <param name="endpoint"></param>
        /// <returns></returns>
        Task<T> InvokeDaprGetMethodAsync<T>(string url, string endpoint);

        /// <summary>
        /// <para>
        /// Creates a Dapr invocation request using either a URL or a HTTPEndpoint Component, an endpoint, and adds the required headers. Returns the response as the specified type. Allows for custom headers to be added.
        /// </para>
        /// <para>
        /// Under the hood, this method calls <see cref="DaprClient.CreateInvokeMethodRequest(HttpMethod, string, string)"/> to create the request, then calls <see cref="AddRequestHeadersAsync(InvokeMethodRequest, Dictionary{string, string})"/> to add the required headers, then calls <see cref="HandleDaprResponseAsync{T}(InvokeMethodRequest)"/> to handle the response.
        /// </para>
        /// <para>
        /// Example call: <code>await _daprService.InvokeDaprGetMethodAsync&lt;List&lt;Product&gt;&gt;(_configuration[ConfigDescriptors.API_BASE_URL] ?? DaprComponents.APIM_Endpoint, endpoint, customHeaders);</code> where <code>endpoint</code> is the endpoint to call, e.g. <code>"/api/finops/productlist"</code> and <code>customHeaders</code> is a <code>Dictionary&lt;string, string&gt;</code> of custom headers to add to the request.
        /// </para>
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="url"></param>
        /// <param name="endpoint"></param>
        /// <param name="customHeaders"></param>
        /// <returns></returns>
        Task<T> InvokeDaprGetMethodAsync<T>(string url, string endpoint, Dictionary<string, string> customHeaders);

        /// <summary>
        /// <para>
        /// Creates a Dapr invocation request using either a URL or a HTTPEndpoint Component, an endpoint, and adds the required headers. Returns the response as the specified type. Allows for custom headers to be added.
        /// </para>
        /// <para>
        /// Under the hood, this method calls <see cref="DaprClient.CreateInvokeMethodRequest(HttpMethod, string, string)"/> to create the request, then calls <see cref="AddRequestHeadersAsync(InvokeMethodRequest, Dictionary{string, string})"/> to add the required headers, then calls <see cref="HandleDaprResponseAsync{T}(InvokeMethodRequest)"/> to handle the response.
        /// </para>
        /// <para>
        /// Example call: <code>await _daprService.InvokeDaprGetMethodAsync&lt;List&lt;Product&gt;&gt;(_configuration[ConfigDescriptors.API_BASE_URL] ?? DaprComponents.APIM_Endpoint, endpoint, customHeaders, allowedResponses);</code> where <code>endpoint</code> is the endpoint to call, e.g. <code>"/api/finops/productlist"</code>, <code>customHeaders</code> is a <code>Dictionary&lt;string, string&gt;</code> of custom headers to add to the request and <code>allowedResponses</code> is an <code>HttpStatusCode[]</code> of allowed responses other than success codes to handle specific endpoint errors.
        /// </para>
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="url"></param>
        /// <param name="endpoint"></param>
        /// <param name="customHeaders"></param>
        /// <param name="allowedResponses"></param>
        /// <returns></returns>
        Task<T> InvokeDaprGetMethodAsync<T>(string url, string endpoint, Dictionary<string, string> customHeaders, HttpStatusCode[] allowedResponses);


        /// <summary>
        /// <para>
        /// Creates a Dapr invocation request using either a URL or a HTTPEndpoint Component, an endpoint, and a payload. Adds the required headers. Returns the response as the specified type.
        /// </para>
        /// <para>
        /// Under the hood, this method calls <see cref="DaprClient.CreateInvokeMethodRequest(HttpMethod, string, string, HttpContent)"/> to create the request, then calls <see cref="AddRequestHeadersAsync(InvokeMethodRequest, Dictionary{string, string})"/> to add the required headers, then calls <see cref="HandleDaprResponseAsync{T}(InvokeMethodRequest)"/> to handle the response.
        /// </para>
        /// <para>
        /// Example call: <code>await _daprService.InvokeDaprPostMethodAsync&lt;Person&gt;(_configuration[ConfigDescriptors.API_BASE_URL] ?? DaprComponents.APIM_Endpoint, $"{endpoint}{person.PersonId}", person);</code> where <code>endpoint</code> is the endpoint to call, e.g. <code>"/api/person/"</code> and <code>person</code> is the object to send in the request body.
        /// </para>
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="url"></param>
        /// <param name="endpoint"></param>
        /// <param name="payload"></param>
        /// <returns></returns>
        Task<TResult> InvokeDaprPostMethodAsync<TResult, TRequest>(string url, string endpoint, TRequest payload);

        /// <summary>
        /// <para>
        /// Creates a Dapr invocation request using either a URL or a HTTPEndpoint Component, an endpoint, and a payload. Adds the required headers. Returns the response as the specified type. Allows for custom headers to be added.
        /// </para>
        /// <para>
        /// Under the hood, this method calls <see cref="DaprClient.CreateInvokeMethodRequest(HttpMethod, string, string, HttpContent)"/> to create the request, then calls <see cref="AddRequestHeadersAsync(InvokeMethodRequest, Dictionary{string, string})"/> to add the required headers, then calls <see cref="HandleDaprResponseAsync{T}(InvokeMethodRequest)"/> to handle the response.
        /// </para>
        /// <para>
        /// Example call: <code>await _daprService.InvokeDaprPostMethodAsync&lt;Person&gt;(_configuration[ConfigDescriptors.API_BASE_URL] ?? DaprComponents.APIM_Endpoint, $"{endpoint}{person.PersonId}", person, customHeaders);</code> where <code>endpoint</code> is the endpoint to call, e.g. <code>"/api/person/"</code> and <code>person</code> is the object to send in the request body, and <code>customHeaders</code> is a <code>Dictionary&lt;string, string&gt;</code> of custom headers to add to the request.
        /// </para>
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="url"></param>
        /// <param name="endpoint"></param>
        /// <param name="payload"></param>
        /// <param name="customHeaders"></param>
        /// <returns></returns>
        Task<TResult> InvokeDaprPostMethodAsync<TResult, TRequest>(string url, string endpoint, TRequest payload, Dictionary<string, string> customHeaders);

        /// <summary>
        /// <para>
        /// Creates a Dapr invocation request using either a URL or a HTTPEndpoint Component, an endpoint, and a payload. Adds the required headers. Returns the response as the specified type.
        /// </para>
        /// <para>
        /// Under the hood, this method calls <see cref="DaprClient.CreateInvokeMethodRequest(HttpMethod, string, string, HttpContent)"/> to create the request, then calls <see cref="AddRequestHeadersAsync(InvokeMethodRequest, Dictionary{string, string})"/> to add the required headers, then calls <see cref="HandleDaprResponseAsync{T}(InvokeMethodRequest)"/> to handle the response.
        /// </para>
        /// <para>
        /// Example call: <code>await _daprService.InvokeDaprPutMethodAsync&lt;Person&gt;(_configuration[ConfigDescriptors.API_BASE_URL] ?? DaprComponents.APIM_Endpoint, $"{endpoint}{person.PersonId}", person);</code> where <code>endpoint</code> is the endpoint to call, e.g. <code>"/api/person/"</code> and <code>person</code> is the object to send in the request body.
        /// </para>
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="url"></param>
        /// <param name="endpoint"></param>
        /// <param name="payload"></param>
        /// <returns></returns>
        Task<TResult> InvokeDaprPutMethodAsync<TResult, TRequest>(string url, string endpoint, TRequest payload);

        /// <summary>
        /// <para>
        /// Creates a Dapr invocation request using either a URL or a HTTPEndpoint Component, an endpoint, and a payload. Adds the required headers. Returns the response as the specified type. Allows for custom headers to be added.
        /// </para>
        /// <para>
        /// Under the hood, this method calls <see cref="DaprClient.CreateInvokeMethodRequest(HttpMethod, string, string, HttpContent)"/> to create the request, then calls <see cref="AddRequestHeadersAsync(InvokeMethodRequest, Dictionary{string, string})"/> to add the required headers, then calls <see cref="HandleDaprResponseAsync{T}(InvokeMethodRequest)"/> to handle the response.
        /// </para>
        /// <para>
        /// Example call: <code>await _daprService.InvokeDaprPutMethodAsync&lt;Person&gt;(_configuration[ConfigDescriptors.API_BASE_URL] ?? DaprComponents.APIM_Endpoint, $"{endpoint}{person.PersonId}", person, customHeaders);</code> where <code>endpoint</code> is the endpoint to call, e.g. <code>"/api/person/"</code> and <code>person</code> is the object to send in the request body, and <code>customHeaders</code> is a <code>Dictionary&lt;string, string&gt;</code> of custom headers to add to the request.
        /// </para>
        /// </summary>
        /// <typeparam name="T"></typeparam>
        /// <param name="url"></param>
        /// <param name="endpoint"></param>
        /// <param name="payload"></param>
        /// <param name="customHeaders"></param>
        /// <returns></returns>
        Task<TResult> InvokeDaprPutMethodAsync<TResult, TRequest>(string url, string endpoint, TRequest payload, Dictionary<string, string> customHeaders);

    }
}
