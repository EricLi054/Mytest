// testing the address input utilities

import { parseAddressResponse, validateAddress } from './AddressInput'

describe('Address Input', () => {
  it('parseAddress correctly', async() => {
    const mockInput = {
      addressList: {
        data: [
          {
            id: 1,
            attributes: {
              partialAddress: '832 Wellington Street, WEST PERTH  WA  6005'
            }
          },
          {
            id: 2,
            attributes: {
              partialAddress: 'Level 1, 832 Wellington Street, WEST PERTH  WA  6005'
            }
          }
        ]
      }
    }

    const expectedOutput = {
      options: [
        {
          value: 1,
          label: '832 Wellington Street, WEST PERTH  WA  6005'
        },
        {
          value: 2,
          label: 'Level 1, 832 Wellington Street, WEST PERTH  WA  6005'
        }
      ],
      error: false
    }

    expect(parseAddressResponse(mockInput)).toEqual(expectedOutput)
  })
})

const backendValidationResponse = {
  validatePAF: {
    data: {
      id: '39798359',
      attributes: {
        buildingName: '',
        subBuildingNumber: '',
        unit: '',
        allotmentNumber: '',
        buildingNumber: '832',
        streetName: 'Wellington',
        streetType: 'St',
        postalDeliveryNumber: '',
        locality: 'WEST PERTH',
        stateCode: 'WA',
        postcode: '6005',
        country: 'AUSTRALIA'
      }
    }
  }
}
jest.mock('../../../../graphql/getData', () => jest.fn(() => backendValidationResponse))

describe('Address Input', () => {
  it('validateAddress correctly', async() => {
    const mockInput = {
      value: 1,
      label: '832 Wellington Street, WEST PERTH  WA  6005'
    }

    const expectedOutput = {
      value: 1,
      label: '832 Wellington Street, WEST PERTH  WA  6005',
      dpid: '39798359',
      buildingName: '',
      subBuildingNumber: '',
      unitNumber: '',
      lotNumber: '',
      houseNumber: '832',
      streetName: 'Wellington St',
      poBox: '',
      suburb: 'WEST PERTH',
      state: 'WA',
      postcode: '6005',
      country: 'AUSTRALIA'
    }

    await validateAddress(mockInput)
    expect(mockInput).toEqual(expectedOutput)
  })
})
