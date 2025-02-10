namespace DigitalPlatform.API.Models.SourceSystem.FinOps
{
    public class Product
    {
        public string CompanyId { get; set; } = string.Empty;
        public string ProductId { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public decimal AnnualPrice { get; set; }
        public decimal MonthlyPrice { get; set; }
        public bool MonthlyDirectDebitAllowed { get; set; }
        public bool AnnualDirectDebitAllowed { get; set; }
        public string DiscountCode { get; set; } = string.Empty;
        public IDictionary<string, DirectDebitScheduleDetail> DirectDebit { get; set; } = default!;
    }

    public class DirectDebitScheduleDetail
    {
        public double TotalAmount { get; set; }
        public List<DirectDebitScheduleLineDetail> ScheduleLines { get; set; } = default!;
    }

    public class DirectDebitScheduleLineDetail
    {
        public string LineNum { get; set; } = string.Empty;
        public DateTime DueDate { get; set; }
        public double Amount { get; set; }
    }

    public class FinOpsProductHolding
    {
        public string CompanyId { get; set; } = string.Empty;
        public string ProductHoldingHeaderId { get; set; } = string.Empty;
        public string Upn { get; set; } = string.Empty;
        public string CustAccount { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public ProductHoldingStatus Status { get; set; }
        public ProductHoldingStatusReason StatusReason { get; set; }
        public string PaymentMode { get; set; } = string.Empty;
        public string PaymentScheduleId { get; set; } = string.Empty;
        public decimal TotalAmount { get; set; }
        public decimal TotalRemainingAmount { get; set; }
        public decimal TotalDueAmount { get; set; }
        public PaymentDetail PaymentDetail { get; set; } = default!;
        public IEnumerable<ProductHoldingLine> ProductHoldingLines { get; set; } = default!;
        public IEnumerable<ProductHoldingLine> RenewalProductHoldingLines { get; set; } = default!;
        public IEnumerable<ProductHoldingPaymentSchedule> ProductHoldingPaymSched { get; set; } = default!;
        public string RenewalProductHoldingHeaderId { get; set; } = string.Empty;
        public DateTime RenewalStartDate { get; set; }
        public string RenewalPaymentMode { get; set; } = string.Empty;
        public string RenewalPaymentScheduleId { get; set; } = string.Empty;
        public decimal RenewalTotalAmount { get; set; }
        public decimal RenewalTotalRemainingAmount { get; set; }
        public PaymentDetail RenewalPaymentDetail { get; set; } = default!;
        public IEnumerable<ProductHoldingPaymentSchedule> RenewalProductHoldingPaymSched { get; set; } = default!;
        public string PreviousProductHoldingHeaderId { get; set; } = string.Empty;
        public decimal PreviousTotalRemainingAmount { get; set; }
    }

    public class ProductHoldingLine
    {
        public required string CompanyId { get; set; }
        public string ProductHoldingId { get; set; } = string.Empty;
        public string OrigProductHoldingId { get; set; } = string.Empty;
        public string ProductHoldingVersion { get; set; } = string.Empty;
        public string ProductId { get; set; } = string.Empty;
        public string RenewalProductId { get; set; } = string.Empty;
        public string ProductName { get; set; } = string.Empty;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public DateTime? CancelDate { get; set; }
        public decimal Amount { get; set; }
        public VehicleDetail VehicleDetail { get; set; } = default!;
        public IEnumerable<ProductChange> ProductChanges { get; set; } = default!;
        public IEnumerable<ProductChange> RenewalProductChanges { get; set; } = default!;
    }

    public class ProductHoldingPaymentSchedule
    {
        public string CompanyId { get; set; } = string.Empty;
        public double LineNum { get; set; }
        public DateTime DueDate { get; set; }
        public decimal Amount { get; set; }
        public decimal RemainingAmount { get; set; }
        public string Posted { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
    }

    public class VehicleDetail
    {
        public string Make { get; set; } = string.Empty;
        public string Model { get; set; } = string.Empty;
        public string Variant { get; set; } = string.Empty;
        public string RegistrationNumber { get; set; } = string.Empty;
        public string BodyType { get; set; } = string.Empty;
        public string Color { get; set; } = string.Empty;
        public string Year { get; set; } = string.Empty;
        public string Nvic { get; set; } = string.Empty;
        public string Vin { get; set; } = string.Empty;
    }

    public enum ProductHoldingStatus
    {
        Active,
        Inactive,
        Unknown
    }

    public enum ProductHoldingStatusReason
    {
        Active,
        Paid,
        Unpaid,
        UnpaidRenewal,
        LapsedRenewal,
        New,
        Due,
        Lapsed,
        Expired,
        Renewal,
        Resigned,
        Cancelled,
        CancelledRenewal,
        ExpiredRenewal,
        ExpiredUnpaid,
        Inactive,
        Unknown,

    }

    public class ProductChange
    {
        public string ProductId { get; set; } = string.Empty;
        public string Action { get; set; } = string.Empty;
        public bool CanChangeProductHolding { get; set; }
        public string Reason { get; set; } = string.Empty;
    }

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
}
