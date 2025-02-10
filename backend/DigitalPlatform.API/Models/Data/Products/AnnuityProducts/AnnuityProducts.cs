namespace DigitalPlatform.API.Models.Products.AnnuityProducts;


public class AnnuityProduct 
{
    public virtual string Id { get; set; } = string.Empty;
    public virtual string BusinessType { get; set; } = string.Empty;
    public virtual string Type { get; set; } = string.Empty;
    public virtual string Title { get; set; } = string.Empty;
    public virtual string Subtitle { get; set; } = string.Empty;
    public virtual DateTime? NextPaymentActionDate { get; set; } = DateTime.MaxValue;
    public virtual bool ShowPayNow { get; set; }
}