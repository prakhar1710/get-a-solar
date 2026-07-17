export type EquipmentTier = 'tier1' | 'tier2' | 'tier3';

export interface EquipmentBrand {
  value: string;
  label: string;
  tier: EquipmentTier;
}

export const OTHER_BRAND_VALUE = 'other';

export const EQUIPMENT_BRANDS: EquipmentBrand[] = [
  // Tier 1 — Premium Market Leaders & Global Heavyweights
  { value: 'tata_power_solar', label: 'Tata Power Solar', tier: 'tier1' },
  { value: 'waaree_energies', label: 'Waaree Energies', tier: 'tier1' },
  { value: 'adani_solar', label: 'Adani Solar', tier: 'tier1' },
  { value: 'qbits_energy', label: 'Qbits Energy (Inverters)', tier: 'tier1' },
  { value: 'sungrow', label: 'Sungrow (Inverters)', tier: 'tier1' },
  // Tier 2 — Established Domestic Brands & Strong Value Contenders
  { value: 'utl_solar', label: 'UTL Solar', tier: 'tier2' },
  { value: 'luminous', label: 'Luminous Power Technologies', tier: 'tier2' },
  { value: 'microtek', label: 'Microtek', tier: 'tier2' },
  { value: 'growatt', label: 'Growatt (Inverters)', tier: 'tier2' },
  // Tier 3 — Specialized Niche & Budget Contenders
  { value: 'enphase', label: 'Enphase Energy (Microinverters)', tier: 'tier3' },
  { value: 'solaredge', label: 'SolarEdge (Inverters with DC Optimizers)', tier: 'tier3' },
  { value: 'servotech', label: 'Servotech Renewable Power System', tier: 'tier3' },
  { value: 'sukam', label: 'Su-Kam Power Systems', tier: 'tier3' },
];

export const TIER_GROUPS: { tier: EquipmentTier; label: string }[] = [
  { tier: 'tier1', label: 'Tier 1 — Premium Market Leaders' },
  { tier: 'tier2', label: 'Tier 2 — Established Domestic Brands' },
  { tier: 'tier3', label: 'Tier 3 — Specialized / Niche' },
];

export const TIER_LABEL: Record<EquipmentTier, string> = {
  tier1: 'Tier 1 (Premium)',
  tier2: 'Tier 2 (Standard)',
  tier3: 'Tier 3 (Budget)',
};

export function getBrandByValue(value?: string | null): EquipmentBrand | undefined {
  if (!value) return undefined;
  return EQUIPMENT_BRANDS.find((b) => b.value === value);
}

export function tierFromBrand(value?: string | null): EquipmentTier {
  return getBrandByValue(value)?.tier ?? 'tier2';
}
