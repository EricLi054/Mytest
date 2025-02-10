using DigitalPlatform.API.Descriptors;
using Microsoft.Extensions.Configuration;

public static class UnitTestHelpers
{
    public static void SetupConfiguration(IConfiguration configuration)
    {
        configuration[ConfigDescriptors.APIM_SUBSCRIPTION_KEY_HEADER_KEY].Returns("Ocp-Apim-Subscription-Key");
        configuration[ConfigDescriptors.CORRELATION_ID_HEADER_KEY].Returns("CorrelationID");
        configuration[ConfigDescriptors.SOURCE_SYSTEM_HEADER_KEY].Returns("SourceSystem");
        configuration[SecretDescriptors.DIGITAL_CONTENT_API_SUBSCRIPTION_KEY].Returns("1234");
        configuration[ConfigDescriptors.APP_SOURCE_SYSTEM].Returns("Digital Content API Tests");
    }
}