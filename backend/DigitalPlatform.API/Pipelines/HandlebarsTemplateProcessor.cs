using DigitalPlatform.API.Extensions;
using DigitalPlatform.API.Interfaces;
using HandlebarsDotNet;

namespace DigitalPlatform.API.Pipelines;

public static class HandlebarsTemplateProcessor
{
    public static async Task<string> ProcessTemplate(
        IHandlebarContextService handlebarContextService,
        ICacheService cacheService,
        ILogger logger,
        string data,
        string crmId = "",
        string sessionKey = ""
        )
    {
        try
        {
            // Get the handlebars instance from the cache or create a new one if it doesn't exist in the cache yet
            var handlebarsInstance = await cacheService.GetOrCreateAsync("HandlebarsInstance", async entry =>
            {
                return await Task.Run(() => Handlebars.Create());
            });

            if (handlebarsInstance == null)
            {
                logger?.LogError("Handlebars instance is null");
                return data;
            }

            // Register the custom helpers
            RegisterHelpers(handlebarsInstance);

            // Compile the template
            var key = data.HashData();
            var template = await cacheService.GetOrCreateAsync(key, async entry =>
            {
                return await Task.Run(() => handlebarsInstance.Compile(data));
            });

            if (template != null)
            {
                var context = await handlebarContextService.GetHandlebarContext(data, crmId, sessionKey);

                if (context != null)
                {
                    string mustacheResult = template(context);

                    if (!string.IsNullOrEmpty(mustacheResult))
                    {
                        return mustacheResult.PerformPostActions(context, logger);
                    }
                }
                else
                {
                    logger?.LogWarning("Handlebar context is null for CRM ID: {CrmId}", crmId);
                }
            }
            else
            {
                logger?.LogWarning("Template is null for data hash: {DataHash}", key);
            }
        }
        catch (Exception ex)
        {
            logger?.LogError(ex, "Error processing template for CRM ID: {CrmId}", crmId);
            throw;
        }

        // Return the incoming data as the default response in case of errors
        return data;
    }

    private static void RegisterHelpers(IHandlebars handlebarsInstance)
    {
        handlebarsInstance.RegisterHelper("if_eq", (output, options, context, arguments) =>
        {
            if (arguments.Length != 2)
            {
                throw new HandlebarsException("Helper 'if_eq' must have two arguments");
            }

            if (arguments.At<string>(0) == arguments.At<string>(1))
            {
                options.Template(output, context);
            }
            else
            {
                options.Inverse(output, context);
            }
        });

        handlebarsInstance.RegisterHelper("firstLetter", (output, context, arguments) =>
        {
            if (arguments.Length != 1)
            {
                throw new HandlebarsException("Helper 'firstLetter' must have one argument");
            }

            string input = arguments.At<string>(0);

            if (string.IsNullOrEmpty(input))
            {
                output.WriteSafeString(input);
            }
            else
            {
                output.WriteSafeString(input.TrimStart().First());
            }
        });
    }
}
