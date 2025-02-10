import { type CtaLink } from './ctaLink'
import { type VehicleDetail } from './vehicleDetail'

interface FinOpsProductHoldingLine {
  productName: string
  cleanedProductName: string
  cleanedProductSubName: string
  productId: string
  productHoldingId: string
  vehicleDetail: VehicleDetail
  startDate: Date
  endDate: Date
  amount: string
}

export interface FinOpsProduct {
  productHoldingLines: FinOpsProductHoldingLine[]
  ctaLinks: CtaLink[]
}
