using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using DigitalPlatform.API.Extensions;

public static class ContentMustacheExtensions
{
    /// <summary>
    /// Using the context, perform any post actions on the mustache result.
    /// </summary>
    /// <param name="str">The mustache result string.</param>
    /// <param name="context">The content context.</param>
    /// <param name="logger">The logger instance.</param>
    /// <returns>The updated mustache result string after performing post actions.</returns>
    public static string PerformPostActions(this string str, ContentContext context, ILogger logger)
    {
        var retVal = str;

        try
        {
            // If the time is not set, set it
            if (string.IsNullOrEmpty(context.Time))
            {
                context.Time = DateTime.Now.Hour.GetTimeOfDay();
                logger?.LogInformation("Context time set to: {Time}", context.Time);
            }

            if (retVal.Contains("bannerImage") && !string.IsNullOrEmpty(context.Time))
            {
                JObject jsonObject;

                try
                {
                    // Parse the JSON data
                    jsonObject = JObject.Parse(retVal);
                }
                catch (JsonException ex)
                {
                    logger?.LogError(ex, "Error parsing JSON in PerformPostActions");
                    return retVal; // Return original string if JSON parsing fails
                }

                // Navigate to the "bannerImage" array
                JArray bannerImageArray = jsonObject["data"]?["component"]?["bannerImage"] as JArray ?? new JArray();

                if (context.Time == "morning")
                {
                    var morningImage = bannerImageArray.Count > 0 ? bannerImageArray[0] : null;
                    bannerImageArray.Clear();
                    bannerImageArray.Add(morningImage ?? "");
                    logger?.LogInformation("Set banner image to morning image");
                }
                else if (context.Time == "afternoon")
                {
                    var afternoonImage = bannerImageArray.Count > 1 ? bannerImageArray[1] : null;
                    bannerImageArray.Clear();
                    bannerImageArray.Add(afternoonImage ?? "");
                    logger?.LogInformation("Set banner image to afternoon image");
                }
                else if (context.Time == "evening")
                {
                    var eveningImage = bannerImageArray.Count > 2 ? bannerImageArray[2] : null;
                    bannerImageArray.Clear();
                    bannerImageArray.Add(eveningImage ?? "");
                    logger?.LogInformation("Set banner image to evening image");
                }

                // Set the return value to the updated JSON string
                retVal = jsonObject.ToString(Formatting.None);
            }
        }
        catch (Exception ex)
        {
            logger?.LogError(ex, "An error occurred while performing post actions on the mustache result");
            // Return the original string in case of error to ensure continuity
        }

        return retVal;
    }
}
