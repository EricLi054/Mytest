const ProductStatus = {
  Active: 1,
  Unpaid: 804880000,
  Renewal: 804880001,
  New: 804880004,
  Inactive: 804880006,
  Cancelled: 804880008,
  Expired: 804880009,
  ExpiredUnpaid: 804880010,
  LapsedRenewal: 804880012,
  ExpiredRenewal: 804880013,
  CancelledRenewal: 804880014,
} as const;

const ProductType = {
  // Roadside Products
  Standard: "Standard Roadside Assistance",
  Classic: "Classic Roadside Assistance",
  Ultimate: "Ultimate Roadside Assistance",
  UltimatePlus: "Ultimate Plus Roadside Assistance",
  Wheels2Go: "Wheels2Go Roadside Assistance",
  Free2GoStandard: "Free2Go Standard",
  Free2GoClassic: "Free2Go Classic",
  Free2GoUltimate: "Free2Go Ultimate",
  Free2GoUltimatePlus: "Free2Go Ultimate Plus",
  GoldLifeStandard: "Gold Life Standard Roadside Assistance",
  GoldLifeClassic: "Gold Life Classic Roadside Assistance",
  GoldLifeUltimate: "Gold Life Ultimate Roadside Assistance",
  GoldLifeUltimatePlus: "Gold Life Ultimate Plus Roadside Assistance",
  GoldLifeWheels2Go: "Gold Life Wheels2go",
  StaffUltimate: "Staff Ultimate Roadside Assistance",
  HonoraryLifeStandard: "Honorary Life Standard Roadside Assistance",
  HonoraryLifeClassic: "Honorary Life Classic Roadside Assistance",
  HonoraryStaffUltimate: "Honorary Staff Ultimate Roadside Assistance",
  Councillor: "Councillor",
  CountryContractorUltimate: "Country Contractor Ultimate Roadside Assistance",
  FordNCORewards: "Ford NCO Rewards",
  FordDSRRewardsNCO: "Ford DSR Rewards NCO",
  FordCMOStandard: "Ford CMO Standard",
  MitsubishiCMOStandard: "Mitsubishi CMO Standard",
  MitsubishiDSRStandard: "Mitsubishi DSR Standard",
  SubaruCMOStandard: "Subaru CMO Standard",
  SubaruMultiYearCMOStandard: "Subaru Multi-year CMO Standard",
  StIvesUltimate: "St Ives Ultimate Roadside Assistance",

  // Rewards Products
  RewardsMembership: "Rewards Membership",
  GoldLifeRewards: "Gold Life Rewards",
} as const;

const Company = {
  E098: "b954bf7f-f590-4024-8d31-2d181398f856",
} as const;

export const Dynamics = {
  Company,
  ProductStatus,
  ProductType,
} as const;
