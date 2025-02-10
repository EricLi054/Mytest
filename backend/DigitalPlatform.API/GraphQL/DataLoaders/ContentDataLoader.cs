using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Pipelines;

namespace DigitalPlatform.API.GraphQL.DataLoaders;

public class ContentDataLoader(
    IContentService contentService,
    IHandlebarContextService handlebarContextService,
    ICacheService cacheService,
    IBatchScheduler batchScheduler,
    ILogger<ContentDataLoader> logger,
    DataLoaderOptions? options = null) : BatchDataLoader<KeyValuePair<string, string>, string>(batchScheduler, options)
{
    protected override async Task<IReadOnlyDictionary<KeyValuePair<string, string>, string>> LoadBatchAsync(
        IReadOnlyList<KeyValuePair<string, string>> keys,
        CancellationToken cancellationToken)
    {
        var result = new Dictionary<KeyValuePair<string, string>, string>();

        try
        {
            var queryKeyValue = keys.FirstOrDefault(kvp => kvp.Key == "query");
            var crmIdKeyValue = keys.FirstOrDefault(kvp => kvp.Key == "crmId");
            var loginEmailKeyValue = keys.FirstOrDefault(kvp => kvp.Key == "loginEmail");
            var sessionKeyKeyValue = keys.FirstOrDefault(kvp => kvp.Key == "sessionKey");

            handlebarContextService.LoginEmail = loginEmailKeyValue.Value;

            logger.LogInformation("Fetching content for query: {Query}", queryKeyValue.Value);
            var content = await contentService.GetContentAsync(queryKeyValue.Value);

            if (string.IsNullOrEmpty(content))
            {
                logger.LogWarning("No content found for query: {Query}", queryKeyValue.Value);
                return result;
            }

            logger.LogInformation("Processing template for CRM ID: {CrmId}", crmIdKeyValue.Value);
            var mustacheResult = await HandlebarsTemplateProcessor.ProcessTemplate(handlebarContextService, cacheService, logger, content, crmIdKeyValue.Value, sessionKeyKeyValue.Value);

            result.Add(queryKeyValue, mustacheResult);
            result.Add(crmIdKeyValue, crmIdKeyValue.Value);
            result.Add(loginEmailKeyValue, loginEmailKeyValue.Value);
            result.Add(sessionKeyKeyValue, sessionKeyKeyValue.Value);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "An error occurred while loading batch.");
        }

        return result;
    }
}
