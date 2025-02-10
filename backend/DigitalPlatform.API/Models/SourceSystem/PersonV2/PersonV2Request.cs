using DigitalPlatform.API.Models.Data.Person;

namespace DigitalPlatform.API.Models.SourceSystem.PersonV2;

public class PersonV2Request
{
    public string? Title { get; set; }
    public string? FirstName { get; set; }
    public string? MiddleName { get; set; }
    public string? Surname { get; set; }
    public string? DateOfBirth { get; set; }
    public string? MobilePhone { get; set; }
    public string? HomePhone { get; set; }
    public string? WorkPhone { get; set; }
    public string? PersonalEmailAddress { get; set; }
    public AddressRequest? PostalAddress { get; set; }
}

public class AddressRequest
{
    public AddressRequest() { }
    public AddressRequest(AddressUpdateMutation? newAddress = null, PersonAddress? existingAddress = null) {
        BuildingName = newAddress?.BuildingName ?? existingAddress?.BuildingName;
        SubBuildingNumber = newAddress?.SubBuildingNumber ?? existingAddress?.SubBuildingNumber;
        UnitNumber = newAddress?.UnitNumber ?? existingAddress?.UnitNumber;
        LotNumber = newAddress?.LotNumber ?? existingAddress?.LotNumber;
        HouseNumber = newAddress?.HouseNumber ?? existingAddress?.HouseNumber;
        StreetName = newAddress?.StreetName ?? existingAddress?.StreetName;
        POBox = newAddress?.POBox ?? existingAddress?.POBox;
        Suburb = newAddress?.Suburb ?? existingAddress?.Suburb;
        State = newAddress?.State ?? existingAddress?.State;
        Postcode = newAddress?.Postcode ?? existingAddress?.Postcode;
        Country = newAddress?.Country ?? existingAddress?.Country;
        Dpid = newAddress?.Dpid ?? existingAddress?.Dpid;
    }
    
    public string? BuildingName { get; set; }
    public string? SubBuildingNumber { get; set; }
    public string? UnitNumber { get; set; }
    public string? LotNumber { get; set; }
    public string? HouseNumber { get; set; }
    public string? StreetName { get; set; }
    public string? POBox { get; set; }
    public string? Suburb { get; set; }
    public string? State { get; set; }
    public string? Postcode { get; set; }
    public string? Country { get; set; }
    public string? Dpid { get; set; }
}