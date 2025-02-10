namespace DigitalPlatform.API.Models.SourceSystem.PersonV2;

public class PersonV2Response
{
    public Guid PersonId { get; set; }
    public string RacId { get; set; } = string.Empty;
    public string PreferredShieldContactId { get; set; } = string.Empty;
    public string CardIssueNumber { get; set; } = string.Empty;
    public string? MembershipCardNumber { get; set; }
    public string Barcode { get; set; } = string.Empty;
    public string Tier { get; set; } = string.Empty;
    public int? Tenure { get; set; }
    public string MembershipType { get; set; } = string.Empty;
    public string? Title { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string? MiddleName { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string Initials { get; set; } = string.Empty;
    public string DateOfBirth { get; set; } = string.Empty;
    public string Gender { get; set; } = string.Empty;
    public string? MobilePhone { get; set; } = string.Empty;
    public string? HomePhone { get; set; } = string.Empty;
    public string? WorkPhone { get; set; } = string.Empty;
    public string? PersonalEmailAddress { get; set; } = string.Empty;
    public string? WorkEmailAddress { get; set; } = string.Empty;
    public PersonV2Address? PostalAddress { get; set; }
    public bool? OkToMarket { get; set; }
    public bool? SuspendMail { get; set; }
    public bool? HearingImpaired { get; set; }
    public string InterpreterRequired { get; set; } = string.Empty;
    public string PassPhrase { get; set; } = string.Empty;
    public string Horizons { get; set; } = string.Empty;
    public bool? SuspendHorizons { get; set; }
    public string DiscountOutcome { get; set; } = string.Empty;
    public bool? AmsToProcess { get; set; }
    public bool? Deceased { get; set; }
    public string PreferredName { get; set; } = string.Empty;
    public string NextTenureUpdate { get; set; } = string.Empty;
    public string MemberJoinDate { get; set; } = string.Empty;
    public string AnniversaryDate { get; set; } = string.Empty;
    public bool EligibleToVote { get; set; }
    public List<PersonV2SystemId>? PersonSystemIds { get; set; }
    public bool IsMember { get; set; }
}

public class PersonV2SystemId
{
    public string System { get; set; } = string.Empty;
    public string SystemId { get; set; } = string.Empty;
    public bool IsSynchronised { get; set; }
}

public class PersonV2Address
{
    public string? BuildingName { get; set; } = string.Empty;
    public string? SubBuildingNumber { get; set; } = string.Empty;
    public string? UnitNumber { get; set; } = string.Empty;
    public string? LotNumber { get; set; } = string.Empty;
    public string HouseNumber { get; set; } = string.Empty;
    public string StreetName { get; set; } = string.Empty;
    public string? POBox { get; set; } = string.Empty;
    public string Suburb { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Postcode { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string? Dpid { get; set; } = string.Empty;
    public bool QasValidated { get; set; }
    public string? FormattedAddress { get; set; } = string.Empty;
}