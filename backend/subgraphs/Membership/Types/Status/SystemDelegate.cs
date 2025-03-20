namespace Membership.Types.Status;

public delegate Task<List<StatusInformation>> SystemCallback();

public class SystemDelegate
{
    public string System { get; set; } = string.Empty;
    public SystemCallback Callback { get; set; } = default!;
}