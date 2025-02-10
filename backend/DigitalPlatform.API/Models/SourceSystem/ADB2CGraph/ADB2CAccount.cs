namespace DigitalPlatform.API.Models.SourceSystem.ADB2CGraph;

public class ADB2CRequest
{
    public string Email { get; set; } = string.Empty;
}

public class ADB2CAccount
{
    public Guid Id { get; set; }
    public bool AccountEnabled { get; set; }
    public string DisplayName { get; set; } = default!;
    public Guid? CrmId { get; set; }
}