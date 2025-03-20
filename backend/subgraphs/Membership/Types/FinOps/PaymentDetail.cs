namespace Membership.Types.FinOps;

public class PaymentDetail
{
    public string Name { get; set; } = string.Empty;
    public string BankShortName { get; set; } = string.Empty;
    public string BankBsb { get; set; } = string.Empty;
    public string BankAccountNum { get; set; } = string.Empty;
    public string CreditCardMaskedNumber { get; set; } = string.Empty;
    public string CreditCardToken { get; set; } = string.Empty;
    public string CreditCardExpiryMonth { get; set; } = string.Empty;
    public string CreditCardExpiryYear { get; set; } = string.Empty;
    public string CreditCardTypeName { get; set; } = string.Empty;
    public string CreditCardUniqueCardId { get; set; } = string.Empty;
}