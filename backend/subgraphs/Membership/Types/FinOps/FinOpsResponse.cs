namespace Membership.Types.FinOps;

public class FinOpsResponse<T>
{
    public bool IsSuccess { get; set; }
    public T? Value { get; set; } = default;
}