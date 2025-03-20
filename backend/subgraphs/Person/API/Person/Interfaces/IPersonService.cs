using Person.API.Person.Models;
using Person.GraphQL.Types;
using PersonType = Person.GraphQL.Types.Person;

namespace Person.API.Person.Interfaces;

/// <summary>
///     Service for handling Person operations.
/// </summary>
/// <remarks>
/// <list type="bullet">
///     <item><seealso href="https://github.com/racwa/mc-person-v2"/></item>
///     <item><seealso href="https://rac-wa.atlassian.net/wiki/spaces/INT/pages/1064796294/Person+API+V2"/></item>
///     <item><seealso href="https://rac-wa.atlassian.net/wiki/spaces/D365/pages/3388833796/MC+Person+API+V2"/></item>
/// </list>
/// </remarks>
public interface IPersonService
{
    /// <summary>
    ///     Get the Person from Person API
    /// </summary>
    /// <remarks>
    ///     <seealso href="https://rac-wa.atlassian.net/wiki/spaces/D365/pages/3388080489/MC+Person+API+GET+by+Id" />
    /// </remarks>
    /// <param name="crmId">RACWA-CRM-ID</param>
    /// <returns><see cref="PersonType"/> or null</returns>
    /// <exception cref="ArgumentException"></exception>
    Task<PersonType> GetPersonAsync(string crmId);

    /// <summary>
    ///     Get the contact match from Person API
    /// </summary>
    /// <remarks>
    ///     <seealso href="https://rac-wa.atlassian.net/wiki/spaces/D365/pages/3388768596/MC+Person+API+GET+Match" />
    /// </remarks>
    /// <param name="request">MatchPersonRequest</param>
    /// <returns><see cref="MatchedPerson"/> or null</returns>
    /// <exception cref="ArgumentException"></exception>
    Task<MatchedPerson?> GetMatchPersonAsync(MatchPersonRequest request);

    /// <summary>
    ///     Check health status of the Person service
    /// </summary>
    /// <returns>bool</returns>
    Task<bool> GetHealthStatusAsync(CancellationToken cancellationToken = new());

    /// <summary>
    ///     Update person details
    /// </summary>
    /// <remarks>
    ///     <seealso href="https://rac-wa.atlassian.net/wiki/spaces/D365/pages/3388833904/MC+Person+API+PUT+Update" />
    /// </remarks>
    /// <param name="request">UpdatePersonRequest</param>
    /// <param name="crmId">Person's CRM ID</param>
    /// <returns><see cref="PersonType"/> or null</returns>
    /// <exception cref="ArgumentException"></exception>
    Task<PersonType?> UpdatePersonAsync(UpdatePersonRequest request, string crmId);
}
