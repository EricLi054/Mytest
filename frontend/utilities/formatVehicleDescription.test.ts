import { formatVehicleDescription } from '@/utilities/formatVehicleDescription'

describe('formatVehicleDescription', () => {
  test('should format the vehicle description correctly', () => {
    const vehicleDetail = {
      make: 'Toyota',
      model: 'Camry',
      year: '2022',
      registrationNumber: 'ABC123'
    }

    expect(formatVehicleDescription(vehicleDetail)).toBe('2022 Toyota Camry ABC123')
  })
})
