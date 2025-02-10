export const validateAddressQuery = (moniker: string) => `
{
    validatePAF(moniker: "${moniker}") {
        data {
            id
            attributes {
                buildingName
                subBuildingNumber
                unit
                allotmentNumber
                buildingNumber
                streetName
                streetType
                postalDeliveryNumber
                locality
                stateCode
                postcode
                country
            }
        }
    }
}`
