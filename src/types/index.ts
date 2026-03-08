export interface User {
  id: string;
  email: string;
  role: 'customer' | 'vendor';
  name: string;
  phone?: string;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string | null;
  phone_number: string | null;
  pincode: string | null;
  user_type: 'customer' | 'vendor' | null;
  electricity_bill: number | null;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  customer_id: string;
  title: string;
  location: string;
  system_size: number; // in kW
  budget: number; // in INR
  description: string;
  state: string;
  subsidy_applied: boolean;
  created_at: string;
  status: 'open' | 'closed' | 'awarded';
  accepted_bid_id?: string | null;
}

export interface Bid {
  id: string;
  project_id: string;
  vendor_id: string;
  price_per_watt: number; // in INR
  equipment_tier: 'tier1' | 'tier2' | 'tier3';
  timeline_days: number;
  amc_included: boolean;
  created_at: string;
  score?: number;
  vendor_name?: string;
  vendor_rating?: number;
  profiles?: any;
  project?: Project;
}

export interface Vendor {
  id: string;
  user_id: string;
  company_name: string;
  gstin: string;
  certifications: string[];
  rating: number;
  udyam_registered: boolean;
  verified: boolean;
}

export interface CustomerReview {
  id: string;
  vendor_id: string;
  customer_id: string;
  project_id: string;
  rating: number;
  comment: string;
  created_at: string;
}

export type StateSubsidy = {
  state: string;
  subsidy_percentage: number;
};

export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal'
];

export const STATE_SUBSIDIES: Record<string, number> = {
  'Karnataka': 40,
  'Gujarat': 30,
  'Maharashtra': 35,
  'Tamil Nadu': 25,
  'Rajasthan': 45
};

export interface SolarCalculationResult {
  systemSize: number;
  estimatedCost: number;
  centralSubsidy: number;
  stateSubsidy: number;
  totalSubsidy: number;
  finalCost: number;
  monthlySavings: number;
  paybackPeriod: number;
  rooftopArea: number;
  systemType: string;
  panels: number;
  annualGeneration: number;
  lifetimeSavings25yr: number;
  co2OffsetPerYear: number;
  capacityUtilization: number;
}
