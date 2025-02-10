using System.Diagnostics.CodeAnalysis;
using DigitalPlatform.API.Models.Data.Person;
using DigitalPlatform.API.Models.SourceSystem.PersonV2;

namespace DigitalPlatform.API.Tests.Data;
[ExcludeFromCodeCoverage]
public static class PersonTestData
{
    public static Guid PersonId => Guid.Parse("2F5EBBE6-F29B-4A9E-A314-0B6DD5B23FDB");

    public static PersonV2Response EmptyPerson => new();

    public static Person ValidPerson => new()
    {
        FirstName = "John",
        Surname = "Doe"
    };

    public static PersonV2Response ValidPersonResponse => new()
    {
        FirstName = "John",
        Surname = "Doe"
    };

    public static Person ValidPersonForQuotes => new()
    {
        FirstName = "Quotes",
        Surname = "Johnson"
    };

    public static PersonV2Response ValidPersonWithNullPersonSystemIds => new()
    {
        FirstName = "John",
        Surname = "Wick",
        PersonSystemIds = null!
    };

    public static PersonV2Response ValidPersonWithEmptyPersonSystemIds => new()
    {
        FirstName = "John",
        Surname = "Wick",
        PersonSystemIds = []
    };

    public static PersonV2Response ValidPersonWithEmptyWorkEmailAddress => new()
    {
        FirstName = "John",
        Surname = "Wick",
        WorkEmailAddress = ""
    };

    public static PersonV2Response InvalidPerson => new()
    {
        FirstName = "",
        Surname = "Doe"
    };

    public static PersonUpdateMutation MutationUpdatePersonEntity => new()
    {
        Title = "Mr",
        FirstName = "John",
        MiddleName = "Jacob",
        Surname = "Jingleheimer",
        MobilePhone = "0400000000",
        HomePhone = "0890000000",
        WorkPhone = "0890000000",
        PersonalEmailAddress = "johnjingleheimer@rac.com.au",
        PostalAddress = new()
        {
            BuildingName = "BuildingName",
            SubBuildingNumber = "SubBuildingNumber",
            UnitNumber = "UnitNumber",
            LotNumber = "LotNumber",
            HouseNumber = "HouseNumber",
            StreetName = "StreetName",
            POBox = "POBox",
            Suburb = "Suburb",
            State = "State",
            Postcode = "Postcode",
            Country = "Country",
            Dpid = "Dpid"
        }
    };

    public static PersonV2Request MutationUpdatePersonEntityRequest => new()
    {
        Title = "Mr",
        FirstName = "John",
        MiddleName = "Jacob",
        Surname = "Jingleheimer",
        MobilePhone = "0400000000",
        HomePhone = "0890000000",
        WorkPhone = "0890000000",
        PersonalEmailAddress = "johnjingleheimer@rac.com.au",
        PostalAddress = new()
        {
            BuildingName = "BuildingName",
            SubBuildingNumber = "SubBuildingNumber",
            UnitNumber = "UnitNumber",
            LotNumber = "LotNumber",
            HouseNumber = "HouseNumber",
            StreetName = "StreetName",
            POBox = "POBox",
            Suburb = "Suburb",
            State = "State",
            Postcode = "Postcode",
            Country = "Country",
            Dpid = "Dpid"
        }
    };

    public static PersonV2Response PersonToUpdateEntity => new()
    {
        Title = "Mr",
        FirstName = "Johns",
        MiddleName = "Jacob",
        Surname = "Jingleheimers",
        MobilePhone = "0400000000",
        HomePhone = "0890000000",
        WorkPhone = "0890000000",
        PersonalEmailAddress = "johnjingleheimer@rac.com.au",
        DateOfBirth = "1990-01-01",
        PostalAddress = new()
        {
            BuildingName = "BuildingName",
            SubBuildingNumber = "SubBuildingNumber",
            UnitNumber = "UnitNumber",
            LotNumber = "LotNumber",
            HouseNumber = "HouseNumber",
            StreetName = "StreetName",
            POBox = "POBox",
            Suburb = "Suburb",
            State = "State",
            Postcode = "Postcode",
            Country = "Country",
            Dpid = "Dpid"
        }
    };

    public static Person EditedPersonEntity => new()
    {
        Title = "Mr",
        FirstName = "John",
        MiddleName = "Jacob",
        Surname = "Jingleheimer",
        MobilePhone = "0400000000",
        HomePhone = "0890000000",
        WorkPhone = "0890000000",
        PersonalEmailAddress = "johnjingleheimer@rac.com.au",
        DateOfBirth = "1990-01-01",
        PostalAddress = new()
        {
            BuildingName = "BuildingName",
            SubBuildingNumber = "SubBuildingNumber",
            UnitNumber = "UnitNumber",
            LotNumber = "LotNumber",
            HouseNumber = "HouseNumber",
            StreetName = "StreetName",
            POBox = "POBox",
            Suburb = "Suburb",
            State = "State",
            Postcode = "Postcode",
            Country = "Country",
            Dpid = "Dpid"
        }
    };

    public static PersonV2Response EditedPersonEntityResponse => new()
    {
        Title = "Mr",
        FirstName = "John",
        MiddleName = "Jacob",
        Surname = "Jingleheimer",
        MobilePhone = "0400000000",
        HomePhone = "0890000000",
        WorkPhone = "0890000000",
        PersonalEmailAddress = "johnjingleheimer@rac.com.au",
        DateOfBirth = "1990-01-01",
        PostalAddress = new()
        {
            BuildingName = "BuildingName",
            SubBuildingNumber = "SubBuildingNumber",
            UnitNumber = "UnitNumber",
            LotNumber = "LotNumber",
            HouseNumber = "HouseNumber",
            StreetName = "StreetName",
            POBox = "POBox",
            Suburb = "Suburb",
            State = "State",
            Postcode = "Postcode",
            Country = "Country",
            Dpid = "Dpid"
        }
    };

    public static PersonV2Response FullPersonEntityResponse => new()
    {
        PersonId = PersonId,
        RacId = "DefaultRacId",
        PreferredShieldContactId = "DefaultPreferredShieldContactId",
        MembershipCardNumber = "DefaultMembershipCardNumber",
        Barcode = "DefaultBarcode",
        Tier = "DefaultTier",
        Tenure = 1,
        MembershipType = "DefaultMembershipType",
        Title = "Doctor",
        FirstName = "John",
        MiddleName = "Jacob",
        Surname = "Jingleheimer",
        Initials = "DefaultInitials",
        DateOfBirth = "DefaultDateOfBirth",
        Gender = "DefaultGender",
        MobilePhone = "1234567890",
        HomePhone = "0987654321",
        WorkPhone = "1357924680",
        PersonalEmailAddress = "johnjingleheimer@rac.com.au",
        WorkEmailAddress = "DefaultWorkEmailAddress",
        PostalAddress = new()
        {
            BuildingName = "",
            SubBuildingNumber = "",
            UnitNumber = "",
            LotNumber = "",
            HouseNumber = "",
            StreetName = "",
            POBox = "PO Box 10",
            Suburb = "PERTH",
            State = "WA",
            Postcode = "6000",
            Country = "Australia",
            Dpid = "123456",
            QasValidated = true,
            FormattedAddress = "PO Box 10 PERTH, WA 6000"
        },
        OkToMarket = true,
        SuspendMail = false,
        HearingImpaired = false,
        InterpreterRequired = "DefaultInterpreterRequired",
        PassPhrase = "DefaultPassPhrase",
        Horizons = "DefaultHorizons",
        SuspendHorizons = false,
        DiscountOutcome = "DefaultDiscountOutcome",
        AmsToProcess = false,
        Deceased = false,
        PreferredName = "DefaultPreferredName",
        NextTenureUpdate = "DefaultNextTenureUpdate",
        MemberJoinDate = "DefaultMemberJoinDate",
        AnniversaryDate = "DefaultAnniversaryDate",
        EligibleToVote = true,
        PersonSystemIds = new()
            {
                new()
                {
                    System = "DefaultSystem",
                    SystemId = "123",
                    IsSynchronised = true
                }
            },
        IsMember = true
    };

    public static Person FullPersonEntity => new()
    {
        PersonId = PersonId,
        RacId = "DefaultRacId",
        MembershipCardNumber = "DefaultMembershipCardNumber",
        Tier = "DefaultTier",
        MembershipType = "DefaultMembershipType",
        Title = "Doctor",
        FirstName = "John",
        MiddleName = "Jacob",
        Surname = "Jingleheimer",
        Initials = "DefaultInitials",
        DateOfBirth = "DefaultDateOfBirth",
        MobilePhone = "1234567890",
        HomePhone = "0987654321",
        WorkPhone = "1357924680",
        PersonalEmailAddress = "johnjingleheimer@rac.com.au",
        WorkEmailAddress = "DefaultWorkEmailAddress",
        PostalAddress = new()
        {
            BuildingName = "",
            SubBuildingNumber = "",
            UnitNumber = "",
            LotNumber = "",
            HouseNumber = "",
            StreetName = "",
            POBox = "PO Box 10",
            Suburb = "PERTH",
            State = "WA",
            Postcode = "6000",
            Country = "Australia",
            Dpid = "123456",
            QasValidated = true
        },
        PersonSystemIds = new()
            {
                new()
                {
                    System = "DefaultSystem",
                    SystemId = "123",
                    IsSynchronised = true
                }
            },
    };
}