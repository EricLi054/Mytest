using Shared.Integration.Tests.Services;
using Snapshooter.NUnit;

namespace Person.Integration.Tests;

[TestFixture]
[Category("PersonSubgraph")]
public class SchemaChangeTest
{
    [Test]
    public async Task Schema_GetLatest_CompareSnapshot()
    {
        var schema = await TestServices.Executor.GetSchemaAsync(CancellationToken.None);

        schema.ToString().MatchSnapshot();
    }
}