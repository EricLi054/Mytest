using System.Text.RegularExpressions;
using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Extensions;
using DigitalPlatform.API.Interfaces;

namespace DigitalPlatform.API.Services;

public class HandlebarContextService(
    IPersonService personService,
    IDateTimeProvider dateTimeProvider,
    IConfiguration configuration,
    ILogger<HandlebarContextService> logger) : IHandlebarContextService
{
    public string LoginEmail { get; set; } = string.Empty;

    public async Task<ContentContext> GetHandlebarContext(string content, string crmId = "", string sessionKey = "")
    {
        logger.LogDebug("Content: {Content}", content);
        var context = new ContentContext();
        logger.LogDebug("Getting handlebar context for content with crmId: {CrmId}", crmId);

        try
        {
            var regex = @"{{.*?(person|time|loginEmail|b2cUrl).*?}}";
            var matches = Regex.Matches(content, regex);

            if (matches == null || matches.Count == 0)
            {
                logger.LogWarning("No matches found in content for handlebar context.");
                return context;
            }

            foreach (var match in matches.Select(m => m.Groups[1].Value).Distinct())
            {
                switch (match)
                {
                    case "person":
                        if (!string.IsNullOrEmpty(crmId))
                        {
                            logger.LogInformation("Fetching person data for crmId: {CrmId}", crmId);
                            var person = await personService.GetPerson(crmId, sessionKey);
                            if (person != null)
                            {
                                context.Person = person;
                            }
                            else
                            {
                                logger.LogWarning("No person data found for crmId: {CrmId}", crmId);
                            }
                        }
                        break;
                    case "time":
                        context.Time = dateTimeProvider.GetNow().Hour.GetTimeOfDay();
                        logger.LogDebug("Set context time to: {Time}", context.Time);
                        break;
                    case "loginEmail":
                        context.LoginEmail = LoginEmail;
                        logger.LogDebug("Set context loginEmail to: {LoginEmail}", LoginEmail.MaskEmail());
                        break;
                    case "b2cUrl":
                        context.B2CUrl = configuration[ConfigDescriptors.INSURANCE_B2C_URL] ?? "";
                        logger.LogDebug("Set context B2CUrl to: {B2CUrl}", context.B2CUrl);
                        break;
                    default:
                        logger.LogWarning("Unexpected match found: {Match}", match);
                        break;
                }
            }
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error occurred while getting handlebar context for crmId: {CrmId}", crmId);
        }
        return context;
    }
}
