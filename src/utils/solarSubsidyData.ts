
// Central Government Subsidy (MNRE Scheme)
export const centralSubsidyRates = {
  upTo3kW: 14588, // ₹14,588 per kW for systems up to 3kW
  above3kW: 7294  // ₹7,294 per kW for systems above 3kW (for additional capacity)
};

// State-wise subsidy information (as percentage of system cost)
export const stateSubsidies = {
  'Andhra Pradesh': { rate: 0.30, maxAmount: 20000, description: '30% up to ₹20,000' },
  'Assam': { rate: 0.30, maxAmount: 30000, description: '30% up to ₹30,000' },
  'Bihar': { rate: 0.50, maxAmount: 75000, description: '50% up to ₹75,000' },
  'Chhattisgarh': { rate: 0.20, maxAmount: 20000, description: '20% up to ₹20,000' },
  'Delhi': { rate: 0.20, maxAmount: 30000, description: '₹2,000 per kW up to ₹30,000' },
  'Gujarat': { rate: 0.50, maxAmount: 20000, description: '₹10,000 per kW up to 2kW' },
  'Haryana': { rate: 0.40, maxAmount: 40000, description: '40% up to ₹40,000' },
  'Himachal Pradesh': { rate: 0.30, maxAmount: 10000, description: '30% up to ₹10,000' },
  'Jharkhand': { rate: 0.50, maxAmount: 75000, description: '50% up to ₹75,000' },
  'Karnataka': { rate: 0.20, maxAmount: 20000, description: '20% up to ₹20,000' },
  'Kerala': { rate: 0.30, maxAmount: 15000, description: '30% up to ₹15,000' },
  'Madhya Pradesh': { rate: 0.30, maxAmount: 30000, description: '30% up to ₹30,000' },
  'Maharashtra': { rate: 0.25, maxAmount: 25000, description: '₹10,000 per kW up to 2.5kW' },
  'Odisha': { rate: 0.30, maxAmount: 30000, description: '30% up to ₹30,000' },
  'Punjab': { rate: 0.30, maxAmount: 30000, description: '30% up to ₹30,000' },
  'Rajasthan': { rate: 0.30, maxAmount: 30000, description: '30% up to ₹30,000' },
  'Tamil Nadu': { rate: 0.25, maxAmount: 20000, description: '25% up to ₹20,000' },
  'Telangana': { rate: 0.20, maxAmount: 20000, description: '20% up to ₹20,000' },
  'Uttar Pradesh': { rate: 0.15, maxAmount: 30000, description: '₹15,000 per kW up to 2kW' },
  'Uttarakhand': { rate: 0.40, maxAmount: 40000, description: '40% up to ₹40,000' },
  'West Bengal': { rate: 0.30, maxAmount: 30000, description: '30% up to ₹30,000' },
  'Other': { rate: 0.00, maxAmount: 0, description: 'No additional state subsidy' }
};

export const solarIrradiance: Record<string, number> = {
  'Andhra Pradesh': 5.7,
  'Assam': 4.5,
  'Bihar': 5.0,
  'Chhattisgarh': 5.5,
  'Delhi': 5.2,
  'Gujarat': 6.0,
  'Haryana': 5.4,
  'Himachal Pradesh': 4.8,
  'Jharkhand': 5.2,
  'Karnataka': 5.8,
  'Kerala': 5.0,
  'Madhya Pradesh': 5.6,
  'Maharashtra': 5.5,
  'Odisha': 5.3,
  'Punjab': 5.1,
  'Rajasthan': 6.5,
  'Tamil Nadu': 5.5,
  'Telangana': 5.6,
  'Uttar Pradesh': 5.0,
  'Uttarakhand': 5.3,
  'West Bengal': 4.8,
  'Other': 5.2
};

// Average electricity tariff per unit (₹/kWh) by state
export const stateTariffs: Record<string, number> = {
  'Andhra Pradesh': 5.5,
  'Assam': 5.8,
  'Bihar': 5.0,
  'Chhattisgarh': 4.5,
  'Delhi': 5.0,
  'Gujarat': 4.5,
  'Haryana': 6.0,
  'Himachal Pradesh': 4.0,
  'Jharkhand': 5.5,
  'Karnataka': 6.5,
  'Kerala': 5.5,
  'Madhya Pradesh': 6.0,
  'Maharashtra': 8.0,
  'Odisha': 5.0,
  'Punjab': 5.5,
  'Rajasthan': 7.0,
  'Tamil Nadu': 4.5,
  'Telangana': 6.0,
  'Uttar Pradesh': 5.5,
  'Uttarakhand': 4.5,
  'West Bengal': 6.5,
  'Other': 5.5
};

// Rooftop type cost multiplier (accounts for different mounting structures)
export const rooftopCostMultiplier: Record<string, number> = {
  'concrete': 1.0,
  'metal': 1.05,
  'tile': 1.15,
  'asbestos': 1.10,
};

// Sq ft needed per panel by rooftop type (mounting differences)
export const panelAreaByRoofType: Record<string, number> = {
  'concrete': 18,   // flat surface, optimal tilt mounting
  'metal': 20,      // slightly more spacing needed
  'tile': 22,       // rail-based mounting requires more room
  'asbestos': 22,   // similar to tile, extra clearance
};
