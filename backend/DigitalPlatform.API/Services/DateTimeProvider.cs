using DigitalPlatform.API.Interfaces;

namespace DigitalPlatform.API.Services;

public class DateTimeProvider : IDateTimeProvider
{
    public DateTime GetNow() => DateTime.Now;
}