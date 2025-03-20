using Shared.Integration.Tests.Services;
using Snapshooter.NUnit;

namespace Motoring.Integration.Tests;

[TestFixture]
[Category("MotoringSubgraph")]
public class Tests
{
    [Test]
    public async Task Schema_GetLatest_CompareSnapshot()
    {
        var schema = await TestServices.Executor.GetSchemaAsync(CancellationToken.None);

        schema.ToString().MatchSnapshot();
    }
}