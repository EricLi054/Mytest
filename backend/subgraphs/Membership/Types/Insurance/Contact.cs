namespace Membership.Types.Insurance;

public class Contact
{
    public bool IsMarketingAllowed { get; set; }
    public string Gender { get; set; } = string.Empty;
    public bool IsCrmManaged { get; set; }
    public List<BankAccount> BankAccounts { get; set; } = default!;
    public int MembershipTenure { get; set; }
    public string Title { get; set; } = string.Empty;
    public List<ContactRole> ContactRoles { get; set; } = default!;
    public string ExternalContactNumber { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public bool IsLegalEntity { get; set; }
    public int Id { get; set; }
    public string MobilePhoneNumber { get; set; } = string.Empty;
    public PrivateEmail PrivateEmail { get; set; } = default!;
    public string Initial { get; set; } = string.Empty;
    public string MembershipTier { get; set; } = string.Empty;
    public string DateOfBirth { get; set; } = string.Empty;
    public string MembershipNumber { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public bool IsCrmPreferred { get; set; }
    public List<CreditCard> CreditCards { get; set; } = default!;
    public MailingAddress MailingAddress { get; set; } = default!;
}
