using System.Text.RegularExpressions;
using DigitalPlatform.API.Extensions;
using DigitalPlatform.API.Models.SourceSystem.PersonV2;

namespace DigitalPlatform.API.Models.Data.Person;

public class Person
{
    public Person() { }
    public Person(PersonV2Response personV2Response)
    {
        PersonId = personV2Response.PersonId;
        RacId = personV2Response.RacId;
        MembershipCardNumber = personV2Response.MembershipCardNumber;
        Tier = personV2Response.Tier;
        MembershipType = personV2Response.MembershipType;
        Title = personV2Response.Title ?? String.Empty;
        FirstName = personV2Response.FirstName;
        MiddleName = personV2Response.MiddleName ?? String.Empty;
        Surname = personV2Response.Surname;
        Initials = personV2Response.Initials;
        DateOfBirth = personV2Response.DateOfBirth;
        PersonSystemIds = personV2Response.PersonSystemIds?.ConvertAll(x => new PersonSystemId
        {
            System = x.System,
            SystemId = x.SystemId,
            IsSynchronised = x.IsSynchronised
        });
        HomePhone = personV2Response.HomePhone ?? String.Empty;
        WorkPhone = personV2Response.WorkPhone ?? String.Empty;
        MobilePhone = personV2Response.MobilePhone ?? String.Empty;
        PersonalEmailAddress = personV2Response.PersonalEmailAddress ?? String.Empty;
        WorkEmailAddress = personV2Response.WorkEmailAddress ?? String.Empty;
        PostalAddress = personV2Response.PostalAddress != null ? new(personV2Response.PostalAddress) : new();
    }
    public Guid PersonId { get; set; }
    public string RacId { get; set; } = string.Empty;
    public string? MembershipCardNumber { get; set; }
    public string Tier { get; set; } = string.Empty;
    public string CardColour => Tier switch
    {
        "Red Card" => "Red",
        "Blue" => "Blue",
        "Bronze" => "Bronze",
        "Silver" => "Silver",
        "Gold" => "Gold",
        "St Ives" => "Gold",
        "St Ives Staff" => "Gold",
        "Staff" => "Gold",
        "Little Legends" => "Little Legends",
        "Road Ready" => "Road Ready",
        "Free2Go" => "Free2Go",
        "Life" => "Gold Life",
        "New Life" => "Gold Life",
        "Gold Life" => "Gold Life",
        "RAC Ignite" => "RAC Ignite",
        _ => "None"
    };
    public string MembershipType { get; set; } = string.Empty;
    // Always default to true and only unmask when the OTP session is verified
    private bool _isMasked = true;
    public bool IsMasked
    {
        get
        {
            return _isMasked;
        }
        set
        {
            if (PostalAddress != null)
            {
                PostalAddress.IsMasked = value;
            }
            _isMasked = value;
        }
    }
    private string _title = string.Empty;
    public string Title
    {
        get
        {
            return _title;
        }
        set
        {
            if (string.IsNullOrEmpty(value))
            {
                _title = string.Empty;
            }
            else if (value.Equals("Doctor"))
            {
                _title = "Dr";
            }
            else
            {
                _title = value;
            }
        }
    }
    public string FirstName { get; set; } = string.Empty;
    public string MiddleName { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string Initials { get; set; } = string.Empty;
    public string DateOfBirth { get; set; } = string.Empty;
    public List<PersonSystemId>? PersonSystemIds { get; set; }
    private string _homePhone = string.Empty;
    public string HomePhone
    {
        get
        {
            if (string.IsNullOrEmpty(_homePhone))
            {
                return string.Empty;
            }

            if (IsMasked)
            {
                if (_homePhone.Length <= 8)
                {
                    var maskedHomePhone = new string('*', 5) + _homePhone[^3..];
                    return maskedHomePhone.PadLandlineNumber();
                }

                var maskedHomePhoneWithAreaCode = _homePhone[0..2] + new string('*', _homePhone.Length - 5) + _homePhone[^3..];
                return maskedHomePhoneWithAreaCode.PadLandlineNumber();
            }

            return _homePhone.PadLandlineNumber();
        }
        set
        {
            if (string.IsNullOrEmpty(value))
            {
                _homePhone = string.Empty;
            }
            else
            {
                _homePhone = value;
            }
        }
    }
    private string _workPhone = string.Empty;
    public string WorkPhone
    {
        get
        {
            if (string.IsNullOrEmpty(_workPhone))
            {
                return string.Empty;
            }
            if (IsMasked)
            {
                if (_workPhone.Length <= 8)
                {
                    var maskedWorkPhone = new string('*', 5) + _workPhone[^3..];
                    return maskedWorkPhone.PadLandlineNumber();
                }
                var maskedWorkPhoneWithAreaCode = _workPhone[0..2] + new string('*', _workPhone.Length - 5) + _workPhone[^3..];
                return maskedWorkPhoneWithAreaCode.PadLandlineNumber();
            }

            return _workPhone.PadLandlineNumber();
        }
        set
        {
            if (string.IsNullOrEmpty(value))
            {
                _workPhone = string.Empty;
            }
            else
            {
                _workPhone = value;
            }
        }
    }
    private string _mobilePhone = string.Empty;
    public string MobilePhone
    {
        get
        {
            if (string.IsNullOrEmpty(_mobilePhone))
            {
                return string.Empty;
            }
            if (IsMasked)
            {
                if (_mobilePhone.Length <= 8) { return new string('*', 5) + _mobilePhone[^3..]; }

                var maskedMobile = _mobilePhone[0..2] + new string('*', _mobilePhone.Length - 5) + _mobilePhone[^3..];
                return maskedMobile.PadMobileNumber();
            }

            return _mobilePhone.PadMobileNumber();
        }
        set
        {
            if (string.IsNullOrEmpty(value))
            {
                _mobilePhone = string.Empty;
            }
            else
            {
                _mobilePhone = value;
            }
        }
    }
    private string _personalEmailAddress = string.Empty;
    public string PersonalEmailAddress
    {
        get
        {
            if (!string.IsNullOrEmpty(_personalEmailAddress) && IsMasked)
            {
                int index = _personalEmailAddress.IndexOf("@");
                if (index == -1)
                {
                    return _personalEmailAddress;
                }
                else if (index == 2)
                {
                    return new string('*', 2) + _personalEmailAddress[index..];
                }
                else
                {
                    return _personalEmailAddress[0] + new string('*', index - 2) + _personalEmailAddress[(index - 1)..];
                }
            }
            return _personalEmailAddress;
        }
        set
        {
            if (string.IsNullOrEmpty(value))
            {
                _personalEmailAddress = string.Empty;
            }
            else
            {
                _personalEmailAddress = value;
            }
        }
    }
    private string _workEmailAddress = string.Empty;
    public string WorkEmailAddress
    {
        get
        {
            if (!string.IsNullOrEmpty(_workEmailAddress) && IsMasked)
            {
                int index = _workEmailAddress.IndexOf("@");
                if (index == -1)
                {
                    return _workEmailAddress;
                }
                else if (index == 2)
                {
                    return new string('*', 2) + _workEmailAddress[index..];
                }
                else
                {
                    return _workEmailAddress[0] + new string('*', index - 2) + _workEmailAddress[(index - 1)..];
                }
            }
            return _workEmailAddress;
        }
        set
        {
            if (string.IsNullOrEmpty(value))
            {
                _workEmailAddress = string.Empty;
            }
            else
            {
                _workEmailAddress = value;
            }
        }
    }
    private PersonAddress _postalAddress = new();
    public PersonAddress PostalAddress
    {
        get
        {
            return _postalAddress;
        }
        set
        {
            if (value != null)
            {
                _postalAddress = value;
                _postalAddress.IsMasked = IsMasked;
            }
        }
    }
}

public class PersonSystemId
{
    public string System { get; set; } = string.Empty;
    public string SystemId { get; set; } = string.Empty;
    public bool IsSynchronised { get; set; }
}

public class PersonAddress
{
    public PersonAddress() { }
    public PersonAddress(PersonV2Address address)
    {
        BuildingName = address.BuildingName ?? String.Empty;
        SubBuildingNumber = address.SubBuildingNumber ?? String.Empty;
        UnitNumber = address.UnitNumber ?? String.Empty;
        LotNumber = address.LotNumber ?? String.Empty;
        HouseNumber = address.HouseNumber;
        StreetName = address.StreetName;
        POBox = address.POBox ?? String.Empty;
        Suburb = address.Suburb;
        State = address.State;
        Postcode = address.Postcode;
        Country = address.Country;
        Dpid = address.Dpid ?? String.Empty;
        QasValidated = address.QasValidated;
    }
    public string BuildingName { get; set; } = string.Empty;
    public string SubBuildingNumber { get; set; } = string.Empty;
    public string UnitNumber { get; set; } = string.Empty;
    public string LotNumber { get; set; } = string.Empty;
    public string HouseNumber { get; set; } = string.Empty;
    public string StreetName { get; set; } = string.Empty;
    public string POBox { get; set; } = string.Empty;
    public string Suburb { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Postcode { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string Dpid { get; set; } = string.Empty;
    public bool QasValidated { get; set; }
    public bool IsMasked { get; set; } = true;
    public string FormattedAddress
    {
        get
        {
            // This code is copied from PersonV2 as the format of formatted address is not consistent in Member Central which makes masking difficult
            var components1 = new List<string>();
            var components2 = new List<string>();
            var components3 = new List<string>();

            if (!IsMasked)
            {
                if (!string.IsNullOrEmpty(BuildingName))
                {
                    components1.Add(BuildingName);
                }

                if (!string.IsNullOrEmpty(SubBuildingNumber)) { components1.Add(SubBuildingNumber); }
                if (!string.IsNullOrEmpty(UnitNumber)) { components2.Add(UnitNumber + "/"); }
                if (!string.IsNullOrEmpty(LotNumber)) { components2.Add(LotNumber + " "); }
                if (!string.IsNullOrEmpty(HouseNumber)) { components2.Add(HouseNumber + " "); }
                if (!string.IsNullOrEmpty(POBox))
                {
                    components2.Add(POBox + " ");
                }
                else if (!string.IsNullOrEmpty(StreetName))
                {
                    components2.Add(StreetName + " ");
                }


            }
            else
            {
                if (!string.IsNullOrEmpty(BuildingName))
                {
                    components1.Add(new string('*', BuildingName.Length));
                }

                if (!string.IsNullOrEmpty(SubBuildingNumber)) { components1.Add(new string('*', SubBuildingNumber.Length)); }

                if (!string.IsNullOrEmpty(UnitNumber)) { components2.Add(new string('*', UnitNumber.Length) + "*"); }
                if (!string.IsNullOrEmpty(LotNumber)) { components2.Add(new string('*', LotNumber.Length) + " "); }
                if (!string.IsNullOrEmpty(HouseNumber)) { components2.Add(new string('*', HouseNumber.Length) + " "); }
                if (!string.IsNullOrEmpty(POBox))
                {
                    components2.Add(new string('*', POBox.Length) + " ");
                }
                else if (!string.IsNullOrEmpty(StreetName))
                {
                    components2.Add(new string('*', StreetName.Length) + " ");
                }
            }

            if (!string.IsNullOrEmpty(Suburb)) { components2.Add(Suburb); }
            if (!string.IsNullOrEmpty(State)) { components3.Add(State); }
            if (!string.IsNullOrEmpty(Postcode)) { components3.Add(Postcode); }

            return components1.Count > 0 ? $"{string.Join(" ", components1)}, {string.Join("", components2)}, {string.Join(" ", components3)}" : $"{string.Join("", components2)}, {string.Join(" ", components3)}";
        }
    }
}