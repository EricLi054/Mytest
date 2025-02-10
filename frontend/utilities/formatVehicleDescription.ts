import { type VehicleDetail } from '@/types/backendTypes/vehicleDetail'

export const formatVehicleDescription = (vehicleDetail: VehicleDetail) => {
  const { make, model, year, registrationNumber } = vehicleDetail

  return `${year} ${make} ${model} ${registrationNumber}`
}
