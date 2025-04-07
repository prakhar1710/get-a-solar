
import { Bid, Project, STATE_SUBSIDIES } from '@/types';

// Define weights for different bid attributes
const WEIGHTS = {
  COST: 0.40,        // 40%
  VENDOR_RATING: 0.25,  // 25%
  EQUIPMENT_TIER: 0.20,  // 20%
  TIMELINE: 0.10,     // 10%
  AMC: 0.05,         // 5%
};

// Equipment tier score mapping
const EQUIPMENT_TIER_SCORES = {
  'tier1': 1.0,  // Premium equipment
  'tier2': 0.7,  // Standard equipment
  'tier3': 0.4,  // Budget equipment
};

/**
 * Calculate score for a single bid based on weighted criteria
 */
export const calculateBidScore = (
  bid: Bid, 
  project: Project,
  lowestPrice: number,
  shortestTimeline: number
): number => {
  let score = 0;
  
  // 1. Price score (lower is better)
  let effectivePrice = bid.price_per_watt;
  
  // Apply subsidy if available
  if (project.subsidy_applied && STATE_SUBSIDIES[project.state]) {
    const subsidyPercentage = STATE_SUBSIDIES[project.state];
    effectivePrice = effectivePrice * (1 - subsidyPercentage / 100);
  }
  
  const priceScore = lowestPrice / effectivePrice; // Normalized score (1 is best)
  score += priceScore * WEIGHTS.COST;
  
  // 2. Vendor rating score (higher is better)
  const vendorRating = bid.vendor_rating || 3; // Default to 3 if not available
  const ratingScore = vendorRating / 5; // Normalize to 0-1 scale
  score += ratingScore * WEIGHTS.VENDOR_RATING;
  
  // 3. Equipment tier score
  const tierScore = EQUIPMENT_TIER_SCORES[bid.equipment_tier as keyof typeof EQUIPMENT_TIER_SCORES] || 0.5;
  score += tierScore * WEIGHTS.EQUIPMENT_TIER;
  
  // 4. Timeline score (shorter is better)
  const timelineScore = shortestTimeline / bid.timeline_days;
  score += timelineScore * WEIGHTS.TIMELINE;
  
  // 5. AMC inclusion score
  const amcScore = bid.amc_included ? 1 : 0;
  score += amcScore * WEIGHTS.AMC;
  
  // Return final score (0-100 scale)
  return score * 100;
};

/**
 * Rank a list of bids for a project
 */
export const rankBids = (bids: Bid[], project: Project): Bid[] => {
  if (!bids.length) return [];
  
  // Find minimum values for normalization
  const lowestPrice = Math.min(...bids.map(bid => bid.price_per_watt));
  const shortestTimeline = Math.min(...bids.map(bid => bid.timeline_days));
  
  // Calculate score for each bid and sort by score (descending)
  const scoredBids = bids.map(bid => ({
    ...bid,
    score: calculateBidScore(bid, project, lowestPrice, shortestTimeline)
  }));
  
  return scoredBids.sort((a, b) => (b.score || 0) - (a.score || 0));
};
