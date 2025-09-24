/**
 * Domain-Specific Analytics Configuration
 * Each domain uses its own tracking ID for proper analytics separation
 * astrotick.com uses GTM (Google Tag Manager), others use GA (Google Analytics)
 */

interface GAConfig {
  measurementId: string;
  domainName: string;
  description: string;
  type?: 'GA' | 'GTM';
}

export const GA_CONFIG: Record<string, GAConfig> = {
  'astrotick.com': {
    measurementId: 'G-GY45PGDQT9',
    domainName: 'astrotick.com',
    description: 'Premium astrology platform',
    type: 'GA'
  },
  'astrotelugu.com': {
    measurementId: 'G-4WEEFM6FMG',
    domainName: 'astrotelugu.com', 
    description: 'Telugu astrology services'
  },
  'kundali.in': {
    measurementId: 'G-5VR1MQVZT7',
    domainName: 'kundali.in',
    description: 'Hindi kundali services'
  },
  'astroscroll.com': {
    measurementId: 'G-PC57P59368',
    domainName: 'astroscroll.com',
    description: 'Modern astrology tech'
  },
  'indiahoroscope.com': {
    measurementId: 'G-FNHNFC5THW',
    domainName: 'indiahoroscope.com',
    description: 'Pan-Indian horoscope'
  },
  'jaataka.com': {
    measurementId: 'G-6NGR8DYFJG',
    domainName: 'jaataka.com',
    description: 'Classical Sanskrit astrology'
  },
  'astroneram.com': {
    measurementId: 'G-XD2QHSWYST',
    domainName: 'astroneram.com',
    description: 'Tamil timing astrology'
  },
  'astrojothidam.com': {
    measurementId: 'G-6HQT8ZFD0Q',
    domainName: 'astrojothidam.com',
    description: 'Tamil predictions'
  }
};

/**
 * Get GA measurement ID for a specific domain
 */
export function getGAId(domain: string): string {
  // Clean domain (remove www, port, protocol)
  const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split(':')[0].toLowerCase();
  
  // Find matching config
  const config = GA_CONFIG[cleanDomain];
  if (config) {
    return config.measurementId;
  }
  
  // Default to astrotick.com if no match
  return GA_CONFIG['astrotick.com'].measurementId;
}

/**
 * Get GA config for a specific domain
 */
export function getGAConfig(domain: string): GAConfig {
  const cleanDomain = domain.replace(/^(https?:\/\/)?(www\.)?/, '').split(':')[0].toLowerCase();
  return GA_CONFIG[cleanDomain] || GA_CONFIG['astrotick.com'];
}

/**
 * Get all available GA configurations
 */
export function getAllGAConfigs(): Record<string, GAConfig> {
  return GA_CONFIG;
}