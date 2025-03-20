using Shared.Integration.Tests.Services;
using Snapshooter.NUnit;

namespace Membership.Integration.Tests;

[TestFixture]
[Category("MembershipSubgraph")]
public static class SchemaChangeTest
{
    [Test]
    public static async Task Schema_GetLatest_CompareSnapshot()
    {
        var schema = await TestServices.Executor.GetSchemaAsync(CancellationToken.None);

        schema.ToString().MatchSnapshot();
    }
}