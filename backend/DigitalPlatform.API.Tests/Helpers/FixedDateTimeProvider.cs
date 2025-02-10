using DigitalPlatform.API.Interfaces;

namespace DigitalPlatform.API.Tests.Helpers;

public class FixedDateTimeProvider : IDateTimeProvider
{
    private readonly DateTime _fixedDateTime;
    public FixedDateTimeProvider(DateTime fixedDateTime)
    {
        _fixedDateTime = fixedDateTime;
    }
    public FixedDateTimeProvider(int hour)
    {
        //used in tests where we care only about the hour of day
        _fixedDateTime = new DateTime(2024, 1, 1, hour, 0, 0, DateTimeKind.Local);
    }
    public DateTime GetNow() => _fixedDateTime;
}
