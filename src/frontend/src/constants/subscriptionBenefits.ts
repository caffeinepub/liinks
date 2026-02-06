/**
 * Single source of truth for subscription benefit copy.
 * Defines Premium benefits and Pro-only implemented benefits.
 */

export interface Benefit {
  text: string;
  implemented: boolean;
}

// Core Premium benefits (available to both Premium and Pro)
export const PREMIUM_BENEFITS: Benefit[] = [
  { text: 'Access to all premium templates', implemented: true },
  { text: 'Copy and customize templates', implemented: true },
  { text: 'Create unlimited bio pages', implemented: true },
  { text: 'Custom social handles', implemented: true },
  { text: 'Custom links', implemented: true },
  { text: 'Share your bio pages', implemented: true },
];

// Pro-only benefits (only implemented features)
export const PRO_ONLY_BENEFITS: Benefit[] = [
  { text: 'Upload your own templates', implemented: true },
];

/**
 * Get all benefits for a specific tier.
 * Premium: returns only Premium benefits
 * Pro: returns Premium benefits + Pro-only benefits
 */
export function getBenefitsForTier(tier: 'premium' | 'pro'): string[] {
  const premiumBenefits = PREMIUM_BENEFITS.map((b) => b.text);
  
  if (tier === 'premium') {
    return premiumBenefits;
  }
  
  // Pro gets everything Premium has, plus Pro-only features
  const proOnlyBenefits = PRO_ONLY_BENEFITS.filter((b) => b.implemented).map((b) => b.text);
  return [...premiumBenefits, ...proOnlyBenefits];
}

/**
 * Get display benefits for Pro tier on pricing page.
 * Shows "Everything in Premium" as first item, then Pro-only benefits.
 */
export function getProDisplayBenefits(): string[] {
  const proOnlyBenefits = PRO_ONLY_BENEFITS.filter((b) => b.implemented).map((b) => b.text);
  return ['Everything in Premium', ...proOnlyBenefits];
}
