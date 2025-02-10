namespace DigitalPlatform.API.Models.Services;

public delegate Task<List<StatusInformation>> SystemCallback();

public class SystemDelegate
{
    public string System { get; set; } = string.Empty;
    public SystemCallback Callback { get; set; } = default!;
}