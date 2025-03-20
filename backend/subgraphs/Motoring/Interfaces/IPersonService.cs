namespace Motoring.Interfaces;

// TODO: Remove when/if RacID claim is added to the ADB2C JWT claims
public interface IPersonService
{
    /// <summary>
    /// Returns the RacID for a member to be able to query their products from the FinOps API
    /// </summary>
    /// <param name="crmId"></param>
    Task<string> GetRacIdAsync(string crmId);
}
