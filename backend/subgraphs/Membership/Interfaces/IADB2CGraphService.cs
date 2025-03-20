using Membership.Types.ADB2CGraph;

namespace Membership.Interfaces;

[Obsolete("Use ADB2CGraphService in the Person subgraph instead.")]
public interface IADB2CGraphService
{
    Task<ADB2CAccount?> GetUserByEmailAsync(string emailAddress);
}

