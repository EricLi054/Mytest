namespace Person.GraphQL.Types.ADB2CGraph;

public class ADB2CGetUserRequest
{
    public string Email { get; set; } = string.Empty;
}

public class UpdateUserCrmIdRequest
{
    public string CrmId { get; set; } = string.Empty;
}

public class UpdateUserEmailRequest
{
    public string Email { get; set; } = string.Empty;
}

public class PatchAdb2cAccountResponse
{
    public bool IsSuccessful { get; set; }
}

public class ADB2CUserAccount
{
    public Guid Id { get; set; }
    public bool AccountEnabled { get; set; }
    public string DisplayName { get; set; } = default!;
    public Guid? CrmId { get; set; }
    public string? Email { get; set; }
}