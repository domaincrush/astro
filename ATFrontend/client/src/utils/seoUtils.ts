/**
 * Utility functions for SEO-friendly URLs and meta data
 */

/**
 * Converts astrologer name to SEO-friendly URL slug
 * Example: "Pandit Gopal Iyer" -> "pandit-gopal-iyer"
 */
export function createAstrologerSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generates astrologer URL from name
 */
export function getAstrologerUrl(name: string): string {
  return `/astrologer/${createAstrologerSlug(name)}`;
}

/**
 * Generates SEO-optimized page title for astrologer
 */
export function getAstrologerPageTitle(name: string, specializations: string[]): string {
  const specialization = specializations[0] || 'Vedic Astrology';
  return `${name} - ${specialization} Expert | AstroTick Consultation`;
}

/**
 * Generates SEO-optimized meta description for astrologer
 */
export function getAstrologerMetaDescription(
  name: string, 
  experience: number, 
  rating: number,
  specializations: string[]
): string {
  const spec = specializations.slice(0, 2).join(', ');
  return `Consult ${name}, expert in ${spec} with ${experience}+ years experience. ${rating}★ rated astrologer. Book chat consultation now on AstroTick.`;
}

/**
 * Extract astrologer name from URL slug
 */
export function parseAstrologerSlug(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}