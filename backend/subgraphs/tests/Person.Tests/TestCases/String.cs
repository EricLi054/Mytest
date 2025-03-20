using System.Collections;

namespace Person.Tests.TestCases;

public static class String
{
    public static IEnumerable NullEmptyWhiteSpace
    {
        get
        {
            yield return new TestCaseData(null).SetDescription("Null");
            yield return new TestCaseData("").SetDescription("EmptyString");
            yield return new TestCaseData(" ").SetDescription("Whitespace");
        }
    }
}
