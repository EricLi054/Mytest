using Membership.GraphQL.Types;
using Membership.Interfaces;
using Membership.Types.Insurance;
using Membership.Types.Person;
using Membership.Types.Status;
using System.Collections.Concurrent;
using System.Net;

namespace Membership.Services;

public class StatusService(
    IPersonService personService,
    IMemberCardService memberCardService,
    IFinanceService financeService,
    IFinOpsService finOpsService,
    IInsuranceService insuranceService) : IStatusService
{
    private List<SystemDelegate> GetSystems(string crmId, string racId, string rimId, List<PersonSystemId> personSystemIds)
    {
        return new List<SystemDelegate>
        {
            CreateFinOpsSystemDelegate(racId),
            CreatePersonV1SystemDelegate(crmId),
            CreateShieldSystemDelegate(personSystemIds),
            CreateFinanceSystemDelegate(rimId),
            CreateMemberCardSystemDelegate(crmId)
        };
    }

    private SystemDelegate CreateMemberCardSystemDelegate(string crmId)
    {
        return new SystemDelegate
        {
            System = "MC Member Card",
            Callback = async () =>
            {
                var digitalCard = await memberCardService.RetrieveDigitalCardDetailsAsync(crmId);
                return [
                    new StatusInformation
                        {
                            Name = "MC Member Card",
                            Status = digitalCard != null ? SystemStatus.Healthy : SystemStatus.Down
                        }
                ];
            }
        };
    }

    private SystemDelegate CreateFinanceSystemDelegate(string rimId)
    {
        return new SystemDelegate
        {
            System = "Finance",
            Callback = async () =>
            {
                try
                {
                    var financeProducts = await financeService.GetProductListAsync(rimId);
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
                    if (ex.StatusCode == HttpStatusCode.BadRequest)
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
        };
    }

    private SystemDelegate CreateShieldSystemDelegate(List<PersonSystemId> personSystemIds)
    {
        return new SystemDelegate
        {
            System = "SHIELD",
            Callback = async () =>
            {
                var response = new List<StatusInformation>();

                string systemId = personSystemIds?.FirstOrDefault()?.SystemId ?? "1234";

                var insuranceSummary = await ProcessInsuranceSummary(systemId, response);
                string? contactNumber = ExtractContactNumber(insuranceSummary);
                string? policyNumber = ExtractPolicyNumber(insuranceSummary);

                await ProcessShieldContact(response, contactNumber);
                await ProcessInsurancePolicies(response, policyNumber);

                return response;
            }
        };
    }

    private static string? ExtractContactNumber(InsurancePortfolioSummary? insuranceSummary)
    {
        return insuranceSummary?.Contacts?
            .Where(s => s != null)?
            .Select(s => s.ContactExternalNumber)?
            .FirstOrDefault();
    }

    private static string? ExtractPolicyNumber(InsurancePortfolioSummary? insuranceSummary)
    {
        return insuranceSummary?.Contacts?
            .Where(s => s != null)?
            .SelectMany(s => s.PolicyDetails)?
            .Select(s => s.PolicyNumber)?
            .FirstOrDefault(s => !string.IsNullOrEmpty(s));
    }

    private async Task ProcessInsurancePolicies(List<StatusInformation> response, string? policyNumber)
    {
        try
        {
            var policyInfo = await insuranceService.GetInsurancePoliciesAsync(policyNumber ?? "1234");
            response.Add(new StatusInformation
            {
                Name = "SHIELD Policy",
                Status = policyInfo != null ? SystemStatus.Healthy : SystemStatus.Down
            });
        }
        catch (Exception ex)
        {
            // Logged in user has no policy info
            if (ex.Message == "Not Found")
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
    }

    private async Task ProcessShieldContact(List<StatusInformation> response, string? contactNumber)
    {
        try
        {
            var insuranceContact = await insuranceService.GetContactByExternalShieldNumberAsync(contactNumber ?? "1234");
            response.Add(new StatusInformation
            {
                Name = "SHIELD Contacts",
                Status = insuranceContact != null ? SystemStatus.Healthy : SystemStatus.Down
            });
        }
        catch (Exception ex)
        {
            // Logged in user has no contacts
            if (ex.Message == "Not Found")
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
    }

    private async Task<InsurancePortfolioSummary?> ProcessInsuranceSummary(string systemId, List<StatusInformation> response)
    {
        InsurancePortfolioSummary? insuranceSummary = null;
        try
        {
            insuranceSummary = await insuranceService.GetPortfolioSummaryAsync(systemId);
            response.Add(new StatusInformation
            {
                Name = "SHIELD Reference Data",
                Status = insuranceSummary != null ? SystemStatus.Healthy : SystemStatus.Down
            });
        }
        catch (Exception ex)
        {
            // Logged in user has no policies
            if (ex.Message == "Unprocessable Entity")
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

        return insuranceSummary;
    }

    private SystemDelegate CreateFinOpsSystemDelegate(string racId)
    {
        return new SystemDelegate
        {
            System = "FinOps Product List",
            Callback = async () =>
            {
                if (string.IsNullOrEmpty(racId))
                {
                    return [
                        new StatusInformation
                            {
                                Name = "FinOps Product List",
                                Status = SystemStatus.UnableToVerify
                            }
                    ];
                }
                var products = await finOpsService.GetProductHoldingListAsync(racId);
                return [
                    new StatusInformation
                        {
                            Name = "FinOps Product List",
                            Status = products != null ? SystemStatus.Healthy : SystemStatus.Down
                        }
                ];
            }
        };
    }

    private SystemDelegate CreatePersonV1SystemDelegate(string crmId)
    {
        return new SystemDelegate
        {
            System = "Person v1 Quotes",
            Callback = async () =>
            {
                var quotes = await financeService.GetFinanceQuotesAsync(crmId);
                return [
                    new StatusInformation
                        {
                            Name = "Person v1 Quotes",
                            Status = quotes != null ? SystemStatus.Healthy : SystemStatus.Down
                        }
                ];
            }
        };
    }

    public async Task<List<StatusInformation>> GetSystemStatus(string crmId)
    {
        if (string.IsNullOrEmpty(crmId))
        {
            throw new UnauthorizedAccessException("GetSystemStatus called without crmId");
        }

        var statusInfo = new ConcurrentBag<StatusInformation>();
        var racId = string.Empty;
        List<PersonSystemId> personSystemIds = [];

        (racId, personSystemIds) = await RetrievePersonIds(crmId, statusInfo, racId, personSystemIds);

        var rimId = await RetrieveRimId(crmId, statusInfo);
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

    private async Task<(string racId, List<PersonSystemId> personSystemIds)> RetrievePersonIds(string crmId, ConcurrentBag<StatusInformation> statusInfo, string racId, List<PersonSystemId> personSystemIds)
    {
        try
        {
            var data = await personService.GetPersonAsync(crmId);

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

        return (racId, personSystemIds);
    }

    private async Task<string> RetrieveRimId(string crmId, ConcurrentBag<StatusInformation> statusInfo)

    {
        var rimId = string.Empty;
        try
        {
            var products = await personService.GetPersonProductsAsync(crmId);
            statusInfo.Add(new StatusInformation
            {
                Name = "Person v2 Products",
                Status = products != null ? SystemStatus.Healthy : SystemStatus.Down
            });

            var financeProductsFromMC = FilterActiveFinanceProducts(products);
            if (financeProductsFromMC.Count != 0)
            {
                rimId = financeProductsFromMC.First().SourceId ?? string.Empty;
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

        return rimId;
    }

    private static bool IsActiveFinanceProduct(PersonProductHolding? product)
    {
        return product?.ProductBusinessType?.Equals("finance", StringComparison.OrdinalIgnoreCase) == true &&
               product?.ProductStatus?.Equals("active", StringComparison.OrdinalIgnoreCase) == true &&
               product?.StartDate <= DateTime.Now;
    }

    private static List<PersonProductHolding> FilterActiveFinanceProducts(IEnumerable<PersonProductHolding>? products)
    {
        return products?
            .Where(IsActiveFinanceProduct)
            .GroupBy(p => (p.ProductNumber, p.Product))
            .Select(pr => pr.OrderByDescending(gr => gr.EndDate).FirstOrDefault())
            .Where(p => p != null)
            .Cast<PersonProductHolding>()
            .ToList() ?? [];
    }
}