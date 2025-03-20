using Membership.Types.Status;

namespace Membership.Interfaces;

public interface IStatusService
{
    Task<List<StatusInformation>> GetSystemStatus(string crmId);
}