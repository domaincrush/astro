/**
 * Vedic Season (Ritu) mapping based on Sun's longitude
 * Authentic calculations aligned with traditional Vedic astronomy
 */

export interface RituInfo {
  name: string;
  sanskrit: string;
  description: string;
  characteristics: string[];
}

export const RITU_MAPPING: Record<string, RituInfo> = {
  'vasanta': {
    name: 'Vasanta',
    sanskrit: 'वसन्त',
    description: 'Spring Season',
    characteristics: ['Pleasant weather', 'Blooming flowers', 'Mild temperatures']
  },
  'grishma': {
    name: 'Grishma',
    sanskrit: 'ग्रीष्म',
    description: 'Summer Season',
    characteristics: ['Hot weather', 'Dry conditions', 'Peak solar activity']
  },
  'varsha': {
    name: 'Varsha',
    sanskrit: 'वर्षा',
    description: 'Monsoon Season',
    characteristics: ['Heavy rains', 'Humid conditions', 'Lush greenery']
  },
  'sharad': {
    name: 'Sharad',
    sanskrit: 'शरद्',
    description: 'Autumn Season',
    characteristics: ['Clear skies', 'Pleasant temperatures', 'Post-monsoon freshness']
  },
  'hemanta': {
    name: 'Hemanta',
    sanskrit: 'हेमन्त',
    description: 'Pre-winter Season',
    characteristics: ['Cool weather', 'Dewy mornings', 'Harvest time']
  },
  'shishira': {
    name: 'Shishira',
    sanskrit: 'शिशिर',
    description: 'Winter Season',
    characteristics: ['Cold weather', 'Dry conditions', 'Minimal daylight']
  }
};

/**
 * Calculate Ritu based on Sun's longitude
 * Each Ritu spans 60 degrees of solar longitude
 */
export function calculateRitu(sunLongitude: number): RituInfo {
  // Normalize longitude to 0-360 range
  const normalizedLong = ((sunLongitude % 360) + 360) % 360;
  
  if (normalizedLong >= 0 && normalizedLong < 60) {
    return RITU_MAPPING.vasanta;
  } else if (normalizedLong >= 60 && normalizedLong < 120) {
    return RITU_MAPPING.grishma;
  } else if (normalizedLong >= 120 && normalizedLong < 180) {
    return RITU_MAPPING.varsha;
  } else if (normalizedLong >= 180 && normalizedLong < 240) {
    return RITU_MAPPING.sharad;
  } else if (normalizedLong >= 240 && normalizedLong < 300) {
    return RITU_MAPPING.hemanta;
  } else {
    return RITU_MAPPING.shishira;
  }
}

/**
 * Calculate Ayana (Sun's directional movement)
 */
export function calculateAyana(sunLongitude: number): string {
  const normalizedLong = ((sunLongitude % 360) + 360) % 360;
  
  // Uttarayana: Sun moving north (Winter Solstice to Summer Solstice)
  // Dakshinayana: Sun moving south (Summer Solstice to Winter Solstice)
  if (normalizedLong >= 270 || normalizedLong < 90) {
    return 'Uttarayana';
  } else {
    return 'Dakshinayana';
  }
}

/**
 * Get month names for Lunar Calendar
 */
export const LUNAR_MONTHS = [
  'Chaitra', 'Vaishakha', 'Jyeshta', 'Ashadha',
  'Shravana', 'Bhadrapada', 'Ashwina', 'Kartika',
  'Margashirsha', 'Pausha', 'Magha', 'Phalguna'
];

/**
 * Calculate lunar month based on Sun's position and lunar cycle
 * Amanta system: Month ends with Amavasya
 */
export function calculateLunarMonth(sunLongitude: number, moonLongitude: number): string {
  // Calculate which zodiac sign the Sun is in
  const sunRashi = Math.floor(sunLongitude / 30);
  
  // Lunar month typically aligns with Sun's zodiac position
  // Adjusting for traditional lunar month calculation
  const monthIndex = (sunRashi + 11) % 12; // Offset for traditional naming
  
  return LUNAR_MONTHS[monthIndex];
}