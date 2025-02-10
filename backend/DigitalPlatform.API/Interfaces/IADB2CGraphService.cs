using DigitalPlatform.API.Models.SourceSystem.ADB2CGraph;

namespace DigitalPlatform.API.Interfaces;

public interface IADB2CGraphService
{
    Task<ADB2CAccount> GetUserByEmail(string emailAddress);
}
