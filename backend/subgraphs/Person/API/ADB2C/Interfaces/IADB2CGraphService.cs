
using Person.GraphQL.Types.ADB2CGraph;

namespace Person.API.ADB2C.Interfaces;

public interface IADB2CGraphService
{
    Task<ADB2CUserAccount?> GetUserByEmailAsync(string email);
    Task<PatchAdb2cAccountResponse?> UpdateUserCrmIdByAccountIdAsync(string accountId, string crmId);
    Task<ADB2CUserAccount?> UpdateUserEmailByIdAsync(string accountId, string email);
}

