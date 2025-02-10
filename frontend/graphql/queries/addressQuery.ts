export const addressQuery = (partialAddress: string) => `
{
    addressList(partialAddress: "${partialAddress}", dataVersion: "PAF") {
        data {
            id
            attributes {
                partialAddress,
                picklist
            }
        }
    }
}`
