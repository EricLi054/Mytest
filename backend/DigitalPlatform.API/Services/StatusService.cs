
using System.Collections.Concurrent;
using System.Net;
using DigitalPlatform.API.Descriptors;
using DigitalPlatform.API.Interfaces;
using DigitalPlatform.API.Models.Services;
using DigitalPlatform.API.Models.SourceSystem.Insurance;
using DigitalPlatform.API.Models.SourceSystem.PersonV2;

namespace DigitalPlatform.API.Services;

public class StatusService(
    IContentService contentService,
    IPersonService personService,
    IMemberCardsService memberCardsService,
    IFinanceService financeService,
    IFinOpsService finOpsService,
    IOtpService otpService,
    IInsuranceService insuranceService,
    IConfiguration configuration,
    IHttpContextAccessor httpContextAccessor,
    IDaprService daprService) : IStatusService
{
    private List<SystemDelegate> GetSystems(string crmId, string racId, string rimId, List<PersonV2SystemId> personSystemIds)
    {
        return new List<SystemDelegate>
        {
            new SystemDelegate
            {
                System = "Contentful",
                Callback = async() =>
                {
                    var content = await contentService.GetContentAsync("query{landingPageCollection(limit: 1){items{ __typename}}}");
                    return [
                        new StatusInformation
                        {
                            Name = "Contentful",
                            Status = !string.IsNullOrEmpty(content) ? SystemStatus.Healthy : SystemStatus.Down
                        }
                    ];
                }
            },
            new SystemDelegate
            {
                System = "FinOps Product List",
                Callback = async() =>
                {
                    if(string.IsNullOrEmpty(racId))
                    {
                        return [
                            new StatusInformation
                            {
                                Name = "FinOps Product List",
                                Status = SystemStatus.UnableToVerify
                            }
                        ];
                    }
                    var products = await finOpsService.GetProductHoldingList(racId, configuration[ConfigDescriptors.FINOPS_API_COMPANY_ID] ?? "", DateTime.Now.ToString("yyyy-MM-dd"));
                    return [
                        new StatusInformation
                        {
                            Name = "FinOps Product List",
                            Status = products != null ? SystemStatus.Healthy : SystemStatus.Down
                        }
                    ];
                }
            },
            new SystemDelegate
            {
                System = "Person v1 Quotes",
                Callback = async() =>
                {
                    var quotes = await financeService.GetFinanceQuotes(crmId);
                    return [
                        new StatusInformation
                        {
                            Name = "Person v1 Quotes",
                            Status = quotes != null ? SystemStatus.Healthy : SystemStatus.Down
                        }
                    ];
                }
            },
            new SystemDelegate
            {
                System = "SHIELD",
                Callback = async() =>
                {
                    // Do all these in 1 as they require data from each other for a happy path test

                    var systemId = personSystemIds?.FirstOrDefault()?.SystemId ?? "1234";
                    var response = new List<StatusInformation>();
                    InsurancePortfolioSummary insuranceSummary = null!;

                    try
                    {
                        insuranceSummary = await insuranceService.GetPortfolioSummary(systemId);
                        response.Add(new StatusInformation
                        {
                            Name = "SHIELD Reference Data",
                            Status = insuranceSummary != null ? SystemStatus.Healthy : SystemStatus.Down
                        });
                    }
                    catch (Exception ex)
                    {
                        // Logged in user has no policies
                        if(ex.Message == "Unprocessable Entity")
                        {
                            response.Add(new StatusInformation
                            {
                                Name = "SHIELD Reference Data",
                                Status = SystemStatus.Responding
                            });
                        }
                        else
                        {
                            response.Add(new StatusInformation
                            {
                                Name = "SHIELD Reference Data",
                                Status = SystemStatus.Down
                            });
                        }
                    }

                    var contactNumber = insuranceSummary?
                        .Contacts?
                        .Where(s => s != null)?
                        .Select(s => s.ContactExternalNumber)?
                        .FirstOrDefault();

                    try
                    {
                        var insuranceContact = await insuranceService.GetContactByExternalShieldNumber(contactNumber ?? "1234");
                        response.Add(new StatusInformation
                        {
                            Name = "SHIELD Contacts",
                            Status = insuranceContact != null ? SystemStatus.Healthy : SystemStatus.Down
                        });
                    }
                    catch (Exception ex)
                    {
                        // Logged in user has no contacts
                        if(ex.Message == "Not Found")
                        {
                            response.Add(new StatusInformation
                            {
                                Name = "SHIELD Contacts",
                                Status = SystemStatus.Responding
                            });
                        }
                        else
                        {
                            response.Add(new StatusInformation
                            {
                                Name = "SHIELD Contacts",
                                Status = SystemStatus.Down
                            });
                        }
                    }

                    var policyNumber = insuranceSummary?
                        .Contacts?
                        .Where(s => s != null)?
                        .SelectMany(s => s.PolicyDetails)?
                        .Select(s => s.PolicyNumber)?
                        .FirstOrDefault(s => !string.IsNullOrEmpty(s));

                    try
                    {
                        var policyInfo = await insuranceService.GetInsurancePolicies(policyNumber ?? "1234");
                        response.Add(new StatusInformation
                        {
                            Name = "SHIELD Policy",
                            Status = policyInfo != null ? SystemStatus.Healthy : SystemStatus.Down
                        });
                    }
                    catch (Exception ex)
                    {
                        // Logged in user has no policy info
                        if(ex.Message == "Not Found")
                        {
                            response.Add(new StatusInformation
                            {
                                Name = "SHIELD Policy",
                                Status = SystemStatus.Responding
                            });
                        }
                        else
                        {
                            response.Add(new StatusInformation
                            {
                                Name = "SHIELD Policy",
                                Status = SystemStatus.Down
                            });
                        }
                    }

                    return response;
                }
            },
            new SystemDelegate
            {
                System = "Finance",
                Callback = async() =>
                {
                    try
                    {
                        var financeProducts = await financeService.GetProductList(rimId);
                        return [
                            new StatusInformation
                            {
                                Name = "Finance",
                                Status = financeProducts != null ? SystemStatus.Healthy : SystemStatus.Down
                            }
                        ];
                    }
                    catch (HttpRequestException ex)
                    {
                        // Logged in user has no finance products
                        if(ex.StatusCode == HttpStatusCode.BadRequest)
                        {
                            return [
                                new StatusInformation
                                {
                                    Name = "Finance",
                                    Status = SystemStatus.Responding
                                }
                            ];
                        }
                        throw;
                    }
                }
            },
            new SystemDelegate
            {
                System = "MFA OTP",
                Callback = async() =>
                {
                    // This will be caught by the try catch call to show if it is down
                    var otpCheckResult = await otpService.CheckOtpAsync(new() { CrmId = crmId, Key = "my-rac-manage-contact-details" });
                    return [
                        new StatusInformation
                        {
                            Name = "MFA OTP",
                            Status = SystemStatus.Healthy
                        }
                    ];
                }
            },
            new SystemDelegate
            {
                System = "MC Member Card",
                Callback = async() =>
                {
                    var digitalCard = await memberCardsService.RetrieveDigitalCardDetails(crmId);
                    return [
                        new StatusInformation
                        {
                            Name = "MC Member Card",
                            Status = digitalCard != null ? SystemStatus.Healthy : SystemStatus.Down
                        }
                    ];
                }
            }
        };
    }


    public async Task<List<StatusInformation>> GetSystemStatus(string crmId)
    {
        if (string.IsNullOrEmpty(crmId))
        {
            throw new UnauthorizedAccessException("GetSystemStatus called without crmId");
        }

        // Set no retries for this call
        if (httpContextAccessor.HttpContext != null)
        {
            httpContextAccessor.HttpContext.Request.Headers.Append("NoRetry", bool.TrueString);
        }

        var statusInfo = new ConcurrentBag<StatusInformation>();
        string racId = string.Empty;
        string rimId = string.Empty;
        List<PersonV2SystemId> personSystemIds = [];

        try
        {
            // Call person directly without all the extra caching and calls in the person service
            string endpoint = configuration[ConfigDescriptors.PERSON_API_GET_PERSON_URL] ?? "";
            var url = configuration[ConfigDescriptors.API_BASE_URL] ?? DaprComponents.APIM_Endpoint;
            PersonV2Response data = await daprService.InvokeDaprGetMethodAsync<PersonV2Response>(url, $"{endpoint}{crmId}");

            statusInfo.Add(new StatusInformation
            {
                Name = "Person v2 Person",
                Status = data != null ? SystemStatus.Healthy : SystemStatus.Down
            });

            racId = data?.RacId ?? string.Empty;
            personSystemIds = data?.PersonSystemIds ?? [];
        }
        catch (Exception)
        {
            statusInfo.Add(new StatusInformation
            {
                Name = "Person v2 Person",
                Status = SystemStatus.Down
            });
        }

        try
        {
            // Call MC Products for RIMID
            var products = await personService.GetProducts(crmId);
            statusInfo.Add(new StatusInformation
            {
                Name = "Person v2 Products",
                Status = products?.ProductHoldings != null ? SystemStatus.Healthy : SystemStatus.Down
            });
            var financeProductsFromMC = products?.ProductHoldings?
                .Where(p => p?.ProductBusinessType?.ToLower() == "finance" &&
                            p?.ProductStatus?.ToLower() == "active" &&
                            p?.StartDate <= DateTime.Now)
                .GroupBy(p => (p.ProductNumber, p.Product))
                .Select(pr => pr.OrderByDescending(gr => gr.EndDate).FirstOrDefault())
                .ToList();

            if (financeProductsFromMC != null && financeProductsFromMC.Count > 0)
            {
                rimId = financeProductsFromMC[0]?.SourceId ?? string.Empty;
            }
        }
        catch (Exception)
        {
            statusInfo.Add(new StatusInformation
            {
                Name = "Person v2 Products",
                Status = SystemStatus.Down
            });
        }


        var systems = GetSystems(crmId, racId, rimId, personSystemIds);

        await Parallel.ForEachAsync(systems, async (system, ct) =>
        {
            try
            {
                var status = await system.Callback();
                status.ForEach(s => statusInfo.Add(s));
            }
            catch (Exception)
            {
                statusInfo.Add(new StatusInformation
                {
                    Name = system.System,
                    Status = SystemStatus.Down
                });
            }
        });

        return statusInfo.OrderBy(item => item.Name).ToList();
    }
}