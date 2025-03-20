using System.Text.Json.Serialization;

namespace Membership.Types.FinOps;

public class ProductHolding
{
    public string ProductHoldingHeaderId { get; set; } = string.Empty;
    public string CustAccount { get; set; } = string.Empty;
    public string CompanyId { get; set; } = string.Empty;
    public string Upn { get; set; } = string.Empty;
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    [JsonConverter(typeof(JsonStringEnumConverter))]
    public ProductHoldingStatus Status { get; set; }

    [JsonConverter(typeof(JsonStringEnumConverter))]
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