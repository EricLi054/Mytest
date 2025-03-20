namespace Membership.Types.Insurance;

public class BankAccount : PaymentMethod
{
    public int Id { get; set; }
    public string BSB { get; set; } = string.Empty;
    public string AccountName { get; set; } = string.Empty;
    public string AccountNumber { get; set; } = string.Empty;
    public string DiscontinueDate { get; set; } = string.Empty;

}
