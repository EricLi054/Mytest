using DigitalPlatform.API.Models.Services;

namespace DigitalPlatform.API.Interfaces;
public interface IStatusService
{
    Task<List<StatusInformation>> GetSystemStatus(string crmId);
}
