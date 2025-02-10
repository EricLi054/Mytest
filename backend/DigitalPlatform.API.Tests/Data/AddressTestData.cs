using System.Diagnostics.CodeAnalysis;
using DigitalPlatform.API.Models.SourceSystem.Address;

namespace DigitalPlatform.API.Tests.Data;
[ExcludeFromCodeCoverage]
public static class AddressTestData
{
    public static readonly AddressLookup ValidAddressLookupResponse = new ()
    {
        Meta = new AddressLookupMeta {
            Count = 1
        },
        Data = [
            new AddressLookupData {
                Type = "addresses",
                Id = "AUS|9c41ba1d-b983-413c-8d79-1ce716c9b233|7.730AOAUSHAznBwAAAAAIAgEAAAABl0I70AAgAAAAAAAAAAD..2QAAAAA.....wAAAAAAAAAAAAAAAAAAADgzMiBXZWxsaW4AAAAAAA--$10",
                Attributes = new AddressLookupDataAttributes {
                    PartialAddress = "832 Wellington Street, WEST PERTH  WA  6005",
                    Picklist = "832 Wellington Street, WEST PERTH  WA",
                    Postcode = "6005",
                    State = "WA",
                    Score = "100"
                }
            }
        ]
    };

    public static readonly PAFVerification ValidPAFVerificationResponse = new ()
    {
        Data = new PAFVerificationData {
            Type = "addresses",
            Id = "39798359",
            Attributes = new PAFVerificationAttributes {
                VerifyLevel = "",
                UnitType = "",
                Unit = "",
                BuildingNumber = "832",
                SubBuildingNumber = "",
                BuildingName = "",
                BuildingName2 = "",
                BuildingLevelType = "",
                BuildingLevelNumber = "",
                PostalDeliveryTypes = "",
                PostalDeliveryNumber = "",
                AllotmentLot = "",
                AllotmentNumber = "",
                StreetName = "Wellington",
                StreetType = "St",
                StreetTypeSuffix = "",
                Locality = "WEST PERTH",
                StateName = "Western Australia",
                StateCode = "WA",
                Postcode = "6005",
                Country = "AUSTRALIA",
            }
        }
    };

    public static readonly PAFVerification NotFoundPAFVerificationResponse = new()
    {
        Errors = [
            new PAFVerificationError {
                Status = "404",
                Title = "Address not found"
            }
        ]
    };  
}